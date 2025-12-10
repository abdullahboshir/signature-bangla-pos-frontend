import { axiosInstance } from "@/lib/axios/axiosInstance";
import { ICategory, ISubCategory, IChildCategory } from "@/types/catalog";

// Helper to standardise response
const getData = (res: any) => res.data?.data?.result || res.data?.data || [];

export const categoryService = {
    // === CATEGORY ===
    getAll: async (params?: any) => {
        const res = await axiosInstance.get("/super-admin/categories", { params });
        return getData(res);
    },
    getById: async (id: string) => {
        const res = await axiosInstance.get(`/super-admin/categories/${id}`);
        return res.data?.data;
    },
    create: async (data: Partial<ICategory>) => {
        const res = await axiosInstance.post("/super-admin/categories/create", data);
        return res.data;
    },
    update: async (id: string, data: Partial<ICategory>) => {
        const res = await axiosInstance.patch(`/super-admin/categories/${id}`, data);
        return res.data;
    },
    delete: async (id: string) => {
        const res = await axiosInstance.delete(`/super-admin/categories/${id}`);
        return res.data;
    },

    // === SUB CATEGORY ===
    getAllSub: async (params?: any) => {
        const res = await axiosInstance.get("/super-admin/categories/sub", { params });
        return getData(res);
    },
    getSubById: async (id: string) => {
        const res = await axiosInstance.get(`/super-admin/categories/sub/${id}`);
        return res.data?.data;
    },
    createSub: async (data: Partial<ISubCategory>) => {
        const res = await axiosInstance.post("/super-admin/categories/sub/create", data);
        return res.data;
    },
    updateSub: async (id: string, data: Partial<ISubCategory>) => {
        const res = await axiosInstance.patch(`/super-admin/categories/sub/${id}`, data);
        return res.data;
    },
    deleteSub: async (id: string) => {
        const res = await axiosInstance.delete(`/super-admin/categories/sub/${id}`);
        return res.data;
    },

    // === CHILD CATEGORY ===
    getAllChild: async (params?: any) => {
        const res = await axiosInstance.get("/super-admin/categories/child", { params });
        return getData(res);
    },
    getChildById: async (id: string) => {
        const res = await axiosInstance.get(`/super-admin/categories/child/${id}`);
        return res.data?.data;
    },
    createChild: async (data: Partial<IChildCategory>) => {
        const res = await axiosInstance.post("/super-admin/categories/child/create", data);
        return res.data;
    },
    updateChild: async (id: string, data: Partial<IChildCategory>) => {
        const res = await axiosInstance.patch(`/super-admin/categories/child/${id}`, data);
        return res.data;
    },
    deleteChild: async (id: string) => {
        const res = await axiosInstance.delete(`/super-admin/categories/child/${id}`);
        return res.data;
    },
    
    // === MOCK TREE (If backend doesn't return tree) ===
    getTree: async () => {
        // Fetch all levels
        const [cats, subs, childs] = await Promise.all([
            categoryService.getAll({ limit: 1000 }),
            categoryService.getAllSub({ limit: 1000 }),
            categoryService.getAllChild({ limit: 1000 })
        ]);

        // Build Map for fast lookup
        const catMap = new Map(cats.map((c: any) => [c._id, { ...c, children: [] }]));
        const subMap = new Map(subs.map((s: any) => [s._id, { ...s, children: [] }]));

        // Attach Child to Sub
        childs.forEach((c: any) => {
            const subId = typeof c.subCategory === 'string' ? c.subCategory : c.subCategory?._id;
            if (subMap.has(subId)) {
                subMap.get(subId).children.push(c);
            }
        });

        // Attach Sub to Cat
        subs.forEach((s: any) => {
            const catId = typeof s.category === 'string' ? s.category : s.category?._id;
            if (catMap.has(catId)) {
                catMap.get(catId).children.push(subMap.get(s._id));
            }
        });

        return Array.from(catMap.values());
    }
};
