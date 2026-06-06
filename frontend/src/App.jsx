import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceCategoryPage = lazy(() => import('./pages/ServiceCategoryPage'));
const TechnologyRequestPage = lazy(() => import('./pages/TechnologyRequestPage'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const About = lazy(() => import('./pages/About'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const TechnologiesPage = lazy(() => import('./pages/TechnologiesPage'));
const TechnologyDetailPage = lazy(() => import('./pages/TechnologyDetailPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const TeamMemberDetailPage = lazy(() => import('./pages/TeamMemberDetailPage'));
const ConnectManagerPage = lazy(() => import('./pages/ConnectManagerPage'));
const CreateProjectPage = lazy(() => import('./pages/CreateProjectPage'));
const SolveProblemPage = lazy(() => import('./pages/SolveProblemPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const JobDetailPage = lazy(() => import('./pages/JobDetailPage'));
const ApplicationStatusPage = lazy(() => import('./pages/ApplicationStatusPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const UnderConstructionPage = lazy(() => import('./pages/UnderConstructionPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const UpgradePage = lazy(() => import('./pages/UpgradePage'));
const BillingPage = lazy(() => import('./pages/BillingPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

// ScrollToTop component
function ScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [window.location.pathname]);
  return null;
}

function AppContent() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ScrollToTop />
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:categoryId" element={<ServiceCategoryPage />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Technology Routes */}
        <Route path="/technologies" element={<TechnologiesPage />} />
        <Route path="/technologies/:slug" element={<TechnologyDetailPage />} />
        <Route path="/request/:technology" element={<TechnologyRequestPage />} />
        
        {/* Team Routes */}
        <Route path="/team" element={<TeamPage />} />
        <Route path="/team/:slug" element={<TeamMemberDetailPage />} />
        
        {/* Service Routes */}
        <Route path="/connect-manager" element={<ConnectManagerPage />} />
        <Route path="/create-project" element={<CreateProjectPage />} />
        <Route path="/code-solutions" element={<SolveProblemPage />} />
        
        {/* Career Routes */}
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/careers/:slug" element={<JobDetailPage />} />
        <Route path="/application-status/:email?" element={<ApplicationStatusPage />} />
        
        {/* Legal Routes */}
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        
        {/* Utility Pages */}
        <Route path="/under-construction" element={<UnderConstructionPage />} />
        
        {/* 404 Catch-all Route - Must be last */}
        <Route path="*" element={<ErrorPage />} />

        {/* FAQ Page */}
        <Route path="/faq" element={<FAQPage />} />

        {/* Billing Pages */}

        <Route path="/upgrade" element={ <UpgradePage /> } />
        <Route path="/billing" element={ <BillingPage /> } />

        {/* Authentication Pages */}
        <Route path="/signup" element={ <SignUpPage /> } />
        <Route path="/login" element={ <LoginPage /> } />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-dark-bg text-soft-white flex flex-col">
          <Navbar />
          <main className="flex-1 pt-24 pb-32">
            <AppContent />
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1E293B',
                color: '#F8FAFC',
                border: '1px solid #334155',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}