/**
 * Testes unitários para app.js
 * Testa funções principais de tema, categorias e utilitários
 */

// Mock do localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

global.localStorage = localStorageMock;

// Mock window.location.href
Object.defineProperty(window, 'location', {
  value: { href: 'http://localhost:8000' },
  writable: true,
});

// Import constants and functions from app.js
const {
  STORAGE_KEY,
  DEFAULT_DARK,
  WHATSAPP_NUMBER,
  SITE_NAME,
  PICKUP_LOCATION,
  buildWhatsAppUrl,
  currentPageMessage,
  getCatalogPath,
  applyTheme,
} = require('../app.js');


// TESTES

describe('Funções Utilitárias', () => {
  test('buildWhatsAppUrl deve criar URL correta do WhatsApp', () => {
    const message = 'Olá!';
    const url = buildWhatsAppUrl(message);
    expect(url).toContain('https://wa.me/');
    expect(url).toContain(WHATSAPP_NUMBER);
    expect(url).toContain('text=');
  });

  test('buildWhatsAppUrl deve codificar a mensagem', () => {
    const message = 'Olá! Tenho interesse';
    const url = buildWhatsAppUrl(message);
    expect(url).toContain(encodeURIComponent(message));
  });

  test('currentPageMessage deve retornar mensagem para produto', () => {
    const product = {
      title: 'Produto Teste',
      price: 'R$ 100,00',
    };
    const message = currentPageMessage(product);
    expect(message).toContain('Tenho interesse');
    expect(message).toContain('Produto Teste');
    expect(message).toContain(SITE_NAME);
  });

  test('currentPageMessage deve retornar mensagem genérica sem produto', () => {
    const message = currentPageMessage(null);
    expect(message).toContain('Quero fechar negócio');
    expect(message).toContain(SITE_NAME);
    expect(message).not.toContain('undefined');
  });
});

describe('Constantes de Configuração', () => {
  test('STORAGE_KEY deve estar definida', () => {
    expect(STORAGE_KEY).toBe('usadosdequalidade-theme');
  });

  test('DEFAULT_DARK deve ser "dark"', () => {
    expect(DEFAULT_DARK).toBe('dark');
  });

  test('SITE_NAME deve estar definido', () => {
    expect(SITE_NAME).toBe('UsadosDeQualidade');
  });

  test('WHATSAPP_NUMBER deve ser válido', () => {
    expect(WHATSAPP_NUMBER).toMatch(/^\d{13}$/);
  });

  test('PICKUP_LOCATION deve estar definida', () => {
    expect(PICKUP_LOCATION).toContain('Estação');
  });
});

describe('localStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('deve salvar e recuperar tema', () => {
    localStorage.setItem(STORAGE_KEY, 'light');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
  });

  test('deve sobrescrever tema anterior', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    localStorage.setItem(STORAGE_KEY, 'light');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
  });

  test('deve retornar null para chave inexistente', () => {
    expect(localStorage.getItem('chave-inexistente')).toBeNull();
  });

  test('deve remover itens do storage', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    localStorage.removeItem(STORAGE_KEY);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

describe('Validação de Dados', () => {
  test('produto deve ter propriedades obrigatórias', () => {
    const product = {
      slug: 'teste-produto',
      title: 'Produto Teste',
      price: 'R$ 100,00',
      shortDescription: 'Descrição curta',
      description: 'Descrição detalhada',
      pickupLocation: 'Local de retirada',
      paymentMethods: ['PIX', 'Transferência'],
    };

    expect(product).toHaveProperty('slug');
    expect(product).toHaveProperty('title');
    expect(product).toHaveProperty('price');
    expect(product.paymentMethods).toBeInstanceOf(Array);
    expect(product.paymentMethods.length).toBeGreaterThan(0);
  });
});

// ─── TESTES ADICIONAIS PARA MELHORAR COBERTURA ─────────────────────────────────

describe('Testes de Cobertura de Funções', () => {
  test('buildWhatsAppUrl com mensagem contendo caracteres especiais', () => {
    const message = 'Olá! Tenho interesse em: "Produto" & itens';
    const url = buildWhatsAppUrl(message);
    expect(url).toContain(WHATSAPP_NUMBER);
    expect(url).toContain('text=');
    // Verifica se a mensagem foi codificada
    const encoded = encodeURIComponent(message);
    expect(url).toContain(encoded);
  });

  test('buildWhatsAppUrl com mensagem vazia', () => {
    const url = buildWhatsAppUrl('');
    expect(url).toContain(`https://wa.me/${WHATSAPP_NUMBER}?text=`);
  });

  test('currentPageMessage com produto contendo caracteres especiais', () => {
    const product = {
      title: 'Produto "Especial" & Único',
      price: 'R$ 999,99',
    };
    const message = currentPageMessage(product);
    expect(message).toContain('Tenho interesse');
    expect(message).toContain('Produto');
    expect(message).toContain(SITE_NAME);
    expect(message).toContain(product.title);
  });

  test('currentPageMessage com produto sem propriedades', () => {
    const product = {};
    const message = currentPageMessage(product);
    expect(message).toContain('Tenho interesse');
    expect(message).toContain(SITE_NAME);
  });

  test('Verificar constantes estão corretas', () => {
    expect(typeof STORAGE_KEY).toBe('string');
    expect(typeof DEFAULT_DARK).toBe('string');
    expect(typeof WHATSAPP_NUMBER).toBe('string');
    expect(typeof SITE_NAME).toBe('string');
    expect(typeof PICKUP_LOCATION).toBe('string');
    
    expect(STORAGE_KEY.length).toBeGreaterThan(0);
    expect(SITE_NAME.length).toBeGreaterThan(0);
  });

  test('localStorage deve funcionar com múltiplas operações', () => {
    // Teste múltiplas operações
    localStorage.setItem('key1', 'value1');
    localStorage.setItem('key2', 'value2');
    
    expect(localStorage.getItem('key1')).toBe('value1');
    expect(localStorage.getItem('key2')).toBe('value2');
    
    localStorage.removeItem('key1');
    expect(localStorage.getItem('key1')).toBeNull();
    expect(localStorage.getItem('key2')).toBe('value2');
  });

  test('buildWhatsAppUrl deve preservar ordem dos parâmetros', () => {
    const message = 'Teste de mensagem';
    const url = buildWhatsAppUrl(message);
    
    // Verifica estrutura
    expect(url).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(url).toContain('https://wa.me/');
    expect(url).toContain('?text=');
  });

  test('getCatalogPath deve retornar caminho relativo para página de produto', () => {
    // Mock document.body com página de produto
    document.body.dataset.page = 'product';
    const path = getCatalogPath();
    expect(path).toBe('../../catalog.json');
  });

  test('getCatalogPath deve retornar caminho padrão quando não estiver em página de produto', () => {
    // Mock document.body sem página de produto
    delete document.body.dataset.page;
    const path = getCatalogPath();
    expect(path).toBe('./catalog.json');
  });

  test('getCatalogPath deve retornar caminho padrão quando dataset não existir', () => {
    // Remove dataset completamente
    const originalDataset = document.body.dataset;
    Object.defineProperty(document.body, 'dataset', {
      value: {},
      writable: true,
    });
    const path = getCatalogPath();
    expect(path).toBe('./catalog.json');
    // Restaura dataset original
    Object.defineProperty(document.body, 'dataset', {
      value: originalDataset,
      writable: true,
    });
  });
});

describe('applyTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    // Limpa qualquer toggle anterior
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) toggle.remove();
  });

  test('applyTheme deve aplicar tema dark', () => {
    applyTheme('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
  });

  test('applyTheme deve aplicar tema light', () => {
    applyTheme('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
  });

  test('applyTheme deve atualizar tema anterior', () => {
    applyTheme('dark');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    
    applyTheme('light');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  test('applyTheme deve retornar sem erro quando toggle não existir', () => {
    // Nenhum toggle no DOM
    expect(() => applyTheme('dark')).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  test('applyTheme deve atualizar toggle quando existir', () => {
    // Cria um toggle no DOM
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-pressed', 'false');
    
    const icon = document.createElement('span');
    icon.className = 'theme-toggle__icon';
    icon.textContent = '☀';
    
    const label = document.createElement('span');
    label.className = 'theme-toggle__label';
    label.textContent = 'Tema claro';
    
    toggle.appendChild(icon);
    toggle.appendChild(label);
    document.body.appendChild(toggle);
    
    applyTheme('dark');
    
    // Quando theme é 'dark', isDark = true, então aria-pressed = !true = false
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    expect(icon.textContent).toBe('☀');
    expect(label.textContent).toBe('Tema claro');
    
    applyTheme('light');
    
    // Quando theme é 'light', isDark = false, então aria-pressed = !false = true
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    expect(icon.textContent).toBe('☾');
    expect(label.textContent).toBe('Tema escuro');
  });
});


