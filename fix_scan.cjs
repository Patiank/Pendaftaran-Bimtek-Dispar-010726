const fs = require('fs');
let code = fs.readFileSync('src/components/ScanAttendance.tsx', 'utf8');

code = code.replace(/interface ScanAttendanceProps \{/, 'interface ScanAttendanceProps {\n  signatureBase64?: string;');
code = code.replace(/export const ScanAttendance: React\.FC<ScanAttendanceProps> = \(\{ participant, expectedDay, onClose, onSuccess \}\) => \{/, 'export const ScanAttendance: React.FC<ScanAttendanceProps> = ({ participant, expectedDay, signatureBase64, onClose, onSuccess }) => {');
code = code.replace(/signatureBase64: "data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", \/\/ Blank 1x1 transparent PNG for signature placeholder/, 'signatureBase64: signatureBase64 || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",');

fs.writeFileSync('src/components/ScanAttendance.tsx', code);
