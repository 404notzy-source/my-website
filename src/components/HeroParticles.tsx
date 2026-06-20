import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
}

const PARTICLE_COUNT = 60
const MIN_RADIUS = 1.2
const MAX_RADIUS = 2.4
const MIN_SPEED = 0.3
const MAX_SPEED = 1.0
const MIN_ALPHA = 0.2
const MAX_ALPHA = 0.55

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    let ctx: CanvasRenderingContext2D | null = null
    try {
      ctx = canvas.getContext('2d')
    } catch {
      return
    }
    if (!ctx) return

    let width = 0
    let height = 0
    let animFrameId: number

    function resize() {
      const parent = canvas!.parentElement
      if (!parent) return
      width = parent.clientWidth
      height = parent.clientHeight
      if (canvas!.width !== width || canvas!.height !== height) {
        canvas!.width = width
        canvas!.height = height
      }
    }

    function initParticles(): Particle[] {
      const particles: Particle[] = []
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 2 * (MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED)),
          vy: (Math.random() - 0.5) * 2 * (MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED)),
          radius: MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS),
          alpha: MIN_ALPHA + Math.random() * (MAX_ALPHA - MIN_ALPHA),
        })
      }
      return particles
    }

    resize()
    const particles = initParticles()

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, width, height)

      // 每帧从 CSS 变量读取颜色，主题切换时自动跟随
      const rgb = getComputedStyle(document.documentElement)
        .getPropertyValue('--particle-color')
        .trim() || '255, 255, 255'

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        if (p.x <= 0 || p.x >= width) p.vx *= -1
        if (p.y <= 0 || p.y >= height) p.vy *= -1

        p.x = Math.max(0, Math.min(width, p.x))
        p.y = Math.max(0, Math.min(height, p.y))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb}, ${p.alpha})`
        ctx.fill()
      }

      animFrameId = requestAnimationFrame(draw)
    }

    animFrameId = requestAnimationFrame(draw)

    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animFrameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}
