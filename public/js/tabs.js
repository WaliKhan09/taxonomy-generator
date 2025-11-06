// public/js/tabs.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ tabs.js running');

  const generateAjaxBtn = document.getElementById('generateAjax');
  const copyBtn = document.getElementById('copyBtn');
  const form = document.getElementById('genForm');
  const generatedEl = document.getElementById('generatedCode');

  // Safely set code text and highlight using Prism.highlight (avoids highlightElement internals)
  function setCodeAndHighlight(codeText) {
    if (!generatedEl) return;
    // Put raw text into code element first (prevents accidental HTML injection)
    generatedEl.textContent = codeText;

    if (window.Prism && Prism.languages && Prism.languages.php) {
      try {
        // Use Prism.highlight() with php grammar and set innerHTML — safer than highlightElement
        const html = Prism.highlight(codeText, Prism.languages.php, 'php');
        generatedEl.innerHTML = html;
        // If you use the line-numbers plugin, it expects the <pre> wrapper class; we only set code.innerHTML here.
        console.log('✅ Prism.highlight applied (via highlight())');
        return;
      } catch (err) {
        console.warn('⚠️ Prism.highlight failed, falling back to plain text:', err?.message || err);
      }
    } else {
      console.warn('⚠️ Prism or Prism.languages.php not available — showing plain code');
    }
    // fallback: leave as textContent so code is visible (no colors)
  }

  // 🟢 Generate / Update button
  generateAjaxBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log('🔄 Update Code clicked');
    const data = formToObject(form);

    try {
      const res = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();

      if (json && json.code) {
        setCodeAndHighlight(json.code);
        console.log('✅ Code updated successfully');
      } else {
        alert('Error: no code returned.');
      }
    } catch (err) {
      console.error('⚠️ Generation failed:', err);
      alert('Error generating snippet.');
    }
  });

  // 📋 Copy button
  copyBtn?.addEventListener('click', async () => {
    console.log('📋 Copy button clicked');
    const code = generatedEl?.textContent || '';
    if (!code.trim()) return alert('No code to copy.');

    try {
      await navigator.clipboard.writeText(code);
      copyBtn.textContent = 'Copied ✓';
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1500);
      console.log('✅ Code copied to clipboard');
    } catch (err) {
      console.error('❌ Copy failed', err);
      alert('Copy failed.');
    }
  });

  // simple form -> object that preserves bracketed names (flat)
  function formToObject(formEl) {
    const fd = new FormData(formEl);
    const obj = {};
    for (const [k, v] of fd.entries()) {
      obj[k] = v;
    }
    return obj;
  }

  // Highlight initial code on load (if present)
  if (generatedEl && generatedEl.textContent && generatedEl.textContent.trim().length > 0) {
    setCodeAndHighlight(generatedEl.textContent);
  }
});
