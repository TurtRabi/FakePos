import { useState } from 'react';
import { ApplyVoucherResult, CartItem, Voucher } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrScannerModal } from './QrScannerModal';
import { Minus, Plus, Trash2, ShoppingCart, Tag, XCircle, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

interface CartProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  appliedVoucher: Voucher | null;
  customerId: string | null;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  onClearCart: () => void;
  onApplyVoucher: (code: string) => ApplyVoucherResult;
  onApplyVoucherByGuid: (guid: string) => ApplyVoucherResult;
  onRemoveVoucher: () => void;
  onSetCustomerId: (id: string | null) => void;
}

export const Cart = ({ 
  items, 
  subtotal,
  discount,
  total,
  appliedVoucher,
  customerId,
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  onClearCart,
  onApplyVoucher,
  onApplyVoucherByGuid,
  onRemoveVoucher,
  onSetCustomerId,
}: CartProps) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCustomerScannerOpen, setIsCustomerScannerOpen] = useState(false);

  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) return;
    const result = onApplyVoucher(voucherCode);
    if (result.success) {
      toast.success(result.message);
      setVoucherCode('');
    } else {
      toast.error(result.message);
    }
  };

  const handleScanSuccess = (guid: string) => {
    const result = onApplyVoucherByGuid(guid);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsScannerOpen(false);
  };

  const handleCustomerScanSuccess = (scannedData: string) => {
    onSetCustomerId(scannedData);
    toast.success("Mã khách hàng đã được quét thành công.");
    setIsCustomerScannerOpen(false);
  };

  return (
    <>
      <QrScannerModal 
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
      <QrScannerModal 
        isOpen={isCustomerScannerOpen}
        onClose={() => setIsCustomerScannerOpen(false)}
        onScanSuccess={handleCustomerScanSuccess}
        title="Quét mã QR khách hàng"
        description="Đặt mã QR của khách hàng vào giữa khung để quét."
      />
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer-id">Khách hàng (SĐT/Mã thẻ)</Label>
            <div className="flex gap-2">
              <Input
                id="customer-id"
                placeholder="Nhập mã khách hàng..."
                value={customerId || ''}
                onChange={(e) => onSetCustomerId(e.target.value)}
              />
              <Button variant="outline" size="icon" onClick={() => setIsCustomerScannerOpen(true)}>
                <Camera className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Separator/>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Giỏ hàng
              {items.length > 0 && <Badge variant="secondary">{items.length}</Badge>}
            </CardTitle>
            {items.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearCart}
                className="text-destructive hover:text-destructive"
              >
                Xóa tất cả
              </Button>
            )}
          </div>
        </CardHeader>
        
        {items.length === 0 ? (
          <CardContent className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <ShoppingCart className="w-12 h-12 mb-4 opacity-50" />
            <p>Giỏ hàng của bạn trống</p>
            <p className="text-sm">Thêm một vài sản phẩm để bắt đầu</p>
          </CardContent>
        ) : (
          <>
            <CardContent className="flex-1 overflow-auto space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">{formatCurrency(item.product.price)} mỗi</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onRemoveItem(item.product.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
            
            <div className="flex-shrink-0 p-4 border-t bg-muted/30">
              <div className="space-y-4">
                {!appliedVoucher ? (
                  <div className="space-y-2">
                    <Label>Mã giảm giá</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập mã..."
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyVoucher()}
                      />
                      <Button variant="outline" size="icon" onClick={() => setIsScannerOpen(true)}>
                        <Camera className="w-4 h-4" />
                      </Button>
                      <Button onClick={handleApplyVoucher} disabled={!voucherCode.trim()}>
                        Áp dụng
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center p-2 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">
                        Voucher: <span className="font-bold">{appliedVoucher.code}</span>
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRemoveVoucher}>
                      <XCircle className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                )}

                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tạm tính:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Tổng cộng:</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={onCheckout} 
                  className="w-full h-12 text-lg font-semibold"
                  size="lg"
                  disabled={items.length === 0}
                >
                  Thanh toán
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </>
  );
};