import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import LotusDecor from '../components/LotusDecor'

// ─── Data ────────────────────────────────────────────────────────────────────

const CENTER_PROFILES: Record<string, {
  name: string
  area: string
  address: string
  phone: string
  coordinator: string
}> = {
  '1': {
    name: 'Kalyani Nagar',
    area: 'Kalyani Nagar',
    address: 'Plot 42, Lane 5, Kalyani Nagar, Pune 411006',
    phone: '+91 98765 43210',
    coordinator: 'Priya Kulkarni',
  },
  '2': {
    name: 'Koregaon Park',
    area: 'Koregaon Park',
    address: '12, Lane 4, Koregaon Park, Pune 411001',
    phone: '+91 98765 43211',
    coordinator: 'Rahul Deshmukh',
  },
  '3': {
    name: 'Aundh',
    area: 'Aundh',
    address: '3, ITI Road, Aundh, Pune 411007',
    phone: '+91 98765 43212',
    coordinator: 'Vinod Sharma',
  },
  '4': {
    name: 'Kalyani Nagar',
    area: 'Kalyani Nagar',
    address: '21, Aga Khan Palace Road, Kalyani Nagar, Pune 411006',
    phone: '+91 98765 43213',
    coordinator: 'Priya Deshpande',
  },
  '5': {
    name: 'Baner',
    area: 'Baner',
    address: '15, Baner Road, Pune 411045',
    phone: '+91 98765 43214',
    coordinator: 'Amit Joshi',
  },
  '6': {
    name: 'Hadapsar',
    area: 'Hadapsar',
    address: 'Magarpatta City Community Hall, Hadapsar, Pune 411028',
    phone: '+91 98765 43215',
    coordinator: 'Suresh Kulkarni',
  },
  '7': {
    name: 'Viman Nagar',
    area: 'Viman Nagar',
    address: '7, Viman Nagar, Pune 411014',
    phone: '+91 98765 43216',
    coordinator: 'Sunita Patil',
  },
  '8': {
    name: 'Kharadi',
    area: 'Kharadi',
    address: 'Kharadi, Pune 411014',
    phone: '+91 98765 43217',
    coordinator: 'Meera Joshi',
  },
}


const HERO_IMG =
  'https://images.unsplash.com/photo-1761971975962-9cc397e2ba2a?w=1800&h=900&fit=crop&auto=format'

const COORDINATORS = [
  {
    name: 'Priya Kulkarni',
    role: 'Lead Coordinator',
    experience: '12 years',
    languages: ['Marathi', 'Hindi', 'English'],
    specialty: 'Guided meditation & Newcomer orientation',
    img: 'https://images.unsplash.com/photo-1533128361669-69c065857a13?w=300&h=300&fit=crop&auto=format',
    phone: '+91 98765 43210',
  },
  {
    name: 'Rahul Deshmukh',
    role: 'Senior Seeker',
    experience: '8 years',
    languages: ['Hindi', 'English'],
    specialty: 'Youth programs & Music sessions',
    img: 'https://images.unsplash.com/photo-1600603406200-5b2a104684ac?w=300&h=300&fit=crop&auto=format',
    phone: '+91 97654 32109',
  },
  {
    name: 'Anita Sharma',
    role: 'Ladies Coordinator',
    experience: '6 years',
    languages: ['Marathi', 'Hindi'],
    specialty: "Ladies' programs & Puja coordination",
    img: 'https://images.unsplash.com/photo-1573497019707-1c04de26e58c?w=300&h=300&fit=crop&auto=format',
    phone: '+91 94567 89012',
  },
]

// 0 = Sunday, 1 = Monday … 6 = Saturday (JS convention)
const SCHEDULE = [
  { day: 'Monday',    dayIdx: 1, sessions: [{ time: '6:30 PM – 8:00 PM', name: 'Evening Meditation', type: 'collective' }] },
  { day: 'Tuesday',   dayIdx: 2, sessions: [{ time: '6:00 PM – 7:30 PM', name: "Ladies' Program",     type: 'ladies'     }] },
  { day: 'Wednesday', dayIdx: 3, sessions: [{ time: '6:30 PM – 8:00 PM', name: 'Evening Meditation', type: 'collective' }] },
  { day: 'Thursday',  dayIdx: 4, sessions: [{ time: '6:30 PM – 8:00 PM', name: 'Youth Program',      type: 'youth'      }] },
  { day: 'Friday',    dayIdx: 5, sessions: [{ time: '6:30 PM – 8:00 PM', name: 'Evening Meditation', type: 'collective' }] },
  {
    day: 'Saturday', dayIdx: 6,
    sessions: [
      { time: '7:00 AM – 9:00 AM', name: 'Morning Collective',  type: 'morning'  },
      { time: '6:00 PM – 8:00 PM', name: 'Public Program',      type: 'public'   },
    ],
  },
  { day: 'Sunday', dayIdx: 0, sessions: [{ time: '7:30 AM – 9:00 AM', name: 'Morning Collective', type: 'morning' }] },
]

const SESSION_COLORS: Record<string, string> = {
  collective: 'bg-sky-100 text-sky-700',
  ladies:     'bg-pink-100 text-pink-700',
  youth:      'bg-violet-100 text-violet-700',
  morning:    'bg-amber-100 text-amber-700',
  public:     'bg-emerald-100 text-emerald-700',
}

const GALLERY = [
  { src: 'https://images.unsplash.com/photo-1761971975962-9cc397e2ba2a?w=600&h=400&fit=crop&auto=format', caption: 'Meditation Hall',      tall: false },
  { src: 'https://images.unsplash.com/photo-1764726331208-71cb385ab08c?w=600&h=800&fit=crop&auto=format', caption: 'Morning Light',         tall: true  },
  { src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop&auto=format', caption: 'Collective Session',    tall: false },
  { src: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&h=400&fit=crop&auto=format', caption: 'Puja Decoration',       tall: false },
  { src: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&h=600&fit=crop&auto=format', caption: 'Outdoor Program',       tall: true  },
  { src: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&h=400&fit=crop&auto=format', caption: 'Community Gathering',  tall: false },
  { src: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?w=600&h=400&fit=crop&auto=format', caption: 'Festival Celebration', tall: false },
  { src: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=600&h=600&fit=crop&auto=format', caption: 'Candlelight Evening',  tall: false },
]

const PROGRAMS = [
  {
    date: 'Aug 10, 2026', day: 'Monday', title: 'Introduction to Sahaja Yoga',
    time: '6:30 PM', type: 'Public Program', seats: 40, filled: 12,
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=220&fit=crop&auto=format',
  },
  {
    date: 'Aug 15, 2026', day: 'Saturday', title: 'Guru Puja Celebration',
    time: '5:00 PM', type: 'Festival', seats: 80, filled: 55,
    img: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=220&fit=crop&auto=format',
  },
  {
    date: 'Aug 23, 2026', day: 'Sunday', title: 'Weekend Meditation Workshop',
    time: '9:00 AM', type: 'Workshop', seats: 30, filled: 18,
    img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=220&fit=crop&auto=format',
  },
]

const NEARBY = [
  { name: 'Viman Nagar Center',    distance: '3.2 km', sessions: 'Mon, Wed, Fri – 6:30 PM', color: 'bg-emerald-500' },
  { name: 'Koregaon Park Center',  distance: '4.1 km', sessions: 'Tue, Thu, Sat – 6:00 PM', color: 'bg-sky-500'     },
  { name: 'Nagar Road Center',     distance: '5.7 km', sessions: 'Mon–Sat – 6:30 PM',       color: 'bg-violet-500'  },
]

const TESTIMONIALS = [
  {
    quote: "Coming here was the most transformative experience of my life. The environment is peaceful, the people are warm, and the meditation is life-changing.",
    name: 'Meena T.', since: 'Seeker since 2019', initials: 'MT', color: 'from-sky-400 to-blue-600',
  },
  {
    quote: "I was a complete beginner with no background in yoga. Within three sessions I felt a tangible coolness on my palms. Priya Ji\'s guidance is exceptional.",
    name: 'Rohan V.', since: 'Seeker since 2022', initials: 'RV', color: 'from-amber-400 to-orange-500',
  },
  {
    quote: "The Saturday public programs are perfect for newcomers. Free, welcoming, and absolutely genuine. I brought my whole family.",
    name: 'Deepa S.', since: 'Seeker since 2021', initials: 'DS', color: 'from-violet-400 to-purple-600',
  },
]

const TIMELINE = [
  { year: '2012', title: 'Center Founded',          desc: 'Kalyani Nagar Center opened with 8 seekers in a small apartment.' },
  { year: '2015', title: 'Dedicated Hall',           desc: 'Moved to a dedicated meditation hall with capacity for 40 seekers.' },
  { year: '2018', title: 'Public Programs Launch',   desc: 'Weekly public programs introduced, welcoming the wider Pune community.' },
  { year: '2020', title: 'Online Sessions',          desc: 'Launched online Zoom meditations during lockdown, reaching 200+ participants.' },
  { year: '2023', title: 'Youth Initiative',         desc: "Dedicated Thursday youth program launched — now Pune\'s most-attended." },
  { year: '2026', title: 'Growing Community',        desc: 'Over 350 regular seekers and 12 languages represented at our programs.' },
]

const FAQS = [
  { q: 'Is there any cost to attend?',         a: "All Sahaja Yoga programs are completely free. There is no fee, donation, or membership required — ever. It is a universal gift." },
  { q: 'Do I need any prior experience?',      a: "None at all! Whether you have never meditated or have practiced for years, you are welcome. Our coordinators will guide you through everything." },
  { q: 'What should I wear and bring?',        a: "Comfortable, modest clothing is ideal. Bring an open mind and a quiet heart. No mat, props, or books are necessary." },
  { q: 'How long does a session last?',        a: "Evening sessions typically run 90 minutes (6:30–8:00 PM). The first 30 minutes are for newcomers\' introduction, followed by a guided collective meditation." },
  { q: 'Can I bring children?',                a: "Absolutely — children are especially welcome! There is a dedicated area for children during adult sessions, and separate youth programs on Thursdays." },
  { q: 'What is Self Realisation?',            a: "Self Realisation is the awakening of the Kundalini energy within you, an experience you can feel as a cool breeze on your palms and at the top of your head." },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect() } }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` }}>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-amber-500">{children}</span>
      <span className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
    </div>
  )
}

function ProgramTypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    'Public Program': 'bg-emerald-100 text-emerald-700',
    'Festival':       'bg-amber-100 text-amber-700',
    'Workshop':       'bg-violet-100 text-violet-700',
  }
  return (
    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${map[type] ?? 'bg-sky-100 text-sky-700'}`}>{type}</span>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CenterDetail() {
  const { id = '1' } = useParams()
  const center = CENTER_PROFILES[id] ?? CENTER_PROFILES['1']
  const [lightbox, setLightbox]   = useState<number | null>(null)
  const [openFaq, setOpenFaq]     = useState<number | null>(null)
  const [stickyBar, setStickyBar] = useState(false)
  const [saved, setSaved] = useState(() => localStorage.getItem(`saved-center-${id}`) === 'true')
  const heroRef = useRef<HTMLDivElement>(null)
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`${center.name} Sahaja Yoga Center, ${center.address}`)
  const toggleSaved = () => {
    const next = !saved
    setSaved(next)
    localStorage.setItem(`saved-center-${id}`, String(next))
  }
  const todayIdx = new Date().getDay()

  useEffect(() => {
    const onScroll = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 999
      setStickyBar(heroBottom < 100)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setLightbox(i => i !== null ? (i + 1) % GALLERY.length : null)
      if (e.key === 'ArrowLeft')  setLightbox(i => i !== null ? (i - 1 + GALLERY.length) % GALLERY.length : null)
      if (e.key === 'Escape')     setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-body">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-[75vh] min-h-[520px] flex items-end overflow-hidden mt-[calc(2.25rem+4rem)]">
        <img
          src={HERO_IMG}
          alt={`${center.name} Center Hall`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2b45]/90 via-[#0d2b45]/40 to-transparent" />
        {/* Light texture */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2b45]/30 to-transparent" />

        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-10 pb-12">
          {/* Status badges */}
          <div className="flex flex-wrap gap-2.5 mb-5">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Meditation Today – 6:30 PM
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold bg-amber-500/20 border border-amber-400/40 text-amber-300 backdrop-blur-sm">
              ⭐ Beginner Friendly
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold bg-sky-500/20 border border-sky-400/40 text-sky-300 backdrop-blur-sm">
              🌍 English · Marathi · Hindi
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-2">
            {center.name}
            <br />
            <span className="text-amber-400">Sahaja Yoga Center</span>
          </h1>
          <p className="text-white/65 text-[15px] mb-8">
            📍 {center.address} &nbsp;·&nbsp; Est. 2012
          </p>

          {/* 4 Action buttons */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Directions',  icon: '🗺️',  style: 'bg-sky-500 hover:bg-sky-400 text-white' },
              { label: 'Call',        icon: '📞',  style: 'bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-sm' },
              { label: 'WhatsApp',    icon: '💬',  style: 'bg-emerald-500 hover:bg-emerald-400 text-white' },
              { label: 'Save',        icon: '🔖',  style: 'bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-sm' },
            ].map(({ label, icon, style }) => (
              <button
                key={label}
                onClick={() => {
                  if (label === 'Directions') {
                    window.open(mapsUrl, '_blank', 'noopener,noreferrer')
                  } else if (label === 'Call') {
                    window.location.href = `tel:${center.phone}`
                  } else if (label === 'WhatsApp') {
                    window.open(`https://wa.me/${center.phone.replace(/\D/g, '')}`, '_blank', 'noopener,noreferrer')
                  } else {
                    toggleSaved()
                  }
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${style}`}
              >
                <span>{label === 'Save' && saved ? '✓' : icon}</span>
                {label === 'Save' && saved ? 'Saved' : label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sticky Action Bar ────────────────────────────────────────────── */}
      <div className={`hidden md:block fixed top-[calc(2.25rem+4rem)] inset-x-0 z-40 bg-white/96 backdrop-blur-xl border-b border-sky-100/80 shadow-sm transition-all duration-400 ${stickyBar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
          <span className="font-display text-[16px] font-semibold text-[#0d2b45]">{center.name} Sahaja Yoga Center</span>
          <div className="flex items-center gap-2.5">
            <a href="#schedule" className="text-[12px] text-[#1a1f2e]/60 hover:text-amber-500 transition-colors font-medium">Schedule</a>
            <a href="#gallery"  className="text-[12px] text-[#1a1f2e]/60 hover:text-amber-500 transition-colors font-medium">Gallery</a>
            <a href="#location" className="text-[12px] text-[#1a1f2e]/60 hover:text-amber-500 transition-colors font-medium">Location</a>
            <button onClick={() => window.open(mapsUrl, "_blank", "noopener,noreferrer")} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-white text-[12px] font-semibold transition-all duration-200 hover:shadow-md">
              🗺️ Get Directions
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats Row ────────────────────────────────────────────────────── */}
      <FadeIn>
        <div className="bg-white border-b border-sky-100/80 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-sky-100">
              {[
                { label: 'Seekers',        value: '350+',  icon: '🧘' },
                { label: 'Years Active',   value: '14',    icon: '🌿' },
                { label: 'Weekly Sessions', value: '9',    icon: '📅' },
                { label: 'Languages',      value: '3',     icon: '🌍' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex flex-col items-center py-5 gap-1">
                  <span className="text-2xl">{icon}</span>
                  <span className="font-display text-[28px] font-semibold text-[#0d2b45]">{value}</span>
                  <span className="text-[11px] text-[#1a1f2e]/50 uppercase tracking-widest font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 space-y-24">

        {/* ── Overview ───────────────────────────────────────────────────── */}
        <FadeIn>
          <SectionLabel>About This Center</SectionLabel>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#0d2b45] leading-tight mb-4">
                A sanctuary of stillness<br />in the heart of Pune
              </h2>
              <p className="text-[#1a1f2e]/65 text-[15px] leading-relaxed mb-4">
                Founded in 2012 by a small group of dedicated seekers, Kalyani Nagar Center has grown into one of
                Pune&apos;s most vibrant Sahaja Yoga communities. Our hall offers a serene, technology-free space
                where genuine seekers of all backgrounds experience Self Realisation — completely free of charge.
              </p>
              <p className="text-[#1a1f2e]/65 text-[15px] leading-relaxed">
                Whether you&apos;re attending your first public program or deepening a long-standing practice,
                you&apos;ll find a warm, inclusive atmosphere guided by experienced, heart-centred coordinators.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🕯️', title: 'Free Always',           desc: 'No fees, no donations, no memberships — ever' },
                { icon: '🌱', title: 'Newcomer Friendly',     desc: 'Dedicated intro sessions every evening' },
                { icon: '👨‍👩‍👧‍👦', title: 'All Welcome',          desc: 'Families, youth, seniors — everyone' },
                { icon: '🌐', title: 'Multilingual',          desc: 'Programs in Marathi, Hindi & English' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="text-2xl mb-3">{icon}</div>
                  <div className="text-[14px] font-semibold text-[#0d2b45] mb-1">{title}</div>
                  <div className="text-[12px] text-[#1a1f2e]/55 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── Coordinators ───────────────────────────────────────────────── */}
        <FadeIn>
          <SectionLabel>Your Guides</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-8">Meet the Coordinators</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {COORDINATORS.map((c, i) => (
              <FadeIn key={c.name} delay={i * 80}>
                <div className="bg-white rounded-2xl overflow-hidden border border-sky-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="relative h-52 overflow-hidden">
                    <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d2b45]/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-white font-semibold text-[16px]">{c.name}</div>
                      <div className="text-amber-300 text-[11px] font-medium mt-0.5">{c.role}</div>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex gap-4 text-[12px] text-[#1a1f2e]/55">
                      <span>⏳ {c.experience}</span>
                    </div>
                    <p className="text-[12px] text-[#1a1f2e]/60 leading-relaxed">{c.specialty}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {c.languages.map(l => (
                        <span key={l} className="px-2 py-0.5 rounded-full bg-sky-50 border border-sky-100 text-[10px] text-sky-600 font-medium">{l}</span>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <a href={`tel:${c.phone}`} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 text-[12px] font-medium transition-colors">
                        📞 Call
                      </a>
                      <a href={`https://wa.me/${c.phone.replace(/\D/g, '')}`} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[12px] font-medium transition-colors">
                        💬 WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        {/* ── Weekly Schedule ─────────────────────────────────────────────── */}
        <div id="schedule"><FadeIn>
          <SectionLabel>Weekly Schedule</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-8">Sessions This Week</h2>
          <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
            {SCHEDULE.map(({ day, dayIdx, sessions }, i) => {
              const isToday = dayIdx === todayIdx
              return (
                <div key={day} className={`flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 border-b border-sky-50 last:border-0 ${isToday ? 'bg-gradient-to-r from-sky-50 to-amber-50/30' : i % 2 === 0 ? 'bg-white' : 'bg-[#f7f9fc]/60'}`}>
                  <div className={`w-28 flex-shrink-0 flex items-center gap-2`}>
                    <span className={`font-semibold text-[14px] ${isToday ? 'text-sky-600' : 'text-[#1a1f2e]/70'}`}>{day}</span>
                    {isToday && (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-sky-500 text-white px-1.5 py-0.5 rounded-full">Today</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    {sessions.map(s => (
                      <div key={s.name} className="flex flex-wrap items-center gap-2.5">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${SESSION_COLORS[s.type]}`}>{s.name}</span>
                        <span className="text-[12px] text-[#1a1f2e]/50">{s.time}</span>
                        {isToday && s.type === 'collective' && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Happening today
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-[12px] text-[#1a1f2e]/45 mt-3 text-center">All sessions are free and open to everyone. No registration required.</p>
        </FadeIn></div>

        {/* ── Gallery ────────────────────────────────────────────────────── */}
        <div id="gallery"><FadeIn>
          <SectionLabel>Gallery</SectionLabel>
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-3xl font-semibold text-[#0d2b45]">Our Beautiful Space</h2>
            <span className="text-[12px] text-[#1a1f2e]/40">Click any photo to explore</span>
          </div>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {GALLERY.map((g, i) => (
              <div
                key={i}
                className="break-inside-avoid cursor-pointer overflow-hidden rounded-xl group relative"
                onClick={() => setLightbox(i)}
              >
                <img
                  src={g.src}
                  alt={g.caption}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#0d2b45]/0 group-hover:bg-[#0d2b45]/35 transition-colors duration-300 flex items-end p-3">
                  <span className="text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">{g.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </FadeIn></div>

        {/* ── Upcoming Programs ───────────────────────────────────────────── */}
        <FadeIn>
          <SectionLabel>Upcoming Events</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-8">Programs at This Center</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {PROGRAMS.map((p, i) => (
              <FadeIn key={p.title} delay={i * 80}>
                <div className="bg-white rounded-2xl overflow-hidden border border-sky-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="relative h-40 overflow-hidden">
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <ProgramTypeBadge type={p.type} />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-[#1a1f2e]/45 mb-2">
                      <span>📅 {p.date}</span>
                      <span>·</span>
                      <span>🕐 {p.time}</span>
                    </div>
                    <h3 className="font-display text-[17px] font-semibold text-[#0d2b45] mb-3 leading-snug">{p.title}</h3>
                    {/* Seats bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[10px] text-[#1a1f2e]/45 mb-1.5">
                        <span>{p.filled} registered</span>
                        <span>{p.seats - p.filled} spots left</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-sky-100 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-400 transition-all duration-700" style={{ width: `${(p.filled / p.seats) * 100}%` }} />
                      </div>
                    </div>
                    <button className="w-full py-2.5 rounded-xl bg-[#0d2b45] hover:bg-[#1a3f5c] text-white text-[13px] font-semibold transition-colors">
                      Learn More →
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        {/* ── Location ───────────────────────────────────────────────────── */}
        <div id="location"><FadeIn>
          <SectionLabel>Location</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-8">Find Us Easily</h2>
          <div className="grid md:grid-cols-5 gap-6">
            {/* Map illustration */}
            <div className="md:col-span-3 rounded-2xl overflow-hidden border border-sky-100 shadow-sm bg-[#e8f0e8]" style={{ minHeight: 320 }}>
              <svg viewBox="0 0 600 380" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Background */}
                <rect width="600" height="380" fill="#eaf1ea" />
                {/* Grid streets */}
                {[60, 120, 180, 240, 300, 360, 420, 480, 540].map(x => (
                  <line key={x} x1={x} y1="0" x2={x} y2="380" stroke="#d4e2d4" strokeWidth="1" />
                ))}
                {[50, 100, 150, 200, 250, 300, 350].map(y => (
                  <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#d4e2d4" strokeWidth="1" />
                ))}
                {/* Major roads */}
                <rect x="0" y="170" width="600" height="18" fill="#f0e8d0" stroke="#d4c090" strokeWidth="0.5" />
                <rect x="270" y="0" width="22" height="380" fill="#f0e8d0" stroke="#d4c090" strokeWidth="0.5" />
                <rect x="0" y="80" width="600" height="12" fill="#e8e0c8" stroke="#c8b880" strokeWidth="0.5" />
                {/* Park */}
                <ellipse cx="80" cy="280" rx="55" ry="45" fill="#b8d4a0" opacity="0.7" />
                <ellipse cx="520" cy="60" rx="45" ry="35" fill="#b8d4a0" opacity="0.7" />
                {/* Labels */}
                <text x="300" y="164" textAnchor="middle" fontSize="9" fill="#a09060" fontWeight="600">Nagar Road (NH 753F)</text>
                <text x="263" y="195" textAnchor="end" fontSize="9" fill="#a09060" fontWeight="600" transform="rotate(-90 263 200)">Kalyani Nagar Rd</text>
                <text x="80" y="285" textAnchor="middle" fontSize="8" fill="#6a9050">Yerwada Park</text>
                <text x="519" y="64" textAnchor="middle" fontSize="8" fill="#6a9050">Garden</text>
                {/* Center marker */}
                <circle cx="300" cy="255" r="18" fill="#4a90c4" opacity="0.25" />
                <circle cx="300" cy="255" r="12" fill="#4a90c4" opacity="0.4" />
                <circle cx="300" cy="255" r="8"  fill="#4a90c4" />
                <circle cx="300" cy="255" r="3"  fill="white" />
                <text x="300" y="242" textAnchor="middle" fontSize="8.5" fill="#0d2b45" fontWeight="700">Kalyani Nagar Center</text>
              </svg>
            </div>
            {/* Details */}
            <div className="md:col-span-2 space-y-4">
              {[
                { icon: '📍', label: 'Address',    value: 'Plot 42, Lane 5, Near Nagar Road, Kalyani Nagar, Pune 411006' },
                { icon: '🚌', label: 'By Bus',      value: 'Routes 155, 162 – Stop: Kalyani Nagar Bus Stop (2 min walk)' },
                { icon: '🏍️', label: 'By Auto',     value: '~₹80 from Koregaon Park, ~₹120 from Pune Railway Station' },
                { icon: '🅿️', label: 'Parking',     value: 'Free parking available in the lane adjacent to the building' },
                { icon: '🕐', label: 'Arrive by',   value: 'We recommend arriving 10 minutes early for your first session' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex gap-3 p-4 bg-white rounded-xl border border-sky-100 shadow-sm">
                  <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
                  <div>
                    <div className="text-[11px] text-[#1a1f2e]/45 uppercase tracking-wider font-medium mb-0.5">{label}</div>
                    <div className="text-[13px] text-[#1a1f2e]/75 leading-relaxed">{value}</div>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-[14px] font-semibold transition-colors shadow-md hover:shadow-sky-200/70 hover:shadow-lg">
                🗺️ Open in Google Maps
              </button>
            </div>
          </div>
        </FadeIn></div>

        {/* ── Nearby Centers ──────────────────────────────────────────────── */}
        <FadeIn>
          <SectionLabel>Nearby</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-8">Other Pune Centers</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {NEARBY.map((c, i) => (
              <FadeIn key={c.name} delay={i * 70}>
                <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex gap-4 items-start">
                  <div className={`w-10 h-10 rounded-full ${c.color} flex-shrink-0 flex items-center justify-center shadow-md`}>
                    <span className="text-white text-sm">🧘</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px] font-semibold text-[#0d2b45] mb-1">{c.name}</div>
                    <div className="text-[11px] text-[#1a1f2e]/50 mb-1">📍 {c.distance} away</div>
                    <div className="text-[11px] text-[#1a1f2e]/50 mb-3">📅 {c.sessions}</div>
                    <Link to="/find-center" className="text-[12px] text-sky-500 hover:text-sky-600 font-medium transition-colors">
                      View details →
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        {/* ── First-Time Guide ────────────────────────────────────────────── */}
        <FadeIn>
          <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#0d2b45] to-[#1a3f5c] relative">
            <LotusDecor className="absolute -right-16 -bottom-16 w-72 h-72 text-white opacity-[0.04]" />
            <div className="relative p-8 md:p-12">
              <SectionLabel>
                <span className="text-amber-300">Your First Visit</span>
              </SectionLabel>
              <h2 className="font-display text-3xl font-semibold text-white mb-8">What to expect on Day 1</h2>
              <div className="grid md:grid-cols-4 gap-5">
                {[
                  { step: '01', title: 'Arrive & Relax',   desc: 'Come 10 min early. Remove footwear at the door. A coordinator will greet you warmly.' },
                  { step: '02', title: 'Introduction',     desc: '30-min newcomer orientation: What is Sahaja Yoga, how it works, and what to expect.' },
                  { step: '03', title: 'Self Realisation', desc: 'A guided 10-min session to awaken the Kundalini energy. You may feel a cool breeze.' },
                  { step: '04', title: 'Collective Meditation', desc: 'Join the group for a silent collective meditation. Completely at your own pace.' },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="card-glass-new rounded-2xl p-5">
                    <div className="font-display text-4xl font-bold text-amber-400/30 mb-3 leading-none">{step}</div>
                    <div className="text-white font-semibold text-[15px] mb-2">{title}</div>
                    <div className="text-white/60 text-[12px] leading-relaxed">{desc}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20">
                <p className="text-amber-200 text-[13px] text-center">
                  💛 There is <strong>no obligation, no fee, no registration</strong>. Just come as you are.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── Testimonials ───────────────────────────────────────────────── */}
        <FadeIn>
          <SectionLabel>Voices</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-8">From Our Seekers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 80}>
                <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm hover:shadow-lg transition-shadow duration-300 relative">
                  <div className="text-5xl text-sky-100 font-serif absolute top-4 right-5 leading-none select-none">&ldquo;</div>
                  <p className="text-[14px] text-[#1a1f2e]/70 leading-relaxed mb-5 relative">{t.quote}</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0`}>{t.initials}</div>
                    <div>
                      <div className="text-[13px] font-semibold text-[#0d2b45]">{t.name}</div>
                      <div className="text-[11px] text-[#1a1f2e]/45">{t.since}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        {/* ── Timeline ───────────────────────────────────────────────────── */}
        <FadeIn>
          <SectionLabel>Our Journey</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-10">Center Timeline</h2>
          <div className="relative">
            {/* Line */}
            <div className="absolute left-[72px] top-0 bottom-0 w-px bg-gradient-to-b from-sky-200 via-amber-200 to-sky-100 hidden md:block" />
            <div className="space-y-8">
              {TIMELINE.map(({ year, title, desc }, i) => (
                <FadeIn key={year} delay={i * 60}>
                  <div className="flex gap-6 md:gap-8 items-start">
                    <div className="flex-shrink-0 w-[72px] flex items-center justify-end md:pr-6">
                      <span className="font-display text-[13px] font-semibold text-amber-500">{year}</span>
                    </div>
                    <div className="hidden md:flex w-4 h-4 rounded-full bg-white border-2 border-sky-300 flex-shrink-0 mt-0.5 shadow-sm" />
                    <div className="flex-1 pb-2">
                      <div className="text-[15px] font-semibold text-[#0d2b45] mb-1">{title}</div>
                      <div className="text-[13px] text-[#1a1f2e]/60 leading-relaxed">{desc}</div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── FAQ ────────────────────────────────────────────────────────── */}
        <FadeIn>
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-8">Common Questions</h2>
          <div className="max-w-3xl space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-[14px] font-semibold text-[#0d2b45]">{q}</span>
                  <span className={`text-sky-400 text-xl flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                <div className={`overflow-hidden transition-all duration-400 ${openFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                  <p className="px-6 pb-5 text-[13px] text-[#1a1f2e]/65 leading-relaxed">{a}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* ── Volunteer CTA ───────────────────────────────────────────────── */}
        <FadeIn>
          <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-sky-50 border border-amber-100 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <SectionLabel>Get Involved</SectionLabel>
              <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-3">Volunteer at the Center</h2>
              <p className="text-[#1a1f2e]/60 text-[15px] leading-relaxed">
                Share your skills and be part of something meaningful. Help with events, newcomer orientation,
                translation, music, or simply welcoming people at the door. All experience levels welcome.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <button className="px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-semibold text-[14px] transition-all hover:shadow-lg hover:shadow-amber-200/70 hover:-translate-y-0.5">
                Express Interest 🌸
              </button>
              <button className="px-8 py-3.5 rounded-full border border-[#0d2b45]/20 hover:border-[#0d2b45]/40 text-[#0d2b45] font-semibold text-[14px] transition-all hover:-translate-y-0.5">
                Learn About Roles
              </button>
            </div>
          </div>
        </FadeIn>

        {/* ── Contact ─────────────────────────────────────────────────────── */}
        <FadeIn>
          <SectionLabel>Contact</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-8">Get in Touch</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: '📞', label: 'Call Us',      value: center.phone, sub: `${center.coordinator} – Mon to Sat, 10 AM – 8 PM`, action: 'Call Now', href: `tel:${center.phone}`, color: 'bg-sky-500' },
              { icon: '💬', label: 'WhatsApp',     value: center.phone, sub: 'Usually responds within a few hours', action: 'Open Chat', href: `https://wa.me/${center.phone.replace(/\D/g, '')}`, color: 'bg-emerald-500' },
              { icon: '✉️', label: 'Email',        value: 'kalyani.yoga@sahaja.in', sub: 'For program enquiries and feedback', action: 'Send Email', href: 'mailto:kalyani.yoga@sahaja.in', color: 'bg-violet-500' },
            ].map(({ icon, label, value, sub, action, href, color }) => (
              <div key={label} className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-center">
                <div className="text-3xl mb-3">{icon}</div>
                <div className="text-[12px] uppercase tracking-wider text-[#1a1f2e]/40 font-medium mb-1">{label}</div>
                <div className="text-[14px] font-semibold text-[#0d2b45] mb-1">{value}</div>
                <div className="text-[11px] text-[#1a1f2e]/45 mb-4">{sub}</div>
                <a href={href} className={`inline-block px-5 py-2.5 rounded-full ${color} text-white text-[12px] font-semibold hover:opacity-90 transition-opacity`}>{action}</a>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-[#0d2b45] text-white/70 py-12 px-6 lg:px-10 relative overflow-hidden">
        <LotusDecor className="absolute -right-20 -bottom-20 w-72 h-72 text-white opacity-[0.04]" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="font-display text-xl font-semibold text-white mb-2">{center.name} Sahaja Yoga Center</div>
              <p className="text-[13px] leading-relaxed mb-4">
                A free, welcoming space for meditation and self-discovery in the heart of {center.area}, Pune.
              </p>
              <div className="text-[12px] space-y-1">
                <div>📍 {center.address}</div>
                <div>📞 {center.phone}</div>
              </div>
            </div>
            <div>
              <div className="text-white/90 font-semibold text-[13px] mb-3 uppercase tracking-wider">Quick Links</div>
              {['Schedule', 'Gallery', 'Programs', 'Location', 'FAQ', 'Volunteer'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} className="block text-[13px] py-1 hover:text-amber-400 transition-colors">{l}</a>
              ))}
            </div>
            <div>
              <div className="text-white/90 font-semibold text-[13px] mb-3 uppercase tracking-wider">Sahaja Connect Pune</div>
              <Link to="/"            className="block text-[13px] py-1 hover:text-amber-400 transition-colors">Homepage</Link>
              <Link to="/find-center" className="block text-[13px] py-1 hover:text-amber-400 transition-colors">Find a Center</Link>
              <Link to="/events" className="block text-[13px] py-1 hover:text-amber-400 transition-colors">All Events</Link>
              <a href="mailto:pune@sahajayoga.org" className="block text-[13px] py-1 hover:text-amber-400 transition-colors">Contact Us</a>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-white/35">
            <span>© 2026 Sahaja Connect Pune. All sessions are free of charge.</span>
            <span>Made with 🌸 for seekers everywhere</span>
          </div>
        </div>
      </footer>

      {/* ── Mobile Sticky Bar ────────────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/97 backdrop-blur-xl border-t border-sky-100 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 py-3">
        <div className="grid grid-cols-3 gap-2">
          <button className="flex flex-col items-center gap-1 py-2 rounded-xl bg-sky-500 text-white text-[11px] font-semibold">
            <span className="text-base">🗺️</span> Directions
          </button>
          <a href="https://wa.me/919876543210" className="flex flex-col items-center gap-1 py-2 rounded-xl bg-emerald-500 text-white text-[11px] font-semibold">
            <span className="text-base">💬</span> WhatsApp
          </a>
          <a href="tel:+919876543210" className="flex flex-col items-center gap-1 py-2 rounded-xl bg-[#0d2b45] text-white text-[11px] font-semibold">
            <span className="text-base">📞</span> Call
          </a>
        </div>
      </div>
      {/* Bottom padding for mobile sticky bar */}
      <div className="h-20 md:hidden" />

      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-5 right-5 text-white/60 hover:text-white text-3xl leading-none transition-colors" onClick={() => setLightbox(null)}>✕</button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl px-2 transition-colors" onClick={e => { e.stopPropagation(); setLightbox(i => (i! - 1 + GALLERY.length) % GALLERY.length) }}>‹</button>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={GALLERY[lightbox].src.replace(/w=\d+&h=\d+/, 'w=1200&h=800')} alt={GALLERY[lightbox].caption} className="w-full rounded-xl object-contain max-h-[80vh]" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-5 rounded-b-xl">
              <p className="text-white text-[14px] font-medium">{GALLERY[lightbox].caption}</p>
              <p className="text-white/50 text-[11px]">{lightbox + 1} / {GALLERY.length}</p>
            </div>
          </div>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl px-2 transition-colors" onClick={e => { e.stopPropagation(); setLightbox(i => (i! + 1) % GALLERY.length) }}>›</button>
        </div>
      )}
    </div>
  )
}
