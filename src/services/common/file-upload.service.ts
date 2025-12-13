import { axiosInstance } from "@/lib/axios/axiosInstance";



export const fileUploadService = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    // Assuming the route is /upload/image based on backend code
    // The base URL of axiosInstance likely includes /api/v1/
    // Verify if 'common' module routes are prefixed.
    // Confirmed backend route is mounted at /super-admin/upload/image
    
    const response = await axiosInstance.post("/super-admin/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data.url; // Adjust based on actual response structure
  },
};
