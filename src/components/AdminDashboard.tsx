import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Question {
  id: string;
  question: string;
  user_name: string;
  category: string;
  created_at: string;
  reviewed: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  pregnant:      'bg-purple-100 text-purple-700',
  postnatal:     'bg-pink-100 text-pink-700',
  preconception: 'bg-blue-100 text-blue-700',
  professional:  'bg-green-100 text-green-700',
  supporter:     'bg-orange-100 text-orange-700',
  other:         'bg-slate-100 text-slate-700',
};

export const AdminDashboard: React.FC = () => {
  const [questions, setQuestions]   = useState<Question[]>([]);
  const [loading,   setLoading]     = useState(true);
  const [filter,    setFilter]      = useState<'all' | 'pending' | 'reviewed'>('all');
  const [category,  setCategory]    = useState('all');
  const [search,    setSearch]      = useState('');
  const [password,  setPassword]    = useState('');
  const [authed,    setAuthed]      = useState(false);
  const [authError, setAuthError]   = useState('');

  const ADMIN_PASSWORD = 'Nancy2025!';

  // ── Auth ──────────────────────────────────────────────────────────────────
  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password. Please try again.');
    }
  }

  // ── Fetch data ─────────────────────────────────────────────────────────────
  async function fetchQuestions() {
    setLoading(true);
    const { data, error } = await supabase
      .from('unknown_questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
    } else {
      setQuestions(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (authed) fetchQuestions();
  }, [authed]);

  // ── Mark reviewed ──────────────────────────────────────────────────────────
  async function toggleReviewed(id: string, current: boolean) {
    await supabase
      .from('unknown_questions')
      .update({ reviewed: !current })
      .eq('id', id);
    setQuestions(prev =>
      prev.map(q => q.id === id ? { ...q, reviewed: !current } : q)
    );
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function deleteQuestion(id: string) {
    await supabase.from('unknown_questions').delete().eq('id', id);
    setQuestions(prev => prev.filter(q => q.id !== id));
  }

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = questions.filter(q => {
    if (filter === 'pending'  && q.reviewed)  return false;
    if (filter === 'reviewed' && !q.reviewed) return false;
    if (category !== 'all' && q.user_category
 !== category) return false;
    if (search && !q.question.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total:    questions.length,
    pending:  questions.filter(q => !q.reviewed).length,
    reviewed: questions.filter(q =>  q.reviewed).length,
    categories: [...new Set(questions.map(q => q.user_category).filter(Boolean))],
  };

  // ── LOGIN SCREEN ───────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#F3F0EA] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🛡️</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">APF Nancy — Unanswered Questions</p>
          </div>

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-400 mb-3"
          />
          {authError && (
            <p className="text-xs text-red-500 mb-3">{authError}</p>
          )}
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all text-sm"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F3F0EA] p-4 md:p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-sm text-slate-500">APF Nancy — Unanswered Questions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchQuestions}
            className="px-4 py-2 text-sm font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-all"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => setAuthed(false)}
            className="px-4 py-2 text-sm font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
          <p className="text-3xl font-black text-slate-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Pending</p>
          <p className="text-3xl font-black text-amber-500">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-1">Reviewed</p>
          <p className="text-3xl font-black text-green-500">{stats.reviewed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 flex flex-wrap gap-3">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="flex-1 min-w-[200px] px-4 py-2 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-400"
        />

        {/* Status filter */}
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {(['all', 'pending', 'reviewed'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                filter === f ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500'
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 outline-none"
        >
          <option value="all">All categories</option>
          {stats.categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Questions table */}
      {loading ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <div className="flex justify-center gap-1 mb-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.15s]"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.3s]"></div>
          </div>
          <p className="text-sm text-slate-400">Loading questions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <p className="text-2xl mb-2">🎉</p>
          <p className="text-sm font-bold text-slate-600">No questions found</p>
          <p className="text-xs text-slate-400 mt-1">
            {questions.length === 0 ? 'Nancy has answered everything so far!' : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(q => (
            <div key={q.id}
              className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 transition-all ${
                q.reviewed ? 'border-green-400 opacity-70' : 'border-amber-400'
              }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 mb-2">{q.question}</p>
                  <div className="flex flex-wrap gap-2">
                    {q.user_name && (
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        👤 {q.user_name}
                      </span>
                    )}
                    {q.user_category && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${CATEGORY_COLORS[q.user_category] || 'bg-slate-100 text-slate-600'}`}>
                        {q.user_category}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      🕐 {new Date(q.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleReviewed(q.id, q.reviewed)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      q.reviewed
                        ? 'bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-600'
                        : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                    }`}>
                    {q.reviewed ? '↩ Unmark' : '✅ Reviewed'}
                  </button>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all">
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <p className="text-center text-xs text-slate-400 mt-8">
        APF Nancy Admin • {filtered.length} of {questions.length} questions shown
      </p>
    </div>
  );
};
