import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, Clock, Calendar, Mail, Phone, 
  Video, MapPin, Briefcase, DollarSign, Users, Star,
  Loader2, AlertCircle, MessageCircle, Send, FileText,
  Award, TrendingUp, Zap
} from 'lucide-react';
import { getJobApplicationByEmail } from '../utils/api';

const statusConfig = {
  'pending': { label: 'Application Received', color: 'bg-yellow-500/20 text-yellow-400', border: 'border-yellow-500/30', icon: Clock, step: 1 },
  'reviewing': { label: 'Under Review', color: 'bg-blue-500/20 text-blue-400', border: 'border-blue-500/30', icon: FileText, step: 2 },
  'shortlisted': { label: 'Shortlisted', color: 'bg-green-500/20 text-green-400', border: 'border-green-500/30', icon: Users, step: 3 },
  'interview_scheduled': { label: 'Interview Scheduled', color: 'bg-purple-500/20 text-purple-400', border: 'border-purple-500/30', icon: Calendar, step: 4 },
  'interview_completed': { label: 'Interview Completed', color: 'bg-cyan-500/20 text-cyan-400', border: 'border-cyan-500/30', icon: CheckCircle, step: 5 },
  'offered': { label: 'Offer Extended', color: 'bg-emerald-500/20 text-emerald-400', border: 'border-emerald-500/30', icon: Star, step: 6 },
  'hired': { label: 'Hired!', color: 'bg-neon-green/20 text-neon-green', border: 'border-neon-green/30', icon: Award, step: 7 },
  'rejected': { label: 'Not Selected', color: 'bg-red-500/20 text-red-400', border: 'border-red-500/30', icon: AlertCircle, step: 0 }
};

function StatusTimeline({ currentStep }) {
  const steps = [
    { name: 'Application', icon: FileText },
    { name: 'Review', icon: Users },
    { name: 'Shortlist', icon: Star },
    { name: 'Interview', icon: Calendar },
    { name: 'Decision', icon: Award }
  ];

  return (
    <div className="relative mt-6 mb-8">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-dark-border"></div>
      <div className="relative flex justify-between">
        {steps.map((step, idx) => {
          const stepNumber = idx + 1;
          const isCompleted = stepNumber <= currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={step.name} className="text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 relative z-10 transition-all duration-300 ${
                isCompleted 
                  ? 'bg-gradient-to-r from-electric-blue to-neon-cyan text-white shadow-glow-blue' 
                  : 'bg-dark-card border border-dark-border text-slate-500'
              }`}>
                {isCompleted ? (
                  <CheckCircle size={18} />
                ) : (
                  <step.icon size={18} />
                )}
              </div>
              <p className={`text-xs font-medium ${isCompleted ? 'text-neon-cyan' : 'text-slate-500'}`}>
                {step.name}
              </p>
              {isCurrent && (
                <div className="mt-1 w-2 h-2 rounded-full bg-electric-blue mx-auto animate-pulse"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ApplicationStatusPage() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchEmail, setSearchEmail] = useState(decodeURIComponent(email || ''));

  useEffect(() => {
    if (email) {
      fetchApplications(decodeURIComponent(email));
    } else {
      setLoading(false);
    }
  }, [email]);

  const fetchApplications = async (emailToSearch) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getJobApplicationByEmail(emailToSearch);
      console.log('Applications response:', response.data);
      setApplications(response.data);
      if (response.data.length === 0) {
        setError('No applications found for this email address');
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchEmail.trim()) {
      navigate(`/application-status/${encodeURIComponent(searchEmail)}`);
      fetchApplications(searchEmail);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-blue/10 border border-electric-blue/30 mb-4">
            <TrendingUp size={16} className="text-electric-blue" />
            <span className="text-electric-blue text-sm font-mono">Application Tracker</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-sora font-extrabold mb-4">
            Application <span className="gradient-text">Status</span>
          </h1>
          <p className="text-slate-400">Track your job applications and interview schedule</p>
        </div>

        {/* Email Search Form */}
        {!email && (
          <div className="glass-card rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-sora font-bold text-white mb-4">Find Your Applications</h2>
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-blue transition-colors"
                required
              />
              <button type="submit" className="btn-primary px-6 py-3">
                Track Applications
              </button>
            </form>
            <p className="text-slate-500 text-sm mt-3">
              Enter the email you used when applying for jobs
            </p>
          </div>
        )}

        {/* Results */}
        {error && (
          <div className="text-center py-12 glass-card rounded-2xl">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-sora font-bold text-white mb-2">No Applications Found</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <Link to="/careers" className="btn-primary inline-flex items-center gap-2">
              Browse Jobs <ArrowLeft size={16} className="rotate-180" />
            </Link>
          </div>
        )}

        {!error && applications.length === 0 && !loading && !email && (
          <div className="text-center py-12 glass-card rounded-2xl">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-sora font-bold text-white mb-2">Track Your Applications</h2>
            <p className="text-slate-400 mb-6">Enter your email above to see your application status</p>
            <Link to="/careers" className="btn-primary inline-flex items-center gap-2">
              Browse Jobs <ArrowLeft size={16} className="rotate-180" />
            </Link>
          </div>
        )}

        {/* Applications List */}
        {applications.length > 0 && (
          <div className="space-y-6">
            {applications.map((app, idx) => {
              const status = statusConfig[app.status] || statusConfig['pending'];
              const StatusIcon = status.icon;
              const currentStep = status.step;
              
              return (
                <div key={idx} className="glass-card rounded-2xl p-6 border-l-4 hover:-translate-y-1 transition-all duration-300" style={{ borderLeftColor: status.color.split(' ')[1]?.replace('text-', '') || '#3b82f6' }}>
                  {/* Job Header */}
                  <div className="flex flex-wrap justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-sora font-bold text-white">{app.job_title || app.job?.title}</h2>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Briefcase size={14} />
                          {app.job?.employment_type || 'Full Time'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          Remote (WFH)
                        </span>
                        {app.job?.salary_min && (
                          <span className="flex items-center gap-1">
                            <DollarSign size={14} />
                            ₹{app.job.salary_min.toLocaleString()} - ₹{app.job.salary_max.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1 ${status.color} border ${status.border}`}>
                      <StatusIcon size={12} />
                      {status.label}
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <StatusTimeline currentStep={currentStep} />

                  {/* Interview Details */}
                  {app.interview_date && (
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                      <h3 className="font-sora font-semibold text-white mb-3 flex items-center gap-2">
                        <Calendar size={16} className="text-purple-400" />
                        Interview Scheduled
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Calendar size={14} className="text-purple-400" />
                          <span>{new Date(app.interview_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock size={14} className="text-purple-400" />
                          <span>{new Date(app.interview_date).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                        </div>
                        {app.interview_link && (
                          <div className="md:col-span-2 flex items-center gap-2 text-slate-300">
                            <Video size={14} className="text-purple-400" />
                            <a href={app.interview_link} target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:text-neon-cyan underline">
                              Join Interview Link
                            </a>
                          </div>
                        )}
                      </div>
                      {app.interview_notes && (
                        <p className="mt-3 text-slate-400 text-sm bg-dark-card/50 p-2 rounded-lg">
                          📝 {app.interview_notes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Application Details */}
                  <div className="mt-4 pt-4 border-t border-dark-border">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs">Applied On</p>
                        <p className="text-white">{new Date(app.applied_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Expected Salary</p>
                        <p className="text-white">{app.expected_salary || 'Negotiable'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Experience</p>
                        <p className="text-white">{app.years_experience || 'Fresher'} {app.years_experience ? 'years' : ''}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Application ID</p>
                        <p className="text-white text-xs font-mono">#{app.id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  {app.skills && app.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {app.skills.map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded-full bg-dark-card border border-dark-border text-xs text-slate-400">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Admin Notes */}
                  {app.admin_notes && (
                    <div className="mt-3 p-3 rounded-lg bg-dark-card/50 border border-dark-border">
                      <p className="text-slate-400 text-sm">
                        <span className="text-slate-500">📌 Note: </span>
                        {app.admin_notes}
                      </p>
                    </div>
                  )}

                  {/* Contact Support */}
                  <div className="mt-4 pt-3 border-t border-dark-border">
                    <p className="text-slate-500 text-xs text-center">
                      Have questions? Contact us at <a href="mailto:careers@growup.com" className="text-electric-blue hover:text-neon-cyan">careers@growup.com</a>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Back to Jobs */}
        <div className="mt-8 text-center">
          <Link to="/careers" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2">
            <ArrowLeft size={16} />
            Browse More Jobs
          </Link>
        </div>
      </div>
    </main>
  );
}