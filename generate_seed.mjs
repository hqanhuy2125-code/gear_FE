import fs from 'fs';
import path from 'path';

const imgDir = path.join(process.cwd(), 'src/assets/images');
const images = fs.readdirSync(imgDir).filter(f => /\.(jpg|png|jpeg)$/i.test(f));

const products = images.map((filename, index) => {
  const imageUrl = `/src/assets/images/${filename}`;
  const lowername = filename.toLowerCase();
  
  let category = 'Accessories'; 
  
  if (lowername.includes('x3')) {
    category = 'Accessories';
  } else if (
    (lowername.includes('mouse') && !lowername.includes('mousepad')) ||
    lowername.includes('b3') || 
    lowername.includes('a3') || 
    lowername.includes('bh')
  ) {
    category = 'Mice';
  } else if (lowername.includes('keyboard') || lowername.includes('mercury')) {
    category = 'Keyboards';
  } else if (
    lowername.includes('headset') ||
    lowername.includes('headphone') ||
    lowername.includes('audio') ||
    lowername.includes('gsp') ||
    lowername.includes('gpro') ||
    lowername.includes('a50') ||
    lowername.includes('a20') ||
    lowername.includes('corsair') ||
    lowername.includes('razer') ||
    lowername.includes('nova7') ||
    lowername.includes('marshal') ||
    lowername.includes('hyperx') ||
    lowername.includes('rkv3')
  ) {
    category = 'Headphones';
  }

  let cleanName = lowername
    .replace(/^(keyboard|mousepad|mouse|accessory)-/i, '')
    .replace(/\.(jpg|png|jpeg)$/i, '')
    .replace(/[-_]/g, ' ')
    .trim();

  cleanName = cleanName.replace(/\b\w/g, c => c.toUpperCase());
  const fakePrice = ((cleanName.length * 150000) % 4000000) + 500000;
  const stock = (index % 5 === 0) ? 0 : (index % 10 === 0) ? 5 : 50;
  const isPreOrder = (index === 2);
  const preOrderDate = (index === 2) ? "'2026-04-20'" : 'NULL';
  const isOrderOnly = (index === 4);

  return `
IF NOT EXISTS (SELECT 1 FROM Products WHERE ImageUrl = '${imageUrl}')
BEGIN
    INSERT INTO Products (Name, Description, Price, ImageUrl, Category, Stock, IsPreOrder, PreOrderDate, IsOrderOnly, CreatedAt)
    VALUES (N'${cleanName}', N'Mô tả sản phẩm ${cleanName}', ${fakePrice}, '${imageUrl}', '${category}', ${stock}, ${isPreOrder ? 1 : 0}, ${preOrderDate}, ${isOrderOnly ? 1 : 0}, GETDATE());
END
ELSE
BEGIN
    UPDATE Products
    SET Category = '${category}', Price = ${fakePrice}, Name = N'${cleanName}',
        Stock = ${stock}, IsPreOrder = ${isPreOrder ? 1 : 0}, PreOrderDate = ${preOrderDate}, IsOrderOnly = ${isOrderOnly ? 1 : 0}
    WHERE ImageUrl = '${imageUrl}';
END
  `.trim();
});

const sql = `
USE FGG_MADLIONS_DB_V2;
GO

-- Xóa các test data
DELETE FROM Products WHERE Name = 'string' OR Name = 'Test' OR Category = 'string';
GO

-- Seed & Update dữ liệu
${products.join('\nGO\n')}
GO
`;

fs.writeFileSync(path.join(process.cwd(), '..', 'GamingGearBackend', 'seed_full_products.sql'), sql);
console.log('Generated seed_full_products.sql with CreatedAt');
