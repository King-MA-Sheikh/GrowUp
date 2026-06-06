import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, ChevronDown, X, Users, Star, Code2, 
  Briefcase, Award, Calendar, MapPin, Mail, Phone, 
  Github, Linkedin, Twitter, Globe, ChevronRight,
  UserPlus, TrendingUp, ThumbsUp, MessageCircle, FolderGit2
} from 'lucide-react';
import { getTeamMembers, getProjects } from '../utils/api';

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

function TeamMemberCard({ member }) {
  const gradient = roleColors[member.role] || 'from-gray-500 to-slate-500';
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <Link to={`/team/${member.slug}`} className="glass-card neon-border rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-blue">
      <div className={`h-28 bg-gradient-to-r ${gradient} relative`}>
        {member.cover_image_url && (
          <img src={member.cover_image_url} alt="" className="w-full h-full object-cover opacity-50" />
        )}
        <div className="absolute -bottom-10 left-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-dark-bg to-dark-card border-4 border-dark-border overflow-hidden">
            {member.profile_image_url ? (
              <img src={member.profile_image_url} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <span className="text-white font-bold text-2xl">{getInitials(member.name)}</span>
              </div>
            )}
          </div>
        </div>
        {member.is_featured && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 text-xs font-mono flex items-center gap-1">
            <Star size={10} /> Featured
          </div>
        )}
        {member.is_available && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-neon-green/20 border border-neon-green/40 text-neon-green text-xs font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            Available
          </div>
        )}
      </div>
      
      <div className="p-6 pt-12">
        <h3 className="font-sora font-bold text-white text-lg">{member.name}</h3>
        <p className="text-neon-cyan text-sm font-mono">{roleLabels[member.role] || member.role}</p>
        <p className="text-slate-400 text-sm mt-2 line-clamp-2">{member.short_bio || member.bio?.substring(0, 100)}</p>
        
        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Briefcase size={12} />
            <span>{member.experience_years}+ yrs</span>
          </div>
          <div className="flex items-center gap-1">
            <FolderGit2 size={12} />
            <span>{member.projects_completed}+ projects</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400" />
            <span>{member.rating}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5 mt-3">
          {(member.skills || []).slice(0, 4).map(skill => (
            <span key={skill} className="px-2 py-0.5 rounded-full bg-dark-card border border-dark-border text-xs text-slate-400">
              {skill}
            </span>
          ))}
          {(member.skills || []).length > 4 && (
            <span className="px-2 py-0.5 rounded-full bg-dark-card border border-dark-border text-xs text-slate-500">
              +{(member.skills || []).length - 4}
            </span>
          )}
        </div>
        
        <div className="mt-4 pt-3 border-t border-dark-border flex justify-between items-center">
          <div className="flex gap-2">
            {member.github_url && (
              <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                <Github size={16} />
              </a>
            )}
            {member.linkedin_url && (
              <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                <Linkedin size={16} />
              </a>
            )}
            {member.twitter_url && (
              <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                <Twitter size={16} />
              </a>
            )}
          </div>
          <span className="text-electric-blue text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            View Profile <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjectsCompleted, setTotalProjectsCompleted] = useState(0);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchTeamMembers();
    fetchTotalProjects();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await getTeamMembers();
      const membersData = response.data.results || response.data || [];
      setMembers(membersData);
      setFilteredMembers(membersData);
    } catch (err) {
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalProjects = async () => {
    try {
      const response = await getProjects({ page_size: 1000 });
      const projects = response.data.results || response.data || [];
      setTotalProjectsCompleted(projects.length);
    } catch (err) {
      console.error('Error fetching projects count:', err);
      // Fallback to sum of member projects if API fails
      const total = members.reduce((sum, m) => sum + (m.projects_completed || 0), 0);
      setTotalProjectsCompleted(total);
    }
  };

  useEffect(() => {
    let filtered = [...members];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(term) ||
        (roleLabels[m.role] || '').toLowerCase().includes(term) ||
        (m.skills || []).some(s => s.toLowerCase().includes(term)) ||
        m.bio?.toLowerCase().includes(term)
      );
    }
    
    if (selectedRole !== 'all') {
      filtered = filtered.filter(m => m.role === selectedRole);
    }
    
    setFilteredMembers(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedRole, members]);

  const roles = ['all', ...new Set(members.map(m => m.role))];
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => setSearchTerm('');

  // Calculate statistics
  const stats = {
    total: members.length,
    available: members.filter(m => m.is_available).length,
    featured: members.filter(m => m.is_featured).length,
    totalProjects: totalProjectsCompleted
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
          <p className="text-slate-400">Loading team members...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-tag">Our Team</span>
          <h1 className="text-5xl md:text-6xl font-sora font-extrabold mb-4">
            Meet the <span className="gradient-text">Experts</span>
          </h1>
          <p className="text-slate-400 font-outfit text-lg max-w-2xl mx-auto">
            A team of passionate engineers, designers, and problem-solvers dedicated to building great software.
          </p>
        </div>

        {/* Stats Cards - Dynamic from Portfolio */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text">{stats.total}</div>
            <div className="text-xs text-slate-500">Team Members</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text text-neon-green">{stats.available}</div>
            <div className="text-xs text-slate-500">Available for Work</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text">{stats.featured}</div>
            <div className="text-xs text-slate-500">Featured Experts</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text">{stats.totalProjects.toLocaleString()}+</div>
            <div className="text-xs text-slate-500">Projects Completed</div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, role, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-dark-card border border-dark-border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-blue transition-colors"
              />
              {searchTerm && (
                <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-card border border-dark-border text-slate-400"
            >
              <Filter size={16} /> Filters
              <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-wrap gap-2 justify-center`}>
              <button
                onClick={() => setSelectedRole('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedRole === 'all'
                    ? 'bg-gradient-to-r from-electric-blue to-neon-cyan text-white shadow-glow-blue'
                    : 'glass-card border border-dark-border text-slate-400 hover:text-white'
                }`}
              >
                All ({filteredMembers.length})
              </button>
              {roles.filter(r => r !== 'all').map(role => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedRole === role
                      ? 'bg-gradient-to-r from-electric-blue to-neon-cyan text-white shadow-glow-blue'
                      : 'glass-card border border-dark-border text-slate-400 hover:text-white'
                  }`}
                >
                  {roleLabels[role] || role} ({members.filter(m => m.role === role).length})
                </button>
              ))}
            </div>
          </div>

          {searchTerm && (
            <div className="mt-4 text-center">
              <p className="text-slate-400 text-sm">
                Found {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} matching "{searchTerm}"
              </p>
            </div>
          )}
        </div>

        {/* Team Grid */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-slate-400 text-lg">No team members found</p>
            <button onClick={clearSearch} className="mt-4 text-electric-blue hover:text-neon-cyan">Clear search</button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? 'bg-dark-card text-slate-500 cursor-not-allowed'
                      : 'bg-dark-card text-slate-400 hover:text-white hover:border-electric-blue border border-dark-border'
                  }`}
                >
                  <ChevronRight size={20} className="rotate-180" />
                </button>
                
                <div className="flex gap-2">
                  {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNum = idx + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + idx;
                    } else {
                      pageNum = currentPage - 2 + idx;
                    }
                    
                    if (pageNum >= 1 && pageNum <= totalPages) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-electric-blue to-neon-cyan text-white'
                              : 'bg-dark-card border border-dark-border text-slate-400 hover:text-white'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? 'bg-dark-card text-slate-500 cursor-not-allowed'
                      : 'bg-dark-card text-slate-400 hover:text-white hover:border-electric-blue border border-dark-border'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}