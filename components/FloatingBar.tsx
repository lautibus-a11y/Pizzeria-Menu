
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { ShoppingCart, PackageCheck, Zap } from 'lucide-react';

export const FloatingBar: React.FC = () => {
    const { cart, orders, activeOrderId, settings } = useStore();

    const cartTotal = cart.reduce((acc, item) => {
        const extrasTotal = item.selectedExtras.reduce((sum, e) => sum + e.price, 0);
        return acc + (item.price + extrasTotal) * item.quantity;
    }, 0);

    const activeOrder = orders.find(o => o.id === activeOrderId);

    const statusColors = {
        'pendiente': 'text-yellow-500',
        'preparacion': 'text-orange-500',
        'en camino': 'text-blue-500',
        'entregado': 'text-green-500'
    };

    const statusIcons = {
        'pendiente': <Zap size={14} />,
        'preparacion': <Zap size={14} className="animate-pulse" />,
        'en camino': <PackageCheck size={14} />,
        'entregado': <PackageCheck size={14} />
    };

    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-lg">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
                {/* Total Gastado (Izquierda) */}
                <div className="flex flex-col pl-6">
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">
                        {cartTotal > 0 ? 'Gastando' : 'Carta Online'}
                    </span>
                    <span className="text-xl font-header text-white">
                        {cartTotal > 0 ? `${settings.currency}${cartTotal.toLocaleString()}` : '0.00'}
                    </span>
                </div>

                {/* Logo Carrito (Centro) */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => window.location.hash = '#cart'}
                    className="w-16 h-16 bg-[#e31c1c] rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(227,28,28,0.4)] relative"
                >
                    <ShoppingCart size={24} />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-4 border-black">
                            {cart.length}
                        </span>
                    )}
                </motion.button>

                {/* Estado Pedido (Derecha) */}
                <div className="flex flex-col pr-6 text-right w-32">
                    {activeOrder ? (
                        <>
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Tu Pedido</span>
                            <div className={`flex items-center justify-end gap-2 text-[10px] font-black uppercase tracking-tighter ${statusColors[activeOrder.status]}`}>
                                {statusIcons[activeOrder.status]}
                                {activeOrder.status}
                            </div>
                        </>
                    ) : (
                        <>
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">
                                {cartTotal > 0 ? 'Carrito' : 'Hambriento?'}
                            </span>
                            <span className="text-[10px] font-black text-white/60 uppercase tracking-tighter">
                                {cartTotal > 0 ? 'Listo para enviar' : 'Elige tu cena'}
                            </span>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
