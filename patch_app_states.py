import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

old_state = """  const [formGender, setFormGender] = useState("");
  const [formBankAccount, setFormBankAccount] = useState("");
  const [isSelfieMode, setIsSelfieMode] = useState(false);"""

new_state = """  const [formGender, setFormGender] = useState("");
  const [formBankName, setFormBankName] = useState("");
  const [formBankBranch, setFormBankBranch] = useState("");
  const [formBankAccount, setFormBankAccount] = useState("");
  const [isSelfieMode, setIsSelfieMode] = useState(false);"""

old_obj = """        bimtekId: activeEventId,
        gender: formGender,
        bankAccount: formBankAccount.trim(),
      };"""

new_obj = """        bimtekId: activeEventId,
        gender: formGender,
        bankName: formBankName.trim(),
        bankBranch: formBankBranch.trim(),
        bankAccount: formBankAccount.trim(),
      };"""

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

with open('src/App.tsx', 'w') as f:
    f.write(code)

