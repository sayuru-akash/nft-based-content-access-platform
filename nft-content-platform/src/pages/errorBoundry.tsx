import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import React from "react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    const { hasError } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      return (
        <>
          <Navbar />
          <div className="bg-purple-50 min-h-[100vh] flex object-center justify-center">
            <div className="text-black text-center">{fallback}</div>
          </div>
          <Footer />
        </>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
