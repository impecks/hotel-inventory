export enum Role {
    ADMIN = 'ADMIN',
    CASHIER = 'CASHIER',
    RECEPTIONIST = 'RECEPTIONIST'
  }
  
  export enum Category {
    FOOD = 'Food Items',
    DRINKS = 'Drinks',
    HOUSEKEEPING = 'Housekeeping',
    KITCHEN = 'Kitchen Supplies',
    BAR = 'Bar Supplies',
    TOILETRIES = 'Toiletries',
    OFFICE = 'Office Supplies'
  }
  
  export interface User {
    id: string;
    username: string;
    name: string;
    role: Role;
    email?: string;
  }
  
  export interface Product {
    id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    minLevel: number;
    supplier: string;
    price: number;
    image?: string;
  }
  
  export interface Supplier {
    id: string;
    name: string;
    contact: string;
    email: string;
    address: string;
  }
  
  export interface StockRequest {
    id: string;
    productId: string;
    productName: string;
    requesterId: string;
    requesterName: string;
    requesterRole: Role;
    quantity: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    date: string;
    notes?: string;
  }
  
  export interface ActivityLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    details: string;
    timestamp: string;
  }
  
  export interface RoomUsage {
    id: string;
    roomNumber: string;
    productId: string;
    productName: string;
    quantity: number;
    date: string;
    recordedBy: string;
  }
  
  export const INITIAL_PRODUCTS: Product[] = [
    { id: '1', name: 'Premium Bath Towel', category: Category.HOUSEKEEPING, quantity: 150, unit: 'pcs', minLevel: 50, supplier: 'Luxury Textiles Co', price: 15.00 },
    { id: '2', name: 'Shampoo Mini (50ml)', category: Category.TOILETRIES, quantity: 40, unit: 'bottles', minLevel: 100, supplier: 'Hotel Amenities Inc', price: 1.20 },
    { id: '3', name: 'Sparkling Water', category: Category.DRINKS, quantity: 85, unit: 'bottles', minLevel: 40, supplier: 'BevDistributors', price: 2.50 },
    { id: '4', name: 'Red Wine (Merlot)', category: Category.BAR, quantity: 24, unit: 'bottles', minLevel: 12, supplier: 'Vineyard Direct', price: 18.00 },
    { id: '5', name: 'Napkins (Linen)', category: Category.KITCHEN, quantity: 500, unit: 'pcs', minLevel: 200, supplier: 'Luxury Textiles Co', price: 0.50 },
  ];
  
  export const INITIAL_SUPPLIERS: Supplier[] = [
    { id: '1', name: 'Luxury Textiles Co', contact: 'John Doe', email: 'sales@luxurytextiles.com', address: '123 Cotton Way' },
    { id: '2', name: 'BevDistributors', contact: 'Jane Smith', email: 'orders@bevdist.com', address: '456 Liquid Lane' },
  ];