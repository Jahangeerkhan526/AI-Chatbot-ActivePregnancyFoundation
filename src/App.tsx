// src/App.tsx
import React from 'react';
import { ChatInterface } from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-purple-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Real APF logo from public/apf-logo.png */}
            <img
              src="/apf-logo.png"
              alt="Active Pregnancy Foundation"
              className="h-10 w-auto object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Nancy</h1>
              <p className="text-[10px] text-purple-500 uppercase font-black tracking-widest">
                Active Pregnancy Foundation
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              Evidence-based • Safe • Friendly
            </span>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        <ChatInterface />
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-slate-100 py-6">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 opacity-50">
            <img
              src="/apf-logo.png"
              alt="Active Pregnancy Foundation"
              className="h-6 w-auto object-contain grayscale"
            />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Active Pregnancy Foundation Verified Data
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            GAQ-P v2024 • Nancy v2.0
          </span>
        </div>
      </footer>

    </div>
  );
};

export default App;