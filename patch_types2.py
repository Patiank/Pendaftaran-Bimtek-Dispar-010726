import re

with open('src/types.ts', 'r') as f:
    code = f.read()

old_code = """  gender?: string;
  isCertificateSent?: boolean;
  bankName?: string;
  bankBranch?: string;
  bankAccount?: string;
}"""

new_code = """  gender?: string;
  isCertificateSent?: boolean;
  bankAccount?: string;
}"""

if old_code in code:
    code = code.replace(old_code, new_code)
    with open('src/types.ts', 'w') as f:
        f.write(code)
    print("Patched types.ts")
else:
    print("Failed to patch types.ts")
