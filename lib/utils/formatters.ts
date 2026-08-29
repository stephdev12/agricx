export function formatFcfa(amount: number): string {
  if (isNaN(amount)) return '0 FCFA';
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA';
}

export function formatNumber(value: number): string {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat('fr-FR').format(value);
}

export function cleanCameroonPhone(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('237')) return digits;
  if (digits.length === 9) return '237' + digits;
  return digits;
}

export function generateWhatsAppLink(
  phone: string,
  businessName: string,
  productOrTopic?: string
): string {
  const cleaned = cleanCameroonPhone(phone);
  let message = `Bonjour ${businessName}, j'ai vu votre contact sur la plateforme AgroGuide 237.`;
  if (productOrTopic) {
    message += ` Je souhaite des informations et tarifs concernant : ${productOrTopic}.`;
  } else {
    message += ` Je souhaite des informations sur vos intrants et vos disponibilités.`;
  }
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function formatDateRelative(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 5) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;

    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}
