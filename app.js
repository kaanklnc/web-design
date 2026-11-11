(function () {
  const STORAGE_KEY = "wplab_progress_v1";
  const lessons = window.LAB_LESSONS || [];

  const state = {
    currentIdx: 0,
    activeEditorTab: "html",
    completedIds: new Set(),
    savedCode: {}
  };

  const el = {
    lessonList: document.getElementById("lessonList"),
    progressText: document.getElementById("progressText"),
    progressFill: document.getElementById("progressFill"),
    stepBadges: document.getElementById("stepBadges"),
    lessonTitle: document.getElementById("lessonTitle"),
    meaningBox: document.getElementById("meaningBox"),
    tokenStrip: document.getElementById("tokenStrip"),
    tokenDetail: document.getElementById("tokenDetail"),
    taskList: document.getElementById("taskList"),
    hintBanner: document.getElementById("hintBanner"),
    tabHtml: document.getElementById("tabHtml"),
    tabCss: document.getElementById("tabCss"),
    codeEditor: document.getElementById("codeEditor"),
    feedbackMsg: document.getElementById("feedbackMsg"),
    browserTabTitle: document.getElementById("browserTabTitle"),
    previewUrl: document.getElementById("previewUrl"),
    previewFrame: document.getElementById("previewFrame"),
    domTagsSummary: document.getElementById("domTagsSummary"),
    domCssSummary: document.getElementById("domCssSummary"),
    btnCheck: document.getElementById("btnCheck"),
    btnHint: document.getElementById("btnHint"),
    btnSolve: document.getElementById("btnSolve"),
    btnReset: document.getElementById("btnReset"),
    btnResetAll: document.getElementById("btnResetAll"),
    btnPrev: document.getElementById("btnPrev"),
    btnNext: document.getElementById("btnNext"),
    modeBtns: document.querySelectorAll(".mode-btn"),
    modePanels: document.querySelectorAll(".mode-panel"),
    xrayInput: document.getElementById("xrayInput"),
    xrayRunBtn: document.getElementById("xrayRunBtn"),
    xrayPresets: document.getElementById("xrayPresets"),
    xrayStage: document.getElementById("xrayStage"),
    xrayExplain: document.getElementById("xrayExplain"),
    bmMargin: document.getElementById("bmMargin"),
    bmBorder: document.getElementById("bmBorder"),
    bmPadding: document.getElementById("bmPadding"),
    bmWidth: document.getElementById("bmWidth"),
    bmOutline: document.getElementById("bmOutline"),
    bmMarginVal: document.getElementById("bmMarginVal"),
    bmBorderVal: document.getElementById("bmBorderVal"),
    bmPaddingVal: document.getElementById("bmPaddingVal"),
    bmWidthVal: document.getElementById("bmWidthVal"),
    bmOutlineVal: document.getElementById("bmOutlineVal"),
    bmBoxMargin: document.getElementById("bmBoxMargin"),
    bmBoxBorder: document.getElementById("bmBoxBorder"),
    bmBoxPadding: document.getElementById("bmBoxPadding"),
    bmBoxContent: document.getElementById("bmBoxContent"),
    bmCssOutput: document.getElementById("bmCssOutput"),
    simMethod: document.getElementById("simMethod"),
    simName: document.getElementById("simName"),
    simPass: document.getElementById("simPass"),
    simSendBtn: document.getElementById("simSendBtn"),
    simUrlDisplay: document.getElementById("simUrlDisplay"),
    simPacketDisplay: document.getElementById("simPacketDisplay")
  };

  function loadStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.completedIds)) {
        state.completedIds = new Set(parsed.completedIds);
      }
      if (parsed.savedCode && typeof parsed.savedCode === "object") {
        state.savedCode = parsed.savedCode;
      }
      if (typeof parsed.currentIdx === "number" && lessons[parsed.currentIdx]) {
        state.currentIdx = parsed.currentIdx;
      }
    } catch (_err) {
      // Ignore storage read errors
    }
  }

  function saveStorage() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentIdx: state.currentIdx,
          completedIds: Array.from(state.completedIds),
          savedCode: state.savedCode
        })
      );
    } catch (_err) {
      // Ignore quota errors
    }
  }

  function getLessonCode(lesson) {
    if (!state.savedCode[lesson.id]) {
      state.savedCode[lesson.id] = {
        html: lesson.starterHtml,
        css: lesson.starterCss || ""
      };
    }
    return state.savedCode[lesson.id];
  }

  function renderSidebar() {
    const groups = new Map();
    lessons.forEach((ls, idx) => {
      if (!groups.has(ls.module)) groups.set(ls.module, []);
      groups.get(ls.module).push({ lesson: ls, idx });
    });

    el.lessonList.innerHTML = "";
    groups.forEach((items, moduleName) => {
      const groupDiv = document.createElement("div");
      groupDiv.className = "module-group";

      const titleDiv = document.createElement("div");
      titleDiv.className = "module-title";
      titleDiv.textContent = moduleName;
      groupDiv.appendChild(titleDiv);

      items.forEach(({ lesson, idx }) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "lesson-item";
        if (idx === state.currentIdx) btn.classList.add("active");
        if (state.completedIds.has(lesson.id)) btn.classList.add("done");

        const num = document.createElement("span");
        num.className = "lesson-num";
        num.textContent = String(lesson.id);

        const meta = document.createElement("div");
        meta.className = "lesson-meta";

        const name = document.createElement("span");
        name.className = "lesson-name";
        name.innerHTML = lesson.title;

        const slide = document.createElement("span");
        slide.className = "lesson-slide";
        slide.textContent = lesson.examTag ? `${lesson.examTag} - ${lesson.slideRef}` : lesson.slideRef;

        meta.appendChild(name);
        meta.appendChild(slide);
        btn.appendChild(num);
        btn.appendChild(meta);

        btn.addEventListener("click", () => {
          selectLesson(idx);
        });

        groupDiv.appendChild(btn);
      });

      el.lessonList.appendChild(groupDiv);
    });

    updateProgressHeader();
  }

  function updateProgressHeader() {
    const done = state.completedIds.size;
    const total = lessons.length;
    el.progressText.textContent = `${done}/${total} Adım Tamamlandı`;
    const pct = total ? Math.round((done / total) * 100) : 0;
    el.progressFill.style.width = `${pct}%`;
  }

  function selectLesson(idx) {
    state.currentIdx = idx;
    const lesson = lessons[idx];
    if (lesson.id >= 9 && lesson.starterCss) {
      state.activeEditorTab = "css";
    } else {
      state.activeEditorTab = "html";
    }
    el.hintBanner.classList.remove("visible");
    el.tokenDetail.classList.remove("visible");
    renderSidebar();
    renderLessonBody();
    saveStorage();
  }

  function renderLessonBody() {
    const lesson = lessons[state.currentIdx];
    const code = getLessonCode(lesson);

    el.stepBadges.innerHTML = `<span class="pill">Adım ${lesson.id} / ${lessons.length}</span>`;
    el.stepBadges.innerHTML += `<span class="pill pill-slide">${lesson.slideRef}</span>`;
    if (lesson.examTag) {
      el.stepBadges.innerHTML += `<span class="pill pill-exam">${lesson.examTag}</span>`;
    }

    el.lessonTitle.innerHTML = lesson.title;
    el.meaningBox.innerHTML = lesson.meaning;
    el.hintBanner.innerHTML = `<strong>İpucu:</strong> ${lesson.hint}`;

    el.tokenStrip.innerHTML = "";
    lesson.tokens.forEach((tok) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "token-chip";
      chip.textContent = tok.code;
      chip.addEventListener("click", () => {
        const wasActive = chip.classList.contains("active");
        el.tokenStrip.querySelectorAll(".token-chip").forEach((c) => c.classList.remove("active"));
        if (wasActive) {
          el.tokenDetail.classList.remove("visible");
        } else {
          chip.classList.add("active");
          el.tokenDetail.innerHTML = `<code>${escapeHtml(tok.code)}</code> : ${tok.desc}`;
          el.tokenDetail.classList.add("visible");
        }
      });
      el.tokenStrip.appendChild(chip);
    });

    syncEditorTabUI(code);
    el.previewUrl.textContent = `http://localhost/ders-${lesson.id}.html`;
    el.btnPrev.disabled = state.currentIdx === 0;
    el.btnNext.disabled = state.currentIdx === lessons.length - 1;

    updatePreviewAndTasks(false);
  }

  function syncEditorTabUI(codeObj) {
    const code = codeObj || getLessonCode(lessons[state.currentIdx]);
    if (state.activeEditorTab === "html") {
      el.tabHtml.classList.add("active");
      el.tabCss.classList.remove("active");
      el.codeEditor.value = code.html;
    } else {
      el.tabCss.classList.add("active");
      el.tabHtml.classList.remove("active");
      el.codeEditor.value = code.css;
    }
  }

  function buildPreviewDocument(htmlText, cssText) {
    const basePageCss = `
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
        padding: 18px 22px;
        margin: 0;
        color: #111827;
        line-height: 1.5;
      }
      table { border-collapse: collapse; }
      th, td { padding: 6px 10px; }
    `;

    const interceptScript = `
      <script>
        document.addEventListener("submit", function (e) {
          e.preventDefault();
          var form = e.target;
          var method = (form.getAttribute("method") || "GET").toUpperCase();
          var action = form.getAttribute("action") || "(aynı sayfa)";
          var data = new FormData(form);
          var pairs = [];
          data.forEach(function (v, k) { pairs.push(k + "=" + v); });
          var existing = document.getElementById("__lab_submit_toast");
          if (existing) existing.remove();
          var box = document.createElement("div");
          box.id = "__lab_submit_toast";
          box.style.cssText = "margin-top:14px;padding:10px 12px;border-radius:4px;background:#f9fafb;color:#111827;font-family:Consolas,monospace;font-size:12px;border:1px solid #d1d5db;border-left:4px solid #15803d;";
          box.innerHTML = "<strong>Form Gönderim Simülasyonu</strong><br>" +
            "Method: <b>" + method + "</b> | Action: <b>" + action + "</b><br>" +
            (method === "GET"
              ? "URL'e eklenen veri: <code>?" + (pairs.join("&") || "(boş)") + "</code>"
              : "HTTP Body içinde giden veri: <code>" + (pairs.join("&") || "(boş)") + "</code>");
          document.body.appendChild(box);
        });
      <\/script>
    `;

    const styleTag = `<style>\n${basePageCss}\n${cssText || ""}\n</style>`;
    let out = htmlText || "";
    if (/<\/head>/i.test(out)) {
      out = out.replace(/<\/head>/i, `${styleTag}\n</head>`);
    } else if (/<body/i.test(out)) {
      out = out.replace(/<body/i, `<head>${styleTag}</head>\n<body`);
    } else {
      out = `<!DOCTYPE html><html><head>${styleTag}</head><body>${out}</body></html>`;
    }

    if (/<\/body>/i.test(out)) {
      out = out.replace(/<\/body>/i, `${interceptScript}\n</body>`);
    } else {
      out += interceptScript;
    }
    return out;
  }

  function updateDomSummary(doc, cssText) {
    const titleEl = doc.querySelector("title");
    const pageTitle = titleEl && titleEl.textContent.trim() ? titleEl.textContent.trim() : "Yeni Web Sayfası";
    el.browserTabTitle.textContent = pageTitle;

    const counts = {};
    if (doc.body) {
      doc.body.querySelectorAll("*").forEach((node) => {
        const tag = node.tagName.toLowerCase();
        counts[tag] = (counts[tag] || 0) + 1;
      });
    }
    const entries = Object.entries(counts)
      .slice(0, 7)
      .map(([tag, n]) => `<${tag}> (${n})`);
    el.domTagsSummary.textContent = entries.length
      ? `Aktif HTML Etiketleri: ${entries.join(", ")}`
      : "Aktif HTML Etiketleri: Henüz içerik yok";

    const cleanCss = (cssText || "").replace(/\/\*[\s\S]*?\*\//g, "");
    const rules = (cleanCss.match(/\{[^}]*\}/g) || []).length;
    el.domCssSummary.textContent = `CSS Kuralları: ${rules}`;
  }

  function updatePreviewAndTasks(markFailures) {
    const lesson = lessons[state.currentIdx];
    const code = getLessonCode(lesson);

    el.previewFrame.srcdoc = buildPreviewDocument(code.html, code.css);

    const parser = new DOMParser();
    const doc = parser.parseFromString(code.html, "text/html");
    updateDomSummary(doc, code.css);

    el.taskList.innerHTML = "";
    let passedCount = 0;

    lesson.tasks.forEach((task) => {
      let ok = false;
      try {
        ok = Boolean(task.check(doc, code.html, code.css));
      } catch (_e) {
        ok = false;
      }
      if (ok) passedCount++;

      const li = document.createElement("li");
      li.className = "task-item";
      if (ok) li.classList.add("passed");
      else if (markFailures) li.classList.add("failed");

      const badge = document.createElement("span");
      badge.className = "task-status";
      badge.textContent = ok ? "TAMAM" : markFailures ? "EKSİK" : "BEKLİYOR";

      const text = document.createElement("span");
      text.innerHTML = task.label;

      li.appendChild(badge);
      li.appendChild(text);
      el.taskList.appendChild(li);
    });

    const allPassed = passedCount === lesson.tasks.length;
    if (allPassed) {
      if (!state.completedIds.has(lesson.id)) {
        state.completedIds.add(lesson.id);
        renderSidebar();
      } else {
        updateProgressHeader();
      }
      el.feedbackMsg.className = "feedback-msg ok";
      el.feedbackMsg.textContent = `Adım ${lesson.id} tamamlandı (${passedCount}/${lesson.tasks.length} görev).`;
    } else if (markFailures) {
      el.feedbackMsg.className = "feedback-msg hint";
      el.feedbackMsg.textContent = `${passedCount}/${lesson.tasks.length} görev tamam. Eksik maddeler için İpucu butonuna bakabilirsin.`;
    } else {
      el.feedbackMsg.className = "feedback-msg";
      el.feedbackMsg.textContent = `Durum: ${passedCount}/${lesson.tasks.length} görev tamamlandı. Yazdığın kod sağdaki pencerede canlı görünür.`;
    }
    saveStorage();
  }

  el.tabHtml.addEventListener("click", () => {
    state.activeEditorTab = "html";
    syncEditorTabUI();
  });

  el.tabCss.addEventListener("click", () => {
    state.activeEditorTab = "css";
    syncEditorTabUI();
  });

  el.codeEditor.addEventListener("input", () => {
    const lesson = lessons[state.currentIdx];
    const code = getLessonCode(lesson);
    if (state.activeEditorTab === "html") code.html = el.codeEditor.value;
    else code.css = el.codeEditor.value;
    updatePreviewAndTasks(false);
  });

  el.codeEditor.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = el.codeEditor.selectionStart;
      const end = el.codeEditor.selectionEnd;
      el.codeEditor.value =
        el.codeEditor.value.substring(0, start) +
        "  " +
        el.codeEditor.value.substring(end);
      el.codeEditor.selectionStart = el.codeEditor.selectionEnd = start + 2;
      el.codeEditor.dispatchEvent(new Event("input"));
    }
  });

  el.btnCheck.addEventListener("click", () => {
    updatePreviewAndTasks(true);
  });

  el.btnHint.addEventListener("click", () => {
    el.hintBanner.classList.toggle("visible");
  });

  el.btnSolve.addEventListener("click", () => {
    const lesson = lessons[state.currentIdx];
    state.savedCode[lesson.id] = {
      html: lesson.solutionHtml,
      css: lesson.solutionCss || ""
    };
    syncEditorTabUI();
    updatePreviewAndTasks(true);
  });

  el.btnReset.addEventListener("click", () => {
    const lesson = lessons[state.currentIdx];
    state.savedCode[lesson.id] = {
      html: lesson.starterHtml,
      css: lesson.starterCss || ""
    };
    state.completedIds.delete(lesson.id);
    renderSidebar();
    syncEditorTabUI();
    updatePreviewAndTasks(false);
  });

  el.btnResetAll.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    state.completedIds.clear();
    state.savedCode = {};
    selectLesson(0);
  });

  el.btnPrev.addEventListener("click", () => {
    if (state.currentIdx > 0) selectLesson(state.currentIdx - 1);
  });

  el.btnNext.addEventListener("click", () => {
    if (state.currentIdx < lessons.length - 1) selectLesson(state.currentIdx + 1);
  });

  el.modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-mode");
      el.modeBtns.forEach((b) => b.classList.remove("active"));
      el.modePanels.forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`panel-${target}`).classList.add("active");
    });
  });

  // ==================== SIMÜLATÖR 1: SEÇİCİ RÖNTGENİ ====================
  const XRAY_PRESETS = [
    { sel: "*", note: "Evrensel seçici: Sayfa içindeki tüm etiketleri seçer." },
    { sel: ".field-box", note: "Class seçici (.): class='field-box' olan bütün kutuları seçer." },
    { sel: "#sname", note: "ID seçici (#): Sadece id='sname' olan tek elemanı seçer." },
    { sel: '[type="password"]', note: "Attribute tam eşleşme: Sadece şifre kutusunu seçer." },
    { sel: '[id^="s"]', note: "Prefix (^=): id değeri 's' harfi ile başlayan tüm alanları (sname, spin, skills, submitBtn) seçer." },
    { sel: '[href$=".pdf"]', note: "Suffix ($=): Link adresi '.pdf' ile biten bağlantıyı seçer." },
    { sel: "fieldset, textarea", note: "Grouping (,): Hem fieldset çerçevesini hem textarea kutusunu birlikte seçer." },
    { sel: "p:first-child", note: "Pseudo-class (:first-child): Ebeveyninin ilk çocuğu olan p etiketini seçer." }
  ];

  function initXRay() {
    el.xrayPresets.innerHTML = "";
    XRAY_PRESETS.forEach((p) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "token-chip";
      b.textContent = p.sel;
      b.addEventListener("click", () => {
        el.xrayInput.value = p.sel;
        runXRay(p.note);
      });
      el.xrayPresets.appendChild(b);
    });

    el.xrayRunBtn.addEventListener("click", () => runXRay());
    el.xrayInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") runXRay();
    });
    runXRay(XRAY_PRESETS[4].note);
  }

  function runXRay(presetNote) {
    const raw = el.xrayInput.value.trim();
    el.xrayStage.querySelectorAll(".xray-hit").forEach((n) => n.classList.remove("xray-hit"));

    if (!raw) {
      el.xrayExplain.textContent = "Yukarıya bir CSS seçici yaz veya hazır butonlardan birine tıkla.";
      return;
    }

    if (/::(first-letter|first-line|before|after|marker|selection)/.test(raw)) {
      const base = raw.split("::")[0] || "*";
      try {
        const baseHits = el.xrayStage.querySelectorAll(base);
        baseHits.forEach((n) => n.classList.add("xray-hit"));
        el.xrayExplain.innerHTML = `<strong>${escapeHtml(raw)}</strong> bir <b>Pseudo-element (::)</b> seçicisidir. <code>${escapeHtml(base)}</code> elemanının sadece ilgili parçasını (ilk harf, ilk satır veya ön/arka ek) hedefler. Hedef taban eleman sayısı: <b>${baseHits.length}</b>.`;
      } catch (_e) {
        el.xrayExplain.textContent = "Geçersiz seçici yazımı.";
      }
      return;
    }

    try {
      const cleanSel = raw.replace(/:(hover|focus|active|visited|link)/g, "");
      const hasStatePseudo = /:(hover|focus|active|visited|link)/.test(raw);
      const matches = el.xrayStage.querySelectorAll(cleanSel || "*");
      matches.forEach((node) => node.classList.add("xray-hit"));

      const tags = [...matches].map((m) => `<${m.tagName.toLowerCase()}>`).slice(0, 6).join(", ");
      const extra = hasStatePseudo ? " (Not: :hover/:focus gibi durumlar etkileşim anında devreye girer; burada taban elemanlar vurgulandı.)" : "";
      el.xrayExplain.innerHTML = `<strong>Sonuç: ${matches.length} eleman eşleşti</strong> ${tags ? `(${escapeHtml(tags)}${matches.length > 6 ? "..." : ""})` : ""}.<br>${presetNote || "Yazdığın seçici sarı arka plan ve kırmızı çerçeve ile işaretlenen elemanları hedefler."}${extra}`;
    } catch (_err) {
      el.xrayExplain.innerHTML = `<span style="color:#b91c1c;">Sözdizimi hatası:</span> <code>${escapeHtml(raw)}</code> geçerli bir CSS seçici değil.`;
    }
  }

  // ==================== SIMÜLATÖR 2: KUTU MODELİ ====================
  function updateBoxModel() {
    const m = el.bmMargin.value;
    const b = el.bmBorder.value;
    const p = el.bmPadding.value;
    const w = el.bmWidth.value;
    const o = el.bmOutline.value;

    el.bmMarginVal.textContent = `${m}px`;
    el.bmBorderVal.textContent = `${b}px`;
    el.bmPaddingVal.textContent = `${p}px`;
    el.bmWidthVal.textContent = `${w}px`;
    el.bmOutlineVal.textContent = `${o}px`;

    el.bmBoxMargin.style.padding = `${m}px`;
    el.bmBoxBorder.style.border = `${b}px solid #15803d`;
    el.bmBoxBorder.style.outline = o > 0 ? `${o}px solid #b91c1c` : "none";
    el.bmBoxBorder.style.outlineOffset = "4px";
    el.bmBoxPadding.style.padding = `${p}px`;
    el.bmBoxContent.style.width = `${w}px`;

    const totalWidth = Number(w) + Number(p) * 2 + Number(b) * 2;
    el.bmCssOutput.textContent = `.kutu {\n  width: ${w}px;\n  padding: ${p}px;\n  border: ${b}px solid #15803d;\n  margin: ${m}px;\n  outline: ${o}px solid #b91c1c;\n}\n/* Toplam Kutu Genişliği (outline hariç): ${w} + 2*${p} + 2*${b} = ${totalWidth}px */`;
  }

  function initBoxModel() {
    [el.bmMargin, el.bmBorder, el.bmPadding, el.bmWidth, el.bmOutline].forEach((inp) => {
      inp.addEventListener("input", updateBoxModel);
    });
    updateBoxModel();
  }

  // ==================== SIMÜLATÖR 3: GET vs POST ====================
  function runHttpSim() {
    const method = el.simMethod.value;
    const name = encodeURIComponent(el.simName.value || "Mesut");
    const pin = encodeURIComponent(el.simPass.value || "1234");
    const query = `sname=${name}&spin=${pin}`;

    if (method === "GET") {
      el.simUrlDisplay.textContent = `https://example.com/register.php?${query}`;
      el.simPacketDisplay.textContent =
        `GET /register.php?${query} HTTP/1.1\n` +
        `Host: example.com\n\n` +
        `UYARI (Ders Slaytı Kuralı):\n` +
        `method="get" veriyi URL'in sonuna ekler.\n` +
        `Şifre/PIN (${decodeURIComponent(pin)}) tarayıcı adres çubuğunda AÇIKÇA göründü.\n` +
        `Bu yüzden şifre gibi hassas verilerde ASLA GET kullanılmaz.`;
    } else {
      el.simUrlDisplay.textContent = `https://example.com/register.php`;
      el.simPacketDisplay.textContent =
        `POST /register.php HTTP/1.1\n` +
        `Host: example.com\n` +
        `Content-Type: application/x-www-form-urlencoded\n` +
        `Content-Length: ${query.length}\n\n` +
        `${query}\n\n` +
        `GÜVENLİ DAVRANIŞ:\n` +
        `method="post" form verilerini HTTP isteğinin gövdesinde (Body) taşır.\n` +
        `URL çubuğu temiz kalır, veri boyutu sınırı yoktur.`;
    }
  }

  function initHttpSim() {
    [el.simMethod, el.simName, el.simPass].forEach((node) => {
      node.addEventListener("input", runHttpSim);
      node.addEventListener("change", runHttpSim);
    });
    el.simSendBtn.addEventListener("click", runHttpSim);
    runHttpSim();
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  loadStorage();
  renderSidebar();
  renderLessonBody();
  initXRay();
  initBoxModel();
  initHttpSim();
})();
