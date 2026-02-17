
import { CartItem, Settings } from '../types';

export const generateWhatsAppLink = (
  cart: CartItem[],
  settings: Settings,
  customerInfo: { name: string; address: string; method: string }
) => {
  const { restaurantName, currency } = settings;
  const whatsappNumber = '541172023171'; // Requested specific number
  const { name, address, method } = customerInfo;

  let message = `🍕 *PEDIDO - ${restaurantName}*\n\n`;
  message += `👤 *Nombre:* ${name}\n`;
  message += `📍 *Dirección:* ${address}\n`;
  message += `🛵 *Tipo:* ${method === 'delivery' ? 'Envío a domicilio' : 'Retiro por local'}\n\n`;
  message += `🛒 *Detalle:*\n`;

  let total = 0;

  cart.forEach((item) => {
    const extrasTotal = item.selectedExtras.reduce((acc, e) => acc + e.price, 0);
    const itemTotal = (item.price + extrasTotal) * item.quantity;
    total += itemTotal;

    message += `• ${item.quantity}x *${item.name}* (${currency}${item.price.toLocaleString()})\n`;
    if (item.selectedExtras.length > 0) {
      item.selectedExtras.forEach(extra => {
        message += `  + ${extra.name} (+${currency}${extra.price.toLocaleString()})\n`;
      });
    }
    message += `  _Subtotal: ${currency}${itemTotal.toLocaleString()}_\n\n`;
  });

  message += `🏁 *TOTAL A PAGAR: ${currency}${total.toLocaleString()}*\n\n`;
  message += `¡Muchas gracias!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
};
