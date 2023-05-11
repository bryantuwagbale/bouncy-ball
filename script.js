// Import bird and pipe modules
import { updateBird, setupBird, getBirdRect } from "./bird.js"
import {
  updatePipes,
  setupPipes,
  getPassedPipesCount,
  getPipeRects,
} from "./pipe.js"

// Listen for a keypress event, run handleStart function once
document.addEventListener("keypress", handleStart, { once: true })

// Get references to the title and subtitle elements
const title = document.querySelector("[data-title]")
const subtitle = document.querySelector("[data-subtitle]")

// Initialize lastTime variable for delta time calculation
let lastTime

// Function that continuously updates the game
function updateLoop(time) {
  // If this is the first loop, set lastTime and requestAnimationFrame
  if (lastTime == null) {
    lastTime = time
    window.requestAnimationFrame(updateLoop)
    return
  }
  
  // Calculate delta time and update the bird and pipes
  const delta = time - lastTime
  updateBird(delta)
  updatePipes(delta)

  // Check for a collision and handle a loss if necessary
  if (checkLose()) return handleLose()

  // Update lastTime and requestAnimationFrame
  lastTime = time
  window.requestAnimationFrame(updateLoop)
}

// Function that checks for a collision between the bird and pipes or world boundaries
function checkLose() {
  const birdRect = getBirdRect()
  const insidePipe = getPipeRects().some(rect => isCollision(birdRect, rect))
  const outsideWorld = birdRect.top < 0 || birdRect.bottom > window.innerHeight
  return outsideWorld || insidePipe
}

// Function that checks if two rectangles are colliding
function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  )
}

// Function that handles the start of the game
function handleStart() {
  // Hide the title, set up the bird and pipes, reset lastTime, and start the update loop
  title.classList.add("hide")
  setupBird()
  setupPipes()
  lastTime = null
  window.requestAnimationFrame(updateLoop)
}

// Function that handles a loss
function handleLose() {
  // Show the title and subtitle with the number of pipes passed, and listen for a keypress to start again
  setTimeout(() => {
    title.classList.remove("hide")
    subtitle.classList.remove("hide") 
    subtitle.textContent = `${getPassedPipesCount()} Pipes`
    document.addEventListener("keypress", handleStart, { once: true })
  }, 100)
}

// Transform ball shape
