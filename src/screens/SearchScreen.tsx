import React, { useState, useMemo } from "react";
import { Search, Sparkles, TrendingDown, Info, Calculator, BrainCircuit } from "lucide-react";
import { medicines, Medicine } from "../data/medicines";
import Fuse from "fuse.js";
import { motion, AnimatePresence } from "motion/react";
import { explainMedicine } from "../services/gemini";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  
  const fuse = useMemo(() => new Fuse(medicines, {
    keys: ["brandedName", "genericName", "category"],
    threshold: 0.4
  }), []);

  const results = useMemo(() => {
    if (!query) return medicines.slice(0, 5);
    return fuse.search(query).map(r => r.item);
  }, [query, fuse]);

  const handleAskAI = async () => {
    if (!query) return;
    setAiLoading(true);
    const response = await explainMedicine(query);
    setAiResponse(response);
    setAiLoading(false);
  };

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-bold text-slate-800">Save on Medicines</h2>
        <p className="text-slate-500 text-sm">Find generic equivalents for your branded prescriptions.</p>
      </div>

      <div className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
            <Search size={20} />
          </div>
          <input 
            type="text"
            placeholder="Enter branded medicine name..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder:text-slate-400"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setAiResponse("");
            }}
          />
        </div>

        {query && results.length === 0 && (
          <button 
            onClick={handleAskAI}
            disabled={aiLoading}
            className="w-full py-3 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-center gap-2 text-teal-700 text-sm font-bold hover:bg-teal-100 transition-colors disabled:opacity-50"
          >
            {aiLoading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><BrainCircuit size={18} /></motion.div>
            ) : (
              <BrainCircuit size={18} />
            )}
            {aiLoading ? "Consulting AI..." : "Ask AI for generic salt info"}
          </button>
        )}

        {aiResponse && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl space-y-2"
          >
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <BrainCircuit size={14} />
              AI Insight
            </div>
            <p className="text-xs text-indigo-900 leading-relaxed italic">{aiResponse}</p>
          </motion.div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            {query ? `Search Results (${results.length})` : "Top Medications"}
            <Sparkles size={16} className="text-teal-500" />
          </h3>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Prices per strip</span>
        </div>

        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {results.map((med, idx) => (
              <motion.div
                key={med.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
              >
                <MedicineCard medicine={med} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {results.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search size={32} />
              </div>
              <p className="text-slate-500 font-medium">No matches found for "{query}"</p>
              <p className="text-slate-400 text-xs px-8">Try searching by salt name or a different brand name.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MedicineCard({ medicine }: { medicine: Medicine }) {
  const savings = ((medicine.brandedPrice - medicine.genericPrice) / medicine.brandedPrice * 100).toFixed(0);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3">
        <div className="px-2 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full flex items-center gap-1">
          <TrendingDown size={10} />
          SAVE {savings}%
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block">
            {medicine.category}
          </span>
          <h4 className="font-bold text-slate-800 text-lg">{medicine.brandedName}</h4>
          <p className="text-slate-500 text-xs flex items-center gap-1">
            Salt: <span className="text-slate-700 font-medium italic">{medicine.genericName}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-50">
          <div className="space-y-1">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Branded</p>
            <p className="text-slate-400 line-through text-sm font-medium">₹{medicine.brandedPrice.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-medium text-teal-500 uppercase tracking-wider">Generic</p>
            <p className="text-emerald-600 text-lg font-bold">₹{medicine.genericPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-teal-600 transition-colors"
          >
            <Info size={16} />
          </button>
          <button className="flex-1 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
            <Calculator size={14} />
            Check stock
          </button>
        </div>

        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-slate-50 p-3 rounded-xl mt-2">
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{medicine.usage}"
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
