const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'src', 'styles');

const colorMap = {
  // Whites and light grays (backgrounds typically) -> dark card background
  '#fff': 'var(--cy-bg-card)',
  '#ffffff': 'var(--cy-bg-card)',
  '#f8fafc': 'var(--cy-bg-muted)',
  '#f1f5f9': 'var(--cy-bg-muted)',
  '#f9fafb': 'var(--cy-bg-muted)',
  '#f3f4f6': 'var(--cy-bg-muted)',
  'white': 'var(--cy-bg-card)',
  // Dark text/backgrounds -> light text or dark background depending on context?
  // Since we flip the theme, dark becomes light.
  '#0f172a': 'var(--cy-text)',
  '#1e293b': 'var(--cy-text)',
  '#334155': 'var(--cy-text-dim)',
  '#475569': 'var(--cy-text-dim)',
  '#64748b': 'var(--cy-text-dim)',
  '#111827': 'var(--cy-text)',
  '#1f2937': 'var(--cy-text)',
  '#374151': 'var(--cy-text-dim)',
  '#4b5563': 'var(--cy-text-dim)',
  'black': 'var(--cy-bg)',
  '#000': 'var(--cy-bg)',
  '#000000': 'var(--cy-bg)',
  // Borders
  '#e2e8f0': 'var(--cy-border)',
  '#cbd5e1': 'var(--cy-border)',
  '#e5e7eb': 'var(--cy-border)',
  '#d1d5db': 'var(--cy-border)',
  // Accents (Blues mostly used as primary CTA)
  '#2563eb': 'var(--cy-accent)',
  '#1d4ed8': 'var(--cy-accent)',
  '#3b82f6': 'var(--cy-accent)',
  '#0071e3': 'var(--cy-accent)',
  '#005bb5': 'var(--cy-accent)',
};

const replaceColors = (file) => {
  if (['Home.css', 'Footer.css', 'Chatbox.css'].includes(file)) return;
  const filePath = path.join(stylesPath, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace hex colors and basic color names using regex (case insensitive)
  for (const [key, variable] of Object.entries(colorMap)) {
    // Only match full hex or color names if followed by a non-letter to avoid matching 'white' inside 'antiquewhite'
    const isHex = key.startsWith('#');
    let regexStr = isHex 
        ? `${key}(?![a-fA-F0-9])` 
        : `\\b${key}\\b`;
    const regex = new RegExp(regexStr, 'gi');
    
    // Some logic: we don't want to replace "white" if it's currently text color on dark background, but this is a rough global replace.
    // If you're doing a total Cyberpunk swap, we accept some collateral damage.
    content = content.replace(regex, variable);
  }

  // Swap box-shadows to neon glow where possible
  content = content.replace(/box-shadow:\s*0\s*4px\s*6px\s*rgba\(0,\s*0,\s*0,\s*0\.05\);/g, 'box-shadow: var(--cy-glow);');
  content = content.replace(/box-shadow:.+?rgba\(.+?\);/g, (match) => {
      if (match.includes('var(')) return match;
      return 'box-shadow: var(--cy-glow);';
  });

  // Replace border-radius with clip-path chamfers
  content = content.replace(/border-radius:\s*[0-9]+px;/g, 'clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px)); border-radius: 0;');

  fs.writeFileSync(filePath, content, 'utf8');
}

fs.readdirSync(stylesPath).forEach(file => {
  if (file.endsWith('.css')) replaceColors(file);
});

console.log('Colors replaced successfully!');
