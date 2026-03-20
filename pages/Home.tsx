
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useStore } from '../store';
import { Plus, Star, X, ChevronRight, Zap, Sparkles, ShoppingBag, ArrowDown } from 'lucide-react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const Home: React.FC = () => {
  const { categories, products, settings, addToCart } = useStore();
  const [activeCategory, setActiveCategory] = useState<string | undefined>(categories[0]?.id ? String(categories[0].id) : undefined);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(String(categories[0].id));
    }
  }, [categories, activeCategory]);

  const filteredProducts = products.filter(p =>
    p.isActive &&
    String(p.categoryId) === String(activeCategory)
  );

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart({
        ...selectedProduct,
        quantity: 1,
        selectedExtras: []
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#9e1b1b', '#fac415', '#ffffff']
      });

      setSelectedProduct(null);
    }
  };

  return (
    <Layout>
      {/* Hero Section - Elite UI/UX Experience */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#0a0000]">
        {/* Optimized Dynamic Backgrounds */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-[#9e1b1b] rounded-full blur-[180px] will-animate"
          />
          <motion.div
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-[#7a1212] rounded-full blur-[150px] will-animate"
          />
        </div>

        {/* Hero Content Stack */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-6 pt-20 flex flex-col items-center text-center">
          {/* Tagline */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-script text-[#fac415] text-3xl md:text-5xl mb-4 tracking-wide will-animate"
          >
            L'eccellenza italiana
          </motion.span>

          {/* Main Title - Perfectly Centered and Scaled */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-8 will-animate"
          >
            <h1 className="font-header text-8xl md:text-[11rem] text-white tracking-tighter leading-[0.85] uppercase select-none">
              PIZZERIA <br />
              <span className="text-[#9e1b1b] drop-shadow-[0_0_40px_rgba(158,27,27,0.4)]">ESTELAR</span>
            </h1>
          </motion.div>

          {/* Rotating Pizza Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative mb-12 w-64 md:w-[26rem] perspective-1000 will-animate"
          >
            <motion.div
              animate={{
                rotate: 360,
                y: [0, -15, 0]
              }}
              transition={{
                rotate: { duration: 60, repeat: Infinity, ease: "linear" },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative z-10"
            >
              <img
                src="https://pngimg.com/uploads/pizza/pizza_PNG44090.png"
                alt="Gourmet Pizza"
                className="w-full h-auto object-contain drop-shadow-[0_40px_80px_rgba(158,27,27,0.5)] transform scale-110"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-radial from-[#9e1b1b]/30 to-transparent blur-3xl scale-125 -z-10"></div>
          </motion.div>

          {/* CTA & Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col items-center gap-10 will-animate"
          >
            <p className="text-white/50 max-w-md text-[10px] md:text-sm uppercase tracking-[0.3em] md:tracking-[0.6em] font-black leading-relaxed px-4">
              Pasión por la tradición <br /> <span className="text-[#e31c1c]">Sabor por la innovación</span>
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative flex flex-col items-center gap-4 mt-8"
            >
              <div className="bg-white text-black px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:bg-[#e31c1c] hover:text-white transition-all duration-500">
                Ver la Carta
              </div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-[#e31c1c]"
              >
                <ArrowDown size={24} />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>

        {/* Sophisticated Gradient Transition */}
        <div className="absolute bottom-0 left-0 w-full h-[30vh] transition-gradient z-10"></div>
      </section>

      {/* Menú Section - Tighter Gap */}
      <section id="menu-section" className="bg-[#050505] min-h-screen pt-12 pb-40 relative">
        <div className="sticky top-0 z-[90] py-8 px-4 mb-20">
          <div className="max-w-4xl mx-auto tab-nav-container relative z-[95]">
            <div className="flex justify-start md:justify-center items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-4">
              {categories.map(cat => (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(String(cat.id))}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all shrink-0 font-black text-[10px] uppercase tracking-[0.2em] relative overflow-hidden ${String(activeCategory) === String(cat.id)
                    ? 'text-white'
                    : 'text-white/30 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <span className="relative z-10">{cat.icon}</span>
                  <span className="relative z-10">{cat.name}</span>

                  {String(activeCategory) === String(cat.id) && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-[#e31c1c] active-tab-indicator"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="space-y-6">
              <span className="text-[#e31c1c] font-black text-[12px] uppercase tracking-[0.8em] block drop-shadow-[0_0_15px_rgba(227,28,28,0.3)]">
                Seleccionamos solo lo mejor
              </span>
              <h2 className="font-header text-7xl md:text-9xl text-white uppercase tracking-tighter leading-none">
                Nuestra <br /> <span className="text-white/10">Colección</span>
              </h2>
            </div>
            <p className="text-white/40 max-w-sm text-lg italic font-medium leading-relaxed border-l border-white/10 pl-8">
              "Ingredientes orgánicos, masa de 48hs de fermentación y el fuego de nuestra pasión italiana."
            </p>
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "100px" }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                  onClick={() => setSelectedProduct(product)}
                  className="group relative h-[36rem] rounded-[3.5rem] overflow-hidden cursor-pointer premium-card hover:border-[#e31c1c]/50 transition-all duration-500 shadow-2xl"
                >
                  {/* Image Area */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute inset-0 z-10 p-12 flex flex-col justify-end">
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="text-[#fac415]" fill="#fac415" />)}
                          </div>
                          <h3 className="font-header text-4xl md:text-5xl text-white uppercase tracking-tighter leading-none group-hover:text-[#e31c1c] transition-colors">
                            {product.name}
                          </h3>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl px-4 py-2 border border-white/10 flex items-center gap-2">
                          <Zap size={12} className="text-[#fac415]" />
                          <span className="text-white text-[10px] font-black">{settings.currency}{product.price.toLocaleString()}</span>
                        </div>
                      </div>

                      <p className="text-white/50 text-xs font-bold leading-relaxed line-clamp-2 uppercase tracking-widest italic opacity-0 transition-all duration-500 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                        {product.description}
                      </p>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-[#e31c1c] text-white py-6 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(227,28,28,0.3)] border border-white/10"
                      >
                        <Plus size={16} /> Añadir al Pedido
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Modern Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />

            <motion.div
              initial={{ y: "100%", opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="relative w-full max-w-5xl h-[85vh] md:h-auto md:max-h-[85vh] bg-[#0c0a0a] md:rounded-[4rem] rounded-t-[3rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,1)] flex flex-col md:flex-row group"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Section - Scaled for Mobile */}
              <div className="relative w-full md:w-[45%] h-56 md:h-auto shrink-0 overflow-hidden">
                <img
                  src={selectedProduct.imageUrl}
                  className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                  alt={selectedProduct.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a0a] via-transparent to-transparent"></div>

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-6 left-6 bg-black/40 backdrop-blur-3xl text-white p-3 md:p-5 rounded-full border border-white/10 hover:bg-[#e31c1c] transition-all z-20"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content Section - Perfectly Centered for Mobile */}
              <div className="flex-1 p-8 md:p-16 flex flex-col justify-center text-center md:text-left bg-gradient-to-br from-[#0c0a0a] to-[#050505] overflow-y-auto no-scrollbar">
                <div className="space-y-6 md:space-y-10">
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <div className="hidden md:flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="text-[#fac415]" fill="#fac415" />)}
                      </div>
                      <span className="text-[#e31c1c] font-black text-[9px] uppercase tracking-[0.5em]">Edición Especial</span>
                    </div>

                    <h3 className="font-header text-4xl md:text-7xl text-white uppercase leading-none tracking-tighter">
                      {selectedProduct.name}
                    </h3>

                    <p className="text-white/60 text-sm md:text-xl font-medium leading-relaxed italic md:border-l-4 border-[#e31c1c] md:pl-8 max-w-lg mx-auto md:mx-0">
                      "{selectedProduct.description}"
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                      {['Masa Madre', 'Ingredientes DOP'].map(tag => (
                        <span key={tag} className="text-[8px] font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full text-white/40 border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 md:pt-10 border-t border-white/10 flex flex-col gap-6 md:gap-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="text-center md:text-left">
                        <span className="text-white/20 text-[9px] font-black uppercase tracking-widest block mb-2">Inversión Gourmet</span>
                        <div className="flex items-baseline justify-center md:justify-start gap-1">
                          <span className="text-xl font-header text-[#e31c1c] tracking-tighter">{settings.currency}</span>
                          <span className="text-5xl md:text-7xl font-header text-white tabular-nums tracking-tighter leading-none">{selectedProduct.price.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="hidden md:block text-right">
                        <span className="text-[10px] font-black text-[#10a37f] uppercase tracking-widest block mb-2">● En Cocina</span>
                        <span className="text-xs text-white/40 font-medium">10 - 15 min</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      className="w-full bg-[#e31c1c] text-white py-5 md:py-8 rounded-2xl md:rounded-[2.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.4em] shadow-[0_20px_40px_rgba(227,28,28,0.3)] flex items-center justify-center gap-4"
                    >
                      <Plus size={18} /> Confirmar Selección
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};
