const STORAGE_KEY = 'usadosdequalidade-theme';
const ACTIVE_CATEGORY_KEY = 'usadosdequalidade-active-category';
const DEFAULT_DARK = 'dark';
const WHATSAPP_NUMBER = '5511982633161';
const SITE_NAME = 'UsadosDeQualidade';
const PICKUP_LOCATION = 'Estação Metrô São Judas';
const FIXED_PAYMENT = 'PIX, Transferência, Dinheiro';

const CATEGORIES = {
  todos: { label: 'Todos os produtos', icon: '✨' },
  casa: { label: 'Casa', icon: '🏠' },
  tecnologia: { label: 'Tecnologia', icon: '💻' },
  estilo: { label: 'Estilo & bem-estar', icon: '🏋️' },
  decoracao: { label: 'Decoração', icon: '🎨' }
};

let catalogProducts = [];

const icons = {
  site: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 100 20 10 10 0 000-20Zm6.92 9h-3.01a15.92 15.92 0 00-1.38-5.02A8.03 8.03 0 0118.92 11ZM12 4.04c.83 1.2 1.86 3.6 2.15 6.96H9.85C10.14 7.64 11.17 5.24 12 4.04ZM8.47 5.98A15.92 15.92 0 007.09 11H4.08a8.03 8.03 0 014.39-5.02ZM4.08 13h3.01c.17 1.82.63 3.55 1.38 5.02A8.03 8.03 0 014.08 13ZM12 19.96c-.83-1.2-1.86-3.6-2.15-6.96h4.3c-.29 3.36-1.32 5.76-2.15 6.96ZM15.53 18.02c.75-1.47 1.21-3.2 1.38-5.02h3.01a8.03 8.03 0 01-4.39 5.02ZM16.91 11H7.09c.18-2.07.74-3.93 1.55-5.35C9.46 4.27 10.61 3.5 12 3.5c1.39 0 2.54.77 3.36 2.15.81 1.42 1.37 3.28 1.55 5.35Z"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 103 4.97 1.97 1.97 0 005.25 3ZM20.44 12.72c0-3.42-1.82-5.01-4.25-5.01a3.69 3.69 0 00-3.23 1.77h-.05V8.5H9.64V20h3.38v-6.2c0-1.63.31-3.2 2.33-3.2s2 1.9 2 3.3V20h3.38v-6.78Z"/></svg>',
  github:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5A12 12 0 000 12.67a12.17 12.17 0 008.2 11.56c.6.12.82-.27.82-.59v-2.08c-3.34.75-4.04-1.66-4.04-1.66-.55-1.42-1.33-1.8-1.33-1.8-1.09-.76.08-.75.08-.75 1.2.09 1.84 1.27 1.84 1.27 1.08 1.89 2.83 1.35 3.52 1.03.11-.8.42-1.35.76-1.66-2.66-.31-5.46-1.36-5.46-6.06 0-1.34.46-2.43 1.23-3.28-.12-.31-.54-1.56.12-3.25 0 0 1-.33 3.3 1.26a11.16 11.16 0 016 0c2.3-1.59 3.3-1.26 3.3-1.26.66 1.69.24 2.94.12 3.25.77.85 1.23 1.94 1.23 3.28 0 4.71-2.8 5.75-5.47 6.06.43.38.82 1.13.82 2.27v3.36c0 .32.22.71.83.59A12.17 12.17 0 0024 12.67 12 12 0 0012 .5Z"/></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 2h9A5.5 5.5 0 0122 7.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2Zm0 1.8A3.7 3.7 0 003.8 7.5v9a3.7 3.7 0 003.7 3.7h9a3.7 3.7 0 003.7-3.7v-9a3.7 3.7 0 00-3.7-3.7h-9Zm10.65 1.35a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4ZM12 7a5 5 0 110 10 5 5 0 010-10Zm0 1.8a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4Z"/></svg>',
  whatsapp:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.89 11.89 0 0012.08 0 11.93 11.93 0 001.89 17.94L0 24l6.25-1.84a11.96 11.96 0 005.83 1.5h.01A11.92 11.92 0 0024 11.7a11.9 11.9 0 00-3.48-8.22ZM12.09 21.9h-.01a10 10 0 01-5.1-1.41l-.37-.22-3.7 1.09 1.09-3.6-.24-.37a10.03 10.03 0 0116.58-12.5 10.03 10.03 0 01-7.34 17.01Zm5.73-7.5c-.31-.16-1.83-.9-2.11-1-.28-.1-.49-.16-.7.16-.21.31-.8 1-.98 1.2-.18.21-.36.23-.67.08-.31-.16-1.31-.48-2.49-1.52-.92-.82-1.54-1.83-1.72-2.14-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.54-.08-.16-.7-1.67-.96-2.29-.25-.6-.5-.52-.7-.53h-.6c-.21 0-.54.08-.83.39-.28.31-1.09 1.06-1.09 2.58 0 1.52 1.12 3 1.28 3.2.16.21 2.2 3.36 5.33 4.7.74.32 1.31.51 1.76.65.74.23 1.41.2 1.94.12.59-.09 1.83-.74 2.09-1.45.26-.71.26-1.32.18-1.45-.08-.13-.28-.2-.59-.36Z"/></svg>',
};

function getCatalogPath() {
  if (document.body?.dataset?.page === 'product') {
    return '../../catalog.json';
  }
  return './catalog.json';
}

function resolvePath(path) {
  return new URL(path, window.location.href).toString();
}

function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function currentPageMessage(product) {
  const link = window.location.href;
  if (product) {
    return `Olá! Tenho interesse no produto "${product.title}" da ${SITE_NAME}. Link: ${link}`;
  }
  return `Olá! Quero fechar negócio com a ${SITE_NAME}. Pode me enviar mais detalhes do catálogo? Link: ${link}`;
}

function shareProduct(product) {
  const link = window.location.href;
  const shareText = `🎁 *${SITE_NAME}* - ${product.title}\n\n*Preço:* ${product.price}\n*Retirada:* ${PICKUP_LOCATION}\n\n${product.shortDescription}\n\nLink: ${link}`;
  
  if (navigator.share) {
    navigator.share({
      title: product.title,
      text: shareText,
      url: link,
    }).catch(err => console.log('Compartilhamento cancelado:', err));
  } else {
    const whatsappUrl = buildWhatsAppUrl(shareText);
    window.open(whatsappUrl, '_blank');
  }
}

function shareHome() {
  const link = window.location.href;
  const shareText = `✨ *${SITE_NAME}*\n\n${SITE_NAME}: A forma inteligente de conquistar mais pagando menos.\n\nProdutos revisados, qualidade validada e preços justos!\n\nLink: ${link}`;
  
  if (navigator.share) {
    navigator.share({
      title: SITE_NAME,
      text: shareText,
      url: link,
    }).catch(err => console.log('Compartilhamento cancelado:', err));
  } else {
    const whatsappUrl = buildWhatsAppUrl(shareText);
    window.open(whatsappUrl, '_blank');
  }
}

// ─── TEMA: ponto único de verdade ────────────────────────────────────────────
// Fonte: localStorage['usadosdequalidade-theme'] → 'dark' | 'light'
// Regra:  só muda ao clicar no botão. Navegar entre páginas nunca altera o tema.

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);          // garante que está salvo
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;
  const isDark = theme === DEFAULT_DARK;
  toggle.setAttribute('aria-pressed', String(!isDark));
  toggle.querySelector('.theme-toggle__icon').textContent  = isDark ? '☀' : '☾';
  toggle.querySelector('.theme-toggle__label').textContent = isDark ? 'Tema claro' : 'Tema escuro';
}

function initializeTheme() {
  // Lê o que o script inline já aplicou no <html> — sem re-calcular, sem flash
  const current = document.documentElement.dataset.theme || DEFAULT_DARK;
  // Se por algum motivo o atributo estiver vazio, salva no storage agora
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, current);
  }
  // Sincroniza apenas o estado visual do botão (ícone/label/aria)
  applyTheme(localStorage.getItem(STORAGE_KEY));

  // Clique no botão: único ponto que muda o tema
  document.querySelector('.theme-toggle')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === DEFAULT_DARK ? 'light' : DEFAULT_DARK;
    applyTheme(next);
  });
}
// ─────────────────────────────────────────────────────────────────────────────

async function loadCatalog() {
  const response = await fetch(getCatalogPath(), { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Não foi possível carregar o catálogo.');
  }
  return response.json();
}

function formatProductUrl(product) {
  return resolvePath(`./products/${product.slug}/index.html`);
}

function renderFooter(product) {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;

  const whatsappMessage = currentPageMessage(product);
  const homePrefix = document.body?.dataset?.page === 'product' ? '../../' : './';
  footer.innerHTML = `
    <div class="site-footer__inner">
      <div class="footer-col">
        <div class="footer-brand">
          <div class="footer-logo">
            <img class="footer-logo-img" src="${homePrefix}logos/logo.png" alt="UsadosDeQualidade" />
          </div>
          <p class="footer-slogan">A forma inteligente de conquistar <em>mais</em> pagando <em>menos.</em></p>
          <div class="footer-badges">
            <span class="footer-badge">🔒 Compra Segura</span>
            <span class="footer-badge">📦 Entrega Segura</span>
          </div>
        </div>
      </div>
      <div class="footer-col">
        <div class="footer-links-group">
          <div>
            <h4 class="footer-col-title">Navegação</h4>
            <ul class="footer-links">
              <li><a href="${homePrefix}index.html">Início</a></li>
              <li><a href="${homePrefix}index.html#beneficios">Benefícios</a></li>
              <li><a href="${homePrefix}index.html#catalogo">Catálogo</a></li>
            </ul>
          </div>
          <div>
            <h4 class="footer-col-title">Contato</h4>
            <ul class="footer-links">
              <li><a href="${buildWhatsAppUrl(whatsappMessage)}" target="_blank" rel="noreferrer">WhatsApp</a></li>
              <li><span class="footer-location">Metrô São Judas, SP</span></li>
            </ul>
          </div>
          <div>
            <h4 class="footer-col-title">Categorias</h4>
            <ul class="footer-links">
              <li><a href="#catalogo" data-category-link="todos">🏷️ Todos Produtos</a></li>
              <li><a href="#catalogo" data-category-link="tecnologia">💻 Tecnologia</a></li>
              <li><a href="#catalogo" data-category-link="casa">🏠 Casa</a></li>
              <li><a href="#catalogo" data-category-link="decoracao">🪴 Decoração</a></li>
              <li><a href="#catalogo" data-category-link="estilo">👟 Estilo & Bem-estar</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-social-dock" aria-label="Redes de Ricardo Santos">
        <span class="footer-profile-mark" aria-hidden="true">⚡</span>
        <span class="footer-profile">
          <strong>Ricardo Santos</strong>
          <small>@SantosQA</small>
        </span>
        <a class="icon-link" href="https://santosqa.github.io/" target="_blank" rel="noreferrer" aria-label="Site SantosQA">${icons.site}</a>
        <a class="icon-link" href="https://www.linkedin.com/in/santosqa/" target="_blank" rel="noreferrer" aria-label="LinkedIn SantosQA">${icons.linkedin}</a>
        <a class="icon-link" href="https://github.com/santosqa" target="_blank" rel="noreferrer" aria-label="GitHub SantosQA">${icons.github}</a>
        <a class="icon-link" href="https://www.instagram.com/santosqa_" target="_blank" rel="noreferrer" aria-label="Instagram SantosQA">${icons.instagram}</a>
        <a class="icon-link" href="${buildWhatsAppUrl(whatsappMessage)}" target="_blank" rel="noreferrer" aria-label="WhatsApp UsadosDeQualidade">${icons.whatsapp}</a>
      </div>
    </div>
  `;
}

function setWhatsAppCtas(product) {
  document.querySelectorAll('[data-whatsapp-link]').forEach((link) => {
    link.setAttribute('href', buildWhatsAppUrl(currentPageMessage(product)));
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noreferrer');
  });
}

function renderHome(products) {
  const list = document.querySelector('#product-list');
  const filterContainer = document.querySelector('#category-filters');
  if (!list) return;

  const sorted = [...products].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  catalogProducts = sorted;
  
  if (filterContainer) {
    const storedCategory = localStorage.getItem(ACTIVE_CATEGORY_KEY) || 'todos';
    filterContainer.innerHTML = Object.entries(CATEGORIES)
      .map(([key, { label, icon }]) => `
        <button 
          class="category-filter ${key === storedCategory ? 'active' : ''}" 
          data-category="${key}"
          type="button"
          aria-pressed="${key === storedCategory ? 'true' : 'false'}"
        >
          <span class="category-icon">${icon}</span>
          <span class="category-label">${label}</span>
        </button>
      `)
      .join('');
    
    filterContainer.querySelectorAll('.category-filter').forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.category;
        localStorage.setItem(ACTIVE_CATEGORY_KEY, category);
        
        filterContainer.querySelectorAll('.category-filter').forEach(btn => {
          const isActive = btn.dataset.category === category;
          btn.classList.toggle('active', isActive);
          btn.setAttribute('aria-pressed', String(isActive));
        });
        
        renderFilteredProducts(catalogProducts, category);
      });
    });
  }
  
  const storedCategory = localStorage.getItem(ACTIVE_CATEGORY_KEY) || 'todos';
  renderFilteredProducts(sorted, storedCategory);
}

function renderFilteredProducts(products, category) {
  const list = document.querySelector('#product-list');
  
  const filtered = category === 'todos' 
    ? products 
    : products.filter(p => p.category === category);

  if (!filtered.length) {
    list.innerHTML = '<div class="empty-state">Nenhum produto encontrado nesta categoria.</div>';
    return;
  }

  const renderProductCard = (product) => `
        <article class="product-card">
          <div class="product-card__image">
            <img src="${resolvePath(`./${product.mainImageUrl}`)}" alt="${product.galleryUrls?.[0]?.alt || product.title}" loading="lazy" />
            <span class="product-badge">✅ Testado </span>
          </div>
          <div class="product-card__content">
            <h3>${product.title}</h3>
            <p class="product-short-desc">${product.shortDescription}</p>
            <div class="product-meta">
              <strong class="price">${product.price}</strong>
              <span class="tag">${product.paymentMethods?.slice(0, 2).join(' · ') || FIXED_PAYMENT}</span>
            </div>
            <div class="product-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Retirada: ${PICKUP_LOCATION.replace('Estação ', '')}
            </div>
            <div class="product-actions product-actions--card">
              <a class="ghost-button" href="${formatProductUrl(product)}">Ver detalhes</a>
              <a
                class="primary-button primary-button--whatsapp"
                href="${buildWhatsAppUrl(
                  `Olá! Tenho interesse no produto \"${product.title}\" da ${SITE_NAME}. Link: ${new URL(
                    `./products/${product.slug}/index.html`,
                    window.location.href,
                  ).toString()}`,
                )}"
                target="_blank"
                rel="noreferrer"
              >
                Fechar no WhatsApp
              </a>
            </div>
          </div>
        </article>
      `;
  const allCards = filtered.map(renderProductCard).join('');

  list.innerHTML = `
    <div class="product-carousel" aria-label="Produtos em destaque">
      <div class="product-carousel__track">${allCards}</div>
    </div>
    <div class="product-carousel" style="display:none" aria-hidden="true">
      <div class="product-carousel__track"></div>
    </div>
  `;
}

function setupShareButton(product) {
  const shareBtn = document.querySelector('[data-share-product]');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => shareProduct(product));
  }
}

function renderProduct(products) {
  const detailRoot = document.querySelector('#product-detail');
  if (!detailRoot) return;

  const segments = window.location.pathname.split('/').filter(Boolean);
  const slug = segments[segments.length - 1] === 'index.html' ? segments[segments.length - 2] : segments[segments.length - 1];

  const sorted = [...products].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const productIndex = sorted.findIndex((product) => product.slug === slug);
  const product = sorted[productIndex];

  if (!product) {
    detailRoot.innerHTML = '<div class="empty-state">Produto não encontrado.</div>';
    renderFooter();
    return;
  }

  document.title = `${product.title} | ${SITE_NAME}`;
  const previous = sorted[productIndex - 1];
  const next = sorted[productIndex + 1];

  const mainImageSrc = resolvePath(`../../${product.mainImageUrl}`);

  detailRoot.innerHTML = `
    <section class="product-detail" aria-labelledby="product-title">
      <div class="product-detail__media">
        <div class="detail-main-image">
          <img id="detail-main-image" src="${mainImageSrc}" alt="${product.galleryUrls?.[0]?.alt || product.title}" />
        </div>
        <div class="thumbnail-list" role="list" aria-label="Galeria do produto">
          ${(product.galleryUrls || [])
            .map(
              (image, index) => {
                const src = resolvePath(`../../${image.src}`);
                return `
                  <button
                    class="thumbnail-button"
                    type="button"
                    data-image-src="${src}"
                    data-image-alt="${image.alt}"
                    aria-label="Ver foto ${index + 1} de ${product.title}"
                    aria-current="${index === 0 ? 'true' : 'false'}"
                  >
                    <img src="${src}" alt="" />
                  </button>
                `;
              },
            )
            .join('')}
        </div>
      </div>
      <div class="product-detail__content">
        <p class="eyebrow">Produto disponível</p>
        <h1 id="product-title">${product.title}</h1>
        <p>${product.shortDescription}</p>
        <strong class="price">${product.price}</strong>
        <p>${product.description}</p>
        <ul class="detail-meta">
          <li><strong>Tamanho:</strong> ${product.sizes?.length ? product.sizes.join(' · ') : 'Consultar disponibilidade'}</li>
          <li><strong>Pagamento:</strong> ${product.paymentMethods?.join(', ') || FIXED_PAYMENT}</li>
          <li><strong>Retirada:</strong> Linha Azul do metrô — ${product.pickupLocation || PICKUP_LOCATION}</li>
        </ul>
        ${product.sizes?.length ? `<div><h2>Tamanhos</h2><ul class="size-list">${product.sizes.map((size) => `<li>${size}</li>`).join('')}</ul></div>` : ''}
        <div class="product-actions product-actions--detail">
          <div class="product-actions-row">
            <a class="primary-button primary-button--whatsapp" data-whatsapp-link="product-detail" href="#">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Fechar negócio no WhatsApp
            </a>
            <a class="ghost-button" href="${resolvePath('../../index.html#catalogo')}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Home
            </a>
          </div>
          <button class="share-button" type="button" data-share-product="${product.slug}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Compartilhar
          </button>
        </div>
      </div>
    </section>
    <nav class="product-nav" aria-label="Navegação entre produtos">
      ${previous ? `<a class="nav-button nav-button--prev" href="${new URL(`../${previous.slug}/index.html`, window.location.href).toString()}"><span class="nav-button__direction">← Produto anterior</span><span class="nav-button__label">${previous.title}</span></a>` : '<span class="nav-button nav-button--prev" aria-disabled="true"><span class="nav-button__direction">← Produto anterior</span><span class="nav-button__label">Você está no primeiro item</span></span>'}
      <a class="nav-button nav-button--home" href="${resolvePath('../../index.html#catalogo')}"><span class="nav-button__direction">Catálogo</span><span class="nav-button__label">Voltar para Home</span></a>
      ${next ? `<a class="nav-button nav-button--next" href="${new URL(`../${next.slug}/index.html`, window.location.href).toString()}"><span class="nav-button__direction">Próximo produto →</span><span class="nav-button__label">${next.title}</span></a>` : '<span class="nav-button nav-button--next" aria-disabled="true"><span class="nav-button__direction">Próximo produto →</span><span class="nav-button__label">Você chegou ao fim</span></span>'}
    </nav>
  `;

  detailRoot.querySelectorAll('.thumbnail-button').forEach((button) => {
    button.addEventListener('click', () => {
      detailRoot.querySelector('#detail-main-image').src = button.dataset.imageSrc;
      detailRoot.querySelector('#detail-main-image').alt = button.dataset.imageAlt;
      detailRoot.querySelectorAll('.thumbnail-button').forEach((thumb) => thumb.setAttribute('aria-current', 'false'));
      button.setAttribute('aria-current', 'true');
    });
  });

  setWhatsAppCtas(product);
  renderFooter(product);
  setupShareButton(product);
}

function renderStaticHeaderState() {
  setWhatsAppCtas();
  renderFooter();
}

async function bootstrap() {
  // FIX #6: tema inicializado ANTES de qualquer renderização, em toda página
  initializeTheme();
  const page = document.body.dataset.page;
  if (page === 'home') {
    renderStaticHeaderState();
  }

  try {
    const data = await loadCatalog();
    if (page === 'home') {
      renderHome(data.products);
      renderFooter();
      setWhatsAppCtas();
      return;
    }
    renderProduct(data.products);
  } catch (error) {
    const target = document.querySelector('#product-list, #product-detail');
    if (target) {
      target.innerHTML = `<div class="empty-state">${error.message}</div>`;
    }
    renderFooter();
  }
}

document.addEventListener('click', event => {
  const link = event.target.closest('[data-category-link]')
  if (!link) return

  event.preventDefault()

  const category = link.dataset.categoryLink

  localStorage.setItem(ACTIVE_CATEGORY_KEY, category)

  // Atualiza visual dos botões de filtro
  document.querySelectorAll('.category-filter').forEach(btn => {
    const isActive = btn.dataset.category === category
    btn.classList.toggle('active', isActive)
    btn.setAttribute('aria-pressed', String(isActive))
  })

  // Filtra diretamente com os produtos já carregados
  if (catalogProducts.length) {
    renderFilteredProducts(catalogProducts, category)
  }

  document.querySelector('#catalogo')?.scrollIntoView({ behavior: 'smooth' })
})

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    buildWhatsAppUrl,
    currentPageMessage,
    getCatalogPath,
    applyTheme,
    STORAGE_KEY,
    DEFAULT_DARK,
    WHATSAPP_NUMBER,
    SITE_NAME,
    PICKUP_LOCATION,
  };
}
  
bootstrap();
