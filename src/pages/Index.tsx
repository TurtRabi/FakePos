import { useState } from 'react';
import { products, categories, findProductByBarcode } from '@/data/products';
import { findVoucherByGuid } from '@/data/vouchers';
import { Product, Order, PaymentDetails } from '@/types/pos';
import { useCart } from '@/hooks/useCart';
import { ProductGrid } from '@/components/ProductGrid';
import { Cart } from '@/components/Cart';
import { PaymentModal } from '@/components/PaymentModal';
import { OrderSummary } from '@/components/OrderSummary';
import { ScannerControls } from '@/components/ScannerControls';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Store, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid'; // Import v4 as uuidv4
import { ApiConfigForm } from '@/components/ApiConfigForm'; // Import ApiConfigForm


export default function POSSystem() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null); // New state for orderId
  const [orderHistory, setOrderHistory] = useState<Order[]>([]); // Re-added orderHistory state
  const [showSettings, setShowSettings] = useState(false); // Re-added showSettings state
  
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    total,
    itemCount,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    customerId,
    setCustomerId,
    applyVoucherByGuid,
  } = useCart();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.barcode && product.barcode.includes(searchTerm));
    const matchesCategory = selectedCategory === 'Tất cả' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    if (product.stock > 0) {
      addItem(product);
      toast.success(`${product.name} đã thêm vào giỏ hàng`);
    } else {
      toast.error('Sản phẩm hết hàng');
    }
  };

  const handleScan = (code: string) => {
    // Try to find a product first
    const product = findProductByBarcode(code);
    if (product) {
      handleAddToCart(product);
      toast.success(`Đã quét sản phẩm: ${product.name}`);
      return;
    }

    // If not a product, try to find a voucher by GUID
    const voucher = findVoucherByGuid(code);
    if (voucher) {
      const success = applyVoucher(voucher.code);
      if (success) {
        toast.success(`Đã áp dụng voucher: ${voucher.code}`);
      } else {
        // This case might happen if applyVoucher has its own logic that fails
        toast.error('Không thể áp dụng voucher.');
      }
      return;
    }
    
    // If nothing is found
    toast.error(`Không tìm thấy sản phẩm hoặc voucher cho mã: ${code}`);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }
    const newOrderId = uuidv4(); // Generate GUID using uuidv4
    setCurrentOrderId(newOrderId); // Set the current order ID
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = (paymentDetails: PaymentDetails) => {
    const order: Order = {
      id: currentOrderId || uuidv4(), // Use currentOrderId if available, otherwise generate new GUID
      items: [...items],
      subtotal: subtotal,
      discount: discount,
      voucherCode: appliedVoucher?.code,
      total: total,
      paymentMethod: paymentDetails.method,
      timestamp: new Date(),
      status: 'completed',
      customerId: customerId,
    };

    setCurrentOrder(order);
    setOrderHistory(prev => [order, ...prev]);
    clearCart();
    setIsOrderSummaryOpen(true);
    
    // The success toast is now handled within PaymentModal after API call
    // toast.success('Thanh toán thành công!');
  };

  const handleNewOrder = () => {
    setCurrentOrder(null);
    clearCart();
    setCurrentOrderId(null); // Clear orderId on new order
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = e.currentTarget.value;
      if(value.trim()) {
        // Check if it's a GUID or a product barcode
        if (value.length > 20) { // Simple check if it might be a GUID/long barcode
            handleScan(value.trim());
            setSearchTerm(''); // Clear search after scan
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Store className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hệ thống POS</h1>
                <p className="text-sm text-muted-foreground">Hệ thống bán hàng với máy quét & máy in</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Thiết bị
              </Button>
              <Badge variant="outline" className="text-sm">
                {orderHistory.length} Đơn hàng hôm nay
              </Badge>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Giỏ hàng hiện tại</p>
                <p className="font-semibold">{itemCount} sản phẩm</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">


        {showSettings && (
          <div className="w-80 border-r bg-white p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Cài đặt thiết bị</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(false)}
              >
                ×
              </Button>
            </div>
            <ScannerControls onBarcodeScanned={handleScan} />
            <div className="mt-6"> {/* Added margin for spacing */}
              <ApiConfigForm />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Search and Filters */}
          <div className="p-4 bg-white border-b">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Tìm sản phẩm hoặc quét mã vạch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category === 'Tất cả' ? 'Tất cả' : category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-auto">
            <ProductGrid 
              products={filteredProducts}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="w-96 border-l bg-white">
          <Cart
            items={items}
            subtotal={subtotal}
            discount={discount}
            total={total}
            appliedVoucher={appliedVoucher}
            customerId={customerId}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onCheckout={handleCheckout}
            onClearCart={clearCart}
            onApplyVoucher={applyVoucher}
            onRemoveVoucher={removeVoucher}
            onSetCustomerId={setCustomerId}
            onApplyVoucherByGuid={applyVoucherByGuid}
          />
        </div>
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={total}
        onPaymentComplete={handlePaymentComplete}
        orderId={currentOrderId || uuidv4()} // Pass the orderId, provide fallback for type safety
        customerId={customerId} // Pass the customerId
        appliedVoucher={appliedVoucher} // Pass the appliedVoucher
      />

      <OrderSummary
        isOpen={isOrderSummaryOpen}
        onClose={() => setIsOrderSummaryOpen(false)}
        order={currentOrder}
        onNewOrder={handleNewOrder}
      />
    </div>
  );
}