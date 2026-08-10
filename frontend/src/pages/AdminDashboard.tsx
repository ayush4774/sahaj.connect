import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

// ─── Types ─────────────────────────────────────────────────────────────────────
type Section = 'dashboard' | 'centers' | 'coordinators' | 'attendance' | 'events' | 'volunteers' | 'announcements' | 'gallery' | 'reports' | 'analytics' | 'settings'
type StatusType = 'Active' | 'Inactive' | 'Session Soon' | 'Archived'
type ToastT = { msg: string; type: 'success' | 'error' | 'info' }

interface Center { id: number; name: string; area: string; coordinator: string; status: StatusType; nextSession: string; attendance: number; archived: boolean }
interface Volunteer { id: number; name: string; skills: string[]; area: string; event: string; availability: string; status: 'Confirmed' | 'Pending' | 'Assigned' }
interface Coordinator { id: number; name: string; phone: string; centers: string; status: 'Active' | 'Inactive'; initials: string; color: string }
interface Event { id: number; title: string; date: string; venue: string; volunteers: number; status: 'Draft' | 'Published' | 'Archived'; category: string; img: string }
interface GalleryItem { id: number; src: string; caption: string; tag: string; featured: boolean; selected: boolean }
interface Announcement { id: number; title: string; category: string; priority: 'High' | 'Medium' | 'Low'; startDate: string; endDate: string; audience: string; published: boolean }
interface Notification { id: number; msg: string; time: string; type: 'volunteer' | 'attendance' | 'event' | 'gallery' | 'system'; read: boolean }

// ─── Seed Data ─────────────────────────────────────────────────────────────────
const initCenters: Center[] = [
  { id: 1, name: 'Kalyani Nagar Center', area: 'Kalyani Nagar', coordinator: 'Priya Kulkarni',  status: 'Active',       nextSession: '6:30 PM', attendance: 42, archived: false },
  { id: 2, name: 'Koregaon Park Center', area: 'Koregaon Park',  coordinator: 'Rahul Deshmukh', status: 'Active',       nextSession: '6:00 PM', attendance: 35, archived: false },
  { id: 3, name: 'Viman Nagar Center',   area: 'Viman Nagar',    coordinator: 'Anita Sharma',   status: 'Active',       nextSession: '6:30 PM', attendance: 28, archived: false },
  { id: 4, name: 'Baner Center',         area: 'Baner',          coordinator: 'Suresh Patil',   status: 'Session Soon', nextSession: '7:00 PM', attendance: 22, archived: false },
  { id: 5, name: 'Aundh Center',         area: 'Aundh',          coordinator: 'Kavita Joshi',   status: 'Inactive',     nextSession: '—',       attendance: 0,  archived: false },
  { id: 6, name: 'Deccan Center',        area: 'Deccan',         coordinator: 'Mohan Kulkarni', status: 'Active',       nextSession: '7:00 PM', attendance: 31, archived: false },
  { id: 7, name: 'Hinjewadi Center',     area: 'Hinjewadi',      coordinator: 'Deepa Pawar',    status: 'Active',       nextSession: '6:30 PM', attendance: 19, archived: false },
  { id: 8, name: 'Kothrud Center',       area: 'Kothrud',        coordinator: 'Raj Sharma',     status: 'Session Soon', nextSession: '7:00 PM', attendance: 15, archived: false },
  { id: 9, name: 'Hadapsar Center',      area: 'Hadapsar',       coordinator: 'Sunita Nair',    status: 'Active',       nextSession: '6:00 PM', attendance: 27, archived: false },
  { id: 10,name: 'Pimpri Center',        area: 'Pimpri',         coordinator: 'Arun Mehta',     status: 'Inactive',     nextSession: '—',       attendance: 0,  archived: false },
]

const initVolunteers: Volunteer[] = [
  { id: 1, name: 'Priya Kulkarni', skills: ['Hospitality', 'Registration'], area: 'Kalyani Nagar', event: 'Guru Puja 2026',  availability: 'Full Day',  status: 'Confirmed' },
  { id: 2, name: 'Rahul Deshmukh', skills: ['Stage', 'Sound System'],       area: 'Viman Nagar',   event: 'Guru Puja 2026',  availability: 'Evening',   status: 'Pending'   },
  { id: 3, name: 'Sunita Pawar',   skills: ['Medical Assistance'],           area: 'Aundh',         event: 'Medical Camp',    availability: 'Morning',   status: 'Confirmed' },
  { id: 4, name: 'Vikram Joshi',   skills: ['Photography', 'Social Media'], area: 'Koregaon Park', event: 'Public Program',  availability: 'Evening',   status: 'Assigned'  },
  { id: 5, name: 'Anita Sharma',   skills: ["Children's", 'Decoration'],    area: 'Baner',         event: "Children's Camp", availability: 'Morning',   status: 'Confirmed' },
  { id: 6, name: 'Deepa Pawar',    skills: ['Translation', 'Hospitality'],  area: 'Hinjewadi',     event: 'Seminar 2026',    availability: 'Multiple',  status: 'Pending'   },
]

const initCoordinators: Coordinator[] = [
  { id: 1, name: 'Priya Kulkarni', phone: '+91 98765 43210', centers: 'Kalyani Nagar', status: 'Active', initials: 'PK', color: 'from-sky-400 to-blue-600'     },
  { id: 2, name: 'Rahul Deshmukh', phone: '+91 97654 32109', centers: 'Koregaon Park', status: 'Active', initials: 'RD', color: 'from-emerald-400 to-green-600' },
  { id: 3, name: 'Anita Sharma',   phone: '+91 94567 89012', centers: 'Viman Nagar',   status: 'Active', initials: 'AS', color: 'from-violet-400 to-purple-600'  },
  { id: 4, name: 'Suresh Patil',   phone: '+91 93456 78901', centers: 'Baner',          status: 'Active', initials: 'SP', color: 'from-amber-400 to-orange-500'  },
  { id: 5, name: 'Kavita Joshi',   phone: '+91 92345 67890', centers: 'Aundh',          status: 'Inactive',initials:'KJ', color: 'from-rose-400 to-pink-600'     },
]

const initEvents: Event[] = [
  { id: 1, title: 'Guru Puja 2026',         date: 'Aug 15', venue: 'Bal Gandharva',       volunteers: 28, status: 'Published', category: 'Festival',      img: 'https://images.unsplash.com/photo-1608405059861-b21a68ae76a2?w=400&h=200&fit=crop&auto=format' },
  { id: 2, title: 'Public Program – KN',    date: 'Aug 10', venue: 'Kalyani Nagar Hall',  volunteers: 5,  status: 'Published', category: 'Public Program', img: 'https://images.unsplash.com/photo-1643682661119-28da0685be2c?w=400&h=200&fit=crop&auto=format' },
  { id: 3, title: 'Medical Camp – Aundh',   date: 'Aug 28', venue: 'Aundh Ground',        volunteers: 8,  status: 'Draft',     category: 'Medical Camp',   img: 'https://images.unsplash.com/photo-1671581084718-c4c04fc00250?w=400&h=200&fit=crop&auto=format' },
  { id: 4, title: "Children's Camp",        date: 'Aug 24', venue: 'Baner Center Lawn',   volunteers: 3,  status: 'Draft',     category: "Children's",    img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=200&fit=crop&auto=format' },
]

const initAnnouncements: Announcement[] = [
  { id: 1, title: 'Guru Puja 2026 – All Seekers Welcome', category: 'Festival',  priority: 'High',   startDate: 'Aug 10', endDate: 'Aug 15', audience: 'All Seekers', published: true  },
  { id: 2, title: 'New Center Opening – Magarpatta',      category: 'Centers',   priority: 'Medium', startDate: 'Aug 20', endDate: 'Sep 1',  audience: 'All',         published: false },
  { id: 3, title: 'Volunteer Drive – Medical Camp',       category: 'Volunteer', priority: 'High',   startDate: 'Aug 12', endDate: 'Aug 28', audience: 'Volunteers',  published: true  },
]

const initNotifs: Notification[] = [
  { id: 1, msg: 'New volunteer registered: Meena Tiwari for Guru Puja',     time: '2 min ago',  type: 'volunteer',   read: false },
  { id: 2, msg: 'Attendance missing for Kothrud Center – today',            time: '18 min ago', type: 'attendance',  read: false },
  { id: 3, msg: 'Event tomorrow: Public Program – Kalyani Nagar at 6:30 PM',time: '1 hr ago',   type: 'event',       read: false },
  { id: 4, msg: 'Gallery upload complete: 24 photos from Koregaon Park',    time: '2 hr ago',   type: 'gallery',     read: true  },
  { id: 5, msg: 'Coordinator profile updated: Anita Sharma',                time: '3 hr ago',   type: 'system',      read: true  },
]

const GALLERY_IMGS: GalleryItem[] = [
  { id: 1, src: 'https://images.unsplash.com/photo-1643682661119-28da0685be2c?w=300&h=200&fit=crop&auto=format', caption: 'Public Program – KN',   tag: 'Public Program', featured: true,  selected: false },
  { id: 2, src: 'https://images.unsplash.com/photo-1608405059861-b21a68ae76a2?w=300&h=200&fit=crop&auto=format', caption: 'Guru Puja Crowd',        tag: 'Festival',       featured: false, selected: false },
  { id: 3, src: 'https://images.unsplash.com/photo-1529693662653-9d480530a697?w=300&h=200&fit=crop&auto=format', caption: 'Group Meditation',        tag: 'Collective',     featured: false, selected: false },
  { id: 4, src: 'https://images.unsplash.com/photo-1685977688551-151a427fec96?w=300&h=200&fit=crop&auto=format', caption: 'Outdoor Program',         tag: 'Festival',       featured: false, selected: false },
  { id: 5, src: 'https://images.unsplash.com/photo-1687436874174-977fdd9e2cb8?w=300&h=200&fit=crop&auto=format', caption: 'Park Yoga Session',       tag: 'Collective',     featured: false, selected: false },
  { id: 6, src: 'https://images.unsplash.com/photo-1671581084718-c4c04fc00250?w=300&h=200&fit=crop&auto=format', caption: 'Community Service',       tag: 'Service',        featured: false, selected: false },
  { id: 7, src: 'https://images.unsplash.com/photo-1616376392785-8e7e283571e6?w=300&h=200&fit=crop&auto=format', caption: 'Seminar Group',           tag: 'Seminar',        featured: false, selected: false },
  { id: 8, src: 'https://images.unsplash.com/photo-1634155938686-24a26c55d71a?w=300&h=200&fit=crop&auto=format', caption: 'Evening Gathering',       tag: 'Collective',     featured: false, selected: false },
]

const ACTIVITY = [
  { time: '10:05 AM', icon: '🧘', msg: 'Attendance updated – Kalyani Nagar (42 seekers)', color: 'bg-sky-400'   },
  { time: '11:12 AM', icon: '🤝', msg: 'Volunteer approved – Vikram Joshi for Public Program', color: 'bg-emerald-400' },
  { time: '1:30 PM',  icon: '🏠', msg: 'New center added – Magarpatta (pending approval)', color: 'bg-amber-400' },
  { time: '3:10 PM',  icon: '🖼️', msg: 'Gallery uploaded – 24 photos from Koregaon Park', color: 'bg-violet-400' },
  { time: '4:45 PM',  icon: '📢', msg: 'Announcement published – Guru Puja 2026', color: 'bg-rose-400' },
]

const ATTENDANCE_ROWS = [
  { center: 'Kalyani Nagar', time: '6:30 PM', total: 42, newSeekers: 5, children: 3, volunteers: 4, photos: 8,  status: 'Submitted' },
  { center: 'Koregaon Park', time: '6:00 PM', total: 35, newSeekers: 2, children: 1, volunteers: 3, photos: 12, status: 'Submitted' },
  { center: 'Viman Nagar',   time: '6:30 PM', total: 28, newSeekers: 4, children: 2, volunteers: 2, photos: 5,  status: 'Pending'   },
  { center: 'Baner',         time: '7:00 PM', total: 22, newSeekers: 1, children: 0, volunteers: 2, photos: 3,  status: 'Pending'   },
  { center: 'Deccan',        time: '7:00 PM', total: 31, newSeekers: 3, children: 2, volunteers: 3, photos: 6,  status: 'Submitted' },
  { center: 'Kothrud',       time: '7:00 PM', total: 0,  newSeekers: 0, children: 0, volunteers: 0, photos: 0,  status: 'Missing'   },
]

const MONTHLY_ATTENDANCE = [620, 580, 710, 690, 740, 810, 780, 820, 870, 840, 910, 952]
const MONTHS = ['Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug']
const CENTER_DATA   = [{ name: 'Kalyani Nagar', val: 42 }, { name: 'Koregaon Park', val: 35 }, { name: 'Deccan', val: 31 }, { name: 'Viman Nagar', val: 28 }, { name: 'Hadapsar', val: 27 }]
const SEEKERS_TREND = [28, 35, 42, 38, 55, 48, 62, 58, 70, 65, 80, 87]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusColors: Record<string, string> = {
  Active:       'bg-emerald-100 text-emerald-700',
  'Session Soon':'bg-amber-100 text-amber-700',
  Inactive:     'bg-red-100 text-red-700',
  Archived:     'bg-gray-100 text-gray-500',
  Confirmed:    'bg-emerald-100 text-emerald-700',
  Pending:      'bg-amber-100 text-amber-700',
  Assigned:     'bg-sky-100 text-sky-700',
  Published:    'bg-emerald-100 text-emerald-700',
  Draft:        'bg-gray-100 text-gray-600',
  Submitted:    'bg-emerald-100 text-emerald-700',
  Missing:      'bg-red-100 text-red-700',
  High:         'bg-red-100 text-red-700',
  Medium:       'bg-amber-100 text-amber-700',
  Low:          'bg-sky-100 text-sky-700',
}

function Badge({ label }: { label: string }) {
  return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[label] ?? 'bg-gray-100 text-gray-600'}`}>{label}</span>
}

function TrendChip({ val, positive }: { val: string; positive: boolean }) {
  return (
    <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
      {positive ? '⬆' : '⬇'} {val}
    </span>
  )
}

// ─── Modals / Dialog ───────────────────────────────────────────────────────────

function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', esc) }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-md'} overflow-hidden`}
        style={{ animation: 'fade-in-up 0.22s cubic-bezier(0.34,1.56,0.64,1) both' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-sky-50 bg-[#0d2b45]">
          <span className="text-white font-semibold text-[15px]">{title}</span>
          <button onClick={onClose} className="text-white/50 hover:text-white text-xl leading-none transition-colors">✕</button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  )
}

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[250] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6" style={{ animation: 'fade-in-up 0.2s ease both' }}>
        <div className="text-3xl mb-3 text-center">⚠️</div>
        <p className="text-[14px] text-[#1a1f2e]/75 text-center leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-sky-100 text-[13px] font-medium text-[#1a1f2e]/60 hover:border-sky-300 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-[13px] font-semibold transition-colors">Confirm</button>
        </div>
      </div>
    </div>
  )
}

function Toast({ toast, onDone }: { toast: ToastT; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t) }, [onDone])
  const colors = toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-sky-600'
  return (
    <div className={`fixed bottom-6 right-6 z-[300] ${colors} text-white px-5 py-3 rounded-xl shadow-xl text-[13px] font-medium flex items-center gap-2.5`}
      style={{ animation: 'fade-in-up 0.3s ease both' }}>
      <span>{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}</span>
      {toast.msg}
    </div>
  )
}

// ─── SVG Charts ───────────────────────────────────────────────────────────────

function BarChart({ data, labels, color = '#4a90c4' }: { data: number[]; labels: string[]; color?: string }) {
  const max = Math.max(...data)
  const W = 560; const H = 140; const pad = 6; const barW = Math.floor((W - pad * (data.length + 1)) / data.length)
  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full">
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {data.map((v, i) => {
        const h = Math.max(4, (v / max) * H)
        const x = pad + i * (barW + pad)
        return (
          <g key={i}>
            <rect x={x} y={H - h} width={barW} height={h} fill="url(#barGrad)" rx={3} className="transition-all duration-500" />
            <text x={x + barW / 2} y={H + 14} textAnchor="middle" fontSize="9" fill="#94a3b8">{labels[i]}</text>
          </g>
        )
      })}
    </svg>
  )
}

function LineChart({ data, color = '#c4973a' }: { data: number[]; color?: string }) {
  const max = Math.max(...data); const min = Math.min(...data)
  const W = 560; const H = 120
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((v - min) / (max - min || 1)) * (H - 10) - 5
    return `${x},${y}`
  }).join(' ')
  const area = `0,${H} ` + pts + ` ${W},${H}`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <defs>
        <linearGradient id="lineArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#lineArea)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * W
        const y = H - ((v - min) / (max - min || 1)) * (H - 10) - 5
        return <circle key={i} cx={x} cy={y} r={3} fill={color} />
      })}
    </svg>
  )
}

// ─── Section: Dashboard Home ───────────────────────────────────────────────────

function DashboardHome({ onNav, showToast }: { onNav: (s: Section) => void; showToast: (m: string, t?: ToastT['type']) => void }) {
  const [liveSeekersToday, setLiveSeekersToday] = useState(219)
  useEffect(() => {
    const id = setInterval(() => setLiveSeekersToday(n => n + Math.floor(Math.random() * 3)), 8000)
    return () => clearInterval(id)
  }, [])

  const stats = [
    { icon: '🏡', label: 'Total Centers',           val: '10', trend: '+1',  pos: true  },
    { icon: '📅', label: "Today's Sessions",        val: '7',  trend: '+2',  pos: true  },
    { icon: '🧘', label: 'Attendance This Week',    val: '952',trend: '+8%', pos: true  },
    { icon: '🌱', label: 'New Seekers This Month',  val: '87', trend: '+12%',pos: true  },
    { icon: '🤝', label: 'Active Volunteers',       val: '43', trend: '-4%', pos: false },
    { icon: '📢', label: 'Upcoming Events',         val: '4',  trend: '+1',  pos: true  },
  ]

  return (
    <div className="space-y-6">
      {/* Command Center */}
      <div className="bg-gradient-to-r from-[#0d2b45] to-[#1a3f5c] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-48 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full" fill="white">
            {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => <ellipse key={i} cx="100" cy="100" rx="14" ry="62" opacity="0.45" transform={`rotate(${a} 100 100)`} />)}
            <circle cx="100" cy="100" r="22" opacity="0.7" />
          </svg>
        </div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-1">Sahaja Connect — Pune Operations Command Center</div>
              <h2 className="text-white font-display text-xl font-semibold">Live Overview — Today</h2>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 rounded-full px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-[11px] font-semibold">Live</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { icon: '🟢', label: 'Centers Active', val: '7' },
              { icon: '🧘', label: 'Sessions Now',   val: '3' },
              { icon: '👥', label: 'Seekers Today',  val: liveSeekersToday.toString() },
              { icon: '🌱', label: 'New Seekers',    val: '14' },
              { icon: '🤝', label: 'On Duty',        val: '12' },
              { icon: '📅', label: 'Events This Wk', val: '4' },
              { icon: '⚠️', label: 'Pending Tasks',  val: '3' },
            ].map(({ icon, label, val }) => (
              <div key={label} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-lg mb-1">{icon}</div>
                <div className="text-white font-display text-xl font-bold leading-none">{val}</div>
                <div className="text-white/50 text-[9px] uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-amber-300 bg-amber-500/10 border border-amber-400/20 rounded-xl px-4 py-2">
            <span>⭐</span>
            <span className="font-semibold">Pune Operations: 92% Healthy</span>
            <span className="text-white/40 ml-1">· Kothrud attendance missing · 3 volunteer requests pending</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map(({ icon, label, val, trend, pos }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="font-display text-2xl font-bold text-[#0d2b45] leading-none">{val}</div>
            <div className="text-[11px] text-[#1a1f2e]/45 mt-1 mb-2">{label}</div>
            <TrendChip val={trend} positive={pos} />
          </div>
        ))}
      </div>

      {/* Bottom two-column */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Activity */}
        <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#0d2b45] text-[14px]">Recent Activity</h3>
            <button className="text-[11px] text-sky-500 hover:text-sky-600 font-medium">View all</button>
          </div>
          <div className="space-y-3">
            {ACTIVITY.map(({ time, icon, msg, color }) => (
              <div key={time} className="flex gap-3 items-start">
                <div className={`w-7 h-7 rounded-full ${color} flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5`}>{icon}</div>
                <div className="flex-1">
                  <div className="text-[12px] text-[#1a1f2e]/70 leading-relaxed">{msg}</div>
                  <div className="text-[10px] text-[#1a1f2e]/35 mt-0.5">{time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
          <h3 className="font-semibold text-[#0d2b45] text-[14px] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '➕', label: 'Add Center',        nav: 'centers' as Section },
              { icon: '📅', label: 'Add Event',         nav: 'events'  as Section },
              { icon: '🖼️', label: 'Upload Photos',     nav: 'gallery' as Section },
              { icon: '🧘', label: 'Record Attendance', nav: 'attendance' as Section },
              { icon: '📢', label: 'Announcement',      nav: 'announcements' as Section },
              { icon: '📊', label: 'View Reports',      nav: 'reports' as Section },
            ].map(({ icon, label, nav }) => (
              <button
                key={label}
                onClick={() => onNav(nav)}
                className="flex items-center gap-2.5 p-3.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-100 hover:border-sky-200 text-[#0d2b45] text-[13px] font-medium transition-all duration-200 hover:-translate-y-0.5 text-left group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Section: Centers ─────────────────────────────────────────────────────────

function CentersSection({ showToast }: { showToast: (m: string, t?: ToastT['type']) => void }) {
  const [centers, setCenters]       = useState(initCenters)
  const [search, setSearch]         = useState('')
  const [modal, setModal]           = useState<null | 'add' | { type: 'edit' | 'view'; center: Center }>(null)
  const [confirm, setConfirm]       = useState<null | { id: number; action: string; name: string }>(null)
  const [editForm, setEditForm]     = useState<Partial<Center>>({})

  const filtered = centers.filter(c => !c.archived && c.name.toLowerCase().includes(search.toLowerCase()))

  const handleAction = (action: string, c: Center) => {
    if (action === 'view')    { setModal({ type: 'view', center: c }) }
    if (action === 'edit')    { setEditForm(c); setModal({ type: 'edit', center: c }) }
    if (action === 'delete')  { setConfirm({ id: c.id, action: 'delete', name: c.name }) }
    if (action === 'archive') { setConfirm({ id: c.id, action: 'archive', name: c.name }) }
  }

  const handleConfirm = () => {
    if (!confirm) return
    if (confirm.action === 'delete') {
      setCenters(cs => cs.filter(c => c.id !== confirm.id))
      showToast(`${confirm.name} deleted`, 'error')
    } else if (confirm.action === 'archive') {
      setCenters(cs => cs.map(c => c.id === confirm.id ? { ...c, archived: true } : c))
      showToast(`${confirm.name} archived`, 'info')
    }
    setConfirm(null)
  }

  const saveEdit = () => {
    setCenters(cs => cs.map(c => c.id === editForm.id ? { ...c, ...editForm } as Center : c))
    setModal(null)
    showToast('Center updated successfully')
  }

  const addCenter = () => {
    const nc: Center = { id: Date.now(), name: (editForm.name ?? 'New Center'), area: (editForm.area ?? ''), coordinator: (editForm.coordinator ?? ''), status: 'Inactive', nextSession: '—', attendance: 0, archived: false }
    setCenters(cs => [nc, ...cs])
    setModal(null)
    setEditForm({})
    showToast('New center added successfully')
  }

  const inp = "w-full border border-sky-100 rounded-xl px-3 py-2 text-[13px] text-[#0d2b45] bg-sky-50/50 focus:outline-none focus:border-sky-300 focus:bg-white transition-all"

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="font-display text-2xl font-semibold text-[#0d2b45]">Centers</h2>
        <div className="flex gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search centers…" className={`${inp} w-48`} />
          <button onClick={() => { setEditForm({}); setModal('add') }} className="px-4 py-2 rounded-xl bg-[#0d2b45] hover:bg-[#1a3f5c] text-white text-[13px] font-semibold transition-colors whitespace-nowrap">
            ➕ Add Center
          </button>
          <button onClick={() => showToast('Exported centers list to CSV', 'info')} className="px-4 py-2 rounded-xl border border-sky-100 hover:border-sky-300 text-[13px] text-[#1a1f2e]/60 font-medium transition-colors">
            ⬇ Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-sky-50/80">
              <tr>{['Center Name','Area','Coordinator','Status','Next Session','Attendance','Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#1a1f2e]/40">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-t border-sky-50 hover:bg-sky-50/30 transition-colors group">
                  <td className="px-4 py-3 font-semibold text-[#0d2b45]">{c.name}</td>
                  <td className="px-4 py-3 text-[#1a1f2e]/60">{c.area}</td>
                  <td className="px-4 py-3 text-[#1a1f2e]/60">{c.coordinator}</td>
                  <td className="px-4 py-3"><Badge label={c.status} /></td>
                  <td className="px-4 py-3 text-[#1a1f2e]/60">{c.nextSession}</td>
                  <td className="px-4 py-3"><span className={`font-bold ${c.attendance > 30 ? 'text-emerald-600' : c.attendance > 0 ? 'text-amber-600' : 'text-red-400'}`}>{c.attendance}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleAction('view', c)} className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-600 text-[10px] font-semibold hover:bg-sky-100 transition-colors">View</button>
                      <button onClick={() => handleAction('edit', c)} className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-semibold hover:bg-amber-100 transition-colors">Edit</button>
                      <button onClick={() => handleAction('archive', c)} className="px-2.5 py-1 rounded-lg bg-gray-50 text-gray-500 text-[10px] font-semibold hover:bg-gray-100 transition-colors">Archive</button>
                      <button onClick={() => handleAction('delete', c)} className="px-2.5 py-1 rounded-lg bg-red-50 text-red-500 text-[10px] font-semibold hover:bg-red-100 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-sky-50 text-[11px] text-[#1a1f2e]/40 bg-sky-50/30">
          Showing {filtered.length} active centers · {centers.filter(c => c.archived).length} archived
        </div>
      </div>

      {/* Add modal */}
      {modal === 'add' && (
        <Modal title="Add New Center" onClose={() => setModal(null)}>
          <div className="space-y-3">
            {[['Center Name *', 'name'], ['Area *', 'area'], ['Coordinator', 'coordinator'], ['Next Session', 'nextSession']].map(([label, key]) => (
              <div key={key}>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1a1f2e]/40 mb-1">{label}</label>
                <input className={inp} value={(editForm as Record<string, string>)[key] ?? ''} onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-sky-100 text-[13px] text-[#1a1f2e]/60 hover:border-sky-300 transition-colors">Cancel</button>
              <button onClick={addCenter} className="flex-1 py-2.5 rounded-xl bg-[#0d2b45] hover:bg-[#1a3f5c] text-white text-[13px] font-semibold transition-colors">Add Center</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit modal */}
      {modal !== null && typeof modal === 'object' && modal.type === 'edit' && (
        <Modal title={`Edit – ${modal.center.name}`} onClose={() => setModal(null)}>
          <div className="space-y-3">
            {[['Center Name', 'name'], ['Area', 'area'], ['Coordinator', 'coordinator'], ['Next Session', 'nextSession']].map(([label, key]) => (
              <div key={key}>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1a1f2e]/40 mb-1">{label}</label>
                <input className={inp} value={(editForm as Record<string, string>)[key] ?? ''} onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1a1f2e]/40 mb-1">Status</label>
              <select className={inp} value={editForm.status ?? 'Inactive'} onChange={e => setEditForm(f => ({ ...f, status: e.target.value as StatusType }))}>
                {['Active', 'Session Soon', 'Inactive'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-sky-100 text-[13px] text-[#1a1f2e]/60 hover:border-sky-300 transition-colors">Cancel</button>
              <button onClick={saveEdit} className="flex-1 py-2.5 rounded-xl bg-[#0d2b45] hover:bg-[#1a3f5c] text-white text-[13px] font-semibold transition-colors">Save Changes</button>
            </div>
          </div>
        </Modal>
      )}

      {/* View modal */}
      {modal !== null && typeof modal === 'object' && modal.type === 'view' && (
        <Modal title={modal.center.name} onClose={() => setModal(null)}>
          <div className="space-y-3 text-[13px]">
            {[['Area', modal.center.area], ['Coordinator', modal.center.coordinator], ['Status', modal.center.status], ['Next Session', modal.center.nextSession], ["Today's Attendance", modal.center.attendance.toString()]].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-sky-50">
                <span className="text-[#1a1f2e]/45 font-medium">{k}</span>
                <span className="text-[#0d2b45] font-semibold">{k === 'Status' ? <Badge label={v} /> : v}</span>
              </div>
            ))}
            <div className="flex gap-2 pt-3">
              <button onClick={() => { setEditForm(modal.center); setModal({ type: 'edit', center: modal.center }) }} className="flex-1 py-2.5 rounded-xl bg-[#0d2b45] text-white text-[13px] font-semibold hover:bg-[#1a3f5c] transition-colors">Edit Center</button>
              <Link to="/find-center" className="flex-1 py-2.5 rounded-xl border border-sky-100 text-sky-600 text-[13px] font-semibold text-center hover:bg-sky-50 transition-colors">View on Site</Link>
            </div>
          </div>
        </Modal>
      )}

      {confirm && <ConfirmDialog message={`Are you sure you want to ${confirm.action} "${confirm.name}"? This action cannot be undone.`} onConfirm={handleConfirm} onCancel={() => setConfirm(null)} />}
    </div>
  )
}

// ─── Section: Attendance ──────────────────────────────────────────────────────

function AttendanceSection({ showToast }: { showToast: (m: string, t?: ToastT['type']) => void }) {
  const [rows, setRows] = useState(ATTENDANCE_ROWS.map((r, i) => ({ ...r, id: i })))
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editVals, setEditVals]   = useState<Record<string, number>>({})

  const startEdit = (id: number, row: typeof rows[0]) => {
    setEditingId(id)
    setEditVals({ total: row.total, newSeekers: row.newSeekers, children: row.children, volunteers: row.volunteers })
  }
  const saveEdit = (id: number) => {
    setRows(rs => rs.map(r => r.id === id ? { ...r, ...editVals, status: 'Submitted' } : r))
    setEditingId(null)
    showToast('Attendance updated successfully')
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="font-display text-2xl font-semibold text-[#0d2b45]">Attendance — Today</h2>
        <div className="flex gap-2">
          <button onClick={() => showToast('Bulk update applied to all pending centers', 'info')} className="px-4 py-2 rounded-xl border border-sky-100 hover:bg-sky-50 text-[13px] font-medium text-[#1a1f2e]/60 transition-colors">Bulk Update</button>
          <button onClick={() => showToast('Attendance report exported to CSV', 'info')} className="px-4 py-2 rounded-xl bg-[#0d2b45] hover:bg-[#1a3f5c] text-white text-[13px] font-semibold transition-colors">⬇ Export</button>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead className="bg-sky-50/80">
              <tr>{['Center','Time','Total','New Seekers','Children','Volunteers','Photos','Status','Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#1a1f2e]/40">{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const isEditing = editingId === r.id
                return (
                  <tr key={r.id} className={`border-t border-sky-50 hover:bg-sky-50/30 transition-colors ${r.status === 'Missing' ? 'bg-red-50/30' : ''}`}>
                    <td className="px-4 py-3 font-semibold text-[#0d2b45]">{r.center}</td>
                    <td className="px-4 py-3 text-[#1a1f2e]/55">{r.time}</td>
                    {(['total','newSeekers','children','volunteers'] as const).map(field => (
                      <td key={field} className="px-4 py-3">
                        {isEditing
                          ? <input type="number" className="w-16 border border-sky-200 rounded-lg px-2 py-1 text-[12px] text-center focus:outline-none focus:border-sky-400" value={editVals[field] ?? 0} onChange={e => setEditVals(v => ({ ...v, [field]: +e.target.value }))} />
                          : <span className={`font-semibold ${field === 'total' && r.total > 30 ? 'text-emerald-600' : 'text-[#1a1f2e]/70'}`}>{(r as Record<string, string|number>)[field]}</span>
                        }
                      </td>
                    ))}
                    <td className="px-4 py-3 text-[#1a1f2e]/55">{r.photos}</td>
                    <td className="px-4 py-3"><Badge label={r.status} /></td>
                    <td className="px-4 py-3">
                      {isEditing
                        ? <div className="flex gap-1"><button onClick={() => saveEdit(r.id)} className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-semibold hover:bg-emerald-400 transition-colors">Save</button><button onClick={() => setEditingId(null)} className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-semibold hover:bg-gray-200 transition-colors">Cancel</button></div>
                        : <button onClick={() => startEdit(r.id, r)} className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-semibold hover:bg-amber-100 transition-colors">Edit</button>
                      }
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Section: Events ──────────────────────────────────────────────────────────

function EventsSection({ showToast }: { showToast: (m: string, t?: ToastT['type']) => void }) {
  const [events, setEvents] = useState(initEvents)

  const togglePublish = (id: number) => {
    setEvents(es => es.map(e => e.id === id ? { ...e, status: e.status === 'Published' ? 'Draft' : 'Published' } : e))
    const ev = events.find(e => e.id === id)
    showToast(ev?.status === 'Published' ? 'Event unpublished' : 'Event published!', ev?.status === 'Published' ? 'info' : 'success')
  }
  const duplicate = (id: number) => {
    const src = events.find(e => e.id === id)!
    setEvents(es => [...es, { ...src, id: Date.now(), title: `${src.title} (Copy)`, status: 'Draft' }])
    showToast('Event duplicated as Draft')
  }
  const archive = (id: number) => {
    setEvents(es => es.map(e => e.id === id ? { ...e, status: 'Archived' } : e))
    showToast('Event archived', 'info')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl font-semibold text-[#0d2b45]">Programs & Events</h2>
        <button onClick={() => showToast('New event form opened', 'info')} className="px-4 py-2 rounded-xl bg-[#0d2b45] hover:bg-[#1a3f5c] text-white text-[13px] font-semibold transition-colors">➕ Add Event</button>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {events.filter(e => e.status !== 'Archived').map(ev => (
          <div key={ev.id} className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-36 overflow-hidden">
              <img src={ev.img} alt={ev.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d2b45]/60 to-transparent" />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge label={ev.status} />
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">{ev.category}</span>
              </div>
              <div className="absolute bottom-3 left-3 text-white font-semibold text-[14px]">{ev.title}</div>
            </div>
            <div className="p-4">
              <div className="flex gap-4 text-[12px] text-[#1a1f2e]/50 mb-3">
                <span>📅 {ev.date}</span>
                <span>📍 {ev.venue}</span>
                <span>🤝 {ev.volunteers} volunteers</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => togglePublish(ev.id)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${ev.status === 'Published' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-500 text-white hover:bg-emerald-400'}`}>
                  {ev.status === 'Published' ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => showToast('Event edit form opened', 'info')} className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 text-[11px] font-semibold hover:bg-sky-100 transition-colors">Edit</button>
                <button onClick={() => duplicate(ev.id)} className="px-3 py-1.5 rounded-lg bg-violet-50 text-violet-600 text-[11px] font-semibold hover:bg-violet-100 transition-colors">Duplicate</button>
                <button onClick={() => archive(ev.id)} className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 text-[11px] font-semibold hover:bg-gray-100 transition-colors">Archive</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Section: Volunteers ──────────────────────────────────────────────────────

function VolunteersSection({ showToast }: { showToast: (m: string, t?: ToastT['type']) => void }) {
  const [vols, setVols]       = useState(initVolunteers)
  const [filterSkill, setFS]  = useState('All')
  const [filterArea, setFA]   = useState('All')
  const [filterAvail, setFAv] = useState('All')
  const [assignId, setAssignId] = useState<number | null>(null)
  const [role, setRole]         = useState('')

  const skills = ['All', ...Array.from(new Set(initVolunteers.flatMap(v => v.skills)))]
  const areas  = ['All', ...Array.from(new Set(initVolunteers.map(v => v.area)))]
  const avails = ['All', 'Morning', 'Evening', 'Full Day', 'Multiple']

  const filtered = vols.filter(v =>
    (filterSkill === 'All' || v.skills.includes(filterSkill)) &&
    (filterArea  === 'All' || v.area === filterArea) &&
    (filterAvail === 'All' || v.availability.includes(filterAvail))
  )

  const assignRole = () => {
    if (!role.trim()) return
    setVols(vs => vs.map(v => v.id === assignId ? { ...v, status: 'Assigned' as const } : v))
    showToast(`Role "${role}" assigned successfully`)
    setAssignId(null); setRole('')
  }

  const selCls = "border border-sky-100 rounded-xl px-3 py-2 text-[12px] text-[#0d2b45] bg-sky-50/50 focus:outline-none focus:border-sky-300 transition-all cursor-pointer"

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="font-display text-2xl font-semibold text-[#0d2b45]">Volunteers</h2>
        <button onClick={() => showToast('Volunteer list exported to CSV', 'info')} className="px-4 py-2 rounded-xl bg-[#0d2b45] hover:bg-[#1a3f5c] text-white text-[13px] font-semibold transition-colors">⬇ Export</button>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[['Skill', skills, filterSkill, setFS], ['Area', areas, filterArea, setFA], ['Availability', avails, filterAvail, setFAv]].map(([label, opts, val, set]) => (
          <div key={label as string} className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#1a1f2e]/45">{label as string}:</span>
            <select className={selCls} value={val as string} onChange={e => (set as (v: string) => void)(e.target.value)}>
              {(opts as string[]).map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead className="bg-sky-50/80">
              <tr>{['Volunteer','Skills','Area','Event','Availability','Status','Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#1a1f2e]/40">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id} className="border-t border-sky-50 hover:bg-sky-50/30 transition-colors group">
                  <td className="px-4 py-3 font-semibold text-[#0d2b45]">{v.name}</td>
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{v.skills.map(s => <span key={s} className="px-2 py-0.5 rounded-full bg-sky-50 border border-sky-100 text-sky-600 text-[9px] font-medium">{s}</span>)}</div></td>
                  <td className="px-4 py-3 text-[#1a1f2e]/60">{v.area}</td>
                  <td className="px-4 py-3 text-[#1a1f2e]/60">{v.event}</td>
                  <td className="px-4 py-3 text-[#1a1f2e]/60">{v.availability}</td>
                  <td className="px-4 py-3"><Badge label={v.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setAssignId(v.id); setRole('') }} className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-semibold hover:bg-amber-100 transition-colors">Assign Role</button>
                      <button onClick={() => { setVols(vs => vs.map(x => x.id === v.id ? { ...x, status: 'Confirmed' as const } : x)); showToast(`${v.name} confirmed`) }} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-semibold hover:bg-emerald-100 transition-colors">Confirm</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {assignId !== null && (
        <Modal title={`Assign Role — ${vols.find(v => v.id === assignId)?.name}`} onClose={() => setAssignId(null)}>
          <div className="space-y-3">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1a1f2e]/40 mb-1">Role / Responsibility</label>
            <input className="w-full border border-sky-100 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:border-sky-300 bg-sky-50/50 transition-all" placeholder="e.g. Stage Coordinator" value={role} onChange={e => setRole(e.target.value)} />
            <div className="flex flex-wrap gap-1.5">
              {['Registration Desk', 'Hospitality', 'Photography', 'Stage Management', 'Translation'].map(r => (
                <button key={r} onClick={() => setRole(r)} className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-colors ${role === r ? 'bg-amber-500 border-amber-500 text-white' : 'bg-sky-50 border-sky-100 text-sky-600 hover:border-sky-300'}`}>{r}</button>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setAssignId(null)} className="flex-1 py-2.5 rounded-xl border border-sky-100 text-[13px] text-[#1a1f2e]/60 hover:border-sky-300 transition-colors">Cancel</button>
              <button onClick={assignRole} className="flex-1 py-2.5 rounded-xl bg-[#0d2b45] hover:bg-[#1a3f5c] text-white text-[13px] font-semibold transition-colors">Assign</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Section: Coordinators ────────────────────────────────────────────────────

function CoordinatorsSection({ showToast }: { showToast: (m: string, t?: ToastT['type']) => void }) {
  const [coords, setCoords] = useState(initCoordinators)
  const toggle = (id: number) => {
    setCoords(cs => cs.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c))
    const c = coords.find(x => x.id === id)
    showToast(c?.status === 'Active' ? `${c?.name} deactivated` : `${c?.name} reactivated`, c?.status === 'Active' ? 'info' : 'success')
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl font-semibold text-[#0d2b45]">Coordinators</h2>
        <button onClick={() => showToast('Add coordinator form opened', 'info')} className="px-4 py-2 rounded-xl bg-[#0d2b45] hover:bg-[#1a3f5c] text-white text-[13px] font-semibold transition-colors">➕ Add Coordinator</button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coords.map(c => (
          <div key={c.id} className={`bg-white rounded-2xl border border-sky-100 shadow-sm p-5 hover:shadow-md transition-shadow ${c.status === 'Inactive' ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-bold text-[14px] flex-shrink-0 shadow-md`}>{c.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[#0d2b45] text-[14px]">{c.name}</div>
                <div className="text-[11px] text-[#1a1f2e]/45 mt-0.5">📍 {c.centers}</div>
                <div className="text-[11px] text-[#1a1f2e]/45">📞 {c.phone}</div>
              </div>
              <Badge label={c.status} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => showToast('Coordinator edit form opened', 'info')} className="flex-1 py-2 rounded-xl bg-sky-50 text-sky-600 text-[12px] font-semibold hover:bg-sky-100 transition-colors">Edit</button>
              <button onClick={() => toggle(c.id)} className={`flex-1 py-2 rounded-xl text-[12px] font-semibold transition-colors ${c.status === 'Active' ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                {c.status === 'Active' ? 'Deactivate' : 'Reactivate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Section: Gallery ─────────────────────────────────────────────────────────

function GallerySection({ showToast }: { showToast: (m: string, t?: ToastT['type']) => void }) {
  const [items, setItems]     = useState(GALLERY_IMGS)
  const [filter, setFilter]   = useState('All')
  const [dragging, setDragging] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  const tags = ['All', ...Array.from(new Set(GALLERY_IMGS.map(g => g.tag)))]
  const filtered = filter === 'All' ? items : items.filter(g => g.tag === filter)
  const selected = items.filter(g => g.selected)

  const toggle = (id: number) => setItems(is => is.map(g => g.id === id ? { ...g, selected: !g.selected } : g))
  const setFeatured = (id: number) => { setItems(is => is.map(g => ({ ...g, featured: g.id === id }))); showToast('Featured photo updated') }
  const bulkDelete = () => { setItems(is => is.filter(g => !g.selected)); showToast(`${selected.length} photos deleted`, 'error') }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="font-display text-2xl font-semibold text-[#0d2b45]">Gallery Manager</h2>
        <div className="flex gap-2">
          {selected.length > 0 && <button onClick={bulkDelete} className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white text-[13px] font-semibold transition-colors">🗑 Delete {selected.length}</button>}
          <button onClick={() => showToast('Opening upload dialog…', 'info')} className="px-4 py-2 rounded-xl bg-[#0d2b45] hover:bg-[#1a3f5c] text-white text-[13px] font-semibold transition-colors">📤 Upload Photos</button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {tags.map(t => (
          <button key={t} onClick={() => setFilter(t)} className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all ${filter === t ? 'bg-[#0d2b45] text-white' : 'bg-white border border-sky-100 text-[#1a1f2e]/55 hover:border-sky-300'}`}>{t}</button>
        ))}
      </div>

      {/* Drag & Drop zone */}
      <div
        ref={dropRef}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); showToast('Photos uploaded successfully') }}
        className={`border-2 border-dashed rounded-2xl p-6 text-center mb-5 transition-all duration-200 cursor-pointer ${dragging ? 'border-amber-400 bg-amber-50' : 'border-sky-200 hover:border-sky-300 bg-sky-50/50'}`}
        onClick={() => showToast('File picker opened', 'info')}
      >
        <div className="text-2xl mb-2">{dragging ? '📂' : '📤'}</div>
        <div className="text-[13px] font-semibold text-[#0d2b45]">Drag & drop photos here</div>
        <div className="text-[11px] text-[#1a1f2e]/40 mt-1">or click to select multiple images · JPG, PNG, WebP</div>
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {filtered.map(g => (
          <div key={g.id} className={`relative rounded-xl overflow-hidden group cursor-pointer border-2 transition-all duration-200 ${g.selected ? 'border-amber-400 shadow-lg shadow-amber-200/50' : 'border-transparent hover:border-sky-300'}`}>
            <img src={g.src} alt={g.caption} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-[#0d2b45]/0 group-hover:bg-[#0d2b45]/40 transition-colors duration-200 flex flex-col items-start justify-between p-2">
              <div className="flex items-center justify-between w-full">
                <button onClick={() => toggle(g.id)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${g.selected ? 'bg-amber-400 border-amber-400' : 'bg-white/80 border-white/60'}`}>
                  {g.selected && <span className="text-white text-[9px] font-bold">✓</span>}
                </button>
                {g.featured && <span className="text-[9px] bg-amber-400 text-white px-1.5 py-0.5 rounded-full font-bold">★ Featured</span>}
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity w-full flex gap-1.5">
                <button onClick={() => setFeatured(g.id)} className="flex-1 py-1 rounded-lg bg-white/90 text-[#0d2b45] text-[10px] font-semibold hover:bg-white transition-colors">★ Feature</button>
                <button onClick={() => { setItems(is => is.filter(x => x.id !== g.id)); showToast('Photo deleted', 'error') }} className="flex-1 py-1 rounded-lg bg-red-500/90 text-white text-[10px] font-semibold hover:bg-red-500 transition-colors">Delete</button>
              </div>
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-white text-[10px] font-medium">{g.caption}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Section: Announcements ───────────────────────────────────────────────────

function AnnouncementsSection({ showToast }: { showToast: (m: string, t?: ToastT['type']) => void }) {
  const [items, setItems] = useState(initAnnouncements)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'General', priority: 'Medium' as 'High'|'Medium'|'Low', startDate: '', endDate: '', audience: 'All Seekers' })
  const [preview, setPreview] = useState<Announcement | null>(null)

  const togglePublish = (id: number) => {
    setItems(is => is.map(i => i.id === id ? { ...i, published: !i.published } : i))
    const item = items.find(i => i.id === id)
    showToast(item?.published ? 'Announcement unpublished' : 'Announcement published!', item?.published ? 'info' : 'success')
  }
  const create = () => {
    if (!form.title) return
    setItems(is => [...is, { id: Date.now(), ...form, published: false }])
    setShowForm(false); setForm({ title: '', category: 'General', priority: 'Medium', startDate: '', endDate: '', audience: 'All Seekers' })
    showToast('Announcement created')
  }

  const inp = "w-full border border-sky-100 rounded-xl px-3 py-2 text-[13px] text-[#0d2b45] bg-sky-50/50 focus:outline-none focus:border-sky-300 transition-all"

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl font-semibold text-[#0d2b45]">Announcements</h2>
        <button onClick={() => setShowForm(s => !s)} className="px-4 py-2 rounded-xl bg-[#0d2b45] hover:bg-[#1a3f5c] text-white text-[13px] font-semibold transition-colors">➕ New Announcement</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-6 mb-5" style={{ animation: 'fade-in-up 0.25s ease both' }}>
          <h3 className="font-semibold text-[#0d2b45] text-[14px] mb-4">Create Announcement</h3>
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1a1f2e]/40 mb-1">Title *</label>
              <input className={inp} placeholder="Announcement title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            {[['Category','category',['General','Festival','Centers','Volunteer','Event']],['Priority','priority',['High','Medium','Low']],['Start Date','startDate',null],['End Date','endDate',null],['Target Audience','audience',['All Seekers','Seekers Only','Volunteers','Coordinators','All']]].map(([label, key, opts]) => (
              <div key={key as string}>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1a1f2e]/40 mb-1">{label as string}</label>
                {opts ? (
                  <select className={inp} value={(form as Record<string, string>)[key as string]} onChange={e => setForm(f => ({ ...f, [key as string]: e.target.value }))}>
                    {(opts as string[]).map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type="date" className={inp} value={(form as Record<string, string>)[key as string]} onChange={e => setForm(f => ({ ...f, [key as string]: e.target.value }))} />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-sky-100 text-[13px] font-medium text-[#1a1f2e]/60 hover:border-sky-300 transition-colors">Cancel</button>
            <button onClick={() => setPreview({ id: 0, ...form, published: false })} className="px-5 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-[13px] font-semibold hover:bg-amber-100 transition-colors">Preview</button>
            <button onClick={create} className="flex-1 py-2.5 rounded-xl bg-[#0d2b45] hover:bg-[#1a3f5c] text-white text-[13px] font-semibold transition-colors">Create</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-sky-100 shadow-sm p-4 flex flex-wrap items-center gap-3 hover:shadow-md transition-shadow">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge label={item.priority} />
                <span className="text-[10px] text-[#1a1f2e]/40">{item.category}</span>
                {item.published && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">Published</span>}
              </div>
              <div className="font-semibold text-[#0d2b45] text-[14px]">{item.title}</div>
              <div className="text-[11px] text-[#1a1f2e]/45 mt-0.5">{item.startDate} → {item.endDate} · {item.audience}</div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setPreview(item)} className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 text-[11px] font-semibold hover:bg-sky-100 transition-colors">Preview</button>
              <button onClick={() => togglePublish(item.id)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${item.published ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-500 text-white hover:bg-emerald-400'}`}>
                {item.published ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => { setItems(is => is.filter(i => i.id !== item.id)); showToast('Announcement deleted', 'error') }} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-[11px] font-semibold hover:bg-red-100 transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {preview && (
        <Modal title="Announcement Preview" onClose={() => setPreview(null)}>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 mb-4">
            <div className="flex items-center gap-2 mb-2"><Badge label={preview.priority} /><span className="text-[11px] text-[#1a1f2e]/45">{preview.category}</span></div>
            <h3 className="font-display text-[17px] font-semibold text-[#0d2b45] mb-2">{preview.title || 'Untitled Announcement'}</h3>
            <div className="text-[12px] text-[#1a1f2e]/55">📅 {preview.startDate || 'TBD'} → {preview.endDate || 'TBD'} · 👥 {preview.audience}</div>
          </div>
          <p className="text-[12px] text-[#1a1f2e]/55 text-center">This is how the announcement will appear to users.</p>
        </Modal>
      )}
    </div>
  )
}

// ─── Section: Analytics ───────────────────────────────────────────────────────

function AnalyticsSection({ showToast }: { showToast: (m: string, t?: ToastT['type']) => void }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-[#0d2b45]">Analytics</h2>
        <button onClick={() => showToast('Analytics report exported', 'info')} className="px-4 py-2 rounded-xl border border-sky-100 hover:bg-sky-50 text-[13px] font-medium text-[#1a1f2e]/60 transition-colors">⬇ Export Report</button>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
          <div className="font-semibold text-[#0d2b45] text-[14px] mb-1">Monthly Attendance</div>
          <div className="text-[11px] text-[#1a1f2e]/40 mb-4">Total seekers per month · Past 12 months</div>
          <BarChart data={MONTHLY_ATTENDANCE} labels={MONTHS} color="#4a90c4" />
        </div>
        <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
          <div className="font-semibold text-[#0d2b45] text-[14px] mb-1">New Seekers Trend</div>
          <div className="text-[11px] text-[#1a1f2e]/40 mb-4">First-time visitors · Past 12 months</div>
          <LineChart data={SEEKERS_TREND} color="#c4973a" />
        </div>
        <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
          <div className="font-semibold text-[#0d2b45] text-[14px] mb-3">Top Centers — Today</div>
          <div className="space-y-3">
            {CENTER_DATA.map(({ name, val }) => (
              <div key={name}>
                <div className="flex justify-between text-[12px] text-[#1a1f2e]/65 mb-1"><span>{name}</span><span className="font-bold text-[#0d2b45]">{val}</span></div>
                <div className="h-2 rounded-full bg-sky-100 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-700" style={{ width: `${(val / 50) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
          <div className="font-semibold text-[#0d2b45] text-[14px] mb-3">Volunteer Growth</div>
          <LineChart data={[15, 18, 22, 28, 35, 38, 42, 40, 45, 50, 48, 55]} color="#10b981" />
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[{ l: 'Total', v: '87' }, { l: 'Active', v: '43' }, { l: 'Events', v: '4' }].map(({ l, v }) => (
              <div key={l} className="text-center bg-sky-50 rounded-xl p-3">
                <div className="font-display text-xl font-bold text-[#0d2b45]">{v}</div>
                <div className="text-[10px] text-[#1a1f2e]/40 uppercase tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Section: Reports ─────────────────────────────────────────────────────────

function ReportsSection({ showToast }: { showToast: (m: string, t?: ToastT['type']) => void }) {
  const reports = [
    { icon: '🧘', title: 'Attendance Report',     desc: 'Daily, weekly, monthly attendance per center' },
    { icon: '🏠', title: 'Centers Report',        desc: 'Active, inactive, session status overview' },
    { icon: '📅', title: 'Events Report',         desc: 'All programs, attendance, volunteer count' },
    { icon: '🤝', title: 'Volunteers Report',     desc: 'Skills, assignments, event coverage' },
    { icon: '🌱', title: 'New Seekers Report',    desc: 'Monthly growth, center-wise breakdown' },
    { icon: '📢', title: 'Programs Summary',      desc: 'Public programs reach and impact' },
    { icon: '🖼️', title: 'Photo Archive',         desc: 'Gallery statistics and storage usage' },
  ]
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-[#0d2b45] mb-5">Reports</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {reports.map(({ icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-start gap-4">
              <span className="text-3xl">{icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-[#0d2b45] text-[14px] mb-1">{title}</div>
                <div className="text-[12px] text-[#1a1f2e]/50 mb-3">{desc}</div>
                <div className="flex gap-2">
                  {['PDF', 'Excel', 'CSV'].map(fmt => (
                    <button key={fmt} onClick={() => showToast(`${title} exported as ${fmt}`, 'info')} className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 text-[11px] font-semibold hover:bg-sky-100 border border-sky-100 transition-colors">
                      ⬇ {fmt}
                    </button>
                  ))}
                  <button onClick={() => showToast(`Generating ${title}…`, 'info')} className="flex-1 py-1.5 rounded-lg bg-[#0d2b45] hover:bg-[#1a3f5c] text-white text-[11px] font-semibold transition-colors">Generate</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Section: Settings ────────────────────────────────────────────────────────

function SettingsSection({ dark, setDark, showToast }: { dark: boolean; setDark: (v: boolean) => void; showToast: (m: string, t?: ToastT['type']) => void }) {
  const roles = [
    { role: 'Super Admin', perms: ['Full access', 'Manage users', 'Delete data', 'Export all'], color: 'bg-violet-100 text-violet-700' },
    { role: 'Regional Admin', perms: ['Manage centers', 'Events', 'Volunteers', 'Attendance'], color: 'bg-sky-100 text-sky-700' },
    { role: 'Data Manager', perms: ['Attendance', 'Gallery', 'Reports', 'View only centers'], color: 'bg-amber-100 text-amber-700' },
    { role: 'Read Only', perms: ['View all sections', 'No edit access', 'No delete access', 'No export'], color: 'bg-gray-100 text-gray-600' },
  ]
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-[#0d2b45]">Settings</h2>
      {/* Appearance */}
      <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
        <h3 className="font-semibold text-[#0d2b45] text-[14px] mb-4">Appearance</h3>
        <div className="flex items-center justify-between py-3 border-b border-sky-50">
          <div><div className="text-[13px] font-medium text-[#0d2b45]">Dark Mode</div><div className="text-[11px] text-[#1a1f2e]/45 mt-0.5">Deep blue-gray theme with gold accents</div></div>
          <button onClick={() => { setDark(!dark); showToast(dark ? 'Light mode enabled' : 'Dark mode enabled', 'info') }}
            className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${dark ? 'bg-amber-500' : 'bg-sky-200'}`}>
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${dark ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between py-3">
          <div><div className="text-[13px] font-medium text-[#0d2b45]">Compact Mode</div><div className="text-[11px] text-[#1a1f2e]/45 mt-0.5">Reduce spacing for denser information display</div></div>
          <button onClick={() => showToast('Compact mode toggled', 'info')} className="w-12 h-6 rounded-full bg-sky-200 relative transition-colors duration-300">
            <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow" />
          </button>
        </div>
      </div>
      {/* User Roles */}
      <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
        <h3 className="font-semibold text-[#0d2b45] text-[14px] mb-4">User Roles & Permissions</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {roles.map(({ role, perms, color }) => (
            <div key={role} className="rounded-xl border border-sky-100 p-4">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${color} mb-3 inline-block`}>{role}</span>
              <ul className="space-y-1">
                {perms.map(p => <li key={p} className="text-[12px] text-[#1a1f2e]/60 flex items-center gap-2"><span className="text-emerald-400 text-[10px]">✓</span>{p}</li>)}
              </ul>
              <button onClick={() => showToast(`Editing permissions for ${role}`, 'info')} className="mt-3 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 text-[11px] font-semibold hover:bg-sky-100 transition-colors w-full">Edit Permissions</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────

const NAV_ITEMS: { id: Section; icon: string; label: string }[] = [
  { id: 'dashboard',     icon: '🏠', label: 'Dashboard'       },
  { id: 'centers',       icon: '📍', label: 'Centers'         },
  { id: 'coordinators',  icon: '👥', label: 'Coordinators'    },
  { id: 'attendance',    icon: '🧘', label: 'Attendance'      },
  { id: 'events',        icon: '📅', label: 'Programs & Events'},
  { id: 'volunteers',    icon: '🤝', label: 'Volunteers'      },
  { id: 'announcements', icon: '📢', label: 'Announcements'   },
  { id: 'gallery',       icon: '🖼️', label: 'Gallery'         },
  { id: 'reports',       icon: '📊', label: 'Reports'         },
  { id: 'analytics',     icon: '📈', label: 'Analytics'       },
  { id: 'settings',      icon: '⚙️', label: 'Settings'        },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [section, setSection]       = useState<Section>('dashboard')
  const [dark, setDark]             = useState(false)
  const [sidebarOpen, setSidebar]   = useState(true)
  const [notifOpen, setNotifOpen]   = useState(false)
  const [quickOpen, setQuickOpen]   = useState(false)
  const [search, setSearch]         = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [toast, setToast]           = useState<ToastT | null>(null)
  const [notifs, setNotifs]         = useState(initNotifs)

  const showToast = useCallback((msg: string, type: ToastT['type'] = 'success') => {
    setToast({ msg, type })
  }, [])

  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, read: true })))
  const unread = notifs.filter(n => !n.read).length

  const D = dark ? {
    root: 'bg-[#0f1923] text-white',
    sidebar: 'bg-[#0a1520] border-white/5',
    topbar: 'bg-[#0a1520] border-white/5',
    main: 'bg-[#0f1923]',
    card: 'bg-[#1a2535] border-white/8',
    text: 'text-white',
    textMuted: 'text-white/50',
    input: 'bg-[#0f1923] border-white/10 text-white placeholder-white/20',
    hover: 'hover:bg-white/5',
    navActive: 'bg-amber-500/20 text-amber-400',
    navInactive: 'text-white/50 hover:bg-white/8 hover:text-white',
  } : {
    root: 'bg-[#f7f9fc] text-[#0d2b45]',
    sidebar: 'bg-[#0d2b45] border-white/5',
    topbar: 'bg-white border-sky-100',
    main: 'bg-[#f7f9fc]',
    card: 'bg-white border-sky-100',
    text: 'text-[#0d2b45]',
    textMuted: 'text-[#1a1f2e]/50',
    input: 'bg-sky-50 border-sky-100 text-[#0d2b45] placeholder-[#1a1f2e]/30',
    hover: 'hover:bg-sky-50',
    navActive: 'bg-amber-500/20 text-amber-400',
    navInactive: 'text-white/50 hover:bg-white/10 hover:text-white',
  }

  const notifTypeIcon: Record<string, string> = { volunteer: '🤝', attendance: '🧘', event: '📅', gallery: '🖼️', system: '⚙️' }

  // Close overlays on section change
  useEffect(() => { setNotifOpen(false); setQuickOpen(false); setSearchOpen(false) }, [section])

  return (
    <div className={`flex h-screen overflow-hidden ${D.root} transition-colors duration-300`} style={{ fontFamily: 'var(--font-body, system-ui)' }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className={`${D.sidebar} border-r flex-col transition-all duration-300 ${sidebarOpen ? 'w-56' : 'w-16'} hidden md:flex flex-shrink-0 overflow-hidden`}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">SC</div>
          {sidebarOpen && <div className="leading-none overflow-hidden"><div className="text-white text-[13px] font-semibold truncate">Sahaja Connect</div><div className="text-amber-400 text-[9px] tracking-widest uppercase">Admin</div></div>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              title={!sidebarOpen ? label : undefined}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150 rounded-xl mx-0 ${section === id ? D.navActive : D.navInactive} ${sidebarOpen ? 'pr-4' : 'justify-center'}`}
            >
              <span className="text-[18px] flex-shrink-0">{icon}</span>
              {sidebarOpen && <span className="text-[13px] font-medium truncate">{label}</span>}
              {sidebarOpen && section === id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />}
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-white/5 p-3">
          <Link to="/" className={`flex items-center gap-2 text-[12px] text-white/40 hover:text-white transition-colors py-2 px-2 rounded-lg hover:bg-white/5 ${sidebarOpen ? '' : 'justify-center'}`}>
            <span>🌐</span>
            {sidebarOpen && <span>View Website</span>}
          </Link>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className={`${D.topbar} border-b flex items-center gap-3 px-4 py-3 flex-shrink-0 z-20`}>
          <button onClick={() => setSidebar(s => !s)} className={`p-2 rounded-lg ${D.hover} transition-colors ${D.textMuted} hover:${D.text}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[13px]">
            <span className={D.textMuted}>Admin</span>
            <span className={D.textMuted}>/</span>
            <span className={`${D.text} font-semibold capitalize`}>{NAV_ITEMS.find(n => n.id === section)?.label}</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xs ml-4 relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
              placeholder="Search centers, events, volunteers…"
              className={`w-full ${D.input} border rounded-xl px-3 py-2 text-[12px] focus:outline-none focus:border-sky-300 transition-all pr-8`}
            />
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[12px] ${D.textMuted}`}>⌘K</span>
            {searchOpen && search && (
              <div className={`absolute top-full left-0 right-0 mt-1 ${dark ? 'bg-[#1a2535]' : 'bg-white'} rounded-xl border ${D.card} shadow-xl z-50 overflow-hidden`}>
                {['Centers', 'Events', 'Volunteers', 'Coordinators'].map(cat => (
                  <button key={cat} onClick={() => { setSection(cat.toLowerCase() as Section); setSearch('') }}
                    className={`w-full text-left px-4 py-2.5 text-[12px] ${D.hover} transition-colors flex items-center gap-2`}>
                    <span className="text-[#1a1f2e]/40">→</span>
                    <span className={D.textMuted}>{cat} matching</span>
                    <span className={`${D.text} font-semibold`}>&ldquo;{search}&rdquo;</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => { setNotifOpen(o => !o); setQuickOpen(false) }}
                className={`relative p-2 rounded-lg ${D.hover} transition-colors`}>
                <span className="text-[18px]">🔔</span>
                {unread > 0 && <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">{unread}</span>}
              </button>
              {notifOpen && (
                <div className={`absolute right-0 top-full mt-2 w-80 ${dark ? 'bg-[#1a2535]' : 'bg-white'} rounded-2xl border ${dark ? 'border-white/10' : 'border-sky-100'} shadow-2xl z-50 overflow-hidden`}
                  style={{ animation: 'fade-in-up 0.2s ease both' }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-sky-50">
                    <span className={`font-semibold text-[13px] ${D.text}`}>Notifications</span>
                    <button onClick={markAllRead} className="text-[11px] text-sky-500 hover:text-sky-600 font-medium">Mark all read</button>
                  </div>
                  <div className="overflow-y-auto max-h-72">
                    {notifs.map(n => (
                      <div key={n.id} onClick={() => setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))}
                        className={`flex gap-3 px-4 py-3 border-b border-sky-50/50 last:border-0 cursor-pointer transition-colors ${D.hover} ${!n.read ? (dark ? 'bg-white/5' : 'bg-sky-50/60') : ''}`}>
                        <span className="text-lg flex-shrink-0">{notifTypeIcon[n.type]}</span>
                        <div className="flex-1 min-w-0">
                          <div className={`text-[12px] leading-relaxed ${D.text}`}>{n.msg}</div>
                          <div className={`text-[10px] ${D.textMuted} mt-0.5`}>{n.time}</div>
                        </div>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-sky-400 flex-shrink-0 mt-1.5" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark mode toggle */}
            <button onClick={() => { setDark(d => !d); showToast(dark ? 'Light mode' : 'Dark mode', 'info') }}
              className={`p-2 rounded-lg ${D.hover} transition-colors text-[18px]`} title="Toggle dark mode">
              {dark ? '☀️' : '🌙'}
            </button>

            {/* User avatar */}
            <button
              onClick={() => {
                logout()
                navigate('/login', { replace: true })
              }}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-[11px] font-bold cursor-pointer hover:ring-4 hover:ring-sky-100 transition"
              title={`Sign out ${user?.name ?? 'Admin'}`}
            >
              {(user?.name ?? 'AD').slice(0, 2).toUpperCase()}
            </button>
          </div>
        </header>

        {/* Main scroll area */}
        <main className={`flex-1 overflow-y-auto p-5 md:p-6 ${D.main} transition-colors duration-300`}>
          <div style={{ animation: 'fade-in-up 0.25s cubic-bezier(0.4,0,0.2,1) both' }} key={section}>
            {section === 'dashboard'     && <DashboardHome onNav={setSection} showToast={showToast} />}
            {section === 'centers'       && <CentersSection showToast={showToast} />}
            {section === 'attendance'    && <AttendanceSection showToast={showToast} />}
            {section === 'events'        && <EventsSection showToast={showToast} />}
            {section === 'volunteers'    && <VolunteersSection showToast={showToast} />}
            {section === 'coordinators'  && <CoordinatorsSection showToast={showToast} />}
            {section === 'gallery'       && <GallerySection showToast={showToast} />}
            {section === 'announcements' && <AnnouncementsSection showToast={showToast} />}
            {section === 'analytics'     && <AnalyticsSection showToast={showToast} />}
            {section === 'reports'       && <ReportsSection showToast={showToast} />}
            {section === 'settings'      && <SettingsSection dark={dark} setDark={setDark} showToast={showToast} />}
          </div>
        </main>
      </div>

      {/* ── Floating Quick Actions ───────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {quickOpen && (
          <div className="flex flex-col items-end gap-2" style={{ animation: 'fade-in-up 0.2s ease both' }}>
            {[
              { icon: '🏠', label: 'Add Center',        nav: 'centers'       as Section },
              { icon: '📅', label: 'Add Event',         nav: 'events'        as Section },
              { icon: '🖼️', label: 'Upload Photos',     nav: 'gallery'       as Section },
              { icon: '🧘', label: 'Record Attendance', nav: 'attendance'    as Section },
              { icon: '📢', label: 'Announcement',      nav: 'announcements' as Section },
            ].map(({ icon, label, nav }) => (
              <button key={label} onClick={() => { setSection(nav); setQuickOpen(false) }}
                className="flex items-center gap-2.5 bg-white shadow-xl border border-sky-100 rounded-full pl-4 pr-5 py-2.5 text-[13px] font-semibold text-[#0d2b45] hover:bg-sky-50 hover:-translate-y-0.5 transition-all duration-200">
                <span className="text-base">{icon}</span> {label}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setQuickOpen(o => !o)}
          className={`w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-white shadow-xl hover:shadow-amber-300/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center text-2xl ${quickOpen ? 'rotate-45' : ''}`}
          style={{ transition: 'transform 0.25s ease, background 0.2s ease, box-shadow 0.2s ease' }}
        >
          +
        </button>
      </div>

      {/* Toast */}
      {toast && <Toast toast={toast} onDone={() => setToast(null)} />}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebar(false)} />
      )}
    </div>
  )
}
