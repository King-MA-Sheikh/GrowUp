import { useState, useEffect } from 'react';
import { 
  Home, RefreshCw, AlertTriangle, WifiOff, 
  Clock, Code2, Mail, Phone, MapPin,
  Search, Compass, Server, ArrowRight
} from 'lucide-react';

const errorTypes = {
  404: {
    code: '404',
    title: 'Page Not Found',
    subtitle: 'The requested page could not be located on our servers.',
    description: 'Please verify the URL or navigate to one of the sections below.',
    icon: Search,
    color: 'from-orange-500 to-red-500'
  },
  500: {
    code: '500',
    title: 'Server Error',
    subtitle: 'An internal server error has occurred.',
    description: 'Our technical team has been notified. Please try again later.',
    icon: Server,
    color: 'from-red-500 to-rose-500'
  },
  offline: {
    code: 'Offline',
    title: 'Connection Lost',
    subtitle: 'Unable to establish a network connection.',
    description: 'Please check your internet connection and refresh the page.',
    icon: WifiOff,
    color: 'from-yellow-500 to-orange-500'
  },
  maintenance: {
    code: 'Maintenance',
    title: 'System Maintenance',
    subtitle: 'Our systems are currently undergoing scheduled maintenance.',
    description: 'We expect to be back online shortly. Thank you for your patience.',
    icon: Clock,
    color: 'from-blue-500 to-cyan-500'
  },
  crash: {
    code: 'Error',
    title: 'Application Error',
    subtitle: 'An unexpected error has occurred.',
    description: 'Our engineering team has been alerted. Please refresh the page.',
    icon: AlertTriangle,
    color: 'from-purple-500 to-pink-500'
  }
};

function GlowingOrb({ color }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        className={`absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r ${color} opacity-[0.03] blur-3xl`}
        style={{ top: '10%', left: '-20%' }}
      />
      <div 
        className={`absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r ${color} opacity-[0.03] blur-3xl`}
        style={{ bottom: '10%', right: '-20%' }}
      />
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick, variant = 'primary' }) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10'
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${variants[variant]}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}

function QuickLink({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 group"
    >
      {label}
      <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}

export default function ErrorPage() {
  const [errorType, setErrorType] = useState('404');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get('type');
    
    if (type && errorTypes[type]) {
      setErrorType(type);
    } else if (path.includes('500') || path.includes('server-error')) {
      setErrorType('500');
    } else if (path.includes('offline')) {
      setErrorType('offline');
    } else if (path.includes('maintenance') || path.includes('under-construction')) {
      setErrorType('maintenance');
    } else if (path.includes('crash')) {
      setErrorType('crash');
    } else {
      setErrorType('404');
    }

    // Log error for analytics
    console.warn(`Error ${type || '404'} at ${path}`);
  }, []);

  useEffect(() => {
    if (errorType === 'offline') {
      const interval = setInterval(() => {
        if (navigator.onLine) {
          window.location.reload();
        }
        setRetryCount(prev => prev + 1);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [errorType]);

  const error = errorTypes[errorType] || errorTypes[404];
  const Icon = error.icon;
  const isDevelopment = import.meta.env.DEV;

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="relative min-h-screen flex items-center justify-center px-6">
        <GlowingOrb color={error.color} />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Error Code */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700 mb-6">
              <Icon size={14} className="text-blue-400" />
              <span className="text-xs font-mono text-gray-400">Error {error.code}</span>
            </div>
            <h1 className="text-8xl md:text-9xl font-bold text-white tracking-tighter">
              {error.code}
            </h1>
          </div>

          {/* Title and Description */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
              {error.title}
            </h2>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              {error.subtitle}
            </p>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              {error.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <ActionButton 
              icon={Home} 
              label="Return Home" 
              onClick={() => handleNavigation('/')}
              variant="primary"
            />
            {(errorType !== 'offline' && errorType !== 'maintenance') && (
              <ActionButton 
                icon={RefreshCw} 
                label="Try Again" 
                onClick={handleRefresh}
                variant="secondary"
              />
            )}
            <ActionButton 
              icon={Compass} 
              label="Browse Services" 
              onClick={() => handleNavigation('/services')}
              variant="secondary"
            />
          </div>

          {/* Quick Links */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
              <QuickLink label="Homepage" onClick={() => handleNavigation('/')} />
              <QuickLink label="Services" onClick={() => handleNavigation('/services')} />
              <QuickLink label="Portfolio" onClick={() => handleNavigation('/portfolio')} />
              <QuickLink label="Contact Support" onClick={() => handleNavigation('/contact')} />
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs">
              Need immediate assistance? Contact our support team at{' '}
              <a href="mailto:support@growup.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                support@growup.com
              </a>
            </p>
            <p className="text-gray-600 text-xs mt-2">
              &copy; {new Date().getFullYear()} GrowUp Technologies. All rights reserved.
            </p>
          </div>

          {/* Development Details (hidden in production) */}
          {isDevelopment && (
            <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <details className="group">
                <summary className="text-gray-500 text-xs cursor-pointer hover:text-gray-400 transition-colors">
                  Debug Information
                </summary>
                <div className="mt-3 space-y-1 text-xs font-mono">
                  <p className="text-gray-600">Path: {window.location.pathname}</p>
                  <p className="text-gray-600">Referrer: {document.referrer || 'Direct'}</p>
                  <p className="text-gray-600">Timestamp: {new Date().toISOString()}</p>
                  <p className="text-gray-600">User Agent: {navigator.userAgent.split(' ').slice(0, 3).join(' ')}</p>
                </div>
              </details>
            </div>
          )}

          {/* Auto-refresh indicator for offline mode */}
          {errorType === 'offline' && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-gray-500 text-xs">
                <div className="w-4 h-4 rounded-full border border-gray-600 border-t-blue-500 animate-spin" />
                <span>Auto-reconnecting in {5 - (retryCount % 5)}s...</span>
              </div>
            </div>
          )}

          {/* Maintenance indicator */}
          {errorType === 'maintenance' && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-gray-500 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>System maintenance in progress</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}