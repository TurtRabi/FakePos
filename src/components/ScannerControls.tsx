import React, { useState } from 'react';
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner';
import { useBluetoothPrinter } from '@/hooks/useBluetoothPrinter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Scan, 
  Bluetooth, 
  Printer, 
  Wifi, 
  WifiOff, 
  TestTube,
  Zap 
} from 'lucide-react';

interface ScannerControlsProps {
  onBarcodeScanned: (barcode: string) => void;
}

export const ScannerControls = ({ onBarcodeScanned }: ScannerControlsProps) => {
  const {
    scanner,
    lastScan,
    initializeScanner,
    connectScanner,
    disconnectScanner,
    simulateScan
  } = useBarcodeScanner();

  const {
    printer,
    connectPrinter,
    disconnectPrinter,
    testPrint
  } = useBluetoothPrinter();

  const [testBarcode, setTestBarcode] = useState('');

  // Handle barcode scan result
  React.useEffect(() => {
    if (lastScan) {
      onBarcodeScanned(lastScan.barcode);
    }
  }, [lastScan, onBarcodeScanned]);

  const handleTestScan = () => {
    if (testBarcode.trim()) {
      simulateScan(testBarcode.trim());
      setTestBarcode('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Barcode Scanner Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Scan className="w-5 h-5" />
            Máy quét mã vạch
            <Badge 
              variant={scanner.isConnected ? "default" : "secondary"}
              className="ml-auto"
            >
              {scanner.isConnected ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" />
                  Đã kết nối
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" />
                  Đã ngắt kết nối
                </>
              )}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {scanner.isConnected ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Thiết bị:</span>
                <span className="font-medium">{scanner.deviceName}</span>
              </div>
              {lastScan && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <Zap className="w-4 h-4" />
                    <span className="font-medium">Lần quét cuối:</span>
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    <div>Mã: {lastScan.barcode}</div>
                    <div>Thời gian: {lastScan.timestamp.toLocaleTimeString()}</div>
                  </div>
                </div>
              )}
              <Button 
                variant="outline" 
                onClick={disconnectScanner}
                className="w-full"
              >
                Ngắt kết nối máy quét
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Button 
                onClick={initializeScanner}
                className="w-full"
              >
                <Scan className="w-4 h-4 mr-2" />
                Khởi tạo máy quét
              </Button>
              <Button 
                variant="outline"
                onClick={connectScanner}
                className="w-full"
              >
                Kết nối máy quét USB
              </Button>
            </div>
          )}
          
          <Separator />
          
          {/* Test Scanner */}
          <div className="space-y-2">
            <Label htmlFor="testBarcode">Kiểm tra quét mã vạch</Label>
            <div className="flex gap-2">
              <Input
                id="testBarcode"
                placeholder="Nhập mã vạch để mô phỏng"
                value={testBarcode}
                onChange={(e) => setTestBarcode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTestScan()}
              />
              <Button 
                onClick={handleTestScan}
                disabled={!testBarcode.trim()}
                size="sm"
              >
                <TestTube className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bluetooth Printer Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Printer className="w-5 h-5" />
            Máy in nhiệt EOS
            <Badge 
              variant={printer.isConnected ? "default" : "secondary"}
              className="ml-auto"
            >
              {printer.isConnected ? (
                <>
                  <Bluetooth className="w-3 h-3 mr-1" />
                  Đã kết nối
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" />
                  Đã ngắt kết nối
                </>
              )}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {printer.isConnected ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Khổ giấy:</span>
                  <div className="font-medium">{printer.paperWidth}mm</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={testPrint}
                  className="flex-1"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  In thử
                </Button>
                <Button 
                  variant="outline"
                  onClick={disconnectPrinter}
                  className="flex-1"
                >
                  Ngắt kết nối
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              onClick={connectPrinter}
              className="w-full"
            >
              <Bluetooth className="w-4 h-4 mr-2" />
              Kết nối máy in EOS
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};