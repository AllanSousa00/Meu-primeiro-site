// Configurações globais
const CONFIG = {
  DISCORD_WIDGET_ID: '123456789012345678',
  WHITELIST_URL: 'https://seulinkparawhitelist.com',
  DISCORD_INVITE: 'https://discord.gg/seu-servidor',
  API_BASE_URL: 'https://api.hydracityrp.com'
};

// Utilitários
const Utils = {
  // Debounce para otimizar performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Lazy loading otimizado
  initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback para navegadores antigos
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
    }
  },

  // Animações de entrada
  initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
  },

  // Smooth scroll para links internos
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  },

  // Notificações toast
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span>${message}</span>
        <button class="toast-close">&times;</button>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.hideToast(toast));
    
    setTimeout(() => this.hideToast(toast), 5000);
  },

  hideToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  },

  // Loading state
  showLoading(element) {
    element.classList.add('loading');
    element.style.pointerEvents = 'none';
  },

  hideLoading(element) {
    element.classList.remove('loading');
    element.style.pointerEvents = 'auto';
  }
};

// Componentes
const Components = {
  // Carrossel melhorado
  initCarousel() {
    const carousel = document.querySelector('#carouselExampleIndicators');
    if (!carousel) return;

    // Adicionar thumbnails
    const indicators = carousel.querySelector('.carousel-indicators');
    const items = carousel.querySelectorAll('.carousel-item');
    
    if (indicators && items.length > 0) {
      indicators.innerHTML = '';
      items.forEach((item, index) => {
        const img = item.querySelector('img');
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.setAttribute('data-bs-target', '#carouselExampleIndicators');
        indicator.setAttribute('data-bs-slide-to', index);
        indicator.className = index === 0 ? 'active' : '';
        indicator.style.backgroundImage = `url(${img.dataset.src || img.src})`;
        indicator.style.backgroundSize = 'cover';
        indicator.style.width = '60px';
        indicator.style.height = '40px';
        indicators.appendChild(indicator);
      });
    }

    // Auto-pause no hover
    carousel.addEventListener('mouseenter', () => {
      const bsCarousel = bootstrap.Carousel.getInstance(carousel);
      if (bsCarousel) bsCarousel.pause();
    });

    carousel.addEventListener('mouseleave', () => {
      const bsCarousel = bootstrap.Carousel.getInstance(carousel);
      if (bsCarousel) bsCarousel.cycle();
    });
  },

  // Discord widget melhorado
  initDiscordWidget() {
    const discordContainer = document.querySelector('#discord-widget');
    if (!discordContainer) return;

    const iframe = discordContainer.querySelector('iframe');
    if (iframe) {
      iframe.addEventListener('load', () => {
        discordContainer.classList.add('loaded');
      });

      iframe.addEventListener('error', () => {
        discordContainer.innerHTML = `
          <div class="discord-error">
            <p>Erro ao carregar o widget do Discord</p>
            <a href="${CONFIG.DISCORD_INVITE}" class="btn btn-primary" target="_blank">
              Entrar no Discord
            </a>
          </div>
        `;
      });
    }
  },

  // Contador de jogadores online (simulado)
  initPlayerCounter() {
    const counter = document.querySelector('#player-count');
    if (!counter) return;

    const updateCount = () => {
      // Simular contagem de jogadores (em produção, seria uma API real)
      const count = Math.floor(Math.random() * 50) + 150;
      counter.textContent = count;
      counter.classList.add('pulse');
      setTimeout(() => counter.classList.remove('pulse'), 500);
    };

    updateCount();
    setInterval(updateCount, 30000); // Atualizar a cada 30 segundos
  },

  // Sistema de favoritos
  initFavorites() {
    const favoriteButtons = document.querySelectorAll('[data-favorite]');
    
    favoriteButtons.forEach(btn => {
      const itemId = btn.dataset.favorite;
      const isFavorited = localStorage.getItem(`favorite_${itemId}`) === 'true';
      
      if (isFavorited) {
        btn.classList.add('favorited');
      }

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isCurrentlyFavorited = btn.classList.contains('favorited');
        
        if (isCurrentlyFavorited) {
          btn.classList.remove('favorited');
          localStorage.removeItem(`favorite_${itemId}`);
          Utils.showToast('Removido dos favoritos', 'info');
        } else {
          btn.classList.add('favorited');
          localStorage.setItem(`favorite_${itemId}`, 'true');
          Utils.showToast('Adicionado aos favoritos', 'success');
        }
      });
    });
  }
};

// Performance e SEO
const Performance = {
  // Preload de recursos críticos
  preloadCriticalResources() {
    const criticalImages = [
      '/img/logo.png',
      '/img/poli.jpg',
      '/img/gangues.webp'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  },

  // Otimização de imagens
  optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Adicionar loading lazy se não especificado
      if (!img.hasAttribute('loading')) {
        img.loading = 'lazy';
      }

      // Adicionar dimensões se não especificadas
      if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
        img.addEventListener('load', function() {
          this.setAttribute('width', this.naturalWidth);
          this.setAttribute('height', this.naturalHeight);
        });
      }
    });
  },

  // Service Worker para cache
  initServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registrado:', registration);
        })
        .catch(error => {
          console.log('Erro no SW:', error);
        });
    }
  }
};

// Analytics e Tracking
const Analytics = {
  // Tracking de eventos
  trackEvent(category, action, label = '') {
    // Integração com Google Analytics ou similar
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label
      });
    }
  },

  // Tracking de cliques em botões importantes
  initEventTracking() {
    // Whitelist button
    document.querySelectorAll('[href*="whitelist"]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.trackEvent('Navigation', 'whitelist_click');
      });
    });

    // Discord button
    document.querySelectorAll('[href*="discord"]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.trackEvent('Navigation', 'discord_click');
      });
    });

    // VIP purchases
    document.querySelectorAll('[href*="pagamento"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const vipType = btn.href.includes('bronze') ? 'bronze' : 
                       btn.href.includes('prata') ? 'prata' : 'ouro';
        this.trackEvent('Purchase', 'vip_click', vipType);
      });
    });
  }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Utilitários básicos
  Utils.initLazyLoading();
  Utils.initScrollAnimations();
  Utils.initSmoothScroll();

  // Componentes
  Components.initCarousel();
  Components.initDiscordWidget();
  Components.initPlayerCounter();
  Components.initFavorites();

  // Performance
  Performance.preloadCriticalResources();
  Performance.optimizeImages();
  Performance.initServiceWorker();

  // Analytics
  Analytics.initEventTracking();

  // Inicializar AOS se disponível
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }

  // Remover loading inicial
  document.body.classList.add('loaded');
});

// Exportar para uso global
window.HydraCityRP = {
  Utils,
  Components,
  Performance,
  Analytics,
  CONFIG
};
