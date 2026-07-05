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

class SearchController {
  private dialogRoot: HTMLElement;
  private isOpen = false;
  private query = "";
  private results: PagefindResultData[] = [];
  private isSearching = false;
  private selectedIndex = -1;
  private pagefind: PagefindModule | null = null;
  private searchRequestId = 0;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private initPromise: Promise<void> | null = null;

  private el: {
    input: HTMLInputElement | null;
    list: HTMLDivElement | null;
    status: HTMLDivElement | null;
    count: HTMLSpanElement | null;
    empty: HTMLDivElement | null;
    hint: HTMLDivElement | null;
    spinner: HTMLDivElement | null;
    escBtn: HTMLButtonElement | null;
  };

  constructor(dialogRoot: HTMLElement) {
    this.dialogRoot = dialogRoot;
    const content = dialogRoot.querySelector<HTMLElement>(
      '[data-slot="dialog-content"]',
    );
    this.el = this.queryElements(content);
  }

  public init() {
    this.setupEventListeners();
    this.exposeGlobalMethods();
  }

  private queryElements(content: HTMLElement | null) {
    if (!content) {
      return {
        input: null,
        list: null,
        status: null,
        count: null,
        empty: null,
        hint: null,
        spinner: null,
        escBtn: null,
      };
    }

    return {
      input: content.querySelector<HTMLInputElement>("[data-search-input]"),
      list: content.querySelector<HTMLDivElement>("[data-search-list]"),
      status: content.querySelector<HTMLDivElement>("[data-search-status]"),
      count: content.querySelector<HTMLSpanElement>("[data-search-count]"),
      empty: content.querySelector<HTMLDivElement>("[data-search-empty]"),
      hint: content.querySelector<HTMLDivElement>("[data-search-hint]"),
      spinner: content.querySelector<HTMLDivElement>("[data-search-spinner]"),
      escBtn: content.querySelector<HTMLButtonElement>("[data-search-esc]"),
    };
  }

  private setupEventListeners() {
    this.dialogRoot.addEventListener("dialog:change", (e: any) => {
      this.isOpen = e.detail.open;
      if (this.isOpen) {
        requestAnimationFrame(() => this.el.input?.focus());
      } else {
        this.reset();
      }
    });

    document.addEventListener("keydown", this.onKeydown.bind(this));
    this.el.escBtn?.addEventListener("click", () => this.emit("close"));
    this.el.input?.addEventListener("input", (e) => {
      this.query = (e.target as HTMLInputElement).value;
      this.handleSearch();
    });
    this.el.list?.addEventListener(
      "mouseover",
      this.onListMouseover.bind(this),
    );
  }

  private exposeGlobalMethods() {
    (window as any).__openSearch = () => this.openSearch();
    (window as any).__closeSearch = () => this.closeSearch();
  }

  private emit(action: "open" | "close") {
    this.dialogRoot.dispatchEvent(
      new CustomEvent("dialog:set", {
        detail: { open: action === "open" },
      }),
    );
  }

  private loadPagefind(): Promise<void> {
    if (this.initPromise) return this.initPromise;
    this.initPromise = (async () => {
      const pagefindPath = `${import.meta.env.BASE_URL}pagefind/pagefind.js`;
      const pf = await import(/* @vite-ignore */ pagefindPath);
      this.pagefind = pf as PagefindModule;
      await this.pagefind.init();
    })();
    return this.initPromise;
  }

  private openSearch() {
    this.loadPagefind();
    this.emit("open");
  }

  private closeSearch() {
    this.query = "";
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.results = [];
    this.selectedIndex = -1;
    this.isSearching = false;
    this.render();
    this.emit("close");
  }

  private reset() {
    this.query = "";
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.results = [];
    this.selectedIndex = -1;
    this.isSearching = false;
    this.render();
  }

  private handleSearch() {
    const trimmed = this.query.trim();
    const requestId = ++this.searchRequestId;

    if (trimmed.length < 2) {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.results = [];
      this.selectedIndex = -1;
      this.isSearching = false;
      this.render();
      return;
    }

    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.isSearching = true;
    this.render();

    this.debounceTimer = setTimeout(() => {
      this.executeSearch(trimmed, requestId);
    }, 300);
  }

  private async executeSearch(trimmed: string, requestId: number) {
    if (requestId !== this.searchRequestId) return;

    try {
      const raw = await this.fetchPagefindData(trimmed, requestId);
      if (requestId !== this.searchRequestId) return;

      this.results = raw.map((r) => ({
        ...r,
        url: r.url.replace("/dist/", "/").replace(/\/$/, ""),
      }));
      this.selectedIndex = this.results.length > 0 ? 0 : -1;
    } catch (e) {
      if (requestId === this.searchRequestId) {
        console.error("Search failed", e);
      }
    } finally {
      if (requestId === this.searchRequestId) {
        this.isSearching = false;
        this.render();
      }
    }
  }

  private async fetchPagefindData(
    trimmed: string,
    requestId: number,
  ): Promise<PagefindResultData[]> {
    if (!this.pagefind) {
      await this.loadPagefind();
    }
    if (!this.pagefind || requestId !== this.searchRequestId) {
      return [];
    }

    const search = await this.pagefind.search(trimmed);
    const limited = search.results.slice(0, 10);
    return Promise.all(limited.map((r) => r.data()));
  }

  private render() {
    this.el.spinner?.classList.toggle("hidden", !this.isSearching);

    if (this.results.length > 0) {
      this.renderResults();
    } else if (this.query.trim().length >= 2) {
      this.renderEmpty();
    } else {
      this.renderHint();
    }
  }

  private renderResults() {
    this.el.hint?.classList.add("hidden");
    this.el.empty?.classList.add("hidden");
    this.el.list?.classList.remove("hidden");
    this.el.status?.classList.remove("hidden");
    if (this.el.count) {
      this.el.count.textContent = `${this.results.length} results found`;
    }

    this.el.list!.innerHTML = this.results
      .map(
        (r, i) => `
      <a href="${r.url}"
         data-search-result
         data-index="${i}"
         class="group block rounded-lg p-3 transition-colors ${
           this.selectedIndex === i
             ? "bg-muted ring-border ring-1"
             : "hover:bg-muted"
         }"
         role="option"
         aria-selected="${this.selectedIndex === i}"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold ${
            this.selectedIndex === i
              ? "text-primary"
              : "group-hover:text-primary"
          }">${this.esc(r.meta.title)}</h3>
          <svg class="text-muted-foreground h-4 w-4 transition-transform ${
            this.selectedIndex === i
              ? "translate-x-1"
              : "group-hover:translate-x-1"
          }" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>
        <p class="text-muted-foreground mt-1 line-clamp-2 text-xs">${this.sanitize(r.excerpt)}</p>
      </a>
    `,
      )
      .join("");
  }

  private renderEmpty() {
    this.el.hint?.classList.add("hidden");
    this.el.empty?.classList.remove("hidden");
    this.el.empty!.innerHTML = `<p class="text-muted-foreground">No results for "${this.esc(this.query)}"</p>`;
    this.el.list?.classList.add("hidden");
    this.el.status?.classList.add("hidden");
  }

  private renderHint() {
    this.el.hint?.classList.remove("hidden");
    this.el.empty?.classList.add("hidden");
    this.el.list?.classList.add("hidden");
    this.el.status?.classList.add("hidden");
  }

  private sanitize(excerpt: string): string {
    const tpl = document.createElement("template");
    tpl.innerHTML = excerpt;
    const elements = tpl.content.querySelectorAll("*");
    elements.forEach((el) => this.sanitizeElement(el));
    return tpl.innerHTML;
  }

  private sanitizeElement(el: Element) {
    if (el.tagName !== "MARK") {
      el.replaceWith(document.createTextNode(el.textContent ?? ""));
      return;
    }

    while (el.attributes.length > 0) {
      el.removeAttribute(el.attributes[0].name);
    }
  }

  private esc(str: string): string {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  private onKeydown(e: KeyboardEvent) {
    this.handleGlobalToggle(e);

    if (!this.isOpen || this.results.length === 0) return;

    this.handleNavigation(e);
  }

  private isToggleKeyPress(e: KeyboardEvent): boolean {
    const isMetaOrCtrl = e.metaKey || e.ctrlKey;
    return isMetaOrCtrl && e.key === "k";
  }

  private handleGlobalToggle(e: KeyboardEvent) {
    if (!this.isToggleKeyPress(e)) return;

    e.preventDefault();
    if (this.isOpen) {
      this.emit("close");
    } else {
      this.openSearch();
    }
  }

  private handleNavigation(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.navigateSelection(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        this.navigateSelection(-1);
        break;
      case "Enter":
        if (this.selectedIndex >= 0) {
          e.preventDefault();
          this.navigateToSelectedResult();
        }
        break;
    }
  }

  private navigateSelection(direction: number) {
    const total = this.results.length;
    this.selectedIndex = (this.selectedIndex + direction + total) % total;
    this.render();
  }

  private navigateToSelectedResult() {
    const link = this.el.list?.querySelector<HTMLAnchorElement>(
      `[data-index="${this.selectedIndex}"]`,
    );
    if (link) {
      window.location.href = link.href;
      this.closeSearch();
    }
  }

  private onListMouseover(e: Event) {
    const item = (e.target as HTMLElement).closest("[data-search-result]");
    if (!item) return;

    const indexAttr = item.getAttribute("data-index");
    if (!indexAttr) return;

    const idx = parseInt(indexAttr, 10);
    if (idx !== this.selectedIndex) {
      this.selectedIndex = idx;
      this.render();
    }
  }
}

export function initSearch(dialogRoot: HTMLElement) {
  const controller = new SearchController(dialogRoot);
  controller.init();
}
