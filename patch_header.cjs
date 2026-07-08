const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const regex = /\{\/\* Header \(Tanpa Logo\) \*\/\}[^]*?<\/div>\s*<\/div>\s*<\/div>\s*\{printType === "single-card"/;
const match = code.match(regex);
if (match) {
  const replacement = \`{/* Header (Dengan Logo) */}
            <div className="border-b-4 border-double border-black pb-4 mb-6 flex items-center justify-between px-2 sm:px-8">
              <div className="w-16 sm:w-20 shrink-0">
                <img src={logoSumbarBase64} alt="Logo Sumbar" className="w-full h-auto object-contain" />
              </div>
              <div className="flex-1 text-center px-4">
                <h1 className="text-sm sm:text-lg font-bold tracking-wide uppercase text-black">
                  Pemerintah Provinsi Sumatera Barat
                </h1>
                <h2 className="text-base sm:text-xl font-extrabold tracking-wider uppercase text-black mt-0.5 leading-tight">
                  Dinas Pariwisata Provinsi Sumatera Barat
                </h2>
                <div className="text-[10px] sm:text-xs font-semibold text-black mt-1 leading-snug">
                  <p>Jl. Khatib Sulaiman no.7 Padang - Sumatera Barat</p>
                  <p>Telp. (0751) 7055183</p>
                </div>
              </div>
              <div className="w-16 sm:w-20 shrink-0">
                {/* Kosong untuk menyeimbangkan flexbox supaya teks benar-benar di tengah */}
              </div>
            </div>

            {printType === "single-card"\`;
            
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/components/AdminPanel.tsx', code);
  console.log("Header replaced");
} else {
  console.log("No match found for header");
}
