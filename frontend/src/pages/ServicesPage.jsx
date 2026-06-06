import Services from '../components/Services';
import TechStack from '../components/TechStack';
import Contact from '../components/Contact';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const process = [
  { step: '01', title: 'Discovery', desc: 'We deep-dive into your requirements, goals, and vision to define the perfect solution.' },
  { step: '02', title: 'Design', desc: 'Wireframes, prototypes, and UI/UX design crafted to deliver an exceptional user experience.' },
  { step: '03', title: 'Development', desc: 'Agile development sprints with regular updates, code reviews, and rigorous testing.' },
  { step: '04', title: 'Deploy', desc: 'Seamless deployment to production with CI/CD, monitoring, and post-launch support.' },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-24">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <span className="section-tag">What We Build</span>
        <h1 className="text-5xl md:text-6xl font-sora font-extrabold mb-4">
          Our <span className="gradient-text">Services</span>
        </h1>
        <p className="text-slate-400 font-outfit text-lg max-w-2xl mx-auto">
          End-to-end digital solutions built with modern technology, delivered with precision and passion.
        </p>
      </div>

      {/* Services grid */}
      <Services />

      {/* Process */}
      <section className="py-20 bg-dark-card/30 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <span className="section-tag">How We Work</span>
            <h2 className="text-4xl md:text-5xl font-sora font-bold mb-3">
              Our <span className="gradient-text">Process</span>
            </h2>
            <p className="text-slate-400 font-outfit max-w-xl mx-auto">A proven 4-step process that ensures your project is delivered on time and on budget.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <div key={p.step} className="relative">
                {/* Connector line */}
                {i < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-electric-blue/40 to-transparent z-10" />
                )}
                <div className="glass-card neon-border rounded-2xl p-6 h-full">
                  <div className="font-mono text-4xl font-extrabold gradient-text mb-4">{p.step}</div>
                  <h3 className="font-sora font-bold text-white text-lg mb-2">{p.title}</h3>
                  <p className="text-slate-400 text-sm font-outfit leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose GrowUp */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-tag">Why GrowUp?</span>
              <h2 className="text-4xl md:text-5xl font-sora font-bold mb-6">
                The <span className="gradient-text">Right Choice</span> for Your Business
              </h2>
              <div className="space-y-4">
                {[
                  'Modern tech stack — React, Next.js, Django, AWS',
                  'Clean, maintainable, well-documented code',
                  'On-time delivery with milestone-based updates',
                  'Post-launch support and maintenance plans',
                  'Transparent pricing with no hidden costs',
                  'NDA-protected, confidential development',
                  'Startup-friendly with flexible engagement models',
                ].map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-neon-green flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 font-outfit">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/contact" className="btn-primary inline-flex">
                  Work With Us <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Client Satisfaction', value: '100%', color: 'from-neon-green to-neon-cyan' },
                { label: 'On-Time Delivery', value: '95%', color: 'from-electric-blue to-neon-cyan' },
                { label: 'Repeat Clients', value: '80%', color: 'from-deep-purple to-electric-blue' },
                { label: 'Support Response', value: '<2h', color: 'from-neon-cyan to-deep-purple' },
              ].map(({ label, value, color }) => (
                <div key={label} className="glass-card neon-border rounded-2xl p-6 text-center">
                  <div className={`text-3xl font-sora font-extrabold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}>
                    {value}
                  </div>
                  <div className="text-slate-400 text-sm font-outfit">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TechStack />
      <Contact />
    </main>
  );
}
