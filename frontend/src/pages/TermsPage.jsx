import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Shield, Scale, Briefcase, Users, GraduationCap, 
  BookOpen, Lock, FileCheck, Clock, Mail, Phone, MapPin,
  ChevronRight, Printer, FileText, AlertCircle, CheckCircle
} from 'lucide-react';

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const sectionRefs = useRef({});
  const observerRef = useRef(null);

  const sections = [
    { id: 'general', title: 'General Provisions', icon: Scale },
    { id: 'clients', title: 'Client Services', icon: Briefcase },
    { id: 'employees', title: 'Employment Terms', icon: Users },
    { id: 'students', title: 'Academic Programs', icon: GraduationCap },
    { id: 'educators', title: 'Educational Partners', icon: BookOpen },
    { id: 'privacy', title: 'Data Privacy', icon: Lock },
    { id: 'liability', title: 'Limitations of Liability', icon: Shield },
    { id: 'dispute', title: 'Dispute Resolution', icon: FileCheck },
    { id: 'amendments', title: 'Policy Amendments', icon: Clock }
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
              <Scale size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Legal Agreement</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Effective as of June 1, 2024
            </p>
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
                {/* Section 1 - General Provisions */}
                <section 
                  id="general" 
                  ref={el => sectionRefs.current['general'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    Section 1. General Provisions
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">1.1 Acceptance of Terms</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        By accessing or utilizing GrowUp's digital platforms, software applications, and professional services (collectively referred to as the "Services"), you acknowledge that you have read, comprehended, and agree to be bound by these Terms of Service ("Agreement"). Should you disagree with any provision herein, you must refrain from using our Services.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">1.2 Scope of Services</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        GrowUp provides comprehensive technology solutions including, but not limited to, software development, cloud infrastructure management, DevOps consulting, artificial intelligence integration, and digital transformation services. Detailed specifications for each engagement shall be documented in separate Statements of Work (SOW).
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">1.3 User Obligations</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        You agree to provide accurate, current, and complete information during registration and to maintain the confidentiality of your account credentials. You are solely responsible for all activities conducted through your account and must immediately notify GrowUp of any unauthorized access or security breach.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">1.4 Prohibited Conduct</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Users expressly agree not to: (a) violate any applicable laws or regulations; (b) infringe upon intellectual property rights; (c) distribute malicious code or attempt unauthorized access; (d) interfere with Service integrity or performance; (e) engage in data mining or scraping without explicit authorization; or (f) impersonate any individual or entity.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 2 - Client Services */}
                <section 
                  id="clients" 
                  ref={el => sectionRefs.current['clients'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    Section 2. Client Services
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">2.1 Engagement Commencement</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Project initiation requires execution of a Statement of Work (SOW) detailing scope, deliverables, timelines, and pricing. A non-refundable deposit of fifty percent (50%) of the total project fee is required prior to commencement of any development activities.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">2.2 Intellectual Property Rights</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Upon final payment in full, all custom-developed code, designs, and deliverables specifically created for the Client shall become the exclusive property of the Client. GrowUp retains ownership of its pre-existing intellectual property, including proprietary frameworks, libraries, and methodologies.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">2.3 Payment Terms</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Invoices are payable within fifteen (15) calendar days of receipt. Late payments shall accrue interest at one and one-half percent (1.5%) per month or the maximum legal rate, whichever is lower. GrowUp reserves the right to suspend Services for accounts with outstanding balances exceeding thirty (30) days.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">2.4 Delivery and Acceptance</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Deliverables shall be deemed accepted fourteen (14) days following delivery unless Client provides written notice of non-conformance. Each milestone includes up to three (3) revision cycles. Additional revisions shall be billed at standard hourly rates.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">2.5 Confidentiality Obligations</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Both parties agree to maintain strict confidentiality regarding all proprietary information disclosed during the engagement. This obligation survives termination of this Agreement for a period of five (5) years.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">2.6 Warranty and Support</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        GrowUp warrants that Services will conform to specifications for thirty (30) days following acceptance. During this warranty period, we will remedy any defects at no additional cost. Extended support and maintenance are available under separate service level agreements.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 3 - Employment Terms */}
                <section 
                  id="employees" 
                  ref={el => sectionRefs.current['employees'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    Section 3. Employment Terms
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">3.1 At-Will Employment</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Employment with GrowUp is at-will, meaning either party may terminate the relationship at any time, with or without cause or notice. This relationship cannot be modified except by a written agreement signed by an authorized corporate officer.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">3.2 Code of Conduct</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Employees must adhere to the highest standards of professional conduct. Harassment, discrimination, retaliation, or any form of unprofessional behavior constitutes grounds for immediate termination. All employees must comply with applicable laws, regulations, and company policies.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">3.3 Work Hours and Remote Work</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Core working hours are 10:00 to 18:00 Indian Standard Time, Monday through Friday. Remote work requires a secure, dedicated workspace with reliable internet connectivity. Employees must be accessible during core hours unless alternative arrangements are approved.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">3.4 Intellectual Property Assignment</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Any work product, inventions, or intellectual property created during employment shall be the sole property of GrowUp. Employees agree to execute all documents necessary to perfect this assignment.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">3.5 Post-Employment Restrictions</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        For twelve (12) months following termination, former employees agree not to work with direct competitors or solicit GrowUp clients, employees, or contractors. Confidential information remains protected indefinitely.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 4 - Academic Programs */}
                <section 
                  id="students" 
                  ref={el => sectionRefs.current['students'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    Section 4. Academic Programs
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">4.1 Internship Framework</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Internships are structured educational programs designed to provide practical experience. The standard duration is three (3) to six (6) months, with flexible scheduling to accommodate academic commitments.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">4.2 Mentorship Structure</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Each intern receives dedicated mentorship from an experienced professional. Weekly progress reviews and performance evaluations ensure learning objectives are met.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">4.3 Academic Integrity</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Interns must complete all assigned work independently. Plagiarism or unauthorized collaboration constitutes a violation of academic integrity and may result in immediate termination.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">4.4 Certification Requirements</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Certificates of completion are awarded upon successful fulfillment of all program requirements, including project delivery, mentor evaluations, and professional conduct standards.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 5 - Educational Partners */}
                <section 
                  id="educators" 
                  ref={el => sectionRefs.current['educators'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    Section 5. Educational Partners
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">5.1 Partnership Framework</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        GrowUp partners with accredited educational institutions to deliver industry-relevant curriculum and internship opportunities. Specific terms are documented in a Memorandum of Understanding (MOU).
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">5.2 Curriculum Licensing</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Licensed curriculum materials are provided for educational use only. Institutions may not redistribute, resell, or sublicense materials without explicit written consent.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">5.3 Assessment Standards</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Partner institutions must adhere to provided assessment rubrics. Assessment data must be shared quarterly for program evaluation purposes.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 6 - Data Privacy */}
                <section 
                  id="privacy" 
                  ref={el => sectionRefs.current['privacy'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    Section 6. Data Privacy
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">6.1 Information Collection</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        GrowUp collects information necessary to provide Services, including identification data, contact information, payment details, and usage analytics. All collection practices comply with applicable data protection regulations.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">6.2 Data Usage</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Information is used exclusively for Service delivery, account management, communication, improvement of offerings, and legal compliance. Personal data is not sold to third parties.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">6.3 Security Measures</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Industry-standard security controls are implemented, including encryption, access restrictions, regular audits, and employee training. Despite these measures, no system is completely invulnerable.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">6.4 User Rights</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Users may access, correct, or request deletion of their personal data. Such requests should be directed to privacy@growup.com and will be processed within thirty (30) days.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 7 - Liability */}
                <section 
                  id="liability" 
                  ref={el => sectionRefs.current['liability'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    Section 7. Limitations of Liability
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">7.1 Warranty Disclaimer</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">7.2 Liability Cap</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, GROWUP'S TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID FOR SERVICES IN THE PRECEDING TWELVE (12) MONTHS. GROWUP SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">7.3 Indemnification</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Users agree to indemnify and hold GrowUp harmless from any claims, damages, or expenses arising from their use of Services or violation of these Terms.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">7.4 Force Majeure</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Neither party shall be liable for delays or failures caused by circumstances beyond reasonable control, including natural disasters, war, terrorism, labor disputes, or internet outages.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 8 - Dispute Resolution */}
                <section 
                  id="dispute" 
                  ref={el => sectionRefs.current['dispute'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    Section 8. Dispute Resolution
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">8.1 Governing Law</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        These Terms shall be governed by and construed in accordance with the laws of India. Any legal action or proceeding shall be brought exclusively in courts located in New Delhi, India.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">8.2 Arbitration</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Disputes not resolved informally shall be submitted to binding arbitration in New Delhi, India. Arbitration shall be conducted in English by a single arbitrator mutually agreed upon by both parties.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">8.3 Class Action Waiver</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        USERS AGREE TO RESOLVE DISPUTES ON AN INDIVIDUAL BASIS AND WAIVE THE RIGHT TO PARTICIPATE IN CLASS ACTIONS OR REPRESENTATIVE PROCEEDINGS OF ANY KIND.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 9 - Amendments */}
                <section 
                  id="amendments" 
                  ref={el => sectionRefs.current['amendments'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    Section 9. Policy Amendments
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">9.1 Modification Rights</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        GrowUp reserves the right to modify these Terms at any time. Material changes will be communicated via email or website notice at least thirty (30) days prior to effectiveness.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">9.2 Continued Use</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Continued use of Services following effective date of modifications constitutes acceptance of revised Terms. Users who disagree with modifications must discontinue Service use.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">9.3 Severability</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        If any provision of these Terms is found unenforceable, the remaining provisions shall remain in full force and effect.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Contact Information */}
                <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                      <Mail size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Legal Correspondence</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        For legal notices or questions regarding these Terms:
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">legal@growup.com</span>
                        <span className="text-gray-400 dark:text-gray-600">|</span>
                        <span className="text-gray-600 dark:text-gray-400">New Delhi, India</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acknowledgment */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    By accessing or using GrowUp's Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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