const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const oldPrint = `{sigSrc && (
                                      <img src={sigSrc} alt="ttd" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-12 max-w-full opacity-80" />
                                    )}`;

const newPrint = `{sigSrc && (
                                      sigSrc === "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" ? (
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full">
                                          <span className="text-[10px] font-bold text-gray-800 block">✓ Hadir</span>
                                          {dayAtt?.attendedAt && <span className="text-[8px] text-gray-500 font-mono block">{new Date(dayAtt.attendedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>}
                                        </div>
                                      ) : (
                                        <>
                                          <img src={sigSrc} alt="ttd" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-12 max-w-full opacity-80" />
                                          {i > 0 && dayAtt?.attendedAt && (
                                            <div className="absolute bottom-1 right-1 text-[7px] text-gray-600 font-bold bg-white/80 px-1 rounded-sm">
                                              {new Date(dayAtt.attendedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                          )}
                                        </>
                                      )
                                    )}`;

const oldInteractive = `{sigSrc ? (
                                      <div className="bg-white rounded-lg p-1 w-full border border-white/10 h-14 flex items-center justify-center relative group">
                                        <img
                                          src={sigSrc}
                                          alt={\`Tanda tangan hari \${i+1}\`}
                                          className="max-w-full max-h-full object-contain mix-blend-multiply opacity-90"
                                        />`;

const newInteractive = `{sigSrc ? (
                                      <div className="bg-white rounded-lg p-1 w-full border border-white/10 h-14 flex items-center justify-center relative group">
                                        {sigSrc === "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" ? (
                                          <div className="text-center w-full">
                                            <span className="text-[10px] font-bold text-teal-600 block">✓ Hadir (Scan)</span>
                                            {dayAtt?.attendedAt && <span className="text-[8px] text-slate-500 font-mono">{new Date(dayAtt.attendedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>}
                                          </div>
                                        ) : (
                                          <>
                                            <img
                                              src={sigSrc}
                                              alt={\`Tanda tangan hari \${i+1}\`}
                                              className="max-w-full max-h-full object-contain mix-blend-multiply opacity-90"
                                            />
                                            {i > 0 && dayAtt?.attendedAt && (
                                              <div className="absolute bottom-0 right-0 bg-white/80 px-1 rounded-tl text-[7px] text-teal-600 font-bold">
                                                {new Date(dayAtt.attendedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                              </div>
                                            )}
                                          </>
                                        )}`;

code = code.replace(oldPrint, newPrint);
code = code.replace(oldInteractive, newInteractive);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
