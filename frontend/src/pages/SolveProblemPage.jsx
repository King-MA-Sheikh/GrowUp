import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Send, Code2, Brain, Cloud, Database, Shield, Zap, Star,
  CheckCircle, AlertCircle, Loader2, User, Mail, Phone, FileText,
  MessageCircle, Briefcase, Award, Heart, ThumbsUp, Quote,
  Linkedin, Twitter, Github, Globe, Video, MessageSquare,
  Building, Clock, DollarSign, Users, Upload, X, Copy, Check,
  Terminal, Bug, FileCode, GitBranch, Cpu, Server, Layers,
  Smartphone, Wifi, HardDrive, Lock, GraduationCap, BookOpen,
  Target, Rocket, Sparkles, TrendingUp, BadgeCheck, Trophy, Camera,
  Plus, Filter, Search, ChevronDown, Eye, MessageSquare as ChatIcon,
  Paperclip, Download, Trash2, Edit, Calendar, Hash, Tag
} from 'lucide-react';
import { getTeamMembers, getTechnologies, submitProblem, getProblems, addProblemMessage, addProblemOffer, acceptOffer } from '../utils/api';

const problemCategories = [
  { value: 'bug_fix', label: 'Bug Fixing', icon: Bug, description: 'Fix errors, crashes, and unexpected behavior' },
  { value: 'code_optimization', label: 'Code Optimization', icon: Zap, description: 'Improve performance and efficiency' },
  { value: 'feature_development', label: 'Feature Development', icon: Code2, description: 'Add new functionality to existing code' },
  { value: 'code_review', label: 'Code Review', icon: Users, description: 'Expert review and suggestions for improvement' },
  { value: 'refactoring', label: 'Code Refactoring', icon: GitBranch, description: 'Restructure code without changing behavior' },
  { value: 'debugging', label: 'Debugging', icon: Bug, description: 'Identify and resolve issues in code' },
  { value: 'security_audit', label: 'Security Audit', icon: Shield, description: 'Identify vulnerabilities and security issues' },
  { value: 'performance_tuning', label: 'Performance Tuning', icon: Zap, description: 'Optimize for speed and resource usage' },
  { value: 'other', label: 'Other', icon: Code2, description: 'Other coding assistance' },
];

function DeveloperCard({ developer, onSelect, isSelected }) {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div 
      className={`glass-card rounded-xl p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
        isSelected ? 'border-2 border-electric-blue shadow-glow-blue' : 'border border-dark-border'
      }`}
      onClick={() => onSelect(developer)}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-electric-blue to-neon-cyan flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">{getInitials(developer.name)}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-sora font-bold text-white text-sm">{developer.name}</h3>
            {developer.is_available ? (
              <span className="flex items-center gap-1 text-xs text-neon-green">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"></span>
                Available
              </span>
            ) : (
              <span className="text-xs text-slate-500">Busy</span>
            )}
          </div>
          <p className="text-neon-cyan text-xs font-mono">{developer.role_display || developer.role}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            <span>{developer.experience_years}+ yrs</span>
            <span>⭐ {developer.rating}</span>
            <span>{developer.projects_completed}+ projects</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {(developer.skills || []).slice(0, 3).map(skill => (
              <span key={skill} className="px-1.5 py-0.5 rounded bg-dark-card border border-dark-border text-xs text-slate-400">
                {skill}
              </span>
            ))}
          </div>
        </div>
        {isSelected && (
          <div className="w-5 h-5 rounded-full bg-electric-blue flex items-center justify-center flex-shrink-0">
            <CheckCircle size={12} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
}

function TechnologyChip({ tech, selected, onToggle }) {
  return (
    <button
      onClick={() => onToggle(tech.name || tech)}
      className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
        selected
          ? 'bg-gradient-to-r from-electric-blue to-neon-cyan text-white'
          : 'bg-dark-card border border-dark-border text-slate-300 hover:text-white'
      }`}
    >
      {tech.name || tech}
    </button>
  );
}

function ProblemCard({ problem, onViewChat }) {
  const getStatusColor = (status) => {
    const colors = {
      'open': 'bg-green-500/20 text-green-400 border-green-500/30',
      'assigned': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'in_progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'resolved': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'closed': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[status] || colors['open'];
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="glass-card rounded-xl p-4 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-mono border ${getStatusColor(problem.status)}`}>
              {problem.status?.toUpperCase()}
            </span>
            <span className="text-xs text-slate-500">{problem.category}</span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar size={10} />
              {formatDate(problem.created_at)}
            </span>
          </div>
          <h3 className="font-sora font-bold text-white text-sm mb-1">{problem.title}</h3>
          <p className="text-slate-400 text-xs line-clamp-2">{problem.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {(problem.technologies || []).map(tech => (
              <span key={tech} className="text-xs text-slate-500">#{tech}</span>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
            <span>By: {problem.user_name}</span>
            {problem.deadline && <span>⏰ Due: {formatDate(problem.deadline)}</span>}
          </div>
        </div>
        {problem.status !== 'open' && (
          <button
            onClick={() => onViewChat(problem)}
            className="p-2 rounded-lg bg-electric-blue/20 text-electric-blue hover:bg-electric-blue/30 transition-colors"
            title="View Chat"
          >
            <ChatIcon size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

function ChatModal({ problem, isOpen, onClose, onSendMessage, onSendOffer, currentUser }) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerData, setOfferData] = useState({
    estimated_time: '',
    estimated_cost: '',
    message: ''
  });
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(problem.id, message, attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleSendOffer = () => {
    if (offerData.estimated_time && offerData.estimated_cost) {
      onSendOffer(problem.id, offerData);
      setShowOfferForm(false);
      setOfferData({ estimated_time: '', estimated_cost: '', message: '' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="glass-card rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-dark-border flex items-center justify-between">
          <div>
            <h3 className="font-sora font-bold text-white">{problem.title}</h3>
            <p className="text-slate-400 text-xs">Chat with {problem.assigned_to_details?.name || 'Developer'}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-dark-card">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {(problem.messages || []).map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-xl ${
                msg.sender_type === 'user' 
                  ? 'bg-gradient-to-r from-electric-blue to-neon-cyan text-white' 
                  : 'bg-dark-card border border-dark-border'
              }`}>
                <p className="text-sm">{msg.message}</p>
                {msg.attachments?.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {msg.attachments.map((att, i) => (
                      <a key={i} href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs opacity-80 hover:opacity-100">
                        <Paperclip size={10} />
                        {att.name}
                      </a>
                    ))}
                  </div>
                )}
                <p className="text-xs opacity-70 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-dark-border">
          {showOfferForm ? (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Estimated time (e.g., 2-3 days)"
                value={offerData.estimated_time}
                onChange={(e) => setOfferData({ ...offerData, estimated_time: e.target.value })}
                className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue"
              />
              <input
                type="text"
                placeholder="Estimated cost (e.g., ₹5,000 - ₹10,000)"
                value={offerData.estimated_cost}
                onChange={(e) => setOfferData({ ...offerData, estimated_cost: e.target.value })}
                className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue"
              />
              <textarea
                placeholder="Additional message..."
                value={offerData.message}
                onChange={(e) => setOfferData({ ...offerData, message: e.target.value })}
                rows="2"
                className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue resize-none"
              />
              <div className="flex gap-2">
                <button onClick={handleSendOffer} className="flex-1 btn-primary py-2 text-sm">Send Offer</button>
                <button onClick={() => setShowOfferForm(false)} className="px-4 py-2 rounded-lg bg-dark-card border border-dark-border text-slate-400 text-sm">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setShowOfferForm(true)}
                  className="px-3 py-1.5 rounded-lg bg-neon-green/20 text-neon-green text-sm hover:bg-neon-green/30 transition-colors"
                >
                  Make Offer
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-lg bg-dark-card border border-dark-border hover:border-electric-blue transition-colors"
                >
                  <Paperclip size={16} className="text-slate-400" />
                </button>
                <button
                  onClick={handleSendMessage}
                  className="p-2 rounded-lg bg-gradient-to-r from-electric-blue to-neon-cyan text-white hover:shadow-glow-blue transition-all"
                >
                  <Send size={16} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-1 px-2 py-1 rounded bg-dark-card text-xs text-slate-400">
                      <Paperclip size={10} />
                      {file.name}
                      <button onClick={() => removeAttachment(idx)} className="hover:text-red-400">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SolveProblemPage() {
  const [activeTab, setActiveTab] = useState('post');
  const [developers, setDevelopers] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [problems, setProblems] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [customTechnologies, setCustomTechnologies] = useState([]);
  const [customTechInput, setCustomTechInput] = useState('');
  const [showCustomTechInput, setShowCustomTechInput] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    title: '',
    category: '',
    description: '',
    deadline: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
    fetchProblems();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const teamRes = await getTeamMembers();
      setDevelopers(teamRes.data.results || teamRes.data || []);
      
      const techRes = await getTechnologies();
      setTechnologies(techRes.data.results || techRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProblems = async () => {
    try {
      const res = await getProblems();
      setProblems(res.data.results || res.data || []);
    } catch (err) {
      console.error('Error fetching problems:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleTechnologyToggle = (techName) => {
    setSelectedTechnologies(prev =>
      prev.includes(techName) ? prev.filter(t => t !== techName) : [...prev, techName]
    );
  };

  const handleAddCustomTechnology = () => {
    if (customTechInput.trim() && !selectedTechnologies.includes(customTechInput.trim()) && !customTechnologies.includes(customTechInput.trim())) {
      setCustomTechnologies([...customTechnologies, customTechInput.trim()]);
      setSelectedTechnologies([...selectedTechnologies, customTechInput.trim()]);
      setCustomTechInput('');
      setShowCustomTechInput(false);
    }
  };

  const handleRemoveCustomTechnology = (tech) => {
    setCustomTechnologies(customTechnologies.filter(t => t !== tech));
    setSelectedTechnologies(selectedTechnologies.filter(t => t !== tech));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTechnology();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.user_name.trim()) newErrors.user_name = 'Name is required';
    if (!formData.user_email.trim()) newErrors.user_email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.user_email)) newErrors.user_email = 'Email is invalid';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitProblem = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const response = await submitProblem({
        ...formData,
        technologies: [...selectedTechnologies, ...customTechnologies],
        assigned_to: selectedDeveloper?.id || null
      });
      
      if (response.data) {
        setSubmitted(true);
        fetchProblems();
        setTimeout(() => {
          setSubmitted(false);
          setActiveTab('browse');
          setFormData({
            user_name: '', user_email: '', user_phone: '',
            title: '', category: '', description: '', deadline: ''
          });
          setSelectedTechnologies([]);
          setCustomTechnologies([]);
          setSelectedDeveloper(null);
        }, 2000);
      }
    } catch (err) {
      console.error('Error submitting problem:', err);
      setErrors({ submit: 'Failed to submit. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (problemId, message, attachments) => {
    try {
      await addProblemMessage(problemId, {
        sender_name: formData.user_name || 'User',
        sender_email: formData.user_email || 'user@example.com',
        sender_type: 'user',
        message: message,
        attachments: attachments.map(f => ({ name: f.name, url: URL.createObjectURL(f) }))
      });
      fetchProblems();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleSendOffer = async (problemId, offerData) => {
    try {
      await addProblemOffer(problemId, {
        developer_id: selectedDeveloper?.id,
        message: offerData.message,
        estimated_time: offerData.estimated_time,
        estimated_cost: offerData.estimated_cost
      });
      fetchProblems();
    } catch (err) {
      console.error('Error sending offer:', err);
    }
  };

  const handleViewChat = (problem) => {
    setSelectedProblem(problem);
    setShowChat(true);
  };

  const allTechnologies = [...technologies, ...customTechnologies.map(t => ({ name: t, icon: '🔧' }))];

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="glass-card rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-neon-green" />
          </div>
          <h3 className="text-xl font-sora font-bold text-white mb-2">Problem Posted!</h3>
          <p className="text-slate-400 text-sm">Your problem has been posted successfully. Developers will review it shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="section-tag">Get Expert Help</span>
          <h1 className="text-4xl md:text-5xl font-sora font-extrabold mb-4">
            Solve <span className="gradient-text">Problem in Code</span>
          </h1>
          <p className="text-slate-400 font-outfit text-lg max-w-2xl mx-auto">
            Post your coding problem, connect with expert developers, and get it solved
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-dark-border">
          <button
            onClick={() => setActiveTab('post')}
            className={`px-6 py-3 font-outfit font-medium transition-all duration-200 ${
              activeTab === 'post'
                ? 'text-electric-blue border-b-2 border-electric-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Post a Problem
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-3 font-outfit font-medium transition-all duration-200 ${
              activeTab === 'browse'
                ? 'text-electric-blue border-b-2 border-electric-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Browse Problems
          </button>
          <button
            onClick={() => setActiveTab('developers')}
            className={`px-6 py-3 font-outfit font-medium transition-all duration-200 ${
              activeTab === 'developers'
                ? 'text-electric-blue border-b-2 border-electric-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Find Developers
          </button>
        </div>

        {/* Post Problem Tab */}
        {activeTab === 'post' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left - Form */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-sora font-bold text-white mb-4">Post Your Problem</h2>
                
                {errors.submit && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {errors.submit}
                  </div>
                )}

                <form onSubmit={handleSubmitProblem} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 text-sm mb-1">Your Name *</label>
                      <input
                        type="text"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 bg-dark-card border ${errors.user_name ? 'border-red-500' : 'border-dark-border'} rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue`}
                      />
                      {errors.user_name && <p className="text-red-500 text-xs mt-1">{errors.user_name}</p>}
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm mb-1">Email *</label>
                      <input
                        type="email"
                        name="user_email"
                        value={formData.user_email}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 bg-dark-card border ${errors.user_email ? 'border-red-500' : 'border-dark-border'} rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue`}
                      />
                      {errors.user_email && <p className="text-red-500 text-xs mt-1">{errors.user_email}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 text-sm mb-1">Phone (Optional)</label>
                      <input
                        type="tel"
                        name="user_phone"
                        value={formData.user_phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm mb-1">Deadline (Optional)</label>
                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm mb-1">Problem Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-dark-card border ${errors.title ? 'border-red-500' : 'border-dark-border'} rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue`}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm mb-1">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-dark-card border ${errors.category ? 'border-red-500' : 'border-dark-border'} rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue`}
                    >
                      <option value="">Select category</option>
                      {problemCategories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm mb-1">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="5"
                      className={`w-full px-3 py-2 bg-dark-card border ${errors.description ? 'border-red-500' : 'border-dark-border'} rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue resize-none`}
                      placeholder="Describe your problem in detail..."
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm mb-1">Required Technologies</label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 bg-dark-card/50 rounded-lg mb-2">
                      {technologies.slice(0, 30).map(tech => (
                        <TechnologyChip
                          key={tech.name}
                          tech={tech}
                          selected={selectedTechnologies.includes(tech.name)}
                          onToggle={handleTechnologyToggle}
                        />
                      ))}
                    </div>
                    
                    {/* Custom Technology Input */}
                    {!showCustomTechInput ? (
                      <button
                        type="button"
                        onClick={() => setShowCustomTechInput(true)}
                        className="w-full mt-2 py-2 rounded-lg border border-dashed border-dark-border text-slate-400 hover:text-white hover:border-electric-blue transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <Plus size={14} />
                        Add Custom Technology
                      </button>
                    ) : (
                      <div className="mt-2 p-3 rounded-lg bg-dark-card/50 border border-dark-border">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customTechInput}
                            onChange={(e) => setCustomTechInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter technology name (e.g., Laravel, Spring Boot)"
                            className="flex-1 px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-electric-blue"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomTechnology}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-neon-cyan text-white text-sm font-medium hover:shadow-glow-blue transition-all"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowCustomTechInput(false);
                              setCustomTechInput('');
                            }}
                            className="px-4 py-2 rounded-lg bg-dark-card border border-dark-border text-slate-400 hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                        <p className="text-slate-500 text-xs mt-2">💡 Press Enter to quickly add the technology</p>
                      </div>
                    )}
                    
                    {/* Selected Technologies Display */}
                    {selectedTechnologies.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedTechnologies.map(tech => (
                          <div key={tech} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-electric-blue/20 text-electric-blue text-xs">
                            <Hash size={10} />
                            {tech}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTechnologies(selectedTechnologies.filter(t => t !== tech));
                                if (customTechnologies.includes(tech)) {
                                  setCustomTechnologies(customTechnologies.filter(t => t !== tech));
                                }
                              }}
                              className="hover:text-red-400"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-primary py-2.5 text-base flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={16} />}
                    {submitting ? 'Posting...' : 'Post Problem'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right - Info */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-6 sticky top-24">
                <h3 className="font-sora font-bold text-white mb-4">Why Post Here?</h3>
                <div className="space-y-3">
                  {[
                    { icon: Users, text: '50+ Expert Developers', color: 'text-electric-blue' },
                    { icon: Clock, text: 'Quick Response Time', color: 'text-neon-green' },
                    { icon: Shield, text: 'Secure & Confidential', color: 'text-deep-purple' },
                    { icon: Star, text: 'Quality Assured', color: 'text-yellow-400' },
                    { icon: MessageCircle, text: 'Direct Chat with Developers', color: 'text-neon-cyan' },
                    { icon: FileText, text: 'File Sharing Support', color: 'text-purple-400' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <item.icon size={16} className={item.color} />
                      <span className="text-slate-300 text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-3 rounded-xl bg-gradient-to-r from-electric-blue/10 to-neon-cyan/10">
                  <p className="text-slate-300 text-xs text-center">⚡ Get responses within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Browse Problems Tab */}
        {activeTab === 'browse' && (
          <div>
            {problems.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-2xl">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-slate-400">No problems posted yet</p>
                <button onClick={() => setActiveTab('post')} className="mt-4 text-electric-blue hover:text-neon-cyan">
                  Be the first to post a problem
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {problems.map(problem => (
                  <ProblemCard key={problem.id} problem={problem} onViewChat={handleViewChat} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Developers Tab */}
        {activeTab === 'developers' && (
          <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {developers.map(developer => (
                <DeveloperCard
                  key={developer.id}
                  developer={developer}
                  isSelected={selectedDeveloper?.id === developer.id}
                  onSelect={setSelectedDeveloper}
                />
              ))}
            </div>
            {selectedDeveloper && (
              <div className="mt-6 p-4 rounded-xl bg-neon-green/10 border border-neon-green/20 text-center">
                <p className="text-neon-green text-sm">
                  ✅ Developer selected! Go to "Post a Problem" tab and your problem will be assigned to {selectedDeveloper.name}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {showChat && selectedProblem && (
        <ChatModal
          problem={selectedProblem}
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          onSendMessage={handleSendMessage}
          onSendOffer={handleSendOffer}
          currentUser={{ name: formData.user_name, email: formData.user_email }}
        />
      )}
    </main>
  );
}