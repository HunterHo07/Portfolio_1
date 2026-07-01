(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var previews = Array.prototype.slice.call(document.querySelectorAll("[data-hero-preview]"));
  var pointer = { x: 0, y: 0 };
  var latestScroll = 0;
  var ticking = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function setChoice(choice) {
    var toast = document.querySelector(".choice-toast");

    window.localStorage.setItem("portfolio-hero-choice", choice);

    if (!toast) {
      return;
    }

    toast.textContent = choice === "option-a" ? "Option A saved for review." : "Option C saved for review.";
    toast.classList.add("is-visible");
    window.clearTimeout(setChoice.toastTimer);
    setChoice.toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  function updatePointer(event) {
    var width = Math.max(window.innerWidth, 1);
    var height = Math.max(window.innerHeight, 1);

    pointer.x = (event.clientX / width - 0.5) * 2;
    pointer.y = (event.clientY / height - 0.5) * 2;
    requestMotionTick();
  }

  function updateScroll() {
    latestScroll = window.scrollY || window.pageYOffset || 0;
    requestMotionTick();
  }

  function requestMotionTick() {
    if (ticking || reducedMotion.matches) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateHeroMotion);
  }

  function updateHeroMotion() {
    var viewport = Math.max(window.innerHeight, 1);
    var scrollRatio = clamp(latestScroll / viewport, 0, 1.35);

    previews.forEach(function (preview) {
      var bounds = preview.getBoundingClientRect();
      var localDepth = clamp((viewport - bounds.top) / (viewport + bounds.height), 0, 1.4);
      var planes = Array.prototype.slice.call(preview.querySelectorAll(".cinematic-plane"));

      planes.forEach(function (plane, index) {
        var depth = Number(plane.getAttribute("data-depth")) || index + 1;
        var motionX = Math.round(pointer.x * depth * 4.8 + localDepth * depth * 3.2);
        var motionY = Math.round(pointer.y * depth * 3.2 - scrollRatio * depth * 12);

        plane.style.setProperty("--plane-move-x", motionX + "px");
        plane.style.setProperty("--plane-move-y", motionY + "px");
      });

      if (preview.getAttribute("data-hero-preview") === "option-c") {
        preview.style.setProperty("--three-bg-x", Math.round(pointer.x * -16) + "px");
        preview.style.setProperty("--three-bg-y", Math.round(pointer.y * -10 + localDepth * -18) + "px");
      }
    });

    ticking = false;
  }

  async function initThreeHero() {
    var canvas = document.getElementById("three-canvas");
    var hero = document.querySelector("[data-hero-preview=\"option-c\"]");

    if (!canvas || reducedMotion.matches) {
      return;
    }

    try {
      var THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
      var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
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
        emissiveIntensity: 0.5
      });
      var goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xd8bd76,
        metalness: 0.82,
        roughness: 0.22,
        emissive: 0x6b4f18,
        emissiveIntensity: 0.42
      });
      var core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 1), coreMaterial);
      var inner = new THREE.Mesh(new THREE.OctahedronGeometry(0.58, 1), goldMaterial);
      var orbitA = new THREE.Mesh(
        new THREE.TorusGeometry(1.95, 0.014, 12, 110),
        new THREE.MeshBasicMaterial({ color: 0x67dff2, transparent: true, opacity: 0.7 })
      );
      var orbitB = new THREE.Mesh(
        new THREE.TorusGeometry(2.45, 0.012, 12, 124),
        new THREE.MeshBasicMaterial({ color: 0xd8bd76, transparent: true, opacity: 0.56 })
      );
      var dots = new THREE.BufferGeometry();
      var dotPositions = [];
      var dotCount = 90;

      for (var i = 0; i < dotCount; i += 1) {
        var radius = 2.4 + Math.random() * 2.8;
        var angle = Math.random() * Math.PI * 2;
        var height = (Math.random() - 0.5) * 3.8;

        dotPositions.push(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
      }

      dots.setAttribute("position", new THREE.Float32BufferAttribute(dotPositions, 3));

      var points = new THREE.Points(
        dots,
        new THREE.PointsMaterial({
          color: 0x67dff2,
          size: 0.035,
          transparent: true,
          opacity: 0.82
        })
      );

      orbitA.rotation.x = Math.PI * 0.62;
      orbitB.rotation.x = Math.PI * 0.44;
      orbitB.rotation.y = Math.PI * 0.2;
      group.add(core, inner, orbitA, orbitB, points);
      group.position.set(2.15, 0.08, 0);
      scene.add(group);
      scene.add(new THREE.AmbientLight(0x9edff0, 0.9));

      var cyan = new THREE.PointLight(0x67dff2, 3.2, 18);
      var gold = new THREE.PointLight(0xd8bd76, 2.3, 16);
      cyan.position.set(2.5, 2.4, 3.4);
      gold.position.set(0.4, -1.6, 4.2);
      scene.add(cyan, gold);

      camera.position.set(0, 0, 7);

      function resize() {
        var rect = canvas.getBoundingClientRect();
        var width = Math.max(Math.floor(rect.width), 1);
        var height = Math.max(Math.floor(rect.height), 1);

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }

      function animate() {
        window.requestAnimationFrame(animate);
        group.rotation.y += 0.005 + pointer.x * 0.0008;
        group.rotation.x = pointer.y * -0.08;
        orbitA.rotation.z += 0.009;
        orbitB.rotation.z -= 0.006;
        points.rotation.y -= 0.0018;
        renderer.render(scene, camera);
      }

      resize();
      window.addEventListener("resize", resize, { passive: true });
      animate();
    } catch (error) {
      if (hero) {
        hero.classList.add("is-three-fallback");
      }
      canvas.setAttribute("data-three-error", "true");
    }
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-choice]")).forEach(function (button) {
    button.addEventListener("click", function () {
      setChoice(button.getAttribute("data-choice"));
    });
  });

  if (!reducedMotion.matches) {
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
  }

  window.initThreeHero = initThreeHero;
  initThreeHero();
})();
