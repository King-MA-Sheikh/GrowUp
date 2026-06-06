import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, MapPin, Github, Linkedin, Twitter, Globe,
  Briefcase, Code2, Star, Award, Calendar, Users, CheckCircle,
  ExternalLink, MessageCircle, ThumbsUp, Share2, Bookmark,
  FolderGit2, TrendingUp as TrendingUpIcon, Heart, Clock,
  Smartphone, Database, Server, Cloud, Shield, Brain, Cpu,
  GraduationCap, User, Mail as MailIcon, Phone as PhoneIcon,
  ChevronRight, Facebook
} from 'lucide-react';
import { getTeamMember, getProjects } from '../utils/api';

const roleLabels = {
  'ceo': 'CEO & Founder',
  'cto': 'CTO',
  'lead_backend': 'Lead Backend Developer',
  'lead_frontend': 'Lead Frontend Developer',
  'lead_devops': 'Lead DevOps Engineer',
  'lead_mobile': 'Lead Mobile Developer',
  'senior_backend': 'Senior Backend Developer',
  'senior_frontend': 'Senior Frontend Developer',
  'senior_devops': 'Senior DevOps Engineer',
  'senior_mobile': 'Senior Mobile Developer',
  'backend_dev': 'Backend Developer',
  'frontend_dev': 'Frontend Developer',
  'devops_engineer': 'DevOps Engineer',
  'mobile_dev': 'Mobile Developer',
  'qa_engineer': 'QA Engineer',
  'ui_ux_designer': 'UI/UX Designer',
  'project_manager': 'Project Manager',
  'data_scientist': 'Data Scientist',
  'ai_engineer': 'AI Engineer',
  'security_engineer': 'Security Engineer'
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

export default function TeamMemberDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    fetchMemberData();
  }, [slug]);

  const fetchMemberData = async () => {
    setLoading(true);
    try {
      // Fetch team member details
      const response = await getTeamMember(slug);
      const memberData = response.data;
      setMember(memberData);
      
      // Fetch projects related to this member's skills
      const projectsRes = await getProjects({ page_size: 50 });
      let allProjects = projectsRes.data.results || projectsRes.data || [];
      
      // Filter projects that match member's skills
      const filteredProjects = allProjects.filter(project => 
        (project.tech_stack_list || project.tech_stack || []).some(tech => 
          memberData.skills?.some(skill => 
            tech.toLowerCase().includes(skill.toLowerCase())
          )
        )
      ).slice(0, 4);
      
      setRelatedProjects(filteredProjects);
    } catch (err) {
      console.error('Error fetching member:', err);
      setError('Team member not found');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${member?.name} - ${member?.role_display || member?.role} at GrowUp`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(member?.name)}&body=${encodeURIComponent(text + '\n\n' + url)}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-sora font-bold text-white mb-2">Team Member Not Found</h2>
          <p className="text-slate-400 mb-6">The team member you're looking for doesn't exist.</p>
          <Link to="/team" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Team
          </Link>
        </div>
      </div>
    );
  }

  const gradient = roleColors[member.role] || 'from-gray-500 to-slate-500';
  const getInitials = () => {
    return member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button and Share */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/team')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Team
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className="p-2 rounded-xl bg-dark-card border border-dark-border hover:border-electric-blue transition-colors"
            >
              <Bookmark size={18} className={bookmarked ? 'fill-electric-blue text-electric-blue' : 'text-slate-400'} />
            </button>
            <div className="relative group">
              <button className="p-2 rounded-xl bg-dark-card border border-dark-border hover:border-electric-blue transition-colors">
                <Share2 size={18} className="text-slate-400" />
              </button>
              <div className="absolute right-0 top-full mt-2 p-2 bg-dark-card border border-dark-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 flex gap-2">
                <button onClick={() => handleShare('twitter')} className="p-2 rounded-lg hover:bg-dark-border">
                  <Twitter size={18} className="text-slate-400" />
                </button>
                <button onClick={() => handleShare('linkedin')} className="p-2 rounded-lg hover:bg-dark-border">
                  <Linkedin size={18} className="text-slate-400" />
                </button>
                <button onClick={() => handleShare('facebook')} className="p-2 rounded-lg hover:bg-dark-border">
                  <Facebook size={18} className="text-slate-400" />
                </button>
                <button onClick={() => handleShare('email')} className="p-2 rounded-lg hover:bg-dark-border">
                  <Mail size={18} className="text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="glass-card rounded-2xl overflow-hidden mb-8">
          <div className={`h-48 bg-gradient-to-r ${gradient} relative`}>
            {member.cover_image_url && (
              <img src={member.cover_image_url} alt="" className="w-full h-full object-cover opacity-30" />
            )}
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full bg-dark-card border-4 border-dark-border overflow-hidden shadow-xl">
                {member.profile_image_url ? (
                  <img src={member.profile_image_url} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <span className="text-white font-bold text-3xl">{getInitials()}</span>
                  </div>
                )}
              </div>
            </div>
            {member.is_available && (
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-neon-green/20 border border-neon-green/40 text-neon-green text-sm font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                Available for Work
              </div>
            )}
          </div>
          
          <div className="p-8 pt-20">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-sora font-extrabold text-white">{member.name}</h1>
                <p className="text-neon-cyan text-lg font-mono mt-1">{roleLabels[member.role] || member.role}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Briefcase size={14} />
                    <span>{member.experience_years}+ years experience</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FolderGit2 size={14} />
                    <span>{member.projects_completed}+ projects completed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400" />
                    <span>{member.rating} rating</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                  Hire Me <MessageCircle size={16} />
                </Link>
                <button className="px-4 py-2 rounded-xl bg-dark-card border border-dark-border text-slate-400 hover:text-white transition-colors">
                  <Heart size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-8 border-b border-dark-border">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-6 py-3 font-outfit font-medium transition-all duration-200 ${
              activeTab === 'about'
                ? 'text-electric-blue border-b-2 border-electric-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-6 py-3 font-outfit font-medium transition-all duration-200 ${
              activeTab === 'skills'
                ? 'text-electric-blue border-b-2 border-electric-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Skills & Expertise
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 font-outfit font-medium transition-all duration-200 ${
              activeTab === 'projects'
                ? 'text-electric-blue border-b-2 border-electric-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Featured Projects ({relatedProjects.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'about' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-sora font-bold text-white mb-4 flex items-center gap-2">
                  <User size={20} className="text-electric-blue" />
                  About {member.name.split(' ')[0]}
                </h2>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{member.bio}</p>
              </div>

              {/* Certifications */}
              {member.certifications?.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-xl font-sora font-bold text-white mb-4 flex items-center gap-2">
                    <Award size={20} className="text-yellow-400" />
                    Certifications
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {member.certifications.map(cert => (
                      <span key={cert} className="px-3 py-1.5 rounded-xl bg-neon-green/10 border border-neon-green/20 text-neon-green text-sm">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {member.languages?.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-xl font-sora font-bold text-white mb-4 flex items-center gap-2">
                    <Globe size={20} className="text-cyan-400" />
                    Languages
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {member.languages.map(lang => (
                      <div key={lang.name} className="flex justify-between items-center p-3 rounded-xl bg-dark-card/50">
                        <span className="text-white">{lang.name}</span>
                        <span className="text-neon-cyan text-sm">{lang.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="glass-card rounded-2xl p-6 text-center bg-gradient-to-br from-neon-green/10 to-electric-blue/10">
                <FolderGit2 size={32} className="text-electric-blue mx-auto mb-3" />
                <div className="text-4xl font-sora font-bold gradient-text">{member.projects_completed}+</div>
                <p className="text-slate-400 mt-2">Projects Completed</p>
                <p className="text-slate-500 text-sm mt-1">Successfully delivered with client satisfaction</p>
              </div>

              {/* Contact Info */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-sora font-bold text-white mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                      <MailIcon size={16} />
                      <span className="text-sm">{member.email}</span>
                    </a>
                  )}
                  {member.phone && (
                    <a href={`tel:${member.phone}`} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                      <PhoneIcon size={16} />
                      <span className="text-sm">{member.phone}</span>
                    </a>
                  )}
                  {member.location && (
                    <div className="flex items-center gap-3 text-slate-400">
                      <MapPin size={16} />
                      <span className="text-sm">{member.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-sora font-bold text-white mb-4">Social Profiles</h3>
                <div className="flex gap-3 flex-wrap">
                  {member.github_url && (
                    <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-slate-400 hover:text-white hover:border-electric-blue transition-all">
                      <Github size={18} />
                    </a>
                  )}
                  {member.linkedin_url && (
                    <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-slate-400 hover:text-white hover:border-electric-blue transition-all">
                      <Linkedin size={18} />
                    </a>
                  )}
                  {member.twitter_url && (
                    <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-slate-400 hover:text-white hover:border-electric-blue transition-all">
                      <Twitter size={18} />
                    </a>
                  )}
                  {member.portfolio_url && (
                    <a href={member.portfolio_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-slate-400 hover:text-white hover:border-electric-blue transition-all">
                      <Globe size={18} />
                    </a>
                  )}
                </div>
              </div>

              {/* Call to Action */}
              <div className="glass-card rounded-2xl p-6 text-center bg-gradient-to-br from-electric-blue/10 to-neon-cyan/10">
                <Users size={32} className="text-electric-blue mx-auto mb-3" />
                <h3 className="font-sora font-bold text-white text-lg mb-2">Work With {member.name.split(' ')[0]}</h3>
                <p className="text-slate-400 text-sm mb-4">Hire an expert for your next project</p>
                <Link to="/contact" className="btn-primary w-full justify-center inline-flex items-center gap-2">
                  Start a Project <ArrowLeft size={14} className="rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Technical Skills */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-sora font-bold text-white mb-4 flex items-center gap-2">
                <Code2 size={20} className="text-neon-cyan" />
                Technical Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {member.skills?.map(skill => (
                  <span key={skill} className="px-3 py-1.5 rounded-xl bg-dark-card border border-dark-border text-slate-300 text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills Categories */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-sora font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUpIcon size={20} className="text-neon-green" />
                Skill Proficiency
              </h2>
              <div className="space-y-4">
                {member.skills?.slice(0, 8).map(skill => (
                  <div key={skill}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">{skill}</span>
                      <span className="text-neon-cyan">{Math.floor(Math.random() * 30) + 70}%</span>
                    </div>
                    <div className="h-1.5 bg-dark-border rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-electric-blue to-neon-cyan rounded-full"
                        style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            {relatedProjects.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-2xl">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-slate-400 text-lg">No projects found</p>
                <p className="text-slate-500 text-sm mt-2">Check back later for featured projects</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {relatedProjects.map(project => (
                  <Link 
                    key={project.id} 
                    to={`/portfolio/${project.slug}`}
                    className="glass-card rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 hover:shadow-glow-blue block"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-blue/20 to-neon-cyan/20 flex items-center justify-center flex-shrink-0">
                        <FolderGit2 size={22} className="text-neon-cyan" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-sora font-bold text-white text-lg">{project.title}</h3>
                        <p className="text-slate-400 text-sm mt-1 line-clamp-2">{project.short_description}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            project.status === 'live' ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-cyan/20 text-neon-cyan'
                          }`}>
                            {project.status === 'live' ? 'Live' : 'Completed'}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {(project.tech_stack_list || project.tech_stack || []).slice(0, 3).map(tech => (
                              <span key={tech} className="text-xs text-slate-500">#{tech}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-500 flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}