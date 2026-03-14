"""
Complete glTF Animation Implementation
Supports both skeletal animation and morph target animation
"""

import json
import math
from typing import List, Dict, Tuple, Optional
import numpy as np


class Quaternion:
    """Quaternion math for skeletal rotations"""
    
    @staticmethod
    def slerp(q0: List[float], q1: List[float], t: float) -> List[float]:
        """Spherical linear interpolation between two quaternions"""
        q0 = np.array(q0)
        q1 = np.array(q1)
        
        dot_product = np.dot(q0, q1)
        
        # Take shortest path
        if dot_product < 0.0:
            q1 = -q1
            dot_product = -dot_product
        
        # If quaternions are very close, use linear interpolation
        if dot_product > 0.9995:
            result = q0 + t * (q1 - q0)
            return (result / np.linalg.norm(result)).tolist()
        
        # Spherical interpolation
        theta_0 = math.acos(dot_product)
        theta = t * theta_0
        sin_theta = math.sin(theta)
        sin_theta_0 = math.sin(theta_0)
        
        s0 = math.cos(theta) - dot_product * sin_theta / sin_theta_0
        s1 = sin_theta / sin_theta_0
        
        return (s0 * q0 + s1 * q1).tolist()
    
    @staticmethod
    def to_matrix(q: List[float]) -> np.ndarray:
        """Convert quaternion to 3x3 rotation matrix"""
        x, y, z, w = q
        
        return np.array([
            [1 - 2*(y*y + z*z), 2*(x*y - z*w), 2*(x*z + y*w)],
            [2*(x*y + z*w), 1 - 2*(x*x + z*z), 2*(y*z - x*w)],
            [2*(x*z - y*w), 2*(y*z + x*w), 1 - 2*(x*x + y*y)]
        ])


class Transform:
    """3D transformation (translation, rotation, scale)"""
    
    def __init__(self, translation=None, rotation=None, scale=None):
        self.translation = translation or [0, 0, 0]
        self.rotation = rotation or [0, 0, 0, 1]  # Quaternion
        self.scale = scale or [1, 1, 1]
    
    def to_matrix(self) -> np.ndarray:
        """Convert to 4x4 transformation matrix"""
        # Rotation matrix
        R = Quaternion.to_matrix(self.rotation)
        
        # Scale
        S = np.diag(self.scale)
        
        # Combined rotation and scale
        RS = R @ S
        
        # 4x4 matrix
        matrix = np.eye(4)
        matrix[:3, :3] = RS
        matrix[:3, 3] = self.translation
        
        return matrix
    
    @staticmethod
    def multiply(parent: 'Transform', child: 'Transform') -> 'Transform':
        """Combine two transformations"""
        # For simplicity, convert to matrices and multiply
        parent_mat = parent.to_matrix()
        child_mat = child.to_matrix()
        result_mat = parent_mat @ child_mat
        
        # Extract translation
        translation = result_mat[:3, 3].tolist()
        
        # For this example, we'll keep rotation/scale from matrices
        return Transform(translation=translation, rotation=child.rotation, scale=child.scale)


class AnimationSampler:
    """Handles keyframe sampling with different interpolation types"""
    
    def __init__(self, timestamps: List[float], values: List, 
                 interpolation: str = "LINEAR", is_quaternion: bool = False):
        self.timestamps = timestamps
        self.values = values
        self.interpolation = interpolation
        self.is_quaternion = is_quaternion
    
    def sample(self, time: float):
        """Sample animation at specific time"""
        if not self.timestamps:
            return self.values[0] if self.values else None
        
        # Clamp to range
        if time <= self.timestamps[0]:
            return self.values[0]
        if time >= self.timestamps[-1]:
            return self.values[-1]
        
        # Find keyframe interval
        for i in range(1, len(self.timestamps)):
            if time <= self.timestamps[i]:
                t0 = self.timestamps[i - 1]
                t1 = self.timestamps[i]
                v0 = self.values[i - 1]
                v1 = self.values[i]
                
                # Interpolation parameter
                t = (time - t0) / (t1 - t0)
                
                if self.interpolation == "STEP":
                    return v0
                elif self.interpolation == "LINEAR":
                    if self.is_quaternion:
                        return Quaternion.slerp(v0, v1, t)
                    else:
                        return self._lerp(v0, v1, t)
                elif self.interpolation == "CUBICSPLINE":
                    return self._cubic_spline_sample(i - 1, t)
        
        return self.values[-1]
    
    def _lerp(self, v0, v1, t):
        """Linear interpolation"""
        if isinstance(v0, (list, tuple)):
            return [a + t * (b - a) for a, b in zip(v0, v1)]
        return v0 + t * (v1 - v0)
    
    def _cubic_spline_sample(self, index: int, t: float):
        """Cubic spline interpolation
        For cubic spline, values are stored as: [in_tangent, value, out_tangent] per keyframe
        """
        # Get keyframe data
        base_idx = index * 3
        
        # Previous keyframe
        out_tangent_prev = self.values[base_idx + 2]
        
        # Next keyframe
        in_tangent_next = self.values[base_idx + 3]
        value_prev = self.values[base_idx + 1]
        value_next = self.values[base_idx + 4]
        
        # Time delta
        dt = self.timestamps[index + 1] - self.timestamps[index]
        
        # Scale tangents
        m0 = [dt * x for x in out_tangent_prev]
        m1 = [dt * x for x in in_tangent_next]
        
        # Hermite basis functions
        t2 = t * t
        t3 = t2 * t
        
        h00 = 2*t3 - 3*t2 + 1
        h10 = t3 - 2*t2 + t
        h01 = -2*t3 + 3*t2
        h11 = t3 - t2
        
        # Interpolate
        if isinstance(value_prev, (list, tuple)):
            return [h00*p + h10*m0[j] + h01*n + h11*m1[j] 
                   for j, (p, n) in enumerate(zip(value_prev, value_next))]
        else:
            return h00*value_prev + h10*m0 + h01*value_next + h11*m1


class SkeletalAnimation:
    """Skeletal animation system"""
    
    def __init__(self, name: str):
        self.name = name
        self.channels = []  # List of (node_id, path, sampler)
        self.duration = 0.0
    
    def add_channel(self, node_id: int, path: str, sampler: AnimationSampler):
        """Add animation channel"""
        self.channels.append((node_id, path, sampler))
        if sampler.timestamps:
            self.duration = max(self.duration, sampler.timestamps[-1])
    
    def update_nodes(self, nodes: List[Dict], time: float):
        """Update node transformations at given time"""
        time = time % self.duration if self.duration > 0 else 0
        
        for node_id, path, sampler in self.channels:
            value = sampler.sample(time)
            nodes[node_id][path] = value


class MorphTargetAnimation:
    """Morph target (blend shape) animation"""
    
    def __init__(self, name: str):
        self.name = name
        self.weight_samplers = []  # List of (node_id, sampler)
        self.duration = 0.0
    
    def add_weights_channel(self, node_id: int, sampler: AnimationSampler):
        """Add morph target weight animation"""
        self.weight_samplers.append((node_id, sampler))
        if sampler.timestamps:
            self.duration = max(self.duration, sampler.timestamps[-1])
    
    def update_weights(self, nodes: List[Dict], time: float) -> List[float]:
        """Update morph target weights at given time"""
        time = time % self.duration if self.duration > 0 else 0
        
        weights = []
        for node_id, sampler in self.weight_samplers:
            weight_values = sampler.sample(time)
            weights = weight_values if isinstance(weight_values, list) else [weight_values]
            
            # Update node
            if 'weights' not in nodes[node_id]:
                nodes[node_id]['weights'] = []
            nodes[node_id]['weights'] = weights
        
        return weights


class Skin:
    """Skinning information for skeletal animation"""
    
    def __init__(self, joints: List[int], inverse_bind_matrices: List[np.ndarray]):
        self.joints = joints
        self.inverse_bind_matrices = inverse_bind_matrices
    
    def compute_skinning_matrices(self, nodes: List[Dict]) -> List[np.ndarray]:
        """Compute final skinning matrices for each joint"""
        skinning_matrices = []
        
        for joint_id, inv_bind in zip(self.joints, self.inverse_bind_matrices):
            # Get node global transform
            node = nodes[joint_id]
            transform = Transform(
                translation=node.get('translation', [0, 0, 0]),
                rotation=node.get('rotation', [0, 0, 0, 1]),
                scale=node.get('scale', [1, 1, 1])
            )
            
            global_transform = transform.to_matrix()
            
            # Skinning matrix = global_transform * inverse_bind_matrix
            skinning_matrix = global_transform @ inv_bind
            skinning_matrices.append(skinning_matrix)
        
        return skinning_matrices


def demonstrate_complete_animation():
    """Demonstrate skeletal and morph target animation"""
    
    print("=" * 60)
    print("glTF Animation Demo: Skeletal + Morph Targets")
    print("=" * 60)
    
    # Create nodes
    nodes = [
        {"name": "Character", "mesh": 0, "translation": [0, 0, 0], 
         "rotation": [0, 0, 0, 1], "scale": [1, 1, 1], "weights": [0, 0]},
        {"name": "Skeleton_Root", "translation": [0, 0, 0], 
         "rotation": [0, 0, 0, 1], "scale": [1, 1, 1]},
        {"name": "Bone_Spine", "translation": [0, 1, 0], 
         "rotation": [0, 0, 0, 1], "scale": [1, 1, 1]},
        {"name": "Bone_LeftArm", "translation": [-0.5, 1.5, 0], 
         "rotation": [0, 0, 0, 1], "scale": [1, 1, 1]},
        {"name": "Bone_Head", "translation": [0, 2, 0], 
         "rotation": [0, 0, 0, 1], "scale": [1, 1, 1]},
    ]
    
    # === SKELETAL ANIMATION ===
    print("\n1. SKELETAL ANIMATION (Walk Cycle)")
    print("-" * 60)
    
    skeletal_anim = SkeletalAnimation("Walk")
    
    # Spine rotation keyframes
    times = [0.0, 0.5, 1.0, 1.5, 2.0]
    spine_rotations = [
        [0, 0, 0, 1],
        [0, 0.1, 0, 0.995],
        [0, 0, 0, 1],
        [0, -0.1, 0, 0.995],
        [0, 0, 0, 1]
    ]
    
    # Arm rotation keyframes
    arm_rotations = [
        [0, 0, 0, 1],
        [0.259, 0, 0, 0.966],  # 30° forward
        [0, 0, 0, 1],
        [-0.259, 0, 0, 0.966],  # 30° backward
        [0, 0, 0, 1]
    ]
    
    spine_sampler = AnimationSampler(times, spine_rotations, "LINEAR", is_quaternion=True)
    arm_sampler = AnimationSampler(times, arm_rotations, "LINEAR", is_quaternion=True)
    
    skeletal_anim.add_channel(2, "rotation", spine_sampler)
    skeletal_anim.add_channel(3, "rotation", arm_sampler)
    
    print(f"Duration: {skeletal_anim.duration}s")
    print(f"Channels: {len(skeletal_anim.channels)}")
    
    for t in [0.0, 0.5, 1.0, 1.5, 2.0]:
        skeletal_anim.update_nodes(nodes, t)
        spine_rot = nodes[2]['rotation']
        arm_rot = nodes[3]['rotation']
        print(f"  t={t:.1f}s: Spine quat=[{spine_rot[1]:.3f}], Arm quat=[{arm_rot[0]:.3f}]")
    
    # === MORPH TARGET ANIMATION ===
    print("\n2. MORPH TARGET ANIMATION (Facial Expression)")
    print("-" * 60)
    
    morph_anim = MorphTargetAnimation("FacialExpression")
    
    # Weight keyframes for [smile, frown]
    morph_times = [0.0, 1.0, 2.0, 3.0]
    morph_weights = [
        [0.0, 0.0],  # Neutral
        [1.0, 0.0],  # Full smile
        [0.0, 0.0],  # Neutral
        [0.0, 1.0]   # Full frown
    ]
    
    weight_sampler = AnimationSampler(morph_times, morph_weights, "LINEAR")
    morph_anim.add_weights_channel(0, weight_sampler)
    
    print(f"Duration: {morph_anim.duration}s")
    print(f"Morph targets: 2 (Smile, Frown)")
    
    for t in [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0]:
        weights = morph_anim.update_weights(nodes, t)
        print(f"  t={t:.1f}s: Smile={weights[0]:.2f}, Frown={weights[1]:.2f}")
    
    print("\n" + "=" * 60)
    print("Animation demonstration complete!")
    print("=" * 60)


if __name__ == "__main__":
    demonstrate_complete_animation()
