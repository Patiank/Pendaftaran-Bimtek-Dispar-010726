import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

old_code = """                          {/* Rekening Bank Input */}
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 uppercase">Nomor Rekening (Bank Nagari)</label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm font-bold">
                                Bank Nagari
                              </span>
                              <input
                                type="text"
                                value={formBankAccount}
                                onChange={(e) => setFormBankAccount(e.target.value)}
                                placeholder="Masukkan no rekening..."
                                className="w-full px-3 py-2.5 rounded-none rounded-r-lg border border-gray-200 text-slate-900 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                              />
                            </div>
                          </div>"""

new_code = """                          {/* Rekening Bank Input */}
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 uppercase">Nama Bank & Nomor Rekening</label>
                            <input
                              type="text"
                              value={formBankAccount}
                              onChange={(e) => setFormBankAccount(e.target.value)}
                              placeholder="Contoh: Bank Nagari 1234567890..."
                              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-slate-900 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                            />
                          </div>"""

if old_code in code:
    code = code.replace(old_code, new_code)
    with open('src/App.tsx', 'w') as f:
        f.write(code)
    print("Patched successfully")
else:
    print("Could not find the target code to patch")
