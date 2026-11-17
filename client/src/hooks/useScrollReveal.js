import { useEffect } from "react";

const SELECTOR = [
  ".hero-inner > *",
  ".section > h1",
  ".section > h2",
  ".section > p",
  ".blog-card",
  ".pill-row",
  ".stats-inner > div",
  ".tech-card",
  ".contact-form",
  ".faq-item",
  ".author-header",
  ".article > *",
  ".comment",
  ".footer-grid > div",
  ".empty-state",
  ".auth-card",
  ".stat-card",
].join(",");

export default function useScrollReveal() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const prepare = (el) => {
      if (el.dataset.reveal) return;
      el.dataset.reveal = "1";
      const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
      const index = Math.max(siblings.indexOf(el), 0);
      el.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 70}ms`);
      el.classList.add("reveal");
      io.observe(el);
    };

    const register = (root) => {
      if (root.matches && root.matches(SELECTOR)) prepare(root);
      root.querySelectorAll(SELECTOR).forEach(prepare);
    };

    register(document.body);

    const mo = new MutationObserver((mutations) => {
      mutations.forEach((m) =>
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) register(node);
        })
      );
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}