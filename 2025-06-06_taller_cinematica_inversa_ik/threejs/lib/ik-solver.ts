import * as THREE from "three"

interface SegmentData {
  position: THREE.Vector3
  rotation: number
  length: number
}

interface IKResult {
  segments: SegmentData[]
  distance: number
  iterations: number
}

export class IKSolver {
  /**
   * Cyclic Coordinate Descent (CCD) IK Solver
   */
  solveCCD(
    segments: SegmentData[],
    basePosition: THREE.Vector3,
    targetPosition: THREE.Vector3,
    tolerance = 0.1,
    maxIterations = 10,
  ): IKResult | null {
    // Validate inputs
    if (!segments || segments.length === 0) {
      return null
    }

    if (!basePosition || !targetPosition) {
      return null
    }

    // Create working copy of segments
    const workingSegments = segments.map((seg) => ({
      position: seg.position.clone(),
      rotation: seg.rotation,
      length: seg.length,
    }))

    let iterations = 0
    let distance = Number.POSITIVE_INFINITY

    for (let iter = 0; iter < maxIterations; iter++) {
      iterations = iter + 1

      // Calculate current end effector position
      const endEffector = this.calculateEndEffector(workingSegments, basePosition)
      distance = endEffector.distanceTo(targetPosition)

      // Check if we're close enough
      if (distance < tolerance) {
        break
      }

      // Work backwards through the chain
      for (let i = workingSegments.length - 1; i >= 0; i--) {
        // Calculate joint position
        const jointPos = this.calculateJointPosition(workingSegments, basePosition, i)

        // Calculate current end effector position
        const currentEnd = this.calculateEndEffector(workingSegments, basePosition)

        // Vectors from joint to current end and target
        const toEnd = currentEnd.clone().sub(jointPos)
        const toTarget = targetPosition.clone().sub(jointPos)

        // Skip if vectors are too small
        if (toEnd.length() < 0.001 || toTarget.length() < 0.001) {
          continue
        }

        // Calculate angle between vectors (in 2D, Z-axis rotation)
        const currentAngle = Math.atan2(toEnd.y, toEnd.x)
        const targetAngle = Math.atan2(toTarget.y, toTarget.x)

        let deltaAngle = targetAngle - currentAngle

        // Normalize angle to [-π, π]
        while (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI
        while (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI

        // Limit rotation speed for stability
        const maxDelta = Math.PI / 6 // 30 degrees max per iteration
        deltaAngle = Math.max(-maxDelta, Math.min(maxDelta, deltaAngle))

        // Apply rotation
        workingSegments[i].rotation += deltaAngle

        // Normalize rotation
        while (workingSegments[i].rotation > Math.PI) workingSegments[i].rotation -= 2 * Math.PI
        while (workingSegments[i].rotation < -Math.PI) workingSegments[i].rotation += 2 * Math.PI
      }
    }

    return {
      segments: workingSegments,
      distance,
      iterations,
    }
  }

  /**
   * Calculate the position of a specific joint in the chain
   */
  private calculateJointPosition(
    segments: SegmentData[],
    basePosition: THREE.Vector3,
    jointIndex: number,
  ): THREE.Vector3 {
    const position = basePosition.clone()
    let currentAngle = 0

    for (let i = 0; i < jointIndex; i++) {
      currentAngle += segments[i].rotation
      position.add(
        new THREE.Vector3(Math.cos(currentAngle) * segments[i].length, Math.sin(currentAngle) * segments[i].length, 0),
      )
    }

    return position
  }

  /**
   * Calculate the end effector position
   */
  private calculateEndEffector(segments: SegmentData[], basePosition: THREE.Vector3): THREE.Vector3 {
    const position = basePosition.clone()
    let currentAngle = 0

    for (const segment of segments) {
      currentAngle += segment.rotation
      position.add(
        new THREE.Vector3(Math.cos(currentAngle) * segment.length, Math.sin(currentAngle) * segment.length, 0),
      )
    }

    return position
  }

  /**
   * Calculate total reach of the arm
   */
  getTotalReach(segments: SegmentData[]): number {
    return segments.reduce((total, segment) => total + segment.length, 0)
  }

  /**
   * Check if target is reachable
   */
  isTargetReachable(segments: SegmentData[], basePosition: THREE.Vector3, targetPosition: THREE.Vector3): boolean {
    const totalReach = this.getTotalReach(segments)
    const distanceToTarget = basePosition.distanceTo(targetPosition)
    return distanceToTarget <= totalReach
  }
}
