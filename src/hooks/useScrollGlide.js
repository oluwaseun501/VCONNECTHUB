import { useEffect, useRef } from "react";

export function useScrollGlide() {
  useEffect(() => {
    const elements = document.querySelectorAll(".glide-hidden");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("glide-visible");
            entry.target.classList.remove("glide-hidden");
          } else {
            // Re-hide when scrolled out so it replays on scroll back
            entry.target.classList.remove("glide-visible");
            entry.target.classList.add("glide-hidden");
          }
        });
      },
      { threshold: 0.15, rootMargin: "-60px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}