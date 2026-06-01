/*global $, jQuery, alert*/
(function () {
  "use strict";

  var themeStorageKey = "portfolio-theme";
  var languageStorageKey = "portfolio-language";
  var currentLanguage = localStorage.getItem(languageStorageKey) === "zh" ? "zh" : "en";
  var heroTypingTimer = null;

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
    },
    {
      match: ["image", "media", "loading", "pwa", "responsive"],
      title: "Performance & Mobile Polish",
      copy: "Mini demo: optimized thumbnails, mobile-safe spacing, fast perceived loading, and responsive interaction states that help clients review work on any device."
    }
  ];

  var projectProfiles = [
    {
      match: "Amazing Technology",
      story: "A technology-and-gaming landing experience shaped for fast first impressions: strong hero content, visual hierarchy, responsive sections, and enough motion to make the page feel alive without hiding the message.",
      client: "Useful when a client needs a quick campaign site, product teaser, or event-style page that can explain an offer visually before deeper application work begins."
    },
    {
      match: "Professional Design",
      story: "A design-and-animation showcase focused on brand presentation, section rhythm, polished transitions, and visual trust. The page demonstrates how static content can be upgraded into a sharper client-facing experience.",
      client: "Useful for service businesses, creators, trainers, and startups that need a memorable front page without overbuilding a full platform first."
    },
    {
      match: "Mobile App The Future",
      story: "A mobile-app presentation demo that packages app features, screen storytelling, and mobile-first layout into a clear product pitch. It shows the kind of structure needed before building a full iOS, Android, or PWA workflow.",
      client: "Useful for founders validating an app idea, pitching investors, or explaining a mobile workflow to users before committing to full backend implementation."
    },
    {
      match: "Smart Payment",
      story: "A payment and subscription UI demo built around conversion clarity: plan comparison, trust-building copy, purchase intent, and checkout-style presentation.",
      client: "Useful for SaaS, membership, service packages, booking businesses, and any client who needs pricing pages that feel credible instead of generic."
    },
    {
      match: "Game Portal",
      story: "A game portal concept that groups playable or presentable game ideas into one browsing surface, with enough visual energy to make game projects feel like a product lineup rather than isolated experiments.",
      client: "Useful for game studios, educators, event organizers, and entertainment brands that need a lightweight catalog for demos, prototypes, or campaign launches."
    },
    {
      match: "Mobile App Development Show",
      story: "A mobile development showcase designed to communicate screens, app features, benefits, and responsive behavior in a compact product page. It gives clients a quick way to see mobile thinking before full engineering begins.",
      client: "Useful for app pitches, agency portfolios, MVP planning, and clients comparing whether they need a native app, PWA, or responsive web app."
    },
    {
      match: "PalWorld",
      story: "An open-world multiplayer game landing demo that sells the fantasy first: immersive media framing, game-world positioning, cinematic layout, responsive sections, and campaign-ready storytelling.",
      client: "Useful for studios, game founders, NFT/game launches, and entertainment brands that need a high-impact campaign page before a full game release."
    },
    {
      match: "Fintech",
      story: "A fintech innovation demo that turns finance concepts into readable product UI: dashboard-style information, platform positioning, and structured feature communication.",
      client: "Useful for fintech founders, payment tools, internal finance dashboards, and proof-of-concept pages where trust and clarity matter more than decoration."
    },
    {
      match: "BlockChain",
      story: "A Web3 dashboard presentation that packages blockchain data, API thinking, and platform-style navigation into a client-friendly interface.",
      client: "Useful for Web3 products, token dashboards, wallet tools, analytics concepts, and blockchain teams that need a visual prototype before backend integration."
    },
    {
      match: "BestzDeal Feature",
      story: "A marketplace feature page that explains buyer demand, seller response, and conversion flow with a polished client-ready homepage structure.",
      client: "Useful for commerce founders, local marketplaces, lead-generation products, and deal platforms that need to prove the business flow quickly."
    },
    {
      match: "Travel Booking",
      story: "A travel booking feature UI that focuses on destination appeal, search intent, responsive browsing, and service storytelling.",
      client: "Useful for travel agencies, booking platforms, tourism campaigns, and local experience providers who need a polished front-end before full reservation logic."
    },
    {
      match: "Sim Work",
      story: "A simulation-work demo that presents operational workflows through visual dashboards, scenario framing, and deployed interactive product pages.",
      client: "Useful for industrial demos, training simulations, operation centers, and clients who need complex workflows explained visually to non-technical stakeholders."
    },
    {
      match: "Report Platform",
      story: "A cross-border civic reporting concept for Malaysia and Singapore, structured around offense submission, triage clarity, department routing, and trust-focused public-service UX.",
      client: "Useful for civic tech, complaint management, public reporting, government-adjacent workflows, and organizations that need sensitive forms to feel simple and credible."
    },
    {
      match: "Report Routing",
      story: "A refined ReportU iteration focused on making report intake, category selection, and routing decisions clearer for users who may be stressed or unsure where to submit.",
      client: "Useful for public-service platforms, support operations, fraud/scam reporting, and multi-department request handling."
    },
    {
      match: "AR Digital Name Card",
      story: "An AR-enhanced digital identity concept that combines QR, NFC, scan-first profiles, and no-app sharing into a modern networking experience.",
      client: "Useful for sales teams, founders, speakers, real estate agents, recruiters, and events that need contact exchange to feel premium and trackable."
    },
    {
      match: "Scan-First Profile",
      story: "A NameCardAi variant focused on fast profile discovery: camera scan, QR/NFC exchange, interactive profile preview, and networking follow-up.",
      client: "Useful when a client wants to replace static paper cards with a measurable digital identity and lead-capture workflow."
    },
    {
      match: "AI Reverse Marketplace",
      story: "A reverse marketplace concept where buyer intent becomes the main product surface: one request, many seller offers, comparison flow, and AI-ready matching logic.",
      client: "Useful for local commerce, procurement, services marketplaces, and deal platforms that need to reverse the usual seller-first listing model."
    },
    {
      match: "Buyer Request",
      story: "A BestzDealAi iteration centered on the buyer request journey, seller competition, and offer clarity, making the value proposition easy to understand in one demo.",
      client: "Useful for commerce clients who want a marketplace MVP but need a clearer buying flow before investing in full seller tooling."
    },
    {
      match: "Offer Comparison",
      story: "A marketplace comparison variant that highlights buyer intent capture, competitive offers, and decision support as the core conversion engine.",
      client: "Useful for marketplaces, quote platforms, B2B sourcing, and service comparison products where users need to evaluate multiple offers quickly."
    },
    {
      match: "Visual Entity",
      story: "A visual-first community platform concept where a photo can become the entry point into public discussion, reporting, scam alerts, civic history, and entity-linked conversations.",
      client: "Useful for civic reporting, community safety, lost-and-found, local reviews, incident history, and any app where users know what they saw but not what to search."
    },
    {
      match: "Community History",
      story: "A MessageYou iteration focused on linking real-world photos to long-term discussion trails, alerts, reports, and public memory.",
      client: "Useful for community platforms, safety apps, local councils, moderation workflows, and visual search products."
    },
    {
      match: "Warranty Tracking",
      story: "A warranty assistant concept for receipts, item photos, service dates, expiry reminders, coverage records, and future inventory visualization.",
      client: "Useful for retailers, appliance services, vehicle workshops, insurance add-ons, and consumers who need less manual warranty management."
    },
    {
      match: "RunJian Command",
      story: "A RunJian simWorld command demo that presents 3D operations, dashboard signals, scenario storytelling, and a high-impact visual product direction.",
      client: "Useful for simulation platforms, industrial command centers, training demos, and teams that need to turn complex operational data into a visual story."
    },
    {
      match: "RunJian SimWorld",
      story: "A second RunJian simulation iteration used to compare scene direction, dashboard framing, and command-world presentation quality across deployments.",
      client: "Useful for stakeholders choosing between simulation UI directions before deeper 3D engine or backend investment."
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
    },
    {
      match: "Assets",
      story: "A 3D model showcase direction for reviewing deployable browser assets, Q-style characters, props, dragons, weapons, terrain, and game-ready visual catalogs.",
      client: "Useful for game clients, simulation teams, education products, and brands that need asset previews before production or deeper 3D implementation."
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
    setupHeroKinetics();
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

  function buildProjectStory(projectTitle, projectTech, projectAbout, profile) {
    if (profile && profile.story) {
      return profile.story;
    }

    return (
      projectTitle +
      " is presented as a client-ready showcase with product positioning, responsive UI, interaction polish, and a clear demo path. The build turns a raw idea into something a client, interviewer, or investor can understand quickly, then expand into a real website, app, dashboard, system, or automation workflow."
    );
  }

  function buildProjectAbout(projectAbout) {
    if (!projectAbout) {
      return "This project is framed as a practical portfolio demo: readable, responsive, demo-ready, and built to communicate value before overbuilding unnecessary backend complexity.";
    }

    return (
      projectAbout +
      " The important part is not only the visual page; it is the product thinking behind it: what the user should do next, what the client can validate, and how the demo can grow into a production-ready build."
    );
  }

  function buildClientValue(profile) {
    if (profile && profile.client) {
      return profile.client;
    }

    return "This helps clients validate an idea, attract users or investors, explain a workflow, and choose a freelancer who can handle product thinking, front-end execution, mobile responsiveness, visual polish, and deployment.";
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
        story.textContent = buildProjectStory(projectTitle, projectTech, projectAbout, profile);
        skills.textContent =
          projectSkills +
          (projectSkills ? ". " : "") +
          "Premium but credible delivery focus: clear UX, readable content, responsive behavior, visual polish, and demo-ready storytelling.";
        about.textContent = buildProjectAbout(projectAbout);
        client.textContent = buildClientValue(profile);

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

  function setupHeroKinetics() {
    var headline = document.querySelector(".hero-headline");
    var capability = document.querySelector(".hero-capability");

    if (headline) {
      var headlineText = headline.textContent.replace(/\s+/g, " ").trim();
      var words = headlineText.split(" ").filter(Boolean);
      headline.textContent = "";

      words.forEach(function (word, index) {
        var span = document.createElement("span");
        span.className = "hero-word";
        span.style.setProperty("--word-index", index);
        span.textContent = word;
        headline.appendChild(span);

        if (index < words.length - 1) {
          headline.appendChild(document.createTextNode(" "));
        }
      });
    }

    if (!capability) {
      return;
    }

    var capabilityText = capability.textContent.replace(/\s+/g, " ").trim();

    if (heroTypingTimer) {
      window.clearInterval(heroTypingTimer);
      heroTypingTimer = null;
    }

    if (isReducedMotion()) {
      capability.classList.remove("is-typing");
      capability.textContent = capabilityText;
      return;
    }

    capability.textContent = "";
    capability.classList.add("is-typing");

    var index = 0;
    heroTypingTimer = window.setInterval(function () {
      index += 1;
      capability.textContent = capabilityText.slice(0, index);

      if (index >= capabilityText.length) {
        window.clearInterval(heroTypingTimer);
        heroTypingTimer = null;
        window.setTimeout(function () {
          capability.classList.remove("is-typing");
        }, 450);
      }
    }, 17);
  }

  function setupFounderJourney() {
    var journey = document.getElementById("founder-journey");

    if (!journey) {
      return;
    }

    var steps = Array.prototype.slice.call(journey.querySelectorAll(".founder-journey-steps li"));
    var maxIndex = Math.max(steps.length - 1, 0);

    function setActiveStep(activeIndex) {
      journey.setAttribute("data-active-step", String(activeIndex));
      journey.style.setProperty("--journey-step", activeIndex);
      journey.style.setProperty("--journey-focus", maxIndex > 0 ? (activeIndex / maxIndex) * 100 + "%" : "0%");

      steps.forEach(function (step, index) {
        step.classList.toggle("is-active", index === activeIndex);
      });
    }

    function updateJourney() {
      var rect = journey.getBoundingClientRect();
      var denominator = Math.max(rect.height - window.innerHeight, 1);
      var progress = Math.min(Math.max((0 - rect.top) / denominator, 0), 1);
      var activeIndex = Math.min(maxIndex, Math.max(0, Math.round(progress * maxIndex)));
      setActiveStep(activeIndex);
    }

    window.addEventListener("scroll", updateJourney, { passive: true });
    window.addEventListener("resize", updateJourney);
    updateJourney();
  }

  function setupMagneticEffects() {

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
    var minX = window.innerWidth < 600 ? edge : Math.max(edge, Math.round(window.innerWidth * 0.46));
    var maxX = Math.max(edge, window.innerWidth - width - edge);
    if (maxX < minX) {
      minX = edge;
    }
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
    var huskyEmotionTimer = null;
    var huskyMoveTimer = null;
    var huskyEmotions = ["idle", "happy", "excited", "contact"];
    var messages = {
      en: [
        "Woof. I found the fastest way to reach Hunter.",
        "Need a website, app, system, or automation? Tap me and I will help.",
        "Tiny idea or serious build, I can bring Hunter over.",
        "I am the gray husky helper. I guard the contact shortcut.",
        "Need a quote fast? My paws are already on the button."
      ],
      zh: [
        "汪，我帮你找到最快联系 Hunter 的入口。",
        "需要网站、App、系统或自动化？点我就可以。",
        "小想法或大项目，我都可以帮你叫 Hunter。",
        "我是灰色哈士奇助手，专门守着联系按钮。",
        "想快速报价？我的小爪已经准备好了。"
      ]
    };

    function setHuskyEmotion(emotion, duration) {
      if (!husky) {
        return;
      }

      window.clearTimeout(huskyEmotionTimer);
      huskyEmotions.forEach(function (state) {
        husky.classList.remove("is-emote-" + state);
      });
      husky.classList.add("is-emote-" + (emotion || "idle"));

      if (duration) {
        huskyEmotionTimer = window.setTimeout(function () {
          if (!husky.classList.contains("is-chat-open")) {
            setHuskyEmotion("idle");
          }
        }, duration);
      }
    }

    function setRandomHuskyMessage(contactMode) {
      if (!huskyMessage) {
        return;
      }

      if (contactMode) {
        huskyMessage.textContent = currentLanguage === "zh" ? "想快速聊项目？WhatsApp 或 Email 都可以。" : "Want the fast path? WhatsApp or email Hunter here.";
        setHuskyEmotion("contact");
        return;
      }

      var pool = messages[currentLanguage] || messages.en;
      huskyMessage.textContent = pool[Math.floor(Math.random() * pool.length)];
      setHuskyEmotion(Math.random() > 0.32 ? "happy" : "idle", 4200);
    }

    function scheduleHuskyRoam(delay, force) {
      if (!husky || isReducedMotion()) {
        return;
      }

      if (huskyMoveTimer && !force) {
        return;
      }

      window.clearTimeout(huskyMoveTimer);
      huskyMoveTimer = window.setTimeout(function () {
        huskyMoveTimer = null;

        if (!husky.classList.contains("is-visible")) {
          scheduleHuskyRoam(1800);
          return;
        }

        moveHuskySafely(husky);

        if (husky.classList.contains("is-chat-open")) {
          setHuskyEmotion("contact");
        } else {
          setHuskyEmotion("happy", 1800);
        }

        scheduleHuskyRoam(4200 + Math.random() * 2600);
      }, delay);
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
          setHuskyEmotion("happy", 2400);
          window.setTimeout(function () {
            moveHuskySafely(husky);
          }, 180);
          scheduleHuskyRoam(1800, true);
        }

        if (huskyHasAppeared) {
          husky.classList.add("is-visible");
          scheduleHuskyRoam(4200 + Math.random() * 2600);
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
        setHuskyEmotion("excited", 900);
        celebrate(rect.left + rect.width / 2, rect.top + rect.height / 2);
        moveHuskySafely(husky);
        scheduleHuskyRoam(2600, true);
        window.setTimeout(function () {
          if (husky && husky.classList.contains("is-chat-open")) {
            setHuskyEmotion("contact");
          }
        }, 850);
      });

      window.setInterval(function () {
        if (!husky || !husky.classList.contains("is-visible")) {
          return;
        }

        if (!husky.classList.contains("is-chat-open")) {
          setRandomHuskyMessage(false);
        }
      }, 7500);

      scheduleHuskyRoam(2600);
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
      setupFounderJourney();
      setupMotionAndHelper();
    });
  } else {
    setupThemeToggle();
    setupLanguageToggle();
    setupProjectDetails();
    setupMagneticEffects();
    setupFounderJourney();
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

    var targetHash = this.hash;
    var target = $(targetHash);

    if (!target.length) {
      $(document).on("scroll", onScroll);
      return;
    }

    $("html, body")
      .stop()
      .animate(
        {
          scrollTop: target.offset().top - 80,
        },
        500,
        "swing",
        function () {
          if (window.history && window.history.pushState) {
            window.history.pushState(null, "", targetHash);
          } else {
            window.location.hash = targetHash;
          }
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
