
import { CartItem, Settings } from '../types';

export const generateWhatsAppLink = (
  cart: CartItem[], 
  settings: Settings, 
  customerInfo: { name: string; address: string; method: string }
) => {
  const { restaurantName, whatsappNumber, currency } = settings;
  const { name, address, method } = customerInfo;

  let message = `🍕 *NUEVO PEDIDO - ${restaurantName}*\n\n`;
  message += `👤 *Cliente:* ${name}\n`;
  message += `📍 *Dirección:* ${address}\n`;
  message += `🛵 *Método:* ${method === 'delivery' ? 'Envío a domicilio' : 'Retiro en local'}\n\n`;
  message += `🛒 *Detalle del Pedido:*\n`;

  let total = 0;

  cart.forEach((item) => {
    const extrasTotal = item.selectedExtras.reduce((acc, e) => acc + e.price, 0);
    const itemTotal = (item.price + extrasTotal) * item.quantity;
    total += itemTotal;

    message += `- ${item.quantity}x *${item.name}* (${currency}${item.price.toLocaleString()})\n`;
    if (item.selectedExtras.length > 0) {
      item.selectedExtras.forEach(extra => {
        message += `  + ${extra.name} (+${currency}${extra.price.toLocaleString()})\n`;
      });
    }
    message += `  _Subtotal: ${currency}${itemTotal.toLocaleString()}_\n\n`;
  });

  message += `💰 *TOTAL A PAGAR: ${currency}${total.toLocaleString()}*\n\n`;
  message += `_Enviado desde el Menú Digital Premium_`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
};
