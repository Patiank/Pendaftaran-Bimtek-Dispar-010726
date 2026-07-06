const fs = require('fs');
let code = fs.readFileSync('src/components/AttendanceForm.tsx', 'utf8');

code = code.replace(
  'const availableDaysCount = Math.max(0, durationDays - 1);',
  'const availableDaysCount = durationDays;'
);

code = code.replace(
  '<p className="text-xs sm:text-sm text-gray-500 mt-1">Acara hari ke-2 dan selanjutnya</p>',
  '<p className="text-xs sm:text-sm text-gray-500 mt-1">Silakan mengisi absensi Anda</p>'
);

code = code.replace(
  'const dayNum = idx + 2;',
  'const dayNum = idx + 1;'
);

code = code.replace(
  'const [selectedDay, setSelectedDay] = useState(2);',
  'const [selectedDay, setSelectedDay] = useState(1);'
);

fs.writeFileSync('src/components/AttendanceForm.tsx', code);
