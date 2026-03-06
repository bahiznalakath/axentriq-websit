// Scroll Animation logic
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  // Setup fade up animations
  const fadeUpElements = document.querySelectorAll('.fade-up');
  fadeUpElements.forEach(el => observer.observe(el));

  // Header scroll appearance
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Mobile navigation simplistic toggle (expand functionality as required)
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'rgba(255, 255, 255, 0.98)';
        navLinks.style.padding = '2rem 5%';
        navLinks.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
      }
    });

    // Close mobile menu when a link is clicked
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.style.display = 'none';
        }
      });
    });
  }

  // Scrollspy logic for navigation
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  if (sections.length > 0 && navItems.length > 0) {
    const scrollSpyOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, scrollSpyOptions);

    sections.forEach(section => {
      scrollSpyObserver.observe(section);
    });
  }

  // Hero Carousel Logic
  const carouselContainer = document.querySelector('.hero-carousel-section');
  if (carouselContainer) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-indicators .dot');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');

    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval;
    const intervalTime = 10000; // 10 seconds

    const updateSlider = (index) => {
      // Remove active from all
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      // Add active to current
      slides[index].classList.add('active');
      dots[index].classList.add('active');

      // Reset animations
      const contents = slides[index].querySelectorAll('.fade-up');
      contents.forEach(el => {
        el.classList.remove('visible');
        // Small timeout to re-trigger CSS transition
        setTimeout(() => el.classList.add('visible'), 50);
      });
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlider(currentSlide);
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateSlider(currentSlide);
    };

    // Auto Scroll
    const startAutoScroll = () => {
      slideInterval = setInterval(nextSlide, intervalTime);
    };

    const stopAutoScroll = () => {
      clearInterval(slideInterval);
    };

    // Event Listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoScroll();
        startAutoScroll(); // restart timer
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoScroll();
        startAutoScroll(); // restart timer
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider(currentSlide);
        stopAutoScroll();
        startAutoScroll();
      });
    });

    // Pause on Hover
    carouselContainer.addEventListener('mouseenter', stopAutoScroll);
    carouselContainer.addEventListener('mouseleave', startAutoScroll);

    // Initial Trigger
    updateSlider(0);
    startAutoScroll();

    // Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carouselContainer.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoScroll();
    }, { passive: true });

    carouselContainer.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoScroll();
    }, { passive: true });

    const handleSwipe = () => {
      const threshold = 50;
      if (touchEndX < touchStartX - threshold) {
        nextSlide(); // Swipe left -> next
      }
      if (touchEndX > touchStartX + threshold) {
        prevSlide(); // Swipe right -> prev
      }
    };
  }
});
