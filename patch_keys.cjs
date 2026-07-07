const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '{isQuotaExceeded && (\n            <motion.div',
  '{isQuotaExceeded && (\n            <motion.div key="quota-error"'
);

code = code.replace(
  '{globalError && (\n            <motion.div',
  '{globalError && (\n            <motion.div key="global-error"'
);

code = code.replace(
  '{globalSuccess && (\n            <motion.div',
  '{globalSuccess && (\n            <motion.div key="global-success"'
);

fs.writeFileSync('src/App.tsx', code);
