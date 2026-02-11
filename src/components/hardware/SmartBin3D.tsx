import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Text, Float, Environment, ContactShadows } from '@react-three/drei';
import { useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

interface ComponentInfo {
  name: string;
  description: string;
}

const COMPONENT_INFO: Record<string, ComponentInfo> = {
  bin: { name: 'Smart Bin Body', description: 'Main enclosure with reinforced walls, weather-resistant coating, and integrated display panel for real-time status.' },
  ultrasonic: { name: 'Ultrasonic Sensor (HC-SR04)', description: 'Measures bin fill level using sound waves. Range: 2cm–400cm, accuracy ±3mm. Triggers alerts at 85% capacity.' },
  camera: { name: 'ESP32-CAM Module', description: 'OV2640 camera captures waste images at 1600x1200. WiFi-enabled for real-time AI classification via cloud API.' },
  servo: { name: 'Servo Motor (SG90)', description: 'Controls sorting flap to direct waste into recyclable or non-recyclable compartments based on AI classification.' },
  loadcell: { name: 'Load Cell (HX711)', description: '4-point weight measurement system. Tracks waste mass for analytics and prevents overloading.' },
  gas: { name: 'Gas Sensor (MQ-135)', description: 'Detects hazardous gases including ammonia, benzene, and CO₂. Alerts when contamination levels are dangerous.' },
  esp32: { name: 'ESP32 Microcontroller', description: 'Dual-core 240MHz processor with WiFi/BLE. Orchestrates all sensors, camera, and servo motor operations.' },
  wifi: { name: 'WiFi Antenna', description: '2.4GHz wireless transmission to cloud backend. Sends classification data and receives servo commands in real-time.' },
};

function HighlightableGroup({ 
  id, children, onSelect, selectedId 
}: { 
  id: string; children: React.ReactNode; onSelect: (id: string | null) => void; selectedId: string | null 
}) {
  const isSelected = selectedId === id;
  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(isSelected ? null : id);
  }, [id, isSelected, onSelect]);

  return (
    <group onClick={handleClick}>
      {children}
    </group>
  );
}

function BinBody() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2.4, 1.5]} />
        <meshPhysicalMaterial color="#0a1e3d" metalness={0.5} roughness={0.35} clearcoat={0.3} clearcoatRoughness={0.2} />
      </mesh>
      {[-0.85, 0.85].map((x, i) => (
        <mesh key={i} position={[x, 1.2, 0]} castShadow>
          <boxGeometry args={[0.08, 2.2, 1.35]} />
          <meshPhysicalMaterial color="#0d2550" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 2.55, 0]} castShadow>
        <boxGeometry args={[2.15, 0.18, 1.65]} />
        <meshPhysicalMaterial color="#061a38" metalness={0.6} roughness={0.25} clearcoat={0.5} />
      </mesh>
      <mesh position={[0, 2.65, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.3]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0, 1.5, 0.76]}>
        <planeGeometry args={[1.5, 1.1]} />
        <meshPhysicalMaterial color="#020a18" metalness={0.1} roughness={0.9} emissive="#0a2040" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 1.5, 0.755]}>
        <planeGeometry args={[1.55, 1.15]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.7} roughness={0.3} />
      </mesh>
      <StatusLED />
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

function ServoMotor() {
  const armRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (armRef.current) {
      armRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.4;
    }
  });

  return (
    <group position={[0, 2.3, -0.3]}>
      {/* Motor body */}
      <mesh>
        <boxGeometry args={[0.35, 0.25, 0.2]} />
        <meshPhysicalMaterial color="#1a2a4a" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Output shaft */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.08, 16]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Sorting arm/flap */}
      <group ref={armRef} position={[0, 0.18, 0]}>
        <mesh position={[0.3, 0, 0]}>
          <boxGeometry args={[0.6, 0.04, 0.8]} />
          <meshPhysicalMaterial color="#16c784" metalness={0.3} roughness={0.5} transparent opacity={0.7} />
        </mesh>
      </group>
      {/* Mounting bracket */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[0.4, 0.04, 0.25]} />
        <meshStandardMaterial color="#3a3a4a" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
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
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 24]} />
        <meshPhysicalMaterial color="#0a0a1a" metalness={0.9} roughness={0.1} clearcoat={1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.01]}>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
        <meshPhysicalMaterial color="#1a2a4a" metalness={0.2} roughness={0.1} clearcoat={1} />
      </mesh>
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
      <mesh receiveShadow>
        <boxGeometry args={[1.9, 0.08, 1.4]} />
        <meshPhysicalMaterial color="#1a3050" metalness={0.6} roughness={0.3} />
      </mesh>
      {([[-0.75, 0, -0.55], [0.75, 0, -0.55], [-0.75, 0, 0.55], [0.75, 0, 0.55]] as [number, number, number][]).map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.07, 0.07, 0.1, 12]} />
          <meshPhysicalMaterial color="#e8a020" metalness={0.7} roughness={0.2} emissive="#e8a020" emissiveIntensity={0.15} />
        </mesh>
      ))}
    </group>
  );
}

function GasSensor() {
  return (
    <group position={[-0.88, 1.8, 0.78]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 24]} />
        <meshPhysicalMaterial color="#cc3333" metalness={0.5} roughness={0.3} clearcoat={0.4} />
      </mesh>
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
      (ledRef1.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 2 + Math.sin(state.clock.elapsedTime * 4) * 1.5;
    }
    if (ledRef2.current) {
      (ledRef2.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 2 + Math.cos(state.clock.elapsedTime * 3) * 1.5;
    }
  });
  return (
    <group position={[0.88, 0.8, 0.78]}>
      <mesh><boxGeometry args={[0.45, 0.65, 0.04]} /><meshPhysicalMaterial color="#005522" metalness={0.3} roughness={0.6} /></mesh>
      {[0.12, 0, -0.12].map((y, i) => (
        <mesh key={i} position={[0, y, 0.022]}><boxGeometry args={[0.35, 0.01, 0.002]} /><meshStandardMaterial color="#c0a040" metalness={0.9} roughness={0.1} /></mesh>
      ))}
      <mesh position={[0, 0.05, 0.025]}><boxGeometry args={[0.18, 0.18, 0.025]} /><meshPhysicalMaterial color="#0a0a1e" metalness={0.7} roughness={0.2} /></mesh>
      <mesh position={[0, 0.38, 0.025]}><boxGeometry args={[0.32, 0.1, 0.012]} /><meshPhysicalMaterial color="#b0b0b0" metalness={0.9} roughness={0.1} /></mesh>
      <mesh ref={ledRef1} position={[-0.12, -0.2, 0.025]}><sphereGeometry args={[0.025, 12, 12]} /><meshStandardMaterial color="#16c784" emissive="#16c784" emissiveIntensity={3} /></mesh>
      <mesh ref={ledRef2} position={[0.12, -0.2, 0.025]}><sphereGeometry args={[0.025, 12, 12]} /><meshStandardMaterial color="#3a8eff" emissive="#3a8eff" emissiveIntensity={3} /></mesh>
    </group>
  );
}

function WifiParticles() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const t = state.clock.elapsedTime + i * 0.5;
        mesh.position.y = 3.2 + Math.sin(t * 1.5) * 0.3;
        mesh.position.x = Math.cos(t * 0.8 + i) * 0.4;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.opacity = 0.3 + Math.sin(t * 2) * 0.2;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, 3.2, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#16c784" emissive="#16c784" emissiveIntensity={2} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function WifiSignal() {
  return (
    <group position={[0, 3.2, 0]}>
      {[0.15, 0.3, 0.45].map((radius, i) => (
        <Float key={i} speed={1.5 + i * 0.5} floatIntensity={0.2} rotationIntensity={0}>
          <mesh>
            <torusGeometry args={[radius, 0.015, 8, 48, Math.PI]} />
            <meshStandardMaterial color="#16c784" emissive="#16c784" emissiveIntensity={1.8 - i * 0.5} transparent opacity={0.9 - i * 0.25} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Scene({ onSelect, selectedId }: { onSelect: (id: string | null) => void; selectedId: string | null }) {
  return (
    <group onClick={(e) => { if (e.object.type === 'Scene') onSelect(null); }}>
      <HighlightableGroup id="bin" onSelect={onSelect} selectedId={selectedId}><BinBody /></HighlightableGroup>
      <HighlightableGroup id="ultrasonic" onSelect={onSelect} selectedId={selectedId}><UltrasonicSensor /></HighlightableGroup>
      <HighlightableGroup id="camera" onSelect={onSelect} selectedId={selectedId}><CameraModule /></HighlightableGroup>
      <HighlightableGroup id="servo" onSelect={onSelect} selectedId={selectedId}><ServoMotor /></HighlightableGroup>
      <HighlightableGroup id="loadcell" onSelect={onSelect} selectedId={selectedId}><LoadCell /></HighlightableGroup>
      <HighlightableGroup id="gas" onSelect={onSelect} selectedId={selectedId}><GasSensor /></HighlightableGroup>
      <HighlightableGroup id="esp32" onSelect={onSelect} selectedId={selectedId}><ESP32Board /></HighlightableGroup>
      <HighlightableGroup id="wifi" onSelect={onSelect} selectedId={selectedId}>
        <WifiSignal />
        <WifiParticles />
      </HighlightableGroup>
    </group>
  );
}

export function SmartBin3D() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedInfo = selectedId ? COMPONENT_INFO[selectedId] : null;

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden" style={{ background: 'linear-gradient(180deg, #020810 0%, #0a1628 50%, #040c18 100%)' }}>
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

        <Scene onSelect={setSelectedId} selectedId={selectedId} />

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

      {/* Click-to-highlight info overlay */}
      {selectedInfo && (
        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-background/80 backdrop-blur-xl border border-primary/30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-semibold text-primary text-sm">{selectedInfo.name}</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{selectedInfo.description}</p>
            </div>
            <button onClick={() => setSelectedId(null)} className="text-muted-foreground hover:text-foreground text-xs shrink-0">✕</button>
          </div>
        </div>
      )}

      <p className="absolute top-3 left-3 text-[10px] text-muted-foreground/50">Click any component for details</p>
    </div>
  );
}
