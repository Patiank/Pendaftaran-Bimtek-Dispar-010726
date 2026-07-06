const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'const [showScanAttendanceModal, setShowScanAttendanceModal] = useState(false);\n',
  ''
);

// We need to verify if there is an extra `</div>` for searchedParticipant
// Let's print out the relevant code
fs.writeFileSync('src/App.tsx', code);
