const fs = require('fs');
let code = fs.readFileSync('src/components/ScanAttendance.tsx', 'utf8');

code = code.replace(
  'interface ScanAttendanceProps {\n  participant: Registration;\n  onClose: () => void;',
  'interface ScanAttendanceProps {\n  participant: Registration;\n  expectedDay?: number;\n  onClose: () => void;'
);

code = code.replace(
  'export const ScanAttendance: React.FC<ScanAttendanceProps> = ({ participant, onClose, onSuccess }) => {',
  'export const ScanAttendance: React.FC<ScanAttendanceProps> = ({ participant, expectedDay, onClose, onSuccess }) => {'
);

code = code.replace(
  '<h3 className="text-lg font-black text-white tracking-tight">Scan Kehadiran</h3>\n          <p className="text-xs text-slate-400 mt-1">Arahkan kamera ke QR Code Absensi</p>',
  '<h3 className="text-lg font-black text-white tracking-tight">Scan Kehadiran {expectedDay ? `H-${expectedDay}` : ""}</h3>\n          <p className="text-xs text-slate-400 mt-1">Arahkan kamera ke QR Code Absensi {expectedDay ? `Hari ke-${expectedDay}` : ""}</p>'
);

code = code.replace(
  'if (!isNaN(day)) {\n        setLoading(true);',
  `if (!isNaN(day)) {
        if (expectedDay && day !== expectedDay) {
          setError(\`QR Code tidak valid. Ini adalah QR Code untuk H-\${day}, namun Anda memilih H-\${expectedDay}.\`);
          return;
        }
        setLoading(true);`
);

fs.writeFileSync('src/components/ScanAttendance.tsx', code);
