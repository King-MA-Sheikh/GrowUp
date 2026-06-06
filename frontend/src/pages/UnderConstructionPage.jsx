import { Link } from 'react-router-dom';
import { Home, Clock, Wrench, Mail, ArrowRight } from 'lucide-react';

export default function UnderConstructionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-card/50 flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center animate-float">
            <Wrench size={48} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-sora font-extrabold text-white mb-4">
          Under <span className="gradient-text">Construction</span>
        </h1>
        
        <p className="text-slate-400 text-lg mb-6">
          We're working hard to bring you something amazing. 
          This page is currently being built.
        </p>
        
        <div className="flex items-center justify-center gap-3 mb-8">
          <Clock size={16} className="text-neon-cyan animate-pulse" />
          <span className="text-slate-500 text-sm">Expected completion: Soon</span>
        </div>
        
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <Home size={16} />
          Return to Home
          <ArrowRight size={14} />
        </Link>
        
        <div className="mt-8 text-slate-600 text-xs">
          Need immediate assistance? <a href="mailto:support@growup.com" className="text-electric-blue hover:text-neon-cyan">Contact Support</a>
        </div>
      </div>
    </div>
  );
}