import asyncio
import websockets
import json
import random

connected_clients = set()

async def handler(websocket):
    connected_clients.add(websocket)
    try:
        while True:
            data = {
                "x": random.uniform(-5, 5),
                "y": random.uniform(-5, 5),
                "color": random.choice(["red", "green", "blue"])
            }
            message = json.dumps(data)
            await asyncio.gather(*(client.send(message) for client in connected_clients))
            await asyncio.sleep(0.5)
    except websockets.exceptions.ConnectionClosed:
        print("Cliente desconectado")
    finally:
        connected_clients.remove(websocket)

async def main():
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()

asyncio.run(main())
