(function () {
  const aff = window.AFF || {};
  const insertedImp = new Set();

  // data-aff="A" を付けた <a> にURLを入れる + 1x1計測を1回だけ挿入
  document.querySelectorAll("[data-aff]").forEach(el => {
    const key = el.getAttribute("data-aff");
    const a = aff[key];
    if (!a) return;

    // <a> の場合は href 等を差し込み
    if (el.tagName.toLowerCase() === "a") {
      el.href = a.url || "#";
      el.target = "_blank";
      el.rel = "nofollow sponsored noopener";
      el.referrerPolicy = "no-referrer-when-downgrade";
      el.setAttribute("attributionsrc", ""); // もしもタグの属性に寄せる
    }

    // ボタンの表示テキストを自動で入れたいとき（任意）
    if (el.hasAttribute("data-aff-name")) el.textContent = a.name;
    if (el.hasAttribute("data-aff-type")) el.textContent = a.type;

    // 計測（1ページで同一keyは1回だけ）
    if (a.imp && !insertedImp.has(key)) {
      const img = document.createElement("img");
      img.src = a.imp;
      img.width = 1;
      img.height = 1;
      img.loading = "lazy";
      img.style.border = "none";
      img.style.display = "none";
      el.insertAdjacentElement("afterend", img);
      insertedImp.add(key);
    }
  });

  // バナーを表示したいとき：<img data-aff-banner="A"> に自動反映
  document.querySelectorAll("img[data-aff-banner]").forEach(img => {
    const key = img.getAttribute("data-aff-banner");
    const a = aff[key];
    if (!a || !a.banner) return;
    img.src = a.banner;
    if (a.bannerW) img.width = a.bannerW;
    if (a.bannerH) img.height = a.bannerH;
    img.style.border = "none";
  });

  // チェックリスト保存（localStorage）
  const boxKey = "tg_checklist_v1";
  const saved = JSON.parse(localStorage.getItem(boxKey) || "{}");
  document.querySelectorAll('input[type="checkbox"][data-save]').forEach(cb => {
    const k = cb.getAttribute("data-save");
    if (saved[k]) cb.checked = true;
    cb.addEventListener("change", () => {
      saved[k] = cb.checked;
      localStorage.setItem(boxKey, JSON.stringify(saved));
    });
  });
})();
