const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The block to replace for searchedParticipant
code = code.replace(
  `                              isCertificateFeatureDisabled={settings.isCertificateFeatureDisabled}
                              registrationIndex={idx !== -1 ? idx + 1 : undefined}
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
                        )}`,
  `                              isCertificateFeatureDisabled={settings.isCertificateFeatureDisabled}
                              registrationIndex={idx !== -1 ? idx + 1 : undefined}
                            />
                          );
                        })()}`
);

// The block to replace for recentRegistration
code = code.replace(
  `                              isCertificateFeatureDisabled={settings.isCertificateFeatureDisabled}
                              registrationIndex={idx !== -1 ? idx + 1 : undefined}
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
                        )}`,
  `                              isCertificateFeatureDisabled={settings.isCertificateFeatureDisabled}
                              registrationIndex={idx !== -1 ? idx + 1 : undefined}
                            />
                          );
                        })()}`
);

// Let's remove ScanAttendance from App.tsx since it's no longer used
code = code.replace(
  'import { ScanAttendance } from "./components/ScanAttendance";\n',
  ''
);

// We changed the `<ParticipantCard` inside a div to just `<ParticipantCard`... oh wait, we added `<div className="space-y-4">` in front of ParticipantCard.
// So let's replace `<div className="space-y-4">\n                                <ParticipantCard` back to `<ParticipantCard` 
code = code.replace(/<div className="space-y-4">\s*<ParticipantCard/g, '<ParticipantCard');

fs.writeFileSync('src/App.tsx', code);
