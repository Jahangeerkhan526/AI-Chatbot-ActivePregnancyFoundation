
import React from 'react';

export const RecommendationsView: React.FC = () => {
  const steps = [
    {
      title: "Integrate Real-Time Vector Search (RAG)",
      desc: "Connect the bot to a Vector Database (like Pinecone or Weaviate) containing the full library of APF PDFs and documents. This allows for searching thousands of pages without bloating the prompt.",
      icon: "🔍"
    },
    {
      title: "Safety & Adversarial Testing",
      desc: "Perform 'Red Teaming' to try and force the bot to give incorrect medical advice. Refine system instructions based on these failure modes.",
      icon: "🛡️"
    },
    {
      title: "Conversation Analytics",
      desc: "Implement logging (GDPR compliant) to see what questions users are asking. This can identify gaps in current APF FAQ datasets.",
      icon: "📊"
    },
    {
      title: "Multi-modal Support",
      desc: "Enable the chatbot to read images of GAQ-P forms filled out by users to provide instant feedback on whether they are cleared for activity.",
      icon: "📸"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800">Future Roadmap</h2>
        <p className="text-slate-500 mt-2">Strategic recommendations for the next phase of development.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {steps.map((step, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-300 transition-colors">
            <div className="text-3xl mb-4">{step.icon}</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-purple-600 rounded-2xl text-white text-center">
        <h3 className="text-2xl font-bold mb-4">Ready for Production Integration?</h3>
        <p className="opacity-90 mb-6 max-w-2xl mx-auto">
          This prototype demonstrates that a safe, grounded AI assistant is possible using APF's high-quality screening content.
        </p>
        <button className="bg-white text-purple-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors">
          Contact Development Team
        </button>
      </div>
    </div>
  );
};
