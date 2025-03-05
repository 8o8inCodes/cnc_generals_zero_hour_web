import { useEffect, useRef } from 'react'
import './App.css'
import { Scene3D } from './Scene3D'

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<Scene3D | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      sceneRef.current = new Scene3D(containerRef.current)
      sceneRef.current.animate()
    }

    return () => {
      sceneRef.current?.dispose()
    }
  }, [])

  return (
    <>
      <div ref={containerRef}></div>
      <div className="overlay">
        <h1 style={{ color: 'white', margin: '20px' }}>Three.js</h1>
      </div>
    </>
  )
}

export default App
