export default function LotusDecor({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="currentColor">
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => (
        <ellipse key={i} cx="100" cy="100" rx="14" ry="62" opacity="0.45" transform={`rotate(${a} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="22" opacity="0.7" />
    </svg>
  )
}
