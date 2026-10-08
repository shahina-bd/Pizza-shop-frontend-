/**
 * Resolves a product image to a high-quality local image or a valid URL.
 * Handles database seeded dummy images (pizza1.jpg - pizza8.jpg) by mapping them
 * to the beautiful local images in the frontend public folder.
 * 
 * @param {Object} product - The product object from the API.
 * @returns {string} The resolved image URL.
 */
export function getProductImageUrl(product) {
  if (!product) return '/images/hot_fresh_pizza.png';

  const img = product.image || '';
  const fullUrl = product.image_full_url || product.image_url || '';

  // 1. Map seeded dummy filenames to beautiful local custom images
  if (img === 'pizza1.jpg' || fullUrl.endsWith('/pizza1.jpg')) return '/images/margherita_pizza_custom.png';
  if (img === 'pizza2.jpg' || fullUrl.endsWith('/pizza2.jpg')) return '/images/italian_pizza_custom.png';
  if (img === 'pizza3.jpg' || fullUrl.endsWith('/pizza3.jpg')) return '/images/american_pizza_custom.png';
  if (img === 'pizza4.jpg' || fullUrl.endsWith('/pizza4.jpg')) return '/images/greek_pizza_custom.png';
  if (img === 'pizza5.jpg' || fullUrl.endsWith('/pizza5.jpg')) return '/images/spicy_chicken_pizza.png';
  if (img === 'pizza6.jpg' || fullUrl.endsWith('/pizza6.jpg')) return '/images/tomatoe_pie_custom.png';
  if (img === 'pizza7.jpg' || fullUrl.endsWith('/pizza7.jpg')) return '/images/caucasian_pizza_custom.png';
  if (img === 'pizza8.jpg' || fullUrl.endsWith('/pizza8.jpg')) return '/images/italian_pizza.png';

  // 2. If it's a valid remote URL or has a valid path, return it
  if (fullUrl && !fullUrl.includes('no-image.png') && !fullUrl.includes('placeholder')) {
    return fullUrl;
  }

  // 3. Fallback based on name keywords if no image is specified
  const name = (product.name || '').toLowerCase();
  if (name.includes('margherita')) return '/images/margherita_pizza_custom.png';
  if (name.includes('pepperoni') || name.includes('meat') || name.includes('sausage')) return '/images/american_pizza_custom.png';
  if (name.includes('veggie') || name.includes('mushroom') || name.includes('onion') || name.includes('olive') || name.includes('spinach')) return '/images/greek_pizza_custom.png';
  if (name.includes('chicken') || name.includes('bbq')) return '/images/spicy_chicken_pizza.png';
  if (name.includes('cheese') || name.includes('corn')) return '/images/tomatoe_pie_custom.png';
  if (name.includes('italian')) return '/images/italian_pizza_custom.png';

  return '/images/hot_fresh_pizza.png';
}

/**
 * Event handler for broken images. Sets a nice default fallback.
 * 
 * @param {Event} event - The image error event.
 */
export function handleImageError(event) {
  event.target.src = '/images/hot_fresh_pizza.png';
}
