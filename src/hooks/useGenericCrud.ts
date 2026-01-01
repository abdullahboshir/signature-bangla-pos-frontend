import { useState } from "react";
import { toast } from "sonner";
import { useConfirmDelete } from "./useConfirmDelete";
import { useBusinessUnitSubmit } from "./useBusinessUnitSubmit";

export interface GenericCrudConfig<T> {
  /** RTK Query hook for fetching list */
  queryHook: any;
  /** RTK Query mutation hook for create */
  createHook: any;
  /** RTK Query mutation hook for update */
  updateHook: any;
  /** RTK Query mutation hook for delete */
  deleteHook: any;
  /** Resource name for messages (e.g., "Brand") */
  resourceName: string;
  /** Whether this resource is business unit scoped */
  businessUnitScoped?: boolean;
  /** Additional query params */
  queryParams?: Record<string, any>;
}

export const useGenericCrud = <T extends { _id: string }>(
  config: GenericCrudConfig<T>
) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  // Business Unit logic (only if scoped)
  const buLogic = useBusinessUnitSubmit();
  const shouldUseBU = config.businessUnitScoped !== false;

  // Determine query params
  const queryParams = {
    ...config.queryParams,
    ...(shouldUseBU && !buLogic.isSuperAdmin
      ? { businessUnit: buLogic.paramBusinessUnit }
      : {}),
  };

  // RTK Query hooks
  const { data = [], isLoading, refetch } = config.queryHook(queryParams);
  const [createMutation, { isLoading: isCreating }] = config.createHook();
  const [updateMutation, { isLoading: isUpdating }] = config.updateHook();
  const [deleteMutation] = config.deleteHook();

  // Delete handler
  const handleDelete = useConfirmDelete(deleteMutation, config.resourceName);

  // Submit handler (create or update)
  const handleSubmit = async (data: any) => {
    try {
      // Resolve Business Unit if scoped
      const submissionData = shouldUseBU
        ? buLogic.resolveBusinessUnit(data)
        : data;

      if (editingItem) {
        await updateMutation({
          id: editingItem._id,
          body: submissionData,
        }).unwrap();
        toast.success(`${config.resourceName} updated successfully`);
      } else {
        await createMutation(submissionData).unwrap();
        toast.success(`${config.resourceName} created successfully`);
      }

      // Reset state
      setIsCreateOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.data?.message || `Failed to save ${config.resourceName}`
      );
    }
  };

  // Helper to open create modal
  const openCreate = () => {
    setEditingItem(null);
    setIsCreateOpen(true);
  };

  // Helper to open edit modal
  const openEdit = (item: T) => {
    setEditingItem(item);
    setIsCreateOpen(true);
  };

  // Helper to close modal
  const closeModal = () => {
    setIsCreateOpen(false);
    setEditingItem(null);
  };

  return {
    // Data
    data,
    isLoading,
    refetch,

    // Modal state
    isCreateOpen,
    setIsCreateOpen,
    editingItem,
    setEditingItem,

    // Loading states
    isCreating,
    isUpdating,
    isSaving: isCreating || isUpdating,

    // Handlers
    handleDelete,
    handleSubmit,
    openCreate,
    openEdit,
    closeModal,

    // Business Unit (if scoped)
    ...(shouldUseBU ? buLogic : {}),
  };
};
