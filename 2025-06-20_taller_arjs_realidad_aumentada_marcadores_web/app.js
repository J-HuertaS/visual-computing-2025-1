document.addEventListener('DOMContentLoaded', function() {
  const marker = document.querySelector('a-marker');
  const markerSound = document.getElementById('markerSound');

  marker.addEventListener('markerFound', function() {
    console.log('Marcador detectado!');
    if (markerSound) {
      markerSound.play();
    }
  });

  marker.addEventListener('markerLost', function() {
    console.log('Marcador perdido!');
    if (markerSound) {
      markerSound.pause();
      markerSound.currentTime = 0; 
    }
  });
});