import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './LaunchHero.css'

gsap.registerPlugin(ScrollTrigger)

export default function LaunchHero() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const sticky = stickyRef.current
    const track = trackRef.current
    if (!wrap || !sticky || !track) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ambient product loop — master timeline 12s, independent of scroll
    const products = Array.from(track.querySelectorAll<HTMLElement>('.launch-prod'))
    if (!prefersReduced) {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 })
      // Dunk — diagonal cross behind text
      tl.to(products[0], { x: '18vw', y: '-8vh', rotation: 6, scale: 1.08, duration: 3.2, ease: 'sine.inOut' }, 0)
        .to(products[0], { x: '-6vw', y: '6vh', rotation: -4, scale: 1, duration: 3.4, ease: 'sine.inOut' }, 3.2)
        .to(products[0], { x: 0, y: 0, rotation: 0, scale: 1, duration: 2.8, ease: 'sine.inOut' }, 6.6)
      // Adidas — float distant
      tl.to(products[1], { x: '-10vw', y: '4vh', rotation: -5, scale: 0.92, duration: 2.9, ease: 'sine.inOut' }, 0.4)
        .to(products[1], { x: '8vw', y: '-5vh', rotation: 4, scale: 0.88, duration: 3.1, ease: 'sine.inOut' }, 3.3)
      // Jacket — slow rise
      tl.to(products[2], { y: '-10vh', rotation: 2, scale: 0.96, duration: 3.6, ease: 'sine.inOut' }, 0.8)
        .to(products[2], { y: '4vh', rotation: -2, scale: 0.9, duration: 3.2, ease: 'sine.inOut' }, 4.4)
      // Diesel — cross behind
      tl.to(products[3], { x: '12vw', y: '6vh', rotation: 3, duration: 3, ease: 'sine.inOut' }, 1.0)
        .to(products[3], { x: '-8vw', y: '-4vh', rotation: -3, duration: 3.2, ease: 'sine.inOut' }, 4.0)
      // Cap — close, subtle
      tl.to(products[4], { x: '6vw', y: '-6vh', rotation: -6, scale: 1.12, duration: 2.8, ease: 'sine.inOut' }, 0.6)
        .to(products[4], { x: -4, y: 4, rotation: 4, scale: 1, duration: 3, ease: 'sine.inOut' }, 3.4)

      // glow breathing
      const glows = track.querySelectorAll<HTMLElement>('.launch-glow')
      glows.forEach((g, i) => {
        gsap.to(g, { scale: 1.06, duration: 8 + i * 1.2, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 0.7 })
      })
    }

    // scroll — sticky chapters (like Miphone 440svh → 280svh for Best)
    const chapters = Array.from(sticky.querySelectorAll<HTMLElement>('.launch-chapter'))
    const veil = sticky.querySelector<HTMLElement>('.launch-veil')

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate(self) {
        const p = self.progress // 0→1 over 280vh
        // chapters: 0: AUGUSTINOPOLIS 0-0.28, 1: 11.09 0.28-0.52, 2: 09H 0.52-0.76, 3: NOVA UNIDADE 0.76-1
        const windows: Array<[number, number, number, number]> = [
          [0, 0.04, 0.22, 0.28],
          [0.28, 0.34, 0.46, 0.52],
          [0.52, 0.58, 0.70, 0.76],
          [0.76, 0.82, 0.95, 1],
        ]
        const ease = (x: number) => x * x * (3 - 2 * x)
        chapters.forEach((el, i) => {
          const [a, b, c, d] = windows[i]
          let o = 0
          if (p >= a && p < b) o = ease((p - a) / (b - a))
          else if (p >= b && p < c) o = 1
          else if (p >= c && p < d) o = 1 - ease((p - c) / (d - c))
          else o = 0
          el.style.opacity = String(o)
          el.style.transform = `translate3d(0, ${(1 - o) * 14}px, 0)`
        })
        if (veil) veil.style.opacity = String(p > 0.88 ? ease((p - 0.88) / 0.12) : 0)
        // products react to scroll: disperse slightly
        const disp = p * 12
        products.forEach((prod, i) => {
          const depth = [0.6, 0.3, 0.9, 0.5, 1][i] ?? 0.5
          gsap.set(prod, { x: `+=${disp * depth * 0.15}`, y: `+=${disp * depth * 0.08}` } as any)
        })
      },
    })

    // initial state
    chapters.forEach((el, i) => {
      el.style.opacity = i === 0 ? '1' : '0'
      el.style.transform = i === 0 ? 'translate3d(0,0,0)' : 'translate3d(0,14px,0)'
    })

    return () => { st.kill() }
  }, [])

  return (
    <>
      

      <div ref={wrapRef} className="launch-wrap">
        <div ref={stickyRef} className="launch-sticky">
          <div className="launch-bg" />
          <div className="launch-grid" />
          <div className="launch-glow" style={{ background: 'radial-gradient(ellipse 70% 60% at 30% 20%, rgba(181,42,39,.18) 0%, transparent 60%)' }} />
          <div className="launch-glow" style={{ background: 'radial-gradient(ellipse 60% 50% at 85% 85%, rgba(212,191,168,.14) 0%, transparent 55%)' }} />

          {/* ambient products */}
          <div ref={trackRef} className="launch-stage" aria-hidden>
            <img className="launch-prod launch-prod--dunk" src="/products/nike-dunk-panda.png" alt="" />
            <img className="launch-prod launch-prod--adidas" src="/products/adidas-sneaker.png" alt="" />
            <img className="launch-prod launch-prod--jacket" src="/products/nike-jacket.png" alt="" />
            <img className="launch-prod launch-prod--diesel" src="/products/diesel-shirt.png" alt="" />
            <img className="launch-prod launch-prod--cap" src="/products/ny-cap.png" alt="" />
          </div>

          <div className="launch-copy">
            {/* chapter 0 */}
            <div className="launch-chapter">
              <div className="launch-kicker">Nova unidade • Best Multimarcas</div>
              <div className="launch-title" style={{ fontSize: 'clamp(2.8rem,7.2vw,5.8rem)' }}>
                AUGUSTINÓPOLIS,<br />
                <span className="outline">A BEST</span> TÁ<br />
                CHEGANDO<em>.</em>
              </div>
              <div className="launch-sub">De Araguatins para Augustinópolis. Mesma curadoria, novas paredes.</div>
            </div>
            {/* chapter 1 */}
            <div className="launch-chapter">
              <div className="launch-kicker">Inauguração</div>
              <div className="launch-title" style={{ fontSize: 'clamp(4.2rem,14vw,10rem)', lineHeight: 0.85 }}>
                11.<br />
                09
              </div>
              <div className="launch-sub">Marque na agenda. A cidade ganha uma nova Best.</div>
            </div>
            {/* chapter 2 */}
            <div className="launch-chapter">
              <div className="launch-kicker">Horário</div>
              <div className="launch-title" style={{ fontSize: 'clamp(4.2rem,14vw,10rem)', lineHeight: 0.85 }}>
                09<em>H</em>
              </div>
              <div className="launch-sub">Portas abertas às nove da manhã.</div>
            </div>
            {/* chapter 3 */}
            <div className="launch-chapter">
              <div className="launch-kicker">Chegamos</div>
              <div className="launch-title" style={{ fontSize: 'clamp(2.8rem,7vw,5.2rem)' }}>
                NOVA<br />
                UNIDADE<em>.</em>
              </div>
              <div className="launch-sub">BEST MULTIMARCAS — Araguatins • Augustinópolis</div>
            </div>
          </div>

          <div className="launch-veil" />

          <div className="launch-cue">
            <div className="launch-cue-line" />
            <div className="launch-cue-txt">Role</div>
          </div>
        </div>
      </div>
    </>
  )
}
