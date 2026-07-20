import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

old_state = """  const [formGender, setFormGender] = useState("");
  const [formBankName, setFormBankName] = useState("");
  const [formBankBranch, setFormBankBranch] = useState("");
  const [formBankAccount, setFormBankAccount] = useState("");
  const [isSelfieMode, setIsSelfieMode] = useState(false);"""

new_state = """  const [formGender, setFormGender] = useState("");
  const [formBankAccount, setFormBankAccount] = useState("");
  const [isSelfieMode, setIsSelfieMode] = useState(false);"""

old_obj = """        bimtekId: activeEventId,
        gender: formGender,
        bankName: formBankName.trim(),
        bankBranch: formBankBranch.trim(),
        bankAccount: formBankAccount.trim(),
      };"""

new_obj = """        bimtekId: activeEventId,
        gender: formGender,
        bankAccount: formBankAccount.trim(),
      };"""

old_ui = """                          {/* Informasi Rekening Bank */}
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

new_ui = """                          {/* Rekening Bank Input */}
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

if old_state in code:
    code = code.replace(old_state, new_state)
    print("Patched state")
else:
    print("Failed to patch state")

if old_obj in code:
    code = code.replace(old_obj, new_obj)
    print("Patched newReg")
else:
    print("Failed to patch newReg")

if old_ui in code:
    code = code.replace(old_ui, new_ui)
    print("Patched UI")
else:
    print("Failed to patch UI")

with open('src/App.tsx', 'w') as f:
    f.write(code)

