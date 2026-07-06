const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Add state
code = code.replace(
  'const [searchQuery, setSearchQuery] = useState("");',
  'const [searchQuery, setSearchQuery] = useState("");\n  const [showPrintQrModal, setShowPrintQrModal] = useState(false);\n  const [selectedQrDay, setSelectedQrDay] = useState(1);'
);

// Add QRCode import
if (!code.includes('import { QRCodeSVG }')) {
  code = code.replace(
    'import { motion, AnimatePresence } from "motion/react";',
    'import { motion, AnimatePresence } from "motion/react";\nimport { QRCodeSVG } from "qrcode.react";'
  );
}

// Add the button
code = code.replace(
  /<span>Cetak Tabel Absensi<\/span>\s*<\/button>\s*<\/div>/,
  `<span>Cetak Tabel Absensi</span>
                    </button>
                    <button
                      onClick={() => setShowPrintQrModal(true)}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center space-x-1.5 active:scale-95 cursor-pointer"
                    >
                      <Scan className="w-4 h-4" />
                      <span>Cetak QR Absensi</span>
                    </button>
                  </div>`
);

if (!code.includes('Scan className=')) {
  code = code.replace(
    'Printer,',
    'Printer, Scan,'
  );
}

// Add the modal
const modalCode = `
      {/* 5. MODAL CETAK QR CODE ABSENSI */}
      {showPrintQrModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl w-full max-w-md p-6 relative shadow-2xl animate-fade-in text-center space-y-5">
            <button
              onClick={() => setShowPrintQrModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="space-y-2 pt-2">
              <h3 className="text-lg font-black text-white">Cetak QR Code Absensi</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pilih hari untuk men-generate barcode yang dapat discan oleh peserta untuk mencatat kehadirannya secara mandiri.
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-2 py-4">
              <span className="text-xs font-bold text-slate-400">Pilih Hari:</span>
              <select
                value={selectedQrDay}
                onChange={(e) => setSelectedQrDay(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none"
              >
                {Array.from({ length: settings.durationDays || 3 }).map((_, idx) => (
                  <option key={idx} value={idx + 1}>Hari ke-{idx + 1}</option>
                ))}
              </select>
            </div>

            <div id="print-qr-area" className="bg-white p-6 rounded-2xl mx-auto inline-block border-4 border-slate-200">
              <QRCodeSVG 
                value={\`ABSEN_DAY_\${selectedQrDay}\`} 
                size={220} 
                level="H" 
                includeMargin={false} 
              />
              <div className="mt-4 text-center">
                <h4 className="text-slate-900 font-black text-xl tracking-tight uppercase">ABSENSI HARI {selectedQrDay}</h4>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">{settings.eventTitle}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const printContent = document.getElementById("print-qr-area")?.innerHTML;
                  if (!printContent) return;
                  const printWindow = window.open("", "_blank");
                  printWindow?.document.write(\`
                    <html>
                      <head>
                        <title>Cetak QR Code Absensi - Hari \${selectedQrDay}</title>
                        <style>
                          body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #fff; }
                          .container { text-align: center; border: 4px solid #000; padding: 40px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
                          svg { width: 400px; height: 400px; }
                          h1 { margin-top: 30px; font-size: 32px; font-weight: 900; color: #000; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 5px; }
                          p { margin-top: 0; font-size: 16px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 2px; }
                          @media print {
                            body { -webkit-print-color-adjust: exact; }
                          }
                        </style>
                      </head>
                      <body>
                        <div class="container">
                          \${printContent}
                        </div>
                        <script>
                          setTimeout(() => {
                            window.print();
                            window.close();
                          }, 500);
                        </script>
                      </body>
                    </html>
                  \`);
                  printWindow?.document.close();
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer outline-none flex items-center justify-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Barcode</span>
              </button>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(
  '{showCertRevokeSuccess && (',
  modalCode + '\n      {showCertRevokeSuccess && ('
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
