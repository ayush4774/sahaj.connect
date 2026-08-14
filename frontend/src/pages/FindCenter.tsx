import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import LotusDecor from '../components/LotusDecor'

/* ── Types ── */
type MarkerType = 'regular' | 'program' | 'festival' | 'today' | 'workshop'

interface Center {
  id: number
  name: string
  area: string
  address: string
  pincode: string
  distance: string
  timing: string
  weekendTiming: string
  todayTime?: string
  isToday: boolean
  coordinator: string
  phone: string
  whatsapp: string
  languages: string[]
  markerType: MarkerType
  img: string
  mx: number
  my: number
}

/* ── Data ── */
const MARKER_STYLES: Record<MarkerType, { bg: string; ring: string; label: string }> = {
  regular:  { bg: 'bg-emerald-500',  ring: 'ring-emerald-300',  label: 'Regular Center'    },
  program:  { bg: 'bg-orange-500',   ring: 'ring-orange-300',   label: 'Public Program'    },
  festival: { bg: 'bg-amber-500',    ring: 'ring-amber-300',    label: 'Festival'          },
  today:    { bg: 'bg-blue-500',     ring: 'ring-blue-300',     label: "Today's Collective"},
  workshop: { bg: 'bg-purple-500',   ring: 'ring-purple-300',   label: 'Workshop'          },
}

const CENTERS: Center[] = [
  {
    id: 1, name: 'Koregaon Park Center', area: 'Koregaon Park', address: '12, Lane 4, Koregaon Park, Pune', pincode: '411001',
    distance: '2.1 km', timing: 'Tue & Thu — 7:00 PM', weekendTiming: 'Sun — 10:30 AM',
    todayTime: '7:00 PM', isToday: true, coordinator: 'Shri Ramesh Patil',
    phone: '+91 98765 43210', whatsapp: '919876543210',
    languages: ['Marathi', 'Hindi', 'English'], markerType: 'today',
    img: 'https://images.unsplash.com/photo-1686749143613-0eeacff36894?w=640&h=400&fit=crop&auto=format',
    mx: 55, my: 32,
  },
  {
    id: 2, name: 'Kothrud Meditation Center', area: 'Kothrud', address: '8, Paud Road, Kothrud, Pune', pincode: '411038',
    distance: '4.3 km', timing: 'Wed & Sun — 6:30 PM', weekendTiming: 'Sun — 6:30 PM',
    isToday: false, coordinator: 'Shrimati Asha Kulkarni',
    phone: '+91 98765 43211', whatsapp: '919876543211',
    languages: ['Marathi', 'English'], markerType: 'regular',
    img: 'https://images.unsplash.com/photo-1677741447985-da1d90c00742?w=640&h=400&fit=crop&auto=format',
    mx: 26, my: 56,
  },
  {
    id: 3, name: 'Aundh Community Hall', area: 'Aundh', address: '3, ITI Road, Aundh, Pune', pincode: '411007',
    distance: '6.8 km', timing: 'Mon & Fri — 7:30 PM', weekendTiming: 'Sat — 7:30 PM',
    isToday: false, coordinator: 'Shri Vinod Sharma',
    phone: '+91 98765 43212', whatsapp: '919876543212',
    languages: ['Hindi', 'English'], markerType: 'regular',
    img: 'https://images.unsplash.com/photo-1529693662653-9d480530a697?w=640&h=400&fit=crop&auto=format',
    mx: 36, my: 24,
  },
  {
    id: 4, name: 'Kalyani Nagar Center', area: 'Kalyani Nagar', address: '21, Aga Khan Palace Road, Kalyani Nagar', pincode: '411006',
    distance: '3.7 km', timing: 'Tue & Fri — 7:00 PM', weekendTiming: 'Sun — 11:00 AM',
    todayTime: '7:00 PM', isToday: true, coordinator: 'Shrimati Priya Deshpande',
    phone: '+91 98765 43213', whatsapp: '919876543213',
    languages: ['Marathi', 'Hindi', 'English'], markerType: 'today',
    img: 'https://images.unsplash.com/photo-1687783615494-b4a1f1af8b58?w=640&h=400&fit=crop&auto=format',
    mx: 63, my: 27,
  },
  {
    id: 5, name: 'Baner Meditation Circle', area: 'Baner', address: '15, Baner Road, Near Orchid Hotel, Baner', pincode: '411045',
    distance: '8.2 km', timing: 'Mon & Thu — 6:30 PM', weekendTiming: 'Sat — 7:00 PM',
    isToday: false, coordinator: 'Shri Amit Joshi',
    phone: '+91 98765 43214', whatsapp: '919876543214',
    languages: ['English', 'Hindi'], markerType: 'workshop',
    img: 'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=640&h=400&fit=crop&auto=format',
    mx: 21, my: 36,
  },
  {
    id: 6, name: 'Hadapsar Public Program', area: 'Hadapsar', address: 'Magarpatta City Community Hall, Hadapsar', pincode: '411028',
    distance: '9.5 km', timing: 'Wed & Sat — 6:00 PM', weekendTiming: 'Sat — 6:00 PM',
    isToday: false, coordinator: 'Shri Suresh Kulkarni',
    phone: '+91 98765 43215', whatsapp: '919876543215',
    languages: ['Marathi', 'Hindi'], markerType: 'program',
    img: 'https://images.unsplash.com/photo-1686749143613-0eeacff36894?w=640&h=400&fit=crop&auto=format',
    mx: 73, my: 62,
  },
  {
    id: 7, name: 'Viman Nagar Center', area: 'Viman Nagar', address: '7, Viman Nagar, Near Phoenix Mall, Pune', pincode: '411014',
    distance: '5.1 km', timing: 'Tue & Thu — 7:30 PM', weekendTiming: 'Sun — 10:00 AM',
    isToday: false, coordinator: 'Shrimati Sunita Patil',
    phone: '+91 98765 43216', whatsapp: '919876543216',
    languages: ['English', 'Marathi'], markerType: 'regular',
    img: 'https://images.unsplash.com/photo-1687783615476-f4c12358ca9d?w=640&h=400&fit=crop&auto=format',
    mx: 72, my: 25,
  },
  {
    id: 8, name: 'Kharadi Festival Center', area: 'Kharadi', address: 'EON IT Park Community Hall, Kharadi', pincode: '411014',
    distance: '11.2 km', timing: 'Mon, Wed & Fri — 7:00 PM', weekendTiming: 'Sat — 6:30 PM',
    isToday: false, coordinator: 'Shri Nikhil Mehta',
    phone: '+91 98765 43217', whatsapp: '919876543217',
    languages: ['English', 'Hindi', 'Marathi'], markerType: 'festival',
    img: 'https://images.unsplash.com/photo-1529693662653-9d480530a697?w=640&h=400&fit=crop&auto=format',
    mx: 82, my: 38,
  },
  {
    id: 9, name: 'Sinhagad Road Center', area: 'Sinhagad Road', address: '45, Anand Park, Sinhagad Road, Pune', pincode: '411041',
    distance: '7.4 km', timing: 'Tue & Fri — 6:30 PM', weekendTiming: 'Sun — 10:30 AM',
    isToday: false, coordinator: 'Shrimati Kavita Bhosle',
    phone: '+91 98765 43218', whatsapp: '919876543218',
    languages: ['Marathi'], markerType: 'regular',
    img: 'https://images.unsplash.com/photo-1687875495230-96dfea96d9da?w=640&h=400&fit=crop&auto=format',
    mx: 17, my: 67,
  },
  {
    id: 10, name: 'Pimpri Collective', area: 'Pimpri-Chinchwad', address: 'Pimpri Community Hall, Pimpri, Pune', pincode: '411017',
    distance: '14.3 km', timing: 'Wed & Sat — 7:00 PM', weekendTiming: 'Sat — 7:00 PM',
    isToday: false, coordinator: 'Shri Rajesh Wagh',
    phone: '+91 98765 43219', whatsapp: '919876543219',
    languages: ['Marathi', 'Hindi'], markerType: 'regular',
    img: 'https://images.unsplash.com/photo-1686749143613-0eeacff36894?w=640&h=400&fit=crop&auto=format',
    mx: 31, my: 14,
  },
]

const AREA_CHIPS = ['Kharadi', 'Viman Nagar', 'Kalyani Nagar', 'Koregaon Park', 'Hadapsar', 'Magarpatta', 'Wagholi', 'Baner', 'Aundh', 'Pimpri', 'Hinjawadi', 'Sinhagad Road']

const FILTER_CHIPS = [
  { key: 'today',   label: 'Today'            },
  { key: 'tomorrow',label: 'Tomorrow'          },
  { key: 'morning', label: 'Morning Meditation'},
  { key: 'evening', label: 'Evening Meditation'},
  { key: 'weekend', label: 'Weekend Centers'   },
  { key: 'program', label: 'Public Program'    },
  { key: 'en',      label: 'English'           },
  { key: 'mr',      label: 'Marathi'           },
  { key: 'hi',      label: 'Hindi'             },
]

const LEGEND = [
  { type: 'today'   as MarkerType, color: 'bg-blue-500'   },
  { type: 'regular' as MarkerType, color: 'bg-emerald-500'},
  { type: 'program' as MarkerType, color: 'bg-orange-500' },
  { type: 'festival'as MarkerType, color: 'bg-amber-500'  },
  { type: 'workshop'as MarkerType, color: 'bg-purple-500' },
]

/* ── Shared helpers ── */
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
    <div ref={ref} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}
    >{children}</div>
  )
}

function LotusSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 text-amber-400 opacity-60" style={{ animation: 'spin 3s linear infinite' }}>
          <LotusDecor />
        </div>
        <div className="absolute inset-2 text-sky-400 opacity-40" style={{ animation: 'spin 5s linear infinite reverse' }}>
          <LotusDecor />
        </div>
      </div>
    </div>
  )
}

/* ── Map component ── */
function CenterMap({
  centers,
  activeId,
  onSelect,
}: {
  centers: Center[]
  activeId: number | null
  onSelect: (c: Center | null) => void
}) {
  const activeCenter = centers.find(c => c.id === activeId) ?? null

  return (
    <div className="relative w-full h-[58vh] min-h-[400px] rounded-3xl overflow-hidden shadow-2xl shadow-sky-200/60 border border-sky-100 bg-[#d4eaf5]">

      {/* Map background — abstract stylized Pune map */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 580" preserveAspectRatio="xMidYMid slice">
        {/* Base bg */}
        <defs>
          <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c8e8f5" />
            <stop offset="100%" stopColor="#d8eff8" />
          </linearGradient>
          <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <rect width="1000" height="580" fill="url(#mapBg)" />

        {/* Subtle grid */}
        {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
          <g key={i} opacity="0.12">
            <line x1={i*100} y1="0" x2={i*100} y2="580" stroke="#64b5d9" strokeWidth="0.8" />
            <line x1="0" y1={i*58} x2="1000" y2={i*58} stroke="#64b5d9" strokeWidth="0.8" />
          </g>
        ))}

        {/* Green parks / open areas */}
        <ellipse cx="200" cy="200" rx="70" ry="45" fill="#a7d9b5" opacity="0.4" />
        <ellipse cx="700" cy="420" rx="90" ry="50" fill="#a7d9b5" opacity="0.35" />
        <ellipse cx="850" cy="150" rx="55" ry="35" fill="#a7d9b5" opacity="0.3" />
        <ellipse cx="130" cy="450" rx="50" ry="35" fill="#a7d9b5" opacity="0.35" />
        <ellipse cx="500" cy="300" rx="30" ry="20" fill="#a7d9b5" opacity="0.3" />

        {/* Mutha / Mula River — flowing across */}
        <path d="M0,360 Q150,320 280,350 Q420,380 550,340 Q700,300 850,330 Q950,345 1000,320"
          fill="url(#riverGrad)" stroke="#60a5fa" strokeWidth="0" opacity="0.7" />
        <path d="M0,355 Q150,315 280,345 Q420,375 550,335 Q700,295 850,325 Q950,340 1000,315
                 L1000,380 Q950,365 850,355 Q700,325 550,365 Q420,405 280,375 Q150,345 0,385 Z"
          fill="url(#riverGrad)" opacity="0.45" />

        {/* Road network — major roads */}
        {/* Ring road */}
        <ellipse cx="500" cy="300" rx="380" ry="230" fill="none" stroke="#b8d4e8" strokeWidth="3" opacity="0.5" />

        {/* Radial roads */}
        {[
          "M500,300 L180,80", "M500,300 L880,100", "M500,300 L950,480",
          "M500,300 L50,480", "M500,300 L500,20", "M500,300 L500,560",
        ].map((d, i) => <path key={i} d={d} stroke="#b8d4e8" strokeWidth="2.5" opacity="0.5" fill="none" />)}

        {/* Cross streets */}
        {[
          "M200,80 Q350,150 350,300", "M800,100 Q680,180 680,300",
          "M100,200 Q250,250 350,300", "M950,300 Q800,310 680,300",
          "M300,500 Q420,420 500,300", "M700,500 Q620,420 550,320",
        ].map((d, i) => <path key={i} d={d} stroke="#c8dce8" strokeWidth="1.5" opacity="0.45" fill="none" />)}

        {/* Area label backgrounds */}
        {[
          { x: 530, y: 320, label: 'Koregaon\nPark' },
          { x: 240, y: 560, label: 'Kothrud' },
          { x: 340, y: 235, label: 'Aundh' },
          { x: 620, y: 263, label: 'Kalyani\nNagar' },
          { x: 195, y: 350, label: 'Baner' },
          { x: 730, y: 628, label: 'Hadapsar' },
          { x: 720, y: 250, label: 'Viman\nNagar' },
          { x: 825, y: 385, label: 'Kharadi' },
          { x: 145, y: 675, label: 'Sinhagad' },
          { x: 295, y: 135, label: 'Pimpri' },
        ].map(({ x, y, label }, i) => (
          <text key={i} x={x} y={y} fill="#7ba8c0" fontSize="11" fontFamily="system-ui" opacity="0.65" textAnchor="middle">
            {label.split('\n').map((line, j) => <tspan key={j} x={x} dy={j === 0 ? '0' : '13'}>{line}</tspan>)}
          </text>
        ))}
      </svg>

      {/* Markers */}
      {centers.map(center => {
        const style = MARKER_STYLES[center.markerType]
        const isActive = activeId === center.id
        return (
          <button
            key={center.id}
            onClick={() => onSelect(isActive ? null : center)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none`}
            style={{ left: `${center.mx}%`, top: `${center.my}%` }}
          >
            {/* Pulse ring for today markers */}
            {center.isToday && (
              <span className={`absolute inset-0 rounded-full ${style.bg} opacity-30`} style={{ animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite' }} />
            )}
            <div className={`relative w-10 h-10 rounded-full ${style.bg} border-2 border-white shadow-lg flex items-center justify-center text-base transition-all duration-250 ${isActive ? 'scale-140 shadow-xl ring-4 ' + style.ring : 'hover:scale-120'}`}>
              {center.markerType === 'today'    && '💙'}
              {center.markerType === 'regular'  && '🪷'}
              {center.markerType === 'program'  && '🌼'}
              {center.markerType === 'festival' && '✨'}
              {center.markerType === 'workshop' && '🔮'}
            </div>
            {/* Tooltip on hover (not active) */}
            {!isActive && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                <div className="bg-white rounded-lg shadow-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#1a1f2e]">
                  {center.name}
                  {center.isToday && <span className="ml-1.5 text-blue-500">● Now</span>}
                </div>
              </div>
            )}
          </button>
        )
      })}

      {/* Legend */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-2xl px-3.5 py-3 shadow-md border border-sky-100/60 space-y-1.5">
        {LEGEND.map(({ type, color }) => (
          <div key={type} className="flex items-center gap-2 text-[10.5px] text-[#1a1f2e]/70 font-medium">
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${color}`} />
            {MARKER_STYLES[type].label}
          </div>
        ))}
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1 shadow-md">
        <button className="w-9 h-9 rounded-t-xl bg-white/92 backdrop-blur-sm border-b border-sky-100 text-[#1a1f2e] text-lg font-bold hover:bg-white transition-colors flex items-center justify-center">+</button>
        <button className="w-9 h-9 rounded-b-xl bg-white/92 backdrop-blur-sm text-[#1a1f2e] text-lg font-bold hover:bg-white transition-colors flex items-center justify-center">−</button>
      </div>

      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3.5 py-2 text-[11px] font-semibold text-[#1a1f2e] shadow-md">📍 Pune, Maharashtra</div>

      {/* Floating glassmorphism info card */}
      {activeCenter && (
        <div
          className="absolute z-20 pointer-events-auto"
          style={{
            left: `${Math.min(Math.max(activeCenter.mx, 25), 72)}%`,
            top: `${Math.min(Math.max(activeCenter.my, 5), 55)}%`,
            transform: 'translate(-50%, 16px)',
          }}
        >
          <div className="w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-sky-100/80 overflow-hidden animate-[fade-in-up_0.25s_ease_both]">
            {/* Image */}
            <div className="relative h-32 bg-sky-200 overflow-hidden">
              <img src={activeCenter.img} alt={activeCenter.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d2b45]/45 to-transparent" />
              <button
                onClick={() => onSelect(null)}
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors flex items-center justify-center text-sm"
              >✕</button>
              {activeCenter.isToday && (
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-blue-500/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-[10px] text-white font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Meditation Today – {activeCenter.todayTime}
                </div>
              )}
            </div>

            <div className="p-4">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider text-white mb-2 ${MARKER_STYLES[activeCenter.markerType].bg}`}>
                {MARKER_STYLES[activeCenter.markerType].label}
              </div>
              <h3 className="font-display text-[1.05rem] font-semibold text-[#1a1f2e] leading-snug mb-0.5">{activeCenter.name}</h3>
              <p className="text-[11px] text-sky-600 font-medium mb-3">📍 {activeCenter.area} · {activeCenter.distance}</p>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-[11.5px] text-[#1a1f2e]/60"><span>🕐</span>{activeCenter.timing}</div>
                <div className="flex items-center gap-2 text-[11.5px] text-[#1a1f2e]/60"><span>👤</span>{activeCenter.coordinator}</div>
                <div className="flex items-center gap-2 text-[11.5px] text-[#1a1f2e]/60"><span>🗣️</span>{activeCenter.languages.join(' · ')}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <a href={`tel:${activeCenter.phone}`} className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-[11.5px] font-semibold hover:bg-sky-100 transition-colors">
                  <span>📞</span> Call
                </a>
                <a href={`https://wa.me/${activeCenter.whatsapp}`} className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-50 border border-green-200 text-green-700 text-[11.5px] font-semibold hover:bg-green-100 transition-colors">
                  <span>💬</span> WhatsApp
                </a>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeCenter.address)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-[11.5px] font-semibold hover:bg-amber-100 transition-colors">
                  <span>🗺️</span> Directions
                </a>
                <Link to={`/center/${activeCenter.id}`} className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#1a1f2e] text-white text-[11.5px] font-semibold hover:bg-[#283040] transition-colors">
                  Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Center Card ── */
function CenterCard({ center, onSelect, isActive }: { center: Center; onSelect: (c: Center) => void; isActive: boolean }) {
  return (
    <div
      onClick={() => onSelect(center)}
      className={`bg-white rounded-2xl overflow-hidden border cursor-pointer transition-all duration-350 group ${isActive ? 'border-sky-400 shadow-xl shadow-sky-100/80 -translate-y-1' : 'border-sky-50 shadow-md hover:shadow-xl hover:shadow-sky-100/60 hover:-translate-y-1'}`}
    >
      <div className="relative bg-sky-200 h-44 overflow-hidden">
        <img src={center.img} alt={center.name} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2e]/55 to-transparent" />

        {/* Today badge */}
        {center.isToday && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-blue-500/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-[10px] text-white font-bold shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Meditation Today · {center.todayTime}
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 text-[10px] font-semibold text-sky-600 shadow-sm">
            📍 {center.distance}
          </div>
          <div className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-sm shadow-md ${MARKER_STYLES[center.markerType].bg}`}>
            {center.markerType === 'today' ? '💙' : center.markerType === 'program' ? '🌼' : center.markerType === 'festival' ? '✨' : center.markerType === 'workshop' ? '🔮' : '🪷'}
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display text-[1.05rem] font-semibold text-[#1a1f2e] leading-snug mb-1">{center.name}</h3>
        <p className="text-sky-600 text-[12px] font-medium mb-3 flex items-center gap-1"><span>📍</span>{center.area}</p>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2.5 text-[12px] text-[#1a1f2e]/55"><span>🕐</span>{center.timing}</div>
          <div className="flex items-center gap-2.5 text-[12px] text-[#1a1f2e]/55"><span>📅</span>{center.weekendTiming}</div>
          <div className="flex items-center gap-2.5 text-[12px] text-[#1a1f2e]/55"><span>👤</span>{center.coordinator}</div>
          <div className="flex items-start gap-2.5 text-[12px] text-[#1a1f2e]/55">
            <span className="mt-0.5">🗣️</span>
            <span>{center.languages.join(' · ')}</span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <a href={`tel:${center.phone}`} onClick={e => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-[12px] font-semibold hover:bg-sky-100 transition-colors">
            <span className="text-base">📞</span> Call
          </a>
          <a href={`https://wa.me/${center.whatsapp}`} onClick={e => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 border border-green-200 text-green-700 text-[12px] font-semibold hover:bg-green-100 transition-colors">
            <span className="text-base">💬</span> WhatsApp
          </a>
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.address)}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-[12px] font-semibold hover:bg-amber-100 transition-colors">
            <span className="text-base">🗺️</span> Navigate
          </a>
          <Link to={`/center/${center.id}`} onClick={e => e.stopPropagation()}
            className="flex-1 text-center py-2 rounded-xl bg-[#1a1f2e] text-white text-[12px] font-semibold hover:bg-[#283040] transition-colors">
            View Center
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ── Main page ── */
export default function FindCenter() {
  const [query, setQuery]               = useState('')
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())
  const [activeCenter, setActiveCenter] = useState<number | null>(null)
  const [loading, setLoading]           = useState(true)
  const [helpOpen, setHelpOpen]         = useState(false)

  // Simulate loading
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1400); return () => clearTimeout(t) }, [])

  const toggleFilter = (key: string) => {
    setActiveFilters(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const handleAreaChip = (area: string) => {
    setSelectedArea(prev => prev === area ? null : area)
    setQuery('')
  }

  // Filter centers
  const filteredCenters = CENTERS.filter(c => {
    const q = query.toLowerCase()
    const matchesQuery = !q || c.name.toLowerCase().includes(q) || c.area.toLowerCase().includes(q) || c.pincode.includes(q) || c.address.toLowerCase().includes(q)
    const matchesArea  = !selectedArea || c.area.toLowerCase().includes(selectedArea.toLowerCase())
    const matchesToday = !activeFilters.has('today') || c.isToday
    const matchesLang  =
      (!activeFilters.has('en') || c.languages.includes('English')) &&
      (!activeFilters.has('mr') || c.languages.includes('Marathi')) &&
      (!activeFilters.has('hi') || c.languages.includes('Hindi'))
    const matchesProg  = !activeFilters.has('program') || c.markerType === 'program'
    return matchesQuery && matchesArea && matchesToday && matchesLang && matchesProg
  })

  const handleSelectCenter = (center: Center | null) => {
    setActiveCenter(center?.id ?? null)
    if (center) {
      setTimeout(() => {
        document.getElementById(`center-card-${center.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 120)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafbff] text-[#1a1f2e]">
      <Navbar />

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0d2b45] to-[#0f3a5a] pt-24 pb-12" style={{ paddingTop: '120px' }}>
        {/* Lotus bg */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[700px] text-sky-400 opacity-[0.07]"><LotusDecor /></div>
        </div>
        {/* Channel lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08]" viewBox="0 0 1440 280" preserveAspectRatio="xMidYMid slice" fill="none">
          <path d="M0,140 Q360,80 720,140 Q1080,200 1440,140" stroke="rgba(147,210,255,1)" strokeWidth="1.2" />
          <path d="M0,160 Q360,100 720,160 Q1080,220 1440,160" stroke="rgba(255,196,80,0.8)" strokeWidth="1" />
        </svg>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/65 text-[10px] tracking-[0.22em] uppercase mb-6 font-medium">
            📍 Center Locator · Pune
          </div>
          <h1 className="font-display text-[clamp(1.9rem,5vw,3.5rem)] font-semibold text-white leading-[1.1] mb-4">
            Find Your Nearest<br />
            <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Sahaja Yoga Center</em>
          </h1>
          <p className="text-white/50 text-[14px] leading-[1.8] max-w-xl mx-auto mb-10">
            Whether you are visiting Pune, have recently moved here, or are beginning your Sahaja Yoga journey — we'll help you find the nearest collective meditation center.
          </p>

          {/* Premium search bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center gap-3 bg-white rounded-2xl shadow-2xl shadow-[#0d2b45]/40 px-4 py-3.5 border border-sky-100/60">
              <svg className="w-5 h-5 text-sky-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setSelectedArea(null) }}
                placeholder="Search by Area, Locality, Pincode or Center Name"
                className="flex-1 bg-transparent text-[15px] text-[#1a1f2e] placeholder-sky-400/60 outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-sky-300 hover:text-sky-500 transition-colors text-sm px-1">✕</button>
              )}
              <div className="w-px h-7 bg-sky-100 flex-shrink-0" />
              <button
                onClick={() => { setQuery(''); setSelectedArea(null) }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-[13px] font-semibold transition-all duration-200 flex-shrink-0 whitespace-nowrap"
              >
                <span>📍</span> Use My Location
              </button>
            </div>
          </div>

          {/* Quick area chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {AREA_CHIPS.map(area => (
              <button
                key={area}
                onClick={() => handleAreaChip(area)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 ${
                  selectedArea === area
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                    : 'bg-white/12 backdrop-blur-sm border border-white/18 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky Filter Bar ── */}
      <div className="sticky top-[100px] z-30 bg-white/96 backdrop-blur-xl border-b border-sky-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <span className="text-[11px] text-[#1a1f2e]/40 uppercase tracking-widest font-semibold flex-shrink-0">Filter</span>
          <div className="w-px h-5 bg-sky-100 flex-shrink-0" />
          {FILTER_CHIPS.map(chip => (
            <button
              key={chip.key}
              onClick={() => toggleFilter(chip.key)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 ${
                activeFilters.has(chip.key)
                  ? 'bg-[#1a1f2e] text-white shadow-md'
                  : 'bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100'
              }`}
            >
              {chip.label}
              {activeFilters.has(chip.key) && <span className="ml-1.5 text-white/60">✕</span>}
            </button>
          ))}
          {(activeFilters.size > 0 || selectedArea || query) && (
            <button
              onClick={() => { setActiveFilters(new Set()); setSelectedArea(null); setQuery('') }}
              className="flex-shrink-0 px-3 py-1.5 text-[12px] text-red-500 font-medium hover:text-red-600 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Map ── */}
        <FadeIn>
          {loading ? (
            <div className="rounded-3xl bg-[#d4eaf5] border border-sky-100 shadow-2xl shadow-sky-200/60">
              <div className="flex flex-col items-center justify-center h-[58vh] min-h-[400px] gap-5">
                <LotusSpinner />
                <p className="text-sky-600/70 text-[13px] font-medium tracking-wide">Finding centers near you…</p>
              </div>
            </div>
          ) : (
            <CenterMap
              centers={filteredCenters}
              activeId={activeCenter}
              onSelect={handleSelectCenter}
            />
          )}
        </FadeIn>

        {/* ── Results count ── */}
        {!loading && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-semibold text-[#1a1f2e]">{filteredCenters.length}</span>
              <span className="text-[#1a1f2e]/55 text-[14px]">
                {filteredCenters.length === 1 ? 'center found' : 'centers found'}
                {(query || selectedArea) && ` for "${query || selectedArea}"`}
              </span>
            </div>
            <div className="text-[12px] text-sky-600 font-medium">
              {filteredCenters.filter(c => c.isToday).length} active today
            </div>
          </div>
        )}

        {/* ── Center Cards ── */}
        {!loading && filteredCenters.length > 0 && (
          <FadeIn>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCenters.map(center => (
                <div key={center.id} id={`center-card-${center.id}`}>
                  <CenterCard
                    center={center}
                    isActive={activeCenter === center.id}
                    onSelect={c => handleSelectCenter(c)}
                  />
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* ── Empty State ── */}
        {!loading && filteredCenters.length === 0 && (
          <FadeIn>
            <div className="text-center py-16 px-6">
              <div className="w-24 h-24 text-sky-200 mx-auto mb-5"><LotusDecor /></div>
              <h3 className="font-display text-2xl font-semibold text-[#1a1f2e] mb-2">No centers found</h3>
              <p className="text-[#1a1f2e]/50 text-[14px] mb-6 max-w-sm mx-auto">
                We couldn't find a center matching your search. Try a nearby area or use your location.
              </p>
              <button
                onClick={() => { setQuery(''); setSelectedArea(null); setActiveFilters(new Set()) }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sky-500 text-white font-semibold text-[14px] hover:bg-sky-400 transition-colors shadow-md"
              >
                Show All Centers
              </button>
              {/* Suggested centers */}
              <div className="mt-10">
                <p className="text-[12px] text-[#1a1f2e]/40 uppercase tracking-widest mb-5">Nearest Available</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {CENTERS.slice(0, 3).map(c => (
                    <div key={c.id} className="bg-white rounded-xl p-4 border border-sky-100 shadow-sm text-left hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleSelectCenter(c)}>
                      <div className="font-semibold text-[13px] text-[#1a1f2e] mb-0.5">{c.name}</div>
                      <div className="text-[11px] text-sky-600 mb-1">📍 {c.area} · {c.distance}</div>
                      <div className="text-[11px] text-[#1a1f2e]/50">{c.timing}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        )}
      </div>

      {/* ── First-Time Visitor ── */}
      <FadeIn>
        <section className="py-20 px-6 bg-gradient-to-br from-sky-50 to-[#fafbff] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-72 h-72 text-amber-400 opacity-[0.07] translate-x-16 -translate-y-16 pointer-events-none"><LotusDecor /></div>
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-px bg-amber-400" />
                  <span className="text-amber-600 text-[10px] tracking-[0.22em] uppercase font-semibold">Welcome</span>
                </div>
                <h2 className="font-display text-[clamp(2rem,4vw,2.8rem)] font-semibold text-[#1a1f2e] mb-4 leading-tight">
                  First Time Visiting?
                </h2>
                <p className="text-[#1a1f2e]/55 text-[14px] leading-[1.85] mb-8">
                  Every Sahaja Yoga center is a warm, welcoming space. Here's what you can expect on your first visit.
                </p>
                <div className="space-y-3.5 mb-10">
                  {[
                    { icon: '🌿', text: 'Meditation is completely free — no fees, ever' },
                    { icon: '🕊️', text: 'Everyone is welcome, regardless of background' },
                    { icon: '📋', text: 'No registration or booking required' },
                    { icon: '👕', text: 'Comfortable, modest clothing is recommended' },
                    { icon: '👨‍👩‍👧', text: 'Families and children are warmly welcome' },
                    { icon: '🤝', text: 'Friendly volunteers will guide you every step' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3.5 group">
                      <div className="w-9 h-9 rounded-xl bg-white shadow-sm border border-sky-100 flex items-center justify-center text-lg flex-shrink-0 group-hover:border-amber-200 group-hover:shadow-md transition-all duration-200">
                        {item.icon}
                      </div>
                      <span className="text-[13.5px] text-[#1a1f2e]/70 leading-snug">{item.text}</span>
                    </div>
                  ))}
                </div>
                <Link to="/journey" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#1a1f2e] hover:bg-[#283040] text-white font-semibold text-[14px] transition-all duration-200 shadow-xl hover:-translate-y-0.5">
                  🌸 Begin Your Journey
                </Link>
              </div>

              {/* Image panel */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-sky-200/60 border border-sky-100 bg-sky-200 h-[420px]">
                <img
                  src="https://images.unsplash.com/photo-1687875495230-96dfea96d9da?w=700&h=600&fit=crop&auto=format"
                  alt="People sitting in collective meditation outdoors"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2b45]/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-lg border border-white/60">
                    <div className="text-[10px] text-amber-500 uppercase tracking-[0.2em] font-bold mb-1">Shri Mataji Nirmala Devi</div>
                    <p className="font-display text-[13.5px] italic text-[#1a1f2e]/80 leading-snug">
                      "The time has come for all of you to get your Self-Realization."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── Footer ── */}
      <footer className="bg-[#0d2b45] text-white/58 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-72 h-72 text-sky-400 opacity-[0.04] translate-x-20 translate-y-20 pointer-events-none"><LotusDecor /></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-700 flex items-center justify-center"><span className="text-white text-[10px] font-bold">SC</span></div>
            <div>
              <div className="text-white font-semibold text-[13px]">Sahaja Connect – Pune</div>
              <div className="text-amber-400 text-[9px] tracking-[0.2em] uppercase">Find a Center</div>
            </div>
          </div>
          <div className="text-[12px]">© 2025 Sahaja Connect – Pune. All programs are free.</div>
          <div className="flex gap-4 text-[12px]">
            <a href="/privacy" className="hover:text-amber-400 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-amber-400 transition-colors">Terms</a>
            <a href="/" className="hover:text-amber-400 transition-colors">← Homepage</a>
          </div>
        </div>
      </footer>

      {/* ── Floating Help FAB ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5">
        {/* Expanded options */}
        {helpOpen && (
          <div className="flex flex-col gap-2 items-end animate-[fade-in-up_0.2s_ease_both]">
            {[
              { icon: '📞', label: 'Call Coordinator', href: 'tel:+919876543210', bg: 'bg-sky-500 hover:bg-sky-400' },
              { icon: '💬', label: 'WhatsApp', href: 'https://wa.me/919876543210', bg: 'bg-green-500 hover:bg-green-400' },
              { icon: '📝', label: 'Contact Form', href: '#', bg: 'bg-[#1a1f2e] hover:bg-[#283040]' },
            ].map(opt => (
              <a key={opt.label} href={opt.href}
                className={`flex items-center gap-2.5 pl-4 pr-5 py-2.5 rounded-full ${opt.bg} text-white text-[13px] font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap`}
              >
                <span className="text-base">{opt.icon}</span>{opt.label}
              </a>
            ))}
          </div>
        )}

        {/* FAB button */}
        <button
          onClick={() => setHelpOpen(o => !o)}
          className={`w-14 h-14 rounded-full shadow-2xl flex flex-col items-center justify-center transition-all duration-300 ${helpOpen ? 'bg-[#1a1f2e] scale-110' : 'bg-amber-500 hover:bg-amber-400 hover:scale-110'}`}
          style={!helpOpen ? { boxShadow: '0 0 0 0 rgba(196,151,58,0.6)', animation: 'pulse-glow 2.5s ease-in-out infinite' } : {}}
        >
          <span className="text-xl">{helpOpen ? '✕' : '🌸'}</span>
          <span className="text-white text-[8px] font-semibold leading-none mt-0.5">{helpOpen ? '' : 'Help'}</span>
        </button>
      </div>
    </div>
  )
}
