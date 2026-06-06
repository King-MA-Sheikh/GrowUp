import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Send, Calendar, Clock, DollarSign, Users, 
  FileText, MessageCircle, CheckCircle, AlertCircle,
  Code2, Brain, Cloud, Database, Shield, Zap, Star,
  ChevronRight, Upload, X, Loader2, Phone, Mail, MapPin,
  User, Briefcase, Award, Heart, ThumbsUp, Quote,
  Linkedin, Twitter, Github, Globe, Video, MessageSquare,
  Building, PhoneCall, CalendarDays, Clock3, Cpu,
  Server, Layers, Smartphone, Wifi, HardDrive, Lock,
  GraduationCap, BookOpen, Target, Rocket,
  Sparkles, TrendingUp, Users as UsersIcon,
  BadgeCheck, Medal, Trophy, Camera
} from 'lucide-react';
import { submitMeetingRequest } from '../utils/api';

// Import your CEO image from assets folder
// Make sure the file name matches exactly (case-sensitive)
import ceoImage from '../assets/ceo-image.jpeg';
// Or if it's a different format:
// import ceoImage from '../assets/ceo-image.png';
// import ceoImage from '../assets/ceo-image.jpg';

const services = [
  { value: 'web', label: 'Web Development' },
  { value: 'mobile', label: 'Mobile App Development' },
  { value: 'fullstack', label: 'Full Stack Development' },
  { value: 'cloud', label: 'Cloud & DevOps' },
  { value: 'ai', label: 'AI & Machine Learning' },
  { value: 'blockchain', label: 'Blockchain & Web3' },
  { value: 'consulting', label: 'Technical Consulting' },
  { value: 'other', label: 'Other' },
];

const budgetRanges = [
  '₹25,000 - ₹50,000',
  '₹50,000 - ₹1,00,000',
  '₹1,00,000 - ₹2,50,000',
  '₹2,50,000 - ₹5,00,000',
  '₹5,00,000 - ₹10,00,000',
  '₹10,00,000+',
  'Negotiable'
];

const timeSlots = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
];

export default function ConnectManagerPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
    agreeTerms: false
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.service) newErrors.service = 'Please select a service';
    if (!formData.preferredDate) newErrors.preferredDate = 'Please select a preferred date';
    if (!formData.preferredTime) newErrors.preferredTime = 'Please select a preferred time';
    if (!formData.message.trim()) newErrors.message = 'Please describe your project';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await submitMeetingRequest({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        service: formData.service,
        budget: formData.budget,
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime,
        message: formData.message,
      });
      
      if (response.data.success) {
        setSubmitted(true);
      } else {
        setErrors({ submit: response.data.message || 'Failed to submit request. Please try again.' });
      }
    } catch (err) {
      console.error('Error submitting meeting request:', err);
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-neon-green" />
            </div>
            <h1 className="text-3xl md:text-4xl font-sora font-bold text-white mb-4">
              Meeting Request Submitted!
            </h1>
            <p className="text-slate-400 text-lg mb-6">
              Thank you for reaching out. Mohd Alkamah Sheikh will review your request and get back to you within 24 hours.
            </p>
            <div className="bg-dark-card/50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-sora font-semibold text-white mb-3">What happens next?</h3>
              <div className="space-y-3">
                {[
                  'Mohd will review your project requirements',
                  'You will receive a calendar invitation for the scheduled time',
                  'A confirmation email with meeting details will be sent',
                  'Get ready to discuss your project with the CEO directly!'
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
              <Link to="/services" className="px-6 py-3 rounded-xl border border-dark-border text-slate-400 hover:text-white hover:border-electric-blue transition-all">
                Browse Services
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - CEO Info */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              {/* CEO Image */}
              <div className="text-center mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-electric-blue to-neon-cyan flex items-center justify-center mx-auto mb-4 shadow-xl overflow-hidden">
                  {!imageError ? (
                    <img 
                      src={ceoImage}
                      alt="Mohd Alkamah Sheikh"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <span className="text-white font-sora font-bold text-4xl">MS</span>
                  )}
                </div>
                <h2 className="text-2xl font-sora font-bold text-white">Mohd Alkamah Sheikh</h2>
                <p className="text-neon-cyan text-sm font-mono mt-1">Founder & CEO | GrowUp</p>
                <p className="text-slate-400 text-xs mt-2">Python Full Stack Developer | DevOps | DevSecOps Architect</p>
              </div>

              {/* CEO Description */}
              <div className="border-t border-dark-border pt-4 mb-4">
                <p className="text-slate-300 text-sm leading-relaxed">
                  Visionary leader and full-stack architect with 3+ years of experience in building 
                  scalable web applications and leading development teams. Passionate about creating 
                  innovative solutions that drive business growth and digital transformation.
                </p>
              </div>

              {/* Experience & Expertise */}
              <div className="border-t border-dark-border pt-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase size={16} className="text-yellow-400" />
                  <span className="text-white text-sm font-medium">Experience & Expertise</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Experience</span>
                    <span className="text-white">3+ Years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Projects Completed</span>
                    <span className="text-white">100+</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Happy Clients</span>
                    <span className="text-white">80+</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Technologies Mastered</span>
                    <span className="text-white">3000+</span>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="border-t border-dark-border pt-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap size={16} className="text-neon-green" />
                  <span className="text-white text-sm font-medium">Certifications</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <BadgeCheck size={14} className="text-electric-blue flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-xs">Qspider</p>
                      <p className="text-slate-500 text-xs">Python Full Stack Developer</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BadgeCheck size={14} className="text-electric-blue flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-xs">MSITM</p>
                      <p className="text-slate-500 text-xs">O-Level Certification</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BadgeCheck size={14} className="text-electric-blue flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-xs">MSITM</p>
                      <p className="text-slate-500 text-xs">CCC Certification</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BadgeCheck size={14} className="text-electric-blue flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-xs">MSITM</p>
                      <p className="text-slate-500 text-xs">BCA Degree</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technologies Stack */}
              <div className="border-t border-dark-border pt-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Code2 size={16} className="text-neon-cyan" />
                  <span className="text-white text-sm font-medium">Tech Stack</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Python', 'Django', 'Flask', 'FastAPI', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins', 'GitHub Actions', 'Linux', 'Nginx'].map(tech => (
                    <span key={tech} className="px-2 py-1 rounded-md bg-dark-card border border-dark-border text-xs text-slate-400">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* DevOps & Security */}
              <div className="border-t border-dark-border pt-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={16} className="text-red-400" />
                  <span className="text-white text-sm font-medium">DevOps & Security</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform', 'Ansible', 'Prometheus', 'Grafana', 'AWS', 'Azure', 'GCP', 'DevSecOps', 'Security Audits', 'Penetration Testing'].map(tech => (
                    <span key={tech} className="px-2 py-1 rounded-md bg-dark-card border border-dark-border text-xs text-slate-400">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Why Meet with CEO */}
              <div className="border-t border-dark-border pt-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Heart size={16} className="text-electric-blue" />
                  <span className="text-white text-sm font-medium">Why Meet with the CEO?</span>
                </div>
                <div className="space-y-2">
                  {[
                    'Direct decision-making authority',
                    'Best pricing and custom solutions',
                    'Personal attention to your project',
                    'Strategic technical guidance',
                    'Long-term partnership opportunities'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle size={12} className="text-neon-green flex-shrink-0 mt-0.5" />
                      <span className="text-slate-400 text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="border-t border-dark-border pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle size={16} className="text-neon-cyan" />
                  <span className="text-white text-sm font-medium">Connect With CEO</span>
                </div>
                <div className="flex gap-2 justify-center">
                  <a href="https://linkedin.com/in/mohdalkamah" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center hover:border-electric-blue transition-colors">
                    <Linkedin size={14} className="text-slate-400" />
                  </a>
                  <a href="https://twitter.com/mohdalkamah" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center hover:border-electric-blue transition-colors">
                    <Twitter size={14} className="text-slate-400" />
                  </a>
                  <a href="https://github.com/mohdalkamah" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center hover:border-electric-blue transition-colors">
                    <Github size={14} className="text-slate-400" />
                  </a>
                  <a href="mailto:ceo@growup.com" className="w-8 h-8 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center hover:border-electric-blue transition-colors">
                    <Mail size={14} className="text-slate-400" />
                  </a>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-electric-blue/10 to-neon-cyan/10">
                <p className="text-slate-300 text-xs text-center">
                  ⚡ Get a response within 24 hours
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Meeting Request Form */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-sora font-bold text-white mb-2">
                  Schedule a Meeting with CEO
                </h1>
                <p className="text-slate-400 text-sm">
                  Fill out the form below to schedule a one-on-one consultation with Mohd Alkamah Sheikh
                </p>
              </div>

              {errors.submit && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle size={18} />
                  {errors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`w-full pl-9 pr-3 py-2 bg-dark-card border ${
                          errors.fullName ? 'border-red-500' : 'border-dark-border'
                        } rounded-lg text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-electric-blue transition-colors`}
                      />
                    </div>
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`w-full pl-9 pr-3 py-2 bg-dark-card border ${
                          errors.email ? 'border-red-500' : 'border-dark-border'
                        } rounded-lg text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-electric-blue transition-colors`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={`w-full pl-9 pr-3 py-2 bg-dark-card border ${
                          errors.phone ? 'border-red-500' : 'border-dark-border'
                        } rounded-lg text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-electric-blue transition-colors`}
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1">
                      Company Name (Optional)
                    </label>
                    <div className="relative">
                      <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your Company"
                        className="w-full pl-9 pr-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-electric-blue transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Selection */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1">
                      Service Required *
                    </label>
                    <div className="relative">
                      <Code2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-3 py-2 bg-dark-card border ${
                          errors.service ? 'border-red-500' : 'border-dark-border'
                        } rounded-lg text-white focus:outline-none focus:border-electric-blue transition-colors appearance-none text-sm`}
                      >
                        <option value="">Select a service</option>
                        {services.map(service => (
                          <option key={service.value} value={service.value}>{service.label}</option>
                        ))}
                      </select>
                    </div>
                    {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1">
                      Budget Range (Optional)
                    </label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-electric-blue transition-colors appearance-none text-sm"
                      >
                        <option value="">Select budget range</option>
                        {budgetRanges.map(range => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Date and Time Selection */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1">
                      Preferred Date *
                    </label>
                    <div className="relative">
                      <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full pl-9 pr-3 py-2 bg-dark-card border ${
                          errors.preferredDate ? 'border-red-500' : 'border-dark-border'
                        } rounded-lg text-white focus:outline-none focus:border-electric-blue transition-colors text-sm`}
                      />
                    </div>
                    {errors.preferredDate && <p className="text-red-500 text-xs mt-1">{errors.preferredDate}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1">
                      Preferred Time Slot *
                    </label>
                    <div className="relative">
                      <Clock3 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-3 py-2 bg-dark-card border ${
                          errors.preferredTime ? 'border-red-500' : 'border-dark-border'
                        } rounded-lg text-white focus:outline-none focus:border-electric-blue transition-colors appearance-none text-sm`}
                      >
                        <option value="">Select time slot</option>
                        {timeSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                    {errors.preferredTime && <p className="text-red-500 text-xs mt-1">{errors.preferredTime}</p>}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1">
                    Project Description / Message *
                  </label>
                  <div className="relative">
                    <MessageCircle size={16} className="absolute left-3 top-2 text-slate-500" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Please describe your project, requirements, or what you'd like to discuss with the CEO..."
                      className={`w-full pl-9 pr-3 py-2 bg-dark-card border ${
                        errors.message ? 'border-red-500' : 'border-dark-border'
                      } rounded-lg text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-electric-blue transition-colors resize-none`}
                    />
                  </div>
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-0.5 w-3.5 h-3.5 rounded border-dark-border bg-dark-card text-electric-blue focus:ring-electric-blue"
                  />
                  <label className="text-slate-400 text-xs">
                    I agree to the Terms of Service and Privacy Policy
                    {errors.agreeTerms && <span className="text-red-500 block mt-1">{errors.agreeTerms}</span>}
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-2.5 text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Scheduling Meeting...
                    </>
                  ) : (
                    <>
                      Schedule Meeting with CEO
                      <Send size={16} />
                    </>
                  )}
                </button>

                <p className="text-center text-slate-500 text-xs">
                  By submitting this form, you agree to receive communications from GrowUp.
                  We respect your privacy and will never share your information.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}