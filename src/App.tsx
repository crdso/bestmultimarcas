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
    bg: '#F1F1EF',
    glow: 'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(0,0,0,.07) 0%, transparent 62%)',
    vignette: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 42%, rgba(0,0,0,.06) 100%)',
    textColor: 'dark',
    type: 'shoe',
    scale: 1,
  },
  {
    id: 'adidas',
    brand: 'ADIDAS',
    name: 'SNEAKER',
    name2: '',
    bgWord: 'ADIDAS',
    asset: '/products/adidas-sneaker.png',
    alt: 'Adidas Sneaker',
    bg: '#EDEAE3',
    glow: 'radial-gradient(ellipse 60% 60% at 50% 45%, rgba(16,16,16,.06) 0%, transparent 66%)',
    vignette: 'radial-gradient(ellipse 75% 70% at 50% 50%, transparent 38%, rgba(0,0,0,.04) 100%)',
    textColor: 'dark',
    type: 'shoe',
    scale: 0.97,
  },
  {
    id: 'jacket',
    brand: 'NIKE',
    name: 'JAQUETA',
    name2: '',
    bgWord: 'NIKE',
    asset: '/products/nike-jacket.png',
    alt: 'Jaqueta Nike',
    bg: 'radial-gradient(ellipse at 50% 45%, #343434 0%, #242424 38%, #1A1A1A 62%, #111111 100%)',
    glow: 'radial-gradient(ellipse 55% 55% at 50% 45%, rgba(255,255,255,.12), transparent 65%)',
    vignette: 'radial-gradient(ellipse 75% 70% at 50% 50%, transparent 32%, rgba(0,0,0,.42) 100%)',
    textColor: 'light',
    type: 'jacket',
    scale: 0.86,
  },
  {
    id: 'diesel',
    brand: 'DIESEL',
    name: 'CAMISETA',
    name2: '',
    bgWord: 'DIESEL',
    asset: '/products/diesel-shirt.png',
    alt: 'Camiseta Diesel',
    bg: '#F5F3EE',
    glow: 'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(215,25,32,.055) 0%, transparent 62%)',
    vignette: 'radial-gradient(ellipse 78% 70% at 50% 50%, transparent 45%, rgba(0,0,0,.05) 100%)',
    textColor: 'dark',
    type: 'shirt',
    scale: 0.88,
  },
  {
    id: 'cap',
    brand: 'NY',
    name: 'BONÉ',
    name2: '',
    bgWord: 'NY',
    asset: '/products/ny-cap.png',
    alt: 'Boné NY',
    bg: '#2B1A13',
    glow: 'radial-gradient(ellipse 62% 56% at 50% 44%, rgba(212,191,168,.14) 0%, transparent 64%)',
    vignette: 'radial-gradient(ellipse 80% 74% at 50% 50%, transparent 30%, rgba(0,0,0,.55) 100%)',
    textColor: 'light',
    type: 'cap',
    scale: 0.80,
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
  const bgARef = useRef<HTMLDivElement>(null)
  const bgBRef = useRef<HTMLDivElement>(null)
  const glowARef = useRef<HTMLDivElement>(null)
  const glowBRef = useRef<HTMLDivElement>(null)
  const bgWordARef = useRef<HTMLDivElement>(null)
  const bgWordBRef = useRef<HTMLDivElement>(null)
  // dual text layers
  const textARef = useRef<HTMLDivElement>(null)
  const textBRef = useRef<HTMLDivElement>(null)

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
  function wordColorFor(s: Slide) { return s.textColor === 'dark' ? 'rgba(0,0,0,.045)' : 'rgba(255,255,255,.07)' }
  function wordStrokeFor(s: Slide) { return s.textColor === 'dark' ? '1px rgba(0,0,0,.06)' : '1px rgba(255,255,255,.08)' }

  function renderTextLayer(el: HTMLElement, s: Slide) {
    el.innerHTML = `
      <div style="font-family:Inter,sans-serif;font-size:11px;letter-spacing:0.22em;opacity:0.95">${s.brand}</div>
      <h1 style="font-family:Barlow Condensed,sans-serif;font-weight:900;line-height:0.86;letter-spacing:-0.03em;font-size:clamp(2.8rem,7vw,5.6rem);margin-top:6px">${s.name}${s.name2 ? `<br/><span style="-webkit-text-stroke:${s.textColor === 'dark' ? '1.4px #0A0A0A' : '1.2px rgba(255,255,255,.92)'};color:transparent">${s.name2}</span>` : ''}</h1>
      <div style="font-family:Inter,sans-serif;font-size:11px;letter-spacing:0.18em;margin-top:14px;opacity:0.85">ARAGUATINS — AUGUSTINÓPOLIS</div>
    `
  }

  // init layers + robust preload
  useEffect(() => {
    const a = prodARef.current, b = prodBRef.current
    const bgA = bgARef.current, bgB = bgBRef.current
    const gA = glowARef.current, gB = glowBRef.current
    const wA = bgWordARef.current, wB = bgWordBRef.current
    const tA = textARef.current, tB = textBRef.current
    if (!a || !b || !bgA || !bgB || !gA || !gB || !wA || !wB || !tA || !tB) return
    const s0 = SLIDES[0]
    const s1 = SLIDES[1]
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
    // explicit z-index
    bgA.style.zIndex = '1'; bgB.style.zIndex = '0'
    gA.style.zIndex = '1'; gB.style.zIndex = '0'
    wA.style.zIndex = '2'; wB.style.zIndex = '1'
    a.style.zIndex = '3'; b.style.zIndex = '2'
    tA.style.zIndex = '4'; tB.style.zIndex = '3'
    bgB.style.opacity = '0'
    gB.style.opacity = '0'
    wB.style.opacity = '0'
    tB.style.opacity = '0'
    b.style.opacity = '0'
    gsap.set(a, { x: 0, y: 0, rotation: 0, scale: s0.scale, opacity: 1, filter: 'blur(0px)' })
    gsap.set(b, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 0 })

    // preload strategy: slide 0 already eager, preload 1 immediately, then idle preload 2,3,4
    void preloadImage(s0.asset).catch(() => {})
    void preloadImage(s1.asset).catch(() => {})
    const idlePreload = () => {
      for (let i = 2; i < SLIDES.length; i++) void preloadImage(SLIDES[i].asset).catch(() => {})
    }
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback
    if (ric) ric(idlePreload)
    else setTimeout(idlePreload, 700)

    startIdle(a)
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

    if (!prodOut || !prodIn || !bgOut || !bgIn || !glowOut || !glowIn || !wordOut || !wordIn || !textOut || !textIn) {
      currentRef.current = next; setIdx(next); isTransitioning.current = false; return
    }

    // ——— guarantee incoming ready before any visual change ———
    try {
      await preloadImage(nextSlide.asset)
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
      // z-index swap
      bgIn.style.zIndex = '2'; bgOut.style.zIndex = '1'
      glowIn.style.zIndex = '2'; glowOut.style.zIndex = '1'
      wordIn.style.zIndex = '3'; wordOut.style.zIndex = '2'
      prodIn.style.zIndex = '5'; prodOut.style.zIndex = '4'
      textIn.style.zIndex = '6'; textOut.style.zIndex = '5'
      gsap.set([bgIn, glowIn, wordIn, textIn, prodIn], { opacity: 1 })
      gsap.set([bgOut, glowOut, wordOut, textOut, prodOut], { opacity: 0 })
      currentRef.current = next; setIdx(next)
      activeIsA.current = !activeIsA.current
      isTransitioning.current = false
      if (pending.current !== null && pending.current !== next) { const p = pending.current; pending.current = null; void goTo(p) }
      return
    }

    killIdle()
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

    // z-index: incoming on top
    bgIn.style.zIndex = '2'; bgOut.style.zIndex = '1'
    glowIn.style.zIndex = '2'; glowOut.style.zIndex = '1'
    wordIn.style.zIndex = '3'; wordOut.style.zIndex = '2'
    prodIn.style.zIndex = '5'; prodOut.style.zIndex = '4'
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

    gsap.killTweensOf([prodOut, prodIn, bgOut, bgIn, glowOut, glowIn, wordOut, wordIn, textOut, textIn])

    gsap.set(prodIn,  { x: direction * TRAVEL, y: direction * 16, rotation: -direction * rotIn, scale: nextSlide.scale * 1.06, opacity: 0, filter: 'blur(12px)' })
    gsap.set(prodOut, { x: 0, y: 0, rotation: 0, scale: prevSlide.scale, opacity: 1, filter: 'blur(0px)' })
    gsap.set(bgIn,   { opacity: 0 })
    gsap.set(glowIn, { opacity: 0 })
    gsap.set(wordIn, { x: direction * 70, opacity: 0, scale: 0.96 })
    gsap.set(textIn, { y: 18, opacity: 0 })

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
        // normalize z-index (incoming becomes current A/B for next cycle)
        startIdle(prodIn)
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

  }, [reduced, pauseAutoplay])

  useEffect(() => { currentRef.current = idx }, [idx])

  useEffect(() => { scheduleAutoplay(); return () => { if (autoplayTimer.current) clearInterval(autoplayTimer.current); if (resumeTimer.current) clearTimeout(resumeTimer.current) } }, [scheduleAutoplay])

  // cursor tilt on active product only
  useEffect(() => {
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return
    const stage = stageRef.current
    if (!stage) return
    let raf = 0
    const onMove = (e: MouseEvent) => {
      const active = activeIsA.current ? prodARef.current : prodBRef.current
      if (!active || isTransitioning.current) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = stage.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        gsap.to(active, { x: x * 14, y: y * 10, rotationY: x * 6, rotationX: -y * 4, duration: 0.7, ease: 'power3.out', overwrite: 'auto' })
      })
    }
    const onLeave = () => {
      const active = activeIsA.current ? prodARef.current : prodBRef.current
      if (active) gsap.to(active, { x: 0, y: 0, rotationY: 0, rotationX: 0, duration: 0.8, ease: 'power3.out' })
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
      {/* bg layers */}
      <div ref={bgARef} className="absolute inset-0" style={{ zIndex: 1 }} />
      <div ref={bgBRef} className="absolute inset-0" style={{ zIndex: 0, opacity: 0 }} />
      <div ref={glowARef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} />
      <div ref={glowBRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0 }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '72px 72px', zIndex: 2 }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 42%, rgba(0,0,0,.06) 100%)', opacity: slide.textColor === 'dark' ? 0.6 : 0, zIndex: 2 }} />

      {/* hairline — uses current fg, tweened via GSAP during transition */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-[76px] z-20 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${curFgMuted}, transparent)` }} />

      {/* bg word layers — each has its own per-slide color */}
      <div
        ref={bgWordARef}
        aria-hidden
        className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 font-[Barlow_Condensed] font-black leading-none tracking-[-0.03em] whitespace-nowrap pointer-events-none will-change-transform"
        style={{ fontSize: 'clamp(5rem, 18vw, 21rem)', zIndex: 2 }}
      />
      <div
        ref={bgWordBRef}
        aria-hidden
        className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 font-[Barlow_Condensed] font-black leading-none tracking-[-0.03em] whitespace-nowrap pointer-events-none will-change-transform"
        style={{ fontSize: 'clamp(5rem, 18vw, 21rem)', zIndex: 1, opacity: 0 }}
      />

      {/* products stack — explicit z-index */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 5 }}>
        <img ref={prodARef} src={SLIDES[0].asset} alt={SLIDES[0].alt} width={860} height={860} fetchPriority="high" decoding="async" draggable={false} className="absolute object-contain will-change-transform select-none" style={{ width: 'min(68vw, 720px)', height: 'min(68vw, 720px)', maxWidth: '88vw', filter: 'drop-shadow(0 28px 60px rgba(0,0,0,.28))', zIndex: 3 }} />
        <img ref={prodBRef} src={SLIDES[1].asset} alt={SLIDES[1].alt} width={860} height={860} loading="lazy" decoding="async" draggable={false} className="absolute object-contain will-change-transform select-none" style={{ width: 'min(68vw, 720px)', height: 'min(68vw, 720px)', maxWidth: '88vw', filter: 'drop-shadow(0 28px 60px rgba(0,0,0,.28))', opacity: 0, zIndex: 2 }} />
      </div>

      {/* dual text layers — each already colored for its slide */}
      <div className="absolute z-20 left-6 md:left-10 lg:left-[6vw] bottom-[104px] md:bottom-[92px] max-w-[420px] pointer-events-none">
        <div ref={textARef} className="absolute bottom-0 left-0 will-change-transform" style={{ zIndex: 4 }} />
        <div ref={textBRef} className="absolute bottom-0 left-0 will-change-transform" style={{ zIndex: 3, opacity: 0 }} />
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
