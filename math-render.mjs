import katex from './assets/vendor/katex/katex.mjs';

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function equationHTML(tex, fallback = '', display = true) {
  if (!tex) return escapeHTML(fallback);
  try {
    return katex.renderToString(tex, {
      displayMode: display,
      output: 'htmlAndMathml',
      throwOnError: true,
      trust: false,
      strict: 'ignore',
      maxExpand: 1000,
    });
  } catch {
    return `<span class="math-fallback">${escapeHTML(fallback)}</span>`;
  }
}

export function workingHTML(tex, fallback) {
  return `<div class="math-block" tabindex="0" aria-label="Mathematical working">${equationHTML(tex, fallback)}</div>`;
}

export function promptHTML(question) {
  if (!question.promptParts) return `<p class="question-prompt">${escapeHTML(question.prompt)}</p>`;
  return `<div class="question-prompt">${question.promptParts.map(part => {
    if (typeof part.text === 'string') return `<span>${escapeHTML(part.text)}</span>`;
    return part.display ? `<div class="prompt-equation" tabindex="0">${equationHTML(part.tex, '', true)}</div>` : equationHTML(part.tex, '', false);
  }).join('')}</div>`;
}
