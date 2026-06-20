/**
 * enhancements.js — PGE/RJ Exam Prep Platform Enhancement Module
 * Self-contained IIFE: dashboard, animations, multiple drafts,
 * keyboard shortcuts, export/import, TTS, and activity logging.
 */
(() => {
  "use strict";

  /* ─── Utility helpers ─── */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const store = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private / quota */ }
    }
  };

  const today = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  /* ═══════════════════════════════════════════════════════════
     0. INJECT CSS — all visual styles for enhancements
     ═══════════════════════════════════════════════════════════ */
  function injectStyles() {
    const css = document.createElement("style");
    css.id = "enhancements-css";
    css.textContent = `
      /* ── Dashboard Cards ── */
      #dashboard-panel { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1rem; margin:2rem 0; }
      .dash-card { background:var(--card,#fff); border:1px solid var(--border,#e2e8f0);
        border-radius:14px; padding:1.5rem; text-align:center;
        box-shadow:0 2px 12px rgba(0,0,0,.06); transition:transform .25s,box-shadow .25s; }
      .dash-card:hover { transform:translateY(-3px); box-shadow:0 6px 24px rgba(0,0,0,.1); }
      .dash-card .dash-icon { font-size:1.6rem; margin-bottom:.5rem; display:block; }
      .dash-card .dash-value { font-size:2rem; font-weight:800; line-height:1.1;
        background:linear-gradient(135deg,#4f8cff,#7c3aed); -webkit-background-clip:text;
        -webkit-text-fill-color:transparent; background-clip:text; }
      .dash-card .dash-label { font-size:.82rem; opacity:.7; margin-top:.35rem; }
      .dash-card .mini-chart { display:flex; align-items:flex-end; gap:3px; justify-content:center; height:40px; margin-top:.6rem; }
      .dash-card .mini-bar { width:14px; border-radius:3px 3px 0 0;
        background:linear-gradient(180deg,#7c3aed,#4f8cff); transition:height .6s ease; }

      /* ── Animated counter ── */
      @keyframes countPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
      .counter-done { animation:countPulse .3s ease; }

      /* ── Stagger-in animation ── */
      @keyframes staggerFadeIn {
        from { opacity:0; transform:translateY(18px); }
        to   { opacity:1; transform:translateY(0); }
      }
      .stagger-in { animation:staggerFadeIn .5s ease both; }

      /* ── Reading progress bar ── */
      #reading-progress { position:sticky; top:0; z-index:50; height:3px;
        background:var(--border,#e2e8f0); border-radius:0 0 4px 4px; overflow:hidden; }
      #reading-progress .bar-fill { height:100%; width:0%;
        background:linear-gradient(90deg,#4f8cff,#7c3aed); transition:width .12s linear; border-radius:0 3px 3px 0; }

      /* ── Draft selector ── */
      #draft-selector { display:block; width:100%; padding:.65rem .85rem;
        border:1px solid var(--border,#e2e8f0); border-radius:10px;
        background:var(--card,#fff); color:inherit; font-size:.88rem;
        margin-bottom:.75rem; cursor:pointer; transition:border-color .2s; }
      #draft-selector:focus { border-color:#4f8cff; outline:none; box-shadow:0 0 0 3px rgba(79,140,255,.18); }

      /* ── Keyboard help overlay ── */
      #keyboard-help { position:fixed; inset:0; z-index:10000;
        display:none; align-items:center; justify-content:center;
        background:rgba(0,0,0,.55); backdrop-filter:blur(6px); }
      #keyboard-help.visible { display:flex; }
      #keyboard-help .kbd-inner { background:var(--card,#fff); color:var(--text,#1a1a2e);
        border-radius:18px; padding:2rem 2.5rem; max-width:520px; width:92%;
        box-shadow:0 16px 60px rgba(0,0,0,.25); max-height:80vh; overflow-y:auto; }
      #keyboard-help h2 { margin:0 0 1rem; font-size:1.3rem; }
      #keyboard-help .kbd-row { display:flex; justify-content:space-between;
        padding:.45rem 0; border-bottom:1px solid var(--border,#e2e8f0); font-size:.9rem; }
      #keyboard-help kbd { display:inline-block; padding:.15rem .55rem; border-radius:5px;
        background:var(--border,#e2e8f0); font-family:inherit; font-size:.82rem;
        font-weight:600; min-width:28px; text-align:center; }
      #keyboard-help .kbd-close { margin-top:1.2rem; text-align:center; }
      #keyboard-help .kbd-close button { background:linear-gradient(135deg,#4f8cff,#7c3aed);
        color:#fff; border:none; padding:.55rem 1.6rem; border-radius:10px;
        font-size:.88rem; cursor:pointer; font-weight:600; }

      /* ── Export/Import panel ── */
      #export-import-panel { margin:2rem 0; padding:1.5rem; border-radius:14px;
        background:var(--card,#fff); border:1px solid var(--border,#e2e8f0);
        box-shadow:0 2px 12px rgba(0,0,0,.06); }
      #export-import-panel h3 { margin:0 0 1rem; font-size:1.1rem; }
      .eip-actions { display:flex; gap:1rem; flex-wrap:wrap; align-items:center; }
      .eip-btn { padding:.6rem 1.4rem; border:none; border-radius:10px; font-size:.88rem;
        font-weight:600; cursor:pointer; transition:transform .2s,box-shadow .2s; }
      .eip-btn:hover { transform:translateY(-2px); box-shadow:0 4px 16px rgba(0,0,0,.12); }
      .eip-export { background:linear-gradient(135deg,#4f8cff,#7c3aed); color:#fff; }
      .eip-import { background:var(--border,#e2e8f0); color:var(--text,#1a1a2e); }
      .eip-import input[type=file] { display:none; }
      .eip-meta { font-size:.8rem; opacity:.65; margin-top:.75rem; }

      /* ── TTS button ── */
      #tts-btn { position:fixed; bottom:2rem; right:2rem; z-index:900;
        width:52px; height:52px; border-radius:50%; border:none;
        background:linear-gradient(135deg,#4f8cff,#7c3aed); color:#fff;
        font-size:1.3rem; cursor:pointer; box-shadow:0 4px 20px rgba(79,140,255,.35);
        display:none; align-items:center; justify-content:center;
        transition:transform .25s,box-shadow .25s; }
      #tts-btn:hover { transform:scale(1.08); box-shadow:0 6px 28px rgba(79,140,255,.45); }
      #tts-btn.speaking { animation:ttsPulse 1.2s ease infinite; }
      @keyframes ttsPulse { 0%,100%{box-shadow:0 4px 20px rgba(79,140,255,.35)}
        50%{box-shadow:0 4px 30px rgba(124,58,237,.55)} }
      #tts-btn.visible { display:flex; }

      /* ── Dark-mode overrides for enhancement panels ── */
      [data-theme="dark"] .dash-card,
      [data-theme="dark"] #export-import-panel,
      [data-theme="dark"] #keyboard-help .kbd-inner {
        background:var(--card,#1e293b); border-color:var(--border,#334155);
      }
      [data-theme="dark"] #draft-selector {
        background:var(--card,#1e293b); border-color:var(--border,#334155); color:var(--text,#e2e8f0);
      }
    `;
    document.head.appendChild(css);
  }


  /* ═══════════════════════════════════════════════════════════
     7. ACTIVITY LOGGER  (runs first so data is ready)
     ═══════════════════════════════════════════════════════════ */
  function logActivity() {
    // Log today's date
    const log = store.get("pge-activity-log", []);
    const t = today();
    if (log[log.length - 1] !== t) {
      log.push(t);
      store.set("pge-activity-log", log);
    }
  }

  /** Hook into the existing writing timer to accumulate study time.
   *  We observe the timer display and count active seconds. */
  function hookTimerForStudyTime() {
    const timerEl = $("#writing-timer");
    if (!timerEl) return;

    let lastText = timerEl.textContent;
    // Use MutationObserver to detect when the timer ticks
    const obs = new MutationObserver(() => {
      const cur = timerEl.textContent;
      if (cur !== lastText) {
        // Timer changed → it's running → add 1 second
        const total = store.get("pge-study-time", 0);
        store.set("pge-study-time", total + 1);
        lastText = cur;
      }
    });
    obs.observe(timerEl, { childList: true, characterData: true, subtree: true });
  }

  /** Hook rubric score changes to push history */
  function hookRubricHistory() {
    const scoreEl = $("#rubric-score");
    if (!scoreEl) return;

    let lastScore = scoreEl.textContent;
    const obs = new MutationObserver(() => {
      const cur = scoreEl.textContent;
      if (cur !== lastScore && +cur > 0) {
        lastScore = cur;
        const history = store.get("pge-rubric-history", []);
        history.push(+cur);
        if (history.length > 20) history.splice(0, history.length - 20);
        store.set("pge-rubric-history", history);
      }
    });
    obs.observe(scoreEl, { childList: true, characterData: true, subtree: true });
  }


  /* ═══════════════════════════════════════════════════════════
     1. DASHBOARD DE DESEMPENHO
     ═══════════════════════════════════════════════════════════ */
  function calculateStreak() {
    const log = store.get("pge-activity-log", []);
    if (!log.length) return 0;
    const unique = [...new Set(log)].sort().reverse();
    let streak = 0;
    const d = new Date();
    for (const dateStr of unique) {
      const expected = d.toISOString().slice(0, 10);
      if (dateStr === expected) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  function formatStudyTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}min`;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return m ? `${h}h${m}m` : `${h}h`;
  }

  function countQuestionsAnswered() {
    // Count from flashcard state if it exists
    const fc = store.get("pge-flashcard-state", {});
    if (typeof fc === "object" && fc !== null) {
      return Object.keys(fc).length;
    }
    return 0;
  }

  function renderDashboard() {
    const panel = $("#dashboard-panel");
    if (!panel) return;

    const streak = calculateStreak();
    const studyTime = store.get("pge-study-time", 0);
    const questionsAnswered = countQuestionsAnswered();
    const rubricHistory = store.get("pge-rubric-history", []);
    const last5 = rubricHistory.slice(-5);

    const maxRubric = 100;

    panel.innerHTML = `
      <div class="dash-card">
        <span class="dash-icon">🔥</span>
        <div class="dash-value" data-count="${streak}">${streak}</div>
        <div class="dash-label">dias consecutivos</div>
      </div>
      <div class="dash-card">
        <span class="dash-icon">⏱️</span>
        <div class="dash-value">${formatStudyTime(studyTime)}</div>
        <div class="dash-label">tempo de estudo</div>
      </div>
      <div class="dash-card">
        <span class="dash-icon">📝</span>
        <div class="dash-value" data-count="${questionsAnswered}">${questionsAnswered}</div>
        <div class="dash-label">questões respondidas</div>
      </div>
      <div class="dash-card">
        <span class="dash-icon">📊</span>
        <div class="dash-value">${last5.length ? last5[last5.length - 1] : "—"}</div>
        <div class="dash-label">última nota (rubrica)</div>
        ${last5.length ? `<div class="mini-chart">${last5.map(v =>
          `<div class="mini-bar" style="height:${Math.max(4, (v / maxRubric) * 36)}px"></div>`
        ).join("")}</div>` : ""}
      </div>
    `;
  }


  /* ═══════════════════════════════════════════════════════════
     2. MICRO-ANIMATIONS
     ═══════════════════════════════════════════════════════════ */

  /* 2a. Animated number counters */
  function setupAnimatedCounters() {
    const targets = $$(".metric-strip strong");
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.target.dataset.counted) return;
        entry.target.dataset.counted = "1";
        const final = parseInt(entry.target.textContent, 10);
        if (isNaN(final)) return;
        animateCount(entry.target, 0, final, 1500);
      });
    }, { threshold: 0.3 });

    targets.forEach(el => {
      el.dataset.finalValue = el.textContent;
      observer.observe(el);
    });
  }

  function animateCount(el, start, end, duration) {
    const startTime = performance.now();
    const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const val = Math.round(start + (end - start) * ease(progress));
      el.textContent = val;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = end;
        el.classList.add("counter-done");
      }
    }
    el.textContent = start;
    requestAnimationFrame(tick);
  }

  /* 2b. Stagger-in cards on view change */
  function setupStaggerCards() {
    const applyStagger = () => {
      const active = $(".view.active-view");
      if (!active) return;
      const cards = $$("article, .dash-card, .phase-card, .day-card, .sim-card, .insight-card, .pattern-card, .dna-main, .command-card", active);
      cards.forEach((card, i) => {
        card.classList.remove("stagger-in");
        // Force reflow
        void card.offsetWidth;
        card.style.animationDelay = `${i * 0.06}s`;
        card.classList.add("stagger-in");
      });
    };

    window.addEventListener("hashchange", () => setTimeout(applyStagger, 50));
    // Run once initially
    setTimeout(applyStagger, 300);
  }

  /* 2c. Reading progress bar */
  function setupReadingProgress() {
    const apostilaSection = $("#apostila");
    if (!apostilaSection) return;

    const progressDiv = document.createElement("div");
    progressDiv.id = "reading-progress";
    progressDiv.innerHTML = '<div class="bar-fill"></div>';
    apostilaSection.insertBefore(progressDiv, apostilaSection.firstChild);

    const barFill = $(".bar-fill", progressDiv);
    const content = $(".library-content");
    if (!content) return;

    const updateProgress = () => {
      // Only track when apostila is the active view
      if (!apostilaSection.classList.contains("active-view")) return;

      const rect = content.getBoundingClientRect();
      const viewH = window.innerHeight;
      const total = content.scrollHeight;
      // How much of the content has scrolled past the top
      const scrolled = Math.max(0, -rect.top);
      const scrollable = total - viewH;
      const pct = scrollable > 0 ? Math.min(100, (scrolled / scrollable) * 100) : 0;
      barFill.style.width = `${pct}%`;
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("hashchange", () => requestAnimationFrame(updateProgress));
  }


  /* ═══════════════════════════════════════════════════════════
     3. MULTIPLE DRAFTS
     ═══════════════════════════════════════════════════════════ */
  function setupMultipleDrafts() {
    const textarea = $("#answer-draft");
    const editor = $(".writing-editor");
    const titleEl = $("#writing-case-title");
    if (!textarea || !editor || !titleEl) return;

    // Create the draft selector
    const selector = document.createElement("select");
    selector.id = "draft-selector";
    editor.insertBefore(selector, textarea);

    function getCaseTitle() {
      return (titleEl.textContent || "").trim();
    }

    function getDrafts() {
      return store.get("pge-drafts", {});
    }

    function saveDraft() {
      const title = getCaseTitle();
      if (!title) return;
      const drafts = getDrafts();
      const text = textarea.value;
      const words = (text.trim().match(/\S+/g) || []).length;
      drafts[title] = {
        text,
        date: new Date().toLocaleDateString("pt-BR"),
        words
      };
      store.set("pge-drafts", drafts);
      // Also keep legacy key in sync
      store.set("pge-draft", text);
      updateSelector();
    }

    function loadDraft(title) {
      const drafts = getDrafts();
      if (drafts[title]) {
        textarea.value = drafts[title].text;
      } else {
        textarea.value = "";
      }
      // Update word count via the existing mechanism
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }

    function updateSelector() {
      const drafts = getDrafts();
      const current = getCaseTitle();
      const keys = Object.keys(drafts);
      selector.innerHTML = "";

      // New draft option
      const newOpt = document.createElement("option");
      newOpt.value = "__new__";
      newOpt.textContent = "✨ Novo rascunho";
      selector.appendChild(newOpt);

      // Existing drafts
      keys.forEach(title => {
        const opt = document.createElement("option");
        opt.value = title;
        const d = drafts[title];
        opt.textContent = `${title} · ${d.date} · ${d.words} palavras`;
        if (title === current) opt.selected = true;
        selector.appendChild(opt);
      });

      // If current case has no draft yet, select "new"
      if (!keys.includes(current)) {
        selector.value = "__new__";
      }
    }

    selector.addEventListener("change", () => {
      if (selector.value === "__new__") {
        textarea.value = "";
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      } else {
        loadDraft(selector.value);
      }
    });

    // Override the textarea input handler to save to multi-draft
    textarea.addEventListener("input", () => {
      saveDraft();
    });

    // Watch for case title changes (when user clicks "Trocar caso")
    const titleObs = new MutationObserver(() => {
      const title = getCaseTitle();
      const drafts = getDrafts();
      if (drafts[title]) {
        loadDraft(title);
      } else {
        textarea.value = "";
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
      updateSelector();
    });
    titleObs.observe(titleEl, { childList: true, characterData: true, subtree: true });

    // Migrate existing single draft if present
    const legacyDraft = store.get("pge-draft", "");
    if (legacyDraft && Object.keys(getDrafts()).length === 0) {
      const title = getCaseTitle();
      if (title) {
        const drafts = {};
        drafts[title] = {
          text: legacyDraft,
          date: new Date().toLocaleDateString("pt-BR"),
          words: (legacyDraft.trim().match(/\S+/g) || []).length
        };
        store.set("pge-drafts", drafts);
      }
    }

    updateSelector();
    // Load current case draft if it exists
    const drafts = getDrafts();
    const ct = getCaseTitle();
    if (drafts[ct]) loadDraft(ct);
  }


  /* ═══════════════════════════════════════════════════════════
     4. KEYBOARD SHORTCUTS
     ═══════════════════════════════════════════════════════════ */
  function setupKeyboardShortcuts() {
    const sectionMap = {
      "1": "visao-geral",
      "2": "dna-banca",
      "3": "disciplinas",
      "4": "plano",
      "5": "escrita",
      "6": "simulados",
      "7": "revisao",
      "8": "mapas-mentais",
      "9": "flashcards",
      "0": "apostila"
    };

    // Build the ordered sections list from nav links for arrow navigation
    const navSections = $$(".nav-link").map(a => a.getAttribute("href").slice(1));

    // Create keyboard help overlay
    const overlay = document.createElement("div");
    overlay.id = "keyboard-help";
    overlay.innerHTML = `
      <div class="kbd-inner">
        <h2>⌨️ Atalhos de teclado</h2>
        <div class="kbd-row"><span>Seção anterior</span><kbd>←</kbd></div>
        <div class="kbd-row"><span>Próxima seção</span><kbd>→</kbd></div>
        <div class="kbd-row"><span>Visão geral</span><kbd>1</kbd></div>
        <div class="kbd-row"><span>DNA da banca</span><kbd>2</kbd></div>
        <div class="kbd-row"><span>Disciplinas</span><kbd>3</kbd></div>
        <div class="kbd-row"><span>Plano de 24 semanas</span><kbd>4</kbd></div>
        <div class="kbd-row"><span>Laboratório de escrita</span><kbd>5</kbd></div>
        <div class="kbd-row"><span>Simulados</span><kbd>6</kbd></div>
        <div class="kbd-row"><span>Revisão final</span><kbd>7</kbd></div>
        <div class="kbd-row"><span>Mapas mentais</span><kbd>8</kbd></div>
        <div class="kbd-row"><span>Flashcards</span><kbd>9</kbd></div>
        <div class="kbd-row"><span>Apostila integral</span><kbd>0</kbd></div>
        <div class="kbd-row"><span>Alternar modo escuro</span><kbd>D</kbd></div>
        <div class="kbd-row"><span>Mostrar atalhos</span><kbd>?</kbd></div>
        <div class="kbd-row"><span>Buscar</span><kbd>Ctrl</kbd> + <kbd>K</kbd></div>
        <div class="kbd-close"><button type="button">Fechar</button></div>
      </div>
    `;
    document.body.appendChild(overlay);

    $(".kbd-close button", overlay).addEventListener("click", () => {
      overlay.classList.remove("visible");
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("visible");
    });

    function isTyping() {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      return tag === "input" || tag === "textarea" || tag === "select" ||
             document.activeElement?.isContentEditable;
    }

    function getCurrentSectionIndex() {
      const current = location.hash.slice(1) || "visao-geral";
      const idx = navSections.indexOf(current);
      return idx >= 0 ? idx : 0;
    }

    document.addEventListener("keydown", (e) => {
      // Don't intercept when typing in inputs
      if (isTyping()) return;
      // Don't intercept if Ctrl/Meta is held (except for our combos)
      if (e.ctrlKey || e.metaKey) return;

      const key = e.key;

      // Arrow navigation
      if (key === "ArrowLeft") {
        e.preventDefault();
        const idx = getCurrentSectionIndex();
        const prev = Math.max(0, idx - 1);
        location.hash = navSections[prev];
        return;
      }
      if (key === "ArrowRight") {
        e.preventDefault();
        const idx = getCurrentSectionIndex();
        const next = Math.min(navSections.length - 1, idx + 1);
        location.hash = navSections[next];
        return;
      }

      // Number keys → section jump
      if (sectionMap[key]) {
        e.preventDefault();
        const target = sectionMap[key];
        // Only navigate if section exists
        if (document.getElementById(target)) {
          location.hash = target;
        }
        return;
      }

      // D → toggle dark mode
      if (key === "d" || key === "D") {
        e.preventDefault();
        const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
        document.documentElement.dataset.theme = next;
        store.set("pge-theme", next);
        return;
      }

      // ? → help overlay
      if (key === "?") {
        e.preventDefault();
        overlay.classList.toggle("visible");
        return;
      }
    });
  }


  /* ═══════════════════════════════════════════════════════════
     5. EXPORT / IMPORT PROGRESS
     ═══════════════════════════════════════════════════════════ */
  function setupExportImport() {
    const panel = $("#export-import-panel");
    if (!panel) return;

    const lastExport = store.get("pge-last-export", null);

    panel.innerHTML = `
      <h3>📦 Exportar / Importar progresso</h3>
      <div class="eip-actions">
        <button class="eip-btn eip-export" id="btn-export">Exportar progresso</button>
        <label class="eip-btn eip-import">
          Importar progresso
          <input type="file" accept=".json" id="btn-import" />
        </label>
      </div>
      <div class="eip-meta" id="eip-meta">${lastExport ? `Última exportação: ${lastExport}` : "Nenhuma exportação realizada ainda."}</div>
    `;

    // Export
    $("#btn-export").addEventListener("click", () => {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("pge-")) {
          data[key] = localStorage.getItem(key);
        }
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStr = today();
      a.href = url;
      a.download = `pge-progresso-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      store.set("pge-last-export", new Date().toLocaleDateString("pt-BR"));
      $("#eip-meta").textContent = `Última exportação: ${new Date().toLocaleDateString("pt-BR")}`;
    });

    // Import
    $("#btn-import").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (typeof data !== "object" || data === null) throw new Error("Invalid format");
          // Restore all keys
          for (const [key, value] of Object.entries(data)) {
            if (key.startsWith("pge-")) {
              localStorage.setItem(key, value);
            }
          }
          alert("Progresso importado com sucesso! A página será recarregada.");
          location.reload();
        } catch (err) {
          alert("Erro ao importar: arquivo inválido. Certifique-se de que é um JSON exportado por esta plataforma.");
        }
      };
      reader.readAsText(file);
    });
  }


  /* ═══════════════════════════════════════════════════════════
     6. TEXT-TO-SPEECH (Web Speech API)
     ═══════════════════════════════════════════════════════════ */
  function setupTTS() {
    if (!("speechSynthesis" in window)) return;

    const btn = document.createElement("button");
    btn.id = "tts-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Ouvir conteúdo");
    btn.innerHTML = "🔊";
    document.body.appendChild(btn);

    let speaking = false;
    let paused = false;

    function getPortugueseVoice() {
      const voices = speechSynthesis.getVoices();
      return voices.find(v => v.lang.startsWith("pt")) || voices[0] || null;
    }

    function updateVisibility() {
      const apostilaActive = $("#apostila")?.classList.contains("active-view");
      btn.classList.toggle("visible", !!apostilaActive);
      if (!apostilaActive && speaking) {
        speechSynthesis.cancel();
        speaking = false;
        paused = false;
        btn.innerHTML = "🔊";
        btn.classList.remove("speaking");
      }
    }

    btn.addEventListener("click", () => {
      if (speaking && !paused) {
        // Pause
        speechSynthesis.pause();
        paused = true;
        btn.innerHTML = "▶️";
        btn.classList.remove("speaking");
        return;
      }
      if (speaking && paused) {
        // Resume
        speechSynthesis.resume();
        paused = false;
        btn.innerHTML = "⏸️";
        btn.classList.add("speaking");
        return;
      }

      // Start new
      const content = $(".library-content");
      if (!content) return;
      const text = content.innerText || content.textContent;
      if (!text.trim()) return;

      // Split into chunks (speechSynthesis has limits on utterance length)
      const chunks = [];
      const maxLen = 800;
      let remaining = text;
      while (remaining.length > 0) {
        if (remaining.length <= maxLen) {
          chunks.push(remaining);
          break;
        }
        // Find a good break point
        let breakIdx = remaining.lastIndexOf(". ", maxLen);
        if (breakIdx < maxLen / 2) breakIdx = remaining.lastIndexOf(" ", maxLen);
        if (breakIdx < maxLen / 2) breakIdx = maxLen;
        chunks.push(remaining.slice(0, breakIdx + 1));
        remaining = remaining.slice(breakIdx + 1);
      }

      let chunkIdx = 0;
      function speakNext() {
        if (chunkIdx >= chunks.length) {
          speaking = false;
          paused = false;
          btn.innerHTML = "🔊";
          btn.classList.remove("speaking");
          return;
        }
        const utterance = new SpeechSynthesisUtterance(chunks[chunkIdx]);
        const voice = getPortugueseVoice();
        if (voice) utterance.voice = voice;
        utterance.lang = "pt-BR";
        utterance.rate = 1.0;
        utterance.onend = () => { chunkIdx++; speakNext(); };
        utterance.onerror = () => {
          speaking = false;
          paused = false;
          btn.innerHTML = "🔊";
          btn.classList.remove("speaking");
        };
        speechSynthesis.speak(utterance);
      }

      speechSynthesis.cancel(); // Clear queue
      speaking = true;
      paused = false;
      btn.innerHTML = "⏸️";
      btn.classList.add("speaking");
      speakNext();
    });

    // Double-click to stop
    btn.addEventListener("dblclick", () => {
      speechSynthesis.cancel();
      speaking = false;
      paused = false;
      btn.innerHTML = "🔊";
      btn.classList.remove("speaking");
    });

    // Update visibility on navigation
    window.addEventListener("hashchange", () => requestAnimationFrame(updateVisibility));
    // Load voices (async on some browsers)
    speechSynthesis.addEventListener?.("voiceschanged", () => {});
    // Initial check
    setTimeout(updateVisibility, 200);
  }


  /* ═══════════════════════════════════════════════════════════
     INIT — DOMContentLoaded entry point
     ═══════════════════════════════════════════════════════════ */
  function init() {
    injectStyles();

    // Activity logging (must come first)
    logActivity();
    hookTimerForStudyTime();
    hookRubricHistory();

    // Dashboard
    renderDashboard();

    // Micro-animations
    setupAnimatedCounters();
    setupStaggerCards();
    setupReadingProgress();

    // Multiple drafts
    setupMultipleDrafts();

    // Keyboard shortcuts
    setupKeyboardShortcuts();

    // Export/Import
    setupExportImport();

    // Text-to-Speech
    setupTTS();
  }

  // Wait for DOM and for the main app to initialize
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 100));
  } else {
    setTimeout(init, 100);
  }
})();
