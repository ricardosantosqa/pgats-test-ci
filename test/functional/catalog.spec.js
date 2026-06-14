const { expect, test } = require('@playwright/test');

test.describe('Catálogo', () => {
  test('carrega produtos e filtra por categoria', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Produtos únicos/i })).toBeVisible();
    await expect(page.locator('.product-card')).toHaveCount(4);

    await page.getByRole('button', { name: /Tecnologia/i }).click();

    await expect(page.locator('.product-card')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Monitor LG UltraWide 29"' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Cadeira ergonômica Uni' })).toHaveCount(0);
  });

  test('alterna tema e mantém a preferência após recarregar', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', /dark|light/);

    const initialTheme = await html.getAttribute('data-theme');
    await page.getByRole('button', { name: /Alternar tema/i }).click();

    const toggledTheme = await html.getAttribute('data-theme');
    expect(toggledTheme).not.toBe(initialTheme);

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', toggledTheme);
  });
});

test.describe('Produto', () => {
  test('renderiza detalhes, galeria e CTA do WhatsApp', async ({ page }) => {
    await page.goto('/products/cadeira-ergonomica-uni/index.html');

    await expect(page.getByRole('heading', { name: 'Cadeira ergonômica Uni' })).toBeVisible();
    await expect(page.getByText('R$ 699,00')).toBeVisible();
    await expect(page.getByText(/Linha Azul do metrô/i)).toBeVisible();

    const mainImage = page.locator('#detail-main-image');
    await expect(mainImage).toHaveAttribute('src', /main\.svg$/);

    await page.getByRole('button', { name: /Ver foto 2/i }).click();
    await expect(mainImage).toHaveAttribute('src', /detail-1\.svg$/);

    const whatsapp = page.getByRole('link', { name: /Fechar negócio no WhatsApp/i });
    await expect(whatsapp).toHaveAttribute('href', /https:\/\/wa\.me\/5511982633161\?text=/);
  });
});
