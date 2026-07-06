const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(
  '{Array.from({ length: Math.max(0, (settings.durationDays || 3) - 1) }).map((_, idx) => (',
  '{Array.from({ length: Math.max(0, settings.durationDays || 3) }).map((_, idx) => ('
);

code = code.replace(
  '<option key={idx} value={idx + 2}>Hari ke-{idx + 2}</option>',
  '<option key={idx} value={idx + 1}>Hari ke-{idx + 1}</option>'
);

code = code.replace(
  'const [selectedQrDay, setSelectedQrDay] = useState(2);',
  'const [selectedQrDay, setSelectedQrDay] = useState(1);'
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
