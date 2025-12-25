import Swal from "sweetalert2";

/**
 * Generic hook for delete confirmation with SweetAlert2
 * 
 * @param deleteMutation - RTK Query delete mutation hook
 * @param resourceName - Name of resource being deleted (for messages)
 * @returns Delete handler function
 * 
 * @example
 * const [deleteBrand] = useDeleteBrandMutation();
 * const handleDelete = useConfirmDelete(deleteBrand, "Brand");
 * // Usage: await handleDelete(id);
 */
export const useConfirmDelete = (
  deleteMutation: any,
  resourceName: string = "Item"
) => {
  return async (id: string): Promise<boolean> => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteMutation(id).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: `${resourceName} has been deleted.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        return true;
      } catch (error: any) {
        console.error("Delete failed", error);
        Swal.fire(
          "Error!",
          error?.data?.message || `Failed to delete ${resourceName}.`,
          "error"
        );
        return false;
      }
    }
    return false;
  };
};
