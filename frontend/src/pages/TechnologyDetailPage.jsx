import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Github, ExternalLink, Star, Users, 
  CheckCircle, XCircle, Clock, Award, Code2, Zap, Heart,
  Share2, Bookmark, Printer, Linkedin, Twitter, Facebook, Mail,
  Database, Server, Cloud, Shield, Brain, Hexagon, BarChart3,
  Smartphone, Globe, Layers, Cpu, Lock, Palette, ShoppingCart,
  TrendingUp, Briefcase, User, Building, MessageCircle, ThumbsUp,
  Mail as MailIcon, Phone, MapPin, Linkedin as LinkedinIcon,
  Github as GithubIcon, Twitter as TwitterIcon, Award as AwardIcon,
  Info, AlertCircle, FolderGit2, Users as UsersIcon, ArrowRight,
  ChevronRight, ChevronLeft
} from 'lucide-react';
import axios from 'axios';
import { getProjects, getTeamMembers } from '../utils/api';

const API_URL = 'http://localhost:5678/api';


const categoryIcons = {
  'Frontend': <Code2 size={20} className="text-neon-cyan" />,
  'Backend': <Server size={20} className="text-neon-green" />,
  'Database': <Database size={20} className="text-electric-blue" />,
  'DevOps': <Cpu size={20} className="text-deep-purple" />,
  'Cloud': <Cloud size={20} className="text-cyan-400" />,
  'AI/ML': <Brain size={20} className="text-purple-400" />,
  'Blockchain': <Hexagon size={20} className="text-yellow-400" />,
  'Cybersecurity': <Shield size={20} className="text-red-400" />,
  'Data Science': <BarChart3 size={20} className="text-green-400" />,
  'Mobile': <Smartphone size={20} className="text-pink-400" />,
  'Web': <Globe size={20} className="text-blue-400" />,
  'API': <Layers size={20} className="text-indigo-400" />,
  'Security': <Lock size={20} className="text-orange-400" />,
  'Tools': <Zap size={20} className="text-yellow-500" />,
  'Design': <Palette size={20} className="text-rose-400" />,
  'E-Commerce': <ShoppingCart size={20} className="text-emerald-400" />
};

const roleColors = {
  'ceo': 'from-rose-500 to-pink-500',
  'cto': 'from-purple-500 to-indigo-500',
  'lead_backend': 'from-emerald-500 to-teal-500',
  'lead_frontend': 'from-blue-500 to-cyan-500',
  'lead_devops': 'from-orange-500 to-red-500',
  'lead_mobile': 'from-green-500 to-emerald-500',
  'senior_backend': 'from-teal-500 to-cyan-500',
  'senior_frontend': 'from-sky-500 to-blue-500',
  'senior_devops': 'from-amber-500 to-orange-500',
  'senior_mobile': 'from-lime-500 to-green-500',
  'backend_dev': 'from-cyan-500 to-blue-500',
  'frontend_dev': 'from-indigo-500 to-purple-500',
  'devops_engineer': 'from-red-500 to-rose-500',
  'mobile_dev': 'from-emerald-500 to-green-500',
  'qa_engineer': 'from-slate-500 to-gray-500',
  'ui_ux_designer': 'from-pink-500 to-rose-500',
  'project_manager': 'from-yellow-500 to-amber-500',
  'data_scientist': 'from-violet-500 to-purple-500',
  'ai_engineer': 'from-fuchsia-500 to-pink-500',
  'security_engineer': 'from-red-500 to-orange-500'
};

// Developer Card Component for Technology Page
function DeveloperCard({ developer, technology }) {
  const getInitials = (name) => {
    if (!name) return 'JD';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const roleColor = roleColors[developer.role] || 'from-gray-500 to-slate-500';

  return (
    <Link to={`/team/${developer.slug}`} className="glass-card rounded-xl p-4 hover:-translate-y-1 transition-all duration-300 hover:shadow-glow-blue block">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${roleColor} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white font-bold text-lg">{getInitials(developer.name)}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-sora font-bold text-white">{developer.name}</h3>
          <p className="text-neon-cyan text-xs">{developer.role_display || developer.role}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            <Briefcase size={10} />
            <span>{developer.experience_years}+ yrs</span>
            <Star size={10} className="text-yellow-400 ml-1" />
            <span>{developer.rating}</span>
          </div>
        </div>
        <ChevronRight size={16} className="text-slate-500" />
      </div>
    </Link>
  );
}

// Project Card Component
function ProjectCard({ project }) {
  return (
    <Link to={`/portfolio/${project.slug}`} className="glass-card rounded-xl p-4 hover:-translate-y-1 transition-all duration-300 hover:shadow-glow-blue block">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue/20 to-neon-cyan/20 flex items-center justify-center flex-shrink-0">
          <FolderGit2 size={18} className="text-neon-cyan" />
        </div>
        <div className="flex-1">
          <h3 className="font-sora font-bold text-white mb-1 line-clamp-1">{project.title}</h3>
          <p className="text-slate-400 text-xs line-clamp-2">{project.short_description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              project.status === 'live' ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-cyan/20 text-neon-cyan'
            }`}>
              {project.status === 'live' ? 'Live' : 'Completed'}
            </span>
            <div className="flex flex-wrap gap-1">
              {(project.tech_stack_list || project.tech_stack || []).slice(0, 2).map(tech => (
                <span key={tech} className="text-xs text-slate-500">#{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function TechnologyDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [technology, setTechnology] = useState(null);
  const [relatedDevelopers, setRelatedDevelopers] = useState([]);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchTechnologyAndRelatedData();
  }, [slug]);

  const fetchTechnologyAndRelatedData = async () => {
    setLoading(true);
    try {
      // Fetch technology details
      const techResponse = await axios.get(`${API_URL}/technologies/${slug}/`);
      const techData = techResponse.data;
      setTechnology(techData);

      // Fetch projects that use this technology
      const projectsResponse = await getProjects({ page_size: 100 });
      let allProjects = projectsResponse.data.results || projectsResponse.data || [];
      
      const filteredProjects = allProjects.filter(project => 
        (project.tech_stack_list || project.tech_stack || []).some(tech => 
          tech.toLowerCase().includes(techData.name.toLowerCase())
        )
      );
      setRelatedProjects(filteredProjects.slice(0, 6));

      // Fetch team members with skills matching this technology
      try {
        const teamResponse = await getTeamMembers();
        let allDevelopers = teamResponse.data.results || teamResponse.data || [];
        
        const filteredDevelopers = allDevelopers.filter(dev => 
          dev.skills?.some(skill => 
            skill.toLowerCase().includes(techData.name.toLowerCase()) ||
            techData.name.toLowerCase().includes(skill.toLowerCase())
          )
        ).slice(0, 4);
        
        setRelatedDevelopers(filteredDevelopers);
      } catch (err) {
        console.log('No team members API available');
        setRelatedDevelopers([]);
      }
    } catch (err) {
      console.error('Error fetching technology:', err);
      setError('Technology not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
          <p className="text-slate-400">Loading technology details...</p>
        </div>
      </div>
    );
  }

  if (error || !technology) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-sora font-bold text-white mb-2">Technology Not Found</h2>
          <p className="text-slate-400 mb-6">The technology you're looking for doesn't exist.</p>
          <Link to="/technologies" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Browse Technologies
          </Link>
        </div>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[technology.category] || <Code2 size={20} />;

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/technologies')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Technologies
        </button>

        {/* Hero Section */}
        <div className="glass-card rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-6xl">{technology.icon || '💻'}</div>
              <div>
                <h1 className="text-4xl md:text-5xl font-sora font-extrabold text-white">
                  {technology.name}
                </h1>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="flex items-center gap-1 text-sm text-slate-400">
                    {CategoryIcon}
                    {technology.category}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-sm text-slate-400">{technology.subcategory}</span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1 text-sm">
                    <TrendingUp size={14} className="text-neon-green" />
                    <span className="text-white">{technology.popularity}% Popularity</span>
                  </span>
                </div>
              </div>
            </div>

            <p className="text-slate-300 text-lg leading-relaxed mt-4">
              {technology.long_description || technology.description}
            </p>

            {/* Popularity Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Popularity Score</span>
                <span className="text-neon-cyan">{technology.popularity}%</span>
              </div>
              <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-electric-blue to-neon-cyan rounded-full"
                  style={{ width: `${technology.popularity}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                Hire {technology.name} Expert
              </Link>
              <button className="px-4 py-2 rounded-xl bg-dark-card border border-dark-border text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2">
                <Heart size={16} />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-8 border-b border-dark-border">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-outfit font-medium transition-all duration-200 ${
              activeTab === 'overview'
                ? 'text-electric-blue border-b-2 border-electric-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('developers')}
            className={`px-6 py-3 font-outfit font-medium transition-all duration-200 ${
              activeTab === 'developers'
                ? 'text-electric-blue border-b-2 border-electric-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Expert Developers ({relatedDevelopers.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 font-outfit font-medium transition-all duration-200 ${
              activeTab === 'projects'
                ? 'text-electric-blue border-b-2 border-electric-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Related Projects ({relatedProjects.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-sora font-bold text-white mb-4 flex items-center gap-2">
                  <Info size={20} className="text-electric-blue" />
                  About {technology.name}
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  {technology.long_description || `${technology.name} is a leading ${technology.category.toLowerCase()} technology in the ${technology.subcategory} space. With ${technology.popularity}% popularity rating, it's widely adopted by developers worldwide for building scalable and efficient applications.`}
                </p>
              </div>

              {/* Key Features */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-sora font-bold text-white mb-4 flex items-center gap-2">
                  <AwardIcon size={20} className="text-yellow-400" />
                  Key Features
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "High performance and scalability",
                    "Extensive ecosystem and community",
                    "Excellent documentation",
                    "Regular updates and support",
                    "Cross-platform compatibility",
                    "Security best practices"
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-neon-green" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-sora font-bold text-white mb-4">Technology Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Category</span>
                    <span className="text-white">{technology.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subcategory</span>
                    <span className="text-white">{technology.subcategory || 'General'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Popularity</span>
                    <span className="text-neon-cyan">{technology.popularity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className="text-neon-green">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Experts Available</span>
                    <span className="text-white">{relatedDevelopers.length}+</span>
                  </div>
                </div>
              </div>

              {/* Related Skills Card */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-sora font-bold text-white mb-4">Related Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {[technology.name, `${technology.name} Framework`, `${technology.name} Tools`, `${technology.name} Development`, `Advanced ${technology.name}`].map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-lg bg-dark-card border border-dark-border text-xs text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Featured Developers Preview */}
              {relatedDevelopers.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-sora font-bold text-white mb-4 flex items-center gap-2">
                    <UsersIcon size={16} className="text-neon-cyan" />
                    Top Experts
                  </h3>
                  <div className="space-y-3">
                    {relatedDevelopers.slice(0, 2).map(dev => (
                      <Link key={dev.id} to={`/team/${dev.slug}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-card/50 transition-colors">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${roleColors[dev.role] || 'from-gray-500 to-slate-500'} flex items-center justify-center`}>
                          <span className="text-white font-bold text-xs">{dev.name?.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">{dev.name}</p>
                          <p className="text-slate-500 text-xs">{dev.experience_years}+ years</p>
                        </div>
                      </Link>
                    ))}
                    {relatedDevelopers.length > 2 && (
                      <button onClick={() => setActiveTab('developers')} className="text-electric-blue text-sm mt-2 block text-center">
                        View all {relatedDevelopers.length} experts →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <div className="glass-card rounded-2xl p-6 text-center bg-gradient-to-br from-electric-blue/10 to-neon-cyan/10">
                <Briefcase size={32} className="text-electric-blue mx-auto mb-3" />
                <h3 className="font-sora font-bold text-white text-lg mb-2">Need {technology.name} Expert?</h3>
                <p className="text-slate-400 text-sm mb-4">Hire certified developers with expertise in {technology.name}</p>
                <Link to="/contact" className="btn-primary w-full justify-center inline-flex items-center gap-2">
                  Hire Now <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'developers' && (
          <div>
            {relatedDevelopers.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-2xl">
                <div className="text-6xl mb-4">👨‍💻</div>
                <p className="text-slate-400 text-lg">No developers found for {technology.name}</p>
                <p className="text-slate-500 text-sm mt-2">Check back later for expert developers</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {relatedDevelopers.map((developer) => (
                  <DeveloperCard key={developer.id} developer={developer} technology={technology.name} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            {relatedProjects.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-2xl">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-slate-400 text-lg">No projects found using {technology.name}</p>
                <p className="text-slate-500 text-sm mt-2">Be the first to create a project with this technology</p>
                <Link to="/contact" className="btn-primary inline-flex items-center gap-2 mt-4">
                  Start a Project <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {relatedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}