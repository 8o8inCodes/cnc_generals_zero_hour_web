import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import './App.css'

function Box() {
  return (
    <mesh rotation={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Box />
      <OrbitControls />
    </>
  )
}

function App() {
  return (
    <>
      <Canvas>
        <Scene />
      </Canvas>
      <div className="overlay">
        <h1 style={{ color: 'white', margin: '20px' }}>Three.js + React</h1>
      </div>
    </>
  )
}

export default App
