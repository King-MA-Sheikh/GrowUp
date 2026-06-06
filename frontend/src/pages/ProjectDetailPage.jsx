import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProject, getRelatedProjects } from '../utils/api';
import { 
  ArrowLeft, Calendar, Github, ExternalLink, Star, Users, 
  CheckCircle, XCircle, Clock, Award, Code2, Zap,
  Share2, Bookmark, Printer, Linkedin, Twitter, Facebook, Mail,
  Heart, ImageIcon, ChevronLeft, ChevronRight
} from 'lucide-react';

const statusConfig = {
  live: { color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/30', label: 'Live', icon: Zap },
  completed: { color: 'text-neon-cyan', bg: 'bg-neon-cyan/10', border: 'border-neon-cyan/30', label: 'Completed', icon: CheckCircle },
  in_progress: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', label: 'In Progress', icon: Clock }
};

const categoryGradients = {
  'Healthcare & Medical': 'from-rose-500 to-pink-500',
  'E-Commerce': 'from-emerald-500 to-teal-500',
  'Education & E-Learning': 'from-blue-500 to-cyan-500',
  'Travel & Tourism': 'from-orange-500 to-amber-500',
  'Finance & Banking': 'from-green-500 to-emerald-500',
  'Real Estate': 'from-purple-500 to-indigo-500',
  'Food & Restaurant': 'from-red-500 to-orange-500',
  'Social & Community': 'from-pink-500 to-rose-500',
  'AI & Machine Learning': 'from-violet-500 to-purple-500',
  'Blockchain & Web3': 'from-cyan-500 to-blue-500',
  'Web Development': 'from-electric-blue to-neon-cyan',
  'Mobile Development': 'from-neon-cyan to-deep-purple',
  'Full Stack': 'from-deep-purple to-electric-blue',
  'Cloud & DevOps': 'from-neon-cyan to-neon-green',
  'Networking': 'from-neon-green to-electric-blue'
};

const techIcons = {
  'React': '⚛️', 'Python': '🐍', 'Django': '🎯', 'Node.js': '🚀',
  'PostgreSQL': '🐘', 'MongoDB': '🍃', 'Redis': '📀', 'Docker': '🐳',
  'AWS': '☁️', 'Tailwind CSS': '🎨', 'TypeScript': '📘', 'Next.js': '▲',
  'Vue.js': '💚', 'Angular': '🅰️', 'Flask': '🌶️', 'FastAPI': '⚡',
  'HTML5': '🌐', 'CSS3': '🎨', 'JavaScript': '💛', 'Express': '🚂',
  'Node': '💚', 'HTML': '📄', 'CSS': '🎨', 'JS': '💛', 'PHP': '🐘',
  'Laravel': '⚙️', 'MySQL': '🗄️', 'MongoDB': '🍃', 'Redis': '⚡'
};

// Helper function to strip HTML tags
const stripHtml = (html) => {
  if (!html) return '';
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
};

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjectData();
  }, [slug]);

  const fetchProjectData = async () => {
    setLoading(true);
    try {
      const response = await getProject(slug);
      setProject(response.data);
      
      try {
        const relatedResponse = await getRelatedProjects(slug);
        setRelatedProjects(relatedResponse.data || []);
      } catch (err) {
        console.log('No related projects found');
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Project not found');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${project?.title} - ${project?.short_description}`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(project?.title)}&body=${encodeURIComponent(text + '\n\n' + url)}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const handlePrint = () => {
    window.print();
  };

  // Get all images for gallery
  const getAllImages = () => {
    const images = [];
    if (project?.featured_image_url) images.push(project.featured_image_url);
    if (project?.gallery_images?.length) images.push(...project.gallery_images);
    return images;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
          <p className="text-slate-400">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-sora font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-slate-400 mb-6">The project you're looking for doesn't exist or has been moved.</p>
          <Link to="/portfolio" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[project.status]?.icon || CheckCircle;
  const statusStyle = statusConfig[project.status] || statusConfig.completed;
  const gradient = categoryGradients[project.category] || 'from-electric-blue to-neon-cyan';
  const allImages = getAllImages();
  
  // Get plain text description
  const plainDescription = stripHtml(project.description || project.long_description || project.short_description);
  const descriptionToShow = showFullDescription ? plainDescription : (plainDescription.substring(0, 500) + (plainDescription.length > 500 ? '...' : ''));

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/portfolio')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </button>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Left - Image Gallery */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className={`relative aspect-video bg-gradient-to-br ${gradient}`}>
              {allImages.length > 0 ? (
                <img 
                  src={allImages[currentImageIndex].startsWith('http') ? allImages[currentImageIndex] : `http://localhost:5678${allImages[currentImageIndex]}`} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <ImageIcon size={64} className="text-white/30 mb-4" />
                  <p className="text-white/50">No image available</p>
                </div>
              )}
            </div>
            
            {/* Image Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      currentImageIndex === idx ? 'border-electric-blue' : 'border-transparent'
                    }`}
                  >
                    <img src={img.startsWith('http') ? img : `http://localhost:5678${img}`} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Project Info */}
          <div>
            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2 ${statusStyle.bg} ${statusStyle.color} border ${statusStyle.border}`}>
                <StatusIcon size={12} />
                {statusStyle.label}
              </span>
              {project.is_featured && (
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-yellow-400/20 text-yellow-400 border border-yellow-400/20 flex items-center gap-2">
                  <Star size={12} />
                  Featured Project
                </span>
              )}
              {project.completion_date && (
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-dark-card text-slate-400 border border-dark-border flex items-center gap-2">
                  <Calendar size={12} />
                  {new Date(project.completion_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-sora font-extrabold text-white mb-4">
              {project.title}
            </h1>
            
            <p className="text-slate-400 text-lg font-outfit leading-relaxed mb-6">
              {project.short_description}
            </p>

            {/* Tech Stack */}
            {(project.tech_stack_list || project.tech_stack || []).length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-sora font-semibold text-white mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {(project.tech_stack_list || project.tech_stack || []).map(tech => (
                    <span 
                      key={tech}
                      className="px-3 py-1.5 rounded-xl bg-dark-card border border-dark-border text-sm text-slate-300 flex items-center gap-2"
                    >
                      <span className="text-lg">{techIcons[tech] || '💻'}</span>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 rounded-xl bg-dark-card border border-dark-border text-slate-400 hover:text-white hover:border-electric-blue transition-all inline-flex items-center gap-2">
                  <Github size={16} />
                  Source Code
                </a>
              )}
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-3">
              <span className="text-slate-500 text-sm">Share:</span>
              <button onClick={() => handleShare('twitter')} className="p-2 rounded-lg hover:bg-dark-border transition-colors">
                <Twitter size={18} className="text-slate-400" />
              </button>
              <button onClick={() => handleShare('linkedin')} className="p-2 rounded-lg hover:bg-dark-border transition-colors">
                <Linkedin size={18} className="text-slate-400" />
              </button>
              <button onClick={() => handleShare('facebook')} className="p-2 rounded-lg hover:bg-dark-border transition-colors">
                <Facebook size={18} className="text-slate-400" />
              </button>
              <button onClick={() => handleShare('email')} className="p-2 rounded-lg hover:bg-dark-border transition-colors">
                <Mail size={18} className="text-slate-400" />
              </button>
              <button onClick={handlePrint} className="p-2 rounded-lg hover:bg-dark-border transition-colors">
                <Printer size={18} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Project Overview */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-sora font-bold text-white mb-4">Project Overview</h2>
          <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {descriptionToShow || 'No description available.'}
          </div>
          {plainDescription.length > 500 && (
            <button 
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="mt-4 text-electric-blue hover:text-neon-cyan transition-colors"
            >
              {showFullDescription ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>

        {/* Key Features */}
        {(project.features || []).length > 0 && (
          <div className="glass-card rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-sora font-bold text-white mb-4">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {(project.features || []).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-neon-green flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Challenges & Solutions */}
        {(project.challenges || project.solutions) && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {project.challenges && (
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <XCircle size={20} className="text-red-400" />
                  </div>
                  <h3 className="text-xl font-sora font-bold text-white">Challenges</h3>
                </div>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{project.challenges}</p>
              </div>
            )}
            {project.solutions && (
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-neon-green/20 flex items-center justify-center">
                    <CheckCircle size={20} className="text-neon-green" />
                  </div>
                  <h3 className="text-xl font-sora font-bold text-white">Solutions</h3>
                </div>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{project.solutions}</p>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {project.results && (
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Award size={20} className="text-yellow-400" />
              </div>
              <h2 className="text-2xl font-sora font-bold text-white">Results & Impact</h2>
            </div>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{project.results}</p>
          </div>
        )}

        {/* Client Review */}
        {project.client_review && (
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-electric-blue to-neon-cyan flex items-center justify-center">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <h4 className="font-sora font-semibold text-white">{project.client_name || 'Client'}</h4>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < (project.client_rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-slate-300 italic">"{project.client_review}"</p>
          </div>
        )}

        {/* Project Stats Sidebar Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-slate-400 text-sm">Category</div>
            <div className="text-white font-semibold mt-1">{project.category || 'Uncategorized'}</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-slate-400 text-sm">Status</div>
            <div className={`font-semibold mt-1 ${statusStyle.color}`}>{statusStyle.label}</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-slate-400 text-sm">Technologies</div>
            <div className="text-white font-semibold mt-1">{(project.tech_stack_list || project.tech_stack || []).length}+</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-slate-400 text-sm">Features</div>
            <div className="text-white font-semibold mt-1">{(project.features || []).length}+</div>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div>
            <h2 className="text-2xl font-sora font-bold text-white mb-6">Related Projects</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProjects.map(related => (
                <Link 
                  key={related.id} 
                  to={`/portfolio/${related.slug}`}
                  className="glass-card rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-blue"
                >
                  <h3 className="font-sora font-bold text-white mb-2 line-clamp-1">{related.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2">{related.short_description}</p>
                  <div className="mt-3 text-electric-blue text-sm">View Project →</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 glass-card rounded-2xl p-8 text-center bg-gradient-to-br from-electric-blue/10 to-neon-cyan/10">
          <Heart size={32} className="text-electric-blue mx-auto mb-3" />
          <h3 className="font-sora font-bold text-white text-xl mb-2">Ready to start a similar project?</h3>
          <p className="text-slate-400 mb-4">Let's discuss how we can help you achieve your goals.</p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
            Start Your Project
            <ArrowLeft size={16} className="rotate-180" />
          </Link>
        </div>
      </div>
    </main>
  );
}