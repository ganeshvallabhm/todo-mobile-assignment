export const formatDisplayDateTime = (iso?: string | null): string => {
  if (!iso) return '—';

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
  const year = date.getFullYear();
  const hour12 = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = date.getHours() >= 12 ? 'PM' : 'AM';

  return `${day} ${month} ${year}, ${hour12}:${minutes} ${period}`;
};
