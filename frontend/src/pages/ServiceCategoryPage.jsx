import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Search, Copy, CheckCircle2, Briefcase, 
  Clock, Users, Star, Award, TrendingUp, Shield,
  Code2, Brain, Cloud, Database, Hexagon, BarChart3,
  Smartphone, Globe, Layers, Server, Cpu, Bot, Lock, Zap, Palette, ShoppingCart,
  Check, X, ExternalLink, Filter, ChevronDown, ChevronUp,
  Download, Share2, Bookmark, ThumbsUp, MessageCircle, ChevronRight
} from 'lucide-react';
import { serviceCategories } from '../data/servicesData';

const iconMap = {
  Code2, Brain, Cloud, Database, Hexagon, BarChart3,
  Globe, Smartphone, Layers, Server, Cpu, Bot, Lock, Zap, Palette, ShoppingCart, Shield
};

const ServiceCategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [showAllTechnologies, setShowAllTechnologies] = useState({});
  const [copiedTech, setCopiedTech] = useState(null);
  const [activeTab, setActiveTab] = useState('technologies');
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const foundCategory = serviceCategories.find(cat => cat.id === categoryId);
    if (foundCategory) {
      setCategory(foundCategory);
      // Initialize show all state for each subcategory
      const initialShowAll = {};
      foundCategory.subcategories.forEach(sub => {
        initialShowAll[sub.name] = false;
      });
      setShowAllTechnologies(initialShowAll);
    } else {
      navigate('/services');
    }
  }, [categoryId, navigate]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  const Icon = iconMap[category.icon] || Code2;

  // Filter technologies based on search and subcategory
  const getFilteredTechnologies = (subcategory) => {
    let techs = subcategory.technologies;
    
    if (searchTerm) {
      techs = techs.filter(tech => 
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return techs;
  };

  // Get all technologies across subcategories
  const getAllTechnologies = () => {
    let allTechs = [];
    category.subcategories.forEach(sub => {
      allTechs = [...allTechs, ...sub.technologies];
    });
    
    if (searchTerm) {
      allTechs = allTechs.filter(tech => 
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return allTechs;
  };

  // Toggle show more/less
  const toggleShowMore = (subcategoryName) => {
    setShowAllTechnologies(prev => ({
      ...prev,
      [subcategoryName]: !prev[subcategoryName]
    }));
  };

  // Copy technology name to clipboard
  const copyToClipboard = (tech) => {
    navigator.clipboard.writeText(tech);
    setCopiedTech(tech);
    setTimeout(() => setCopiedTech(null), 2000);
  };

  // Get total technologies count
  const totalTechnologies = category.subcategories.reduce(
    (total, sub) => total + sub.technologies.length, 0
  );

  // Get filtered subcategories
  const filteredSubcategories = selectedSubcategory === 'all' 
    ? category.subcategories 
    : category.subcategories.filter(sub => sub.name === selectedSubcategory);

  return (
    <main className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-dark-bg via-dark-bg to-dark-card/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Back Button */}
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Services
          </button>

          {/* Category Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
              <Icon size={40} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-sora font-extrabold mb-3">
                {category.title}
              </h1>
              <p className="text-slate-400 text-lg font-outfit max-w-2xl">
                Comprehensive {category.title.toLowerCase()} solutions with {totalTechnologies}+ technologies
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className="p-3 rounded-xl bg-dark-card border border-dark-border hover:border-electric-blue transition-colors"
              >
                <Bookmark size={20} className={bookmarked ? 'fill-electric-blue text-electric-blue' : 'text-slate-400'} />
              </button>
              <button className="p-3 rounded-xl bg-dark-card border border-dark-border hover:border-electric-blue transition-colors">
                <Share2 size={20} className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold gradient-text">{category.subcategories.length}</div>
              <div className="text-xs text-slate-500">Subcategories</div>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold gradient-text">{totalTechnologies.toLocaleString()}</div>
              <div className="text-xs text-slate-500">Technologies</div>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold gradient-text">150+</div>
              <div className="text-xs text-slate-500">Projects Completed</div>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold gradient-text">98%</div>
              <div className="text-xs text-slate-500">Client Satisfaction</div>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold gradient-text">24/7</div>
              <div className="text-xs text-slate-500">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-dark-border">
          <button
            onClick={() => setActiveTab('technologies')}
            className={`px-6 py-3 font-outfit font-medium transition-all duration-200 ${
              activeTab === 'technologies'
                ? 'text-electric-blue border-b-2 border-electric-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Technologies
          </button>
          <button
            onClick={() => setActiveTab('expertise')}
            className={`px-6 py-3 font-outfit font-medium transition-all duration-200 ${
              activeTab === 'expertise'
                ? 'text-electric-blue border-b-2 border-electric-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Our Expertise
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 font-outfit font-medium transition-all duration-200 ${
              activeTab === 'projects'
                ? 'text-electric-blue border-b-2 border-electric-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Related Projects
          </button>
        </div>

        {activeTab === 'technologies' && (
          <>
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search technologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-blue transition-colors"
                />
              </div>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="px-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-white focus:outline-none focus:border-electric-blue transition-colors"
              >
                <option value="all">All Subcategories</option>
                {category.subcategories.map(sub => (
                  <option key={sub.name} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>

            {/* Technologies Display */}
            <div className="space-y-8">
              {filteredSubcategories.map((subcategory) => {
                const technologies = getFilteredTechnologies(subcategory);
                const showAll = showAllTechnologies[subcategory.name];
                const displayedTechs = showAll ? technologies : technologies.slice(0, 20);
                const hasMore = technologies.length > 20;

                if (technologies.length === 0) return null;

                return (
                  <div key={subcategory.name} className="glass-card rounded-2xl overflow-hidden">
                    <div className={`p-6 bg-gradient-to-r ${category.color} bg-opacity-10`}>
                      <h2 className="font-sora font-bold text-2xl text-white">
                        {subcategory.name}
                      </h2>
                      <p className="text-slate-300 text-sm mt-1">
                        {technologies.length} technologies
                      </p>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {displayedTechs.map((tech) => (
                            <Link
                            key={tech}
                            to={`/request/${encodeURIComponent(tech)}`}
                            className="group flex items-center justify-between p-3 rounded-xl bg-dark-card/50 hover:bg-dark-card border border-dark-border hover:border-electric-blue transition-all duration-200 cursor-pointer"
                            >
                            <span className="text-slate-300 text-sm font-mono group-hover:text-white transition-colors">
                                {tech}
                            </span>
                            <ChevronRight size={16} className="text-slate-500 group-hover:text-electric-blue transition-colors" />
                            </Link>
                        ))}
                        </div>
                      
                      {hasMore && (
                        <button
                          onClick={() => toggleShowMore(subcategory.name)}
                          className="mt-6 w-full py-3 rounded-xl bg-dark-card border border-dark-border hover:border-electric-blue transition-all duration-200 flex items-center justify-center gap-2 text-slate-400 hover:text-white"
                        >
                          {showAll ? (
                            <>
                              <ChevronUp size={18} />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown size={18} />
                              Show {technologies.length - 20} More Technologies
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {getAllTechnologies().length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">No technologies found matching "{searchTerm}"</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-electric-blue hover:text-neon-cyan transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'expertise' && (
          <div className="glass-card rounded-2xl p-8">
            <h2 className="font-sora font-bold text-3xl text-white mb-6">Why Choose GrowUp for {category.title}?</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[
                  { icon: Users, title: 'Expert Team', desc: `${totalTechnologies}+ technologies mastered by our expert developers` },
                  { icon: Award, title: 'Industry Recognition', desc: 'Award-winning development team with proven track record' },
                  { icon: Clock, title: 'Timely Delivery', desc: '98% on-time delivery rate with milestone-based tracking' },
                  { icon: Shield, title: 'Quality Assurance', desc: 'Rigorous testing and quality checks at every stage' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-dark-card/50">
                    <item.icon size={24} className="text-electric-blue flex-shrink-0" />
                    <div>
                      <h3 className="font-sora font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                {[
                  { icon: TrendingUp, title: 'Scalable Solutions', desc: 'Built to grow with your business needs' },
                  { icon: Briefcase, title: 'Industry Experience', desc: 'Served 150+ clients across 20+ industries' },
                  { icon: Star, title: 'Client Satisfaction', desc: '4.9/5 rating from 100+ client reviews' },
                  { icon: MessageCircle, title: '24/7 Support', desc: 'Round-the-clock technical support and maintenance' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-dark-card/50">
                    <item.icon size={24} className="text-electric-blue flex-shrink-0" />
                    <div>
                      <h3 className="font-sora font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Development Process */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-electric-blue/10 to-neon-cyan/10">
              <h3 className="font-sora font-bold text-xl text-white mb-4">Our Development Process</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Requirements Analysis', 'Architecture Design', 'Development & Testing', 'Deployment & Support'].map((step, idx) => (
                  <div key={step} className="text-center">
                    <div className="w-10 h-10 rounded-full bg-electric-blue/20 text-electric-blue flex items-center justify-center mx-auto mb-2 font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-slate-300 text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((project) => (
              <div key={project} className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-sora font-bold text-xl text-white mb-2">
                  Enterprise {category.title} Solution
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  A comprehensive {category.title.toLowerCase()} platform serving 1M+ users with 99.99% uptime.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Scalable', 'Secure', 'High Performance'].map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-dark-border text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-electric-blue hover:text-neon-cyan transition-colors"
                >
                  View Case Study
                  <ExternalLink size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 glass-card rounded-2xl p-8 text-center">
          <h2 className="font-sora font-bold text-2xl text-white mb-3">
            Ready to Start Your {category.title} Project?
          </h2>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Let's discuss your requirements and build something amazing together.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-primary">
              Get a Free Consultation
            </Link>
            <button className="px-6 py-3 rounded-xl border border-dark-border text-slate-400 hover:text-white hover:border-electric-blue transition-all duration-200">
              Download Service Brochure
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ServiceCategoryPage;