import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, Globe, Smartphone, Layers, Cloud, Database, Shield,
  BarChart3, Brain, Hexagon, Search, ArrowRight, CheckCircle2,
  Server, Cpu, Bot, Lock, Zap, Palette, ShoppingCart
} from 'lucide-react';
import { serviceCategories } from '../data/servicesData';

const iconMap = {
  Code2, Brain, Cloud, Database, Shield, BarChart3, Hexagon,
  Globe, Smartphone, Layers, Server, Cpu, Bot, Lock, Zap, Palette, ShoppingCart
};

const ServiceCard = ({ service, category }) => {
  const Icon = iconMap[category.icon] || Code2;
  
  return (
    <Link 
      to={`/services/${category.id}`}
      className="glass-card neon-border rounded-2xl p-6 transition-all duration-300 group hover:-translate-y-1 hover:shadow-glow-blue block"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <Icon size={26} className="text-white" />
      </div>
      
      <h3 className="font-sora font-bold text-xl text-white mb-2 group-hover:gradient-text">
        {service.name}
      </h3>
      
      <p className="text-slate-400 text-sm font-outfit leading-relaxed mb-4">
        {service.technologies.length}+ technologies and counting
      </p>
      
      <div className="flex flex-wrap gap-1.5 mb-6 max-h-24 overflow-y-auto custom-scrollbar">
        {service.technologies.slice(0, 8).map(tech => (
          <span key={tech} className="text-xs px-2 py-1 rounded-full bg-dark-border text-slate-300 font-mono whitespace-nowrap">
            {tech.length > 30 ? tech.substring(0, 28) + '...' : tech}
          </span>
        ))}
        {service.technologies.length > 8 && (
          <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-electric-blue/20 text-electric-blue font-mono hover:bg-electric-blue/30 transition-colors">
            +{service.technologies.length - 8} more
            <ArrowRight size={12} />
          </span>
        )}
      </div>
      
      <div className="inline-flex items-center gap-1.5 text-sm font-outfit font-medium text-slate-500 group-hover:text-neon-cyan transition-all duration-200">
        Explore Services
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};

// CategoryHeader component
const CategoryHeader = ({ category, isExpanded, onToggle }) => {
  const Icon = iconMap[category.icon] || Code2;
  
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-6 bg-dark-card/50 hover:bg-dark-card transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
          <Icon size={22} className="text-white" />
        </div>
        <div className="text-left">
          <h2 className="font-sora font-bold text-2xl text-white">{category.title}</h2>
          <p className="text-slate-400 text-sm font-outfit">
            {category.subcategories.reduce((sum, sub) => sum + sub.technologies.length, 0)} technologies
          </p>
        </div>
      </div>
      <div className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
        ▼
      </div>
    </button>
  );
};

export default function Services() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState({});

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Initially expand first 3 categories
  useEffect(() => {
    const initialExpanded = {};
    serviceCategories.slice(0, 3).forEach(cat => {
      initialExpanded[cat.id] = true;
    });
    setExpandedCategories(initialExpanded);
  }, []);

  // Filter services based on search
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return serviceCategories;
    }
    
    const term = searchTerm.toLowerCase();
    return serviceCategories
      .map(category => ({
        ...category,
        subcategories: category.subcategories
          .map(sub => ({
            ...sub,
            technologies: sub.technologies.filter(tech => 
              tech.toLowerCase().includes(term)
            )
          }))
          .filter(sub => sub.technologies.length > 0)
      }))
      .filter(category => category.subcategories.length > 0);
  }, [searchTerm]);

  // Filter by selected category
  const displayCategories = selectedCategory === 'all' 
    ? filteredCategories 
    : filteredCategories.filter(cat => cat.id === selectedCategory);

  // Get total technologies count
  const totalTechnologies = useMemo(() => {
    return serviceCategories.reduce((total, cat) => 
      total + cat.subcategories.reduce((sum, sub) => sum + sub.technologies.length, 0), 0
    );
  }, []);

  const getMatchingCount = () => {
    return displayCategories.reduce((total, cat) => 
      total + cat.subcategories.reduce((sum, sub) => sum + sub.technologies.length, 0), 0
    );
  };

  return (
    <section className="py-24 relative overflow-hidden" id="services">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-deep-purple/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-electric-blue/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-tag">What We Do</span>
          <h1 className="text-4xl md:text-6xl font-sora font-extrabold mb-4">
            Our <span className="gradient-text">Services</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-outfit">
            We master {totalTechnologies.toLocaleString()}+ technologies across 30+ domains
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search any technology or service... (e.g., React, Python, AWS, Blockchain)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-blue transition-colors font-outfit text-lg"
            />
          </div>
          {searchTerm && (
            <p className="text-slate-400 text-sm mt-2 text-center">
              Found {getMatchingCount()} matching technologies
            </p>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-full text-sm font-outfit font-medium transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-electric-blue to-neon-cyan text-white shadow-glow-blue'
                : 'bg-dark-card border border-dark-border text-slate-400 hover:text-white hover:border-electric-blue'
            }`}
          >
            All Services
          </button>
          {serviceCategories.map(cat => {
            const Icon = iconMap[cat.icon] || Code2;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-outfit font-medium transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-glow-blue`
                    : 'bg-dark-card border border-dark-border text-slate-400 hover:text-white hover:border-electric-blue'
                }`}
              >
                <Icon size={16} />
                {cat.title}
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="space-y-8">
          {displayCategories.map(category => (
            <div key={category.id} className="rounded-2xl border border-dark-border overflow-hidden">
              {/* Category Header */}
              <CategoryHeader
                category={category}
                isExpanded={expandedCategories[category.id]}
                onToggle={() => toggleCategory(category.id)}
              />

              {/* Category Content */}
              {expandedCategories[category.id] && (
                <div className="p-6 pt-0 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.subcategories.map(subcategory => (
                    <ServiceCard
                      key={subcategory.name}
                      service={subcategory}
                      category={category}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {displayCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No services found matching "{searchTerm}"</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-electric-blue hover:text-neon-cyan transition-colors"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Custom Solution CTA */}
        <div className="mt-16 glass-card rounded-2xl p-8 border border-dashed border-dark-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-dark-border flex items-center justify-center">
              <span className="text-3xl text-slate-600">?</span>
            </div>
            <div>
              <h3 className="font-sora font-bold text-white text-xl">Need a Custom Technology Stack?</h3>
              <p className="text-slate-400 text-sm font-outfit max-w-md">
                Don't see your specific technology? We work with any stack you prefer.
              </p>
            </div>
          </div>
          <Link to="/contact" className="btn-primary whitespace-nowrap">
            Discuss Your Project →
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 pt-8 border-t border-dark-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-sora font-bold gradient-text">{totalTechnologies.toLocaleString()}+</div>
              <div className="text-slate-500 text-sm font-outfit">Technologies Mastered</div>
            </div>
            <div>
              <div className="text-3xl font-sora font-bold gradient-text">30+</div>
              <div className="text-slate-500 text-sm font-outfit">Service Categories</div>
            </div>
            <div>
              <div className="text-3xl font-sora font-bold gradient-text">200+</div>
              <div className="text-slate-500 text-sm font-outfit">Expert Developers</div>
            </div>
            <div>
              <div className="text-3xl font-sora font-bold gradient-text">98%</div>
              <div className="text-slate-500 text-sm font-outfit">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
}