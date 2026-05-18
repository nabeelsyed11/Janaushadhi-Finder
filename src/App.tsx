import React, { useState, useEffect } from "react";
import { Search, MapPin, Bell, LayoutDashboard, Pill, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { auth, logout } from "./lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import SearchScreen from "./screens/SearchScreen";
import MapScreen from "./screens/MapScreen";
import RemindersScreen from "./screens/RemindersScreen";
import DashboardScreen from "./screens/DashboardScreen";
import LoginScreen from "./screens/LoginScreen";

type Tab = "search" | "map" | "reminders" | "dashboard";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("search");
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) setShowLogin(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const handleLoginSuccess = (u: FirebaseUser) => {
    setUser(u);
    setShowLogin(false);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "search": return <SearchScreen />;
      case "map": return <MapScreen />;
      case "reminders": return <RemindersScreen user={user} />;
      case "dashboard": return <DashboardScreen user={user} />;
      default: return <SearchScreen />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-teal-50">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-teal-600"
        >
          <Pill size={48} />
        </motion.div>
      </div>
    );
  }

  // Show login screen when user explicitly clicks Login
  if (showLogin && !user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative border-x border-teal-100">
      {/* Header */}
      <header className="p-4 bg-white border-b border-slate-100 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm shadow-teal-200/50 bg-white border border-slate-100 flex items-center justify-center">
            <img src="/app_logo.png" alt="Jan-Aushadhi Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-display font-bold text-xl text-slate-800 leading-tight">
            Jan<span className="text-teal-600">-Aushadhi</span>
          </h1>
        </div>
        
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500 hidden sm:block">
              {user.displayName || user.email}
            </span>
            <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500 transition-colors">
              <LogOut size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-xs">
                  {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full text-sm font-bold hover:shadow-lg hover:shadow-teal-200/50 transition-all active:scale-95"
          >
            <User size={16} />
            <span>Login</span>
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scroll-smooth">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="p-2 pb-6 bg-white border-t border-slate-100 flex justify-around items-center z-10">
        <NavButton 
          active={activeTab === "search"} 
          onClick={() => setActiveTab("search")} 
          icon={<Search size={22} />} 
          label="Search" 
        />
        <NavButton 
          active={activeTab === "map"} 
          onClick={() => setActiveTab("map")} 
          icon={<MapPin size={22} />} 
          label="Stores" 
        />
        <NavButton 
          active={activeTab === "reminders"} 
          onClick={() => setActiveTab("reminders")} 
          icon={<Bell size={22} />} 
          label="Refills" 
        />
        <NavButton 
          active={activeTab === "dashboard"} 
          onClick={() => setActiveTab("dashboard")} 
          icon={<LayoutDashboard size={22} />} 
          label="Stats" 
        />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all flex-1 py-1 ${active ? "text-teal-600" : "text-slate-400"}`}
    >
      <div className={`p-1.5 rounded-xl transition-all ${active ? "bg-teal-50 scale-110" : ""}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? "opacity-100" : "opacity-0 h-0"}`}>
        {label}
      </span>
    </button>
  );
}
