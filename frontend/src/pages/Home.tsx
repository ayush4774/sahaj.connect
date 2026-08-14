import { useState, useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import LotusDecor from '../components/LotusDecor'




const PARTICLES = [
  { id: 0,  left: 11,  top: 72, size: 3,   delay: 0,    dur: 10 },
  { id: 1,  left: 23,  top: 58, size: 2,   delay: 1.6,  dur: 12 },
  { id: 2,  left: 37,  top: 81, size: 3.5, delay: 0.8,  dur: 9  },
  { id: 3,  left: 51,  top: 66, size: 2,   delay: 2.3,  dur: 11 },
  { id: 4,  left: 66,  top: 76, size: 3,   delay: 0.4,  dur: 13 },
  { id: 5,  left: 78,  top: 61, size: 2,   delay: 1.9,  dur: 8  },
  { id: 6,  left: 88,  top: 73, size: 3.5, delay: 3.1,  dur: 10 },
  { id: 7,  left: 7,   top: 47, size: 2,   delay: 0.6,  dur: 14 },
  { id: 8,  left: 31,  top: 41, size: 3,   delay: 2.6,  dur: 11 },
  { id: 9,  left: 57,  top: 51, size: 2,   delay: 1.3,  dur: 9  },
  { id: 10, left: 71,  top: 43, size: 3.5, delay: 0.3,  dur: 12 },
  { id: 11, left: 93,  top: 59, size: 2,   delay: 2.1,  dur: 10 },
  { id: 12, left: 17,  top: 86, size: 3,   delay: 1.0,  dur: 15 },
  { id: 13, left: 44,  top: 89, size: 2,   delay: 3.6,  dur: 9  },
  { id: 14, left: 62,  top: 36, size: 2.5, delay: 0.7,  dur: 11 },
  { id: 15, left: 83,  top: 33, size: 2,   delay: 4.0,  dur: 13 },
  { id: 16, left: 4,   top: 63, size: 2.5, delay: 1.4,  dur: 10 },
  { id: 17, left: 48,  top: 30, size: 3,   delay: 2.8,  dur: 12 },
]

const RAYS = [15, 40, 68, 95, 122, 150, 178, 205, 232, 258, 285, 312]
const CHAKRA_COLORS = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#5e35b1', '#8e24aa']

const JOURNEY_STEPS = [
  { icon: '📖', title: 'Learn',             label: 'Sahaja Yoga',          desc: 'Discover the ancient science of Self-Realization as taught by Shri Mataji Nirmala Devi.' },
  { icon: '✨', title: 'Self-Realization',  label: 'Awaken Within',        desc: 'Experience the spontaneous awakening of Kundalini energy — effortless, free, and profound.' },
  { icon: '📍', title: 'Nearest Center',    label: 'Find Your Place',      desc: 'Locate a Sahaja Yoga meditation center in Pune, just minutes from where you are.' },
  { icon: '🤝', title: 'Collective',        label: 'Meditate Together',    desc: 'Join the local community for weekly group meditation, bhajans, and shared growth.' },
  { icon: '🌅', title: '21-Day Journey',    label: 'Deepen Your Practice', desc: 'A guided 21-day program to anchor transformation in daily life.' },
  { icon: '💫', title: 'Lifelong Practice', label: 'Stay Connected',       desc: 'Remain with the global Sahaja Yoga family and continue growing together.' },
]

const CENTERS = [
  { name: 'Koregaon Park Center', area: 'Koregaon Park, Pune', distance: '2.1 km away', timing: 'Tue & Thu — 7:00 PM', coordinator: 'Shri Ramesh Patil', languages: ['Marathi', 'Hindi', 'English'], whatsapp: '919876543210', img: 'https://images.unsplash.com/photo-1686749143613-0eeacff36894?w=640&h=400&fit=crop&auto=format' },
  { name: 'Kothrud Meditation Center', area: 'Kothrud, Pune', distance: '4.3 km away', timing: 'Wed & Sun — 6:30 PM', coordinator: 'Shrimati Asha Kulkarni', languages: ['Marathi', 'English'], whatsapp: '919876543211', img: 'https://images.unsplash.com/photo-1677741447985-da1d90c00742?w=640&h=400&fit=crop&auto=format' },
  { name: 'Aundh Community Hall', area: 'Aundh, Pune', distance: '6.8 km away', timing: 'Mon & Fri — 7:30 PM', coordinator: 'Shri Vinod Sharma', languages: ['Hindi', 'English'], whatsapp: '919876543212', img: 'https://images.unsplash.com/photo-1529693662653-9d480530a697?w=640&h=400&fit=crop&auto=format' },
]

const UPDATES = [
  { tag: 'Announcement', title: "Shri Mataji's Birthday Puja 2025", desc: 'Annual celebration honoring the founder of Sahaja Yoga with collective meditation, bhajans, and cultural programs across all Pune centers.', date: 'March 21, 2025', img: 'https://images.unsplash.com/photo-1762571807054-d90195661aa1?w=900&h=480&fit=crop&auto=format' },
  { tag: 'Workshop',     title: "Beginner's Meditation Workshop",   desc: 'A 3-day guided workshop for first-time seekers exploring Sahaja Yoga.',                                                                         date: 'Feb 14, 2025',   img: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=320&h=220&fit=crop&auto=format' },
  { tag: 'Festival',     title: 'Holi Collective Meditation',        desc: 'Celebrate the festival of colours with joyful collective meditation in Pune.',                                                                   date: 'Mar 14, 2025',   img: 'https://images.unsplash.com/photo-1687875495230-96dfea96d9da?w=320&h=220&fit=crop&auto=format' },
  { tag: 'Gallery',      title: 'Diwali Puja Gallery 2024',          desc: 'Beautiful moments from the Diwali Puja celebration across Pune centers.',                                                                        date: 'Nov 1, 2024',    img: 'https://images.unsplash.com/photo-1667374073450-81dfcb5ebfcf?w=320&h=220&fit=crop&auto=format' },
]

const GALLERY = [
  { img: 'https://images.unsplash.com/photo-1667374073450-81dfcb5ebfcf?w=500&h=340&fit=crop&auto=format',  cat: 'Collective Meditation', title: 'Pune Public Program 2025' },
  { img: 'https://images.unsplash.com/photo-1687436874774-fa0d4616bec9?w=400&h=560&fit=crop&auto=format',  cat: 'Guru Puja',             title: 'Guru Puja Celebrations'  },
  { img: 'https://images.unsplash.com/photo-1572853366277-ecbf6650ad8e?w=360&h=520&fit=crop&auto=format',  cat: 'Youth Events',          title: 'Youth Sahaja Camp'       },
  { img: 'https://images.unsplash.com/photo-1529693662653-9d480530a697?w=560&h=320&fit=crop&auto=format',  cat: 'Public Programs',       title: 'Open Meditation Session' },
  { img: 'https://images.unsplash.com/photo-1687875495230-96dfea96d9da?w=380&h=480&fit=crop&auto=format',  cat: "Children's Programs",   title: "Children's Sahaja Yoga"  },
  { img: 'https://images.unsplash.com/photo-1677741447985-da1d90c00742?w=500&h=320&fit=crop&auto=format',  cat: 'Workshop',              title: "Women's Meditation Workshop" },
  { img: 'https://images.unsplash.com/photo-1762571807054-d90195661aa1?w=380&h=380&fit=crop&auto=format',  cat: 'Nature & Meditation',   title: 'Lotus Garden Program'    },
  { img: 'https://images.unsplash.com/photo-1686749143613-0eeacff36894?w=500&h=360&fit=crop&auto=format',  cat: 'Collective Meditation', title: 'Sunday Collective — Kothrud' },
]

const MAP_MARKERS = [
  { top: '28%', left: '47%', name: 'Koregaon Park', dist: '2.1 km' },
  { top: '58%', left: '28%', name: 'Kothrud',       dist: '4.3 km' },
  { top: '22%', left: '66%', name: 'Aundh',         dist: '6.8 km' },
  { top: '68%', left: '58%', name: 'Hadapsar',      dist: '9.2 km' },
  { top: '42%', left: '72%', name: 'Baner',         dist: '7.5 km' },
]

function useVisible(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function FadeIn({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useVisible()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.75s cubic-bezier(0.4,0,0.2,1) ${delay}s, transform 0.75s cubic-bezier(0.4,0,0.2,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const [hoveredCenter, setHoveredCenter] = useState<number | null>(null)
  const [activeMarker, setActiveMarker] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeGallery, setActiveGallery] = useState('All')

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  
  const GALLERY_CATS = ['All', 'Public Programs', 'Guru Puja', 'Youth Events', "Children's Programs", 'Workshop']
  const heroParallaxY = scrollY * 0.28
  const heroOpacity   = Math.max(0, 1 - scrollY / 550)
  const filteredMarkers = MAP_MARKERS.filter(m =>
    !searchQuery.trim() || m.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  )
  const filteredGallery = activeGallery === 'All'
    ? GALLERY
    : GALLERY.filter(item => item.cat === activeGallery)

  return (
    <div className="min-h-screen bg-[#fafbff] text-[#1a1f2e] overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ paddingTop: '36px' }}>
        <div
          className="absolute inset-0 bg-[#0d2b45]"
          style={{ transform: `translateY(${heroParallaxY}px)`, opacity: heroOpacity }}
        >
          <img src="https://images.unsplash.com/photo-1762571807054-d90195661aa1?w=1920&h=1080&fit=crop&auto=format" alt="Pink lotus blooming against blue sky" className="w-full h-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d2b45]/80 via-[#0d2b45]/28 to-[#0d2b45]/88" />
        </div>

        {/* Light rays */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {RAYS.map((deg, i) => (
            <div key={i} className="absolute top-1/2 left-1/2 origin-left"
              style={{ width: '85%', height: '1.5px', background: 'linear-gradient(to right, rgba(255,255,255,0.16) 0%, transparent 80%)', transform: `rotate(${deg}deg)`, animation: `ray-pulse ${3.8 + (i % 4) * 0.55}s ease-in-out infinite`, animationDelay: `${(i * 0.28) % 3}s` }}
            />
          ))}
        </div>

        {/* Glow aura */}
        <div className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
          style={{ width: '480px', height: '480px', background: 'radial-gradient(circle, rgba(196,151,58,0.20) 0%, rgba(74,144,196,0.14) 38%, transparent 68%)', animation: 'glow-ring 4.5s ease-in-out infinite' }}
        />

        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {PARTICLES.map(p => (
            <div key={p.id} className="absolute rounded-full bg-white"
              style={{ left: `${p.left}%`, top: `${p.top}%`, width: `${p.size}px`, height: `${p.size}px`, opacity: 0.55, animation: `float-particle ${p.dur}s ease-in-out infinite`, animationDelay: `${p.delay}s` }}
            />
          ))}
        </div>

        {/* Three Channels */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
          <path d="M720,0 L720,900" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
          <path d="M720,0 Q570,160 610,320 Q650,480 560,640 Q490,790 590,900" stroke="rgba(147,210,255,0.10)" strokeWidth="1.5" />
          <path d="M720,0 Q870,160 830,320 Q790,480 880,640 Q950,790 850,900" stroke="rgba(255,196,80,0.10)" strokeWidth="1.5" />
        </svg>

        {/* Chakra sidebar */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3.5">
          {CHAKRA_COLORS.map((color, i) => <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, opacity: 0.45 }} />)}
        </div>

        <div className="relative z-10 text-center px-6 max-w-[860px] mx-auto" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/70 text-[10px] tracking-[0.22em] uppercase mb-8 font-medium">
            ✦ &nbsp;Sahaja Yoga · Pune, Maharashtra
          </div>
          <h1 className="font-display text-[clamp(2.5rem,7vw,5.2rem)] font-semibold text-white leading-[1.07] mb-5">
            Welcome to<br />
            <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">Sahaja Connect</em>
          </h1>
          <p className="text-[1.1rem] sm:text-xl text-white/65 font-body mb-4 tracking-wide">Your Gateway to Sahaja Yoga</p>
          <p className="text-sm sm:text-[15px] text-white/48 max-w-[600px] mx-auto leading-[1.95] mb-5">
            Begin your journey toward inner peace, Self-Realization, and collective meditation. Whether you are discovering Sahaja Yoga for the first time or finding your nearest center — we are here to gently guide you, every step of the way.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-1 mb-10 text-white/32 text-[11.5px] tracking-wide">
            <span>Meditation is always free</span><span className="text-white/18">·</span>
            <span>Everyone is welcome</span><span className="text-white/18">·</span>
            <span>No prior experience required</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-[640px] mx-auto mb-8">
            <Link to="/journey" className="card-glass-new group rounded-2xl p-6 text-left">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">🌸</div>
              <div className="text-white font-semibold text-[17px] mb-1.5">I'm New Here</div>
              <div className="text-white/52 text-[13px] leading-[1.7]">Learn about Sahaja Yoga, receive Self-Realization, and begin your guided journey.</div>
              <div className="mt-4 text-amber-400 text-[11px] font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300 uppercase tracking-wider">Begin Journey <span className="text-sm">→</span></div>
            </Link>
            <Link to="/find-center" className="card-glass-gold group rounded-2xl p-6 text-left">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">📍</div>
              <div className="text-white font-semibold text-[17px] mb-1.5">Find a Center Near Me</div>
              <div className="text-white/52 text-[13px] leading-[1.7]">Use your location to discover the nearest Sahaja Yoga meditation center in Pune.</div>
              <div className="mt-4 text-amber-300 text-[11px] font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300 uppercase tracking-wider">Find Centers <span className="text-sm">→</span></div>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5 mb-12">
            {[{icon:'🌿',label:'Free Meditation'},{icon:'🕊️',label:'Everyone Welcome'},{icon:'🌎',label:'Global Community'},{icon:'📍',label:'Find Nearby Centers'}].map(chip => (
              <div key={chip.label} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/8 backdrop-blur-sm border border-white/12 text-white/58 text-[11.5px] font-medium hover:bg-white/14 hover:border-white/20 transition-all duration-200 cursor-default">
                <span className="text-sm">{chip.icon}</span>{chip.label}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-1.5 text-white/24 text-[9.5px] tracking-[0.22em] uppercase">
            <span>Scroll to discover</span>
            <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Featured Event ── */}
      <FadeIn>
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-px bg-amber-400" />
            <span className="text-amber-600 text-[10px] tracking-[0.22em] uppercase font-semibold">Featured Event</span>
          </div>
          <div className="grid lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden shadow-2xl shadow-sky-100 border border-sky-100">
            <div className="lg:col-span-3 relative bg-sky-200 min-h-[280px] lg:min-h-[440px] overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1686749143613-0eeacff36894?w=1000&h=700&fit=crop&auto=format" alt="Group yoga meditation" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d2b45]/50 to-transparent lg:hidden" />
              <span className="absolute top-5 left-5 px-3.5 py-1.5 rounded-full bg-amber-500 text-white text-[11px] font-bold tracking-wide shadow-lg">✦ Upcoming Puja</span>
            </div>
            <div className="lg:col-span-2 bg-white p-8 lg:p-12 flex flex-col justify-center">
              <div className="text-[10px] text-amber-500 uppercase tracking-[0.2em] font-semibold mb-3">March 21, 2025</div>
              <h3 className="font-display text-[1.8rem] lg:text-[2.1rem] font-semibold text-[#1a1f2e] leading-[1.15] mb-4">Shri Mataji's<br />Birthday Puja 2025</h3>
              <p className="text-[#1a1f2e]/55 text-[13.5px] leading-[1.8] mb-7">Annual celebration honoring the founder of Sahaja Yoga with collective meditation, bhajans, and cultural programs across all Pune centers.</p>
              <div className="space-y-3.5 mb-8">
                {[{icon:'🕖',label:'Time',value:'6:30 PM onwards'},{icon:'🏛️',label:'Venue',value:'Bal Gandharva Rang Mandir, Pune'},{icon:'🎟️',label:'Entry',value:'Free — All Are Welcome'}].map(item => (
                  <div key={item.label} className="flex items-center gap-3.5">
                    <span className="text-xl w-7 flex-shrink-0">{item.icon}</span>
                    <div>
                      <div className="text-[9.5px] text-[#1a1f2e]/35 uppercase tracking-[0.15em] mb-0.5">{item.label}</div>
                      <div className="text-[13.5px] font-medium text-[#1a1f2e]">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 flex-wrap">
                <a href="https://www.google.com/maps/search/?api=1&query=Sahaja+Yoga+Pune" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a1f2e] hover:bg-[#283040] text-white text-[13px] font-semibold transition-colors shadow-sm hover:-translate-y-0.5 duration-200"><span>🗺️</span> Google Maps</a>
                <Link to="/events" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-[13px] font-semibold hover:bg-sky-100 transition-colors hover:-translate-y-0.5 duration-200">Learn More <span>→</span></Link>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── Journey Pathway ── */}
      <FadeIn>
        <section className="py-24 bg-gradient-to-b from-sky-50/60 to-[#fafbff] relative overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] text-sky-200 opacity-20 pointer-events-none"><LotusDecor /></div>
          <div className="relative z-10 max-w-xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-sky-600 text-[10px] tracking-[0.2em] uppercase font-semibold mb-4">Your Journey</div>
              <h2 className="font-display text-[clamp(2rem,5vw,3rem)] font-semibold text-[#1a1f2e] leading-tight mb-3">Discover Your Journey</h2>
              <p className="text-[#1a1f2e]/50 text-[13.5px] leading-relaxed">A gentle, luminous path unfolds — one step at a time.</p>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-sky-300 via-amber-300 to-sky-400 opacity-35" />
              {JOURNEY_STEPS.map((step, i) => {
                const isLeft = i % 2 === 0
                const isHovered = hoveredStep === i
                return (
                  <div key={i} className={`relative flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`} onMouseEnter={() => setHoveredStep(i)} onMouseLeave={() => setHoveredStep(null)}>
                    <div className={`w-[calc(50%-2.5rem)] py-4 ${isLeft ? 'pr-5' : 'pl-5'}`}>
                      <div className={`cursor-pointer rounded-2xl px-4 py-3.5 border transition-all duration-350 ${isHovered ? 'bg-white border-amber-300 shadow-xl shadow-amber-100/70' : 'bg-white/70 border-sky-100 shadow-sm'} ${isLeft ? 'text-right' : 'text-left'}`}>
                        <div className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 transition-colors duration-300 ${isHovered ? 'text-amber-500' : 'text-sky-400'}`}>Step {i + 1}</div>
                        <div className="text-[14px] font-semibold text-[#1a1f2e] leading-snug">{step.title}</div>
                        <div className="text-[11px] text-sky-600 font-medium mb-1">{step.label}</div>
                        <div className={`text-[11.5px] text-[#1a1f2e]/48 leading-relaxed overflow-hidden transition-all duration-300 ${isHovered ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>{step.desc}</div>
                      </div>
                    </div>
                    <div className="w-20 flex-shrink-0 flex items-center justify-center relative z-10">
                      <div className={`w-[3.5rem] h-[3.5rem] rounded-full flex items-center justify-center text-2xl border-2 transition-all duration-400 ${isHovered ? 'bg-amber-500 border-amber-400 scale-115 journey-node-active' : 'bg-white border-sky-200 shadow-md'}`}>{step.icon}</div>
                    </div>
                    <div className="w-[calc(50%-2.5rem)]" />
                  </div>
                )
              })}
              <div className="flex justify-center mt-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl shadow-xl shadow-amber-200/60" style={{ animation: 'slow-drift 6s ease-in-out infinite' }}>🌸</div>
              </div>
            </div>
            <div className="text-center mt-12">
              <Link to="/journey" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#1a1f2e] hover:bg-[#283040] text-white font-semibold text-[14px] transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5">🌸 Start Your Journey <span>→</span></Link>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── Latest Updates ── */}
      <FadeIn>
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2"><div className="w-6 h-px bg-amber-400" /><span className="text-amber-600 text-[10px] tracking-[0.22em] uppercase font-semibold">Latest Updates</span></div>
              <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-[#1a1f2e]">News & Announcements</h2>
            </div>
            <Link to="/events" className="hidden sm:flex items-center gap-1.5 text-[13px] text-sky-600 font-semibold hover:text-sky-500 transition-colors">View All <span>→</span></Link>
          </div>
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 rounded-2xl overflow-hidden bg-white shadow-md border border-sky-50 group hover:shadow-2xl transition-all duration-400 cursor-pointer hover:-translate-y-1">
              <div className="relative bg-sky-200 h-64 overflow-hidden">
                <img src={UPDATES[0].img} alt={UPDATES[0].title} className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2b45]/55 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold tracking-wide">{UPDATES[0].tag}</span>
              </div>
              <div className="p-7">
                <div className="text-[10px] text-[#1a1f2e]/35 uppercase tracking-[0.18em] mb-2">{UPDATES[0].date}</div>
                <h3 className="font-display text-[1.35rem] font-semibold text-[#1a1f2e] mb-2.5 leading-snug">{UPDATES[0].title}</h3>
                <p className="text-[13px] text-[#1a1f2e]/55 leading-[1.8] mb-5">{UPDATES[0].desc}</p>
                <Link to="/events" className="text-sky-600 text-[13px] font-semibold hover:text-sky-500 flex items-center gap-1.5 transition-colors">Read More <span>→</span></Link>
              </div>
            </div>
            <div className="space-y-4">
              {UPDATES.slice(1).map((u, i) => (
                <div key={i} className="flex gap-4 bg-white rounded-2xl p-4 border border-sky-50 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-sky-100 flex-shrink-0"><img src={u.img} alt={u.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400" /></div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <span className="inline-block text-[8.5px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-600 font-bold uppercase tracking-wider mb-1.5">{u.tag}</span>
                    <div className="text-[13px] font-semibold text-[#1a1f2e] leading-snug mb-1 line-clamp-2">{u.title}</div>
                    <div className="text-[11px] text-[#1a1f2e]/38">{u.date}</div>
                  </div>
                </div>
              ))}
              <Link to="/events" className="block w-full text-center py-3.5 rounded-xl border border-dashed border-sky-300 text-sky-600 text-[13px] font-semibold hover:bg-sky-50 transition-colors">View All Updates</Link>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── Map Preview ── */}
      <FadeIn>
        <section className="py-20 bg-gradient-to-b from-[#fafbff] to-sky-50/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4"><div className="w-6 h-px bg-amber-400" /><span className="text-amber-600 text-[10px] tracking-[0.22em] uppercase font-semibold">Center Locations</span></div>
                <h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] font-semibold text-[#1a1f2e] leading-[1.15] mb-5">Sahaja Yoga<br />Centers Across<br /><em className="not-italic text-sky-500">Pune</em></h2>
                <p className="text-[#1a1f2e]/55 text-[13.5px] leading-[1.85] mb-8 max-w-sm">Over 20 meditation centers spread across Pune — there's always one near you. All programs are free and open to everyone.</p>
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[['20+','Centers'],['50+','Programs/week'],['1,000+','Meditators']].map(([num,label]) => (
                    <div key={label} className="text-center p-4 bg-white rounded-2xl shadow-sm border border-sky-100 hover:border-amber-200 hover:shadow-md transition-all duration-200">
                      <div className="font-display text-[1.5rem] font-semibold text-amber-500 leading-none mb-1">{num}</div>
                      <div className="text-[10px] text-[#1a1f2e]/45 leading-snug">{label}</div>
                    </div>
                  ))}
                </div>
                <a href="/find-center" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-semibold text-[13.5px] transition-all duration-200 shadow-md hover:-translate-y-0.5">🗺️ Explore All Centers</a>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-sky-200/80 border border-sky-100">
                <div className="bg-white px-4 py-3 border-b border-sky-100 flex items-center gap-3 shadow-sm">
                  <div className="flex-1 flex items-center gap-2.5 bg-sky-50 rounded-xl px-3.5 py-2.5 border border-sky-200">
                    <svg className="w-4 h-4 text-sky-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search centers in Pune..." className="bg-transparent text-[13px] text-[#1a1f2e] placeholder-sky-400 flex-1 outline-none" />
                  </div>
                  <button className="px-3.5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-[12px] font-semibold transition-colors flex-shrink-0">Near Me</button>
                </div>
                <div className="relative h-[380px] lg:h-[440px] bg-sky-200">
                  <img src="https://images.unsplash.com/photo-1779445476401-996e20b91f08?w=900&h=700&fit=crop&auto=format" alt="Peaceful landscape" className="w-full h-full object-cover opacity-38" />
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/42 to-blue-700/28" />
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {[20,40,60,80].map(v => (<g key={v}><line x1={v} y1="0" x2={v} y2="100" stroke="rgba(255,255,255,0.07)" strokeWidth="0.3" /><line x1="0" y1={v} x2="100" y2={v} stroke="rgba(255,255,255,0.07)" strokeWidth="0.3" /></g>))}
                  </svg>
                  {filteredMarkers.map((m, i) => (
                    <div key={m.name} className="absolute cursor-pointer" style={{ top: m.top, left: m.left }} onMouseEnter={() => setActiveMarker(i)} onMouseLeave={() => setActiveMarker(null)}>
                      <div className="relative flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-sm transition-all duration-250 ${activeMarker === i ? 'bg-amber-500 scale-135' : 'bg-amber-400'}`} style={activeMarker === i ? { boxShadow: '0 0 18px rgba(196,151,58,0.70)' } : {}}>🪷</div>
                        {activeMarker === i && (
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg px-2.5 py-1.5 whitespace-nowrap">
                            <div className="text-[11px] font-semibold text-[#1a1f2e]">{m.name}</div>
                            <div className="text-[10px] text-sky-500">{m.dist}</div>
                          </div>
                        )}
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5 opacity-60" />
                      </div>
                    </div>
                  ))}
                  <div className="absolute bottom-4 left-4 flex flex-col gap-1">
                    <button className="w-8 h-8 rounded-lg bg-white/92 backdrop-blur-sm shadow-md text-[#1a1f2e] text-base font-bold hover:bg-white transition-colors flex items-center justify-center">+</button>
                    <button className="w-8 h-8 rounded-lg bg-white/92 backdrop-blur-sm shadow-md text-[#1a1f2e] text-base font-bold hover:bg-white transition-colors flex items-center justify-center">−</button>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3.5 py-2 text-[11px] font-semibold text-[#1a1f2e] shadow-md">📍 Pune, Maharashtra</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── Featured Centers ── */}
      <FadeIn>
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3"><div className="w-5 h-px bg-amber-400" /><span className="text-amber-600 text-[10px] tracking-[0.22em] uppercase font-semibold">Featured Centers</span><div className="w-5 h-px bg-amber-400" /></div>
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-[#1a1f2e]">Find Your Nearest Center</h2>
            <p className="text-[#1a1f2e]/50 text-[13px] mt-3 max-w-sm mx-auto">All programs are free of charge and open to everyone.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {CENTERS.map((center, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-sky-50 shadow-md transition-all duration-400 cursor-pointer group hover:shadow-2xl hover:shadow-sky-100/80 hover:-translate-y-2" onMouseEnter={() => setHoveredCenter(i)} onMouseLeave={() => setHoveredCenter(null)}>
                <div className="relative bg-sky-200 h-52 overflow-hidden">
                  <img src={center.img} alt={center.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-112" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2e]/55 to-transparent" />
                  <div className="absolute bottom-3 left-3"><div className="bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 text-[10px] font-semibold text-sky-600 flex items-center gap-1 shadow-sm">📍 {center.distance}</div></div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-[1.1rem] font-semibold text-[#1a1f2e] mb-1">{center.name}</h3>
                  <div className="text-sky-600 text-[12px] font-medium mb-4 flex items-center gap-1"><span>📍</span> {center.area}</div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2.5 text-[12px] text-[#1a1f2e]/55"><span>🕐</span>{center.timing}</div>
                    <div className="flex items-center gap-2.5 text-[12px] text-[#1a1f2e]/55"><span>👤</span>{center.coordinator}</div>
                    <div className="flex items-start gap-2.5 text-[12px] text-[#1a1f2e]/55"><span className="mt-0.5">🗣️</span>{center.languages.join(' · ')}</div>
                  </div>
                  <div className="flex gap-2">
                    <a href={`https://wa.me/${center.whatsapp}`} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 border border-green-200 text-green-700 text-[12px] font-semibold hover:bg-green-100 transition-colors"><span className="text-base">💬</span> WhatsApp</a>
                    <Link to="/find-center" className="flex-1 text-center py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-[12px] font-semibold hover:bg-sky-100 transition-colors">View Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ── Living Gallery ── */}
      <FadeIn>
        <section className="py-20 bg-sky-50/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-3"><div className="w-5 h-px bg-amber-400" /><span className="text-amber-600 text-[10px] tracking-[0.22em] uppercase font-semibold">Gallery</span><div className="w-5 h-px bg-amber-400" /></div>
              <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-[#1a1f2e] mb-3">Living Gallery</h2>
              <p className="text-[#1a1f2e]/50 text-[13px] max-w-md mx-auto">Moments of joy, unity, and transformation from across Pune's Sahaja Yoga community.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {GALLERY_CATS.map(cat => (
                <button key={cat} onClick={() => setActiveGallery(cat)} className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 ${activeGallery === cat ? 'bg-[#1a1f2e] text-white shadow-md' : 'bg-white border border-sky-200 text-sky-700 hover:bg-sky-50'}`}>{cat}</button>
              ))}
            </div>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 [column-gap:0.75rem]">
              {filteredGallery.map((item, i) => (
                <div key={i} className="break-inside-avoid mb-3 relative group overflow-hidden rounded-2xl bg-sky-100 cursor-pointer">
                  <img src={item.img} alt={item.title} className="w-full h-auto block object-cover transition-transform duration-600 group-hover:scale-108" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d2b45]/72 via-[#0d2b45]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-[9px] text-amber-400 font-bold uppercase tracking-wider mb-0.5">{item.cat}</div>
                    <div className="text-white text-[12px] font-semibold leading-tight">{item.title}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/events" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-sky-300 bg-white text-sky-700 text-[13px] font-semibold hover:bg-sky-50 transition-colors shadow-sm hover:-translate-y-0.5 duration-200">View Full Gallery <span>→</span></Link>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── Daily Inspiration ── */}
      <FadeIn>
        <section className="py-24 px-6 bg-gradient-to-br from-[#0d2b45] via-[#0f3255] to-[#0d2b45] relative overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] text-sky-400 opacity-[0.055] pointer-events-none"><LotusDecor /></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 w-72 h-72 text-amber-400 opacity-[0.045] pointer-events-none"><LotusDecor /></div>
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.07]" viewBox="0 0 1440 500" preserveAspectRatio="xMidYMid slice" fill="none">
            <path d="M0,250 Q360,140 720,250 Q1080,360 1440,250" stroke="rgba(147,210,255,1)" strokeWidth="1.2" />
            <path d="M0,270 Q360,160 720,270 Q1080,380 1440,270" stroke="rgba(255,196,80,1)" strokeWidth="1" />
          </svg>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-5"><div className="w-12 h-12 text-amber-400 opacity-55" style={{ animation: 'slow-drift 7s ease-in-out infinite' }}><LotusDecor /></div></div>
            <div className="text-[10px] text-amber-400/65 tracking-[0.25em] uppercase font-semibold mb-5">Quote of the Day</div>
            <div className="text-amber-400 text-5xl mb-4 font-display leading-none">"</div>
            <blockquote className="font-display text-[clamp(1.2rem,3.5vw,1.85rem)] text-white leading-[1.72] mb-6 font-light italic">You cannot know the meaning of your life until you are connected to the power that created you.</blockquote>
            <cite className="text-white/38 text-[11px] tracking-[0.22em] uppercase not-italic font-medium">— Shri Mataji Nirmala Devi</cite>
            <div className="mt-12 inline-flex items-start gap-5 bg-white/8 backdrop-blur-sm rounded-2xl px-7 py-5 border border-white/10 max-w-md text-left">
              <div className="text-3xl mt-0.5 flex-shrink-0">🧘</div>
              <div>
                <div className="text-white/40 text-[9.5px] uppercase tracking-[0.2em] mb-1.5">Meditation Tip</div>
                <div className="text-white/78 text-[13px] leading-[1.82]">Place your left hand on your lap and right hand over your heart. Breathe gently and ask within: <em className="not-italic text-amber-300">"Am I the spirit?"</em> Feel the cool breeze on your palms.</div>
              </div>
            </div>
            <div className="flex justify-center items-center gap-4 mt-10">{CHAKRA_COLORS.map((color, i) => <div key={i} className="w-2.5 h-2.5 rounded-full hover:scale-[2] transition-transform duration-300 cursor-default" style={{ backgroundColor: color, opacity: 0.52 }} />)}</div>
          </div>
        </section>
      </FadeIn>

      {/* ── Volunteer CTA ── */}
      <FadeIn>
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl p-10 lg:p-20 text-center bg-[#0d2b45]">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-[600px] h-[600px] text-sky-500 opacity-[0.038]"><LotusDecor /></div></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500 rounded-full -translate-y-36 translate-x-36 opacity-[0.09] blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-400 rounded-full translate-y-36 -translate-x-36 opacity-[0.09] blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="text-[10px] text-amber-400/65 tracking-[0.25em] uppercase font-semibold mb-5">Join Us</div>
              <div className="text-6xl mb-6" style={{ animation: 'slow-drift 6s ease-in-out infinite' }}>🤝</div>
              <h2 className="font-display text-[clamp(1.8rem,4vw,3.2rem)] font-semibold text-white mb-4">Serve with Love</h2>
              <p className="text-white/52 max-w-lg mx-auto text-[13.5px] leading-[1.88] mb-7">Support public programs, workshops, festivals, and seminars. Join our growing family of volunteers who selflessly share the gift of Sahaja Yoga with the world.</p>
              <div className="flex flex-wrap justify-center gap-2.5 mb-9">
                {['Public Programs','Workshops','Festivals','Seminars','Online Events'].map(tag => (
                  <span key={tag} className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/14 text-white/65 text-[12px] font-medium">{tag}</span>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/volunteer" className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-semibold text-[14px] transition-all duration-200 shadow-lg hover:shadow-amber-500/30 hover:shadow-xl hover:-translate-y-0.5">🌸 Become a Volunteer</Link>
                <Link to="/journey" className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-white/10 border border-white/18 text-white font-semibold text-[14px] hover:bg-white/20 transition-all duration-200 hover:-translate-y-0.5">Learn More <span>→</span></Link>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── Footer ── */}
      <footer id="contact" className="bg-[#0d2b45] text-white/58 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] text-sky-400 opacity-[0.042] translate-x-24 translate-y-24 pointer-events-none"><LotusDecor /></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-700 flex items-center justify-center shadow-md flex-shrink-0"><span className="text-white text-xs font-bold">SC</span></div>
                <div><div className="text-white font-semibold tracking-tight text-[15px]">Sahaja Connect</div><div className="text-amber-400 text-[9px] tracking-[0.2em] uppercase">Pune</div></div>
              </div>
              <p className="text-[12.5px] leading-[1.82] mb-5">Your digital gateway to Sahaja Yoga in Pune. Discover inner peace, Self-Realization, and collective meditation.</p>
              <div className="flex gap-2.5">
                {[['f','Facebook'],['ig','Instagram'],['▷','YouTube'],['w','WhatsApp']].map(([icon,label]) => (
                  <a key={label} href={label === 'WhatsApp' ? 'https://wa.me/919876543210' : label === 'YouTube' ? 'https://www.youtube.com/' : label === 'Instagram' ? 'https://www.instagram.com/' : 'https://www.facebook.com/'} target="_blank" rel="noreferrer" title={label} className="w-9 h-9 rounded-full bg-white/8 hover:bg-amber-500 flex items-center justify-center text-[11px] font-semibold transition-all duration-200 hover:scale-110">{icon}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-white text-[10px] font-semibold mb-5 tracking-[0.2em] uppercase">Quick Links</div>
              <div className="space-y-2.5">
                <Link to="/" className="block text-[12.5px] hover:text-amber-400 hover:translate-x-1 transition-all duration-200">Home</Link>
                <Link to="/find-center" className="block text-[12.5px] hover:text-amber-400 hover:translate-x-1 transition-all duration-200">Find Centers</Link>
                <Link to="/events" className="block text-[12.5px] hover:text-amber-400 hover:translate-x-1 transition-all duration-200">Events</Link>
                <Link to="/journey" className="block text-[12.5px] hover:text-amber-400 hover:translate-x-1 transition-all duration-200">About Sahaja Yoga</Link>
                <Link to="/events#gallery" className="block text-[12.5px] hover:text-amber-400 hover:translate-x-1 transition-all duration-200">Gallery</Link>
                <a href="#contact" className="block text-[12.5px] hover:text-amber-400 hover:translate-x-1 transition-all duration-200">Contact</a>
              </div>
            </div>
            <div>
              <div className="text-white text-[10px] font-semibold mb-5 tracking-[0.2em] uppercase">Programs</div>
              <div className="space-y-2.5">
                <Link to="/events#events-grid" className="block text-[12.5px] hover:text-amber-400 hover:translate-x-1 transition-all duration-200">Public Programs</Link>
                <Link to="/events#events-grid" className="block text-[12.5px] hover:text-amber-400 hover:translate-x-1 transition-all duration-200">Workshops</Link>
                <Link to="/events#events-grid" className="block text-[12.5px] hover:text-amber-400 hover:translate-x-1 transition-all duration-200">Pujas & Festivals</Link>
                <Link to="/journey" className="block text-[12.5px] hover:text-amber-400 hover:translate-x-1 transition-all duration-200">21-Day Journey</Link>
                <Link to="/events" className="block text-[12.5px] hover:text-amber-400 hover:translate-x-1 transition-all duration-200">Online Sessions</Link>
                <Link to="/volunteer" className="block text-[12.5px] hover:text-amber-400 hover:translate-x-1 transition-all duration-200">Volunteer</Link>
              </div>
            </div>
            <div>
              <div className="text-white text-[10px] font-semibold mb-5 tracking-[0.2em] uppercase">Contact</div>
              <div className="space-y-4 text-[12.5px]">
                <div className="flex items-start gap-2.5"><span className="mt-0.5 flex-shrink-0 text-amber-400">📍</span><span className="leading-[1.7]">Sahaja Yoga Meditation Centers<br />Pune, Maharashtra 411001</span></div>
                <div className="flex items-center gap-2.5"><span className="text-amber-400">📧</span><a href="mailto:pune@sahajayoga.org" className="hover:text-amber-400 transition-colors">pune@sahajayoga.org</a></div>
                <div className="flex items-center gap-2.5"><span className="text-amber-400">📞</span><span>+91 98765 43210</span></div>
                <div className="flex items-center gap-2.5"><span className="text-amber-400">📞</span><span>+91 8767258594</span></div>
              </div>
              <div className="flex gap-2 mt-6">{CHAKRA_COLORS.map((color, i) => <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: color, opacity: 0.42 }} />)}</div>
            </div>
          </div>
          <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-[12px]">© 2025 Sahaja Connect – Pune. All rights reserved.</div>
            <div className="flex gap-5 text-[12px]">
              <a href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-amber-400 transition-colors">Terms of Use</a>
              <a href="/find-center" className="hover:text-amber-400 transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
</div>
)
}
