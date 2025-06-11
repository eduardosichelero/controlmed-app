from flask import Flask, request, jsonify
from flask_cors import CORS
import serial
import threading
import time
from datetime import datetime
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
    if arduino and arduino.is_open:
        comando = f"liberar:{nome}\n"
        arduino.write(comando.encode())
        print(f"Comando enviado ao Arduino para liberar '{nome}'.")
    else:
        print("[ERRO] Arduino desconectado!")

def monitorar_medicamentos():
    while True:
        agora = datetime.now().strftime("%Y-%m-%d %H:%M")
        with lock:
            for i, slot in enumerate(slots):
                if slot and slot['horario'] == agora:
                    acionar_motor(slot['nome'])
                    slots[i] = None
                    salvar_slots()
        time.sleep(30)

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
            'recorrente': data.get('recorrente', False)
        }
        salvar_slots()  # Salva após alteração
    return jsonify({"mensagem": "Medicamento cadastrado com sucesso!"})

@app.route('/medicamentos/<int:slot_idx>', methods=['DELETE'])
def remover_medicamento(slot_idx):
    if slot_idx not in [1, 2, 3]:
        return jsonify({"erro": "Slot inválido"}), 400
    with lock:
        slots[slot_idx-1] = None
        salvar_slots()  # Salva após alteração
    return jsonify({"mensagem": "Medicamento removido com sucesso!"})

if __name__ == '__main__':
    carregar_slots()
    threading.Thread(target=monitorar_medicamentos, daemon=True).start()
    app.run(host='0.0.0.0', port=5000)
