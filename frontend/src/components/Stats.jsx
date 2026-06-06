import { useEffect, useRef, useState } from 'react';
import { Briefcase, Users, Award, Code2, TrendingUp, Shield } from 'lucide-react';

const iconMap = { Briefcase, Users, Award, Code2, TrendingUp, Shield };

const defaultStats = [
  { id: 1, label: 'Projects Delivered', value: '50', suffix: '+', icon: 'Briefcase' },
  { id: 2, label: 'Happy Clients', value: '40', suffix: '+', icon: 'Users' },
  { id: 3, label: 'Years Experience', value: '3', suffix: '+', icon: 'Award' },
  { id: 4, label: 'Technologies', value: '15', suffix: '+', icon: 'Code2' },
];

function CountUp({ target, suffix, started }) {
  const [count, setCount] = useState(0);
  const num = parseInt(target, 10);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = Math.ceil(num / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(start);
    }, 40);
    return () => clearInterval(timer);
  }, [started, num]);

  return <>{count}{suffix}</>;
}

export default function Stats() {
  const [stats] = useState(defaultStats);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/5 via-deep-purple/5 to-neon-cyan/5" />
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => {
            const Icon = iconMap[stat.icon] || Briefcase;
            return (
              <div
                key={stat.id}
                className="glass-card rounded-2xl p-6 text-center neon-border group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-blue/20 to-deep-purple/20 border border-electric-blue/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={22} className="text-neon-cyan" />
                </div>
                <div className="text-4xl font-sora font-extrabold gradient-text mb-1">
                  <CountUp target={stat.value} suffix={stat.suffix} started={started} />
                </div>
                <div className="text-slate-400 text-sm font-outfit">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* About block */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <span className="section-tag">Who We Are</span>
            <h2 className="text-4xl md:text-5xl font-sora font-bold mb-6">
              We Build <span className="gradient-text">Digital Products</span> That Scale
            </h2>
            <p className="text-slate-400 font-outfit text-lg leading-relaxed mb-6">
              GrowUp is a technology-driven software company focused on delivering innovative digital solutions. Our expertise spans mobile apps, modern web platforms, networking infrastructure, and cloud deployment services.
            </p>
            <p className="text-slate-400 font-outfit leading-relaxed mb-8">
              We combine creativity, engineering, and scalable architecture to help startups and enterprises transform their ideas into powerful digital products.
            </p>

            {/* Values */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Innovation First', desc: 'Cutting-edge tech stack' },
                { label: 'On-Time Delivery', desc: 'We respect deadlines' },
                { label: 'Clean Code', desc: 'Maintainable & scalable' },
                { label: '24/7 Support', desc: 'Always here for you' },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                  </span>
                  <div>
                    <div className="font-sora font-semibold text-white text-sm">{label}</div>
                    <div className="text-slate-500 text-xs font-outfit">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — visual */}
          <div className="relative">
            <div className="glass-card rounded-3xl p-8 border border-dark-border relative overflow-hidden">
              {/* Top bar */}
              <div className="flex items-center gap-2 mb-6">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-neon-green/70" />
                <span className="ml-4 font-mono text-xs text-slate-500">growup.config.js</span>
              </div>

              {/* Code lines */}
              <div className="font-mono text-sm space-y-2">
                <div><span className="text-electric-blue">const</span> <span className="text-neon-cyan">growup</span> = {'{'}</div>
                <div className="pl-6"><span className="text-slate-400">mission:</span> <span className="text-neon-green">"Empower businesses"</span>,</div>
                <div className="pl-6"><span className="text-slate-400">services:</span> [</div>
                {['Web Dev', 'Mobile Apps', 'Cloud', 'Networking'].map(s => (
                  <div key={s} className="pl-12 text-slate-300">"{s}",</div>
                ))}
                <div className="pl-6">],</div>
                <div className="pl-6"><span className="text-slate-400">stack:</span> <span className="text-neon-cyan">"React + Django"</span>,</div>
                <div className="pl-6"><span className="text-slate-400">quality:</span> <span className="text-deep-purple">"Premium"</span>,</div>
                <div className="pl-6"><span className="text-slate-400">delivery:</span> <span className="text-neon-green">true</span>,</div>
                <div>{'}'}</div>
                <div className="mt-4 pt-4 border-t border-dark-border text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                  Ready to build your dream product
                </div>
              </div>

              {/* Corner glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-electric-blue/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-deep-purple/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
