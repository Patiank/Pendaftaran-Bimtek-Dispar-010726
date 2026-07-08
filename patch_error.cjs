const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `if (base64) {
                                setFormKtp(base64);
                              } else {
                                setFormKtp("");
                                setFormNik("");
                                setFormName("");
                                setFormAddress("");
                                setFormKabKota("");
                              }`,
  `if (base64) {
                                setFormKtp(base64);
                              } else {
                                setFormKtp("");
                              }`
);

fs.writeFileSync('src/App.tsx', code);
