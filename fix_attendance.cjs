const fs = require('fs');

let code = fs.readFileSync('src/components/AttendanceForm.tsx', 'utf8');

// Add PenTool to imports
if (!code.includes('PenTool')) {
    code = code.replace(/import \{([^}]+)\} from "lucide-react";/, 'import {$1, PenTool, Eraser} from "lucide-react";');
}

// Add signature hooks inside component
const hookInjection = `
  const [success, setSuccess] = useState(false);

  // Signature states
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = "#059669";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasDrawn(true);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
      }
    }
    setHasDrawn(false);
  };
`;

code = code.replace(/const \[success, setSuccess\] = useState\(false\);/, hookInjection);

// Replace useRef if not imported
if (!code.includes('useRef')) {
    code = code.replace(/import React, \{ useState, useEffect \} from "react";/, 'import React, { useState, useEffect, useRef } from "react";');
}

// Ensure participant reset clears signature too
code = code.replace(/setParticipant\(null\);/, 'setParticipant(null);\n    clearCanvas();');

// Inject the signature pad UI before the scan button
const signaturePadUI = `
                {/* Signature Pad */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <label className="text-xs font-bold text-gray-700 uppercase flex items-center space-x-1.5">
                    <PenTool className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span>Tanda Tangan Peserta (Digital)</span>
                  </label>
                  
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-slate-50 overflow-hidden group hover:border-emerald-400 transition-colors">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={150}
                      className="w-full h-[150px] cursor-crosshair touch-none"
                      onMouseDown={startDrawing}
                      onMouseUp={stopDrawing}
                      onMouseOut={stopDrawing}
                      onMouseMove={draw}
                      onTouchStart={startDrawing}
                      onTouchEnd={stopDrawing}
                      onTouchMove={draw}
                    />
                    {!hasDrawn && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center flex-col text-slate-400 space-y-2">
                        <PenTool className="w-8 h-8 opacity-20 group-hover:text-emerald-500 group-hover:opacity-50 transition-all" />
                        <p className="text-[10px] uppercase font-bold tracking-wider">Area Tanda Tangan</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="py-1.5 px-3 border border-red-200 text-red-650 hover:bg-red-50 active:scale-[0.98] transition-all rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5"
                    >
                      <Eraser className="w-3.5 h-3.5" />
                      <span>Hapus Tanda Tangan</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={!hasDrawn}
                    onClick={() => setShowScanModal(true)}
                    className={\`w-full py-4 font-black rounded-2xl flex items-center justify-center space-x-3 active:scale-[0.98] transition-all shadow-xl \${
                      hasDrawn
                        ? "bg-slate-900 hover:bg-black text-white shadow-slate-900/20"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    }\`}
                  >
                    <Scan className={\`w-6 h-6 \${hasDrawn ? "text-emerald-400" : "text-slate-400"}\`} />
                    <span className="text-base">Scan Barcode H-\${selectedDay}</span>
                  </button>
                </div>
`;

code = code.replace(/<div className="pt-2">[\s\S]*?<\/div>\s*<\/div>\s*\)}/, signaturePadUI + '\n              </div>\n            )}');

// Pass signatureBase64 to ScanAttendance modal
code = code.replace(/<ScanAttendance\s+participant=\{participant\}/, '<ScanAttendance\n          signatureBase64={canvasRef.current?.toDataURL("image/png")}\n          participant={participant}');


fs.writeFileSync('src/components/AttendanceForm.tsx', code);
