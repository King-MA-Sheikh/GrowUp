import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ChevronDown, ChevronUp, Search, 
  Code2, Cloud, Smartphone, Database, Shield, Users,
  Briefcase, GraduationCap, BookOpen, Clock, DollarSign,
  Mail, Phone, MapPin, MessageCircle, FileText, Scale
} from 'lucide-react';

const faqCategories = [
  { id: 'general', name: 'General', icon: FileText, color: 'from-blue-500 to-cyan-500' },
  { id: 'services', name: 'Services', icon: Code2, color: 'from-emerald-500 to-teal-500' },
  { id: 'clients', name: 'For Clients', icon: Briefcase, color: 'from-purple-500 to-pink-500' },
  { id: 'developers', name: 'For Developers', icon: Users, color: 'from-orange-500 to-red-500' },
  { id: 'students', name: 'For Students', icon: GraduationCap, color: 'from-green-500 to-emerald-500' },
  { id: 'billing', name: 'Billing', icon: DollarSign, color: 'from-yellow-500 to-amber-500' }
];

const faqData = {
  general: [
    {
      q: "What is GrowUp?",
      a: "GrowUp is a technology company that provides custom software development, web and mobile applications, cloud infrastructure, DevOps consulting, AI/ML solutions, and digital transformation services to businesses, startups, and organizations worldwide."
    },
    {
      q: "Where is GrowUp located?",
      a: "Our headquarters is located in New Delhi, India. We operate as a fully remote company with team members distributed across the globe, allowing us to serve clients worldwide."
    },
    {
      q: "What industries do you serve?",
      a: "We serve a diverse range of industries including healthcare, finance, e-commerce, education, logistics, real estate, manufacturing, and technology startups. Our solutions are customized to meet industry-specific requirements."
    },
    {
      q: "How long has GrowUp been in business?",
      a: "GrowUp has been delivering innovative technology solutions for over 3 years, successfully completing 100+ projects for 80+ satisfied clients."
    }
  ],
  services: [
    {
      q: "What services do you offer?",
      a: "We offer comprehensive technology services including web development, mobile app development (iOS & Android), full-stack development, cloud infrastructure (AWS, Azure, GCP), DevOps consulting, AI/ML solutions, blockchain development, UI/UX design, and digital transformation consulting."
    },
    {
      q: "Do you provide post-launch support?",
      a: "Yes, we provide 30 days of free bug fixes and technical support after project completion. Extended maintenance and support plans are also available under separate service level agreements."
    },
    {
      q: "What technologies do you specialize in?",
      a: "Our team specializes in modern technologies including React, Next.js, Vue.js, Angular, Python, Django, Node.js, Java, Spring Boot, Go, Rust, PostgreSQL, MongoDB, Redis, Docker, Kubernetes, AWS, Azure, GCP, TensorFlow, PyTorch, and 3000+ other technologies."
    },
    {
      q: "Do you offer consulting services?",
      a: "Yes, we offer technical consulting services including technology stack assessment, architecture review, performance optimization, security auditing, and digital transformation strategy."
    }
  ],
  clients: [
    {
      q: "How do I start a project with GrowUp?",
      a: "To start a project, simply contact us through our website, schedule a consultation, or fill out the project request form. We'll discuss your requirements, provide a proposal, and upon agreement, begin development."
    },
    {
      q: "What is your development process?",
      a: "We follow an agile development methodology with four phases: Discovery (requirements analysis), Design (UI/UX and architecture), Development (sprint-based coding with regular updates), and Deployment (launch with post-launch support)."
    },
    {
      q: "How do you protect intellectual property?",
      a: "All clients sign a comprehensive Non-Disclosure Agreement (NDA) before project discussions. Upon full payment, all custom code and deliverables become your exclusive property. We take intellectual property protection very seriously."
    },
    {
      q: "Can I see examples of your work?",
      a: "Absolutely! Visit our Portfolio page to see case studies and live projects we've delivered for clients across various industries."
    }
  ],
  developers: [
    {
      q: "How can I join the GrowUp team?",
      a: "Visit our Careers page to view current openings. We're always looking for talented developers, designers, and technology professionals. Submit your application with your resume and portfolio."
    },
    {
      q: "Do you offer remote work?",
      a: "Yes, GrowUp is a fully remote-first company. We welcome talented professionals from anywhere in the world. Our core working hours are 10 AM to 6 PM IST for team collaboration."
    },
    {
      q: "What technologies do you work with?",
      a: "Our tech stack includes modern frameworks and languages like React, Next.js, Vue, Angular, Python, Django, Node.js, Java, Go, Rust, and cloud platforms like AWS, Azure, and GCP."
    },
    {
      q: "Is there room for career growth?",
      a: "Absolutely! We conduct quarterly performance reviews and provide opportunities for skill development, certifications, and career advancement. Top performers are eligible for promotions and leadership roles."
    }
  ],
  students: [
    {
      q: "Do you offer internships?",
      a: "Yes, we offer internship programs for students pursuing degrees in computer science, information technology, and related fields. Internships typically last 3-6 months and provide hands-on experience with real-world projects."
    },
    {
      q: "What do I need to apply for an internship?",
      a: "You need to be enrolled in a degree program, have basic programming knowledge, and submit your resume, academic transcripts, and a portfolio of your projects (if any). A passion for learning is essential."
    },
    {
      q: "Will I receive a certificate after internship?",
      a: "Yes, upon successful completion of the internship program, including project delivery and mentor evaluation, you will receive a certificate of completion and a letter of recommendation."
    },
    {
      q: "Can interns be hired full-time?",
      a: "Top-performing interns may receive offers for full-time employment based on performance, business needs, and position availability."
    }
  ],
  billing: [
    {
      q: "What payment methods do you accept?",
      a: "We accept bank transfers, credit cards (Visa, Mastercard, American Express), PayPal, and Razorpay for Indian clients. All payments are processed through secure, PCI-compliant gateways."
    },
    {
      q: "What is your pricing model?",
      a: "We offer flexible pricing models including fixed-price for well-defined projects, time & materials for evolving requirements, and dedicated team for long-term engagements. Each proposal includes detailed cost breakdown."
    },
    {
      q: "Do you require a deposit?",
      a: "Yes, we require a 50% advance deposit to initiate development. The remaining 50% is due upon project completion and acceptance. Enterprise clients may qualify for customized payment terms."
    },
    {
      q: "What is your refund policy?",
      a: "Refunds are evaluated on a case-by-case basis based on work completed and project specifications. Please refer to our Refund Policy page for detailed information."
    }
  ]
};

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-white pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp size={18} className="text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="p-5 pt-0 bg-gray-50 dark:bg-gray-800/30">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

function CategorySection({ category, data, isActive, onActivate, openItems, onToggleItem }) {
  const Icon = category.icon;
  const isOpen = isActive === category.id;

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => onActivate(isOpen ? null : category.id)}
        className={`w-full flex items-center justify-between p-5 transition-colors ${
          isOpen ? 'bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800' : 'bg-white dark:bg-gray-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
            <Icon size={14} className="text-white" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">{category.name}</span>
          <span className="text-sm text-gray-500 dark:text-gray-500">({data.length})</span>
        </div>
        {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      
      {isOpen && (
        <div className="p-5 space-y-3 bg-gray-50 dark:bg-gray-800/30">
          {data.map((item, idx) => (
            <FAQItem
              key={idx}
              question={item.q}
              answer={item.a}
              isOpen={openItems[`${category.id}-${idx}`]}
              onToggle={() => onToggleItem(`${category.id}-${idx}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCategoryActivate = (categoryId) => {
    setActiveCategory(categoryId);
    // Reset open items when changing category
    setOpenItems({});
  };

  // Filter FAQs based on search term
  const filteredFAQs = () => {
    if (!searchTerm.trim()) return null;
    
    const term = searchTerm.toLowerCase();
    const results = {};
    
    Object.keys(faqData).forEach(category => {
      const filtered = faqData[category].filter(item => 
        item.q.toLowerCase().includes(term) || 
        item.a.toLowerCase().includes(term)
      );
      if (filtered.length > 0) {
        results[category] = filtered;
      }
    });
    
    return results;
  };

  const searchResults = filteredFAQs();
  const hasSearchResults = searchResults && Object.keys(searchResults).length > 0;

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <MessageCircle size={14} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Support Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Frequently Asked <span className="text-blue-600 dark:text-blue-400">Questions</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Find answers to common questions about our services, process, and policies
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
          />
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Search Results ({Object.keys(searchResults || {}).reduce((acc, cat) => acc + searchResults[cat].length, 0)})
            </h2>
            {hasSearchResults ? (
              <div className="space-y-4">
                {Object.entries(searchResults).map(([category, items]) => (
                  <div key={category} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                      <h3 className="font-medium text-gray-900 dark:text-white capitalize">{category}</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {items.map((item, idx) => (
                        <div key={idx} className="border-b border-gray-100 dark:border-gray-800 last:border-0 pb-3 last:pb-0">
                          <p className="font-medium text-gray-900 dark:text-white mb-1">{item.q}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                <p className="text-gray-500 dark:text-gray-400">No results found for "{searchTerm}"</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try different keywords or browse categories below</p>
              </div>
            )}
          </div>
        )}

        {/* FAQ Categories */}
        {!searchTerm && (
          <div className="space-y-4">
            {faqCategories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                data={faqData[category.id]}
                isActive={activeCategory}
                onActivate={handleCategoryActivate}
                openItems={openItems}
                onToggleItem={toggleItem}
              />
            ))}
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Still have questions?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:support@growup.com" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Mail size={16} />
              Email Support
            </a>
            <Link to="/contact" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              <MessageCircle size={16} />
              Contact Form
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors inline-flex items-center gap-1 text-sm">
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}