import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5130/api/products';
const IMAGE_DIR = './src/assets/images';

const files = fs.readdirSync(IMAGE_DIR).filter(file => file.match(/\.(jpg|png|jpeg)$/));

const products = files.map((filename, index) => {
  const imageUrl = `/src/assets/images/${filename}`;
  
  let category = 'Accessories';
  
  if (filename.includes('x3')) {
    category = 'Accessories';
  } else if (
    filename.includes('mouse') && !filename.includes('mousepad') ||
    filename.includes('b3') || 
    filename.includes('a3') || 
    filename.includes('bh') ||
    filename.includes('F1') ||
    filename.includes('O2') ||
    filename.includes('V3') ||
    filename.includes('X3') ||
    filename.includes('DA3') ||
    filename.includes('G502') ||
    filename.includes('scyrox-V6')
  ) {
    category = 'Mice';
  } else if (filename.includes('keyboard') || filename.includes('mercury') || filename.includes('mad68R') || filename.includes('gh60')) {
    category = 'Keyboards';
  } else if (
    filename.includes('headset') ||
    filename.includes('headphone') ||
    filename.includes('audio') ||
    filename.includes('GSP') ||
    filename.includes('Gpro') ||
    filename.includes('A50') ||
    filename.includes('A20') ||
    filename.includes('Nova7') ||
    filename.includes('marshal') ||
    filename.includes('hyperX')
  ) {
    category = 'Headphones';
  } else if (filename.includes('mousepad')) {
    category = 'Mousepad';
  }

  let cleanName = filename
    .replace(/^(keyboard|mousepad|mouse|accessory)-/i, '')
    .replace(/\.(jpg|png|jpeg)$/i, '')
    .replace(/[-_]/g, ' ')
    .trim();

  cleanName = cleanName.replace(/\b\w/g, c => c.toUpperCase());

  const fakePrice = ((cleanName.length * 150000) % 4000000) + 500000;
  
  return {
    name: cleanName,
    price: fakePrice,
    imageUrl: imageUrl,
    category: category,
    description: "Sản phẩm chính hãng SCYTOL mang lại cảm giác tốt nhất.",
    stock: (index % 5 === 0) ? 0 : (index % 10 === 0) ? 5 : 50,
    isPreOrder: (index === 2),
    isOrderOnly: (index === 4)
  };
});

async function seed() {
  let token = '';
  try {
    const loginRes = await fetch('http://localhost:5130/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'owner@gear.com', password: 'owner123' })
    });
    const loginData = await loginRes.json();
    token = loginData.token;
    console.log("Got token!", token?.substring(0, 20));
  } catch (e) {
    console.error("Login failed", e);
    return;
  }

  for (const p of products) {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(p)
      });
      console.log(`Seeded: ${p.name} - Status: ${res.status}`);
    } catch (e) {
      console.error(e);
    }
  }
}

seed();
