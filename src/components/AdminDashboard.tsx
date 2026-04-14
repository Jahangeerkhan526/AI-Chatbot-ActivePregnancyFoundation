import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Question {
  id: string;
  question: string;
  user_name: string;
  user_category: string;
  timestamp: string;
  reviewed: boolean;
}

const ADMIN_PASSWORD = 'Nancy2025!';

const CAT_STYLE: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  pregnant:      { bg: 'bg-violet-50',  text: 'text-violet-700',  dot: 'bg-violet-400',  label: '🤰 Pregnant' },
  postnatal:     { bg: 'bg-pink-50',    text: 'text-pink-700',    dot: 'bg-pink-400',    label: '👶 Postnatal' },
  preconception: { bg: 'bg-sky-50',     text: 'text-sky-700',     dot: 'bg-sky-400',     label: '💭 Preconception' },
  professional:  { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400', label: '👩‍⚕️ Professional' },
  supporter:     { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400',   label: '🤝 Supporter' },
  other:         { bg: 'bg-slate-50',   text: 'text-slate-600',   dot: 'bg-slate-400',   label: '💬 Other' },
};

const getCat = (cat: string) => CAT_STYLE[cat] ?? CAT_STYLE['other'];

// ── LOGIN ──────────────────────────────────────────────────────────────────────
const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [pw, setPw]       = useState('');
  const [err, setErr]     = useState('');
  const [shake, setShake] = useState(false);

  function attempt() {
    if (pw === ADMIN_PASSWORD) { onLogin(); }
    else {
      setErr('Incorrect password');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div className="min-h-screen bg-[#081544] flex items-center justify-center p-4">
      <div className={`w-full max-w-sm ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg mb-4">
            <span className="text-3xl">🌸</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Nancy Admin</h1>
          <p className="text-sm text-slate-400 mt-1">Active Pregnancy Foundation</p>
        </div>
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Admin Password</label>
          <input
            type="password" value={pw}
            onChange={e => { setPw(e.target.value); setErr(''); }}
            onKeyDown={e => e.key === 'Enter' && attempt()}
            placeholder="Enter password"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-slate-500 outline-none focus:border-violet-400 transition-all mb-3"
          />
          {err && <p className="text-xs text-red-400 mb-3">⚠️ {err}</p>}
          <button onClick={attempt}
            className="w-full py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-xl hover:opacity-90 transition-all text-sm">
            Sign In →
          </button>
        </div>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
    </div>
  );
};

// ── MODAL ──────────────────────────────────────────────────────────────────────
const QuestionModal: React.FC<{
  question: Question;
  onClose: () => void;
  onToggleReviewed: (q: Question) => void;
  onDelete: (id: string) => void;
}> = ({ question: q, onClose, onToggleReviewed, onDelete }) => {
  const cs = getCat(q.user_category);

  const fmtDate = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      + ' at ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${cs.bg} ${cs.text}`}>
              {cs.label}
            </span>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
              q.reviewed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
              {q.reviewed ? '✅ Reviewed' : '⏳ Pending'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-all text-lg"
          >
            ✕
          </button>
        </div>

        {/* Question */}
        <div className="px-6 py-5">
          <div className="bg-slate-50 rounded-2xl p-4 mb-5">
            <p className="text-slate-800 text-sm leading-relaxed font-medium">
              "{q.question}"
            </p>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 font-medium mb-1">User</p>
              <p className="text-sm font-bold text-slate-700">{q.user_name || '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 font-medium mb-1">Category</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cs.bg} ${cs.text}`}>
                {cs.label}
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 col-span-2">
              <p className="text-xs text-slate-400 font-medium mb-1">Asked on</p>
              <p className="text-sm font-bold text-slate-700">{fmtDate(q.timestamp)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => { onToggleReviewed(q); onClose(); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                q.reviewed
                  ? 'bg-amber-50 text-amber-600 border-2 border-amber-200 hover:bg-amber-100'
                  : 'bg-emerald-50 text-emerald-600 border-2 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {q.reviewed ? '↩ Mark as Pending' : '✅ Mark as Reviewed'}
            </button>
            <button
              onClick={() => { onDelete(q.id); onClose(); }}
              className="px-5 py-3 rounded-xl text-sm font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-all"
            >
              🗑 Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── MAIN DASHBOARD ─────────────────────────────────────────────────────────────
export const AdminDashboard: React.FC = () => {
  const [authed,    setAuthed]    = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState<'all' | 'pending' | 'reviewed'>('all');
  const [catFilter, setCatFilter] = useState('all');
  const [search,    setSearch]    = useState('');
  const [selected,  setSelected]  = useState<Question | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('unknown_questions')
      .select('*')
      .order('timestamp', { ascending: false });
    setQuestions(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { if (authed) load(); }, [authed, load]);

  async function toggleReviewed(q: Question) {
    await supabase.from('unknown_questions').update({ reviewed: !q.reviewed }).eq('id', q.id);
    setQuestions(prev => prev.map(x => x.id === q.id ? { ...x, reviewed: !x.reviewed } : x));
  }

  async function deleteQ(id: string) {
    await supabase.from('unknown_questions').delete().eq('id', id);
    setQuestions(prev => prev.filter(x => x.id !== id));
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const total    = questions.length;
  const pending  = questions.filter(q => !q.reviewed).length;
  const reviewed = questions.filter(q =>  q.reviewed).length;

  const catCounts = questions.reduce((acc, q) => {
    const c = q.user_category || 'other';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filtered = questions.filter(q => {
    if (tab === 'pending'  &&  q.reviewed) return false;
    if (tab === 'reviewed' && !q.reviewed) return false;
    if (catFilter !== 'all' && q.user_category !== catFilter) return false;
    if (search && !q.question.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const fmtDate = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      + ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] font-sans flex">

      {/* Modal */}
      {selected && (
        <QuestionModal
          question={selected}
          onClose={() => setSelected(null)}
          onToggleReviewed={toggleReviewed}
          onDelete={deleteQ}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className="hidden lg:flex w-56 bg-[#081544] flex-col fixed left-0 top-0 h-full z-20">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-lg">🌸</div>
            <div>
              <p className="text-white font-bold text-sm">Nancy</p>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { key: 'all',      icon: '📋', label: 'All Questions', count: total },
            { key: 'pending',  icon: '⏳', label: 'Pending',       count: pending },
            { key: 'reviewed', icon: '✅', label: 'Reviewed',      count: reviewed },
          ].map(item => (
            <button key={item.key} onClick={() => setTab(item.key as typeof tab)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === item.key ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}>
              <span className="flex items-center gap-2.5"><span>{item.icon}</span><span>{item.label}</span></span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tab === item.key ? 'bg-white/20' : 'bg-white/10 text-slate-400'}`}>{item.count}</span>
            </button>
          ))}

          {Object.keys(catCounts).length > 0 && (
            <>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 pt-4 pb-1">By Category</p>
              {Object.entries(catCounts).map(([cat, count]) => {
                const cs = getCat(cat);
                return (
                  <button key={cat} onClick={() => setCatFilter(catFilter === cat ? 'all' : cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      catFilter === cat ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}>
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${cs.dot}`}></span>
                      <span className="capitalize">{cat}</span>
                    </span>
                    <span className="text-slate-500">{count}</span>
                  </button>
                );
              })}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={() => setAuthed(false)}
            className="w-full py-2 text-xs font-bold text-slate-500 hover:text-white transition-colors">
            ← Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN — full width now, no right panel ── */}
      <div className="lg:ml-56 flex-1 flex flex-col min-h-screen">

        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Unanswered Questions</h1>
            <p className="text-xs text-slate-400">
              {pending > 0 ? `${pending} question${pending !== 1 ? 's' : ''} need attention` : 'All caught up ✅'}
            </p>
          </div>
          <button onClick={load} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all">
            🔄 Refresh
          </button>
        </header>

        <div className="p-6">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total',    value: total,    color: 'text-slate-800'   },
              { label: 'Pending',  value: pending,  color: 'text-amber-500'   },
              { label: 'Reviewed', value: reviewed, color: 'text-emerald-500' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Category chips */}
          {Object.keys(catCounts).length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Filter by Category</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(catCounts).map(([cat, count]) => {
                  const cs = getCat(cat);
                  return (
                    <button key={cat} onClick={() => setCatFilter(catFilter === cat ? 'all' : cat)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        catFilter === cat ? `${cs.bg} ${cs.text} border-current` : 'bg-slate-50 text-slate-500 border-transparent hover:border-slate-200'
                      }`}>
                      <span className={`w-2 h-2 rounded-full ${cs.dot}`}></span>
                      {cs.label} · {count}
                    </button>
                  );
                })}
                {catFilter !== 'all' && (
                  <button onClick={() => setCatFilter('all')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all">
                    ✕ Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Search + mobile tabs */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 transition-all" />
            </div>
            <div className="lg:hidden flex bg-white border border-slate-200 p-1 rounded-xl gap-1">
              {(['all', 'pending', 'reviewed'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${tab === t ? 'bg-violet-600 text-white' : 'text-slate-500'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Questions — full width, click to open modal */}
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 animate-pulse border border-slate-100">
                  <div className="h-4 bg-slate-100 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
              <p className="text-4xl mb-3">🎉</p>
              <p className="font-bold text-slate-700">{questions.length === 0 ? 'No questions logged yet' : 'Nothing matches'}</p>
              <p className="text-sm text-slate-400 mt-1">{questions.length === 0 ? 'Nancy has answered everything!' : 'Try adjusting filters'}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(q => {
                const cs = getCat(q.user_category);
                return (
                  <div key={q.id}
                    onClick={() => setSelected(q)}
                    className={`bg-white rounded-2xl p-4 border cursor-pointer transition-all hover:shadow-md hover:border-violet-200 group ${
                      q.reviewed ? 'border-slate-100 opacity-60' : 'border-slate-100'
                    }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 leading-snug mb-2 group-hover:text-violet-700 transition-colors">
                          {q.question}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          {q.user_name && <span className="text-xs text-slate-500">👤 {q.user_name}</span>}
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${cs.bg} ${cs.text}`}>{cs.label}</span>
                          <span className="text-[11px] text-slate-400">{fmtDate(q.timestamp)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${q.reviewed ? 'text-emerald-500 bg-emerald-50' : 'text-amber-500 bg-amber-50'}`}>
                          {q.reviewed ? '✅ Done' : '⏳ Pending'}
                        </span>
                        <span className="text-slate-300 group-hover:text-violet-400 transition-colors text-sm">→</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
