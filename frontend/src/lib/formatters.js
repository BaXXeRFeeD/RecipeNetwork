import { CATEGORY_LABELS, ROLE_LABELS } from './constants';

export function formatCategory(category) {
  return CATEGORY_LABELS[category] ?? category;
}

export function formatRole(role) {
  return ROLE_LABELS[role] ?? role;
}

export function formatDate(dateString) {
  if (!dateString) {
    return '';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
}
