import { getCollection } from 'astro:content';

export async function GET() {
  const products = await getCollection('products');
  const baseUrl = 'https://mustore.cl';

  const productFeeds = products
    .filter(product => !product.id.includes('unavailable/'))
    .map(product => {
      // Procesar la descripción para eliminar markdown y caracteres especiales
      const cleanDescription = product.data.descriptionParagraphs?.[1]?.replace(/\*\*/g, '')
        .replace(/[^\w\s.,]/g, ' ')
        .trim() || '';

      // Crear un identificador único global (GTIN) para cada producto
      const gtin = `MUSTORE${product.slug.toUpperCase()}`;

      // Calcular el margen de ganancia para el valor del producto
      const productValue = Math.ceil(product.data.price * 1.3); // 30% más del precio de venta

      return `
    <item>
      <g:id>${product.slug}</g:id>
      <g:title>${product.data.title.substring(0, 150)}</g:title>
      <g:description>${cleanDescription.substring(0, 5000)}</g:description>
      <g:link>${baseUrl}/products/${product.slug}</g:link>
      <g:image_link>${baseUrl}${product.data.productImages[0]}</g:image_link>
      ${product.data.productImages.slice(1).map(img => 
        `<g:additional_image_link>${baseUrl}${img}</g:additional_image_link>`
      ).join('\n      ')}
      <g:availability>in_stock</g:availability>
      <g:price>${product.data.price} CLP</g:price>
      <g:sale_price>${product.data.price} CLP</g:sale_price>
      <g:brand>MuStore</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>true</g:identifier_exists>
      <g:gtin>${gtin}</g:gtin>
      <g:mpn>${product.slug.toUpperCase()}</g:mpn>
      <g:google_product_category>3024</g:google_product_category>
      <g:product_type>Pet Supplies > Pet Grooming > Pet Brushes</g:product_type>
      <g:shipping>
        <g:country>CL</g:country>
        <g:service>Standard</g:service>
        <g:price>0 CLP</g:price>
      </g:shipping>
      <g:shipping_weight>0.5 kg</g:shipping_weight>
      <g:tax>
        <g:country>CL</g:country>
        <g:tax_ship>true</g:tax_ship>
        <g:rate>19</g:rate>
      </g:tax>
      <g:custom_label_0>PetCare</g:custom_label_0>
      <g:custom_label_1>Grooming</g:custom_label_1>
      <g:custom_label_2>${productValue} CLP</g:custom_label_2>
      <g:age_group>all ages</g:age_group>
      <g:gender>unisex</g:gender>
      <g:material>Silicone</g:material>
    </item>
  `}).join('');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>MuStore - Productos Premium para Mascotas</title>
    <description>Tienda Online de Productos Premium para el Cuidado de tu Mascota</description>
    <link>${baseUrl}</link>
    <language>es</language>
    ${productFeeds}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600'
    }
  });
}
