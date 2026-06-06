import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Users, 
  CheckCircle, Award, Heart, Zap, Shield, Star, TrendingUp,
  Calendar, Mail, Phone, User, FileText, Upload, X, Loader2,
  ExternalLink, Github, Linkedin, Globe, Filter, Search,
  ChevronDown, Building, GraduationCap, Target, Rocket,
  Sparkles, BookOpen, Code2, Brain, Cloud, Database, Cpu,
  Wifi, Home, Laptop, Coffee, Gift, Ticket, Send,
  MessageCircle, AlertCircle, Search as SearchIcon
} from 'lucide-react';
import { getJobs, getJobCategories, applyForJob } from '../utils/api';

function JobCard({ job, onApply }) {
  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Competitive';
    if (min && max) return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `From ${currency} ${min.toLocaleString()}`;
    return `Up to ${currency} ${max.toLocaleString()}`;
  };

  const getEmploymentTypeColor = (type) => {
    const colors = {
      'full_time': 'bg-blue-500/20 text-blue-400',
      'part_time': 'bg-green-500/20 text-green-400',
      'contract': 'bg-purple-500/20 text-purple-400',
      'freelance': 'bg-orange-500/20 text-orange-400',
      'internship': 'bg-pink-500/20 text-pink-400'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-glow-blue">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-sora font-bold text-white text-lg mb-1">{job.title}</h3>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Briefcase size={14} />
              {job.category_name}
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {job.is_remote ? 'Remote (WFH)' : job.location}
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {job.employment_type_display}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {job.is_featured && (
            <span className="px-2 py-1 rounded-full bg-yellow-400/20 text-yellow-400 text-xs font-mono flex items-center gap-1">
              <Star size={10} /> Featured
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-mono ${getEmploymentTypeColor(job.employment_type)}`}>
            {job.employment_type_display}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm line-clamp-2 mb-4">{job.description}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(job.required_skills || []).slice(0, 5).map(skill => (
          <span key={skill} className="px-2 py-0.5 rounded-full bg-dark-card border border-dark-border text-xs text-slate-400">
            {skill}
          </span>
        ))}
        {(job.required_skills || []).length > 5 && (
          <span className="px-2 py-0.5 rounded-full bg-dark-card border border-dark-border text-xs text-slate-500">
            +{(job.required_skills || []).length - 5}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 mb-5 pt-3 border-t border-dark-border">
        <div className="flex items-center gap-2 text-xs">
          <DollarSign size={14} className="text-neon-green" />
          <span className="text-slate-300">{formatSalary(job.salary_min, job.salary_max, job.salary_currency)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Users size={14} className="text-electric-blue" />
          <span className="text-slate-300">{job.positions_available} position(s)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Calendar size={14} className="text-yellow-400" />
          <span className="text-slate-300">Apply by {new Date(job.application_deadline).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <TrendingUp size={14} className="text-purple-400" />
          <span className="text-slate-300">{job.experience_level_display}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link to={`/careers/${job.slug}`} className="flex-1 text-center px-4 py-2 rounded-xl bg-dark-card border border-dark-border text-slate-300 hover:text-white hover:border-electric-blue transition-all text-sm">
          View Details
        </Link>
        <button
          onClick={() => onApply(job)}
          className="flex-1 btn-primary text-sm py-2"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

function BenefitsSection() {
  const benefits = [
    { icon: Home, title: 'Work From Home', desc: '100% remote work option', color: 'text-electric-blue' },
    { icon: Laptop, title: 'Equipment Provided', desc: 'Laptop and accessories', color: 'text-neon-green' },
    { icon: Coffee, title: 'Flexible Hours', desc: 'Choose your work schedule', color: 'text-yellow-400' },
    { icon: Gift, title: 'Performance Bonuses', desc: 'Quarterly bonuses', color: 'text-pink-400' },
    { icon: Heart, title: 'Health Insurance', desc: 'Medical coverage', color: 'text-red-400' },
    { icon: GraduationCap, title: 'Learning Budget', desc: 'Courses & certifications', color: 'text-purple-400' },
    { icon: Users, title: 'Team Events', desc: 'Virtual meetups', color: 'text-cyan-400' },
    { icon: Ticket, title: 'Paid Time Off', desc: 'Vacation & sick leave', color: 'text-orange-400' },
  ];

  return (
    <div className="glass-card rounded-2xl p-8">
      <h2 className="text-2xl font-sora font-bold text-white mb-6 text-center">Why Work With Us?</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {benefits.map((benefit, idx) => (
          <div key={idx} className="text-center group">
            <div className="w-12 h-12 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <benefit.icon size={22} className={benefit.color} />
            </div>
            <h3 className="font-sora font-semibold text-white text-sm mb-1">{benefit.title}</h3>
            <p className="text-slate-500 text-xs">{benefit.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Track Application Modal Component
function TrackApplicationModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTrack = () => {
    if (email.trim()) {
      setLoading(true);
      navigate(`/application-status/${encodeURIComponent(email)}`);
      onClose();
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-electric-blue/20 flex items-center justify-center mx-auto mb-4">
            <SearchIcon size={28} className="text-electric-blue" />
          </div>
          <h2 className="text-2xl font-sora font-bold text-white">Track Your Application</h2>
          <p className="text-slate-400 text-sm mt-2">Enter the email you used to apply</p>
        </div>
        
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-blue transition-colors mb-4"
          onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
        />
        
        <div className="flex gap-3">
          <button
            onClick={handleTrack}
            disabled={!email.trim()}
            className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <SearchIcon size={16} />}
            Track Application
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-dark-card border border-dark-border text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
        
        <p className="text-slate-500 text-xs text-center mt-4">
          Your application status will be displayed on the next page
        </p>
      </div>
    </div>
  );
}

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    current_location: '',
    years_experience: '',
    cover_letter: '',
    portfolio_url: '',
    github_url: '',
    linkedin_url: '',
    skills: '',
    expected_salary: '',
    notice_period: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, categoriesRes] = await Promise.all([
        getJobs(),
        getJobCategories()
      ]);
      setJobs(jobsRes.data.results || jobsRes.data || []);
      setCategories(categoriesRes.data.results || categoriesRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ resume: 'File size should be less than 5MB' });
        return;
      }
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        setErrors({ resume: 'Please upload PDF or DOC file' });
        return;
      }
      setResumeFile(file);
      if (errors.resume) setErrors(prev => ({ ...prev, resume: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!resumeFile) newErrors.resume = 'Resume is required';
    if (!formData.cover_letter.trim()) newErrors.cover_letter = 'Cover letter is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('job', selectedJob.id);
      formDataToSend.append('full_name', formData.full_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('current_location', formData.current_location);
      formDataToSend.append('years_experience', formData.years_experience);
      formDataToSend.append('cover_letter', formData.cover_letter);
      formDataToSend.append('portfolio_url', formData.portfolio_url);
      formDataToSend.append('github_url', formData.github_url);
      formDataToSend.append('linkedin_url', formData.linkedin_url);
      formDataToSend.append('skills', JSON.stringify(formData.skills.split(',').map(s => s.trim()).filter(s => s)));
      formDataToSend.append('expected_salary', formData.expected_salary);
      formDataToSend.append('notice_period', formData.notice_period);
      formDataToSend.append('resume', resumeFile);
      
      const response = await applyForJob(formDataToSend);
      
      if (response.data) {
        setApplicationSubmitted({
          jobTitle: selectedJob.title,
          email: formData.email
        });
        setSubmitted(true);
        setShowApplicationForm(false);
        setFormData({
          full_name: '', email: '', phone: '', current_location: '', years_experience: '',
          cover_letter: '', portfolio_url: '', github_url: '', linkedin_url: '',
          skills: '', expected_salary: '', notice_period: ''
        });
        setResumeFile(null);
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      if (err.response?.data?.error) {
        setErrors({ submit: err.response.data.error });
      } else {
        setErrors({ submit: 'Failed to submit application. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.required_skills || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || job.category?.slug === selectedCategory;
    const matchesType = selectedType === 'all' || job.employment_type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
        <p className="text-slate-400">Loading opportunities...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-tag">Join Our Team</span>
          <h1 className="text-5xl md:text-6xl font-sora font-extrabold mb-4">
            <span className="gradient-text">Careers</span> at GrowUp
          </h1>
          <p className="text-slate-400 font-outfit text-lg max-w-2xl mx-auto">
            Build your career with us. Work remotely, grow professionally, and make an impact.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text">{jobs.length}+</div>
            <div className="text-xs text-slate-500">Open Positions</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text">100%</div>
            <div className="text-xs text-slate-500">Remote Jobs</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text">10+</div>
            <div className="text-xs text-slate-500">Hired This Year</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-sora font-bold gradient-text">4.9</div>
            <div className="text-xs text-slate-500">Employee Rating</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <button 
              onClick={() => setShowTrackModal(true)}
              className="w-full py-2 rounded-lg bg-electric-blue/20 text-electric-blue text-sm font-medium hover:bg-electric-blue/30 transition-colors flex items-center justify-center gap-2"
            >
              <SearchIcon size={14} />
              Track Application
            </button>
          </div>
        </div>

        {/* Benefits Section */}
        <BenefitsSection />

        {/* Search and Filters */}
        <div className="my-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search jobs by title, skills, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-blue transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-white text-sm focus:outline-none focus:border-electric-blue"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-white text-sm focus:outline-none focus:border-electric-blue"
              >
                <option value="all">All Types</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-400 text-lg">No jobs found matching your criteria</p>
            <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedType('all'); }} className="mt-4 text-electric-blue hover:text-neon-cyan">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} onApply={handleApply} />
            ))}
          </div>
        )}
      </div>

      {/* Track Application Modal */}
      <TrackApplicationModal 
        isOpen={showTrackModal}
        onClose={() => setShowTrackModal(false)}
      />

      {/* Application Form Modal */}
      {showApplicationForm && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8">
          <div className="glass-card rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-dark-bg/95 backdrop-blur-sm p-4 border-b border-dark-border flex justify-between items-center">
              <div>
                <h2 className="text-xl font-sora font-bold text-white">Apply for {selectedJob.title}</h2>
                <p className="text-slate-400 text-sm">{selectedJob.location} • {selectedJob.employment_type_display}</p>
              </div>
              <button onClick={() => setShowApplicationForm(false)} className="p-2 rounded-lg hover:bg-dark-card">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="p-6 space-y-5">
              {errors.submit && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {errors.submit}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-dark-card border ${errors.full_name ? 'border-red-500' : 'border-dark-border'} rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue`}
                  />
                  {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-dark-card border ${errors.email ? 'border-red-500' : 'border-dark-border'} rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-dark-card border ${errors.phone ? 'border-red-500' : 'border-dark-border'} rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-1">Current Location</label>
                  <input
                    type="text"
                    name="current_location"
                    value={formData.current_location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm mb-1">Years of Experience</label>
                  <input
                    type="number"
                    step="0.5"
                    name="years_experience"
                    value={formData.years_experience}
                    onChange={handleChange}
                    placeholder="e.g., 3.5"
                    className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-1">Notice Period</label>
                  <input
                    type="text"
                    name="notice_period"
                    value={formData.notice_period}
                    onChange={handleChange}
                    placeholder="e.g., 2 weeks, 1 month"
                    className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., React, Python, Django, AWS"
                  className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm mb-1">Expected Salary</label>
                  <input
                    type="text"
                    name="expected_salary"
                    value={formData.expected_salary}
                    onChange={handleChange}
                    placeholder="e.g., ₹8,00,000 - ₹12,00,000"
                    className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-1">Portfolio/Website URL</label>
                  <input
                    type="url"
                    name="portfolio_url"
                    value={formData.portfolio_url}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm mb-1">GitHub URL</label>
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-1">Cover Letter *</label>
                <textarea
                  name="cover_letter"
                  value={formData.cover_letter}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-3 py-2 bg-dark-card border ${errors.cover_letter ? 'border-red-500' : 'border-dark-border'} rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue resize-none`}
                  placeholder="Why are you interested in this position? What makes you a great fit?"
                />
                {errors.cover_letter && <p className="text-red-500 text-xs mt-1">{errors.cover_letter}</p>}
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-1">Resume/CV * (PDF or DOC)</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 rounded-lg bg-dark-card border border-dark-border hover:border-electric-blue transition-colors flex items-center gap-2 text-sm text-slate-300">
                    <Upload size={14} />
                    Choose File
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {resumeFile && (
                    <span className="text-sm text-slate-400 flex items-center gap-1">
                      <FileText size={14} />
                      {resumeFile.name}
                    </span>
                  )}
                </div>
                {errors.resume && <p className="text-red-500 text-xs mt-1">{errors.resume}</p>}
                <p className="text-slate-500 text-xs mt-1">PDF or DOC file, max 5MB</p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-2.5 text-base flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={16} />}
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {submitted && applicationSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-8 text-center max-w-md mx-4">
            <div className="w-16 h-16 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-neon-green" />
            </div>
            <h3 className="text-xl font-sora font-bold text-white mb-2">Application Submitted!</h3>
            <p className="text-slate-400 text-sm mb-4">
              Thank you for applying for <span className="text-neon-cyan">{applicationSubmitted.jobTitle}</span>
            </p>
            <p className="text-slate-500 text-xs mb-4">You can track your application status here:</p>
            <Link 
              to={`/application-status/${encodeURIComponent(applicationSubmitted.email)}`}
              className="btn-primary w-full inline-flex items-center justify-center gap-2 mb-3"
            >
              Track Your Application
              <SearchIcon size={14} />
            </Link>
            <button 
              onClick={() => setSubmitted(false)} 
              className="text-slate-500 text-sm hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}