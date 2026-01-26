import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fbf9f4',
                    fontFamily: 'sans-serif'
                }}>
                    <h1 style={{ color: '#4b3621', marginBottom: '20px' }}>Something went wrong.</h1>
                    <p style={{ color: '#5d6d7e', marginBottom: '30px', maxWidth: '500px' }}>
                        We're sorry, but the application encountered an unexpected error.
                    </p>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#4b3621',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Return to Dashboard
                    </button>

                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details style={{ marginTop: '40px', textAlign: 'left', whiteSpace: 'pre-wrap', color: 'red' }}>
                            <summary>Error Details</summary>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
