
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category, Product, CartItem, Settings } from './types';
import { supabase } from './lib/supabase';

export type OrderStatus = 'pendiente' | 'preparacion' | 'en camino' | 'entregado';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  createdAt: string;
}

interface AppState {
  categories: Category[];
  products: Product[];
  settings: Settings;
  cart: CartItem[];
  orders: Order[];
  isAdmin: boolean;
  activeOrderId: string | null;
  isLoading: boolean;

  fetchInitialData: () => Promise<void>;

  setCategories: (cats: Category[]) => void;
  upsertCategory: (cat: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  setProducts: (prods: Product[]) => void;
  upsertProduct: (prod: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  setSettings: (settings: Settings) => Promise<void>;

  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, extraIds: string[]) => void;
  updateQuantity: (productId: string, extraIds: string[], delta: number) => void;
  clearCart: () => void;

  createOrder: (customerData: { name: string, phone: string }) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;

  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      categories: [],
      products: [],
      settings: {
        restaurantName: 'PIZZERIA ITALIA',
        whatsappNumber: '5491100000000',
        address: 'Av. Corrientes 1234, CABA',
        openingHours: 'Lun - Dom | 19:00 a 00:00',
        currency: '$',
        themeColor: '#e31c1c'
      },
      cart: [],
      orders: [],
      isAdmin: false,
      activeOrderId: null,
      isLoading: false,

      fetchInitialData: async () => {
        set({ isLoading: true });
        try {
          const [catRes, prodRes, setRes, ordRes] = await Promise.all([
            supabase.from('categories').select('*').order('id'),
            supabase.from('products').select('*').order('name'),
            supabase.from('settings').select('*').single(),
            supabase.from('orders').select('*').order('created_at', { ascending: false })
          ]);

          if (catRes.data) set({ categories: catRes.data });
          if (prodRes.data) {
            const mappedProds = prodRes.data.map(p => ({
              id: p.id,
              name: p.name,
              description: p.description,
              price: Number(p.price),
              imageUrl: p.image_url,
              categoryId: p.category_id,
              isActive: p.is_active,
              extras: p.extras || []
            }));
            set({ products: mappedProds });
          }
          if (setRes.data) {
            const { admin_password, ...rest } = setRes.data;
            set({
              settings: {
                restaurantName: rest.restaurant_name,
                whatsappNumber: rest.whatsapp_number,
                address: rest.address,
                openingHours: rest.opening_hours,
                currency: rest.currency,
                themeColor: rest.theme_color
              }
            });
          }
          if (ordRes.data) {
            const mappedOrders = ordRes.data.map(o => ({
              id: o.id,
              items: o.items,
              total: Number(o.total),
              status: o.status as OrderStatus,
              customerName: o.customer_name,
              customerPhone: o.customer_phone,
              createdAt: o.created_at
            }));
            set({ orders: mappedOrders });
          }
        } catch (error) {
          console.error('Error fetching initial data:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      setCategories: (categories) => set({ categories }),
      upsertCategory: async (cat) => {
        const { error } = await supabase.from('categories').upsert({
          id: cat.id,
          name: cat.name,
          icon: cat.icon
        });
        if (!error) {
          set(state => ({
            categories: state.categories.find(c => c.id === cat.id)
              ? state.categories.map(c => c.id === cat.id ? cat : c)
              : [...state.categories, cat]
          }));
        }
      },
      deleteCategory: async (id) => {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (!error) {
          set(state => ({
            categories: state.categories.filter(c => c.id !== id),
            products: state.products.filter(p => p.categoryId !== id)
          }));
        }
      },

      setProducts: (products) => set({ products }),
      upsertProduct: async (prod) => {
        const { error } = await supabase.from('products').upsert({
          id: prod.id,
          name: prod.name,
          description: prod.description,
          price: prod.price,
          image_url: prod.imageUrl,
          category_id: prod.categoryId,
          is_active: prod.isActive,
          extras: prod.extras || []
        });
        if (!error) {
          set(state => ({
            products: state.products.find(p => p.id === prod.id)
              ? state.products.map(p => p.id === prod.id ? prod : p)
              : [...state.products, prod]
          }));
        }
      },
      deleteProduct: async (id) => {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) {
          set(state => ({
            products: state.products.filter(p => p.id !== id)
          }));
        }
      },

      setSettings: async (settings) => {
        const { error } = await supabase.from('settings').upsert({
          id: 'default',
          restaurant_name: settings.restaurantName,
          whatsapp_number: settings.whatsappNumber,
          address: settings.address,
          opening_hours: settings.openingHours,
          currency: settings.currency,
          theme_color: settings.themeColor
        });
        if (!error) {
          set({ settings });
        }
      },

      addToCart: (newItem) => {
        const cart = get().cart;
        const itemKey = (item: CartItem) => `${item.id}-${item.selectedExtras.map(e => e.id).sort().join(',')}`;
        const newKey = itemKey(newItem);
        const existingIndex = cart.findIndex(item => itemKey(item) === newKey);

        if (existingIndex > -1) {
          const updatedCart = [...cart];
          updatedCart[existingIndex].quantity += newItem.quantity;
          set({ cart: updatedCart });
        } else {
          set({ cart: [...cart, newItem] });
        }
      },

      removeFromCart: (productId, extraIds) => {
        const key = (id: string, eIds: string[]) => `${id}-${eIds.sort().join(',')}`;
        set({ cart: get().cart.filter(item => key(item.id, item.selectedExtras.map(e => e.id)) !== key(productId, extraIds)) });
      },

      updateQuantity: (productId, extraIds, delta) => {
        const key = (id: string, eIds: string[]) => `${id}-${eIds.sort().join(',')}`;
        const searchKey = key(productId, extraIds);
        const updatedCart = get().cart.map(item => {
          if (key(item.id, item.selectedExtras.map(e => e.id)) === searchKey) {
            const newQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        });
        set({ cart: updatedCart });
      },

      clearCart: () => set({ cart: [] }),

      createOrder: async (customerData) => {
        const cart = get().cart;
        const total = cart.reduce((acc, item) => {
          const extrasTotal = item.selectedExtras.reduce((sum, e) => sum + e.price, 0);
          return acc + (item.price + extrasTotal) * item.quantity;
        }, 0);

        const newOrder: Order = {
          id: Math.random().toString(36).substr(2, 9),
          items: cart,
          total,
          status: 'pendiente',
          customerName: customerData.name,
          customerPhone: customerData.phone,
          createdAt: new Date().toISOString()
        };

        const { error } = await supabase.from('orders').insert({
          id: newOrder.id,
          items: newOrder.items,
          total: newOrder.total,
          status: newOrder.status,
          customer_name: newOrder.customerName,
          customer_phone: newOrder.customerPhone,
          created_at: newOrder.createdAt
        });

        if (!error) {
          set(state => ({
            orders: [newOrder, ...state.orders],
            activeOrderId: newOrder.id,
            cart: []
          }));
        }
      },

      updateOrderStatus: async (orderId, status) => {
        const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
        if (!error) {
          set(state => ({
            orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o)
          }));
        }
      },

      login: async (password) => {
        const { data, error } = await supabase.from('settings').select('admin_password').single();
        if (data && data.admin_password === password) {
          set({ isAdmin: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAdmin: false }),
    }),
    {
      name: 'pizzeria-pro-storage-v2',
      partialize: (state) => ({ cart: state.cart, isAdmin: state.isAdmin, activeOrderId: state.activeOrderId }),
    }
  )
);
