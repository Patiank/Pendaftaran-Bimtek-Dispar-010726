const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(
  '<div id="print-content-area" className="bg-white text-black font-sans max-w-4xl mx-auto p-4 md:p-8 print:p-0">',
  '<div className="overflow-x-auto bg-gray-100/50 pb-10 pt-4"><div id="print-content-area" className="bg-white text-black font-sans mx-auto w-[210mm] min-h-[297mm] p-[15mm] shadow-lg print:shadow-none print:w-[210mm] print:h-[297mm] print:m-0 print:p-[10mm] box-border">'
);

code = code.replace(
  '{/* Header (Tanpa Logo) */}',
  '{/* Header (Tanpa Logo) */}'
);

// find the closing tag for print-content-area. It's closed at the end of the print layout block.
// Let's just find the closing tag. Wait, instead of appending closing tag, we just wrap it by regex.
