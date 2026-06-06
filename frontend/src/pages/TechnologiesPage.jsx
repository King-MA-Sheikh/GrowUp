import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, ChevronDown, X, Code2, Database, Cloud, 
  Shield, Brain, Hexagon, BarChart3, Smartphone, Globe, 
  Layers, Server, Cpu, Lock, Zap, Palette, ShoppingCart,
  ChevronRight, Grid3X3, List, ArrowRight, Loader2
} from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5678/api';

const categoryIcons = {
  'Frontend': <Code2 size={18} className="text-neon-cyan" />,
  'Backend': <Server size={18} className="text-neon-green" />,
  'Database': <Database size={18} className="text-electric-blue" />,
  'DevOps': <Cpu size={18} className="text-deep-purple" />,
  'Cloud': <Cloud size={18} className="text-cyan-400" />,
  'AI/ML': <Brain size={18} className="text-purple-400" />,
  'Blockchain': <Hexagon size={18} className="text-yellow-400" />,
  'Cybersecurity': <Shield size={18} className="text-red-400" />,
  'Data Science': <BarChart3 size={18} className="text-green-400" />,
  'Mobile': <Smartphone size={18} className="text-pink-400" />,
  'Web': <Globe size={18} className="text-blue-400" />,
  'API': <Layers size={18} className="text-indigo-400" />,
  'Security': <Lock size={18} className="text-orange-400" />,
  'Tools': <Zap size={18} className="text-yellow-500" />,
  'Design': <Palette size={18} className="text-rose-400" />,
  'E-Commerce': <ShoppingCart size={18} className="text-emerald-400" />
};

const categoryColors = {
  'Frontend': 'from-cyan-500 to-blue-500',
  'Backend': 'from-green-500 to-emerald-500',
  'Database': 'from-blue-500 to-indigo-500',
  'DevOps': 'from-purple-500 to-pink-500',
  'Cloud': 'from-sky-500 to-cyan-500',
  'AI/ML': 'from-violet-500 to-purple-500',
  'Blockchain': 'from-amber-500 to-yellow-500',
  'Cybersecurity': 'from-red-500 to-orange-500',
  'Data Science': 'from-teal-500 to-green-500',
  'Mobile': 'from-pink-500 to-rose-500',
  'Web': 'from-blue-500 to-cyan-500',
  'API': 'from-indigo-500 to-purple-500',
  'Security': 'from-orange-500 to-red-500',
  'Tools': 'from-yellow-500 to-amber-500',
  'Design': 'from-rose-500 to-pink-500',
  'E-Commerce': 'from-emerald-500 to-teal-500'
};

function TechnologyCard({ tech }) {
  const gradient = categoryColors[tech.category] || 'from-gray-500 to-slate-500';
  
  return (
    <Link to={`/technologies/${tech.slug || tech.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} 
          className="glass-card neon-border rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-blue group">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl`}>
          {tech.icon || '💻'}
        </div>
        <div className="flex-1">
          <h3 className="font-sora font-bold text-white text-sm group-hover:text-neon-cyan transition-colors">
            {tech.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{tech.category}</span>
            {tech.subcategory && <span className="text-slate-600">• {tech.subcategory}</span>}
          </div>
        </div>
        <ChevronRight size={16} className="text-slate-500 group-hover:text-neon-cyan transition-colors" />
      </div>
      {tech.description && (
        <p className="text-slate-400 text-xs line-clamp-2">{tech.description}</p>
      )}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1 bg-dark-border rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${gradient} rounded-full`} style={{ width: `${tech.popularity || 50}%` }} />
        </div>
        <span className="text-slate-500 text-xs">{tech.popularity || 50}%</span>
      </div>
    </Link>
  );
}

export default function TechnologiesPage() {
  const [technologies, setTechnologies] = useState([]);
  const [filteredTechs, setFilteredTechs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/technologies/`);
      let techs = response.data.results || response.data || [];
      setTechnologies(techs);
      setFilteredTechs(techs);
    } catch (err) {
      console.error('Error fetching technologies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...technologies];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(tech => 
        tech.name.toLowerCase().includes(term) ||
        tech.category?.toLowerCase().includes(term) ||
        tech.subcategory?.toLowerCase().includes(term) ||
        tech.description?.toLowerCase().includes(term)
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tech => tech.category === selectedCategory);
    }
    
    setFilteredTechs(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, technologies]);

  const categories = ['all', ...new Set(technologies.map(t => t.category).filter(Boolean))];
  
  const totalPages = Math.ceil(filteredTechs.length / itemsPerPage);
  const paginatedTechs = filteredTechs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => setSearchTerm('');

  const stats = {
    total: technologies.length,
    categories: categories.length - 1,
    popularCount: technologies.filter(t => (t.popularity || 50) > 80).length
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-electric-blue mx-auto mb-4" />
          <p className="text-slate-400">Loading {technologies.length || 3000}+ technologies...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-tag">Tech Arsenal</span>
          <h1 className="text-5xl md:text-6xl font-sora font-extrabold mb-4">
            Our <span className="gradient-text">Technology Stack</span>
          </h1>
          <p className="text-slate-400 font-outfit text-lg max-w-2xl mx-auto">
            We master {stats.total.toLocaleString()}+ cutting-edge technologies across {stats.categories}+ domains
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text">{stats.total.toLocaleString()}+</div>
            <div className="text-xs text-slate-500">Technologies Mastered</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text">{stats.categories}</div>
            <div className="text-xs text-slate-500">Categories</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text">{stats.popularCount}+</div>
            <div className="text-xs text-slate-500">Popular Technologies</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text">100%</div>
            <div className="text-xs text-slate-500">Industry Standard</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search by technology name, category, or description..."
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

            <div className="flex gap-2">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-electric-blue text-white' : 'bg-dark-card text-slate-400'}`}>
                <Grid3X3 size={18} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-electric-blue text-white' : 'bg-dark-card text-slate-400'}`}>
                <List size={18} />
              </button>
            </div>
          </div>

          <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-wrap gap-2 mt-4 justify-center max-h-32 overflow-y-auto`}>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-electric-blue to-neon-cyan text-white shadow-glow-blue'
                  : 'glass-card border border-dark-border text-slate-400 hover:text-white'
              }`}
            >
              All ({filteredTechs.length})
            </button>
            {categories.filter(c => c !== 'all').map(cat => {
              const Icon = categoryIcons[cat] || <Code2 size={14} />;
              const count = technologies.filter(t => t.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-electric-blue to-neon-cyan text-white shadow-glow-blue'
                      : 'glass-card border border-dark-border text-slate-400 hover:text-white'
                  }`}
                >
                  {Icon}
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {searchTerm && (
            <div className="mt-4 text-center">
              <p className="text-slate-400 text-sm">
                Found {filteredTechs.length} technology{filteredTechs.length !== 1 ? 'ies' : ''} matching "{searchTerm}"
              </p>
            </div>
          )}
        </div>

        {/* Technologies Grid */}
        {filteredTechs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-400 text-lg">No technologies found matching your criteria</p>
            <button onClick={clearSearch} className="mt-4 text-electric-blue hover:text-neon-cyan">Clear search</button>
          </div>
        ) : (
          <>
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-4`}>
              {paginatedTechs.map((tech, idx) => (
                <TechnologyCard key={tech.id || idx} tech={tech} />
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
                  {[...Array(Math.min(totalPages, 7))].map((_, idx) => {
                    let pageNum;
                    if (totalPages <= 7) {
                      pageNum = idx + 1;
                    } else if (currentPage <= 4) {
                      pageNum = idx + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + idx;
                    } else {
                      pageNum = currentPage - 3 + idx;
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

            <div className="text-center text-slate-500 text-sm mt-6">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTechs.length)} of {filteredTechs.length} technologies
            </div>
          </>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 font-outfit mb-4">Need a specific technology expert?</p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
            Hire an Expert <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}