import { useEffect, useRef } from 'react'

const CHAPTERS: Array<[number, number, number, number]> = [
  [0, 0.06, 0.38, 0.48],
  [0.52, 0.60, 0.90, 1],
]

function smooth(v: number, a = 0, b = 1) { return Math.min(b, Math.max(a, v)) }
function ease(v: number) { const s = smooth(v); return s * s * (3 - 2 * s) }
function opacityFor(p: number, [a, b, c, d]: [number, number, number, number]) {
  if (p < a || p > d) return 0
  const f = b > a ? ease((p - a) / (b - a)) : 1
  const g = d > c ? 1 - ease((p - c) / (d - c)) : 1
  return Math.min(f, g)
}

export default function LaunchHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.dataset.mode = 'static'
      return
    }

    const chapters = Array.from(copyRef.current?.querySelectorAll<HTMLElement>('.launch-chapter') ?? [])
    const products = Array.from(stage.querySelectorAll<HTMLElement>('.launch-prod'))
    const isMobile = window.matchMedia('(max-width: 767px)').matches

    let z = 0, G = 0, raf = 0, raf2 = 0, last = 0

    function render(p: number) {
      section!.style.setProperty('--launch-progress', p.toFixed(4))
      const v = p > 0.88 ? ease((p - 0.88) / 0.12) : 0
      if (veilRef.current) veilRef.current.style.opacity = v.toFixed(3)
      if (railRef.current) railRef.current.style.setProperty('--p', p.toFixed(4))
      chapters.forEach((el, i) => {
        const o = opacityFor(p, CHAPTERS[i] ?? [0, 0, 1, 1])
        el.style.opacity = o.toFixed(3)
        el.style.transform = `translate3d(0, ${(1 - o) * 10}px, 0)`
      })
      if (cueRef.current) cueRef.current.style.opacity = (1 - ease((p - 0.72) / 0.18)).toFixed(3)
      // products — scrub through 5, each window 0.2
      const prodWindows: Array<[number, number, number, number]> = [
        [0, 0.04, 0.16, 0.22],
        [0.22, 0.26, 0.36, 0.42],
        [0.42, 0.46, 0.56, 0.62],
        [0.62, 0.66, 0.76, 0.82],
        [0.82, 0.86, 0.96, 1],
      ]
      products.forEach((el, i) => {
        const o = opacityFor(p, prodWindows[i] ?? [0, 0, 0, 0])
        // subtle parallax by depth
        const depth = [0.9, 0.5, 0.7, 0.4, 0.85][i] ?? 0.5
        const dx = (isMobile ? 0 : (p - 0.5) * 18 * depth)
        el.style.opacity = o.toFixed(3)
        el.style.transform = `translate3d(${dx.toFixed(1)}px, ${(1 - o) * 6}px, 0) scale(${0.96 + o * 0.04})`
        el.style.filter = o > 0.1 ? `blur(${(1 - o) * 1.2}px) drop-shadow(0 16px 28px rgba(0,0,0,.38))` : 'blur(2px)'
      })
    }

    function onScrollFrame() {
      raf2 = 0
      const top = section!.getBoundingClientRect().top + window.scrollY
      const range = Math.max(1, section!.offsetHeight - stage!.offsetHeight)
      z = smooth((window.scrollY - top) / range)
      if (raf === 0) raf = requestAnimationFrame(tick)
    }
    function schedule() { if (!raf2) raf2 = requestAnimationFrame(onScrollFrame) }
    function tick(ts: number) {
      raf = 0
      const dt = last ? Math.min(64, ts - last) : 16.7
      last = ts
      const lerp = 1 - Math.pow(1 - 0.22, dt / 16.7)
      G += (z - G) * lerp
      if (Math.abs(z - G) < 0.0004) G = z
      render(G)
      if (Math.abs(z - G) >= 0.0004) raf = requestAnimationFrame(tick)
      else last = 0
    }

    render(0)
    onScrollFrame()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onScrollFrame, { passive: true })
    window.addEventListener('orientationchange', onScrollFrame as any, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onScrollFrame)
      window.removeEventListener('orientationchange', onScrollFrame as any)
      if (raf) cancelAnimationFrame(raf)
      if (raf2) cancelAnimationFrame(raf2)
    }
  }, [])

  return (
    <>
      <style>{`
        .launch-wrap{position:relative;height:240vh;background:#080808;}
        @media(max-width:767px){.launch-wrap{height:220vh;}}
        .launch-sticky{position:sticky;top:0;height:100svh;min-height:100dvh;overflow:hidden;background:#080808;isolation:isolate;display:grid;grid-template-columns:38% 62%;align-items:center;}
        @media(max-width:900px){.launch-sticky{grid-template-columns:42% 58%;}}
        @media(max-width:767px){.launch-sticky{grid-template-columns:1fr;grid-template-rows:auto 1fr;align-items:stretch;}}
        .launch-bg{position:absolute;inset:0;background:
          radial-gradient(ellipse 68% 52% at 65% 42%, rgba(255,255,255,.055), transparent 58%),
          radial-gradient(ellipse 28% 22% at 18% 18%, rgba(215,25,32,.055), transparent 52%),
          linear-gradient(180deg, #080808 0%, #0f0f0f 100%);
        }
        .launch-grid{position:absolute;inset:0;opacity:0.012;background-image:linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px);background-size:72px 72px;}
        .launch-copy{position:relative;z-index:10;padding:0 clamp(1.2rem,3.5vw,3rem);display:grid;max-width:100%;}
        @media(max-width:767px){.launch-copy{padding:5.5rem 1.2rem 1rem;align-self:start;}}
        .launch-chapter{grid-area:1/1;align-self:center;pointer-events:none;}
        .launch-kicker{font-family:Inter,sans-serif;font-size:10px;letter-spacing:.20em;text-transform:uppercase;color:rgba(255,255,255,.52);margin-bottom:1rem;display:flex;align-items:center;gap:.6rem;}
        .launch-kicker::before{content:'';width:18px;height:1px;background:#D71920;}
        .launch-title{font-family:Barlow Condensed,sans-serif;font-weight:900;line-height:.88;letter-spacing:-.03em;color:#F5F5F2;font-size:clamp(3.2rem,6vw,6.5rem);}
        @media(max-width:767px){.launch-title{font-size:clamp(2.5rem,11vw,4rem) !important;}}
        .launch-title em{color:#D71920;font-style:normal;}
        .launch-title .outline{color:transparent;-webkit-text-stroke:1.1px rgba(245,245,242,.92);}
        .launch-sub{font-family:Inter,sans-serif;font-size:13px;line-height:1.6;color:rgba(255,255,255,.52);max-width:32ch;margin-top:.9rem;}
        .launch-media{position:relative;z-index:3;height:100%;display:flex;align-items:center;justify-content:center;overflow:visible;pointer-events:none;}
        @media(max-width:767px){.launch-media{height:auto;align-self:end;padding-bottom:1.2rem;}}
        .launch-stage{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;}
        .launch-prod{position:absolute;object-fit:contain;will-change:transform,opacity;filter:drop-shadow(0 18px 32px rgba(0,0,0,.42));opacity:0;}
        .launch-prod--dunk{left:8%;top:18%;width:min(38vw,440px);}
        .launch-prod--adidas{left:52%;top:8%;width:min(28vw,320px);}
        .launch-prod--jacket{left:36%;top:52%;width:min(32vw,380px);}
        .launch-prod--diesel{left:6%;top:58%;width:min(26vw,300px);}
        .launch-prod--cap{left:64%;top:62%;width:min(18vw,200px);}
        @media(max-width:767px){
          .launch-prod--dunk{left:50%;top:38%;width:min(74vw,320px);transform:translate(-50%,-50%);}
          .launch-prod--adidas{left:50%;top:18%;width:min(52vw,220px);}
          .launch-prod--jacket{left:50%;top:64%;width:min(62vw,280px);}
          .launch-prod--diesel{display:none;}
          .launch-prod--cap{left:70%;top:72%;width:min(30vw,130px);}
        }
        .launch-rail{margin-top:1.4rem;width:min(13rem,52%);height:1px;background:rgba(255,255,255,.14);overflow:hidden;}
        .launch-rail i{display:block;height:100%;width:100%;background:#D71920;transform-origin:left;transform:scaleX(var(--p,0));will-change:transform;}
        @media(max-width:767px){.launch-rail{width:8rem;}}
        .launch-veil{position:absolute;inset:0;background:#080808;opacity:0;pointer-events:none;z-index:5;}
        .launch-cue{position:absolute;left:50%;bottom:1.2rem;transform:translateX(-50%);z-index:10;display:flex;flex-direction:column;align-items:center;gap:.4rem;opacity:.62;}
        .launch-cue-line{width:1px;height:28px;background:linear-gradient(to bottom,transparent,rgba(255,255,255,.45));}
        .launch-cue-txt{font-family:Barlow Condensed,sans-serif;font-size:.58rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.5);}
      `}</style>

      <section ref={sectionRef} className="launch-wrap" aria-labelledby="launch-title">
        <div ref={stageRef} className="launch-sticky">
          <div className="launch-bg" />
          <div className="launch-grid" />

          <div ref={copyRef} className="launch-copy">
            <div className="launch-chapter">
              <div className="launch-kicker">Nova unidade</div>
              <h1 id="launch-title" className="launch-title">
                A BEST CHEGA<br />
                A AUGUSTINÓPOLIS<span style={{ color: '#D71920' }}>.</span>
              </h1>
              <div className="launch-title outline" style={{ fontSize: 'clamp(1.1rem,1.6vw,1.35rem)', letterSpacing: '.14em', marginTop: '.7rem', WebkitTextStroke: '0', color: 'rgba(255,255,255,.72)', fontWeight: 600 }}>
                11.09.2026 — 09H
              </div>
              <p className="launch-sub">De Araguatins para Augustinópolis. Mesma curadoria, novas paredes.</p>
              <div className="launch-rail" aria-hidden><i ref={railRef} /></div>
            </div>
            <div className="launch-chapter">
              <div className="launch-kicker">De Araguatins para Augustinópolis</div>
              <h2 className="launch-title">
                DUAS CIDADES.<br />
                <span className="outline">UMA SÓ BEST</span><span style={{ color: '#D71920' }}>.</span>
              </h2>
              <p className="launch-sub">A mesma curadoria, agora mais perto de você.</p>
              <a href="https://www.instagram.com/bestmultimarcasaugustinopolis/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-4 bg-white text-black font-[Barlow_Condensed] tracking-[0.14em] text-xs px-4 py-2.5 hover:bg-white/90 transition" style={{ pointerEvents: 'auto' }}>
                ACOMPANHAR NO INSTAGRAM ↗
              </a>
            </div>
          </div>

          <div className="launch-media">
            <div className="launch-stage">
              <img className="launch-prod launch-prod--dunk" src="/products/nike-dunk-panda.png" alt="" />
              <img className="launch-prod launch-prod--adidas" src="/products/adidas-sneaker.png" alt="" />
              <img className="launch-prod launch-prod--jacket" src="/products/nike-jacket.png" alt="" />
              <img className="launch-prod launch-prod--diesel" src="/products/diesel-shirt.png" alt="" />
              <img className="launch-prod launch-prod--cap" src="/products/ny-cap.png" alt="" />
            </div>
          </div>

          <div ref={veilRef} className="launch-veil" aria-hidden />
          <div ref={cueRef} className="launch-cue" aria-hidden>
            <div className="launch-cue-line" />
            <div className="launch-cue-txt">Role</div>
          </div>
        </div>
      </section>
    </>
  )
}
