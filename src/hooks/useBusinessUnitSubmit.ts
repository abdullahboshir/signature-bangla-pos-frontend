import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { checkIsSuperAdmin } from "@/lib/iam/permissions";
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";

/**
 * Hook for handling Business Unit logic in CRUD forms
 * 
 * Provides:
 * - Business Unit resolution for form submissions
 * - Business Unit field configuration for forms
 * - Super admin detection and context handling
 * 
 * @returns Object with BU utilities
 * 
 * @example
 * const { resolveBusinessUnit, getBusinessUnitField } = useBusinessUnitSubmit();
 * const cleanData = resolveBusinessUnit(formData);
 * const buField = getBusinessUnitField(); // Add to form fields
 */
export const useBusinessUnitSubmit = () => {
  const params = useParams();
  const { user } = useAuth();
  const { data: businessUnits = [] } = useGetBusinessUnitsQuery({ limit: 0 });

  const isSuperAdmin = checkIsSuperAdmin(user);
  const paramBusinessUnit = params["business-unit"] as string;

  /**
   * Resolves business unit from form data
   * Handles super admin global/scoped views and business admin context
   */
  const resolveBusinessUnit = (data: any) => {
    const submissionData = { ...data };
    let targetBU = "";

    // Super admin can select BU
    if (isSuperAdmin && data.businessUnit) {
      targetBU = data.businessUnit;
    }
    // Business admin inherits from URL
    else if (paramBusinessUnit) {
      const matched = businessUnits.find(
        (b: any) =>
          b.slug === paramBusinessUnit ||
          b._id === paramBusinessUnit ||
          b.id === paramBusinessUnit
      );
      targetBU = matched ? matched._id : paramBusinessUnit;
    }

    // Handle global special case
    if (targetBU === "global") targetBU = "";

    // Set final BU (null for global, ID for specific)
    submissionData.businessUnit = targetBU || null;

    return submissionData;
  };

  /**
   * Generates Business Unit field configuration for forms
   * Returns null if user is not super admin
   */
  const getBusinessUnitField = () => {
    if (!isSuperAdmin) return null;

    let options = [
      { label: "Global (No Business Unit)", value: "global" },
      ...businessUnits.map((bu: any) => ({
        label: bu.name || bu.branding?.name,
        value: bu._id,
      })),
    ];

    // If super admin is in scoped view, limit options
    if (paramBusinessUnit) {
      const currentBU = businessUnits.find(
        (b: any) =>
          b.id === paramBusinessUnit ||
          b._id === paramBusinessUnit ||
          b.slug === paramBusinessUnit
      );

      if (currentBU) {
        options = [
          { label: "Global (No Business Unit)", value: "global" },
          { label: currentBU.name || currentBU.branding?.name, value: currentBU._id },
        ];
      }
    }

    return {
      name: "businessUnit",
      label: "Business Unit",
      type: "select",
      options: options,
      placeholder: "Select Business Unit",
      disabled: false,
    };
  };

  /**
   * Get default Business Unit value for forms
   */
  const getDefaultBusinessUnit = () => {
    if (!isSuperAdmin) return undefined;

    if (paramBusinessUnit) {
      const matched = businessUnits.find(
        (b: any) =>
          b.slug === paramBusinessUnit ||
          b._id === paramBusinessUnit ||
          b.id === paramBusinessUnit
      );
      return matched?._id || "global";
    }

    return "global";
  };

  return {
    resolveBusinessUnit,
    getBusinessUnitField,
    getDefaultBusinessUnit,
    isSuperAdmin,
    paramBusinessUnit,
    businessUnits,
  };
};

