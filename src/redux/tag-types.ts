export enum tagTypes {
  auth = 'auth',
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
}

export const tagTypesList = Object.values(tagTypes);
