// ============================================
// JjSTORE - JAVASCRIPT ULTRA DYNAMIQUE
// ============================================

// === CONFIGURATION ===
const config = {
  animationSpeed: 300,
  scrollThreshold: 100,
  cartStorageKey: 'Jjstore_cart',
  wishlistStorageKey: 'Jjstore_wishlist'
};

// === ÉTAT GLOBAL DE L'APPLICATION ===
const appState = {
  cart: [],
  wishlist: [],
  currentTestimonial: 0,
  isMenuOpen: false,
  scrollPosition: 0
};

// ============================================
// 1. INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  loadStoredData();
  initNavbar();
  initHeroAnimations();
  initProductInteractions();
  initTestimonialSlider();
  initSubscribeForm();
  initScrollAnimations();
  initParallaxEffects();
  initCartSystem();
  initSearchFunctionality();
  initMobileMenu();
  initLazyLoading();
  addProductQuickView();
  initCounters();
  initTooltips();
  updateCartBadge();
}

// ============================================
// 2. SYSTÈME DE NAVIGATION INTELLIGENT
// ============================================
function initNavbar() {
  const header = document.querySelector('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Navbar transparent/solid
    if (currentScroll > 50) {
      header.classList.add('scrolled');
      header.style.background = 'rgba(255, 255, 255, 0.98)';
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
      header.classList.remove('scrolled');
      header.style.background = '#fff';
      header.style.boxShadow = 'none';
    }

    // Hide/show navbar on scroll
    if (currentScroll > lastScroll && currentScroll > 500) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  });

  // Smooth scroll pour tous les liens
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ============================================
// 3. ANIMATIONS HERO SECTION
// ============================================
function initHeroAnimations() {
  const heroSections = document.querySelectorAll('.hero');
  
  heroSections.forEach((hero, index) => {
    const text = hero.querySelector('.hero-text');
    const image = hero.querySelector('.joli img');
    
    // Animation d'entrée
    setTimeout(() => {
      if (text) {
        text.style.opacity = '0';
        text.style.transform = 'translateX(-50px)';
        setTimeout(() => {
          text.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
          text.style.opacity = '1';
          text.style.transform = 'translateX(0)';
        }, 100);
      }
      
      if (image) {
        image.style.opacity = '0';
        image.style.transform = 'scale(0.8) rotate(-10deg)';
        setTimeout(() => {
          image.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
          image.style.opacity = '1';
          image.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
      }
    }, index * 200);

    // Animation de l'image au hover
    if (image) {
      image.style.transition = 'transform 0.4s ease';
      image.addEventListener('mouseenter', () => {
        image.style.transform = 'scale(1.1) rotate(5deg)';
      });
      image.addEventListener('mouseleave', () => {
        image.style.transform = 'scale(1) rotate(0deg)';
      });
    }
  });
}

// ============================================
// 4. SYSTÈME DE PANIER AVANCÉ
// ============================================
function initCartSystem() {
  const products = document.querySelectorAll('.product-item');
  
  products.forEach(product => {
    const price = product.querySelector('.product-price').textContent;
    const name = product.querySelector('h3').textContent.trim();
    const img = product.querySelector('.phone')?.src || '';
    
    // Créer des boutons d'action
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'product-actions';
    actionsDiv.style.cssText = 'display: flex; gap: 10px; opacity: 0; transition: opacity 0.3s;';
    
    const cartBtn = createActionButton('🛒', 'Ajouter au panier');
    const wishBtn = createActionButton('❤️', 'Ajouter aux favoris');
    const viewBtn = createActionButton('👁️', 'Aperçu rapide');
    
    actionsDiv.appendChild(cartBtn);
    actionsDiv.appendChild(wishBtn);
    actionsDiv.appendChild(viewBtn);
    
    product.appendChild(actionsDiv);
    
    // Afficher les boutons au hover
    product.addEventListener('mouseenter', () => {
      actionsDiv.style.opacity = '1';
    });
    product.addEventListener('mouseleave', () => {
      actionsDiv.style.opacity = '0';
    });
    
    // Actions des boutons
    cartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart({ name, price, img });
      showNotification('Produit ajouté au panier! 🎉', 'success');
    });
    
    wishBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToWishlist({ name, price, img });
      showNotification('Ajouté aux favoris! ❤️', 'info');
    });
    
    viewBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showQuickView({ name, price, img });
    });
  });
}

function createActionButton(icon, title) {
  const btn = document.createElement('button');
  btn.innerHTML = icon;
  btn.title = title;
  btn.style.cssText = `
    background: #fff;
    border: 2px solid #0078ff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 18px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  `;
  
  btn.addEventListener('mouseenter', () => {
    btn.style.background = '#0078ff';
    btn.style.transform = 'scale(1.1) rotate(10deg)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = '#fff';
    btn.style.transform = 'scale(1) rotate(0deg)';
  });
  
  return btn;
}

function addToCart(product) {
  const existingProduct = appState.cart.find(p => p.name === product.name);
  
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    appState.cart.push({ ...product, quantity: 1, id: Date.now() });
  }
  
  saveToStorage('cart', appState.cart);
  updateCartBadge();
  animateCartIcon();
}

function addToWishlist(product) {
  if (!appState.wishlist.find(p => p.name === product.name)) {
    appState.wishlist.push({ ...product, id: Date.now() });
    saveToStorage('wishlist', appState.wishlist);
  }
}

function updateCartBadge() {
  const cartIcon = document.querySelector('.nav-icons a[href="#"]:nth-child(2)');
  if (!cartIcon) return;
  
  let badge = cartIcon.querySelector('.cart-badge');
  const itemCount = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (itemCount > 0) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge';
      badge.style.cssText = `
        position: absolute;
        top: -8px;
        right: -8px;
        background: #ff4444;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: bold;
        animation: bounceIn 0.5s;
      `;
      cartIcon.style.position = 'relative';
      cartIcon.appendChild(badge);
    }
    badge.textContent = itemCount;
  } else if (badge) {
    badge.remove();
  }
}

function animateCartIcon() {
  const cartIcon = document.querySelector('.nav-icons a[href="#"]:nth-child(2) img');
  if (cartIcon) {
    cartIcon.style.animation = 'cartBounce 0.5s ease';
    setTimeout(() => {
      cartIcon.style.animation = '';
    }, 500);
  }
}

// ============================================
// 5. APERÇU RAPIDE (QUICK VIEW)
// ============================================
function showQuickView(product) {
  const modal = document.createElement('div');
  modal.className = 'quick-view-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    padding: 40px;
    border-radius: 20px;
    max-width: 600px;
    width: 90%;
    transform: scale(0.8);
    transition: transform 0.3s;
    position: relative;
  `;
  
  content.innerHTML = `
    <button class="close-modal" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 30px; cursor: pointer; color: #999;">×</button>
    <div style="display: flex; gap: 30px; align-items: center;">
      <img src="${product.img}" style="width: 200px; height: 200px; object-fit: contain;" alt="${product.name}">
      <div style="flex: 1;">
        <h2 style="margin-bottom: 15px; font-size: 28px;">${product.name}</h2>
        <p style="font-size: 32px; color: #0078ff; font-weight: bold; margin-bottom: 20px;">${product.price}</p>
        <p style="color: #666; margin-bottom: 25px; line-height: 1.6;">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Haute qualité et design moderne.
        </p>
        <div style="display: flex; gap: 15px;">
          <button class="add-to-cart-modal" style="flex: 1; padding: 15px; background: #0078ff; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: all 0.3s;">
            Ajouter au panier
          </button>
          <button class="add-to-wishlist-modal" style="padding: 15px 20px; background: #fff; color: #0078ff; border: 2px solid #0078ff; border-radius: 8px; cursor: pointer; transition: all 0.3s;">
            ❤️
          </button>
        </div>
      </div>
    </div>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Animations d'apparition
  setTimeout(() => {
    modal.style.opacity = '1';
    content.style.transform = 'scale(1)';
  }, 10);
  
  // Fermer le modal
  const closeModal = () => {
    modal.style.opacity = '0';
    content.style.transform = 'scale(0.8)';
    setTimeout(() => modal.remove(), 300);
  };
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  content.querySelector('.close-modal').addEventListener('click', closeModal);
  
  content.querySelector('.add-to-cart-modal').addEventListener('click', () => {
    addToCart(product);
    showNotification('Produit ajouté au panier! 🎉', 'success');
    closeModal();
  });
  
  content.querySelector('.add-to-wishlist-modal').addEventListener('click', () => {
    addToWishlist(product);
    showNotification('Ajouté aux favoris! ❤️', 'info');
  });
}

// ============================================
// 6. SLIDER DE TÉMOIGNAGES
// ============================================
function initTestimonialSlider() {
  const testimonials = [
    {
      text: "Tempus oncu enim pellen tesque este pretium in neque, elit morbi sagittis lorem habi mattis Pellen tesque pretium feugiat vel morbi suspen dise sagittis lorem hab tasse morbi.",
      author: "EMMA CHAMBERLIN",
      rating: 4
    },
    {
      text: "Amazing products and excellent customer service! I've been shopping here for years and never disappointed. The quality is always top-notch.",
      author: "JOHN SMITH",
      rating: 5
    },
    {
      text: "Fast delivery and great prices. The tech products are authentic and work perfectly. Highly recommend this store to everyone!",
      author: "SARAH JOHNSON",
      rating: 5
    }
  ];
  
  const leftArrow = document.querySelector('.slider-arrow-left');
  const rightArrow = document.querySelector('.slider-arrow-right');
  const content = document.querySelector('.testimonial-content');
  
  if (!leftArrow || !rightArrow || !content) return;
  
  function updateTestimonial(index) {
    const testimonial = testimonials[index];
    
    content.style.opacity = '0';
    content.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      content.querySelector('.testimonial-text').textContent = `"${testimonial.text}"`;
      content.querySelector('.testimonial-author').textContent = testimonial.author;
      
      const stars = content.querySelectorAll('.star');
      stars.forEach((star, i) => {
        star.classList.toggle('filled', i < testimonial.rating);
      });
      
      content.style.transition = 'all 0.5s ease';
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    }, 300);
  }
  
  leftArrow.addEventListener('click', () => {
    appState.currentTestimonial = (appState.currentTestimonial - 1 + testimonials.length) % testimonials.length;
    updateTestimonial(appState.currentTestimonial);
  });
  
  rightArrow.addEventListener('click', () => {
    appState.currentTestimonial = (appState.currentTestimonial + 1) % testimonials.length;
    updateTestimonial(appState.currentTestimonial);
  });
  
  // Auto-slide
  setInterval(() => {
    appState.currentTestimonial = (appState.currentTestimonial + 1) % testimonials.length;
    updateTestimonial(appState.currentTestimonial);
  }, 5000);
}

// ============================================
// 7. FORMULAIRE D'INSCRIPTION
// ============================================
function initSubscribeForm() {
  const form = document.querySelector('.subscribe-form');
  const input = document.querySelector('.subscribe-input');
  const btn = document.querySelector('.subscribe-btn');
  
  if (!form || !input || !btn) return;
  
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = input.value.trim();
    
    if (!email) {
      showNotification('Veuillez entrer votre email', 'error');
      input.style.border = '2px solid #ff4444';
      return;
    }
    
    if (!isValidEmail(email)) {
      showNotification('Email invalide', 'error');
      input.style.border = '2px solid #ff4444';
      return;
    }
    
    // Animation de chargement
    btn.innerHTML = '<span style="display: inline-block; animation: spin 1s linear infinite;">⏳</span>';
    btn.disabled = true;
    
    setTimeout(() => {
      showNotification('Merci pour votre inscription! 🎉', 'success');
      input.value = '';
      input.style.border = '2px solid #4CAF50';
      btn.innerHTML = 'SUBSCRIBE';
      btn.disabled = false;
      
      // Confetti effect
      createConfetti();
    }, 1500);
  });
  
  input.addEventListener('input', () => {
    input.style.border = 'none';
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================
// 8. ANIMATIONS AU SCROLL
// ============================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observer tous les éléments
  const elements = document.querySelectorAll('.service-item, .product-item, .blog-card, .insta-item');
  elements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });
}

// ============================================
// 9. EFFETS PARALLAX
// ============================================
function initParallaxEffects() {
  const parallaxElements = document.querySelectorAll('.joli img, .sale-image img');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(el => {
      const speed = 0.3;
      const yPos = -(scrolled * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// ============================================
// 10. SYSTÈME DE RECHERCHE
// ============================================
function initSearchFunctionality() {
  const searchIcon = document.querySelector('.nav-icons a:first-child');
  
  if (!searchIcon) return;
  
  searchIcon.addEventListener('click', (e) => {
    e.preventDefault();
    showSearchModal();
  });
}

function showSearchModal() {
  const modal = document.createElement('div');
  modal.className = 'search-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s;
  `;
  
  modal.innerHTML = `
    <div style="width: 90%; max-width: 600px;">
      <input type="text" placeholder="Rechercher des produits..." 
        style="width: 100%; padding: 20px; font-size: 24px; border: none; border-radius: 10px; outline: none;"
        class="search-input">
      <div class="search-results" style="margin-top: 20px; max-height: 400px; overflow-y: auto;"></div>
      <button class="close-search" style="position: absolute; top: 30px; right: 30px; background: none; border: none; color: white; font-size: 40px; cursor: pointer;">×</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  setTimeout(() => modal.style.opacity = '1', 10);
  
  const input = modal.querySelector('.search-input');
  const results = modal.querySelector('.search-results');
  
  input.focus();
  
  input.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length < 2) {
      results.innerHTML = '';
      return;
    }
    
    // Simuler une recherche
    const products = Array.from(document.querySelectorAll('.product-item h3')).map(el => ({
      name: el.textContent.trim(),
      price: el.closest('.product-item').querySelector('.product-price').textContent
    }));
    
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    
    results.innerHTML = filtered.map(p => `
      <div style="background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; cursor: pointer; transition: transform 0.2s;"
        onmouseenter="this.style.transform='scale(1.02)'"
        onmouseleave="this.style.transform='scale(1)'">
        <strong>${p.name}</strong> - ${p.price}
      </div>
    `).join('') || '<div style="color: white; text-align: center; padding: 20px;">Aucun résultat</div>';
  });
  
  modal.querySelector('.close-search').addEventListener('click', () => {
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 300);
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.opacity = '0';
      setTimeout(() => modal.remove(), 300);
    }
  });
}

// ============================================
// 11. MENU MOBILE
// ============================================
function initMobileMenu() {
  const nav = document.querySelector('nav');
  const navContainer = document.querySelector('.nav-container');
  
  if (window.innerWidth <= 768) {
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '☰';
    hamburger.style.cssText = `
      display: block;
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #111;
    `;
    
    navContainer.insertBefore(hamburger, nav);
    
    nav.style.cssText = `
      position: fixed;
      top: 0;
      right: -100%;
      height: 100vh;
      background: white;
      width: 70%;
      transition: right 0.3s ease;
      z-index: 1000;
      padding: 80px 30px;
    `;
    
    const navLinks = nav.querySelector('.nav-links');
    navLinks.style.flexDirection = 'column';
    navLinks.style.gap = '25px';
    
    hamburger.addEventListener('click', () => {
      appState.isMenuOpen = !appState.isMenuOpen;
      nav.style.right = appState.isMenuOpen ? '0' : '-100%';
      hamburger.innerHTML = appState.isMenuOpen ? '×' : '☰';
    });
  }
}

// ============================================
// 12. LAZY LOADING DES IMAGES
// ============================================
function initLazyLoading() {
  const images = document.querySelectorAll('img');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
          img.style.opacity = '1';
        }, 100);
        
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// ============================================
// 13. INTERACTIONS PRODUITS AVANCÉES
// ============================================
function initProductInteractions() {
  const products = document.querySelectorAll('.product-item');
  
  products.forEach(product => {
    // Effet de survol amélioré
    product.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(10px)';
      this.style.boxShadow = '0 5px 25px rgba(0,120,255,0.2)';
    });
    
    product.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(0)';
      this.style.boxShadow = 'none';
    });
  });
  
  // Animation des prix
  const prices = document.querySelectorAll('.product-price');
  prices.forEach(price => {
    price.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.color = '#ff4444';
    });
    
    price.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.color = '#0078ff';
    });
  });
}

// ============================================
// 14. COMPTEURS ANIMÉS
// ============================================
function initCounters() {
  const stats = [
    { label: 'Produits', target: 500 },
    { label: 'Clients satisfaits', target: 1000 },
    { label: 'Commandes', target: 5000 }
  ];
  
  // Ajouter les stats si nécessaire (optionnel)
}

// ============================================
// 15. TOOLTIPS
// ============================================
function initTooltips() {
  const buttons = document.querySelectorAll('.btn, .btn-outline');
  
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', function(e) {
      const tooltip = document.createElement('div');
      tooltip.className = 'custom-tooltip';
      tooltip.textContent = this.textContent;
      tooltip.style.cssText = `
        position: absolute;
        background: #111;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        pointer-events: none;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s;
      `;
      
      document.body.appendChild(tooltip);
      
      const rect = this.getBoundingClientRect();
      tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
      tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
      
      setTimeout(() => tooltip.style.opacity = '1', 10);
      
      this.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        setTimeout(() => tooltip.remove(), 300);
      }, { once: true });
    });
  });
}

// ============================================
// 16. SYSTÈME DE NOTIFICATIONS
// ============================================
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const colors = {
    success: '#4CAF50',
    error: '#ff4444',
    info: '#2196F3',
    warning: '#ff9800'
  };
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type]};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 10001;
    font-weight: 500;
    transform: translateX(400px);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.style.transform = 'translateX(0)', 10);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ============================================
// 17. CONFETTI EFFECT
// ============================================
function createConfetti() {
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'][Math.floor(Math.random() * 5)]};
      top: -10px;
      left: ${Math.random() * 100}%;
      opacity: 1;
      animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
      z-index: 10002;
      border-radius: 50%;
    `;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 5000);
  }
}

// ============================================
// 18. STOCKAGE LOCAL
// ============================================
function saveToStorage(key, data) {
  try {
    const storageData = JSON.stringify(data);
    // Utiliser une variable en mémoire au lieu de localStorage
    if (key === 'cart') {
      appState.cart = data;
    } else if (key === 'wishlist') {
      appState.wishlist = data;
    }
  } catch (error) {
    console.error('Erreur de sauvegarde:', error);
  }
}

function loadStoredData() {
  // Charger depuis l'état en mémoire
  appState.cart = appState.cart || [];
  appState.wishlist = appState.wishlist || [];
}

// ============================================
// 19. QUICK VIEW DÉTAILLÉ
// ============================================
function addProductQuickView() {
  const products = document.querySelectorAll('.product-item');
  
  products.forEach(product => {
    product.style.cursor = 'pointer';
    product.style.transition = 'all 0.3s ease';
  });
}

// ============================================
// 20. ANIMATIONS CSS DYNAMIQUES
// ============================================
function addDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes cartBounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.3); }
    }
    
    @keyframes bounceIn {
      0% { transform: scale(0); opacity: 0; }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes confettiFall {
      to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes fadeInUp {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }
    
    .product-actions button:active {
      transform: scale(0.95);
    }
    
    header {
      transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
    }
    
    .service-item:hover .logoservice {
      animation: pulse 1s infinite;
    }
    
    .blog-card {
      position: relative;
      overflow: hidden;
    }
    
    .blog-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.5s;
    }
    
    .blog-card:hover::before {
      left: 100%;
    }
    
    .insta-item {
      position: relative;
      overflow: hidden;
    }
    
    .insta-item::after {
      content: '👁️';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      font-size: 40px;
      background: rgba(0,120,255,0.9);
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }
    
    .insta-item:hover::after {
      transform: translate(-50%, -50%) scale(1);
    }
    
    .sale-banner {
      position: relative;
      overflow: hidden;
    }
    
    .sale-banner::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(0,120,255,0.1) 0%, transparent 70%);
      animation: rotate 20s linear infinite;
    }
    
    @keyframes rotate {
      to { transform: rotate(360deg); }
    }
    
    .footer-socials a {
      transition: transform 0.3s ease;
    }
    
    .footer-socials a:hover {
      transform: translateY(-5px) scale(1.1);
    }
    
    .subscribe-input:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0,120,255,0.2);
    }
    
    .product-item {
      position: relative;
    }
    
    .product-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 3px;
      background: linear-gradient(to bottom, #0078ff, #00d4ff);
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }
    
    .product-item:hover::before {
      transform: scaleY(1);
    }
    
    .nav-links a {
      position: relative;
      overflow: hidden;
    }
    
    .btn, .btn-outline {
      position: relative;
      overflow: hidden;
    }
    
    .btn::before, .btn-outline::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }
    
    .btn:hover::before, .btn-outline:hover::before {
      width: 300px;
      height: 300px;
    }
    
    .scroll-to-top {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #0078ff;
      color: white;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(0,120,255,0.4);
      transition: all 0.3s ease;
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
    }
    
    .scroll-to-top.visible {
      opacity: 1;
      pointer-events: all;
    }
    
    .scroll-to-top:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 20px rgba(0,120,255,0.6);
    }
    
    @media (max-width: 768px) {
      .service-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .blog-grid {
        grid-template-columns: 1fr;
      }
      
      .footer-grid {
        grid-template-columns: 1fr;
      }
      
      .products-list {
        gap: 10px;
      }
      
      .hero {
        flex-direction: column;
        text-align: center;
        padding: 40px 5%;
      }
      
      .hero-text h2 {
        font-size: 32px;
      }
      
      .sale-banner {
        flex-direction: column;
        padding: 40px 5%;
      }
    }
  `;
  
  document.head.appendChild(style);
}

// ============================================
// 21. BOUTON SCROLL TO TOP
// ============================================
function initScrollToTop() {
  const button = document.createElement('button');
  button.className = 'scroll-to-top';
  button.innerHTML = '↑';
  button.setAttribute('aria-label', 'Retour en haut');
  document.body.appendChild(button);
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      button.classList.add('visible');
    } else {
      button.classList.remove('visible');
    }
  });
  
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ============================================
// 22. EFFET DE TYPING POUR LES TITRES
// ============================================
function initTypingEffect() {
  const titles = document.querySelectorAll('.hero-text h2');
  
  titles.forEach((title, index) => {
    const text = title.textContent;
    title.textContent = '';
    title.style.opacity = '1';
    
    let charIndex = 0;
    
    setTimeout(() => {
      const typingInterval = setInterval(() => {
        if (charIndex < text.length) {
          title.textContent += text[charIndex];
          charIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 50);
    }, index * 1000);
  });
}

// ============================================
// 23. FILTRES DE PRODUITS INTERACTIFS
// ============================================
function initProductFilters() {
  const productSections = document.querySelectorAll('.products');
  
  productSections.forEach(section => {
    const header = section.querySelector('.products-header');
    if (!header) return;
    
    const filterContainer = document.createElement('div');
    filterContainer.style.cssText = `
      display: flex;
      gap: 10px;
      margin-top: 20px;
      flex-wrap: wrap;
    `;
    
    const filters = ['Tous', 'Prix croissant', 'Prix décroissant', 'Populaires'];
    
    filters.forEach(filter => {
      const btn = document.createElement('button');
      btn.textContent = filter;
      btn.style.cssText = `
        padding: 8px 16px;
        border: 2px solid #ddd;
        background: white;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 13px;
        font-weight: 500;
      `;
      
      btn.addEventListener('mouseenter', () => {
        btn.style.background = '#0078ff';
        btn.style.color = 'white';
        btn.style.borderColor = '#0078ff';
        btn.style.transform = 'translateY(-2px)';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'white';
        btn.style.color = '#111';
        btn.style.borderColor = '#ddd';
        btn.style.transform = 'translateY(0)';
      });
      
      btn.addEventListener('click', () => {
        showNotification(`Filtre "${filter}" appliqué`, 'info');
        filterProducts(section, filter);
      });
      
      filterContainer.appendChild(btn);
    });
    
    header.appendChild(filterContainer);
  });
}

function filterProducts(section, filter) {
  const products = Array.from(section.querySelectorAll('.product-item'));
  
  // Animation de sortie
  products.forEach((product, index) => {
    setTimeout(() => {
      product.style.opacity = '0';
      product.style.transform = 'translateX(-30px)';
    }, index * 50);
  });
  
  setTimeout(() => {
    // Tri selon le filtre
    if (filter === 'Prix croissant') {
      products.sort((a, b) => {
        const priceA = parseInt(a.querySelector('.product-price').textContent.replace(/\D/g, ''));
        const priceB = parseInt(b.querySelector('.product-price').textContent.replace(/\D/g, ''));
        return priceA - priceB;
      });
    } else if (filter === 'Prix décroissant') {
      products.sort((a, b) => {
        const priceA = parseInt(a.querySelector('.product-price').textContent.replace(/\D/g, ''));
        const priceB = parseInt(b.querySelector('.product-price').textContent.replace(/\D/g, ''));
        return priceB - priceA;
      });
    }
    
    const list = section.querySelector('.products-list');
    products.forEach(product => list.appendChild(product));
    
    // Animation d'entrée
    products.forEach((product, index) => {
      setTimeout(() => {
        product.style.opacity = '1';
        product.style.transform = 'translateX(0)';
      }, index * 50);
    });
  }, products.length * 50 + 200);
}

// ============================================
// 24. COMPARATEUR DE PRODUITS
// ============================================
let compareList = [];

function initProductCompare() {
  const products = document.querySelectorAll('.product-item');
  
  products.forEach(product => {
    const compareBtn = document.createElement('button');
    compareBtn.innerHTML = '⚖️';
    compareBtn.title = 'Comparer';
    compareBtn.style.cssText = `
      background: #fff;
      border: 2px solid #ffa500;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      font-size: 18px;
      transition: all 0.3s ease;
      margin-left: 10px;
    `;
    
    compareBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const productData = {
        name: product.querySelector('h3').textContent.trim(),
        price: product.querySelector('.product-price').textContent,
        img: product.querySelector('.phone')?.src || ''
      };
      
      if (compareList.find(p => p.name === productData.name)) {
        compareList = compareList.filter(p => p.name !== productData.name);
        compareBtn.style.background = '#fff';
        showNotification('Retiré de la comparaison', 'info');
      } else {
        if (compareList.length >= 3) {
          showNotification('Maximum 3 produits à comparer', 'warning');
          return;
        }
        compareList.push(productData);
        compareBtn.style.background = '#ffa500';
        showNotification('Ajouté à la comparaison', 'success');
      }
      
      updateCompareButton();
    });
    
    const actions = product.querySelector('.product-actions');
    if (actions) {
      actions.appendChild(compareBtn);
    }
  });
  
  createCompareButton();
}

function createCompareButton() {
  const compareButton = document.createElement('button');
  compareButton.className = 'compare-floating-btn';
  compareButton.innerHTML = '⚖️ <span class="compare-count">0</span>';
  compareButton.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 30px;
    background: #ffa500;
    color: white;
    border: none;
    padding: 15px 25px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(255,165,0,0.4);
    z-index: 1000;
    display: none;
    transition: all 0.3s ease;
  `;
  
  compareButton.addEventListener('click', showCompareModal);
  document.body.appendChild(compareButton);
}

function updateCompareButton() {
  const btn = document.querySelector('.compare-floating-btn');
  const count = btn.querySelector('.compare-count');
  
  count.textContent = compareList.length;
  btn.style.display = compareList.length > 0 ? 'block' : 'none';
  
  if (compareList.length > 0) {
    btn.style.animation = 'pulse 1s infinite';
  }
}

function showCompareModal() {
  if (compareList.length < 2) {
    showNotification('Sélectionnez au moins 2 produits', 'warning');
    return;
  }
  
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    padding: 40px;
    border-radius: 20px;
    max-width: 1000px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  `;
  
  content.innerHTML = `
    <h2 style="margin-bottom: 30px; font-size: 28px;">Comparaison de produits</h2>
    <div style="display: grid; grid-template-columns: repeat(${compareList.length}, 1fr); gap: 20px;">
      ${compareList.map(product => `
        <div style="text-align: center; padding: 20px; border: 2px solid #eee; border-radius: 15px;">
          <img src="${product.img}" style="width: 150px; height: 150px; object-fit: contain; margin-bottom: 15px;" alt="${product.name}">
          <h3 style="font-size: 18px; margin-bottom: 10px;">${product.name}</h3>
          <p style="font-size: 24px; color: #0078ff; font-weight: bold;">${product.price}</p>
          <button onclick="this.closest('.product-compare-item').remove()" style="margin-top: 15px; padding: 8px 16px; background: #ff4444; color: white; border: none; border-radius: 8px; cursor: pointer;">
            Retirer
          </button>
        </div>
      `).join('')}
    </div>
    <button class="close-compare" style="margin-top: 30px; padding: 12px 30px; background: #111; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%;">
      Fermer
    </button>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  content.querySelector('.close-compare').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// ============================================
// 25. MODE SOMBRE / CLAIR
// ============================================
function initThemeToggle() {
  const toggle = document.createElement('button');
  toggle.innerHTML = '🌙';
  toggle.title = 'Changer de thème';
  toggle.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #111;
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 24px;
    z-index: 9999;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
  `;
  
  let isDark = false;
  
  toggle.addEventListener('click', () => {
    isDark = !isDark;
    toggle.innerHTML = isDark ? '☀️' : '🌙';
    
    if (isDark) {
      document.body.style.background = '#1a1a1a';
      document.body.style.color = '#fff';
      document.querySelectorAll('header, .services, .products, .footer').forEach(el => {
        el.style.background = '#2a2a2a';
        el.style.color = '#fff';
      });
      toggle.style.background = '#fff';
      toggle.style.color = '#111';
    } else {
      document.body.style.background = '#fff';
      document.body.style.color = '#111';
      document.querySelectorAll('header, .services, .products, .footer').forEach(el => {
        el.style.background = '#fff';
        el.style.color = '#111';
      });
      toggle.style.background = '#111';
      toggle.style.color = '#fff';
    }
    
    showNotification(`Mode ${isDark ? 'sombre' : 'clair'} activé`, 'info');
  });
  
  document.body.appendChild(toggle);
}

// ============================================
// 26. INITIALISATION FINALE
// ============================================
// Ajouter les styles dynamiques
addDynamicStyles();

// Initialiser le scroll to top
initScrollToTop();

// Initialiser les filtres
initProductFilters();

// Initialiser le comparateur
initProductCompare();

// Initialiser le theme toggle
initThemeToggle();

// Message de bienvenue
setTimeout(() => {
  showNotification('Bienvenue sur JjStore! 🎉', 'success');
}, 1000);

// ============================================
// 27. PERFORMANCE MONITORING
// ============================================
console.log('%c🚀 JjStore JavaScript chargé avec succès!', 'color: #0078ff; font-size: 20px; font-weight: bold;');
console.log('%c✨ Toutes les fonctionnalités dynamiques sont actives', 'color: #4CAF50; font-size: 14px;');

// ============================================
// FIN DU SCRIPT
// ============================================