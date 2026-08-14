import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import LotusDecor from '../components/LotusDecor'

// ─── Types ────────────────────────────────────────────────────────────────────

type EventCategory =
  | 'All'
  | 'Public Program'
  | 'Workshop'
  | 'Seminar'
  | 'Guru Puja'
  | 'Birthday Puja'
  | 'Diwali Puja'
  | 'Christmas Puja'
  | 'Youth Program'
  | "Children's Program"
  | 'Medical Camp'
  | 'Special Meditation'

interface SahajaEvent {
  id: number
  title: string
  category: EventCategory
  date: string
  dateObj: Date
  time: string
  venue: string
  area: string
  description: string
  img: string
  beginner: boolean
  free: boolean
  languages: string[]
  duration: string
  parking: boolean
  accessible: boolean
  featured?: boolean
  whoShouldAttend: string[]
  calDates: number[]
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const EVENTS: SahajaEvent[] = [
  {
    id: 1,
    title: 'Guru Puja 2026 – Grand Celebration',
    category: 'Guru Puja',
    date: 'August 15, 2026',
    dateObj: new Date(2026, 7, 15),
    time: '5:00 PM – 9:00 PM',
    venue: 'Bal Gandharva Rang Mandir, JM Road',
    area: 'Shivaji Nagar',
    description: "Join hundreds of Pune seekers for the annual Guru Puja, Sahaja Yoga's most cherished celebration. An evening of collective meditation, devotional music, and heartfelt gratitude.",
    img: 'https://images.unsplash.com/photo-1608405059861-b21a68ae76a2?w=800&h=450&fit=crop&auto=format',
    beginner: false,
    free: true,
    languages: ['Marathi', 'Hindi', 'English'],
    duration: '4 hours',
    parking: true,
    accessible: true,
    featured: true,
    whoShouldAttend: ['Practicing seekers', 'Curious newcomers', 'Families', 'Youth'],
    calDates: [15],
  },
  {
    id: 2,
    title: 'Introduction to Sahaja Yoga – Public Program',
    category: 'Public Program',
    date: 'August 10, 2026',
    dateObj: new Date(2026, 7, 10),
    time: '6:30 PM – 8:00 PM',
    venue: 'Kalyani Nagar Community Hall',
    area: 'Kalyani Nagar',
    description: 'Experience guided Self Realisation in a warm, welcoming setting. Trained practitioners will walk you through the basics of Sahaja Yoga, answer questions, and lead a calming collective meditation.',
    img: 'https://images.unsplash.com/photo-1643682661119-28da0685be2c?w=800&h=450&fit=crop&auto=format',
    beginner: true,
    free: true,
    languages: ['Marathi', 'English'],
    duration: '90 minutes',
    parking: true,
    accessible: true,
    whoShouldAttend: ['Complete beginners', 'Curious seekers', 'Anyone stressed or searching'],
    calDates: [10],
  },
  {
    id: 3,
    title: 'Mudras & Chakras – Weekend Workshop',
    category: 'Workshop',
    date: 'August 23, 2026',
    dateObj: new Date(2026, 7, 23),
    time: '9:00 AM – 1:00 PM',
    venue: 'Viman Nagar Center Hall',
    area: 'Viman Nagar',
    description: 'A practical half-day workshop covering hand mudras, chakra balancing techniques, footsoaking, and clearing methods. Perfect for deepening your existing practice.',
    img: 'https://images.unsplash.com/photo-1687436874174-977fdd9e2cb8?w=800&h=450&fit=crop&auto=format',
    beginner: false,
    free: true,
    languages: ['English', 'Hindi'],
    duration: '4 hours',
    parking: true,
    accessible: true,
    whoShouldAttend: ['Regular seekers', 'Those wishing to deepen practice', 'Meditation enthusiasts'],
    calDates: [23],
  },
  {
    id: 4,
    title: 'Sahaja Yoga Seminar – Pune 2026',
    category: 'Seminar',
    date: 'August 17, 2026',
    dateObj: new Date(2026, 7, 17),
    time: '10:00 AM – 5:00 PM',
    venue: 'Symbiosis Institute Auditorium',
    area: 'Viman Nagar',
    description: 'A full-day seminar exploring the philosophy, science, and practice of Sahaja Yoga. Featuring experienced speakers, guided meditations, live music, and a community lunch.',
    img: 'https://images.unsplash.com/photo-1616376392785-8e7e283571e6?w=800&h=450&fit=crop&auto=format',
    beginner: true,
    free: true,
    languages: ['English', 'Hindi', 'Marathi'],
    duration: '7 hours',
    parking: true,
    accessible: true,
    whoShouldAttend: ['All seekers', 'Researchers and academics', 'Health professionals', 'Newcomers'],
    calDates: [17],
  },
  {
    id: 5,
    title: 'Youth Meditation Program',
    category: 'Youth Program',
    date: 'August 20, 2026',
    dateObj: new Date(2026, 7, 20),
    time: '5:30 PM – 7:30 PM',
    venue: 'Koregaon Park Center',
    area: 'Koregaon Park',
    description: "An energetic program designed for young seekers ages 15–30. Includes guided meditation, creative expression, peer discussions, and a Q&A with experienced youth coordinators.",
    img: 'https://images.unsplash.com/photo-1651077920873-ac1be1b82290?w=800&h=450&fit=crop&auto=format',
    beginner: true,
    free: true,
    languages: ['English', 'Hindi'],
    duration: '2 hours',
    parking: false,
    accessible: true,
    whoShouldAttend: ['Youth 15–30', 'College students', 'Young professionals'],
    calDates: [20],
  },
  {
    id: 6,
    title: "Children's Sahaja Yoga Camp",
    category: "Children's Program",
    date: 'August 24, 2026',
    dateObj: new Date(2026, 7, 24),
    time: '10:00 AM – 12:30 PM',
    venue: 'Baner Center Lawn',
    area: 'Baner',
    description: 'A joyful morning for children aged 6–14. Activities include guided meditation, creative art, chakra songs, storytelling, and group games — all infused with the essence of Sahaja Yoga.',
    img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=450&fit=crop&auto=format',
    beginner: true,
    free: true,
    languages: ['Marathi', 'English'],
    duration: '2.5 hours',
    parking: true,
    accessible: true,
    whoShouldAttend: ['Children 6–14', 'Families', 'Parents with kids'],
    calDates: [24],
  },
  {
    id: 7,
    title: 'Medical Camp & Health Awareness',
    category: 'Medical Camp',
    date: 'August 28, 2026',
    dateObj: new Date(2026, 7, 28),
    time: '9:00 AM – 2:00 PM',
    venue: 'Aundh Community Ground',
    area: 'Aundh',
    description: 'Free health check-up camp combining modern medical consultation with Sahaja Yoga meditation therapy. Specialists in stress management, blood pressure, and mental wellness will attend.',
    img: 'https://images.unsplash.com/photo-1671581084718-c4c04fc00250?w=800&h=450&fit=crop&auto=format',
    beginner: true,
    free: true,
    languages: ['Marathi', 'Hindi', 'English'],
    duration: '5 hours',
    parking: true,
    accessible: true,
    whoShouldAttend: ['Anyone seeking health guidance', 'Seniors', 'Patients', 'General public'],
    calDates: [28],
  },
  {
    id: 8,
    title: 'Special Meditation – Shri Krishna Puja',
    category: 'Special Meditation',
    date: 'August 31, 2026',
    dateObj: new Date(2026, 7, 31),
    time: '7:00 PM – 9:00 PM',
    venue: 'Deccan Gymkhana Hall',
    area: 'Deccan',
    description: 'A special collective meditation honouring Shri Krishna, celebrating the joy, playfulness, and divine diplomacy of the Vishuddhi chakra. Featuring devotional bhajans and an extended meditation.',
    img: 'https://images.unsplash.com/photo-1685977688551-151a427fec96?w=800&h=450&fit=crop&auto=format',
    beginner: false,
    free: true,
    languages: ['Hindi', 'Marathi'],
    duration: '2 hours',
    parking: true,
    accessible: true,
    whoShouldAttend: ['Regular seekers', 'Those celebrating Janmashtami', 'Music lovers'],
    calDates: [31],
  },
  {
    id: 9,
    title: 'Public Program – Koregaon Park',
    category: 'Public Program',
    date: 'August 14, 2026',
    dateObj: new Date(2026, 7, 14),
    time: '6:00 PM – 7:30 PM',
    venue: 'Lane 6 Community Room',
    area: 'Koregaon Park',
    description: 'Open-door guided meditation evening welcoming new seekers. Experience Self Realisation and collective meditation in a warm, supportive environment. No registration required.',
    img: 'https://images.unsplash.com/photo-1647796853261-a4112c2ba315?w=800&h=450&fit=crop&auto=format',
    beginner: true,
    free: true,
    languages: ['English'],
    duration: '90 minutes',
    parking: false,
    accessible: true,
    whoShouldAttend: ['Complete beginners', 'Expats', 'Newcomers to Pune'],
    calDates: [14],
  },
  {
    id: 10,
    title: 'Collective Outdoor Meditation – Osho Garden',
    category: 'Special Meditation',
    date: 'August 9, 2026',
    dateObj: new Date(2026, 7, 9),
    time: '7:00 AM – 8:30 AM',
    venue: 'Osho International Garden',
    area: 'Koregaon Park',
    description: 'A serene early morning collective meditation session in the open air. Ground your energy surrounded by nature before the day begins. Mat or blanket recommended.',
    img: 'https://images.unsplash.com/photo-1686749143613-0eeacff36894?w=800&h=450&fit=crop&auto=format',
    beginner: true,
    free: true,
    languages: ['English', 'Hindi'],
    duration: '90 minutes',
    parking: false,
    accessible: false,
    whoShouldAttend: ['Morning seekers', 'Nature lovers', 'Beginners and advanced'],
    calDates: [9],
  },
  {
    id: 11,
    title: 'Mindfulness & Meditation Workshop',
    category: 'Workshop',
    date: 'August 6, 2026',
    dateObj: new Date(2026, 7, 6),
    time: '6:30 PM – 8:30 PM',
    venue: 'Hinjewadi IT Park Community Hall',
    area: 'Hinjewadi',
    description: 'Designed specifically for IT professionals and working adults dealing with stress. Practical meditation tools, footsoaking demonstration, and Q&A session with expert practitioners.',
    img: 'https://images.unsplash.com/photo-1529693662653-9d480530a697?w=800&h=450&fit=crop&auto=format',
    beginner: true,
    free: true,
    languages: ['English'],
    duration: '2 hours',
    parking: true,
    accessible: true,
    whoShouldAttend: ['IT professionals', 'Corporate employees', 'Stressed adults'],
    calDates: [6],
  },
  {
    id: 12,
    title: 'Music & Meditation Evening',
    category: 'Special Meditation',
    date: 'August 21, 2026',
    dateObj: new Date(2026, 7, 21),
    time: '7:00 PM – 9:00 PM',
    venue: 'Pune Cultural Center, Tilak Road',
    area: 'Sadashiv Peth',
    description: 'An enchanting evening of live Indian classical music, bhajans, and guided meditation. Experience how music and meditation together deepen the inner journey.',
    img: 'https://images.unsplash.com/photo-1634155938686-24a26c55d71a?w=800&h=450&fit=crop&auto=format',
    beginner: true,
    free: true,
    languages: ['Hindi', 'Marathi', 'English'],
    duration: '2 hours',
    parking: false,
    accessible: true,
    whoShouldAttend: ['Music lovers', 'All seekers', 'Beginners welcome'],
    calDates: [21],
  },
]

const GALLERY_IMGS = [
  { src: 'https://images.unsplash.com/photo-1643682661119-28da0685be2c?w=600&h=400&fit=crop&auto=format', caption: 'Public Program – Kalyani Nagar', tab: 'Public Programs' },
  { src: 'https://images.unsplash.com/photo-1529693662653-9d480530a697?w=600&h=600&fit=crop&auto=format', caption: 'Group Meditation Session',          tab: 'Collectives'    },
  { src: 'https://images.unsplash.com/photo-1608405059861-b21a68ae76a2?w=600&h=400&fit=crop&auto=format', caption: 'Guru Puja Celebration',             tab: 'Festivals'       },
  { src: 'https://images.unsplash.com/photo-1685977688551-151a427fec96?w=600&h=500&fit=crop&auto=format', caption: 'Outdoor Festival Program',          tab: 'Festivals'       },
  { src: 'https://images.unsplash.com/photo-1643682661044-f0c34205dd65?w=600&h=400&fit=crop&auto=format', caption: 'Seminar – Indoor Collective',       tab: 'Seminars'        },
  { src: 'https://images.unsplash.com/photo-1687436874174-977fdd9e2cb8?w=600&h=400&fit=crop&auto=format', caption: 'Park Yoga Program',                 tab: 'Youth'           },
  { src: 'https://images.unsplash.com/photo-1555069855-e580a9adbf43?w=600&h=450&fit=crop&auto=format', caption: 'Outdoor Circle Meditation',           tab: 'Collectives'    },
  { src: 'https://images.unsplash.com/photo-1671581084718-c4c04fc00250?w=600&h=400&fit=crop&auto=format', caption: 'Community Service Camp',            tab: 'Public Programs' },
  { src: 'https://images.unsplash.com/photo-1625865020971-581242d0ead6?w=600&h=600&fit=crop&auto=format', caption: 'Devotional Evening',                tab: 'Festivals'       },
  { src: 'https://images.unsplash.com/photo-1651077920873-ac1be1b82290?w=600&h=400&fit=crop&auto=format', caption: 'Youth Program – Koregaon Park',    tab: 'Youth'           },
  { src: 'https://images.unsplash.com/photo-1616376392785-8e7e283571e6?w=600&h=400&fit=crop&auto=format', caption: 'Seminar Discussion Group',          tab: 'Seminars'        },
  { src: 'https://images.unsplash.com/photo-1634155938686-24a26c55d71a?w=600&h=500&fit=crop&auto=format', caption: 'Evening Gathering',                 tab: 'Collectives'    },
]

const GALLERY_TABS = ['All', 'Public Programs', 'Festivals', 'Seminars', 'Youth', 'Children', 'Collectives']

const CATEGORIES = [
  { label: 'Public Programs',       icon: '🌸', cat: 'Public Program',       color: 'from-sky-400 to-blue-500'    },
  { label: 'Workshops',             icon: '🎓', cat: 'Workshop',              color: 'from-violet-400 to-purple-500' },
  { label: 'Pujas & Festivals',     icon: '🙏', cat: 'Guru Puja',            color: 'from-amber-400 to-orange-500'  },
  { label: "Children's Programs",   icon: '👨‍👩‍👧', cat: "Children's Program",   color: 'from-pink-400 to-rose-500'    },
  { label: 'Youth Programs',        icon: '🌱', cat: 'Youth Program',         color: 'from-emerald-400 to-green-500' },
  { label: 'Music & Cultural',      icon: '🎵', cat: 'Special Meditation',    color: 'from-teal-400 to-cyan-500'    },
  { label: 'Community Service',     icon: '❤️', cat: 'Medical Camp',          color: 'from-red-400 to-rose-500'     },
  { label: 'Seminars',              icon: '📚', cat: 'Seminar',               color: 'from-indigo-400 to-blue-500'  },
]

const CATEGORY_COLORS: Partial<Record<EventCategory, string>> = {
  'Public Program':      'bg-sky-100 text-sky-700',
  'Workshop':            'bg-violet-100 text-violet-700',
  'Guru Puja':           'bg-amber-100 text-amber-700',
  'Birthday Puja':       'bg-orange-100 text-orange-700',
  'Youth Program':       'bg-emerald-100 text-emerald-700',
  "Children's Program":  'bg-pink-100 text-pink-700',
  'Medical Camp':        'bg-red-100 text-red-700',
  'Seminar':             'bg-indigo-100 text-indigo-700',
  'Special Meditation':  'bg-teal-100 text-teal-700',
}

const EVENT_DATES_IN_AUGUST = [4, 6, 9, 10, 14, 15, 17, 20, 21, 23, 24, 28, 31]

const FAQS = [
  { q: 'Is registration required?',         a: 'No registration is needed for most programs. Simply arrive at the venue — everyone is welcome. For workshops with limited seats, a WhatsApp contact may be provided.' },
  { q: 'Is meditation free?',               a: 'Yes, always and completely. Sahaja Yoga is a universal gift and no fee, donation, or membership is ever required for any program or event.' },
  { q: 'Can I bring my family?',            a: 'Absolutely! Families are warmly welcomed. Children have their own dedicated programs, and parents can attend adult sessions simultaneously at many events.' },
  { q: 'Can children attend?',              a: "Yes! Children aged 5 and above can attend most programs. Look for our dedicated Children's Programs for age-specific activities and meditation sessions." },
  { q: 'What should I wear?',              a: 'Comfortable, modest clothing works best. Loose-fitting attire is ideal for meditation. You will typically remove footwear at the venue entrance.' },
  { q: 'How long does an event last?',      a: 'Public Programs typically run 90 minutes. Workshops and seminars can be half-day or full-day. Each event listing includes the exact duration.' },
  { q: 'Do I need prior meditation experience?', a: 'No experience is required! Many of our programs are specifically designed for complete beginners. Look for the "Beginner Friendly" badge on event listings.' },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect() } }, { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(22px)', transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  )
}

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className={`text-[10px] font-semibold tracking-[0.25em] uppercase ${light ? 'text-amber-300' : 'text-amber-500'}`}>{children}</span>
      <span className={`flex-1 h-px bg-gradient-to-r ${light ? 'from-amber-400/40 to-transparent' : 'from-amber-200 to-transparent'}`} />
    </div>
  )
}

function CategoryBadge({ cat }: { cat: EventCategory }) {
  return (
    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[cat] ?? 'bg-sky-100 text-sky-700'}`}>{cat}</span>
  )
}

function useCountdown(target: Date) {
  const calc = useCallback(() => {
    const diff = target.getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    }
  }, [target])

  const [cd, setCd] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setCd(calc()), 1000)
    return () => clearInterval(id)
  }, [calc])
  return cd
}

// ─── Calendar ────────────────────────────────────────────────────────────────

function EventCalendar({ events, onDayClick }: { events: SahajaEvent[]; onDayClick: (e: SahajaEvent[]) => void }) {
  const [month] = useState(7) // August
  const [year]  = useState(2026)
  const today   = new Date().getDate()
  const todayMonth = new Date().getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const eventsByDay: Record<number, SahajaEvent[]> = {}
  events.forEach(ev => {
    if (ev.dateObj.getFullYear() === year && ev.dateObj.getMonth() === month) {
      const d = ev.dateObj.getDate()
      eventsByDay[d] = [...(eventsByDay[d] ?? []), ev]
    }
  })

  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-sky-50 bg-gradient-to-r from-[#0d2b45] to-[#1a3f5c]">
        <span className="font-display text-[17px] font-semibold text-white">August 2026</span>
        <span className="text-[11px] text-white/50 font-medium">{events.length} events this month</span>
      </div>
      <div className="grid grid-cols-7 border-b border-sky-50">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center py-2 text-[10px] font-semibold uppercase tracking-wider text-[#1a1f2e]/40">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-sky-50/50 p-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="aspect-square" />
          const dayEvents = eventsByDay[d] ?? []
          const isToday = todayMonth === month && d === today
          const hasFeatured = dayEvents.some(e => e.featured)
          return (
            <button
              key={i}
              onClick={() => dayEvents.length > 0 ? onDayClick(dayEvents) : undefined}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 group
                ${isToday ? 'bg-[#0d2b45] text-white font-bold' : 'bg-white hover:bg-sky-50'}
                ${dayEvents.length > 0 ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              <span className={`text-[12px] md:text-[13px] font-semibold ${isToday ? 'text-white' : d < today && todayMonth === month ? 'text-[#1a1f2e]/30' : 'text-[#1a1f2e]/75'}`}>{d}</span>
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5">
                  {dayEvents.slice(0, 3).map((ev, ei) => (
                    <span key={ei} className={`w-1 h-1 rounded-full ${hasFeatured ? 'bg-amber-500' : 'bg-sky-400'}`} />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
      <div className="px-4 py-3 border-t border-sky-50 flex items-center gap-4 text-[11px] text-[#1a1f2e]/50">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Featured</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400" /> Event</span>
        <span className="flex items-center gap-1.5"><span className="w-6 h-4 rounded-md bg-[#0d2b45]" /> Today</span>
      </div>
    </div>
  )
}

// ─── Event Card ──────────────────────────────────────────────────────────────

function EventCard({ ev, onOpen }: { ev: SahajaEvent; onOpen: (ev: SahajaEvent) => void }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-sky-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        <img src={ev.img} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2b45]/50 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <CategoryBadge cat={ev.category} />
          {ev.beginner && <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/90 text-white">🌱 Beginner Friendly</span>}
        </div>
        <div className="absolute bottom-3 left-3 text-white/90 text-[11px] font-medium">📅 {ev.date}</div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-[16px] font-semibold text-[#0d2b45] mb-2 leading-snug line-clamp-2">{ev.title}</h3>
        <div className="space-y-1 text-[12px] text-[#1a1f2e]/55 mb-3">
          <div>🕐 {ev.time}</div>
          <div>📍 {ev.venue}</div>
          <div>🗺️ {ev.area}</div>
        </div>
        <p className="text-[12px] text-[#1a1f2e]/60 leading-relaxed line-clamp-2 mb-4 flex-1">{ev.description}</p>
        <button
          onClick={() => onOpen(ev)}
          className="w-full py-2.5 rounded-xl bg-[#0d2b45] hover:bg-[#1a3f5c] text-white text-[13px] font-semibold transition-colors"
        >
          Learn More →
        </button>
      </div>
    </div>
  )
}

// ─── Event Detail Modal ──────────────────────────────────────────────────────

function EventModal({ ev, onClose }: { ev: SahajaEvent; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] bg-black/75 flex items-end md:items-center justify-center p-0 md:p-6 overflow-y-auto" onClick={onClose}>
      <div className="bg-white w-full md:max-w-3xl md:rounded-3xl overflow-hidden shadow-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Banner */}
        <div className="relative h-56 flex-shrink-0">
          <img src={ev.img.replace('w=800', 'w=1200')} alt={ev.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d2b45]/80 via-[#0d2b45]/30 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center text-lg hover:bg-black/60 transition-colors">✕</button>
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            <CategoryBadge cat={ev.category} />
            {ev.beginner && <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500 text-white">🌱 Beginner Friendly</span>}
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-sky-500 text-white">💛 Free Entry</span>
          </div>
          <div className="absolute bottom-5 left-5 right-5">
            <h2 className="font-display text-2xl font-semibold text-white leading-tight">{ev.title}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: '📅', label: 'Date',      val: ev.date       },
              { icon: '🕐', label: 'Time',      val: ev.time       },
              { icon: '⏱️', label: 'Duration',  val: ev.duration   },
              { icon: '💰', label: 'Entry',     val: ev.free ? 'Free' : 'Paid' },
            ].map(({ icon, label, val }) => (
              <div key={label} className="bg-sky-50 rounded-xl p-3 text-center">
                <div className="text-lg mb-0.5">{icon}</div>
                <div className="text-[10px] text-[#1a1f2e]/40 uppercase tracking-wider mb-0.5">{label}</div>
                <div className="text-[12px] font-semibold text-[#0d2b45]">{val}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-[14px] font-semibold text-[#0d2b45] mb-2">About This Event</h3>
            <p className="text-[13px] text-[#1a1f2e]/65 leading-relaxed">{ev.description}</p>
          </div>

          {/* Why You Should Attend — Signature Feature */}
          {(ev.category === 'Public Program' || ev.featured) && (
            <div className="bg-gradient-to-br from-sky-50 to-amber-50 rounded-2xl p-5 border border-sky-100">
              <h3 className="text-[14px] font-semibold text-[#0d2b45] mb-3">🌸 Why Attend This {ev.category === 'Public Program' ? 'Public Program' : 'Event'}?</h3>
              <ul className="space-y-2">
                {[
                  'Learn the basics of Sahaja Yoga',
                  'Experience guided Self Realisation meditation',
                  'Feel a tangible, physical experience — coolness on your palms',
                  'Meet warm, experienced practitioners in a safe space',
                  'Ask all your questions in a friendly environment',
                  'No prior experience required',
                  'Completely free of charge — no catches',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-[13px] text-[#1a1f2e]/70">
                    <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-center text-[12px] text-amber-600 font-medium italic">Everyone is welcome. We look forward to meeting you. 🌸</p>
            </div>
          )}

          {/* Details grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-[13px] font-semibold text-[#0d2b45]">Who Should Attend</h3>
              {ev.whoShouldAttend.map(w => (
                <div key={w} className="flex items-center gap-2 text-[12px] text-[#1a1f2e]/65">
                  <span className="text-sky-400">→</span> {w}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <h3 className="text-[13px] font-semibold text-[#0d2b45] mb-2">Venue & Access</h3>
              <div className="text-[12px] text-[#1a1f2e]/65 space-y-1.5">
                <div>📍 {ev.venue}, {ev.area}</div>
                <div>🌍 Languages: {ev.languages.join(', ')}</div>
                <div>🅿️ Parking: {ev.parking ? 'Available' : 'Limited — use public transport'}</div>
                <div>♿ Accessible: {ev.accessible ? 'Yes' : 'Partial — please contact us'}</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3 pt-2">
            <button className="flex-1 py-3 rounded-xl bg-[#0d2b45] hover:bg-[#1a3f5c] text-white font-semibold text-[14px] transition-colors">
              📅 Add to Calendar
            </button>
            <button className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-[14px] transition-colors">
              💬 WhatsApp Enquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Events() {
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'All'>('All')
  const [openFaq, setOpenFaq]               = useState<number | null>(null)
  const [lightbox, setLightbox]             = useState<number | null>(null)
  const [galleryTab, setGalleryTab]         = useState('All')
  const [modalEvent, setModalEvent]         = useState<SahajaEvent | null>(null)
  const [calModal, setCalModal]             = useState<SahajaEvent[] | null>(null)
  const [archiveYear, setArchiveYear]       = useState('2026')
  const [archiveCat, setArchiveCat]         = useState('All')

  const featured = EVENTS.find(e => e.featured)!
  const guruPujaDate = new Date(2026, 7, 15, 17, 0, 0)
  const countdown = useCountdown(guruPujaDate)

  const filteredEvents = EVENTS.filter(e => activeCategory === 'All' || e.category === activeCategory)
  const galleryFiltered = galleryTab === 'All' ? GALLERY_IMGS : GALLERY_IMGS.filter(g => g.tab === galleryTab)

  // Lightbox keyboard nav
  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setLightbox(i => i !== null ? (i + 1) % galleryFiltered.length : null)
      if (e.key === 'ArrowLeft')  setLightbox(i => i !== null ? (i - 1 + galleryFiltered.length) % galleryFiltered.length : null)
      if (e.key === 'Escape')     setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, galleryFiltered.length])

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-body">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[72vh] min-h-[500px] flex items-center overflow-hidden mt-[calc(2.25rem+4rem)]">
        <img
          src="https://images.unsplash.com/photo-1529693662653-9d480530a697?w=1800&h=900&fit=crop&auto=format"
          alt="Sahaja Yoga Program"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2b45]/85 via-[#0d2b45]/65 to-[#0d2b45]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2b45]/60 via-transparent to-transparent" />

        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-10">
          <FadeIn>
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-amber-300">Sahaja Connect Pune</span>
                <span className="h-px w-10 bg-amber-400/60" />
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-semibold text-white leading-[1.1] mb-4">
                Public Programs<br />
                <span className="text-amber-400">&amp; Events</span>
              </h1>
              <p className="text-white/70 text-[15px] leading-relaxed mb-8 max-w-xl">
                Discover upcoming meditation programs, workshops, festivals, seminars, youth events,
                children&apos;s activities, and special Sahaja Yoga celebrations across Pune.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#events-grid" className="flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-semibold text-[14px] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-300/40">
                  📅 View Upcoming Events
                </a>
                <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/25 text-white font-semibold text-[14px] transition-all hover:-translate-y-0.5">
                  🌸 I&apos;m New Here
                </button>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Floating stat chips */}
        <div className="absolute bottom-8 right-6 lg:right-10 hidden md:flex flex-col gap-2">
          {[
            { v: '12', l: 'Events This Month' },
            { v: '350+', l: 'Expected Attendees' },
            { v: '100%', l: 'Always Free' },
          ].map(({ v, l }) => (
            <div key={l} className="card-glass-new rounded-xl px-4 py-2 flex items-center gap-3">
              <span className="font-display text-xl font-bold text-amber-400">{v}</span>
              <span className="text-white/70 text-[11px]">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Event ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 -mt-12 relative z-10 mb-20">
        <FadeIn>
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-sky-100 bg-white">
            <div className="grid md:grid-cols-5">
              {/* Image */}
              <div className="md:col-span-2 relative h-64 md:h-auto overflow-hidden">
                <img src={featured.img} alt={featured.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d2b45]/20 md:to-[#0d2b45]/40" />
                <div className="absolute top-4 left-4">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-lg">
                    ⭐ Featured Event
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className="md:col-span-3 p-7 md:p-10 flex flex-col justify-between">
                <div>
                  <CategoryBadge cat={featured.category} />
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-[#0d2b45] mt-3 mb-3 leading-tight">{featured.title}</h2>
                  <p className="text-[14px] text-[#1a1f2e]/60 leading-relaxed mb-5">{featured.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                    {[
                      { icon: '📅', label: 'Date',  val: featured.date  },
                      { icon: '🕐', label: 'Time',  val: featured.time  },
                      { icon: '📍', label: 'Venue', val: featured.venue },
                    ].map(({ icon, label, val }) => (
                      <div key={label} className="bg-sky-50 rounded-xl p-3">
                        <div className="text-[10px] text-[#1a1f2e]/40 uppercase tracking-wider mb-0.5">{icon} {label}</div>
                        <div className="text-[12px] font-semibold text-[#0d2b45] leading-tight">{val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Countdown */}
                <div>
                  <div className="text-[11px] text-[#1a1f2e]/45 uppercase tracking-wider mb-2">Event begins in</div>
                  <div className="flex gap-3 mb-5">
                    {[
                      { v: countdown.days,    l: 'Days'    },
                      { v: countdown.hours,   l: 'Hours'   },
                      { v: countdown.minutes, l: 'Minutes' },
                      { v: countdown.seconds, l: 'Seconds' },
                    ].map(({ v, l }) => (
                      <div key={l} className="bg-[#0d2b45] rounded-xl px-3 py-2.5 text-center min-w-[54px]">
                        <div className="font-display text-2xl font-bold text-amber-400 leading-none">{String(v).padStart(2, '0')}</div>
                        <div className="text-[9px] text-white/50 uppercase tracking-wider mt-0.5">{l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2.5">
                    <button onClick={() => setModalEvent(featured)} className="flex-1 py-3 rounded-xl bg-[#0d2b45] hover:bg-[#1a3f5c] text-white font-semibold text-[13px] transition-colors">
                      Learn More →
                    </button>
                    <a href="https://maps.google.com" className="px-4 py-3 rounded-xl border border-sky-200 hover:border-sky-300 text-sky-600 text-[13px] font-semibold transition-colors flex items-center gap-1.5">
                      🗺️ Map
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Event Statistics ──────────────────────────────────────────────── */}
      <FadeIn>
        <section className="bg-white border-y border-sky-100 py-10 mb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: '🌸', val: '480+', label: 'Programs Conducted' },
                { icon: '🎓', val: '120+', label: 'Workshops Hosted'    },
                { icon: '🙏', val: '45+',  label: 'Festivals Celebrated' },
                { icon: '🌍', val: '18K+', label: 'Seekers Reached'     },
              ].map(({ icon, val, label }) => (
                <div key={label} className="group">
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">{icon}</div>
                  <div className="font-display text-3xl font-bold text-[#0d2b45] mb-1">{val}</div>
                  <div className="text-[11px] text-[#1a1f2e]/50 uppercase tracking-wider font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-24">

        {/* ── Category Cards ───────────────────────────────────────────────── */}
        <FadeIn>
          <SectionLabel>Browse by Category</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-8">Event Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map(({ label, icon, cat, color }, i) => (
              <FadeIn key={label} delay={i * 50}>
                <button
                  onClick={() => setActiveCategory(cat as EventCategory)}
                  className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-2 ${activeCategory === cat ? 'border-sky-400 shadow-lg' : 'border-transparent'}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-90`} />
                  <div className="relative">
                    <div className="text-3xl mb-3">{icon}</div>
                    <div className="text-white font-semibold text-[14px] leading-tight">{label}</div>
                    <div className="text-white/70 text-[11px] mt-1">
                      {EVENTS.filter(e => e.category === cat || (cat === 'Guru Puja' && (e.category === 'Guru Puja' || e.category === 'Birthday Puja' || e.category === 'Diwali Puja'))).length} events
                    </div>
                    <div className="absolute bottom-0 right-0 opacity-10 text-6xl leading-none group-hover:scale-125 transition-transform duration-500">
                      {icon}
                    </div>
                  </div>
                </button>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        {/* ── Events Grid ───────────────────────────────────────────────────── */}
        <div id="events-grid">
          <FadeIn>
            <SectionLabel>Upcoming Programs</SectionLabel>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="font-display text-3xl font-semibold text-[#0d2b45]">
                {activeCategory === 'All' ? 'All Events' : activeCategory}
                <span className="text-[#1a1f2e]/30 text-2xl ml-2">({filteredEvents.length})</span>
              </h2>
              {activeCategory !== 'All' && (
                <button onClick={() => setActiveCategory('All')} className="text-[12px] text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1">
                  ← Show all events
                </button>
              )}
            </div>
          </FadeIn>

          {filteredEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((ev, i) => (
                <FadeIn key={ev.id} delay={i * 60}>
                  <EventCard ev={ev} onOpen={setModalEvent} />
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🌸</div>
              <p className="text-[#1a1f2e]/50 text-[15px]">No events in this category right now.</p>
              <button onClick={() => setActiveCategory('All')} className="mt-4 text-sky-500 hover:text-sky-600 font-medium text-[13px]">
                View all events →
              </button>
            </div>
          )}
        </div>

        {/* ── Calendar + Why Attend ─────────────────────────────────────────── */}
        <FadeIn>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <SectionLabel>Monthly View</SectionLabel>
              <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-6">Event Calendar</h2>
              <EventCalendar events={EVENTS} onDayClick={evs => setCalModal(evs)} />
            </div>
            {/* Why attend public programs */}
            <div>
              <SectionLabel>Signature Feature</SectionLabel>
              <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-6">Why Attend a Public Program?</h2>
              <div className="bg-gradient-to-br from-[#0d2b45] to-[#1a3f5c] rounded-2xl p-7 relative overflow-hidden">
                <LotusDecor className="absolute -right-8 -bottom-8 w-40 h-40 text-white opacity-[0.05]" />
                <h3 className="font-display text-xl font-semibold text-white mb-5 relative">🌸 Experience Something Real</h3>
                <ul className="space-y-3 relative">
                  {[
                    'Learn the basics of Sahaja Yoga',
                    'Experience guided Self Realisation',
                    'Feel coolness — a tangible physical sensation',
                    'Meet experienced, warm practitioners',
                    'Ask questions in a safe environment',
                    'No prior experience required',
                    'Completely free of charge — always',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] text-white/75">
                      <span className="text-emerald-400 flex-shrink-0 mt-0.5 font-bold">✓</span> {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-5 border-t border-white/10">
                  <p className="text-amber-300 text-[13px] text-center font-medium italic">
                    Everyone is welcome. We look forward to meeting you. 🌸
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── Volunteer Section ─────────────────────────────────────────────── */}
        <FadeIn>
          <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-sky-50/50 to-sky-50 border border-amber-100 overflow-hidden">
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-3 p-8 md:p-12">
                <SectionLabel>Get Involved</SectionLabel>
                <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-4">🌸 Become a Volunteer</h2>
                <p className="text-[15px] text-[#1a1f2e]/65 leading-relaxed mb-6">
                  Help create a welcoming experience for every seeker. Join us as a volunteer and contribute
                  your skills to Public Programs, Festivals, Workshops, and Community Events across Pune.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-7">
                  {['Welcome & Reception', 'Translation Support', 'Event Coordination', 'Music & Sound', 'Photography', 'Children Support'].map(role => (
                    <div key={role} className="flex items-center gap-2 text-[12px] text-[#1a1f2e]/60">
                      <span className="text-amber-500">🌸</span> {role}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Link to="/volunteer" className="px-7 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-semibold text-[14px] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-200/70">
                    Become a Volunteer
                  </Link>
                  <Link to="/journey" className="px-7 py-3 rounded-full border border-[#0d2b45]/20 hover:border-[#0d2b45]/40 text-[#0d2b45] font-semibold text-[14px] transition-all">
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="md:col-span-2 relative min-h-[280px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1555069855-e580a9adbf43?w=600&h=500&fit=crop&auto=format"
                  alt="Volunteer at events"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-amber-50/20" />
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── Gallery ──────────────────────────────────────────────────────── */}
        <FadeIn>
          <SectionLabel>Photo Gallery</SectionLabel>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <h2 className="font-display text-3xl font-semibold text-[#0d2b45]">Events Through the Years</h2>
            <div className="flex gap-2 flex-wrap">
              {GALLERY_TABS.map(t => (
                <button
                  key={t}
                  onClick={() => { setGalleryTab(t); setLightbox(null) }}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${galleryTab === t ? 'bg-[#0d2b45] text-white' : 'bg-white border border-sky-100 text-[#1a1f2e]/60 hover:border-sky-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {galleryFiltered.map((g, i) => (
              <div
                key={i}
                className="break-inside-avoid cursor-pointer overflow-hidden rounded-xl group relative"
                onClick={() => setLightbox(i)}
              >
                <img src={g.src} alt={g.caption} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-[#0d2b45]/0 group-hover:bg-[#0d2b45]/40 transition-colors duration-300 flex items-end p-3">
                  <span className="text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">{g.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* ── Past Events Archive ───────────────────────────────────────────── */}
        <FadeIn>
          <SectionLabel>Archive</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-8">Past Events Archive</h2>
          <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-6 md:p-8">
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Year', val: archiveYear, set: setArchiveYear, opts: ['2026', '2025', '2024', '2023', '2022'] },
                { label: 'Month', val: 'All', set: () => {}, opts: ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
                { label: 'Category', val: archiveCat, set: setArchiveCat, opts: ['All', 'Public Program', 'Workshop', 'Festival', 'Youth', "Children's"] },
                { label: 'Area', val: 'All', set: () => {}, opts: ['All', 'Kalyani Nagar', 'Koregaon Park', 'Viman Nagar', 'Baner', 'Aundh'] },
              ].map(({ label, val, set, opts }) => (
                <div key={label}>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1a1f2e]/40 mb-1.5">{label}</label>
                  <select
                    value={val}
                    onChange={e => set(e.target.value)}
                    className="w-full border border-sky-100 rounded-xl px-3 py-2.5 text-[13px] text-[#0d2b45] font-medium bg-sky-50/50 focus:outline-none focus:border-sky-300 appearance-none cursor-pointer"
                  >
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            {/* Archive preview rows */}
            <div className="space-y-3">
              {[
                { month: 'July 2026', title: 'Public Program – Deccan', type: 'Public Program', attendees: 68 },
                { month: 'June 2026', title: 'Adi Shakti Puja Celebration', type: 'Guru Puja', attendees: 220 },
                { month: 'May 2026', title: 'Youth Workshop – Kalyani Nagar', type: 'Youth Program', attendees: 45 },
                { month: 'April 2026', title: 'Shri Rama Navami Puja', type: 'Special Meditation', attendees: 130 },
                { month: 'March 2026', title: 'Holi Celebration Collective', type: 'Special Meditation', attendees: 85 },
              ].map(({ month, title, type, attendees }) => (
                <div key={title} className="flex items-center gap-4 p-4 rounded-xl border border-sky-50 hover:bg-sky-50/50 transition-colors cursor-pointer group">
                  <div className="w-20 text-[11px] text-[#1a1f2e]/40 font-medium flex-shrink-0">{month}</div>
                  <div className="flex-1 font-medium text-[#0d2b45] text-[13px] group-hover:text-sky-600 transition-colors">{title}</div>
                  <CategoryBadge cat={type as EventCategory} />
                  <div className="text-[11px] text-[#1a1f2e]/40 flex-shrink-0 hidden md:block">{attendees} attended</div>
                  <span className="text-sky-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0">→</span>
                </div>
              ))}
            </div>
            <button className="mt-5 w-full py-3 rounded-xl border border-sky-100 hover:border-sky-300 text-[13px] font-medium text-[#1a1f2e]/55 hover:text-sky-600 transition-all">
              Load More Past Events
            </button>
          </div>
        </FadeIn>

        {/* ── FAQ ────────────────────────────────────────────────────────────── */}
        <FadeIn>
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-8">Common Questions</h2>
          <div className="max-w-3xl space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
                <button className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="text-[14px] font-semibold text-[#0d2b45]">{q}</span>
                  <span className={`text-sky-400 text-xl flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                <div className={`overflow-hidden transition-all duration-400 ${openFaq === i ? 'max-h-48' : 'max-h-0'}`}>
                  <p className="px-6 pb-5 text-[13px] text-[#1a1f2e]/65 leading-relaxed">{a}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <FadeIn>
          <div className="rounded-3xl bg-gradient-to-br from-[#0d2b45] to-[#1a3f5c] relative overflow-hidden text-center py-16 px-8">
            <LotusDecor className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 text-white opacity-[0.04]" />
            <div className="relative">
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">Ready to Join Us?</h2>
              <p className="text-white/65 text-[15px] max-w-lg mx-auto mb-8 leading-relaxed">
                Experience the joy of collective meditation and discover Sahaja Yoga in a welcoming,
                caring environment across Pune.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="#events-grid" className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-semibold text-[14px] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-400/40">
                  📅 Explore More Events
                </a>
                <Link to="/find-center" className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold text-[14px] transition-all hover:-translate-y-0.5 backdrop-blur-sm">
                  📍 Find a Center
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0d2b45] text-white/70 py-12 px-6 lg:px-10 relative overflow-hidden mt-24">
        <LotusDecor className="absolute -right-20 -bottom-20 w-72 h-72 text-white opacity-[0.04]" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="font-display text-xl font-semibold text-white mb-2">Sahaja Connect Pune</div>
              <p className="text-[13px] leading-relaxed mb-4">Connecting Pune seekers with authentic Sahaja Yoga programs, events, and meditation centers — all completely free.</p>
            </div>
            <div>
              <div className="text-white/90 font-semibold text-[13px] mb-3 uppercase tracking-wider">Pages</div>
              <Link to="/"            className="block text-[13px] py-1 hover:text-amber-400 transition-colors">Home</Link>
              <Link to="/events"      className="block text-[13px] py-1 hover:text-amber-400 transition-colors">Events</Link>
              <Link to="/find-center" className="block text-[13px] py-1 hover:text-amber-400 transition-colors">Find a Center</Link>
            </div>
            <div>
              <div className="text-white/90 font-semibold text-[13px] mb-3 uppercase tracking-wider">Quick Contact</div>
              <div className="text-[13px] space-y-1">
                <div>📞 +91 98765 43210</div>
                <div>✉️ events@sahaja.in</div>
                <div>💬 WhatsApp Group</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-white/35">
            <span>© 2026 Sahaja Connect Pune. All events are free of charge.</span>
            <span>Made with 🌸 for seekers everywhere</span>
          </div>
        </div>
      </footer>

      {/* ── Mobile Sticky Bar ─────────────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/97 backdrop-blur-xl border-t border-sky-100 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 py-3">
        <div className="grid grid-cols-3 gap-2">
          <a href="#events-grid" className="flex flex-col items-center gap-1 py-2 rounded-xl bg-amber-500 text-white text-[11px] font-semibold">
            <span className="text-base">📅</span> Upcoming Events
          </a>
          <Link to="/find-center" className="flex flex-col items-center gap-1 py-2 rounded-xl bg-sky-500 text-white text-[11px] font-semibold">
            <span className="text-base">📍</span> Find Center
          </Link>
          <button className="flex flex-col items-center gap-1 py-2 rounded-xl bg-[#0d2b45] text-white text-[11px] font-semibold">
            <span className="text-base">🌸</span> Volunteer
          </button>
        </div>
      </div>
      <div className="h-20 md:hidden" />

      {/* ── Event Detail Modal ─────────────────────────────────────────────── */}
      {modalEvent && <EventModal ev={modalEvent} onClose={() => setModalEvent(null)} />}

      {/* ── Calendar Day Modal ────────────────────────────────────────────── */}
      {calModal && (
        <div className="fixed inset-0 z-[100] bg-black/75 flex items-center justify-center p-6" onClick={() => setCalModal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-[#0d2b45]">Events on {calModal[0].date.split(',')[0]}</h3>
              <button onClick={() => setCalModal(null)} className="text-[#1a1f2e]/40 hover:text-[#1a1f2e] text-xl">✕</button>
            </div>
            <div className="space-y-3">
              {calModal.map(ev => (
                <div key={ev.id} className="p-3 rounded-xl border border-sky-100 hover:bg-sky-50 transition-colors cursor-pointer" onClick={() => { setCalModal(null); setModalEvent(ev) }}>
                  <div className="flex items-start gap-2 mb-1">
                    <CategoryBadge cat={ev.category} />
                  </div>
                  <div className="font-semibold text-[13px] text-[#0d2b45]">{ev.title}</div>
                  <div className="text-[11px] text-[#1a1f2e]/50 mt-1">{ev.time} · {ev.area}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Gallery Lightbox ──────────────────────────────────────────────── */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] bg-black/92 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-5 right-5 text-white/60 hover:text-white text-3xl transition-colors" onClick={() => setLightbox(null)}>✕</button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl px-2 transition-colors" onClick={e => { e.stopPropagation(); setLightbox(i => (i! - 1 + galleryFiltered.length) % galleryFiltered.length) }}>‹</button>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={galleryFiltered[lightbox].src.replace('w=600', 'w=1200')} alt={galleryFiltered[lightbox].caption} className="w-full rounded-xl object-contain max-h-[82vh]" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-5 rounded-b-xl">
              <p className="text-white text-[14px] font-medium">{galleryFiltered[lightbox].caption}</p>
              <p className="text-white/50 text-[11px]">{lightbox + 1} / {galleryFiltered.length}</p>
            </div>
          </div>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl px-2 transition-colors" onClick={e => { e.stopPropagation(); setLightbox(i => (i! + 1) % galleryFiltered.length) }}>›</button>
        </div>
      )}
    </div>
  )
}
