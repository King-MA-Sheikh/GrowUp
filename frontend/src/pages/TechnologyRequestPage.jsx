import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Send, Calendar, Clock, DollarSign, Users, 
  FileText, MessageCircle, CheckCircle, AlertCircle,
  Code2, Brain, Cloud, Database, Shield, Zap, Star,
  ChevronRight, Upload, X, Loader2, Phone, Mail, MapPin,
  Plus, Trash2, Layers, Wallet, IndianRupee, Linkedin, 
  MessageSquare, Video, Globe, Eye, Edit, User, Image,
  Camera, Check, AlertTriangle, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link2, Minus, Type, Highlighter,
  Palette, Eraser, Undo, Redo, Save, Copy, Scissors,
  Heading1, Heading2, Heading3
} from 'lucide-react';
import { serviceCategories } from '../data/servicesData';

// Add global styles for lists and text direction
const globalStyles = `
  /* Force LTR direction for all content */
  .editor-content, .editor-content *, 
  [contenteditable="true"], [contenteditable="true"] *,
  .review-content, .review-content * {
    direction: ltr !important;
    unicode-bidi: normal !important;
  }
  
  /* List styles */
  .editor-content ul, .editor-content ol,
  [contenteditable="true"] ul, [contenteditable="true"] ol {
    margin: 0.5em 0;
    padding-left: 2em;
  }
  
  .editor-content ul li,
  [contenteditable="true"] ul li {
    list-style-type: disc !important;
    margin: 0.25em 0;
  }
  
  .editor-content ol li,
  [contenteditable="true"] ol li {
    list-style-type: decimal !important;
    margin: 0.25em 0;
  }
  
  /* Nested lists */
  .editor-content ul ul li,
  [contenteditable="true"] ul ul li {
    list-style-type: circle !important;
  }
  
  .editor-content ul ul ul li,
  [contenteditable="true"] ul ul ul li {
    list-style-type: square !important;
  }
  
  .editor-content ol ol li,
  [contenteditable="true"] ol ol li {
    list-style-type: lower-alpha !important;
  }
  
  .editor-content ol ol ol li,
  [contenteditable="true"] ol ol ol li {
    list-style-type: lower-roman !important;
  }
  
  /* Prevent text reversal */
  p, div, span, h1, h2, h3, h4, h5, h6, li {
    direction: ltr !important;
    unicode-bidi: normal !important;
  }
  
  /* Editor content area */
  [contenteditable="true"] {
    direction: ltr !important;
    unicode-bidi: normal !important;
  }
  
  /* Tooltip animation */
  @keyframes fadeOut {
    0% { opacity: 1; }
    70% { opacity: 1; }
    100% { opacity: 0; visibility: hidden; }
  }
`;

const TechnologyRequestPage = () => {
  const { technology } = useParams();
  const navigate = useNavigate();
  const decodedTech = decodeURIComponent(technology);
  
  const editorRef = useRef(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    projectType: 'new',
    timeline: '1-2 months',
    budget: '50000-100000',
    customBudget: '',
    description: '',
    requirements: '',
    contactMethod: 'email',
    contactValue: '',
    agreeTerms: false
  });
  
  const [additionalTechnologies, setAdditionalTechnologies] = useState([]);
  const [currentTech, setCurrentTech] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const [userPhotoPreview, setUserPhotoPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#ffffff');
  const [highlightColor, setHighlightColor] = useState('transparent');

  // Add styles to head
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.textContent = globalStyles;
    styleTag.id = 'global-editor-styles';
    if (!document.querySelector('#global-editor-styles')) {
      document.head.appendChild(styleTag);
    }
    return () => {
      const tag = document.querySelector('#global-editor-styles');
      if (tag) tag.remove();
    };
  }, []);

  const fontFamilies = [
    'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 
    'Georgia', 'Verdana', 'Tahoma', 'Trebuchet MS', 
    'Comic Sans MS', 'Impact', 'Montserrat', 'Poppins'
  ];

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];

  const colors = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#ff6600', '#ff0066', '#66ff00', '#0066ff', '#6600ff', '#ff6600', '#ffcc00', '#99cc00'
  ];

  const highlightColors = [
    'transparent', '#ffff00', '#ffeb3b', '#ff9800', '#ff5722', '#4caf50', '#2196f3', '#9c27b0',
    '#f44336', '#e91e63', '#00bcd4', '#8bc34a', '#ffc107', '#607d8b'
  ];

  const allTechnologies = useMemo(() => {
    const techs = new Set();
    serviceCategories.forEach(category => {
      category.subcategories.forEach(subcategory => {
        subcategory.technologies.forEach(tech => {
          techs.add(tech);
        });
      });
    });
    return Array.from(techs);
  }, []);

  useEffect(() => {
    if (currentTech.length > 1) {
      const filtered = allTechnologies
        .filter(tech => 
          tech.toLowerCase().includes(currentTech.toLowerCase()) &&
          tech.toLowerCase() !== decodedTech.toLowerCase() &&
          !additionalTechnologies.includes(tech)
        )
        .slice(0, 10);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [currentTech, allTechnologies, decodedTech, additionalTechnologies]);

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

  const handleDescriptionChange = () => {
    if (editorRef.current) {
      let content = editorRef.current.innerHTML;
      // Remove any bidirectional control characters that might cause text reversal
      content = content.replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '');
      setFormData(prev => ({
        ...prev,
        description: content
      }));
    }
  };

  // Show temporary tooltip message
  const showTooltipMessage = (message) => {
    const tooltip = document.createElement('div');
    tooltip.textContent = message;
    tooltip.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #333;
      color: white;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      animation: fadeOut 2s ease-out forwards;
    `;
    document.body.appendChild(tooltip);
    setTimeout(() => tooltip.remove(), 2000);
  };

  // Helper function to clean text (remove bidirectional characters)
  const cleanText = (text) => {
    return text.replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '');
  };

  // Custom list handler for ordered list (numbers)
  const handleOrderedList = () => {
    const selection = window.getSelection();
    editorRef.current.focus();
    
    if (selection.toString().length > 0) {
      let selectedText = selection.toString();
      selectedText = cleanText(selectedText);
      const range = selection.getRangeAt(0);
      
      // Split by lines and wrap each line in a list item
      const lines = selectedText.split(/\r?\n/);
      let listHtml = '<ol style="margin: 0.5em 0; padding-left: 2em; direction: ltr;">';
      lines.forEach(line => {
        if (line.trim()) {
          const cleanLine = cleanText(line.trim());
          listHtml += `<li style="margin: 0.25em 0; list-style-type: decimal; direction: ltr;">${escapeHtml(cleanLine)}</li>`;
        }
      });
      listHtml += '</ol>';
      
      range.deleteContents();
      const fragment = range.createContextualFragment(listHtml);
      range.insertNode(fragment);
      handleDescriptionChange();
    } else {
      // Insert empty ordered list
      const listHtml = '<ol style="margin: 0.5em 0; padding-left: 2em; direction: ltr;"><li style="margin: 0.25em 0; list-style-type: decimal; direction: ltr;"></li></ol>';
      document.execCommand('insertHTML', false, listHtml);
      handleDescriptionChange();
    }
  };

  // Custom list handler for unordered list (bullets/dots)
  const handleUnorderedList = () => {
    const selection = window.getSelection();
    editorRef.current.focus();
    
    if (selection.toString().length > 0) {
      let selectedText = selection.toString();
      selectedText = cleanText(selectedText);
      const range = selection.getRangeAt(0);
      
      // Split by lines and wrap each line in a list item
      const lines = selectedText.split(/\r?\n/);
      let listHtml = '<ul style="margin: 0.5em 0; padding-left: 2em; direction: ltr;">';
      lines.forEach(line => {
        if (line.trim()) {
          const cleanLine = cleanText(line.trim());
          listHtml += `<li style="margin: 0.25em 0; list-style-type: disc; direction: ltr;">${escapeHtml(cleanLine)}</li>`;
        }
      });
      listHtml += '</ul>';
      
      range.deleteContents();
      const fragment = range.createContextualFragment(listHtml);
      range.insertNode(fragment);
      handleDescriptionChange();
    } else {
      // Insert empty unordered list
      const listHtml = '<ul style="margin: 0.5em 0; padding-left: 2em; direction: ltr;"><li style="margin: 0.25em 0; list-style-type: disc; direction: ltr;"></li></ul>';
      document.execCommand('insertHTML', false, listHtml);
      handleDescriptionChange();
    }
  };

  // Helper function to escape HTML
  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // Handle heading
  const handleHeading = (level) => {
    const selection = window.getSelection();
    editorRef.current.focus();
    
    if (selection.toString().length > 0) {
      let selectedText = selection.toString();
      selectedText = cleanText(selectedText);
      const range = selection.getRangeAt(0);
      const headingHtml = `<h${level} style="font-weight: bold; margin: 0.5em 0; direction: ltr;">${escapeHtml(selectedText)}</h${level}>`;
      
      range.deleteContents();
      const fragment = range.createContextualFragment(headingHtml);
      range.insertNode(fragment);
      handleDescriptionChange();
    } else {
      showTooltipMessage('Please select text to convert to heading');
    }
  };

  // Handle alignment
  const handleAlignment = (align) => {
    const selection = window.getSelection();
    editorRef.current.focus();
    
    if (selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const selectedContent = range.cloneContents();
      const tempDiv = document.createElement('div');
      tempDiv.appendChild(selectedContent);
      
      const alignedHtml = `<div style="text-align: ${align}; direction: ltr;">${tempDiv.innerHTML}</div>`;
      
      range.deleteContents();
      const fragment = range.createContextualFragment(alignedHtml);
      range.insertNode(fragment);
      handleDescriptionChange();
    } else {
      showTooltipMessage('Please select text to align');
    }
  };

  // Basic formatting commands (bold, italic, underline)
  const handleBasicFormat = (command) => {
    const selection = window.getSelection();
    editorRef.current.focus();
    
    if (selection.toString().length > 0) {
      document.execCommand(command, false, null);
      handleDescriptionChange();
    } else {
      showTooltipMessage('Please select text first');
    }
  };

  // Set font family
  const setFontFamilyOnSelection = () => {
    const selection = window.getSelection();
    editorRef.current.focus();
    
    if (selection.toString().length > 0) {
      document.execCommand('fontName', false, fontFamily);
      handleDescriptionChange();
    } else {
      showTooltipMessage('Please select text first');
    }
  };

  // Set font size
  const setFontSizeOnSelection = () => {
    const selection = window.getSelection();
    editorRef.current.focus();
    
    if (selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = fontSize;
      span.style.display = 'inline-block';
      span.style.direction = 'ltr';
      
      try {
        range.surroundContents(span);
        handleDescriptionChange();
      } catch (e) {
        document.execCommand('fontSize', false, '7');
        const elements = editorRef.current.querySelectorAll('font[size="7"]');
        elements.forEach(el => {
          el.removeAttribute('size');
          el.style.fontSize = fontSize;
        });
        handleDescriptionChange();
      }
    } else {
      showTooltipMessage('Please select text first');
    }
  };

  // Set color
  const setColorOnSelection = (color) => {
    const selection = window.getSelection();
    editorRef.current.focus();
    
    if (selection.toString().length > 0) {
      document.execCommand('foreColor', false, color);
      setTextColor(color);
      handleDescriptionChange();
    } else {
      showTooltipMessage('Please select text first');
    }
  };

  // Set highlight
  const setHighlightOnSelection = (color) => {
    const selection = window.getSelection();
    editorRef.current.focus();
    
    if (selection.toString().length > 0) {
      document.execCommand('backColor', false, color);
      setHighlightColor(color);
      handleDescriptionChange();
    } else {
      showTooltipMessage('Please select text first');
    }
  };

  // Clear formatting
  const clearFormattingOnSelection = () => {
    const selection = window.getSelection();
    editorRef.current.focus();
    
    if (selection.toString().length > 0) {
      document.execCommand('removeFormat', false, null);
      handleDescriptionChange();
    } else {
      showTooltipMessage('Please select text first');
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'Photo size should be less than 5MB' }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: 'Please upload an image file' }));
        return;
      }
      setUserPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      if (errors.photo) {
        setErrors(prev => ({ ...prev, photo: '' }));
      }
    }
  };

  const removePhoto = () => {
    setUserPhoto(null);
    setUserPhotoPreview(null);
  };

  const addTechnology = (tech = null) => {
    const techToAdd = tech || currentTech;
    if (techToAdd.trim() && !additionalTechnologies.includes(techToAdd.trim()) && techToAdd.trim() !== decodedTech) {
      setAdditionalTechnologies([...additionalTechnologies, techToAdd.trim()]);
      setCurrentTech('');
      setShowSuggestions(false);
    }
  };

  const removeTechnology = (techToRemove) => {
    setAdditionalTechnologies(additionalTechnologies.filter(tech => tech !== techToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentTech.trim()) {
        addTechnology();
      }
    }
  };

  const selectSuggestion = (suggestion) => {
    addTechnology(suggestion);
  };

  const getContactPlaceholder = () => {
    switch(formData.contactMethod) {
      case 'email': return 'e.g., john@example.com';
      case 'phone': return 'e.g., +91 98765 43210';
      case 'whatsapp': return 'e.g., +91 98765 43210 (with country code)';
      case 'zoom': return 'e.g., Zoom link or Meeting ID';
      case 'linkedin': return 'e.g., linkedin.com/in/johndoe';
      case 'telegram': return 'e.g., @username or phone number';
      default: return 'Enter your contact details';
    }
  };

  const getContactIcon = () => {
    switch(formData.contactMethod) {
      case 'email': return <Mail size={18} className="text-electric-blue" />;
      case 'phone': return <Phone size={18} className="text-electric-blue" />;
      case 'whatsapp': return <MessageCircle size={18} className="text-green-500" />;
      case 'zoom': return <Video size={18} className="text-blue-500" />;
      case 'linkedin': return <Linkedin size={18} className="text-blue-400" />;
      case 'telegram': return <MessageSquare size={18} className="text-cyan-500" />;
      default: return <Mail size={18} className="text-electric-blue" />;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.description.trim() || formData.description === '<p><br></p>' || formData.description === '<br>') {
      newErrors.description = 'Project description is required';
    }
    if (!formData.contactValue.trim()) newErrors.contactValue = `${formData.contactMethod.charAt(0).toUpperCase() + formData.contactMethod.slice(1)} details are required`;
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    
    if (formData.budget === 'other') {
      if (!formData.customBudget) {
        newErrors.customBudget = 'Please enter your budget amount';
      } else if (isNaN(formData.customBudget) || Number(formData.customBudget) <= 0) {
        newErrors.customBudget = 'Please enter a valid budget amount';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReview = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(2);
    }
  };

  const handleEdit = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      const budgetValue = formData.budget === 'other' ? formData.customBudget : formData.budget;
      console.log('Form submitted:', { 
        primaryTechnology: decodedTech,
        additionalTechnologies,
        userPhoto: userPhoto ? userPhoto.name : null,
        description: formData.description,
        ...formData 
      });
    }, 1500);
  };

  const budgetOptions = [
    { value: '25000-50000', label: '₹25,000 - ₹50,000' },
    { value: '50000-100000', label: '₹50,000 - ₹1,00,000' },
    { value: '100000-250000', label: '₹1,00,000 - ₹2,50,000' },
    { value: '250000-500000', label: '₹2,50,000 - ₹5,00,000' },
    { value: '500000-1000000', label: '₹5,00,000 - ₹10,00,000' },
    { value: '1000000+', label: '₹10,00,000+' },
    { value: 'other', label: 'Other (Enter custom amount)' }
  ];

  if (submitted) {
    return (
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-neon-green" />
            </div>
            <h1 className="text-3xl md:text-4xl font-sora font-bold text-white mb-4">
              Request Submitted Successfully!
            </h1>
            <p className="text-slate-400 text-lg mb-6">
              Thank you for choosing GrowUp. Our team will review your request and get back to you within 24 hours.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/services" className="btn-primary">Browse More Services</Link>
              <Link to="/" className="px-6 py-3 rounded-xl border border-dark-border text-slate-400 hover:text-white hover:border-electric-blue transition-all">Back to Home</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (step === 2) {
    const budgetValue = formData.budget === 'other' ? formData.customBudget : budgetOptions.find(opt => opt.value === formData.budget)?.label;
    
    return (
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <button onClick={handleEdit} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Edit
          </button>

          <div className="glass-card rounded-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-sora font-bold text-white mb-2">Review Your Request</h1>
              <p className="text-slate-400">Please review your information before submitting</p>
            </div>

            {userPhotoPreview && (
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <img src={userPhotoPreview} alt="User" className="w-32 h-32 rounded-full object-cover border-4 border-electric-blue" />
                  <div className="absolute bottom-0 right-0 bg-neon-green rounded-full p-1"><Check size={16} className="text-white" /></div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="border-b border-dark-border pb-6">
                <h2 className="text-xl font-sora font-semibold text-white mb-4 flex items-center gap-2"><User size={20} className="text-electric-blue" />Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><p className="text-slate-500 text-sm">Full Name</p><p className="text-white font-medium">{formData.fullName}</p></div>
                  <div><p className="text-slate-500 text-sm">Email</p><p className="text-white font-medium">{formData.email}</p></div>
                  <div><p className="text-slate-500 text-sm">Phone</p><p className="text-white font-medium">{formData.phone}</p></div>
                  <div><p className="text-slate-500 text-sm">Company</p><p className="text-white font-medium">{formData.company || 'Not specified'}</p></div>
                </div>
              </div>

              <div className="border-b border-dark-border pb-6">
                <h2 className="text-xl font-sora font-semibold text-white mb-4 flex items-center gap-2"><Code2 size={20} className="text-electric-blue" />Technology Details</h2>
                <div className="space-y-3">
                  <div><p className="text-slate-500 text-sm">Primary Technology</p><p className="text-white font-medium">{decodedTech}</p></div>
                  {additionalTechnologies.length > 0 && (
                    <div><p className="text-slate-500 text-sm">Additional Technologies</p><div className="flex flex-wrap gap-2 mt-2">{additionalTechnologies.map(tech => (<span key={tech} className="px-3 py-1 rounded-full bg-electric-blue/20 text-electric-blue text-sm">{tech}</span>))}</div></div>
                  )}
                </div>
              </div>

              <div className="border-b border-dark-border pb-6">
                <h2 className="text-xl font-sora font-semibold text-white mb-4 flex items-center gap-2"><FileText size={20} className="text-electric-blue" />Project Details</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div><p className="text-slate-500 text-sm">Project Type</p><p className="text-white font-medium capitalize">{formData.projectType.replace('-', ' ')}</p></div>
                  <div><p className="text-slate-500 text-sm">Timeline</p><p className="text-white font-medium">{formData.timeline}</p></div>
                  <div><p className="text-slate-500 text-sm">Budget</p><p className="text-white font-medium">{budgetValue}</p></div>
                  <div><p className="text-slate-500 text-sm">Contact Method</p><p className="text-white font-medium capitalize">{formData.contactMethod}</p></div>
                </div>
                <div className="mt-4">
                  <p className="text-slate-500 text-sm mb-2">Project Description</p>
                  <div className="bg-dark-card/50 rounded-xl p-4 whitespace-pre-wrap break-words editor-content review-content" style={{ direction: 'ltr' }}>
                    <div dangerouslySetInnerHTML={{ __html: formData.description }} className="prose prose-invert max-w-none" style={{ direction: 'ltr' }} />
                  </div>
                </div>
                {formData.requirements && (
                  <div className="mt-4"><p className="text-slate-500 text-sm">Additional Requirements</p><p className="text-white mt-1 whitespace-pre-wrap break-words">{formData.requirements}</p></div>
                )}
              </div>

              <div className="border-b border-dark-border pb-6">
                <h2 className="text-xl font-sora font-semibold text-white mb-4 flex items-center gap-2"><MessageCircle size={20} className="text-electric-blue" />Contact Information</h2>
                <div><p className="text-slate-500 text-sm">Preferred Contact</p><p className="text-white font-medium">{formData.contactMethod.charAt(0).toUpperCase() + formData.contactMethod.slice(1)}: {formData.contactValue}</p></div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button onClick={handleEdit} className="flex-1 px-6 py-3 rounded-xl border border-dark-border text-slate-400 hover:text-white hover:border-electric-blue transition-all flex items-center justify-center gap-2"><Edit size={18} />Edit Information</button>
              <button onClick={handleSubmit} disabled={loading} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2">{loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}Confirm & Submit</button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-electric-blue to-neon-cyan flex items-center justify-center mx-auto mb-4"><Code2 size={40} className="text-white" /></div>
                <h1 className="text-2xl font-sora font-bold text-white mb-2">{decodedTech}</h1>
                <p className="text-slate-400 text-sm">Primary Technology</p>
              </div>
              <div className="border-t border-dark-border pt-6 mb-6">
                <h3 className="font-sora font-semibold text-white mb-4">Why Choose GrowUp?</h3>
                <div className="space-y-3">
                  {[{ icon: Star, text: '5+ Years of Experience', color: 'text-yellow-500' }, { icon: Users, text: '50+ Expert Developers', color: 'text-electric-blue' }, { icon: Clock, text: '98% On-Time Delivery', color: 'text-neon-green' }, { icon: Shield, text: 'NDA Protected', color: 'text-deep-purple' }].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3"><item.icon size={18} className={item.color} /><span className="text-slate-300 text-sm">{item.text}</span></div>
                  ))}
                </div>
              </div>
              <div className="border-t border-dark-border pt-6">
                <h3 className="font-sora font-semibold text-white mb-4">What We Offer</h3>
                <div className="space-y-3">{['Custom development from scratch', 'Migration to modern tech stack', 'Performance optimization', '24/7 technical support', 'Free consultation and quotes'].map((offer, idx) => (<div key={idx} className="flex items-start gap-2"><CheckCircle size={16} className="text-neon-green flex-shrink-0 mt-0.5" /><span className="text-slate-400 text-sm">{offer}</span></div>))}</div>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-electric-blue/10 to-neon-cyan/10"><p className="text-slate-300 text-sm text-center">⚡ Get a response within 24 hours</p></div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <div className="mb-6"><h2 className="text-2xl font-sora font-bold text-white mb-2">Request a Project with {decodedTech}</h2><p className="text-slate-400">Fill out the form below and our team will get back to you within 24 hours</p></div>

              <form onSubmit={handleReview} className="space-y-6">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Profile Photo (Optional)</label>
                  <div className="flex items-center gap-4">
                    {userPhotoPreview ? (<div className="relative"><img src={userPhotoPreview} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-electric-blue" /><button type="button" onClick={removePhoto} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"><X size={14} className="text-white" /></button></div>) : (<div className="w-20 h-20 rounded-full bg-dark-card border-2 border-dashed border-dark-border flex items-center justify-center"><Camera size={24} className="text-slate-500" /></div>)}
                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-dark-card border border-dark-border hover:border-electric-blue transition-colors flex items-center gap-2"><Upload size={16} />Upload Photo<input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" /></label>
                  </div>
                  {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-slate-300 text-sm font-medium mb-2">Full Name *</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={`w-full px-4 py-2.5 bg-dark-card border ${errors.fullName ? 'border-red-500' : 'border-dark-border'} rounded-xl text-white`} /><p className="text-red-500 text-xs mt-1">{errors.fullName}</p></div>
                  <div><label className="block text-slate-300 text-sm font-medium mb-2">Email Address *</label><input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-2.5 bg-dark-card border ${errors.email ? 'border-red-500' : 'border-dark-border'} rounded-xl text-white`} /><p className="text-red-500 text-xs mt-1">{errors.email}</p></div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-slate-300 text-sm font-medium mb-2">Phone Number *</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`w-full px-4 py-2.5 bg-dark-card border ${errors.phone ? 'border-red-500' : 'border-dark-border'} rounded-xl text-white`} /><p className="text-red-500 text-xs mt-1">{errors.phone}</p></div>
                  <div><label className="block text-slate-300 text-sm font-medium mb-2">Company Name (Optional)</label><input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-white" /></div>
                </div>

                <div><label className="block text-slate-300 text-sm font-medium mb-2">Primary Technology *</label><div className="w-full px-4 py-2.5 bg-dark-card/50 border border-dark-border rounded-xl text-white"><div className="flex items-center gap-2"><Code2 size={16} className="text-electric-blue" /><span>{decodedTech}</span></div></div></div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Additional Technologies (Optional)</label>
                  <div className="relative"><div className="flex gap-2"><input type="text" value={currentTech} onChange={(e) => setCurrentTech(e.target.value)} onKeyPress={handleKeyPress} placeholder="e.g., React, Node.js..." className="flex-1 px-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-white" /><button type="button" onClick={() => addTechnology()} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-electric-blue to-neon-cyan text-white flex items-center gap-2"><Plus size={18} />Add</button></div>
                  {showSuggestions && suggestions.length > 0 && (<div className="absolute z-10 mt-1 w-full bg-dark-card border border-dark-border rounded-xl shadow-lg max-h-48 overflow-y-auto">{suggestions.map((suggestion, idx) => (<button key={idx} type="button" onClick={() => selectSuggestion(suggestion)} className="w-full text-left px-4 py-2 hover:bg-dark-border transition-colors text-slate-300 text-sm flex items-center gap-2"><Code2 size={14} className="text-electric-blue" />{suggestion}</button>))}</div>)}</div>
                  {additionalTechnologies.length > 0 && (<div className="mt-3"><p className="text-slate-400 text-xs mb-2">Added technologies:</p><div className="flex flex-wrap gap-2">{additionalTechnologies.map((tech, index) => (<div key={index} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-electric-blue/20 border border-electric-blue/30 text-electric-blue text-sm"><Layers size={14} /><span>{tech}</span><button type="button" onClick={() => removeTechnology(tech)} className="hover:text-red-400"><X size={14} /></button></div>))}</div></div>)}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-slate-300 text-sm font-medium mb-2">Project Type</label><select name="projectType" value={formData.projectType} onChange={handleChange} className="w-full px-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-white"><option value="new">New Project from Scratch</option><option value="existing">Enhance Existing Project</option><option value="migration">Migration to {decodedTech}</option><option value="consulting">Consulting & Advisory</option><option value="maintenance">Maintenance & Support</option></select></div>
                  <div><label className="block text-slate-300 text-sm font-medium mb-2">Expected Timeline</label><select name="timeline" value={formData.timeline} onChange={handleChange} className="w-full px-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-white"><option value="1-2 weeks">1-2 weeks</option><option value="2-4 weeks">2-4 weeks</option><option value="1-2 months">1-2 months</option><option value="2-3 months">2-3 months</option><option value="3+ months">3+ months</option></select></div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-slate-300 text-sm font-medium mb-2">Budget Range (INR) *</label><select name="budget" value={formData.budget} onChange={handleChange} className="w-full px-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-white">{budgetOptions.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}</select>
                  {formData.budget === 'other' && (<div className="mt-3"><label className="block text-slate-300 text-xs font-medium mb-1">Enter Custom Amount (INR)</label><div className="relative"><IndianRupee size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input type="number" name="customBudget" value={formData.customBudget} onChange={handleChange} className={`w-full pl-10 pr-4 py-2.5 bg-dark-card border ${errors.customBudget ? 'border-red-500' : 'border-dark-border'} rounded-xl text-white`} /></div><p className="text-red-500 text-xs mt-1">{errors.customBudget}</p></div>)}</div>
                  <div><label className="block text-slate-300 text-sm font-medium mb-2">Preferred Contact Method *</label><select name="contactMethod" value={formData.contactMethod} onChange={handleChange} className="w-full px-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-white"><option value="email">📧 Email</option><option value="phone">📞 Phone Call</option><option value="whatsapp">💬 WhatsApp</option><option value="zoom">🎥 Zoom/Video Call</option><option value="linkedin">🔗 LinkedIn</option><option value="telegram">📱 Telegram</option></select></div>
                </div>

                <div><label className="block text-slate-300 text-sm font-medium mb-2">{formData.contactMethod === 'email' ? 'Email Address for Contact *' : formData.contactMethod === 'phone' ? 'Phone Number for Contact *' : formData.contactMethod === 'whatsapp' ? 'WhatsApp Number *' : formData.contactMethod === 'zoom' ? 'Zoom Meeting ID or Link *' : formData.contactMethod === 'linkedin' ? 'LinkedIn Profile URL *' : 'Telegram Username/Number *'}</label><div className="relative"><div className="absolute left-3 top-1/2 -translate-y-1/2">{getContactIcon()}</div><input type={formData.contactMethod === 'email' ? 'email' : 'text'} name="contactValue" value={formData.contactValue} onChange={handleChange} placeholder={getContactPlaceholder()} className={`w-full pl-10 pr-4 py-2.5 bg-dark-card border ${errors.contactValue ? 'border-red-500' : 'border-dark-border'} rounded-xl text-white`} /></div><p className="text-red-500 text-xs mt-1">{errors.contactValue}</p></div>

                {/* Rich Text Editor for Project Description */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Project Description *</label>
                  
                  {/* Formatting Toolbar */}
                  <div className="bg-dark-card border border-dark-border rounded-t-xl p-2 flex flex-wrap gap-1">
                    <button type="button" onClick={() => handleBasicFormat('bold')} className="p-2 rounded hover:bg-dark-border transition-colors" title="Bold"><Bold size={16} /></button>
                    <button type="button" onClick={() => handleBasicFormat('italic')} className="p-2 rounded hover:bg-dark-border transition-colors" title="Italic"><Italic size={16} /></button>
                    <button type="button" onClick={() => handleBasicFormat('underline')} className="p-2 rounded hover:bg-dark-border transition-colors" title="Underline"><Underline size={16} /></button>
                    <div className="w-px h-6 bg-dark-border mx-1"></div>
                    <button type="button" onClick={() => handleAlignment('left')} className="p-2 rounded hover:bg-dark-border transition-colors" title="Align Left"><AlignLeft size={16} /></button>
                    <button type="button" onClick={() => handleAlignment('center')} className="p-2 rounded hover:bg-dark-border transition-colors" title="Align Center"><AlignCenter size={16} /></button>
                    <button type="button" onClick={() => handleAlignment('right')} className="p-2 rounded hover:bg-dark-border transition-colors" title="Align Right"><AlignRight size={16} /></button>
                    <button type="button" onClick={() => handleAlignment('justify')} className="p-2 rounded hover:bg-dark-border transition-colors" title="Justify"><AlignJustify size={16} /></button>
                    <div className="w-px h-6 bg-dark-border mx-1"></div>
                    <button type="button" onClick={handleUnorderedList} className="p-2 rounded hover:bg-dark-border transition-colors" title="Bullet List (•)"><List size={16} /></button>
                    <button type="button" onClick={handleOrderedList} className="p-2 rounded hover:bg-dark-border transition-colors" title="Numbered List (1, 2, 3)"><ListOrdered size={16} /></button>
                    <div className="w-px h-6 bg-dark-border mx-1"></div>
                    <button type="button" onClick={() => handleHeading(1)} className="p-2 rounded hover:bg-dark-border transition-colors" title="Heading 1"><Heading1 size={16} /></button>
                    <button type="button" onClick={() => handleHeading(2)} className="p-2 rounded hover:bg-dark-border transition-colors" title="Heading 2"><Heading2 size={16} /></button>
                    <button type="button" onClick={() => handleHeading(3)} className="p-2 rounded hover:bg-dark-border transition-colors" title="Heading 3"><Heading3 size={16} /></button>
                    <div className="w-px h-6 bg-dark-border mx-1"></div>
                    
                    <select value={fontFamily} onChange={(e) => { setFontFamily(e.target.value); setFontFamilyOnSelection(); }} className="px-2 py-1 bg-dark-card border border-dark-border rounded text-white text-sm">
                      {fontFamilies.map(font => (<option key={font} value={font}>{font}</option>))}
                    </select>
                    
                    <select value={fontSize} onChange={(e) => { setFontSize(e.target.value); setFontSizeOnSelection(); }} className="px-2 py-1 bg-dark-card border border-dark-border rounded text-white text-sm">
                      {fontSizes.map(size => (<option key={size} value={size}>{size}</option>))}
                    </select>
                    
                    <div className="relative group">
                      <button type="button" className="p-2 rounded hover:bg-dark-border transition-colors" title="Text Color" style={{ backgroundColor: textColor }}><Palette size={16} className="text-white" /></button>
                      <div className="absolute top-full left-0 mt-1 p-2 bg-dark-card border border-dark-border rounded-xl shadow-lg hidden group-hover:flex flex-wrap gap-1 z-10 w-48">
                        {colors.map(color => (<button key={color} type="button" onClick={() => setColorOnSelection(color)} className="w-6 h-6 rounded" style={{ backgroundColor: color }} title={color}></button>))}
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <button type="button" className="p-2 rounded hover:bg-dark-border transition-colors" title="Highlight Color"><Highlighter size={16} /></button>
                      <div className="absolute top-full left-0 mt-1 p-2 bg-dark-card border border-dark-border rounded-xl shadow-lg hidden group-hover:flex flex-wrap gap-1 z-10 w-48">
                        {highlightColors.map(color => (<button key={color} type="button" onClick={() => setHighlightOnSelection(color)} className="w-6 h-6 rounded" style={{ backgroundColor: color === 'transparent' ? '#fff' : color, border: '1px solid #333' }} title={color}></button>))}
                      </div>
                    </div>
                    
                    <button type="button" onClick={clearFormattingOnSelection} className="p-2 rounded hover:bg-dark-border transition-colors" title="Clear Formatting"><Eraser size={16} /></button>
                  </div>
                  
                  {/* Rich Text Editor Area */}
                  <div
                    ref={editorRef}
                    contentEditable
                    dir="ltr"
                    suppressContentEditableWarning={true}
                    onInput={handleDescriptionChange}
                    className="w-full min-h-[200px] p-4 bg-dark-card border-x border-b border-dark-border rounded-b-xl text-white focus:outline-none focus:border-electric-blue overflow-y-auto editor-content"
                    style={{ fontFamily, fontSize, lineHeight: '1.6', direction: 'ltr' }}
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                  <p className="text-slate-500 text-xs mt-2">
                    💡 Tip: Select text first to apply formatting. Use • for bullet lists and 1,2,3 for numbered lists.
                  </p>
                </div>

                <div><label className="block text-slate-300 text-sm font-medium mb-2">Additional Requirements (Optional)</label><textarea name="requirements" value={formData.requirements} onChange={handleChange} rows="3" className="w-full px-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-white resize-none" /></div>

                <div className="flex items-start gap-3"><input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="mt-1 w-4 h-4 rounded" /><label className="text-slate-400 text-sm">I agree to the Terms of Service and Privacy Policy.{errors.agreeTerms && <span className="text-red-500 block mt-1">{errors.agreeTerms}</span>}</label></div>

                <button type="submit" className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2"><Eye size={18} />Review & Continue</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TechnologyRequestPage;