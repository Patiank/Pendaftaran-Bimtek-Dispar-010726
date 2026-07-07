const fs = require('fs');
let code = fs.readFileSync('src/components/KtpUploader.tsx', 'utf8');

code = code.replace(
  /\} else \{\s*setStatusMessage\("Mengekstrak data dari KTP\.\.\."\);[\s\S]*?catch \(err: any\) \{[\s\S]*?setLoading\(false\);\n      \}\n    \};\n    reader.readAsDataURL\(file\);\n  \};/,
  `} else {
          setStatusMessage("Menyimpan foto KTP...");
          // No OCR, just return the compressed image
          onScanComplete({
            nik: "",
            name: "",
            address: "",
            kabKota: "",
            color: "#0F6251",
            ktpBase64: compressedBase64,
            isSelfie: false,
          });
        }
      } catch (err: any) {
        console.error("Compression Error:", err);
        onError(err.message || "Gagal memproses gambar.", compressedBase64);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };`
);

// Replace "Scan KTP Otomatis" text with "Foto KTP"
code = code.replace(/Scan KTP Otomatis/g, "Foto KTP (Tanpa Scan)");
code = code.replace(/Menganalisis Dokumen\.\.\./g, "Menyimpan Dokumen...");
code = code.replace(/Silakan pilih opsi pengambilan foto KTP di bawah ini untuk memulai pengisian data secara otomatis\./g, "Silakan unggah foto KTP Anda sebagai kelengkapan identitas.");
code = code.replace(/Scan KTP secara otomatis atau gunakan Foto Selfie jika tidak membawa KTP/g, "Unggah foto KTP atau gunakan Foto Selfie sebagai kelengkapan identitas.");

fs.writeFileSync('src/components/KtpUploader.tsx', code);
