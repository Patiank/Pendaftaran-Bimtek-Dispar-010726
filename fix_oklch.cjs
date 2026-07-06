const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const targetStr = `onClick={async () => {
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
                }}`;

const replacement = `onClick={async () => {
                  const element = document.getElementById("print-qr-area");
                  if (!element) return;
                  const originalGetComputedStyle = window.getComputedStyle;
                  try {
                    // Override getComputedStyle to filter out oklch and oklab colors for html2canvas compatibility
                    window.getComputedStyle = function (elt, pseudoElt) {
                      const style = originalGetComputedStyle.call(window, elt, pseudoElt);
                      
                      const safeColor = (value) => {
                        if (typeof value === "string" && (value.includes("oklch") || value.includes("oklab"))) {
                          if (value.includes("/")) {
                            const parts = value.split("/");
                            const alphaAttr = parts[parts.length - 1].replace(")", "").trim();
                            const alpha = parseFloat(alphaAttr);
                            return isNaN(alpha) ? "rgba(0,0,0,0)" : \`rgba(71, 85, 105, \${alpha})\`;
                          }
                          return "rgb(71, 85, 105)"; // Fallback slate-500
                        }
                        return value;
                      };

                      return new Proxy(style, {
                        get(target, prop) {
                          const value = target[prop];
                          if (typeof value === "function") {
                            const originalMethod = value;
                            return function (...args) {
                              const result = originalMethod.apply(target, args);
                              return safeColor(result);
                            };
                          }
                          return safeColor(value);
                        },
                      });
                    };

                    const { default: html2canvas } = await import("html2canvas");
                    const canvas = await html2canvas(element, { scale: 4, backgroundColor: "#ffffff" });
                    const dataUrl = canvas.toDataURL("image/png");
                    const link = document.createElement("a");
                    link.download = \`QR_Absensi_Hari_\${selectedQrDay}.png\`;
                    link.href = dataUrl;
                    link.click();
                  } catch (err) {
                    console.error("Failed to download QR", err);
                  } finally {
                    window.getComputedStyle = originalGetComputedStyle;
                  }
                }}`;

code = code.replace(targetStr, replacement);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
