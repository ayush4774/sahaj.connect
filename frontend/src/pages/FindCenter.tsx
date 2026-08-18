import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import LotusDecor from '../components/LotusDecor'
import api from '../services/api'

type MarkerType =
  | 'regular'
  | 'program'
  | 'festival'
  | 'today'
  | 'workshop'

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

const MARKER_STYLES: Record<
  MarkerType,
  {
    bg: string
    ring: string
    label: string
  }
> = {
  regular: {
    bg: 'bg-emerald-500',
    ring: 'ring-emerald-300',
    label: 'Regular Center',
  },
  program: {
    bg: 'bg-orange-500',
    ring: 'ring-orange-300',
    label: 'Public Program',
  },
  festival: {
    bg: 'bg-amber-500',
    ring: 'ring-amber-300',
    label: 'Festival',
  },
  today: {
    bg: 'bg-blue-500',
    ring: 'ring-blue-300',
    label: "Today's Collective",
  },
  workshop: {
    bg: 'bg-purple-500',
    ring: 'ring-purple-300',
    label: 'Workshop',
  },
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1529693662653-9d480530a697?w=800&h=500&fit=crop&auto=format'

const CENTERS: Center[] = [
  {
    id: 1,
    name: 'Koregaon Park Center',
    area: 'Koregaon Park',
    address: '12, Lane 4, Koregaon Park, Pune',
    pincode: '411001',
    distance: '2.1 km',
    timing: 'Tue & Thu — 7:00 PM',
    weekendTiming: 'Sun — 10:30 AM',
    todayTime: '7:00 PM',
    isToday: true,
    coordinator: 'Shri Ramesh Patil',
    phone: '+919876543210',
    whatsapp: '919876543210',
    languages: ['Marathi', 'Hindi', 'English'],
    markerType: 'today',
    img: 'https://images.unsplash.com/photo-1686749143613-0eeacff36894?w=640&h=400&fit=crop&auto=format',
    mx: 55,
    my: 32,
  },
  {
    id: 2,
    name: 'Kothrud Meditation Center',
    area: 'Kothrud',
    address: '8, Paud Road, Kothrud, Pune',
    pincode: '411038',
    distance: '4.3 km',
    timing: 'Wed & Sun — 6:30 PM',
    weekendTiming: 'Sun — 6:30 PM',
    isToday: false,
    coordinator: 'Shrimati Asha Kulkarni',
    phone: '+919876543211',
    whatsapp: '919876543211',
    languages: ['Marathi', 'English'],
    markerType: 'regular',
    img: 'https://images.unsplash.com/photo-1677741447985-da1d90c00742?w=640&h=400&fit=crop&auto=format',
    mx: 26,
    my: 56,
  },
  {
    id: 3,
    name: 'Aundh Community Hall',
    area: 'Aundh',
    address: '3, ITI Road, Aundh, Pune',
    pincode: '411007',
    distance: '6.8 km',
    timing: 'Mon & Fri — 7:30 PM',
    weekendTiming: 'Sat — 7:30 PM',
    isToday: false,
    coordinator: 'Shri Vinod Sharma',
    phone: '+919876543212',
    whatsapp: '919876543212',
    languages: ['Hindi', 'English'],
    markerType: 'regular',
    img: 'https://images.unsplash.com/photo-1529693662653-9d480530a697?w=640&h=400&fit=crop&auto=format',
    mx: 36,
    my: 24,
  },
  {
    id: 4,
    name: 'Kalyani Nagar Center',
    area: 'Kalyani Nagar',
    address: '21, Aga Khan Palace Road, Kalyani Nagar',
    pincode: '411006',
    distance: '3.7 km',
    timing: 'Tue & Fri — 7:00 PM',
    weekendTiming: 'Sun — 11:00 AM',
    todayTime: '7:00 PM',
    isToday: true,
    coordinator: 'Shrimati Priya Deshpande',
    phone: '+919876543213',
    whatsapp: '919876543213',
    languages: ['Marathi', 'Hindi', 'English'],
    markerType: 'today',
    img: 'https://images.unsplash.com/photo-1687783615494-b4a1f1af8b58?w=640&h=400&fit=crop&auto=format',
    mx: 63,
    my: 27,
  },
  {
    id: 5,
    name: 'Baner Meditation Circle',
    area: 'Baner',
    address: '15, Baner Road, Near Orchid Hotel, Baner',
    pincode: '411045',
    distance: '8.2 km',
    timing: 'Mon & Thu — 6:30 PM',
    weekendTiming: 'Sat — 7:00 PM',
    isToday: false,
    coordinator: 'Shri Amit Joshi',
    phone: '+919876543214',
    whatsapp: '919876543214',
    languages: ['English', 'Hindi'],
    markerType: 'workshop',
    img: 'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=640&h=400&fit=crop&auto=format',
    mx: 21,
    my: 36,
  },
  {
    id: 6,
    name: 'Hadapsar Public Program',
    area: 'Hadapsar',
    address: 'Magarpatta City Community Hall, Hadapsar',
    pincode: '411028',
    distance: '9.5 km',
    timing: 'Wed & Sat — 6:00 PM',
    weekendTiming: 'Sat — 6:00 PM',
    isToday: false,
    coordinator: 'Shri Suresh Kulkarni',
    phone: '+919876543215',
    whatsapp: '919876543215',
    languages: ['Marathi', 'Hindi'],
    markerType: 'program',
    img: 'https://images.unsplash.com/photo-1686749143613-0eeacff36894?w=640&h=400&fit=crop&auto=format',
    mx: 73,
    my: 62,
  },
  {
    id: 7,
    name: 'Viman Nagar Center',
    area: 'Viman Nagar',
    address: '7, Viman Nagar, Near Phoenix Mall, Pune',
    pincode: '411014',
    distance: '5.1 km',
    timing: 'Tue & Thu — 7:30 PM',
    weekendTiming: 'Sun — 10:00 AM',
    isToday: false,
    coordinator: 'Shrimati Sunita Patil',
    phone: '+919876543216',
    whatsapp: '919876543216',
    languages: ['English', 'Marathi'],
    markerType: 'regular',
    img: 'https://images.unsplash.com/photo-1687783615476-f4c12358ca9d?w=640&h=400&fit=crop&auto=format',
    mx: 72,
    my: 25,
  },
  {
    id: 8,
    name: 'Kharadi Festival Center',
    area: 'Kharadi',
    address: 'EON IT Park Community Hall, Kharadi',
    pincode: '411014',
    distance: '11.2 km',
    timing: 'Mon, Wed & Fri — 7:00 PM',
    weekendTiming: 'Sat — 6:30 PM',
    isToday: false,
    coordinator: 'Shri Nikhil Mehta',
    phone: '+919876543217',
    whatsapp: '919876543217',
    languages: ['English', 'Hindi', 'Marathi'],
    markerType: 'festival',
    img: 'https://images.unsplash.com/photo-1529693662653-9d480530a697?w=640&h=400&fit=crop&auto=format',
    mx: 82,
    my: 38,
  },
  {
    id: 9,
    name: 'Sinhagad Road Center',
    area: 'Sinhagad Road',
    address: '45, Anand Park, Sinhagad Road, Pune',
    pincode: '411041',
    distance: '7.4 km',
    timing: 'Tue & Fri — 6:30 PM',
    weekendTiming: 'Sun — 10:30 AM',
    isToday: false,
    coordinator: 'Shrimati Kavita Bhosle',
    phone: '+919876543218',
    whatsapp: '919876543218',
    languages: ['Marathi'],
    markerType: 'regular',
    img: 'https://images.unsplash.com/photo-1687875495230-96dfea96d9da?w=640&h=400&fit=crop&auto=format',
    mx: 17,
    my: 67,
  },
  {
    id: 10,
    name: 'Pimpri Collective',
    area: 'Pimpri-Chinchwad',
    address: 'Pimpri Community Hall, Pimpri, Pune',
    pincode: '411017',
    distance: '14.3 km',
    timing: 'Wed & Sat — 7:00 PM',
    weekendTiming: 'Sat — 7:00 PM',
    isToday: false,
    coordinator: 'Shri Rajesh Wagh',
    phone: '+919876543219',
    whatsapp: '919876543219',
    languages: ['Marathi', 'Hindi'],
    markerType: 'regular',
    img: 'https://images.unsplash.com/photo-1686749143613-0eeacff36894?w=640&h=400&fit=crop&auto=format',
    mx: 31,
    my: 14,
  },
]

const AREA_CHIPS = [
  'Kharadi',
  'Viman Nagar',
  'Kalyani Nagar',
  'Koregaon Park',
  'Hadapsar',
  'Magarpatta',
  'Wagholi',
  'Baner',
  'Aundh',
  'Pimpri',
  'Hinjawadi',
  'Sinhagad Road',
]

const FILTER_CHIPS = [
  { key: 'today', label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'morning', label: 'Morning Meditation' },
  { key: 'evening', label: 'Evening Meditation' },
  { key: 'weekend', label: 'Weekend Centers' },
  { key: 'program', label: 'Public Program' },
  { key: 'en', label: 'English' },
  { key: 'mr', label: 'Marathi' },
  { key: 'hi', label: 'Hindi' },
]

const LEGEND = [
  { type: 'today' as MarkerType, color: 'bg-blue-500' },
  { type: 'regular' as MarkerType, color: 'bg-emerald-500' },
  { type: 'program' as MarkerType, color: 'bg-orange-500' },
  { type: 'festival' as MarkerType, color: 'bg-amber-500' },
  { type: 'workshop' as MarkerType, color: 'bg-purple-500' },
]

function normalizeCenter(raw: any, index: number): Center {
  const source = raw || {}

  const id = Number(
    source.id ?? source._id ?? source.centerId ?? index + 1000
  )

  const phone = String(
    source.phone ?? source.contactPhone ?? ''
  )

  return {
    id,
    name: source.name ?? source.centerName ?? 'Sahaja Yoga Center',
    area: source.area ?? source.locality ?? source.city ?? 'Pune',
    address:
      source.address ??
      source.location ??
      source.fullAddress ??
      'Pune, Maharashtra',
    pincode: String(
      source.pincode ?? source.pinCode ?? source.postalCode ?? ''
    ),
    distance:
      typeof source.distance === 'number'
        ? `${source.distance.toFixed(1)} km`
        : source.distance ?? 'Nearby',
    timing:
      source.timing ??
      source.schedule ??
      source.weekdayTiming ??
      'Contact coordinator for timing',
    weekendTiming:
      source.weekendTiming ??
      source.weekendSchedule ??
      'Contact coordinator for timing',
    todayTime: source.todayTime,
    isToday: Boolean(source.isToday),
    coordinator:
      source.coordinator ??
      source.contactPerson ??
      'Center Coordinator',
    phone,
    whatsapp: String(
      source.whatsapp ??
        source.whatsappNumber ??
        phone.replace(/\D/g, '')
    ),
    languages: Array.isArray(source.languages)
      ? source.languages
      : ['English', 'Hindi'],
    markerType: [
      'regular',
      'program',
      'festival',
      'today',
      'workshop',
    ].includes(source.markerType)
      ? source.markerType
      : source.isToday
        ? 'today'
        : 'regular',
    img:
      source.img ??
      source.image ??
      source.imageUrl ??
      DEFAULT_IMAGE,
    mx: Number(source.mx ?? source.mapX ?? 50),
    my: Number(source.my ?? source.mapY ?? 50),
  }
}

function useVisible(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

function FadeIn({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const { ref, visible } = useVisible()

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateY(0)'
          : 'translateY(28px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

function LotusSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative w-16 h-16">
        <div
          className="absolute inset-0 text-amber-400 opacity-60"
          style={{ animation: 'spin 3s linear infinite' }}
        >
          <LotusDecor />
        </div>

        <div
          className="absolute inset-2 text-sky-400 opacity-40"
          style={{
            animation: 'spin 5s linear infinite reverse',
          }}
        >
          <LotusDecor />
        </div>
      </div>
    </div>
  )
}

function CenterMap({
  centers,
  activeId,
  onSelect,
}: {
  centers: Center[]
  activeId: number | null
  onSelect: (center: Center | null) => void
}) {
  const activeCenter =
    centers.find(center => center.id === activeId) ?? null

  return (
    <div className="relative w-full h-[58vh] min-h-[400px] rounded-3xl overflow-hidden shadow-2xl shadow-sky-200/60 border border-sky-100 bg-[#d4eaf5]">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 580"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient
            id="mapBg"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#c8e8f5" />
            <stop offset="100%" stopColor="#d8eff8" />
          </linearGradient>
        </defs>

        <rect
          width="1000"
          height="580"
          fill="url(#mapBg)"
        />

        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
          <g key={i} opacity="0.12">
            <line
              x1={i * 100}
              y1="0"
              x2={i * 100}
              y2="580"
              stroke="#64b5d9"
              strokeWidth="0.8"
            />
            <line
              x1="0"
              y1={i * 58}
              x2="1000"
              y2={i * 58}
              stroke="#64b5d9"
              strokeWidth="0.8"
            />
          </g>
        ))}

        <ellipse
          cx="200"
          cy="200"
          rx="70"
          ry="45"
          fill="#a7d9b5"
          opacity="0.4"
        />

        <ellipse
          cx="700"
          cy="420"
          rx="90"
          ry="50"
          fill="#a7d9b5"
          opacity="0.35"
        />

        <ellipse
          cx="850"
          cy="150"
          rx="55"
          ry="35"
          fill="#a7d9b5"
          opacity="0.3"
        />

        <path
          d="M0,360 Q150,320 280,350 Q420,380 550,340 Q700,300 850,330 Q950,345 1000,320"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="24"
          opacity="0.18"
        />
      </svg>

      {centers.map(center => {
        const style = MARKER_STYLES[center.markerType]
        const isActive = activeId === center.id

        return (
          <button
            key={center.id}
            type="button"
            onClick={() =>
              onSelect(isActive ? null : center)
            }
            className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
            style={{
              left: `${Math.min(
                Math.max(center.mx, 5),
                95
              )}%`,
              top: `${Math.min(
                Math.max(center.my, 5),
                95
              )}%`,
            }}
          >
            {center.isToday && (
              <span
                className={`absolute inset-0 rounded-full ${style.bg} opacity-30 animate-ping`}
              />
            )}

            <div
              className={`relative w-10 h-10 rounded-full ${style.bg} border-2 border-white shadow-lg flex items-center justify-center text-base transition-all duration-200 ${
                isActive
                  ? `scale-125 shadow-xl ring-4 ${style.ring}`
                  : 'hover:scale-110'
              }`}
            >
              {center.markerType === 'today' && '💙'}
              {center.markerType === 'regular' && '🪷'}
              {center.markerType === 'program' && '🌼'}
              {center.markerType === 'festival' && '✨'}
              {center.markerType === 'workshop' && '🔮'}
            </div>

            {!isActive && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                <div className="bg-white rounded-lg shadow-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#1a1f2e]">
                  {center.name}
                </div>
              </div>
            )}
          </button>
        )
      })}

      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-2xl px-3.5 py-3 shadow-md border border-sky-100/60 space-y-1.5">
        {LEGEND.map(({ type, color }) => (
          <div
            key={type}
            className="flex items-center gap-2 text-[10.5px] text-[#1a1f2e]/70 font-medium"
          >
            <div
              className={`w-3 h-3 rounded-full flex-shrink-0 ${color}`}
            />
            {MARKER_STYLES[type].label}
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3.5 py-2 text-[11px] font-semibold text-[#1a1f2e] shadow-md">
        Pune, Maharashtra
      </div>

      {activeCenter && (
        <div
          className="absolute z-20 pointer-events-auto"
          style={{
            left: `${Math.min(
              Math.max(activeCenter.mx, 25),
              72
            )}%`,
            top: `${Math.min(
              Math.max(activeCenter.my, 5),
              55
            )}%`,
            transform: 'translate(-50%, 16px)',
          }}
        >
          <div className="w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-sky-100/80 overflow-hidden">
            <div className="relative h-32 bg-sky-200 overflow-hidden">
              <img
                src={activeCenter.img}
                alt={activeCenter.name}
                onError={event => {
                  event.currentTarget.src = DEFAULT_IMAGE
                }}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0d2b45]/45 to-transparent" />

              <button
                type="button"
                onClick={() => onSelect(null)}
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider text-white mb-2 ${MARKER_STYLES[activeCenter.markerType].bg}`}
              >
                {
                  MARKER_STYLES[
                    activeCenter.markerType
                  ].label
                }
              </div>

              <h3 className="font-display text-[1.05rem] font-semibold text-[#1a1f2e]">
                {activeCenter.name}
              </h3>

              <p className="text-[11px] text-sky-600 font-medium mb-3">
                {activeCenter.area} · {activeCenter.distance}
              </p>

              <div className="space-y-1.5 mb-4">
                <div className="text-[11.5px] text-[#1a1f2e]/60">
                  {activeCenter.timing}
                </div>

                <div className="text-[11.5px] text-[#1a1f2e]/60">
                  {activeCenter.coordinator}
                </div>

                <div className="text-[11.5px] text-[#1a1f2e]/60">
                  {activeCenter.languages.join(' · ')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <a
                  href={`tel:${activeCenter.phone}`}
                  className="flex items-center justify-center py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-[11.5px] font-semibold"
                >
                  Call
                </a>

                <a
                  href={`https://wa.me/${activeCenter.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center py-2 rounded-xl bg-green-50 border border-green-200 text-green-700 text-[11.5px] font-semibold"
                >
                  WhatsApp
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    activeCenter.address
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-[11.5px] font-semibold"
                >
                  Directions
                </a>

                <Link
                  to={`/center/${activeCenter.id}`}
                  className="flex items-center justify-center py-2 rounded-xl bg-[#1a1f2e] text-white text-[11.5px] font-semibold"
                >
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

function CenterCard({
  center,
  onSelect,
  isActive,
}: {
  center: Center
  onSelect: (center: Center) => void
  isActive: boolean
}) {
  return (
    <div
      onClick={() => onSelect(center)}
      className={`bg-white rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 group ${
        isActive
          ? 'border-sky-400 shadow-xl shadow-sky-100/80 -translate-y-1'
          : 'border-sky-50 shadow-md hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      <div className="relative bg-sky-200 h-44 overflow-hidden">
        <img
          src={center.img}
          alt={center.name}
          onError={event => {
            event.currentTarget.src = DEFAULT_IMAGE
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2e]/55 to-transparent" />

        {center.isToday && (
          <div className="absolute top-3 left-3 bg-blue-500/90 rounded-full px-2.5 py-1 text-[10px] text-white font-bold">
            Meditation Today
            {center.todayTime
              ? ` · ${center.todayTime}`
              : ''}
          </div>
        )}

        <div className="absolute bottom-3 left-3">
          <div className="bg-white/90 rounded-lg px-2.5 py-1 text-[10px] font-semibold text-sky-600">
            {center.distance}
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display text-[1.05rem] font-semibold text-[#1a1f2e] mb-1">
          {center.name}
        </h3>

        <p className="text-sky-600 text-[12px] font-medium mb-3">
          {center.area}
        </p>

        <div className="space-y-1.5 mb-4">
          <div className="text-[12px] text-[#1a1f2e]/55">
            {center.timing}
          </div>

          <div className="text-[12px] text-[#1a1f2e]/55">
            {center.weekendTiming}
          </div>

          <div className="text-[12px] text-[#1a1f2e]/55">
            {center.coordinator}
          </div>

          <div className="text-[12px] text-[#1a1f2e]/55">
            {center.languages.join(' · ')}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <a
            href={`tel:${center.phone}`}
            onClick={event => event.stopPropagation()}
            className="px-3 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-[12px] font-semibold"
          >
            Call
          </a>

          <a
            href={`https://wa.me/${center.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            onClick={event => event.stopPropagation()}
            className="px-3 py-2 rounded-xl bg-green-50 border border-green-200 text-green-700 text-[12px] font-semibold"
          >
            WhatsApp
          </a>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              center.address
            )}`}
            target="_blank"
            rel="noreferrer"
            onClick={event => event.stopPropagation()}
            className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-[12px] font-semibold"
          >
            Navigate
          </a>

          <Link
            to={`/center/${center.id}`}
            onClick={event => event.stopPropagation()}
            className="flex-1 text-center py-2 rounded-xl bg-[#1a1f2e] text-white text-[12px] font-semibold"
          >
            View Center
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function FindCenter() {
  const [query, setQuery] = useState('')
  const [selectedArea, setSelectedArea] =
    useState<string | null>(null)

  const [activeFilters, setActiveFilters] =
    useState<Set<string>>(new Set())

  const [activeCenter, setActiveCenter] =
    useState<number | null>(null)

  const [loading, setLoading] = useState(true)
  const [helpOpen, setHelpOpen] = useState(false)

  const [locationLoading, setLocationLoading] =
    useState(false)

  const [locationError, setLocationError] =
    useState('')

  const [nearbyCenters, setNearbyCenters] =
    useState<Center[] | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(
      () => setLoading(false),
      800
    )

    return () => window.clearTimeout(timer)
  }, [])

  const toggleFilter = (key: string) => {
    setActiveFilters(previous => {
      const next = new Set(previous)

      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }

      return next
    })

    setActiveCenter(null)
  }

  const handleAreaChip = (area: string) => {
    setSelectedArea(previous =>
      previous === area ? null : area
    )

    setQuery('')
    setNearbyCenters(null)
    setLocationError('')
    setActiveCenter(null)
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        'Your browser does not support location services.'
      )
      return
    }

    setLocationLoading(true)
    setLocationError('')
    setNearbyCenters(null)
    setQuery('')
    setSelectedArea(null)
    setActiveCenter(null)

    navigator.geolocation.getCurrentPosition(
      async position => {
        try {
          const { latitude, longitude } = position.coords

          const response = await api.get(
            '/centers/nearby',
            {
              params: {
                lat: latitude,
                lng: longitude,
              },
            }
          )

          const rawCenters = Array.isArray(response.data)
            ? response.data
            : response.data?.centers ?? []

          if (!Array.isArray(rawCenters)) {
            throw new Error(
              'Invalid nearby centers response'
            )
          }

          const normalizedCenters = rawCenters.map(
            (center: any, index: number) =>
              normalizeCenter(center, index)
          )

          setNearbyCenters(normalizedCenters)
        } catch (error) {
          console.error(
            'Failed to find nearby centers:',
            error
          )

          setNearbyCenters(null)
          setLocationError(
            'Unable to find nearby centers. Please try again.'
          )
        } finally {
          setLocationLoading(false)
        }
      },

      error => {
        console.error('Location error:', error)

        if (
          error.code ===
          GeolocationPositionError.PERMISSION_DENIED
        ) {
          setLocationError(
            'Location permission was denied. Please allow location access and try again.'
          )
        } else if (
          error.code ===
          GeolocationPositionError.TIMEOUT
        ) {
          setLocationError(
            'Location request timed out. Please try again.'
          )
        } else {
          setLocationError(
            'Unable to get your current location.'
          )
        }

        setLocationLoading(false)
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  }

  const centersToDisplay =
    nearbyCenters !== null ? nearbyCenters : CENTERS

  const filteredCenters = useMemo(() => {
    return centersToDisplay.filter(center => {
      const q = query.trim().toLowerCase()

      const matchesQuery =
        !q ||
        center.name.toLowerCase().includes(q) ||
        center.area.toLowerCase().includes(q) ||
        center.pincode.includes(q) ||
        center.address.toLowerCase().includes(q)

      const matchesArea =
        !selectedArea ||
        center.area
          .toLowerCase()
          .includes(selectedArea.toLowerCase())

      const matchesToday =
        !activeFilters.has('today') ||
        center.isToday

      const matchesTomorrow =
        !activeFilters.has('tomorrow') ||
        /tomorrow/i.test(
          `${center.timing} ${center.weekendTiming}`
        )

      const matchesMorning =
        !activeFilters.has('morning') ||
        /\b([0-9]|1[0-1]):?[0-5]?[0-9]?\s*AM\b/i.test(
          `${center.timing} ${center.weekendTiming}`
        )

      const matchesEvening =
        !activeFilters.has('evening') ||
        /\b(1[2-9]|[2-9]):?[0-5]?[0-9]?\s*PM\b/i.test(
          `${center.timing} ${center.weekendTiming}`
        )

      const matchesWeekend =
        !activeFilters.has('weekend') ||
        /sat|sun/i.test(
          `${center.timing} ${center.weekendTiming}`
        )

      const matchesProgram =
        !activeFilters.has('program') ||
        center.markerType === 'program'

      const matchesLanguages =
        (!activeFilters.has('en') ||
          center.languages.some(language =>
            language.toLowerCase().includes('english')
          )) &&
        (!activeFilters.has('mr') ||
          center.languages.some(language =>
            language.toLowerCase().includes('marathi')
          )) &&
        (!activeFilters.has('hi') ||
          center.languages.some(language =>
            language.toLowerCase().includes('hindi')
          ))

      return (
        matchesQuery &&
        matchesArea &&
        matchesToday &&
        matchesTomorrow &&
        matchesMorning &&
        matchesEvening &&
        matchesWeekend &&
        matchesProgram &&
        matchesLanguages
      )
    })
  }, [
    centersToDisplay,
    query,
    selectedArea,
    activeFilters,
  ])

  const handleSelectCenter = (
    center: Center | null
  ) => {
    setActiveCenter(center?.id ?? null)

    if (center) {
      window.setTimeout(() => {
        document
          .getElementById(
            `center-card-${center.id}`
          )
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          })
      }, 120)
    }
  }

  const clearAll = () => {
    setActiveFilters(new Set())
    setSelectedArea(null)
    setQuery('')
    setNearbyCenters(null)
    setLocationError('')
    setActiveCenter(null)
  }

  return (
    <div className="min-h-screen bg-[#fafbff] text-[#1a1f2e]">
      <Navbar />

      <div
        className="relative overflow-hidden bg-gradient-to-br from-[#0d2b45] to-[#0f3a5a] pt-24 pb-12"
        style={{ paddingTop: '120px' }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[700px] text-sky-400 opacity-[0.07]">
            <LotusDecor />
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/65 text-[10px] tracking-[0.22em] uppercase mb-6 font-medium">
            Center Locator · Pune
          </div>

          <h1 className="font-display text-[clamp(1.9rem,5vw,3.5rem)] font-semibold text-white leading-[1.1] mb-4">
            Find Your Nearest
            <br />
            <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
              Sahaja Yoga Center
            </em>
          </h1>

          <p className="text-white/50 text-[14px] leading-[1.8] max-w-xl mx-auto mb-10">
            Find collective meditation centers, programs,
            and nearby Sahaja Yoga communities.
          </p>

          <div className="relative max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white rounded-2xl shadow-2xl shadow-[#0d2b45]/40 px-4 py-3.5 border border-sky-100/60">
              <input
                type="text"
                value={query}
                onChange={event => {
                  setQuery(event.target.value)
                  setSelectedArea(null)
                  setNearbyCenters(null)
                  setLocationError('')
                }}
                placeholder="Search by Area, Locality, Pincode or Center Name"
                className="flex-1 bg-transparent text-[15px] text-[#1a1f2e] placeholder-sky-400/60 outline-none min-w-0"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-sky-300 hover:text-sky-500"
                >
                  ✕
                </button>
              )}

              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locationLoading}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition-all whitespace-nowrap"
              >
                {locationLoading
                  ? 'Finding...'
                  : 'Use My Location'}
              </button>
            </div>

            {locationError && (
              <p className="mt-3 text-center text-red-300 text-[12px]">
                {locationError}
              </p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {AREA_CHIPS.map(area => (
              <button
                key={area}
                type="button"
                onClick={() => handleAreaChip(area)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 ${
                  selectedArea === area
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-white/12 border border-white/18 text-white/70 hover:bg-white/20'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky top-[100px] z-30 bg-white/96 backdrop-blur-xl border-b border-sky-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3 overflow-x-auto">
          <span className="text-[11px] text-[#1a1f2e]/40 uppercase tracking-widest font-semibold flex-shrink-0">
            Filter
          </span>

          <div className="w-px h-5 bg-sky-100 flex-shrink-0" />

          {FILTER_CHIPS.map(chip => (
            <button
              key={chip.key}
              type="button"
              onClick={() => toggleFilter(chip.key)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                activeFilters.has(chip.key)
                  ? 'bg-[#1a1f2e] text-white shadow-md'
                  : 'bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100'
              }`}
            >
              {chip.label}
              {activeFilters.has(chip.key) && (
                <span className="ml-1.5 text-white/60">
                  ✕
                </span>
              )}
            </button>
          ))}

          {(activeFilters.size > 0 ||
            selectedArea ||
            query ||
            nearbyCenters !== null) && (
            <button
              type="button"
              onClick={clearAll}
              className="flex-shrink-0 px-3 py-1.5 text-[12px] text-red-500 font-medium"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <FadeIn>
          {loading ? (
            <div className="rounded-3xl bg-[#d4eaf5] border border-sky-100 shadow-2xl">
              <div className="flex flex-col items-center justify-center h-[58vh] min-h-[400px]">
                <LotusSpinner />
                <p className="text-sky-600/70 text-[13px]">
                  Finding centers...
                </p>
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

        {!loading && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-semibold">
                {filteredCenters.length}
              </span>

              <span className="text-[#1a1f2e]/55 text-[14px]">
                {filteredCenters.length === 1
                  ? 'center found'
                  : 'centers found'}
                {(query || selectedArea) &&
                  ` for "${query || selectedArea}"`}
              </span>
            </div>

            <div className="text-[12px] text-sky-600 font-medium">
              {
                filteredCenters.filter(
                  center => center.isToday
                ).length
              }{' '}
              active today
            </div>
          </div>
        )}

        {!loading && filteredCenters.length > 0 && (
          <FadeIn>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCenters.map(center => (
                <div
                  key={center.id}
                  id={`center-card-${center.id}`}
                >
                  <CenterCard
                    center={center}
                    isActive={
                      activeCenter === center.id
                    }
                    onSelect={handleSelectCenter}
                  />
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {!loading && filteredCenters.length === 0 && (
          <FadeIn>
            <div className="text-center py-16 px-6">
              <div className="w-24 h-24 text-sky-200 mx-auto mb-5">
                <LotusDecor />
              </div>

              <h3 className="font-display text-2xl font-semibold text-[#1a1f2e] mb-2">
                No centers found
              </h3>

              <p className="text-[#1a1f2e]/50 text-[14px] mb-6">
                We couldn't find a center matching your
                search or filters.
              </p>

              <button
                type="button"
                onClick={clearAll}
                className="px-6 py-3 rounded-full bg-sky-500 text-white font-semibold"
              >
                Show All Centers
              </button>
            </div>
          </FadeIn>
        )}
      </div>

      <footer className="bg-[#0d2b45] text-white/58">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <div className="text-white font-semibold text-[13px]">
              Sahaja Connect – Pune
            </div>

            <div className="text-amber-400 text-[9px] tracking-[0.2em] uppercase">
              Find a Center
            </div>
          </div>

          <div className="text-[12px]">
            © 2026 Sahaja Connect – Pune. All programs are free.
          </div>

          <div className="flex gap-4 text-[12px]">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/">← Homepage</Link>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5">
        {helpOpen && (
          <div className="flex flex-col gap-2 items-end">
            <a
              href="tel:+919876543210"
              className="px-5 py-2.5 rounded-full bg-sky-500 text-white text-[13px] font-semibold shadow-lg"
            >
              Call Coordinator
            </a>

            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full bg-green-500 text-white text-[13px] font-semibold shadow-lg"
            >
              WhatsApp
            </a>
          </div>
        )}

        <button
          type="button"
          onClick={() => setHelpOpen(open => !open)}
          className={`w-14 h-14 rounded-full shadow-2xl flex flex-col items-center justify-center transition-all ${
            helpOpen
              ? 'bg-[#1a1f2e]'
              : 'bg-amber-500 hover:bg-amber-400'
          }`}
        >
          <span className="text-xl">
            {helpOpen ? '✕' : '🌸'}
          </span>

          {!helpOpen && (
            <span className="text-white text-[8px] font-semibold">
              Help
            </span>
          )}
        </button>
      </div>
    </div>
  )
}