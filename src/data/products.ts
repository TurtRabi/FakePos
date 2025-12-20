import { Product } from '@/types/pos';

export const products: Product[] = [
  {
    id: '1',
    name: 'Cà phê Espresso',
    price: 60000,
    category: 'Cà phê',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=300&h=300&fit=crop',
    description: 'Cà phê Espresso đậm đà và mạnh mẽ',
    stock: 50,
    barcode: '1234567890123'
  },
  {
    id: '2',
    name: 'Cà phê Cappuccino',
    price: 90000,
    category: 'Cà phê',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=300&fit=crop',
    description: 'Sự pha trộn hoàn hảo giữa espresso và sữa nóng',
    stock: 45,
    barcode: '1234567890124'
  },
  {
    id: '3',
    name: 'Bánh sừng bò',
    price: 55000,
    category: 'Bánh ngọt',
    image: 'https://images.unsplash.com/photo-1555507036-ab794f0ec0a4?w=300&h=300&fit=crop',
    description: 'Bánh Pháp giòn, xốp, thơm bơ',
    stock: 20,
    barcode: '1234567890125'
  },
  {
    id: '4',
    name: 'Cà phê Latte',
    price: 100000,
    category: 'Cà phê',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop',
    description: 'Espresso mềm mượt với sữa hấp và nghệ thuật tạo hình bọt sữa',
    stock: 40,
    barcode: '1234567890126'
  },
  {
    id: '5',
    name: 'Bánh Muffin Việt quất',
    price: 75000,
    category: 'Bánh ngọt',
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=300&h=300&fit=crop',
    description: 'Bánh muffin việt quất mới nướng',
    stock: 15,
    barcode: '1234567890127'
  },
  {
    id: '6',
    name: 'Trà xanh',
    price: 65000,
    category: 'Trà',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=300&fit=crop',
    description: 'Lá trà xanh cao cấp',
    stock: 30,
    barcode: '1234567890128'
  },
  {
    id: '7',
    name: 'Bánh mì Sandwich',
    price: 160000,
    category: 'Đồ ăn',
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300&h=300&fit=crop',
    description: 'Bánh mì deli tươi với nguyên liệu cao cấp',
    stock: 25,
    barcode: '1234567890129'
  },
  {
    id: '8',
    name: 'Cà phê đá',
    price: 80000,
    category: 'Cà phê',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&h=300&fit=crop',
    description: 'Cà phê ủ lạnh sảng khoái',
    stock: 35,
    barcode: '1234567890130'
  }
];

export const categories = ['Tất cả', 'Cà phê', 'Trà', 'Bánh ngọt', 'Đồ ăn'];

// Helper function to find product by barcode
export const findProductByBarcode = (barcode: string): Product | undefined => {
  return products.find(product => product.barcode === barcode);
};