# 🧪 Taller - Guardado y Persistencia de Datos con Firebase en Unity y Three.js

## 📅 Fecha  
`2025-07-04` 

---

## 🎯 Objetivo del Taller

Implementar un sistema de persistencia de datos usando Firebase para guardar y recuperar información (como configuraciones, progreso del usuario, puntuaciones, posiciones, etc.) desde Unity y Three.js (React). Este taller te enseñará a integrar una base de datos en la nube con tus experiencias visuales interactivas.

---

## 🧠 Conceptos Aprendidos

- [x] Configuración inicial de un proyecto en Firebase
- [x] Integración de Firebase Realtime Database en Unity y entornos web
- [x] Guardado y recuperación de datos persistentes en tiempo real
- [x] Sincronización de posición de objetos 3D entre sesiones
- [x] Manejo de datos estructurados (JSON) en la nube

---

## 🔧 Herramientas y Entornos

- React + Three.js
- Firebase Realtime Database
- Firebase Console

---

## 📁 Estructura del Proyecto

```
2025-07-04_taller_guardado_persistencia_firebase
├── threejs/
├── resultados/
└── README.md
```

---

## 🧪 Implementación

### 🔹 Etapas realizadas

1. Configuración del proyecto en Firebase: El primer paso para este taller es la creación de un proyecto en Firebase, dentro de este se crea una aplicación web para Threejs.
2. Configuración de la conexión al proyecto en Firebase: Lo siguiente que se hace es crear un archivo de configuración que se conecta a la aplicación a partir de datos cómo apiKey, authDomain, databaseURL, projectID y storageBucket. 
3. Creación de la escena: Se crea una escena simple, en este caso tenemos un cubo que rota sobre su eje mientras se desplaza de un lado al otro de la pantalla.
4. Actualización de datos: Se configura la escena en Threejs para que se pueda guardar la posición del cubo en el plano, de forma que al recargar la escena el cubo aparece en la última posición en la que estaba.

---

## 🔹 Código relevante

```jsx
const firebaseConfig = {
  apiKey: "AIzaSyDE9VJ65f3x6BDX7OoInbSDpvRVb4Zgu3c",
  authDomain: "computacionvisual-taller49.firebaseapp.com",
  databaseURL: "https://computacionvisual-taller49-default-rtdb.firebaseio.com",
  projectId: "computacionvisual-taller49",
  storageBucket: "computacionvisual-taller49.firebasestorage.app",
  messagingSenderId: "261686577954",
  appId: "1:261686577954:web:1f0ab81948616e723a737b"
};
```

```jsx
 useEffect(() => {
    const posRef = dbRef(db, 'objects/cube1/pos');
    get(posRef).then(snapshot => {
      if (snapshot.exists()) {
        const { x, y, z } = snapshot.val();
        meshRef.current.position.set(x, y, z);
      }
      setInitialLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!initialLoaded) return;

    const interval = setInterval(() => {
      const { x, y, z } = meshRef.current.position;
      set(dbRef(db, 'objects/cube1/pos'), { x, y, z });
    }, 3000);

    return () => clearInterval(interval);
  }, [initialLoaded]);
```

---

## 📊 Resultados Visuales

![deteccion](./resultados/persistencia_cubo_threejs.gif)

---

## 🧩 Prompts Usados

```text
"Crea una función que guarde la posición de un cubo en una base de datos de Firebase"
```

---

## 💬 Reflexión Final

Este taller permitió comprender cómo Firebase puede convertirse en una capa de persistencia transversal para diferentes plataformas y tecnologías visuales. Aprendimos a establecer una arquitectura mínima de comunicación cliente-servidor usando Firebase como intermediario, permitiendo almacenar estados espaciales de objetos 3D en la nube y recuperarlos en sesiones posteriores. Esta base es útil para crear experiencias inmersivas, juegos y simulaciones sincronizadas entre usuarios o dispositivos.

---

## ✅ Checklist de Entrega

- [x] Carpeta `YYYY-MM-DD_nombre_taller`
- [x] Código limpio y funcional
- [x] GIF incluido con nombre descriptivo (si el taller lo requiere)
- [x] Visualizaciones o métricas exportadas
- [x] README completo y claro
- [x] Commits descriptivos en inglés

---
