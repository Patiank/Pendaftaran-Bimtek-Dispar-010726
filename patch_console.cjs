const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');
code = code.replace(
  'const message = args.map(arg => {',
  `
  let message = "";
  if (typeof args[0] === "string" && args[0].includes("%s")) {
     let i = 1;
     message = args[0].replace(/%s/g, () => args[i++]);
  } else {
     message = args.map(arg => {
`
);
code = code.replace(
  '  }).join(" ");',
  '  }).join(" ");\n  }'
);
fs.writeFileSync('src/main.tsx', code);
