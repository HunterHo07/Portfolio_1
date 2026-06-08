/*global alert*/
(function () {
  "use strict";

  var languageStorageKey = "portfolio-language";
  var currentLanguage =
    localStorage.getItem(languageStorageKey) === "zh" ? "zh" : "en";
  var heroHeadlineTypingTimer = null;
  var navScrollHandler = null;
  var heroThreePointer = { x: 0, y: 0 };
  var heroThreeMotionFrame = null;

  var translations = {
    en: {
      "nav.home": "Home",
      "nav.vision": "Vision",
      "nav.about": "About",
      "nav.service": "Service & Price",
      "nav.contact": "Contact",
      "hero.capability":
        "Programming & Coding : Website, Mobile App, Server, Database, System, Software, Automation, Web & Mobile Responsive, iOS & Android, Machine Learning Ai, Web3 Blockchain.",
      "hero.headline": "I build web, mobile, AI automation and systems.",
      "hero.headlinePhrases": [
        "I build web, mobile, AI automation and systems.",
        "I turn messy ideas into working products.",
        "I ship websites, apps, dashboards and automation.",
        "I help clients solve problems the Lazy way.",
      ],
      "hero.promise":
        "Resolve Your Problem With The <strong>*Lazy*</strong> Way",
      "hero.ctaProject": "Hire for a project",
      "hero.ctaSpeak": "Book Me for Event",
      "hero.ctaProof": "Projects Demo",
      "hero.loading": "Loading hero visual",
      "sections.mobileTitle": "Native Mobile App Projects",
      "sections.mobileIntro":
        "Two real React Native / Expo app projects with Android package metadata, camera or contact permissions, and install-build profiles.",
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
      "theme.light": "Light",
    },
    zh: {
      "nav.home": "首页",
      "nav.vision": "愿景",
      "nav.about": "关于",
      "nav.service": "服务与价格",
      "nav.contact": "联系",
      "hero.capability":
        "编程与开发：网站、手机 App、服务器、数据库、系统、软件、自动化、响应式网页与手机、iOS 与 Android、机器学习 AI、Web3 区块链。",
      "hero.headline": "我打造网站、手机 App、AI 自动化与系统。",
      "hero.headlinePhrases": [
        "我打造网站、手机 App、AI 自动化与系统。",
        "我把混乱想法变成可上线产品。",
        "我交付网站、App、仪表板与自动化。",
        "我用 Lazy 的聪明方式帮客户解决问题。",
      ],
      "hero.promise": "用 <strong>*Lazy*</strong> 的聪明方式解决你的问题",
      "hero.ctaProject": "找我做项目",
      "hero.ctaSpeak": "预约活动分享",
      "hero.ctaProof": "项目 Demo",
      "hero.loading": "正在载入首页视觉",
      "sections.mobileTitle": "真实手机 App 项目",
      "sections.mobileIntro":
        "两个 React Native / Expo 手机 App 项目，包含 Android 包名、相机或联系人权限，以及可打包安装的构建配置。",
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
      "theme.light": "亮色",
    },
  };

  var projectBaseTitleTranslationsZh = {
    "Amazing Technology & Gaming": "科技与游戏创意页",
    "Professional Design & Animation": "专业设计与动画展示",
    "Mobile App The Future Is Now": "手机 App 未来现在式",
    "Smart Payment & Subscription Plans": "智能支付与订阅方案",
    "Game Portal & Games Development Demo": "游戏入口与开发展示",
    "Mobile App Development Show Case": "手机 App 开发展示",
    "PalWorld Multiplayer Open-World Game": "PalWorld 多人开放世界游戏",
    "Fintech Innovation Platform": "金融科技创新平台",
    "BlockChain Dashboard": "区块链仪表板",
    "Project 10 - BestzDeal Feature Marketplace": "BestzDeal 功能型市场",
    "Project 11 - Travel Booking Feature UI": "旅游预订功能界面",
    "Project 12 - OpsPilot Work Simulation": "OpsPilot 工作模拟",
    "Project 13 - TeamForge Manager Simulator": "TeamForge 管理者模拟器",
    "Project 14 - Cross-Border Report Platform": "跨境举报平台",
    "Project 15 - Civic Report Routing UI": "公共举报分流界面",
    "Project 16 - AR Digital Name Card": "AR 数字名片",
    "Project 17 - Scan-First Profile Sharing": "扫码优先资料分享",
    "Project 18 - AI Reverse Marketplace": "AI 反向市场",
    "Project 19 - Buyer Request Deal Flow": "买家需求成交流程",
    "Project 20 - Offer Comparison Marketplace": "报价对比市场",
    "Project 21 - Visual Entity Discussion": "图像实体讨论",
    "Project 22 - Community History by Photo": "照片驱动的社区记录",
    "Project 23 - Warranty Tracking Assistant": "保固追踪助手",
    "Project 24 - RunJian iRun SimWorld": "RunJian iRun SimWorld",
    "Project 25 - RunJian SimWorld Iteration": "RunJian SimWorld 迭代版",
    "Project 26 - WorkQuest Career Simulator": "WorkQuest 职涯模拟器",
    "Project 27 - SkillSprint Office Challenge": "SkillSprint 办公挑战",
    "Project 28 - CareerCraft Scenario Lab": "CareerCraft 情境实验室",
    "Project 29 - WorkPath Simulation Studio": "WorkPath 模拟工作室",
    "Project 30 - OpsForge Assessment Arena": "OpsForge 评估场",
    "Project 31 - TalentRise Progress Simulator": "TalentRise 成长模拟器",
    "Project 32 - Instant Website AI": "Instant Website AI",
    "Project 33 - Grab Recycling IOTA": "Grab Recycling IOTA",
    "Project 34 - WarrantyVault Service Assistant": "WarrantyVault 服务助手",
    "Project 35 - ContentOps AI Command Desk": "ContentOps AI 指挥台",
    "Project 36 - AdminFlow CMS Workspace": "AdminFlow CMS 工作台",
    "Project 37 - HirePath Talent Portal": "HirePath 人才门户",
    "Project 38 - RecruitFlow Hiring Hub": "RecruitFlow 招聘中心",
    "Project 39 - TalentBoard Job Marketplace": "TalentBoard 职缺市场",
    "Project 40 - LifeFlow AI": "LifeFlow AI",
    "Project 41 - DicePattern Analytics Console": "DicePattern 分析控制台",
    "Project 42 - Gami Sport": "Gami Sport",
    "Project 43 - RunJian Command World": "RunJian 指挥世界",
    "Mobile App 1 - WarrantyScan Mobile": "WarrantyScan 保固助手",
    "Mobile App 2 - NameCard Mobile": "NameCard 名片助手",
    "Games Demo - Neon Grid Racer": "霓虹网格赛车",
    "Games Demo - Orbit Defense": "轨道防御",
    "Games Demo - Husky Rescue Run": "哈士奇救援跑",
    "Games Demo - Dragon Forge Arena": "龙铸竞技场",
    "Games Demo - Quantum Card Lab": "量子卡牌实验室",
    "Games Demo - Neon Signal Run": "霓虹讯号跑",
    "Games Demo - Click The Dot": "点点快击",
    "Games Demo - Hunt The Dot": "猎点挑战",
    "Games Demo - Pick Drop Play": "拾取投放游玩",
    "Assets 1 - Browser 3D Asset Viewer": "浏览器 3D 资产查看器",
    "Assets 2 - Deployable 3D Catalog": "可部署 3D 目录",
    "Assets 3 - Q-Style 3D Models Lab": "Q 版 3D 模型实验室",
  };

  var staticCopy = {
    en: {
      demoProjects: "Demo Projects",
      details: "Details",
      liveDemo: "Live Demo",
      androidProject: "Android Project",
      androidReady: "Android-ready",
      mobileBuildStatuses: [
        "Native app source includes Android package <strong>com.hunterho.warrantyscan</strong>, camera permission, notification permission, and EAS APK profile.",
        "Native app source includes Android package <strong>com.hunterho.namecardmobile</strong>, contacts permission, notification permission, and EAS APK profile.",
      ],
      heroHunterDefault:
        "Still here? Tell me the problem and I will shape the build.",
      startupSoundNote:
        'Turn on sound for the full startup story. <a href="https://www.youtube.com/watch?v=KRxQ8JuqMyE" target="_blank" rel="noopener">Open on YouTube</a>',
      startupLabel: "Startup Lab",
      startupTitle: "TrillionUnicorn Startup Lab",
      startupIntro:
        "Seven public startup and OSS concepts from the TrillionUnicorn ecosystem. This is portfolio proof of product thinking, not the full startup website.",
      startupRoles: [
        "Fullstack Developer",
        "Ahfaiz Founder",
        "AI Automation Teacher",
        "CTO / Startup Builder",
        "Hackathon Winner",
        "Builder Since 2007",
      ],
      teachingLabel: "Speaker & Teaching",
      teachingTitle: "IT Teaching & Community Sharing",
      teachingIntro:
        "Invited classes, boot camp teaching, event speaking, and knowledge sharing that give practical IT experience back to the community.",
      teachingCards: [
        [
          "Invited Mentor Session",
          "Intro to N8N Application & Basics",
          "Automation class invitation proof for N8N application basics and workflow foundations.",
        ],
        [
          "Online Class",
          "Non-IT vs Real-IT",
          "Free online session explaining the practical difference between surface tech and real IT work.",
        ],
        [
          "Online Boot Camp",
          "Vibe Coding 101",
          "Multi-session online class covering practical coding rhythm, delivery habits, and fullstack thinking for real projects.",
        ],
        [
          "Career Readiness",
          "Decoding Tech Readiness",
          "Mentoring session on what hiring managers and real project teams look for.",
        ],
        [
          "Workflow Class",
          "Developer Productivity Workflow",
          "Workflow and workplace guidance for developers who want better execution habits.",
        ],
      ],
      timelineLabel: "Outside Full-Time Work",
      timelineTitle: "Hunter Events",
      timelineIntro:
        "Outside full-time work: hackathons, Web3 events, startup weekends, invited sessions, team highlights, and fun achievement moments.",
      timelineTags: [
        "Hackathons",
        "Web3 Events",
        "Startup",
        "Team Highlights",
        "Achievement",
      ],
      timelineCaptions: [
        [
          "Hackathon | Team | Build",
          "Team Build Table",
          "Outside-work sprint energy",
        ],
        [
          "Achievement | Deriv | AI",
          "Deriv Public Proof",
          "Team Phantom winner moment",
        ],
        [
          "Innovation | NTIS | Event",
          "NTIS Open Day",
          "Commercialisation exposure",
        ],
        [
          "Web3 | Event | Network",
          "Web3 Afterparty",
          "Community side-event highlight",
        ],
        [
          "Web3 | IOTA | Team",
          "IOTA Booth Discussion",
          "Event floor conversation",
        ],
        [
          "Hackathon | IOTA | Pitch",
          "IOTA Pitch Moment",
          "Live stage explanation",
        ],
        [
          "Hackathon | IOTA | Stage",
          "IOTA Hackathon Stage",
          "Malaysia 2025 event room",
        ],
        [
          "Startup | Competition",
          "Startup Competition",
          "Founder-room conversations",
        ],
        [
          "Hackathon | Sui | Prize",
          "Sui Hacker House",
          "1st runner up, RM3,000",
        ],
        [
          "Hackathon | Sui | Kit",
          "Hacker House Kit",
          "Small proof from the build floor",
        ],
        [
          "Hackathon | Deriv | Team",
          "Team Phantom Table",
          "Build sprint with teammates",
        ],
        [
          "Team | Discussion",
          "Demo Review Moment",
          "Working through project ideas",
        ],
        [
          "Hackathon | Badge | Proof",
          "Deriv Hacker Badge",
          "Team Phantom participant proof",
        ],
        [
          "Achievement | Deriv | Stage",
          "Deriv Winner Stage",
          "Public winner announcement",
        ],
        [
          "Achievement | RM15,000",
          "First Prize Proof",
          "AI Champion award moment",
        ],
        ["Web3 | Team | Event", "Web3 Team Table", "Side-event coordination"],
        [
          "Startup Weekend | Team",
          "Startup Weekend Build",
          "Early founder sprint memory",
        ],
        [
          "Team | Startup | Sync",
          "Coffee Team Sync",
          "Planning outside the venue",
        ],
        [
          "Hackathon | Early Team",
          "Early Hackathon Table",
          "Older build-floor memory",
        ],
        [
          "Startup | Hackathon | Team",
          "Early Team Build",
          "Prototype-room snapshot",
        ],
        ["Achievement | Champion", "Champion Selfie", "Personal winner proof"],
        [
          "Hackathon | Submission",
          "Deriv Submission Stage",
          "Final project handoff moment",
        ],
        [
          "Startup Weekend | Team",
          "Early Team Build",
          "Teamwork before the pitch",
        ],
        [
          "Event | Build Sprint",
          "Champion Stage",
          "Countdown and event promotion",
        ],
        [
          "Achievement | AI | Stage",
          "Champion Proof",
          "Winner-stage highlight",
        ],
      ],
      prev: "Prev",
      next: "Next",
      skip: "Skip",
      aboutHeading: "Tech Stack",
      aboutProof: [
        "Fullstack",
        "AI Automation",
        "Mobile",
        "UI/UX",
        "Web3",
        "DevOps",
      ],
      serviceMenuKicker: "Client Build Menu",
      serviceMenuTitle: "Choose the outcome. Hunter ships the stack.",
      serviceCards: [
        "Develop & Build a perfect website for you: Website, Mobile Responsive, eCommerce, Business, Media, Blog, forum.",
        "Setup & Maintenance : Server & Database, Setup Shared Hosting, VPS, Security Enhanced, Custom API, Migration.",
        "Custom For Your Business Need: (CMS)Content Management System, (CMMS)Computerized Maintenance Management System, Web Content Management for Financial, (EAM)Enterprise Asset Management, Custom Software.",
        "iOS & Android : Flutter, React-Native, Ionic, Cordova, WebApp, PWA, PhoneGap, FlutterFlow (Apple Store | Google Play Store and other App Store).",
        "Automation, Task Automation, Data-Training & Analysis, Predictor, Sentiment Analyzer, Object Detection, Recognition, Forecasting, Recommendation System, ChatBot, ChatGPT API.",
        "Front-End designer, Fast load times, Lag free interaction, Responsive, Dynamic, intuitive UX/UI, image & photo protection and size reduce",
      ],
      pricingKicker: "Market Pricing Snapshot",
      pricingClose: "Close pricing details",
      offerKicker: "Service Offer",
      offerDiscount: "50% Discount",
      offerNote: "Save up to 50% on server/hosting maintenance.",
      copyright: "© Copyrights Hunter Ho. All rights reserved.",
      contactAria:
        "On-site or remote: Malaysia and Singapore on-site, worldwide remote any timezone. Direct contact email: HunterHo.My@gmail.com.",
      contactMode: "ON-SITE / REMOTE",
      contactRegion:
        "MALAYSIA & SINGAPORE (ON-SITE) / WORLDWIDE (REMOTE ANY TIMEZONE)",
      contactDirect: "DIRECT CONTACT",
      contactEmailLabel: "Email:",
      projectDetails: "Project Details",
      clickTechChip: "Click a tech chip",
      skillDemoIntro:
        "Open a short reusable skill demo to see how that capability helps a real client project.",
      founderDashboardAria: "Founder proof dashboard",
      founderNavigationAria: "Founder proof navigation",
      founderDetailsAria: "Complete proof poster details",
      founderIntro: {
        label: "Proof Theater",
        title: "Choose a proof moment.",
        message:
          "Use the proof controls to reveal six public moments without blocking the poster.",
      },
      founderSteps: [
        [
          "Challenge Accepted",
          "Sportsmanship, challenge breaking, and constant self-improvement.",
        ],
        [
          "Trillion Unicorn CTO",
          "Startup architecture, CTO vision, and trillion-unicorn product direction.",
        ],
        [
          "Ahfaiz AI Startup",
          "AI life companion product, assistant UX, and startup ownership.",
        ],
        [
          "WorldCup Remote Work",
          "Invited WorldCup 2026 proof with work-anywhere delivery mindset.",
        ],
        [
          "Hackathon Winner",
          "Pressure-tested execution across AI, Web3, and innovation events.",
        ],
        [
          "Community IT Teacher",
          "Invited teaching, knowledge sharing, and speaker contribution back to the community.",
        ],
      ],
      founderCallouts: [
        [
          "Challenge Accepted",
          "Sportsmanship and self-breakthrough keep the standard moving.",
          "Sportsmanship, challenge breaking, and challenge accepting keep the standard moving upward.",
        ],
        [
          "Trillion Unicorn CTO",
          "Startup architecture turns big vision into a product path.",
          "Startup architecture, CTO thinking, and product framing turn big vision into an executable product path.",
        ],
        [
          "Ahfaiz AI Startup",
          "AI companion ideas become real app direction and user value.",
          "AI companion ideas become product direction, assistant UX, user value, and startup ownership.",
        ],
        [
          "WorldCup Remote Work",
          "Work-anywhere proof, remote delivery, and global readiness.",
          "Work-anywhere proof shows remote delivery, global readiness, and client work that is not limited by location.",
        ],
        [
          "Hackathon Winner",
          "Proven pressure delivery across AI, Web3, and innovation.",
          "Proven pressure delivery across AI, Web3, and innovation events with public winner records.",
        ],
        [
          "Community IT Teacher",
          "Invited classes and talks share practical IT back to the community.",
          "Invited classes, talks, and mentoring share practical IT knowledge back to the community.",
        ],
      ],
      premiumFocus:
        "Premium but credible delivery focus: clear UX, readable content, responsive behavior, visual polish, and demo-ready storytelling.",
      defaultProjectStory:
        "is presented as a client-ready showcase with product positioning, responsive UI, interaction polish, and a clear demo path. The build turns a raw idea into something a client, interviewer, or investor can understand quickly, then expand into a real website, app, dashboard, system, or automation workflow.",
      defaultProjectAbout:
        "This project is framed as a practical portfolio demo: readable, responsive, demo-ready, and built to communicate value before overbuilding unnecessary backend complexity.",
      projectThinking:
        "The important part is not only the visual page; it is the product thinking behind it: what the user should do next, what the client can validate, and how the demo can grow into a production-ready build.",
      defaultClientValue:
        "This helps clients validate an idea, attract users or investors, explain a workflow, and choose a freelancer who can handle product thinking, front-end execution, mobile responsiveness, visual polish, and deployment.",
      footerBanner: "images/founder-banner.webp",
    },
    zh: {
      demoProjects: "项目 Demo",
      details: "详情",
      liveDemo: "在线 Demo",
      androidProject: "Android 项目",
      androidReady: "可打包 Android",
      mobileBuildStatuses: [
        "原生 App 源码包含 Android package <strong>com.hunterho.warrantyscan</strong>、相机权限、通知权限，以及 EAS APK 配置。",
        "原生 App 源码包含 Android package <strong>com.hunterho.namecardmobile</strong>、联系人权限、通知权限，以及 EAS APK 配置。",
      ],
      heroHunterDefault: "还在这里？告诉我问题，我帮你整理成可开发方案。",
      startupSoundNote:
        '打开声音，听完整的创业故事。 <a href="https://www.youtube.com/watch?v=KRxQ8JuqMyE" target="_blank" rel="noopener">到 YouTube 打开</a>',
      startupLabel: "创业实验室",
      startupTitle: "TrillionUnicorn 创业实验室",
      startupIntro:
        "这里整理了 TrillionUnicorn 生态里的七个公开创业与开源概念。它展示的是产品思路与执行证明，不是完整创业官网。",
      startupRoles: [
        "全栈开发者",
        "Ahfaiz 创办人",
        "AI 自动化讲师",
        "CTO / 创业构建者",
        "黑客松得奖者",
        "自 2007 起持续构建",
      ],
      teachingLabel: "演讲与教学",
      teachingTitle: "IT 教学与社区分享",
      teachingIntro:
        "包含受邀课程、训练营教学、活动分享与知识回馈，把实战 IT 经验带回社区。",
      teachingCards: [
        [
          "线上课程",
          "Non-IT vs Real-IT",
          "免费线上分享，说明表面科技与真正 IT 实战之间的差别。",
        ],
        [
          "线上训练营",
          "Vibe Coding 101",
          "多堂线上课程，讲解实战 coding 节奏、交付习惯与真实项目需要的全栈思维。",
        ],
        [
          "受邀导师课程",
          "N8N 应用与基础导论",
          "以 N8N 应用基础与工作流观念为核心的自动化课程邀请证明。",
        ],
        [
          "职涯准备",
          "解读科技就绪度",
          "面向求职者与团队成员的 mentoring，说明招聘者与真实项目团队在看什么。",
        ],
        [
          "工作流课程",
          "开发者生产力工作流",
          "帮助开发者建立更稳定执行习惯的工作流与职场实战分享。",
        ],
      ],
      timelineLabel: "全职工作以外",
      timelineTitle: "Hunter 时间线 + 正在发生",
      timelineIntro:
        "全职工作之外，还持续参与黑客松、Web3 活动、创业周末、受邀分享、团队协作与各类有趣成果时刻。",
      timelineTags: ["黑客松", "Web3 活动", "创业", "团队亮点", "成果"],
      timelineCaptions: [
        ["黑客松 | 团队 | 构建", "团队构建现场", "下班后的冲刺能量"],
        ["成果 | Deriv | AI", "Deriv 公开证明", "Team Phantom 得奖时刻"],
        ["创新 | NTIS | 活动", "NTIS 开放日", "商业化曝光现场"],
        ["Web3 | 活动 | 人脉", "Web3 Afterparty", "社区侧活动亮点"],
        ["Web3 | IOTA | 团队", "IOTA 展位交流", "活动现场对谈"],
        ["黑客松 | IOTA | 简报", "IOTA 简报时刻", "舞台即场说明"],
        ["黑客松 | IOTA | 舞台", "IOTA 黑客松舞台", "马来西亚 2025 活动现场"],
        ["创业 | 比赛", "创业竞赛现场", "创办人交流时刻"],
        ["黑客松 | Sui | 奖项", "Sui Hacker House", "亚军，RM3,000"],
        ["黑客松 | Sui | 物料", "Hacker House 物料", "构建现场的小证明"],
        ["黑客松 | Deriv | 团队", "Team Phantom 桌面", "与队友一起冲刺"],
        ["团队 | 讨论", "Demo 评审时刻", "一起推进项目想法"],
        ["黑客松 | 证件 | 证明", "Deriv 黑客证件", "Team Phantom 参与证明"],
        ["成果 | Deriv | 舞台", "Deriv 得奖舞台", "公开得奖宣布"],
        ["成果 | RM15,000", "冠军奖金证明", "AI 冠军领奖时刻"],
        ["Web3 | 团队 | 活动", "Web3 团队桌", "侧活动协调现场"],
        ["创业周末 | 团队", "创业周末构建", "早期创办人冲刺记忆"],
        ["团队 | 创业 | 同步", "咖啡团队同步", "场外规划时刻"],
        ["黑客松 | 早期团队", "早期黑客松桌", "较早期的构建回忆"],
        ["创业 | 黑客松 | 团队", "早期团队构建", "原型室快照"],
        ["成果 | 冠军", "冠军自拍", "个人得奖证明"],
        ["黑客松 | 提交", "Deriv 提交阶段", "最终项目交付时刻"],
        ["创业周末 | 团队", "早期团队构建", "简报前的团队合作"],
        ["活动 | 冲刺", "冠军舞台", "倒数与活动宣传"],
        ["成果 | AI | 舞台", "冠军证明", "得奖舞台亮点"],
      ],
      prev: "上一个",
      next: "下一个",
      skip: "跳过",
      aboutHeading: "把想法落成可上线系统的资深程序员。",
      aboutProof: ["全栈", "AI 自动化", "手机 App", "UI/UX", "Web3", "DevOps"],
      serviceMenuKicker: "客户构建菜单",
      serviceMenuTitle: "你选结果，Hunter 负责整套交付。",
      serviceCards: [
        "为你开发与构建完整网站：企业官网、响应式网站、电商、商业站、媒体站、博客与论坛。",
        "服务器与数据库的搭建与维护：共享主机、VPS、安全强化、自定义 API、迁移与日常维护。",
        "按业务需要定制软件：CMS、CMMS、金融内容系统、EAM 与其他专属软件系统。",
        "iOS 与 Android 开发：Flutter、React-Native、Ionic、Cordova、WebApp、PWA、PhoneGap、FlutterFlow，并可面向各类应用商店交付。",
        "自动化、任务自动化、数据训练与分析、预测、情绪分析、目标检测、识别、预测模型、推荐系统、聊天机器人与 ChatGPT API。",
        "前端设计、快速加载、低延迟互动、响应式、动态化、直觉式 UX/UI，以及图片保护与体积优化。",
      ],
      pricingKicker: "市场价格快照",
      pricingClose: "关闭价格详情",
      offerKicker: "服务优惠",
      offerDiscount: "50% 折扣",
      offerNote: "服务器／主机维护最高可省 50%。",
      copyright: "© Hunter Ho 版权所有。",
      contactAria:
        "可现场或远程合作：马来西亚与新加坡可现场，全球任何时区可远程。直接联系邮箱：HunterHo.My@gmail.com。",
      contactMode: "现场 / 远程",
      contactRegion: "马来西亚与新加坡可现场 / 全球远程（任何时区）",
      contactDirect: "直接联系",
      contactEmailLabel: "Email:",
      projectDetails: "项目详情",
      clickTechChip: "点击一个技术标签",
      skillDemoIntro: "查看这个能力如何帮助真实客户项目的小型复用 Demo。",
      founderDashboardAria: "创办人证明面板",
      founderNavigationAria: "创办人证明导航",
      founderDetailsAria: "完整证明海报细节",
      founderIntro: {
        label: "证明剧场",
        title: "选择一个证明时刻。",
        message: "用这些证明控制查看六个公开时刻，同时不遮住整张海报。",
      },
      founderSteps: [
        ["接受挑战", "运动精神、突破挑战，以及持续自我提升。"],
        [
          "Trillion Unicorn CTO",
          "创业架构、CTO 视角，以及 trillion-unicorn 产品方向。",
        ],
        ["Ahfaiz AI 创业", "AI 生活伙伴产品、助手体验，以及创业 ownership。"],
        ["WorldCup 远程工作", "WorldCup 2026 邀请证明与全球远程交付心态。"],
        ["黑客松得奖者", "在 AI、Web3 与创新活动中经过压力验证的执行力。"],
        ["社区 IT 讲师", "受邀教学、知识分享，以及回馈社区的讲者贡献。"],
      ],
      founderCallouts: [
        [
          "接受挑战",
          "运动精神与自我突破让标准持续提高。",
          "运动精神、突破挑战与接受挑战，让标准持续往上。",
        ],
        [
          "Trillion Unicorn CTO",
          "创业架构把大愿景变成产品路径。",
          "创业架构、CTO 思维与产品 framing，把大愿景变成可执行的产品路径。",
        ],
        [
          "Ahfaiz AI 创业",
          "AI 伙伴想法变成真实产品方向与用户价值。",
          "AI 伙伴想法转化为产品方向、助手体验、用户价值与创业 ownership。",
        ],
        [
          "WorldCup 远程工作",
          "全球远程证明、跨地交付与国际准备度。",
          "全球远程工作证明展示了跨地点交付、全球准备度，以及不受地点限制的客户工作。",
        ],
        [
          "黑客松得奖者",
          "在 AI、Web3 与创新场景中证明压力下交付。",
          "在 AI、Web3 与创新活动中，以公开得奖记录证明高压下交付。",
        ],
        [
          "社区 IT 讲师",
          "受邀课程与分享，把实战 IT 回馈给社区。",
          "受邀课程、演讲与 mentoring，把实战 IT 知识回馈给社区。",
        ],
      ],
      premiumFocus:
        "高质但务实的交付重点：清晰 UX、可读内容、响应式行为、视觉打磨，以及可演示的产品叙事。",
      defaultProjectStory:
        "以客户可理解的方式展示产品定位、响应式 UI、互动打磨与清楚 Demo 路径。这个构建把原始想法变成客户、面试官或投资人能快速理解的作品，并可继续扩展成真正的网站、App、仪表板、系统或自动化流程。",
      defaultProjectAbout:
        "这个项目被包装成务实的作品集 Demo：清楚、响应式、可演示，并能在不过度堆后台复杂度前先说明价值。",
      projectThinking:
        "重点不只是视觉页面，而是背后的产品思考：用户下一步该做什么、客户能验证什么，以及 Demo 如何成长为可上线交付。",
      defaultClientValue:
        "这能帮助客户验证想法、吸引用户或投资人、解释流程，并选择能同时处理产品思考、前端执行、手机响应、视觉打磨与部署的自由开发者。",
      footerBanner: "images/founder-banner-cn.webp",
    },
  };

  function getProjectBaseTitle(projectTitle) {
    return projectBaseTitleTranslationsZh[projectTitle] || projectTitle;
  }

  function getLocalizedProjectTitle(projectTitle) {
    var projectMatch;
    var mobileMatch;
    var gameMatch;
    var assetsMatch;

    if (currentLanguage !== "zh") {
      return projectTitle;
    }

    projectMatch = projectTitle.match(/^Project (\d+) - /);
    if (projectMatch) {
      return (
        "项目 " + projectMatch[1] + " - " + getProjectBaseTitle(projectTitle)
      );
    }

    mobileMatch = projectTitle.match(/^Mobile App (\d+) - /);
    if (mobileMatch) {
      return (
        "手机 App " + mobileMatch[1] + " - " + getProjectBaseTitle(projectTitle)
      );
    }

    gameMatch = projectTitle.match(/^Games Demo - /);
    if (gameMatch) {
      return "游戏 Demo - " + getProjectBaseTitle(projectTitle);
    }

    assetsMatch = projectTitle.match(/^Assets (\d+) - /);
    if (assetsMatch) {
      return (
        "资源 " + assetsMatch[1] + " - " + getProjectBaseTitle(projectTitle)
      );
    }

    return getProjectBaseTitle(projectTitle);
  }

  function localizeCardPrefix(prefix) {
    var match;

    if (!prefix || currentLanguage !== "zh") {
      return prefix;
    }

    match = prefix.match(/^Project\s+(\d+)$/);
    if (match) {
      return "项目 " + match[1];
    }

    match = prefix.match(/^Mobile App\s+(\d+)$/);
    if (match) {
      return "手机 App " + match[1];
    }

    match = prefix.match(/^Assets\s+(\d+)$/);
    if (match) {
      return "资源 " + match[1];
    }

    return prefix;
  }

  function setTextContent(selector, value) {
    var element = document.querySelector(selector);
    if (element) {
      element.textContent = value;
    }
  }

  function setHtmlContent(selector, value) {
    var element = document.querySelector(selector);
    if (element) {
      element.innerHTML = value;
    }
  }

  function setGlitchText(selector, value) {
    var element = document.querySelector(selector);
    if (element) {
      element.textContent = value;
      element.setAttribute("data-text", value);
    }
  }

  function setAttribute(selector, attribute, value) {
    var element = document.querySelector(selector);
    if (element) {
      element.setAttribute(attribute, value);
    }
  }

  function setDeferredImageSource(image, src) {
    if (!image || !src) {
      return;
    }

    if (image.dataset && image.dataset.src && image.dataset.loaded !== "true") {
      image.dataset.src = src;
      return;
    }

    image.src = src;
  }

  function setIndexedText(selector, values) {
    document.querySelectorAll(selector).forEach(function (element, index) {
      if (values[index]) {
        element.textContent = values[index];
      }
    });
  }

  function setIndexedHtml(selector, values) {
    document.querySelectorAll(selector).forEach(function (element, index) {
      if (values[index]) {
        element.innerHTML = values[index];
      }
    });
  }

  function setIndexedCaptionTriples(selector, values) {
    document.querySelectorAll(selector).forEach(function (caption, index) {
      var item = values[index];
      if (!item) {
        return;
      }
      setTextContentFor(caption.querySelector("span"), item[0]);
      setTextContentFor(caption.querySelector("strong"), item[1]);
      setTextContentFor(caption.querySelector("em"), item[2]);
    });
  }

  function localizeProjectCardTitle(card, projectTitle, link) {
    var originalPrefix = card.getAttribute("data-card-prefix-en");
    var originalMain = card.getAttribute("data-card-main-en");
    var localizedTitle = getLocalizedProjectTitle(projectTitle);
    var prefixMatch;
    var mainTitle;
    var originalMarkup;
    var splitParts;

    if (!originalMain) {
      originalMarkup = link.innerHTML
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/\u00a0/g, " ");
      splitParts = originalMarkup
        .split("\n")
        .map(function (part) {
          return part.replace(/\s+/g, " ").trim();
        })
        .filter(Boolean);
      if (splitParts.length > 1) {
        originalPrefix = splitParts[0];
        originalMain = splitParts.slice(1).join(" ");
      } else {
        originalMain = link.textContent.replace(/\s+/g, " ").trim();
        prefixMatch = originalMain.match(
          /^((?:Project|Mobile App|Assets)\s+\d+)\s+(.+)$/,
        );
        if (prefixMatch) {
          originalPrefix = prefixMatch[1];
          originalMain = prefixMatch[2];
        }
      }
      card.setAttribute("data-card-prefix-en", originalPrefix || "");
      card.setAttribute("data-card-main-en", originalMain);
    }

    if (currentLanguage !== "zh") {
      setSplitHeading(link, originalPrefix, originalMain);
      return;
    }

    prefixMatch = localizedTitle.match(
      /^((?:项目|手机 App|资源)\s+\d+)\s+-\s+(.+)$/,
    );
    if (prefixMatch) {
      setSplitHeading(link, prefixMatch[1], prefixMatch[2]);
      return;
    }

    mainTitle = localizedTitle.replace(/^游戏 Demo\s+-\s+/, "");
    setSplitHeading(link, localizeCardPrefix(originalPrefix), mainTitle);
  }

  function applyStaticCopy(dictionary) {
    var copy = staticCopy[currentLanguage] || staticCopy.en;
    var contactFooterImage = document.querySelector(".contact-footer-bg img");

    setTextContent("#hero-hunter-message", copy.heroHunterDefault);
    setTextContent(
      ".hero-image-loader span",
      dictionary["hero.loading"] || translations.en["hero.loading"],
    );
    setGlitchText("#demo-projects-section .glitch", copy.demoProjects);
    setGlitchText(
      "#mobile-app-demos .glitch",
      dictionary["sections.mobileTitle"] ||
        translations.en["sections.mobileTitle"],
    );
    setGlitchText(
      "#games-demo-section .glitch",
      dictionary["sections.gamesTitle"] ||
        translations.en["sections.gamesTitle"],
    );
    setGlitchText(
      "#project-assets-section .glitch",
      dictionary["sections.modelsTitle"] ||
        translations.en["sections.modelsTitle"],
    );

    setHtmlContent(".startup-sound-note", copy.startupSoundNote);
    setTextContent(".startup-lab-copy .vision-label", copy.startupLabel);
    setTextContent(".startup-lab-copy h2", copy.startupTitle);
    setTextContent(".startup-lab-copy p", copy.startupIntro);
    setIndexedText(".startup-founder-roles span", copy.startupRoles);
    setAttribute(".startup-founder-band", "aria-label", copy.startupTitle);
    setAttribute(
      ".startup-icon-row",
      "aria-label",
      currentLanguage === "zh"
        ? "七个 TrillionUnicorn 创业概念"
        : "Seven TrillionUnicorn startup concepts",
    );
    document
      .querySelectorAll(".startup-icon-link[data-tooltip-en]")
      .forEach(function (link) {
        var tooltip = link.getAttribute(
          currentLanguage === "zh" ? "data-tooltip-zh" : "data-tooltip-en",
        );
        if (tooltip) {
          link.setAttribute("data-tooltip", tooltip);
        }
      });
    setAttribute(
      ".startup-founder-roles",
      "aria-label",
      currentLanguage === "zh" ? "核心角色" : "Core roles",
    );
    setAttribute(
      ".startup-tech-stack-flow",
      "aria-label",
      currentLanguage === "zh"
        ? "Hunter 使用的技术栈、品牌、软件与 AI 工具"
        : "Technology stacks, brands, software, and AI tools used by Hunter",
    );

    setTextContentFor(
      document.querySelector("[data-founder-copy-label]"),
      copy.founderIntro.label,
    );
    setTextContentFor(
      document.querySelector("[data-founder-copy-title]"),
      copy.founderIntro.title,
    );
    setTextContentFor(
      document.querySelector("[data-founder-copy-message]"),
      copy.founderIntro.message,
    );
    setAttribute(
      ".founder-dashboard-hud",
      "aria-label",
      copy.founderDashboardAria,
    );
    setAttribute(
      ".founder-final-callouts",
      "aria-label",
      copy.founderDetailsAria,
    );
    setAttribute(
      ".founder-theater-controls",
      "aria-label",
      copy.founderNavigationAria,
    );
    document
      .querySelectorAll(".founder-step-btn")
      .forEach(function (button, index) {
        var item = copy.founderSteps[index];
        if (!item) {
          return;
        }
        setTextContentFor(button.querySelector("strong"), item[0]);
        setTextContentFor(button.querySelector("span"), item[1]);
      });
    document
      .querySelectorAll(".founder-final-callout")
      .forEach(function (button, index) {
        var item = copy.founderCallouts[index];
        if (!item) {
          return;
        }
        button.setAttribute("data-final-proof-title", item[0]);
        button.setAttribute("data-final-proof-body", item[2]);
        setTextContentFor(button.querySelector("strong"), item[0]);
        setTextContentFor(button.querySelector("p"), item[1]);
      });
    setTextContentFor(
      document.querySelector("[data-final-proof-detail-title]"),
      copy.founderCallouts[0][0],
    );
    setTextContentFor(
      document.querySelector("[data-final-proof-detail-body]"),
      copy.founderCallouts[0][2],
    );
    setTextContent('[data-founder-action="prev"]', copy.prev);
    setTextContent('[data-founder-action="next"]', copy.next);
    setTextContent('[data-founder-action="skip"]', copy.skip);

    setTextContent("#speaker-teaching .vision-label", copy.teachingLabel);
    setTextContent("#speaker-teaching h2", copy.teachingTitle);
    setTextContent(
      "#speaker-teaching .proof-section-heading p",
      copy.teachingIntro,
    );
    document
      .querySelectorAll(".teaching-proof-card")
      .forEach(function (card, index) {
        var item = copy.teachingCards[index];
        if (!item) {
          return;
        }
        setTextContentFor(
          card.querySelector(".teaching-card-copy span"),
          item[0],
        );
        setTextContentFor(
          card.querySelector(".teaching-card-copy h3"),
          item[1],
        );
        setTextContentFor(card.querySelector(".teaching-card-copy p"), item[2]);
      });
    setAttribute("#speaker-teaching", "aria-label", copy.teachingLabel);

    setTextContent("#hackathon-wins .vision-label", copy.timelineLabel);
    setTextContent("#hackathon-wins h2", copy.timelineTitle);
    setTextContent(
      "#hackathon-wins .proof-section-heading p",
      copy.timelineIntro,
    );
    setIndexedText(".hackathon-timeline-tags span", copy.timelineTags);
    setTextContent("[data-carousel-prev]", copy.prev);
    setTextContent("[data-carousel-next]", copy.next);
    setIndexedCaptionTriples(
      ".hackathon-carousel-frame figcaption",
      copy.timelineCaptions,
    );
    setAttribute(
      ".hackathon-timeline-tags",
      "aria-label",
      currentLanguage === "zh" ? "时间线分类" : "Timeline categories",
    );
    setAttribute(
      ".hackathon-glass-carousel",
      "aria-label",
      currentLanguage === "zh"
        ? "Hunter 时间线与活动图库"
        : "Hunter timeline and event gallery",
    );
    setAttribute(
      "[data-carousel-prev]",
      "aria-label",
      currentLanguage === "zh" ? "时间线向后移动" : "Move timeline backward",
    );
    setAttribute(
      "[data-carousel-next]",
      "aria-label",
      currentLanguage === "zh" ? "时间线向前移动" : "Move timeline forward",
    );

    setTextContent("#about .p-heading", copy.aboutHeading);
    setIndexedText(".service-proof-strip span", copy.aboutProof);
    setTextContent(".service-subhead .section-kicker", copy.serviceMenuKicker);
    setTextContent(".service-subhead h3", copy.serviceMenuTitle);
    setIndexedText(
      ".service-capability-grid .services-block .separator",
      copy.serviceCards,
    );
    setIndexedText(".mobile-app-links a:first-child", [
      copy.liveDemo,
      copy.liveDemo,
    ]);
    setIndexedText(".mobile-app-links a:last-child", [
      copy.androidProject,
      copy.androidProject,
    ]);
    setIndexedText(".mobile-app-platforms span:last-child", [
      copy.androidReady,
      copy.androidReady,
    ]);
    setIndexedHtml(".app-build-status", copy.mobileBuildStatuses);
    setTextContent(".service-pricing-copy .section-kicker", copy.pricingKicker);
    setAttribute(".service-pricing-close", "aria-label", copy.pricingClose);
    setTextContent(".contact-kicker", copy.offerKicker);
    setTextContent(".discount-text", copy.offerDiscount);
    setTextContent(".contact-discount span:last-child", copy.offerNote);
    setTextContent(".contact-copyright-dock span", copy.copyright);
    setAttribute(".contact-contact", "aria-label", copy.contactAria);
    setTextContent(".contact-banner-mode", copy.contactMode);
    setTextContent(".contact-banner-region", copy.contactRegion);
    setTextContent(".contact-banner-direct", copy.contactDirect);
    setTextContent(".contact-banner-email-label", copy.contactEmailLabel);

    setTextContent("#project-detail-title", copy.projectDetails);
    setTextContent("#project-skill-demo strong", copy.clickTechChip);
    setTextContent("#project-skill-demo p", copy.skillDemoIntro);
    setAttribute(
      ".project-detail-close",
      "aria-label",
      currentLanguage === "zh" ? "关闭项目详情" : "Close project details",
    );

    document.querySelectorAll(".project-detail-btn").forEach(function (button) {
      var card = button.closest(".journal-info");
      var link;
      var image;
      var projectTitle = button.getAttribute("data-project-title") || "";
      if (!card || !projectTitle) {
        return;
      }
      link = card.querySelector(".journal-txt h4 a");
      image = card.querySelector("img");
      button.textContent = copy.details;
      button.setAttribute(
        "aria-label",
        copy.details + ": " + getLocalizedProjectTitle(projectTitle),
      );
      if (link) {
        localizeProjectCardTitle(card, projectTitle, link);
      }
      if (image) {
        image.alt = getLocalizedProjectTitle(projectTitle);
      }
    });

    setDeferredImageSource(contactFooterImage, copy.footerBanner);
  }

  function setTextContentFor(element, value) {
    if (element) {
      element.textContent = value;
    }
  }

  function setSplitHeading(link, prefix, suffix) {
    link.innerHTML = "";
    if (prefix) {
      link.appendChild(document.createTextNode(prefix));
      link.appendChild(document.createElement("br"));
      link.appendChild(document.createTextNode(suffix));
      return;
    }
    link.textContent = suffix;
  }

  function setupDynamicNavbar() {
    var navMenu = document.querySelector(".nav-menu");
    var navSections = Array.prototype.slice.call(
      document.querySelectorAll("[data-nav-label][id]"),
    );

    if (!navMenu || !navSections.length) {
      return;
    }

    navMenu.innerHTML = "";
    navSections.forEach(function (section) {
      var label =
        currentLanguage === "zh"
          ? section.getAttribute("data-nav-label-zh")
          : section.getAttribute("data-nav-label");
      var listItem = document.createElement("li");
      var link = document.createElement("a");

      link.href = "#" + section.id;
      link.className = "smoothScroll";
      link.textContent = label || section.id;
      listItem.appendChild(link);
      navMenu.appendChild(listItem);
    });

    if (navScrollHandler) {
      window.removeEventListener("scroll", navScrollHandler);
      window.removeEventListener("resize", navScrollHandler);
    }

    function getSectionDocumentTop(section) {
      return section.getBoundingClientRect().top + window.scrollY;
    }

    navScrollHandler = function () {
      var activeSection = navSections[0];
      var scrollAnchor = window.scrollY + 120;

      navSections.forEach(function (section) {
        if (getSectionDocumentTop(section) <= scrollAnchor) {
          activeSection = section;
        }
      });

      navMenu.querySelectorAll("a").forEach(function (link) {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === "#" + activeSection.id,
        );
      });
    };

    window.addEventListener("scroll", navScrollHandler, { passive: true });
    window.addEventListener("resize", navScrollHandler);
    navScrollHandler();
  }

  var skillDemos = [
    {
      match: ["pwa", "mobile", "responsive", "react native", "flutter"],
      title: "Mobile App Shell",
      copy: "Mini demo: phone layout, bottom navigation, touch-first spacing, offline-friendly state, and deployable web/PWA presentation.",
    },
    {
      match: ["image", "lazy", "loading", "optimization"],
      title: "Image Optimization",
      copy: "Mini demo: lazy loading, fixed image dimensions, compressed assets, and faster perceived loading for portfolio and landing pages.",
    },
    {
      match: ["animation", "motion"],
      title: "Loading & Motion",
      copy: "Mini demo: skeleton loading, smooth reveal, hover depth, and reduced-motion safety so the UI feels premium without hurting readability.",
    },
    {
      match: ["svelte", "typescript", "javascript", "html", "css"],
      title: "Frontend Build",
      copy: "Mini demo: reusable UI sections, stateful interactions, responsive layouts, and clean static deployment for fast client review.",
    },
    {
      match: ["marketplace", "seller", "buyer", "deal"],
      title: "Marketplace Flow",
      copy: "Mini demo: buyer request, seller offers, comparison cards, and conversion-focused product flow for commerce projects.",
    },
    {
      match: ["3d", "webgl", "simulation", "model"],
      title: "3D Web UI",
      copy: "Mini demo: model catalog, scene preview, dashboard overlay, and WebGL-ready presentation for simulation or game assets.",
    },
    {
      match: ["ai", "scan", "ocr", "automation"],
      title: "AI-ready Workflow",
      copy: "Mini demo: image intake, structured extraction, assistant-ready state, and automation hooks that can later connect to AI APIs.",
    },
    {
      match: ["dashboard", "api", "database"],
      title: "Dashboard & API Thinking",
      copy: "Mini demo: data cards, status tracking, API-ready structure, and admin-friendly UI patterns for real business systems.",
    },
    {
      match: ["image", "media", "loading", "pwa", "responsive"],
      title: "Performance & Mobile Polish",
      copy: "Mini demo: optimized thumbnails, mobile-safe spacing, fast perceived loading, and responsive interaction states that help clients review work on any device.",
    },
  ];

  var projectProfiles = [
    {
      match: "Amazing Technology",
      story:
        "A technology-and-gaming landing experience shaped for fast first impressions: strong hero content, visual hierarchy, responsive sections, and enough motion to make the page feel alive without hiding the message.",
      client:
        "Useful when a client needs a quick campaign site, product teaser, or event-style page that can explain an offer visually before deeper application work begins.",
    },
    {
      match: "Professional Design",
      story:
        "A design-and-animation showcase focused on brand presentation, section rhythm, polished transitions, and visual trust. The page demonstrates how static content can be upgraded into a sharper client-facing experience.",
      client:
        "Useful for service businesses, creators, trainers, and startups that need a memorable front page without overbuilding a full platform first.",
    },
    {
      match: "Mobile App The Future",
      story:
        "A mobile-app presentation demo that packages app features, screen storytelling, and mobile-first layout into a clear product pitch. It shows the kind of structure needed before building a full iOS, Android, or PWA workflow.",
      client:
        "Useful for founders validating an app idea, pitching investors, or explaining a mobile workflow to users before committing to full backend implementation.",
    },
    {
      match: "Smart Payment",
      story:
        "A payment and subscription UI demo built around conversion clarity: plan comparison, trust-building copy, purchase intent, and checkout-style presentation.",
      client:
        "Useful for SaaS, membership, service packages, booking businesses, and any client who needs pricing pages that feel credible instead of generic.",
    },
    {
      match: "Game Portal",
      story:
        "A game portal concept that groups playable or presentable game ideas into one browsing surface, with enough visual energy to make game projects feel like a product lineup rather than isolated experiments.",
      client:
        "Useful for game studios, educators, event organizers, and entertainment brands that need a lightweight catalog for demos, prototypes, or campaign launches.",
    },
    {
      match: "Mobile App Development Show",
      story:
        "A mobile development showcase designed to communicate screens, app features, benefits, and responsive behavior in a compact product page. It gives clients a quick way to see mobile thinking before full engineering begins.",
      client:
        "Useful for app pitches, agency portfolios, MVP planning, and clients comparing whether they need a native app, PWA, or responsive web app.",
    },
    {
      match: "PalWorld",
      story:
        "An open-world multiplayer game landing demo that sells the fantasy first: immersive media framing, game-world positioning, cinematic layout, responsive sections, and campaign-ready storytelling.",
      client:
        "Useful for studios, game founders, NFT/game launches, and entertainment brands that need a high-impact campaign page before a full game release.",
    },
    {
      match: "Fintech",
      story:
        "A fintech innovation demo that turns finance concepts into readable product UI: dashboard-style information, platform positioning, and structured feature communication.",
      client:
        "Useful for fintech founders, payment tools, internal finance dashboards, and proof-of-concept pages where trust and clarity matter more than decoration.",
    },
    {
      match: "BlockChain",
      story:
        "A Web3 dashboard presentation that packages blockchain data, API thinking, and platform-style navigation into a client-friendly interface.",
      client:
        "Useful for Web3 products, token dashboards, wallet tools, analytics concepts, and blockchain teams that need a visual prototype before backend integration.",
    },
    {
      match: "BestzDeal Feature",
      story:
        "A marketplace feature page that explains buyer demand, seller response, and conversion flow with a polished client-ready homepage structure.",
      client:
        "Useful for commerce founders, local marketplaces, lead-generation products, and deal platforms that need to prove the business flow quickly.",
    },
    {
      match: "Travel Booking",
      story:
        "A travel booking feature UI that focuses on destination appeal, search intent, responsive browsing, and service storytelling.",
      client:
        "Useful for travel agencies, booking platforms, tourism campaigns, and local experience providers who need a polished front-end before full reservation logic.",
    },
    {
      match: "Sim Work",
      story:
        "A simulation-work demo that presents operational workflows through visual dashboards, scenario framing, and deployed interactive product pages.",
      client:
        "Useful for industrial demos, training simulations, operation centers, and clients who need complex workflows explained visually to non-technical stakeholders.",
    },
    {
      match: "Report Platform",
      story:
        "A cross-border civic reporting concept for Malaysia and Singapore, structured around offense submission, triage clarity, department routing, and trust-focused public-service UX.",
      client:
        "Useful for civic tech, complaint management, public reporting, government-adjacent workflows, and organizations that need sensitive forms to feel simple and credible.",
    },
    {
      match: "Report Routing",
      story:
        "A refined ReportU iteration focused on making report intake, category selection, and routing decisions clearer for users who may be stressed or unsure where to submit.",
      client:
        "Useful for public-service platforms, support operations, fraud/scam reporting, and multi-department request handling.",
    },
    {
      match: "AR Digital Name Card",
      story:
        "An AR-enhanced digital identity concept that combines QR, NFC, scan-first profiles, and no-app sharing into a modern networking experience.",
      client:
        "Useful for sales teams, founders, speakers, real estate agents, recruiters, and events that need contact exchange to feel premium and trackable.",
    },
    {
      match: "Scan-First Profile",
      story:
        "A NameCardAi variant focused on fast profile discovery: camera scan, QR/NFC exchange, interactive profile preview, and networking follow-up.",
      client:
        "Useful when a client wants to replace static paper cards with a measurable digital identity and lead-capture workflow.",
    },
    {
      match: "AI Reverse Marketplace",
      story:
        "A reverse marketplace concept where buyer intent becomes the main product surface: one request, many seller offers, comparison flow, and AI-ready matching logic.",
      client:
        "Useful for local commerce, procurement, services marketplaces, and deal platforms that need to reverse the usual seller-first listing model.",
    },
    {
      match: "Buyer Request",
      story:
        "A BestzDealAi iteration centered on the buyer request journey, seller competition, and offer clarity, making the value proposition easy to understand in one demo.",
      client:
        "Useful for commerce clients who want a marketplace MVP but need a clearer buying flow before investing in full seller tooling.",
    },
    {
      match: "Offer Comparison",
      story:
        "A marketplace comparison variant that highlights buyer intent capture, competitive offers, and decision support as the core conversion engine.",
      client:
        "Useful for marketplaces, quote platforms, B2B sourcing, and service comparison products where users need to evaluate multiple offers quickly.",
    },
    {
      match: "Visual Entity",
      story:
        "A visual-first community platform concept where a photo can become the entry point into public discussion, reporting, scam alerts, civic history, and entity-linked conversations.",
      client:
        "Useful for civic reporting, community safety, lost-and-found, local reviews, incident history, and any app where users know what they saw but not what to search.",
    },
    {
      match: "Community History",
      story:
        "A MessageYou iteration focused on linking real-world photos to long-term discussion trails, alerts, reports, and public memory.",
      client:
        "Useful for community platforms, safety apps, local councils, moderation workflows, and visual search products.",
    },
    {
      match: "Warranty Tracking",
      story:
        "A warranty assistant concept for receipts, item photos, service dates, expiry reminders, coverage records, and future inventory visualization.",
      client:
        "Useful for retailers, appliance services, vehicle workshops, insurance add-ons, and consumers who need less manual warranty management.",
    },
    {
      match: "RunJian iRun",
      story:
        "A RunJian iRun SimWorld demo that presents 3D operations, dashboard signals, scenario storytelling, and a high-impact visual product direction.",
      client:
        "Useful for simulation platforms, industrial command centers, training demos, and teams that need to turn complex operational data into a visual story.",
    },
    {
      match: "RunJian SimWorld",
      story:
        "A second RunJian simulation iteration used to compare scene direction, dashboard framing, and command-world presentation quality across deployments.",
      client:
        "Useful for stakeholders choosing between simulation UI directions before deeper 3D engine or backend investment.",
    },
    {
      match: "WarrantyScan",
      story:
        "A mobile-first product demo focused on receipt scanning, warranty lifecycle tracking, service reminders, and photo-first item capture.",
      client:
        "Useful for retailers, service providers, insurance flows, and any client that needs a mobile workflow starting from a camera or receipt.",
    },
    {
      match: "NameCard Mobile",
      story:
        "A mobile identity demo for QR sharing, NFC exchange, profile preview, and event networking follow-up.",
      client:
        "Useful for founders, real estate agents, trainers, sales teams, and event organizers who want contact exchange to become measurable.",
    },
    {
      match: "Assets",
      story:
        "A 3D model showcase direction for reviewing deployable browser assets, Q-style characters, props, dragons, weapons, terrain, and game-ready visual catalogs.",
      client:
        "Useful for game clients, simulation teams, education products, and brands that need asset previews before production or deeper 3D implementation.",
    },
  ];

  function applyLanguage(language) {
    var dictionary = translations[language] || translations.en;
    currentLanguage = language;
    localStorage.setItem(languageStorageKey, language);
    document.documentElement.setAttribute(
      "lang",
      language === "zh" ? "zh-CN" : "en",
    );

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

    applyStaticCopy(dictionary);

    var languageToggle = document.getElementById("language-toggle");
    if (languageToggle) {
      languageToggle.textContent = language === "zh" ? "EN" : "CN";
      languageToggle.setAttribute("aria-pressed", String(language === "zh"));
    }

    document.documentElement.setAttribute("data-theme", "dark");
    setupDynamicNavbar();
    setupHeroKinetics();
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
    var copy = staticCopy[currentLanguage] || staticCopy.en;
    if (profile && profile.story) {
      return profile.story;
    }

    return (
      getLocalizedProjectTitle(projectTitle) + " " + copy.defaultProjectStory
    );
  }

  function buildProjectAbout(projectAbout) {
    var copy = staticCopy[currentLanguage] || staticCopy.en;
    if (!projectAbout) {
      return copy.defaultProjectAbout;
    }

    return projectAbout + " " + copy.projectThinking;
  }

  function buildClientValue(profile) {
    var copy = staticCopy[currentLanguage] || staticCopy.en;
    if (profile && profile.client) {
      return profile.client;
    }

    return copy.defaultClientValue;
  }

  function resolveSkillDemo(label) {
    var normalized = label.toLowerCase();
    return (
      skillDemos.find(function (demo) {
        return demo.match.some(function (token) {
          return normalized.indexOf(token) !== -1;
        });
      }) || {
        title:
          currentLanguage === "zh" ? "客户可理解的能力" : "Client-ready Skill",
        copy:
          currentLanguage === "zh"
            ? "小型 Demo：这个能力能支持更快交付、更清楚的客户 review，以及更完整的产品体验。"
            : "Mini demo: this capability supports faster delivery, clearer client review, and a more polished product experience.",
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

    if (
      !modal ||
      !title ||
      !story ||
      !tech ||
      !skills ||
      !about ||
      !client ||
      !demoPanel
    ) {
      return;
    }

    document.querySelectorAll(".project-detail-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        var projectTitle =
          button.getAttribute("data-project-title") || "Project Details";
        var projectTech = button.getAttribute("data-project-tech") || "";
        var projectSkills = button.getAttribute("data-project-skills") || "";
        var projectAbout = button.getAttribute("data-project-about") || "";
        var profile = findProfile(projectTitle);
        var copy = staticCopy[currentLanguage] || staticCopy.en;

        title.textContent = getLocalizedProjectTitle(projectTitle);
        story.textContent = buildProjectStory(
          projectTitle,
          projectTech,
          projectAbout,
          profile,
        );
        skills.textContent =
          projectSkills + (projectSkills ? ". " : "") + copy.premiumFocus;
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
            demoPanel.innerHTML =
              "<strong>" +
              skillDemo.title +
              "</strong><p>" +
              skillDemo.copy +
              "</p>";
            void demoPanel.offsetWidth;
            demoPanel.classList.add("is-playing");
          });
          tech.appendChild(chip);
        });

        demoPanel.innerHTML =
          "<strong>" +
          copy.clickTechChip +
          "</strong><p>" +
          copy.skillDemoIntro +
          "</p>";
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
      });
    });

    modal.addEventListener("click", function (event) {
      if (
        event.target === modal ||
        event.target.classList.contains("project-detail-close")
      ) {
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
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function isFounderJourneyMobileMode() {
    return window.matchMedia && window.matchMedia("(max-width: 600px)").matches;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function setupHeroKinetics() {
    var headline = document.querySelector(".hero-headline");
    var capability = document.querySelector(".hero-capability");
    var dictionary = translations[currentLanguage] || translations.en;
    var headlinePhrases = dictionary["hero.headlinePhrases"] || [
      dictionary["hero.headline"],
    ];

    if (heroHeadlineTypingTimer) {
      window.clearTimeout(heroHeadlineTypingTimer);
      heroHeadlineTypingTimer = null;
    }

    function renderIntroHeadline(text) {
      var specialWords = {
        ai: true,
        automation: true,
        systems: true,
        products: true,
        dashboards: true,
        lazy: true,
      };
      var words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
      headline.textContent = "";
      words.forEach(function (word, index) {
        var normalizedWord = word.toLowerCase().replace(/[^a-z]/g, "");
        var span = document.createElement("span");
        span.className = "hero-word";
        if (specialWords[normalizedWord]) {
          span.className += " hero-word-special";
        }
        span.style.setProperty("--word-index", index);
        span.textContent = word;
        headline.appendChild(span);

        if (index < words.length - 1) {
          headline.appendChild(document.createTextNode(" "));
        }
      });
    }

    if (headline) {
      headline.setAttribute("aria-live", "polite");

      if (isReducedMotion()) {
        headline.classList.remove("is-typing");
        renderIntroHeadline(headlinePhrases[0]);
      } else {
        var phraseIndex = 0;
        var headlineHoldDelay = 5000;
        var headlineInitialDelay = 60000;

        headline.classList.remove("is-typing", "is-swapping");
        renderIntroHeadline(headlinePhrases[0] || "");

        function rotateHeadlinePhrase() {
          if (headlinePhrases.length <= 1) {
            return;
          }

          phraseIndex = (phraseIndex + 1) % headlinePhrases.length;
          headline.classList.add("is-swapping");

          heroHeadlineTypingTimer = window.setTimeout(
            function heroHeadlineSwap() {
              renderIntroHeadline(headlinePhrases[phraseIndex] || "");
              headline.classList.remove("is-swapping");
              heroHeadlineTypingTimer = window.setTimeout(
                rotateHeadlinePhrase,
                headlineHoldDelay,
              );
            },
            260,
          );
        }

        heroHeadlineTypingTimer = window.setTimeout(function () {
          rotateHeadlinePhrase();
        }, headlineInitialDelay);
      }
    }

    if (!capability) {
      return;
    }

    var capabilityText = capability.textContent.replace(/\s+/g, " ").trim();

    capability.textContent = "";
    capability.classList.remove("is-typing");
    capability.textContent = capabilityText;
  }

  function setupFounderJourney() {
    var journey = document.getElementById("founder-journey");

    if (!journey) {
      return;
    }

    var steps = Array.prototype.slice.call(
      journey.querySelectorAll(".founder-journey-steps li"),
    );
    var singleLayers = Array.prototype.slice.call(
      journey.querySelectorAll(".founder-poster-layer[data-founder-step]"),
    );
    var allLayer = journey.querySelector(".founder-poster-layer-all");
    var posterLayers = Array.prototype.slice.call(
      journey.querySelectorAll(".founder-poster-layer"),
    );
    var posterStage = journey.querySelector(".founder-poster-stage");
    var topPanel = journey.querySelector(".founder-hud-panel-top");
    var copyLabel = topPanel
      ? topPanel.querySelector("[data-founder-copy-label]")
      : null;
    var copyTitle = topPanel
      ? topPanel.querySelector("[data-founder-copy-title]")
      : null;
    var copyMessage = topPanel
      ? topPanel.querySelector("[data-founder-copy-message]")
      : null;
    var targetButtons = Array.prototype.slice.call(
      journey.querySelectorAll("[data-founder-target]"),
    );
    var actionButtons = Array.prototype.slice.call(
      journey.querySelectorAll("[data-founder-action]"),
    );
    var finalProofButtons = Array.prototype.slice.call(
      journey.querySelectorAll("[data-final-proof]"),
    );
    var finalProofLines = Array.prototype.slice.call(
      journey.querySelectorAll("[data-final-proof-line]"),
    );
    var finalProofSpotlight = journey.querySelector(
      ".founder-proof-color-spotlight",
    );
    var finalProofDrawer = journey.querySelector(
      ".founder-proof-detail-drawer",
    );
    var finalProofDetailIndex = finalProofDrawer
      ? finalProofDrawer.querySelector("[data-final-proof-detail-index]")
      : null;
    var finalProofDetailTitle = finalProofDrawer
      ? finalProofDrawer.querySelector("[data-final-proof-detail-title]")
      : null;
    var finalProofDetailBody = finalProofDrawer
      ? finalProofDrawer.querySelector("[data-final-proof-detail-body]")
      : null;
    var maxIndex = Math.max(steps.length - 1, 0);
    var totalStates = steps.length + 2;
    var maxState = Math.max(totalStates - 1, 0);
    var currentFounderState = 0;
    var currentFounderCopyState = -1;
    var lockedFinalProof = "";
    var finalCalloutsVisible = false;
    var finalCalloutStateTimer = 0;
    var founderFinalConnectorRevealLeadMs = 160;
    var founderFinalConnectorIntroMs = 1720;
    var founderFinalProofPoints = {
      sport: {
        x: 0.255,
        y: 0.205,
        connectorY: 0.22,
        targetOffsetX: -5,
        targetOffsetY: 20,
        tone: "#ff7a5c",
        radius: "ellipse(18% 16% at 25.5% 20.5%)",
      },
      cto: {
        x: 0.645,
        y: 0.235,
        connectorY: 0.235,
        targetOffsetX: 5,
        targetOffsetY: 15,
        tone: "#74e3ff",
        radius: "ellipse(20% 16% at 64.5% 23.5%)",
        anchorSide: "left",
        anchorY: 0.72,
        anchorOffset: 8,
      },
      ai: {
        x: 0.235,
        y: 0.535,
        tone: "#b481ff",
        radius: "ellipse(16% 15% at 23.5% 53.5%)",
      },
      world: {
        x: 0.78,
        y: 0.565,
        targetOffsetX: 20,
        tone: "#6ef0a1",
        radius: "ellipse(18% 15% at 78% 56.5%)",
        anchorSide: "left",
        anchorY: 0.8,
        anchorOffset: 8,
      },
      win: {
        x: 0.265,
        y: 0.81,
        connectorY: 0.81,
        targetOffsetY: 35,
        tone: "#d8b987",
        radius: "ellipse(19% 15% at 26.5% 81%)",
      },
      teach: {
        x: 0.655,
        y: 0.82,
        tone: "#ff9ed1",
        radius: "ellipse(21% 15% at 65.5% 82%)",
        anchorSide: "left",
        anchorY: 0.16,
        anchorOffset: 8,
      },
    };
    var founderPosterScrollAnchors = [
      { scroll: "0%" },
      { scroll: "-2%" },
      { scroll: "-6%" },
      { scroll: "-37%" },
      { scroll: "-42%" },
      { scroll: "-64%" },
      { scroll: "-67%" },
      { scroll: "0%" },
    ];
    var focusPoints = [
      { x: "50%", y: "50%", focus: "50%" },
      { x: "27%", y: "20%", focus: "14%" },
      { x: "73%", y: "20%", focus: "14%" },
      { x: "27%", y: "49%", focus: "49%" },
      { x: "74%", y: "49%", focus: "50%" },
      { x: "28%", y: "80%", focus: "80%" },
      { x: "74%", y: "80%", focus: "82%" },
      { x: "50%", y: "50%", focus: "50%" },
    ];
    function getFounderCopyStates() {
      if (currentLanguage === "zh") {
        return [
          {
            label: "证明剧场",
            title: "选择一个证明时刻。",
            message: "用这些证明控制查看六个公开时刻，同时不遮住整张海报。",
          },
          {
            label: "接受挑战",
            title: "突破下一个极限。",
            message:
              "运动精神、突破挑战与接受挑战，代表持续超越上一个版本的习惯。",
          },
          {
            label: "Trillion Unicorn CTO",
            title: "把愿景变成架构。",
            message:
              "创业方向、CTO 思维与产品架构，让 Trillion Unicorn 的想法变成可执行产品。",
          },
          {
            label: "Ahfaiz AI 创业",
            title: "打造 AI 伙伴产品。",
            message:
              "Ahfaiz 把个人 AI、生活规划与助手工作流变成真实创业产品方向。",
          },
          {
            label: "WorldCup 2026",
            title: "在世界任何地方工作。",
            message:
              "WorldCup 邀请框展示了远程执行能力，以及可从任何地点工作的全球准备度。",
          },
          {
            label: "黑客松得奖者",
            title: "用证明取胜，不靠空谈。",
            message:
              "黑客松记录证明了快速 framing、原型交付、pitching 与高压下交付。",
          },
          {
            label: "社区 IT 讲师",
            title: "把实战 IT 回馈社区。",
            message:
              "受邀课程与演讲，把编码、AI 自动化与工作流实践转化为社区价值。",
          },
          {
            label: "完整愿景海报",
            title: "一个 Hunter，六个证明时刻。",
            message:
              "整张海报把挑战、CTO 工作、AI 创业、远程工作、得奖与教学连成一条线。",
          },
        ];
      }

      return [
        {
          label: "Proof Theater",
          title: "Choose a proof moment.",
          message:
            "Use the proof controls to reveal six public moments without blocking the poster.",
        },
        {
          label: "Challenge Accepted",
          title: "Break the next limit.",
          message:
            "Sportsmanship, challenge breaking, and challenge accepting show the habit of outgrowing the last version.",
        },
        {
          label: "Trillion Unicorn CTO",
          title: "Turn vision into architecture.",
          message:
            "Startup direction, CTO thinking, and product architecture make the Trillion Unicorn idea executable.",
        },
        {
          label: "Ahfaiz AI Startup",
          title: "Build the AI companion.",
          message:
            "Ahfaiz turns personal AI, life planning, and assistant workflows into a real startup product direction.",
        },
        {
          label: "WorldCup 2026",
          title: "Work anywhere in the world.",
          message:
            "The WorldCup invitation frame points to remote-ready execution and global work from any location.",
        },
        {
          label: "Hackathon Winner",
          title: "Win with proof, not talk.",
          message:
            "Hackathon records prove fast framing, prototype shipping, pitching, and delivery under pressure.",
        },
        {
          label: "Community IT Teacher",
          title: "Share practical IT back.",
          message:
            "Invited classes and speaking sessions turn coding, AI automation, and workflow practice into community value.",
        },
        {
          label: "Complete Vision Poster",
          title: "One Hunter. Six proof moments.",
          message:
            "The full poster connects challenge, CTO work, AI startup building, remote work, wins, and teaching.",
        },
      ];
    }

    if (posterStage) {
      posterStage.classList.add("is-hunter-active");
    }

    function updateFounderCopy(activeState) {
      var founderCopyStates = getFounderCopyStates();
      var copy = founderCopyStates[activeState] || founderCopyStates[0];

      if (
        !copyLabel ||
        !copyTitle ||
        !copyMessage ||
        currentFounderCopyState === activeState
      ) {
        return;
      }

      currentFounderCopyState = activeState;
      copyLabel.textContent = copy.label;
      copyTitle.textContent = copy.title;
      copyMessage.textContent = copy.message;

      if (topPanel && !isReducedMotion()) {
        topPanel.classList.remove("is-copy-swapping");
        void topPanel.offsetWidth;
        topPanel.classList.add("is-copy-swapping");
        window.setTimeout(function () {
          topPanel.classList.remove("is-copy-swapping");
        }, 460);
      }
    }

    function positionFounderFinalConnectors() {
      var calloutShell = journey.querySelector(".founder-final-callouts");

      if (
        !calloutShell ||
        !allLayer ||
        !finalProofButtons.length ||
        !finalProofLines.length
      ) {
        return;
      }

      var shellRect = calloutShell.getBoundingClientRect();
      var posterRect = allLayer.getBoundingClientRect();

      if (
        !shellRect.width ||
        !shellRect.height ||
        !posterRect.width ||
        !posterRect.height
      ) {
        return;
      }

      finalProofLines.forEach(function (line) {
        var proofId = line.getAttribute("data-final-proof-line") || "";
        var button = finalProofButtons.find(function (item) {
          return item.getAttribute("data-final-proof") === proofId;
        });
        var point = founderFinalProofPoints[proofId];

        if (!button || !point) {
          return;
        }

        var buttonRect = button.getBoundingClientRect();
        var buttonCenterX =
          buttonRect.left + buttonRect.width / 2 - shellRect.left;
        var buttonCenterY =
          buttonRect.top + buttonRect.height / 2 - shellRect.top;
        var targetPointY =
          typeof point.connectorY === "number" ? point.connectorY : point.y;
        var targetX =
          posterRect.left +
          posterRect.width * point.x -
          shellRect.left +
          (point.targetOffsetX || 0);
        var targetY =
          posterRect.top +
          posterRect.height * targetPointY -
          shellRect.top +
          (point.targetOffsetY || 0);
        var deltaToTargetX = targetX - buttonCenterX;
        var deltaToTargetY = targetY - buttonCenterY;
        var halfWidth = buttonRect.width / 2;
        var halfHeight = buttonRect.height / 2;
        var directionLength = Math.max(
          Math.sqrt(
            deltaToTargetX * deltaToTargetX + deltaToTargetY * deltaToTargetY,
          ),
          1,
        );
        var startX;
        var startY;

        if (point.anchorSide) {
          var anchorOffset =
            typeof point.anchorOffset === "number" ? point.anchorOffset : 8;
          var anchorY = typeof point.anchorY === "number" ? point.anchorY : 0.5;
          startX =
            point.anchorSide === "left"
              ? buttonRect.left - shellRect.left - anchorOffset
              : buttonRect.right - shellRect.left + anchorOffset;
          startY = buttonRect.top + buttonRect.height * anchorY - shellRect.top;
        } else {
          var borderScale = Math.max(
            Math.abs(deltaToTargetX) / Math.max(halfWidth, 1),
            Math.abs(deltaToTargetY) / Math.max(halfHeight, 1),
            1,
          );
          var borderX = buttonCenterX + deltaToTargetX / borderScale;
          var borderY = buttonCenterY + deltaToTargetY / borderScale;
          startX = borderX + (deltaToTargetX / directionLength) * 8;
          startY = borderY + (deltaToTargetY / directionLength) * 8;
        }
        var deltaX = targetX - startX;
        var deltaY = targetY - startY;
        var connectorLength = Math.max(
          Math.sqrt(deltaX * deltaX + deltaY * deltaY),
          1,
        );
        var connectorAngle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

        line.style.setProperty("--connector-x", startX.toFixed(2) + "px");
        line.style.setProperty("--connector-y", startY.toFixed(2) + "px");
        line.style.setProperty(
          "--connector-length",
          connectorLength.toFixed(2) + "px",
        );
        line.style.setProperty(
          "--connector-angle",
          connectorAngle.toFixed(2) + "deg",
        );
      });
    }

    function scheduleFounderFinalConnectorPosition() {
      window.requestAnimationFrame(function () {
        positionFounderFinalConnectors();
        window.requestAnimationFrame(positionFounderFinalConnectors);
      });
      window.setTimeout(positionFounderFinalConnectors, 140);
      window.setTimeout(
        positionFounderFinalConnectors,
        founderFinalConnectorRevealLeadMs + founderFinalConnectorIntroMs,
      );
    }

    function setFounderFinalCalloutPresence(isFinal) {
      if (isFinal && !finalCalloutsVisible) {
        finalCalloutsVisible = true;
        window.clearTimeout(finalCalloutStateTimer);
        journey.classList.remove(
          "is-final-callout-leaving",
          "has-final-callout-settled",
        );
        positionFounderFinalConnectors();
        window.setTimeout(function () {
          positionFounderFinalConnectors();
          journey.classList.add("is-final-callout-entering");
        }, founderFinalConnectorRevealLeadMs);
        finalCalloutStateTimer = window.setTimeout(function () {
          journey.classList.remove("is-final-callout-entering");
          journey.classList.add("has-final-callout-settled");
          positionFounderFinalConnectors();
        }, founderFinalConnectorRevealLeadMs + founderFinalConnectorIntroMs);
        return;
      }

      if (!isFinal && finalCalloutsVisible) {
        finalCalloutsVisible = false;
        window.clearTimeout(finalCalloutStateTimer);
        journey.classList.remove(
          "is-final-callout-entering",
          "has-final-callout-settled",
        );
        journey.classList.add("is-final-callout-leaving");
        finalCalloutStateTimer = window.setTimeout(function () {
          journey.classList.remove("is-final-callout-leaving");
        }, 520);
      }
    }

    function setFounderProofSpotlight(proofId) {
      var point = founderFinalProofPoints[proofId || ""];

      if (!finalProofSpotlight || !point) {
        if (finalProofSpotlight) {
          finalProofSpotlight.style.setProperty(
            "--proof-spotlight-clip",
            "ellipse(0% 0% at 50% 50%)",
          );
        }
        return;
      }

      finalProofSpotlight.style.setProperty(
        "--proof-spotlight-clip",
        point.radius,
      );
      finalProofSpotlight.style.setProperty("--proof-tone", point.tone);
    }

    function setFinalProofFocus(proofId, shouldLock) {
      var target = proofId || "";
      var activeButton = null;

      if (shouldLock) {
        lockedFinalProof = target;
      }

      if (!target && lockedFinalProof) {
        target = lockedFinalProof;
      }

      journey.classList.toggle("has-final-proof-focus", Boolean(target));
      journey.setAttribute("data-final-proof-focus", target || "none");
      setFounderProofSpotlight(target);

      finalProofButtons.forEach(function (button) {
        var isActive = button.getAttribute("data-final-proof") === target;
        button.classList.toggle("is-focused", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
        if (isActive) {
          activeButton = button;
        }
      });

      finalProofLines.forEach(function (line) {
        line.classList.toggle(
          "is-focused",
          line.getAttribute("data-final-proof-line") === target,
        );
      });

      if (
        activeButton &&
        finalProofDrawer &&
        finalProofDetailIndex &&
        finalProofDetailTitle &&
        finalProofDetailBody
      ) {
        var tone = activeButton.getAttribute("data-proof-tone") || "cto";
        var index = activeButton.querySelector("span");
        finalProofDrawer.setAttribute("data-proof-tone", tone);
        finalProofDetailIndex.textContent = index ? index.textContent : "";
        finalProofDetailTitle.textContent =
          activeButton.getAttribute("data-final-proof-title") ||
          activeButton.querySelector("strong").textContent;
        finalProofDetailBody.textContent =
          activeButton.getAttribute("data-final-proof-body") ||
          activeButton.querySelector("p").textContent;
      }
    }

    function clearFinalProofFocus(forceUnlock) {
      if (forceUnlock) {
        lockedFinalProof = "";
      }
      if (!lockedFinalProof || forceUnlock) {
        setFinalProofFocus("", false);
      }
    }

    function handleFounderFinalProofOutsideClick(event) {
      var target = event.target;

      if (
        currentFounderState !== maxState ||
        !lockedFinalProof ||
        !(target instanceof Element)
      ) {
        return;
      }

      if (
        target.closest("[data-final-proof]") ||
        target.closest(".founder-proof-detail-drawer") ||
        target.closest("[data-founder-action]") ||
        target.closest("[data-founder-target]")
      ) {
        return;
      }

      clearFinalProofFocus(true);
    }

    function setupFounderFinalProofFocus() {
      if (!finalProofButtons.length) {
        return;
      }

      finalProofButtons.forEach(function (button) {
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("mouseenter", function () {
          if (currentFounderState === maxState) {
            setFinalProofFocus(button.getAttribute("data-final-proof"), false);
          }
        });
        button.addEventListener("focus", function () {
          if (currentFounderState === maxState) {
            setFinalProofFocus(button.getAttribute("data-final-proof"), false);
          }
        });
        button.addEventListener("mouseleave", function () {
          clearFinalProofFocus(false);
        });
        button.addEventListener("blur", function () {
          clearFinalProofFocus(false);
        });
        button.addEventListener("click", function () {
          if (currentFounderState !== maxState) {
            scrollToFounderState(maxState);
          }
          setFinalProofFocus(button.getAttribute("data-final-proof"), true);
        });
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          clearFinalProofFocus(true);
        }
      });

      journey.addEventListener("click", handleFounderFinalProofOutsideClick);
    }

    function setFounderPosterLayerState(activeState, progress) {
      var focusPoint = focusPoints[activeState] || focusPoints[0];
      var activeStep =
        activeState > 0 && activeState <= steps.length ? activeState - 1 : -1;
      var depth = (progress - 0.5) * 2;
      var exactState = progress * maxState;
      var lowerState = Math.max(0, Math.min(maxState, Math.floor(exactState)));
      var upperState = Math.max(0, Math.min(maxState, Math.ceil(exactState)));
      var stateMix = exactState - lowerState;
      var lowerAnchor =
        founderPosterScrollAnchors[lowerState] || founderPosterScrollAnchors[0];
      var upperAnchor = founderPosterScrollAnchors[upperState] || lowerAnchor;
      var lowerScroll = parseFloat(lowerAnchor.scroll) || 0;
      var upperScroll = parseFloat(upperAnchor.scroll) || lowerScroll;
      var posterScroll = lowerScroll + (upperScroll - lowerScroll) * stateMix;

      currentFounderState = activeState;
      journey.setAttribute("data-active-step", String(activeStep));
      journey.setAttribute("data-founder-state", String(activeState));
      journey.classList.toggle("is-empty-poster", activeState === 0);
      journey.classList.toggle("is-final-poster", activeState === maxState);
      setFounderFinalCalloutPresence(activeState === maxState);
      if (activeState === maxState) {
        scheduleFounderFinalConnectorPosition();
      }
      if (
        activeState !== maxState &&
        journey.classList.contains("has-final-proof-focus")
      ) {
        clearFinalProofFocus(true);
      }
      journey.classList.toggle(
        "is-face-safe-hud-top",
        activeState === 1 || activeState === 3,
      );
      journey.style.setProperty("--journey-progress", progress.toFixed(4));
      journey.style.setProperty("--journey-step", activeState);
      journey.style.setProperty("--journey-focus", focusPoint.focus);
      journey.style.setProperty("--journey-mask-x", focusPoint.x);
      journey.style.setProperty("--journey-mask-y", focusPoint.y);
      journey.style.setProperty(
        "--poster-scroll-y",
        posterScroll.toFixed(2) + "%",
      );
      journey.style.setProperty("--founder-hud-left", "");
      journey.style.setProperty("--founder-hud-top", "");
      updateFounderCopy(activeState);

      singleLayers.forEach(function (layer, index) {
        layer.classList.toggle("is-visible", index === activeStep);
      });

      if (allLayer) {
        allLayer.classList.toggle("is-visible", activeState === maxState);
      }

      posterLayers.forEach(function (layer, index) {
        var speedX = index === 0 ? -10 : 7 + index * 2.3;
        var speedY = index === 0 ? -18 : -24 - index * 6.5;
        layer.style.setProperty(
          "--founder-layer-offset-x",
          (depth * speedX).toFixed(2) + "px",
        );
        layer.style.setProperty(
          "--founder-layer-offset-y",
          (depth * speedY).toFixed(2) + "px",
        );
      });

      steps.forEach(function (step, index) {
        step.classList.toggle(
          "is-active",
          index === activeStep ||
            (activeState === maxState && index === maxIndex),
        );
      });

      targetButtons.forEach(function (button) {
        var targetState = Number(button.getAttribute("data-founder-target"));
        var isActive =
          targetState === activeState ||
          (activeState === maxState && targetState === steps.length);
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-current", isActive ? "step" : "false");
      });
    }

    function updateJourney() {
      if (isFounderJourneyMobileMode()) {
        setFounderPosterLayerState(maxState, 1);
        scheduleFounderFinalConnectorPosition();
        return;
      }

      var rect = journey.getBoundingClientRect();
      var denominator = Math.max(rect.height - window.innerHeight, 1);
      var progress = Math.min(Math.max((0 - rect.top) / denominator, 0), 1);
      var activeState = Math.min(
        maxState,
        Math.max(0, Math.round(progress * maxState)),
      );
      setFounderPosterLayerState(activeState, progress);
    }

    function scrollToFounderState(targetState, forceAuto) {
      if (isFounderJourneyMobileMode()) {
        journey.scrollIntoView({
          block: "start",
          behavior: forceAuto || isReducedMotion() ? "auto" : "smooth",
        });
        setFounderPosterLayerState(maxState, 1);
        scheduleFounderFinalConnectorPosition();
        return;
      }

      var state = Math.min(maxState, Math.max(0, targetState));
      var rect = journey.getBoundingClientRect();
      var pageTop = window.pageYOffset + rect.top;
      var denominator = Math.max(journey.offsetHeight - window.innerHeight, 1);
      var targetTop = pageTop + denominator * (state / maxState);

      window.scrollTo({
        top: targetTop,
        behavior: forceAuto || isReducedMotion() ? "auto" : "smooth",
      });

      setFounderPosterLayerState(state, state / maxState);
      if (state === maxState) {
        scheduleFounderFinalConnectorPosition();
      }
    }

    targetButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        scrollToFounderState(
          Number(button.getAttribute("data-founder-target")),
        );
      });
    });

    actionButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var action = button.getAttribute("data-founder-action");

        if (action === "prev") {
          scrollToFounderState(currentFounderState - 1);
          return;
        }

        if (action === "next") {
          scrollToFounderState(currentFounderState + 1);
          return;
        }

        if (action === "skip") {
          scrollToFounderState(maxState, true);
        }
      });
    });

    window.addEventListener("scroll", updateJourney, { passive: true });
    window.addEventListener("resize", function () {
      updateJourney();
      scheduleFounderFinalConnectorPosition();
    });
    setupFounderFinalProofFocus();
    updateJourney();
    positionFounderFinalConnectors();
  }

  function setupSectionParallax() {
    if (isReducedMotion()) {
      return;
    }

    var sections = Array.prototype.slice.call(
      document.querySelectorAll(
        "#header, .proof-motion-wall, #about, #services, #mobile-app-demos, .journal-block, .games-demo-section, #project-assets-section, #contact",
      ),
    );

    if (!sections.length) {
      return;
    }

    sections.forEach(function (section) {
      section.classList.add("parallax-live-section");
    });

    var ticking = false;

    function updateSectionDepth() {
      ticking = false;
      var viewportHeight = window.innerHeight || 1;

      sections.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        var range = viewportHeight + Math.max(rect.height, 1);
        var progress = Math.min(
          Math.max((viewportHeight - rect.top) / range, 0),
          1,
        );
        var depth = (progress - 0.5) * 2;

        section.style.setProperty("--section-progress", progress.toFixed(4));
        section.style.setProperty("--section-depth", depth.toFixed(4));
      });
    }

    function requestSectionDepth() {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateSectionDepth);
    }

    window.addEventListener("scroll", requestSectionDepth, { passive: true });
    window.addEventListener("resize", requestSectionDepth);
    updateSectionDepth();
  }

  function setupContactCopyrightDock() {
    var contact = document.getElementById("contact");
    var dock = document.querySelector(".contact-copyright-dock");

    if (!contact || !dock) {
      return;
    }

    var isVisible = false;

    function setDockVisible(nextVisible) {
      if (isVisible === nextVisible) {
        return;
      }

      isVisible = nextVisible;
      dock.classList.toggle("is-visible", nextVisible);
      dock.classList.toggle("is-leaving", !nextVisible);
    }

    function updateDockState() {
      var rect = contact.getBoundingClientRect();
      var viewportHeight = window.innerHeight || 1;
      var shouldShow =
        rect.top < viewportHeight * 0.78 && rect.bottom > viewportHeight * 0.22;
      setDockVisible(shouldShow);
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.target === contact) {
              setDockVisible(
                entry.isIntersecting && entry.intersectionRatio > 0.16,
              );
            }
          });
        },
        { threshold: [0, 0.16, 0.3], rootMargin: "-8% 0px -8% 0px" },
      );

      observer.observe(contact);
    }

    window.addEventListener("scroll", updateDockState, { passive: true });
    window.addEventListener("resize", updateDockState);
    updateDockState();
  }

  function setupAboutServicesParallax() {
    if (isReducedMotion()) {
      return;
    }

    var stack = document.querySelector(".about-services-stack");
    if (!stack) {
      return;
    }

    var ticking = false;

    function updateAboutServicesParallax() {
      ticking = false;

      var rect = stack.getBoundingClientRect();
      var viewportHeight = window.innerHeight || 1;
      var travelRange = viewportHeight + Math.max(rect.height, 1);
      var rawProgress = (viewportHeight - rect.top) / travelRange;
      var progress = Math.min(Math.max(rawProgress, 0), 1);
      var depth = (progress - 0.5) * 2;

      stack.style.setProperty(
        "--about-parallax-y",
        (depth * -54).toFixed(2) + "px",
      );
      stack.style.setProperty(
        "--about-layer-shift",
        (depth * 42).toFixed(2) + "px",
      );
    }

    function requestAboutServicesParallax() {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateAboutServicesParallax);
    }

    window.addEventListener("scroll", requestAboutServicesParallax, {
      passive: true,
    });
    window.addEventListener("resize", requestAboutServicesParallax);
    updateAboutServicesParallax();
  }

  function setupAboutPortraitTalk() {
    var aboutSection = document.getElementById("about");
    var portrait = aboutSection
      ? aboutSection.querySelector(".about-portrait-parallax")
      : null;
    var bubble = portrait
      ? portrait.querySelector(".about-portrait-bubble")
      : null;
    var message = bubble
      ? bubble.querySelector("[data-about-portrait-message]")
      : null;
    var showDelay = 3000;
    var showTimer = null;
    var rotateTimer = null;
    var leaveTimer = null;
    var visible = false;
    var lastMessageIndex = -1;
    var motionVectors = [
      { x: "-42px", y: "-28px", r: "-2deg" },
      { x: "38px", y: "-34px", r: "2deg" },
      { x: "-34px", y: "34px", r: "1.5deg" },
      { x: "46px", y: "28px", r: "-1.5deg" },
      { x: "0px", y: "-52px", r: "0deg" },
      { x: "0px", y: "46px", r: "0deg" },
    ];
    var portraitMessages = {
      en: [
        "From idea to shipped system, the work matters more than the noise.",
        "I build for production, not for screenshots only.",
        "Fullstack means I can move the whole system, not one corner.",
        "The clean path is usually faster than the flashy path.",
        "Good systems should feel clear, stable, and useful.",
      ],
      zh: [
        "从想法到上线系统，重点是交付，不是噪音。",
        "我做的是可投入生产的系统，不只是好看的截图。",
        "全栈代表我能推动整个系统，不只是其中一角。",
        "清楚的路径通常比花哨的路径更快。",
        "好的系统应该清晰、稳定，而且真正有用。",
      ],
    };

    if (!aboutSection || !portrait || !bubble || !message) {
      return;
    }

    function isAboutActive() {
      var rect = portrait.getBoundingClientRect();
      return (
        rect.top < window.innerHeight * 0.68 &&
        rect.bottom > window.innerHeight * 0.28
      );
    }

    function setPortraitMessage() {
      var pool = portraitMessages[currentLanguage] || portraitMessages.en;
      var nextIndex = Math.floor(Math.random() * pool.length);

      if (pool.length > 1 && nextIndex === lastMessageIndex) {
        nextIndex = (nextIndex + 1) % pool.length;
      }

      lastMessageIndex = nextIndex;
      message.textContent = pool[nextIndex];

      if (!isReducedMotion()) {
        bubble.classList.remove("is-swapping");
        void bubble.offsetWidth;
        bubble.classList.add("is-swapping");
      }
    }

    function clearPortraitTimers() {
      window.clearTimeout(showTimer);
      window.clearTimeout(rotateTimer);
      window.clearTimeout(leaveTimer);
      showTimer = null;
      rotateTimer = null;
      leaveTimer = null;
    }

    function setRandomPortraitVector(prefix) {
      var vector =
        motionVectors[Math.floor(Math.random() * motionVectors.length)];
      portrait.style.setProperty(prefix + "-x", vector.x);
      portrait.style.setProperty(prefix + "-y", vector.y);
      portrait.style.setProperty(prefix + "-r", vector.r);
    }

    function scheduleRotation() {
      window.clearTimeout(rotateTimer);

      if (!visible) {
        return;
      }

      rotateTimer = window.setTimeout(
        function () {
          if (!visible || !isAboutActive()) {
            return;
          }

          setPortraitMessage();
          scheduleRotation();
        },
        6200 + Math.random() * 4200,
      );
    }

    function showPortraitTalk() {
      if (visible || !isAboutActive()) {
        return;
      }

      visible = true;
      setRandomPortraitVector("--about-enter");
      portrait.classList.remove("is-portrait-leaving");
      portrait.classList.add("is-portrait-entering");
      portrait.classList.add("is-portrait-awake");
      bubble.classList.add("is-visible");
      setPortraitMessage();
      scheduleRotation();
    }

    function hidePortraitTalk() {
      clearPortraitTimers();
      if (!visible && !portrait.classList.contains("is-portrait-awake")) {
        return;
      }

      visible = false;
      setRandomPortraitVector("--about-exit");
      bubble.classList.remove("is-visible");
      portrait.classList.remove("is-portrait-entering");
      portrait.classList.add("is-portrait-leaving");
      portrait.classList.remove("is-portrait-awake");
      leaveTimer = window.setTimeout(function () {
        portrait.classList.remove("is-portrait-leaving");
      }, 1600);
    }

    function schedulePortraitTalk() {
      window.clearTimeout(showTimer);

      if (!isAboutActive()) {
        hidePortraitTalk();
        return;
      }

      if (visible) {
        scheduleRotation();
        return;
      }

      showTimer = window.setTimeout(function () {
        if (isAboutActive()) {
          showPortraitTalk();
        }
      }, showDelay);
    }

    window.addEventListener("scroll", schedulePortraitTalk, { passive: true });
    window.addEventListener("resize", schedulePortraitTalk);
    schedulePortraitTalk();
  }

  function setupStartupIconTooltips() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll(".startup-icon-link[data-tooltip]"),
    );

    if (!links.length) {
      return;
    }

    function hideOtherTooltips(activeLink) {
      links.forEach(function (link) {
        if (link !== activeLink) {
          link.classList.remove("is-tooltip-visible");
        }
      });
    }

    links.forEach(function (link) {
      link.addEventListener("pointerenter", function () {
        hideOtherTooltips(link);
        link.classList.add("is-tooltip-visible");
      });

      link.addEventListener("pointerleave", function () {
        link.classList.remove("is-tooltip-visible");
      });

      link.addEventListener("focus", function () {
        hideOtherTooltips(link);
        link.classList.add("is-tooltip-visible");
      });

      link.addEventListener("blur", function () {
        link.classList.remove("is-tooltip-visible");
      });
    });
  }

  function setupServiceMarketPricingModal() {
    var modal = document.getElementById("service-pricing-modal");
    var cards = Array.prototype.slice.call(
      document.querySelectorAll("[data-pricing-service]"),
    );

    if (!modal || !cards.length) {
      return;
    }

    var title = modal.querySelector("#service-pricing-title");
    var summary = modal.querySelector("[data-service-pricing-summary]");
    var ranges = modal.querySelector("[data-service-pricing-ranges]");
    var hunter = modal.querySelector("[data-service-pricing-hunter]");
    var proof = modal.querySelector("[data-service-pricing-proof]");
    var hunterLabel = modal.querySelector(".service-pricing-hunter span");
    var closeButtons = Array.prototype.slice.call(
      modal.querySelectorAll("[data-service-pricing-close]"),
    );
    var lastFocusedCard = null;
    var servicePricingDataEn = {
      website: {
        title: "Website | 网站",
        summary:
          "Typical market ranges for a custom business website, landing site, CMS, responsive build, or eCommerce starter. Final pricing depends on pages, content, integrations, and deadline.",
        rows: [
          ["MY / SEA", "USD 800-3.5k", "Lean company site or campaign build"],
          ["Singapore", "USD 2.5k-9k", "Agency or senior freelance range"],
          [
            "US / UK / AU",
            "USD 5k-25k+",
            "Higher local labor and agency overhead",
          ],
          ["Europe / GCC", "USD 4k-18k+", "Varies by compliance and scope"],
        ],
        hunter:
          "Ask Hunter when you want the same practical outcome with up to 50% better offer through direct build, fewer handoffs, and fullstack delivery.",
        proof:
          "Track record: shipped portfolio site, live demos, game demos, mobile demo apps, and 3D WebGL proof instead of only mockups.",
      },
      server: {
        title: "Server & Database | 服务器",
        summary:
          "Typical setup and maintenance ranges for VPS, hosting, migration, database, security hardening, API setup, and ongoing support.",
        rows: [
          ["MY / SEA", "USD 300-2.5k", "Setup, migration, and monthly care"],
          ["Singapore", "USD 1k-6k", "Business hosting and managed support"],
          ["US / UK / AU", "USD 2k-12k+", "DevOps or agency-managed work"],
          ["Europe / GCC", "USD 1.5k-10k+", "Infra support varies by SLA"],
        ],
        hunter:
          "Ask Hunter when you need practical setup plus maintenance discount, not separate vendor billing for every small server/database task.",
        proof:
          "Track record: deployed and verified production sites, Vercel apps, local GLB catalogs, API-backed demos, and maintenance-oriented portfolio flows.",
      },
      software: {
        title: "Software | 编程",
        summary:
          "Typical market ranges for custom CMS, CMMS, EAM, internal tools, workflow systems, dashboards, and business software.",
        rows: [
          ["MY / SEA", "USD 3k-18k", "Small to mid custom software"],
          ["Singapore", "USD 8k-45k", "Agency or senior team delivery"],
          ["US / UK / AU", "USD 15k-100k+", "Higher-cost custom product teams"],
          [
            "Europe / GCC",
            "USD 12k-80k+",
            "Depends on compliance and integrations",
          ],
        ],
        hunter:
          "Ask Hunter when you want one builder to understand the workflow, prototype fast, ship the stack, and keep the cost closer to business value.",
        proof:
          "Track record: CRM-style command centers, automation flows, reporting tools, payment-related systems, and production-grade demo projects.",
      },
      mobile: {
        title: "Mobile App | 手机应用",
        summary:
          "Typical market ranges for iOS/Android, Expo/React Native, Flutter, QR/contact flows, camera permissions, and publish-ready build profiles.",
        rows: [
          ["MY / SEA", "USD 5k-25k", "MVP or focused native app"],
          ["Singapore", "USD 15k-70k", "Commercial app with agency QA"],
          ["US / UK / AU", "USD 40k-150k+", "Mid-level app team range"],
          [
            "Europe / GCC",
            "USD 25k-120k+",
            "Varies by platform and compliance",
          ],
        ],
        hunter:
          "Ask Hunter when you need a mobile MVP that still connects to real web, backend, QR, contact, notification, and deployment proof.",
        proof:
          "Track record: React Native / Expo demo apps with Android metadata, permissions, build profiles, and hosted proof pages.",
      },
      ai: {
        title: "Machine Learning (AI) | 人工智能",
        summary:
          "Typical market ranges for automation, AI assistant flows, data training, prediction, object detection, recommendation, and ChatGPT API builds.",
        rows: [
          ["MY / SEA", "USD 2k-15k", "Automation or AI workflow build"],
          ["Singapore", "USD 8k-45k", "Business AI integration"],
          ["US / UK / AU", "USD 15k-120k+", "Specialist AI/product teams"],
          ["Europe / GCC", "USD 12k-90k+", "Depends on data and risk"],
        ],
        hunter:
          "Ask Hunter when you need useful automation connected to the actual website, app, database, and operations instead of a disconnected AI demo.",
        proof:
          "Track record: Ahfaiz founder work, AI automation concepts, data/reporting demos, assistant-style flows, and productized portfolio proof.",
      },
      ux: {
        title: "UX & UI Designer | 计师",
        summary:
          "Typical market ranges for UI design, clickable prototypes, responsive frontend, conversion polish, image optimization, and interaction quality.",
        rows: [
          ["MY / SEA", "USD 600-5k", "Prototype or frontend polish"],
          ["Singapore", "USD 2k-15k", "Senior UI/UX delivery"],
          ["US / UK / AU", "USD 5k-35k+", "Product design and frontend teams"],
          ["Europe / GCC", "USD 4k-28k+", "Depends on research and fidelity"],
        ],
        hunter:
          "Ask Hunter when you want UI/UX that can be coded, tested, deployed, optimized, and maintained by the same delivery owner.",
        proof:
          "Track record: accepted Option C hero, animated proof theater, responsive contact footer, startup lab, WebGL demos, and real HTML/CSS text.",
      },
    };
    var servicePricingDataZh = {
      website: {
        title: "Website | 网站",
        summary:
          "自定义企业官网、落地页、CMS、响应式网站或电商起步版的常见市场范围。最终价格取决于页面数量、内容、整合与交期。",
        rows: [
          ["MY / SEA", "USD 800-3.5k", "精简企业站或活动页"],
          ["Singapore", "USD 2.5k-9k", "Agency 或资深自由开发者范围"],
          ["US / UK / AU", "USD 5k-25k+", "较高本地人力与 agency 成本"],
          ["Europe / GCC", "USD 4k-18k+", "随合规与范围变化"],
        ],
        hunter:
          "如果你想用更少交接、直接全栈构建拿到同等务实结果，可以找 Hunter，报价可比常见市场低最多 50%。",
        proof:
          "交付证明：作品集网站、线上 Demo、游戏 Demo、手机 App Demo 与 3D WebGL 证明，不只是 mockup。",
      },
      server: {
        title: "Server & Database | 服务器",
        summary:
          "VPS、主机、迁移、数据库、安全强化、API 设置与持续维护的常见市场范围。",
        rows: [
          ["MY / SEA", "USD 300-2.5k", "设置、迁移与月度维护"],
          ["Singapore", "USD 1k-6k", "商业主机与托管支持"],
          ["US / UK / AU", "USD 2k-12k+", "DevOps 或 agency 托管"],
          ["Europe / GCC", "USD 1.5k-10k+", "随 SLA 变化"],
        ],
        hunter:
          "适合需要实际设置加维护折扣，而不是每个服务器/数据库小任务都被分开计费的客户。",
        proof:
          "交付证明：已部署和验证生产网站、Vercel App、本地 GLB 目录、API Demo 与维护导向作品集流程。",
      },
      software: {
        title: "Software | 编程",
        summary:
          "自定义 CMS、CMMS、EAM、内部工具、工作流系统、仪表板与业务软件的常见市场范围。",
        rows: [
          ["MY / SEA", "USD 3k-18k", "中小型自定义软件"],
          ["Singapore", "USD 8k-45k", "Agency 或资深团队交付"],
          ["US / UK / AU", "USD 15k-100k+", "高成本自定义产品团队"],
          ["Europe / GCC", "USD 12k-80k+", "取决于合规与整合"],
        ],
        hunter:
          "适合想让同一个 builder 理解流程、快速原型、交付整套 stack，并把成本贴近业务价值的客户。",
        proof:
          "交付证明：CRM 式指挥中心、自动化流程、举报工具、支付相关系统与生产级 Demo 项目。",
      },
      mobile: {
        title: "Mobile App | 手机应用",
        summary:
          "iOS/Android、Expo/React Native、Flutter、QR/联系人流程、相机权限与可发布 build profile 的常见市场范围。",
        rows: [
          ["MY / SEA", "USD 5k-25k", "MVP 或聚焦型原生 App"],
          ["Singapore", "USD 15k-70k", "含 agency QA 的商业 App"],
          ["US / UK / AU", "USD 40k-150k+", "中型 App 团队范围"],
          ["Europe / GCC", "USD 25k-120k+", "随平台与合规变化"],
        ],
        hunter:
          "适合需要手机 MVP 同时连接真实 Web、后台、QR、联系人、通知与部署证明的客户。",
        proof:
          "交付证明：React Native / Expo Demo App，包含 Android metadata、权限、build profile 与线上证明页。",
      },
      ai: {
        title: "Machine Learning (AI) | 人工智能",
        summary:
          "自动化、AI 助手流程、数据训练、预测、目标检测、推荐与 ChatGPT API 构建的常见市场范围。",
        rows: [
          ["MY / SEA", "USD 2k-15k", "自动化或 AI 工作流"],
          ["Singapore", "USD 8k-45k", "商业 AI 整合"],
          ["US / UK / AU", "USD 15k-120k+", "专业 AI/产品团队"],
          ["Europe / GCC", "USD 12k-90k+", "取决于数据与风险"],
        ],
        hunter:
          "适合需要 AI 真正接到网站、App、数据库与运营流程，而不是孤立 AI Demo 的客户。",
        proof:
          "交付证明：Ahfaiz 创办人工作、AI 自动化概念、数据/报告 Demo、助手式流程与产品化作品集证明。",
      },
      ux: {
        title: "UX & UI Designer | 计师",
        summary:
          "UI 设计、可点击原型、响应式前端、转化打磨、图片优化与互动质量的常见市场范围。",
        rows: [
          ["MY / SEA", "USD 600-5k", "原型或前端打磨"],
          ["Singapore", "USD 2k-15k", "资深 UI/UX 交付"],
          ["US / UK / AU", "USD 5k-35k+", "产品设计与前端团队"],
          ["Europe / GCC", "USD 4k-28k+", "取决于研究与精度"],
        ],
        hunter:
          "适合想要 UI/UX 能被同一个交付 owner 编码、测试、部署、优化和维护的客户。",
        proof:
          "交付证明：已接受的 Option C hero、动态证明剧场、响应式联系页脚、Startup Lab、WebGL Demo 与真实 HTML/CSS 文本。",
      },
    };

    function renderPricing(serviceId) {
      var servicePricingData =
        currentLanguage === "zh" ? servicePricingDataZh : servicePricingDataEn;
      var item = servicePricingData[serviceId] || servicePricingData.website;
      title.textContent = item.title;
      summary.textContent = item.summary;
      hunter.textContent = item.hunter;
      proof.textContent = item.proof;
      if (hunterLabel) {
        hunterLabel.textContent =
          currentLanguage === "zh" ? "为什么找 Hunter" : "Why ask Hunter";
      }
      ranges.innerHTML = item.rows
        .map(function (row) {
          return (
            '<div class="service-pricing-range"><span>' +
            row[0] +
            "</span><strong>" +
            row[1] +
            "</strong><p>" +
            row[2] +
            "</p></div>"
          );
        })
        .join("");
    }

    function openPricing(card) {
      lastFocusedCard = card;
      renderPricing(card.getAttribute("data-pricing-service") || "website");
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("is-service-pricing-open");
      window.setTimeout(function () {
        var closeButton = modal.querySelector(".service-pricing-close");
        if (closeButton) {
          closeButton.focus();
        }
      }, 60);
    }

    function closePricing() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.documentElement.classList.remove("is-service-pricing-open");
      if (lastFocusedCard) {
        lastFocusedCard.focus();
      }
    }

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        openPricing(card);
      });
      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openPricing(card);
        }
      });
    });

    closeButtons.forEach(function (button) {
      button.addEventListener("click", closePricing);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("is-open")) {
        closePricing();
      }
    });
  }

  function setupSingleHunterFocus() {
    var hunterZones = Array.prototype.slice.call(
      document.querySelectorAll("[data-hunter-zone]"),
    );

    if (!hunterZones.length) {
      return;
    }

    var ticking = false;

    function updateHunterFocus() {
      ticking = false;

      var viewportHeight = window.innerHeight || 1;
      var viewportCenter = viewportHeight * 0.48;
      var activeZone = null;
      var bestDistance = Number.POSITIVE_INFINITY;

      hunterZones.forEach(function (zone) {
        var rect = zone.getBoundingClientRect();
        var overlap =
          Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);

        if (overlap <= 0) {
          return;
        }

        var zoneCenter = rect.top + rect.height / 2;
        var distance = Math.abs(zoneCenter - viewportCenter);

        if (distance < bestDistance) {
          bestDistance = distance;
          activeZone = zone;
        }
      });

      hunterZones.forEach(function (zone) {
        zone.classList.toggle("is-hunter-active", zone === activeZone);
      });
    }

    function requestHunterFocus() {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateHunterFocus);
    }

    window.addEventListener("scroll", requestHunterFocus, { passive: true });
    window.addEventListener("resize", requestHunterFocus);
    updateHunterFocus();
  }

  function setupDeferredImages() {
    var images = Array.prototype.slice.call(
      document.querySelectorAll("img[data-src]"),
    );
    var prewarmDelay = 8500;
    var prewarmGap = 420;

    function loadImage(image) {
      var src = image.getAttribute("data-src");

      if (!src || image.dataset.loaded === "true") {
        return;
      }

      image.src = src;
      image.dataset.loaded = "true";
    }

    function shouldPrewarmImages() {
      var connection = navigator.connection || {};

      return !connection.saveData;
    }

    function prewarmImage(src) {
      var image = new Image();

      image.decoding = "async";
      image.src = src;
    }

    function scheduleImagePrewarm() {
      var sources;
      var index = 0;

      if (!shouldPrewarmImages()) {
        return;
      }

      sources = images
        .map(function (image) {
          return image.getAttribute("data-src");
        })
        .filter(function (src, srcIndex, list) {
          return src && list.indexOf(src) === srcIndex;
        });

      function warmNextImage(deadline) {
        var hasIdleBudget = !deadline || deadline.timeRemaining() > 8;

        if (document.hidden || !hasIdleBudget) {
          window.setTimeout(queueNextWarm, prewarmGap);
          return;
        }

        if (index >= sources.length) {
          return;
        }

        prewarmImage(sources[index]);
        index += 1;
        window.setTimeout(queueNextWarm, prewarmGap);
      }

      function queueNextWarm() {
        if (index >= sources.length) {
          return;
        }

        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(warmNextImage, { timeout: 1800 });
        } else {
          window.setTimeout(warmNextImage, 0);
        }
      }

      window.setTimeout(queueNextWarm, prewarmDelay);
    }

    if (!images.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      images.forEach(loadImage);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          observer.unobserve(entry.target);
          loadImage(entry.target);
        });
      },
      { rootMargin: "360px 0px", threshold: 0.01 },
    );

    images.forEach(function (image) {
      observer.observe(image);
    });
    scheduleImagePrewarm();
  }

  function registerPortfolioServiceWorker() {
    if (
      !("serviceWorker" in navigator) ||
      !/^https?:$/.test(window.location.protocol)
    ) {
      return;
    }

    window.addEventListener(
      "load",
      function () {
        var register = function () {
          navigator.serviceWorker.register("sw.js").catch(function () {});
        };

        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(register, { timeout: 2600 });
        } else {
          window.setTimeout(register, 1800);
        }
      },
      { once: true },
    );
  }

  function setupProjectThumbnailLoops() {
    var thumbnails = Array.prototype.slice.call(
      document.querySelectorAll("img[data-alt-thumb]"),
    );

    if (!thumbnails.length || isReducedMotion()) {
      return;
    }

    function preload(src) {
      var image = new Image();
      image.src = src;
      return image;
    }

    thumbnails.forEach(function (thumbnail, index) {
      var primary =
        thumbnail.getAttribute("data-src") || thumbnail.getAttribute("src");
      var alternate = thumbnail.getAttribute("data-alt-thumb");
      var extraThumbs = (thumbnail.getAttribute("data-extra-thumbs") || "")
        .split(",")
        .map(function (src) {
          return src.trim();
        })
        .filter(Boolean);
      var alternates = alternate
        ? [alternate].concat(extraThumbs)
        : extraThumbs;
      var thumbSources = primary ? [primary].concat(alternates) : [];
      var link = thumbnail.closest("a");
      var intervalId = null;
      var currentThumbIndex = 0;
      var visible = false;
      var waitingForPreload = false;
      var preloaded = [];

      if (thumbSources.length < 2) {
        return;
      }

      thumbnail.setAttribute("data-primary-thumb", primary);
      thumbnail.style.setProperty("--thumb-loop-index", index % 6);

      if (link) {
        link.classList.add("has-thumb-loop");
        link.style.setProperty("--thumb-loop-index", index % 6);
      }

      function swapThumbnail(nextSrc, useAlternate) {
        if (!visible || thumbnail.getAttribute("src") === nextSrc) {
          return;
        }

        thumbnail.classList.add("is-thumb-swapping");

        window.setTimeout(function () {
          thumbnail.setAttribute("data-src", nextSrc);
          thumbnail.setAttribute("src", nextSrc);
          thumbnail.dataset.loaded = "true";
          thumbnail.classList.toggle("is-thumb-alt", useAlternate);
          thumbnail.classList.remove("is-thumb-swapping");
        }, 180);
      }

      function allPreloaded() {
        return preloaded.every(function (image) {
          return image.complete;
        });
      }

      function loop() {
        currentThumbIndex = (currentThumbIndex + 1) % thumbSources.length;
        swapThumbnail(thumbSources[currentThumbIndex], currentThumbIndex > 0);
      }

      function start() {
        visible = true;

        if (
          thumbnail.dataset &&
          thumbnail.dataset.src &&
          thumbnail.dataset.loaded !== "true"
        ) {
          setDeferredImageSource(thumbnail, thumbnail.dataset.src);
        }

        if (!preloaded.length) {
          preloaded = alternates.map(preload);
        }

        if (intervalId) {
          return;
        }

        if (!allPreloaded()) {
          if (!waitingForPreload) {
            waitingForPreload = true;
            preloaded.forEach(function (image) {
              if (image.complete) {
                return;
              }

              image.addEventListener(
                "load",
                function () {
                  waitingForPreload = false;
                  if (visible) {
                    start();
                  }
                },
                { once: true },
              );
              image.addEventListener(
                "error",
                function () {
                  waitingForPreload = false;
                  if (visible) {
                    start();
                  }
                },
                { once: true },
              );
            });
          }
          return;
        }

        intervalId = window.setInterval(loop, 4200 + (index % 5) * 360);
        window.setTimeout(loop, 900 + (index % 7) * 180);
      }

      function stop() {
        visible = false;
        if (intervalId) {
          window.clearInterval(intervalId);
          intervalId = null;
        }
        thumbnail.classList.remove("is-thumb-swapping");
      }

      if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                start();
              } else {
                stop();
              }
            });
          },
          { rootMargin: "180px 0px", threshold: 0.18 },
        );
        observer.observe(thumbnail);
      } else {
        start();
      }
    });
  }

  function setupMagneticEffects() {
    document
      .querySelectorAll(".magnetic-cta, [data-motion-card]")
      .forEach(function (element) {
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
        particle.style.setProperty(
          "--particle-dx",
          Math.cos(angle) * distance + "px",
        );
        particle.style.setProperty(
          "--particle-dy",
          Math.sin(angle) * distance + "px",
        );
        particle.style.setProperty(
          "--particle-size",
          6 + Math.random() * 10 + "px",
        );
        particle.style.setProperty(
          "--particle-color",
          colors[index % colors.length],
        );
        layer.appendChild(particle);

        window.setTimeout(
          function (node) {
            node.remove();
          },
          950,
          particle,
        );
      }
    };
  }

  function moveHuskySafely(husky) {
    if (!husky || isReducedMotion()) {
      return;
    }

    var rect = husky.getBoundingClientRect();
    var width = Math.min(
      Math.max(rect.width || 360, 300),
      window.innerWidth - 24,
    );
    var height = Math.min(
      Math.max(rect.height || 110, 92),
      window.innerHeight - 24,
    );
    var edge = window.innerWidth < 600 ? 10 : 22;
    var minX =
      window.innerWidth < 600
        ? edge
        : Math.max(edge, Math.round(window.innerWidth * 0.46));
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

  function updateHeroThreeMotion() {
    var stage = document.querySelector(".hero-three-stage");
    var viewport = Math.max(window.innerHeight, 1);

    if (!stage || isReducedMotion()) {
      return;
    }

    var bounds = stage.getBoundingClientRect();
    var localDepth = clamp(
      (viewport - bounds.top) / Math.max(viewport + bounds.height, 1),
      0,
      1.35,
    );
    var bgX = Math.round(heroThreePointer.x * -18 + localDepth * -12);
    var bgY = Math.round(heroThreePointer.y * -11 + localDepth * -22);

    stage.style.setProperty("--hero-three-bg-x", bgX + "px");
    stage.style.setProperty("--hero-three-bg-y", bgY + "px");
  }

  function requestHeroThreeMotion() {
    if (heroThreeMotionFrame || isReducedMotion()) {
      return;
    }

    heroThreeMotionFrame = window.requestAnimationFrame(function () {
      heroThreeMotionFrame = null;
      updateHeroThreeMotion();
    });
  }

  function updateHeroThreePointer(event) {
    var width = Math.max(window.innerWidth, 1);
    var height = Math.max(window.innerHeight, 1);

    heroThreePointer.x = (event.clientX / width - 0.5) * 2;
    heroThreePointer.y = (event.clientY / height - 0.5) * 2;
    requestHeroThreeMotion();
  }

  function setupHeroImageLoading() {
    var body = document.body;
    var stage = document.querySelector(".hero-three-stage");
    var image = document.querySelector(".hero-three-source");
    var loader = document.querySelector("[data-hero-loader]");
    var finished = false;

    function markHeroReady() {
      if (finished) {
        return;
      }

      finished = true;
      if (stage) {
        stage.classList.add("is-image-ready");
      }
      if (body) {
        body.classList.remove("is-hero-loading");
        body.classList.add("is-hero-ready");
      }
      if (loader) {
        loader.classList.add("is-hidden");
        loader.setAttribute("aria-hidden", "true");
      }
    }

    if (!body || !stage || !image) {
      markHeroReady();
      return;
    }

    body.classList.add("is-hero-loading");

    if (image.complete && image.naturalWidth > 0) {
      window.setTimeout(markHeroReady, 90);
      return;
    }

    if (typeof image.decode === "function") {
      image
        .decode()
        .then(markHeroReady)
        .catch(function () {
          if (image.complete) {
            markHeroReady();
          }
        });
    }

    image.addEventListener("load", markHeroReady, { once: true });
    image.addEventListener(
      "error",
      function () {
        if (stage) {
          stage.classList.add("is-three-fallback");
        }
        markHeroReady();
      },
      { once: true },
    );

    window.setTimeout(markHeroReady, 8500);
  }

  async function initHeroThreeScene() {
    var canvas = document.getElementById("hero-three-canvas");
    var stage = document.querySelector(".hero-three-stage");
    var contextAttributes = {
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    };
    var glContext;

    if (!canvas || !stage || isReducedMotion()) {
      return;
    }

    try {
      glContext =
        canvas.getContext("webgl2", contextAttributes) ||
        canvas.getContext("webgl", contextAttributes);
    } catch (error) {
      glContext = null;
    }

    if (!glContext) {
      stage.classList.add("is-three-fallback");
      canvas.setAttribute("data-three-error", "webgl-unavailable");
      return;
    }

    try {
      var THREE =
        await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
      var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        context: glContext,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
      });
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      var group = new THREE.Group();
      var coreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x67dff2,
        metalness: 0.72,
        roughness: 0.18,
        transmission: 0.18,
        emissive: 0x0c5666,
        emissiveIntensity: 0.5,
      });
      var goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xd8bd76,
        metalness: 0.82,
        roughness: 0.22,
        emissive: 0x6b4f18,
        emissiveIntensity: 0.42,
      });
      var core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.05, 1),
        coreMaterial,
      );
      var inner = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.58, 1),
        goldMaterial,
      );
      var orbitA = new THREE.Mesh(
        new THREE.TorusGeometry(1.95, 0.014, 12, 110),
        new THREE.MeshBasicMaterial({
          color: 0x67dff2,
          transparent: true,
          opacity: 0.7,
        }),
      );
      var orbitB = new THREE.Mesh(
        new THREE.TorusGeometry(2.45, 0.012, 12, 124),
        new THREE.MeshBasicMaterial({
          color: 0xd8bd76,
          transparent: true,
          opacity: 0.56,
        }),
      );
      var dots = new THREE.BufferGeometry();
      var dotPositions = [];
      var dotCount = 90;
      var i;

      for (i = 0; i < dotCount; i += 1) {
        var radius = 2.4 + Math.random() * 2.8;
        var angle = Math.random() * Math.PI * 2;
        var height = (Math.random() - 0.5) * 3.8;

        dotPositions.push(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius,
        );
      }

      dots.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(dotPositions, 3),
      );

      var points = new THREE.Points(
        dots,
        new THREE.PointsMaterial({
          color: 0x67dff2,
          size: 0.035,
          transparent: true,
          opacity: 0.82,
        }),
      );
      var cyan = new THREE.PointLight(0x67dff2, 3.2, 18);
      var gold = new THREE.PointLight(0xd8bd76, 2.3, 16);

      orbitA.rotation.x = Math.PI * 0.62;
      orbitB.rotation.x = Math.PI * 0.44;
      orbitB.rotation.y = Math.PI * 0.2;
      group.add(core, inner, orbitA, orbitB, points);
      scene.add(group);
      scene.add(new THREE.AmbientLight(0x9edff0, 0.9));
      cyan.position.set(2.5, 2.4, 3.4);
      gold.position.set(0.4, -1.6, 4.2);
      scene.add(cyan, gold);
      camera.position.set(0, 0, 7);

      function resizeHeroScene() {
        var rect = canvas.getBoundingClientRect();
        var width = Math.max(Math.floor(rect.width), 1);
        var height = Math.max(Math.floor(rect.height), 1);
        var compact = width < 740;

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        group.position.set(compact ? 2.25 : 2.15, compact ? 0.03 : 0.08, 0);
        group.scale.setScalar(compact ? 0.78 : 1);
      }

      function animateHeroScene() {
        window.requestAnimationFrame(animateHeroScene);
        group.rotation.y += 0.005 + heroThreePointer.x * 0.0008;
        group.rotation.x = heroThreePointer.y * -0.08;
        orbitA.rotation.z += 0.009;
        orbitB.rotation.z -= 0.006;
        points.rotation.y -= 0.0018;
        renderer.render(scene, camera);
      }

      resizeHeroScene();
      window.addEventListener("resize", resizeHeroScene, { passive: true });
      animateHeroScene();
    } catch (error) {
      stage.classList.add("is-three-fallback");
      canvas.setAttribute("data-three-error", "true");
    }
  }

  function scheduleHeroThreeScene() {
    var connection = navigator.connection || {};
    var heroThreeDelay = 12000;
    var isQueued = false;

    if (connection.saveData) {
      return;
    }

    function startHeroThreeScene() {
      if (isQueued) {
        return;
      }

      isQueued = true;

      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(initHeroThreeScene, { timeout: 3200 });
      } else {
        window.setTimeout(initHeroThreeScene, 900);
      }
    }

    function queueHeroThreeScene() {
      window.setTimeout(startHeroThreeScene, heroThreeDelay);
    }

    if (document.readyState === "complete") {
      queueHeroThreeScene();
    } else {
      window.addEventListener("load", queueHeroThreeScene, { once: true });
    }
  }

  function setupMotionAndHelper() {
    var revealTargets = document.querySelectorAll(
      "section, #about, #services, .journal-info, .startup-icon-link, .teaching-proof-card, .hackathon-carousel-card",
    );
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
        "Need a quote fast? My paws are already on the button.",
      ],
      zh: [
        "汪，我帮你找到最快联系 Hunter 的入口。",
        "需要网站、App、系统或自动化？点我就可以。",
        "小想法或大项目，我都可以帮你叫 Hunter。",
        "我是灰色哈士奇助手，专门守着联系按钮。",
        "想快速报价？我的小爪已经准备好了。",
      ],
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
        huskyMessage.textContent =
          currentLanguage === "zh"
            ? "想快速聊项目？WhatsApp 或 Email 都可以。"
            : "Want the fast path? WhatsApp or email Hunter here.";
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
        { threshold: 0.12 },
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
      requestHeroThreeMotion();

      if (husky) {
        if (
          !huskyHasAppeared &&
          window.scrollY + window.innerHeight > doc.scrollHeight - 900
        ) {
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
    window.addEventListener("pointermove", updateHeroThreePointer, {
      passive: true,
    });
    updateScrollEffects();
    window.setTimeout(updateScrollEffects, 250);
  }

  function setupSmartNavbar() {
    var body = document.body;
    var mainNav = document.getElementById("main-nav");

    if (!body || !mainNav) {
      return;
    }

    function updateNavbarState() {
      body.classList.toggle("is-hero-top", window.scrollY <= 24);
    }

    window.addEventListener("scroll", updateNavbarState, { passive: true });
    window.addEventListener("resize", updateNavbarState);
    updateNavbarState();
  }

  function setupHeroHunterPopup() {
    var popup = document.getElementById("hero-hunter-popup");
    var hero = document.getElementById("header");
    var message = popup
      ? popup.querySelector("[data-hero-hunter-message]")
      : null;
    var bubble = popup ? popup.querySelector(".hero-hunter-bubble") : null;
    var heroHunterDelay = 15000;
    var showTimer = null;
    var messageTimer = null;
    var leaveTimer = null;
    var isVisible = false;
    var lastMessageIndex = -1;
    var heroHunterMessages = {
      en: [
        "Still here? Tell me the problem and I will shape the build.",
        "Need the fastest path? Start with one clear outcome.",
        "I can turn the messy part into a shipped system.",
        "Scroll for proof, or tap contact when you are ready.",
        "The Lazy way means smarter systems, not slower work.",
      ],
      zh: [
        "还在这里？告诉我问题，我帮你整理成可开发方案。",
        "想走最快路径？先锁定一个清楚结果。",
        "我可以把混乱部分变成可上线系统。",
        "往下看证明，准备好了就联系我。",
        "Lazy 方式是更聪明的系统，不是更慢的工作。",
      ],
    };

    if (!popup || !hero || !message) {
      return;
    }

    function isHeroSectionActive() {
      var rect = hero.getBoundingClientRect();
      return (
        rect.top < Math.min(120, window.innerHeight * 0.18) &&
        rect.bottom > window.innerHeight * 0.38
      );
    }

    function setHeroHunterMessage() {
      var pool = heroHunterMessages[currentLanguage] || heroHunterMessages.en;
      var nextIndex = Math.floor(Math.random() * pool.length);

      if (pool.length > 1 && nextIndex === lastMessageIndex) {
        nextIndex = (nextIndex + 1) % pool.length;
      }

      lastMessageIndex = nextIndex;
      message.textContent = pool[nextIndex];

      if (bubble && !isReducedMotion()) {
        bubble.classList.remove("is-swapping");
        void bubble.offsetWidth;
        bubble.classList.add("is-swapping");
      }
    }

    function clearHeroHunterTimers() {
      window.clearTimeout(showTimer);
      window.clearTimeout(messageTimer);
      showTimer = null;
      messageTimer = null;
    }

    function scheduleHeroHunterMessage() {
      window.clearTimeout(messageTimer);

      if (!isVisible) {
        return;
      }

      messageTimer = window.setTimeout(
        function () {
          if (!isVisible || !isHeroSectionActive()) {
            return;
          }

          setHeroHunterMessage();
          scheduleHeroHunterMessage();
        },
        6500 + Math.random() * 5200,
      );
    }

    function hideHeroHunterPopup() {
      clearHeroHunterTimers();

      if (!isVisible && !popup.classList.contains("is-visible")) {
        return;
      }

      isVisible = false;
      window.clearTimeout(leaveTimer);
      popup.classList.remove("is-visible");
      popup.classList.add("is-leaving");
      popup.setAttribute("aria-hidden", "true");

      leaveTimer = window.setTimeout(
        function () {
          popup.classList.remove("is-leaving");
        },
        isReducedMotion() ? 0 : 440,
      );
    }

    function showHeroHunterPopup() {
      showTimer = null;

      if (document.hidden || !isHeroSectionActive()) {
        return;
      }

      isVisible = true;
      window.clearTimeout(leaveTimer);
      popup.classList.remove("is-leaving");
      setHeroHunterMessage();
      popup.classList.add("is-visible");
      popup.setAttribute("aria-hidden", "false");
      scheduleHeroHunterMessage();
    }

    function scheduleHeroHunterPopup() {
      if (document.hidden || !isHeroSectionActive()) {
        hideHeroHunterPopup();
        return;
      }

      if (isVisible || showTimer) {
        return;
      }

      showTimer = window.setTimeout(showHeroHunterPopup, heroHunterDelay);
    }

    window.addEventListener("scroll", scheduleHeroHunterPopup, {
      passive: true,
    });
    window.addEventListener("resize", scheduleHeroHunterPopup);
    document.addEventListener("visibilitychange", scheduleHeroHunterPopup);
    scheduleHeroHunterPopup();
  }

  function setupModelsHunterBackground() {
    var stage = document.querySelector("[data-models-hunter-bg]");
    var demoHunterStart = document.querySelector("[data-demo-hunter-start]");
    var demoHunterEnd = document.getElementById("project-assets-section");
    var ghost = stage
      ? stage.querySelector("[data-models-hunter-ghost]")
      : null;
    var canvas = stage ? stage.querySelector("[data-models-matrix]") : null;
    var context = canvas ? canvas.getContext("2d") : null;
    var modelsHunterEffects = [
      "neon-rim",
      "matrix-rain",
      "hologram-scan",
      "glitch-echo",
      "prism-bloom",
      "soft-blur",
    ];
    var modelsHunterRoutes = [
      {
        name: "left-to-right",
        from: ["-28vw", "16vh"],
        to: ["96vw", "46vh"],
        rotate: "-5deg",
      },
      {
        name: "right-to-left",
        from: ["96vw", "20vh"],
        to: ["-30vw", "54vh"],
        rotate: "5deg",
      },
      {
        name: "top-to-bottom",
        from: ["36vw", "-42vh"],
        to: ["54vw", "92vh"],
        rotate: "3deg",
      },
      {
        name: "bottom-to-top",
        from: ["54vw", "92vh"],
        to: ["34vw", "-44vh"],
        rotate: "-4deg",
      },
      {
        name: "top-left-to-bottom-right",
        from: ["-26vw", "-34vh"],
        to: ["92vw", "92vh"],
        rotate: "-7deg",
      },
      {
        name: "bottom-left-to-top-right",
        from: ["-26vw", "88vh"],
        to: ["92vw", "-38vh"],
        rotate: "7deg",
      },
      {
        name: "mid-left-to-mid-right",
        from: ["-30vw", "42vh"],
        to: ["96vw", "38vh"],
        rotate: "-2deg",
      },
      {
        name: "mid-right-to-mid-left",
        from: ["96vw", "44vh"],
        to: ["-30vw", "34vh"],
        rotate: "2deg",
      },
    ];
    var matrixColumns = [];
    var matrixFrame = 0;
    var nextTimer = null;
    var fallbackTimer = null;

    if (
      !stage ||
      !demoHunterStart ||
      !demoHunterEnd ||
      !ghost ||
      isReducedMotion()
    ) {
      return;
    }

    function pickRandom(items) {
      return items[Math.floor(Math.random() * items.length)];
    }

    function randomBetween(min, max) {
      return min + Math.random() * (max - min);
    }

    function clearEffectClasses() {
      modelsHunterEffects.forEach(function (effect) {
        ghost.classList.remove("effect-" + effect);
        stage.classList.remove("stage-effect-" + effect);
      });
    }

    function setGhostPoint(point) {
      var rotate =
        ghost.style.getPropertyValue("--models-hunter-rotate") || "0deg";
      var scale = ghost.style.getPropertyValue("--models-hunter-scale") || "1";

      ghost.style.setProperty("--models-hunter-x", point[0]);
      ghost.style.setProperty("--models-hunter-y", point[1]);
      ghost.style.transform =
        "translate3d(" +
        point[0] +
        ", " +
        point[1] +
        ", 0) rotate(" +
        rotate +
        ") scale(" +
        scale +
        ")";
    }

    function scheduleNextHunter(delay) {
      window.clearTimeout(nextTimer);
      window.clearTimeout(fallbackTimer);
      ghost.classList.remove("is-active");
      nextTimer = window.setTimeout(
        runHunterPass,
        delay || randomBetween(900, 2200),
      );
    }

    function runHunterPass() {
      var route = pickRandom(modelsHunterRoutes);
      var effect = pickRandom(modelsHunterEffects);
      var duration = randomBetween(7600, 11800);

      clearEffectClasses();
      ghost.classList.add("effect-" + effect);
      stage.classList.add("stage-effect-" + effect);
      ghost.setAttribute("data-models-route", route.name);
      stage.style.setProperty(
        "--models-hunter-opacity",
        randomBetween(0.46, 0.7).toFixed(2),
      );
      stage.style.setProperty(
        "--models-hunter-blur",
        randomBetween(5, 14).toFixed(1) + "px",
      );
      stage.style.setProperty(
        "--models-hunter-scale",
        randomBetween(0.92, 1.26).toFixed(2),
      );
      stage.style.setProperty(
        "--models-hunter-hue",
        Math.round(randomBetween(-34, 48)) + "deg",
      );
      stage.style.setProperty(
        "--models-hunter-light-x",
        Math.round(randomBetween(18, 82)) + "%",
      );
      stage.style.setProperty(
        "--models-hunter-light-y",
        Math.round(randomBetween(22, 72)) + "%",
      );
      ghost.style.setProperty(
        "--models-hunter-duration",
        duration.toFixed(0) + "ms",
      );
      ghost.style.setProperty("--models-hunter-rotate", route.rotate);
      ghost.classList.remove("is-active");
      ghost.style.transition = "none";
      setGhostPoint(route.from);
      ghost.getBoundingClientRect();
      ghost.style.transition = "";

      window.setTimeout(function () {
        ghost.getBoundingClientRect();
        ghost.classList.add("is-active");
        setGhostPoint(route.to);
      }, 80);

      fallbackTimer = window.setTimeout(function () {
        scheduleNextHunter();
      }, duration + 1400);
    }

    function updateDemoHunterRange() {
      var startRect = demoHunterStart.getBoundingClientRect();
      var endRect = demoHunterEnd.getBoundingClientRect();
      var startTop = startRect.top + window.scrollY;
      var endBottom = endRect.bottom + window.scrollY;
      var viewportMiddle = window.scrollY + (window.innerHeight || 1) * 0.52;
      var rangeHeight = Math.max(endBottom - startTop, window.innerHeight || 1);
      var isInDemoRange =
        viewportMiddle >= startTop && viewportMiddle <= endBottom;

      stage.style.setProperty(
        "--models-hunter-range-height",
        Math.round(rangeHeight) + "px",
      );
      stage.classList.toggle("is-demo-range-active", isInDemoRange);
    }

    ghost.addEventListener("transitionend", function (event) {
      if (event.propertyName === "transform") {
        return;
      }
    });

    function resizeMatrix() {
      var rect = stage.getBoundingClientRect();
      var ratio = window.devicePixelRatio || 1;
      var width = Math.max(320, Math.round(rect.width));
      var height = Math.max(260, Math.round(rect.height));
      var columnCount = Math.ceil(width / 18);

      if (!canvas || !context) {
        return;
      }

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      matrixColumns = Array.from({ length: columnCount }, function () {
        return Math.floor(Math.random() * (height / 18));
      });
    }

    function drawMatrix() {
      var width = canvas ? parseFloat(canvas.style.width) || canvas.width : 0;
      var height = canvas
        ? parseFloat(canvas.style.height) || canvas.height
        : 0;
      var glyphs = "01AI3D";

      if (!context || !width || !height) {
        return;
      }

      matrixFrame += 1;
      context.fillStyle = "rgba(2, 8, 10, 0.18)";
      context.fillRect(0, 0, width, height);
      context.font = "700 15px monospace";
      context.textAlign = "center";

      matrixColumns.forEach(function (drop, index) {
        var x = index * 18 + 9;
        var y = drop * 18;
        var glyph = glyphs[(index + matrixFrame + drop) % glyphs.length];

        context.fillStyle =
          index % 5 === 0
            ? "rgba(116, 227, 255, 0.72)"
            : "rgba(83, 255, 151, 0.64)";
        context.fillText(glyph, x, y);

        if (y > height + Math.random() * 900) {
          matrixColumns[index] = 0;
        } else {
          matrixColumns[index] = drop + (index % 3 === 0 ? 1.32 : 1);
        }
      });

      window.setTimeout(function () {
        window.requestAnimationFrame(drawMatrix);
      }, 68);
    }

    resizeMatrix();
    updateDemoHunterRange();
    window.addEventListener("scroll", updateDemoHunterRange, { passive: true });
    window.addEventListener("resize", function () {
      updateDemoHunterRange();
      resizeMatrix();
    });
    window.setTimeout(runHunterPass, 650);

    if (canvas && context) {
      drawMatrix();
    }
  }

  function setupStartupTechStackLights() {
    var flow = document.querySelector(".startup-tech-stack-flow");

    if (!flow || isReducedMotion()) {
      return;
    }

    var rows = Array.prototype.slice.call(
      flow.querySelectorAll("[data-tech-stack-row]"),
    );
    var pills = Array.prototype.slice.call(
      flow.querySelectorAll(".tech-orbit-pill"),
    );
    var activeTimer = null;
    var isActive = false;
    var cycleIndex = 0;
    var startupTechGlowMinDuration = 1400;
    var startupTechGlowDurationRange = 900;
    var startupTechNextDelayMin = 760;
    var startupTechNextDelayRange = 900;
    var startupTechLightToneClasses = [
      "is-lit-cyan",
      "is-lit-amber",
      "is-lit-violet",
    ];

    if (!pills.length) {
      return;
    }

    function clearTechLightTone(pill) {
      startupTechLightToneClasses.forEach(function (toneClass) {
        pill.classList.remove(toneClass);
      });
    }

    function clearActiveLights() {
      pills.forEach(function (pill) {
        pill.classList.remove("is-lit");
        pill.classList.remove("is-dim");
        clearTechLightTone(pill);
      });
    }

    function scheduleNextLight(delay) {
      window.clearTimeout(activeTimer);

      if (!isActive || document.hidden) {
        return;
      }

      activeTimer = window.setTimeout(function () {
        var row = rows.length ? rows[cycleIndex % rows.length] : flow;
        var rowPills = Array.prototype.slice.call(
          row.querySelectorAll('.tech-orbit-pill:not([aria-hidden="true"])'),
        );
        var lightPool = rowPills.length ? rowPills : pills;
        var lightCount = Math.random() > 0.72 ? 3 : 2;

        pills.forEach(function (pill) {
          pill.classList.toggle(
            "is-dim",
            rowPills.indexOf(pill) === -1 && Math.random() > 0.46,
          );
        });

        for (var index = 0; index < lightCount; index += 1) {
          var pill =
            lightPool[
              (cycleIndex +
                index * 3 +
                Math.floor(Math.random() * lightPool.length)) %
                lightPool.length
            ];
          var glowDuration =
            startupTechGlowMinDuration +
            Math.random() * startupTechGlowDurationRange;
          var toneClass =
            startupTechLightToneClasses[
              (cycleIndex +
                index +
                Math.floor(
                  Math.random() * startupTechLightToneClasses.length,
                )) %
                startupTechLightToneClasses.length
            ];

          clearTechLightTone(pill);
          pill.classList.add("is-lit");
          pill.classList.add(toneClass);
          pill.classList.remove("is-dim");
          window.setTimeout(
            function (litPill) {
              litPill.classList.remove("is-lit");
              litPill.classList.remove("is-dim");
              clearTechLightTone(litPill);
            },
            glowDuration,
            pill,
          );
        }

        cycleIndex += 1;
        scheduleNextLight(
          startupTechNextDelayMin + Math.random() * startupTechNextDelayRange,
        );
      }, delay);
    }

    function setActive(nextActive) {
      if (isActive === nextActive) {
        return;
      }

      isActive = nextActive;

      if (isActive) {
        scheduleNextLight(320);
      } else {
        window.clearTimeout(activeTimer);
        clearActiveLights();
      }
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.target === flow) {
              setActive(entry.isIntersecting && entry.intersectionRatio > 0.12);
            }
          });
        },
        { threshold: [0, 0.12, 0.32], rootMargin: "80px 0px" },
      );

      observer.observe(flow);
    } else {
      setActive(true);
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        setActive(false);
        return;
      }

      var rect = flow.getBoundingClientRect();
      setActive(rect.top < window.innerHeight && rect.bottom > 0);
    });
  }

  function setupHackathonGlassCarousel() {
    var carousel = document.querySelector("[data-hackathon-carousel]");
    if (!carousel) {
      return;
    }

    var track = carousel.querySelector("[data-carousel-track]");
    var stage = carousel.querySelector(".hackathon-carousel-stage");
    var cards = Array.prototype.slice.call(
      carousel.querySelectorAll(
        "[data-carousel-card]:not([data-carousel-clone])",
      ),
    );
    var prevButton = carousel.querySelector("[data-carousel-prev]");
    var nextButton = carousel.querySelector("[data-carousel-next]");
    var activeIndex = 0;
    var carouselRotation = 0;
    var ringStep = 0;
    var carouselRadius = 1480;
    var slideWidth = 0;
    var dragStartX = 0;
    var dragStartY = 0;
    var lastPointerX = 0;
    var dragDeltaX = 0;
    var activePointerId = null;
    var isDragging = false;
    var controlsLocked = false;
    var dragThreshold = 38;
    var carouselAutoplayDelay = 3200;
    var carouselInteractionHold = 7000;
    var carouselAutoplayTimer = null;
    var isCarouselHovered = false;
    var interactionHoldUntil = 0;

    if (!cards.length) {
      return;
    }

    if (!track || !stage || cards.length < 2) {
      return;
    }

    cards.forEach(function (card) {
      card.removeAttribute("data-motion-card");
    });

    function setControlsDisabled(isDisabled) {
      controlsLocked = isDisabled;
      [prevButton, nextButton].forEach(function (button) {
        if (!button) {
          return;
        }

        button.disabled = isDisabled;
        button.setAttribute("aria-disabled", String(isDisabled));
      });
    }

    function applyCarouselLayout() {
      track.style.setProperty(
        "--carousel-rotation",
        carouselRotation.toFixed(2) + "deg",
      );

      cards.forEach(function (card, cardIndex) {
        var cardAngle = cardIndex * ringStep;
        var displayAngle = (cardAngle + carouselRotation) % 360;
        var normalizedAngle = ((displayAngle + 180 + 360) % 360) - 180;
        var absAngle = Math.abs(normalizedAngle);
        var isFocus = absAngle < ringStep * 0.55;
        var isSide = absAngle >= ringStep * 0.55 && absAngle < ringStep * 1.55;
        var cardLift = isFocus ? 72 : isSide ? 16 : -94;
        var cardScale = isFocus ? 1.4 : 1;

        card.style.setProperty("--card-lift", cardLift + "px");
        card.style.setProperty("--card-angle", cardAngle.toFixed(2) + "deg");
        card.style.setProperty("--card-scale", String(cardScale));
        card.hidden = false;
        card.setAttribute("aria-hidden", "false");
        card.style.zIndex = "";
        card.classList.toggle("is-ring-focus", isFocus);
        card.classList.toggle("is-ring-side", isSide);
        card.classList.toggle("is-ring-back", !isFocus && !isSide);
      });
    }

    function setActiveIndex(nextIndex) {
      activeIndex = nextIndex;
      carouselRotation = -(activeIndex * ringStep);
      applyCarouselLayout();
    }

    function layoutRing() {
      slideWidth = cards[0].getBoundingClientRect().width || 520;
      ringStep = 360 / cards.length;
      carouselRotation = -(activeIndex * ringStep);
      carouselRadius = Math.round(
        (slideWidth / 2 / Math.tan(Math.PI / cards.length)) * 1.32,
      );
      carouselRadius = Math.max(carouselRadius, Math.round(slideWidth * 4.2));
      carouselRadius = Math.min(carouselRadius, 3600);
      carousel.style.setProperty(
        "--carousel-radius",
        String(carouselRadius) + "px",
      );

      cards.forEach(function (card, cardIndex) {
        card.style.setProperty("--card-lift", "0px");
        card.style.setProperty("--card-angle", String(cardIndex * ringStep) + "deg");
        card.setAttribute("data-carousel-seq", String(cardIndex));
        card.setAttribute("aria-hidden", "false");
      });

      applyCarouselLayout();
    }

    function lockControlsBriefly() {
      setControlsDisabled(true);
      window.setTimeout(function () {
        setControlsDisabled(false);
      }, 220);
    }

    function stepTrack(direction) {
      if (controlsLocked) {
        return;
      }

      setActiveIndex(activeIndex - direction);
      holdCarouselAutoplay();
      lockControlsBriefly();
    }

    function snapToNearestCard() {
      setActiveIndex(Math.round(-carouselRotation / ringStep));
    }

    function clearCarouselAutoplay() {
      if (!carouselAutoplayTimer) {
        return;
      }

      window.clearTimeout(carouselAutoplayTimer);
      carouselAutoplayTimer = null;
    }

    function shouldPauseCarouselAutoplay() {
      return (
        isReducedMotion() ||
        document.hidden ||
        isDragging ||
        isCarouselHovered ||
        Date.now() < interactionHoldUntil
      );
    }

    function scheduleCarouselAutoplay() {
      clearCarouselAutoplay();

      if (isReducedMotion()) {
        return;
      }

      carouselAutoplayTimer = window.setTimeout(function () {
        if (!shouldPauseCarouselAutoplay()) {
          setActiveIndex(activeIndex + 1);
        }

        scheduleCarouselAutoplay();
      }, carouselAutoplayDelay);
    }

    function holdCarouselAutoplay() {
      interactionHoldUntil = Date.now() + carouselInteractionHold;
      scheduleCarouselAutoplay();
    }

    function refreshLayout() {
      layoutRing();
    }

    refreshLayout();

    if (carousel.hasAttribute("data-carousel-bound")) {
      return;
    }

    carousel.setAttribute("data-carousel-bound", "true");

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        stepTrack(1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        stepTrack(-1);
      });
    }

    carousel.addEventListener("mouseenter", function () {
      isCarouselHovered = true;
      clearCarouselAutoplay();
    });

    carousel.addEventListener("mouseleave", function () {
      isCarouselHovered = false;
      scheduleCarouselAutoplay();
    });

    carousel.addEventListener("focusin", function () {
      isCarouselHovered = true;
      clearCarouselAutoplay();
    });

    carousel.addEventListener("focusout", function () {
      isCarouselHovered = false;
      scheduleCarouselAutoplay();
    });

    carousel.addEventListener("click", holdCarouselAutoplay);

    document.addEventListener("visibilitychange", scheduleCarouselAutoplay);

    stage.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }
      if (event.target && event.target.closest(".hackathon-carousel-control")) {
        return;
      }

      event.preventDefault();
      isDragging = true;
      activePointerId = event.pointerId;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      lastPointerX = event.clientX;
      dragDeltaX = 0;
      carousel.classList.add("is-dragging");
      clearCarouselAutoplay();
    });

    window.addEventListener("pointermove", function (event) {
      if (!isDragging || activePointerId !== event.pointerId) {
        return;
      }

      event.preventDefault();
      var pointerDeltaX = event.clientX - lastPointerX;
      dragDeltaX = event.clientX - dragStartX;
      lastPointerX = event.clientX;
      carouselRotation += pointerDeltaX * 0.18;
      applyCarouselLayout();
    });

    function finishDrag(event) {
      if (!isDragging || activePointerId !== event.pointerId) {
        return;
      }

      var dragDeltaY = event.clientY - dragStartY;
      isDragging = false;
      activePointerId = null;
      carousel.classList.remove("is-dragging");
      holdCarouselAutoplay();

      if (
        Math.abs(dragDeltaX) > dragThreshold &&
        Math.abs(dragDeltaX) > Math.abs(dragDeltaY)
      ) {
        snapToNearestCard();
      } else {
        snapToNearestCard();
      }
    }

    window.addEventListener("pointerup", finishDrag);

    window.addEventListener("pointercancel", function (event) {
      if (activePointerId !== event.pointerId) {
        return;
      }

      isDragging = false;
      activePointerId = null;
      carousel.classList.remove("is-dragging");
      holdCarouselAutoplay();
      snapToNearestCard();
    });

    window.addEventListener("resize", refreshLayout);
    scheduleCarouselAutoplay();
  }

  function setupResponsiveNavbarToggle() {
    var toggle = document.querySelector(".responsive");
    var navMenu = document.querySelector(".nav-menu");

    if (!toggle || !navMenu) {
      return;
    }

    toggle.setAttribute("role", "button");
    toggle.setAttribute("tabindex", "0");
    toggle.setAttribute("aria-label", "Open navigation menu");
    toggle.setAttribute(
      "aria-expanded",
      String(navMenu.classList.contains("is-open")),
    );

    function setMenuOpen(isOpen) {
      navMenu.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    }

    toggle.addEventListener("click", function (event) {
      event.preventDefault();
      setMenuOpen(!navMenu.classList.contains("is-open"));
    });

    toggle.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setMenuOpen(!navMenu.classList.contains("is-open"));
      }
    });

    navMenu.addEventListener("click", function (event) {
      if (event.target && event.target.matches("a")) {
        setMenuOpen(false);
      }
    });
  }

  function setupLazyYouTubeEmbeds() {
    document.querySelectorAll("[data-youtube-id]").forEach(function (button) {
      button.addEventListener("click", function () {
        var videoId = button.getAttribute("data-youtube-id");
        var frame = document.createElement("iframe");

        if (!videoId || button.dataset.loaded === "true") {
          return;
        }

        button.dataset.loaded = "true";
        frame.src =
          "https://www.youtube.com/embed/" +
          encodeURIComponent(videoId) +
          "?rel=0&modestbranding=1&playsinline=1&autoplay=1";
        frame.title = button.getAttribute("aria-label") || "YouTube video";
        frame.loading = "lazy";
        frame.referrerPolicy = "strict-origin-when-cross-origin";
        frame.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        frame.allowFullscreen = true;
        button.replaceWith(frame);
      });
    });
  }

  function setupSmoothAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        var targetHash = link.getAttribute("href");
        var target;

        if (!targetHash || targetHash === "#") {
          return;
        }

        target = document.querySelector(targetHash);
        if (!target) {
          return;
        }

        event.preventDefault();
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
          anchor.classList.toggle("active", anchor === link);
        });
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 80,
          behavior: isReducedMotion() ? "auto" : "smooth",
        });

        if (window.history && window.history.pushState) {
          window.history.pushState(null, "", targetHash);
        } else {
          window.location.hash = targetHash;
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setupLanguageToggle();
      setupProjectDetails();
      setupDeferredImages();
      setupProjectThumbnailLoops();
      setupSectionParallax();
      setupContactCopyrightDock();
      setupAboutServicesParallax();
      setupAboutPortraitTalk();
      setupStartupIconTooltips();
      setupServiceMarketPricingModal();
      setupSingleHunterFocus();
      setupMagneticEffects();
      setupFounderJourney();
      setupHeroImageLoading();
      scheduleHeroThreeScene();
      setupMotionAndHelper();
      setupSmartNavbar();
      setupHeroHunterPopup();
      setupModelsHunterBackground();
      setupStartupTechStackLights();
      setupHackathonGlassCarousel();
      setupResponsiveNavbarToggle();
      setupLazyYouTubeEmbeds();
      setupSmoothAnchorScroll();
      registerPortfolioServiceWorker();
    });
  } else {
    setupLanguageToggle();
    setupProjectDetails();
    setupDeferredImages();
    setupProjectThumbnailLoops();
    setupSectionParallax();
    setupContactCopyrightDock();
    setupAboutServicesParallax();
    setupAboutPortraitTalk();
    setupStartupIconTooltips();
    setupServiceMarketPricingModal();
    setupSingleHunterFocus();
    setupMagneticEffects();
    setupFounderJourney();
    setupHeroImageLoading();
    scheduleHeroThreeScene();
    setupMotionAndHelper();
    setupSmartNavbar();
    setupHeroHunterPopup();
    setupModelsHunterBackground();
    setupStartupTechStackLights();
    setupHackathonGlassCarousel();
    setupResponsiveNavbarToggle();
    setupLazyYouTubeEmbeds();
    setupSmoothAnchorScroll();
    registerPortfolioServiceWorker();
  }
})();
