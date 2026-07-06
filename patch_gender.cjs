const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Change formGender default
code = code.replace(
  'const [formGender, setFormGender] = useState("Laki-laki");',
  'const [formGender, setFormGender] = useState("");'
);

// In handleReset and registration submit success, change formGender reset
code = code.replace(
  /setFormGender\("Laki-laki"\);/g,
  'setFormGender("");'
);

fs.writeFileSync('src/App.tsx', code);
