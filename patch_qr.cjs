const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// 1. Change selectedQrDay default state to 2
code = code.replace(
  'const [selectedQrDay, setSelectedQrDay] = useState(1);',
  'const [selectedQrDay, setSelectedQrDay] = useState(2);'
);

// 2. Change the day options
const oldOptions = `{Array.from({ length: settings.durationDays || 3 }).map((_, idx) => (
                  <option key={idx} value={idx + 1}>Hari ke-{idx + 1}</option>
                ))}`;
const newOptions = `{Array.from({ length: Math.max(0, (settings.durationDays || 3) - 1) }).map((_, idx) => (
                  <option key={idx} value={idx + 2}>Hari ke-{idx + 2}</option>
                ))}`;
code = code.replace(oldOptions, newOptions);

// 3. Change print button logic to download
const printLogicStart = `onClick={() => {
                  const printContent = document.getElementById("print-qr-area")?.innerHTML;`;
const printLogicEnd = `printWindow?.document.close();
                }}`;
// Just use a regex to replace the whole onClick of that button.
// Actually, let's locate the exact button.
// The button is:
/*
<button
                type="button"
                onClick={() => {
                  const printContent = document.getElementById("print-qr-area")?.innerHTML;
                  if (!printContent) return;
                  const printWindow = window.open("", "_blank");
                  printWindow?.document.write(`
...
`);
                  printWindow?.document.close();
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer outline-none flex items-center justify-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Barcode</span>
              </button>
*/

const oldButtonRegex = /onClick=\{\(\) => \{\s+const printContent = document\.getElementById\("print-qr-area"\)\?\.innerHTML;[\s\S]*?printWindow\?\.document\.close\(\);\s+\}\}\s+className="([^"]+)"\s*>\s*<Printer className="w-4 h-4" \/>\s*<span>Cetak Barcode<\/span>/m;

const newButton = `onClick={async () => {
                  const element = document.getElementById("print-qr-area");
                  if (!element) return;
                  try {
                    const { default: html2canvas } = await import("html2canvas");
                    const canvas = await html2canvas(element, { scale: 4, backgroundColor: "#ffffff" });
                    const dataUrl = canvas.toDataURL("image/png");
                    const link = document.createElement("a");
                    link.download = \`QR_Absensi_Hari_\${selectedQrDay}.png\`;
                    link.href = dataUrl;
                    link.click();
                  } catch (err) {
                    console.error("Failed to download QR", err);
                  }
                }}
                className="$1"
              >
                <Download className="w-4 h-4" />
                <span>Download Barcode</span>`;

code = code.replace(oldButtonRegex, newButton);

// 4. Add Download to lucide-react imports if it's missing
if (!code.includes('Download,')) {
  code = code.replace('import { ', 'import { Download, ');
}

fs.writeFileSync('src/components/AdminPanel.tsx', code);
