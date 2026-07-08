import React, { useState } from "react";
import { AppSettings, Registration, Attendance } from "../types";
import { Sparkles, FileText, Download, Upload, AlertTriangle, FileUp, FileCheck2, BarChart2, TrendingUp, CalendarDays, MapPin } from "lucide-react";
import { toPng } from 'html-to-image';
import jsPDF from "jspdf";

interface AiReportTabProps {
  registrations: Registration[];
  attendance: Attendance[];
  settings: AppSettings;
}

export const AiReportTab: React.FC<AiReportTabProps> = ({
  registrations,
  attendance,
  settings,
}) => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [rundownFile, setRundownFile] = useState<File | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRundownFile(e.target.files[0]);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const generateReport = async () => {
    if (!rundownFile) {
      setError("Silakan unggah dokumen rundown (jadwal) kegiatan terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const base64File = await fileToBase64(rundownFile);
      
      const regStats = {
        total: registrations.length,
        male: registrations.filter(r => r.gender === "Laki-laki").length,
        female: registrations.filter(r => r.gender === "Perempuan").length,
      };
      
      const kabKotaCounts: Record<string, number> = {};
      registrations.forEach(r => {
        const k = r.kabKota || "Tidak Diketahui";
        kabKotaCounts[k] = (kabKotaCounts[k] || 0) + 1;
      });

      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings,
          stats: regStats,
          locations: kabKotaCounts,
          rundownBase64: base64File,
          mimeType: rundownFile.type,
          additionalInfo
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal membuat laporan");
      
      setReportData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    const reportElement = document.getElementById("ai-report-content");
    if (!reportElement) return;
    
    try {
      const imgData = await toPng(reportElement, { cacheBust: true, style: { background: 'white' }, pixelRatio: 2 });
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // If the image height is larger than 1 page, we can split it or just let it overflow for now as a simple PDF
      // In JS PDF, a single long image will just be on 1 page and scaled or clipped.
      // Actually we should create multiple pages if it's too long
      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Laporan_Kegiatan_${settings.eventTitle || "Bimtek"}.pdf`);
    } catch (err) {
      console.error("Gagal mendownload PDF", err);
      alert("Gagal mengunduh PDF");
    }
  };

  const downloadWord = async () => {
    try {
      const reportElement = document.getElementById("ai-report-content");
      if (!reportElement) return;

      const html = reportElement.innerHTML;
      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Laporan Kegiatan</title>
        <style>
          body { font-family: Arial, sans-serif; }
          h1, h2, h3 { color: #333; }
          .prose { line-height: 1.5; }
        </style>
        </head>
        <body>${html}</body>
        </html>
      `;
      const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Laporan_Kegiatan_${settings.eventTitle || "Bimtek"}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal mendownload Word", err);
      alert("Gagal mengunduh Word");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <span>AI Report Generator</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">Sistem AI akan menyusun Laporan Resmi berdasarkan data peserta dan dokumen Rundown Kegiatan.</p>
        </div>

        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center">
          <input type="file" id="rundown-upload" className="hidden" accept="image/*,application/pdf" onChange={handleFileUpload} />
          <label htmlFor="rundown-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
            {rundownFile ? (
              <>
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <FileCheck2 className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="text-sm font-semibold text-emerald-700">{rundownFile.name}</span>
                <span className="text-xs text-slate-500">Klik untuk mengganti dokumen</span>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <FileUp className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Unggah Dokumen Rundown / Jadwal</span>
                <span className="text-xs text-slate-500">Format: Gambar (JPG/PNG) atau PDF</span>
              </>
            )}
          </label>
        </div>
        
        <div className="space-y-2 text-left">
          <label className="text-sm font-bold text-slate-700 block pl-1">Informasi Tambahan untuk Analisis (Opsional)</label>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Tambahkan informasi penting yang tidak tertulis dalam rundown, atau panduan khusus untuk laporan..."
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow resize-y"
          ></textarea>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button 
          onClick={generateReport}
          disabled={loading || !rundownFile}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md"
        >
          {loading ? (
            <span className="animate-pulse">AI sedang menyusun laporan...</span>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Buat Laporan Sekarang</span>
            </>
          )}
        </button>
      </div>

      {reportData && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button onClick={downloadWord} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download Microsoft Word</span>
            </button>
            <button onClick={downloadPdf} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>

          <div className="overflow-x-auto bg-gray-100/50 p-4"><div id="ai-report-content" className="bg-white px-[20mm] py-[25mm] shadow-xl border border-slate-200 w-[210mm] min-h-[297mm] mx-auto space-y-8 text-slate-800 box-border text-sm leading-relaxed">
            {/* Kop Laporan / Header */}
            <div className="text-center border-b-2 border-slate-800 pb-6 space-y-2">
              <h1 className="text-2xl font-black uppercase tracking-wider">Laporan Pelaksanaan Kegiatan</h1>
              <h2 className="text-xl font-bold text-slate-700 uppercase">{settings.eventTitle || "Bimbingan Teknis"}</h2>
            </div>

            {/* Identitas Kegiatan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center space-x-1"><CalendarDays className="w-3 h-3" /> <span>Waktu</span></span>
                <p className="font-semibold text-sm">{settings.startDate || "-"} ({settings.durationDays || 1} Hari)</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center space-x-1"><MapPin className="w-3 h-3" /> <span>Lokasi</span></span>
                <p className="font-semibold text-sm">{settings.location || "-"}</p>
              </div>
            </div>

            {/* AI Generated Content */}
            <div className="prose prose-slate max-w-none text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: reportData.htmlContent }} />
            
            {/* Infografis Statistik */}
            <div className="pt-6 border-t border-slate-200 space-y-6">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <BarChart2 className="w-5 h-5 text-emerald-600" />
                <span>Infografis Statistik Kehadiran</span>
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center">
                  <div className="text-2xl font-black text-emerald-700">{registrations.length}</div>
                  <div className="text-xs font-bold text-emerald-600 uppercase mt-1">Total Peserta</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-center">
                  <div className="text-2xl font-black text-blue-700">{registrations.filter(r => r.gender === "Laki-laki").length}</div>
                  <div className="text-xs font-bold text-blue-600 uppercase mt-1">Laki-Laki</div>
                </div>
                <div className="bg-pink-50 border border-pink-200 p-4 rounded-xl text-center">
                  <div className="text-2xl font-black text-pink-700">{registrations.filter(r => r.gender === "Perempuan").length}</div>
                  <div className="text-xs font-bold text-pink-600 uppercase mt-1">Perempuan</div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-sm font-bold text-slate-700 mb-4">Distribusi Peserta Berdasarkan Daerah</h4>
                <div className="space-y-3">
                  {Object.entries(registrations.reduce((acc, curr) => {
                    const kota = curr.kabKota || "Lainnya";
                    acc[kota] = (acc[kota] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>))
                    .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
                    .map(([kota, count]: [string, number], i: number) => (
                    <div key={i} className="flex items-center space-x-3 text-sm">
                      <span className="w-32 truncate font-semibold">{kota}</span>
                      <div className="flex-1 bg-slate-100 h-4 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(count / Math.max(1, registrations.length)) * 100}%` }}></div>
                      </div>
                      <span className="w-12 text-right font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Barcode Absensi Penjelasan */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center gap-6 mt-8">
                <div className="w-32 h-32 bg-white border-4 border-emerald-600 p-2 rounded-xl flex-shrink-0">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=contoh_barcode_absensi" alt="Barcode Absensi" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-2 text-base">Metode Absensi QR Code Digital</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Sebagai bagian dari digitalisasi layanan, panitia menyediakan fitur pemindaian Barcode (QR Code) untuk absensi mandiri peserta. Setiap peserta yang hadir diwajibkan melakukan pemindaian pada barcode yang telah disiapkan di meja registrasi panitia setiap harinya. Sistem secara otomatis mencatat waktu kehadiran harian dengan akurasi tinggi dan memvalidasi peserta sesuai dengan database registrasi online.
                  </p>
                </div>
              </div>
            </div>

            {/* Tanda Tangan */}
            <div className="pt-16 pb-8 flex justify-end">
              <div className="text-center w-64 space-y-20">
                <div>
                  <p className="text-sm font-semibold">Dibuat di: {settings.location?.split(',')[0] || "Padang"}</p>
                  <p className="text-sm font-semibold">Tanggal: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm underline underline-offset-4">{settings.kepalaBidangName || "_______________________"}</p>
                  <p className="text-xs text-slate-600">NIP. {settings.kepalaBidangNip || "_______________________"}</p>
                </div>
              </div>
            </div>

          </div>
          </div>
        </div>
      )}

    </div>
  );
};
