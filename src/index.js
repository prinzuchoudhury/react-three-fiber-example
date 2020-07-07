import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { Suspense, useCallback, useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { GlitchPass } from './Glitchpass'
import { DotScreenShader } from 'three/examples/jsm/shaders/DotScreenShader'
import Text from './components/text/text';
import './styles.css'

extend({ EffectComposer, RenderPass, ShaderPass, GlitchPass })


function Swarm({ count, mouse }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -20 + Math.random() * 40
      const yFactor = -20 + Math.random() * 40
      const zFactor = -20 + Math.random() * 40
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])

  useFrame(state => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1)
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.max(1.5, Math.cos(t) * 5)
      const time = state.clock.getElapsedTime()
      mesh.current.rotation.x += 0.00005
      mesh.current.rotation.y += 0.00009
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + (Math.sin(t * 1) * factor) / 100,
        (particle.my / 10) * b + yFactor + (Math.sin(t * 1) * factor) / 100,
        (particle.my / 10) * b + zFactor + (Math.sin(t * 1) * factor) / 100
      )
      dummy.rotation.set(
        xFactor / 10,
        yFactor / 100,
        zFactor + Math.cos((t / 10) * factor) / 900
      )
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })
  

  return (
    <>
      <instancedMesh ref={mesh} args={[null, null, count]} >
        <sphereBufferGeometry attach="geometry" args={[1, 4, 4]} />
        <meshPhongMaterial attach="material" color="#ffffff" flatShading="true" />
      </instancedMesh>
    </>
  )
}

function Effect() {
  const composer = useRef()
  const [down, set] = useState(false)
  const { scene, gl, size, camera } = useThree()
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [size])
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useFrame(() => {
    setInterval(() => set(!down),3000);
    composer.current.render()
  }, 1)
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <shaderPass attachArray="passes" args={[DotScreenShader]} needsSwap={false} renderToScreen />
      <glitchPass attachArray="passes" factor={ down ? 1 : 0 } />
    </effectComposer>
  )
}

function App() {
  const mouse = useRef([0, 0])
   return (
    <div  >
      <Canvas
        style={{ width: '100%', height: '1000px' }}
        gl={{ antialias: false }}
        camera={{ fov: 70, position: [0, 0, 30] }}
        onCreated={({ gl }) => {
          gl.setClearColor('black')
        }}>
        <ambientLight intensity={1.1} color="#222222" />
        <directionalLight color="#ffffff" position={[1, 1, 1]} />
        <Swarm mouse={mouse} count={130} />
        <Effect />
      </Canvas>
      <div className="header-major">
        <span>prinzu</span>
      </div>
      < Text />
      <a href="https://github.com/drcmda/react-three-fiber" className="top-left" children="About Me" />
      <a href="https://twitter.com/0xca0a" className="top-right" children="Contact mer" />
      <a href="https://codesandbox.io/embed/387z7o2zrq" className="bottom-left" children="Projects" />
      
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
