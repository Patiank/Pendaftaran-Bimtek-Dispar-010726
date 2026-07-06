const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('const [showScanAttendanceModal, setShowScanAttendanceModal]')) {
  code = code.replace(
    'const [searchError, setSearchError] = useState("");',
    'const [searchError, setSearchError] = useState("");\n  const [showScanAttendanceModal, setShowScanAttendanceModal] = useState(false);'
  );
}

// Replace the return block for searchedParticipant
const oldReturn = `return (
                            <ParticipantCard`;
                            
const newReturn = `return (
                              <div className="space-y-4">
                                <ParticipantCard`;

code = code.replace(oldReturn, newReturn);

const oldClosing = `registrationIndex={idx !== -1 ? idx + 1 : undefined}
                            />
                          );
                        })()}`;

const newClosing = `registrationIndex={idx !== -1 ? idx + 1 : undefined}
                                />
                                <button
                                  onClick={() => setShowScanAttendanceModal(true)}
                                  className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-black rounded-2xl flex items-center justify-center space-x-2 active:scale-[0.98] transition-all shadow-xl shadow-slate-900/20 mt-4"
                                >
                                  <Scan className="w-5 h-5 text-emerald-400" />
                                  <span>Scan Barcode Absensi</span>
                                </button>
                              </div>
                            );
                        })()}
                        {showScanAttendanceModal && searchedParticipant && (
                          <ScanAttendance
                            participant={searchedParticipant}
                            onClose={() => setShowScanAttendanceModal(false)}
                            onSuccess={(day) => {
                              setShowScanAttendanceModal(false);
                              setGlobalSuccess(\`Berhasil merekam kehadiran untuk Hari ke-\${day}\`);
                              setTimeout(() => setGlobalSuccess(""), 4000);
                            }}
                          />
                        )}`;

code = code.replace(oldClosing, newClosing);

if (!code.includes('import { Scan } from "lucide-react"')) {
  code = code.replace(
    'AlertTriangle',
    'AlertTriangle,\n  Scan'
  );
}

fs.writeFileSync('src/App.tsx', code);
