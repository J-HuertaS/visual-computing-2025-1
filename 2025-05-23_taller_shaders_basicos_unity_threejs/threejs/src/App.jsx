import { useEffect } from 'react';

import * as THREE from 'three';

import SceneInit from './lib/SceneInit';

function App() {
  const vertexShader_a = `
    varying vec3 vNormal;

    void main() {
      vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader_a = ` 
    varying vec3 vNormal;
    uniform vec3 lightDir;
    uniform float levels;

    void main() {
      vec3 normLight = normalize(lightDir);
      float diffuse = max(dot(vNormal, normLight), 0.0);
      float quantized = floor(diffuse * (levels - 1.0)) / (levels - 1.0);
      vec3 color = vec3(quantized);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const vertexShader_b = `
  uniform float uRadius;
  varying float vHeight;

  void main() {
    vHeight = (position.y / uRadius) * 0.5 + 0.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader_b = `
  uniform vec3 colorA;
  uniform vec3 colorB;
  uniform float t;
  varying float vHeight;

  void main() {
    float offset = sin(t) * 0.5; 
    float shiftedHeight = clamp(vHeight + offset, 0.0, 1.0);

    vec3 color = mix(colorA, colorB, shiftedHeight);
    gl_FragColor = vec4(color, 1.0);
  }
`;

  const boxMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader_a,
    fragmentShader: fragmentShader_a,
    uniforms: {
      lightDir: { value: new THREE.Vector3(0.5, 1.0, 0.75) },
      levels: { value: 4.0 }
    }
  });

  const sphereMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader_b,
  fragmentShader: fragmentShader_b,
  uniforms: {
    uRadius: { value: 8.0 },
    colorA: { value: new THREE.Color(0xff0000) },
    colorB: { value: new THREE.Color(0x0000ff) },
    t: { value: 0.0 }
  }
});

  useEffect(() => {
  const test = new SceneInit('myThreeJsCanvas');
  test.initialize();

  const axesHelper = new THREE.AxesHelper(16);
  test.scene.add(axesHelper);

  const boxGeometry = new THREE.BoxGeometry(16, 16, 16);
  const sphereGeometry = new THREE.SphereGeometry(8, 32, 32);

  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

  boxMesh.position.x = -12;
  sphereMesh.position.x = 12;

  test.scene.add(boxMesh);
  test.scene.add(sphereMesh);

  // Override animate to inject uniform update
  const animate = () => {
    requestAnimationFrame(animate);
    const elapsed = test.clock.getElapsedTime();

    sphereMaterial.uniforms.t.value = elapsed;

    test.render();
    test.stats.update();
    test.controls.update();
  };

  animate();
}, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
