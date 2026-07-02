import { useEffect, useRef } from 'react'

const POINTS = [
  { x: 0.18, y: 0.18, l: 'SYRIA' },
  { x: 0.82, y: 0.28, l: 'IRAQ' },
  { x: 0.55, y: 0.58, l: 'BEIRUT' },
  { x: 0.12, y: 0.72, l: 'LATAKIA' },
  { x: 0.88, y: 0.82, l: 'BAGHDAD' },
]

export default function HeroCanvas() {
  const canvasRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let w = 0
    let h = 0

    const resize = () => {
      const parent = canvas.parentElement
      w = parent.offsetWidth
      h = parent.offsetHeight
      canvas.width = w
      canvas.height = h
    }
    resize()
    window.addEventListener('resize', resize)

    const pts = POINTS.map((p) => ({ ...p, px: p.x, py: p.y }))

    let t = 0

    const draw = () => {
      t += 0.004
      ctx.fillStyle = '#0D0D0B'
      ctx.fillRect(0, 0, w, h)

      const cols = Math.ceil(w / 36) + 1
      const rows = Math.ceil(h / 36) + 1
      ctx.strokeStyle = 'rgba(74,82,64,0.25)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < cols; i++) {
        ctx.beginPath()
        ctx.moveTo(i * 36, 0)
        ctx.lineTo(i * 36, h)
        ctx.stroke()
      }
      for (let j = 0; j < rows; j++) {
        ctx.beginPath()
        ctx.moveTo(0, j * 36)
        ctx.lineTo(w, j * 36)
        ctx.stroke()
      }

      const livePts = pts.map((p, i) => ({
        ...p,
        x: p.px * w + Math.sin(t + i * 1.7) * 6,
        y: p.py * h + Math.cos(t + i * 2.1) * 6,
      }))

      ctx.lineWidth = 0.8
      for (let i = 0; i < livePts.length; i++) {
        for (let j = i + 1; j < livePts.length; j++) {
          const pulse = 0.07 + Math.sin(t * 2 + i + j) * 0.04
          ctx.strokeStyle = `rgba(94,102,82,${Math.max(0.03, pulse)})`
          ctx.beginPath()
          ctx.moveTo(livePts[i].x, livePts[i].y)
          ctx.lineTo(livePts[j].x, livePts[j].y)
          ctx.stroke()
        }
      }

      livePts.forEach((p, i) => {
        const r = 4 + Math.sin(t * 3 + i) * 1
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = '#5E6652'
        ctx.fill()

        ctx.beginPath()
        ctx.arc(p.x, p.y, 9 + Math.sin(t * 2 + i) * 2, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(94,102,82,0.25)'
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.font = '500 10px monospace'
        ctx.fillStyle = 'rgba(138,148,120,0.5)'
        ctx.textAlign = 'left'
        ctx.fillText(p.l, p.x + 14, p.y + 4)
      })

      const cx = w * 0.5
      const cy = h * 0.5
      const maxR = Math.max(w, h) * 0.75
      for (let r = 70; r < maxR; r += 70) {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(74,82,64,${0.06 * (1 - r / maxR)})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      ctx.font = '9px monospace'
      ctx.fillStyle = 'rgba(74,82,64,0.4)'
      ctx.textAlign = 'right'
      ctx.fillText('14+ YRS · FIELD CORRESPONDENT', w - 16, h - 16)

      frameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-canvas" />
}
