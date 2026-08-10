import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router'
import Navbar from '../components/Navbar'
import LotusDecor from '../components/LotusDecor'

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS = [
  { num: 1, label: 'Welcome',         icon: '🌱', chakra: 'Muladhara',  bg: 'from-red-400 to-rose-500',      dot: 'bg-red-400'    },
  { num: 2, label: 'Sahaja Yoga',     icon: '💫', chakra: 'Svadhishthana', bg: 'from-orange-400 to-amber-500', dot: 'bg-orange-400' },
  { num: 3, label: 'Shri Mataji',     icon: '🙏', chakra: 'Manipura',   bg: 'from-amber-400 to-yellow-500',  dot: 'bg-amber-400'  },
  { num: 4, label: 'Self-Realization',icon: '✨', chakra: 'Anahata',    bg: 'from-emerald-400 to-green-500', dot: 'bg-emerald-400'},
  { num: 5, label: 'Find a Center',   icon: '📍', chakra: 'Vishuddhi',  bg: 'from-sky-400 to-blue-500',      dot: 'bg-sky-400'    },
  { num: 6, label: 'First Collective',icon: '🧘', chakra: 'Agnya',      bg: 'from-indigo-400 to-violet-500', dot: 'bg-indigo-400' },
  { num: 7, label: 'Your Journey',    icon: '🌸', chakra: 'Sahasrara',  bg: 'from-violet-500 to-purple-600', dot: 'bg-violet-500' },
]

const TOPICS = [
  { title: 'Meditation',          icon: '🧘', color: 'bg-sky-50 border-sky-200', hdr: 'text-sky-700', body: "Sahaja Yoga meditation is effortless and natural. Unlike other techniques, it requires no concentration or visualization — simply allow the mind to settle into silence." },
  { title: 'Inner Peace',         icon: '☮️', color: 'bg-amber-50 border-amber-200', hdr: 'text-amber-700', body: "Regular meditation brings genuine inner peace — not as a temporary calm, but as a stable state of being. Practitioners often describe stress dissolving after just a few sessions." },
  { title: 'Self-Realization',    icon: '✨', color: 'bg-emerald-50 border-emerald-200', hdr: 'text-emerald-700', body: "Self Realization is the awakening of the Kundalini energy within you. You may feel a cool, gentle breeze on your palms and the top of your head — a tangible, physical experience." },
  { title: 'Kundalini',           icon: '🌿', color: 'bg-violet-50 border-violet-200', hdr: 'text-violet-700', body: "Kundalini is a dormant energy that resides at the base of the spine. In Sahaja Yoga, this energy gently awakens and rises, nourishing each chakra and culminating in Self Realization." },
  { title: 'Collective Meditation', icon: '🤝', color: 'bg-rose-50 border-rose-200', hdr: 'text-rose-700', body: "Meditating together amplifies the experience. In a collective, the combined energy of the group deepens everyone's meditation. Centers across Pune hold weekly collective sessions open to all." },
]

const MATAJI_MILESTONES = [
  { year: '1923', event: 'Born in Chhindwara, India on Navaratri — an auspicious beginning' },
  { year: '1947', event: 'Participated in India\'s Independence movement alongside Mahatma Gandhi' },
  { year: '1970', event: 'Discovered the technique for giving Self Realization to masses' },
  { year: '1972', event: 'First public program in India, beginning the global expansion of Sahaja Yoga' },
  { year: '1994', event: 'Received the UN Peace Medal; over 80 countries practicing Sahaja Yoga' },
  { year: '2011', event: 'Left her physical body on February 23, leaving behind millions of seekers worldwide' },
]

const CHECKLIST = [
  { icon: '✓', text: 'Meditation is completely free — no cost, ever',   color: 'text-emerald-600' },
  { icon: '✓', text: 'Wear comfortable, modest clothing',               color: 'text-sky-600'     },
  { icon: '✓', text: 'Arrive 10 minutes early for newcomer orientation', color: 'text-amber-600'  },
  { icon: '✓', text: 'Remove footwear at the entrance',                 color: 'text-violet-600'  },
  { icon: '✓', text: 'Families and children are warmly welcome',        color: 'text-rose-600'    },
  { icon: '✓', text: 'Friendly volunteers will guide you throughout',   color: 'text-indigo-600'  },
  { icon: '✓', text: 'No registration or booking required',             color: 'text-teal-600'    },
  { icon: '✓', text: 'You can ask questions any time',                  color: 'text-orange-600'  },
]

const TWENTY_ONE_DAYS = [
  { day: 1,  title: 'Thoughtless Awareness',    tip: 'Sit quietly for 5 minutes. Watch thoughts without engaging — let them float away like clouds.' },
  { day: 2,  title: 'Foot Soaking',             tip: 'Fill a basin with warm salted water. Place feet in while meditating. Deeply grounding.' },
  { day: 3,  title: 'Bandhan & Kundalini',      tip: 'Learn the simple hand movements to raise Kundalini and give yourself a Bandhan of protection.' },
  { day: 4,  title: 'The Left Side',            tip: 'Work on the left channel (Ida Nadi). Light a candle on your left and hold your right hand towards it.' },
  { day: 5,  title: 'The Right Side',           tip: 'Balance the right channel (Pingala Nadi). Ice on the liver, attention on the left side.' },
  { day: 6,  title: 'Feeling the Chakras',      tip: 'During meditation, notice which fingertips tingle. Each finger corresponds to a specific chakra.' },
  { day: 7,  title: 'Nature Meditation',        tip: 'Meditate outdoors in bare feet on grass or earth. The Mother Earth absorbs excess right-side energy.' },
  { day: 8,  title: 'Music & Meditation',       tip: 'Listen to Indian classical ragas while meditating. Certain scales activate specific chakras.' },
  { day: 9,  title: 'Affirmations',             tip: 'Repeat simple affirmations for each chakra while placing your hand on that area.' },
  { day: 10, title: 'The Heart Chakra',         tip: 'Place your right hand on your heart and affirm "In my spirit, I am my own master."' },
  { day: 11, title: 'Collective Experience',    tip: 'Attend a center this week. Notice how the energy of collective meditation amplifies your own.' },
  { day: 12, title: 'Morning Meditation',       tip: 'Try meditating at sunrise. The early morning hours are especially conducive to deep meditation.' },
  { day: 13, title: 'Gratitude Practice',       tip: 'Begin meditation by placing attention on the heart and feeling gratitude for three things.' },
  { day: 14, title: 'Two-Week Milestone',       tip: "Reflect on changes in your mood, sleep, and stress. Many seekers notice improvement by this point." },
  { day: 15, title: 'Clearing the Agnya',       tip: 'Forgive everyone — including yourself. Ego and superego block the Agnya chakra. Forgiving clears it.' },
  { day: 16, title: 'Attention & Awareness',    tip: 'Throughout the day, periodically bring attention to the top of your head. Notice the cool breeze.' },
  { day: 17, title: 'The Sahasrara',            tip: 'The crown chakra is the seat of integration. Slow, deep breathing while focusing above the head.' },
  { day: 18, title: 'Sharing the Experience',  tip: 'Tell one person you trust about Sahaja Yoga. Sharing deepens your own experience.' },
  { day: 19, title: 'Evening Cleanse',          tip: 'End each day with a footsoak and brief meditation. Review the day with detachment and forgiveness.' },
  { day: 20, title: 'Silent Sitting',           tip: 'A full 20 minutes of silent, effortless meditation today. No guidance, just awareness.' },
  { day: 21, title: 'Living Sahaja Yoga',       tip: 'Meditation is not separate from life — it is a way of living. You are now a Sahaja Yogi. 🌸' },
]

const DAILY_TIPS = [
  'Try 5 minutes of footsoaking tonight — warm water, a pinch of salt.',
  'Sit with palms facing up. Notice any cool breeze on your fingertips.',
  'Forgive everyone today — including yourself. It clears the Agnya chakra.',
  'Meditate barefoot on grass or earth for 10 minutes this morning.',
  'Place your right hand on your heart and breathe slowly for 3 minutes.',
  'Notice the silence between your thoughts during your next meditation.',
  'Attend a collective session this week — group energy amplifies the experience.',
]

const FAQS = [
  { q: 'Is meditation free?',              a: 'Yes — always and completely. No fee, donation, or membership is ever required for any Sahaja Yoga program or session, anywhere in the world.' },
  { q: 'Can children attend?',             a: "Absolutely! Children are especially welcome. Many centers offer dedicated children's programs, and kids can join adult collective sessions as well." },
  { q: 'What should I wear?',             a: 'Comfortable, modest clothing. Loose-fitting clothes work best for sitting in meditation. You will remove your footwear at the entrance.' },
  { q: 'Can I come alone?',               a: 'Of course! Many seekers come alone for their first session and leave feeling part of a warm, welcoming community. You are never truly alone in Sahaja Yoga.' },
  { q: 'How long does meditation last?',   a: 'Newcomer sessions typically run 90 minutes — 30 minutes for orientation, followed by a guided collective meditation. Evening sessions start at 6:30 PM.' },
  { q: 'What if I feel nothing?',          a: "Don't worry. The experience varies person to person. Some feel the cool breeze immediately, others need a few sessions. There is no right or wrong experience." },
]

const CENTERS_NEARBY = [
  { name: 'Kalyani Nagar Center', distance: '3.2 km', time: '6:30 PM', days: 'Mon, Wed, Fri', color: 'bg-sky-500' },
  { name: 'Koregaon Park Center', distance: '4.1 km', time: '6:00 PM', days: 'Tue, Thu, Sat', color: 'bg-emerald-500' },
  { name: 'Viman Nagar Center',   distance: '5.4 km', time: '6:30 PM', days: 'Mon–Sat',       color: 'bg-violet-500'  },
]

const QUOTES = [
  { text: "You have to know yourself. You have to know your spirit.", attr: 'Shri Mataji Nirmala Devi' },
  { text: "The time has come for all of us to become the Spirit.", attr: 'Shri Mataji Nirmala Devi'   },
  { text: "Sahaja means born with you. Yoga means union with the Divine.", attr: 'Shri Mataji Nirmala Devi' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function FadeStep({ children, stepKey }: { children: React.ReactNode; stepKey: number }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30)
    return () => clearTimeout(t)
  }, [stepKey])
  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}>
      {children}
    </div>
  )
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect() } }, { threshold: 0.1 })
    io.observe(el); return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ current, completed }: { current: number; completed: Set<number> }) {
  return (
    <div className="bg-white border-b border-sky-100 shadow-sm sticky top-[calc(2.25rem+4rem)] z-40">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => {
            const done = completed.has(s.num)
            const active = current === s.num
            return (
              <div key={s.num} className="flex items-center flex-1 min-w-0">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-500 shadow-sm
                  ${done ? 'bg-amber-500 text-white shadow-amber-200/70' : active ? 'bg-[#0d2b45] text-white shadow-sky-200/50 scale-110' : 'bg-sky-50 text-[#1a1f2e]/30 border border-sky-100'}`}
                >
                  {done ? '✓' : s.icon}
                </div>
                <div className="hidden md:block ml-1.5 truncate">
                  <span className={`text-[10px] font-semibold uppercase tracking-wide transition-colors ${active ? 'text-[#0d2b45]' : done ? 'text-amber-500' : 'text-[#1a1f2e]/30'}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 mx-2 h-0.5 rounded-full overflow-hidden bg-sky-100">
                    <div className={`h-full rounded-full bg-amber-400 transition-all duration-700 ${done ? 'w-full' : 'w-0'}`} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-[#1a1f2e]/40">
          <span>{completed.size} of 7 steps completed</span>
          <span className="font-semibold text-amber-500">{Math.round((completed.size / 7) * 100)}% of journey</span>
        </div>
      </div>
    </div>
  )
}

// ─── Journey Companion ─────────────────────────────────────────────────────────

function JourneyCompanion({ current, completed, tipIdx }: { current: number; completed: Set<number>; tipIdx: number }) {
  const [open, setOpen] = useState(true)
  const step = STEPS[current - 1]
  const nextStep = STEPS[current] // 0-indexed, so STEPS[current] is next
  const pct = Math.round((completed.size / 7) * 100)

  return (
    <div className="fixed right-4 top-[calc(2.25rem+4rem+100px)] z-30 hidden xl:block w-60">
      <div className="card-glass-gold rounded-2xl overflow-hidden shadow-xl border border-amber-200/50">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d2b45] to-[#1a3f5c] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LotusDecor className="w-5 h-5 text-amber-400" />
            <span className="text-white text-[11px] font-bold uppercase tracking-wider">Journey Companion</span>
          </div>
          <button onClick={() => setOpen(o => !o)} className="text-white/50 hover:text-white text-sm transition-colors">{open ? '−' : '+'}</button>
        </div>

        {open && (
          <div className="p-4 space-y-3.5 bg-white/90 backdrop-blur-sm">
            {/* Current step */}
            {step && (
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-amber-500 mb-1">🌱 Current Step</div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{step.icon}</span>
                  <span className="text-[12px] font-semibold text-[#0d2b45]">{step.label}</span>
                </div>
              </div>
            )}
            {/* Next step */}
            {nextStep && (
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-sky-400 mb-1">✨ Up Next</div>
                <div className="flex items-center gap-2 opacity-65">
                  <span className="text-lg">{nextStep.icon}</span>
                  <span className="text-[11px] text-[#0d2b45]">{nextStep.label}</span>
                </div>
              </div>
            )}
            {/* Nearest center */}
            <div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-emerald-500 mb-1">📍 Nearest Center</div>
              <div className="text-[11px] text-[#1a1f2e]/70 leading-snug">Kalyani Nagar<br /><span className="text-emerald-600 font-medium">3.2 km · 6:30 PM</span></div>
            </div>
            {/* Next program */}
            <div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-violet-500 mb-1">📅 Next Program</div>
              <div className="text-[11px] text-[#1a1f2e]/70 leading-snug">Aug 10 · Public Program<br /><span className="text-violet-600 font-medium">Beginner Friendly</span></div>
            </div>
            {/* Tip */}
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
              <div className="text-[9px] font-bold uppercase tracking-widest text-amber-500 mb-1">🧘 Daily Tip</div>
              <div className="text-[11px] text-[#1a1f2e]/65 leading-relaxed">{DAILY_TIPS[tipIdx % DAILY_TIPS.length]}</div>
            </div>
            {/* Progress ring */}
            <div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-[#1a1f2e]/40 mb-2">🌸 Journey Progress</div>
              <div className="h-2 rounded-full bg-sky-100 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-[9px] text-[#1a1f2e]/40 mt-1">
                <span>{completed.size}/7 steps</span>
                <span className="font-semibold text-amber-500">{pct}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Step Components ──────────────────────────────────────────────────────────

function Step1({ onNext }: { onNext: () => void }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-24 h-24 mx-auto mb-6 relative">
          <LotusDecor className="w-full h-full text-amber-400 opacity-80" />
          <span className="absolute inset-0 flex items-center justify-center text-4xl">🌱</span>
        </div>
        <h2 className="font-display text-4xl font-semibold text-[#0d2b45] mb-4">Welcome, dear seeker.</h2>
        <p className="text-[16px] text-[#1a1f2e]/65 leading-relaxed max-w-xl mx-auto">
          We&apos;re so glad you&apos;re here. Whatever brought you to this page — curiosity, a recommendation, or a quiet inner call — you&apos;re in the right place.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {[
          { icon: '🕊️', title: 'No pressure',    body: 'Go at your own pace. This journey has no deadlines, no tests, no expectations.' },
          { icon: '💛', title: 'Always free',    body: 'Sahaja Yoga is a gift to humanity. Nothing on this journey costs anything, ever.' },
          { icon: '🌍', title: 'For everyone',   body: 'Regardless of background, belief, or experience — you are welcome here.' },
        ].map(({ icon, title, body }) => (
          <div key={title} className="bg-gradient-to-br from-white to-sky-50/50 rounded-2xl p-5 border border-sky-100 shadow-sm text-center">
            <div className="text-3xl mb-3">{icon}</div>
            <div className="font-semibold text-[#0d2b45] mb-1.5 text-[15px]">{title}</div>
            <div className="text-[13px] text-[#1a1f2e]/60 leading-relaxed">{body}</div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-sky-50 to-amber-50 rounded-2xl p-6 border border-sky-100 mb-8 text-center">
        <p className="text-[15px] text-[#1a1f2e]/70 italic font-display leading-relaxed">
          &ldquo;The journey of a thousand miles begins with a single step.
          Your first step in Sahaja Yoga is simply to be here, open and willing.&rdquo;
        </p>
      </div>

      <div className="text-center">
        <button onClick={onNext} className="px-10 py-4 rounded-full bg-gradient-to-r from-[#0d2b45] to-[#1a3f5c] text-white font-semibold text-[15px] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-300/30 transition-all duration-200">
          Continue →
        </button>
        <div className="mt-3 text-[11px] text-[#1a1f2e]/35">Step 1 of 7 · Estimated time: 2 minutes</div>
      </div>
    </div>
  )
}

function Step2({ onNext }: { onNext: () => void }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-display text-4xl font-semibold text-[#0d2b45] mb-3">What is Sahaja Yoga?</h2>
        <p className="text-[15px] text-[#1a1f2e]/60 leading-relaxed max-w-lg mx-auto">
          Sahaja Yoga is a simple, free technique for achieving a state of inner peace through meditation. Tap each card to explore.
        </p>
      </div>

      <div className="space-y-3 mb-10">
        {TOPICS.map((t, i) => (
          <div key={t.title} className={`rounded-2xl border transition-all duration-300 overflow-hidden ${t.color}`}>
            <button className="w-full flex items-center gap-4 p-5 text-left" onClick={() => setOpen(open === i ? null : i)}>
              <span className="text-2xl flex-shrink-0">{t.icon}</span>
              <span className={`font-semibold text-[15px] flex-1 ${t.hdr}`}>{t.title}</span>
              <span className={`text-[18px] transition-transform duration-300 ${open === i ? 'rotate-45' : ''} ${t.hdr}`}>+</span>
            </button>
            <div className={`overflow-hidden transition-all duration-400 ${open === i ? 'max-h-40' : 'max-h-0'}`}>
              <p className="px-5 pb-5 pt-0 text-[13px] text-[#1a1f2e]/70 leading-relaxed">{t.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0d2b45] rounded-2xl p-6 text-center mb-8 relative overflow-hidden">
        <LotusDecor className="absolute -right-6 -top-6 w-28 h-28 text-white opacity-[0.05]" />
        <p className="text-amber-300 font-display text-[17px] italic leading-relaxed relative">
          &ldquo;Sahaja means born with you. Yoga means union with the Divine.
          The technique for this union is also born with you.&rdquo;
        </p>
        <p className="text-white/40 text-[11px] mt-3 relative">— Shri Mataji Nirmala Devi</p>
      </div>

      <div className="text-center">
        <button onClick={onNext} className="px-10 py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-[15px] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200">
          Continue →
        </button>
      </div>
    </div>
  )
}

function Step3({ onNext }: { onNext: () => void }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-display text-4xl font-semibold text-[#0d2b45] mb-3">Meet Shri Mataji</h2>
        <p className="text-[15px] text-[#1a1f2e]/60 max-w-lg mx-auto leading-relaxed">
          The founder of Sahaja Yoga — a mother, visionary, and one of the most remarkable spiritual figures of the 20th century.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8 mb-10 items-start">
        {/* Portrait */}
        <div className="md:col-span-2">
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-amber-100">
            <img
              src="https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=400&h=500&fit=crop&auto=format"
              alt="Peaceful meditation"
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d2b45]/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-white font-display text-[17px] font-semibold">Shri Mataji Nirmala Devi</div>
              <div className="text-amber-300 text-[11px] mt-0.5">1923 – 2011 · Founder of Sahaja Yoga</div>
            </div>
          </div>
        </div>
        {/* Bio + Timeline */}
        <div className="md:col-span-3 space-y-5">
          <p className="text-[14px] text-[#1a1f2e]/65 leading-relaxed">
            Born on March 21, 1923, Shri Mataji Nirmala Devi devoted her life to the spiritual awakening of humanity. On May 5, 1970, she discovered the method of giving Self Realization to the masses — an event that changed millions of lives worldwide.
          </p>
          <p className="text-[14px] text-[#1a1f2e]/65 leading-relaxed">
            Over four decades she travelled extensively, holding thousands of free public programs and establishing Sahaja Yoga centers in over 100 countries. She received numerous international awards, including the UN Peace Medal.
          </p>
          {/* Timeline */}
          <div className="space-y-3">
            {MATAJI_MILESTONES.map(({ year, event }) => (
              <div key={year} className="flex gap-3 items-start">
                <span className="font-display text-[13px] font-bold text-amber-500 flex-shrink-0 w-10">{year}</span>
                <div className="flex-1 flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                  <span className="text-[12px] text-[#1a1f2e]/65 leading-relaxed">{event}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <button onClick={onNext} className="px-10 py-4 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold text-[15px] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200">
          Continue →
        </button>
      </div>
    </div>
  )
}

function Step4({ onNext }: { onNext: () => void }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">✨</div>
        <h2 className="font-display text-4xl font-semibold text-[#0d2b45] mb-3">Experience Self-Realization</h2>
        <p className="text-[15px] text-[#1a1f2e]/60 leading-relaxed max-w-lg mx-auto">
          Self Realization is not a belief — it&apos;s a living experience. Choose how you&apos;d like to receive it today.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {[
          {
            icon: '🏠', title: 'Receive at Home',
            desc: 'Watch an official guided meditation video and receive Self Realization in the comfort of your home.',
            action: 'Watch Guided Meditation',
            color: 'from-sky-400 to-blue-600',
            bg: 'bg-sky-50 border-sky-200',
          },
          {
            icon: '🧘', title: 'At a Center',
            desc: 'Visit your nearest Sahaja Yoga center for a personal guided session with an experienced practitioner.',
            action: 'Find Nearest Center',
            color: 'from-emerald-400 to-green-600',
            bg: 'bg-emerald-50 border-emerald-200',
          },
          {
            icon: '📅', title: 'Public Program',
            desc: 'Attend a beginner-friendly public program. Warm, welcoming, free — and open to everyone.',
            action: 'View Programs',
            color: 'from-violet-400 to-purple-600',
            bg: 'bg-violet-50 border-violet-200',
          },
        ].map(({ icon, title, desc, action, color, bg }) => (
          <div key={title} className={`${bg} border rounded-2xl p-6 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer group`}>
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} mx-auto mb-4 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
              {icon}
            </div>
            <h3 className="font-semibold text-[#0d2b45] text-[15px] mb-2">{title}</h3>
            <p className="text-[12px] text-[#1a1f2e]/60 leading-relaxed mb-4">{desc}</p>
            <span className={`inline-block text-[11px] font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{action} →</span>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-sky-50 rounded-2xl p-6 border border-amber-100 mb-8">
        <h3 className="font-semibold text-[#0d2b45] mb-3 text-[15px]">🌿 What to expect during Self Realization</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            'A cool or warm breeze on your palms and fingertips',
            'A sense of calm stillness and thoughtlessness',
            'A gentle vibration at the top of your head',
            'Deep relaxation without drowsiness',
          ].map(item => (
            <div key={item} className="flex items-start gap-2 text-[13px] text-[#1a1f2e]/65">
              <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span> {item}
            </div>
          ))}
        </div>
        <p className="text-[12px] text-amber-600 mt-4 italic font-medium text-center">
          Everyone&apos;s experience is unique. Be open and allow — without expectation.
        </p>
      </div>

      <div className="text-center">
        <button onClick={onNext} className="px-10 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold text-[15px] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200">
          Continue →
        </button>
      </div>
    </div>
  )
}

function Step5({ onNext }: { onNext: () => void }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-display text-4xl font-semibold text-[#0d2b45] mb-3">Find Your Center</h2>
        <p className="text-[15px] text-[#1a1f2e]/60 leading-relaxed">
          Centers near you, ready to welcome you for your first collective meditation.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {CENTERS_NEARBY.map((c, i) => (
          <div key={c.name} className="bg-white rounded-2xl border border-sky-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 p-5 flex gap-4 items-center group">
            <div className={`w-12 h-12 rounded-full ${c.color} flex items-center justify-center text-white text-lg shadow-md flex-shrink-0 group-hover:scale-110 transition-transform`}>
              🧘
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[#0d2b45] text-[15px]">{c.name}</div>
              <div className="text-[12px] text-[#1a1f2e]/50 mt-0.5">
                📍 {c.distance} · 📅 {c.days} · 🕐 {c.time}
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Link to={i === 0 ? '/center/1' : '/find-center'} className="px-4 py-2 rounded-xl bg-[#0d2b45] text-white text-[11px] font-semibold hover:bg-[#1a3f5c] transition-colors text-center">
                View Center →
              </Link>
              <a href="https://wa.me/919876543210" className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-[11px] font-semibold hover:bg-emerald-100 transition-colors text-center">
                💬 WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-sky-50 rounded-2xl p-5 border border-sky-100 text-center mb-8">
        <p className="text-[14px] text-[#1a1f2e]/60 mb-3">Looking for more centers across Pune?</p>
        <Link to="/find-center" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-sky-500 text-white text-[13px] font-semibold hover:bg-sky-400 transition-colors">
          📍 Explore All Centers
        </Link>
      </div>

      <div className="text-center">
        <button onClick={onNext} className="px-10 py-4 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-[15px] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200">
          Continue →
        </button>
      </div>
    </div>
  )
}

function Step6({ onNext }: { onNext: () => void }) {
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const toggle = (i: number) => setChecked(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n })
  const allChecked = checked.size === CHECKLIST.length

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-display text-4xl font-semibold text-[#0d2b45] mb-3">Your First Collective</h2>
        <p className="text-[15px] text-[#1a1f2e]/60 leading-relaxed max-w-lg mx-auto">
          Here&apos;s everything you need to know before attending your first collective meditation. Tick each one as you read it.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {CHECKLIST.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-200 ${checked.has(i) ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-sky-100 hover:border-sky-200'}`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${checked.has(i) ? 'bg-emerald-500 border-emerald-500' : 'border-sky-200'}`}>
              {checked.has(i) && <span className="text-white text-[10px] font-bold">✓</span>}
            </div>
            <span className={`text-[13px] font-medium ${checked.has(i) ? 'text-emerald-700' : 'text-[#1a1f2e]/70'}`}>{item.text}</span>
          </button>
        ))}
      </div>

      {allChecked && (
        <div className="bg-gradient-to-r from-emerald-50 to-sky-50 rounded-2xl p-5 border border-emerald-200 text-center mb-6 animate-pulse-once">
          <div className="text-2xl mb-2">🎉</div>
          <p className="text-emerald-700 font-semibold text-[15px]">You&apos;re ready for your first collective!</p>
          <p className="text-[13px] text-emerald-600/70 mt-1">Next program: August 10 · Kalyani Nagar · 6:30 PM</p>
        </div>
      )}

      <div className="bg-gradient-to-br from-[#0d2b45] to-[#1a3f5c] rounded-2xl p-6 mb-8 relative overflow-hidden">
        <LotusDecor className="absolute -right-4 -bottom-4 w-28 h-28 text-white opacity-[0.06]" />
        <div className="relative grid md:grid-cols-3 gap-4 text-center">
          {[
            { icon: '🕐', label: 'Arrive', desc: '10 minutes early' },
            { icon: '👟', label: 'Footwear', desc: 'Remove at entrance' },
            { icon: '🤲', label: 'Palms', desc: 'Face upward in lap' },
          ].map(({ icon, label, desc }) => (
            <div key={label}>
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-amber-300 font-semibold text-[13px]">{label}</div>
              <div className="text-white/55 text-[11px]">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button onClick={onNext} className="px-10 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-[15px] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200">
          Continue →
        </button>
      </div>
    </div>
  )
}

function Step7({ onComplete }: { onComplete: () => void }) {
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set())
  const toggle = (d: number) => setCompletedDays(s => { const n = new Set(s); n.has(d) ? n.delete(d) : n.add(d); return n })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="text-4xl mb-4">🌸</div>
        <h2 className="font-display text-4xl font-semibold text-[#0d2b45] mb-3">Your 21-Day Journey</h2>
        <p className="text-[15px] text-[#1a1f2e]/60 leading-relaxed max-w-lg mx-auto">
          Twenty-one days to transform your meditation practice. One gentle step each day. Click any day to mark your progress.
        </p>
        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-2 w-40 rounded-full bg-sky-100 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500" style={{ width: `${(completedDays.size / 21) * 100}%` }} />
          </div>
          <span className="text-[12px] font-semibold text-amber-500">{completedDays.size}/21 days</span>
          {completedDays.size === 21 && <span className="text-[11px] bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-bold">🏆 Journey Complete!</span>}
        </div>
      </div>

      {/* First 7 in detail */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {TWENTY_ONE_DAYS.slice(0, 7).map(({ day, title, tip }) => (
          <button
            key={day}
            onClick={() => toggle(day)}
            className={`text-left p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${completedDays.has(day) ? 'bg-amber-50 border-amber-200 shadow-md' : 'bg-white border-sky-100 hover:border-sky-200 hover:shadow-sm'}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all ${completedDays.has(day) ? 'bg-amber-500 text-white' : 'bg-sky-50 text-sky-400 border border-sky-200'}`}>
                {completedDays.has(day) ? '✓' : day}
              </div>
              <span className={`font-semibold text-[14px] ${completedDays.has(day) ? 'text-amber-700' : 'text-[#0d2b45]'}`}>{title}</span>
            </div>
            <p className="text-[12px] text-[#1a1f2e]/60 leading-relaxed pl-11">{tip}</p>
          </button>
        ))}
      </div>

      {/* Days 8–21 as compact grid */}
      <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5 mb-8">
        <div className="text-[12px] font-semibold text-[#1a1f2e]/40 uppercase tracking-wider mb-3">Days 8–21</div>
        <div className="grid grid-cols-7 gap-2">
          {TWENTY_ONE_DAYS.slice(7).map(({ day, title }) => (
            <button
              key={day}
              onClick={() => toggle(day)}
              title={title}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center text-[11px] font-semibold transition-all duration-200 hover:scale-105 ${completedDays.has(day) ? 'bg-amber-500 text-white shadow-md shadow-amber-200/50' : 'bg-sky-50 text-sky-400 border border-sky-100 hover:border-sky-300'}`}
            >
              {completedDays.has(day) ? '✓' : day}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 mt-1">
          {TWENTY_ONE_DAYS.slice(7).map(({ day, title }) => (
            <div key={day} className="text-[8px] text-center text-[#1a1f2e]/30 truncate">{title.split(' ')[0]}</div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onComplete}
          className="px-10 py-4 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold text-[16px] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-300/40 transition-all duration-200"
        >
          Complete My Journey 🌸
        </button>
        <div className="mt-3 text-[11px] text-[#1a1f2e]/35">You can return and track your 21-day progress anytime</div>
      </div>
    </div>
  )
}

// ─── Celebration Screen ───────────────────────────────────────────────────────

function CelebrationScreen({ onClose }: { onClose: () => void }) {
  const [bloomed, setBloomed] = useState(false)
  useEffect(() => { setTimeout(() => setBloomed(true), 200) }, [])

  return (
    <div className="fixed inset-0 z-[200] bg-gradient-to-br from-[#0d2b45] to-[#1a3f5c] flex items-center justify-center p-6">
      {/* Particle-like background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-amber-400 opacity-30"
            style={{
              left: `${8 + i * 8}%`,
              top: `${10 + (i % 4) * 22}%`,
              animation: `float-particle ${3 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative text-center max-w-lg">
        {/* Blooming lotus */}
        <div
          className="w-40 h-40 mx-auto mb-8 relative"
          style={{ transform: bloomed ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-90deg)', transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)', opacity: bloomed ? 1 : 0 }}
        >
          <LotusDecor className="w-full h-full text-amber-400" />
          <div className="absolute inset-0 flex items-center justify-center">
            <LotusDecor className="w-20 h-20 text-amber-300" />
          </div>
        </div>

        <div style={{ opacity: bloomed ? 1 : 0, transform: bloomed ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.8s ease 0.8s, transform 0.8s ease 0.8s' }}>
          <div className="text-5xl mb-4">🌸</div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">Congratulations!</h1>
          <p className="text-white/70 text-[16px] leading-relaxed mb-3">
            You&apos;ve completed the New Seeker Journey.
          </p>
          <p className="text-amber-300 text-[15px] font-medium mb-10">
            We look forward to welcoming you at your nearest Sahaja Yoga Center.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/find-center" className="px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-semibold text-[14px] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-400/40">
              📍 Find My Center
            </Link>
            <Link to="/events" className="px-8 py-3.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold text-[14px] transition-all backdrop-blur-sm">
              📅 Explore Events
            </Link>
          </div>

          <button onClick={onClose} className="mt-6 text-white/40 hover:text-white text-[12px] underline transition-colors">
            Return to journey
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Journey Timeline (decorative) ────────────────────────────────────────────

function JourneyTimeline() {
  const nodes = [
    { icon: '🌱', label: 'Curiosity',      color: 'bg-red-400',     desc: 'You discovered Sahaja Yoga and felt a gentle calling to explore.' },
    { icon: '📖', label: 'Learning',       color: 'bg-orange-400',  desc: 'You understood the basics — meditation, chakras, and Self Realization.' },
    { icon: '✨', label: 'First Experience',color: 'bg-amber-400',  desc: 'You received Self Realization and felt something real — the cool breeze.' },
    { icon: '🧘', label: 'First Collective',color: 'bg-emerald-400', desc: 'You attended your first center session and met the welcoming community.' },
    { icon: '🌿', label: 'Regular Practice',color: 'bg-sky-400',    desc: 'Daily meditation became a natural, joyful part of your life.' },
    { icon: '🌸', label: 'Living Sahaja',  color: 'bg-violet-500',  desc: 'Meditation is no longer something you do — it is who you are.' },
  ]

  return (
    <FadeIn>
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-red-300 via-amber-300 via-emerald-300 to-violet-400 hidden md:block" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-5">
          {nodes.map(({ icon, label, color, desc }, i) => (
            <FadeIn key={label} delay={i * 80}>
              <div className="text-center group cursor-default">
                <div className={`w-16 h-16 rounded-full ${color} mx-auto mb-3 flex items-center justify-center text-2xl shadow-lg relative z-10 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                  {icon}
                </div>
                <div className="font-semibold text-[#0d2b45] text-[13px] mb-1.5">{label}</div>
                <div className="text-[11px] text-[#1a1f2e]/50 leading-relaxed hidden md:block">{desc}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </FadeIn>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NewSeekerJourney() {
  const [phase, setPhase] = useState<'hero' | 'steps' | 'done'>('hero')
  const [currentStep, setCurrentStep] = useState(1)
  const [completed, setCompleted]     = useState<Set<number>>(new Set())
  const [openFaq, setOpenFaq]         = useState<number | null>(null)
  const [tipIdx]                      = useState(() => new Date().getDate() % DAILY_TIPS.length)
  const wizardRef = useRef<HTMLDivElement>(null)
  const quoteIdx = tipIdx % QUOTES.length

  const markComplete = useCallback((n: number) => setCompleted(s => new Set([...s, n])), [])

  const goNext = useCallback(() => {
    markComplete(currentStep)
    if (currentStep < 7) {
      setCurrentStep(s => s + 1)
      wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      setPhase('done')
    }
  }, [currentStep, markComplete])

  const goBack = useCallback(() => {
    if (currentStep > 1) setCurrentStep(s => s - 1)
    else setPhase('hero')
  }, [currentStep])

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-body">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      {phase === 'hero' && (
        <section className="relative min-h-screen flex items-center overflow-hidden mt-[calc(2.25rem+4rem)]">
          <img
            src="https://images.unsplash.com/photo-1615694856537-03f7115dc1fc?w=1800&h=1000&fit=crop&auto=format"
            alt="Lotus in golden light"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d2b45]/85 via-[#0d2b45]/65 to-[#c4973a]/30" />
          {/* Floating lotus decorations */}
          <LotusDecor className="absolute -left-20 top-1/4 w-80 h-80 text-amber-400 opacity-[0.08]" />
          <LotusDecor className="absolute -right-20 bottom-1/4 w-96 h-96 text-sky-400 opacity-[0.06]" />

          <div className="relative max-w-5xl mx-auto px-6 lg:px-10 py-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[12px] font-semibold mb-8">
              <LotusDecor className="w-4 h-4" /> New Seeker Journey · Sahaja Connect Pune
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-semibold text-white leading-[1.08] mb-6">
              🌸 Welcome to Your<br />
              <span className="text-amber-400">Sahaja Yoga Journey</span>
            </h1>
            <p className="text-white/70 text-[16px] md:text-[18px] leading-relaxed max-w-2xl mx-auto mb-10">
              Every journey begins with a single step. Whether you&apos;ve never meditated before or you&apos;re simply curious,
              we&apos;ll guide you gently through your first experience with Sahaja Yoga.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <button
                onClick={() => setPhase('steps')}
                className="flex items-center justify-center gap-2.5 px-9 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-[15px] transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-amber-400/40"
              >
                ✨ Begin Your Journey
              </button>
              <Link to="/find-center" className="flex items-center justify-center gap-2.5 px-9 py-4 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-sm text-white font-bold text-[15px] transition-all hover:-translate-y-0.5">
                📍 Find a Nearby Center
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-[12px] text-white/50 font-medium">
              <span>✦ Meditation is always free</span>
              <span>✦ Everyone is welcome</span>
              <span>✦ No prior experience required</span>
            </div>

            {/* Step preview pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-10">
              {STEPS.map(s => (
                <span key={s.num} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/60 text-[11px] font-medium backdrop-blur-sm">
                  {s.icon} {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-white/40 text-[10px] uppercase tracking-widest">Scroll to explore</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </section>
      )}

      {/* ── Steps Wizard ──────────────────────────────────────────────────── */}
      {phase === 'steps' && (
        <>
          <ProgressBar current={currentStep} completed={completed} />

          {/* Journey Companion (desktop float) */}
          <JourneyCompanion current={currentStep} completed={completed} tipIdx={tipIdx} />

          {/* Step content */}
          <div ref={wizardRef} className="max-w-5xl mx-auto px-6 lg:px-10 py-14">
            {/* Step heading strip */}
            <div className={`bg-gradient-to-r ${STEPS[currentStep - 1].bg} rounded-2xl px-7 py-4 mb-10 flex items-center gap-4 shadow-lg`}>
              <span className="text-4xl">{STEPS[currentStep - 1].icon}</span>
              <div>
                <div className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{STEPS[currentStep - 1].chakra} Chakra · Step {currentStep} of 7</div>
                <div className="text-white font-display text-[20px] font-semibold">{STEPS[currentStep - 1].label}</div>
              </div>
            </div>

            <FadeStep stepKey={currentStep}>
              {currentStep === 1 && <Step1 onNext={goNext} />}
              {currentStep === 2 && <Step2 onNext={goNext} />}
              {currentStep === 3 && <Step3 onNext={goNext} />}
              {currentStep === 4 && <Step4 onNext={goNext} />}
              {currentStep === 5 && <Step5 onNext={goNext} />}
              {currentStep === 6 && <Step6 onNext={goNext} />}
              {currentStep === 7 && <Step7 onComplete={goNext} />}
            </FadeStep>

            {/* Back button */}
            <div className="mt-8 flex justify-start">
              <button onClick={goBack} className="text-[13px] text-[#1a1f2e]/45 hover:text-[#0d2b45] transition-colors flex items-center gap-1">
                ← {currentStep === 1 ? 'Back to Welcome' : 'Previous Step'}
              </button>
            </div>
          </div>

          {/* Mobile Companion bar */}
          <div className="xl:hidden fixed bottom-0 inset-x-0 z-40 bg-white/97 backdrop-blur-xl border-t border-sky-100 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 py-3">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              <div className="text-[11px]">
                <div className="text-amber-500 font-bold uppercase tracking-wider text-[9px]">Current Step</div>
                <div className="text-[#0d2b45] font-semibold">{STEPS[currentStep - 1].icon} {STEPS[currentStep - 1].label}</div>
              </div>
              <div className="text-[11px] text-center">
                <div className="font-bold text-amber-500">{completed.size}/7</div>
                <div className="text-[#1a1f2e]/40">completed</div>
              </div>
              <div className="text-[11px] text-right">
                <div className="text-emerald-600 font-semibold">📍 3.2 km</div>
                <div className="text-[#1a1f2e]/40">nearest center</div>
              </div>
            </div>
          </div>
          <div className="h-16 xl:hidden" />
        </>
      )}

      {/* ── Celebration ───────────────────────────────────────────────────── */}
      {phase === 'done' && <CelebrationScreen onClose={() => { setPhase('steps'); setCurrentStep(7) }} />}

      {/* ── Below-fold sections (always scrollable) ───────────────────────── */}
      <div className={`${phase === 'hero' ? 'mt-0' : 'mt-8'} space-y-24 max-w-7xl mx-auto px-6 lg:px-10 py-20`}>

        {/* Journey Timeline */}
        <div>
          <FadeIn>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-amber-500">Your Path</span>
                <span className="h-px w-12 bg-amber-200" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#0d2b45]">The Beautiful Journey Ahead</h2>
              <p className="text-[#1a1f2e]/55 text-[15px] mt-3 max-w-lg mx-auto">Each milestone naturally leads to the next — no rushing, no pressure.</p>
            </div>
          </FadeIn>
          <JourneyTimeline />
        </div>

        {/* Today's Inspiration */}
        <FadeIn>
          <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#0d2b45] to-[#1a3f5c] relative">
            <LotusDecor className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] text-white opacity-[0.04]" />
            <div className="relative grid md:grid-cols-2 gap-0">
              <div className="p-10 md:p-14">
                <div className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-5">✨ Today&apos;s Inspiration</div>
                <blockquote className="font-display text-2xl md:text-3xl text-white leading-relaxed mb-6 italic">
                  &ldquo;{QUOTES[quoteIdx].text}&rdquo;
                </blockquote>
                <cite className="text-amber-300/80 text-[13px] not-italic">— {QUOTES[quoteIdx].attr}</cite>
                <div className="mt-8 bg-white/10 rounded-2xl p-5 border border-white/15">
                  <div className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-2">🧘 Meditation Tip</div>
                  <p className="text-white/70 text-[13px] leading-relaxed">{DAILY_TIPS[tipIdx]}</p>
                </div>
              </div>
              <div className="relative min-h-[260px] overflow-hidden hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=500&fit=crop&auto=format"
                  alt="Meditation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0d2b45]/40" />
              </div>
            </div>
          </div>
        </FadeIn>

        {/* FAQ */}
        <FadeIn>
          <div className="text-center mb-8">
            <div className="text-[10px] font-semibold tracking-[0.25em] uppercase text-amber-500 mb-2">Common Questions</div>
            <h2 className="font-display text-3xl font-semibold text-[#0d2b45]">Everything You Need to Know</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
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

        {/* Ready to Visit */}
        <FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📍', title: 'Nearest Center', desc: 'Kalyani Nagar · 3.2 km · Mon, Wed, Fri – 6:30 PM', action: 'Find My Center', href: '/find-center', color: 'bg-sky-500 hover:bg-sky-400' },
              { icon: '📅', title: 'Next Public Program', desc: 'Aug 10 · Kalyani Nagar Community Hall · 6:30 PM', action: 'View Programs', href: '/events', color: 'bg-amber-500 hover:bg-amber-400' },
              { icon: '💬', title: 'Contact Coordinator', desc: 'Priya Ji · +91 98765 43210 · Responds within hours', action: 'WhatsApp Now', href: 'https://wa.me/919876543210', color: 'bg-emerald-500 hover:bg-emerald-400' },
            ].map(({ icon, title, desc, action, href, color }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-center">
                <div className="text-3xl mb-3">{icon}</div>
                <div className="font-semibold text-[#0d2b45] text-[15px] mb-2">{title}</div>
                <div className="text-[12px] text-[#1a1f2e]/55 leading-relaxed mb-4">{desc}</div>
                <Link to={href} className={`inline-block px-6 py-2.5 rounded-full ${color} text-white text-[13px] font-semibold transition-colors`}>{action}</Link>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Personal Guidance */}
        <FadeIn>
          <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-sky-50 border border-amber-100 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-[10px] font-semibold tracking-[0.25em] uppercase text-amber-500 mb-3">Personal Guidance</div>
                <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-4">Need Personal Guidance?</h2>
                <p className="text-[15px] text-[#1a1f2e]/65 leading-relaxed mb-6">
                  If you&apos;re unsure where to begin, our volunteers are happy to help. No question is too small — we were all first-time seekers once.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="tel:+919876543210" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0d2b45] hover:bg-[#1a3f5c] text-white text-[13px] font-semibold transition-all hover:-translate-y-0.5">
                    📞 Call
                  </a>
                  <a href="https://wa.me/919876543210" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white text-[13px] font-semibold transition-all hover:-translate-y-0.5">
                    💬 WhatsApp
                  </a>
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#0d2b45]/20 hover:border-[#0d2b45]/40 text-[#0d2b45] text-[13px] font-semibold transition-all hover:-translate-y-0.5">
                    ✉️ Send Question
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '🕐', q: 'What time should I arrive?', a: '10 min early is ideal' },
                  { icon: '👕', q: 'What should I wear?',        a: 'Comfortable, modest clothing' },
                  { icon: '👨‍👩‍👧', q: 'Can my family come?',      a: 'Yes, families are welcome!' },
                  { icon: '💰', q: 'Is it really free?',         a: 'Always. No exceptions.' },
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

        {/* Begin Journey CTA (if on hero phase, scrolling down) */}
        {phase === 'hero' && (
          <FadeIn>
            <div className="text-center py-10">
              <LotusDecor className="w-20 h-20 text-amber-400/60 mx-auto mb-6" />
              <h2 className="font-display text-3xl font-semibold text-[#0d2b45] mb-4">Ready to begin?</h2>
              <p className="text-[15px] text-[#1a1f2e]/60 mb-7 max-w-md mx-auto">
                Your journey of seven beautiful steps awaits. Take it at your own pace.
              </p>
              <button
                onClick={() => { setPhase('steps'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="px-10 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-[15px] transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-300/40"
              >
                ✨ Begin Your Journey
              </button>
            </div>
          </FadeIn>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#0d2b45] text-white/70 py-10 px-6 lg:px-10 relative overflow-hidden">
        <LotusDecor className="absolute -right-16 -bottom-16 w-64 h-64 text-white opacity-[0.04]" />
        <div className="max-w-7xl mx-auto relative flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <div className="font-display text-lg font-semibold text-white mb-1">Sahaja Connect Pune</div>
            <div className="text-[12px]">Guiding seekers to their first experience of Sahaja Yoga — free, always.</div>
          </div>
          <div className="flex gap-4 text-[13px]">
            <Link to="/"            className="hover:text-amber-400 transition-colors">Home</Link>
            <Link to="/events"      className="hover:text-amber-400 transition-colors">Events</Link>
            <Link to="/find-center" className="hover:text-amber-400 transition-colors">Find a Center</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
