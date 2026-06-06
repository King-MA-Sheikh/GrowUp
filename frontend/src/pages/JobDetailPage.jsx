import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Users, 
  CheckCircle, Award, Heart, Zap, Shield, Star, TrendingUp,
  Calendar, Mail, Phone, User, FileText, Upload, X, Loader2,
  ExternalLink, Github, Linkedin, Globe, Send, AlertCircle
} from 'lucide-react';
import { getJob, applyForJob } from '../utils/api';

export default function JobDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
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
    fetchJob();
  }, [slug]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const response = await getJob(slug);
      setJob(response.data);
    } catch (err) {
      console.error('Error fetching job:', err);
      navigate('/careers');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('job', job.id);
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
          jobTitle: job.title,
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

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
        <p className="text-slate-400">Loading job details...</p>
      </div>
    );
  }

  if (!job) return null;

  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return 'Competitive';
    if (job.salary_min && job.salary_max) return `${job.salary_currency} ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`;
    if (job.salary_min) return `From ${job.salary_currency} ${job.salary_min.toLocaleString()}`;
    return `Up to ${job.salary_currency} ${job.salary_max.toLocaleString()}`;
  };

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/careers')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Careers
        </button>

        {/* Job Header */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-sora font-extrabold text-white mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span className="flex items-center gap-1"><Briefcase size={14} />{job.category_name}</span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1"><MapPin size={14} />{job.is_remote ? 'Remote (Work From Home)' : job.location}</span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1"><Clock size={14} />{job.employment_type_display}</span>
              </div>
            </div>
            {job.is_featured && (
              <span className="px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-400 text-xs font-mono flex items-center gap-1">
                <Star size={12} /> Featured
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-dark-border my-4">
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-neon-green" />
              <div>
                <p className="text-slate-500 text-xs">Salary</p>
                <p className="text-white text-sm font-medium">{formatSalary()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-electric-blue" />
              <div>
                <p className="text-slate-500 text-xs">Positions</p>
                <p className="text-white text-sm font-medium">{job.positions_available} open</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-yellow-400" />
              <div>
                <p className="text-slate-500 text-xs">Apply By</p>
                <p className="text-white text-sm font-medium">{new Date(job.application_deadline).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-purple-400" />
              <div>
                <p className="text-slate-500 text-xs">Experience</p>
                <p className="text-white text-sm font-medium">{job.experience_level_display}</p>
              </div>
            </div>
          </div>

          <button onClick={handleApply} className="w-full btn-primary py-3 text-lg">
            Apply for this Position
          </button>
        </div>

        {/* Job Details */}
        <div className="space-y-6">
          {/* Description */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-sora font-bold text-white mb-4">Job Description</h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>

          {/* Responsibilities */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-sora font-bold text-white mb-4">Key Responsibilities</h2>
            <div className="space-y-2">
              {job.responsibilities.split('\n').map((item, idx) => (
                item.trim() && (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-neon-green flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{item}</span>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-sora font-bold text-white mb-4">Requirements</h2>
            <div className="space-y-2">
              {job.requirements.split('\n').map((item, idx) => (
                item.trim() && (
                  <div key={idx} className="flex items-start gap-2">
                    <Zap size={16} className="text-electric-blue flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{item}</span>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Required Skills */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-sora font-bold text-white mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {(job.required_skills || []).map(skill => (
                <span key={skill} className="px-3 py-1.5 rounded-xl bg-dark-card border border-dark-border text-slate-300 text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Benefits */}
          {job.benefits && (
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-sora font-bold text-white mb-4">Benefits & Perks</h2>
              <div className="space-y-2">
                {job.benefits.split('\n').map((item, idx) => (
                  item.trim() && (
                    <div key={idx} className="flex items-start gap-2">
                      <Heart size={16} className="text-pink-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8">
          <div className="glass-card rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-dark-bg/95 backdrop-blur-sm p-4 border-b border-dark-border flex justify-between items-center">
              <div>
                <h2 className="text-xl font-sora font-bold text-white">Apply for {job.title}</h2>
                <p className="text-slate-400 text-sm">{job.location} • {job.employment_type_display}</p>
              </div>
              <button onClick={() => setShowApplicationForm(false)} className="p-2 rounded-lg hover:bg-dark-card">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
              <ArrowLeft size={16} className="rotate-180" />
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