# 🧪 Workshop - Inverse Kinematics: Making the Model Chase Targets

## 📅 Date
`2025-06-01` - Date of completion

---

## 🎯 Workshop Objective
To apply inverse kinematics (IK) using the Cyclic Coordinate Descent (CCD) algorithm to enable a 3D articulated arm to dynamically reach a draggable target sphere in a Three.js and React Three Fiber environment. This exercise demonstrates how a chain of joints adjusts automatically to achieve a desired position.

---

## 🧠 Concepts Learned
- [x] Inverse Kinematics (IK) and Forward Kinematics (FK)
- [x] Cyclic Coordinate Descent (CCD) algorithm
- [x] Hierarchical 3D arm structure using `<group>` in Three.js
- [x] Real-time interaction with a draggable target
- [x] Visualization of arm movement, reachability, and metrics
- [x] Robust geometry handling to avoid errors like "Invalid typed array length"

## 📖 Key Concepts

### What is Inverse Kinematics?
Inverse Kinematics (IK) is a technique used to calculate the joint angles required for a chain of segments (e.g., a robotic arm) to reach a specific target position. Unlike Forward Kinematics (FK), where joint angles define the end position, IK works backward from the target to determine the necessary joint configurations.

### Cyclic Coordinate Descent (CCD)
CCD is an iterative IK algorithm that adjusts each joint one at a time, starting from the end effector toward the base. For each joint:
- Compute vectors from the joint to the current end effector and to the target.
- Calculate the angle needed to align the segment toward the target using the dot product.
- Apply a constrained rotation to avoid abrupt movements.
- Repeat until the end effector is close enough to the target or a maximum number of iterations is reached.

### Project Implementation
This project uses the CCD algorithm to control a 4-segment arm in a 3D scene. The arm adjusts its joint angles to reach a red sphere, which can be dragged using the mouse. Visual feedback includes:
- Lines showing the arm structure, base-to-target distance, and end effector-to-target distance.
- A circle indicating the maximum reach.
- Real-time metrics (distance to target, iteration count, reachability status).

---

## 🔧 Tools and Environment
- **Environment**: Next.js with React Three Fiber and Three.js
- **Tools**: `@react-three/fiber`, `@react-three/drei`, `three`, `tailwindcss`
- **Language**: TypeScript/JavaScript

---

## 📁 Project Structure
```
2025-06-06_taller_cinematica_inversa_ik/
├── threejs/
│   ├── components/
│   │   ├── arm-segment.tsx
│   │   ├── draggable-target.tsx
│   │   ├── ik-arm-system.tsx
│   │   ├── ik-workshop.tsx
│   │   ├── theme-provider.tsx
│   ├── lib/
│   │   ├── ik-solver.ts
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── globals.css
├── README.md
```

---

## 🧪 Implementation

### 🔹 Steps Taken
1. **Setup Environment**: Configured a Next.js project with React Three Fiber and Tailwind CSS.
2. **Scene Creation**: Added a ground plane, a cylindrical base, and a 4-segment arm with colored segments and joints.
3. **Arm Hierarchy**: Organized segments in a hierarchical structure using `<group>` elements, where each segment’s position and rotation depend on the previous one.
4. **CCD Solver**: Implemented the CCD algorithm to adjust joint angles iteratively, ensuring the end effector approaches the target.
5. **Draggable Target**: Created a red sphere that can be dragged using raycasting and plane intersection, with camera controls disabled during dragging.
6. **Visualization**:
   - Added `SimpleLine` and `SimpleCircle` components to display connections (base-to-target, arm chain, end effector-to-target) and the maximum reach circle.
   - Displayed metrics (distance, iterations, reachability) using `<Text>` components.
7. **Error Handling**: Replaced problematic `<Line>` components with custom box geometries to avoid "Invalid typed array length" errors.
8. **Interactivity**: Added hover effects, dynamic colors, and a drag indicator for better user experience.

### 🔹 Arm Hierarchy Diagram
```
Base (cylinder)
└── Segment 0 (length: 2.0, color: orange)
    ├── Joint 0 (sphere)
    └── Segment 1 (length: 1.8, color: red)
        ├── Joint 1 (sphere)
        └── Segment 2 (length: 1.5, color: purple)
            ├── Joint 2 (sphere)
            └── Segment 3 (length: 1.2, color: cyan)
                ├── Joint 3 (sphere)
                └── End Effector (sphere, green/red based on reachability)
```
*Note*: The target sphere (red) is independent and draggable in the XY plane.

### 🔹 Key Code
#### CCD Solver (`ik-workshop.tsx`)
```javascript
const solveCCD = useCallback(
  (target: THREE.Vector3, currentAngles: number[]) => {
    const angles = [...currentAngles];
    const tolerance = 0.1;
    const maxIterations = 10;
    let iterations = 0;

    for (let iter = 0; iter < maxIterations; iter++) {
      iterations++;
      const positions = calculateFK(angles);
      const endEffector = positions[positions.length - 1];
      const distance = endEffector.distanceTo(target);

      if (distance < tolerance) {
        setStats({ distance, iterations, reachable: true });
        return angles;
      }

      for (let i = numSegments - 1; i >= 0; i--) {
        const jointPos = positions[i];
        const currentEnd = calculateFK(angles)[numSegments];
        const toEnd = currentEnd.clone().sub(jointPos);
        const toTarget = target.clone().sub(jointPos);

        if (toEnd.length() < 0.001 || toTarget.length() < 0.001) continue;

        const currentAngle = Math.atan2(toEnd.y, toEnd.x);
        const targetAngle = Math.atan2(toTarget.y, toEnd.x);
        let deltaAngle = targetAngle - currentAngle;

        // Normalize angle
        while (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
        while (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

        // Limit rotation speed
        const maxDelta = Math.PI / 8;
        deltaAngle = Math.max(-maxDelta, Math.min(maxDelta, deltaAngle));
        angles[i] += deltaAngle;
      }
    }

    const finalPositions = calculateFK(angles);
    const finalDistance = finalPositions[finalPositions.length - 1].distanceTo(target);
    const totalReach = segmentLengths.reduce((sum, length) => sum + length, 0);
    const reachable = target.distanceTo(basePosition) <= totalReach;

    setStats({ distance: finalDistance, iterations, reachable });
    return angles;
  },
  [calculateFK, numSegments, segmentLengths, basePosition]
);
```

#### Draggable Target (`draggable-target.tsx`)
```javascript
useFrame(() => {
  if (isDragging) {
    raycaster.setFromCamera(pointer, camera);
    const intersection = new Vector3();
    raycaster.ray.intersectPlane(dragPlane, intersection);

    if (intersection) {
      intersection.x = Math.max(-8, Math.min(8, intersection.x));
      intersection.y = Math.max(-2, Math.min(6, intersection.y));
      intersection.z = 0;
      onPositionChange(intersection);
    }
  }
});
```

#### Line Visualization (`ik-workshop.tsx`)
```javascript
function SimpleLine({ start, end, color = "#ffffff", thickness = 0.02, dashed = false, opacity = 1 }) {
  if (
    !start ||
    !end ||
    isNaN(start.x) ||
    isNaN(start.y) ||
    isNaN(start.z) ||
    isNaN(end.x) ||
    isNaN(end.y) ||
    isNaN(end.z)
  ) {
    return null;
  }

  const direction = end.clone().sub(start);
  const length = direction.length();
  if (length < 0.01) return null;

  const midPoint = start.clone().add(direction.clone().multiplyScalar(0.5));
  const angle = Math.atan2(direction.y, direction.x);

  if (dashed) {
    const segments = Math.max(3, Math.floor(length / 0.3));
    const segmentLength = length / segments;
    const gapLength = segmentLength * 0.4;

    return (
      <group>
        {Array.from({ length: Math.floor(segments / 2) }, (_, i) => {
          const segmentStart = start.clone().add(direction.clone().multiplyScalar((i * 2 * segmentLength) / length));
          const segmentEnd = start.clone().add(direction.clone().multiplyScalar(((i * 2 + 1) * segmentLength) / length));
          const segmentMid = segmentStart.clone().add(segmentEnd.clone().sub(segmentStart).multiplyScalar(0.5));

          return (
            <mesh key={i} position={segmentMid.toArray()} rotation={[0, 0, angle]}>
              <boxGeometry args={[segmentLength - gapLength, thickness, thickness]} />
              <meshBasicMaterial color={color} transparent opacity={opacity} />
            </mesh>
          );
        })}
      </group>
    );
  }

  return (
    <mesh position={midPoint.toArray()} rotation={[0, 0, angle]}>
      <boxGeometry args={[length, thickness, thickness]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}
```

---

## 📊 Visual Results

### Successful Reach



https://github.com/user-attachments/assets/4eb9134a-2d3f-4325-a77c-6e9ccd9b497c



- Shows the arm adjusting smoothly to follow the red sphere when the target is within the maximum reach (sum of segment lengths: 6.5 units).

### Failed Reach



https://github.com/user-attachments/assets/977724a9-6faa-499f-b6a8-56258a07ad0a



- Demonstrates the arm stretching fully but unable to reach the target when it’s beyond the maximum reach, with the end effector turning red.

---

## 🧩 Prompts Used
Below are the prompts used during the conversation with v0 to develop the workshop:

```text
The code returns the following error: Invalid typed array length: -2
Revise the code to address the error.
```
- Prompted fixes for the "Invalid typed array length" error by replacing `<Line>` with custom `SimpleLine` and `SimpleCircle` components.

```text
puedes hacer que no pueda mover el espacio 3d es que cuando quiero mover la bolita roja se mueve todo y es dificil interactuar
```
- Requested disabling camera controls during target dragging for smoother interaction.

```text
puedes hacer este paso? Mostrar una línea (<Line>) desde la base hasta el objetivo?
```
- Asked for the addition of visualization lines, leading to the implementation of multiple lines and a reach circle.

---

## 💬 Final Reflection
- **What did I learn or reinforce?**  
  I deepened my understanding of inverse kinematics, particularly the CCD algorithm, and how to implement it in a 3D environment using React Three Fiber. I also learned to handle real-time user interactions and robustly visualize dynamic systems with proper error handling.

- **What was the most complex or interesting part?**  
  The most complex part was addressing the "Invalid typed array length" error caused by the `<Line>` component. Replacing it with custom box geometries (`SimpleLine`, `SimpleCircle`) was both challenging and interesting, as it required careful validation of vectors and lengths to ensure stability. The most interesting aspect was seeing the arm dynamically adjust to the target in real time, with clear visual feedback on reachability.

- **Challenges and Solutions**  
  - **Challenge**: The initial `<Line>` component caused errors with invalid array lengths.  
    **Solution**: Created custom `SimpleLine` and `SimpleCircle` components using `boxGeometry` with robust validation.  
  - **Challenge**: Camera controls interfered with target dragging.  
    **Solution**: Disabled `OrbitControls` during dragging and added visual feedback (e.g., cursor changes, yellow ring).  
  - **Challenge**: Ensuring smooth arm movement without oscillations.  
    **Solution**: Added angle normalization and rotation limits in the CCD solver.

---

## ✅ Delivery Checklist
- [x] Folder `2025-06-06_taller_cinematica_inversa_ik`
- [x] Hierarchical arm structure with 4 segments
- [x] Functional CCD solver
- [x] Real-time draggable target with smooth interaction
- [x] Clear visualization (lines, circle, metrics)
- [x] Modular and documented code
- [x] README with explanation, diagram, code, prompts, and reflection
- [x] Descriptive commits in English (e.g., "Add CCD solver", "Fix line geometry errors")
