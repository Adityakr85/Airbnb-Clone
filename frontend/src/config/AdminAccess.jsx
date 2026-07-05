export const AdminAccess = {
  admin: ["*"],

  manager: [
    "dashboard",
    "users",
    "properties",
    "experiences",
    "categories",
    "reservations",
    "reviews",
  ],

  finance: ["dashboard", "payments", "reservations"],

  support: ["dashboard", "reports", "support", "notifications"],

  moderator: [
    "dashboard",
    "reviews",
    "marketing",
    "featured-listings",
    "cms",
    "analytics",
  ],
};

export function getValidRole(role) {
  return Object.keys(AdminAccess).find(
    (key) => key.toLowerCase() === String(role).toLowerCase(),
  );
}

export function canAccess(role, permission) {
  const validRole = getValidRole(role);

  if (!validRole) return false;

  const permissions = AdminAccess[validRole];

  return permissions.includes("*") || permissions.includes(permission);
}

export function isAdminStaff(role) {
  return Boolean(getValidRole(role));
}
