export interface BarcodeScanner {
  isConnected: boolean;
  deviceName?: string;
  lastScanned?: string;
  timestamp?: Date;
}

export interface ScanResult {
  barcode: string;
  timestamp: Date;
  format?: string;
}

export interface PrinterConfig {
  deviceName?: string;
  isConnected: boolean;
  paperWidth: number;
  characterWidth: number;
}

export interface PrintJob {
  type: 'receipt' | 'label' | 'report';
  content: string;
  copies?: number;
}