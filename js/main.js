/*global $, jQuery, alert*/
(function () {
  "use strict";

  var themeStorageKey = "portfolio-theme";
  var languageStorageKey = "portfolio-language";
  var currentLanguage = localStorage.getItem(languageStorageKey) === "zh" ? "zh" : "en";

  var translations = {
    en: {
      "nav.home": "Home",
      "nav.vision": "Vision",
      "nav.about": "About",
      "nav.development": "Development",
      "nav.service": "Service & Price",
      "nav.contact": "Contact",
      "hero.capability": "Programming & Coding : Website, Mobile App, Server, Database, System, Software, Automation, Web & Mobile Responsive, iOS & Android, Machine Learning Ai, Web3 Blockchain.",
      "hero.headline": "I build web, mobile, AI automation and systems.",
      "hero.promise": "Resolve Your Problem With The <strong>*Lazy*</strong> Way",
      "hero.ctaProject": "Hire for a project",
      "hero.ctaSpeak": "Invite me to speak",
      "hero.ctaProof": "View proof",
      "sections.mobileTitle": "Mobile App Demo",
      "sections.mobileIntro": "Two mobile-first showcase apps proving scan flows, QR/NFC sharing, PWA thinking, responsive app shells, and API-ready product workflows.",
      "sections.gamesTitle": "Games Demo",
      "sections.modelsTitle": "3D Models Demo",
      "modal.tech": "Tech Stacks",
      "modal.skills": "Skills Used",
      "modal.about": "Project About",
      "modal.clientValue": "Client Value",
      "husky.message": "Need a project helper? I can call Hunter.",
      "husky.whatsapp": "WhatsApp Hunter",
      "husky.email": "Email Hunter",
      "theme.dark": "Dark",
      "theme.light": "Light"
    },
    zh: {
      "nav.home": "首页",
      "nav.vision": "愿景",
      "nav.about": "关于",
      "nav.development": "开发作品",
      "nav.service": "服务与价格",
      "nav.contact": "联系",
      "hero.capability": "编程与开发：网站、手机 App、服务器、数据库、系统、软件、自动化、响应式网页与手机、iOS 与 Android、机器学习 AI、Web3 区块链。",
      "hero.headline": "我打造网站、手机 App、AI 自动化与系统。",
      "hero.promise": "用 <strong>*Lazy*</strong> 的聪明方式解决你的问题",
      "hero.ctaProject": "找我做项目",
      "hero.ctaSpeak": "邀请我分享",
      "hero.ctaProof": "查看证明",
      "sections.mobileTitle": "手机 App Demo",
      "sections.mobileIntro": "两个手机优先的展示应用，证明扫描流程、QR/NFC 分享、PWA 思维、响应式 App 外壳与 API-ready 产品流程。",
      "sections.gamesTitle": "游戏 Demo",
      "sections.modelsTitle": "3D 模型 Demo",
      "modal.tech": "技术栈",
      "modal.skills": "使用技能",
      "modal.about": "项目说明",
      "modal.clientValue": "客户价值",
      "husky.message": "需要项目帮手吗？我可以帮你联系 Hunter。",
      "husky.whatsapp": "WhatsApp Hunter",
      "husky.email": "Email Hunter",
      "theme.dark": "暗色",
      "theme.light": "亮色"
    }
  };

  var skillDemos = [
    {
      match: ["pwa", "mobile", "responsive", "react native", "flutter"],
      title: "Mobile App Shell",
      copy: "Mini demo: phone layout, bottom navigation, touch-first spacing, offline-friendly state, and deployable web/PWA presentation."
    },
    {
      match: ["image", "lazy", "loading", "optimization"],
      title: "Image Optimization",
      copy: "Mini demo: lazy loading, fixed image dimensions, compressed assets, and faster perceived loading for portfolio and landing pages."
    },
    {
      match: ["animation", "motion"],
      title: "Loading & Motion",
      copy: "Mini demo: skeleton loading, smooth reveal, hover depth, and reduced-motion safety so the UI feels premium without hurting readability."
    },
    {
      match: ["svelte", "typescript", "javascript", "html", "css"],
      title: "Frontend Build",
      copy: "Mini demo: reusable UI sections, stateful interactions, responsive layouts, and clean static deployment for fast client review."
    },
    {
      match: ["marketplace", "seller", "buyer", "deal"],
      title: "Marketplace Flow",
      copy: "Mini demo: buyer request, seller offers, comparison cards, and conversion-focused product flow for commerce projects."
    },
    {
      match: ["3d", "webgl", "simulation", "model"],
      title: "3D Web UI",
      copy: "Mini demo: model catalog, scene preview, dashboard overlay, and WebGL-ready presentation for simulation or game assets."
    },
    {
      match: ["ai", "scan", "ocr", "automation"],
      title: "AI-ready Workflow",
      copy: "Mini demo: image intake, structured extraction, assistant-ready state, and automation hooks that can later connect to AI APIs."
    },
    {
      match: ["dashboard", "api", "database"],
      title: "Dashboard & API Thinking",
      copy: "Mini demo: data cards, status tracking, API-ready structure, and admin-friendly UI patterns for real business systems."
    }
  ];

  var projectProfiles = [
    {
      match: "PalWorld",
      story: "A Svelte-powered open-world game landing demo that sells a game concept with stronger art direction, media hierarchy, and immersive product storytelling.",
      client: "Useful for studios, game founders, NFT/game launches, and entertainment brands that need a high-impact campaign page before a full game release."
    },
    {
      match: "WarrantyScan",
      story: "A mobile-first product demo focused on receipt scanning, warranty lifecycle tracking, service reminders, and photo-first item capture.",
      client: "Useful for retailers, service providers, insurance flows, and any client that needs a mobile workflow starting from a camera or receipt."
    },
    {
      match: "NameCard Mobile",
      story: "A mobile identity demo for QR sharing, NFC exchange, profile preview, and event networking follow-up.",
      client: "Useful for founders, real estate agents, trainers, sales teams, and event organizers who want contact exchange to become measurable."
    }
  ];

  function getPreferredTheme() {
    var savedTheme = localStorage.getItem(themeStorageKey);
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return "light";
  }

  function applyTheme(theme) {
    var toggle = document.getElementById("theme-toggle");
    var isDark = theme === "dark";
    var dictionary = translations[currentLanguage];

    document.documentElement.setAttribute("data-theme", theme);

    if (toggle) {
      toggle.textContent = isDark ? dictionary["theme.light"] : dictionary["theme.dark"];
      toggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
      toggle.setAttribute("aria-pressed", String(isDark));
    }
  }

  function applyLanguage(language) {
    var dictionary = translations[language] || translations.en;
    currentLanguage = language;
    localStorage.setItem(languageStorageKey, language);
    document.documentElement.setAttribute("lang", language === "zh" ? "zh-CN" : "en");

    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      var key = element.getAttribute("data-i18n");
      if (dictionary[key]) {
        element.textContent = dictionary[key];
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (element) {
      var key = element.getAttribute("data-i18n-html");
      if (dictionary[key]) {
        element.innerHTML = dictionary[key];
      }
    });

    var languageToggle = document.getElementById("language-toggle");
    if (languageToggle) {
      languageToggle.textContent = language === "zh" ? "EN" : "CN";
      languageToggle.setAttribute("aria-pressed", String(language === "zh"));
    }

    applyTheme(document.documentElement.getAttribute("data-theme") || getPreferredTheme());
  }

  function setupThemeToggle() {
    var toggle = document.getElementById("theme-toggle");
    applyTheme(getPreferredTheme());

    if (!toggle) {
      return;
    }

    toggle.addEventListener("click", function () {
      var nextTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem(themeStorageKey, nextTheme);
      applyTheme(nextTheme);
    });
  }

  function setupLanguageToggle() {
    var toggle = document.getElementById("language-toggle");
    applyLanguage(currentLanguage);

    if (!toggle) {
      return;
    }

    toggle.addEventListener("click", function () {
      applyLanguage(currentLanguage === "zh" ? "en" : "zh");
    });
  }

  function closeProjectDetailModal() {
    var modal = document.getElementById("project-detail-modal");
    if (modal) {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    }
  }

  function findProfile(projectTitle) {
    return projectProfiles.find(function (profile) {
      return projectTitle.indexOf(profile.match) !== -1;
    });
  }

  function resolveSkillDemo(label) {
    var normalized = label.toLowerCase();
    return (
      skillDemos.find(function (demo) {
        return demo.match.some(function (token) {
          return normalized.indexOf(token) !== -1;
        });
      }) || {
        title: "Client-ready Skill",
        copy: "Mini demo: this capability supports faster delivery, clearer client review, and a more polished product experience."
      }
    );
  }

  function setupProjectDetails() {
    var modal = document.getElementById("project-detail-modal");
    var title = document.getElementById("project-detail-title");
    var story = document.getElementById("project-detail-story");
    var tech = document.getElementById("project-detail-tech");
    var skills = document.getElementById("project-detail-skills");
    var about = document.getElementById("project-detail-about");
    var client = document.getElementById("project-detail-client");
    var demoPanel = document.getElementById("project-skill-demo");

    if (!modal || !title || !story || !tech || !skills || !about || !client || !demoPanel) {
      return;
    }

    document.querySelectorAll(".project-detail-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        var projectTitle = button.getAttribute("data-project-title") || "Project Details";
        var projectTech = button.getAttribute("data-project-tech") || "";
        var projectSkills = button.getAttribute("data-project-skills") || "";
        var projectAbout = button.getAttribute("data-project-about") || "";
        var profile = findProfile(projectTitle);

        title.textContent = projectTitle;
        story.textContent =
          (profile && profile.story) ||
          "A client-ready showcase project built to communicate the product idea quickly, make the workflow easy to understand, and prove I can move from concept to polished web/mobile presentation.";
        skills.textContent =
          projectSkills +
          (projectSkills ? ". " : "") +
          "Premium but credible delivery focus: clear UX, readable content, responsive behavior, visual polish, and demo-ready storytelling.";
        about.textContent = projectAbout;
        client.textContent =
          (profile && profile.client) ||
          "This helps clients validate an idea, attract users or investors, explain a workflow, and choose a freelancer who can handle both product thinking and front-end execution.";

        tech.innerHTML = "";
        projectTech.split(",").forEach(function (item) {
          var label = item.trim();
          if (!label) {
            return;
          }

          var chip = document.createElement("button");
          chip.type = "button";
          chip.className = "project-detail-chip";
          chip.textContent = label;
          chip.addEventListener("click", function () {
            var skillDemo = resolveSkillDemo(label);
            demoPanel.classList.remove("is-playing");
            demoPanel.innerHTML = "<strong>" + skillDemo.title + "</strong><p>" + skillDemo.copy + "</p>";
            void demoPanel.offsetWidth;
            demoPanel.classList.add("is-playing");
          });
          tech.appendChild(chip);
        });

        demoPanel.innerHTML = "<strong>Click a tech chip</strong><p>Open a short reusable skill demo to see how that capability helps a real client project.</p>";
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
      });
    });

    modal.addEventListener("click", function (event) {
      if (event.target === modal || event.target.classList.contains("project-detail-close")) {
        closeProjectDetailModal();
      }
    });

    document.addEventListener("keyup", function (event) {
      if (event.key === "Escape") {
        closeProjectDetailModal();
      }
    });
  }

  function isReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function setupMagneticEffects() {
    var doc = document.documentElement;

    function updatePointer(event) {
      var x = event.clientX || window.innerWidth / 2;
      var y = event.clientY || window.innerHeight / 2;
      doc.style.setProperty("--pointer-x", x + "px");
      doc.style.setProperty("--pointer-y", y + "px");
      doc.style.setProperty("--motion-x", x - window.innerWidth / 2 + "px");
      doc.style.setProperty("--motion-y", y - window.innerHeight / 2 + "px");
    }

    window.addEventListener("pointermove", updatePointer, { passive: true });

    document.querySelectorAll(".magnetic-cta, [data-motion-card]").forEach(function (element) {
      element.addEventListener("pointermove", function (event) {
        if (isReducedMotion()) {
          return;
        }

        var rect = element.getBoundingClientRect();
        var relativeX = event.clientX - rect.left;
        var relativeY = event.clientY - rect.top;
        var centerX = relativeX - rect.width / 2;
        var centerY = relativeY - rect.height / 2;

        element.style.setProperty("--cta-x", relativeX + "px");
        element.style.setProperty("--cta-y", relativeY + "px");
        element.style.setProperty("--magnet-x", centerX * 0.08 + "px");
        element.style.setProperty("--magnet-y", centerY * 0.08 + "px");
        element.style.setProperty("--card-tilt-x", centerX * 0.012 + "deg");
        element.style.setProperty("--card-tilt-y", centerY * -0.012 + "deg");
      });

      element.addEventListener("pointerleave", function () {
        element.style.setProperty("--magnet-x", "0px");
        element.style.setProperty("--magnet-y", "0px");
        element.style.setProperty("--card-tilt-x", "0deg");
        element.style.setProperty("--card-tilt-y", "0deg");
      });
    });
  }

  function setupCelebration() {
    var layer = document.getElementById("celebration-layer");
    var colors = ["#74e3ff", "#d8b987", "#ff6aa8", "#7cf7b2", "#f7d038"];

    return function launchCelebration(x, y) {
      if (!layer || isReducedMotion()) {
        return;
      }

      for (var index = 0; index < 24; index += 1) {
        var particle = document.createElement("span");
        var angle = Math.random() * Math.PI * 2;
        var distance = 72 + Math.random() * 120;

        particle.className = "celebration-particle";
        particle.style.setProperty("--particle-x", x + "px");
        particle.style.setProperty("--particle-y", y + "px");
        particle.style.setProperty("--particle-dx", Math.cos(angle) * distance + "px");
        particle.style.setProperty("--particle-dy", Math.sin(angle) * distance + "px");
        particle.style.setProperty("--particle-size", 6 + Math.random() * 10 + "px");
        particle.style.setProperty("--particle-color", colors[index % colors.length]);
        layer.appendChild(particle);

        window.setTimeout(function (node) {
          node.remove();
        }, 950, particle);
      }
    };
  }

  function moveHuskySafely(husky) {
    if (!husky || isReducedMotion()) {
      return;
    }

    var rect = husky.getBoundingClientRect();
    var width = Math.min(Math.max(rect.width || 360, 300), window.innerWidth - 24);
    var height = Math.min(Math.max(rect.height || 110, 92), window.innerHeight - 24);
    var edge = window.innerWidth < 600 ? 10 : 22;
    var minX = edge;
    var maxX = Math.max(edge, window.innerWidth - width - edge);
    var minY = Math.max(96, Math.round(window.innerHeight * 0.48));
    var maxY = Math.max(minY, window.innerHeight - height - edge);
    var x = minX + Math.random() * (maxX - minX);
    var y = minY + Math.random() * (maxY - minY);

    husky.style.setProperty("--husky-x", Math.round(x) + "px");
    husky.style.setProperty("--husky-y", Math.round(y) + "px");
  }

  function setupMotionAndHelper() {
    var revealTargets = document.querySelectorAll("section, #about, #services, .journal-info, .startup-card, .teaching-proof-card, .hackathon-grid article");
    var husky = document.getElementById("husky-helper");
    var huskyButton = document.getElementById("husky-button");
    var huskyMessage = document.getElementById("husky-message");
    var celebrate = setupCelebration();
    var huskyHasAppeared = false;
    var messages = {
      en: [
        "Woof. I found the WhatsApp shortcut for you.",
        "Need a website, app, system, or automation? I can call Hunter.",
        "Small project or big idea, let's ask Hunter first.",
        "I guard the bottom of this portfolio. Tap me when you want a fast reply."
      ],
      zh: [
        "汪，我帮你找到 WhatsApp 入口了。",
        "需要网站、App、系统或自动化？我可以帮你找 Hunter。",
        "小项目或大想法，都可以先聊一聊。",
        "我在页面底部守着，点我就能快速联系。"
      ]
    };

    function setRandomHuskyMessage(contactMode) {
      if (!huskyMessage) {
        return;
      }

      if (contactMode) {
        huskyMessage.textContent = currentLanguage === "zh" ? "想快速聊项目？WhatsApp 或 Email 都可以。" : "Want the fast path? WhatsApp or email Hunter here.";
        return;
      }

      var pool = messages[currentLanguage] || messages.en;
      huskyMessage.textContent = pool[Math.floor(Math.random() * pool.length)];
    }

    revealTargets.forEach(function (element, index) {
      element.classList.add("reveal-ready");
      element.style.transitionDelay = Math.min(index % 6, 5) * 45 + "ms";
    });

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealTargets.forEach(function (element) {
        observer.observe(element);
      });
    } else {
      revealTargets.forEach(function (element) {
        element.classList.add("reveal-visible");
      });
    }

    function updateScrollEffects() {
      var doc = document.documentElement;
      var scrollable = Math.max(doc.scrollHeight - window.innerHeight, 1);
      var ratio = window.scrollY / scrollable;
      doc.style.setProperty("--scroll-depth", ratio.toFixed(4));

      if (husky) {
        if (!huskyHasAppeared && window.scrollY + window.innerHeight > doc.scrollHeight - 900) {
          huskyHasAppeared = true;
          husky.classList.add("is-visible");
          window.setTimeout(function () {
            moveHuskySafely(husky);
          }, 180);
        }

        if (huskyHasAppeared) {
          husky.classList.add("is-visible");
        }
      }
    }

    if (huskyButton && huskyMessage) {
      huskyButton.addEventListener("click", function (event) {
        var rect = huskyButton.getBoundingClientRect();

        event.stopPropagation();
        huskyHasAppeared = true;
        husky.classList.add("is-visible");
        husky.classList.add("is-chat-open");
        setRandomHuskyMessage(true);
        celebrate(rect.left + rect.width / 2, rect.top + rect.height / 2);
        moveHuskySafely(husky);
      });

      window.setInterval(function () {
        if (!husky || !husky.classList.contains("is-visible")) {
          return;
        }

        if (!husky.classList.contains("is-chat-open")) {
          setRandomHuskyMessage(false);
        }
      }, 7500);

      window.setInterval(function () {
        if (!husky || !husky.classList.contains("is-visible") || husky.classList.contains("is-chat-open")) {
          return;
        }

        moveHuskySafely(husky);
      }, 8200);
    }

    window.addEventListener("scroll", updateScrollEffects, { passive: true });
    window.addEventListener("resize", updateScrollEffects);
    updateScrollEffects();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setupThemeToggle();
      setupLanguageToggle();
      setupProjectDetails();
      setupMagneticEffects();
      setupMotionAndHelper();
    });
  } else {
    setupThemeToggle();
    setupLanguageToggle();
    setupProjectDetails();
    setupMagneticEffects();
    setupMotionAndHelper();
  }
})();

$(document).ready(function () {
  "use strict";

  // ========================================================================= //
  //  //SMOOTH SCROLL
  // ========================================================================= //

  $(document).on("scroll", onScroll);

  $('a[href^="#"]').on("click", function (e) {
    e.preventDefault();
    $(document).off("scroll");

    $("a").each(function () {
      $(this).removeClass("active");
      if ($(window).width() < 768) {
        $(".nav-menu").slideUp();
      }
    });

    $(this).addClass("active");

    var target = this.hash,
      menu = target;

    target = $(target);
    $("html, body")
      .stop()
      .animate(
        {
          scrollTop: target.offset().top - 80,
        },
        500,
        "swing",
        function () {
          window.location.hash = target.selector;
          $(document).on("scroll", onScroll);
        }
      );
  });

  function onScroll(event) {
    if ($(".home").length) {
      var scrollPos = $(document).scrollTop();
      $("nav ul li a").each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
      });
    }
  }

  // ========================================================================= //
  //  //NAVBAR SHOW - HIDE
  // ========================================================================= //

  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll > 200) {
      $("#main-nav, #main-nav-subpage").slideDown(700);
      $("#main-nav-subpage").removeClass("subpage-nav");
    } else {
      $("#main-nav").slideUp(700);
      $("#main-nav-subpage").hide();
      $("#main-nav-subpage").addClass("subpage-nav");
    }
  });

  // ========================================================================= //
  //  // RESPONSIVE MENU
  // ========================================================================= //

  $(".responsive").on("click", function (e) {
    $(".nav-menu").slideToggle();
  });

  // ========================================================================= //
  //  Typed Js
  // ========================================================================= //

  var typed = $(".typed");

  $(function () {
    if (typed.length) {
      typed.typed({
        strings: ["Hunter.", "Programmer.", "Developer.", "Hacker.", "Designer.", "Freelancer."],
        typeSpeed: 100,
        loop: true,
      });
    }
  });

  // ========================================================================= //
  //  Owl Carousel Services
  // ========================================================================= //

  $(".services-carousel").owlCarousel({
    autoplay: true,
    loop: true,
    margin: 20,
    dots: true,
    nav: false,
    responsiveClass: true,
    responsive: { 0: { items: 1 }, 768: { items: 2 }, 900: { items: 4 } },
  });

  // ========================================================================= //
  //  magnificPopup
  // ========================================================================= //

  var magnifPopup = function () {
    $(".popup-img").magnificPopup({
      type: "image",
      removalDelay: 300,
      mainClass: "mfp-with-zoom",
      gallery: {
        enabled: true,
      },
      zoom: {
        enabled: true, // By default it's false, so don't forget to enable it

        duration: 300, // duration of the effect, in milliseconds
        easing: "ease-in-out", // CSS transition easing function

        // The "opener" function should return the element from which popup will be zoomed in
        // and to which popup will be scaled down
        // By defailt it looks for an image tag:
        opener: function (openerElement) {
          // openerElement is the element on which popup was initialized, in this case its <a> tag
          // you don't need to add "opener" option if this code matches your needs, it's defailt one.
          return openerElement.is("img") ? openerElement : openerElement.find("img");
        },
      },
    });
  };

  // Call the functions
  magnifPopup();

});

// ========================================================================= //
//  hunter isotope and filter
// ========================================================================= //
$(window).load(function () {
  var hunterIsotope = $(".hunter-container").isotope({
    itemSelector: ".hunter-thumbnail",
    layoutMode: "fitRows",
  });

  $("#hunter-flters li").on("click", function () {
    $("#hunter-flters li").removeClass("filter-active");
    $(this).addClass("filter-active");

    hunterIsotope.isotope({ filter: $(this).data("filter") });
  });
});
