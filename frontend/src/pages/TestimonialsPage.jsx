import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, Quote, Briefcase, Calendar, Users, ArrowLeft, 
  Search, ChevronLeft, ChevronRight, X, Building, User,
  ThumbsUp, Award, Heart, CheckCircle, Clock, Zap, Filter,
  Mail, Phone, MapPin, Twitter, Linkedin, Globe
} from 'lucide-react';
import { getProjects } from '../utils/api';

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5 justify-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={16} className={i < count ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'} />
      ))}
    </div>
  );
}

function ProjectStatusBadge({ status }) {
  const statusConfig = {
    'live': { label: 'Live', icon: Zap, color: 'text-neon-green bg-neon-green/10 border-neon-green/30' },
    'completed': { label: 'Completed', icon: CheckCircle, color: 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/30' },
    'in_progress': { label: 'In Progress', icon: Clock, color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' }
  };
  
  const config = statusConfig[status] || statusConfig.completed;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono ${config.color} border`}>
      <Icon size={10} />
      {config.label}
    </span>
  );
}

function getAvatarColor(name) {
  const colors = [
    'from-red-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-yellow-500 to-orange-500',
    'from-green-500 to-emerald-500',
    'from-teal-500 to-cyan-500',
    'from-cyan-500 to-blue-500',
    'from-blue-500 to-indigo-500',
    'from-indigo-500 to-purple-500',
    'from-purple-500 to-pink-500',
    'from-pink-500 to-rose-500',
  ];
  const idx = (name?.charCodeAt(0) || 0) % colors.length;
  return colors[idx];
}

function getInitials(name) {
  if (!name) return 'C';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function TestimonialCard({ testimonial }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not specified';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const avatarColor = getAvatarColor(testimonial.client_name);
  const initials = getInitials(testimonial.client_name);

  return (
    <div className="glass-card neon-border rounded-2xl p-6 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-blue">
      {/* Client Image - Top Center */}
      <div className="flex justify-center mb-4">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center shadow-lg ring-4 ring-dark-border`}>
          <span className="text-white font-bold text-2xl">{initials}</span>
        </div>
      </div>

      {/* Client Name */}
      <h3 className="font-sora font-bold text-white text-xl text-center mb-1">
        {testimonial.client_name || 'Happy Client'}
      </h3>
      
      {/* Project Name */}
      <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mb-3">
        <Briefcase size={14} />
        <span>{testimonial.project_title || 'Project'}</span>
        <ProjectStatusBadge status={testimonial.status} />
      </div>

      {/* Rating Stars */}
      <div className="flex justify-center mb-4">
        <Stars count={testimonial.rating || 5} />
      </div>

      {/* Review Message */}
      <div className="relative flex-1 mb-4">
        <Quote size={24} className="text-electric-blue/20 absolute -top-2 -left-2" />
        <p className="text-slate-300 text-sm leading-relaxed text-center px-4 py-2 line-clamp-5">
          "{testimonial.message}"
        </p>
      </div>

      {/* Date */}
      <div className="mt-4 pt-4 border-t border-dark-border">
        <div className="flex justify-center items-center gap-2 text-xs text-slate-500">
          <Calendar size={12} />
          <span>{formatDate(testimonial.completion_date)}</span>
        </div>
      </div>

      {/* View Project Link */}
      {testimonial.project_slug && (
        <div className="mt-3 text-center">
          <Link 
            to={`/portfolio/${testimonial.project_slug}`}
            className="text-electric-blue hover:text-neon-cyan transition-colors inline-flex items-center gap-1 text-sm"
          >
            View Project Details
            <ChevronRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchProjectsAndExtractTestimonials();
  }, []);

  const fetchProjectsAndExtractTestimonials = async () => {
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
      
      // Extract testimonials from ALL projects
      const extractedTestimonials = projects.map(project => ({
        id: `project-${project.id}`,
        client_name: project.client_name || project.clientName || 'Happy Client',
        message: project.client_review || project.clientReview || "Great work! The team delivered beyond expectations.",
        rating: project.client_rating || project.clientRating || 5,
        project_title: project.title,
        project_slug: project.slug,
        completion_date: project.completion_date || project.created_at,
        status: project.status || 'completed',
      }));
      
      setTestimonials(extractedTestimonials);
      setFilteredTestimonials(extractedTestimonials);
      
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter testimonials based on search and status
  useEffect(() => {
    let filtered = [...testimonials];
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.client_name?.toLowerCase().includes(term) ||
        t.message?.toLowerCase().includes(term) ||
        t.project_title?.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }
    
    setFilteredTestimonials(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, testimonials]);

  // Pagination
  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const paginatedTestimonials = filteredTestimonials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => setSearchTerm('');

  // Calculate statistics
  const stats = {
    total: testimonials.length,
    averageRating: testimonials.length > 0 
      ? (testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length).toFixed(1) 
      : '0',
    fiveStar: testimonials.filter(t => t.rating === 5).length,
    live: testimonials.filter(t => t.status === 'live').length,
    completed: testimonials.filter(t => t.status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
          <p className="text-slate-400">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-tag">Client Stories</span>
          <h1 className="text-5xl md:text-6xl font-sora font-extrabold mb-4">
            <span className="gradient-text">Testimonials</span>
          </h1>
          <p className="text-slate-400 font-outfit text-lg max-w-2xl mx-auto">
            Hear what our clients have to say about their experience working with GrowUp
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text">{stats.total}</div>
            <div className="text-xs text-slate-500">Testimonials</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text">{stats.averageRating}</div>
            <div className="text-xs text-slate-500">Avg Rating</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text">{stats.fiveStar}</div>
            <div className="text-xs text-slate-500">5-Star</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text text-neon-green">{stats.live}</div>
            <div className="text-xs text-slate-500">Live Projects</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text text-neon-cyan">{stats.completed}</div>
            <div className="text-xs text-slate-500">Completed</div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search by client name or project..."
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
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-white text-sm focus:outline-none focus:border-electric-blue"
              >
                <option value="all">All Status</option>
                <option value="live">Live Projects</option>
                <option value="completed">Completed Projects</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>
          </div>
          
          <div className="mt-2 text-right">
            <p className="text-slate-500 text-xs">
              Showing {paginatedTestimonials.length} of {filteredTestimonials.length} testimonial{filteredTestimonials.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Testimonials Grid */}
        {filteredTestimonials.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-slate-400 text-lg">No testimonials found</p>
            {searchTerm && (
              <button onClick={clearSearch} className="mt-4 text-electric-blue hover:text-neon-cyan">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedTestimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
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
                  <ChevronLeft size={20} />
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

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}