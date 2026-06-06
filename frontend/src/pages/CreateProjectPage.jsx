import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Send, Calendar, Clock, DollarSign, Users, 
  FileText, MessageCircle, CheckCircle, AlertCircle,
  Code2, Brain, Cloud, Database, Shield, Zap, Star,
  ChevronRight, Upload, X, Loader2, Phone, Mail, MapPin,
  User, Briefcase, Award, Heart, ThumbsUp, Quote,
  Linkedin, Twitter, Github, Globe, Video, MessageSquare,
  Building, PhoneCall, CalendarDays, Clock3, UserCheck,
  Wifi, HardDrive, Cpu, Server, Layers, Smartphone,
  Filter, Search, ChevronDown, PlusCircle, MinusCircle,
  Tag, Hash, Box, Sparkles, TrendingUp, ExternalLink,
  FolderGit2, Eye
} from 'lucide-react';
import { getTeamMembers, getTechnologies, submitProjectRequest, getProjects } from '../utils/api';

const projectTypes = [
  { value: 'new', label: 'New Project from Scratch' },
  { value: 'existing', label: 'Enhance Existing Project' },
  { value: 'migration', label: 'Migration to New Tech' },
  { value: 'consulting', label: 'Technical Consulting' },
  { value: 'maintenance', label: 'Maintenance & Support' },
];

const timelines = [
  '1-2 weeks',
  '2-4 weeks',
  '1-2 months',
  '2-3 months',
  '3+ months'
];

const budgetRanges = [
  '₹25,000 - ₹50,000',
  '₹50,000 - ₹1,00,000',
  '₹1,00,000 - ₹2,50,000',
  '₹2,50,000 - ₹5,00,000',
  '₹5,00,000 - ₹10,00,000',
  '₹10,00,000+',
  'Custom - Let\'s discuss'
];

function DeveloperCard({ developer, isSelected, onSelect }) {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
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

  const gradient = roleColors[developer.role] || 'from-gray-500 to-slate-500';

  return (
    <div 
      className={`glass-card rounded-xl p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
        isSelected ? 'border-2 border-electric-blue shadow-glow-blue' : 'border border-dark-border'
      }`}
      onClick={() => onSelect(developer)}
    >
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white font-bold text-xl">{getInitials(developer.name)}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-sora font-bold text-white">{developer.name}</h3>
            {developer.is_available ? (
              <span className="flex items-center gap-1 text-xs text-neon-green">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"></span>
                Available
              </span>
            ) : (
              <span className="text-xs text-slate-500">Busy</span>
            )}
          </div>
          <p className="text-neon-cyan text-xs font-mono mt-1">{developer.role_display || developer.role}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Briefcase size={12} />
              {developer.experience_years}+ yrs
            </span>
            <span className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400" />
              {developer.rating}
            </span>
            <span className="flex items-center gap-1">
              <Code2 size={12} />
              {developer.projects_completed}+ projects
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(developer.skills || []).slice(0, 5).map(skill => (
              <span key={skill} className="px-2 py-0.5 rounded-full bg-dark-card border border-dark-border text-xs text-slate-400">
                {skill}
              </span>
            ))}
            {(developer.skills || []).length > 5 && (
              <span className="px-2 py-0.5 rounded-full bg-dark-card border border-dark-border text-xs text-slate-500">
                +{(developer.skills || []).length - 5}
              </span>
            )}
          </div>
        </div>
        {isSelected && (
          <div className="w-6 h-6 rounded-full bg-electric-blue flex items-center justify-center flex-shrink-0">
            <CheckCircle size={14} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
}

function TechnologyChip({ tech, selected, onToggle }) {
  return (
    <button
      onClick={() => onToggle(tech)}
      className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
        selected
          ? 'bg-gradient-to-r from-electric-blue to-neon-cyan text-white shadow-glow-blue'
          : 'bg-dark-card border border-dark-border text-slate-300 hover:text-white hover:border-electric-blue'
      }`}
    >
      <span className="text-lg">{tech.icon || '💻'}</span>
      {tech.name}
    </button>
  );
}

function CustomTechnologyChip({ tech, onRemove }) {
  return (
    <div className="px-3 py-1.5 rounded-xl text-sm font-medium bg-gradient-to-r from-deep-purple to-neon-cyan text-white shadow-glow-purple flex items-center gap-2">
      <Hash size={14} />
      {tech}
      <button onClick={onRemove} className="hover:opacity-70">
        <X size={14} />
      </button>
    </div>
  );
}

function FeaturedProjectCard({ project }) {
  return (
    <Link to={`/portfolio/${project.slug}`} className="glass-card rounded-xl p-4 hover:-translate-y-1 transition-all duration-300 block group">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue/20 to-neon-cyan/20 flex items-center justify-center flex-shrink-0">
          <FolderGit2 size={18} className="text-neon-cyan" />
        </div>
        <div className="flex-1">
          <h4 className="font-sora font-bold text-white text-sm group-hover:text-neon-cyan transition-colors">{project.title}</h4>
          <p className="text-slate-400 text-xs line-clamp-2 mt-1">{project.short_description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {(project.tech_stack_list || project.tech_stack || []).slice(0, 3).map(tech => (
              <span key={tech} className="text-xs text-slate-500">#{tech}</span>
            ))}
          </div>
        </div>
        <ExternalLink size={14} className="text-slate-500 group-hover:text-electric-blue transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
}

function PopularTechnologyCard({ tech, onSelect }) {
  return (
    <button
      onClick={() => onSelect(tech)}
      className="glass-card rounded-xl p-3 text-center hover:-translate-y-1 transition-all duration-300 group w-full"
    >
      <div className="text-2xl mb-1">{tech.icon || '💻'}</div>
      <div className="font-mono text-xs text-neon-cyan group-hover:text-white">{tech.name}</div>
      <div className="text-slate-500 text-xs mt-1">{tech.category}</div>
      <div className="mt-2 flex items-center justify-center gap-1 text-xs text-yellow-400">
        <Star size={10} />
        <span>{tech.popularity || 85}%</span>
      </div>
    </button>
  );
}

export default function CreateProjectPage() {
  const [developers, setDevelopers] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [popularTechnologies, setPopularTechnologies] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [customTechnologies, setCustomTechnologies] = useState([]);
  const [customTechInput, setCustomTechInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTech, setFilterTech] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCustomTechInput, setShowCustomTechInput] = useState(false);
  const [activeInspirationTab, setActiveInspirationTab] = useState('projects');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    timeline: '',
    budget: '',
    customBudget: '',
    description: '',
    requirements: '',
    agreeTerms: false
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch team members
      const teamRes = await getTeamMembers();
      const teamData = teamRes.data.results || teamRes.data || [];
      setDevelopers(teamData);
      
      // Fetch technologies
      const techRes = await getTechnologies();
      const techData = techRes.data.results || techRes.data || [];
      setTechnologies(techData);
      
      // Set popular technologies (top 6 by popularity)
      const popular = [...techData].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 6);
      setPopularTechnologies(popular);
      
      // Fetch featured projects
      const projectsRes = await getProjects({ page_size: 10, featured: true });
      let projects = projectsRes.data.results || projectsRes.data || [];
      setFeaturedProjects(projects.slice(0, 4));
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDeveloperSelect = (developer) => {
    setSelectedDeveloper(developer);
  };

  const handleTechnologyToggle = (tech) => {
    setSelectedTechnologies(prev => 
      prev.includes(tech.name)
        ? prev.filter(t => t !== tech.name)
        : [...prev, tech.name]
    );
  };

  const handlePopularTechSelect = (tech) => {
    if (!selectedTechnologies.includes(tech.name)) {
      setSelectedTechnologies([...selectedTechnologies, tech.name]);
    }
  };

  const handleAddCustomTechnology = () => {
    if (customTechInput.trim() && !customTechnologies.includes(customTechInput.trim())) {
      setCustomTechnologies([...customTechnologies, customTechInput.trim()]);
      setCustomTechInput('');
      setShowCustomTechInput(false);
    }
  };

  const handleRemoveCustomTechnology = (tech) => {
    setCustomTechnologies(customTechnologies.filter(t => t !== tech));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTechnology();
    }
  };

  const filteredDevelopers = developers.filter(dev => {
    const matchesSearch = searchTerm === '' || 
      dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTech = filterTech === '' || 
      dev.skills?.some(s => s.toLowerCase().includes(filterTech.toLowerCase()));
    
    return matchesSearch && matchesTech;
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!selectedDeveloper) newErrors.developer = 'Please select a developer';
    if (!formData.projectType) newErrors.projectType = 'Please select project type';
    if (!formData.timeline) newErrors.timeline = 'Please select timeline';
    if (!formData.description.trim()) newErrors.description = 'Project description is required';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const allTechnologies = [...selectedTechnologies, ...customTechnologies];
      const response = await submitProjectRequest({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        developer_id: selectedDeveloper.id,
        developer_name: selectedDeveloper.name,
        technologies: allTechnologies,
        custom_technologies: customTechnologies,
        project_type: formData.projectType,
        timeline: formData.timeline,
        budget: formData.budget === 'Custom - Let\'s discuss' ? formData.customBudget : formData.budget,
        description: formData.description,
        requirements: formData.requirements,
      });
      
      if (response.data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Error submitting project request:', err);
      setErrors({ submit: 'Failed to submit request. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
          <p className="text-slate-400">Loading developers and technologies...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-neon-green" />
            </div>
            <h1 className="text-3xl md:text-4xl font-sora font-bold text-white mb-4">
              Project Request Submitted!
            </h1>
            <p className="text-slate-400 text-lg mb-6">
              Thank you for choosing GrowUp. Our team will review your request and get back to you within 24 hours.
            </p>
            <div className="bg-dark-card/50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-sora font-semibold text-white mb-3">Project Summary:</h3>
              <div className="space-y-2 mb-4">
                <p className="text-slate-300"><span className="text-slate-500">Selected Developer:</span> {selectedDeveloper?.name}</p>
                {[...selectedTechnologies, ...customTechnologies].length > 0 && (
                  <p className="text-slate-300">
                    <span className="text-slate-500">Technologies:</span> {[...selectedTechnologies, ...customTechnologies].join(', ')}
                  </p>
                )}
                <p className="text-slate-300"><span className="text-slate-500">Project Type:</span> {projectTypes.find(p => p.value === formData.projectType)?.label}</p>
                <p className="text-slate-300"><span className="text-slate-500">Timeline:</span> {formData.timeline}</p>
              </div>
              <h3 className="font-sora font-semibold text-white mb-3">What happens next?</h3>
              <div className="space-y-3">
                {[
                  'Our team will review your project requirements',
                  'The selected developer will be assigned to your project',
                  'You will receive a detailed project proposal',
                  'Once approved, we\'ll start development immediately'
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-electric-blue/20 text-electric-blue flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-slate-300">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/" className="btn-primary">
                Back to Home
              </Link>
              <Link to="/portfolio" className="px-6 py-3 rounded-xl border border-dark-border text-slate-400 hover:text-white hover:border-electric-blue transition-all">
                View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const allSelectedTechnologies = [...selectedTechnologies, ...customTechnologies];

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="text-center mb-10">
          <span className="section-tag">Start Your Journey</span>
          <h1 className="text-4xl md:text-5xl font-sora font-extrabold mb-4">
            Create <span className="gradient-text">Project With Us</span>
          </h1>
          <p className="text-slate-400 font-outfit text-lg max-w-2xl mx-auto">
            Choose your expert developer, select technologies, and let's build something amazing together
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Developer Selection and Inspiration */}
          <div className="lg:col-span-7 space-y-6">
            {/* Developer Selection */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-sora font-bold text-white">Select Your Developer</h2>
                <span className="text-sm text-slate-400">{developers.filter(d => d.is_available).length} Available</span>
              </div>
              
              {/* Search and Filter */}
              <div className="flex flex-col gap-3 mb-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by name or skill..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-dark-card border border-dark-border rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-electric-blue"
                  />
                </div>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-slate-400 text-sm hover:text-white"
                >
                  <Filter size={14} />
                  Filter by technology
                  <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                
                {showFilters && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {technologies.slice(0, 10).map(tech => (
                      <button
                        key={tech.name}
                        onClick={() => setFilterTech(filterTech === tech.name ? '' : tech.name)}
                        className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                          filterTech === tech.name
                            ? 'bg-electric-blue text-white'
                            : 'bg-dark-card text-slate-400 hover:text-white'
                        }`}
                      >
                        {tech.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Developers List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredDevelopers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400">No developers found</p>
                  </div>
                ) : (
                  filteredDevelopers.map(developer => (
                    <DeveloperCard
                      key={developer.id}
                      developer={developer}
                      isSelected={selectedDeveloper?.id === developer.id}
                      onSelect={handleDeveloperSelect}
                    />
                  ))
                )}
              </div>
              
              {errors.developer && (
                <p className="text-red-500 text-xs mt-2">{errors.developer}</p>
              )}
            </div>

            {/* Inspiration Section - Projects & Technologies */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-yellow-400" />
                <h2 className="text-xl font-sora font-bold text-white">Get Inspired</h2>
              </div>
              
              {/* Tabs */}
              <div className="flex gap-2 mb-4 border-b border-dark-border">
                <button
                  onClick={() => setActiveInspirationTab('projects')}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeInspirationTab === 'projects'
                      ? 'text-electric-blue border-b-2 border-electric-blue'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FolderGit2 size={14} className="inline mr-1" />
                  Featured Projects
                </button>
                <button
                  onClick={() => setActiveInspirationTab('technologies')}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeInspirationTab === 'technologies'
                      ? 'text-electric-blue border-b-2 border-electric-blue'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 size={14} className="inline mr-1" />
                  Popular Technologies
                </button>
              </div>
              
              {/* Featured Projects Tab */}
              {activeInspirationTab === 'projects' && (
                <div>
                  <p className="text-slate-400 text-sm mb-3">Check out these successful projects for inspiration</p>
                  <div className="space-y-3">
                    {featuredProjects.length === 0 ? (
                      <p className="text-slate-500 text-sm text-center py-4">No featured projects available</p>
                    ) : (
                      featuredProjects.map(project => (
                        <FeaturedProjectCard key={project.id} project={project} />
                      ))
                    )}
                    <Link to="/portfolio" className="block text-center text-sm text-electric-blue hover:text-neon-cyan mt-3">
                      View all projects →
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Popular Technologies Tab */}
              {activeInspirationTab === 'technologies' && (
                <div>
                  <p className="text-slate-400 text-sm mb-3">Most popular technologies used by our clients</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {popularTechnologies.map(tech => (
                      <PopularTechnologyCard key={tech.name} tech={tech} onSelect={handlePopularTechSelect} />
                    ))}
                  </div>
                  <Link to="/technologies" className="block text-center text-sm text-electric-blue hover:text-neon-cyan mt-4">
                    Browse all {technologies.length}+ technologies →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Technology Selection and Project Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Technology Selection */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-sora font-bold text-white mb-4">Select Technologies</h2>
              <p className="text-slate-400 text-sm mb-4">Choose from our technology stack or add your own</p>
              
              {/* Selected Technologies Display */}
              {allSelectedTechnologies.length > 0 && (
                <div className="mb-4 p-3 rounded-xl bg-dark-card/50 border border-dark-border">
                  <p className="text-slate-400 text-xs mb-2">Selected Technologies:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTechnologies.map(tech => (
                      <TechnologyChip
                        key={tech}
                        tech={{ name: tech, icon: '💻' }}
                        selected={true}
                        onToggle={() => handleTechnologyToggle({ name: tech })}
                      />
                    ))}
                    {customTechnologies.map(tech => (
                      <CustomTechnologyChip
                        key={tech}
                        tech={tech}
                        onRemove={() => handleRemoveCustomTechnology(tech)}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Available Technologies */}
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto mb-3">
                {technologies.slice(0, 30).map(tech => (
                  <TechnologyChip
                    key={tech.name}
                    tech={tech}
                    selected={selectedTechnologies.includes(tech.name)}
                    onToggle={handleTechnologyToggle}
                  />
                ))}
                {technologies.length > 30 && (
                  <Link to="/technologies" className="text-xs text-electric-blue hover:text-neon-cyan mt-2 inline-block">
                    +{technologies.length - 30} more technologies...
                  </Link>
                )}
              </div>
              
              {/* Add Custom Technology */}
              {!showCustomTechInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomTechInput(true)}
                  className="w-full mt-3 py-2 rounded-xl border border-dashed border-dark-border text-slate-400 hover:text-white hover:border-electric-blue transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <PlusCircle size={16} />
                  Add Custom Technology
                </button>
              ) : (
                <div className="mt-3 p-3 rounded-xl bg-dark-card/50 border border-dark-border">
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Enter Technology Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTechInput}
                      onChange={(e) => setCustomTechInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="e.g., Laravel, Spring Boot, Vue.js..."
                      className="flex-1 px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-electric-blue"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomTechnology}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-electric-blue to-neon-cyan text-white text-sm font-medium hover:shadow-glow-blue transition-all"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomTechInput(false);
                        setCustomTechInput('');
                      }}
                      className="px-4 py-2 rounded-xl bg-dark-card border border-dark-border text-slate-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-slate-500 text-xs mt-2">
                    💡 Tip: Press Enter to quickly add the technology
                  </p>
                </div>
              )}
            </div>

            {/* Project Details Form */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-sora font-bold text-white mb-6">Project Details</h2>
              
              {errors.submit && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {errors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-dark-card border ${errors.fullName ? 'border-red-500' : 'border-dark-border'} rounded-xl text-white text-sm focus:outline-none focus:border-electric-blue`}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-dark-card border ${errors.email ? 'border-red-500' : 'border-dark-border'} rounded-xl text-white text-sm focus:outline-none focus:border-electric-blue`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-dark-card border ${errors.phone ? 'border-red-500' : 'border-dark-border'} rounded-xl text-white text-sm focus:outline-none focus:border-electric-blue`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-white text-sm focus:outline-none focus:border-electric-blue"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1">Project Type *</label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-dark-card border ${errors.projectType ? 'border-red-500' : 'border-dark-border'} rounded-xl text-white text-sm focus:outline-none focus:border-electric-blue`}
                    >
                      <option value="">Select type</option>
                      {projectTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    {errors.projectType && <p className="text-red-500 text-xs mt-1">{errors.projectType}</p>}
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1">Timeline *</label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-dark-card border ${errors.timeline ? 'border-red-500' : 'border-dark-border'} rounded-xl text-white text-sm focus:outline-none focus:border-electric-blue`}
                    >
                      <option value="">Select timeline</option>
                      {timelines.map(timeline => (
                        <option key={timeline} value={timeline}>{timeline}</option>
                      ))}
                    </select>
                    {errors.timeline && <p className="text-red-500 text-xs mt-1">{errors.timeline}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1">Budget Range</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-white text-sm focus:outline-none focus:border-electric-blue"
                  >
                    <option value="">Select budget</option>
                    {budgetRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                  {formData.budget === 'Custom - Let\'s discuss' && (
                    <input
                      type="text"
                      name="customBudget"
                      value={formData.customBudget}
                      onChange={handleChange}
                      placeholder="Enter your budget"
                      className="mt-2 w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-white text-sm focus:outline-none focus:border-electric-blue"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1">Project Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe your project in detail..."
                    className={`w-full px-3 py-2 bg-dark-card border ${errors.description ? 'border-red-500' : 'border-dark-border'} rounded-xl text-white text-sm focus:outline-none focus:border-electric-blue resize-none`}
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1">Additional Requirements</label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Any specific requirements..."
                    className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-white text-sm focus:outline-none focus:border-electric-blue resize-none"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded border-dark-border bg-dark-card text-electric-blue"
                  />
                  <label className="text-slate-400 text-xs">
                    I agree to the Terms of Service and Privacy Policy
                    {errors.agreeTerms && <span className="text-red-500 block">{errors.agreeTerms}</span>}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !selectedDeveloper}
                  className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Project Request
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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
    </main>
  );
}