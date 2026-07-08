const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const targetStr = `                                  <td key={\`presence-day-cell-\${reg.id || idx}-\${i}\`} className="p-1 border border-black h-16 relative align-top w-32 bg-white text-center">
                                    <span className="text-[7.5px] text-gray-400 font-bold absolute top-1 left-1.5">{\`\${idx + 1}.\`}</span>
                                    {sigSrc && (
                                      sigSrc === "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" ? (
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full">
                                          <span className="text-[10px] font-bold text-gray-800 block">✓ Hadir</span>
                                          <span className="text-[8px] text-gray-600 block">Scan Barcode</span>
                                          
                                        </div>
                                      ) : (
                                        <>
                                          <img src={sigSrc} alt="ttd" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-12 max-w-full opacity-80" />
                                          
                                        </>
                                      )
                                    )}
                                  </td>`;

// Actually let's just regex match the block
const regex = /<td key=\{`presence-day-cell-\$\{reg\.id \|\| idx\}-\$\{i\}`\}[^]*?<\/td>/;
const match = code.match(regex);
if (match) {
  const replaceStr = `<td key={\`presence-day-cell-\${reg.id || idx}-\${i}\`} className="p-0 border border-black h-16 relative w-32 bg-white align-middle">
                                    <span className="text-[7.5px] text-gray-400 font-bold absolute top-1 left-1.5 z-10">{idx + 1}.</span>
                                    <div className="w-full h-full flex items-center justify-center absolute inset-0 p-1">
                                      {sigSrc && (
                                        sigSrc === "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" ? (
                                          <div className="text-center w-full">
                                            <span className="text-[10px] font-bold text-gray-800 block">✓ Hadir</span>
                                            <span className="text-[8px] text-gray-600 block">Scan Barcode</span>
                                          </div>
                                        ) : (
                                          <img src={sigSrc} alt="ttd" className="max-h-12 max-w-[90%] object-contain opacity-90 mix-blend-multiply" />
                                        )
                                      )}
                                    </div>
                                  </td>`;
  code = code.replace(regex, replaceStr);
  fs.writeFileSync('src/components/AdminPanel.tsx', code);
  console.log("Replaced successfully!");
} else {
  console.log("No match found");
}
