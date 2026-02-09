import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float, Environment } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function BinBody() {
  return (
    <group position={[0, 0, 0]}>
      {/* Main bin body */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2, 2.4, 1.5]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Bin lid */}
      <mesh position={[0, 2.55, 0]}>
        <boxGeometry args={[2.1, 0.15, 1.6]} />
        <meshStandardMaterial color="#0d2847" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Bin opening slot */}
      <mesh position={[0, 2.63, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.3]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* Front panel (screen area) */}
      <mesh position={[0, 1.5, 0.76]}>
        <planeGeometry args={[1.4, 1.0]} />
        <meshStandardMaterial color="#0a1628" metalness={0.1} roughness={0.8} />
      </mesh>
      {/* Status LED strip */}
      <mesh position={[0, 2.35, 0.76]}>
        <boxGeometry args={[1.6, 0.06, 0.02]} />
        <meshStandardMaterial color="#00C896" emissive="#00C896" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function UltrasonicSensor() {
  return (
    <group position={[0, 2.45, 0]}>
      {/* Sensor housing */}
      <mesh position={[0.6, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
        <meshStandardMaterial color="#4a9eff" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[-0.6, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
        <meshStandardMaterial color="#4a9eff" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

function CameraModule() {
  return (
    <group position={[0, 2.0, 0.77]}>
      {/* Camera lens */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Camera ring */}
      <mesh>
        <torusGeometry args={[0.1, 0.02, 8, 16]} />
        <meshStandardMaterial color="#00C896" emissive="#00C896" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function LoadCell() {
  return (
    <group position={[0, -0.05, 0]}>
      {/* Platform */}
      <mesh>
        <boxGeometry args={[1.8, 0.1, 1.3]} />
        <meshStandardMaterial color="#2a4a6a" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Weight sensors (4 corners) */}
      {[[-0.7, 0, -0.5], [0.7, 0, -0.5], [-0.7, 0, 0.5], [0.7, 0, 0.5]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.06, 0.06, 0.12, 8]} />
          <meshStandardMaterial color="#ff9f43" emissive="#ff9f43" emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function GasSensor() {
  return (
    <group position={[-0.85, 1.8, 0.77]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
        <meshStandardMaterial color="#ff4d4d" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Ventilation holes */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.06, Math.sin(angle) * 0.06, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.02, 8]} />
            <meshStandardMaterial color="#1a1a2e" />
          </mesh>
        );
      })}
    </group>
  );
}

function ESP32Board() {
  return (
    <group position={[0.85, 0.8, 0.77]}>
      {/* PCB */}
      <mesh>
        <boxGeometry args={[0.4, 0.6, 0.04]} />
        <meshStandardMaterial color="#006633" metalness={0.2} roughness={0.7} />
      </mesh>
      {/* Chip */}
      <mesh position={[0, 0.05, 0.025]}>
        <boxGeometry args={[0.15, 0.15, 0.02]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* WiFi antenna */}
      <mesh position={[0, 0.35, 0.025]}>
        <boxGeometry args={[0.3, 0.08, 0.01]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* LED indicators */}
      <mesh position={[-0.1, -0.15, 0.025]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#00C896" emissive="#00C896" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0.1, -0.15, 0.025]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#4a9eff" emissive="#4a9eff" emissiveIntensity={3} />
      </mesh>
    </group>
  );
}

function WifiSignal() {
  return (
    <group position={[0, 3.2, 0]}>
      {[0.15, 0.3, 0.45].map((radius, i) => (
        <Float key={i} speed={2} floatIntensity={0.3} rotationIntensity={0}>
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[radius, 0.012, 8, 32, Math.PI]} />
            <meshStandardMaterial
              color="#00C896"
              emissive="#00C896"
              emissiveIntensity={1.5 - i * 0.4}
              transparent
              opacity={0.8 - i * 0.2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Labels() {
  const labelStyle = { fontSize: 0.12, color: '#a0b4cc' };
  return (
    <group>
      <Text position={[0, 2.85, 0.4]} {...labelStyle}>Ultrasonic Sensor (HC-SR04)</Text>
      <Text position={[0, 2.15, 1.1]} {...labelStyle}>Camera (ESP32-CAM)</Text>
      <Text position={[-1.5, 1.8, 0.5]} {...labelStyle} anchorX="right">Gas Sensor (MQ-135)</Text>
      <Text position={[1.6, 0.8, 0.5]} {...labelStyle} anchorX="left">ESP32 Controller</Text>
      <Text position={[0, -0.35, 0.4]} {...labelStyle}>Load Cell (HX711)</Text>
      <Text position={[0, 3.6, 0]} {...labelStyle} fontSize={0.1} color="#00C896">WiFi Transmission</Text>
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} receiveShadow>
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial color="#0a1628" metalness={0.1} roughness={0.9} />
    </mesh>
  );
}

export function SmartBin3D() {
  return (
    <div className="w-full h-[550px] rounded-xl overflow-hidden bg-[#060e1a]">
      <Canvas
        camera={{ position: [3.5, 3, 4], fov: 45 }}
        shadows
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1} castShadow />
        <pointLight position={[-3, 4, -2]} intensity={0.5} color="#4a9eff" />
        <pointLight position={[2, 1, 3]} intensity={0.3} color="#00C896" />

        <group>
          <BinBody />
          <UltrasonicSensor />
          <CameraModule />
          <LoadCell />
          <GasSensor />
          <ESP32Board />
          <WifiSignal />
          <Labels />
          <Ground />
        </group>

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={1}
          maxPolarAngle={Math.PI / 2}
        />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
