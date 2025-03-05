import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './App.css'

class Scene3D {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private cube: THREE.Mesh

  constructor(container: HTMLElement) {
    // Scene setup
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer()
    
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(this.renderer.domElement)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    this.scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(10, 10, 10)
    this.scene.add(pointLight)

    // Create cube
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({ color: 'orange' })
    this.cube = new THREE.Mesh(geometry, material)
    this.scene.add(this.cube)

    this.camera.position.z = 5

    // Handle resize
    window.addEventListener('resize', this.handleResize)
  }

  private handleResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  animate = () => {
    requestAnimationFrame(this.animate)
    
    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01
    
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    window.removeEventListener('resize', this.handleResize)
  }
}

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
