import { Component } from 'react';

// Import icons directly or use simple emoji fallbacks
const AlertTriangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 9v4M12 17h.01"/>
    <path d="M12 2L1 21h22L12 2z"/>
  </svg>
);

class ErrorBoundaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700 mb-6">
              <AlertTriangleIcon />
              <span className="text-xs font-mono text-gray-400">Application Error</span>
            </div>
            <h1 className="text-6xl font-bold text-white mb-4">Oops!</h1>
            <p className="text-gray-400 mb-6">
              Something went wrong. Please try refreshing the page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium text-gray-200 transition-colors"
              >
                Go to Homepage
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-gray-500 text-sm cursor-pointer hover:text-gray-400">
                  Error Details
                </summary>
                <pre className="mt-3 p-3 bg-gray-900 rounded-lg text-red-400 text-xs overflow-auto max-h-64">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundaryClass;