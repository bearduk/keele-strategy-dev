const tabs = document.querySelectorAll(".text-tab");
const panels = document.querySelectorAll(".text-panel");
const spyGroups = document.querySelectorAll(".scrollspy-group");
const spyLinks = document.querySelectorAll(".scrollspy-link");
const spySections = document.querySelectorAll("[data-spy-section]");
const spySubLinks = document.querySelectorAll(".scrollspy-sublink");
const spySubsections = document.querySelectorAll("[data-spy-subsection]");

const activateTab = (tabToActivate, moveFocus = false) => {
  const targetId = tabToActivate.dataset.target;

  tabs.forEach((tab) => {
    const isActive = tab === tabToActivate;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  panels.forEach((panel) => {
    const isActive = panel.id === targetId;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });

  if (moveFocus) {
    tabToActivate.focus();
  }
};

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    activateTab(tab);
  });

  tab.addEventListener("keydown", (event) => {
    let nextIndex = null;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    activateTab(tabs[nextIndex], true);
  });
});

if (spyLinks.length > 0 && spySections.length > 0) {
  const setActiveSectionGroup = (sectionId) => {
    spyGroups.forEach((group) => {
      const isActive = group.dataset.sectionGroup === sectionId;
      group.classList.toggle("active", isActive);
    });

    spyLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const setActiveSubsection = (subsectionId) => {
    spySubLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${subsectionId}`;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleEntries.length === 0) {
        return;
      }

      const activeId = visibleEntries[0].target.id;
      setActiveSectionGroup(activeId);
    },
    {
      rootMargin: "-25% 0px -55% 0px",
      threshold: [0.15, 0.35, 0.6],
    }
  );

  spySections.forEach((section) => sectionObserver.observe(section));

  if (spySubsections.length > 0) {
    const subsectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length === 0) {
          return;
        }

        const activeSubsection = visibleEntries[0].target;
        setActiveSectionGroup(activeSubsection.dataset.parentSection);
        setActiveSubsection(activeSubsection.id);
      },
      {
        rootMargin: "-18% 0px -68% 0px",
        threshold: [0.2, 0.5, 0.8],
      }
    );

    spySubsections.forEach((subsection) => subsectionObserver.observe(subsection));
  }

  const hash = window.location.hash;

  if (hash) {
    const activeSubsection = document.querySelector(`[data-spy-subsection]${hash}`);
    const activeSection = document.querySelector(`[data-spy-section]${hash}`);

    if (activeSubsection) {
      setActiveSectionGroup(activeSubsection.dataset.parentSection);
      setActiveSubsection(activeSubsection.id);
    } else if (activeSection) {
      setActiveSectionGroup(activeSection.id);
    }
  }
}
