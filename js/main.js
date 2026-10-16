/**
 * INVERSIONES AVELAR - CONTROLADOR JAVASCRIPT FRONT-END
 * Cumplimiento de requerimientos F-05, navegación móvil, filtros, lightbox y validación.
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Menú Móvil Accesible (Cierre con clic, tecla Escape y clic externo)
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      navMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', !isExpanded);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 2. Año Automático en Pie de Página
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. Respaldo para Imágenes Faltantes (Fallback sin romper el diseño)
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', function() {
      const altText = this.getAttribute('alt') || 'Imagen Ferretería';
      const srcName = this.getAttribute('src').split('/').pop();
      const parent = this.parentElement;

      const fallbackBox = document.createElement('div');
      fallbackBox.className = 'img-fallback';
      fallbackBox.innerHTML = `
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z"/>
        </svg>
        <p><strong>${altText}</strong></p>
        <small style="font-size:0.7rem; color:#aaa;">(${srcName})</small>
      `;
      this.style.display = 'none';
      parent.appendChild(fallbackBox);
    });
  });

  // 4. Filtrado y Búsqueda en Catálogo de Productos (productos.html)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  const searchInput = document.getElementById('searchProducts');

  function filtrarCatalogo() {
    const activeBtn = document.querySelector('.filter-btn.active');
    const filterValue = activeBtn ? activeBtn.getAttribute('data-filter') : 'todos';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    productCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.product-desc')?.textContent.toLowerCase() || '';

      const matchCategory = (filterValue === 'todos' || category === filterValue);
      const matchSearch = (title.includes(query) || desc.includes(query));

      if (matchCategory && matchSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filtrarCatalogo();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filtrarCatalogo);
  }

  // 5. Lightbox para Galería (nosotros.html)
  const galleryThumbs = document.querySelectorAll('.gallery-thumb img');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;

  if (galleryThumbs.length > 0 && lightboxOverlay) {
    const imagesSrcList = Array.from(galleryThumbs).map(img => img.src);

    function showLightbox(index) {
      currentGalleryIndex = index;
      lightboxImg.src = imagesSrcList[currentGalleryIndex];
      lightboxOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightboxOverlay.style.display = 'none';
      document.body.style.overflow = 'auto';
    }

    galleryThumbs.forEach((img, index) => {
      img.parentElement.addEventListener('click', () => showLightbox(index));
    });

    lightboxClose?.addEventListener('click', closeLightbox);

    lightboxPrev?.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex - 1 + imagesSrcList.length) % imagesSrcList.length;
      lightboxImg.src = imagesSrcList[currentGalleryIndex];
    });

    lightboxNext?.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex + 1) % imagesSrcList.length;
      lightboxImg.src = imagesSrcList[currentGalleryIndex];
    });

    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (lightboxOverlay.style.display === 'flex') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
      }
    });
  }

  // 6. Validación y Envío de Formulario con Fetch (contacto.html)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      let isValid = true;
      const nombre = document.getElementById('nombre');
      const email = document.getElementById('email');
      const mensaje = document.getElementById('mensaje');
      const alertBox = document.getElementById('formAlert');
      const submitBtn = document.getElementById('submitBtn');

      function checkField(el, errorId, condition) {
        const errorEl = document.getElementById(errorId);
        if (!condition) {
          errorEl.style.display = 'block';
          isValid = false;
        } else {
          errorEl.style.display = 'none';
        }
      }

      checkField(nombre, 'errNombre', nombre.value.trim().length >= 3);
      checkField(email, 'errEmail', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
      checkField(mensaje, 'errMensaje', mensaje.value.trim().length >= 10);

      if (!isValid) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando consulta...';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          alertBox.className = 'form-alert success';
          alertBox.style.display = 'block';
          alertBox.textContent = '¡Gracias por contactarnos! Tu mensaje ha sido recibido con éxito en Inversiones Avelar.';
          contactForm.reset();
        } else {
          throw new Error('Error al enviar formulario');
        }
      } catch (err) {
        alertBox.className = 'form-alert error';
        alertBox.style.display = 'block';
        alertBox.innerHTML = `No se pudo enviar el correo en este momento. Por favor, escríbenos directamente a nuestro WhatsApp: <a href="https://wa.me/50433443305" target="_blank" style="color:var(--color-primary); font-weight:bold;">Clic aquí (+504 3344-3305)</a>`;
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Mensaje';
      }
    });
  }
});