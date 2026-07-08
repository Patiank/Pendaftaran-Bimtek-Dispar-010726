const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(
  `          </div>
        </div>
      )}
      {/* DASHBOARD CONTAINER SYSTEM (NON-PRINT VIEW) */}`,
  `          </div>
          </div>
        </div>
      )}
      {/* DASHBOARD CONTAINER SYSTEM (NON-PRINT VIEW) */}`
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
