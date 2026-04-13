// Logs questions Nancy couldn't answer to Supabase (collected across all users).

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;
export interface UnknownQuestion {
  id?: string;
  question: string;
  user_category: string;
  user_name: string;
  timestamp?: string;
  reviewed?: boolean;
}

export const UNKNOWN_RESPONSE_SEARCHTEXT =
  "i don't have specific information on that in my database. please consult your healthcare provider.";

export function isUnknownResponse(responseText: string): boolean {
  return responseText.trim().toLowerCase() === UNKNOWN_RESPONSE_SEARCHTEXT;
}

async function logToSupabase(
  question: string,
  userCategory: string,
  userName: string
): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase.from('unknown_questions').insert({
    question,
    user_category: userCategory,
    user_name: userName,
  });

  if (error) {
    console.warn('Supabase log failed:', error.message);
    return false;
  }

  return true;
}

function logToLocalStorage(
  question: string,
  userCategory: string,
  userName: string
): void {
  try {
    const STORAGE_KEY = 'nancy_unknown_questions_fallback';
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    existing.push({
      id: `uq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      question,
      user_category: userCategory,
      user_name: userName,
      timestamp: new Date().toISOString(),
      reviewed: false,
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
  }
}

export async function logUnknownQuestion(
  question: string,
  userCategory: string,
  userName: string
): Promise<void> {
  const savedToSupabase = await logToSupabase(question, userCategory, userName);

  if (!savedToSupabase) {
    logToLocalStorage(question, userCategory, userName);
  }
}

export async function getUnknownQuestions(): Promise<UnknownQuestion[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('unknown_questions')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.warn('Could not fetch unknown questions:', error.message);
    return [];
  }

  return data ?? [];
}

export async function markReviewed(id: string): Promise<void> {
  if (!supabase) return;

  await supabase
    .from('unknown_questions')
    .update({ reviewed: true })
    .eq('id', id);
}