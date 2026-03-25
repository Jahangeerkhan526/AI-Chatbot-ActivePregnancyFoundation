
import React from 'react';

export const DocsView: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 space-y-8 animate-fade-in">
      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Architecture & Design</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-purple-600 mb-2">Technical Stack</h3>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>React 18+ (Frontend Framework)</li>
              <li>Tailwind CSS (Styling)</li>
              <li>Gemini 3 Flash Preview (LLM)</li>
              <li>TypeScript (Type Safety)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-600 mb-2">Grounding Strategy</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              The system uses a <strong>Strict System Instruction</strong> approach. The entire APF dataset (GAQ-P, FAQs, Resources) is injected into the context window. The model is constrained via prompt engineering to act only as a retrieval and re-expression engine for this data.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Data Handling Decisions</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-bold text-slate-700">Deterministic Prompting</h4>
              <p className="text-slate-600 text-sm">Temperature is set to 0.1 to minimize "hallucinations" and ensure the model stays faithful to the source text.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-bold text-slate-700">Safety Overrides</h4>
              <p className="text-slate-600 text-sm">Explicit instructions were added to handle medical "Red Flags." If symptoms are detected, the bot defaults to a standard safety protocol (Stop + Call Provider).</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-bold text-slate-700">Negative Constraints</h4>
              <p className="text-slate-600 text-sm">The model is explicitly told what it <em>cannot</em> do (generate new medical advice), providing a robust safety barrier.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Current Limitations</h2>
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
          <ul className="list-disc list-inside text-amber-800 text-sm space-y-1">
            <li><strong>Dataset Size:</strong> This prototype uses a condensed mock-up of APF data.</li>
            <li><strong>Static Context:</strong> Current grounding is hard-coded. Scale requires a Vector Database (RAG).</li>
            <li><strong>Language:</strong> Currently optimized for English only.</li>
            <li><strong>Context Window:</strong> Extremely long conversations may eventually push the system instructions out of the active context buffer.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
