import { useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { toast } from 'sonner';

interface QrScannerCoreProps {
  qrCodeRegionId: string;
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export const QrScannerCore = ({ qrCodeRegionId, onScanSuccess, onClose }: QrScannerCoreProps) => {
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null); // Ref to the div itself

  useEffect(() => {
    if (!scannerContainerRef.current) {
      console.error("QR Scanner Core: Container ref is null on mount.");
      toast.error('Lỗi khởi tạo quét QR: Phần tử hiển thị không có sẵn.');
      onClose();
      return;
    }

    // Ensure the ID is correctly set on the div
    scannerContainerRef.current.id = qrCodeRegionId;

    const html5QrCode = new Html5Qrcode(qrCodeRegionId);
    html5QrCodeRef.current = html5QrCode; // Store instance in ref

    console.log("QR Scanner Core: Html5Qrcode instance created for region:", qrCodeRegionId);
    toast.info("Đang khởi động camera...", { duration: 1500 });

    const startScanner = async () => {
      try {
        console.log("QR Scanner Core: Attempting to start scanner.");
        // Check for camera permissions proactively
        if (navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          console.log("QR Scanner Core: navigator.mediaDevices.getUserMedia is available.");
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop()); // Stop stream immediately after checking
            console.log("QR Scanner Core: Camera permissions granted.");
            toast.info("Đã có quyền truy cập camera.", { duration: 1500 });
          } catch (permError) {
            console.error("QR Scanner Core: Camera permission denied or error:", permError);
            toast.error('Không có quyền truy cập camera. Vui lòng cấp quyền.');
            onClose();
            return;
          }
        } else {
          console.warn("QR Scanner Core: navigator.mediaDevices.getUserMedia is not available.");
          toast.error('Trình duyệt không hỗ trợ truy cập camera.');
          onClose();
          return;
        }

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText, decodedResult) => {
            console.log("QR Scanner Core: Scan successful:", decodedText, decodedResult);
            onScanSuccess(decodedText);
            toast.success("Quét mã thành công!");
            // onClose(); // Let parent decide to close, or close via onScanSuccess
          },
          (errorMessage) => {
            // handle scan failure, usually better to ignore and keep scanning.
            // console.log("QR Scan error (still scanning):", errorMessage);
          }
        );
        console.log("QR Scanner Core: Html5Qrcode.start() called successfully.");
      } catch (err) {
        toast.error('Không thể khởi động camera. Vui lòng cấp quyền truy cập camera.');
        console.error("QR_SCANNER_INIT_ERROR: Camera initialization failed!", err);
        onClose();
      }
    };
    
    startScanner();

    return () => {
      console.log("QR Scanner Core: Cleanup: Stopping QR scanner.");
      if (html5QrCodeRef.current && html5QrCodeRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
        html5QrCodeRef.current.stop().catch(err => console.error("QR_SCANNER_CLEANUP_ERROR: Failed to stop QR Code scanner.", err));
      }
    };
  }, [qrCodeRegionId, onScanSuccess, onClose]); // Dependencies

  return (
    <div ref={scannerContainerRef} style={{ width: '100%' }} />
  );
};