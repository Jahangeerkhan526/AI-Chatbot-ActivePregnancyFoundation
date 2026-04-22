// src/components/ChatInterface.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getGeminiResponse, ChatMessage, UserCategory } from '../services/geminiService';
import { logUnknownQuestion, isUnknownResponse } from '../services/unknownQuestionsLogger';
import {
  PREGNANCY_SCREENING_QUESTIONS,
  POSTNATAL_SCREENING_QUESTIONS,
  ScreeningQuestion,
} from '../../data/screeningQuestions';

// ── TYPES ──────────────────────────────────────────────────────────────────
type OnboardingStep =
  | 'ask_name'
  | 'ask_category'
  | 'ask_other_detail'
  | 'screening'
  | 'chat';

interface UserProfile {
  name: string;
  category: UserCategory;
  otherDetail: string;
  screeningComplete: boolean;
  screeningFlaggedYes: boolean;
}

interface DisplayMessage {
  id: string;
  role: 'user' | 'nancy';
  text: string;
  showQuickReplies?: QuickReply[];
  showYesNo?: boolean;
}

interface QuickReply {
  value: string;
  label: string;
}

// ── CONSTANTS ──────────────────────────────────────────────────────────────
const CATEGORY_OPTIONS: QuickReply[] = [
  { value: 'preconception', label: '🌱 Thinking of becoming pregnant' },
  { value: 'pregnant',      label: '🤰 Currently pregnant' },
  { value: 'postnatal',     label: '👶 Recently had a baby' },
  { value: 'professional',  label: '🩺 Healthcare / fitness professional' },
  { value: 'supporter',     label: '💛 Partner, parent, or friend' },
  { value: 'other',         label: "✏️ Other — I'll describe my situation" },
];

const CATEGORY_LABELS: Record<NonNullable<UserCategory>, string> = {
  preconception: '🌱 Thinking of becoming pregnant',
  pregnant:      '🤰 Currently pregnant',
  postnatal:     '👶 Recently had a baby',
  professional:  '🩺 Healthcare / fitness professional',
  supporter:     '💛 Partner, parent, or friend',
  other:         '✏️ Other',
};

function makeId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function nancyMsg(text: string, extras: Partial<DisplayMessage> = {}): DisplayMessage {
  return { id: makeId(), role: 'nancy', text, ...extras };
}

function userMsg(text: string): DisplayMessage {
  return { id: makeId(), role: 'user', text };
}

// ── NANCY AVATAR — uses real APF logo from public/ ─────────────────────────
const NancyAvatar: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => {
  const dim = size === 'md' ? 'w-10 h-10' : 'w-6 h-6';
  const imgSize = size === 'md' ? 'h-8' : 'h-4';
  return (
    <div className={`${dim} bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0 border border-purple-100`}>
      <img
        src="/apf-logo.png"
        alt="Nancy"
        className={`${imgSize} w-auto object-contain`}
      />
    </div>
  );
};

// ── YES / NO / NOT SURE BUTTONS ────────────────────────────────────────────
const YesNoButtons: React.FC<{ onSelect: (v: string) => void }> = ({ onSelect }) => (
  <div className="flex gap-2 mt-3 flex-wrap">
    <button
      onClick={() => onSelect('Yes')}
      className="px-6 py-2 rounded-full text-sm font-semibold bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100 active:scale-95 transition-all"
    >
      Yes
    </button>
    <button
      onClick={() => onSelect('No')}
      className="px-6 py-2 rounded-full text-sm font-semibold bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100 active:scale-95 transition-all"
    >
      No
    </button>
    <button
      onClick={() => onSelect("I'm not sure")}
      className="px-6 py-2 rounded-full text-sm font-semibold bg-amber-50 border border-amber-300 text-amber-700 hover:bg-amber-100 active:scale-95 transition-all"
    >
      Not sure
    </button>
  </div>
);

// ── CATEGORY QUICK REPLIES ─────────────────────────────────────────────────
const QuickReplies: React.FC<{ options: QuickReply[]; onSelect: (v: string) => void }> = ({
  options,
  onSelect,
}) => (
  <div className="flex flex-wrap gap-2 mt-3">
    {options.map(opt => (
      <button
        key={opt.value}
        onClick={() => onSelect(opt.value)}
        className="px-4 py-2 text-sm bg-purple-50 border border-purple-200 text-purple-800 rounded-full hover:bg-purple-100 active:scale-95 transition-all"
      >
        {opt.label}
      </button>
    ))}
  </div>
);

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
export const ChatInterface: React.FC = () => {
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('ask_name');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    category: null,
    otherDetail: '',
    screeningComplete: false,
    screeningFlaggedYes: false,
  });

  const [screeningQuestions, setScreeningQuestions] = useState<ScreeningQuestion[]>([]);
  const [screeningIndex, setScreeningIndex] = useState(0);
  const [geminiHistory, setGeminiHistory] = useState<ChatMessage[]>([]);

  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([
    nancyMsg(
      "Hi there! 👋 I'm Nancy, your friendly guide from the Active Pregnancy Foundation.\n\nI'm here to help with information about staying active before, during, and after pregnancy.\n\nFirst things first, what's your name?"
    ),
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categoryChosen, setCategoryChosen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayMessages, isLoading]);

  const addMessage = useCallback((msg: DisplayMessage) => {
    setDisplayMessages(prev => [...prev, msg]);
  }, []);

  // ── FINISH SCREENING ─────────────────────────────────────────────────────
  const finishScreening = useCallback(
    (flagged: boolean, name: string, category: UserCategory) => {
      setUserProfile(prev => ({ ...prev, screeningComplete: true }));
      setOnboardingStep('chat');

      const flagNote = flagged
        ? 'Just remember to check in with your GP or midwife about the things we flagged. '
        : '';
      const categoryLine =
        category === 'pregnant'
          ? "you're all set to explore safe activity during your pregnancy"
          : "you're all set to explore getting back to activity after your baby";

      setTimeout(() => {
        addMessage(
          nancyMsg(
            `That's all the health questions done — well done for getting through them, ${name}! 🎉\n\n${flagNote}It sounds like ${categoryLine}. What would you like to know?`
          )
        );
      }, 400);
    },
    [addMessage]
  );

  // ── SCREENING ANSWER HANDLER ─────────────────────────────────────────────
  const handleScreeningAnswer = useCallback(
    (
      answer: string,
      currentIndex: number,
      currentProfile: UserProfile,
      questions: ScreeningQuestion[]
    ) => {
      addMessage(userMsg(answer));

      const question = questions[currentIndex];
      const isYes =
        answer.toLowerCase().startsWith('yes') ||
        answer.toLowerCase().includes('not sure');

      if (isYes && question.yesAction === 'refer_immediately') {
        setUserProfile(prev => ({ ...prev, screeningFlaggedYes: true, screeningComplete: true }));
        setOnboardingStep('chat');
        setTimeout(() => {
          addMessage(
            nancyMsg(
              `Thank you for being so honest with me, ${currentProfile.name} 💛\n\nBecause of what you've shared, I'd really encourage you to speak with your **GP or midwife before starting or increasing physical activity** — they're the best people to make sure you're safe.\n\nI've made a note of this. Is there anything else I can help you with in the meantime?`
            )
          );
        }, 400);
        return;
      }

      const nextIndex = currentIndex + 1;

      if (isYes && question.yesAction === 'refer_and_continue') {
        setUserProfile(prev => ({ ...prev, screeningFlaggedYes: true }));
        setTimeout(() => {
          if (nextIndex < questions.length) {
            setScreeningIndex(nextIndex);
            addMessage(
              nancyMsg(
                `Thanks for letting me know — I'd recommend mentioning that to your GP or midwife. 💛\n\n${questions[nextIndex].text}`,
                { showYesNo: true }
              )
            );
          } else {
            finishScreening(true, currentProfile.name, currentProfile.category);
          }
        }, 400);
        return;
      }

      // note_and_continue or No — just move on
      setTimeout(() => {
        if (nextIndex < questions.length) {
          setScreeningIndex(nextIndex);
          addMessage(nancyMsg(questions[nextIndex].text, { showYesNo: true }));
        } else {
          finishScreening(
            currentProfile.screeningFlaggedYes,
            currentProfile.name,
            currentProfile.category
          );
        }
      }, 400);
    },
    [addMessage, finishScreening]
  );

  // ── CATEGORY SELECT HANDLER ──────────────────────────────────────────────
  const handleCategorySelect = useCallback(
    (value: string, name: string) => {
      const category = value as NonNullable<UserCategory>;
      const label = CATEGORY_OPTIONS.find(o => o.value === value)?.label ?? value;

      addMessage(userMsg(label));
      setCategoryChosen(true);

      const updatedProfile: UserProfile = {
        name,
        category,
        otherDetail: '',
        screeningComplete: false,
        screeningFlaggedYes: false,
      };
      setUserProfile(updatedProfile);

      if (category === 'other') {
        setOnboardingStep('ask_other_detail');
        setTimeout(() => {
          addMessage(
            nancyMsg(
              `No problem at all, ${name}! 😊 Could you briefly describe your situation so I can try to help you as best I can?`
            )
          );
        }, 400);
        return;
      }

      if (
        category === 'preconception' ||
        category === 'professional' ||
        category === 'supporter'
      ) {
        const intros: Record<string, string> = {
          preconception: `Wonderful, ${name}! Thinking about having a baby is such an exciting time. 🌱\n\nBeing active before pregnancy can make a real difference — both for you and your future baby. What would you like to know?`,
          professional: `Great to have you here! 🩺 As a professional supporting pregnant or postnatal women, you might also want to explore the **This Mum Moves** educational programme at activepregnancyfoundation.org/thismummoves — it's packed with evidence-based resources.\n\nWhat can I help you with today?`,
          supporter: `How lovely that you're here to support someone! 💛 Physical activity can make a big difference to how a pregnant or postnatal person feels — and your encouragement matters more than you know.\n\nWhat would you like to find out?`,
        };
        setOnboardingStep('chat');
        setTimeout(() => addMessage(nancyMsg(intros[category])), 400);
        return;
      }

      // Pregnant or postnatal → start screening
      const questions =
        category === 'pregnant'
          ? PREGNANCY_SCREENING_QUESTIONS
          : POSTNATAL_SCREENING_QUESTIONS;

      setScreeningQuestions(questions);
      setScreeningIndex(0);
      setOnboardingStep('screening');

      setTimeout(() => {
        addMessage(nancyMsg(questions[0].text, { showYesNo: true }));
      }, 400);
    },
    [addMessage]
  );

  // ── TEXT INPUT SEND HANDLER ──────────────────────────────────────────────
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput('');

    // Step 1: collect name
    if (onboardingStep === 'ask_name') {
      const raw = trimmed
        .replace(/^(i'?m|my name is|call me|i am)\s+/i, '')
        .trim();
      const name = raw.charAt(0).toUpperCase() + raw.slice(1);
      setUserProfile(prev => ({ ...prev, name }));
      addMessage(userMsg(trimmed));
      setOnboardingStep('ask_category');
      setTimeout(() => {
        addMessage(
          nancyMsg(
            `Lovely to meet you, ${name}! 😊\n\nTo make sure I give you the most relevant information, could you tell me a bit about your situation?`,
            { showQuickReplies: CATEGORY_OPTIONS }
          )
        );
      }, 400);
      return;
    }

    // Step 2: "other" detail
    if (onboardingStep === 'ask_other_detail') {
      setUserProfile(prev => ({ ...prev, otherDetail: trimmed }));
      addMessage(userMsg(trimmed));
      setOnboardingStep('chat');
      setTimeout(() => {
        addMessage(
          nancyMsg(
            `Thank you for sharing that, ${userProfile.name}! I'll do my best to help based on APF resources. What's your question?`
          )
        );
      }, 400);
      return;
    }

    // Free chat
    if (onboardingStep === 'chat') {
      addMessage(userMsg(trimmed));
      setIsLoading(true);

      const newHistory: ChatMessage[] = [
        ...geminiHistory,
        { role: 'user', text: trimmed },
      ];
      setGeminiHistory(newHistory);

      const response = await getGeminiResponse(
        newHistory,
        userProfile.name,
        userProfile.category
      );

      if (isUnknownResponse(response)) {
        logUnknownQuestion(
          trimmed,
          userProfile.category ?? 'unknown',
          userProfile.name
        );
      }

      setGeminiHistory(prev => [...prev, { role: 'model', text: response }]);
      addMessage(nancyMsg(response));
      setIsLoading(false);
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────────────
  const showTextInput =
    onboardingStep !== 'ask_category' && onboardingStep !== 'screening';

  return (
    <div className="flex flex-col h-[75vh] bg-white rounded-3xl shadow-xl border border-purple-100 overflow-hidden">

      {/* Chat header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-purple-50 flex-shrink-0">
        <NancyAvatar size="md" />
        <div>
          <p className="font-bold text-slate-800 text-sm leading-tight">Nancy</p>
          <p className="text-[10px] text-purple-500 font-semibold uppercase tracking-widest">
            Active Pregnancy Foundation
          </p>
        </div>
        {userProfile.category && (
          <span className="ml-auto text-[10px] bg-purple-50 text-purple-600 px-3 py-1 rounded-full font-semibold border border-purple-100 whitespace-nowrap">
            {CATEGORY_LABELS[userProfile.category]}
          </span>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40"
      >
        {displayMessages.map((msg, i) => {
          const isLatest = i === displayMessages.length - 1;

          return (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-[85%]">

                {/* Nancy label row */}
                {msg.role === 'nancy' && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <NancyAvatar size="sm" />
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                      Nancy
                    </span>
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-none shadow-md'
                      : 'bg-white text-slate-800 border border-purple-50 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text.split('\n').map((line, idx) => (
                    <p
                      key={idx}
                      className={idx > 0 ? 'mt-2' : ''}
                      dangerouslySetInnerHTML={{
                        __html: line.replace(
                          /\*\*(.+?)\*\*/g,
                          '<strong>$1</strong>'
                        ),
                      }}
                    />
                  ))}
                </div>

                {/* Category quick replies — only on latest message, only if not yet chosen */}
                {msg.role === 'nancy' &&
                  msg.showQuickReplies &&
                  isLatest &&
                  !categoryChosen && (
                    <QuickReplies
                      options={msg.showQuickReplies}
                      onSelect={val => handleCategorySelect(val, userProfile.name)}
                    />
                  )}

                {/* Yes/No buttons — only on latest screening message */}
                {msg.role === 'nancy' &&
                  msg.showYesNo &&
                  isLatest &&
                  onboardingStep === 'screening' && (
                    <YesNoButtons
                      onSelect={val =>
                        handleScreeningAnswer(
                          val,
                          screeningIndex,
                          userProfile,
                          screeningQuestions
                        )
                      }
                    />
                  )}

              </div>
            </div>
          );
        })}

        {/* Loading dots */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2">
              <NancyAvatar size="sm" />
              <div className="bg-white border border-purple-50 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 ml-2">
                <div className="flex gap-1">
                  {[0, 200, 400].map(delay => (
                    <div
                      key={delay}
                      className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Nancy is thinking
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Text input — hidden during category selection and screening */}
      {showTextInput && (
        <div className="p-4 bg-white border-t border-purple-50 flex-shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={
                onboardingStep === 'ask_name'
                  ? 'Type your name...'
                  : onboardingStep === 'ask_other_detail'
                  ? 'Describe your situation...'
                  : 'Ask Nancy anything...'
              }
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-slate-100 rounded-2xl text-sm text-slate-800 focus:ring-2 focus:ring-purple-400 outline-none transition-all disabled:opacity-40"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-11 h-11 bg-purple-600 text-white rounded-2xl flex items-center justify-center shadow-md hover:bg-purple-700 active:scale-90 transition-all disabled:opacity-30"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
            Always follow clinical advice from your GP or midwife.
          </p>
        </div>
      )}

      {/* Hint shown during category selection and screening */}
      {!showTextInput && (
        <div className="p-4 bg-white border-t border-purple-50 flex-shrink-0">
          <p className="text-[11px] text-center text-slate-400 font-medium">
            {onboardingStep === 'ask_category'
              ? '👆 Tap an option above to continue'
              : '👆 Use the buttons above to answer'}
          </p>
        </div>
      )}

    </div>
  );
};