import type {
  CartItem,
  CheckoutDetails,
} from '../components/cart-provider';
import { storeConfig } from '../config/store';
import { formatPrice } from '../data/menu';
import { formatCurrencyValue } from './currency';

type WhatsAppOrder = {
  items: CartItem[];
  notes: string;
  total: number;
  checkoutDetails: CheckoutDetails;
};

const paymentLabels = {
  pix: 'Pix',
  card: 'Cartão',
  cash: 'Dinheiro',
};

export function buildWhatsAppOrderUrl({
  items,
  notes,
  total,
  checkoutDetails,
}: WhatsAppOrder) {
  const {
    customerName,
    street,
    houseNumber,
    neighborhood,
    addressComplement,
    paymentMethod,
    needsChange,
    changeFor,
  } = checkoutDetails;

  const itemLines = items.flatMap((item) => {
    const itemTotal = formatPrice(item.unitPrice * item.quantity);
    const lines = [`• ${item.quantity}x ${item.name} — ${itemTotal}`];

    if (item.options) {
      lines.push(...item.options.map((option) => `  ↳ ${option.label}: ${option.value}`));
    }

    return lines;
  });

  const paymentLine = paymentMethod ? paymentLabels[paymentMethod] : 'Não informado';
  const formattedChangeFor = formatCurrencyValue(changeFor);
  const messageLines = [
    `*Novo pedido — ${storeConfig.name}*`,
    '',
    '*Itens do pedido*',
    ...itemLines,
    '',
    `*Observações:* ${notes.trim() || 'Nenhuma observação.'}`,
    '',
    '*Dados para entrega*',
    `*Cliente:* ${customerName}`,
    `*Endereço:* ${street}, ${houseNumber} — ${neighborhood}`,
  ];

  if (addressComplement.trim()) {
    messageLines.push(`*Complemento:* ${addressComplement.trim()}`);
  }

  messageLines.push('', '*Pagamento*', `*Forma:* ${paymentLine}`);

  if (paymentMethod === 'cash') {
    messageLines.push(`*Troco:* ${needsChange === 'yes' ? `Para ${formattedChangeFor}` : 'Não precisa'}`);
  }

  messageLines.push('', `*Total do pedido:* ${formatPrice(total)}`);

  return `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(messageLines.join('\n'))}`;
}
