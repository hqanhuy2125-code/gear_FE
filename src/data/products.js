const imageModules = import.meta.glob('../assets/images/*.{jpg,png,jpeg}', { eager: true });

// Convert the Vite glob object into an array of product objects
export const products = Object.keys(imageModules).map((path, index) => {
  const imageUrl = imageModules[path].default;
  const filename = path.split('/').pop().toLowerCase();
  
  let category = 'accessories';
  
  // Determine category based on filename
  // Important: Check specific overrides first
  if (filename.includes('x3')) {
    category = 'accessories';
  } else if (
    filename.includes('mouse') && !filename.includes('mousepad') ||
    filename.includes('b3') || 
    filename.includes('a3') || 
    filename.includes('bh')
  ) {
    category = 'mice';
  } else if (filename.includes('keyboard') || filename.includes('mercury')) {
    category = 'keyboards';
  } else if (
    filename.includes('headset') ||
    filename.includes('headphone') ||
    filename.includes('audio') ||
    filename.includes('gsp') ||
    filename.includes('gpro') ||
    filename.includes('a50') ||
    filename.includes('a20') ||
    filename.includes('corsair') ||
    filename.includes('razer') ||
    filename.includes('nova7') ||
    filename.includes('marshal') ||
    filename.includes('hyperx') ||
    filename.includes('rkv3')
  ) {
    category = 'headphones';
  }
  // Everything else (mousepad, cable, adapter, keycap, etc.) -> accessories

  // Clean the file name from keywords and extensions to generate a fake title
  let cleanName = filename
    .replace(/^(keyboard|mousepad|mouse|accessory)-/i, '')
    .replace(/\.(jpg|png|jpeg)$/i, '')
    .replace(/[-_]/g, ' ')
    .trim();

  // Capitalize first letter of each word
  cleanName = cleanName.replace(/\b\w/g, c => c.toUpperCase());

  // Generate a fake price between 500,000 VND and 4,500,000 VND 
  const fakePrice = ((cleanName.length * 150000) % 4000000) + 500000;

  // Sale logic: ensure at least 8 products are on sale
  const isSale = (index % 2 === 0); // Every 2nd product is on sale (approx 50%)
  const discount = (index % 3 === 0) ? 30 : 15;

  return {
    id: index + 1,
    name: cleanName,
    price: fakePrice,
    image: imageUrl,
    category,
    sale: isSale,
    discount: discount,
    stock: (index % 5 === 0) ? 0 : (index % 10 === 0) ? 5 : 50, // Some out of stock, some low stock
    isPreOrder: (index === 2), // Product 3 is pre-order
    preOrderDate: (index === 2) ? "2026-04-20" : null,
    isOrderOnly: (index === 4) // Product 5 is order-only
  };
});
