from flask import Flask, request, jsonify
from flask_cors import CORS
import serial
import threading
import time
from datetime import datetime, timedelta
import json
import os

app = Flask(__name__)
CORS(app)  # Permite requisições do React

# Configurações do Arduino
ARDUINO_PORT = 'COM3'  # Altere para sua porta
ARDUINO_BAUD = 9600

slots = [None, None, None]
lock = threading.Lock()

SLOTS_FILE = "slots.json"

def salvar_slots():
    with open(SLOTS_FILE, "w") as f:
        json.dump(slots, f)

def carregar_slots():
    global slots
    if os.path.exists(SLOTS_FILE):
        with open(SLOTS_FILE, "r") as f:
            data = json.load(f)
            # Garante que sempre tenha 3 slots
            while len(data) < 3:
                data.append(None)
            slots[:] = data[:3]

try:
    arduino = serial.Serial(ARDUINO_PORT, ARDUINO_BAUD, timeout=1)
except Exception as e:
    arduino = None
    print(f"Erro ao conectar no Arduino: {e}")

def acionar_motor(nome):
    print(f"[MOTOR] Solicitando liberação para '{nome}'...")
    if arduino and arduino.is_open:
        comando = f"liberar:{nome}\n"
        arduino.write(comando.encode())
        print(f"[MOTOR] Comando enviado ao Arduino para liberar '{nome}'.")
    else:
        print("[MOTOR][ERRO] Arduino desconectado!")

slots_foram_limpados = False  # Adiciona a flag global

def monitorar_medicamentos():
    global slots_foram_limpados
    while True:
        if slots_foram_limpados:
            # Pula este ciclo, não faz nada
            slots_foram_limpados = False  # Reseta a flag para o próximo ciclo
            time.sleep(5)
            continue
        agora = datetime.now().strftime("%Y-%m-%d %H:%M")
        with lock:
            for i, slot in enumerate(slots):
                if slot:
                    slot_time = datetime.strptime(slot['horario'], "%Y-%m-%d %H:%M")
                    # Se o horário já passou e é recorrente, reagende SOMENTE SE JÁ FOI NOTIFICADO E REMOVIDO
                    if slot.get('recorrente') and datetime.now() > slot_time:
                        # Só reagenda se o alerta já foi desligado (notificado == False)
                        if not slot.get('notificado'):
                            # Só reagenda se já passou 30 segundos após o horário
                            if (datetime.now() - slot_time).total_seconds() > 15:
                                novo_horario = (slot_time + timedelta(days=1)).strftime("%Y-%m-%d %H:%M")
                                slots[i]['horario'] = novo_horario
                                slots[i]['notificado'] = False
                                salvar_slots()
                        continue  # Não remove slot recorrente!
                    # Notifica se for o horário exato
                    elif slot['horario'] == agora and not slot.get('notificado'):
                        acionar_motor(slot['nome'])
                        slots[i]['notificado'] = True
                        salvar_slots()
                    # Remove slot não recorrente 2 minutos depois
                    elif slot.get('notificado') and not slot.get('recorrente') and slot['horario'] != agora:
                        if (datetime.now() - slot_time).total_seconds() > 120:
                            slots[i] = None
                            salvar_slots()
        time.sleep(5)

@app.route('/medicamentos', methods=['GET'])
def listar_medicamentos():
    with lock:
        return jsonify([
            {
                "nome": slot.get("nome") if slot else None,
                "horario": slot.get("horario") if slot else None,
                "recorrente": slot.get("recorrente", False) if slot else False
            }
            for slot in slots
        ])

@app.route('/medicamentos', methods=['POST'])
def cadastrar_medicamento():
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
            'notificado': False,           # <--- inicializa como False
            'slot': slot_idx + 1           # <--- salva o número do slot
        }
        salvar_slots()
    return jsonify({"mensagem": "Medicamento cadastrado com sucesso!"})

@app.route('/medicamentos/<int:slot_idx>', methods=['DELETE'])
def remover_medicamento(slot_idx):
    if slot_idx not in [1, 2, 3]:
        return jsonify({"erro": "Slot inválido"}), 400
    with lock:
        slots[slot_idx-1] = None
        salvar_slots()
    return jsonify({"mensagem": "Medicamento removido com sucesso!"})

@app.route('/medicamentos', methods=['DELETE'])
def limpar_todos_medicamentos():
    global slots_foram_limpados
    with lock:
        global slots
        slots = [None, None, None]
        salvar_slots()
        slots_foram_limpados = True  # Ativa a flag
    return jsonify({"mensagem": "Todos os medicamentos foram removidos!"})

@app.route('/alerta-medicamento', methods=['POST'])
def alerta_medicamento():
    data = request.json
    print("Recebido em /alerta-medicamento:", data)  # <-- Adicione este log
    nome = data.get('nome')
    slot = data.get('slot')
    horario = data.get('horario')
    if not nome or not slot or not horario:
        print("Dados incompletos recebidos!")  # <-- Log de erro
        return jsonify({"erro": "Dados incompletos"}), 400
    acionar_motor(nome)
    with lock:
        idx = int(slot) - 1
        print(f"Buscando slot {idx} para notificar...")  # <-- Log
        if idx in [0, 1, 2] and slots[idx] and slots[idx]['nome'] == nome and slots[idx]['horario'] == horario:
            slots[idx]['notificado'] = True
            salvar_slots()
            print(f"Slot {idx+1} notificado!")  # <-- Log
        else:
            print(f"Slot não encontrado ou dados divergentes: {slots[idx] if idx in [0,1,2] else 'idx inválido'}")  # <-- Log
    return jsonify({"mensagem": f"Alerta recebido e comando enviado para liberar '{nome}'."})

@app.route('/desligar-alerta', methods=['POST'])
def desligar_alerta():
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
    # Inicia o monitoramento dos medicamentos em thread separada
    threading.Thread(target=monitorar_medicamentos, daemon=True).start()
    app.run(host='0.0.0.0', port=5000)
