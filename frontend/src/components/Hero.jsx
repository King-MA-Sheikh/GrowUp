import { Link } from 'react-router-dom';
import { 
  ArrowRight, Play, Code2, Globe, Smartphone, Cloud, Users, 
  Briefcase, GraduationCap, Award, Database, Server, Cpu, 
  Shield, Zap, Layers, Box, GitBranch, Terminal, Brain
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getProjects, getTeamMembers, getTechnologies } from '../utils/api';
import logoImage from '../assets/Logo.png';

// Technology icons mapping
const techIcons = {
  'React': { icon: Code2, color: 'from-cyan-500 to-blue-500' },
  'Python': { icon: Code2, color: 'from-blue-500 to-indigo-500' },
  'Node.js': { icon: Server, color: 'from-green-500 to-emerald-500' },
  'Django': { icon: Code2, color: 'from-emerald-500 to-teal-500' },
  'AWS': { icon: Cloud, color: 'from-orange-500 to-red-500' },
  'Docker': { icon: Box, color: 'from-blue-500 to-cyan-500' },
  'Kubernetes': { icon: Cpu, color: 'from-purple-500 to-pink-500' },
  'MongoDB': { icon: Database, color: 'from-green-500 to-lime-500' },
  'PostgreSQL': { icon: Database, color: 'from-sky-500 to-blue-500' },
  'TensorFlow': { icon: Brain, color: 'from-orange-500 to-yellow-500' },
  'TypeScript': { icon: Code2, color: 'from-blue-500 to-purple-500' },
  'Next.js': { icon: Code2, color: 'from-slate-500 to-gray-500' },
  'Vue.js': { icon: Code2, color: 'from-green-500 to-emerald-500' },
  'Angular': { icon: Code2, color: 'from-red-500 to-pink-500' },
  'GraphQL': { icon: GitBranch, color: 'from-pink-500 to-rose-500' },
  'Redis': { icon: Database, color: 'from-red-500 to-orange-500' },
  'JavaScript': { icon: Code2, color: 'from-yellow-500 to-amber-500' },
  'Java': { icon: Code2, color: 'from-red-500 to-orange-500' },
  'C++': { icon: Code2, color: 'from-blue-500 to-indigo-500' },
  'Go': { icon: Code2, color: 'from-cyan-500 to-teal-500' },
  'Rust': { icon: Code2, color: 'from-orange-500 to-red-500' },
  'Swift': { icon: Code2, color: 'from-pink-500 to-rose-500' },
  'Kotlin': { icon: Code2, color: 'from-purple-500 to-indigo-500' },
  'PHP': { icon: Code2, color: 'from-indigo-500 to-purple-500' },
  'Ruby': { icon: Code2, color: 'from-red-500 to-pink-500' },
  'Flask': { icon: Code2, color: 'from-teal-500 to-cyan-500' },
  'FastAPI': { icon: Zap, color: 'from-green-500 to-emerald-500' },
  'Spring Boot': { icon: Server, color: 'from-green-500 to-teal-500' },
  'Laravel': { icon: Code2, color: 'from-red-500 to-orange-500' },
  'PyTorch': { icon: Brain, color: 'from-red-500 to-pink-500' },
  'Scikit-learn': { icon: Brain, color: 'from-blue-500 to-cyan-500' },
};

function TechOrbit() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    try {
      const res = await getTechnologies({ page_size: 24 });
      const techs = res.data.results || res.data || [];
      setTechnologies(techs.slice(0, 16));
    } catch (err) {
      console.error('Error fetching technologies:', err);
      setTechnologies([
        { name: 'React', icon: '⚛️' },
        { name: 'Python', icon: '🐍' },
        { name: 'Node.js', icon: '🚀' },
        { name: 'Django', icon: '🎯' },
        { name: 'AWS', icon: '☁️' },
        { name: 'Docker', icon: '🐳' },
        { name: 'K8s', icon: '⚙️' },
        { name: 'MongoDB', icon: '🍃' },
        { name: 'PostgreSQL', icon: '🐘' },
        { name: 'TensorFlow', icon: '🧠' },
        { name: 'TypeScript', icon: '📘' },
        { name: 'Next.js', icon: '▲' },
        { name: 'Vue.js', icon: '💚' },
        { name: 'Angular', icon: '🅰️' },
        { name: 'GraphQL', icon: '📊' },
        { name: 'Redis', icon: '📀' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getPosition = (index, total) => {
    const angle = (index / total) * 360 - 90;
    const radius = 180;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y, angle };
  };

  return (
    <div className="relative flex justify-center items-center min-h-[550px]">
      {/* Central circle with logo */}
      <div className="relative w-80 h-80 rounded-full bg-gradient-to-br from-electric-blue/20 via-deep-purple/20 to-neon-cyan/20 border-2 border-electric-blue/30 flex items-center justify-center animate-glow z-20 backdrop-blur-sm shadow-2xl">
        {/* Animated ring around the circle */}
        <div className="absolute inset-0 rounded-full border-2 border-neon-cyan/30 animate-spin-slow" />
        <div className="absolute -inset-4 rounded-full border border-deep-purple/20" style={{ animation: 'spin 15s linear infinite reverse' }} />
        <div className="absolute -inset-8 rounded-full border border-electric-blue/10" style={{ animation: 'spin 20s linear infinite' }} />
        
        {/* Logo Image */}
        <div className="text-center z-10">
          {!imageError ? (
            <img 
              src={logoImage} 
              alt="GrowUp Logo" 
              className="w-100 h-100 object-contain mx-auto mb-2"
              onError={() => setImageError(true)}
            />
          ) : (
            <>
              <div className="font-sora font-extrabold text-4xl gradient-text mb-1">GrowUp</div>
              <div className="font-mono text-neon-cyan text-[10px] tracking-wider">CODE • CONNECT • DILIGENCE</div>
            </>
          )}
          <div className="font-mono text-neon-cyan text-[10px] tracking-wider mt-2 opacity-80">CODE • CONNECT • DILIGENCE</div>
        </div>
      </div>

      {/* Orbiting technologies */}
      <div className="absolute inset-0">
        {!loading && technologies.map((tech, index) => {
          const { x, y, angle } = getPosition(index, technologies.length);
          const defaultIcon = tech.icon || '💻';
          const IconComponent = techIcons[tech.name]?.icon || Code2;
          const iconColor = techIcons[tech.name]?.color || 'from-electric-blue to-neon-cyan';
          
          return (
            <div
              key={tech.id || tech.name}
              className="absolute glass-card rounded-xl p-2 flex items-center gap-2 border border-wite/10 shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer z-30"
              style={{
                left: `calc(50% + ${x}px - 45px)`,
                top: `calc(50% + ${y}px - 35px)`,
                animation: `float 4s ease-in-out infinite`,
                animationDelay: `${index * 0.25}s`,
                transform: `rotate(${angle}deg)`,
              }}
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${iconColor} flex items-center justify-center flex-shrink-0`}>
                {typeof defaultIcon === 'string' && defaultIcon.length <= 2 ? (
                  <span className="text-white text-sm">{defaultIcon}</span>
                ) : (
                  <IconComponent size={14} className="text-white" />
                )}
              </div>
              <span className="font-sora text-xs font-semibold text-white whitespace-nowrap">{tech.name}</span>
            </div>
          );
        })}
      </div>

      {/* Service cards around the circle */}
      <div className="absolute -top-12 -right-12 glass-card rounded-2xl px-5 py-3 flex items-center gap-3 border border-white/5 animate-float shadow-xl z-30" style={{ animationDelay: '0s' }}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue to-neon-cyan flex items-center justify-center">
          <Code2 size={18} className="text-white" />
        </div>
        <span className="font-sora text-sm font-semibold text-white">Full Stack</span>
      </div>

      <div className="absolute -bottom-12 -right-12 glass-card rounded-2xl px-5 py-3 flex items-center gap-3 border border-white/5 animate-float shadow-xl z-30" style={{ animationDelay: '1s' }}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-deep-purple flex items-center justify-center">
          <Cloud size={18} className="text-white" />
        </div>
        <span className="font-sora text-sm font-semibold text-white">DevOps</span>
      </div>

      <div className="absolute -bottom-12 -left-12 glass-card rounded-2xl px-5 py-3 flex items-center gap-3 border border-white/5 animate-float shadow-xl z-30" style={{ animationDelay: '2s' }}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-deep-purple to-electric-blue flex items-center justify-center">
          <Smartphone size={18} className="text-white" />
        </div>
        <span className="font-sora text-sm font-semibold text-white">Mobile</span>
      </div>

      <div className="absolute -top-12 -left-12 glass-card rounded-2xl px-5 py-3 flex items-center gap-3 border border-white/5 animate-float shadow-xl z-30" style={{ animationDelay: '3s' }}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center">
          <Globe size={18} className="text-white" />
        </div>
        <span className="font-sora text-sm font-semibold text-white">Web Dev</span>
      </div>

      {/* Role-based badges */}
      <div className="absolute -bottom-16 left-0 glass-card rounded-2xl p-3 border border-dark-border/60 max-w-[240px] shadow-xl z-30" style={{ animation: 'float 7s ease-in-out infinite', animationDelay: '1.5s' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Briefcase size={12} className="text-white" />
          </div>
          <div>
            <div className="text-white text-xs font-semibold">For Businesses</div>
            <div className="text-slate-500 text-[10px]">Custom solutions</div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Users size={12} className="text-white" />
          </div>
          <div>
            <div className="text-white text-xs font-semibold">For Professionals</div>
            <div className="text-slate-500 text-[10px]">Remote careers</div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <GraduationCap size={12} className="text-white" />
          </div>
          <div>
            <div className="text-white text-xs font-semibold">For Students</div>
            <div className="text-slate-500 text-[10px]">Learn & grow</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    team: 0,
    years: 3
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projectsRes, teamRes] = await Promise.all([
        getProjects({ page_size: 1000 }),
        getTeamMembers()
      ]);
      
      const projects = projectsRes.data.results || projectsRes.data || [];
      const team = teamRes.data.results || teamRes.data || [];
      
      setStats({
        projects: projects.length,
        clients: Math.floor(projects.length * 0.8),
        team: team.length,
        years: 3
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden grid-bg">
      {/* Ambient orbs */}
      <div className="orb w-96 h-96 bg-electric-blue/20 -top-20 -left-20" style={{ animationDelay: '0s' }} />
      <div className="orb w-80 h-80 bg-deep-purple/20 top-1/2 right-0 translate-x-1/2" style={{ animationDelay: '3s' }} />
      <div className="orb w-64 h-64 bg-neon-cyan/15 bottom-0 left-1/3" style={{ animationDelay: '6s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12 flex flex-col lg:flex-row items-center gap-16">
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan text-xs font-mono font-medium mb-8 animate-slide-up">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            Available for new projects
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-sora font-extrabold leading-[1.1] mb-6 animate-slide-up animation-delay-100">
            Building{' '}
            <span className="gradient-text">Powerful</span>
            <br />
            Digital Solutions
            <br />
            <span className="text-slate-300 text-3xl md:text-4xl lg:text-5xl">for Everyone</span>
          </h1>

          {/* Sub */}
          <p className="text-slate-400 text-lg md:text-xl font-outfit leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 animate-slide-up animation-delay-200">
            Whether you're a business owner, professional, student, or educator — 
            we have the right solutions to help you grow and succeed in the digital world.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up animation-delay-300">
            <Link to="/contact" className="btn-primary text-base px-8 py-4 group">
              Start Your Journey
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/portfolio" className="btn-outline text-base px-8 py-4 group">
              <Play size={16} className="fill-current" />
              Explore Our Work
            </Link>
          </div>

          {/* Dynamic Stats row */}
          <div className="flex flex-wrap gap-8 justify-center lg:justify-start mt-12 animate-slide-up animation-delay-400">
            <div className="text-center lg:text-left">
              <div className="text-2xl font-sora font-bold gradient-text-blue">{stats.projects}+</div>
              <div className="text-slate-500 text-sm font-outfit">Projects Delivered</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl font-sora font-bold gradient-text-blue">{stats.clients}+</div>
              <div className="text-slate-500 text-sm font-outfit">Happy Clients</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl font-sora font-bold gradient-text-blue">{stats.team}+</div>
              <div className="text-slate-500 text-sm font-outfit">Expert Team</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl font-sora font-bold gradient-text-blue">{stats.years}+</div>
              <div className="text-slate-500 text-sm font-outfit">Years of Excellence</div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start mt-8 animate-slide-up animation-delay-500">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Award size={14} className="text-yellow-400" />
              <span>Trusted by 40+ businesses</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Users size={14} className="text-electric-blue" />
              <span>10+ expert developers</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <GraduationCap size={14} className="text-neon-green" />
              <span>Student mentorship program</span>
            </div>
          </div>
        </div>

        {/* Right — Tech Orbit with Logo */}
        <div className="flex-1 hidden lg:block">
          <TechOrbit />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-slate-500 text-xs font-mono">scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-neon-cyan/50 to-transparent" />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 30px rgba(0, 255, 255, 0.2), 0 0 60px rgba(139, 92, 246, 0.1); }
          50% { box-shadow: 0 0 50px rgba(0, 255, 255, 0.4), 0 0 80px rgba(139, 92, 246, 0.2); }
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}