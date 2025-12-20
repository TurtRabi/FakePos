import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrScannerCore } from './QrScannerCore'; // Import the new core component

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

const qrCodeRegionId = "qr-code-scanner-region";

export const QrScannerModal = ({ isOpen, onClose, onScanSuccess }: QrScannerModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quét mã QR Voucher</DialogTitle>
          <DialogDescription>
            Đặt mã QR của voucher vào giữa khung để quét.
          </DialogDescription>
        </DialogHeader>
        {isOpen && ( // Conditionally render QrScannerCore only when modal is open
          <QrScannerCore
            qrCodeRegionId={qrCodeRegionId}
            onScanSuccess={onScanSuccess}
            onClose={onClose}
          />
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};