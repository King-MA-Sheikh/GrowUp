import { Link } from 'react-router-dom';
import { Zap, Github, Linkedin, Twitter, Instagram, Mail, ArrowUpRight } from 'lucide-react';
import logoImage from '../assets/Logo.png';

const footerLinks = {
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Work', href: '/portfolio' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ],
  Services: [
    { label: 'Web Development', href: '/services' },
    { label: 'Mobile Apps', href: '/services' },
    { label: 'Full Stack', href: '/services' },
    { label: 'Cloud & DevOps', href: '/services' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Refund Policy', href: '#' },
  ],
};

const socials = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-dark-border/60 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-blue/50 to-transparent" />

      {/* BG orbs */}
      <div className="absolute -bottom-40 left-20 w-96 h-96 bg-electric-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-20 w-96 h-96 bg-deep-purple/5 rounded-full blur-3xl pointer-events-none" />

      {/* CTA Banner */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-electric-blue/20 bg-gradient-to-r from-electric-blue/5 to-deep-purple/5 text-center mb-16 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="w-15 h-9 flex items-center justify-center">
            <img 
              src={logoImage} 
              alt="GrowUp Logo" 
              className="w-[130px] h-[130px] object-cover rounded-lg" 
            />
          </div>
          <p className="text-slate-400 font-outfit max-w-lg mx-auto mb-8 relative z-10">
            Let's build something extraordinary together. From idea to deployment, we've got you covered.
          </p>
          <div className="flex gap-4 justify-center relative z-10">
            <Link to="/contact" className="btn-primary">
              Start a Project <ArrowUpRight size={16} />
            </Link>
            <a href="mailto:hello@growup.dev" className="btn-outline">
              <Mail size={16} />
              Email Us
            </a>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="w-9 h-9 flex items-center justify-center">
                {/* <Zap size={18} className="text-white" /> */}
              </div>
              <div className="w-15 h-9 flex items-center justify-center">
                <img 
                  src={logoImage} 
                  alt="GrowUp Logo" 
                  className="w-[130px] h-[130px] object-cover rounded-lg" 
                />
              </div>
            </Link>
            <p className="text-slate-500 text-sm font-outfit leading-relaxed mb-5">
              Building powerful digital solutions for the future. Code. Connect. Deploy.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl glass-card border border-dark-border flex items-center justify-center text-slate-400 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-sora font-semibold text-white text-sm mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-slate-500 text-sm font-outfit hover:text-neon-cyan transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-dark-border/60">
  <p className="text-slate-600 text-sm font-outfit">
    © {year} GrowUp. All rights reserved.
  </p>
  <div className="flex items-center gap-2 text-slate-600 text-sm font-mono">
    <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
    All systems operational
  </div>
</div>
      </div>
    </footer>
  );
}
