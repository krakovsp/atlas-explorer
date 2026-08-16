/* ============================================================
   ЗАГРУЗКА ВНЕШНИХ HTML-ФРАГМЕНТОВ
   ============================================================ */

async function loadHtmlFragments() {
  const fragmentContainers = [
    ...document.querySelectorAll("[data-fragment]")
  ];

  await Promise.all(
    fragmentContainers.map(async (container) => {
      const fragmentPath = container.dataset.fragment;

      container.setAttribute("aria-busy", "true");

      try {
        const response = await fetch(fragmentPath);

        if (!response.ok) {
          throw new Error(
            `Failed to load ${fragmentPath}: ${response.status}`
          );
        }

        container.innerHTML = await response.text();
      } catch (error) {
        console.error(error);

        container.innerHTML = `
          <p class="fragment-load-error">
            Content could not be loaded.
          </p>
        `;
      } finally {
        container.removeAttribute("aria-busy");
      }
    })
  );

  document.dispatchEvent(new CustomEvent("fragments:loaded"));
}

/* Работает как с defer, так и без него */
window.fragmentsReady = new Promise((resolve) => {
  const startLoading = async () => {
    await loadHtmlFragments();
    resolve();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startLoading, {
      once: true
    });
  } else {
    startLoading();
  }
});