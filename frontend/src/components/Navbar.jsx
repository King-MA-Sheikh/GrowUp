import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Zap, ChevronDown, Code2, Database, Cloud, 
  Briefcase, Users, PenTool, Search, Globe, ChevronRight,
  LayoutGrid, Cpu, BookOpen, MessageCircle, Shield, Sparkles,
  Loader2, User, FolderGit2, TestTube, Cpu as CpuIcon,
  Star, Award, Target, Rocket, Heart, Users as UsersIcon,
  UserPlus, Building, Calendar, Mail, Phone, MapPin,
  LogIn, UserCircle, Settings, LogOut, HelpCircle, Bell,
  ArrowUp
} from 'lucide-react';
import logoImage from '../assets/Logo.png';
import { getProjects, getTestimonials } from '../utils/api';
import api from '../utils/api';
import toast from 'react-hot-toast';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services', hasDropdown: true },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact', href: '/contact' },
];

const serviceDropdownItems = [
  { 
    label: '3000+ Technologies', 
    icon: Database, 
    href: '/technologies',
    description: 'Explore our vast technology stack'
  },
  { 
    label: 'Team', 
    icon: UsersIcon, 
    href: '/team',
    description: 'Meet our expert team members'
  },
  { 
    label: 'Career Page', 
    icon: Briefcase, 
    href: '/careers',
    description: 'Join our growing team'
  },
  { 
    label: 'Connect to Project Manager', 
    icon: Users, 
    href: '/connect-manager',
    description: 'Talk to our expert project managers'
  },
  { 
    label: 'Create Project With Us', 
    icon: PenTool, 
    href: '/create-project',
    description: 'Start your dream project today'
  },
  { 
    label: 'Solve Problem in Code', 
    icon: Code2, 
    href: '/code-solutions',
    description: 'Get expert coding assistance'
  },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
];

// Mock developers data (in production, fetch from API)
const developersData = [
  { id: 1, name: 'Mohd Alkamah Sheikh', role: 'CEO & Founder', slug: 'mohd-alkamah-sheikh', avatar: 'MS', skills: ['Python', 'Django', 'React', 'AWS'] },
  { id: 2, name: 'Aarav Sharma', role: 'Senior Backend Architect', slug: 'aarav-sharma', avatar: 'AS', skills: ['Python', 'Django', 'Java', 'AWS'] },
  { id: 3, name: 'Ishita Verma', role: 'Lead Frontend Engineer', slug: 'ishita-verma', avatar: 'IV', skills: ['React', 'Next.js', 'TypeScript'] },
  { id: 4, name: 'Rohan Mehta', role: 'DevOps Engineer', slug: 'rohan-mehta', avatar: 'RM', skills: ['Docker', 'K8s', 'AWS', 'Terraform'] },
  { id: 5, name: 'Priya Patel', role: 'Mobile Developer', slug: 'priya-patel', avatar: 'PP', skills: ['React Native', 'Flutter'] },
  { id: 6, name: 'Aditya Singh', role: 'Database Administrator', slug: 'aditya-singh', avatar: 'AS', skills: ['PostgreSQL', 'MySQL', 'Oracle'] },
  { id: 7, name: 'Neha Gupta', role: 'Security Engineer', slug: 'neha-gupta', avatar: 'NG', skills: ['Security', 'Penetration Testing'] },
  { id: 8, name: 'Vikram Rathore', role: 'QA Engineer', slug: 'vikram-rathore', avatar: 'VR', skills: ['Testing', 'Automation'] },
];

// Technologies data
const technologiesData = [
  { id: 1, name: 'React', category: 'Frontend', slug: 'react', icon: '⚛️', count: 150 },
  { id: 2, name: 'Python', category: 'Backend', slug: 'python', icon: '🐍', count: 200 },
  { id: 3, name: 'Django', category: 'Backend', slug: 'django', icon: '🎯', count: 120 },
  { id: 4, name: 'Node.js', category: 'Backend', slug: 'nodejs', icon: '🚀', count: 180 },
  { id: 5, name: 'PostgreSQL', category: 'Database', slug: 'postgresql', icon: '🐘', count: 100 },
  { id: 6, name: 'MongoDB', category: 'Database', slug: 'mongodb', icon: '🍃', count: 90 },
  { id: 7, name: 'Docker', category: 'DevOps', slug: 'docker', icon: '🐳', count: 110 },
  { id: 8, name: 'Kubernetes', category: 'DevOps', slug: 'kubernetes', icon: '⚙️', count: 80 },
  { id: 9, name: 'AWS', category: 'Cloud', slug: 'aws', icon: '☁️', count: 130 },
  { id: 10, name: 'Tailwind CSS', category: 'Frontend', slug: 'tailwind', icon: '🎨', count: 95 },
  { id: 11, name: 'TypeScript', category: 'Frontend', slug: 'typescript', icon: '📘', count: 85 },
  { id: 12, name: 'Next.js', category: 'Frontend', slug: 'nextjs', icon: '▲', count: 70 },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [languageSearchTerm, setLanguageSearchTerm] = useState('');
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const languageRef = useRef(null);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (storedUser && loggedIn === 'true') {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  // Check scroll position for scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on location change
  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
    setSearchOpen(false);
    setLanguageOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setLanguageOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search functionality
  useEffect(() => {
    const searchData = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);
      const term = searchTerm.toLowerCase();
      
      try {
        const projectsRes = await getProjects({ page_size: 50 });
        let projects = [];
        if (projectsRes.data) {
          if (projectsRes.data.results) {
            projects = projectsRes.data.results;
          } else if (Array.isArray(projectsRes.data)) {
            projects = projectsRes.data;
          }
        }

        const testimonialsRes = await getTestimonials();
        let testimonials = [];
        if (testimonialsRes.data) {
          if (testimonialsRes.data.results) {
            testimonials = testimonialsRes.data.results;
          } else if (Array.isArray(testimonialsRes.data)) {
            testimonials = testimonialsRes.data;
          }
        }

        const filteredProjects = projects
          .filter(project => 
            project.title?.toLowerCase().includes(term) ||
            project.short_description?.toLowerCase().includes(term) ||
            project.category?.toLowerCase().includes(term)
          )
          .map(project => ({
            id: project.id,
            name: project.title,
            type: 'project',
            slug: project.slug,
            icon: '📁',
            category: project.category,
            description: project.short_description?.substring(0, 60)
          }));

        const filteredTestimonials = testimonials
          .filter(testimonial => 
            testimonial.client_name?.toLowerCase().includes(term) ||
            testimonial.message?.toLowerCase().includes(term) ||
            testimonial.client_company?.toLowerCase().includes(term)
          )
          .map(testimonial => ({
            id: testimonial.id,
            name: testimonial.client_name,
            type: 'testimonial',
            slug: `testimonial-${testimonial.id}`,
            icon: '💬',
            category: 'Client Review',
            description: testimonial.message?.substring(0, 60)
          }));

        const filteredDevelopers = developersData
          .filter(dev => 
            dev.name.toLowerCase().includes(term) ||
            dev.role.toLowerCase().includes(term) ||
            dev.skills.some(skill => skill.toLowerCase().includes(term))
          )
          .map(dev => ({
            id: dev.id,
            name: dev.name,
            type: 'developer',
            slug: dev.slug,
            icon: '👨‍💻',
            category: dev.role,
            description: `Skills: ${dev.skills.slice(0, 3).join(', ')}`
          }));

        const filteredTechnologies = technologiesData
          .filter(tech => 
            tech.name.toLowerCase().includes(term) ||
            tech.category.toLowerCase().includes(term)
          )
          .map(tech => ({
            id: tech.id,
            name: tech.name,
            type: 'technology',
            slug: tech.slug,
            icon: tech.icon,
            category: tech.category,
            description: `${tech.count}+ projects using this technology`
          }));

        const allResults = [
          ...filteredDevelopers,
          ...filteredProjects,
          ...filteredTestimonials,
          ...filteredTechnologies
        ].slice(0, 10);

        setSearchResults(allResults);
      } catch (err) {
        console.error('Search error:', err);
        const filteredDevelopers = developersData
          .filter(dev => dev.name.toLowerCase().includes(term))
          .map(dev => ({
            id: dev.id,
            name: dev.name,
            type: 'developer',
            slug: dev.slug,
            icon: '👨‍💻',
            category: dev.role,
          }));

        const filteredTechnologies = technologiesData
          .filter(tech => tech.name.toLowerCase().includes(term))
          .map(tech => ({
            id: tech.id,
            name: tech.name,
            type: 'technology',
            slug: tech.slug,
            icon: tech.icon,
            category: tech.category,
          }));

        setSearchResults([...filteredDevelopers, ...filteredTechnologies].slice(0, 8));
      } finally {
        setSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      const firstResult = searchResults[0];
      handleResultClick(firstResult);
    }
  };

  const handleResultClick = (result) => {
    if (result.type === 'developer') {
      navigate(`/team/${result.slug}`);
    } else if (result.type === 'project') {
      navigate(`/portfolio/${result.slug}`);
    } else if (result.type === 'technology') {
      navigate(`/technologies/${result.slug}`);
    } else if (result.type === 'testimonial') {
      navigate(`/testimonials`);
    }
    setSearchOpen(false);
    setSearchTerm('');
  };

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(languageSearchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(languageSearchTerm.toLowerCase())
  );

  // Handle hover for services dropdown
  const handleServiceMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setDropdownOpen(true);
  };

  const handleServiceMouseLeave = () => {
    const timeout = setTimeout(() => {
      setDropdownOpen(false);
    }, 300);
    setHoverTimeout(timeout);
  };

  // Handle click for services - navigates to services page
  const handleServiceClick = () => {
    navigate('/services');
  };

  // Handle dropdown toggle for mobile
  const handleDropdownToggle = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const getResultIcon = (result) => {
    switch (result.type) {
      case 'developer': return <User size={16} className="text-neon-cyan" />;
      case 'project': return <FolderGit2 size={16} className="text-neon-green" />;
      case 'testimonial': return <MessageCircle size={16} className="text-yellow-400" />;
      case 'technology': return <CpuIcon size={16} className="text-electric-blue" />;
      default: return <Search size={16} className="text-slate-400" />;
    }
  };

  // Authentication handlers
  const handleLogin = () => {
    navigate('/login');
    setUserMenuOpen(false);
  };

  const handleSignup = () => {
    navigate('/signup');
    setUserMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      setIsLoggedIn(false);
      setUser(null);
      setUserMenuOpen(false);
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  const handleProfile = () => {
    navigate('/profile');
    setUserMenuOpen(false);
  };

  const handleBilling = () => {
    navigate('/billing');
    setUserMenuOpen(false);
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    if (user?.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-2 glass-card border-b border-dark-border/60 shadow-xl'
            : 'py-2 bg-gradient-to-r from-dark-bg/95 to-dark-bg/90 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="GrowUp Logo" 
                className="w-[120px] h-[120px] object-cover rounded-lg hover:scale-105 transition-transform duration-300" 
              />
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex relative flex-1 max-w-md" ref={searchRef}>
            <div className="relative w-full">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search developers, projects, technologies, testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onKeyPress={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-dark-card/80 border border-dark-border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-blue transition-colors text-sm"
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 size={16} className="animate-spin text-slate-400" />
                </div>
              )}
            </div>
            
            {/* Search Results Dropdown */}
            {searchOpen && (searchResults.length > 0 || searchLoading) && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl border border-dark-border shadow-xl max-h-96 overflow-y-auto z-50">
                {searchLoading ? (
                  <div className="flex items-center justify-center p-6">
                    <Loader2 size={24} className="animate-spin text-electric-blue" />
                    <span className="ml-2 text-slate-400">Searching...</span>
                  </div>
                ) : (
                  <>
                    {searchResults.map((result, idx) => (
                      <button
                        key={`${result.type}-${result.id || idx}`}
                        onClick={() => handleResultClick(result)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-dark-card/50 transition-colors border-b border-dark-border/50 last:border-0 text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-dark-card flex items-center justify-center">
                          {result.icon ? (
                            <span className="text-lg">{result.icon}</span>
                          ) : (
                            getResultIcon(result)
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-medium">{result.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-dark-border text-slate-400">
                              {result.type}
                            </span>
                            {result.category && (
                              <span className="text-xs text-slate-500">{result.category}</span>
                            )}
                          </div>
                          {result.description && (
                            <div className="text-slate-500 text-xs mt-0.5 line-clamp-1">
                              {result.description}
                            </div>
                          )}
                        </div>
                        <ChevronRight size={16} className="text-slate-500 flex-shrink-0" />
                      </button>
                    ))}
                    {searchTerm.length >= 2 && searchResults.length === 0 && !searchLoading && (
                      <div className="p-6 text-center">
                        <p className="text-slate-400 text-sm">No results found for "{searchTerm}"</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li 
                key={link.href} 
                className="relative"
                ref={link.hasDropdown ? dropdownRef : null}
                onMouseEnter={link.hasDropdown ? handleServiceMouseEnter : null}
                onMouseLeave={link.hasDropdown ? handleServiceMouseLeave : null}
              >
                {link.hasDropdown ? (
                  <>
                    <button
                      onClick={handleServiceClick}
                      className={`relative px-3 py-1.5 rounded-lg font-outfit text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                        dropdownOpen
                          ? 'text-neon-cyan'
                          : 'text-slate-400 hover:text-soft-white'
                      }`}
                    >
                      {link.label}
                      <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Services Dropdown Menu */}
                    {dropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-80 glass-card rounded-xl border border-dark-border shadow-xl overflow-hidden z-50">
                        <div className="p-2">
                          {serviceDropdownItems.map((item) => (
                            <Link
                              key={item.label}
                              to={item.href}
                              className="flex items-start gap-3 p-3 rounded-lg hover:bg-dark-card/50 transition-colors group"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-electric-blue/20 to-neon-cyan/20 flex items-center justify-center flex-shrink-0">
                                <item.icon size={18} className="text-neon-cyan" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-medium text-sm group-hover:text-neon-cyan transition-colors">
                                    {item.label}
                                  </span>
                                  <ChevronRight size={14} className="text-slate-500 group-hover:text-neon-cyan transition-colors" />
                                </div>
                                <p className="text-slate-500 text-xs mt-0.5">{item.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.href}
                    className={`relative px-3 py-1.5 rounded-lg font-outfit text-sm font-medium transition-all duration-200 ${
                      location.pathname === link.href
                        ? 'text-neon-cyan'
                        : 'text-slate-400 hover:text-soft-white'
                    }`}
                  >
                    {location.pathname === link.href && (
                      <span className="absolute inset-0 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20" />
                    )}
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Right Side Items - Language Selector + User Menu + CTA */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setLanguageOpen(!languageOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-dark-card/50 border border-dark-border hover:border-electric-blue transition-colors"
              >
                <Globe size={16} className="text-slate-400" />
                <span className="text-white text-sm hidden sm:inline">{currentLanguage.flag}</span>
                <ChevronDown size={12} className={`text-slate-400 transition-transform ${languageOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Language Dropdown */}
              {languageOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 glass-card rounded-xl border border-dark-border shadow-xl overflow-hidden z-50">
                  <div className="p-3 border-b border-dark-border">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search language..."
                        value={languageSearchTerm}
                        onChange={(e) => setLanguageSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-dark-card/50 border border-dark-border rounded-lg text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-electric-blue"
                      />
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {filteredLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLanguage(lang);
                          setLanguageOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2 hover:bg-dark-card/50 transition-colors ${
                          currentLanguage.code === lang.code ? 'bg-dark-card/30' : ''
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <div className="flex-1 text-left">
                          <div className="text-white text-sm">{lang.name}</div>
                          <div className="text-slate-500 text-xs">{lang.nativeName}</div>
                        </div>
                        {currentLanguage.code === lang.code && (
                          <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Section */}
            <div className="relative" ref={userMenuRef}>
              {isLoggedIn && user ? (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-dark-card/50 border border-dark-border hover:border-electric-blue transition-colors"
                >
                  {user.profile_photo_url ? (
                    <img 
                      src={user.profile_photo_url} 
                      alt={user.full_name || user.first_name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-electric-blue to-neon-cyan flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {getUserInitials()}
                      </span>
                    </div>
                  )}
                  <span className="text-white text-sm hidden md:inline">
                    {user.first_name || user.username?.split('@')[0]}
                  </span>
                  <ChevronDown size={12} className={`text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-dark-card/50 border border-dark-border hover:border-electric-blue transition-colors"
                >
                  <UserCircle size={18} className="text-slate-400" />
                  <span className="text-white text-sm hidden md:inline">Account</span>
                  <ChevronDown size={12} className={`text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              )}

              {/* User Menu Dropdown */}
              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 glass-card rounded-xl border border-dark-border shadow-xl overflow-hidden z-50">
                  {isLoggedIn && user ? (
                    <>
                      <div className="p-3 border-b border-dark-border">
                        <div className="flex items-center gap-3">
                          {user.profile_photo_url ? (
                            <img 
                              src={user.profile_photo_url} 
                              alt={user.full_name || user.first_name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue to-neon-cyan flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {getUserInitials()}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="text-white text-sm font-medium">
                              {user.full_name || `${user.first_name} ${user.last_name}`}
                            </div>
                            <div className="text-slate-500 text-xs truncate max-w-[150px]">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-1">
                        <button 
                          onClick={handleProfile}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-card/50 transition-colors text-slate-300 text-sm"
                        >
                          <User size={16} />
                          My Profile
                        </button>
                        <button 
                          onClick={handleBilling}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-card/50 transition-colors text-slate-300 text-sm"
                        >
                          <Settings size={16} />
                          Billing & Subscription
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-card/50 transition-colors text-slate-300 text-sm">
                          <HelpCircle size={16} />
                          Help & Support
                        </button>
                        <div className="border-t border-dark-border my-1"></div>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors text-red-400 text-sm"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3">
                      <button 
                        onClick={handleLogin}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-electric-blue to-neon-cyan text-white text-sm font-medium hover:shadow-glow-blue transition-all mb-2"
                      >
                        <LogIn size={16} />
                        Sign In
                      </button>
                      <button 
                        onClick={handleSignup}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-dark-card border border-dark-border text-slate-300 text-sm font-medium hover:text-white hover:border-electric-blue transition-all"
                      >
                        <UserPlus size={16} />
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden lg:block">
              <Link to="/upgrade" className="btn-primary text-sm py-1.5 px-4">
                Upgrade →
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-card transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden mt-2 mx-4 glass-card rounded-2xl p-4 border border-dark-border/60 max-h-[80vh] overflow-y-auto">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearch}
                className="w-full pl-9 pr-3 py-2 bg-dark-card/80 border border-dark-border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-blue text-sm"
              />
              {searchResults.length > 0 && searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl border border-dark-border max-h-64 overflow-y-auto">
                  {searchResults.slice(0, 5).map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleResultClick(result)}
                      className="w-full flex items-center gap-2 p-2 hover:bg-dark-card/50 transition-colors"
                    >
                      <span>{result.icon}</span>
                      <div className="flex-1 text-left">
                        <div className="text-white text-sm">{result.name}</div>
                        <div className="text-slate-500 text-xs">{result.category || result.type}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  {link.hasDropdown ? (
                    <>
                      <div 
                        className="text-slate-400 px-4 py-3 text-sm font-medium flex items-center justify-between cursor-pointer hover:text-white"
                        onClick={handleDropdownToggle}
                      >
                        <span onClick={() => navigate('/services')}>Services</span>
                        <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                      </div>
                      {dropdownOpen && (
                        <div className="pl-4 space-y-1">
                          {serviceDropdownItems.map((item) => (
                            <Link
                              key={item.label}
                              to={item.href}
                              className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-dark-card transition-colors"
                              onClick={() => {
                                setOpen(false);
                                setDropdownOpen(false);
                              }}
                            >
                              <item.icon size={16} className="text-neon-cyan" />
                              <span className="text-slate-300 text-sm">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={link.href}
                      className={`flex items-center px-4 py-3 rounded-xl font-outfit text-sm font-medium transition-colors ${
                        location.pathname === link.href
                          ? 'text-neon-cyan bg-neon-cyan/10'
                          : 'text-slate-400 hover:text-white hover:bg-dark-card'
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            
            {/* Mobile Language Selector */}
            <div className="mt-3 pt-3 border-t border-dark-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Language</span>
                <div className="flex flex-wrap gap-2">
                  {languages.slice(0, 4).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setCurrentLanguage(lang)}
                      className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                        currentLanguage.code === lang.code
                          ? 'bg-electric-blue text-white'
                          : 'bg-dark-card text-slate-400 hover:text-white'
                      }`}
                    >
                      {lang.flag} {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile User Actions */}
            <div className="mt-3 pt-3 border-t border-dark-border">
              {isLoggedIn && user ? (
                <>
                  <div className="flex items-center gap-3 mb-3 p-2 bg-dark-card/50 rounded-xl">
                    {user.profile_photo_url ? (
                      <img 
                        src={user.profile_photo_url} 
                        alt={user.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue to-neon-cyan flex items-center justify-center">
                        <span className="text-white font-bold">
                          {getUserInitials()}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="text-white text-sm font-medium">
                        {user.full_name || user.first_name}
                      </div>
                      <div className="text-slate-500 text-xs">{user.email}</div>
                    </div>
                  </div>
                  <button 
                    onClick={handleProfile}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-dark-card border border-dark-border text-slate-300 text-sm font-medium hover:text-white hover:border-electric-blue transition-all mb-2"
                  >
                    <User size={16} />
                    My Profile
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-electric-blue to-neon-cyan text-white text-sm font-medium hover:shadow-glow-blue transition-all mb-2"
                  >
                    <LogIn size={16} />
                    Sign In
                  </button>
                  <button 
                    onClick={handleSignup}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-dark-card border border-dark-border text-slate-300 text-sm font-medium hover:text-white hover:border-electric-blue transition-all"
                  >
                    <UserPlus size={16} />
                    Sign Up
                  </button>
                </>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-dark-border">
              <Link to="/contact" className="btn-primary text-sm w-full justify-center" onClick={() => setOpen(false)}>
                Get Started →
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-gradient-to-r from-electric-blue to-neon-cyan rounded-full shadow-lg hover:shadow-glow-blue transition-all duration-300 group"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} className="text-white transform group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      )}
    </>
  );
}