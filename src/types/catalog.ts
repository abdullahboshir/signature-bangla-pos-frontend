export interface IBaseEntity {
    _id: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}

export interface ICategory extends IBaseEntity {
    name: string;
    slug: string;
    description?: string;
    businessUnit: string; // ID
    image?: string;
    children?: ISubCategory[]; // For tree view if needed
}

export interface ISubCategory extends IBaseEntity {
    name: string;
    slug: string;
    description?: string;
    businessUnit: string;
    category: string | ICategory; // ID or Populated
    image?: string;
    children?: IChildCategory[];
}

export interface IChildCategory extends IBaseEntity {
    name: string;
    slug: string;
    description?: string;
    businessUnit: string;
    subCategory: string | ISubCategory; // ID or Populated
    image?: string;
}

export interface ICatalogStats {
    totalCategories: number;
    totalSubCategories: number;
    totalChildCategories: number;
    totalProducts: number;
}
