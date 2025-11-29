
import { ProductList } from "@/components/modules/products/ProductList"
import { Button } from "@/components/ui/button"
// import { getProducts } from "@/lib/api/endpoints/products"

export default async function ProductsPage() {
//   const products = await getProducts()
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
        <Button>Add Product</Button>
      </div>
      
      {/* <ProductList products={products} /> */}
    </div>
  )
}