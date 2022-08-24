import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import * as dat from 'dat.gui'

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Group
const group = new THREE.Group()

// Colors
const colors = {
  cube: 0xf604ca
}

// Stats
const stats = Stats()
stats.domElement.style.position = 'absolute'
stats.domElement.style.top = '0px'
document.body.appendChild(stats.domElement)

const cubeSegments = 4
const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, cubeSegments, cubeSegments, cubeSegments)
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: colors.cube,
  wireframe: true,
  // wireframeLinejoin: 'biter',
  // wireframeLinecap: 'butt'
})

const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cube)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 25)

const initialCameraPositionZ = 2.75
camera.position.z = initialCameraPositionZ
camera.position.y = 0.5
scene.add(camera)

const maxCameraMovementSpeed = 0.1
const minCameraMovementSpeed = 0.01
const cameraMovementSpeedAcceleration = 0.01
let cameraMovementSpeed = 0

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const controls = new OrbitControls(camera, canvas)
// controls.enabled = false

/**
 * Listeners
 */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}, false)

window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
})

window.addEventListener('keydown', onKeyDown, false)
window.addEventListener('keyup', onKeyUp, false)

const newCubeRotation = { x: cube.rotation.x, y: cube.rotation.y, z: cube.rotation.z }

let keyPressed = false

function onKeyDown(event) {
  keyPressed = true

  if (cameraMovementSpeed + cameraMovementSpeedAcceleration <= maxCameraMovementSpeed) {
    cameraMovementSpeed += cameraMovementSpeedAcceleration
  }

  switch (event.keyCode) {
    case 37:
      if (floorSpeed + floorSpeedAcceleration <= maxFloorSpeed) {
        floorSpeed += floorSpeedAcceleration
      }

      console.log(floorSpeed)

      newCubeRotation.z += Math.PI / 2
      gsap.to(cube.rotation, { duration: 0.5, z: newCubeRotation.z })
      break
    case 38:
      if (floorSpeed + floorSpeedAcceleration <= maxFloorSpeed) {
        floorSpeed += floorSpeedAcceleration
      }

      newCubeRotation.x += Math.PI / 2
      gsap.to(cube.rotation, { duration: 0.5, x: newCubeRotation.x })
      break
    case 39:
      if (floorSpeed + floorSpeedAcceleration <= maxFloorSpeed) {
        floorSpeed += floorSpeedAcceleration
      }

      newCubeRotation.z -= Math.PI / 2
      gsap.to(cube.rotation, { duration: 0.5, z: newCubeRotation.z })
      break
    case 40:
      if (floorSpeed + floorSpeedAcceleration <= maxFloorSpeed) {
        floorSpeed += floorSpeedAcceleration
      }

      newCubeRotation.x -= Math.PI / 2
      gsap.to(cube.rotation, { duration: 0.5, x: newCubeRotation.x })
      break
  }
}

function onKeyUp() {
  keyPressed = false
  cameraMovementSpeed = maxCameraMovementSpeed * 2
}

// Floor
const floorRadius = 128

const floorGeometry = new THREE.CylinderBufferGeometry(floorRadius, floorRadius, 8, 1024, 16, true)
const floorMeterial = new THREE.MeshBasicMaterial({
  color: '#04f6c6',
  wireframe: true
})

const floor = new THREE.Mesh(floorGeometry, floorMeterial)
floor.position.set(0, -floorRadius - 1, 0)
floor.rotation.z = Math.PI / 2
scene.add(floor)

const minFloorSpeed = 0.002
const maxFloorSpeed = 0.02
const floorSpeedAcceleration = 0.0005
let floorSpeed = 0.002

// Tube
const tubeRadius = 4

const tubeGeometry = new THREE.CylinderBufferGeometry(tubeRadius, tubeRadius, 20, 1024, 16)
const tubeMaterial = new THREE.MeshBasicMaterial({
  color: 0x383f6,
  side: THREE.BackSide,
  // wireframe: true,
  transparent: true,
  opacity: 0.2

})

let tube = new THREE.Mesh(tubeGeometry, tubeMaterial)
tube.rotation.x = Math.PI / 2
// scene.add(tube)

// Debug with Data UI
const gui = new dat.GUI()

gui
  .addColor(colors, 'cube')
  .onChange(() => {
    cubeMaterial.color.set(colors.cube)
  })

gui.add(cubeMaterial, 'wireframe')

gui.add(tubeMaterial, 'wireframe')
// gui
//   .add(tubeGeometry.parameters, 'radialSegments', 0, 2048, 1)
//   .onChange(() => {
//     scene.remove(tube)
//     const newTubeGeometry = new THREE.CylinderBufferGeometry(tubeRadius, tubeRadius, 20, 1024, tubeGeometry.parameters.radialSegments)
//     tube = new THREE.Mesh(newTubeGeometry, tubeMaterial)
//     scene.add(tube)
//   })

// gui
//   .add(tubeGeometry.parameters, 'heightSegments', 0, 2048, 1)
//   .onChange(() => {
//     const newTubeGeometry = new THREE.CylinderBufferGeometry(tubeRadius, tubeRadius, 20, 2, tubeGeometry.parameters.heightSegments)
//     tube = new THREE.Mesh(newTubeGeometry, tubeMaterial)
//     scene.add(tube)
//   })

// Intro floor animation
// gsap.fromTo(camera.position, { x: camera.position.x, y: 6, z: 25 }, { x: camera.position.x, y: 0, z: 2.75, duration: 2 })

// Start group animation
group.add(cube)
group.add(floor)
group.add(tube)
scene.add(group)

// Clock
const clock = new THREE.Clock()
let lastTickTime = clock.getElapsedTime()

const tick = () => {
  stats.update()
  const elapsedTime = clock.getElapsedTime()
  const tickTimeDelta = elapsedTime - lastTickTime
  lastTickTime = elapsedTime

  // Cube movement
  cube.position.y = 0.02 * Math.sin(elapsedTime * Math.PI)

  // Group movement
  // gsap.to(group.rotation, { z: Math.sin(elapsedTime) * (Math.PI / 3) })
  // gsap.to(group.rotation, { x: Math.sin(elapsedTime) * (Math.PI / 4) })

  // Floor animation
  gsap.to(floor.rotation, { x: floor.rotation.x + (floorSpeed) })

  // Decrease floor speed
  if (!keyPressed && floorSpeed * (1 - tickTimeDelta) > minFloorSpeed) {
    floorSpeed = floorSpeed * (1 - (tickTimeDelta / 3))
  }

  // Camera animation
  if (
    camera.position.z + (keyPressed ? cameraMovementSpeed : -cameraMovementSpeed) <= 5 &&
    camera.position.y + (keyPressed ? cameraMovementSpeed : -cameraMovementSpeed) >= 0
  ) {
    gsap.to(camera.position, { z: camera.position.z + (keyPressed ? cameraMovementSpeed : -cameraMovementSpeed), y: camera.position.y + (keyPressed ? cameraMovementSpeed : -cameraMovementSpeed) })
    camera.lookAt(cube.position)
  } else {
    cameraMovementSpeed = 0
  }

  // Decrease camera movement speed
  if (!keyPressed && cameraMovementSpeed * (1 - (tickTimeDelta / 4)) > minCameraMovementSpeed) {
    cameraMovementSpeed = cameraMovementSpeed * (1 - (tickTimeDelta / 4))
  }

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
