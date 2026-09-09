import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ArrowUpRight, Menu, X, MapPin, ArrowLeft, ArrowRight } from 'lucide-react'

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
)

// ── DATA ────────────────────────────────────────────────────────────────────

type Decoration = {
  src: string
  alt: string
  x: number
  y: number
  w: number
  rotation: number
  layer: 'back' | 'mid' | 'front'
  depth: number
  idle: { y: number; x: number; rotation: number; duration: number }
}

type Slide = {
  id: string
  brand: string
  name: string
  name2: string
  bgWord: string
  asset: string
  alt: string
  bg: string
  glow: string
  vignette: string
  textColor: 'dark' | 'light'
  type: 'shoe' | 'jacket' | 'shirt' | 'cap'
  scale: number
  decorations: Decoration[]
}

const SLIDES: Slide[] = [
  {
    id: 'dunk',
    brand: 'NIKE',
    name: 'DUNK',
    name2: 'PANDA',
    bgWord: 'DUNK',
    asset: '/products/nike-dunk-panda.png',
    alt: 'Nike Dunk Panda',
    bg: '#1A5FA8',
    glow: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(90,170,255,.30) 0%, transparent 70%)',
    vignette: 'radial-gradient(ellipse 75% 70% at 50% 50%, transparent 32%, rgba(8,22,55,.58) 100%)',
    textColor: 'light',
    type: 'shoe',
    scale: 1,
    decorations: [
      { src: '/decorations/dunk-heel.png', alt: '', x: 16, y: 68, w: 240, rotation: 18, layer: 'front', depth: 0.7, idle: { y: 10, x: 4, rotation: 4, duration: 7.2 } },
      { src: '/decorations/dunk-toecap.png', alt: '', x: 84, y: 22, w: 170, rotation: -12, layer: 'back', depth: 0.25, idle: { y: 14, x: -3, rotation: 6, duration: 9.1 } },
      { src: '/decorations/dunk-swoosh.png', alt: '', x: 70, y: 38, w: 360, rotation: -8, layer: 'back', depth: 0.45, idle: { y: 6, x: 8, rotation: 2, duration: 8.4 } },
    ],
  },
  {
    id: 'adidas',
    brand: 'ADIDAS',
    name: 'SNEAKER',
    name2: '',
    bgWord: 'ADIDAS',
    asset: '/products/adidas-sneaker.png',
    alt: 'Adidas Sneaker',
    bg: '#D4E842',
    glow: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,255,190,.32) 0%, transparent 70%)',
    vignette: 'radial-gradient(ellipse 75% 70% at 50% 50%, transparent 34%, rgba(55,70,5,.42) 100%)',
    textColor: 'dark',
    type: 'shoe',
    scale: 0.97,
    decorations: [],
  },
  {
    id: 'jacket',
    brand: 'NIKE',
    name: 'JAQUETA',
    name2: '',
    bgWord: 'NIKE',
    asset: '/products/nike-jacket.png',
    alt: 'Jaqueta Nike',
    bg: '#B52A27',
    glow: 'radial-gradient(ellipse 60% 60% at 50% 45%, rgba(255,130,110,.26) 0%, transparent 70%)',
    vignette: 'radial-gradient(ellipse 75% 70% at 50% 50%, transparent 30%, rgba(55,12,14,.58) 100%)',
    textColor: 'light',
    type: 'jacket',
    scale: 0.86,
    decorations: [
      { src: '/decorations/dunk-heel.png', alt: '', x: 18, y: 52, w: 420, rotation: 14, layer: 'back', depth: 0.35, idle: { y: 8, x: 5, rotation: 3, duration: 8.0 } },
      { src: '/decorations/dunk-toecap.png', alt: '', x: 80, y: 28, w: 180, rotation: -18, layer: 'front', depth: 0.6, idle: { y: 9, x: -4, rotation: 5, duration: 7.0 } },
    ],
  },
  {
    id: 'diesel',
    brand: 'DIESEL',
    name: 'CAMISETA',
    name2: '',
    bgWord: 'DIESEL',
    asset: '/products/diesel-shirt.png',
    alt: 'Camiseta Diesel',
    bg: '#C69245',
    glow: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,230,180,.32) 0%, transparent 70%)',
    vignette: 'radial-gradient(ellipse 78% 70% at 50% 50%, transparent 38%, rgba(75,48,12,.45) 100%)',
    textColor: 'dark',
    type: 'shirt',
    scale: 0.88,
    decorations: [],
  },
  {
    id: 'cap',
    brand: 'NY',
    name: 'BONÉ',
    name2: '',
    bgWord: 'NY',
    asset: '/products/ny-cap.png',
    alt: 'Boné NY',
    bg: '#7FA89A',
    glow: 'radial-gradient(ellipse 62% 56% at 50% 45%, rgba(190,225,210,.30) 0%, transparent 70%)',
    vignette: 'radial-gradient(ellipse 80% 74% at 50% 50%, transparent 35%, rgba(40,70,60,.38) 100%)',
    textColor: 'dark',
    type: 'cap',
    scale: 0.80,
    decorations: [
      { src: '/decorations/statue-of-liberty.png', alt: '', x: 18, y: 74, w: 220, rotation: 0, layer: 'back', depth: 0.3, idle: { y: 6, x: 2, rotation: 1, duration: 9.5 } },
      { src: '/decorations/ny-logo.png', alt: '', x: 76, y: 42, w: 380, rotation: -6, layer: 'back', depth: 0.5, idle: { y: 7, x: -3, rotation: 2, duration: 8.8 } },
    ],
  },
]

function rotationFor(s: Slide) {
  switch (s.type) {
    case 'shoe': return 290
    case 'jacket': return 140
    case 'shirt': return 110
    case 'cap': return 160
    default: return 180
  }
}

// ── COUNTDOWN ───────────────────────────────────────────────────────────────

function useCountdown(targetISO: string) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const target = new Date(targetISO).getTime()
  const diff = target - now
  const isPast = diff <= 0
  const d = Math.max(0, Math.floor(diff / 86400000))
  const h = Math.max(0, Math.floor((diff % 86400000) / 3600000))
  const m = Math.max(0, Math.floor((diff % 3600000) / 60000))
  const s = Math.max(0, Math.floor((diff % 60000) / 1000))
  return { d, h, m, s, isPast }
}

// ── HEADER ─────────────────────────────────────────────────────────────────

function Header({ onNav }: { onNav: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <header
      className={`fixed top-0 inset-x-0 z-[100] flex items-center justify-between px-6 md:px-10 py-5 transition-all ${scrolled ? 'bg-[#080808]/85 backdrop-blur-xl border-b border-white/5' : 'bg-transparent border-b border-transparent'}`}
    >
      <a href="#" className="flex items-baseline gap-1">
        <span className="font-[Barlow_Condensed] font-black tracking-[0.18em] text-[1.7rem] leading-none text-white">BEST</span>
        <span className="hidden sm:inline font-[Barlow_Condensed] font-bold tracking-[0.22em] text-[0.62rem] text-white/55 translate-y-[-2px]">MULTIMARCAS</span>
      </a>

      <nav className="hidden lg:flex items-center gap-1">
        {[
          ['PRODUTOS', 'variedade'],
          ['MARCAS', 'marcas'],
          ['LOJAS', 'lojas'],
        ].map(([label, id]) => (
          <button key={id} onClick={() => onNav(id)} className="font-[Barlow_Condensed] text-[0.82rem] tracking-[0.16em] text-white/55 hover:text-white px-4 py-2 transition-colors">
            {label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <a
          href="https://www.instagram.com/bestmultimarcasaraguatins/"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="hidden md:inline-flex w-9 h-9 rounded-full border border-white/15 text-white items-center justify-center hover:bg-white hover:text-black hover:border-white transition"
        >
          <InstagramIcon width={16} height={16} />
        </a>
        <button onClick={() => setOpen(!open)} aria-label={open ? 'Fechar menu' : 'Abrir menu'} className="lg:hidden w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white">
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {open && (
        <div className="absolute top-full inset-x-0 bg-[#080808] border-t border-white/10 px-6 py-8 flex flex-col gap-1 lg:hidden">
          {[
            ['PRODUTOS', 'variedade'],
            ['MARCAS', 'marcas'],
            ['LOJAS', 'lojas'],
          ].map(([label, id]) => (
            <button key={id} onClick={() => { onNav(id); setOpen(false) }} className="text-left font-[Barlow_Condensed] font-bold text-3xl tracking-[0.08em] text-white/90 py-3 border-b border-white/5">
              {label}
            </button>
          ))}
          <a href="https://www.instagram.com/bestmultimarcasaraguatins/" target="_blank" className="mt-4 inline-flex items-center gap-2 font-[Barlow_Condensed] tracking-[0.2em] text-sm text-white/70">
            INSTAGRAM <ArrowUpRight size={16} />
          </a>
        </div>
      )}
    </header>
  )
}

// ── PRELOAD CACHE ───────────────────────────────────────────────────────────

const imageCache = new Map<string, Promise<void>>()

function preloadImage(src: string): Promise<void> {
  if (imageCache.has(src)) return imageCache.get(src)!
  const p = new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.src = src
    if (img.complete && img.naturalWidth > 0) {
      const d = (img as unknown as { decode?: () => Promise<void> }).decode
      if (d) d.call(img).then(() => resolve()).catch(() => resolve())
      else resolve()
      return
    }
    img.onload = () => {
      const d = (img as unknown as { decode?: () => Promise<void> }).decode
      if (d) d.call(img).then(() => resolve()).catch(() => resolve())
      else resolve()
    }
    img.onerror = () => reject(new Error(`preload failed: ${src}`))
  })
  imageCache.set(src, p)
  // auto-evict on failure so retry can happen
  p.catch(() => imageCache.delete(src))
  return p
}

// ── HERO ────────────────────────────────────────────────────────────────────

function HeroSlider() {
  const [idx, setIdx] = useState(0)
  const [reduced, setReduced] = useState(false)

  const stageRef = useRef<HTMLDivElement>(null)
  const prodARef = useRef<HTMLImageElement>(null)
  const prodBRef = useRef<HTMLImageElement>(null)
  const prodAWrapRef = useRef<HTMLDivElement>(null)
  const prodBWrapRef = useRef<HTMLDivElement>(null)
  const bgARef = useRef<HTMLDivElement>(null)
  const bgBRef = useRef<HTMLDivElement>(null)
  const glowARef = useRef<HTMLDivElement>(null)
  const glowBRef = useRef<HTMLDivElement>(null)
  const bgWordARef = useRef<HTMLDivElement>(null)
  const bgWordBRef = useRef<HTMLDivElement>(null)
  // dual text layers
  const textARef = useRef<HTMLDivElement>(null)
  const textBRef = useRef<HTMLDivElement>(null)
  // decor layers A/B — GSAP-owned like products
  const decorARef = useRef<HTMLDivElement>(null)
  const decorBRef = useRef<HTMLDivElement>(null)
  const decorIdleMap = useRef<Map<HTMLElement, gsap.core.Timeline>>(new Map())
  const glowIdleA = useRef<gsap.core.Tween | null>(null)
  const glowIdleB = useRef<gsap.core.Tween | null>(null)

  const isTransitioning = useRef(false)
  const pending = useRef<number | null>(null)
  const currentRef = useRef(0)
  const activeIsA = useRef(true)
  const idleTl = useRef<gsap.core.Timeline | null>(null)
  const autoplayTimer = useRef<number | null>(null)
  const resumeTimer = useRef<number | null>(null)

  const slide = SLIDES[idx]

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  function fgFor(s: Slide) { return s.textColor === 'dark' ? '#0A0A0A' : '#FFFFFF' }
  function fgMutedFor(s: Slide) { return s.textColor === 'dark' ? 'rgba(10,10,10,.55)' : 'rgba(255,255,255,.60)' }
  function fgSubtleFor(s: Slide) { return s.textColor === 'dark' ? 'rgba(10,10,10,.35)' : 'rgba(255,255,255,.45)' }
  function wordColorFor(s: Slide) { return s.textColor === 'dark' ? 'rgba(0,0,0,.075)' : 'rgba(255,255,255,.11)' }
  function wordStrokeFor(s: Slide) { return s.textColor === 'dark' ? '1px rgba(0,0,0,.09)' : '1px rgba(255,255,255,.13)' }

  function renderTextLayer(el: HTMLElement, s: Slide) {
    el.innerHTML = `
      <div style="font-family:Inter,sans-serif;font-size:11px;letter-spacing:0.22em;opacity:0.95">${s.brand}</div>
      <h1 style="font-family:Barlow Condensed,sans-serif;font-weight:900;line-height:0.86;letter-spacing:-0.03em;font-size:clamp(2.8rem,7vw,5.6rem);margin-top:6px">${s.name}${s.name2 ? `<br/><span style="-webkit-text-stroke:${s.textColor === 'dark' ? '1.4px #0A0A0A' : '1.2px rgba(255,255,255,.92)'};color:transparent">${s.name2}</span>` : ''}</h1>
      <div style="font-family:Inter,sans-serif;font-size:11px;letter-spacing:0.18em;margin-top:14px;opacity:0.85">ARAGUATINS — AUGUSTINÓPOLIS</div>
    `
  }

  function debugHero(label: string) {
    if (!import.meta.env.DEV) return
    console.table({
      label,
      current: currentRef.current,
      idx,
      active: activeIsA.current ? 'A' : 'B',
      srcA: prodARef.current?.src.slice(-30),
      srcB: prodBRef.current?.src.slice(-30),
      opacityA: prodARef.current ? getComputedStyle(prodARef.current).opacity : '-',
      opacityB: prodBRef.current ? getComputedStyle(prodBRef.current).opacity : '-',
    })
  }

  // ── DECOR HELPERS ─────────────────────────────────────────────────────────

  function visibleDecorations(slide: Slide): Decoration[] {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    if (!isMobile) return slide.decorations
    if (slide.id === 'dunk' && slide.decorations.length > 2) return slide.decorations.slice(0, 2)
    if (slide.id === 'jacket' && slide.decorations.length > 1) return slide.decorations.slice(0, 1)
    return slide.decorations.slice(0, 2)
  }

  function buildDecorLayer(container: HTMLElement, slide: Slide) {
    container.innerHTML = ''
    const decs = visibleDecorations(slide)
    decs.forEach((d) => {
      const img = document.createElement('img')
      img.src = d.src
      img.alt = d.alt
      img.decoding = 'async' as never
      img.draggable = false
      img.style.position = 'absolute'
      img.style.left = `${d.x}%`
      img.style.top = `${d.y}%`
      img.style.width = `${d.w}px`
      img.style.height = 'auto'
      img.style.transform = `translate(-50%, -50%) rotate(${d.rotation}deg)`
      img.style.objectFit = 'contain'
      img.style.pointerEvents = 'none'
      img.style.willChange = 'transform, opacity'
      img.style.opacity = '1'
      img.style.zIndex = d.layer === 'back' ? '1' : d.layer === 'front' ? '3' : '2'
      img.dataset.depth = String(d.depth)
      img.dataset.w = String(d.w)
      if (window.innerWidth < 768) {
        const scale = d.w > 300 ? 0.55 : 0.7
        img.style.width = `${Math.round(d.w * scale)}px`
      }
      if (d.layer === 'back') img.style.opacity = '0.92'
      container.appendChild(img)
    })
  }

  function killDecorIdle(container: HTMLElement | null) {
    if (!container) return
    Array.from(container.children).forEach((el) => {
      const tl = decorIdleMap.current.get(el as HTMLElement)
      if (tl) { tl.kill(); decorIdleMap.current.delete(el as HTMLElement) }
      gsap.killTweensOf(el)
    })
  }

  function startDecorIdle(container: HTMLElement | null) {
    if (!container || reduced) return
    Array.from(container.children).forEach((el, i) => {
      const htmlEl = el as HTMLElement
      const idxAttr = Array.from(container.children).indexOf(el)
      const slideDecs = visibleDecorations(SLIDES[currentRef.current])
      const cfg = slideDecs[idxAttr] ?? slideDecs[i % slideDecs.length]
      if (!cfg) return
      const { y, x, rotation, duration } = cfg.idle
      const tl = gsap.timeline({ repeat: -1, delay: i * 0.35 })
      tl.to(htmlEl, { y: -y, x: -x, rotation: cfg.rotation + rotation, duration: duration * 0.33, ease: 'sine.inOut' })
        .to(htmlEl, { y: y * 0.45, x: x * 0.6, rotation: cfg.rotation - rotation * 0.8, duration: duration * 0.34, ease: 'sine.inOut' })
        .to(htmlEl, { y: 0, x: 0, rotation: cfg.rotation, duration: duration * 0.33, ease: 'sine.inOut' })
      decorIdleMap.current.set(htmlEl, tl)
    })
  }

  function preloadDecorations(slide: Slide) {
    slide.decorations.forEach(d => { void preloadImage(d.src).catch(() => {}) })
  }

  // init layers + robust preload — GSAP/DOM is the sole owner, React does not reapply src/opacity/zIndex
  useEffect(() => {
    const a = prodARef.current, b = prodBRef.current
    const aw = prodAWrapRef.current, bw = prodBWrapRef.current
    const bgA = bgARef.current, bgB = bgBRef.current
    const gA = glowARef.current, gB = glowBRef.current
    const wA = bgWordARef.current, wB = bgWordBRef.current
    const tA = textARef.current, tB = textBRef.current
    const dA = decorARef.current, dB = decorBRef.current
    if (!a || !b || !aw || !bw || !bgA || !bgB || !gA || !gB || !wA || !wB || !tA || !tB || !dA || !dB) return
    const s0 = SLIDES[0]
    const s1 = SLIDES[1]
    // set DOM src once — React will not reapply them on idx changes
    a.src = s0.asset; a.alt = s0.alt
    b.src = s1.asset; b.alt = s1.alt
    // A = current
    bgA.style.background = s0.bg
    gA.style.background = s0.glow
    wA.textContent = s0.bgWord
    wA.style.color = wordColorFor(s0)
    wA.style.webkitTextStroke = wordStrokeFor(s0) as string
    tA.style.color = fgFor(s0)
    renderTextLayer(tA, s0)
    gsap.set(tA, { opacity: 1, y: 0 })
    // B = hidden, will hold next
    bgB.style.background = s1.bg
    gB.style.background = s1.glow
    wB.textContent = s1.bgWord
    wB.style.color = wordColorFor(s1)
    wB.style.webkitTextStroke = wordStrokeFor(s1) as string
    tB.style.color = fgFor(s1)
    renderTextLayer(tB, s1)
    // explicit z-index — only set via DOM, never via React props after mount
    bgA.style.zIndex = '1'; bgB.style.zIndex = '0'
    gA.style.zIndex = '1'; gB.style.zIndex = '0'
    wA.style.zIndex = '2'; wB.style.zIndex = '1'
    aw.style.zIndex = '3'; bw.style.zIndex = '2'
    tA.style.zIndex = '4'; tB.style.zIndex = '3'
    gsap.set(bgB, { opacity: 0 })
    gsap.set(gB, { opacity: 0 })
    gsap.set(wB, { opacity: 0 })
    gsap.set(tB, { opacity: 0 })
    gsap.set(b, { opacity: 0 })
    gsap.set(aw, { opacity: 1 })
    gsap.set(bw, { opacity: 1 })
    // drop-shadow lives on wrapper, blur/transform on img
    aw.style.filter = 'drop-shadow(0 28px 60px rgba(0,0,0,.28))'
    bw.style.filter = 'drop-shadow(0 28px 60px rgba(0,0,0,.28))'
    gsap.set(a, { x: 0, y: 0, rotation: 0, scale: s0.scale, opacity: 1, filter: 'blur(0px)' })
    gsap.set(b, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 0, filter: 'blur(0px)' })
    // decor layers — GSAP-owned, behind product
    dA.style.zIndex = '4'; dB.style.zIndex = '3'
    buildDecorLayer(dA, s0); buildDecorLayer(dB, s1)
    gsap.set(dA, { opacity: 1 }); gsap.set(dB, { opacity: 0 })
    // glow breathing (subtle)
    if (!reduced) {
      glowIdleA.current = gsap.to(gA, { scale: 1.04, duration: 9, ease: 'sine.inOut', repeat: -1, yoyo: true })
      glowIdleB.current = gsap.to(gB, { scale: 1.04, duration: 11, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true })
    }

    // preload strategy: slide 0 already eager, preload 1 immediately, then idle preload 2,3,4
    void preloadImage(s0.asset).catch(() => {})
    void preloadImage(s1.asset).catch(() => {})
    preloadDecorations(s0); preloadDecorations(s1)
    const idlePreload = () => {
      for (let i = 2; i < SLIDES.length; i++) { void preloadImage(SLIDES[i].asset).catch(() => {}); preloadDecorations(SLIDES[i]) }
    }
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback
    if (ric) ric(idlePreload)
    else setTimeout(idlePreload, 700)

    startIdle(a)
    startDecorIdle(dA)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function killIdle() {
    if (idleTl.current) { idleTl.current.kill(); idleTl.current = null }
  }

  function startIdle(el: HTMLElement) {
    killIdle()
    if (reduced) return
    const s = SLIDES[currentRef.current]
    const ampY = s.type === 'shoe' ? 7 : s.type === 'jacket' ? 5 : s.type === 'shirt' ? 6 : 4
    const ampR = s.type === 'shoe' ? 1.8 : s.type === 'jacket' ? 0.9 : 1.1
    const tl = gsap.timeline({ repeat: -1 })
    tl.to(el, { y: -ampY, rotation: ampR, scale: s.scale * 1.018, duration: 2.8, ease: 'sine.inOut' })
      .to(el, { y: ampY * 0.35, rotation: -ampR * 0.9, scale: s.scale * 0.995, duration: 2.9, ease: 'sine.inOut' })
      .to(el, { y: 0, rotation: 0, scale: s.scale, duration: 2.6, ease: 'sine.inOut' })
    idleTl.current = tl
  }

  const scheduleAutoplay = useCallback(() => {
    if (reduced) return
    if (autoplayTimer.current) clearInterval(autoplayTimer.current)
    autoplayTimer.current = window.setInterval(() => {
      void goTo((currentRef.current + 1) % SLIDES.length, 1)
    }, 6500)
  }, [reduced])

  const pauseAutoplay = useCallback(() => {
    if (autoplayTimer.current) { clearInterval(autoplayTimer.current); autoplayTimer.current = null }
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    resumeTimer.current = window.setTimeout(() => scheduleAutoplay(), 9000)
  }, [scheduleAutoplay])

  const goTo = useCallback(async (next: number, dir?: number) => {
    if (next === currentRef.current) return
    if (isTransitioning.current) { pending.current = next; return }
    isTransitioning.current = true
    const prev = currentRef.current
    const direction = dir ?? (next > prev ? 1 : -1)
    const prevSlide = SLIDES[prev]
    const nextSlide = SLIDES[next]
    const rotOut = rotationFor(prevSlide)
    const rotIn = rotationFor(nextSlide)

    const prodOut = activeIsA.current ? prodARef.current : prodBRef.current
    const prodIn  = activeIsA.current ? prodBRef.current : prodARef.current
    const bgOut   = activeIsA.current ? bgARef.current : bgBRef.current
    const bgIn    = activeIsA.current ? bgBRef.current : bgARef.current
    const glowOut = activeIsA.current ? glowARef.current : glowBRef.current
    const glowIn  = activeIsA.current ? glowBRef.current : glowARef.current
    const wordOut = activeIsA.current ? bgWordARef.current : bgWordBRef.current
    const wordIn  = activeIsA.current ? bgWordBRef.current : bgWordARef.current
    const textOut = activeIsA.current ? textARef.current : textBRef.current
    const textIn  = activeIsA.current ? textBRef.current : textARef.current
    const decorOut = activeIsA.current ? decorARef.current : decorBRef.current
    const decorIn  = activeIsA.current ? decorBRef.current : decorARef.current
    const glowOutIdle = activeIsA.current ? glowIdleA.current : glowIdleB.current
    const glowInIdle  = activeIsA.current ? glowIdleB.current : glowIdleA.current

    if (!prodOut || !prodIn || !bgOut || !bgIn || !glowOut || !glowIn || !wordOut || !wordIn || !textOut || !textIn || !decorOut || !decorIn) {
      currentRef.current = next; setIdx(next); isTransitioning.current = false; return
    }

    // ——— guarantee incoming ready before any visual change ———
    try {
      await preloadImage(nextSlide.asset)
      await Promise.all(nextSlide.decorations.map(d => preloadImage(d.src).catch(() => {})))
    } catch (e) {
      console.warn('[hero] preload failed, aborting transition', nextSlide.asset, e)
      isTransitioning.current = false
      return
    }

    if (reduced) {
      bgIn.style.background = nextSlide.bg
      glowIn.style.background = nextSlide.glow
      wordIn.textContent = nextSlide.bgWord
      wordIn.style.color = wordColorFor(nextSlide)
      wordIn.style.webkitTextStroke = wordStrokeFor(nextSlide) as string
      textIn.style.color = fgFor(nextSlide)
      renderTextLayer(textIn, nextSlide)
      // decor — build incoming
      buildDecorLayer(decorIn, nextSlide)
      // z-index swap — wrappers hold product zIndex, not imgs
      const wrapOut = activeIsA.current ? prodAWrapRef.current : prodBWrapRef.current
      const wrapIn  = activeIsA.current ? prodBWrapRef.current : prodAWrapRef.current
      bgIn.style.zIndex = '2'; bgOut.style.zIndex = '1'
      glowIn.style.zIndex = '2'; glowOut.style.zIndex = '1'
      wordIn.style.zIndex = '3'; wordOut.style.zIndex = '2'
      decorIn.style.zIndex = '4'; decorOut.style.zIndex = '3'
      if (wrapOut && wrapIn) { wrapIn.style.zIndex = '5'; wrapOut.style.zIndex = '4' }
      textIn.style.zIndex = '6'; textOut.style.zIndex = '5'
      gsap.set([bgIn, glowIn, wordIn, textIn, prodIn, decorIn], { opacity: 1 })
      gsap.set([bgOut, glowOut, wordOut, textOut, prodOut, decorOut], { opacity: 0 })
      currentRef.current = next; setIdx(next)
      activeIsA.current = !activeIsA.current
      isTransitioning.current = false
      if (import.meta.env.DEV) console.table({ label: 'reduced goTo end', current: currentRef.current, idx: next, active: activeIsA.current ? 'A' : 'B', srcA: prodARef.current?.src.slice(-30), srcB: prodBRef.current?.src.slice(-30) })
      if (pending.current !== null && pending.current !== next) { const p = pending.current; pending.current = null; void goTo(p) }
      return
    }

    killIdle()
    killDecorIdle(decorOut)
    killDecorIdle(decorIn)
    if (glowOutIdle) glowOutIdle.pause()
    pauseAutoplay()

    const vw = window.innerWidth
    const TRAVEL = vw * 0.62
    const DUR = 1.72

    // prepare incoming layers fully before animating
    prodIn.src = nextSlide.asset
    prodIn.alt = nextSlide.alt
    bgIn.style.background = nextSlide.bg
    glowIn.style.background = nextSlide.glow
    wordIn.textContent = nextSlide.bgWord
    wordIn.style.color = wordColorFor(nextSlide)
    wordIn.style.webkitTextStroke = wordStrokeFor(nextSlide) as string
    textIn.style.color = fgFor(nextSlide)
    renderTextLayer(textIn, nextSlide)
    // decor — build incoming, keep A/B principle
    buildDecorLayer(decorIn, nextSlide)
    decorIn.style.zIndex = '4'; decorOut.style.zIndex = '3'

    // z-index: incoming on top — wrappers own product stacking
    const wrapOut = activeIsA.current ? prodAWrapRef.current : prodBWrapRef.current
    const wrapIn  = activeIsA.current ? prodBWrapRef.current : prodAWrapRef.current
    bgIn.style.zIndex = '2'; bgOut.style.zIndex = '1'
    glowIn.style.zIndex = '2'; glowOut.style.zIndex = '1'
    wordIn.style.zIndex = '3'; wordOut.style.zIndex = '2'
    if (wrapOut && wrapIn) { wrapIn.style.zIndex = '5'; wrapOut.style.zIndex = '4' }
    textIn.style.zIndex = '6'; textOut.style.zIndex = '5'

    // ensure decode + complete before crossfade
    try {
      if (!prodIn.complete || prodIn.naturalWidth === 0) {
        await new Promise<void>((res, rej) => {
          const onLoad = () => { prodIn.removeEventListener('load', onLoad); prodIn.removeEventListener('error', onErr); res() }
          const onErr = () => { prodIn.removeEventListener('load', onLoad); prodIn.removeEventListener('error', onErr); rej(new Error('img load error')) }
          prodIn.addEventListener('load', onLoad, { once: true })
          prodIn.addEventListener('error', onErr, { once: true })
        })
      }
      const d = (prodIn as unknown as { decode?: () => Promise<void> }).decode
      if (d) await d.call(prodIn).catch(() => {})
      if (prodIn.naturalWidth === 0) throw new Error('naturalWidth 0')
    } catch (e) {
      console.warn('[hero] incoming decode failed, aborting', e)
      isTransitioning.current = false
      return
    }

    gsap.killTweensOf([prodOut, prodIn, bgOut, bgIn, glowOut, glowIn, wordOut, wordIn, textOut, textIn, decorOut, decorIn, ...Array.from(decorOut.children), ...Array.from(decorIn.children)])

    gsap.set(prodIn,  { x: direction * TRAVEL, y: direction * 16, rotation: -direction * rotIn, scale: nextSlide.scale * 1.06, opacity: 0, filter: 'blur(12px)' })
    gsap.set(prodOut, { x: 0, y: 0, rotation: 0, scale: prevSlide.scale, opacity: 1, filter: 'blur(0px)' })
    gsap.set(bgIn,   { opacity: 0 })
    gsap.set(glowIn, { opacity: 0 })
    gsap.set(wordIn, { x: direction * 70, opacity: 0, scale: 0.96 })
    gsap.set(textIn, { y: 18, opacity: 0 })
    gsap.set(decorIn, { opacity: 0 })
    gsap.set(decorOut, { opacity: 1 })
    Array.from(decorIn.children).forEach((el, i) => {
      gsap.set(el, { x: direction * (70 + i * 22), y: direction * 10, rotation: -direction * 14, opacity: 0, scale: 0.88 })
    })
    Array.from(decorOut.children).forEach((el) => {
      gsap.set(el, { x: 0, y: 0, rotation: parseFloat((el as HTMLElement).dataset.depth || '0'), opacity: 1, scale: 1 })
    })

    const tl = gsap.timeline({
      onComplete: () => {
        currentRef.current = next
        setIdx(next)
        activeIsA.current = !activeIsA.current
        isTransitioning.current = false
        // explicit normalize
        gsap.set(prodOut, { x: 0, y: 0, rotation: 0, scale: prevSlide.scale, opacity: 0, filter: 'blur(0px)', clearProps: 'transform' })
        gsap.set(prodIn,  { x: 0, y: 0, rotation: 0, rotationY: 0, rotationX: 0, scale: nextSlide.scale, opacity: 1, filter: 'blur(0px)', clearProps: 'transform' })
        // re-apply scale after clear
        gsap.set(prodIn, { scale: nextSlide.scale })
        gsap.set(bgOut, { opacity: 0 })
        gsap.set(glowOut, { opacity: 0 })
        gsap.set(wordOut, { opacity: 0, x: 0, scale: 1 })
        gsap.set(textOut, { opacity: 0, y: 0 })
        gsap.set(bgIn, { opacity: 1 })
        gsap.set(glowIn, { opacity: 1 })
        gsap.set(wordIn, { opacity: 1, x: 0, scale: 1 })
        gsap.set(textIn, { opacity: 1, y: 0 })
        gsap.set(decorOut, { opacity: 0 })
        gsap.set(decorIn, { opacity: 1 })
        Array.from(decorIn.children).forEach(el => gsap.set(el, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 }))
        // normalize z-index (incoming becomes current A/B for next cycle)
        startIdle(prodIn)
        startDecorIdle(decorIn)
        // glow breathing swap
        if (!reduced) {
          if (glowOutIdle) { glowOutIdle.pause(); gsap.set(glowOut, { scale: 1 }) }
          if (glowInIdle) glowInIdle.play()
          else {
            const fallback = activeIsA.current ? glowIdleB.current : glowIdleA.current
            if (fallback) fallback.play()
          }
        }
        debugHero(`after ${prev}→${next}`)
        if (pending.current !== null && pending.current !== next) { const p = pending.current; pending.current = null; const d = p > next ? 1 : -1; void goTo(p, d) }
      }
    })

    // OUT: product flies with heavy rotation
    tl.to(prodOut, { x: -direction * TRAVEL, y: direction * -18, rotation: direction * rotOut, scale: prevSlide.scale * 0.88, opacity: 0, filter: 'blur(9px)', duration: DUR, ease: 'power4.inOut' }, 0)
    tl.to(prodIn,  { x: 0, y: 0, rotation: 0, scale: nextSlide.scale, opacity: 1, filter: 'blur(0px)', duration: DUR, ease: 'power4.inOut' }, 0)

    // BG crossfade — only after incoming is guaranteed ready (above)
    tl.to(bgIn,   { opacity: 1, duration: DUR, ease: 'power2.inOut' }, 0)
    tl.to(glowIn, { opacity: 1, duration: DUR * 0.85, ease: 'power2.out' }, 0.08)
    tl.to(bgOut,  { opacity: 0, duration: DUR * 0.6, ease: 'power2.in' }, 0)
    tl.to(glowOut,{ opacity: 0, duration: DUR * 0.5, ease: 'power2.in' }, 0)

    // bgWord
    tl.to(wordOut, { x: -direction * 90, opacity: 0, scale: 0.92, duration: DUR * 0.55, ease: 'power3.in' }, 0.04)
    tl.to(wordIn,  { x: 0, opacity: 1, scale: 1, duration: DUR * 0.72, ease: 'power3.out' }, DUR * 0.28)

    // dual text crossfade (no reliance on isDark global)
    tl.to(textOut, { y: -18, opacity: 0, duration: 0.32, ease: 'power2.in' }, 0.12)
    tl.to(textIn,  { y: 0, opacity: 1, duration: 0.48, ease: 'power3.out' }, DUR * 0.38)

    // decor — enter/exit choreographed with product (1.72s)
    tl.to(decorOut, { opacity: 0, duration: DUR * 0.52, ease: 'power2.in' }, 0.10)
    tl.to(decorIn,  { opacity: 1, duration: DUR * 0.58, ease: 'power2.out' }, DUR * 0.24)
    if (decorOut.children.length) {
      tl.to(Array.from(decorOut.children), { x: -direction * 85, y: direction * -16, rotation: direction * 16, opacity: 0, scale: 0.88, duration: DUR * 0.62, stagger: 0.06, ease: 'power3.in' }, 0.08)
    }
    if (decorIn.children.length) {
      tl.to(Array.from(decorIn.children), { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: DUR * 0.72, stagger: 0.07, ease: 'power3.out' }, DUR * 0.28)
    }

  }, [reduced, pauseAutoplay])

  useEffect(() => { currentRef.current = idx }, [idx])

  useEffect(() => { scheduleAutoplay(); return () => { if (autoplayTimer.current) clearInterval(autoplayTimer.current); if (resumeTimer.current) clearTimeout(resumeTimer.current) } }, [scheduleAutoplay])

  // cursor tilt on active product only
  // cursor tilt + decor parallax (depth)
  useEffect(() => {
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return
    const stage = stageRef.current
    if (!stage) return
    let raf = 0
    const onMove = (e: MouseEvent) => {
      const active = activeIsA.current ? prodARef.current : prodBRef.current
      const decor = activeIsA.current ? decorARef.current : decorBRef.current
      if (!active || isTransitioning.current) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = stage.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        gsap.to(active, { x: x * 14, y: y * 10, rotationY: x * 6, rotationX: -y * 4, duration: 0.7, ease: 'power3.out', overwrite: 'auto' })
        if (decor) {
          Array.from(decor.children).forEach((el) => {
            const d = parseFloat((el as HTMLElement).dataset.depth || '0.4')
            gsap.to(el, { x: x * 16 * d, y: y * 12 * d, duration: 0.8, ease: 'power3.out', overwrite: 'auto' })
          })
        }
      })
    }
    const onLeave = () => {
      const active = activeIsA.current ? prodARef.current : prodBRef.current
      const decor = activeIsA.current ? decorARef.current : decorBRef.current
      if (active) gsap.to(active, { x: 0, y: 0, rotationY: 0, rotationX: 0, duration: 0.8, ease: 'power3.out' })
      if (decor) gsap.to(Array.from(decor.children), { x: 0, y: 0, duration: 0.9, ease: 'power3.out' })
    }
    stage.addEventListener('mousemove', onMove)
    stage.addEventListener('mouseleave', onLeave)
    return () => { stage.removeEventListener('mousemove', onMove); stage.removeEventListener('mouseleave', onLeave); cancelAnimationFrame(raf) }
  }, [reduced, idx])

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); pauseAutoplay(); void goTo((currentRef.current + 1) % SLIDES.length, 1) }
      if (e.key === 'ArrowLeft') { e.preventDefault(); pauseAutoplay(); void goTo((currentRef.current - 1 + SLIDES.length) % SLIDES.length, -1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goTo, pauseAutoplay])

  // swipe
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    let sx = 0
    const onStart = (e: TouchEvent) => { sx = e.touches[0].clientX }
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx
      if (Math.abs(dx) > 44) {
        pauseAutoplay()
        void goTo(dx < 0 ? (currentRef.current + 1) % SLIDES.length : (currentRef.current - 1 + SLIDES.length) % SLIDES.length, dx < 0 ? 1 : -1)
      }
    }
    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchend', onEnd, { passive: true })
    return () => { el.removeEventListener('touchstart', onStart); el.removeEventListener('touchend', onEnd) }
  }, [goTo, pauseAutoplay])

  // resize — rebuild decor for current slide (mobile/desktop switch)
  useEffect(() => {
    const onResize = () => {
      if (isTransitioning.current) return
      const d = activeIsA.current ? decorARef.current : decorBRef.current
      if (!d) return
      killDecorIdle(d)
      buildDecorLayer(d, SLIDES[currentRef.current])
      gsap.set(d, { opacity: 1 })
      startDecorIdle(d)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const nextIdx = (idx + 1) % SLIDES.length
  const prevIdx = (idx - 1 + SLIDES.length) % SLIDES.length

  // helper for non-text UI to get current fg synchronously (initial render)
  const curFg = fgFor(slide)
  const curFgMuted = fgMutedFor(slide)

  return (
    <section
      ref={stageRef}
      aria-roledescription="carousel"
      aria-label="Vitrine Best"
      className="relative w-full overflow-hidden select-none"
      style={{ height: '100svh', minHeight: '100dvh' }}
      onMouseEnter={() => { if (autoplayTimer.current) { clearInterval(autoplayTimer.current); autoplayTimer.current = null } }}
      onMouseLeave={() => scheduleAutoplay()}
    >
      {/* bg layers — no reactive opacity/zIndex in JSX, GSAP owns them */}
      <div ref={bgARef} className="absolute inset-0" />
      <div ref={bgBRef} className="absolute inset-0" />
      <div ref={glowARef} className="absolute inset-0 pointer-events-none" />
      <div ref={glowBRef} className="absolute inset-0 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '72px 72px', zIndex: 2 }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 42%, rgba(0,0,0,.06) 100%)', opacity: slide.textColor === 'dark' ? 0.6 : 0, zIndex: 2 }} />

      {/* hairline — uses current fg */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-[76px] z-20 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${curFgMuted}, transparent)` }} />

      {/* bg word layers — GSAP owns opacity/zIndex/color */}
      <div
        ref={bgWordARef}
        aria-hidden
        className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 font-[Barlow_Condensed] font-black leading-none tracking-[-0.03em] whitespace-nowrap pointer-events-none will-change-transform"
        style={{ fontSize: 'clamp(5rem, 18vw, 21rem)' }}
      />
      <div
        ref={bgWordBRef}
        aria-hidden
        className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 font-[Barlow_Condensed] font-black leading-none tracking-[-0.03em] whitespace-nowrap pointer-events-none will-change-transform"
        style={{ fontSize: 'clamp(5rem, 18vw, 21rem)' }}
      />

      {/* decor layers A/B — GSAP-owned, each holds per-slide decorations */}
      <div ref={decorARef} className="absolute inset-0 pointer-events-none" />
      <div ref={decorBRef} className="absolute inset-0 pointer-events-none" />

      {/* products stack — wrappers own drop-shadow + zIndex, imgs are GSAP-only (no src/opacity/filter in JSX) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 5 }}>
        <div ref={prodAWrapRef} className="absolute flex items-center justify-center pointer-events-none" style={{ width: 'min(68vw, 720px)', height: 'min(68vw, 720px)', maxWidth: '88vw' }}>
          <img ref={prodARef} width={860} height={860} decoding="async" draggable={false} className="absolute object-contain will-change-transform select-none" style={{ width: '100%', height: '100%' }} />
        </div>
        <div ref={prodBWrapRef} className="absolute flex items-center justify-center pointer-events-none" style={{ width: 'min(68vw, 720px)', height: 'min(68vw, 720px)', maxWidth: '88vw' }}>
          <img ref={prodBRef} width={860} height={860} decoding="async" draggable={false} className="absolute object-contain will-change-transform select-none" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      {/* dual text layers — GSAP owns opacity/y/zIndex/color */}
      <div className="absolute z-20 left-6 md:left-10 lg:left-[6vw] bottom-[104px] md:bottom-[92px] max-w-[420px] pointer-events-none">
        <div ref={textARef} className="absolute bottom-0 left-0 will-change-transform" />
        <div ref={textBRef} className="absolute bottom-0 left-0 will-change-transform" />
        {/* spacer to keep container height */}
        <div aria-hidden className="invisible">
          <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, letterSpacing: '0.22em' }}>{slide.brand}</div>
          <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 900, lineHeight: 0.86, fontSize: 'clamp(2.8rem,7vw,5.6rem)' }}>{slide.name}{slide.name2 ? <><br />{slide.name2}</> : null}</h1>
          <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, marginTop: 14 }}>ARAGUATINS — AUGUSTINÓPOLIS</div>
        </div>
      </div>

      {/* right controls — minimal */}
      <div className="absolute z-20 right-6 md:right-10 bottom-[20px] md:bottom-[32px] flex flex-col items-end gap-3">
        <span className="font-[Barlow_Condensed] text-[11px] tracking-[0.28em]" style={{ color: curFgMuted }}>{String(idx + 1).padStart(2, '0')} / 05</span>
        <div className="flex items-center gap-2">
          <button aria-label="Anterior" onClick={() => { pauseAutoplay(); void goTo(prevIdx, -1) }} className="w-10 h-10 rounded-full border flex items-center justify-center transition bg-transparent backdrop-blur-md" style={{ borderColor: curFgMuted, color: curFg }}>
            <ArrowLeft size={16} strokeWidth={1.6} />
          </button>
          <button aria-label="Próximo" onClick={() => { pauseAutoplay(); void goTo(nextIdx, 1) }} className="w-10 h-10 rounded-full border flex items-center justify-center transition" style={{ background: curFg, color: slide.textColor === 'dark' ? '#fff' : '#000', borderColor: curFg }}>
            <ArrowRight size={16} strokeWidth={1.6} />
          </button>
        </div>
        <a href="https://www.instagram.com/bestmultimarcasaraguatins/" target="_blank" rel="noreferrer" className="hidden md:inline-flex items-center gap-1.5 font-[Inter] text-[11px] tracking-[0.16em] underline-offset-4 hover:underline" style={{ color: fgSubtleFor(slide) }}>VER NO INSTAGRAM <ArrowUpRight size={12} /></a>
      </div>

      {/* dots — discrete, color driven by current fg but tweened in timeline via inline update after transition */}
      <div className="absolute z-20 left-1/2 -translate-x-1/2 bottom-[26px] md:bottom-[36px] flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button key={i} aria-label={`Ir para ${i + 1}`} onClick={() => { pauseAutoplay(); void goTo(i, i > idx ? 1 : -1) }} className="h-[2px] rounded-full transition-all duration-500" style={{ width: i === idx ? 28 : 14, background: i === idx ? curFg : curFgMuted, opacity: i === idx ? 1 : 0.55 }} />
        ))}
      </div>

      <style>{`@media(max-width:767px){img[alt]{width:min(88vw, 520px)!important;height:min(88vw,520px)!important}}`}</style>
    </section>
  )
}

// ── NOVA UNIDADE ────────────────────────────────────────────────────────────

function NovaUnidade() {
  const { d, h, m, s, isPast } = useCountdown('2026-09-11T09:00:00-03:00')
  return (
    <section id="nova-unidade" className="bg-[#080808] text-white border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-start">
          <div>
            <div className="font-[Inter] text-[11px] tracking-[0.28em] text-white/40 flex items-center gap-2"><span className="w-6 h-px bg-[#D71920]" /> NOVA UNIDADE</div>
            <h2 className="font-[Barlow_Condensed] font-black leading-[0.88] tracking-[-0.04em] mt-4" style={{ fontSize: 'clamp(3rem, 8vw, 6.8rem)' }}>
              AUGUS<br /><span className="text-transparent" style={{ WebkitTextStroke: '1.3px #fff' }}>TINÓPOLIS</span>
            </h2>
            <div className="mt-5 font-[Barlow_Condensed] tracking-[0.14em] text-sm">
              <span className="bg-[#D71920] text-white px-3 py-1.5">11.09.2026</span> <span className="border border-white/15 px-3 py-1.5 ml-2">09:00</span>
            </div>
            <p className="mt-6 font-[Inter] text-[14px] leading-[1.75] text-white/60 max-w-[44ch]">A BEST chega a Augustinópolis. Mesma curadoria, novas paredes. Duas cidades, uma só ideia.</p>
            <a href="https://www.instagram.com/bestmultimarcasaugustinopolis/" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 bg-white text-black font-[Barlow_Condensed] tracking-[0.14em] text-sm px-5 py-2.5 hover:bg-white/90 transition">VER NO INSTAGRAM <ArrowUpRight size={14} /></a>
          </div>

          <div>
            {isPast ? (
              <div className="bg-white text-black p-8 md:p-10 relative overflow-hidden">
                <div className="font-[Inter] text-[11px] tracking-[0.22em] text-black/40">AGORA EM AUGUSTINÓPOLIS</div>
                <div className="font-[Barlow_Condensed] font-black text-[2.6rem] leading-[0.9] mt-2">A BEST<br />CHEGOU.</div>
                <p className="mt-3 text-sm leading-[1.6] text-black/60">Nossa nova unidade já está atendendo.</p>
              </div>
            ) : (
              <div className="border border-white/10 p-6 md:p-7">
                <div className="font-[Inter] text-[11px] tracking-[0.22em] text-white/40">CONTAGEM PARA A INAUGURAÇÃO</div>
                <div className="grid grid-cols-4 gap-2.5 mt-5">
                  {[[d, 'DIAS'], [h, 'HORAS'], [m, 'MIN'], [s, 'SEG']].map(([v, l]) => (
                    <div key={l as string} className="bg-white text-black text-center py-4">
                      <div className="font-[Barlow_Condensed] font-black text-[1.9rem] leading-none">{String(v).padStart(2, '0')}</div>
                      <div className="font-[Inter] text-[10px] tracking-[0.18em] text-black/40 mt-1">{l as string}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 font-[Inter] text-[11px] tracking-[0.16em] text-white/35 flex justify-between"><span>11.09.2026 — 09:00</span><span>AUGUSTINÓPOLIS — TO</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── VARIEDADE ───────────────────────────────────────────────────────────────

function Variedade() {
  return (
    <section id="variedade" className="bg-[#F7F5F0] text-[#0A0A0A] py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="max-w-[720px]">
          <h2 className="font-[Barlow_Condensed] font-black leading-[0.9] tracking-[-0.04em]" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.6rem)' }}>MUITO<br />ALÉM DISSO<span className="text-[#D71920]">.</span></h2>
          <p className="mt-4 font-[Inter] text-[15px] leading-[1.7] text-black/55">Tênis, camisetas, jaquetas, kits, bermudas, bonés e novidades de diversas marcas.</p>
          <p className="mt-2 font-[Inter] text-[13px] leading-[1.7] text-black/45">Novas peças chegando sempre.</p>
        </div>

        <div className="mt-10 border-t border-black/10 pt-8">
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-[Barlow_Condensed] font-black tracking-[-0.02em] leading-none" style={{ fontSize: 'clamp(1.6rem, 4.5vw, 3.2rem)' }}>
            {['TÊNIS', 'CAMISETAS', 'JAQUETAS', 'KITS', 'BERMUDAS', 'BONÉS'].map((c) => (
              <span key={c} className="text-[#0A0A0A]">{c}</span>
            ))}
          </div>
          <div className="mt-3 h-px bg-black/10" />
          <div className="mt-3 font-[Inter] text-xs tracking-[0.16em] text-black/40">NOVIDADES • VARIEDADE • ESTILO</div>
        </div>
      </div>
    </section>
  )
}

// ── MARCAS ─────────────────────────────────────────────────────────────────

function Marcas() {
  return (
    <section id="marcas" className="bg-[#0A0A0A] text-white py-16 md:py-20 border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="font-[Inter] text-[11px] tracking-[0.28em] text-white/35 flex items-center gap-2"><span className="w-6 h-px bg-white/15" /> MARCAS</div>
        <div className="mt-4 font-[Barlow_Condensed] font-black tracking-[-0.04em] leading-[0.86]" style={{ fontSize: 'clamp(3rem, 11vw, 9rem)' }}>
          <div>NIKE</div>
          <div className="text-transparent" style={{ WebkitTextStroke: '1.3px #fff' }}>ADIDAS</div>
          <div>DIESEL</div>
        </div>
        <p className="mt-6 font-[Inter] text-sm leading-[1.7] text-white/50 max-w-[520px]">Algumas das marcas presentes na BEST. A vitrine acima mostra apenas exemplos visuais — o mix da loja vai muito além.</p>
      </div>
    </section>
  )
}

// ── LOJAS ──────────────────────────────────────────────────────────────────

function Lojas() {
  return (
    <section id="lojas" className="bg-[#F7F5F0] text-[#0A0A0A] py-16 md:py-20 border-t border-black/5">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="font-[Inter] text-[11px] tracking-[0.28em] text-black/40 flex items-center gap-2"><span className="w-6 h-px bg-black/15" /> NOSSAS LOJAS</div>
        <div className="mt-10 grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <div className="font-[Barlow_Condensed] font-black text-[1.9rem] leading-none tracking-[-0.02em]">ARAGUATINS</div>
            <div className="mt-2 font-[Inter] text-sm leading-[1.6] text-black/60">Rua Siqueira Campos<br />Ao lado da Cacau Show<br />Araguatins — Tocantins</div>
            <a href="https://www.instagram.com/bestmultimarcasaraguatins/" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 font-[Barlow_Condensed] tracking-[0.14em] text-sm underline underline-offset-4">VER NO INSTAGRAM <InstagramIcon width={14} height={14} /></a>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 bg-[#D71920] text-white font-[Inter] text-[10px] tracking-[0.18em] px-2.5 py-1">NOVA UNIDADE</div>
            <div className="font-[Barlow_Condensed] font-black text-[1.9rem] leading-none tracking-[-0.02em] mt-3">AUGUSTINÓPOLIS</div>
            <div className="mt-2 font-[Inter] text-sm leading-[1.6] text-black/60">Nova unidade<br />11.09.2026 — 09:00<br />Augustinópolis — Tocantins</div>
            <a href="https://www.instagram.com/bestmultimarcasaugustinopolis/" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 font-[Barlow_Condensed] tracking-[0.14em] text-sm underline underline-offset-4">VER NO INSTAGRAM <InstagramIcon width={14} height={14} /></a>
          </div>
        </div>
        <div className="mt-10 h-px bg-black/10" />
        <div className="mt-4 flex items-center gap-2 font-[Inter] text-xs tracking-[0.16em] text-black/40"><MapPin size={14} /> TOCANTINS — BRASIL</div>
      </div>
    </section>
  )
}

function BrasilStrip() {
  return (
    <section className="bg-[#D71920] text-white">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="font-[Barlow_Condensed] font-black leading-[0.9] tracking-[-0.03em]" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.4rem)' }}>DO TOCANTINS<br /><span className="text-transparent" style={{ WebkitTextStroke: '1.2px #fff' }}>PARA O BRASIL</span></div>
        <div className="font-[Barlow_Condensed] font-bold tracking-[-0.01em] text-lg md:text-xl">ENVIAMOS PARA TODO O BRASIL</div>
      </div>
    </section>
  )
}

function InstagramSection() {
  return (
    <section id="contato" className="bg-[#080808] text-white py-16 md:py-20 border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="font-[Inter] text-[11px] tracking-[0.28em] text-white/35 flex items-center gap-2"><span className="w-6 h-px bg-white/15" /> ACOMPANHE A BEST</div>
        <h2 className="font-[Barlow_Condensed] font-black leading-[0.88] tracking-[-0.04em] mt-3" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.6rem)' }}>SIGA A BEST<span className="text-[#D71920]">.</span></h2>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <a href="https://www.instagram.com/bestmultimarcasaraguatins/" target="_blank" rel="noreferrer" className="border border-white/10 p-6 md:p-8 flex flex-col justify-between min-h-[180px] hover:border-white/20 transition group">
            <div>
              <div className="font-[Inter] text-[11px] tracking-[0.18em] text-white/40 flex items-center gap-2"><InstagramIcon width={12} height={12} /> ARAGUATINS</div>
              <div className="font-[Barlow_Condensed] font-bold tracking-[0.04em] text-xl mt-3">@bestmultimarcasaraguatins</div>
              <div className="font-[Inter] text-xs text-white/45 mt-1">Rua Siqueira Campos — ao lado da Cacau Show</div>
            </div>
            <div className="mt-6 font-[Barlow_Condensed] tracking-[0.14em] text-sm flex items-center gap-2 group-hover:gap-3 transition-all">ABRIR INSTAGRAM <ArrowUpRight size={14} /></div>
          </a>

          <a href="https://www.instagram.com/bestmultimarcasaugustinopolis/" target="_blank" rel="noreferrer" className="bg-white text-black p-6 md:p-8 flex flex-col justify-between min-h-[180px] hover:bg-white/95 transition group">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#D71920] text-white font-[Inter] text-[10px] tracking-[0.16em] px-2.5 py-1"><span className="w-2 h-2 bg-white rounded-full animate-pulse" /> NOVA • 11.09.2026</div>
              <div className="font-[Barlow_Condensed] font-bold tracking-[0.04em] text-xl mt-3">@bestmultimarcasaugustinopolis</div>
              <div className="font-[Inter] text-xs text-black/50 mt-1">Nova unidade — Augustinópolis</div>
            </div>
            <div className="mt-6 font-[Barlow_Condensed] tracking-[0.14em] text-sm flex items-center gap-2 group-hover:gap-3 transition-all">ABRIR INSTAGRAM <ArrowUpRight size={14} /></div>
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-[#050505] text-white border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-wrap justify-between gap-6">
          <div>
            <div className="font-[Barlow_Condensed] font-black tracking-[0.18em]">BEST MULTIMARCAS</div>
            <div className="font-[Inter] text-xs tracking-[0.14em] text-white/35 mt-1">ARAGUATINS • AUGUSTINÓPOLIS • TOCANTINS — BRASIL</div>
          </div>
          <div className="flex gap-5 font-[Inter] text-xs tracking-[0.12em] text-white/40">
            <a href="https://www.instagram.com/bestmultimarcasaraguatins/" target="_blank" rel="noreferrer" className="hover:text-white transition">ARAGUATINS</a>
            <a href="https://www.instagram.com/bestmultimarcasaugustinopolis/" target="_blank" rel="noreferrer" className="hover:text-white transition">AUGUSTINÓPOLIS</a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 font-[Inter] text-[11px] tracking-[0.14em] text-white/25 flex flex-wrap justify-between gap-3">
          <span>© 2026 BEST MULTIMARCAS</span>
          <span>11.09.2026 — NOVA UNIDADE</span>
        </div>
      </div>
    </footer>
  )
}

function Marquee() {
  return (
    <div className="bg-[#0A0A0A] border-y border-white/5 overflow-hidden">
      <div className="flex whitespace-nowrap py-2.5" style={{ animation: 'marquee 22s linear infinite' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="font-[Barlow_Condensed] font-bold tracking-[0.18em] text-[11px] text-white/30 mx-8">BEST MULTIMARCAS • ARAGUATINS • AUGUSTINÓPOLIS • 11.09.2026 • DO TOCANTINS PARA O BRASIL •</span>
        ))}
      </div>
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  )
}

export default function App() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          gsap.fromTo(e.target, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' })
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.12 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#080808]">
      <Header onNav={scrollTo} />
      <HeroSlider />
      <div data-reveal><NovaUnidade /></div>
      <div data-reveal><Variedade /></div>
      <Marquee />
      <div data-reveal><Marcas /></div>
      <div data-reveal><Lojas /></div>
      <BrasilStrip />
      <div data-reveal><InstagramSection /></div>
      <Footer />
    </div>
  )
}
