
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useStore, OrderStatus } from '../store';
import {
  Settings as SettingsIcon, Package, LayoutDashboard, Plus, Trash2, Edit2,
  Save, Terminal, ShieldCheck, ShoppingBag, DollarSign, Clock, CheckCircle2,
  Smartphone, Search, Layers, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Admin: React.FC = () => {
  const {
    isAdmin, login, products, categories, settings, setSettings,
    orders, updateOrderStatus, upsertProduct, deleteProduct,
    upsertCategory, deleteCategory
  } = useStore();

  const [pass, setPass] = useState('');
  const [tab, setTab] = useState<'dashboard' | 'pedidos' | 'carta' | 'ajustes'>('dashboard');

  // Forms state
  const [isEditingProduct, setIsEditingProduct] = useState<any>(null);
  const [isEditingCategory, setIsEditingCategory] = useState<any>(null);

  // Statistics calculation
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const dailyOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;
  const pendingOrders = orders.filter(o => o.status === 'pendiente' || o.status === 'preparacion').length;

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[85vh] px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/5 backdrop-blur-3xl p-10 md:p-16 rounded-[3rem] md:rounded-[4rem] border border-white/10 shadow-2xl text-center w-full max-w-lg"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-tr from-[#e31c1c] to-black rounded-full flex items-center justify-center mx-auto mb-10 md:mb-12 shadow-[0_0_40px_rgba(227,28,28,0.3)] border border-white/10"
            >
              <ShieldCheck size={40} className="text-white" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-header uppercase mb-4 tracking-tighter">Acceso Maestro</h2>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.6em] mb-12 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#e31c1c] rounded-full animate-pulse"></span>
              Seguridad Encriptada
            </p>

            <div className="space-y-6">
              <input
                type="password"
                placeholder="PIN"
                className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 px-8 mb-4 text-center text-3xl font-header tracking-[1em] focus:bg-white/10 focus:border-[#e31c1c]/50 outline-none transition-all placeholder:text-white/5"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    const success = await login(pass);
                    if (!success) alert("PIN Incorrecto");
                  }
                }}
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  const success = await login(pass);
                  if (!success) alert("PIN Incorrecto");
                }}
                className="w-full bg-white text-black rounded-[2rem] py-6 font-black shadow-2xl uppercase tracking-[0.5em] text-[10px]"
              >
                Conectar al Núcleo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-40">
        {/* Admin Navigation Bar */}
        <div className="flex justify-center mb-16 md:mb-24 overflow-x-auto no-scrollbar py-4">
          <div className="bg-black/40 p-2 rounded-[2.5rem] flex gap-2 border border-white/10 backdrop-blur-3xl min-w-max">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
              { id: 'pedidos', label: 'Ventas', icon: <ShoppingBag size={18} /> },
              { id: 'carta', label: 'Carta', icon: <Package size={18} /> },
              { id: 'ajustes', label: 'Ajustes', icon: <SettingsIcon size={18} /> }
            ].map((t) => (
              <motion.button
                key={t.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTab(t.id as any)}
                className={`flex items-center gap-4 px-8 md:px-12 py-5 rounded-[2rem] transition-all text-[10px] font-black uppercase tracking-[0.3em] relative overflow-hidden ${tab === t.id ? 'text-black' : 'text-white/40 hover:text-white'
                  }`}
              >
                <span className="relative z-10">{t.icon}</span>
                <span className="relative z-10 hidden sm:inline">{t.label}</span>
                {tab === t.id && (
                  <motion.div layoutId="adminTab" className="absolute inset-0 bg-white" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Dashboard Tab */}
          {tab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Stats Card 1: Revenue */}
              <motion.div whileHover={{ y: -5 }} className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <span className="text-[#e31c1c] font-black text-[10px] uppercase tracking-[0.5em] mb-8 block">Ingresos Totales</span>
                  <div className="text-7xl font-header text-white tabular-nums leading-none">
                    <span className="text-[#e31c1c] text-3xl mr-2">{settings.currency}</span>
                    {totalRevenue.toLocaleString()}
                  </div>
                </div>
                <DollarSign className="absolute right-[-10%] bottom-[-10%] text-white/5 opacity-20" size={200} />
              </motion.div>

              {/* Stats Card 2: Orders */}
              <motion.div whileHover={{ y: -5 }} className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <span className="text-[#fac415] font-black text-[10px] uppercase tracking-[0.5em] mb-8 block">Ventas de Hoy</span>
                  <div className="text-7xl font-header text-white tabular-nums leading-none">{dailyOrders}</div>
                  <div className="text-[9px] font-black text-white/40 uppercase mt-4">Orders logged today</div>
                </div>
                <ShoppingBag className="absolute right-[-10%] bottom-[-10%] text-white/5 opacity-20" size={200} />
              </motion.div>

              {/* Stats Card 3: Pending */}
              <motion.div whileHover={{ y: -5 }} className="bg-black p-12 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-[#10a37f]/20 rounded-full animate-ping absolute"></div>
                    <div className="w-16 h-16 bg-[#10a37f] rounded-full flex items-center justify-center text-white">
                      <Clock size={24} />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-4xl font-header text-white leading-none block">{pendingOrders}</span>
                    <span className="text-[9px] font-black text-[#10a37f] uppercase tracking-widest">En preparación</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Ventas / Pedidos Tab */}
          {tab === 'pedidos' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center px-4">
                <h3 className="font-header text-5xl uppercase tracking-tighter">Monitor de Ventas</h3>
                <div className="bg-white/5 px-6 py-2 rounded-full border border-white/10 text-[9px] font-black text-white/40 uppercase tracking-widest">
                  Actualizado: Justo ahora
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`bg-white/5 rounded-[3rem] p-8 border ${order.status === 'pendiente' ? 'border-yellow-500/30' :
                        order.status === 'preparacion' ? 'border-orange-500/30' :
                          'border-white/10'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-white/40 uppercase">ID #{order.id}</span>
                          <h4 className="font-header text-2xl text-white uppercase truncate max-w-[150px]">{order.customerName}</h4>
                        </div>
                        <span className="text-2xl font-header text-white">{settings.currency}{order.total.toLocaleString()}</span>
                      </div>

                      <div className="space-y-3 mb-8">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[10px] font-bold text-white/60">
                            <span>{item.quantity}x {item.name}</span>
                            <span>+ {item.selectedExtras.length} extras</span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {(['pendiente', 'preparacion', 'en camino', 'entregado'] as OrderStatus[]).map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order.id, status)}
                            className={`py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${order.status === status
                              ? 'bg-white text-black'
                              : 'bg-white/5 text-white/40 hover:bg-white/10'
                              }`}
                          >
                            {status === 'entregado' ? <CheckCircle2 size={12} className="mx-auto" /> : status}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Carta / Menu Tab */}
          {tab === 'carta' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Categorías Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <div className="flex justify-between items-center px-4 mb-4">
                  <h4 className="font-header text-2xl uppercase tracking-tighter">Categorías</h4>
                  <button onClick={() => setIsEditingCategory({})} className="text-[#e31c1c]"><Plus size={20} /></button>
                </div>
                <div className="space-y-3">
                  {categories.map(cat => (
                    <div key={cat.id} className="group flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <span>{cat.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setIsEditingCategory(cat)} className="text-white/40 hover:text-white"><Edit2 size={14} /></button>
                        <button onClick={() => deleteCategory(cat.id)} className="text-white/40 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Productos Main */}
              <div className="lg:col-span-3 space-y-10">
                <div className="flex justify-between items-end px-4 border-l-4 border-[#e31c1c]">
                  <div className="space-y-1">
                    <h3 className="font-header text-5xl uppercase tracking-tighter leading-none">Productos</h3>
                    <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.5em]">Total: {products.length}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    onClick={() => setIsEditingProduct({})}
                    className="bg-white text-black p-5 rounded-2xl shadow-xl transition-all"
                  >
                    <Plus size={24} />
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map(p => (
                    <div key={p.id} className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 flex items-center gap-6 group hover:bg-white/10 transition-all">
                      <img src={p.imageUrl} className="w-20 h-20 rounded-3xl object-cover shadow-xl" />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-header text-2xl truncate uppercase">{p.name}</h5>
                        <p className="text-[#fac415] font-header text-xl leading-none">{settings.currency}{p.price.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setIsEditingProduct(p)} className="p-3 bg-white/5 rounded-xl hover:bg-white/20 transition-all"><Edit2 size={18} /></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 text-red-500 transition-all"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Ajustes Tab */}
          {tab === 'ajustes' && (
            <div className="bg-white/5 p-10 md:p-20 rounded-[4rem] border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-16">
                <span className="text-[#e31c1c] font-black text-[10px] uppercase tracking-[0.8em] mb-4 block">Core Config</span>
                <h3 className="font-header text-6xl uppercase tracking-tighter">Ajustes del Sistema</h3>
              </div>

              <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { label: 'Nombre', field: 'restaurantName' },
                  { label: 'WhatsApp', field: 'whatsappNumber' },
                  { label: 'Dirección', field: 'address' },
                  { label: 'Horarios', field: 'openingHours' }
                ].map(f => (
                  <div key={f.field} className="space-y-3">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">{f.label}</label>
                    <input
                      type="text"
                      value={(settings as any)[f.field]}
                      onChange={(e) => setSettings({ ...settings, [f.field]: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 outline-none focus:bg-white/10 focus:border-[#e31c1c]/50 transition-all text-sm font-bold"
                    />
                  </div>
                ))}
                <button className="md:col-span-2 w-full bg-white text-black py-7 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.5em] shadow-2xl mt-8">
                  <Save size={18} className="inline mr-3" /> Sincronizar Todo
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Editor Modal - Categories */}
      <AnimatePresence>
        {isEditingCategory && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditingCategory(null)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-[#1a1a1a] p-12 rounded-[3.5rem] border border-white/10 shadow-2xl w-full max-w-md">
              <h3 className="font-header text-4xl uppercase mb-8">{isEditingCategory.id ? 'Editar' : 'Nueva'} Categoría</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest block mb-2">Nombre</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none" placeholder="Nombre" value={isEditingCategory.name || ''} onChange={e => setIsEditingCategory({ ...isEditingCategory, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest block mb-2">Icono (Emoji)</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none text-center text-3xl" value={isEditingCategory.icon || ''} onChange={e => setIsEditingCategory({ ...isEditingCategory, icon: e.target.value })} />
                </div>
                <button onClick={() => {
                  upsertCategory({ ...isEditingCategory, id: isEditingCategory.id || Math.random().toString(36).substr(2, 9) });
                  setIsEditingCategory(null);
                }} className="w-full bg-[#e31c1c] text-white py-6 rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] mt-6">Guardar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Editor Modal - Products */}
      <AnimatePresence>
        {isEditingProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditingProduct(null)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-[#1a1a1a] p-12 rounded-[3.5rem] border border-white/10 shadow-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-header text-4xl uppercase">{isEditingProduct.id ? 'Editar' : 'Nuevo'} Producto</h3>
                <button onClick={() => setIsEditingProduct(null)} className="text-white/40"><X size={24} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-[9px] font-black text-white/20 uppercase mb-2 block">Nombre</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6" value={isEditingProduct.name || ''} onChange={e => setIsEditingProduct({ ...isEditingProduct, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-white/20 uppercase mb-2 block">Precio</label>
                    <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6" value={isEditingProduct.price || 0} onChange={e => setIsEditingProduct({ ...isEditingProduct, price: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-white/20 uppercase mb-2 block">Categoría</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white appearance-none" value={isEditingProduct.categoryId || ''} onChange={e => setIsEditingProduct({ ...isEditingProduct, categoryId: e.target.value })}>
                      <option value="">Seleccionar...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[9px] font-black text-white/20 uppercase mb-2 block">Cargar Imagen (PNG, JPG...)</label>
                    <div className="flex flex-col gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setIsEditingProduct({ ...isEditingProduct, imageUrl: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="w-full bg-white/5 border-2 border-dashed border-white/10 rounded-2xl py-8 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 hover:border-[#e31c1c]/50 transition-all group"
                      >
                        <Plus size={24} className="text-white/20 group-hover:text-[#e31c1c] mb-2" />
                        <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Seleccionar Archivo</span>
                      </label>

                      {isEditingProduct.imageUrl && (
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10">
                          <img src={isEditingProduct.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                          <button
                            onClick={() => setIsEditingProduct({ ...isEditingProduct, imageUrl: '' })}
                            className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}

                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-white/20 uppercase">O URL Externa</label>
                        <input
                          type="text"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm"
                          placeholder="https://..."
                          value={isEditingProduct.imageUrl || ''}
                          onChange={e => setIsEditingProduct({ ...isEditingProduct, imageUrl: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-white/20 uppercase mb-2 block">Descripción</label>
                    <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 resize-none" value={isEditingProduct.description || ''} onChange={e => setIsEditingProduct({ ...isEditingProduct, description: e.target.value })} />
                  </div>
                </div>
                <button onClick={() => {
                  upsertProduct({
                    ...isEditingProduct,
                    id: isEditingProduct.id || Math.random().toString(36).substr(2, 9),
                    isActive: true,
                    extras: isEditingProduct.extras || []
                  });
                  setIsEditingProduct(null);
                }} className="md:col-span-2 w-full bg-[#10a37f] text-white py-6 rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl">Confirmar Producto</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};
