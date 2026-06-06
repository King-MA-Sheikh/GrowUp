import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Shield, Lock, Database, Eye, Cookie, Clock, 
  UserCheck, Mail, Phone, MapPin, ChevronRight, Printer,
  Globe, Server, AlertCircle, CheckCircle, FileText, Scale
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('scope');
  const sectionRefs = useRef({});
  const observerRef = useRef(null);

  const sections = [
    { id: 'scope', title: 'Scope & Application', icon: FileText },
    { id: 'collection', title: 'Data Collection Practices', icon: Database },
    { id: 'usage', title: 'Data Utilization', icon: Eye },
    { id: 'sharing', title: 'Information Disclosure', icon: Globe },
    { id: 'security', title: 'Security Measures', icon: Shield },
    { id: 'cookies', title: 'Tracking Technologies', icon: Cookie },
    { id: 'retention', title: 'Data Retention', icon: Clock },
    { id: 'rights', title: 'Individual Rights', icon: UserCheck },
    { id: 'international', title: 'Cross-Border Transfers', icon: Globe },
    { id: 'updates', title: 'Policy Updates', icon: AlertCircle },
    { id: 'contact', title: 'Contact Information', icon: Mail }
  ];

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observerRef.current.observe(ref);
    });

    return () => observerRef.current.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-900 mb-6">
              <Lock size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Data Protection Commitment</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Effective as of June 1, 2024
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-500">GDPR Compliant</span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
              <span className="text-sm text-gray-500 dark:text-gray-500">ISO 27001 Certified</span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
              <span className="text-sm text-gray-500 dark:text-gray-500">SOC 2 Type II</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Navigation */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="sticky top-28">
                <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                    <h2 className="font-semibold text-gray-900 dark:text-white">Contents</h2>
                  </div>
                  <nav className="p-2 space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                          activeSection === section.id
                            ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <section.icon size={14} />
                          {section.title}
                        </div>
                        <ChevronRight size={14} className={`transition-opacity ${activeSection === section.id ? 'opacity-100' : 'opacity-0'}`} />
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {/* Section 1 - Scope */}
                <section 
                  id="scope" 
                  ref={el => sectionRefs.current['scope'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    1. Scope and Application
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">1.1 Policy Purpose</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        This Privacy Policy ("Policy") governs GrowUp's collection, processing, storage, and disclosure of personal information obtained through our digital platforms, software applications, and professional services. We are committed to protecting your privacy and handling your data in compliance with applicable laws.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">1.2 Scope of Application</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        This Policy applies to all users of GrowUp's Services, including but not limited to individual clients, business entities, employees, interns, students, and educational partners. It governs all information collected through our website, applications, and service delivery processes.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">1.3 Legal Framework</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        GrowUp complies with the Information Technology Act, 2000, and associated rules in India. For users in the European Economic Area, we comply with the General Data Protection Regulation (GDPR). For users in California, we comply with the California Consumer Privacy Act (CCPA).
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 2 - Data Collection */}
                <section 
                  id="collection" 
                  ref={el => sectionRefs.current['collection'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    2. Data Collection Practices
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">2.1 Information You Provide</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                        We collect information you voluntarily provide when:
                      </p>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-400 list-disc pl-5">
                        <li>Creating an account or registering for Services</li>
                        <li>Engaging our professional services</li>
                        <li>Submitting project requirements or inquiries</li>
                        <li>Applying for employment or internship positions</li>
                        <li>Participating in academic programs</li>
                        <li>Communicating with our support team</li>
                        <li>Subscribing to newsletters or marketing communications</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">2.2 Automatically Collected Data</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                        When you access our Services, we automatically collect:
                      </p>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-400 list-disc pl-5">
                        <li>IP addresses and device identifiers</li>
                        <li>Browser type, version, and language preferences</li>
                        <li>Operating system and hardware specifications</li>
                        <li>Pages visited, time stamps, and navigation patterns</li>
                        <li>Referring URLs and exit pages</li>
                        <li>Clickstream data and interaction metrics</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">2.3 Third-Party Sources</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        We may receive information about you from third-party sources, including payment processors, social media platforms (when you connect accounts), business partners, and publicly available databases.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 3 - Data Usage */}
                <section 
                  id="usage" 
                  ref={el => sectionRefs.current['usage'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    3. Data Utilization
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">3.1 Service Delivery</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        We use your information to provide, maintain, and improve our Services, including processing transactions, managing accounts, delivering projects, and providing customer support.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">3.2 Communications</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Your information enables us to communicate important Service announcements, respond to inquiries, provide updates, and deliver requested information.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">3.3 Service Improvement</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        We analyze usage patterns to enhance user experience, optimize performance, develop new features, and conduct research. This analysis may use aggregated, anonymized data.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">3.4 Legal Compliance</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        We process data to comply with legal obligations, enforce our Terms of Service, detect and prevent fraud, and protect the rights and safety of GrowUp and our users.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 4 - Information Sharing */}
                <section 
                  id="sharing" 
                  ref={el => sectionRefs.current['sharing'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    4. Information Disclosure
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">4.1 Service Providers</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        We engage trusted third-party service providers to assist in delivering our Services, including cloud hosting, payment processing, customer support, and analytics. These providers are contractually bound to protect your information and may not use it for any other purpose.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">4.2 Legal Requirements</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        We may disclose your information when required by law, legal process, or governmental request. This includes responding to court orders, subpoenas, and law enforcement inquiries.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">4.3 Business Transfers</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        In the event of a merger, acquisition, reorganization, or asset sale, your information may be transferred to the successor entity. We will notify you of any such change.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">4.4 No Sale of Data</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        GrowUp does not sell your personal information to third parties for monetary or other valuable consideration.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 5 - Security Measures */}
                <section 
                  id="security" 
                  ref={el => sectionRefs.current['security'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    5. Security Measures
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">5.1 Technical Controls</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        We implement industry-standard security controls including encryption (TLS/SSL for data in transit, AES-256 for data at rest), firewalls, intrusion detection systems, and regular security assessments.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">5.2 Organizational Measures</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Access to personal data is restricted to authorized personnel with a legitimate business need. All employees undergo mandatory privacy and security training.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">5.3 Incident Response</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        In the event of a data breach, we will notify affected users and relevant authorities as required by applicable law. Our incident response team will take immediate action to contain and remediate any breach.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 6 - Cookies */}
                <section 
                  id="cookies" 
                  ref={el => sectionRefs.current['cookies'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    6. Tracking Technologies
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">6.1 Cookie Usage</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        We use cookies and similar tracking technologies to enhance user experience, analyze site traffic, and personalize content. Cookies are small text files stored on your device.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">6.2 Cookie Categories</h3>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-400 list-disc pl-5">
                        <li><strong className="text-gray-800 dark:text-gray-300">Essential Cookies:</strong> Required for basic site functionality and security</li>
                        <li><strong className="text-gray-800 dark:text-gray-300">Preference Cookies:</strong> Remember your settings and preferences</li>
                        <li><strong className="text-gray-800 dark:text-gray-300">Analytics Cookies:</strong> Help us understand how users interact with our site</li>
                        <li><strong className="text-gray-800 dark:text-gray-300">Marketing Cookies:</strong> Deliver relevant advertisements and measure campaign effectiveness</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">6.3 User Controls</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        You may manage cookie preferences through your browser settings. Disabling certain cookies may affect site functionality. Most browsers provide instructions on how to block or delete cookies.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 7 - Data Retention */}
                <section 
                  id="retention" 
                  ref={el => sectionRefs.current['retention'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    7. Data Retention
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">7.1 Retention Periods</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        We retain your personal information as long as your account remains active or as necessary to provide Services. Retention periods are determined based on the purpose of collection, legal requirements, and business operational needs.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">7.2 Deletion Procedures</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Upon expiration of retention periods, we securely delete or anonymize your information. You may request earlier deletion, subject to legal obligations.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 8 - Individual Rights */}
                <section 
                  id="rights" 
                  ref={el => sectionRefs.current['rights'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    8. Individual Rights
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">8.1 Access and Portability</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        You have the right to request a copy of your personal data in a structured, commonly used, machine-readable format.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">8.2 Rectification and Erasure</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        You may request correction of inaccurate information or deletion of your data ("right to be forgotten"), subject to legal retention requirements.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">8.3 Processing Restrictions</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        You may request restriction of processing or object to certain processing activities, including direct marketing.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">8.4 Exercising Your Rights</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        To exercise your rights, contact us at privacy@growup.com. We will respond within thirty (30) days. Verification of identity may be required.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 9 - International Transfers */}
                <section 
                  id="international" 
                  ref={el => sectionRefs.current['international'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    9. Cross-Border Data Transfers
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">9.1 Transfer Mechanisms</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Your information may be transferred to and processed in countries with different data protection laws. We implement appropriate safeguards, including Standard Contractual Clauses approved by relevant authorities.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">9.2 Adequacy Decisions</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        For transfers from the European Economic Area, we rely on adequacy decisions where available or implement approved transfer mechanisms.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 10 - Policy Updates */}
                <section 
                  id="updates" 
                  ref={el => sectionRefs.current['updates'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    10. Policy Updates
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">10.1 Modification Rights</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        We may update this Policy to reflect changes in our practices or legal requirements. Material changes will be notified via email or website notice at least thirty (30) days prior to effectiveness.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">10.2 Effective Date</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        The "Effective as of" date indicates when this Policy was last revised. Your continued use of Services after changes constitutes acceptance.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 11 - Contact */}
                <section 
                  id="contact" 
                  ref={el => sectionRefs.current['contact'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    11. Contact Information
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">11.1 Data Protection Officer</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Our Data Protection Officer (DPO) is responsible for overseeing this Policy and can be contacted at:
                      </p>
                      <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <p className="text-gray-800 dark:text-gray-300 font-mono text-sm">Data Protection Officer</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">GrowUp Technologies</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">New Delhi, India</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Email: dpo@growup.com</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">11.2 Privacy Inquiries</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        For general privacy questions or to exercise your rights, contact us at:
                      </p>
                      <div className="mt-3 flex flex-wrap gap-6">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Mail size={14} />
                          <span className="text-sm">privacy@growup.com</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Phone size={14} />
                          <span className="text-sm">+91 11 1234 5678</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <MapPin size={14} />
                          <span className="text-sm">New Delhi, India</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Footer */}
                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    By using GrowUp's Services, you acknowledge that you have read and understood this Privacy Policy.
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
                    © {new Date().getFullYear()} GrowUp Technologies. All rights reserved.
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}