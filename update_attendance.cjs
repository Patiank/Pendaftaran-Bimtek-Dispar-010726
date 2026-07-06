const fs = require('fs');
let code = fs.readFileSync('src/components/AttendanceForm.tsx', 'utf8');

// Insert day selector before the scan button
const scanButtonCode = `            {participant && (
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setShowScanModal(true)}
                  className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl flex items-center justify-center space-x-3 active:scale-[0.98] transition-all shadow-xl shadow-slate-900/20"
                >
                  <Scan className="w-6 h-6 text-emerald-400" />
                  <span className="text-base">Scan Barcode Absensi</span>
                </button>
              </div>
            )}`;

const daySelectorCode = `            {participant && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Pilih Hari Kehadiran
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: availableDaysCount }).map((_, idx) => {
                      const dayNum = idx + 2;
                      return (
                        <button
                          key={\`att-day-btn-\${dayNum}\`}
                          type="button"
                          onClick={() => setSelectedDay(dayNum)}
                          className={\`py-2 px-1 rounded-lg text-xs font-bold border transition-all \${
                            selectedDay === dayNum
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/10"
                              : "bg-slate-50 border-gray-100 text-gray-700 hover:bg-slate-100 hover:border-gray-200"
                          }\`}
                        >
                          H-\${dayNum}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowScanModal(true)}
                    className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl flex items-center justify-center space-x-3 active:scale-[0.98] transition-all shadow-xl shadow-slate-900/20"
                  >
                    <Scan className="w-6 h-6 text-emerald-400" />
                    <span className="text-base">Scan Barcode H-{selectedDay}</span>
                  </button>
                </div>
              </div>
            )}`;

code = code.replace(scanButtonCode, daySelectorCode);

// Pass expectedDay to ScanAttendance
code = code.replace(
  '<ScanAttendance\n          participant={participant}',
  '<ScanAttendance\n          participant={participant}\n          expectedDay={selectedDay}'
);

fs.writeFileSync('src/components/AttendanceForm.tsx', code);
