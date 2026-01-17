"use client"
import AddBusinessUserPage from "@/app/(protected)/platform/user-management/business-users/add/page"

// Re-export the GLOBAL Add User page logic so we don't duplicate code.
// The global page uses "useGetBusinessUnitsQuery" which is fine.
// It also has RoleAssignmentRow that filters outlets based on selected BU.
// When adding a user from a specific BU, we might want to PRE-SELECT that BU.
// For now, let's simply render the same page. Enhancing it to pre-fill BU is a nice-to-have optimization.
export default AddBusinessUserPage;
