const fs = require('fs');
let code = fs.readFileSync('src/components/KtpUploader.tsx', 'utf8');

code = code.replace(
  /setStatusMessage\("Mengekstrak data dari KTP\.\.\."\);[\s\S]*?\} catch \(err: any\) \{/m,
  `setStatusMessage("Menyimpan foto KTP...");
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
      } catch (err: any) {`
);

fs.writeFileSync('src/components/KtpUploader.tsx', code);
