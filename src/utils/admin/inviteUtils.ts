
import { UserRole } from "@/types/user";

// Pre-defined invite codes with role assignments
const INVITE_CODES = [
  { code: "ADMIN-123456", role: "admin", expiryDate: "2025-12-31", used: false },
  { code: "DEV-789012", role: "developer", expiryDate: "2025-12-31", used: false },
  { code: "MAINT-345678", role: "maintainer", expiryDate: "2025-12-31", used: false },
  { code: "ADMIN-987654", role: "admin", expiryDate: "2025-12-31", used: false },
  { code: "DEV-654321", role: "developer", expiryDate: "2025-12-31", used: false },
  { code: "MAINT-111222", role: "maintainer", expiryDate: "2025-12-31", used: false },
  { code: "ADMIN-333444", role: "admin", expiryDate: "2025-12-31", used: false },
  { code: "DEV-555666", role: "developer", expiryDate: "2025-12-31", used: false },
  { code: "MAINT-777888", role: "maintainer", expiryDate: "2025-12-31", used: false },
  { code: "ADMIN-999000", role: "admin", expiryDate: "2025-12-31", used: false }
];

// Function to validate invite code
export const validateInviteCode = (code: string) => {
  const inviteCode = INVITE_CODES.find(
    (invite) => invite.code === code && !invite.used
  );

  if (!inviteCode) {
    return {
      valid: false,
      message: "Invalid or already used invite code",
      role: null
    };
  }

  const expiryDate = new Date(inviteCode.expiryDate);
  if (expiryDate < new Date()) {
    return {
      valid: false,
      message: "This invite code has expired",
      role: null
    };
  }

  return {
    valid: true,
    message: "Invite code valid",
    role: inviteCode.role as UserRole
  };
};

export const markInviteCodeAsUsed = (code: string) => {
  const codeIndex = INVITE_CODES.findIndex(item => item.code === code);
  if (codeIndex >= 0) {
    INVITE_CODES[codeIndex].used = true;
    return true;
  }
  return false;
};
