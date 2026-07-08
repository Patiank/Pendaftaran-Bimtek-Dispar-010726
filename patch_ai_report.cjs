const fs = require('fs');
let code = fs.readFileSync('src/components/AiReportTab.tsx', 'utf8');

code = code.replace(
  '<div id="ai-report-content" className="bg-white p-10 sm:p-16 rounded-2xl shadow-xl border border-slate-200 max-w-4xl mx-auto space-y-8 text-slate-800">',
  '<div className="overflow-x-auto bg-gray-100/50 p-4"><div id="ai-report-content" className="bg-white px-[20mm] py-[25mm] shadow-xl border border-slate-200 w-[210mm] min-h-[297mm] mx-auto space-y-8 text-slate-800 box-border text-sm leading-relaxed">'
);

// close the wrapper div
code = code.replace(
  '            <div dangerouslySetInnerHTML={{ __html: aiReportHtml }} className="prose prose-slate max-w-none prose-h3:text-lg prose-h3:font-bold prose-p:leading-relaxed" />\n          </div>',
  '            <div dangerouslySetInnerHTML={{ __html: aiReportHtml }} className="prose prose-slate max-w-none prose-h3:text-lg prose-h3:font-bold prose-p:leading-relaxed" />\n          </div>\n          </div>'
);

fs.writeFileSync('src/components/AiReportTab.tsx', code);
