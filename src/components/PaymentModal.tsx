import { useState, useEffect, useCallback } from 'react';
import { PaymentMethod, PaymentDetails, Voucher } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Banknote, Smartphone, Calculator } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useApiConfig } from '@/hooks/useApiConfig';
import { toast } from 'sonner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onPaymentComplete: (paymentDetails: PaymentDetails) => void;
  orderId: string;
  customerId: string | null;
  appliedVoucher: Voucher | null;
}

export const PaymentModal = ({
                               isOpen,
                               onClose,
                               total,
                               onPaymentComplete,
                               orderId,
                               customerId,
                               appliedVoucher,
                             }: PaymentModalProps) => {

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  /** ✅ FIX QUAN TRỌNG */
  const { config: apiConfig } = useApiConfig();

  useEffect(() => {
    if (isOpen) {
      setCashReceived('');
      setPaymentMethod('cash');
    }
  }, [isOpen]);

  const change =
      cashReceived ? Math.max(0, parseFloat(cashReceived) - total) : 0;

  const handlePayment = useCallback(async () => {
    if (!apiConfig.apiUrl || !apiConfig.serviceCode || !apiConfig.posAppId) {
      toast.error('Lỗi cấu hình API', {
        description:
            'Vui lòng cấu hình đầy đủ API URL, Service Code và Pos App ID.',
      });
      return;
    }

    setIsProcessing(true);

    const paymentData = {
      cardNumber: customerId || 'UNKNOWN',
      amount: total,
      promotionId: appliedVoucher?.guidId ?? null,
      orderId,
      orderDate: new Date().toISOString(),
    };

    try {
      const response = await fetch(apiConfig.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Service-Code': apiConfig.serviceCode,
          'X-Pos-App-Id': apiConfig.posAppId,
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        let message = 'Payment API call failed';
        try {
          const text = await response.text();
          if (text) {
            const json = JSON.parse(text);
            message = json.message || message;
          }
        } catch {}
        throw new Error(message);
      }

      await response.json();

      toast.success('Thanh toán thành công', {
        description: `Đã xử lý ${formatCurrency(total)}`,
      });

      const paymentDetails: PaymentDetails = {
        method: paymentMethod,
        amount: total,
        ...(paymentMethod === 'cash' && { change }),
      };

      onPaymentComplete(paymentDetails);
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error('Lỗi thanh toán', {
        description: err.message || 'Có lỗi xảy ra khi thanh toán',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [
    apiConfig,
    customerId,
    appliedVoucher,
    orderId,
    total,
    paymentMethod,
    change,
    onPaymentComplete,
    onClose,
  ]);

  const canProceed = () => {
    if (paymentMethod === 'cash') {
      return parseFloat(cashReceived) >= total;
    }
    return true;
  };

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Xử lý thanh toán
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Tổng đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(total)}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Label className="text-base font-medium">
                Phương thức thanh toán
              </Label>

              <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                  className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center gap-2 flex-1">
                    <Banknote className="w-4 h-4" /> Tiền mặt
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 flex-1">
                    <CreditCard className="w-4 h-4" /> Thẻ
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="digital" id="digital" />
                  <Label htmlFor="digital" className="flex items-center gap-2 flex-1">
                    <Smartphone className="w-4 h-4" /> Ví điện tử
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === 'cash' && (
                <div className="space-y-3">
                  <Label>Tiền nhận</Label>
                  <Input
                      type="number"
                      min={total}
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                  />

                  {parseFloat(cashReceived) >= total && (
                      <div className="flex justify-between text-green-700 font-semibold">
                        <span>Tiền thừa</span>
                        <span>{formatCurrency(change)}</span>
                      </div>
                  )}
                </div>
            )}

            <Separator />

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Hủy
              </Button>
              <Button
                  onClick={handlePayment}
                  disabled={!canProceed() || isProcessing}
                  className="flex-1"
              >
                {isProcessing ? 'Đang xử lý...' : 'Thanh toán'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  );
};
