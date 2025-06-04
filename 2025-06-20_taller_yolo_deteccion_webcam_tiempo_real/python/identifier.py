import cv2
import time
from ultralytics import YOLO
import numpy as np
import os

# Verificar y cargar el modelo localmente (YOLOv8)
model_path = os.path.join(os.getcwd(), "yolov8n.pt")
if not os.path.exists(model_path):
    print(f"Error: El modelo {model_path} no se encuentra. Descarga 'yolov8n.pt' manualmente desde https://github.com/ultralytics/assets/releases y colócalo en este directorio.")
    exit()

model = YOLO(model_path)

# Capturar video desde la webcam
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Error: No se puede acceder a la webcam.")
    exit()

# Clases específicas a detectar
target_classes = ["person","cell phone", "bottle"]

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: No se pudo leer el frame.")
        break

    start_time = time.time()
    results = model.predict(source=frame, stream=True)
    annotated_frame = frame.copy()
    has_detections = False

    for result in results:
        for box in result.boxes:
            cls = int(box.cls[0])
            class_name = model.names[cls]
            confidence = float(box.conf[0])

            if class_name not in target_classes:
                continue

            has_detections = True
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            # Cambiar el color del rectángulo a azul (BGR: 255, 0, 0)
            cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
            label = f"{class_name}: {confidence:.2f}"
            # Cambiar el color del texto a azul (BGR: 255, 0, 0)
            cv2.putText(annotated_frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2, cv2.LINE_AA)

    if not has_detections:
        annotated_frame = frame

    end_time = time.time()
    inference_time = end_time - start_time
    fps = 1 / inference_time if inference_time > 0 else 0
    print(f"Inference Time: {inference_time:.3f} s, FPS: {fps:.2f}")

    fps_text = f"FPS: {fps:.2f}"
    cv2.putText(annotated_frame, fps_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

    cv2.imshow("YOLOv8 Object Detection", annotated_frame)
    # Cerrar con 'q' o clic en el botón de cerrar
    if cv2.waitKey(1) & 0xFF == ord('q') or cv2.getWindowProperty("YOLOv8 Object Detection", cv2.WND_PROP_VISIBLE) < 1:
        break

cap.release()
cv2.destroyAllWindows()
