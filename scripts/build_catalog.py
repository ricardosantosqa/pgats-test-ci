from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PRODUCTS_DIR = ROOT / 'products'
OUTPUT = ROOT / 'catalog.json'

REQUIRED_FIELDS = {
    'slug',
    'title',
    'shortDescription',
    'description',
    'price',
    'pickupLocation',
    'paymentMethods',
    'gallery',
    'mainImage',
    'order',
}


def with_product_prefix(slug: str, value: str) -> str:
    cleaned = value[2:] if value.startswith('./') else value.lstrip('/')
    return f'products/{slug}/{cleaned}'


catalog: list[dict] = []
for product_file in sorted(PRODUCTS_DIR.glob('*/product.json')):
    data = json.loads(product_file.read_text(encoding='utf-8'))
    missing = REQUIRED_FIELDS - data.keys()
    if missing:
        raise SystemExit(f'Missing fields in {product_file}: {sorted(missing)}')

    slug = data['slug']
    if product_file.parent.name != slug:
        raise SystemExit(
            f'Slug mismatch in {product_file}: folder is {product_file.parent.name}, slug is {slug}'
        )

    # Explicit index.html for maximum compatibility on GitHub Pages and local hosting
    data['url'] = f'products/{slug}/index.html'
    data['mainImageUrl'] = with_product_prefix(slug, data['mainImage'])
    data['galleryUrls'] = [
        {
            'src': with_product_prefix(slug, image['src']),
            'alt': image['alt'],
        }
        for image in data['gallery']
    ]
    catalog.append(data)

catalog.sort(key=lambda item: (item.get('order', 9999), item['title'].lower()))
OUTPUT.write_text(
    json.dumps({'products': catalog}, ensure_ascii=False, indent=2) + '\n',
    encoding='utf-8',
)
print(f'Generated {OUTPUT.relative_to(ROOT)} with {len(catalog)} products')
