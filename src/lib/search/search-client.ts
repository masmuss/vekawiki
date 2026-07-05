interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: {
    title: string;
    [key: string]: string;
  };
}

interface PagefindSearchResult {
  data: () => Promise<PagefindResultData>;
}

interface PagefindModule {
  init: () => Promise<void>;
  search: (query: string) => Promise<{ results: PagefindSearchResult[] }>;
}

export function initSearch(dialogRoot: HTMLElement) {
  let isOpen = false;
  let query = "";
  let results: PagefindResultData[] = [];
  let isSearching = false;
  let selectedIndex = -1;
  let pagefind: PagefindModule | null = null;
  let searchRequestId = 0;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let initPromise: Promise<void> | null = null;

  const content = dialogRoot.querySelector<HTMLElement>(
    '[data-slot="dialog-content"]',
  );

  const el = {
    input: content?.querySelector<HTMLInputElement>("[data-search-input]"),
    list: content?.querySelector<HTMLDivElement>("[data-search-list]"),
    status: content?.querySelector<HTMLDivElement>("[data-search-status]"),
    count: content?.querySelector<HTMLSpanElement>("[data-search-count]"),
    empty: content?.querySelector<HTMLDivElement>("[data-search-empty]"),
    hint: content?.querySelector<HTMLDivElement>("[data-search-hint]"),
    spinner: content?.querySelector<HTMLDivElement>("[data-search-spinner]"),
    escBtn: content?.querySelector<HTMLButtonElement>("[data-search-esc]"),
  };

  function emit(action: "open" | "close") {
    dialogRoot.dispatchEvent(
      new CustomEvent("dialog:set", {
        detail: { open: action === "open" },
      }),
    );
  }

  function loadPagefind(): Promise<void> {
    if (initPromise) return initPromise;
    initPromise = (async () => {
      if ((window as any).pagefind) return;
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "/pagefind/pagefind.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Pagefind"));
        document.head.appendChild(script);
      });
      pagefind = (window as any).pagefind as PagefindModule;
      await pagefind.init();
    })();
    return initPromise;
  }

  function openSearch() {
    loadPagefind();
    emit("open");
  }

  function closeSearch() {
    query = "";
    if (debounceTimer) clearTimeout(debounceTimer);
    results = [];
    selectedIndex = -1;
    isSearching = false;
    render();
    emit("close");
  }

  function reset() {
    query = "";
    if (debounceTimer) clearTimeout(debounceTimer);
    results = [];
    selectedIndex = -1;
    isSearching = false;
    render();
  }

  async function handleSearch() {
    const trimmed = query.trim();
    const requestId = ++searchRequestId;

    if (trimmed.length < 2) {
      if (debounceTimer) clearTimeout(debounceTimer);
      results = [];
      selectedIndex = -1;
      isSearching = false;
      render();
      return;
    }

    if (debounceTimer) clearTimeout(debounceTimer);

    isSearching = true;
    render();

    debounceTimer = setTimeout(async () => {
      if (requestId !== searchRequestId) return;
      if (!pagefind) await loadPagefind();
      if (!pagefind || requestId !== searchRequestId) {
        isSearching = false;
        render();
        return;
      }

      try {
        const search = await pagefind.search(trimmed);
        const limited = search.results.slice(0, 10);
        const raw = await Promise.all(limited.map((r) => r.data()));
        if (requestId !== searchRequestId) return;

        results = raw.map((r) => ({
          ...r,
          url: r.url.replace("/dist/", "/").replace(/\/$/, ""),
        }));
        selectedIndex = results.length > 0 ? 0 : -1;
      } catch (e) {
        if (requestId !== searchRequestId) return;
        console.error("Search failed", e);
      } finally {
        if (requestId === searchRequestId) {
          isSearching = false;
          render();
        }
      }
    }, 300);
  }

  function render() {
    el.spinner?.classList.toggle("hidden", !isSearching);

    if (results.length > 0) {
      el.hint?.classList.add("hidden");
      el.empty?.classList.add("hidden");
      el.list?.classList.remove("hidden");
      el.status?.classList.remove("hidden");
      if (el.count) el.count.textContent = `${results.length} results found`;

      el.list!.innerHTML = results
        .map(
          (r, i) => `
        <a href="${r.url}"
           data-search-result
           data-index="${i}"
           class="group block rounded-lg p-3 transition-colors ${selectedIndex === i ? "bg-muted ring-border ring-1" : "hover:bg-muted"}"
           role="option"
           aria-selected="${selectedIndex === i}"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold ${selectedIndex === i ? "text-primary" : "group-hover:text-primary"}">${esc(r.meta.title)}</h3>
            <svg class="text-muted-foreground h-4 w-4 transition-transform ${selectedIndex === i ? "translate-x-1" : "group-hover:translate-x-1"}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
          <p class="text-muted-foreground mt-1 line-clamp-2 text-xs">${sanitize(r.excerpt)}</p>
        </a>
      `,
        )
        .join("");
    } else if (query.trim().length >= 2) {
      el.hint?.classList.add("hidden");
      el.empty?.classList.remove("hidden");
      el.empty!.innerHTML = `<p class="text-muted-foreground">No results for "${esc(query)}"</p>`;
      el.list?.classList.add("hidden");
      el.status?.classList.add("hidden");
    } else {
      el.hint?.classList.remove("hidden");
      el.empty?.classList.add("hidden");
      el.list?.classList.add("hidden");
      el.status?.classList.add("hidden");
    }
  }

  function sanitize(excerpt: string): string {
    const tpl = document.createElement("template");
    tpl.innerHTML = excerpt;
    for (const el of tpl.content.querySelectorAll("*")) {
      if (el.tagName !== "MARK") {
        el.replaceWith(document.createTextNode(el.textContent ?? ""));
      } else {
        for (const attr of [...el.attributes]) el.removeAttribute(attr.name);
      }
    }
    return tpl.innerHTML;
  }

  function esc(str: string): string {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function onKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      if (isOpen) emit("close");
      else openSearch();
    }

    if (!isOpen) return;

    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % results.length;
      render();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + results.length) % results.length;
      render();
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const link = el.list?.querySelector<HTMLAnchorElement>(
        `[data-index="${selectedIndex}"]`,
      );
      if (link) {
        window.location.href = link.href;
        closeSearch();
      }
    }
  }

  function onListMouseover(e: Event) {
    const item = (e.target as HTMLElement).closest("[data-search-result]");
    if (item) {
      const idx = parseInt(item.getAttribute("data-index") ?? "-1");
      if (idx >= 0 && idx !== selectedIndex) {
        selectedIndex = idx;
        render();
      }
    }
  }

  dialogRoot.addEventListener("dialog:change", (e: any) => {
    isOpen = e.detail.open;
    if (isOpen) {
      requestAnimationFrame(() => el.input?.focus());
    } else {
      reset();
    }
  });

  document.addEventListener("keydown", onKeydown);
  el.escBtn?.addEventListener("click", () => emit("close"));
  el.input?.addEventListener("input", (e) => {
    query = (e.target as HTMLInputElement).value;
    handleSearch();
  });
  el.list?.addEventListener("mouseover", onListMouseover);

  (window as any).__openSearch = openSearch;
  (window as any).__closeSearch = closeSearch;
}
