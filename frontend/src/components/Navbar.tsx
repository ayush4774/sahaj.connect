import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'

const NAV_LINKS = [
  { label: 'Home',             to: '/' },
  { label: 'Find Centers',     to: '/find-center' },
  { label: 'Events',           to: '/events' },
  { label: 'New Seeker Journey', to: '/journey' },
  { label: 'Volunteer',        to: '/volunteer' },
  { label: 'Contact',          to: '/#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isFindCenter = ['/find-center', '/events'].includes(location.pathname) || location.pathname.startsWith('/center/')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 56)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // On Find Center page the nav is always solid
  const solid = scrolled || isFindCenter

  return (
    <>
      {/* Event ribbon */}
      <div className="fixed top-0 inset-x-0 z-[60] bg-amber-500 text-white h-9 flex items-center justify-center gap-4 text-[12px] font-medium shadow-sm">
        <span className="text-base leading-none">🌼</span>
        <span><strong>Upcoming:</strong> Guru Puja 2026 &nbsp;·&nbsp; 15 August &nbsp;·&nbsp; Pune</span>
        <Link to="/events" className="underline underline-offset-2 font-semibold hover:no-underline transition-all">
          Learn More →
        </Link>
      </div>

      <nav className={`fixed top-9 inset-x-0 z-50 transition-all duration-500 ${solid ? 'bg-white/96 backdrop-blur-xl shadow-sm border-b border-sky-100/80' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-700 flex items-center justify-center shadow-md group-hover:shadow-sky-300/50 transition-shadow">
              <span className="text-white text-xs font-bold tracking-tight">SC</span>
            </div>
            <div className="leading-none">
              <div className={`font-display text-[17px] font-semibold tracking-tight leading-none transition-colors duration-400 ${solid ? 'text-[#1a1f2e]' : 'text-white'}`}>
                Sahaja Connect
              </div>
              <div className={`text-[9px] tracking-[0.2em] uppercase mt-0.5 transition-colors duration-400 ${solid ? 'text-amber-500' : 'text-amber-300'}`}>
                Pune
              </div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map(({ label, to }) => {
              const active = to !== '#' && location.pathname === to
              return (
                <Link
                  key={label}
                  to={to}
                  className={`relative text-[13px] font-medium transition-colors duration-200 hover:text-amber-500 group ${solid ? 'text-[#1a1f2e]/65' : 'text-white/85'} ${active ? '!text-amber-500' : ''}`}
                >
                  {label}
                  <span className={`absolute -bottom-0.5 left-0 h-px bg-amber-400 transition-all duration-300 ease-out ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className={`hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-[11px] font-medium transition-colors duration-200 ${solid ? 'border-sky-100 text-[#1a1f2e]/40 hover:border-sky-300 hover:text-[#1a1f2e]/70' : 'border-white/20 text-white/50 hover:text-white/80'}`}
            >
              ⚙️ Admin
            </Link>
            <Link
              to="/find-center"
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-white text-[13px] font-semibold transition-all duration-200 shadow-md hover:shadow-amber-200/70 hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>📍</span> Find Center
            </Link>
            <button
              onClick={() => setMobileOpen(o => !o)}
              className={`lg:hidden p-2 rounded-xl transition-colors ${solid ? 'text-[#1a1f2e]' : 'text-white'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-xl border-t border-sky-100 px-6 py-5 space-y-1">
            {NAV_LINKS.map(({ label, to }) => (
              <Link key={label} to={to} onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm font-medium text-[#1a1f2e]/70 hover:text-amber-500 transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link to="/find-center" className="block mt-4 px-5 py-3 rounded-full bg-amber-500 text-white text-sm font-semibold text-center">
              📍 Find Center
            </Link>
            <Link to="/admin" onClick={() => setMobileOpen(false)} className="block mt-2 px-5 py-2.5 rounded-full border border-sky-100 text-[#1a1f2e]/50 text-xs font-medium text-center hover:border-sky-300 transition-colors">
              ⚙️ Admin
            </Link>
          </div>
        )}
      </nav>
    </>
  )
}
