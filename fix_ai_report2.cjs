const fs = require('fs');
let code = fs.readFileSync('src/components/AiReportTab.tsx', 'utf8');

code = code.replace(
  `            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};
`,
  `            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};
`
);
// Actually, let's just use regex to fix the end of the file.
