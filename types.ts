
export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface ProductExtra {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  isActive: boolean;
  extras?: ProductExtra[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedExtras: ProductExtra[];
}

export interface Settings {
  restaurantName: string;
  whatsappNumber: string;
  address: string;
  openingHours: string;
  currency: string;
  themeColor: string;
}

export interface OrderLog {
  id: string;
  customerName: string;
  total: number;
  createdAt: string;
  items: string;
}
