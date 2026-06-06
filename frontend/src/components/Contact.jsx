import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, Mail, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { sendContact } from '../utils/api';

const services = [
  { value: 'web', label: 'Web Development' },
  { value: 'mobile', label: 'Mobile App Development' },
  { value: 'fullstack', label: 'Full Stack Development' },
  { value: 'networking', label: 'Networking Solutions' },
  { value: 'cloud', label: 'Cloud & DevOps' },
  { value: 'other', label: 'Other' },
];

const budgets = [
  '< ₹50,000', '₹50k–₹1L', '₹1L–₹5L', '₹5L–₹10L', '₹10L+', 'Let\'s discuss'
];

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@growup.dev', href: 'mailto:hello@growup.dev' },
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: MapPin, label: 'Location', value: 'Lucknow, India 🇮🇳', href: null },
];

export default function Contact() {
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setStatus('loading');
    try {
      await sendContact(data);
      setStatus('success');
      reset();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className="py-24 relative overflow-hidden" id="contact">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-electric-blue/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="section-tag">Get In Touch</span>
          <h2 className="text-4xl md:text-5xl font-sora font-bold mb-4">
            Start Your <span className="gradient-text">Project</span>
          </h2>
          <p className="text-slate-400 font-outfit max-w-xl mx-auto">
            Have an idea? Let's build it together. Fill out the form and we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Info sidebar */}
          <div className="space-y-6">
            {contactInfo.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="glass-card neon-border rounded-2xl p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-electric-blue/20 to-deep-purple/20 border border-electric-blue/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-neon-cyan" />
                </div>
                <div>
                  <div className="text-slate-500 text-xs font-mono mb-0.5">{label}</div>
                  {href ? (
                    <a href={href} className="text-white font-outfit font-medium text-sm hover:text-neon-cyan transition-colors">
                      {value}
                    </a>
                  ) : (
                    <span className="text-white font-outfit font-medium text-sm">{value}</span>
                  )}
                </div>
              </div>
            ))}

            {/* Social links */}
            <div className="glass-card rounded-2xl p-5 border border-dark-border">
              <div className="text-slate-500 text-xs font-mono mb-3">Follow Us</div>
              <div className="flex gap-3 flex-wrap">
                {['GitHub', 'LinkedIn', 'Twitter', 'Instagram'].map(platform => (
                  <a
                    key={platform}
                    href="#"
                    className="px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-xs font-outfit text-slate-400 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            </div>

            {/* Tagline card */}
            <div className="glass-card rounded-2xl p-5 border border-electric-blue/20 bg-gradient-to-br from-electric-blue/5 to-deep-purple/5">
              <div className="font-mono text-xs text-neon-cyan mb-2">// Our promise</div>
              <p className="text-sm text-slate-300 font-outfit leading-relaxed">
                Response within <span className="text-white font-semibold">24 hours</span>. Free consultation. No commitment required.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-3xl p-8 border border-dark-border relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-electric-blue/5 rounded-full blur-3xl pointer-events-none" />

              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center">
                    <CheckCircle2 size={40} className="text-neon-green" />
                  </div>
                  <h3 className="font-sora font-bold text-2xl text-white">Message Sent!</h3>
                  <p className="text-slate-400 font-outfit max-w-sm">
                    Thanks for reaching out! We'll get back to you within 24 hours.
                  </p>
                  <button onClick={() => setStatus(null)} className="btn-outline text-sm mt-2">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                  {status === 'error' && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-outfit">
                      <AlertCircle size={18} />
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-2">Your Name *</label>
                      <input
                        {...register('name', { required: 'Name is required' })}
                        className={`form-input ${errors.name ? 'border-red-500/50' : ''}`}
                        placeholder="Rahul Sharma"
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1 font-outfit">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-2">Email Address *</label>
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' }
                        })}
                        type="email"
                        className={`form-input ${errors.email ? 'border-red-500/50' : ''}`}
                        placeholder="rahul@company.com"
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1 font-outfit">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-2">Phone</label>
                      <input
                        {...register('phone')}
                        className="form-input"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-2">Company</label>
                      <input
                        {...register('company')}
                        className="form-input"
                        placeholder="Your Company"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-2">Service *</label>
                      <select
                        {...register('service', { required: 'Please select a service' })}
                        className={`form-input ${errors.service ? 'border-red-500/50' : ''}`}
                      >
                        <option value="">Select a service</option>
                        {services.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                      {errors.service && <p className="text-red-400 text-xs mt-1 font-outfit">{errors.service.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-2">Budget Range</label>
                      <select {...register('budget')} className="form-input">
                        <option value="">Select budget</option>
                        {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-2">Subject *</label>
                    <input
                      {...register('subject', { required: 'Subject is required' })}
                      className={`form-input ${errors.subject ? 'border-red-500/50' : ''}`}
                      placeholder="Brief project title"
                    />
                    {errors.subject && <p className="text-red-400 text-xs mt-1 font-outfit">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-2">Message *</label>
                    <textarea
                      {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'At least 10 characters' } })}
                      rows={4}
                      className={`form-input resize-none ${errors.message ? 'border-red-500/50' : ''}`}
                      placeholder="Describe your project, goals, and requirements..."
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1 font-outfit">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
