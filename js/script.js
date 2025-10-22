// ===============================
// FICHIER: js/script.js
// ===============================

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
  
  // ===== MENU BURGER =====
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      
      // Animation de l'icône burger
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Fermer le menu au clic sur un lien
    const menuLinks = navLinks.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }

  // ===== NAVBAR AU SCROLL =====
  const header = document.getElementById('header');
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ===== EFFET TYPING =====
  const typedText = document.querySelector('.typed-text');
  if (typedText) {
    const phrases = [
      'Développeur passionné',
      'Technicien réseau',
      'Étudiant BTS SIO',
      'Créateur de jeux'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;
    
    function type() {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        typedText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 50;
      } else {
        typedText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 100;
      }
      
      if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause à la fin
        typingDelay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingDelay = 500;
      }
      
      setTimeout(type, typingDelay);
    }
    
    // Démarrer l'effet après un court délai
    setTimeout(type, 1000);
  }

  // ===== ANIMATION DES BARRES DE COMPÉTENCES =====
  const skillBars = document.querySelectorAll('.skill-progress');
  
  const animateSkills = function() {
    skillBars.forEach(bar => {
      const progress = bar.getAttribute('data-progress');
      const position = bar.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (position < windowHeight - 100 && !bar.classList.contains('animated')) {
        bar.style.width = progress + '%';
        bar.classList.add('animated');
      }
    });
  };
  
  // Observer pour déclencher l'animation au scroll
  if (skillBars.length > 0) {
    window.addEventListener('scroll', animateSkills);
    animateSkills(); // Vérifier au chargement
  }

  // ===== ANIMATION DES ÉLÉMENTS AU SCROLL =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observer les sections
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
  });
  
  // Observer les cartes de compétences
  const competenceCards = document.querySelectorAll('.competence-category');
  competenceCards.forEach(card => {
    card.classList.add('fade-in');
    observer.observe(card);
  });
  
  // Observer les cartes de la timeline
  const timelineCards = document.querySelectorAll('.timeline-card');
  timelineCards.forEach((card, index) => {
    card.classList.add('fade-in');
    card.style.animationDelay = `${index * 0.2}s`;
    observer.observe(card);
  });

  // ===== SMOOTH SCROLL =====
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Ignorer les liens vides
      if (href === '#' || href === '') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== BOUTON SCROLL TO TOP =====
  const scrollTopBtn = document.getElementById('scroll-top');
  
  if (scrollTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });
    
    scrollTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===== FORMULAIRE DE CONTACT =====
  const form = document.forms['submit-to-google-sheet'];
  const msg = document.getElementById('msg');
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwV4dumTE8jLQUVvokT1ks49h6YoHAKP4n4u5pw5doA-kkQ7DEkqVWQjScBERPA5V9vLg/exec';
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.btn-submit');
      const btnText = submitBtn.querySelector('.btn-text');
      const originalText = btnText.textContent;
      btnText.textContent = 'Envoi...';
      submitBtn.disabled = true;
      
      fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
          msg.textContent = 'Message envoyé avec succès !';
          msg.style.color = 'green';
          form.reset();
        })
        .catch(error => {
          msg.textContent = 'Erreur lors de l\'envoi du message.';
          msg.style.color = 'red';
        })
        .finally(() => {
          btnText.textContent = originalText;
          submitBtn.disabled = false;
          setTimeout(() => { msg.textContent = ''; }, 5000);
        });
    });
  }

});