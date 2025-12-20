# POS System - Point of Sale with Scanner & Printer Integration

A modern, dynamic Point of Sale (POS) system built with React, TypeScript, and Shadcn/UI. Features barcode scanner integration and EOS Bluetooth thermal printer support for complete retail management.

## 🚀 Features

### Core POS Functionality
- **Product Catalog** - Browse products by category with real-time search
- **Shopping Cart** - Add, remove, and manage cart items with quantity controls
- **Payment Processing** - Support for cash, card, and digital payments
- **Order Management** - Complete order history and receipt generation
- **Responsive Design** - Touch-friendly interface optimized for tablets and desktop

### Hardware Integration
- **Barcode Scanner Support** - USB barcode scanners via Web Serial API
- **EOS Bluetooth Thermal Printer** - Direct printing to EOS thermal printers
- **Keyboard Input Fallback** - Barcode input via keyboard for compatibility
- **Real-time Device Status** - Connection monitoring and management

### Advanced Features
- **Device Settings Panel** - Manage scanner and printer connections
- **Test Functions** - Test barcode scanning and printer functionality
- **Receipt Formatting** - Proper ESC/POS formatting for thermal printers
- **Product Lookup** - Find products by barcode or search terms

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Shadcn/UI with Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **Build Tool**: Vite
- **Hardware APIs**: Web Serial API, Web Bluetooth API
- **Styling**: Tailwind CSS with custom components

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pos-system.git
   cd pos-system
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm run dev
   ```

4. **Build for production**
   ```bash
   pnpm run build
   ```

## 🖥️ Usage

### Basic Operations
1. **Browse Products** - Use category filters or search to find products
2. **Add to Cart** - Click "Add to Cart" on any product
3. **Manage Cart** - Adjust quantities or remove items in the cart sidebar
4. **Process Payment** - Click "Proceed to Payment" and select payment method
5. **Print Receipt** - Automatically print receipt after successful payment

### Hardware Setup

#### Barcode Scanner
1. Click the **"Devices"** button in the header
2. Click **"Initialize Scanner"** for keyboard input mode
3. For USB scanners, click **"Connect USB Scanner"** and select your device
4. Test scanning with the **"Test Barcode Scan"** feature

#### EOS Bluetooth Printer
1. Open the **Device Settings** panel
2. Click **"Connect EOS Printer"**
3. Select your EOS thermal printer from the Bluetooth device list
4. Use **"Test Print"** to verify connection

### Product Management
- Each product includes barcode support for quick scanning
- Search supports product names, categories, and barcodes
- Real-time stock tracking with low-stock indicators

## 🔧 Configuration

### Product Data
Edit `src/data/products.ts` to customize your product catalog:

```typescript
{
  id: '1',
  name: 'Product Name',
  price: 9.99,
  category: 'Category',
  image: 'image-url',
  description: 'Product description',
  stock: 50,
  barcode: '1234567890123'
}
```

### Printer Settings
Configure printer settings in `src/hooks/useBluetoothPrinter.ts`:
- Paper width (default: 48mm)
- Character width (default: 32 characters)
- ESC/POS command customization

## 🌐 Browser Compatibility

### Required Features
- **Web Serial API** - For USB barcode scanners (Chrome 89+)
- **Web Bluetooth API** - For Bluetooth printers (Chrome 56+)
- **Modern JavaScript** - ES2020+ support

### Supported Browsers
- ✅ Chrome 89+ (Full support)
- ✅ Edge 89+ (Full support)
- ⚠️ Firefox (Limited - no Web Serial/Bluetooth)
- ⚠️ Safari (Limited - no Web Serial/Bluetooth)

## 📱 Device Compatibility

### Barcode Scanners
- USB HID barcode scanners
- Keyboard wedge scanners
- Serial/COM port scanners (via Web Serial API)

### Thermal Printers
- EOS thermal printers with Bluetooth
- ESC/POS compatible printers
- 48mm, 58mm, and 80mm paper widths

## 🚀 Deployment

### Build for Production
```bash
pnpm run build
```

### Deploy to Vercel
```bash
npx vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the [documentation](docs/)
- Review browser compatibility requirements

## 🔮 Roadmap

- [ ] Inventory management system
- [ ] Customer management and loyalty programs
- [ ] Sales reporting and analytics
- [ ] Multi-store support
- [ ] Cloud synchronization
- [ ] Mobile app companion

---

**Built with ❤️ using React, TypeScript, and Shadcn/UI**