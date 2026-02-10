import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Environment, MeshTransmissionMaterial, ContactShadows } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function BinBody() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <group position={[0, 0, 0]}>
      {/* Main bin body - rounded edges */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2.4, 1.5]} />
        <meshPhysicalMaterial 
          color="#0a1e3d" 
          metalness={0.5} 
          roughness={0.35} 
          clearcoat={0.3}
          clearcoatRoughness={0.2}
        />
      </mesh>
      {/* Vertical ridges on sides */}
      {[-0.85, 0.85].map((x, i) => (
        <mesh key={i} position={[x, 1.2, 0]} castShadow>
          <boxGeometry args={[0.08, 2.2, 1.35]} />
          <meshPhysicalMaterial color="#0d2550" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {/* Bin lid with beveled edge */}
      <mesh position={[0, 2.55, 0]} castShadow>
        <boxGeometry args={[2.15, 0.18, 1.65]} />
        <meshPhysicalMaterial 
          color="#061a38" 
          metalness={0.6} 
          roughness={0.25}
          clearcoat={0.5}
        />
      </mesh>
      {/* Bin opening slot */}
      <mesh position={[0, 2.65, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.3]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* Front display panel */}
      <mesh position={[0, 1.5, 0.76]}>
        <planeGeometry args={[1.5, 1.1]} />
        <meshPhysicalMaterial 
          color="#020a18"
          metalness={0.1} 
          roughness={0.9} 
          emissive="#0a2040"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Display border frame */}
      <mesh position={[0, 1.5, 0.755]}>
        <planeGeometry args={[1.55, 1.15]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Status LED strip */}
      <StatusLED />
      {/* Bottom base plate */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[2.2, 0.12, 1.7]} />
        <meshPhysicalMaterial color="#08132a" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

function StatusLED() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const material = ref.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <mesh ref={ref} position={[0, 2.35, 0.76]}>
      <boxGeometry args={[1.6, 0.06, 0.02]} />
      <meshStandardMaterial color="#16c784" emissive="#16c784" emissiveIntensity={2} />
    </mesh>
  );
}

function UltrasonicSensor() {
  return (
    <group position={[0, 2.45, 0]}>
      {[0.6, -0.6].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.14, 0.14, 0.12, 24]} />
            <meshPhysicalMaterial color="#3a8eff" metalness={0.7} roughness={0.2} clearcoat={0.8} />
          </mesh>
          {/* Inner cone */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 0.04, 16]} />
            <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function CameraModule() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ringRef.current) {
      const material = ringRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  return (
    <group position={[0, 2.0, 0.78]}>
      {/* Camera housing */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 24]} />
        <meshPhysicalMaterial color="#0a0a1a" metalness={0.9} roughness={0.1} clearcoat={1} />
      </mesh>
      {/* Lens */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.01]}>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
        <meshPhysicalMaterial color="#1a2a4a" metalness={0.2} roughness={0.1} clearcoat={1} />
      </mesh>
      {/* Status ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.13, 0.015, 12, 32]} />
        <meshStandardMaterial color="#16c784" emissive="#16c784" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function LoadCell() {
  return (
    <group position={[0, -0.15, 0]}>
      {/* Platform */}
      <mesh receiveShadow>
        <boxGeometry args={[1.9, 0.08, 1.4]} />
        <meshPhysicalMaterial color="#1a3050" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Weight sensors (4 corners) */}
      {([[-0.75, 0, -0.55], [0.75, 0, -0.55], [-0.75, 0, 0.55], [0.75, 0, 0.55]] as [number, number, number][]).map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <cylinderGeometry args={[0.07, 0.07, 0.1, 12]} />
            <meshPhysicalMaterial color="#e8a020" metalness={0.7} roughness={0.2} emissive="#e8a020" emissiveIntensity={0.15} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function GasSensor() {
  return (
    <group position={[-0.88, 1.8, 0.78]}>
      {/* Housing */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 24]} />
        <meshPhysicalMaterial color="#cc3333" metalness={0.5} roughness={0.3} clearcoat={0.4} />
      </mesh>
      {/* Mesh screen */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 24]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.3} roughness={0.8} wireframe />
      </mesh>
    </group>
  );
}

function ESP32Board() {
  const ledRef1 = useRef<THREE.Mesh>(null);
  const ledRef2 = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ledRef1.current) {
      const m = ledRef1.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 2 + Math.sin(state.clock.elapsedTime * 4) * 1.5;
    }
    if (ledRef2.current) {
      const m = ledRef2.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 2 + Math.cos(state.clock.elapsedTime * 3) * 1.5;
    }
  });

  return (
    <group position={[0.88, 0.8, 0.78]}>
      {/* PCB Board */}
      <mesh>
        <boxGeometry args={[0.45, 0.65, 0.04]} />
        <meshPhysicalMaterial color="#005522" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Traces */}
      {[0.12, 0, -0.12].map((y, i) => (
        <mesh key={i} position={[0, y, 0.022]}>
          <boxGeometry args={[0.35, 0.01, 0.002]} />
          <meshStandardMaterial color="#c0a040" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      {/* Main chip */}
      <mesh position={[0, 0.05, 0.025]}>
        <boxGeometry args={[0.18, 0.18, 0.025]} />
        <meshPhysicalMaterial color="#0a0a1e" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* WiFi antenna */}
      <mesh position={[0, 0.38, 0.025]}>
        <boxGeometry args={[0.32, 0.1, 0.012]} />
        <meshPhysicalMaterial color="#b0b0b0" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* LED indicators */}
      <mesh ref={ledRef1} position={[-0.12, -0.2, 0.025]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color="#16c784" emissive="#16c784" emissiveIntensity={3} />
      </mesh>
      <mesh ref={ledRef2} position={[0.12, -0.2, 0.025]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color="#3a8eff" emissive="#3a8eff" emissiveIntensity={3} />
      </mesh>
    </group>
  );
}

function WifiSignal() {
  return (
    <group position={[0, 3.2, 0]}>
      {[0.15, 0.3, 0.45].map((radius, i) => (
        <Float key={i} speed={1.5 + i * 0.5} floatIntensity={0.2} rotationIntensity={0}>
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[radius, 0.015, 8, 48, Math.PI]} />
            <meshStandardMaterial
              color="#16c784"
              emissive="#16c784"
              emissiveIntensity={1.8 - i * 0.5}
              transparent
              opacity={0.9 - i * 0.25}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Labels() {
  const labelStyle = { fontSize: 0.11, color: '#7a9cc0', anchorX: 'center' as const };
  return (
    <group>
      <Text position={[0, 2.85, 0.4]} {...labelStyle}>Ultrasonic Sensor (HC-SR04)</Text>
      <Text position={[0, 2.2, 1.15]} {...labelStyle}>Camera Module (ESP32-CAM)</Text>
      <Text position={[-1.6, 1.8, 0.5]} {...labelStyle} anchorX="right">Gas Sensor (MQ-135)</Text>
      <Text position={[1.7, 0.8, 0.5]} {...labelStyle} anchorX="left">ESP32 Controller</Text>
      <Text position={[0, -0.45, 0.4]} {...labelStyle}>Load Cell (HX711)</Text>
      <Text position={[0, 3.65, 0]} fontSize={0.1} color="#16c784">WiFi Transmission</Text>
    </group>
  );
}

export function SmartBin3D() {
  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden" style={{ background: 'linear-gradient(180deg, #020810 0%, #0a1628 50%, #040c18 100%)' }}>
      <Canvas
        camera={{ position: [4, 3.5, 4.5], fov: 40 }}
        shadows
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
        <pointLight position={[-3, 4, -2]} intensity={0.4} color="#3a8eff" />
        <pointLight position={[2, 1, 3]} intensity={0.25} color="#16c784" />
        <spotLight position={[0, 6, 3]} angle={0.3} penumbra={0.5} intensity={0.6} castShadow color="#ffffff" />

        <group>
          <BinBody />
          <UltrasonicSensor />
          <CameraModule />
          <LoadCell />
          <GasSensor />
          <ESP32Board />
          <WifiSignal />
          <Labels />
        </group>

        <ContactShadows position={[0, -0.2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
          enableDamping
          dampingFactor={0.05}
        />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
