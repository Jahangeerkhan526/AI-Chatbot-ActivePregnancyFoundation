import React, { useState } from 'react';
import { APF_Q_DATASET } from '../constants/apfData';

export const ScreeningTool: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [showResult, setShowResult] = useState(false);

  const questions = APF_Q_DATASET.filter(d => d.id.startsWith('GAQP'));
  
  const handleAnswer = (id: string, value: boolean) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const calculateResult = () => {
    const hasYes = Object.values(answers).some(v => v === true);
    const allAnswered = questions.length === Object.keys(answers).length;
    
    if (!allAnswered) {
      alert("Please answer all questions to see your recommendation.");
      return;
    }

    setShowResult(true);
  };

  const hasYes = Object.values(answers).some(v => v === true);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl border border-purple-50 p-8">
        <div className="mb-8 border-b border-purple-50 pb-6">
          <h2 className="text-3xl font-bold text-slate-800">GAQ-P Digital Screening</h2>
          <p className="text-slate-500 mt-2">Get Active Questionnaire for Pregnancy (UK Version)</p>
          <div className="mt-4 p-4 bg-purple-50 rounded-xl text-xs text-purple-700 leading-relaxed">
            <strong>Note:</strong> Physical activity during pregnancy has many health benefits, but for some conditions, it is not recommended without medical consultation.
          </div>
        </div>

        <div className="space-y-6">
          {/* Question Groups */}
          <section className="space-y-4">
             <h3 className="text-sm font-black uppercase tracking-widest text-purple-600">Section 1: Current Pregnancy</h3>
             {questions.filter(q => q.id.startsWith('GAQP-01')).map((q) => (
               <div key={q.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <p className="text-sm text-slate-700 flex-1">{q.content}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAnswer(q.id, true)}
                      className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${answers[q.id] === true ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                    >
                      YES
                    </button>
                    <button 
                      onClick={() => handleAnswer(q.id, false)}
                      className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${answers[q.id] === false ? 'bg-slate-800 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                    >
                      NO
                    </button>
                  </div>
               </div>
             ))}
          </section>

          <section className="space-y-4 pt-6 border-t border-purple-50">
             <h3 className="text-sm font-black uppercase tracking-widest text-purple-600">Section 2: Previous Pregnancies</h3>
             {questions.filter(q => q.id.startsWith('GAQP-02')).map((q) => (
               <div key={q.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <p className="text-sm text-slate-700 flex-1">{q.content}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleAnswer(q.id, true)} className={`px-6 py-2 rounded-xl text-xs font-bold ${answers[q.id] === true ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}>YES</button>
                    <button onClick={() => handleAnswer(q.id, false)} className={`px-6 py-2 rounded-xl text-xs font-bold ${answers[q.id] === false ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'}`}>NO</button>
                  </div>
               </div>
             ))}
          </section>

          <section className="space-y-4 pt-6 border-t border-purple-50">
             <h3 className="text-sm font-black uppercase tracking-widest text-purple-600">Section 3: Other Conditions</h3>
             {questions.filter(q => q.id === 'GAQP-03' || q.id === 'GAQP-04').map((q) => (
               <div key={q.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <p className="text-sm text-slate-700 flex-1">{q.content}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleAnswer(q.id, true)} className={`px-6 py-2 rounded-xl text-xs font-bold ${answers[q.id] === true ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}>YES</button>
                    <button onClick={() => handleAnswer(q.id, false)} className={`px-6 py-2 rounded-xl text-xs font-bold ${answers[q.id] === false ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'}`}>NO</button>
                  </div>
               </div>
             ))}
          </section>
        </div>

        <div className="mt-12 flex justify-center">
          <button 
            onClick={calculateResult}
            className="px-12 py-4 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-purple-700 transition-all active:scale-95"
          >
            Generate Recommendation
          </button>
        </div>
      </div>

      {showResult && (
        <div className="animate-slide-up">
          {hasYes ? (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">⚠️</span>
                <h3 className="text-xl font-bold text-amber-900">Medical Consultation Recommended</h3>
              </div>
              <p className="text-amber-800 text-sm leading-relaxed">
                You answered <strong>YES</strong> to one or more questions. You should speak with a healthcare professional (GP or midwife) before beginning or continuing physical activity.
              </p>
              <div className="mt-6 bg-white p-4 rounded-xl border border-amber-100">
                <p className="text-xs font-bold text-amber-700 uppercase mb-2">Next Steps:</p>
                <ul className="text-xs text-amber-800 space-y-2 list-disc list-inside">
                  <li>Download the "Healthcare Professional Consultation Form for Prenatal Physical Activity".</li>
                  <li>Schedule an appointment with your GP or midwife.</li>
                  <li>Do not engage in vigorous activity until cleared by a professional.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">✅</span>
                <h3 className="text-xl font-bold text-emerald-900">Physical Activity is Recommended</h3>
              </div>
              <p className="text-emerald-800 text-sm leading-relaxed">
                You answered <strong>NO</strong> to all screening questions. You are cleared to proceed with physical activity according to the UK Chief Medical Officers' guidelines.
              </p>
              <div className="mt-6 bg-white p-4 rounded-xl border border-emerald-100">
                <p className="text-xs font-bold text-emerald-700 uppercase mb-2">Guideline Summary:</p>
                <ul className="text-xs text-emerald-800 space-y-2 list-disc list-inside">
                  <li>Aim for 150 minutes of moderate-intensity activity per week.</li>
                  <li>Perform strengthening activities twice per week.</li>
                  <li>If your health changes, retake this questionnaire immediately.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
