import React, { createContext, useContext, useState } from 'react';
import Timer from './component/Timer';
import './App.css'
// Create a context for error management
const ErrorContext = createContext();

// Custom hook for consuming error context
export const useError = () => {
    return useContext(ErrorContext);
};

// Error boundary component for catching rendering errors
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMessage: '' };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, errorMessage: error.message };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Rendering error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h2>Something went wrong: {this.state.errorMessage}</h2>;
        }
        return this.props.children;
    }
}

function App() {
    const [globalError, setGlobalError] = useState(null);

    return (
        <ErrorContext.Provider value={{ globalError, setGlobalError }}>
            <ErrorBoundary>
                <div className="App">
                    {globalError && <p className="global-error">{globalError}</p>}
                    <Timer />
                </div>
            </ErrorBoundary>
        </ErrorContext.Provider>
    );
}

export default App;
