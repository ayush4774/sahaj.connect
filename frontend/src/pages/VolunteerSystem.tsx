import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import Navbar from '../components/Navbar'
import LotusDecor from '../components/LotusDecor'

// ─── Data ─────────────────────────────────────────────────────────────────────

const WHY_CARDS = [
  { icon: '❤️', title: 'Help New Seekers Feel Welcome',    desc: 'Be the first warm face a newcomer sees. Your presence makes all the difference.',        color: 'from-rose-400 to-pink-500'     },
  { icon: '🤝', title: 'Serve the Community',             desc: 'Contribute meaningfully to programs that uplift hundreds of seekers at a time.',            color: 'from-sky-400 to-blue-500'      },
  { icon: '🌱', title: 'Learn New Skills',                 desc: 'Event management, photography, translation — gain practical skills while serving.',        color: 'from-emerald-400 to-green-500' },
  { icon: '🎉', title: 'Participate in Major Programs',   desc: 'Be part of Guru Puja, Birthday Puja, and large-scale Pune events up close.',              color: 'from-amber-400 to-orange-500'  },
  { icon: '🧘', title: 'Deepen Your Sahaja Yoga Journey', desc: 'Selfless service (nishkam karma) is itself a profound path of inner transformation.',     color: 'from-violet-400 to-purple-500' },
]

const EVENTS_NEEDING_VOLS = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1608405059861-b21a68ae76a2?w=600&h=340&fit=crop&auto=format',
    name: 'Guru Puja 2026 – Grand Celebration',
    date: 'August 15, 2026',
    venue: 'Bal Gandharva Rang Mandir, Shivaji Nagar',
    needed: 45,
    filled: 28,
    deadline: 'August 12, 2026',
    roles: ['Stage Management', 'Registration Desk', 'Hospitality', 'Photography'],
    badge: 'Festival',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1687436874174-977fdd9e2cb8?w=600&h=340&fit=crop&auto=format',
    name: 'Public Program – Kalyani Nagar',
    date: 'August 10, 2026',
    venue: 'Kalyani Nagar Community Hall',
    needed: 12,
    filled: 5,
    deadline: 'August 9, 2026',
    roles: ['Registration Desk', 'Hospitality', 'Crowd Management'],
    badge: 'Public Program',
    badgeColor: 'bg-sky-100 text-sky-700',
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1687436874774-fa0d4616bec9?w=600&h=340&fit=crop&auto=format',
    name: 'Medical Camp – Aundh',
    date: 'August 28, 2026',
    venue: 'Aundh Community Ground',
    needed: 20,
    filled: 8,
    deadline: 'August 25, 2026',
    roles: ['Medical Assistance', 'Registration Desk', 'Food Distribution', 'Translation'],
    badge: 'Medical Camp',
    badgeColor: 'bg-red-100 text-red-700',
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/photo-1686749143613-0eeacff36894?w=600&h=340&fit=crop&auto=format',
    name: "Children's Sahaja Yoga Camp",
    date: 'August 24, 2026',
    venue: 'Baner Center Lawn',
    needed: 10,
    filled: 3,
    deadline: 'August 22, 2026',
    roles: ["Children's Activities", 'Decoration', 'Hospitality'],
    badge: "Children's",
    badgeColor: 'bg-pink-100 text-pink-700',
  },
]

const SKILL_ROLE_MAP: Record<string, { icon: string; role: string }[]> = {
  'Photography':          [{ icon: '📸', role: 'Event Photography' }, { icon: '🖼️', role: 'Stage Photo Coverage' }],
  'Videography':          [{ icon: '🎥', role: 'Video Documentation' }, { icon: '📺', role: 'Live Streaming Support' }],
  'Social Media':         [{ icon: '📱', role: 'Social Media Coverage' }, { icon: '✍️', role: 'Content Creator' }],
  'Medical Assistance':   [{ icon: '🏥', role: 'Medical Support Team' }, { icon: '💊', role: 'First Aid Coverage' }],
  "Children's Activities":[{ icon: '👶', role: "Children's Coordinator" }, { icon: '🎨', role: 'Creative Activities Lead' }],
  'Stage Management':     [{ icon: '🎭', role: 'Stage Coordinator' }, { icon: '🎤', role: 'MC / Anchor Support' }],
  'Sound System':         [{ icon: '🔊', role: 'Audio Technician' }, { icon: '🎵', role: 'Music Coordination' }],
  'IT Support':           [{ icon: '💻', role: 'Tech Support Lead' }, { icon: '📽️', role: 'Projector & Slides' }],
  'Decoration':           [{ icon: '🌸', role: 'Decor Coordinator' }, { icon: '🎊', role: 'Venue Beautification' }],
  'Registration Desk':    [{ icon: '📋', role: 'Attendee Registration' }, { icon: '🏷️', role: 'Badge & Kit Distribution' }],
  'Hospitality':          [{ icon: '🤲', role: 'Guest Welcome Team' }, { icon: '🧡', role: 'Newcomer Orientation' }],
  'Translation':          [{ icon: '🌐', role: 'Live Interpreter' }, { icon: '📝', role: 'Materials Translation' }],
  'Food Distribution':    [{ icon: '🍽️', role: 'Prasad Distribution' }, { icon: '🧃', role: 'Refreshments Coordinator' }],
  'Driving':              [{ icon: '🚗', role: 'Transport Coordinator' }, { icon: '🗺️', role: 'Carpool Organiser' }],
  'Crowd Management':     [{ icon: '🚶', role: 'Queue & Flow Management' }, { icon: '🟡', role: 'Entry Coordinator' }],
  'Event Management':     [{ icon: '📊', role: 'Event Operations Lead' }, { icon: '📅', role: 'Schedule Coordinator' }],
  'Cleaning':             [{ icon: '🧹', role: 'Venue Maintenance' }, { icon: '♻️', role: 'Post-Event Cleanup' }],
}

const TESTIMONIALS = [
  { text: "Volunteering at Public Programs allowed me to meet wonderful seekers from all over Pune. Every event deepens my own meditation.", name: 'Meera S.', role: 'Volunteer since 2019', initials: 'MS', color: 'from-sky-400 to-blue-600' },
  { text: "I was nervous at first, but the team was so welcoming. Now I volunteer at every major event. It truly feels like serving with love.", name: 'Rajan P.', role: 'Volunteer since 2021', initials: 'RP', color: 'from-amber-400 to-orange-500' },
  { text: "My photography skills found their best purpose at Sahaja events. Capturing seekers' faces during meditation is a gift.", name: 'Divya K.', role: 'Volunteer since 2020', initials: 'DK', color: 'from-emerald-400 to-green-600' },
]

const FAQS = [
  { q: 'Do I need prior experience?',          a: 'Not at all! We welcome first-time volunteers with open arms. All orientation and training is provided before each event.' },
  { q: 'Can I volunteer for only one event?',  a: 'Absolutely. You can choose to volunteer for a single event or as many as you like. Every contribution, however small, is deeply appreciated.' },
  { q: 'Can students volunteer?',              a: "Yes! Students are especially encouraged. It's a wonderful opportunity to develop leadership, event management, and interpersonal skills." },
  { q: 'Will I receive training?',             a: 'Yes. Brief role-specific orientation sessions are held before each event. Experienced volunteers will guide you throughout.' },
  { q: 'What should I bring?',                 a: 'A warm smile and an open heart! Coordinators will inform you of any specific requirements (clothing colour, materials) closer to the event.' },
  { q: 'Can I volunteer as a family?',         a: "Yes — families, couples, and groups of friends are all welcome. In fact, volunteering together is a beautiful shared experience." },
]

const ALL_SKILLS = Object.keys(SKILL_ROLE_MAP).concat(['Cleaning', 'Any Other'])

// ─── Helpers ─────────────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect() } }, { threshold: 0.08 })
    io.observe(el); return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(22px)', transition: `opacity 0.55s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.55s cubic-bezier(0.4,0,0.2,1) ${delay}ms` }}>
      {children}
    </div>
  )
}

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className={`text-[10px] font-semibold tracking-[0.25em] uppercase ${light ? 'text-amber-300' : 'text-amber-500'}`}>{children}</span>
      <span className={`flex-1 h-px bg-gradient-to-r ${light ? 'from-amber-400/40' : 'from-amber-200'} to-transparent`} />
    </div>
  )
}

// ─── Registration Form Modal ──────────────────────────────────────────────────

type FormData = {
  fullName: string; age: string; gender: string; phone: string; whatsapp: string; email: string
  area: string; city: string; pincode: string
  experience: string; yearsOfPractice: string
  skills: Set<string>
  availability: Set<string>
  transport: string
  languages: Set<string>
  emergencyName: string; emergencyRelation: string; emergencyPhone: string
  notes: string
}

const initialForm: FormData = {
  fullName: '', age: '', gender: '', phone: '', whatsapp: '', email: '',
  area: '', city: 'Pune', pincode: '',
  experience: '', yearsOfPractice: '',
  skills: new Set(),
  availability: new Set(),
  transport: '',
  languages: new Set(),
  emergencyName: '', emergencyRelation: '', emergencyPhone: '',
  notes: '',
}

const STEP_TITLES = [
  'Personal Information', 'Location', 'Sahaja Yoga Experience',
  'Your Skills', 'Availability', 'Transportation',
  'Languages', 'Emergency Contact', 'Additional Notes',
]

function VolunteerForm({ eventName, onClose }: { eventName: string; onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [direction, setDirection] = useState<'fwd' | 'bwd'>('fwd')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    setTimeout(() => setVisible(true), 30)
    return () => { document.body.style.overflow = '' }
  }, [])

  const close = () => { setVisible(false); setTimeout(onClose, 300) }

  const goNext = () => {
    if (step < 9) { setDirection('fwd'); setStep(s => s + 1) }
    else setSubmitted(true)
  }
  const goBack = () => {
    if (step > 1) { setDirection('bwd'); setStep(s => s - 1) }
  }

  const setField = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }))
  const toggleSet = (key: 'skills' | 'availability' | 'languages', val: string) =>
    setForm(f => {
      const s = new Set(f[key]); s.has(val) ? s.delete(val) : s.add(val)
      return { ...f, [key]: s }
    })

  const matchedRoles = Array.from(form.skills)
    .flatMap(skill => SKILL_ROLE_MAP[skill] ?? [])
    .filter((v, i, a) => a.findIndex(x => x.role === v.role) === i)
    .slice(0, 6)

  const pct = submitted ? 100 : ((step - 1) / 9) * 100

  const inputCls = "w-full border border-sky-100 rounded-xl px-4 py-2.5 text-[13px] text-[#0d2b45] bg-sky-50/50 focus:outline-none focus:border-sky-300 focus:bg-white transition-all duration-200 placeholder-[#1a1f2e]/30"
  const labelCls = "block text-[11px] font-semibold uppercase tracking-wider text-[#1a1f2e]/45 mb-1.5"

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6"
      style={{ background: `rgba(13,43,69,${visible ? 0.75 : 0})`, transition: 'background 0.3s ease' }}
      onClick={close}
    >
      <div
        className="bg-white w-full md:max-w-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{
          maxHeight: '95vh',
          transform: visible ? 'translateY(0)' : 'translateY(60px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d2b45] to-[#1a3f5c] px-6 py-5 flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-1">Volunteer Registration</div>
              <div className="text-white font-display text-[17px] font-semibold leading-tight">{eventName}</div>
            </div>
            <button onClick={close} className="text-white/40 hover:text-white transition-colors text-2xl leading-none mt-0.5">✕</button>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-amber-400 transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
          </div>
          {!submitted && (
            <div className="flex justify-between mt-2 text-[10px] text-white/40">
              <span>Step {step} of 9 — {STEP_TITLES[step - 1]}</span>
              <span className="font-semibold text-amber-400">{Math.round(pct)}%</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {submitted ? (
            // ─ Success ─
            <div className="p-8 text-center">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <LotusDecor className="w-full h-full text-amber-400" />
                <span className="absolute inset-0 flex items-center justify-center text-3xl">🌸</span>
              </div>
              <h2 className="font-display text-2xl font-semibold text-[#0d2b45] mb-3">Thank You for Volunteering!</h2>
              <p className="text-[14px] text-[#1a1f2e]/65 leading-relaxed mb-6 max-w-md mx-auto">
                Thank you for offering your time and skills. The organizing team will review your registration and contact you if assistance is required for this event.
              </p>
              {matchedRoles.length > 0 && (
                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 text-left mb-6">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 mb-3">🌸 Your Matched Roles</div>
                  <div className="grid grid-cols-2 gap-2">
                    {matchedRoles.map(r => (
                      <div key={r.role} className="flex items-center gap-2 text-[12px] text-[#1a1f2e]/70">
                        <span>{r.icon}</span> {r.role}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={close} className="w-full py-3 rounded-xl bg-[#0d2b45] hover:bg-[#1a3f5c] text-white font-semibold text-[14px] transition-colors">
                Close
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-4" key={step} style={{ animation: `fade-in-up 0.28s cubic-bezier(0.4,0,0.2,1) both` }}>

              {step === 1 && <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={labelCls}>Full Name *</label>
                    <input className={inputCls} placeholder="Your full name" value={form.fullName} onChange={e => setField('fullName', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Age *</label>
                    <input className={inputCls} type="number" placeholder="25" value={form.age} onChange={e => setField('age', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Gender</label>
                    <select className={inputCls} value={form.gender} onChange={e => setField('gender', e.target.value)}>
                      <option value="">Select</option>
                      {['Male', 'Female', 'Prefer not to say'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number *</label>
                    <input className={inputCls} placeholder="+91 98765 43210" value={form.phone} onChange={e => setField('phone', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>WhatsApp Number</label>
                    <input className={inputCls} placeholder="Same or different" value={form.whatsapp} onChange={e => setField('whatsapp', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Email (optional)</label>
                    <input className={inputCls} type="email" placeholder="your@email.com" value={form.email} onChange={e => setField('email', e.target.value)} />
                  </div>
                </div>
              </>}

              {step === 2 && <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={labelCls}>Area / Locality *</label>
                    <input className={inputCls} placeholder="e.g. Kalyani Nagar" value={form.area} onChange={e => setField('area', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>City</label>
                    <input className={inputCls} value={form.city} onChange={e => setField('city', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Pincode</label>
                    <input className={inputCls} placeholder="411006" value={form.pincode} onChange={e => setField('pincode', e.target.value)} />
                  </div>
                </div>
              </>}

              {step === 3 && <>
                <div>
                  <label className={labelCls}>Your connection to Sahaja Yoga *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['New Seeker', 'Sahaja Yogi', 'Youth', 'Parent', 'Friend', 'Family Member'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setField('experience', opt)}
                        className={`py-2.5 px-4 rounded-xl border text-[13px] font-medium transition-all duration-200 text-left ${form.experience === opt ? 'bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-200/50' : 'bg-sky-50 border-sky-100 text-[#1a1f2e]/65 hover:border-sky-300'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelCls}>How long practicing? (optional)</label>
                  <select className={inputCls} value={form.yearsOfPractice} onChange={e => setField('yearsOfPractice', e.target.value)}>
                    <option value="">Select</option>
                    {["Less than 1 year", "1–2 years", "3–5 years", "5–10 years", "More than 10 years"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </>}

              {step === 4 && <>
                <p className="text-[13px] text-[#1a1f2e]/55 -mt-1 mb-1">Select all that apply. We&apos;ll match you with the best volunteer role.</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_SKILLS.map(skill => {
                    const active = form.skills.has(skill)
                    return (
                      <button
                        key={skill}
                        onClick={() => toggleSet('skills', skill)}
                        className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 border ${active ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200/60' : 'bg-white border-sky-100 text-[#1a1f2e]/60 hover:border-sky-300 hover:bg-sky-50'}`}
                      >
                        {active ? '✓ ' : ''}{skill}
                      </button>
                    )
                  })}
                </div>
                {/* Volunteer Match */}
                {matchedRoles.length > 0 && (
                  <div className="bg-gradient-to-br from-amber-50 to-sky-50 rounded-2xl p-4 border border-amber-100 mt-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2">🌸 Volunteer Match — Suggested Roles for You</div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {matchedRoles.map(r => (
                        <div key={r.role} className="flex items-center gap-1.5 text-[12px] text-[#1a1f2e]/70 bg-white rounded-lg px-2.5 py-1.5 border border-amber-100/80">
                          <span>{r.icon}</span> {r.role}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>}

              {step === 5 && <>
                <p className="text-[13px] text-[#1a1f2e]/55 -mt-1 mb-1">When are you available to help? Select all that apply.</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Morning', 'Afternoon', 'Evening', 'Full Day', 'Multiple Days'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => toggleSet('availability', opt)}
                      className={`py-3 rounded-xl border text-[13px] font-medium transition-all duration-200 ${form.availability.has(opt) ? 'bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-200/50' : 'bg-sky-50 border-sky-100 text-[#1a1f2e]/65 hover:border-sky-300'}`}
                    >
                      {form.availability.has(opt) ? '✓ ' : ''}{opt}
                    </button>
                  ))}
                </div>
              </>}

              {step === 6 && <>
                <div className="space-y-2.5">
                  {[
                    { val: 'Own Vehicle', icon: '🚗', desc: 'I have my own transport' },
                    { val: 'Need Transport', icon: '🤲', desc: "I'll need a ride to the venue" },
                    { val: 'Can Offer Carpool', icon: '🚌', desc: 'I can offer a ride to others' },
                  ].map(({ val, icon, desc }) => (
                    <button
                      key={val}
                      onClick={() => setField('transport', val)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${form.transport === val ? 'bg-emerald-50 border-emerald-300 shadow-sm' : 'bg-white border-sky-100 hover:border-sky-200'}`}
                    >
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <div className={`text-[14px] font-semibold ${form.transport === val ? 'text-emerald-700' : 'text-[#0d2b45]'}`}>{val}</div>
                        <div className="text-[11px] text-[#1a1f2e]/45 mt-0.5">{desc}</div>
                      </div>
                      {form.transport === val && <span className="ml-auto text-emerald-500 font-bold text-lg">✓</span>}
                    </button>
                  ))}
                </div>
              </>}

              {step === 7 && <>
                <p className="text-[13px] text-[#1a1f2e]/55 -mt-1 mb-1">Select languages you can communicate in.</p>
                <div className="grid grid-cols-2 gap-2">
                  {['English', 'Marathi', 'Hindi', 'Gujarati', 'Tamil', 'Telugu', 'Other'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => toggleSet('languages', lang)}
                      className={`py-2.5 rounded-xl border text-[13px] font-medium transition-all duration-200 ${form.languages.has(lang) ? 'bg-violet-500 border-violet-500 text-white shadow-md shadow-violet-200/50' : 'bg-sky-50 border-sky-100 text-[#1a1f2e]/65 hover:border-sky-300'}`}
                    >
                      {form.languages.has(lang) ? '✓ ' : ''}{lang}
                    </button>
                  ))}
                </div>
              </>}

              {step === 8 && <>
                <p className="text-[13px] text-[#1a1f2e]/55 -mt-1">Someone we can contact in case of emergency.</p>
                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>Contact Name *</label>
                    <input className={inputCls} placeholder="Full name" value={form.emergencyName} onChange={e => setField('emergencyName', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Relationship</label>
                    <input className={inputCls} placeholder="e.g. Spouse, Parent, Sibling" value={form.emergencyRelation} onChange={e => setField('emergencyRelation', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number *</label>
                    <input className={inputCls} placeholder="+91 98765 43210" value={form.emergencyPhone} onChange={e => setField('emergencyPhone', e.target.value)} />
                  </div>
                </div>
              </>}

              {step === 9 && <>
                <div>
                  <label className={labelCls}>Anything else you&apos;d like us to know?</label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={5}
                    placeholder="Special skills, health considerations, availability notes, or a message for the team..."
                    value={form.notes}
                    onChange={e => setField('notes', e.target.value)}
                  />
                </div>
                <div className="bg-sky-50 rounded-xl p-4 border border-sky-100 text-[12px] text-[#1a1f2e]/60 leading-relaxed">
                  By submitting, you agree that your information will be used only for volunteer coordination for this event. Your details are not shared externally.
                </div>
              </>}
            </div>
          )}
        </div>

        {/* Footer navigation */}
        {!submitted && (
          <div className="border-t border-sky-50 px-6 py-4 flex gap-3 flex-shrink-0 bg-white">
            {step > 1 && (
              <button onClick={goBack} className="px-5 py-2.5 rounded-xl border border-sky-100 text-[13px] font-medium text-[#1a1f2e]/60 hover:border-sky-300 hover:text-[#0d2b45] transition-all duration-200">
                ← Back
              </button>
            )}
            <button
              onClick={goNext}
              className="flex-1 py-2.5 rounded-xl bg-[#0d2b45] hover:bg-[#1a3f5c] text-white text-[13px] font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-sky-900/20"
            >
              {step === 9 ? '🌸 Submit Registration' : 'Continue →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Admin Preview ─────────────────────────────────────────────────────────────

function AdminPreview() {
  const volunteers = [
    { name: 'Priya Kulkarni', event: 'Guru Puja 2026', skills: 'Hospitality, Registration', area: 'Kalyani Nagar', status: 'Confirmed', statusCls: 'bg-emerald-100 text-emerald-700' },
    { name: 'Rahul Deshmukh', event: 'Guru Puja 2026', skills: 'Stage, Sound System',      area: 'Viman Nagar',   status: 'Pending',   statusCls: 'bg-amber-100 text-amber-700'   },
    { name: 'Sunita Pawar',   event: 'Medical Camp',   skills: 'Medical Assistance',        area: 'Aundh',         status: 'Confirmed', statusCls: 'bg-emerald-100 text-emerald-700' },
    { name: 'Vikram Joshi',   event: 'Public Program', skills: 'Photography, Social Media', area: 'Koregaon Park', status: 'Confirmed', statusCls: 'bg-emerald-100 text-emerald-700' },
    { name: 'Anita Sharma',   event: "Children's Camp",skills: "Children's, Decoration",   area: 'Baner',         status: 'Pending',   statusCls: 'bg-amber-100 text-amber-700'   },
  ]

  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-sky-50 bg-[#0d2b45] flex flex-wrap items-center gap-3">
        <span className="text-white font-semibold text-[14px]">Admin Dashboard – Volunteer Management</span>
        <div className="flex gap-2 ml-auto">
          {['Filter by Event', 'Filter by Skills', 'Filter by Area'].map(f => (
            <button key={f} className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-[11px] font-medium hover:bg-white/20 transition-colors">{f}</button>
          ))}
          <button className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[11px] font-semibold hover:bg-amber-400 transition-colors">⬇ Export CSV</button>
        </div>
      </div>
      {/* Stats strip */}
      <div className="grid grid-cols-4 divide-x divide-sky-50 border-b border-sky-50">
        {[{ v: '87', l: 'Total Registered' }, { v: '62', l: 'Confirmed' }, { v: '25', l: 'Pending Review' }, { v: '4', l: 'Events Active' }].map(({ v, l }) => (
          <div key={l} className="py-3 px-4 text-center">
            <div className="font-display text-xl font-bold text-[#0d2b45]">{v}</div>
            <div className="text-[10px] text-[#1a1f2e]/40 uppercase tracking-wider">{l}</div>
          </div>
        ))}
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead className="bg-sky-50/80">
            <tr>
              {['Name', 'Event', 'Skills', 'Area', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left font-semibold text-[#1a1f2e]/45 uppercase tracking-wider text-[10px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {volunteers.map((v, i) => (
              <tr key={i} className="border-t border-sky-50 hover:bg-sky-50/30 transition-colors">
                <td className="px-4 py-3 font-semibold text-[#0d2b45]">{v.name}</td>
                <td className="px-4 py-3 text-[#1a1f2e]/60">{v.event}</td>
                <td className="px-4 py-3 text-[#1a1f2e]/55">{v.skills}</td>
                <td className="px-4 py-3 text-[#1a1f2e]/55">{v.area}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${v.statusCls}`}>{v.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-600 text-[10px] font-medium hover:bg-sky-100 transition-colors">Assign</button>
                    <button className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-medium hover:bg-emerald-100 transition-colors">Contact</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VolunteerSystem() {
  const [formEvent, setFormEvent] = useState<{ id: number; name: string } | null>(null)
  const [openFaq, setOpenFaq]     = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-body">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[72vh] min-h-[500px] flex items-center overflow-hidden mt-[calc(2.25rem+4rem)]">
        <img
          src="https://images.unsplash.com/photo-1784803025896-475a952aba71?w=1800&h=900&fit=crop&auto=format"
          alt="Volunteers at Sahaja event"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ willChange: 'transform' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2b45]/90 via-[#0d2b45]/65 to-[#0d2b45]/20" />
        <LotusDecor className="absolute right-0 bottom-0 w-80 h-80 text-amber-400 opacity-[0.07] translate-x-16 translate-y-16" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <FadeIn>
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-amber-300">Serve with Love</span>
                <span className="h-px w-10 bg-amber-400/60" />
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-semibold text-white leading-[1.08] mb-5">
                🌸 Serve with Love
              </h1>
              <p className="text-white/70 text-[15px] md:text-[17px] leading-relaxed mb-8 max-w-xl">
                Every successful Sahaja Yoga program is made possible by dedicated volunteers.
                Whether you can help for one hour or an entire day, your contribution is valuable.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <a href="#events" className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-[14px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-400/40">
                  🤝 Become a Volunteer
                </a>
                <Link to="/events" className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-sm text-white font-bold text-[14px] transition-all duration-200 hover:-translate-y-0.5">
                  📅 View Upcoming Events
                </Link>
              </div>
              <div className="text-white/40 text-[12px] font-medium">
                No prior volunteering experience required &nbsp;•&nbsp; Everyone is welcome
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Floating chips */}
        <div className="absolute bottom-8 right-6 lg:right-10 hidden md:flex flex-col gap-2">
          {[{ v: '87', l: 'Active Volunteers' }, { v: '4', l: 'Events This Month' }, { v: '100%', l: 'Free Service' }].map(({ v, l }) => (
            <div key={l} className="card-glass-new rounded-xl px-4 py-2 flex items-center gap-3">
              <span className="font-display text-xl font-bold text-amber-400">{v}</span>
              <span className="text-white/70 text-[11px]">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Volunteer ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeIn className="py-16">
          <SectionLabel>Why Volunteer?</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-10">
            More than just helping out
          </h2>
          <div className="grid md:grid-cols-5 gap-5">
            {WHY_CARDS.map(({ icon, title, desc, color }, i) => (
              <FadeIn key={title} delay={i * 60}>
                <div className={`relative rounded-2xl overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-90`} />
                  <div className="relative p-5 text-white">
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{icon}</div>
                    <div className="font-semibold text-[14px] mb-2 leading-snug">{title}</div>
                    <div className="text-white/75 text-[11px] leading-relaxed">{desc}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        {/* ── Upcoming Events ───────────────────────────────────────────────── */}
        <div id="events">
          <FadeIn>
            <SectionLabel>Help Needed</SectionLabel>
            <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-8">Upcoming Events Needing Volunteers</h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6 mb-24">
            {EVENTS_NEEDING_VOLS.map((ev, i) => (
              <FadeIn key={ev.id} delay={i * 70}>
                <div className="bg-white rounded-2xl overflow-hidden border border-sky-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <img src={ev.img} alt={ev.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d2b45]/60 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${ev.badgeColor}`}>{ev.badge}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-white font-display text-[17px] font-semibold leading-tight">{ev.name}</div>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="space-y-1.5 text-[12px] text-[#1a1f2e]/55 mb-4">
                      <div>📅 {ev.date}</div>
                      <div>📍 {ev.venue}</div>
                      <div>⏰ Deadline: {ev.deadline}</div>
                    </div>
                    {/* Volunteer fill bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[11px] text-[#1a1f2e]/45 mb-1.5">
                        <span>{ev.filled} volunteers registered</span>
                        <span className="font-semibold text-amber-600">{ev.needed - ev.filled} spots left</span>
                      </div>
                      <div className="h-2 rounded-full bg-sky-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700"
                          style={{ width: `${(ev.filled / ev.needed) * 100}%` }}
                        />
                      </div>
                    </div>
                    {/* Roles needed */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {ev.roles.map(r => (
                        <span key={r} className="text-[10px] px-2.5 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-600 font-medium">{r}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => setFormEvent({ id: ev.id, name: ev.name })}
                      className="mt-auto w-full py-3 rounded-xl bg-[#0d2b45] hover:bg-[#1a3f5c] text-white font-semibold text-[13px] transition-all duration-200 hover:shadow-lg hover:shadow-sky-900/20"
                    >
                      🤝 Volunteer for This Event
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* ── Volunteer Stories ─────────────────────────────────────────────── */}
        <FadeIn className="mb-24">
          <SectionLabel>Voices</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-8">Volunteer Stories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 80}>
                <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm hover:shadow-lg transition-shadow duration-300 relative">
                  <div className="text-5xl text-sky-100 font-serif absolute top-4 right-5 leading-none select-none">&ldquo;</div>
                  <p className="text-[14px] text-[#1a1f2e]/70 leading-relaxed mb-5 relative">{t.text}</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0`}>{t.initials}</div>
                    <div>
                      <div className="text-[13px] font-semibold text-[#0d2b45]">{t.name}</div>
                      <div className="text-[11px] text-[#1a1f2e]/45">{t.role}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <FadeIn className="mb-24">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-8">Common Questions</h2>
          <div className="max-w-3xl space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
                <button className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
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

        {/* ── Contact Volunteer Team ────────────────────────────────────────── */}
        <FadeIn className="mb-24">
          <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-sky-50 border border-amber-100 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <SectionLabel>Contact Us</SectionLabel>
                <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-4">Contact the Volunteer Team</h2>
                <p className="text-[15px] text-[#1a1f2e]/65 leading-relaxed mb-6">
                  Have a question before signing up? Our volunteer coordinators are happy to help you find the right role.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="tel:+919876543210" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0d2b45] hover:bg-[#1a3f5c] text-white text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5">📞 Call</a>
                  <a href="https://wa.me/919876543210" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5">💬 WhatsApp</a>
                  <a href="mailto:volunteer@sahaja.in" className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#0d2b45]/20 hover:border-[#0d2b45]/40 text-[#0d2b45] text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5">✉️ Email</a>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '🕐', q: 'When do I need to arrive?', a: '1 hour before the event starts' },
                  { icon: '👕', q: 'Is there a dress code?',     a: 'Coordinators will advise per event' },
                  { icon: '🍽️', q: 'Is food provided?',          a: 'Prasad and refreshments for all volunteers' },
                  { icon: '📋', q: 'Do I get a certificate?',    a: 'Appreciation card after each event' },
                ].map(({ icon, q, a }) => (
                  <div key={q} className="bg-white rounded-xl p-3.5 border border-sky-100 shadow-sm">
                    <div className="text-xl mb-1.5">{icon}</div>
                    <div className="text-[11px] font-semibold text-[#0d2b45] mb-1 leading-snug">{q}</div>
                    <div className="text-[10px] text-emerald-600 font-medium">{a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── Admin Preview ─────────────────────────────────────────────────── */}
        <FadeIn className="mb-24">
          <SectionLabel>For Organisers</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-3">Admin Dashboard Preview</h2>
          <p className="text-[#1a1f2e]/55 text-[14px] mb-8 max-w-xl">
            Event coordinators get a clean overview of all volunteer registrations, with powerful filtering and direct contact tools.
          </p>
          <AdminPreview />
        </FadeIn>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0d2b45] text-white/70 py-12 px-6 lg:px-10 relative overflow-hidden">
        <LotusDecor className="absolute -right-20 -bottom-20 w-72 h-72 text-white opacity-[0.04]" />
        <div className="max-w-7xl mx-auto relative flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <div className="font-display text-lg font-semibold text-white mb-1">Sahaja Connect Pune — Volunteer</div>
            <div className="text-[12px]">Serving the community with love, one program at a time.</div>
          </div>
          <div className="flex gap-5 text-[13px]">
            <Link to="/"            className="hover:text-amber-400 transition-colors">Home</Link>
            <Link to="/events"      className="hover:text-amber-400 transition-colors">Events</Link>
            <Link to="/find-center" className="hover:text-amber-400 transition-colors">Find a Center</Link>
            <Link to="/journey"     className="hover:text-amber-400 transition-colors">New Seeker</Link>
          </div>
        </div>
      </footer>

      {/* ── Mobile sticky bar ────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/97 backdrop-blur-xl border-t border-sky-100 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 py-3">
        <div className="grid grid-cols-2 gap-2">
          <a href="#events" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 text-white text-[12px] font-bold">
            🤝 Volunteer Now
          </a>
          <Link to="/events" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0d2b45] text-white text-[12px] font-bold">
            📅 View Events
          </Link>
        </div>
      </div>
      <div className="h-20 md:hidden" />

      {/* Registration form modal */}
      {formEvent && <VolunteerForm eventName={formEvent.name} onClose={() => setFormEvent(null)} />}
    </div>
  )
}
