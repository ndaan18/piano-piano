// Small shared DOM helpers. No DOM access at import time.

/** HTML-escape any value for use in markup (text or attribute). */
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export const PLAY_ICON = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2l10 6-10 6z" fill="currentColor"/></svg>';

/** Register chip for exercises and examples: pink informal, ultramarine formal, fog neutral. */
export function regChip(reg) {
  if (reg === 'tu') return '<span class="chip chip--tu">informal · tu</span>';
  if (reg === 'lei') return '<span class="chip chip--lei">formal · Lei</span>';
  return '<span class="chip">neutral</span>';
}
