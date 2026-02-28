
import React, { useState } from 'react';
import { APF_DATASET } from '../constants/apfData';

export const DatasetView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = APF_DATASET.filter(row => 
    row.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-purple-50 overflow-hidden animate-fade-in">
      <div className="p-8 border-b border-purple-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Source Dataset</h2>
          <p className="text-sm text-slate-500">The grounding data used by the assistant</p>
        </div>
        
        <div className="relative flex-1 md:max-w-md">
          <input 
            type="text" 
            placeholder="Search dataset records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-purple-100 rounded-2xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-sm"
          />
          <span className="absolute left-4 top-3.5 text-slate-300">🔍</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-purple-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-8 py-5">Category</th>
              <th className="px-8 py-5">Record Content</th>
              <th className="px-8 py-5 w-32">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50/50">
            {filteredData.map((row) => (
              <tr key={row.id} className="hover:bg-purple-50/30 transition-colors group">
                <td className="px-8 py-5">
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg uppercase tracking-tight">
                    {row.category}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm text-slate-700 leading-relaxed">
                  {row.content}
                </td>
                <td className="px-8 py-5 text-[10px] font-mono font-bold text-slate-300">
                  {row.source}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredData.length === 0 && (
        <div className="p-20 text-center">
          <p className="text-slate-400 font-medium italic">No matching data records found.</p>
        </div>
      )}
    </div>
  );
};
