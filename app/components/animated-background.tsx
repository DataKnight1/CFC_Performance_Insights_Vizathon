"use client"

import { useEffect, useRef } from "react"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Chelsea FC colors
    const primaryBlue = "#1E54B7"
    const secondaryBlue = "#034694"
    
    // Set canvas dimensions to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawBackground() // Redraw the background when resizing
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    
    // Field elements
    const fieldElements: FieldElement[] = []
    const numElements = 5 // Number of field elements
    
    // Dynamic particles (like small dots/particles moving around)
    const particles: Particle[] = []
    const numParticles = 40
    
    // Lines connecting elements
    const lines: Line[] = []
    const numLines = 15

    // Create field elements (soccer field markings)
    for (let i = 0; i < numElements; i++) {
      fieldElements.push(new FieldElement(canvas.width, canvas.height, primaryBlue))
    }
    
    // Create particles
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle(canvas.width, canvas.height, i % 2 === 0 ? primaryBlue : secondaryBlue))
    }
    
    // Create lines
    for (let i = 0; i < numLines; i++) {
      lines.push(new Line(canvas.width, canvas.height, primaryBlue))
    }

    // Draw soccer field background elements
    function drawBackground() {
      // Draw field markings with low opacity
      ctx.globalAlpha = 0.06
      
      // Center circle
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) * 0.2
      
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = primaryBlue
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Center spot
      ctx.beginPath()
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2)
      ctx.fillStyle = primaryBlue
      ctx.fill()
      
      // Penalty areas (simplified)
      const penaltyWidth = Math.min(canvas.width, canvas.height) * 0.3
      const penaltyHeight = Math.min(canvas.width, canvas.height) * 0.2
      
      // Top penalty area
      ctx.beginPath()
      ctx.rect(centerX - penaltyWidth / 2, 0, penaltyWidth, penaltyHeight)
      ctx.stroke()
      
      // Bottom penalty area
      ctx.beginPath()
      ctx.rect(centerX - penaltyWidth / 2, canvas.height - penaltyHeight, penaltyWidth, penaltyHeight)
      ctx.stroke()
      
      // Goal areas (simplified)
      const goalWidth = penaltyWidth * 0.6
      const goalHeight = penaltyHeight * 0.4
      
      // Top goal area
      ctx.beginPath()
      ctx.rect(centerX - goalWidth / 2, 0, goalWidth, goalHeight)
      ctx.stroke()
      
      // Bottom goal area
      ctx.beginPath()
      ctx.rect(centerX - goalWidth / 2, canvas.height - goalHeight, goalWidth, goalHeight)
      ctx.stroke()
      
      // Midfield line
      ctx.beginPath()
      ctx.moveTo(0, centerY)
      ctx.lineTo(canvas.width, centerY)
      ctx.stroke()
      
      // Reset opacity
      ctx.globalAlpha = 1
    }

    // Initial background draw
    drawBackground()

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Redraw the static background
      drawBackground()

      // Update and draw field elements
      fieldElements.forEach(element => {
        element.update()
        element.draw(ctx)
      })
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update()
        particle.draw(ctx)
      })
      
      // Draw connections between nearby particles
      drawConnections()
      
      // Draw and update lines
      lines.forEach(line => {
        line.update()
        line.draw(ctx)
      })

      animationId = requestAnimationFrame(animate)
    }
    
    // Draw connections between particles that are close to each other
    function drawConnections() {
      const maxDistance = 150 // Maximum distance for drawing connections
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < maxDistance) {
            // Calculate opacity based on distance (closer = more opaque)
            const opacity = 0.2 * (1 - distance / maxDistance)
            
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = primaryBlue
            ctx.globalAlpha = opacity
            ctx.lineWidth = 0.5
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-[1] pointer-events-none" />
}

// Soccer field element (like corner flags, goal posts, etc.)
class FieldElement {
  x: number
  y: number
  size: number
  type: string // circle, rect, etc.
  color: string
  canvasWidth: number
  canvasHeight: number
  opacity: number
  rotation: number
  rotationSpeed: number

  constructor(canvasWidth: number, canvasHeight: number, color: string) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.x = Math.random() * canvasWidth
    this.y = Math.random() * canvasHeight
    this.size = Math.random() * 30 + 20
    this.type = Math.random() > 0.5 ? "circle" : "rect"
    this.color = color
    this.opacity = Math.random() * 0.15 + 0.05
    this.rotation = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.02
  }

  update() {
    this.rotation += this.rotationSpeed
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.globalAlpha = this.opacity
    
    if (this.type === "circle") {
      ctx.beginPath()
      ctx.arc(0, 0, this.size, 0, Math.PI * 2)
      ctx.strokeStyle = this.color
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Add cross inside circle (like a tactical marking)
      ctx.beginPath()
      ctx.moveTo(-this.size * 0.7, 0)
      ctx.lineTo(this.size * 0.7, 0)
      ctx.moveTo(0, -this.size * 0.7)
      ctx.lineTo(0, this.size * 0.7)
      ctx.stroke()
    } else {
      // Draw rectangle
      ctx.strokeStyle = this.color
      ctx.lineWidth = 2
      ctx.strokeRect(-this.size/2, -this.size/2, this.size, this.size)
      
      // Draw diagonal lines
      ctx.beginPath()
      ctx.moveTo(-this.size/2, -this.size/2)
      ctx.lineTo(this.size/2, this.size/2)
      ctx.moveTo(this.size/2, -this.size/2)
      ctx.lineTo(-this.size/2, this.size/2)
      ctx.stroke()
    }
    
    ctx.globalAlpha = 1
    ctx.restore()
  }
}

// Small particles moving around
class Particle {
  x: number
  y: number
  size: number
  color: string
  canvasWidth: number
  canvasHeight: number
  speedX: number
  speedY: number
  opacity: number

  constructor(canvasWidth: number, canvasHeight: number, color: string) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.x = Math.random() * canvasWidth
    this.y = Math.random() * canvasHeight
    this.size = Math.random() * 3 + 1
    this.color = color
    this.speedX = (Math.random() - 0.5) * 0.8
    this.speedY = (Math.random() - 0.5) * 0.8
    this.opacity = Math.random() * 0.5 + 0.3
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY
    
    // Bounce off edges
    if (this.x < 0 || this.x > this.canvasWidth) {
      this.speedX *= -1
    }
    
    if (this.y < 0 || this.y > this.canvasHeight) {
      this.speedY *= -1
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.opacity
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

// Flowing lines
class Line {
  x: number
  y: number
  length: number
  width: number
  angle: number
  speed: number
  color: string
  canvasWidth: number
  canvasHeight: number
  opacity: number
  curve: number

  constructor(canvasWidth: number, canvasHeight: number, color: string) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.x = Math.random() * canvasWidth
    this.y = Math.random() * canvasHeight
    this.length = Math.random() * 200 + 100
    this.width = Math.random() * 1.5 + 0.5
    this.angle = Math.random() * Math.PI * 2
    this.speed = Math.random() * 0.7 + 0.3
    this.color = color
    this.opacity = Math.random() * 0.3 + 0.05
    this.curve = (Math.random() - 0.5) * 0.2 // How much the line curves
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed
    this.y += Math.sin(this.angle) * this.speed
    this.angle += this.curve * 0.01 // Gradually change direction for curved movement

    // Reset position when line goes off screen
    if (
      this.x < -this.length ||
      this.x > this.canvasWidth + this.length ||
      this.y < -this.length ||
      this.y > this.canvasHeight + this.length
    ) {
      this.x = Math.random() * this.canvasWidth
      this.y = Math.random() * this.canvasHeight
      this.angle = Math.random() * Math.PI * 2
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const endX = this.x + Math.cos(this.angle) * this.length
    const endY = this.y + Math.sin(this.angle) * this.length
    
    // Control points for curved line
    const controlX = this.x + Math.cos(this.angle + Math.PI/2) * this.length * 0.3
    const controlY = this.y + Math.sin(this.angle + Math.PI/2) * this.length * 0.3

    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.quadraticCurveTo(controlX, controlY, endX, endY)
    ctx.strokeStyle = this.color
    ctx.globalAlpha = this.opacity
    ctx.lineWidth = this.width
    ctx.stroke()
    ctx.globalAlpha = 1
  }
}

