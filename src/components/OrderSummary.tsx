import { Order } from '@/types/pos';
import { useBluetoothPrinter } from '@/hooks/useBluetoothPrinter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Receipt, Download, Check, Clock, X, Printer } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface OrderSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onNewOrder: () => void;
}

export const OrderSummary = ({ isOpen, onClose, order, onNewOrder }: OrderSummaryProps) => {
  const { printer, printReceipt } = useBluetoothPrinter();
  
  if (!order) return null;

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'cancelled':
        return <X className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  const handlePrintReceipt = async () => {
    if (printer.isConnected) {
      await printReceipt(order);
    } else {
      // Fallback to browser print
      window.print();
    }
  };

  const handleNewOrder = () => {
    onNewOrder();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Hóa đơn đơn hàng
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Đơn hàng #{order.id.slice(-6)}</CardTitle>
                <Badge className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status === 'completed' ? 'Hoàn thành' : order.status === 'pending' ? 'Đang chờ' : 'Đã hủy'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {order.timestamp.toLocaleString()}
              </p>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Các mặt hàng của đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(item.product.price)} × {item.quantity}
                      {item.product.barcode && (
                        <span className="ml-2 text-xs bg-gray-100 px-1 rounded">
                          {item.product.barcode}
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-1 pt-2">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <p>Tạm tính:</p>
                  <p>{formatCurrency(order.subtotal)}</p>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between items-center text-sm text-green-600">
                    <p>Giảm giá ({order.voucherCode}):</p>
                    <p>-{formatCurrency(order.discount)}</p>
                  </div>
                )}
                <div className="flex justify-between items-center font-semibold pt-1">
                  <p>Tổng cộng:</p>
                  <p className="text-xl font-bold text-primary">{formatCurrency(order.total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Chi tiết thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Phương thức thanh toán:</span>
                  <span className="capitalize font-medium">
                    {order.paymentMethod === 'cash' ? 'Tiền mặt' : order.paymentMethod === 'card' ? 'Thẻ' : 'Ví điện tử'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Số tiền đã thanh toán:</span>
                  <span className="font-medium">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handlePrintReceipt}
              className="flex items-center gap-2"
            >
              {printer.isConnected ? (
                <>
                  <Printer className="w-4 h-4" />
                  In hóa đơn
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  In hóa đơn
                </>
              )}
            </Button>
            <Button 
              onClick={handleNewOrder}
            >
              Đơn hàng mới
            </Button>
          </div>
          
          {printer.isConnected && (
            <div className="text-center">
              <Badge variant="outline" className="text-xs">
                <Printer className="w-3 h-3 mr-1" />
                Máy in EOS đã sẵn sàng
              </Badge>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};