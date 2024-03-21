'use client'
import React from "react";

export default class ErrorBoundary extends React.Component {
    constructor(props : any) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, info) {
      // Example "componentStack":
      //   in ComponentThatThrows (created by App)
      //   in ErrorBoundary (created by App)
      //   in div (created by App)
      //   in App
      //logErrorToMyService(error, info.componentStack);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        console.log("Se ejecuto el ErrorBoundary");
        return this.props.fallback;
      }
  
      return this.props.children;
    }
  }