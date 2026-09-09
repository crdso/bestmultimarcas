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

// ── TYPES & DATA ──────────────────────────────────────────────────────────────

type Slide = {
  id: string
  brand: string
  brandLabel: string
  name: string
  nameLine2: string
  bgWord: string
  asset: string
  alt: string
  bg: string
  bgGlow: string
  vignette: string
  textColor: string // 'light' | 'dark'
  accent: string
  eyebrow: string
  tagline: string
  year: string
  category: string
  objectPosition?: string
  scale: number // product scale tweak
}

const SLIDES: Slide[] = [
  {
    id: 'nike-dunk',
    brand: 'NIKE',
    brandLabel: '01 — NIKE',
    name: 'DUNK',
    nameLine2: 'PANDA',
    bgWord: 'DUNK',
    asset: '/products/nike-dunk-panda.png',
    alt: 'Nike Dunk Panda — tênis preto e branco',
    bg: '#F1F1EF',
    bgGlow: 'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(0,0,0,.07) 0%, transparent 62%)',
    vignette: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 42%, rgba(0,0,0,.06) 100%)',
    textColor: 'dark',
    accent: '#111111',
    eyebrow: 'SELECTED PIECE 01 — CLEAN // SPORT',
    tagline: 'Preto, branco, cinza. Silhueta atemporal em escala monumental.',
    year: '2026 DROP',
    category: 'SNEAKERS',
    scale: 1,
  },
  {
    id: 'adidas-sneaker',
    brand: 'ADIDAS',
    brandLabel: '02 — ADIDAS',
    name: 'SNEAKER',
    nameLine2: 'OFF-WHITE',
    bgWord: 'ADIDAS',
    asset: '/products/adidas-sneaker.png',
    alt: 'Adidas Sneaker off-white com detalhes pretos',
    bg: '#EDEAE3',
    bgGlow: 'radial-gradient(ellipse 60% 60% at 50% 45%, rgba(16,16,16,.06) 0%, transparent 66%)',
    vignette: 'radial-gradient(ellipse 75% 70% at 50% 50%, transparent 38%, rgba(0,0,0,.04) 100%)',
    textColor: 'dark',
    accent: '#111111',
    eyebrow: 'SELECTED PIECE 02 — GEOMETRY // EDITORIAL',
    tagline: 'Geometria forte e off-white editorial. Street com precisão.',
    year: '2026 DROP',
    category: 'SNEAKERS',
    scale: 0.96,
  },
  {
    id: 'nike-jacket',
    brand: 'NIKE',
    brandLabel: '03 — NIKE',
    name: 'OUTER',
    nameLine2: 'WEAR',
    bgWord: 'OUTER',
    asset: '/products/nike-jacket.png',
    alt: 'Jaqueta Nike preta outerwear',
    bg: '#0F0F0F',
    bgGlow: 'radial-gradient(ellipse 65% 55% at 50% 42%, rgba(255,255,255,.06) 0%, transparent 64%)',
    vignette: 'radial-gradient(ellipse 75% 70% at 50% 50%, transparent 28%, rgba(0,0,0,.62) 100%)',
    textColor: 'light',
    accent: '#F1F1F1',
    eyebrow: 'SELECTED PIECE 03 — GRAFITE // PREMIUM',
    tagline: 'Grafite, preto, volume pesado. Minimalismo luxuoso.',
    year: '2026 DROP',
    category: 'JAQUETAS',
    scale: 0.88,
  },
  {
    id: 'diesel-essential',
    brand: 'DIESEL',
    brandLabel: '04 — DIESEL',
    name: 'ESSEN',
    nameLine2: 'TIAL',
    bgWord: 'DIESEL',
    asset: '/products/diesel-shirt.png',
    alt: 'Camiseta Diesel branca essential',
    bg: '#F5F3EE',
    bgGlow: 'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(215,25,32,.06) 0%, transparent 62%)',
    vignette: 'radial-gradient(ellipse 78% 70% at 50% 50%, transparent 45%, rgba(0,0,0,.05) 100%)',
    textColor: 'dark',
    accent: '#D71920',
    eyebrow: 'SELECTED PIECE 04 — WHITE // RED ACCENT',
    tagline: 'Branco absoluto com toque vermelho Diesel. Espaço negativo.',
    year: '2026 DROP',
    category: 'OVERSIZED',
    scale: 0.9,
  },
  {
    id: 'ny-cap',
    brand: 'NY',
    brandLabel: '05 — NY',
    name: 'CAP',
    nameLine2: 'CHOCOLATE',
    bgWord: 'NY CAP',
    asset: '/products/ny-cap.png',
    alt: 'Boné NY marrom chocolate',
    bg: '#2B1A13',
    bgGlow: 'radial-gradient(ellipse 62% 56% at 50% 44%, rgba(212,191,168,.14) 0%, transparent 64%)',
    vignette: 'radial-gradient(ellipse 80% 74% at 50% 50%, transparent 30%, rgba(0,0,0,.55) 100%)',
    textColor: 'light',
    accent: '#D4BFA8',
    eyebrow: 'SELECTED PIECE 05 — STREET // LIFESTYLE',
    tagline: 'Chocolate, bege, creme. Lifestyle e streetwear em estado puro.',
    year: '2026 DROP',
    category: 'BONÉS',
    scale: 0.82,
  },
]

// ── COUNTDOWN ────────────────────────────────────────────────────────────────

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
      className={`fixed top-0 inset-x-0 z-[100] flex items-center justify-between px-6 md:px-10 py-5 md:py-6 transition-all duration-400 ${scrolled ? 'bg-[#080808]/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent border-b border-transparent'}`}
    >
      <a href="#" className="flex items-baseline gap-1 group">
        <span className="font-[Barlow_Condensed] font-black tracking-[0.18em] text-[1.7rem] md:text-[1.9rem] leading-none text-white">BEST</span>
        <span className="hidden sm:inline font-[Barlow_Condensed] font-extrabold tracking-[0.22em] text-[0.68rem] text-white/55 translate-y-[-2px]">MULTIMARCAS</span>
        <span className="hidden md:inline ml-2 h-[2px] w-6 bg-white/20 group-hover:w-10 transition-all duration-300" />
      </a>

      <nav className="hidden lg:flex items-center gap-1">
        {[
          ['NEW DROP', 'new-drop'],
          ['CATÁLOGO', 'catalogo'],
          ['MARCAS', 'marcas'],
          ['LOJAS', 'lojas'],
        ].map(([label, id]) => (
          <button
            key={id}
            onClick={() => onNav(id)}
            className="font-[Barlow_Condensed] text-[0.82rem] tracking-[0.16em] text-white/55 hover:text-white px-4 py-2 transition-colors"
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <a
          href="https://www.instagram.com/bestmultimarcasaraguatins/"
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-2 font-[Barlow_Condensed] text-[0.78rem] tracking-[0.18em] text-white border border-white/15 hover:border-white hover:bg-white hover:text-black px-5 py-[9px] rounded-full transition-all duration-200"
        >
          INSTAGRAM <ArrowUpRight size={14} strokeWidth={1.8} />
        </a>
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          className="lg:hidden w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {open && (
        <div className="absolute top-full inset-x-0 bg-[#080808] border-t border-white/10 px-6 py-8 flex flex-col gap-1 lg:hidden">
          {[
            ['NEW DROP', 'new-drop'],
            ['CATÁLOGO', 'catalogo'],
            ['MARCAS', 'marcas'],
            ['LOJAS', 'lojas'],
          ].map(([label, id]) => (
            <button
              key={id}
              onClick={() => { onNav(id); setOpen(false) }}
              className="text-left font-[Barlow_Condensed] font-bold text-3xl tracking-[0.08em] text-white/90 py-3 border-b border-white/5"
            >
              {label}
            </button>
          ))}
          <a
            href="https://www.instagram.com/bestmultimarcasaraguatins/"
            target="_blank"
            className="mt-4 inline-flex items-center gap-2 font-[Barlow_Condensed] tracking-[0.2em] text-sm text-white/70"
          >
            INSTAGRAM <ArrowUpRight size={16} />
          </a>
        </div>
      )}
    </header>
  )
}

// ── HERO ────────────────────────────────────────────────────────────────────

function HeroSlider() {
  const [idx, setIdx] = useState(0)
  const [reduced, setReduced] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const bgTextRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const productRef = useRef<HTMLImageElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isTransitioning = useRef(false)
  const pending = useRef<number | null>(null)
  const currentRef = useRef(0)
  const autoplayRef = useRef<number | null>(null)

  const slide = SLIDES[idx]
  const isDark = slide.textColor === 'dark'

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // cursor tilt (desktop only)
  useEffect(() => {
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return
    const el = stageRef.current
    const prod = productRef.current
    if (!el || !prod) return
    let raf = 0
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        gsap.to(prod, { x: x * 18, y: y * 12, rotationY: x * 8, rotationX: -y * 5, duration: 0.8, ease: 'power3.out', overwrite: 'auto' })
      })
    }
    const onLeave = () => { gsap.to(prod, { x: 0, y: 0, rotationY: 0, rotationX: 0, duration: 0.9, ease: 'power3.out' }) }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); cancelAnimationFrame(raf) }
  }, [reduced, idx])

  const goTo = useCallback((next: number, dir?: number) => {
    if (next === currentRef.current) return
    if (isTransitioning.current) { pending.current = next; return }
    isTransitioning.current = true
    const prev = currentRef.current
    const direction = dir ?? (next > prev ? 1 : -1)
    const vw = window.innerWidth
    const prod = productRef.current
    const bgText = bgTextRef.current
    const info = infoRef.current
    const track = trackRef.current
    if (!prod || !bgText || !info || !track) { currentRef.current = next; setIdx(next); isTransitioning.current = false; return }

    if (reduced) {
      currentRef.current = next
      setIdx(next)
      gsap.fromTo(info, { opacity: 0 }, { opacity: 1, duration: 0.4 })
      isTransitioning.current = false
      if (pending.current !== null && pending.current !== next) { const p = pending.current; pending.current = null; goTo(p) }
      return
    }

    const tl = gsap.timeline({
      onComplete: () => {
        currentRef.current = next
        setIdx(next)
        isTransitioning.current = false
        // reset transforms
        gsap.set(prod, { clearProps: 'transform,filter' })
        gsap.set(bgText, { clearProps: 'transform' })
        // idle wobble
        gsap.to(prod, { rotation: -1.2, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: 1 })
        if (pending.current !== null && pending.current !== next) { const p = pending.current; pending.current = null; goTo(p, direction) }
      }
    })

    // OUT: product flies diagonal + scale + rotate + blur
    tl.to(prod, { x: -direction * vw * 0.38, y: direction * -22, rotation: direction * 14, scale: 0.86, opacity: 0, filter: 'blur(6px)', duration: 0.58, ease: 'power3.in' }, 0)
    tl.to(bgText, { x: -direction * 120, opacity: 0, scale: 0.92, duration: 0.5, ease: 'power3.in' }, 0)
    tl.to(info, { y: -14, opacity: 0, duration: 0.24, ease: 'power2.in' }, 0.08)
    // IN prepare is handled by React state update mid-timeline via setIdx — but we need to visually hold
    // Instead, animate track/background via CSS transition (React will swap bg). Use dummy.
    tl.to(track, { x: 0, duration: 0.01 }, 0.58) // placeholder to sync
    tl.fromTo(prod, { x: direction * vw * 0.34, y: direction * 18, rotation: -direction * 16, scale: 1.08, opacity: 0, filter: 'blur(10px)' }, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.92, ease: 'power4.out' }, 0.52)
    tl.fromTo(bgText, { x: direction * 90, opacity: 0, scale: 1.06 }, { x: 0, opacity: 1, scale: 1, duration: 0.85, ease: 'power3.out' }, 0.56)
    tl.fromTo(info, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.46, ease: 'power3.out' }, 0.74)

  }, [reduced])

  // sync currentRef
  useEffect(() => { currentRef.current = idx }, [idx])

  // keyboard + wheel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo((idx + 1) % SLIDES.length, 1) }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo((idx - 1 + SLIDES.length) % SLIDES.length, -1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [idx, goTo])

  // swipe
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    let sx = 0
    const s = (e: TouchEvent) => { sx = e.touches[0].clientX }
    const e = (ev: TouchEvent) => { const dx = ev.changedTouches[0].clientX - sx; if (Math.abs(dx) > 48) goTo(dx < 0 ? (idx + 1) % SLIDES.length : (idx - 1 + SLIDES.length) % SLIDES.length, dx < 0 ? 1 : -1) }
    el.addEventListener('touchstart', s, { passive: true })
    el.addEventListener('touchend', e, { passive: true })
    return () => { el.removeEventListener('touchstart', s); el.removeEventListener('touchend', e) }
  }, [idx, goTo])

  // autoplay (pause on interaction)
  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => goTo((currentRef.current + 1) % SLIDES.length, 1), 5200)
    autoplayRef.current = id
    return () => clearInterval(id)
  }, [goTo, reduced])

  const pauseAuto = () => { if (autoplayRef.current) clearInterval(autoplayRef.current) }

  return (
    <section
      ref={stageRef}
      aria-roledescription="carousel"
      aria-label="Coleção em destaque"
      className="relative w-full overflow-hidden select-none"
      style={{ height: '100svh', minHeight: '100dvh', background: slide.bg, transition: 'background 700ms ease' }}
    >
      {/* glow + vignette */}
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-700" style={{ background: slide.bgGlow }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: slide.vignette }} />

      {/* subtle grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '72px 72px' }} />

      {/* top hairline */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-[84px] z-20 pointer-events-none" style={{ background: isDark ? 'linear-gradient(to bottom, rgba(0,0,0,.45), transparent)' : 'linear-gradient(to bottom, rgba(255,255,255,.55), transparent)' }} />

      {/* meta top */}
      <div className="absolute top-[82px] md:top-[86px] inset-x-6 md:inset-x-10 z-20 flex justify-between items-start pointer-events-none">
        <div className={`hidden md:flex items-center gap-3 font-[Inter] text-[10px] tracking-[0.28em] ${isDark ? 'text-black/40' : 'text-white/40'}`}>
          <span className={`w-6 h-px ${isDark ? 'bg-black/20' : 'bg-white/25'}`} />
          BEST — ARAGUATINS → AUGUSTINÓPOLIS
        </div>
        <div className={`ml-auto md:ml-0 font-[Inter] text-[10px] tracking-[0.32em] ${isDark ? 'text-black/30' : 'text-white/30'}`}>
          EDITORIAL DROP — 2026 / 05 PIECES
        </div>
      </div>

      {/* BG WORD */}
      <div
        ref={bgTextRef}
        aria-hidden
        className="absolute left-1/2 top-[46%] md:top-[48%] -translate-x-1/2 -translate-y-1/2 font-[Barlow_Condensed] font-black leading-none tracking-[-0.03em] whitespace-nowrap pointer-events-none will-change-transform"
        style={{
          fontSize: 'clamp(5.2rem, 18vw, 22rem)',
          color: isDark ? 'rgba(0,0,0,.045)' : 'rgba(255,255,255,.07)',
          WebkitTextStroke: isDark ? '1px rgba(0,0,0,.06)' : '1px rgba(255,255,255,.08)',
        }}
      >
        {slide.bgWord}
      </div>

      {/* PRODUCT */}
      <div ref={trackRef} className="absolute inset-0 z-10 flex items-center justify-center will-change-transform">
        <img
          ref={productRef}
          key={slide.id}
          src={slide.asset}
          alt={slide.alt}
          width={860}
          height={860}
          fetchPriority={idx === 0 ? 'high' : 'auto'}
          loading={idx === 0 ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          className="object-contain will-change-transform select-none pointer-events-none"
          style={{
            width: 'min(82vw, 740px)',
            height: 'min(82vw, 740px)',
            maxWidth: '86vw',
            filter: `drop-shadow(0 28px 60px rgba(0,0,0,${isDark ? 0.18 : 0.42}))`,
            transform: `scale(${slide.scale})`,
          }}
        />
      </div>

      {/* LEFT INFO — desktop */}
      <div ref={infoRef} className="absolute z-20 left-6 md:left-10 lg:left-[7vw] bottom-[112px] md:bottom-[96px] max-w-[420px] will-change-transform">
        <div className={`inline-flex items-center gap-2 font-[Inter] text-[10px] tracking-[0.22em] mb-3 ${isDark ? 'text-black/45' : 'text-white/55'}`}>
          <span className="w-5 h-px bg-current opacity-40" />
          {String(idx + 1).padStart(2, '0')} / 05 — {slide.category}
        </div>
        <div className={`font-[Inter] text-[11px] tracking-[0.2em] mb-2 ${isDark ? 'text-black/55' : 'text-white/60'}`}>{slide.brandLabel}</div>
        <h1 className={`font-[Barlow_Condensed] font-black leading-[0.86] tracking-[-0.03em] ${isDark ? 'text-[#0A0A0A]' : 'text-white'}`} style={{ fontSize: 'clamp(2.6rem, 7vw, 5.8rem)', textShadow: isDark ? 'none' : '0 2px 40px rgba(0,0,0,.35)' }}>
          {slide.name}<br />
          <span className={isDark ? 'text-transparent' : 'text-transparent'} style={{ WebkitTextStroke: isDark ? '1.5px #0A0A0A' : '1.2px rgba(255,255,255,.9)', color: isDark ? 'transparent' : 'transparent' }}>{slide.nameLine2}</span>
        </h1>
        <p className={`mt-3 font-[Inter] text-[13px] leading-[1.65] max-w-[34ch] ${isDark ? 'text-black/55' : 'text-white/70'}`}>{slide.tagline}</p>
        <div className="mt-5 flex gap-3">
          <a
            href="https://www.instagram.com/bestmultimarcasaraguatins/"
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-2 rounded-full px-5 py-[10px] font-[Barlow_Condensed] tracking-[0.16em] text-[0.78rem] transition-all ${isDark ? 'bg-[#0A0A0A] text-white hover:bg-black' : 'bg-white text-black hover:bg-white/90'}`}
          >
            VER PEÇA <ArrowUpRight size={14} />
          </a>
          <span className={`hidden sm:inline-flex items-center font-[Inter] text-[10px] tracking-[0.18em] ${isDark ? 'text-black/35' : 'text-white/45'}`}>CONSULTAR DISPONIBILIDADE</span>
        </div>
      </div>

      {/* RIGHT CONTROLS */}
      <div className="absolute z-20 right-6 md:right-10 bottom-[22px] md:bottom-[34px] flex flex-col items-end gap-3">
        {/* counter */}
        <div className="flex flex-col items-end gap-2">
          <span className={`font-[Barlow_Condensed] text-[11px] tracking-[0.28em] ${isDark ? 'text-black/55' : 'text-white/60'}`}>
            {String(idx + 1).padStart(2, '0')} / 05
          </span>
          <div className="flex gap-[6px]">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                aria-label={`Ir para slide ${i + 1}`}
                onClick={() => { pauseAuto(); goTo(i, i > idx ? 1 : -1) }}
                className="h-[3px] rounded-full transition-all duration-500"
                style={{
                  width: i === idx ? 44 : 18,
                  background: i === idx ? (isDark ? '#0A0A0A' : '#fff') : (isDark ? 'rgba(0,0,0,.18)' : 'rgba(255,255,255,.35)'),
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <button
            aria-label="Slide anterior"
            onClick={() => { pauseAuto(); goTo((idx - 1 + SLIDES.length) % SLIDES.length, -1) }}
            className={`w-[48px] h-[48px] md:w-[52px] md:h-[52px] rounded-full border flex items-center justify-center backdrop-blur-md transition-all ${isDark ? 'bg-white/70 border-black/15 text-black hover:bg-black hover:text-white hover:border-black' : 'bg-black/40 border-white/30 text-white hover:bg-white hover:text-black'}`}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            aria-label="Próximo slide"
            onClick={() => { pauseAuto(); goTo((idx + 1) % SLIDES.length, 1) }}
            className={`w-[48px] h-[48px] md:w-[52px] md:h-[52px] rounded-full border flex items-center justify-center backdrop-blur-md transition-all ${isDark ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white hover:bg-black' : 'bg-white text-black border-white hover:bg-white/90'}`}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* bottom editorial bar */}
      <div className="absolute bottom-0 inset-x-0 z-20 hidden md:flex items-center justify-between px-10 py-4 border-t border-black/5 bg-white/0 backdrop-blur-0" style={{ borderColor: isDark ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.08)' }}>
        <span className={`font-[Inter] text-[10px] tracking-[0.22em] ${isDark ? 'text-black/35' : 'text-white/40'}`}>ARAGUATINS — TO • ENVIAMOS PARA TODO O BRASIL</span>
        <span className={`font-[Barlow_Condensed] text-[11px] tracking-[0.2em] ${isDark ? 'text-black/55' : 'text-white/55'}`}>BEST MULTIMARCAS • SINCE ARAGUATINS</span>
      </div>

      {/* mobile product covers text fix — extra bottom fade */}
      <div className="md:hidden absolute bottom-0 inset-x-0 h-[36%] bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-[5]" />
    </section>
  )
}

// ── INAUGURAÇÃO ──────────────────────────────────────────────────────────────

function Inauguration() {
  const { d, h, m, s, isPast } = useCountdown('2026-09-11T09:00:00-03:00')
  return (
    <section className="relative bg-[#080808] text-white overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 font-[Inter] text-[11px] tracking-[0.28em] text-white/45 mb-6">
              <span className="w-6 h-px bg-[#D71920]" /> A NEW CHAPTER
            </div>
            <h2 className="font-[Barlow_Condensed] font-black leading-[0.88] tracking-[-0.04em]" style={{ fontSize: 'clamp(3.2rem, 9vw, 7.2rem)' }}>
              AUGUS<br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1.4px #fff' }}>TINÓPOLIS</span>
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 bg-[#D71920] text-white font-[Barlow_Condensed] tracking-[0.18em] text-xs px-4 py-2 rounded-full">11.09.2026 — 09:00</span>
              <span className="inline-flex items-center font-[Inter] text-[11px] tracking-[0.18em] text-white/55 border border-white/10 rounded-full px-4 py-2">NOVA UNIDADE • BEST MULTIMARCAS</span>
            </div>
            <p className="mt-8 font-[Inter] text-[15px] leading-[1.8] text-white/60 max-w-[46ch]">
              A BEST está chegando a Augustinópolis. Mesma curadoria, novas paredes. Duas cidades, uma só ideia: peças selecionadas, novidades constantes e atendimento que conhece seu nome.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="https://www.instagram.com/bestmultimarcasaugustinopolis/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white text-black font-[Barlow_Condensed] tracking-[0.16em] text-[0.82rem] px-6 py-3 rounded-full hover:bg-white/90 transition">
                VER NO INSTAGRAM <ArrowUpRight size={14} />
              </a>
              <a href="#lojas" onClick={(e) => { e.preventDefault(); document.getElementById('lojas')?.scrollIntoView({ behavior: 'smooth' }) }} className="inline-flex items-center gap-2 border border-white/15 text-white font-[Barlow_Condensed] tracking-[0.16em] text-[0.82rem] px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
                NOSSAS LOJAS
              </a>
            </div>
          </div>

          <div className="relative">
            {isPast ? (
              <div className="rounded-[24px] bg-white text-black p-8 md:p-10 overflow-hidden relative">
                <div className="absolute -right-10 -top-10 text-[10rem] font-[Barlow_Condensed] font-black leading-none opacity-5">ABERTA</div>
                <div className="relative">
                  <div className="font-[Inter] text-[11px] tracking-[0.28em] text-black/40 mb-3">AGORA EM AUGUSTINÓPOLIS</div>
                  <div className="font-[Barlow_Condensed] font-black text-[2.8rem] leading-[0.9] tracking-[-0.03em]">A BEST<br />CHEGOU.</div>
                  <p className="mt-4 text-[13px] leading-[1.7] text-black/60">Nossa nova unidade já está atendendo. Passe na inauguração e confira o drop de abertura.</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.18em] font-[Inter] text-black/50">11.09.2026 • 09:00 • AUGUSTINÓPOLIS — TO</div>
                </div>
              </div>
            ) : (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-[Inter] text-[11px] tracking-[0.24em] text-white/45">COUNTDOWN PARA A INAUGURAÇÃO</span>
                  <span className="w-2 h-2 rounded-full bg-[#D71920] animate-pulse" />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    [d, 'DIAS'],
                    [h, 'HORAS'],
                    [m, 'MIN'],
                    [s, 'SEG'],
                  ].map(([v, l]) => (
                    <div key={l as string} className="rounded-2xl bg-white text-black p-4 md:p-5 text-center">
                      <div className="font-[Barlow_Condensed] font-black text-[2rem] md:text-[2.4rem] leading-none tracking-[-0.02em]">{String(v).padStart(2, '0')}</div>
                      <div className="font-[Inter] text-[10px] tracking-[0.22em] text-black/40 mt-1">{l as string}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between font-[Inter] text-[11px] tracking-[0.16em] text-white/40">
                  <span>11.09.2026 — 09:00</span>
                  <span>AUGUSTINÓPOLIS — TO</span>
                </div>
              </div>
            )}

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-[#111] border border-white/5 p-4">
                <div className="font-[Barlow_Condensed] font-bold tracking-[0.14em] text-xs text-white">ARAGUATINS</div>
                <div className="font-[Inter] text-[11px] text-white/45 mt-1">Desde o início</div>
              </div>
              <div className="rounded-2xl bg-[#D71920] p-4 text-white">
                <div className="font-[Barlow_Condensed] font-bold tracking-[0.14em] text-xs">AUGUSTINÓPOLIS</div>
                <div className="text-[11px] opacity-80 mt-1">11.09.2026</div>
              </div>
              <div className="rounded-2xl bg-white text-black p-4">
                <div className="font-[Barlow_Condensed] font-bold tracking-[0.14em] text-xs">BRASIL</div>
                <div className="text-[11px] opacity-60 mt-1">Envios nacionais</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── NEW DROP ────────────────────────────────────────────────────────────────

function NewDrop() {
  return (
    <section id="new-drop" className="bg-[#F7F5F0] text-[#0A0A0A] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-14 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <div className="font-[Inter] text-[11px] tracking-[0.28em] text-black/40 flex items-center gap-2"><span className="w-6 h-px bg-black/15" /> NEW DROP — EDITORIAL</div>
            <h2 className="font-[Barlow_Condensed] font-black leading-[0.9] tracking-[-0.04em] mt-3" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.6rem)' }}>
              SELECTED<br />PIECES<span className="text-[#D71920]">.</span>
            </h2>
          </div>
          <p className="font-[Inter] text-[13px] leading-[1.7] text-black/55 max-w-[36ch]">Cinco peças, cinco mundos. O hero mostra escala. Aqui mostramos contexto, textura e detalhe editorial.</p>
        </div>

        {/* asymmetric editorial grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-6 auto-rows-[220px] md:auto-rows-[300px]">
          {/* large left */}
          <div className="col-span-12 md:col-span-7 row-span-2 relative rounded-[24px] overflow-hidden bg-white border border-black/5 flex">
            <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
              <span className="bg-black text-white font-[Barlow_Condensed] tracking-[0.16em] text-[11px] px-3 py-1.5 rounded-full">01 / NIKE DUNK PANDA</span>
              <span className="hidden md:inline font-[Inter] text-[10px] tracking-[0.18em] text-black/40">CLEAN • SPORT • MONUMENTAL</span>
            </div>
            <img src="/products/nike-dunk-panda.png" alt="Nike Dunk Panda" className="w-[58%] object-contain p-6 md:p-10 self-center" loading="lazy" />
            <div className="flex-1 flex flex-col justify-end p-6 md:p-8 bg-[#0A0A0A] text-white">
              <div className="font-[Barlow_Condensed] font-black leading-[0.85] text-[2.2rem] md:text-[2.8rem] tracking-[-0.03em]">DUNK<br />PANDA</div>
              <div className="mt-3 font-[Inter] text-xs leading-[1.6] text-white/60">Escala editorial máxima. O clássico em forma pura.</div>
              <div className="mt-4 h-px bg-white/10" />
              <div className="mt-3 font-[Inter] text-[10px] tracking-[0.2em] text-white/40">CONSULTAR DISPONIBILIDADE</div>
            </div>
            <div className="absolute right-6 bottom-6 hidden md:block font-[Barlow_Condensed] font-black text-[5rem] leading-none tracking-[-0.04em] text-black/5">01</div>
          </div>

          {/* top right */}
          <div className="col-span-12 md:col-span-5 relative rounded-[24px] overflow-hidden bg-[#0A0A0A] text-white border border-black/5 p-6 flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between items-start">
              <span className="font-[Inter] text-[10px] tracking-[0.22em] text-white/40">02 — ADIDAS / OFF-WHITE</span>
              <span className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center"><ArrowUpRight size={14} /></span>
            </div>
            <div className="flex items-end gap-4">
              <img src="/products/adidas-sneaker.png" alt="Adidas Sneaker" className="w-[46%] object-contain" loading="lazy" />
              <div>
                <div className="font-[Barlow_Condensed] font-black text-[1.9rem] leading-[0.9]">SNEAKER</div>
                <div className="font-[Inter] text-xs text-white/55 mt-1">Geometria forte.</div>
              </div>
            </div>
          </div>

          {/* jaqueta */}
          <div className="col-span-6 md:col-span-3 relative rounded-[24px] overflow-hidden bg-[#EDEAE3] border border-black/5 p-5 flex flex-col">
            <span className="font-[Inter] text-[10px] tracking-[0.2em] text-black/40">03 — OUTERWEAR</span>
            <img src="/products/nike-jacket.png" alt="Jaqueta Nike" className="flex-1 object-contain py-4" loading="lazy" />
            <div className="font-[Barlow_Condensed] font-bold tracking-[0.08em]">NIKE JACKET</div>
            <div className="font-[Inter] text-[11px] text-black/50">Grafite / premium</div>
          </div>

          {/* diesel */}
          <div className="col-span-6 md:col-span-2 relative rounded-[24px] overflow-hidden bg-white border border-black/5 p-5 flex flex-col">
            <span className="font-[Inter] text-[10px] tracking-[0.2em] text-black/40">04 — DIESEL</span>
            <img src="/products/diesel-shirt.png" alt="Diesel Essential" className="flex-1 object-contain py-3" loading="lazy" />
            <div className="font-[Barlow_Condensed] font-bold tracking-[0.08em]">ESSENTIAL</div>
            <div className="w-6 h-1 bg-[#D71920] mt-1" />
          </div>

          {/* cap */}
          <div className="col-span-12 md:col-span-5 relative rounded-[24px] overflow-hidden bg-[#2B1A13] text-[#F2ECE3] p-6 flex items-center gap-6">
            <img src="/products/ny-cap.png" alt="NY Cap" className="w-[42%] object-contain" loading="lazy" />
            <div>
              <div className="font-[Inter] text-[10px] tracking-[0.22em] text-white/45">05 — NY CAP</div>
              <div className="font-[Barlow_Condensed] font-black text-[2rem] leading-none mt-1">NY CAP</div>
              <div className="font-[Inter] text-xs text-white/60 mt-1">Chocolate & creme.</div>
              <div className="mt-3 inline-flex text-[11px] tracking-[0.16em] font-[Barlow_Condensed] border border-white/15 rounded-full px-3 py-1">STREETWEAR</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href="https://www.instagram.com/bestmultimarcasaraguatins/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-black text-white font-[Barlow_Condensed] tracking-[0.16em] text-sm px-6 py-3 rounded-full">VER COLEÇÃO <ArrowUpRight size={16} /></a>
          <span className="inline-flex items-center font-[Inter] text-xs tracking-[0.16em] text-black/40 px-4">5 peças • curadoria editorial • sem preço fictício</span>
        </div>
      </div>
    </section>
  )
}

// ── CATEGORIES ───────────────────────────────────────────────────────────────

function Categories() {
  const cats = ['TÊNIS', 'CAMISETAS', 'OVERSIZED', 'JAQUETAS', 'KITS', 'BERMUDAS', 'BONÉS']
  return (
    <section id="catalogo" className="bg-[#0A0A0A] text-white border-y border-white/5">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-8 flex flex-wrap items-center gap-3">
        <span className="font-[Inter] text-[11px] tracking-[0.24em] text-white/35 mr-2">NAVEGAR POR</span>
        {cats.map((c) => (
          <a key={c} href="#new-drop" onClick={(e) => { e.preventDefault(); document.getElementById('new-drop')?.scrollIntoView({ behavior: 'smooth' }) }} className="group inline-flex items-center gap-2 border border-white/10 hover:border-white hover:bg-white hover:text-black rounded-full px-4 py-2 font-[Barlow_Condensed] tracking-[0.16em] text-[0.82rem] transition">
            {c} <span className="opacity-40 group-hover:opacity-100">↗</span>
          </a>
        ))}
      </div>
      <div className="border-t border-white/5 overflow-hidden">
        <div className="flex animate-[marquee_18s_linear_infinite] whitespace-nowrap py-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="font-[Barlow_Condensed] font-black tracking-[0.18em] text-[11px] text-white/25 mx-6">BEST MULTIMARCAS • ARAGUATINS • AUGUSTINÓPOLIS • 11.09.2026 • FROM TOCANTINS TO BRAZIL •</span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </section>
  )
}

// ── BRANDS ──────────────────────────────────────────────────────────────────

function Brands() {
  return (
    <section id="marcas" className="bg-[#F7F5F0] text-[#0A0A0A] py-14 md:py-20 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="flex items-center gap-3 font-[Inter] text-[11px] tracking-[0.28em] text-black/40 mb-8"><span className="w-6 h-px bg-black/15" /> SELECTED BRANDS</div>
        <div className="grid gap-2 font-[Barlow_Condensed] font-black tracking-[-0.04em] leading-[0.86]" style={{ fontSize: 'clamp(3.4rem, 12vw, 10rem)' }}>
          <div className="flex items-baseline gap-4">NIKE <span className="font-[Inter] font-normal tracking-[0.18em] text-[11px] text-black/35 translate-y-[-1.2em]">03 PIECES</span></div>
          <div className="text-transparent" style={{ WebkitTextStroke: '1.4px #0A0A0A' }}>ADIDAS</div>
          <div>DIESEL <span className="inline-block w-3 h-3 bg-[#D71920] rounded-full translate-y-[-0.6em] ml-2" /></div>
          <div className="text-transparent" style={{ WebkitTextStroke: '1.2px rgba(0,0,0,.35)' }}>NY</div>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-4 max-w-[900px]">
          <div className="rounded-2xl bg-white border border-black/5 p-5">
            <div className="font-[Barlow_Condensed] font-bold tracking-[0.12em] text-sm">NIKE</div>
            <div className="font-[Inter] text-xs text-black/55 mt-1">Dunk Panda + Outerwear. Performance e street em escala.</div>
          </div>
          <div className="rounded-2xl bg-[#0A0A0A] text-white p-5">
            <div className="font-[Barlow_Condensed] font-bold tracking-[0.12em] text-sm">ADIDAS</div>
            <div className="font-[Inter] text-xs text-white/60 mt-1">Sneaker off-white. Geometria e conforto editorial.</div>
          </div>
          <div className="rounded-2xl bg-[#D71920] text-white p-5">
            <div className="font-[Barlow_Condensed] font-bold tracking-[0.12em] text-sm">DIESEL + NY</div>
            <div className="text-xs opacity-80 mt-1">Essential e boné chocolate. Fashion e lifestyle.</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── STORES ──────────────────────────────────────────────────────────────────

function Stores() {
  return (
    <section id="lojas" className="bg-[#080808] text-white py-14 md:py-20 border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <h2 className="font-[Barlow_Condensed] font-black leading-[0.88] tracking-[-0.04em]" style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)' }}>
            OUR<br />STORES<span className="text-[#D71920]">.</span>
          </h2>
          <div className="font-[Inter] text-xs tracking-[0.18em] text-white/40">ARAGUATINS — AUGUSTINÓPOLIS • TOCANTINS</div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-[24px] bg-white text-black p-7 md:p-9 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 font-[Barlow_Condensed] font-black text-[7rem] leading-none text-black/5">01</div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-black text-white font-[Inter] text-[10px] tracking-[0.2em] px-3 py-1 rounded-full">UNIDADE 01 — ATIVA</div>
              <div className="font-[Barlow_Condensed] font-black text-[2rem] leading-none tracking-[-0.02em] mt-4">ARAGUATINS</div>
              <div className="font-[Inter] text-sm text-black/60 mt-2">Rua Siqueira Campos<br />Ao lado da Cacau Show<br />Araguatins — Tocantins</div>
              <div className="mt-6 flex items-center gap-2 text-xs font-[Inter] text-black/40"><MapPin size={14} /> Referência: centro — fácil acesso</div>
              <a href="https://www.instagram.com/bestmultimarcasaraguatins/" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 bg-black text-white font-[Barlow_Condensed] tracking-[0.16em] text-sm px-5 py-3 rounded-full">
                VER NO INSTAGRAM <InstagramIcon width={14} height={14} />
              </a>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur p-7 md:p-9 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 font-[Barlow_Condensed] font-black text-[7rem] leading-none text-white/5">02</div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-[#D71920] text-white font-[Inter] text-[10px] tracking-[0.2em] px-3 py-1 rounded-full">NOVA UNIDADE — 11.09.2026</div>
              <div className="font-[Barlow_Condensed] font-black text-[2rem] leading-none tracking-[-0.02em] mt-4">AUGUSTINÓPOLIS</div>
              <div className="font-[Inter] text-sm text-white/60 mt-2">Nova unidade<br />Inauguração 11.09.2026 às 09:00<br />Augustinópolis — Tocantins</div>
              <div className="mt-6 inline-flex items-center gap-2 text-xs font-[Inter] text-white/35 border border-white/10 rounded-full px-3 py-2">Endereço será divulgado na inauguração</div>
              <a href="https://www.instagram.com/bestmultimarcasaugustinopolis/" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 bg-white text-black font-[Barlow_Condensed] tracking-[0.16em] text-sm px-5 py-3 rounded-full">
                VER NO INSTAGRAM <InstagramIcon width={14} height={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── BRAZIL STRIP ────────────────────────────────────────────────────────────

function BrazilStrip() {
  return (
    <section className="bg-[#D71920] text-white overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-10 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="font-[Barlow_Condensed] font-black leading-[0.88] tracking-[-0.04em]" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
          ARAGUATINS<br />
          <span className="inline-flex items-center gap-3"><span className="text-transparent" style={{ WebkitTextStroke: '1.3px #fff' }}>→ BRASIL</span> <span className="hidden md:inline text-[12px] tracking-[0.32em] font-[Inter] font-normal translate-y-2">TO</span></span>
        </div>
        <div className="md:text-right">
          <div className="font-[Barlow_Condensed] font-black tracking-[-0.02em] text-[1.6rem] md:text-[2rem] leading-none">ENVIAMOS PARA TODO O BRASIL</div>
          <div className="font-[Inter] text-xs tracking-[0.18em] opacity-80 mt-2">FROM TOCANTINS TO BRAZIL — CONSULTE DISPONIBILIDADE NO INSTAGRAM</div>
        </div>
      </div>
    </section>
  )
}

// ── INSTAGRAM ──────────────────────────────────────────────────────────────

function InstagramSection() {
  return (
    <section id="contato" className="bg-[#F7F5F0] text-[#0A0A0A] py-14 md:py-20">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-[Barlow_Condensed] font-black leading-[0.88] tracking-[-0.04em]" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.8rem)' }}>
            FOLLOW<br />THE DROP<span className="text-[#D71920]">.</span>
          </h2>
          <div className="font-[Inter] text-xs leading-[1.7] text-black/55 max-w-[34ch]">Acompanhe o dia a dia, bastidores, kits e novidades. Duas contas, uma curadoria.</div>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <a href="https://www.instagram.com/bestmultimarcasaraguatins/" target="_blank" rel="noreferrer" className="group relative rounded-[24px] bg-[#0A0A0A] text-white p-7 md:p-9 overflow-hidden flex flex-col justify-between min-h-[220px] hover:bg-black transition">
            <div className="absolute -right-8 -bottom-8 font-[Barlow_Condensed] font-black text-[8rem] leading-none text-white/5 group-hover:text-white/10 transition">BEST</div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-3 py-1 font-[Inter] text-[10px] tracking-[0.2em] text-white/60"><InstagramIcon width={12} height={12} /> ARAGUATINS</div>
              <div className="font-[Barlow_Condensed] font-bold tracking-[0.06em] text-[1.4rem] mt-4">@bestmultimarcasaraguatins</div>
              <div className="font-[Inter] text-xs text-white/50 mt-1">Loja matriz • Rua Siqueira Campos</div>
            </div>
            <div className="relative mt-6 inline-flex items-center gap-2 font-[Barlow_Condensed] tracking-[0.16em] text-sm">ABRIR INSTAGRAM <ArrowUpRight size={16} /></div>
          </a>

          <a href="https://www.instagram.com/bestmultimarcasaugustinopolis/" target="_blank" rel="noreferrer" className="group relative rounded-[24px] bg-white border border-black/10 p-7 md:p-9 overflow-hidden flex flex-col justify-between min-h-[220px] hover:border-black/20 transition">
            <div className="absolute -right-8 -bottom-8 font-[Barlow_Condensed] font-black text-[8rem] leading-none text-black/5">BEST</div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-[#D71920] text-white rounded-full px-3 py-1 font-[Inter] text-[10px] tracking-[0.2em]"><span className="w-2 h-2 bg-white rounded-full animate-pulse" /> AUGUSTINÓPOLIS — NOVA</div>
              <div className="font-[Barlow_Condensed] font-bold tracking-[0.06em] text-[1.4rem] mt-4">@bestmultimarcasaugustinopolis</div>
              <div className="font-[Inter] text-xs text-black/50 mt-1">Nova unidade • 11.09.2026 • 09:00</div>
            </div>
            <div className="relative mt-6 inline-flex items-center gap-2 font-[Barlow_Condensed] tracking-[0.16em] text-sm">ABRIR INSTAGRAM <ArrowUpRight size={16} /></div>
          </a>
        </div>

        <div className="mt-6 rounded-full border border-black/10 bg-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 font-[Inter] text-xs tracking-[0.12em] text-black/50">
          <span>CONSULTAR DISPONIBILIDADE VIA INSTAGRAM • SEM PREÇO FICTÍCIO • SEM CHECKOUT FAKE</span>
          <span className="hidden md:inline">TOCANTINS → BRASIL</span>
        </div>
      </div>
    </section>
  )
}

// ── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#080808] text-white border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <div className="font-[Barlow_Condensed] font-black tracking-[0.2em] text-lg">BEST MULTIMARCAS</div>
            <div className="font-[Inter] text-xs tracking-[0.18em] text-white/35 mt-1">ARAGUATINS • AUGUSTINÓPOLIS • TOCANTINS — BRASIL</div>
          </div>
          <div className="flex gap-6 font-[Inter] text-xs tracking-[0.16em] text-white/45">
            <a href="https://www.instagram.com/bestmultimarcasaraguatins/" target="_blank" rel="noreferrer" className="hover:text-white transition">INSTAGRAM ARAGUATINS</a>
            <a href="https://www.instagram.com/bestmultimarcasaugustinopolis/" target="_blank" rel="noreferrer" className="hover:text-white transition">INSTAGRAM AUGUSTINÓPOLIS</a>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-wrap justify-between gap-3 font-[Inter] text-[11px] tracking-[0.16em] text-white/25">
          <span>© 2026 BEST MULTIMARCAS. FASHION • STREETWEAR • PREMIUM.</span>
          <span>11.09.2026 — A NEW CHAPTER</span>
        </div>
      </div>
    </footer>
  )
}

// ── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  // reveal on scroll for non-hero sections
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            gsap.fromTo(e.target, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#080808]">
      <Header onNav={scrollTo} />
      <HeroSlider />
      <div data-reveal><Inauguration /></div>
      <div data-reveal><NewDrop /></div>
      <Categories />
      <div data-reveal><Brands /></div>
      <div data-reveal><Stores /></div>
      <BrazilStrip />
      <div data-reveal><InstagramSection /></div>
      <Footer />
    </div>
  )
}
