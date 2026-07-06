const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldCode = `                            onError={(msg) => {
                              setGlobalError(msg);
                              setFormNik("");
                              setFormName("");
                              setFormAddress("");
                              setFormKabKota("");
                              setFormKtp("");
                            }}`;

const newCode = `                            onError={(msg, base64) => {
                              setGlobalError(msg);
                              // We DO NOT clear NIK, Name, Address if the user wants to keep filling
                              // Wait, the OCR failed, we might want to let them keep what they typed OR just not clear it
                              // Actually, the old code clears it. We can leave clearing or not clearing.
                              // Since OCR failed, any partially filled stuff might be good to preserve
                              // Let's just preserve Ktp.
                              if (base64) {
                                setFormKtp(base64);
                              } else {
                                setFormKtp("");
                                setFormNik("");
                                setFormName("");
                                setFormAddress("");
                                setFormKabKota("");
                              }
                            }}`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/App.tsx', code);
