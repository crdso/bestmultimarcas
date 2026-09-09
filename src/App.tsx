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
    bg: '#EEEDE8',
    glow: 'radial-gradient(ellipse 68% 58% at 50% 48%, rgba(0,0,0,.06), transparent 62%)',
    vignette: 'radial-gradient(ellipse 75% 70% at 50% 50%, transparent 42%, rgba(0,0,0,.06) 100%)',
    textColor: 'dark',
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
    bg: '#D8D8D3',
    glow: 'radial-gradient(ellipse 68% 58% at 50% 48%, rgba(0,0,0,.05), transparent 62%)',
    vignette: 'radial-gradient(ellipse 75% 70% at 50% 50%, transparent 42%, rgba(0,0,0,.05) 100%)',
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
    bg: '#171717',
    glow: 'radial-gradient(ellipse 68% 58% at 50% 48%, rgba(255,255,255,.07), transparent 62%)',
    vignette: 'radial-gradient(ellipse 75% 70% at 50% 50%, transparent 32%, rgba(0,0,0,.42) 100%)',
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
    bg: '#E8E1D4',
    glow: 'radial-gradient(ellipse 68% 58% at 50% 48%, rgba(0,0,0,.05), transparent 62%)',
    vignette: 'radial-gradient(ellipse 78% 70% at 50% 50%, transparent 42%, rgba(0,0,0,.06) 100%)',
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
    bg: '#B7AA95',
    glow: 'radial-gradient(ellipse 68% 58% at 50% 48%, rgba(0,0,0,.06), transparent 62%)',
    vignette: 'radial-gradient(ellipse 80% 74% at 50% 50%, transparent 42%, rgba(0,0,0,.06) 100%)',
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

// ── NOVA UNIDADE ────────────────────────────────────────────────────────────

function NovaUnidade() {
  const { d, h, m, s, isPast } = useCountdown('2026-09-11T09:00:00-03:00')
  return (
    <section id="nova-unidade" className="bg-[#0B0B0B] text-white py-16 md:py-20 border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="font-[Inter] text-[11px] tracking-[0.28em] text-white/40 flex items-center gap-2"><span className="w-6 h-px bg-white/15" /> 11 DE SETEMBRO • 09:00</div>
        <h2 className="font-[Barlow_Condensed] font-black leading-[0.88] tracking-[-0.04em] mt-3" style={{ fontSize: 'clamp(2.8rem,7vw,5.4rem)' }}>
          UMA NOVA<br /><span className="text-[#D71920]">BEST.</span><br />AGORA EM<br /><span className="text-transparent" style={{ WebkitTextStroke: '1.2px #F5F5F2' }}>AUGUSTINÓPOLIS</span>
        </h2>
        <p className="mt-4 font-[Inter] text-sm leading-[1.7] text-white/55 max-w-[42ch]">De Araguatins para Augustinópolis. A mesma curadoria que você já conhece, agora mais perto.</p>
        <div className="mt-10 border-t border-white/10 pt-8">
          {isPast ? (
            <div>
              <div className="font-[Barlow_Condensed] font-black leading-none tracking-[-0.04em]" style={{ fontSize: 'clamp(2.4rem,6vw,4rem)' }}>A BEST CHEGOU.</div>
              <div className="font-[Inter] text-sm text-white/55 mt-2">Nossa nova unidade já está atendendo.</div>
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
              <div className="mt-4 font-[Inter] text-[11px] tracking-[0.16em] text-white/35">11.09.2026 — 09:00 • AUGUSTINÓPOLIS — TO • DE ARAGUATINS PARA AUGUSTINÓPOLIS</div>
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
    <section id="variedade" className="bg-[#111111] text-white py-16 md:py-20 border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="max-w-[720px]">
          <h2 className="font-[Barlow_Condensed] font-black leading-[0.9] tracking-[-0.04em]" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.6rem)' }}>MUITO<br />ALÉM DISSO<span className="text-[#D71920]">.</span></h2>
          <p className="mt-4 font-[Inter] text-[15px] leading-[1.7] text-white/55">Tênis, camisetas, jaquetas, kits, bermudas, bonés e novidades de diversas marcas.</p>
          <p className="mt-2 font-[Inter] text-[13px] leading-[1.7] text-white/45">Novas peças chegando sempre.</p>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8">
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-[Barlow_Condensed] font-black tracking-[-0.02em] leading-none" style={{ fontSize: 'clamp(1.6rem, 4.5vw, 3.2rem)' }}>
            {['TÊNIS', 'CAMISETAS', 'JAQUETAS', 'KITS', 'BERMUDAS', 'BONÉS'].map((c) => (
              <span key={c} className="text-white">{c}</span>
            ))}
          </div>
          <div className="mt-3 h-px bg-white/10" />
          <div className="mt-3 font-[Inter] text-xs tracking-[0.16em] text-white/40">NOVIDADES • VARIEDADE • ESTILO</div>
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
    <section id="lojas" className="bg-[#0B0B0B] text-white py-16 md:py-20 border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="font-[Inter] text-[11px] tracking-[0.28em] text-white/40 flex items-center gap-2"><span className="w-6 h-px bg-white/15" /> NOSSAS LOJAS</div>
        <div className="mt-10 grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <div className="font-[Barlow_Condensed] font-black text-[1.9rem] leading-none tracking-[-0.02em]">ARAGUATINS</div>
            <div className="mt-2 font-[Inter] text-sm leading-[1.6] text-white/60">Rua Siqueira Campos<br />Ao lado da Cacau Show<br />Araguatins — Tocantins</div>
            <a href="https://www.instagram.com/bestmultimarcasaraguatins/" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 font-[Barlow_Condensed] tracking-[0.14em] text-sm underline underline-offset-4">VER NO INSTAGRAM <InstagramIcon width={14} height={14} /></a>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 bg-[#D71920] text-white font-[Inter] text-[10px] tracking-[0.18em] px-2.5 py-1">NOVA UNIDADE</div>
            <div className="font-[Barlow_Condensed] font-black text-[1.9rem] leading-none tracking-[-0.02em] mt-3">AUGUSTINÓPOLIS</div>
            <div className="mt-2 font-[Inter] text-sm leading-[1.6] text-white/60">Nova unidade<br />11.09.2026 — 09:00<br />Augustinópolis — Tocantins</div>
            <a href="https://www.instagram.com/bestmultimarcasaugustinopolis/" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 font-[Barlow_Condensed] tracking-[0.14em] text-sm underline underline-offset-4">VER NO INSTAGRAM <InstagramIcon width={14} height={14} /></a>
          </div>
        </div>
        <div className="mt-10 h-px bg-white/10" />
        <div className="mt-4 flex items-center gap-2 font-[Inter] text-xs tracking-[0.16em] text-white/40"><MapPin size={14} /> TOCANTINS — BRASIL</div>
      </div>
    </section>
  )
}

function BrasilStrip() {
  return (
    <section className="bg-[#111111] text-white border-y border-white/5">
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
