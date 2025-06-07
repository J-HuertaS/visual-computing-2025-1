import asyncio
import websockets
import json
import random

async def handler(websocket):
    while True:
        # Generar componentes de color RGB aleatorios (0-255)
        r = random.randint(0, 255)
        g = random.randint(0, 255)
        b = random.randint(0, 255)

        # Formatear los componentes RGB como una cadena hexadecimal (ej. "#RRGGBB")
        # .hexf: convierte un entero a su representación hexadecimal.
        # [2:]: elimina el prefijo "0x".
        # .zfill(2): asegura que cada componente tenga dos dígitos (ej. "f" se convierte en "0f").
        random_color_hex = f"#{r:02x}{g:02x}{b:02x}"

        data = {
            "x": random.uniform(-5, 5),
            "y": random.uniform(-5, 5),
            "color": random_color_hex # Ahora envía el color hexadecimal aleatorio
        }
        await websocket.send(json.dumps(data))
        await asyncio.sleep(0.5)

async def main():
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()

asyncio.run(main())