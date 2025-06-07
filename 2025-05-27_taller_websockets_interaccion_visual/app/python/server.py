import asyncio
import websockets
import json

# Almacenar clientes conectados
connected_clients = set()

async def handler(websocket):
    # Registrar nuevo cliente
    connected_clients.add(websocket)
    print("Cliente conectado:", websocket.remote_address)
    try:
        async for message in websocket:
            # Cuando se recibe un mensaje, reenviarlo a todos (broadcast)
            for client in connected_clients:
                if client != websocket:  # Opcional: no reenviarse a sí mismo
                    await client.send(message)
    except websockets.exceptions.ConnectionClosed:
        print("Cliente desconectado:", websocket.remote_address)
    finally:
        connected_clients.remove(websocket)

async def main():
    print("Servidor WebSocket iniciado en ws://localhost:8765")
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()

asyncio.run(main())
