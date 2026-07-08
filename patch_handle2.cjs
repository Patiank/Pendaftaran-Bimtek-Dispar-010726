const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'setFormNik(data.nik);\n      setFormName(data.name);\n      setFormAddress(data.address);\n      setFormKabKota(data.kabKota);\n      setFormColor(data.color);\n      setFormKtp(data.ktpBase64);\n      if (data.gender) {\n        setFormGender(data.gender);\n      }',
  `if (data.nik) setFormNik(data.nik);
      if (data.name) setFormName(data.name);
      if (data.address) setFormAddress(data.address);
      if (data.kabKota) setFormKabKota(data.kabKota);
      if (data.color) setFormColor(data.color);
      setFormKtp(data.ktpBase64);
      if (data.gender) {
        setFormGender(data.gender);
      }`
);

fs.writeFileSync('src/App.tsx', code);
