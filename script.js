/* =========================================
   MOBILE NAVIGATION - HAMBURGER MENU
========================================= */

(function () {
  "use strict";

  // DOM Elements
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navOverlay = document.querySelector(".nav-overlay");
  const body = document.body;

  // Guard clause: exit if essential elements are missing
  if (!hamburger || !navLinks) {
    console.warn("Mobile nav: .hamburger or .nav-links not found in DOM.");
    return;
  }

  /* =========================================
     TOGGLE MENU
  ========================================= */

  function openMenu() {
    hamburger.classList.add("active");
    navLinks.classList.add("active");
    if (navOverlay) navOverlay.classList.add("active");
    body.classList.add("menu-open");

    // Accessibility
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Close menu");
    navLinks.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
    if (navOverlay) navOverlay.classList.remove("active");
    body.classList.remove("menu-open");

    // Accessibility
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open menu");
    navLinks.setAttribute("aria-hidden", "true");
  }

  function toggleMenu() {
    const isOpen = navLinks.classList.contains("active");
    isOpen ? closeMenu() : openMenu();
  }

  /* =========================================
     EVENT LISTENERS
  ========================================= */

  // 1. Hamburger click
  hamburger.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleMenu();
  });

  // 2. Overlay click (close menu)
  if (navOverlay) {
    navOverlay.addEventListener("click", closeMenu);
  }

  // 3. Close menu when a nav link is clicked
  const allNavLinks = navLinks.querySelectorAll("a");
  allNavLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      // Only close on mobile where the hamburger is visible
      if (window.innerWidth <= 768) {
        closeMenu();
      }
    });
  });

  // 4. Escape key closes menu
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navLinks.classList.contains("active")) {
      closeMenu();
    }
  });

  // 5. Close menu on window resize (if resized above mobile breakpoint)
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 768 && navLinks.classList.contains("active")) {
        closeMenu();
      }
    }, 150);
  });

  // 6. Click outside menu to close (extra safety)
  document.addEventListener("click", function (e) {
    if (
      navLinks.classList.contains("active") &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* =========================================
     NAVBAR SCROLL EFFECT (Optional)
  ========================================= */

  const navbar = document.querySelector(".navbar");
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener(
      "scroll",
      function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 10) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }

        lastScroll = currentScroll;
      },
      { passive: true }
    );
  }

  /* =========================================
     ACTIVE LINK HIGHLIGHT (Optional)
  ========================================= */

  const currentPath = window.location.pathname.split("/").pop();

  allNavLinks.forEach(function (link) {
    const linkPath = link.getAttribute("href");

    if (
      linkPath &&
      (linkPath === currentPath ||
        (currentPath === "" && linkPath === "index.html"))
    ) {
      link.classList.add("active");
    }
  });

  /* =========================================
     INITIAL ACCESSIBILITY SETUP
  ========================================= */

  hamburger.setAttribute("aria-expanded", "false");
  hamburger.setAttribute("aria-label", "Open menu");
  hamburger.setAttribute("aria-controls", "mobile-nav");
  hamburger.setAttribute("role", "button");
  hamburger.setAttribute("tabindex", "0");

  navLinks.setAttribute("id", "mobile-nav");
  navLinks.setAttribute("aria-hidden", "true");

  // Keyboard support for hamburger (Enter / Space)
  hamburger.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
    }
  });

  /* =========================================
     TOUCH SWIPE TO CLOSE (Optional)
  ========================================= */

  let touchStartX = 0;
  let touchEndX = 0;

  navLinks.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  navLinks.addEventListener(
    "touchend",
    function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;

    // Swipe right to close (since menu opens from right)
    if (swipeDistance > 80 && navLinks.classList.contains("active")) {
      closeMenu();
    }
  }
})();