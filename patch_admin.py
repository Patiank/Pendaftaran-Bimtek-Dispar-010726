import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    code = f.read()

old_1 = """{reg.bankName || reg.bankBranch || reg.bankAccount 
                                  ? `${reg.bankName || 'Bank'} ${reg.bankBranch ? '('+reg.bankBranch+')' : ''} - ${reg.bankAccount || ''}`
                                  : "-"}"""
new_1 = """{reg.bankAccount ? `Bank Nagari - ${reg.bankAccount}` : "-"}"""

if old_1 in code:
    code = code.replace(old_1, new_1)
    print("Patched AdminPanel.tsx")
else:
    print("Failed to patch AdminPanel.tsx")

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(code)

