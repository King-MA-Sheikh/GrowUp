import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Rocket, Heart, Code2, Users, Zap, Shield, 
  Star, Quote, Briefcase, GraduationCap, Award,
  Cpu, Cloud, Database, Server, GitBranch, Terminal, 
  Lock, Key, Network, Wifi, HardDrive, Figma, Monitor,
  Smartphone, Globe, Layers, ChevronLeft, ChevronRight,
  Play, Pause
} from 'lucide-react';
import TechStack from '../components/TechStack';
import Stats from '../components/Stats';
import { getProjects } from '../utils/api';
import ceo from '../assets/ceo-image.jpeg';

const techStacks = [
  { name: 'React', icon: '⚛️', category: 'Frontend', level: 'Expert' },
  { name: 'Next.js', icon: '▲', category: 'Frontend', level: 'Expert' },
  { name: 'Vue.js', icon: '💚', category: 'Frontend', level: 'Advanced' },
  { name: 'Angular', icon: '🅰️', category: 'Frontend', level: 'Advanced' },
  { name: 'TypeScript', icon: '📘', category: 'Frontend', level: 'Expert' },
  { name: 'Tailwind CSS', icon: '🎨', category: 'Frontend', level: 'Expert' },
  { name: 'Bootstrap', icon: '🎨', category: 'Frontend', level: 'Expert' },
  { name: 'Material UI', icon: '🎨', category: 'Frontend', level: 'Advanced' },
  { name: 'Redux', icon: '🔄', category: 'Frontend', level: 'Expert' },
  { name: 'React Native', icon: '📱', category: 'Mobile', level: 'Expert' },
  { name: 'Flutter', icon: '🦋', category: 'Mobile', level: 'Advanced' },
  { name: 'Python', icon: '🐍', category: 'Backend', level: 'Expert' },
  { name: 'Django', icon: '🎯', category: 'Backend', level: 'Expert' },
  { name: 'Flask', icon: '🌶️', category: 'Backend', level: 'Advanced' },
  { name: 'FastAPI', icon: '⚡', category: 'Backend', level: 'Advanced' },
  { name: 'Node.js', icon: '🚀', category: 'Backend', level: 'Expert' },
  { name: 'Express.js', icon: '🚂', category: 'Backend', level: 'Expert' },
  { name: 'PHP', icon: '🐘', category: 'Backend', level: 'Advanced' },
  { name: 'Laravel', icon: '⚙️', category: 'Backend', level: 'Advanced' },
  { name: 'Java', icon: '☕', category: 'Backend', level: 'Advanced' },
  { name: 'Spring Boot', icon: '🌱', category: 'Backend', level: 'Advanced' },
  { name: 'Go', icon: '🔵', category: 'Backend', level: 'Intermediate' },
  { name: 'Rust', icon: '🦀', category: 'Backend', level: 'Intermediate' },
  { name: 'PostgreSQL', icon: '🐘', category: 'Database', level: 'Expert' },
  { name: 'MySQL', icon: '🗄️', category: 'Database', level: 'Expert' },
  { name: 'MongoDB', icon: '🍃', category: 'Database', level: 'Expert' },
  { name: 'Redis', icon: '📀', category: 'Database', level: 'Advanced' },
  { name: 'Oracle', icon: '🔶', category: 'Database', level: 'Advanced' },
  { name: 'SQLite', icon: '📁', category: 'Database', level: 'Advanced' },
  { name: 'Docker', icon: '🐳', category: 'DevOps', level: 'Expert' },
  { name: 'Kubernetes', icon: '⚙️', category: 'DevOps', level: 'Advanced' },
  { name: 'Jenkins', icon: '🔧', category: 'DevOps', level: 'Advanced' },
  { name: 'GitHub Actions', icon: '⚡', category: 'DevOps', level: 'Expert' },
  { name: 'Terraform', icon: '🏗️', category: 'DevOps', level: 'Advanced' },
  { name: 'Ansible', icon: '📦', category: 'DevOps', level: 'Advanced' },
  { name: 'AWS', icon: '☁️', category: 'Cloud', level: 'Expert' },
  { name: 'Azure', icon: '☁️', category: 'Cloud', level: 'Advanced' },
  { name: 'GCP', icon: '☁️', category: 'Cloud', level: 'Advanced' },
  { name: 'DigitalOcean', icon: '🌊', category: 'Cloud', level: 'Advanced' },
  { name: 'Vercel', icon: '▲', category: 'Cloud', level: 'Expert' },
  { name: 'Netlify', icon: '🌐', category: 'Cloud', level: 'Expert' },
  { name: 'Git', icon: '📚', category: 'Tools', level: 'Expert' },
  { name: 'GitHub', icon: '🐙', category: 'Tools', level: 'Expert' },
  { name: 'GitLab', icon: '🦊', category: 'Tools', level: 'Advanced' },
  { name: 'Figma', icon: '🎨', category: 'Design', level: 'Advanced' },
  { name: 'Adobe XD', icon: '🎨', category: 'Design', level: 'Advanced' },
  { name: 'JWT', icon: '🔐', category: 'Security', level: 'Expert' },
  { name: 'OAuth', icon: '🔑', category: 'Security', level: 'Advanced' },
  { name: 'SSL/TLS', icon: '🔒', category: 'Security', level: 'Advanced' },
  { name: 'HTML5', icon: '🌐', category: 'Web', level: 'Expert' },
  { name: 'CSS3', icon: '🎨', category: 'Web', level: 'Expert' },
  { name: 'JavaScript', icon: '💛', category: 'Web', level: 'Expert' },
  { name: 'JSON', icon: '📋', category: 'Web', level: 'Expert' },
  { name: 'XML', icon: '📄', category: 'Web', level: 'Advanced' },
  { name: 'GraphQL', icon: '📊', category: 'API', level: 'Advanced' },
  { name: 'REST API', icon: '🔌', category: 'API', level: 'Expert' },
  { name: 'WebSocket', icon: '🔄', category: 'API', level: 'Advanced' },
  { name: 'Socket.io', icon: '🔌', category: 'API', level: 'Advanced' },
  { name: 'Nginx', icon: '🌍', category: 'Server', level: 'Advanced' },
  { name: 'Apache', icon: '🪶', category: 'Server', level: 'Advanced' },
  { name: 'Linux', icon: '🐧', category: 'OS', level: 'Expert' },
  { name: 'Ubuntu', icon: '🐧', category: 'OS', level: 'Expert' },
  { name: 'CentOS', icon: '🐧', category: 'OS', level: 'Advanced' },
  { name: 'Prometheus', icon: '📊', category: 'Monitoring', level: 'Advanced' },
  { name: 'Grafana', icon: '📈', category: 'Monitoring', level: 'Advanced' },
  { name: 'Elasticsearch', icon: '🔍', category: 'Search', level: 'Advanced' },
  { name: 'Logstash', icon: '📦', category: 'Logging', level: 'Advanced' },
  { name: 'Kibana', icon: '📊', category: 'Visualization', level: 'Advanced' }
];

const developers = [
  {
    name: 'Mohd Alkamah Sheikh',
    role: 'CEO & Founder | Python Full Stack Developer',
    image: null,
    initials: 'MS',
    gradient: 'from-electric-blue to-neon-cyan',
    bio: 'Visionary leader and full-stack architect with 8+ years of experience in building scalable web applications and leading development teams.',
    skills: ['Python', 'Django', 'Flask', 'FastAPI', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Oracle', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins', 'GitHub Actions', 'Linux', 'Security'],
    experience: '8+ Years',
    projects: '100+',
    isFounder: true
  },
  {
    name: 'Aarav Sharma',
    role: 'Senior Backend Architect',
    image: null,
    initials: 'AS',
    gradient: 'from-deep-purple to-neon-cyan',
    bio: 'Backend specialist with expertise in high-performance systems, microservices, and cloud infrastructure.',
    skills: ['Python', 'Django', 'Node.js', 'Java', 'Spring Boot', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'K8s', 'AWS'],
    experience: '6+ Years',
    projects: '75+',
    isFounder: false
  },
  {
    name: 'Ishita Verma',
    role: 'Lead Frontend Engineer',
    image: null,
    initials: 'IV',
    gradient: 'from-neon-cyan to-neon-green',
    bio: 'UI/UX expert creating beautiful, responsive, and accessible web applications with modern frameworks.',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Figma', 'Vue.js', 'Angular', 'Redux', 'GraphQL'],
    experience: '5+ Years',
    projects: '80+',
    isFounder: false
  },
  {
    name: 'Rohan Mehta',
    role: 'DevOps & Cloud Engineer',
    image: null,
    initials: 'RM',
    gradient: 'from-neon-green to-electric-blue',
    bio: 'Cloud infrastructure specialist automating deployments and managing scalable production systems.',
    skills: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'AWS', 'Azure', 'GCP', 'Prometheus', 'Grafana', 'Linux'],
    experience: '5+ Years',
    projects: '60+',
    isFounder: false
  },
  {
    name: 'Priya Patel',
    role: 'Mobile App Developer',
    image: null,
    initials: 'PP',
    gradient: 'from-electric-blue to-deep-purple',
    bio: 'Cross-platform mobile expert building high-performance iOS and Android applications.',
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Kotlin', 'Swift', 'Firebase', 'Redux', 'GraphQL'],
    experience: '4+ Years',
    projects: '50+',
    isFounder: false
  },
  {
    name: 'Aditya Singh',
    role: 'Database Administrator',
    image: null,
    initials: 'AS',
    gradient: 'from-deep-purple to-electric-blue',
    bio: 'Database expert optimizing performance, ensuring data integrity, and managing large-scale databases.',
    skills: ['PostgreSQL', 'MySQL', 'Oracle', 'MongoDB', 'Redis', 'Cassandra', 'Elasticsearch', 'Database Design', 'Performance Tuning'],
    experience: '6+ Years',
    projects: '70+',
    isFounder: false
  },
  {
    name: 'Neha Gupta',
    role: 'Security Engineer',
    image: null,
    initials: 'NG',
    gradient: 'from-neon-cyan to-deep-purple',
    bio: 'Security specialist protecting applications from threats and ensuring compliance standards.',
    skills: ['Penetration Testing', 'OWASP', 'JWT', 'OAuth', 'SSL/TLS', 'Security Audits', 'Encryption', 'Compliance'],
    experience: '4+ Years',
    projects: '40+',
    isFounder: false
  },
  {
    name: 'Vikram Rathore',
    role: 'QA Automation Engineer',
    image: null,
    initials: 'VR',
    gradient: 'from-neon-green to-deep-purple',
    bio: 'Quality assurance expert ensuring bug-free releases through automated testing frameworks.',
    skills: ['Jest', 'React Testing Library', 'Cypress', 'Selenium', 'JUnit', 'Postman', 'Load Testing', 'CI/CD'],
    experience: '4+ Years',
    projects: '65+',
    isFounder: false
  }
];

function TechCard({ tech }) {
  return (
    <div className="glass-card neon-border rounded-xl p-3 text-center group hover:-translate-y-1 transition-all duration-300">
      <div className="text-3xl mb-2">{tech.icon}</div>
      <div className="font-mono text-xs text-neon-cyan">{tech.name}</div>
      <div className="text-slate-500 text-xs mt-1">{tech.category}</div>
    </div>
  );
}

function DeveloperCard({ developer }) {
  return (
    <div className="glass-card neon-border rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-300">
      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${developer.gradient} flex items-center justify-center mx-auto mb-4 text-2xl font-sora font-extrabold text-white group-hover:scale-110 transition-transform`}>
        {developer.initials}
      </div>
      <h3 className="font-sora font-bold text-white text-center text-lg mb-1">{developer.name}</h3>
      <p className="text-neon-cyan text-xs text-center font-mono mb-3">{developer.role}</p>
      <p className="text-slate-400 text-xs text-center mb-4">{developer.bio}</p>
      <div className="flex justify-center gap-4 mb-4 text-xs">
        <div className="text-center">
          <div className="text-white font-bold">{developer.experience}</div>
          <div className="text-slate-500 text-xs">Experience</div>
        </div>
        <div className="text-center">
          <div className="text-white font-bold">{developer.projects}+</div>
          <div className="text-slate-500 text-xs">Projects</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {developer.skills.slice(0, 5).map(skill => (
          <span key={skill} className="px-2 py-0.5 rounded-md bg-dark-card border border-dark-border text-xs font-mono text-slate-400">
            {skill}
          </span>
        ))}
        {developer.skills.length > 5 && (
          <span className="px-2 py-0.5 rounded-md bg-dark-card border border-dark-border text-xs font-mono text-slate-500">
            +{developer.skills.length - 5}
          </span>
        )}
      </div>
      {developer.isFounder && (
        <div className="mt-4 text-center">
          <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-electric-blue to-neon-cyan text-white text-xs font-mono">
            Founder & CEO
          </span>
        </div>
      )}
    </div>
  );
}

// Infinite Sliding Testimonial Component - Shows only image, name, and review
function InfiniteTestimonials({ testimonials }) {
  const scrollContainerRef = React.useRef(null);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || isPaused || testimonials.length === 0) return;

    let animationId;
    let scrollPosition = 0;
    const scrollSpeed = 0.8;

    const autoScroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(autoScroll);
    };

    animationId = requestAnimationFrame(autoScroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPaused, testimonials.length]);

  if (testimonials.length === 0) return null;

  // Take only first 20 testimonials for infinite sliding
  const displayTestimonials = testimonials.slice(0, 20);
  const duplicatedTestimonials = [...displayTestimonials, ...displayTestimonials];

  function getAvatarColor(name) {
    const colors = [
      'from-red-500 to-pink-500', 'from-orange-500 to-red-500', 'from-yellow-500 to-orange-500',
      'from-green-500 to-emerald-500', 'from-teal-500 to-cyan-500', 'from-cyan-500 to-blue-500',
      'from-blue-500 to-indigo-500', 'from-indigo-500 to-purple-500', 'from-purple-500 to-pink-500'
    ];
    const idx = (name?.charCodeAt(0) || 0) % colors.length;
    return colors[idx];
  }

  function getInitials(name) {
    if (!name) return 'C';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  function TestimonialSlide({ testimonial }) {
    const avatarColor = getAvatarColor(testimonial.client_name);
    const initials = getInitials(testimonial.client_name);

    return (
      <div className="glass-card rounded-2xl p-6 mx-4 w-80 flex-shrink-0 h-full flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-blue">
        {/* Client Image - Top Center */}
        <div className="mb-4">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center mx-auto shadow-lg ring-2 ring-dark-border`}>
            <span className="text-white font-bold text-xl">{initials}</span>
          </div>
        </div>

        {/* Client Name */}
        <h3 className="font-sora font-bold text-white text-lg mb-2">
          {testimonial.client_name || 'Happy Client'}
        </h3>

        {/* Review Message */}
        <div className="relative flex-1 mt-2">
          <Quote size={20} className="text-electric-blue/20 absolute -top-2 -left-2" />
          <p className="text-slate-300 text-sm leading-relaxed px-2 line-clamp-4">
            "{testimonial.message?.substring(0, 120)}..."
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide py-6"
        style={{ scrollBehavior: 'smooth', cursor: 'grab' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <TestimonialSlide key={`${testimonial.id}-${index}`} testimonial={testimonial} />
        ))}
      </div>
      
      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-dark-bg to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-dark-bg to-transparent pointer-events-none" />
      
      {/* View All Link */}
      <div className="text-center mt-6">
        <Link to="/testimonials" className="text-sm text-slate-400 hover:text-neon-cyan transition-colors inline-flex items-center gap-1">
          View All {testimonials.length} Testimonials
          <ArrowRight size={14} />
        </Link>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

function CEOSection() {
  return (
    <div className="glass-card neon-border rounded-2xl p-8 mb-16">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="text-center">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-electric-blue to-neon-cyan flex items-center justify-center mx-auto mb-4 text-4xl font-sora font-extrabold text-white">
              <img src={ceo} alt="CEO" className="w-full h-full object-cover rounded-3xl" />
            </div>
            <h3 className="font-sora font-bold text-white text-xl">Mohd Alkamah Sheikh</h3>
            <p className="text-neon-cyan text-sm font-mono mt-1">Founder & CEO</p>
            <p className="text-slate-400 text-sm mt-2">Python Full Stack Developer | DevOps | DevSecOps Architect</p>
            <div className="flex justify-center gap-2 mt-4">
              <span className="px-2 py-1 rounded-md bg-dark-card border border-dark-border text-xs text-slate-400">8+ Years Experience</span>
              <span className="px-2 py-1 rounded-md bg-dark-card border border-dark-border text-xs text-slate-400">100+ Projects</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Award size={24} className="text-yellow-400" />
            <h4 className="font-sora font-bold text-white text-lg">Message from the Founder</h4>
          </div>
          <p className="text-slate-300 leading-relaxed mb-6">
            "At GrowUp, our mission is to empower businesses with cutting-edge technology solutions that drive real growth. 
            I started this company with a vision to bridge the gap between innovative ideas and technical execution. 
            With over 8 years of experience in full-stack development, DevOps, and cloud architecture, I've assembled a team 
            of passionate engineers who share my commitment to excellence.
          </p>
          <p className="text-slate-300 leading-relaxed mb-6">
            We don't just write code; we build solutions that solve real business problems. Whether it's a complex web application, 
            a scalable mobile app, or enterprise-grade cloud infrastructure, we approach every project with the same dedication 
            and attention to detail. Our client-first philosophy ensures that your success is our success.
          </p>
          <p className="text-slate-300 leading-relaxed">
            I invite you to partner with us on your next project. Let's build something amazing together!"
          </p>
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-dark-border">
            <div className="flex -space-x-2">
              {['Python', 'Django', 'React', 'AWS', 'Docker', 'K8s'].map((tech, idx) => (
                <span key={tech} className="w-8 h-8 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-xs">
                  {tech.charAt(0)}
                </span>
              ))}
            </div>
            <div className="text-slate-500 text-xs">
              Python • Django • React • AWS • Docker • Kubernetes • Terraform • Jenkins
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const [projectCount, setProjectCount] = useState(0);
  const [technologiesCount, setTechnologiesCount] = useState(3000);
  const [clientCount, setClientCount] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [visibleTechCount, setVisibleTechCount] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
      
      setProjectCount(projects.length);
      setClientCount(Math.floor(projects.length * 0.8));
      
      // Extract testimonials from projects
      const projectTestimonials = projects
        .filter(project => {
          const review = project.client_review || project.clientReview;
          return review && review.trim() !== '';
        })
        .map(project => ({
          id: `project-${project.id}`,
          client_name: project.client_name || project.clientName || 'Happy Client',
          message: project.client_review || project.clientReview,
          rating: project.client_rating || project.clientRating || 5,
          project_title: project.title,
          project_slug: project.slug,
          completion_date: project.completion_date,
          status: project.status
        }));
      
      setTestimonials(projectTestimonials);
      
      // Get technologies count
      const allTechs = new Set();
      projects.forEach(project => {
        const techStack = project.tech_stack_list || project.tech_stack || [];
        if (Array.isArray(techStack)) {
          techStack.forEach(tech => {
            if (tech) allTechs.add(tech);
          });
        }
      });
      setTechnologiesCount(Math.max(allTechs.size, techStacks.length));
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setProjectCount(100);
      setClientCount(80);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTech = () => {
    setVisibleTechCount(prev => prev + 30);
  };

  const visibleTechs = techStacks.slice(0, visibleTechCount);

  return (
    <main className="min-h-screen pt-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative overflow-hidden">
        <div className="orb w-96 h-96 bg-electric-blue/10 -top-20 -right-20" />
        <div className="text-center max-w-3xl mx-auto">
          <span className="section-tag">Our Story</span>
          <h1 className="text-5xl md:text-6xl font-sora font-extrabold mb-6">
            We Are <span className="gradient-text">GrowUp</span>
          </h1>
          <p className="text-slate-400 font-outfit text-xl leading-relaxed mb-8">
            A team of passionate engineers, designers, and problem-solvers dedicated to building digital products that make businesses grow faster and smarter.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/contact" className="btn-primary">
              Work With Us <ArrowRight size={16} />
            </Link>
            <Link to="/portfolio" className="btn-outline">
              See Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Stats */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="text-4xl font-sora font-bold gradient-text">{projectCount}+</div>
            <div className="text-slate-500 text-sm mt-1">Projects Delivered</div>
          </div>
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="text-4xl font-sora font-bold gradient-text">{clientCount}+</div>
            <div className="text-slate-500 text-sm mt-1">Happy Clients</div>
          </div>
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="text-4xl font-sora font-bold gradient-text">{technologiesCount.toLocaleString()}+</div>
            <div className="text-slate-500 text-sm mt-1">Technologies Mastered</div>
          </div>
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="text-4xl font-sora font-bold gradient-text">98%</div>
            <div className="text-slate-500 text-sm mt-1">Client Satisfaction</div>
          </div>
        </div>
      </section>

      <Stats />

      {/* CEO Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <CEOSection />
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-dark-card/30 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-tag">Mission & Vision</span>
              <h2 className="text-4xl md:text-5xl font-sora font-bold mb-6">
                Empowering <span className="gradient-text">Digital Futures</span>
              </h2>
              <div className="space-y-6">
                <div className="glass-card neon-border rounded-2xl p-5">
                  <h3 className="font-sora font-bold text-neon-cyan mb-2 text-sm font-mono uppercase tracking-wider">Our Mission</h3>
                  <p className="text-slate-300 font-outfit leading-relaxed">
                    GrowUp delivers high-quality mobile applications, web platforms, networking solutions, full-stack systems, and cloud deployments that help businesses grow faster and smarter.
                  </p>
                </div>
                <div className="glass-card neon-border rounded-2xl p-5">
                  <h3 className="font-sora font-bold text-deep-purple mb-2 text-sm font-mono uppercase tracking-wider" style={{color: '#a78bfa'}}>Our Vision</h3>
                  <p className="text-slate-300 font-outfit leading-relaxed">
                    To empower businesses and startups with scalable digital solutions through innovation, technology, and modern engineering — from idea to deployment.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Code2, title: 'Code Quality', desc: 'We write clean, tested, documented code that stands the test of time.' },
                { icon: Rocket, title: 'Ship Fast', desc: 'Speed matters. We use agile methods to deliver faster without cutting corners.' },
                { icon: Heart, title: 'Client First', desc: 'Your success is our success. We treat every project like our own.' },
                { icon: Shield, title: 'Reliability', desc: 'Robust systems, uptime guarantees, and always-on support.' },
                { icon: Users, title: 'Collaboration', desc: 'Transparent communication and partnership throughout every project.' },
                { icon: Zap, title: 'Innovation', desc: 'Always adopting the best tools and approaches to stay ahead.' }
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="glass-card neon-border rounded-2xl p-5 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue/20 to-deep-purple/20 border border-electric-blue/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon size={18} className="text-neon-cyan" />
                  </div>
                  <h3 className="font-sora font-bold text-white text-sm mb-1">{title}</h3>
                  <p className="text-slate-500 text-xs font-outfit leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Developers Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="section-tag">Our Team</span>
            <h2 className="text-4xl md:text-5xl font-sora font-bold mb-3">
              Meet the <span className="gradient-text">Builders</span>
            </h2>
            <p className="text-slate-400 font-outfit max-w-xl mx-auto">
              A dedicated team of engineers and designers passionate about building great software.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {developers.map((developer) => (
              <DeveloperCard key={developer.name} developer={developer} />
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-dark-card/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="section-tag">Tech Arsenal</span>
            <h2 className="text-4xl md:text-5xl font-sora font-bold mb-3">
              Our <span className="gradient-text">Tech Stack</span>
            </h2>
            <p className="text-slate-400 font-outfit max-w-xl mx-auto">
              We master {technologiesCount.toLocaleString()}+ technologies across various domains
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {visibleTechs.map((tech) => (
              <TechCard key={tech.name} tech={tech} />
            ))}
          </div>

          {visibleTechCount < techStacks.length && (
            <div className="text-center mt-8">
              <button onClick={loadMoreTech} className="btn-outline inline-flex items-center gap-2">
                Load More Technologies <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      <TechStack />

      {/* Customer Reviews Section - Infinite Sliding with 20 cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="section-tag">Client Love</span>
            <h2 className="text-4xl md:text-5xl font-sora font-bold mb-3">
              What Our <span className="gradient-text">Clients Say</span>
            </h2>
            <p className="text-slate-400 font-outfit max-w-xl mx-auto">
              Real feedback from clients who trusted us with their projects
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
              <p className="text-slate-400">Loading testimonials...</p>
            </div>
          ) : (
            <InfiniteTestimonials testimonials={testimonials} />
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-sora font-bold mb-4">
            Ready to <span className="gradient-text">Get Started?</span>
          </h2>
          <p className="text-slate-400 font-outfit text-lg mb-8">
            Let's build something amazing together. Your idea deserves the best engineering team.
          </p>
          <Link to="/contact" className="btn-primary text-lg px-10 py-4 inline-flex">
            Start Your Project <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}