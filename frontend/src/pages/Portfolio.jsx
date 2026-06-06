import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../utils/api';
import { ArrowRight, Star, Code2, Search, Filter, Grid3X3, Layers, X, ChevronLeft, ChevronRight } from 'lucide-react';

const statusColors = {
  live: 'text-neon-green bg-neon-green/10 border-neon-green/30',
  completed: 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/30',
  in_progress: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
};

const categoryGradients = {
  'Healthcare & Medical': 'from-rose-500 to-pink-500',
  'E-Commerce': 'from-emerald-500 to-teal-500',
  'Education & E-Learning': 'from-blue-500 to-cyan-500',
  'Travel & Tourism': 'from-orange-500 to-amber-500',
  'Finance & Banking': 'from-green-500 to-emerald-500',
  'Real Estate': 'from-purple-500 to-indigo-500',
  'Food & Restaurant': 'from-red-500 to-orange-500',
  'Social & Community': 'from-pink-500 to-rose-500',
  'AI & Machine Learning': 'from-violet-500 to-purple-500',
  'Blockchain & Web3': 'from-cyan-500 to-blue-500',
  'Web Development': 'from-electric-blue to-neon-cyan',
  'Mobile Development': 'from-neon-cyan to-deep-purple',
  'Full Stack': 'from-deep-purple to-electric-blue',
  'Cloud & DevOps': 'from-neon-cyan to-neon-green',
  'Networking': 'from-neon-green to-electric-blue',
  'Health & Fitness': 'from-emerald-500 to-teal-500',
  'Entertainment': 'from-purple-500 to-pink-500',
  'Logistics': 'from-blue-500 to-cyan-500',
  'Utilities': 'from-gray-500 to-slate-500',
  'Media': 'from-red-500 to-orange-500',
  'Productivity': 'from-green-500 to-emerald-500',
  'Communication': 'from-sky-500 to-blue-500',
  'IoT': 'from-indigo-500 to-purple-500'
};

const techIcons = {
  'React': '⚛️', 'Python': '🐍', 'Django': '🎯', 'Node.js': '🚀',
  'PostgreSQL': '🐘', 'MongoDB': '🍃', 'Redis': '📀', 'Docker': '🐳',
  'AWS': '☁️', 'Tailwind CSS': '🎨', 'TypeScript': '📘', 'Next.js': '▲',
  'Vue.js': '💚', 'Angular': '🅰️', 'Flask': '🌶️', 'FastAPI': '⚡',
  'HTML5': '🌐', 'CSS3': '🎨', 'JavaScript': '💛', 'Express': '🚂',
  'Node': '💚', 'HTML': '📄', 'CSS': '🎨', 'JS': '💛', 'PHP': '🐘',
  'Laravel': '⚙️', 'MySQL': '🗄️', 'MongoDB': '🍃', 'Redis': '⚡',
  'JWT': '🔐', 'WebRTC': '🎥', 'Socket.io': '🔌', 'Three.js': '🎨'
};

function ProjectCard({ project }) {
  const statusStyle = statusColors[project.status] || statusColors.completed;
  const gradient = categoryGradients[project.category] || 'from-electric-blue to-neon-cyan';

  return (
    <Link to={`/portfolio/${project.slug}`} className="glass-card neon-border rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-blue flex flex-col">
      <div className={`h-48 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        {project.featured_image_url ? (
          <img 
            src={project.featured_image_url.startsWith('http') ? project.featured_image_url : `http://localhost:5678${project.featured_image_url}`} 
            alt={project.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-50">
            <Code2 size={48} className="text-white mb-2" />
            <span className="text-white text-xs">{project.category}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 to-transparent" />

        {project.is_featured && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 text-xs font-mono flex items-center gap-1 z-10">
            <Star size={10} /> Featured
          </div>
        )}

        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full border text-xs font-mono flex items-center gap-1.5 ${statusStyle} z-10`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {project.status === 'live' ? 'Live' : project.status === 'completed' ? 'Completed' : 'In Progress'}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs font-mono text-neon-cyan mb-1 capitalize">{project.category}</div>
        <h3 className="font-sora font-bold text-white text-lg mb-2 line-clamp-1">{project.title}</h3>
        <p className="text-slate-400 text-sm font-outfit leading-relaxed mb-4 flex-1 line-clamp-2">
          {project.short_description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {(project.tech_stack_list || project.tech_stack || []).slice(0, 4).map(tech => (
            <span key={tech} className="px-2 py-0.5 rounded-md bg-dark-card border border-dark-border text-xs font-mono text-slate-400 flex items-center gap-1">
              <span className="text-sm">{techIcons[tech] || '💻'}</span>
              {tech.length > 12 ? tech.substring(0, 10) + '...' : tech}
            </span>
          ))}
          {(project.tech_stack_list || project.tech_stack || []).length > 4 && (
            <span className="px-2 py-0.5 rounded-md bg-dark-card border border-dark-border text-xs font-mono text-slate-500">
              +{(project.tech_stack_list || project.tech_stack || []).length - 4}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const itemsPerPage = 9;

  // Get unique categories from projects
  const categories = ['all', ...new Set(projects.map(p => p.category).filter(Boolean))];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // Fetch all projects without pagination limit
      const response = await getProjects({ page_size: 1000 });
      console.log('Fetched projects:', response.data);
      
      let projectsData = [];
      if (response.data.results) {
        projectsData = response.data.results;
        setTotalProjects(response.data.count || projectsData.length);
        setTotalPages(Math.ceil((response.data.count || projectsData.length) / itemsPerPage));
      } else if (Array.isArray(response.data)) {
        projectsData = response.data;
        setTotalProjects(projectsData.length);
        setTotalPages(Math.ceil(projectsData.length / itemsPerPage));
      } else {
        projectsData = [];
      }
      
      setProjects(projectsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Make sure the backend server is running on port 5678');
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on search and category
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm === '' || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.short_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.tech_stack_list || project.tech_stack || []).some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Paginate filtered projects
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalFilteredPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
          <p className="text-slate-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-slate-400 mb-4">{error}</p>
          <button onClick={fetchProjects} className="btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-tag">Our Work</span>
          <h1 className="text-5xl md:text-6xl font-sora font-extrabold mb-4">
            <span className="gradient-text">Portfolio</span>
          </h1>
          <p className="text-slate-400 font-outfit text-lg max-w-2xl mx-auto">
            Explore our latest projects and success stories
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text">{totalProjects}+</div>
            <div className="text-xs text-slate-500">Total Projects</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text text-neon-green">{projects.filter(p => p.status === 'live').length}</div>
            <div className="text-xs text-slate-500">Live Projects</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text">{projects.filter(p => p.is_featured).length}</div>
            <div className="text-xs text-slate-500">Featured</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text">{categories.length - 1}</div>
            <div className="text-xs text-slate-500">Categories</div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search by title, technology, or feature..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
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
              <span className={`transition-transform ${showFilters ? 'rotate-180' : ''}`}>▼</span>
            </button>

            <div className="flex gap-2">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-electric-blue text-white' : 'bg-dark-card text-slate-400'}`}>
                <Grid3X3 size={18} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-electric-blue text-white' : 'bg-dark-card text-slate-400'}`}>
                <Layers size={18} />
              </button>
            </div>
          </div>

          <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-wrap gap-2 mt-4 justify-center`}>
            <button
              onClick={() => {
                setFilterCategory('all');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 capitalize ${
                filterCategory === 'all'
                  ? 'bg-gradient-to-r from-electric-blue to-neon-cyan text-white shadow-glow-blue'
                  : 'glass-card border border-dark-border text-slate-400 hover:text-white'
              }`}
            >
              All Projects ({filteredProjects.length})
            </button>
            {categories.filter(c => c !== 'all').map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setFilterCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 capitalize ${
                  filterCategory === cat
                    ? 'bg-gradient-to-r from-electric-blue to-neon-cyan text-white shadow-glow-blue'
                    : 'glass-card border border-dark-border text-slate-400 hover:text-white'
                }`}
              >
                {cat} ({projects.filter(p => p.category === cat).length})
              </button>
            ))}
          </div>

          {searchTerm && (
            <div className="mt-4 text-center">
              <p className="text-slate-400 text-sm">
                Found {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} matching "{searchTerm}"
              </p>
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-400 text-lg">No projects found matching your criteria</p>
            <button onClick={clearSearch} className="mt-4 text-electric-blue hover:text-neon-cyan">Clear search</button>
          </div>
        ) : (
          <>
            <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {paginatedProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* Pagination */}
            {totalFilteredPages > 1 && (
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
                  {[...Array(totalFilteredPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === totalFilteredPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-electric-blue to-neon-cyan text-white'
                              : 'bg-dark-card border border-dark-border text-slate-400 hover:text-white hover:border-electric-blue'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return <span key={pageNum} className="text-slate-500">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalFilteredPages}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === totalFilteredPages
                      ? 'bg-dark-card text-slate-500 cursor-not-allowed'
                      : 'bg-dark-card text-slate-400 hover:text-white hover:border-electric-blue border border-dark-border'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Showing info */}
            <div className="text-center text-slate-500 text-sm mt-4">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProjects.length)} of {filteredProjects.length} projects
            </div>
          </>
        )}

        <div className="mt-16 text-center">
          <p className="text-slate-400 font-outfit mb-4">Have a project in mind?</p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
            Start a Project <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}