export const mockCategories = [
  {
    _id: "1",
    name: "Electronics",
    slug: "electronics",
    description: "Latest electronic gadgets and devices",
    image: "/images/electronics.jpg",
    children: [
      {
        _id: "2",
        name: "Smartphones",
        slug: "smartphones",
        description: "Latest smartphones from top brands",
        children: [
          {
            _id: "3",
            name: "Android Phones",
            slug: "android-phones",
            children: []
          },
          {
            _id: "4",
            name: "iPhones",
            slug: "iphones",
            children: []
          }
        ]
      },
      {
        _id: "5",
        name: "Laptops",
        slug: "laptops",
        description: "Gaming, business, and student laptops",
        children: [
          {
            _id: "6",
            name: "Gaming Laptops",
            slug: "gaming-laptops",
            children: []
          },
          {
            _id: "7",
            name: "Ultrabooks",
            slug: "ultrabooks",
            children: []
          }
        ]
      },
      {
        _id: "8",
        name: "Tablets",
        slug: "tablets",
        children: []
      }
    ]
  },
  {
    _id: "9",
    name: "Fashion",
    slug: "fashion",
    description: "Trendy fashion items",
    image: "/images/fashion.jpg",
    children: [
      {
        _id: "10",
        name: "Men's Clothing",
        slug: "mens-clothing",
        children: [
          {
            _id: "11",
            name: "T-Shirts",
            slug: "mens-tshirts",
            children: []
          },
          {
            _id: "12",
            name: "Jeans",
            slug: "mens-jeans",
            children: []
          }
        ]
      },
      {
        _id: "13",
        name: "Women's Clothing",
        slug: "womens-clothing",
        children: [
          {
            _id: "14",
            name: "Dresses",
            slug: "womens-dresses",
            children: []
          },
          {
            _id: "15",
            name: "Tops",
            slug: "womens-tops",
            children: []
          }
        ]
      }
    ]
  },
  {
    _id: "16",
    name: "Home & Garden",
    slug: "home-garden",
    description: "Everything for your home",
    children: [
      {
        _id: "17",
        name: "Furniture",
        slug: "furniture",
        children: []
      },
      {
        _id: "18",
        name: "Kitchen",
        slug: "kitchen",
        children: []
      }
    ]
  }
];

// Mock products data
export const mockProducts = [
  {
    _id: "101",
    name: "iPhone 15 Pro",
    slug: "iphone-15-pro",
    description: "Latest iPhone with advanced camera system",
    shortDescription: "Premium smartphone with titanium design",
    category: "1",
    subCategory: "4",
    price: {
      regular: 999,
      sale: 899,
      currency: "USD"
    },
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400"
    ],
    inventory: {
      stock: 50,
      sku: "IP15PRO-256",
      manageStock: true
    },
    specifications: {
      "Storage": "256GB",
      "Color": "Natural Titanium",
      "Screen Size": "6.1 inch"
    },
    reviews: [
      {
        user: "John Doe",
        rating: 5,
        comment: "Excellent phone!",
        createdAt: "2024-01-15"
      }
    ],
    averageRating: 4.8,
    tags: ["apple", "smartphone", "5g"],
    isActive: true,
    featured: true
  },
  {
    _id: "102",
    name: "Samsung Galaxy S24",
    slug: "samsung-galaxy-s24",
    description: "Powerful Android phone with AI features",
    shortDescription: "Flagship Android smartphone",
    category: "1",
    subCategory: "3",
    price: {
      regular: 799,
      sale: 749,
      currency: "USD"
    },
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400"
    ],
    inventory: {
      stock: 75,
      sku: "SGS24-256",
      manageStock: true
    },
    specifications: {
      "Storage": "256GB",
      "Color": "Phantom Black",
      "Screen Size": "6.2 inch"
    },
    averageRating: 4.6,
    tags: ["samsung", "android", "5g"],
    isActive: true,
    featured: false
  },
  {
    _id: "103",
    name: "Gaming Laptop RTX 4080",
    slug: "gaming-laptop-rtx-4080",
    description: "High-performance gaming laptop with RTX 4080",
    shortDescription: "Powerful gaming machine",
    category: "1",
    subCategory: "6",
    price: {
      regular: 2499,
      sale: 2299,
      currency: "USD"
    },
    images: [
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400"
    ],
    inventory: {
      stock: 25,
      sku: "GL-RTX4080",
      manageStock: true
    },
    specifications: {
      "GPU": "RTX 4080",
      "RAM": "32GB",
      "Storage": "1TB SSD"
    },
    averageRating: 4.9,
    tags: ["gaming", "laptop", "rtx4080"],
    isActive: true,
    featured: true
  },
  {
    _id: "104",
    name: "Men's Casual T-Shirt",
    slug: "mens-casual-tshirt",
    description: "Comfortable cotton t-shirt for daily wear",
    shortDescription: "Premium cotton t-shirt",
    category: "9",
    subCategory: "11",
    price: {
      regular: 29,
      sale: 24,
      currency: "USD"
    },
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
    ],
    inventory: {
      stock: 100,
      sku: "MCT-BLACK-M",
      manageStock: true
    },
    specifications: {
      "Material": "100% Cotton",
      "Color": "Black",
      "Size": "M"
    },
    averageRating: 4.3,
    tags: ["tshirt", "casual", "cotton"],
    isActive: true,
    featured: false
  },
  {
    _id: "105",
    name: "Women's Summer Dress",
    slug: "womens-summer-dress",
    description: "Elegant summer dress for casual occasions",
    shortDescription: "Light and comfortable summer dress",
    category: "9",
    subCategory: "14",
    price: {
      regular: 49,
      sale: 39,
      currency: "USD"
    },
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400"
    ],
    inventory: {
      stock: 60,
      sku: "WSD-FLOWER-M",
      manageStock: true
    },
    specifications: {
      "Material": "Polyester",
      "Pattern": "Floral",
      "Size": "M"
    },
    averageRating: 4.5,
    tags: ["dress", "summer", "floral"],
    isActive: true,
    featured: true
  }
];

// Mock function to simulate API calls
export const mockApi = {
  getCategories: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCategories);
      }, 500);
    });
  },

  getProductsByCategory: (categoryId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = mockProducts.filter(product => 
          product.category === categoryId || 
          product.subCategory === categoryId
        );
        resolve({
          category: mockCategories.flatMap(cat => 
            [cat, ...(cat.children || []).flatMap(child => 
              [child, ...(child.children || [])]
            )]
          ).find(cat => cat._id === categoryId),
          products: products,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalProducts: products.length,
            hasNext: false,
            hasPrev: false
          }
        });
      }, 300);
    });
  },

  getAllProducts: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          products: mockProducts,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalProducts: mockProducts.length,
            hasNext: false,
            hasPrev: false
          }
        });
      }, 300);
    });
  }
};
