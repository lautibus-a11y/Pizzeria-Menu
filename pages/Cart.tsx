
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useStore } from '../store';
import { Trash2, Minus, Plus, MessageCircle, MapPin, User, ArrowLeft, Pizza, CreditCard, ShoppingBag, Phone } from 'lucide-react';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { motion, AnimatePresence } from 'framer-motion';

export const Cart: React.FC = () => {
  const { cart, settings, updateQuantity, removeFromCart, clearCart, createOrder } = useStore();
  const [customer, setCustomer] = useState({ name: '', address: '', method: 'delivery', phone: '' });

  const total = cart.reduce((acc, item) => {
    const extrasTotal = item.selectedExtras.reduce((sum, e) => sum + e.price, 0);
    return acc + (item.price + extrasTotal) * item.quantity;
  }, 0);

  const handleSendOrder = async () => {
    if (!customer.name || !customer.address) {
      alert("Por favor completa tu nombre y dirección para continuar.");
      return;
    }

    // Create order in Supabase for tracking
    await createOrder({
      name: customer.name,
      phone: customer.phone || 'Sin número'
    });

    const link = generateWhatsAppLink(cart, settings, customer);
    window.open(link, '_blank');
  };

  if (cart.length === 0) {
    return (
      <Layout showBack onBack={() => window.location.hash = '#'}>
        <div className="flex flex-col items-center justify-center min-h-[85vh] p-8 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="w-56 h-56 bg-white/5 rounded-full flex items-center justify-center mb-16 border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)]"
          >
            <Pizza size={100} className="text-white/10" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-header uppercase tracking-tighter mb-8"
          >
            Tu banquete está vacío
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-lg mb-16 max-w-md mx-auto italic font-medium"
          >
            "Parece que aún no has elegido tu banquete. Explora nuestro menú y déjate tentar por la tradición."
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.hash = '#'}
            className="bg-white text-black px-20 py-7 rounded-2xl font-black shadow-2xl uppercase tracking-[0.4em] text-[10px] flex items-center gap-6"
          >
            <ArrowLeft size={20} />
            Regresar al Menú
          </motion.button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showBack onBack={() => window.location.hash = '#'} hideFooter>
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative min-h-[calc(100vh-100px)]">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#e31c1c]/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#fac415]/5 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative bg-[#0c0a0a] rounded-[3rem] md:rounded-[4rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col lg:flex-row max-w-6xl w-full lg:h-[80vh] z-10"
        >
          {/* Listado de Productos (Izquierda) */}
          <div className="flex-1 flex flex-col h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
            <div className="p-8 md:p-12 pb-4 flex items-end justify-between shrink-0">
              <div className="space-y-1">
                <span className="text-[#e31c1c] font-black text-[9px] uppercase tracking-[0.5em]">Tu Selección</span>
                <h3 className="font-header text-4xl md:text-6xl text-white uppercase tracking-tighter leading-none">Mi Carrito</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearCart}
                className="text-[9px] text-white/40 font-black uppercase tracking-[0.3em] px-6 py-3 rounded-xl bg-white/5 border border-white/10 transition-all hover:text-[#e31c1c]"
              >
                Vaciar
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-8 md:p-12 pt-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {cart.map((item, idx) => {
                  const extrasIds = item.selectedExtras.map(e => e.id);
                  return (
                    <motion.div
                      key={`${item.id}-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      layout
                      className="bg-white/5 p-4 md:p-6 rounded-[2.5rem] flex items-center gap-6 border border-white/5 hover:border-white/20 transition-all group"
                    >
                      <div className="relative overflow-hidden rounded-[1.5rem] shadow-xl shrink-0 w-20 h-20 md:w-28 md:h-28">
                        <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-header text-xl md:text-2xl text-white uppercase tracking-tighter truncate pr-4">{item.name}</h4>
                          <span className="font-header text-[#fac415] text-xl">{settings.currency}{item.price.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.selectedExtras.map(extra => (
                            <span key={extra.id} className="text-[7px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-white/5">
                              + {extra.name}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 bg-black/40 rounded-xl p-1 border border-white/5">
                            <motion.button whileTap={{ scale: 0.8 }} onClick={() => updateQuantity(item.id, extrasIds, -1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-white hover:bg-[#e31c1c] transition-all"><Minus size={12} /></motion.button>
                            <span className="font-header text-lg w-6 text-center">{item.quantity}</span>
                            <motion.button whileTap={{ scale: 0.8 }} onClick={() => updateQuantity(item.id, extrasIds, 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-white hover:bg-[#e31c1c] transition-all"><Plus size={12} /></motion.button>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1, color: '#e31c1c' }}
                            onClick={() => removeFromCart(item.id, extrasIds)}
                            className="text-white/20 transition-colors hover:text-[#e31c1c]"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Checkout Panel (Derecha) */}
          <div className="lg:w-[450px] bg-white/[0.02] flex flex-col h-full overflow-hidden">
            <div className="p-8 md:p-12 flex flex-col h-full">
              <div className="flex items-center gap-4 border-b border-white/5 pb-8 mb-8 shrink-0">
                <div className="w-12 h-12 bg-[#e31c1c] rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(227,28,28,0.4)]">
                  <ShoppingBag size={24} />
                </div>
                <h3 className="font-header text-4xl text-white uppercase tracking-tighter pt-1">Finalizar</h3>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-1">
                <div className="space-y-4">
                  {[
                    { id: 'name', icon: User, placeholder: 'Tu nombre...', value: customer.name },
                    { id: 'address', icon: MapPin, placeholder: 'Dirección (Calle y Altura)...', value: customer.address },
                    { id: 'phone', icon: Phone, placeholder: 'WhatsApp (opcional)', value: customer.phone }
                  ].map((field) => (
                    <div key={field.id} className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#e31c1c] transition-colors">
                        <field.icon size={18} />
                      </div>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-xs text-white placeholder:text-white/20 outline-none focus:bg-white/10 focus:border-[#e31c1c]/50 transition-all font-medium"
                        value={field.value}
                        onChange={(e) => setCustomer({ ...customer, [field.id]: e.target.value })}
                      />
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {[
                      { id: 'delivery', icon: '🛵', label: 'Delivery' },
                      { id: 'pickup', icon: '🏪', label: 'Local' }
                    ].map((m) => (
                      <motion.button
                        key={m.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCustomer({ ...customer, method: m.id })}
                        className={`py-5 rounded-2xl text-[9px] font-black transition-all uppercase tracking-[0.3em] border relative overflow-hidden ${customer.method === m.id
                          ? 'bg-[#e31c1c] border-[#e31c1c] text-white shadow-xl'
                          : 'bg-transparent border-white/10 text-white/30 hover:border-white/20'
                          }`}
                      >
                        <span className="relative z-10">{m.icon} {m.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 space-y-6 mt-auto shrink-0">
                <div className="flex justify-between items-center px-2">
                  <span className="text-white/30 font-black text-[9px] uppercase tracking-[0.4em]">Inversión</span>
                  <span className="text-5xl md:text-6xl font-header text-white tracking-tighter">
                    <span className="text-[#fac415] text-2xl md:text-3xl mr-1">{settings.currency}</span>
                    {total.toLocaleString()}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#0e8f6f' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendOrder}
                  className="w-full bg-[#10a37f] text-white rounded-[2rem] py-6 md:py-8 font-black text-[10px] md:text-[11px] transition-all flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(16,163,127,0.3)] uppercase tracking-[0.4em]"
                >
                  <MessageCircle size={24} /> Enviar Pedido
                </motion.button>

                <p className="text-center text-[8px] font-black text-white/10 uppercase tracking-[0.5em]">
                  Redireccionando a WhatsApp
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};
