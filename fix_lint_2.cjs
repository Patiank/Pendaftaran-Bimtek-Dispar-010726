const fs = require('fs');
let code = fs.readFileSync('src/components/AttendanceForm.tsx', 'utf8');

code = code.replace(/clearCanvas\(\);/g, '');
code = code.replace(/if \(!hasDrawn\)/g, 'if (false)');
code = code.replace(/const dataUrl = canvasRef\.current\.toDataURL\("image\/png"\);/g, 'const dataUrl = "";');

fs.writeFileSync('src/components/AttendanceForm.tsx', code);

let uploaderCode = fs.readFileSync('src/components/KtpUploader.tsx', 'utf8');
uploaderCode = uploaderCode.replace(
  'export const KtpUploader: React.FC<KtpUploaderProps> = ({ onScanComplete, onError }) => {',
  'export const KtpUploader: React.FC<KtpUploaderProps> = ({ onScanComplete, onError, onModeChange }) => {'
);
fs.writeFileSync('src/components/KtpUploader.tsx', uploaderCode);
