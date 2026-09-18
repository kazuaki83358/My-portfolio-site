// Nav and Section Selectors
const navLinks = document.querySelectorAll('.ul-list li a');
const sections = document.querySelectorAll('section');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

function removeActive() {
  navLinks.forEach(link => link.parentElement.classList.remove('active'));
}

// Scroll Reveal Elements (declared before scroll listener to avoid ReferenceError)
const revealElements = document.querySelectorAll('.home-container, .about-container, .projects-container, .services-container, .contact-content');
revealElements.forEach(el => el.classList.add('reveal'));

// Back To Top Button (declared before scroll listener to avoid ReferenceError)
const backToTop = document.createElement('div');
backToTop.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
backToTop.id = "back-to-top";
document.body.appendChild(backToTop);

backToTop.style.cssText = `
  position: fixed;
  bottom: 40px;
  right: 40px;
  background: #474af0;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: transform 0.3s ease;
`;

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

backToTop.addEventListener('mouseover', () => backToTop.style.transform = 'scale(1.2)');
backToTop.addEventListener('mouseout', () => backToTop.style.transform = 'scale(1)');

// Toggle Mobile Menu
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    menuToggle.innerHTML = navMenu.classList.contains('show')
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });
}

// Smooth Scroll & Navigation Highlight
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }

    removeActive();
    link.parentElement.classList.add('active');

    if (window.innerWidth <= 768 && navMenu) {
      navMenu.classList.remove('show');
      if (menuToggle) menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });
});

// Scroll Event Handler
window.addEventListener('scroll', () => {
  let scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      removeActive();
      const activeLink = document.querySelector(`.ul-list li a[href="#${section.id}"]`);
      if (activeLink) activeLink.parentElement.classList.add('active');
    }
  });

  if (backToTop) {
    backToTop.style.display = window.scrollY > 500 ? "flex" : "none";
  }

  revealElements.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 150;

    if (elementTop < windowHeight - revealPoint) {
      el.classList.add('active-reveal');
    }
  });
});

// Role Typing Animation
const typingElement = document.querySelector('.info-home h3');
const words = [
  "Android Developer",
  "Software Developer",
  "Web Developer",
  "AI/ML Developer",
  "Data Scientist",
  "Data Analyst",
  "Linux User"
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typewriterStarted = false;
const typeSpeed = 100;
const deleteSpeed = 50;
const pauseEnd = 1200;
const pauseStart = 300;

function type() {
  if (!typingElement) return;
  const currentWord = words[wordIndex];
  const displayedText = currentWord.substring(0, charIndex);

  typingElement.innerHTML = `<span class="role-text">${displayedText}</span><span class="cursor">|</span>`;

  if (!isDeleting && charIndex < currentWord.length) {
    charIndex++;
    setTimeout(type, typeSpeed);
  } else if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    setTimeout(type, pauseEnd);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(type, deleteSpeed);
  } else {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(type, pauseStart);
  }
}

function startTypewriter() {
  if (typewriterStarted || !typingElement) return;
  typewriterStarted = true;
  type();
}

// Portfolio intro (preloader) animation
// Sequence: laptop icon -> MY PROFILE -> social/code icons -> credit line.
// The markup is already in index.html; this controls the timing and keeps the
// intro safe when the loading elements are not present.
document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");
  const loadingContent = document.querySelector(".loading-content");
  const loadingText = document.getElementById("loading-text");
  const mainIcon = document.querySelector(".main-icon");
  const subIcons = document.querySelectorAll(".sub-icons i");
  const designerText = document.getElementById("designer-text");

  if (!loadingScreen || !loadingContent || !loadingText || !mainIcon || !designerText) {
    return;
  }

  // Lock page scroll while the intro plays.
  document.body.classList.add("loading-active");

  // Add a polished neon treatment without requiring changes to the page markup.
  loadingContent.style.setProperty('--intro-color', '#00f0ff');
  loadingContent.style.textShadow = '0 0 18px rgba(0, 240, 255, .45)';
  loadingText.style.letterSpacing = '2px';
  designerText.style.letterSpacing = '0.5px';

  const showElement = (element, delay = 0) => {
    window.setTimeout(() => {
      element.classList.remove("hidden");
      element.classList.add("fall");
    }, delay);
  };

  // Match the reference image's top-to-bottom reveal order.
  showElement(mainIcon, 150);
  showElement(loadingText, 850);
  subIcons.forEach((icon, index) => showElement(icon, 1450 + index * 250));
  showElement(designerText, 2450);

  // Leave enough time for the final line's animation to finish.
  window.setTimeout(() => {
    loadingScreen.style.transition = 'opacity .6s ease, visibility .6s ease';
    loadingScreen.style.opacity = '0';
    loadingScreen.style.visibility = 'hidden';

    window.setTimeout(() => {
      loadingScreen.style.display = 'none';
      document.body.classList.remove("loading-active");
      document.body.classList.add('intro-complete');
      const mainPage = document.getElementById("main-page");
      if (mainPage) mainPage.classList.add("visible");
      startTypewriter();
    }, 650);
  }, 3900);
});

// Contact Form AJAX Submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const submitButton = contactForm.querySelector('.btn-send');

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
      const formData = new FormData(this);
      const response = await fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        submitButton.textContent = 'Message Sent!';
        submitButton.style.backgroundColor = '#22c55e';
        contactForm.reset();

        setTimeout(() => {
          submitButton.textContent = 'Send Message';
          submitButton.style.backgroundColor = '';
          submitButton.disabled = false;
        }, 3000);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      submitButton.textContent = 'Failed to send';
      submitButton.style.backgroundColor = '#ef4444';

      setTimeout(() => {
        submitButton.textContent = 'Send Message';
        submitButton.style.backgroundColor = '';
        submitButton.disabled = false;
      }, 3000);
    }
  });
}

// Section Intersection Observer for Scroll Animations
document.addEventListener('DOMContentLoaded', function() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const homeSection = document.querySelector('.home');
  const homeContent = document.querySelectorAll('.home *');

  if (homeSection) {
    homeSection.style.opacity = '1';
    homeSection.style.transform = 'none';
    homeContent.forEach(element => {
      element.style.opacity = '1';
      element.style.transform = 'none';
    });
  }

  const otherSections = document.querySelectorAll('section:not(.home)');
  if (prefersReducedMotion) {
    otherSections.forEach(section => {
      section.style.opacity = '1';
      section.style.transform = 'none';
    });
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    otherSections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(24px)';
      observer.observe(section);
    });
  }
});