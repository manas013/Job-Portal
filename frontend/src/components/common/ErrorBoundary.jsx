import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[40vh] flex flex-col items-center justify-center p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Something went wrong</h2>
          <p className="text-gray-500 mt-2">Please refresh the page or try again later.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-primary mt-4"
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
