import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { X, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { dbService } from "../services/dbService";
import { Registration, Attendance } from "../types";

interface ScanAttendanceProps {
  signatureBase64?: string;
  participant: Registration;
  expectedDay?: number;
  onClose: () => void;
  onSuccess: (day: number) => void;
}

export const ScanAttendance: React.FC<ScanAttendanceProps> = ({ participant, expectedDay, signatureBase64, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successDay, setSuccessDay] = useState<number | null>(null);

  const handleScan = async (detectedCodes: any[]) => {
    if (loading || successDay !== null) return;
    
    const code = detectedCodes[0]?.rawValue;
    if (!code) return;
    
    if (code.startsWith("ABSEN_DAY_")) {
      const day = parseInt(code.replace("ABSEN_DAY_", ""), 10);
      if (!isNaN(day)) {
        if (expectedDay && day !== expectedDay) {
          setError(`QR Code tidak valid. Ini adalah QR Code untuk H-${day}, namun Anda memilih H-${expectedDay}.`);
          return;
        }
        setLoading(true);
        setError("");
        
        try {
          const attendanceData: Attendance = {
            id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            nik: participant.nik,
            name: participant.name,
            day: day,
            signatureBase64: signatureBase64 || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
            attendedAt: new Date().toISOString(),
            bimtekTitle: participant.bimtekTitle || "",
            bimtekId: participant.bimtekId || "",
          };
          
          await dbService.addAttendance(attendanceData);
          setSuccessDay(day);
          setTimeout(() => {
            onSuccess(day);
          }, 2500);
        } catch (err: any) {
          setError(err.message || "Gagal menyimpan absensi");
        } finally {
          setLoading(false);
        }
      } else {
        setError("QR Code tidak valid untuk absensi acara ini.");
      }
    } else {
      setError("QR Code tidak dikenali.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl overflow-hidden relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white bg-black/50 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 text-center border-b border-slate-800">
          <h3 className="text-lg font-black text-white tracking-tight">Scan Kehadiran {expectedDay ? `H-${expectedDay}` : ""}</h3>
          <p className="text-xs text-slate-400 mt-1">Arahkan kamera ke QR Code Absensi {expectedDay ? `Hari ke-${expectedDay}` : ""}</p>
        </div>

        <div className="relative aspect-square bg-black">
          <AnimatePresence mode="wait">
            {successDay !== null ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-900/90 space-y-4 p-6 text-center"
              >
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white">Berhasil Absen!</h4>
                  <p className="text-sm text-emerald-200 mt-1">
                    Kehadiran Anda untuk Hari ke-{successDay} telah tersimpan.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="scanner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full relative"
              >
                <Scanner 
                  onScan={handleScan}
                  onError={(e) => {
                    console.error("Scan Error", e);
                  }}
                  components={{
                    audio: false,
                    finder: true,
                  }}
                  styles={{
                    container: { width: '100%', height: '100%' },
                  }}
                />
                {loading && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    <p className="text-sm font-bold animate-pulse">Menyimpan Kehadiran...</p>
                  </div>
                )}
                {error && (
                  <div className="absolute bottom-4 left-4 right-4 bg-red-500/90 text-white text-xs font-bold p-3 rounded-xl backdrop-blur-md flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
