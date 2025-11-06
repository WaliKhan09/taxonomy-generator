// public/js/tabs.js
console.log("✅ tabs.js loaded and running");

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM ready");

  const updateBtn = document.getElementById("updateCode");
  const copyBtn = document.getElementById("copyBtn");
  const generatedCodeEl = document.getElementById("generatedCode");
  const form = document.getElementById("genForm");

  if (!updateBtn || !form) {
    console.error("❌ Button or form not found");
    return;
  }

  // Highlight initial code once
  if (window.Prism && generatedCodeEl) {
    Prism.highlightElement(generatedCodeEl);
  }

  // Helper: collect form data into nested JSON
  function collectFormData() {
    const fd = new FormData(form);
    const obj = {};
    for (const [name, value] of fd.entries()) {
      const match = name.match(/^([^\[]+)\[?([^\]]*)\]?$/);
      if (match) {
        const parent = match[1];
        const child = match[2];
        if (child) {
          obj[parent] = obj[parent] || {};
          obj[parent][child] = value;
        } else {
          obj[parent] = value;
        }
      } else {
        obj[name] = value;
      }
    }
    return obj;
  }

  // 🔄 Update Code button
  updateBtn.addEventListener("click", async () => {
    console.log("🟢 Update button clicked");
    const payload = collectFormData();
    console.log("📦 Sending payload:", payload);

    try {
      const res = await fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Server returned error " + res.status);
      const json = await res.json();

      if (json && json.code) {
        generatedCodeEl.textContent = json.code;
        if (window.Prism) Prism.highlightElement(generatedCodeEl);
        console.log("✅ Code updated successfully");
      } else {
        alert("No valid code received.");
      }
    } catch (err) {
      console.error("⚠️ Error updating code:", err);
      alert("Failed to update code. Check console for details.");
    }
  });

  // 📋 Copy button
  copyBtn?.addEventListener("click", async () => {
    const code = generatedCodeEl?.textContent || "";
    if (!code.trim()) return alert("No code to copy.");
    try {
      await navigator.clipboard.writeText(code);
      copyBtn.textContent = "Copied ✓";
      setTimeout(() => (copyBtn.textContent = "Copy"), 1200);
    } catch (err) {
      alert("Copy failed.");
    }
  });
});
