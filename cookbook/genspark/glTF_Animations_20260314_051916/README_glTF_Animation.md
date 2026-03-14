# glTF Animation with Skeletal and Morph Targets

Complete implementation of glTF 2.0 animation featuring both skeletal animation and morph target animation.

## Files Included

1. **gltf_skeletal_morph_animation.json** - Complete glTF 2.0 file structure
2. **gltf_animation_implementation.py** - Full Python implementation
3. **README_glTF_Animation.md** - This documentation

## Features

### Skeletal Animation
- 4-bone skeleton hierarchy (root → spine → head, left arm)
- Inverse bind matrices for proper skinning
- Linear and cubic spline interpolation
- Quaternion-based rotations with SLERP
- Joint weights per vertex (up to 4 bones per vertex)

### Morph Target Animation
- Facial expression morphing (smile and frown targets)
- Blend shape weight animation
- Per-vertex position and normal deltas
- Multiple morph targets with individual weights

### Animation System
- **Channels**: Connect samplers to node properties
- **Samplers**: Define keyframe data and interpolation
- **Interpolation types**:
  - `STEP`: No interpolation (instant changes)
  - `LINEAR`: Linear interpolation (SLERP for quaternions)
  - `CUBICSPLINE`: Smooth Hermite spline interpolation

## glTF Structure Overview

```
Scene
├── Nodes
│   ├── Character (mesh with skin and morph targets)
│   ├── Skeleton Root
│   ├── Bone_Spine
│   ├── Bone_LeftArm
│   └── Bone_Head
├── Animations
│   ├── SkeletalAnimation_Walk
│   │   ├── Channel: Spine rotation
│   │   ├── Channel: Arm rotation
│   │   └── Channel: Head translation (cubic spline)
│   └── MorphTargetAnimation_FacialExpression
│       └── Channel: Morph target weights
└── Skin
    ├── Joints: [root, spine, arm, head]
    └── Inverse Bind Matrices (4x4 each)
```

## Key Concepts

### 1. Skeletal Animation Transform Pipeline
```
Final Vertex Position = 
  Σ (weight[i] × (GlobalTransform[joint[i]] × InverseBindMatrix[joint[i]] × VertexPosition))
```

### 2. Global Transform Calculation
```python
globalTransform(bone) = globalTransform(parent) × localTransform(bone)
localTransform = animation(bone) × inverseBindMatrix(bone)
```

### 3. Morph Target Blending
```
Final Vertex = Base Vertex + Σ (weight[i] × MorphDelta[i])
```

## Animation Data Structure

### Accessor Types
- **Timestamps**: SCALAR (float) - Animation time in seconds
- **Rotations**: VEC4 (quaternion) - [x, y, z, w] format
- **Translations**: VEC3 (vector) - [x, y, z] position
- **Scales**: VEC3 (vector) - [x, y, z] scale factors
- **Morph Weights**: SCALAR or VEC2/VEC3/VEC4 (float array)

### Interpolation Methods

#### Linear Interpolation
```python
value(t) = lerp(keyframe[i], keyframe[i+1], t)
```

#### Spherical Linear Interpolation (for quaternions)
```python
value(t) = slerp(quat[i], quat[i+1], t)
```

#### Cubic Spline Interpolation
```python
# For each keyframe: [in_tangent, value, out_tangent]
value(t) = h₀(t)·p₀ + h₁(t)·m₀ + h₂(t)·p₁ + h₃(t)·m₁
```

## Running the Example

```bash
python gltf_animation_implementation.py
```

### Expected Output
```
=============================================================
glTF Animation Demo: Skeletal + Morph Targets
=============================================================

1. SKELETAL ANIMATION (Walk Cycle)
-------------------------------------------------------------
Duration: 2.0s
Channels: 2
  t=0.0s: Spine quat=[0.000], Arm quat=[0.000]
  t=0.5s: Spine quat=[0.100], Arm quat=[0.259]
  t=1.0s: Spine quat=[0.000], Arm quat=[0.000]
  t=1.5s: Spine quat=[-0.100], Arm quat=[-0.259]
  t=2.0s: Spine quat=[0.000], Arm quat=[0.000]

2. MORPH TARGET ANIMATION (Facial Expression)
-------------------------------------------------------------
Duration: 3.0s
Morph targets: 2 (Smile, Frown)
  t=0.0s: Smile=0.00, Frown=0.00
  t=0.5s: Smile=0.50, Frown=0.00
  t=1.0s: Smile=1.00, Frown=0.00
  t=1.5s: Smile=0.50, Frown=0.00
  t=2.0s: Smile=0.00, Frown=0.00
  t=2.5s: Smile=0.00, Frown=0.50
  t=3.0s: Smile=0.00, Frown=1.00
```

## Implementation Classes

### Core Classes
1. **Quaternion** - Quaternion math and SLERP interpolation
2. **Transform** - 3D transformation (TRS: Translation, Rotation, Scale)
3. **AnimationSampler** - Keyframe sampling with interpolation
4. **SkeletalAnimation** - Bone animation system
5. **MorphTargetAnimation** - Blend shape animation system
6. **Skin** - Skinning matrices for vertex deformation

## Vertex Shader Example (GLSL)

```glsl
layout(location = 0) in vec3 vPosition;
layout(location = 1) in vec3 vNormal;
layout(location = 2) in ivec4 vJoints;
layout(location = 3) in vec4 vWeights;

uniform mat4x3 uBoneMatrices[64];
uniform float uMorphWeights[8];

// Morph target attributes
layout(location = 4) in vec3 vMorphTarget0;
layout(location = 5) in vec3 vMorphTarget1;

void main() {
    // Apply morph targets
    vec3 morphedPosition = vPosition;
    morphedPosition += uMorphWeights[0] * vMorphTarget0;
    morphedPosition += uMorphWeights[1] * vMorphTarget1;
    
    // Apply skeletal animation
    vec3 skinnedPosition = vec3(0.0);
    for (int i = 0; i < 4; i++) {
        mat4x3 boneMatrix = uBoneMatrices[vJoints[i]];
        skinnedPosition += vWeights[i] * (boneMatrix * vec4(morphedPosition, 1.0));
    }
    
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(skinnedPosition, 1.0);
}
```

## Resources

- [glTF 2.0 Specification](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)
- [glTF Animation Tutorial](https://github.khronos.org/glTF-Tutorials/gltfTutorial/gltfTutorial_007_Animations.html)
- [Skeletal Animation in glTF](https://lisyarus.github.io/blog/posts/gltf-animation.html)

## License

This example code is provided for educational purposes under CC0 1.0 Universal (Public Domain).
