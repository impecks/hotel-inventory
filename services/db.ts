import { Product, User, Supplier, StockRequest, ActivityLog, RoomUsage, INITIAL_PRODUCTS, INITIAL_SUPPLIERS, Role, Category } from '../types';

const KEYS = {
  PRODUCTS: 'lux_products',
  USERS: 'lux_users',
  SUPPLIERS: 'lux_suppliers',
  REQUESTS: 'lux_requests',
  LOGS: 'lux_logs',
  ROOM_USAGE: 'lux_room_usage'
};

export class MockDB {
  static initialize() {
    if (!localStorage.getItem(KEYS.PRODUCTS)) {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(KEYS.SUPPLIERS)) {
      localStorage.setItem(KEYS.SUPPLIERS, JSON.stringify(INITIAL_SUPPLIERS));
    }
    if (!localStorage.getItem(KEYS.USERS)) {
      const admin: User = { id: 'admin-1', username: 'admin', name: 'System Administrator', role: Role.ADMIN, email: 'admin@luxstay.com' };
      localStorage.setItem(KEYS.USERS, JSON.stringify([admin]));
    }
    if (!localStorage.getItem(KEYS.REQUESTS)) localStorage.setItem(KEYS.REQUESTS, JSON.stringify([]));
    if (!localStorage.getItem(KEYS.LOGS)) localStorage.setItem(KEYS.LOGS, JSON.stringify([]));
    if (!localStorage.getItem(KEYS.ROOM_USAGE)) localStorage.setItem(KEYS.ROOM_USAGE, JSON.stringify([]));
  }

  // Generic Getter/Setter
  private static get<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private static set<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Products
  static getProducts() { return this.get<Product>(KEYS.PRODUCTS); }
  static saveProduct(product: Product) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) products[index] = product;
    else products.push(product);
    this.set(KEYS.PRODUCTS, products);
  }
  static deleteProduct(id: string) {
    const products = this.getProducts().filter(p => p.id !== id);
    this.set(KEYS.PRODUCTS, products);
  }

  // Users
  static getUsers() { return this.get<User>(KEYS.USERS); }
  static addUser(user: User) {
    const users = this.getUsers();
    users.push(user);
    this.set(KEYS.USERS, users);
  }
  static deleteUser(id: string) {
    const users = this.getUsers().filter(u => u.id !== id);
    this.set(KEYS.USERS, users);
  }

  // Suppliers
  static getSuppliers() { return this.get<Supplier>(KEYS.SUPPLIERS); }
  static addSupplier(supplier: Supplier) {
    const list = this.getSuppliers();
    list.push(supplier);
    this.set(KEYS.SUPPLIERS, list);
  }

  // Requests
  static getRequests() { return this.get<StockRequest>(KEYS.REQUESTS).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); }
  static addRequest(req: StockRequest) {
    const list = this.getRequests();
    list.unshift(req);
    this.set(KEYS.REQUESTS, list);
  }
  static updateRequestStatus(id: string, status: 'APPROVED' | 'REJECTED') {
    const list = this.getRequests();
    const req = list.find(r => r.id === id);
    if (req) {
      req.status = status;
      if (status === 'APPROVED') {
        // Deduct stock
        const products = this.getProducts();
        const prod = products.find(p => p.id === req.productId);
        if (prod) {
          prod.quantity = Math.max(0, prod.quantity - req.quantity);
          this.set(KEYS.PRODUCTS, products);
        }
      }
      this.set(KEYS.REQUESTS, list);
    }
  }

  // Room Usage
  static getRoomUsage() { return this.get<RoomUsage>(KEYS.ROOM_USAGE); }
  static logRoomUsage(usage: RoomUsage) {
    const list = this.getRoomUsage();
    list.push(usage);
    this.set(KEYS.ROOM_USAGE, list);
    
    // Deduct stock immediately for room usage
    const products = this.getProducts();
    const prod = products.find(p => p.id === usage.productId);
    if (prod) {
      prod.quantity = Math.max(0, prod.quantity - usage.quantity);
      this.set(KEYS.PRODUCTS, products);
    }
  }

  // Activity Logs
  static getLogs() { return this.get<ActivityLog>(KEYS.LOGS).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); }
  static logActivity(userId: string, action: string, details: string) {
    const logs = this.getLogs();
    const user = this.getUsers().find(u => u.id === userId);
    logs.unshift({
      id: crypto.randomUUID(),
      userId,
      userName: user ? user.name : 'Unknown',
      action,
      details,
      timestamp: new Date().toISOString()
    });
    this.set(KEYS.LOGS, logs);
  }

  // Dashboard Stats
  static getStats() {
    const products = this.getProducts();
    return {
      totalProducts: products.length,
      lowStock: products.filter(p => p.quantity <= p.minLevel).length,
      totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
      pendingRequests: this.getRequests().filter(r => r.status === 'PENDING').length
    };
  }
}