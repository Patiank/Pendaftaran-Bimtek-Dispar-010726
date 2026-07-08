const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(
  /\} \/\* END PRINTABLE DOKUMEN CONTAINER \*\/(\s*)<\/div>(\s*)<\/div>\s*\}\)\(\)\}\s*<\/div>\s*\)\}\s*\{\/\* DASHBOARD CONTAINER SYSTEM \(NON-PRINT VIEW\) \*\/\}/g,
  `} /* END PRINTABLE DOKUMEN CONTAINER */$1</div>$2</div>
          </div>
        </div>
      )}
      {/* DASHBOARD CONTAINER SYSTEM (NON-PRINT VIEW) */}`
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
