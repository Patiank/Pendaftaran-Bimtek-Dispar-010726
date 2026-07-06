const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldReturn = `return (
                            <ParticipantCard
                              registration={recentRegistration}`;
                            
const newReturn = `return (
                              <div className="space-y-4">
                                <ParticipantCard
                                  registration={recentRegistration}`;

code = code.replace(oldReturn, newReturn);

const oldClosing = `registrationIndex={idx !== -1 ? idx + 1 : undefined}
                            />
                          );
                        })()}
                      </div>`;

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
                        {showScanAttendanceModal && recentRegistration && (
                          <ScanAttendance
                            participant={recentRegistration}
                            onClose={() => setShowScanAttendanceModal(false)}
                            onSuccess={(day) => {
                              setShowScanAttendanceModal(false);
                              setGlobalSuccess(\`Berhasil merekam kehadiran untuk Hari ke-\${day}\`);
                              setTimeout(() => setGlobalSuccess(""), 4000);
                            }}
                          />
                        )}
                      </div>`;

code = code.replace(oldClosing, newClosing);

fs.writeFileSync('src/App.tsx', code);
