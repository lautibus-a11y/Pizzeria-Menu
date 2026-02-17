import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { ShoppingCart, User, Pizza, LogOut, ChevronLeft, MapPin, Phone, Instagram, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingBar } from './FloatingBar';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, showBack, onBack }) => {
  const { cart, settings, isAdmin, logout } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white selection:bg-[#e31c1c] selection:text-white">
      {/* Header Estilo Apple/High-End */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-4 md:px-8 ${isScrolled
          ? 'py-3'
          : 'py-8'
          }`}
      >
        <div className={`max-w-7xl mx-auto flex items-center justify-between transition-all duration-500 rounded-[2rem] px-6 ${isScrolled ? 'bg-black/60 backdrop-blur-2xl border border-white/5 shadow-2xl py-2' : 'bg-transparent py-0'
          }`}>
          <div className="flex items-center gap-6">
            {showBack ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onBack}
                className="p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white transition-all"
              >
                <ChevronLeft size={24} />
              </motion.button>
            ) : (
              <div
                className="flex items-center gap-4 cursor-pointer group"
                onClick={() => window.location.hash = '#'}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8, ease: "anticipate" }}
                  className="w-12 h-12 bg-gradient-to-tr from-[#e31c1c] to-[#fac415] rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(227,28,28,0.4)]"
                >
                  <Pizza size={24} fill="currentColor" />
                </motion.div>
                <div className="flex flex-col">
                  <h1 className="font-header text-2xl tracking-tighter uppercase leading-none pt-1">
                    {settings.restaurantName.split(' ')[0]}<span className="text-[#e31c1c]">.</span>
                  </h1>
                  <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40">Dal 1984</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="px-6 py-3 rounded-2xl bg-red-950/40 text-red-500 border border-red-500/20 font-black text-[10px] uppercase tracking-widest"
              >
                <div className="flex items-center gap-2">
                  <LogOut size={14} /> Salir
                </div>
              </motion.button>
            )}

            {!isAdmin && (
              <motion.a
                href="#cart"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="px-5 py-3 rounded-2xl bg-white text-black font-black flex items-center gap-4 shadow-[0_15px_30px_rgba(255,255,255,0.1)] overflow-hidden relative">
                  <ShoppingCart size={18} />
                  <span className="text-sm tracking-tighter">{cartCount}</span>
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-[#e31c1c] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-[#e31c1c] rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#050505]"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.a>
            )}
          </div>
        </div>
      </motion.header>

      <main className="flex-1 w-full bg-tablecloth">
        {children}
      </main>

      {/* Footer Cinematográfico */}
      <footer className="bg-[#080808] border-t border-white/5 pt-24 pb-48 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-[#e31c1c] to-transparent opacity-30"></div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20 items-start">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#e31c1c] rounded-xl flex items-center justify-center">
                  <Pizza size={20} fill="currentColor" />
                </div>
                <h2 className="font-header text-3xl uppercase tracking-tighter">{settings.restaurantName}</h2>
              </div>
              <p className="text-white/40 leading-relaxed text-sm italic">
                "Nuestra esencia reside en el respeto por los tiempos de leudado y la calidad insuperable de nuestra materia prima. Una tradición que se saborea en cada bocado."
              </p>
              <div className="flex gap-4">
                {[Instagram, Phone, MapPin].map((Icon, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 cursor-pointer"
                  >
                    <Icon size={18} />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-6">
              <motion.div
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.8 }}
                className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-center gap-4"
              >
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&color=ffffff&bgcolor=00000000&data=${encodeURIComponent(window.location.href)}`}
                  alt="Menu QR"
                  className="w-24 h-24"
                />
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">Compartir Carta</span>
              </motion.div>
            </div>

            <div className="space-y-8 text-right md:text-right">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#e31c1c]">Dónde Encontrarnos</h3>
              <div className="space-y-4">
                <p className="text-white font-bold text-lg">{settings.address}</p>
                <p className="text-white/40 text-sm">{settings.openingHours}</p>
              </div>
              <div className="h-[1px] w-full bg-white/5 ml-auto"></div>
              <div className="flex flex-col items-center md:items-end gap-2">
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">PIZZERIA ITALIA © 2024</p>
                <motion.a
                  whileHover={{ color: '#e31c1c', x: -5 }}
                  href="#admin"
                  className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-[#e31c1c] transition-all flex items-center gap-2"
                >
                  <ShieldCheck size={10} /> Panel Administrativo
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {!isAdmin && <FloatingBar />}
    </div>
  );
};
