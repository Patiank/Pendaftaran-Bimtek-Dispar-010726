import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, AlertTriangle, Info , PenTool, Eraser} from "lucide-react";
import { Registration, Attendance } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { ScanAttendance } from "./ScanAttendance";
import { Scan } from "lucide-react";

interface AttendanceFormProps {
  durationDays: number;
  onAttendanceSubmit: (data: Attendance) => Promise<void>;
  registrations: Registration[];
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({
  durationDays,
  registrations,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedDay, setSelectedDay] = useState(1); // Starts from Day 2 as requested
  const [showScanModal, setShowScanModal] = useState(false);
  const [participant, setParticipant] = useState<Registration | null>(null);
  
  
  const [success, setSuccess] = useState(false);

  // Signature states
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = "#059669";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasDrawn(true);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
      }
    }
    setHasDrawn(false);
  };


  // Check if value matches registered NIK OR No. HP/WhatsApp OR Name
  useEffect(() => {
    const cleanVal = inputValue.trim();
    let newParticipant = null;
    
    if (cleanVal.length >= 3) {
      newParticipant = registrations.find((reg) => {
        const cleanValDigits = cleanVal.replace(/\D/g, "");
        const matchNik = reg.nik && cleanValDigits !== "" && reg.nik.replace(/\D/g, "").includes(cleanValDigits);
        const matchPhone = reg.phone && cleanValDigits !== "" && reg.phone.replace(/[^0-9]/g, "").includes(cleanValDigits);
        const matchName = reg.name && reg.name.toLowerCase().includes(cleanVal.toLowerCase());
        return matchNik || matchPhone || matchName;
      }) || null;
    }
    
    setParticipant(newParticipant);
  }, [inputValue, registrations]);

  const handleResetAll = () => {
    setInputValue("");
    setParticipant(null);
    clearCanvas();
  };

  // If duration is set to 1 day only, attendance is not needed since day 1 is represented by register
  const availableDaysCount = durationDays;

  return (
    <div id="attendance-form-card" className="w-full max-w-md mx-auto bg-white rounded-2xl border border-slate-100 p-6 shadow-xl animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">Presensi Harian</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Silakan mengisi absensi Anda</p>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="attendance-success-feedback"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-6 text-center space-y-4"
          >
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-black text-emerald-900">Kehadiran Direkam!</h3>
              <p className="text-sm text-emerald-700 mt-1 leading-relaxed">
                Tanda tangan dan kehadiran Anda untuk <strong>Hari ke-{selectedDay}</strong> telah tersimpan di sistem data.
              </p>
            </div>
          </motion.div>
        ) : availableDaysCount === 0 ? (
          <div key="one-day-only-note" className="text-center py-8 text-gray-400 space-y-2">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
            <p className="text-xs font-semibold text-gray-700">Kegiatan Berlangsung 1 Hari Saja</p>
            <p className="text-[11px] text-gray-500 max-w-xs mx-auto">Tidak memerlukan menu absensi susulan karena kegiatan ini diset selesai dalam satu hari penuh.</p>
          </div>
        ) : (
          <form key="attendance-active-form" onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* SEARCH PANEL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                NIK atau No. HP / WhatsApp
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Masukkan NIK atau No. HP terdaftar..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold"
                required
              />

              {/* DYNAMIC REGISTERED PESERTA PREVIEW */}
              <AnimatePresence mode="wait">
                {participant ? (
                  <motion.div
                    key="participant-found"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center space-x-2 bg-emerald-50 border border-emerald-100 p-3 rounded-xl"
                  >
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                    <div className="flex-1 truncate">
                      <p className="text-[10px] uppercase font-bold text-emerald-800">Peserta Teridentifikasi</p>
                      <p className="text-xs font-bold text-emerald-950 truncate">{participant.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{participant.kabKota}</p>
                    </div>
                  </motion.div>
                ) : inputValue.length >= 8 ? (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    key="not-found"
                    className="flex items-center space-x-2 bg-amber-50 border border-amber-100 p-3 rounded-xl"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <p className="text-xs text-amber-900 leading-tight">
                      Data tidak ditemukan. Pastikan NIK atau No. HP Anda sudah melakukan pendaftaran peserta terlebih dahulu.
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {participant && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Pilih Hari Kehadiran
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: availableDaysCount }).map((_, idx) => {
                      const dayNum = idx + 1;
                      return (
                        <button
                          key={`att-day-btn-${dayNum}`}
                          type="button"
                          onClick={() => setSelectedDay(dayNum)}
                          className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all ${
                            selectedDay === dayNum
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/10"
                              : "bg-slate-50 border-gray-100 text-gray-700 hover:bg-slate-100 hover:border-gray-200"
                          }`}
                        >
                          H-{dayNum}
                        </button>
                      );
                    })}
                  </div>
                </div>

                
                {/* Signature Pad */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <label className="text-xs font-bold text-gray-700 uppercase flex items-center space-x-1.5">
                    <PenTool className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span>Tanda Tangan Peserta (Digital)</span>
                  </label>
                  
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-slate-50 overflow-hidden group hover:border-emerald-400 transition-colors">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={150}
                      className="w-full h-[150px] cursor-crosshair touch-none"
                      onMouseDown={startDrawing}
                      onMouseUp={stopDrawing}
                      onMouseOut={stopDrawing}
                      onMouseMove={draw}
                      onTouchStart={startDrawing}
                      onTouchEnd={stopDrawing}
                      onTouchMove={draw}
                    />
                    {!hasDrawn && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center flex-col text-slate-400 space-y-2">
                        <PenTool className="w-8 h-8 opacity-20 group-hover:text-emerald-500 group-hover:opacity-50 transition-all" />
                        <p className="text-[10px] uppercase font-bold tracking-wider">Area Tanda Tangan</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="py-1.5 px-3 border border-red-200 text-red-650 hover:bg-red-50 active:scale-[0.98] transition-all rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5"
                    >
                      <Eraser className="w-3.5 h-3.5" />
                      <span>Hapus Tanda Tangan</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={!hasDrawn}
                    onClick={() => setShowScanModal(true)}
                    className={`w-full py-4 font-black rounded-2xl flex items-center justify-center space-x-3 active:scale-[0.98] transition-all shadow-xl ${
                      hasDrawn
                        ? "bg-slate-900 hover:bg-black text-white shadow-slate-900/20"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    <Scan className={`w-6 h-6 ${hasDrawn ? "text-emerald-400" : "text-slate-400"}`} />
                    <span className="text-base">Scan Barcode H-{selectedDay}</span>
                  </button>
                </div>

              </div>
            )}
          </form>
        )}
      </AnimatePresence>
      
      {showScanModal && participant && (
        <ScanAttendance
          signatureBase64={canvasRef.current?.toDataURL("image/png")}
          participant={participant}
          expectedDay={selectedDay}
          onClose={() => setShowScanModal(false)}
          onSuccess={(day) => {
            setShowScanModal(false);
            setSuccess(true);
            setSelectedDay(day); // just to show which day in the success screen
            setTimeout(() => {
              setSuccess(false);
              handleResetAll();
            }, 5000);
          }}
        />
      )}
    </div>
  );
};
