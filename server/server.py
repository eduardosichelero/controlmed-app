from flask import Flask, request, jsonify
from flask_cors import CORS
import serial
import threading
import time
from datetime import datetime, timedelta
import json
import os

app = Flask(__name__)
CORS(app)

ARDUINO_PORT = '/dev/ttyACM1'
ARDUINO_BAUD = 9600

slots = [None, None, None]
lock = threading.Lock()

SLOTS_FILE = "slots.json"

def salvar_slots():
    """Salva o estado atual dos slots no arquivo JSON."""
    with open(SLOTS_FILE, "w") as f:
        json.dump(slots, f)

def carregar_slots():
    """Carrega os slots do arquivo JSON, garantindo sempre 3 slots."""
    global slots
    if os.path.exists(SLOTS_FILE):
        with open(SLOTS_FILE, "r") as f:
            data = json.load(f)
            while len(data) < 3:
                data.append(None)
            slots[:] = data[:3]

try:
    arduino = serial.Serial(ARDUINO_PORT, ARDUINO_BAUD, timeout=1)
except Exception as e:
    arduino = None
    print(f"Erro ao conectar no Arduino: {e}")

def acionar_motor(nome):
    """Envia comando para o Arduino liberar o medicamento pelo nome."""
    if arduino and arduino.is_open:
        comando = f"liberar:{nome}\n"
        arduino.write(comando.encode())
        print(f"[MOTOR] Comando enviado ao Arduino para liberar '{nome}'.")
    else:
        print("[MOTOR][ERRO] Arduino desconectado!")

slots_foram_limpados = False

def monitorar_medicamentos():
    """Thread que monitora os horários dos medicamentos e aciona o motor quando necessário."""
    global slots_foram_limpados
    while True:
        agora = datetime.now().strftime("%Y-%m-%d %H:%M")
        with lock:
            for i, slot in enumerate(slots):
                if slot:
                    if slot['horario'] == agora and not slot.get('notificado'):
                        acionar_motor(slot['nome'])
                        if slot.get('recorrente'):
                            dt = datetime.strptime(slot['horario'], "%Y-%m-%d %H:%M")
                            proximo = dt + timedelta(days=1)
                            slots[i]['horario'] = proximo.strftime("%Y-%m-%d %H:%M")
                            slots[i]['notificado'] = False
                        else:
                            slots[i]['notificado'] = True
                        salvar_slots()
        time.sleep(1)

@app.route('/medicamentos', methods=['GET'])
def listar_medicamentos():
    """Retorna a lista de medicamentos cadastrados nos slots."""
    with lock:
        return jsonify([
            {
                "nome": slot.get("nome") if slot else None,
                "horario": slot.get("horario") if slot else None,
                "recorrente": slot.get("recorrente", False) if slot else False,
                "notificado": slot.get("notificado", False) if slot else False,
            }
            for slot in slots
        ])

@app.route('/medicamentos', methods=['POST'])
def cadastrar_medicamento():
    """Cadastra um novo medicamento em um slot específico."""
    data = request.json
    slot_idx = int(data.get('slot')) - 1
    nome = data.get('nome')
    horario = data.get('horario')
    if slot_idx not in [0, 1, 2]:
        return jsonify({"erro": "Slot inválido"}), 400
    with lock:
        slots[slot_idx] = {
            'nome': nome,
            'horario': horario,
            'recorrente': data.get('recorrente', False),
            'notificado': False,
            'slot': slot_idx + 1
        }
        salvar_slots()
    return jsonify({"mensagem": "Medicamento cadastrado com sucesso!"})

@app.route('/medicamentos/<int:slot_idx>', methods=['DELETE'])
def remover_medicamento(slot_idx):
    """Remove o medicamento de um slot específico."""
    if slot_idx not in [1, 2, 3]:
        return jsonify({"erro": "Slot inválido"}), 400
    with lock:
        slots[slot_idx-1] = None
        salvar_slots()
    return jsonify({"mensagem": "Medicamento removido com sucesso!"})

@app.route('/medicamentos', methods=['DELETE'])
def limpar_todos_medicamentos():
    """Remove todos os medicamentos dos slots."""
    global slots_foram_limpados
    with lock:
        global slots
        slots = [None, None, None]
        salvar_slots()
        slots_foram_limpados = True
    return jsonify({"mensagem": "Todos os medicamentos foram removidos!"})

@app.route('/alerta-medicamento', methods=['POST'])
def alerta_medicamento():
    """Recebe alerta para liberar medicamento e marca como notificado."""
    data = request.json
    nome = data.get('nome')
    slot = data.get('slot')
    horario = data.get('horario')
    if not nome or not slot or not horario:
        return jsonify({"erro": "Dados incompletos"}), 400
    acionar_motor(nome)
    with lock:
        idx = int(slot) - 1
        if idx in [0, 1, 2] and slots[idx] and slots[idx]['nome'] == nome and slots[idx]['horario'] == horario:
            slots[idx]['notificado'] = True
            salvar_slots()
    return jsonify({"mensagem": f"Alerta recebido e comando enviado para liberar '{nome}'."})

@app.route('/desligar-alerta', methods=['POST'])
def desligar_alerta():
    """Desativa o alerta de notificação para um determinado horário."""
    data = request.json
    horario = data.get('horario')
    with lock:
        for slot in slots:
            if slot and slot['horario'] == horario:
                slot['notificado'] = False
                salvar_slots()
                break
    return jsonify({"mensagem": "Alerta desligado no backend"})

if __name__ == '__main__':
    carregar_slots()
    threading.Thread(target=monitorar_medicamentos, daemon=True).start()
    app.run(host='0.0.0.0', port=5000)
