const techs = [
  { name: 'React.js', color: '#61DAFB' },
  { name: 'Next.js', color: '#FFFFFF' },
  { name: 'Django', color: '#44B78B' },
  { name: 'Python', color: '#3776AB' },
  { name: 'Node.js', color: '#339933' },
  { name: 'Tailwind CSS', color: '#06B6D4' },
  { name: 'AWS', color: '#FF9900' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'Kubernetes', color: '#326CE5' },
  { name: 'PostgreSQL', color: '#336791' },
  { name: 'MongoDB', color: '#47A248' },
  { name: 'MySQL', color: '#4479A1' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Redis', color: '#DC382D' },
  { name: 'Git', color: '#F05032' },
  { name: 'Linux', color: '#FCC624' },
];

function TechBadge({ name, color }) {
  return (
    <div className="flex items-center gap-2.5 glass-card rounded-full px-5 py-2.5 border border-dark-border/60 flex-shrink-0 group hover:border-opacity-60 transition-all duration-300"
      style={{ '--hover-color': color }}
    >
      <span
        className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-300 group-hover:scale-125"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}66` }}
      />
      <span className="font-sora font-medium text-sm text-slate-300 group-hover:text-white whitespace-nowrap transition-colors">
        {name}
      </span>
    </div>
  );
}

export default function TechStack() {
  return (
    <section className="py-20 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deep-purple/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <span className="section-tag">Our Arsenal</span>
        <h2 className="text-4xl md:text-5xl font-sora font-bold mb-4">
          Tech <span className="gradient-text">Stack</span>
        </h2>
        <p className="text-slate-400 font-outfit max-w-xl mx-auto">
          We leverage the most powerful and modern technologies to deliver exceptional products.
        </p>
      </div>

      {/* Marquee row 1 */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-dark-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-dark-bg to-transparent z-10 pointer-events-none" />
        <div className="flex gap-4 overflow-hidden">
          <div className="flex gap-4 animate-[marquee_30s_linear_infinite]" style={{ animation: 'marquee 30s linear infinite' }}>
            {[...techs, ...techs].map((t, i) => <TechBadge key={i} {...t} />)}
          </div>
        </div>
      </div>

      {/* Marquee row 2 — reversed */}
      <div className="relative mt-4">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-dark-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-dark-bg to-transparent z-10 pointer-events-none" />
        <div className="flex gap-4 overflow-hidden">
          <div className="flex gap-4" style={{ animation: 'marquee 25s linear infinite reverse' }}>
            {[...techs.slice(8), ...techs.slice(0, 8), ...techs.slice(8), ...techs.slice(0, 8)].map((t, i) => (
              <TechBadge key={i} {...t} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
