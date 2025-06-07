const ws = new WebSocket("ws://localhost:8765");

const xSlider = document.getElementById("xSlider");
const colorSelect = document.getElementById("colorSelect");

function sendUpdate() {
  const message = {
    x: parseFloat(xSlider.value),
    color: colorSelect.value
  };
  ws.send(JSON.stringify(message));
}

xSlider.addEventListener("input", sendUpdate);
colorSelect.addEventListener("change", sendUpdate);

ws.onopen = () => {
  console.log("Conectado al servidor WebSocket");
};

ws.onerror = (err) => {
  console.error("WebSocket error:", err);
};
