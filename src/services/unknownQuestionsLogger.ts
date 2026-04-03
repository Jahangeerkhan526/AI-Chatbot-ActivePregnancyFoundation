// src/services/unknownQuestionsLogger.ts
// Logs questions Nancy couldn't answer to localStorage.
// No backend required. A future admin view (or CSV export) can read this store.

export interface UnknownQuestion {
  id: string;
  question: string;
  userCategory: string;
  userName: string;
  timestamp: string;
  reviewed: boolean;
}

const STORAGE_KEY = 'nancy_unknown_questions';

// ── READ ───────────────────────────────────────────────────────────────────
export function getUnknownQuestions(): UnknownQuestion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ── WRITE ──────────────────────────────────────────────────────────────────
export function logUnknownQuestion(
  question: string,
  userCategory: string,
  userName: string
): void {
  try {
    const existing = getUnknownQuestions();
    const entry: UnknownQuestion = {
      id: `uq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      question,
      userCategory,
      userName,
      timestamp: new Date().toISOString(),
      reviewed: false,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, entry]));
  } catch (err) {
    // localStorage can be unavailable in private browsing — fail silently
    console.warn('Could not log unknown question:', err);
  }
}

// ── EXPORT AS CSV (utility for future admin use) ───────────────────────────
export function exportUnknownQuestionsCSV(): string {
  const questions = getUnknownQuestions();
  if (questions.length === 0) return '';

  const headers = ['id', 'timestamp', 'userName', 'userCategory', 'question', 'reviewed'];
  const rows = questions.map(q =>
    headers.map(h => `"${String(q[h as keyof UnknownQuestion]).replace(/"/g, '""')}"`).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

// ── DETECT if Gemini signalled it couldn't answer ─────────────────────────
// Gemini returns this specific phrase when context is insufficient (per SYSTEM_INSTRUCTION).
// We key off it to decide whether to log.
export function isUnknownResponse(responseText: string): boolean {
  return responseText
    .toLowerCase()
    .includes("i don't have specific information on that in my database");
}