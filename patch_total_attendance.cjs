const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const match = code.match(/const filteredRegistrants = registrations\.filter\([\s\S]*?\);/);

if (match) {
  const insertStr = `

  const totalValidAttendance = useMemo(() => {
    return filteredRegistrants.reduce((total, reg) => {
      let count = 0;
      for (let i = 0; i < (settings.durationDays || 3); i++) {
        const dayAtt = attendance.find(a => 
           a.id === \`\${(reg.nik || "").trim() ? (reg.nik || "").trim() : reg.id}_day_\${i + 1}\` ||
           (((a.nik === reg.nik && !!reg.nik) || (a.name === reg.name)) && a.day === i + 1)
        );
        if (dayAtt?.signatureBase64) {
          count++;
        }
      }
      return total + count;
    }, 0);
  }, [filteredRegistrants, attendance, settings.durationDays]);
`;
  code = code.replace(match[0], match[0] + insertStr);
  
  // Now replace the usage
  code = code.replace(
    'Total Log Kehadiran: <span className="text-teal-400 font-black text-base ml-1">{attendance.length}</span> rekam paraf',
    'Total Log Kehadiran: <span className="text-teal-400 font-black text-base ml-1">{totalValidAttendance}</span> rekam paraf'
  );
  
  fs.writeFileSync('src/components/AdminPanel.tsx', code);
}
