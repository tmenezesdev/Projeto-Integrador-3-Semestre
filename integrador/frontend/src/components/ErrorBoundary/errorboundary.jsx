'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-[#09090A]">
          <div className="text-center">
            <AlertCircle className="text-red-400 w-12 h-12 mx-auto mb-4" />
            <p className="text-white font-semibold text-lg mb-2">Algo deu errado</p>
            <p className="text-slate-500 text-sm mb-4">Ocorreu um erro inesperado na interface.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="flex items-center gap-2 mx-auto text-xs text-slate-400 border border-slate-700/50 px-4 py-2 rounded-lg hover:border-slate-600 transition-colors cursor-pointer"
            >
              <RefreshCw size={13} /> Tentar novamente
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
