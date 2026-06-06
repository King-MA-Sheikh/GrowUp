import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, ChevronLeft, ChevronRight, Briefcase, Calendar, ArrowRight, CheckCircle, Clock, Zap } from 'lucide-react';
import { getProjects } from '../utils/api';

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < count ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'} />
      ))}
    </div>
  );
}

function Avatar({ name }) {
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'HC';
  const colors = ['from-electric-blue to-neon-cyan', 'from-deep-purple to-electric-blue', 'from-neon-cyan to-neon-green', 'from-neon-green to-electric-blue'];
  const idx = (name?.charCodeAt(0) || 67) % colors.length;
  return (
    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colors[idx]} flex items-center justify-center font-sora font-bold text-white text-sm flex-shrink-0`}>
      {initials}
    </div>
  );
}

function ProjectStatusBadge({ status }) {
  const statusConfig = {
    'live': { label: 'Live', icon: Zap, color: 'text-neon-green' },
    'completed': { label: 'Completed', icon: CheckCircle, color: 'text-neon-cyan' },
    'in_progress': { label: 'In Progress', icon: Clock, color: 'text-yellow-400' }
  };
  const config = statusConfig[status] || statusConfig.completed;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-mono ${config.color}`}>
      <Icon size={10} />
      {config.label}
    </span>
  );
}

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchTestimonialsFromProjects();
  }, []);

  const fetchTestimonialsFromProjects = async () => {
    setLoading(true);
    try {
      const projectsRes = await getProjects({ page_size: 1000 });
      let projects = [];
      
      if (projectsRes.data) {
        if (projectsRes.data.results) {
          projects = projectsRes.data.results;
        } else if (Array.isArray(projectsRes.data)) {
          projects = projectsRes.data;
        }
      }
      
      // Extract all projects with their client reviews
      const testimonialsList = projects.map(project => ({
        id: project.id,
        client_name: project.client_name || 'Happy Client',
        message: project.client_review || "Great work!",
        rating: project.client_rating || 5,
        project_title: project.title,
        project_slug: project.slug,
        completion_date: project.completion_date,
        status: project.status || 'completed'
      }));
      
      setItems(testimonialsList);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paused || items.length === 0) return;
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % items.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [items.length, paused]);

  const prev = () => { 
    setCurrent(c => (c - 1 + items.length) % items.length); 
    setPaused(true);
    setTimeout(() => setPaused(false), 5000);
  };
  
  const next = () => { 
    setCurrent(c => (c + 1) % items.length); 
    setPaused(true);
    setTimeout(() => setPaused(false), 5000);
  };

  if (loading) {
    return (
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
          <p className="text-slate-400">Loading client stories...</p>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const currentItem = items[current];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-electric-blue/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="section-tag">Client Love</span>
          <h2 className="text-4xl md:text-5xl font-sora font-bold mb-4">
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="text-slate-400 font-outfit max-w-xl mx-auto">
            Real results from real businesses who trusted GrowUp to build their digital future.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 md:p-12 border border-dark-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-deep-purple/10 rounded-full blur-3xl" />
            <Quote size={48} className="text-electric-blue/30 mb-6 absolute top-8 right-8" />

            <Stars count={currentItem?.rating || 5} />

            <p className="text-xl md:text-2xl font-outfit text-slate-200 leading-relaxed mt-6 mb-8 relative z-10">
              "{currentItem?.message}"
            </p>

            <div className="flex items-center gap-4">
              <Avatar name={currentItem?.client_name} />
              <div>
                <div className="font-sora font-bold text-white">{currentItem?.client_name}</div>
                <div className="text-slate-400 text-sm font-outfit flex items-center gap-2">
                  <span>Client · {currentItem?.project_title}</span>
                  <ProjectStatusBadge status={currentItem?.status} />
                </div>
                {currentItem?.completion_date && (
                  <div className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                    <Calendar size={10} />
                    Completed: {new Date(currentItem.completion_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-8">
              {items.slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setPaused(true); setTimeout(() => setPaused(false), 5000); }}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? 'w-8 h-2 bg-neon-cyan'
                      : 'w-2 h-2 bg-slate-600 hover:bg-slate-400'
                  }`}
                />
              ))}
              {items.length > 5 && <span className="text-slate-600 text-xs ml-1">+{items.length - 5}</span>}
              
              <div className="ml-auto flex gap-2">
                <button onClick={prev} className="w-9 h-9 rounded-xl glass-card border border-dark-border flex items-center justify-center text-slate-400 hover:text-white hover:border-neon-cyan/50 transition-all">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={next} className="w-9 h-9 rounded-xl glass-card border border-dark-border flex items-center justify-center text-slate-400 hover:text-white hover:border-neon-cyan/50 transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {items.length > 2 && (
              <div className="mt-6 text-center">
                <Link to="/testimonials" className="text-sm text-slate-400 hover:text-neon-cyan transition-colors inline-flex items-center gap-1">
                  Read all {items.length} client stories
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>

          {items.length > 1 && (
            <>
              <div className="hidden lg:block absolute -left-32 top-1/2 -translate-y-1/2 opacity-40 scale-90 pointer-events-none">
                <div className="glass-card rounded-2xl p-6 w-56 border border-dark-border">
                  <Stars count={items[(current - 1 + items.length) % items.length]?.rating || 5} />
                  <p className="text-xs text-slate-400 mt-3 line-clamp-3">
                    "{items[(current - 1 + items.length) % items.length]?.message}"
                  </p>
                </div>
              </div>
              <div className="hidden lg:block absolute -right-32 top-1/2 -translate-y-1/2 opacity-40 scale-90 pointer-events-none">
                <div className="glass-card rounded-2xl p-6 w-56 border border-dark-border">
                  <Stars count={items[(current + 1) % items.length]?.rating || 5} />
                  <p className="text-xs text-slate-400 mt-3 line-clamp-3">
                    "{items[(current + 1) % items.length]?.message}"
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}