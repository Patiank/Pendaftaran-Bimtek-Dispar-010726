const fs = require('fs');
let code = fs.readFileSync('src/components/KtpUploader.tsx', 'utf8');

code = code.replace(
  'onError: (msg: string) => void;',
  'onError: (msg: string, base64?: string) => void;'
);

code = code.replace(
  'const compressedBase64 = await compressImage(originalBase64);',
  'let compressedBase64 = "";\n        compressedBase64 = await compressImage(originalBase64);'
);

code = code.replace(
  /\} catch \(err: any\) \{\s*console\.error\("OCR parse exception:", err\);\s*onError\(err\?\.message \|\| "Koneksi terputus saat memproses gambar\. Silakan coba kembali\."\);\s*setPreview\(null\);\s*\}/g,
  `} catch (err: any) {
        console.error("OCR parse exception:", err);
        onError(err?.message || "Koneksi terputus saat memproses gambar. Silakan coba kembali.", compressedBase64 || undefined);
        if (!compressedBase64) setPreview(null);
      }`
);

fs.writeFileSync('src/components/KtpUploader.tsx', code);
