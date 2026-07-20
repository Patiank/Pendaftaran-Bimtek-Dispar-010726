import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

old_ui = """                          {/* Rekening Bank Input */}
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

new_ui = """                          {/* Informasi Rekening Bank */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-gray-700 uppercase">Nama Bank</label>
                              <input
                                type="text"
                                value={formBankName}
                                onChange={(e) => setFormBankName(e.target.value)}
                                placeholder="Contoh: Bank Nagari"
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-slate-900 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-gray-700 uppercase">Cabang Bank</label>
                              <input
                                type="text"
                                value={formBankBranch}
                                onChange={(e) => setFormBankBranch(e.target.value)}
                                placeholder="Contoh: Cabang Utama Padang"
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-slate-900 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-gray-700 uppercase">Nomor Rekening</label>
                              <input
                                type="text"
                                value={formBankAccount}
                                onChange={(e) => setFormBankAccount(e.target.value)}
                                placeholder="Contoh: 1234567890"
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-slate-900 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                              />
                            </div>
                          </div>"""

if old_ui in code:
    code = code.replace(old_ui, new_ui)
    print("Patched UI")
else:
    print("Failed to patch UI")

with open('src/App.tsx', 'w') as f:
    f.write(code)

