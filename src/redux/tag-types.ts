export enum tagTypes {
  auth = 'auth',
  user = 'user',
  superAdmin = "superAdmin",
  admin = "admin",
  manager = "manager",
  customer = "customer",
  department = "department",
  category = "category",
  subCategory = "subCategory",
  childCategory = "childCategory",
  product = "product",
  order = "order",
  brand = "brand",
  unit = "unit",
}

export const tagTypesList = Object.values(tagTypes);
