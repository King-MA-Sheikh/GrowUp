import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Shield, Scale, DollarSign, Clock, FileText,
  Mail, Phone, MapPin, ChevronRight, Printer, AlertCircle,
  CheckCircle, CreditCard, Receipt, Calendar, UserCheck,
  HelpCircle, TrendingDown, Wallet, RefreshCw, XCircle
} from 'lucide-react';

export default function RefundPolicyPage() {
  const [activeSection, setActiveSection] = useState('scope');
  const sectionRefs = useRef({});
  const observerRef = useRef(null);

  const sections = [
    { id: 'scope', title: 'Policy Scope', icon: FileText },
    { id: 'eligibility', title: 'Eligibility Criteria', icon: CheckCircle },
    { id: 'timeline', title: 'Refund Timeline', icon: Clock },
    { id: 'process', title: 'Refund Process', icon: RefreshCw },
    { id: 'exclusions', title: 'Non-Refundable Items', icon: XCircle },
    { id: 'disputes', title: 'Billing Disputes', icon: AlertCircle },
    { id: 'cancellation', title: 'Service Cancellation', icon: Calendar },
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
              <RefreshCw size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Financial Policy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Refund Policy
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Effective as of June 1, 2024
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-500">Last Updated: June 1, 2024</span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
              <span className="text-sm text-gray-500 dark:text-gray-500">Version 2.0</span>
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
                {/* Section 1 - Policy Scope */}
                <section 
                  id="scope" 
                  ref={el => sectionRefs.current['scope'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    1. Policy Scope and Application
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">1.1 Purpose</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        This Refund Policy ("Policy") governs all refund requests for payments made to GrowUp for professional services, software development projects, consulting engagements, and any other products or services offered through our platform.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">1.2 Scope of Application</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        This Policy applies to all clients, customers, and users who have made payments to GrowUp. It supersedes any prior refund policies or representations unless explicitly modified in writing by an authorized GrowUp representative.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">1.3 Good Faith Commitment</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        GrowUp is committed to delivering high-quality services and ensuring client satisfaction. We will work diligently to resolve any issues before refunds are considered. This policy is designed to balance client protection with operational fairness.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 2 - Eligibility Criteria */}
                <section 
                  id="eligibility" 
                  ref={el => sectionRefs.current['eligibility'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    2. Refund Eligibility Criteria
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">2.1 Eligible Circumstances</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                        Refunds may be issued in the following circumstances:
                      </p>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-400 list-disc pl-5">
                        <li>Non-delivery of agreed-upon deliverables within specified timeline</li>
                        <li>Material deviation from approved specifications or requirements</li>
                        <li>Technical defects that cannot be remediated within reasonable timeframe</li>
                        <li>Duplicative payments or billing errors</li>
                        <li>Cancellation within statutory cooling-off period (where applicable)</li>
                        <li>Unauthorized transactions on your account</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">2.2 Partial Refunds</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Partial refunds may be issued for work completed but not meeting specifications, or for partial cancellation of services. The refund amount will be prorated based on work completed, expenses incurred, and non-cancellable commitments.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">2.3 Eligibility Period</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Refund requests must be submitted within fourteen (14) calendar days of the payment date or project milestone completion date, whichever is later. Requests received after this period will be evaluated on a case-by-case basis.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 3 - Refund Timeline */}
                <section 
                  id="timeline" 
                  ref={el => sectionRefs.current['timeline'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    3. Refund Processing Timeline
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">3.1 Initial Assessment</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        GrowUp will acknowledge receipt of your refund request within two (2) business days. A designated customer service representative will be assigned to investigate your claim.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">3.2 Investigation Period</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        We will complete our investigation within ten (10) business days of receiving a complete refund request, including all required supporting documentation. Complex cases may require up to fifteen (15) business days.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">3.3 Payment Processing</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Approved refunds will be processed within five (5) business days of approval notification. Actual receipt of funds depends on your financial institution's processing times, typically three (3) to seven (7) business days.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">3.4 Method of Refund</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Refunds will be issued using the original payment method whenever possible. If that method is unavailable, we will coordinate an alternative arrangement with you.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 4 - Refund Process */}
                <section 
                  id="process" 
                  ref={el => sectionRefs.current['process'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    4. Refund Request Process
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">4.1 Submission Requirements</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                        To initiate a refund request, you must provide:
                      </p>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-400 list-disc pl-5">
                        <li>Your full name and contact information</li>
                        <li>Invoice number and payment date</li>
                        <li>Detailed reason for refund request</li>
                        <li>Supporting documentation (e.g., screenshots, correspondence)</li>
                        <li>Preferred resolution (full refund, partial refund, account credit)</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">4.2 Submission Channels</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Refund requests may be submitted through:
                      </p>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-400 list-disc pl-5 mt-2">
                        <li>Email: refunds@growup.com</li>
                        <li>Customer Support Portal: support.growup.com</li>
                        <li>Written correspondence to our registered address</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">4.3 Required Documentation</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        To expedite processing, please include any relevant documentation such as email correspondence, project specifications, delivery receipts, or evidence of the issue prompting the refund request.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">4.4 Refund Determination</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Refund determinations will be based on the terms of your specific agreement, the nature of the issue, and our investigation findings. We will provide written explanation for approved or denied requests.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 5 - Non-Refundable Items */}
                <section 
                  id="exclusions" 
                  ref={el => sectionRefs.current['exclusions'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    5. Non-Refundable Items and Services
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">5.1 Non-Refundable Services</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                        The following are generally non-refundable:
                      </p>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-400 list-disc pl-5">
                        <li>Initial consultation and discovery fees (where separately charged)</li>
                        <li>Third-party software licenses, API access fees, and subscription costs</li>
                        <li>Domain registration and SSL certificate purchases</li>
                        <li>Server setup and configuration fees</li>
                        <li>Fees for work already performed and delivered for acceptance</li>
                        <li>Expedited service or rush processing fees</li>
                        <li>Fixed-price contracts where deliverables have been accepted</li>
                        <li>Deposits or advance payments for services not yet scheduled</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">5.2 Restocking and Administrative Fees</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Administrative fees of up to ten percent (10%) of the refund amount may be deducted to cover processing costs. These fees will be disclosed before refund processing.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 6 - Billing Disputes */}
                <section 
                  id="disputes" 
                  ref={el => sectionRefs.current['disputes'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    6. Billing Disputes
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">6.1 Notification Requirements</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        You must notify GrowUp of any billing discrepancies within thirty (30) days of the invoice date. Failure to notify within this period constitutes acceptance of the charges and waiver of dispute rights.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">6.2 Dispute Resolution Process</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Billing disputes will be resolved through our customer service team. If resolution cannot be reached, either party may pursue remedies available under applicable law.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">6.3 Chargeback Policy</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        If you initiate a chargeback with your financial institution, GrowUp reserves the right to suspend your account until the matter is resolved. We will present evidence of service delivery to dispute unwarranted chargebacks.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 7 - Service Cancellation */}
                <section 
                  id="cancellation" 
                  ref={el => sectionRefs.current['cancellation'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    7. Service Cancellation
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">7.1 Client-Initiated Cancellation</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        You may cancel ongoing services with thirty (30) days written notice. Refunds for prepaid but unearned fees will be prorated and issued, minus any applicable cancellation fees or non-refundable commitments.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">7.2 GrowUp-Initiated Cancellation</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        GrowUp may cancel services for breach of terms, non-payment, or other material violations. In such cases, no refund will be issued for unearned fees.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">7.3 Mutual Cancellation</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Mutual cancellation agreements will specify refund amounts, if any, based on work completed and expenses incurred through the cancellation date.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 8 - Contact Information */}
                <section 
                  id="contact" 
                  ref={el => sectionRefs.current['contact'] = el}
                  className="scroll-mt-24 mb-12"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                    8. Contact Information
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">8.1 Refund Processing</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        For refund-related inquiries or to submit a request, please contact our financial services team:
                      </p>
                      <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <p className="text-gray-800 dark:text-gray-300 font-mono text-sm">Refund Processing Department</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">GrowUp Technologies</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">New Delhi, India</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Email: refunds@growup.com</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Phone: +91 11 1234 5678</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">8.2 Escalation Path</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        If you are unsatisfied with the resolution of your refund request, you may escalate to:
                      </p>
                      <div className="mt-3">
                        <p className="text-gray-700 dark:text-gray-300 text-sm">Customer Service Manager: support@growup.com</p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">Chief Financial Officer: cfo@growup.com</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Additional Legal Information */}
                <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                      <Scale size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Legal Notice</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        This Refund Policy is governed by the laws of India. Any disputes arising under this Policy shall be subject to the exclusive jurisdiction of courts in New Delhi, India. GrowUp reserves the right to modify this Policy at any time, with changes effective upon posting to our website.
                      </p>
                      <p className="text-gray-500 dark:text-gray-500 text-xs">
                        Last Updated: June 1, 2024 | Version 2.0
                      </p>
                    </div>
                  </div>
                </div>

                {/* Acknowledgment */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    By making payments to GrowUp, you acknowledge that you have read, understood, and agree to be bound by this Refund Policy.
                  </p>
                </div>

                {/* Back to Home */}
                <div className="mt-8 text-center">
                  <Link to="/" className="text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors inline-flex items-center gap-1">
                    <ArrowLeft size={14} />
                    Return to Home
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}