import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Menu, X, MapPin, ArrowLeft, ArrowRight } from 'lucide-react'
import LaunchHero from './LaunchHero'

gsap.registerPlugin(ScrollTrigger)
// keep helpers for typecheck (used in new hero via closure, not direct import)
void gsap

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

// ── HERO — rebuilt from Nike Slider mechanics (zero autoplay) ─────────────────────────────────
// Fidelidade à referência: 500vh→600vh para 5 slides, sticky 100svh, track 500vw, produto clamp(380px,68vw,860px),
// bg-text clamp(6rem,20vw,19rem), DUR 1.9, EXIT_DUR 0.588*DUR, TRAVEL 0.88*vw, rotation 290, back.in(0.8)/power4.inOut,
// idle kbTween scale 1.06 dur8 + wobble 5deg, float IDLE_CFG, getPx/entryY/transitionFloats idênticos.
// Zero autoplay: nenhum setInterval para troca de slide.

function HeroSlider() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const floatRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)

  const TOTAL = SLIDES.length

  // BEST floats — mesmas posições da referência para DUNK, adaptadas para jaqueta/boné
  const BEST_FLOATS: Array<Array<{src:string,x:number,y:number,r:number,w:number}>> = [
    [
      { src: '/decorations/dunk-swoosh.png', x: 13, y: 16, r: 10, w: 290 },
      { src: '/decorations/dunk-toecap.png', x: 83, y: 16, r: -15, w: 300 },
      { src: '/decorations/dunk-heel.png', x: 83, y: 70, r: -8, w: 200 },
    ],
    [],
    [
      { src: '/decorations/dunk-heel.png', x: 13, y: 16, r: 10, w: 290 },
      { src: '/decorations/dunk-toecap.png', x: 83, y: 16, r: -15, w: 300 },
    ],
    [],
    [
      { src: '/decorations/statue-of-liberty.png', x: 13, y: 16, r: 6, w: 220 },
      { src: '/decorations/ny-logo.png', x: 83, y: 16, r: -8, w: 300 },
      { src: '/decorations/statue-of-liberty.png', x: 83, y: 70, r: -8, w: 180 },
    ],
  ]

  useEffect(() => {
    const wrap = wrapRef.current
    const sticky = stickyRef.current
    const track = trackRef.current
    const stage = stageRef.current
    if (!wrap || !sticky || !track || !stage) return

    const slides = Array.from(track!.querySelectorAll<HTMLElement>('.slide'))
    const stageProds = Array.from(stage.querySelectorAll<HTMLImageElement>('.stage-prod'))
    const floatItems = Array.from(floatRef.current?.querySelectorAll<HTMLImageElement>('.float-item') ?? [])
    const dots = Array.from(dotsRef.current?.querySelectorAll<HTMLElement>('.dot') ?? [])
    const counterEl = counterRef.current
    const infoEl = infoRef.current
    const brandEl = brandRef.current
    const nameEl = nameRef.current

    let current = 0
    let isTransitioning = false
    let pendingIdx = -1
    let pendingDir = 0
    let currentTl: gsap.core.Timeline | null = null
    let kbTween: gsap.core.Tween | null = null
    let wobbleTl: gsap.core.Timeline | null = null

    const SLIDE_TEXT = SLIDES.map(s => ({ name: s.name + (s.name2 ? ' ' + s.name2 : ''), brand: s.brand }))
    const SLIDE_DARK = SLIDES.map(s => s.textColor === 'light') // true = dark bg needs light UI

    function updateSlideUI(idx: number) {
      document.body.dataset.heroDark = String(SLIDE_DARK[idx])
      // keep header readable: data attr can be used in CSS if needed
    }

    function getPx(cfg: {x:number,y:number,w:number}) {
      const mob = window.innerWidth < 768
      const w = mob ? cfg.w * 0.55 : cfg.w
      return { left: cfg.x / 100 * window.innerWidth - w / 2, top: cfg.y / 100 * window.innerHeight, width: w }
    }

    const IDLE_CFG = [
      { dur: 3.2, tx: -10, ty1: -14, ty2: 9, r0: 12, r1: 20, r2: 5 },
      { dur: 2.8, tx: 10, ty1: -14, ty2: 9, r0: -8, r1: -16, r2: -2 },
      { dur: 3.6, tx: -6, ty1: -14, ty2: 9, r0: 20, r1: 28, r2: 14 },
    ]

    function startIdleFloat(item: HTMLElement, i: number) {
      const c = IDLE_CFG[i % IDLE_CFG.length]
      const tl = gsap.timeline({ repeat: -1, delay: i * 0.4 })
      tl.to(item, { x: c.tx, y: c.ty1, rotation: c.r1, duration: c.dur * 0.33, ease: 'sine.inOut' })
        .to(item, { x: c.tx * -0.5, y: c.ty2, rotation: c.r2, duration: c.dur * 0.33, ease: 'sine.inOut' })
        .to(item, { x: 0, y: 0, rotation: c.r0, duration: c.dur * 0.34, ease: 'sine.inOut' })
    }

    function killFloats() { floatItems.forEach(el => gsap.killTweensOf(el)) }

    function entryY(cfg: {y:number,w:number}) {
      const vh = window.innerHeight, pos = cfg.y / 100 * vh, peek = 20
      return cfg.y < 50 ? 2 * (peek - pos - cfg.w) : 2 * (vh - peek - pos)
    }

    function placeFloats(idx: number) {
      BEST_FLOATS[idx]?.forEach((cfg, i) => {
        if (!floatItems[i]) return
        const px = getPx(cfg)
        floatItems[i].src = cfg.src
        gsap.set(floatItems[i], { left: px.left, top: px.top, width: px.width, x: 0, y: 0, rotation: cfg.r, opacity: 0, scale: 0.25 })
      })
      // hide unused
      for (let i = (BEST_FLOATS[idx]?.length ?? 0); i < floatItems.length; i++) {
        gsap.set(floatItems[i], { opacity: 0, scale: 0.25 })
      }
    }

    function entryFloats(idx: number) {
      killFloats()
      BEST_FLOATS[idx]?.forEach((cfg, i) => {
        if (!floatItems[i]) return
        const px = getPx(cfg)
        floatItems[i].src = cfg.src
        gsap.set(floatItems[i], { left: px.left, top: px.top, width: px.width, x: 0, y: entryY(cfg), rotation: cfg.r, opacity: 0, scale: 1 })
        gsap.to(floatItems[i], { y: 0, opacity: 1, duration: 0.65, delay: i * 0.09, ease: 'power3.out', onComplete() { startIdleFloat(floatItems[i], i) } })
      })
    }

    function transitionFloats(prev: number, idx: number, dur: number, dir: number, exitDelay: number, entryDelay: number) {
      killFloats()
      const overlay = floatRef.current!
      const outDur = dur * 0.42, swingRot = dir * 14
      BEST_FLOATS[prev]?.forEach((cfg, i) => {
        if (!floatItems[i]) return
        const px = getPx(cfg)
        const ghost = document.createElement('img')
        ghost.className = 'float-item'
        ghost.src = floatItems[i].src
        overlay.appendChild(ghost)
        gsap.set(ghost, { left: px.left, top: px.top, width: px.width, x: 0, y: 0, rotation: cfg.r, opacity: 1 })
        gsap.to(ghost, { y: entryY(cfg), duration: outDur * 1.25, delay: exitDelay + i * 0.02, ease: 'back.in(2)', onComplete: () => ghost.remove() })
        gsap.to(ghost, { rotation: cfg.r + swingRot, opacity: 0, duration: outDur * 0.65, delay: exitDelay + i * 0.02 + outDur * 0.65, ease: 'power2.in' })
      })
      BEST_FLOATS[idx]?.forEach((cfg, i) => {
        if (!floatItems[i]) return
        const px = getPx(cfg)
        floatItems[i].src = cfg.src
        gsap.set(floatItems[i], { left: px.left, top: px.top, width: px.width, x: 0, y: entryY(cfg), opacity: 0, scale: 1, rotation: cfg.r - swingRot })
        gsap.to(floatItems[i], { y: 0, opacity: 1, rotation: cfg.r, duration: dur, delay: entryDelay, ease: 'power4.inOut', onComplete() { startIdleFloat(floatItems[i], i) } })
      })
      // hide extras
      for (let i = (BEST_FLOATS[idx]?.length ?? 0); i < floatItems.length; i++) {
        gsap.set(floatItems[i], { opacity: 0 })
      }
    }

    let demoLocked = false

    function startProductIdle(idx: number) {
      if (kbTween) kbTween.kill()
      if (wobbleTl) wobbleTl.kill()
      const prod = stageProds[idx]
      gsap.set(prod, { xPercent: -50, yPercent: -50, x: 0, rotation: 0, scale: 1, opacity: 1, rotateY: 0, y: 0 })
      kbTween = gsap.to(prod, { scale: 1.06, duration: 8, ease: 'none' })
      wobbleTl = gsap.timeline({ repeat: -1, delay: 0.8 })
      wobbleTl.to(prod, { rotation: 5, duration: 2.2, ease: 'sine.inOut' })
        .to(prod, { rotation: -5, duration: 2.2, ease: 'sine.inOut' })
        .to(prod, { rotation: 0, duration: 1.6, ease: 'sine.inOut' })
    }

    function goTo(idx: number, forcedDir?: number) {
      if (idx === current) return
      if (isTransitioning) { pendingIdx = idx; pendingDir = forcedDir ?? 0; return }
      pendingIdx = -1; pendingDir = 0; isTransitioning = true
      const prev = current; current = idx
      dots.forEach((d, i) => d.classList.toggle('active', i === idx))
      if (counterEl) counterEl.textContent = String(idx + 1).padStart(2, '0') + ' / 0' + TOTAL
      updateSlideUI(idx)
      if (kbTween) kbTween.kill(); if (wobbleTl) wobbleTl.kill(); if (currentTl) currentTl.kill()
      const outProd = stageProds[prev], inProd = stageProds[idx]
      gsap.killTweensOf(outProd); gsap.killTweensOf(inProd)
      const dir = forcedDir !== undefined ? forcedDir : (idx > prev ? 1 : -1)
      const isLooping = forcedDir !== undefined && ((forcedDir === 1 && idx < prev) || (forcedDir === -1 && idx > prev))
      const outText = slides[prev].querySelector<HTMLElement>('.bg-text')!
      const inText = slides[idx].querySelector<HTMLElement>('.bg-text')!
      gsap.killTweensOf(outText); gsap.killTweensOf(inText)
      gsap.set(outText, { x: 0, rotationY: 0, y: 0, skewX: 0, scale: 1 })
      gsap.set(inText, { x: 0, rotationY: 0, y: 0, skewX: 0, scale: 1 })
      const DUR = 1.9, EXIT_DUR = DUR * 0.588, W = 0, vw = window.innerWidth, TRAVEL = vw * 0.88
      const TEXT_DUR = 0.32
      function buildTimeline(tl: gsap.core.Timeline, useText: HTMLElement) {
        tl.to(outProd, { x: -dir * TRAVEL, rotation: dir * 290, y: dir * -25, duration: EXIT_DUR, ease: 'back.in(0.8)' }, 0)
        tl.to(outText, { x: -dir * TRAVEL, rotationY: dir * 60, y: dir * -25, duration: EXIT_DUR, ease: 'back.in(0.8)' }, 0)
        tl.to(track, { x: -idx * vw, duration: DUR * 1.1, ease: 'power4.inOut' }, W)
        tl.to(inProd, { x: 0, rotation: 0, y: 0, duration: DUR, ease: 'power4.inOut' }, W)
        tl.to(useText, { x: 0, rotationY: 0, y: 0, duration: DUR, ease: 'power4.inOut' }, W)
        if (infoEl && brandRef.current && nameRef.current) {
          tl.to(infoEl, { opacity: 0, y: -16, duration: TEXT_DUR, ease: 'power2.in' }, W + DUR * 0.18)
          tl.call(() => {
            const s = SLIDES[idx]
            if (brandRef.current) brandRef.current.textContent = s.brand
            if (nameRef.current) nameRef.current.innerHTML = s.name + (s.name2 ? '<br/>' + s.name2 : '')
            gsap.set(infoEl, { y: 20 })
          }, [], W + DUR * 0.5)
          tl.to(infoEl, { opacity: 1, y: 0, duration: TEXT_DUR * 1.4, ease: 'power2.out' }, W + DUR * 0.5 + 0.02)
        }
      }
      if (isLooping) {
        const cloneSlide = slides[idx].cloneNode(true) as HTMLElement
        const cloneText = cloneSlide.querySelector<HTMLElement>('.bg-text')!
        let targetX: number
        if (dir === 1) { track!.appendChild(cloneSlide); track!.style.width = (TOTAL + 1) * 100 + 'vw'; targetX = -TOTAL * vw }
        else { track!.insertBefore(cloneSlide, track!.firstChild); track!.style.width = (TOTAL + 1) * 100 + 'vw'; gsap.set(track!,  { x: -(prev + 1) * vw }); targetX = -prev * vw }
        gsap.set(inProd, { xPercent: -50, yPercent: -50, x: dir * TRAVEL, rotation: -dir * 290, scale: 1, opacity: 1, y: dir * 25 })
        gsap.set(outProd, { xPercent: -50, yPercent: -50, x: 0, opacity: 1, scale: 1, y: 0 })
        gsap.set(cloneText, { xPercent: -50, yPercent: -50, x: dir * TRAVEL, rotationY: -dir * 60, y: dir * 25 })
        currentTl = gsap.timeline({ onComplete() {
          cloneSlide.remove(); track!.style.width = ''; gsap.set(track!,  { x: -idx * vw })
          isTransitioning = false; gsap.set(outProd, { opacity: 0 }); gsap.set(outText, { x: 0, rotationY: 0, y: 0 })
          startProductIdle(idx)
          if (pendingIdx !== -1 && pendingIdx !== idx) { const p = pendingIdx, pd = pendingDir; pendingIdx = -1; pendingDir = 0; goTo(p, pd) }
        }})
        buildTimeline(currentTl, cloneText)
        currentTl.to(track, { x: targetX, duration: DUR * 1.1, ease: 'power4.inOut' }, W)
      } else {
        gsap.set(inProd, { xPercent: -50, yPercent: -50, x: dir * TRAVEL, rotation: -dir * 290, scale: 1, opacity: 1, y: dir * 25 })
        gsap.set(outProd, { xPercent: -50, yPercent: -50, x: 0, opacity: 1, scale: 1, y: 0 })
        gsap.set(inText, { x: dir * TRAVEL, rotationY: -dir * 60, y: dir * 25 })
        currentTl = gsap.timeline({ onComplete() {
          isTransitioning = false; gsap.set(outProd, { opacity: 0 })
          gsap.set(slides[prev].querySelector<HTMLElement>('.bg-text')!, { x: 0, rotationY: 0, y: 0 })
          startProductIdle(idx)
          if (pendingIdx !== -1 && pendingIdx !== idx) { const p = pendingIdx, pd = pendingDir; pendingIdx = -1; pendingDir = 0; goTo(p, pd) }
        }})
        buildTimeline(currentTl, inText)
      }
      transitionFloats(prev, idx, DUR, dir, 0, W)
    }

    function demoNav(dir: number) {
      if (demoLocked) return
      const next = (current + dir + TOTAL) % TOTAL
      goTo(next, dir)
      const totalScroll = wrap!.offsetHeight - window.innerHeight
      const targetScroll = wrap!.offsetTop + (next / TOTAL) * totalScroll + 10
      window.scrollTo({ top: targetScroll, behavior: 'instant' as ScrollBehavior })
      demoLocked = true; setTimeout(() => { demoLocked = false }, 2200)
    }

    // keyboard & swipe share same motor
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); demoNav(1) }
      if (e.key === 'ArrowLeft') { e.preventDefault(); demoNav(-1) }
    }
    document.addEventListener('keydown', onKey)
    let tx = 0
    const onTouchStart = (e: TouchEvent) => { tx = e.touches[0].clientX }
    const onTouchEnd = (e: TouchEvent) => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) demoNav(dx < 0 ? 1 : -1) }
    sticky.addEventListener('touchstart', onTouchStart, { passive: true } as never)
    sticky.addEventListener('touchend', onTouchEnd, { passive: true } as never)

    // init
    gsap.set(stageProds, { xPercent: -50, yPercent: -50, x: 0, rotation: 0, scale: 1, opacity: 0 })
    gsap.set(stageProds[0], { opacity: 1 })
    gsap.set('.bg-text', { xPercent: -50, yPercent: -50 })
    updateSlideUI(0); placeFloats(0)
    gsap.delayedCall(0.5, () => { entryFloats(0); startProductIdle(0) })

    // ScrollTrigger — single source of truth
    const st = ScrollTrigger.create({
      trigger: wrap, start: 'top top', end: 'bottom bottom',
      onUpdate(self) {
        const idx = Math.min(TOTAL - 1, Math.floor(self.progress * TOTAL + 0.01))
        if (idx !== current) goTo(idx, idx > current ? 1 : -1)
      },
      onEnter() { document.getElementById('hero-nav')?.classList.remove('snav-hidden') },
      onEnterBack() { document.getElementById('hero-nav')?.classList.remove('snav-hidden') },
      onLeave() { document.getElementById('hero-nav')?.classList.add('snav-hidden') },
      onLeaveBack() { document.getElementById('hero-nav')?.classList.add('snav-hidden') },
    })

    // expose demoNav for buttons
    ;(window as any).demoNav = demoNav
    ;(window as any).heroGoTo = goTo

    const onResize = () => {
      gsap.set(track!,  { x: -current * window.innerWidth })
      BEST_FLOATS[current]?.forEach((cfg, i) => {
        if (!floatItems[i]) return
        const px = getPx(cfg)
        gsap.set(floatItems[i], { left: px.left, top: px.top, width: px.width })
      })
    }
    window.addEventListener('resize', onResize, { passive: true } as never)

    return () => {
      document.removeEventListener('keydown', onKey)
      sticky.removeEventListener('touchstart', onTouchStart as never)
      sticky.removeEventListener('touchend', onTouchEnd as never)
      window.removeEventListener('resize', onResize as never)
      st.kill()
      if (kbTween) kbTween.kill()
      if (wobbleTl) wobbleTl.kill()
      if (currentTl) currentTl.kill()
      killFloats()
    }
  }, [])

  return (
    <>
      <style>{`
        #hero-wrap{position:relative;height:600vh;}
        #hero-sticky{position:sticky;top:0;height:100svh;min-height:100dvh;overflow:hidden;}
        #hero-track{display:flex;width:500vw;height:100vh;will-change:transform;}
        .hero-slide{width:100vw;height:100vh;flex-shrink:0;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;}
        .hero-glow{position:absolute;inset:0;z-index:1;pointer-events:none;}
        .hero-vignette{position:absolute;inset:0;z-index:2;pointer-events:none;background:radial-gradient(ellipse 65% 65% at 50% 50%,transparent 30%,rgba(0,0,0,.55) 100%);}
        .bg-text{position:absolute;left:50%;top:50%;z-index:1;will-change:transform;font-family:var(--font-display);font-size:clamp(6rem,20vw,19rem);font-weight:800;letter-spacing:-.02em;text-transform:uppercase;color:#fff;white-space:nowrap;user-select:none;pointer-events:none;}
        #product-stage{position:absolute;inset:0;z-index:6;pointer-events:none;overflow:hidden;}
        .stage-prod{position:absolute;left:50%;top:44%;width:clamp(380px,68vw,860px);height:clamp(380px,68vw,860px);object-fit:contain;opacity:0;will-change:transform,opacity;}
        #float-overlay{position:absolute;inset:0;z-index:7;pointer-events:none;}
        .float-item{position:absolute;object-fit:contain;pointer-events:none;will-change:transform,opacity;}
        .hero-info{position:absolute;left:clamp(1.5rem,6vw,6rem);bottom:clamp(5rem,12vh,8rem);z-index:10;pointer-events:none;}
        .hero-brand{font-family:var(--font-display);font-size:.82rem;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.7);}
        .hero-name{font-family:var(--font-display);font-size:clamp(2.4rem,6vw,5.2rem);font-weight:900;line-height:.9;letter-spacing:-.02em;color:#fff;text-shadow:0 2px 32px rgba(0,0,0,.35);}
        .hero-counter{position:absolute;bottom:2.2rem;right:1.5rem;z-index:10;display:flex;flex-direction:column;align-items:flex-end;gap:.6rem;}
        .hero-counter-num{font-family:var(--font-display);font-size:.75rem;letter-spacing:.22em;color:rgba(255,255,255,.7);}
        .hero-dots{display:flex;gap:.5rem;}
        .dot{height:3px;width:22px;background:rgba(255,255,255,.35);border-radius:3px;transition:all .5s ease;}
        .dot.active{background:#fff;width:42px;}
        #hero-nav{position:fixed;bottom:1.2rem;left:50%;transform:translateX(-50%);z-index:9999;display:flex;gap:.6rem;transition:opacity .3s;}
        #hero-nav.snav-hidden{opacity:0;pointer-events:none;}
        .snav-btn{width:46px;height:46px;border-radius:50%;border:1.5px solid rgba(255,255,255,.55);background:rgba(0,0,0,.35);backdrop-filter:blur(12px);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .snav-btn:hover{background:#fff;color:#111;border-color:#fff;}
        .scroll-hint{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);z-index:10;display:flex;flex-direction:column;align-items:center;gap:.5rem;opacity:0;animation:fadeHint 1s 1.5s forwards;}
        @keyframes fadeHint{to{opacity:1;}}
        .scroll-hint-line{width:1px;height:36px;background:linear-gradient(to bottom,transparent,rgba(255,255,255,.5));}
        .scroll-hint-txt{font-family:var(--font-display);font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,255,255,.55);}
        @media(max-width:767px){
          .stage-prod{width:clamp(260px,84vw,420px);height:clamp(260px,84vw,420px);top:42%;}
          .bg-text{font-size:clamp(4.5rem,22vw,11rem);}
          .hero-info{left:1.2rem;bottom:5.5rem;}
          .hero-counter{right:1rem;bottom:5rem;}
        }
      `}</style>

      <div id="hero-wrap" ref={wrapRef}>
        <div id="hero-sticky" ref={stickyRef}>
          <div className="hero-counter">
            <span ref={counterRef} className="hero-counter-num">01 / 05</span>
            <div ref={dotsRef} className="hero-dots">
              {SLIDES.map((_, i) => <div key={i} className={i===0 ? 'dot active' : 'dot'} />)}
            </div>
          </div>

          <div ref={trackRef} id="hero-track">
            {SLIDES.map(s => (
              <div key={s.id} className="hero-slide" style={{ background: s.bg }}>
                <div className="hero-glow" style={{ background: s.glow }} />
                <div className="hero-vignette" style={{ background: s.vignette || undefined }} />
                <span className="bg-text">{s.bgWord}</span>
              </div>
            ))}
          </div>

          <div id="product-stage" ref={stageRef}>
            {SLIDES.map(s => (
              <img key={s.id} className="stage-prod" src={s.asset} alt={s.alt} loading={s.id==='dunk' ? 'eager' : 'lazy'} />
            ))}
          </div>

          <div id="float-overlay" ref={floatRef}>
            <img className="float-item" alt="" />
            <img className="float-item" alt="" />
            <img className="float-item" alt="" />
          </div>

          <div ref={infoRef} className="hero-info">
            <div ref={brandRef} className="hero-brand">{SLIDES[0].brand}</div>
            <div ref={nameRef} className="hero-name">{SLIDES[0].name}{SLIDES[0].name2 ? ' ' + SLIDES[0].name2 : ''}</div>
            <div className="hero-brand" style={{marginTop:'.6rem', fontSize:'.62rem', opacity:.55}}>ARAGUATINS — AUGUSTINÓPOLIS</div>
          </div>

          <div className="scroll-hint">
            <div className="scroll-hint-line" />
            <div className="scroll-hint-txt">Scroll</div>
          </div>
        </div>
      </div>

      <div id="hero-nav">
        <button className="snav-btn" aria-label="Anterior" onClick={() => (window as any).demoNav?.(-1)}><ArrowLeft size={16} /></button>
        <button className="snav-btn" aria-label="Próximo" onClick={() => (window as any).demoNav?.(1)}><ArrowRight size={16} /></button>
      </div>
    </>
  )
}
// ── NOVA UNIDADE ────────────────────────────────────────────────────────────

function NovaUnidade() {
  const { d, h, m, s, isPast } = useCountdown('2026-09-11T09:00:00-03:00')
  return (
    <section id="nova-unidade" className="bg-[#F7F5F0] text-[#0A0A0A] py-16 md:py-20 border-t border-black/5">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="font-[Inter] text-[11px] tracking-[0.28em] text-black/40 flex items-center gap-2"><span className="w-6 h-px bg-black/15" /> 11 DE SETEMBRO • 09:00</div>
        <h2 className="font-[Barlow_Condensed] font-black leading-[0.88] tracking-[-0.04em] mt-3" style={{ fontSize: 'clamp(2.8rem,7vw,5.4rem)' }}>
          UMA NOVA<br /><span className="text-[#B52A27]">BEST.</span><br />AGORA EM<br /><span className="text-transparent" style={{ WebkitTextStroke: '1.2px #0A0A0A' }}>AUGUSTINÓPOLIS</span>
        </h2>
        <p className="mt-4 font-[Inter] text-sm leading-[1.7] text-black/55 max-w-[42ch]">De Araguatins para Augustinópolis. A mesma curadoria que você já conhece, agora mais perto.</p>
        <div className="mt-10 border-t border-black/10 pt-8">
          {isPast ? (
            <div>
              <div className="font-[Barlow_Condensed] font-black leading-none tracking-[-0.04em]" style={{ fontSize: 'clamp(2.4rem,6vw,4rem)' }}>A BEST CHEGOU.</div>
              <div className="font-[Inter] text-sm text-black/55 mt-2">Nossa nova unidade já está atendendo.</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-[720px]">
                {[[d, 'DIAS'], [h, 'HORAS'], [m, 'MIN'], [s, 'SEG']].map(([v, l]) => (
                  <div key={l as string} className="text-center">
                    <div className="font-[Barlow_Condensed] font-black leading-none tracking-[-0.03em]" style={{ fontSize: 'clamp(2.4rem,6vw,4.2rem)' }}>{String(v).padStart(2, '0')}</div>
                    <div className="font-[Inter] text-[11px] tracking-[0.22em] text-black/40 mt-1">{l as string}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 font-[Inter] text-[11px] tracking-[0.16em] text-black/35">11.09.2026 — 09:00 • AUGUSTINÓPOLIS — TO • DE ARAGUATINS PARA AUGUSTINÓPOLIS</div>
            </>
          )}
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
      <LaunchHero />
      <div data-reveal><NovaUnidade /></div>
      <div data-reveal>
        <div className="bg-[#F7F5F0] text-[#0A0A0A] py-6 text-center border-y border-black/5">
          <div className="font-[Inter] text-[11px] tracking-[0.28em] text-black/40">BEST SELECTION — 5 PEÇAS EM MOVIMENTO</div>
        </div>
        <HeroSlider />
      </div>
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
