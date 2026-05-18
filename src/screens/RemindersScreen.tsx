import React, { useState } from "react";
import { User } from "firebase/auth";
import { Bell, Plus, Trash2, Calendar, Pill, Clock } from "lucide-react";
import { addMonths, format } from "date-fns";
import { motion, AnimatePresence } from "motion/react";

interface Reminder {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  nextRefillDate: string;
  completed?: boolean;
}

export default function RemindersScreen({ user }: { user: User | null }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newMed, setNewMed] = useState("");
  const [newDosage, setNewDosage] = useState("");

  const addReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMed) return;
    const newReminder: Reminder = {
      id: Date.now().toString(),
      medicineName: newMed,
      dosage: newDosage,
      frequency: "Monthly",
      nextRefillDate: addMonths(new Date(), 1).toISOString(),
      completed: false
    };
    setReminders(prev => [newReminder, ...prev]);
    setNewMed("");
    setNewDosage("");
    setIsAdding(false);
  };

  const removeReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 space-y-6 text-center">
        <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center text-teal-600">
          <Bell size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-display font-bold text-slate-800">Login Required</h2>
          <p className="text-slate-500 text-sm">Please login to track your monthly medicine refills and reminders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-display font-bold text-slate-800">My Reminders</h2>
          <p className="text-slate-500 text-sm">Never miss a refill again.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-3 bg-teal-600 text-white rounded-2xl shadow-lg shadow-teal-200 active:scale-90 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={addReminder}
            className="bg-white border-2 border-teal-100 rounded-3xl p-5 shadow-sm space-y-4"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-teal-600 uppercase tracking-widest pl-1">Medicine Name</label>
              <input 
                type="text" 
                value={newMed} 
                onChange={(e) => setNewMed(e.target.value)}
                placeholder="e.g., Telma 40"
                className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-teal-600 uppercase tracking-widest pl-1">Dosage (optional)</label>
              <input 
                type="text" 
                value={newDosage} 
                onChange={(e) => setNewDosage(e.target.value)}
                placeholder="e.g., 1 tablet daily"
                className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button className="w-full py-3 bg-teal-600 text-white font-bold rounded-xl text-sm shadow-md transition-all hover:bg-teal-700 active:translate-y-0.5">
              Set Refill Reminder
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {reminders.length === 0 ? (
          <div className="py-12 text-center space-y-3">
             <Pill size={40} className="mx-auto text-slate-200" />
             <p className="text-slate-400 text-sm italic">You haven't added any reminders yet.</p>
          </div>
        ) : (
          reminders.map((rem) => (
            <motion.div
              key={rem.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-4 group"
            >
              <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl flex-shrink-0">
                <Bell size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 truncate">{rem.medicineName}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                    <Clock size={12} />
                    {rem.dosage || "Generic Dosage"}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 font-mono">
                    <Calendar size={12} />
                    Refill: {format(new Date(rem.nextRefillDate), "dd MMM yyyy")}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => removeReminder(rem.id)}
                className="p-2 text-rose-300 hover:text-rose-500 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))
        )}
      </div>

      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3">
        <Clock size={20} className="text-amber-500 flex-shrink-0" />
        <div className="space-y-1">
          <h5 className="text-xs font-bold text-amber-800">Smart Refill Tip</h5>
          <p className="text-[10px] text-amber-700 leading-relaxed">
            Jan-Aushadhi stores often have high demand. Setting a reminder 5 days before your refill date ensures you never run out of essential meds.
          </p>
        </div>
      </div>
    </div>
  );
}
