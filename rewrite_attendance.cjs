const fs = require('fs');
let code = fs.readFileSync('src/components/AttendanceForm.tsx', 'utf8');

// We want to remove everything from {/* DAY CHECKPOINTS */} down to the submit button
// and replace it with the scan button if a participant is found.
// Also we need to import ScanAttendance here, or we can just emit a callback for the parent to show the modal... wait, AttendanceForm doesn't have a callback for that right now.
// It's probably easier to just render ScanAttendance from AttendanceForm directly.

let newCode = code.replace(
  'import { motion, AnimatePresence } from "motion/react";',
  'import { motion, AnimatePresence } from "motion/react";\nimport { ScanAttendance } from "./ScanAttendance";\nimport { Scan } from "lucide-react";'
);

// We need to add state for showing the modal inside AttendanceForm
newCode = newCode.replace(
  'const [selectedDay, setSelectedDay] = useState<number>(2);',
  'const [selectedDay, setSelectedDay] = useState<number>(2);\n  const [showScanModal, setShowScanModal] = useState(false);'
);

// Replace the DAY CHECKPOINTS down to the end of the form with the scan button
const oldPart = `            {/* DAY CHECKPOINTS */}`;
const toReplace = newCode.substring(newCode.indexOf(oldPart));

const replaceWith = `            {participant && (
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setShowScanModal(true)}
                  className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl flex items-center justify-center space-x-3 active:scale-[0.98] transition-all shadow-xl shadow-slate-900/20"
                >
                  <Scan className="w-6 h-6 text-emerald-400" />
                  <span className="text-base">Scan Barcode Absensi</span>
                </button>
              </div>
            )}
          </form>
        )}
      </AnimatePresence>
      
      {showScanModal && participant && (
        <ScanAttendance
          participant={participant}
          onClose={() => setShowScanModal(false)}
          onSuccess={(day) => {
            setShowScanModal(false);
            setSuccess(true);
            setSelectedDay(day); // just to show which day in the success screen
          }}
        />
      )}
    </div>
  );
};
`;

newCode = newCode.substring(0, newCode.indexOf(oldPart)) + replaceWith;

fs.writeFileSync('src/components/AttendanceForm.tsx', newCode);
