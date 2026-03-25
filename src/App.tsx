import React, { useState } from 'react';
import { ChatInterface } from './components/ChatInterface';
// import { DatasetView } from './components/DatasetView';
// import { RecommendationsView } from './components/RecommendationsView';
import { ScreeningTool } from './components/ScreeningTool';

type Tab = 'chat' | 'screening'; //'roadmap';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">

      {/* Header */}
      <header className="bg-white border-b border-purple-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <span className="text-xl">🤰</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                APF Safety Assistant
              </h1>
              <p className="text-[10px] text-purple-600 uppercase font-black tracking-widest">Grounded Dataset Engine</p>
            </div>
          </div>

          <nav className="hidden md:flex bg-slate-100 p-1 rounded-xl gap-1">
            {(['chat', 'screening'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">

        {/* Mobile Nav */}
        <div className="md:hidden mb-6 flex bg-slate-100 p-1 rounded-xl">
          {(['chat', 'screening'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                activeTab === tab
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="animate-fade-in">
          {activeTab === 'chat' && <ChatInterface />}
          {activeTab === 'screening' && <ScreeningTool />}
          {/* {activeTab === 'dataset' && <DatasetView />} */}
          {/* {activeTab === 'roadmap' && <RecommendationsView />} */}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <span className="text-lg">🛡️</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Pregnancy Foundation Verified Data</span>
          </div>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">GAQ-P v2024 • Prototype v1.0</span>
        </div>
      </footer>

    </div>
  );
};

export default App;