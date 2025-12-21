import { useState, useCallback, useMemo } from 'react';
import { CartItem, Product, Voucher, ApplyVoucherResult } from '@/types/pos';
import { findVoucherByCode, findVoucherByGuid } from '@/data/vouchers';
import { formatCurrency } from '@/lib/utils';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);

  const addItem = useCallback((product: Product, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { product, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedVoucher(null);
    setCustomerId(null);
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [items]);

  const discount = useMemo(() => {
    if (!appliedVoucher) return 0;

    if (appliedVoucher.type === 'fixed') {
      return Math.min(appliedVoucher.value, subtotal);
    }

    if (appliedVoucher.type === 'percentage') {
      return (subtotal * appliedVoucher.value) / 100;
    }

    return 0;
  }, [subtotal, appliedVoucher]);

  const total = useMemo(() => subtotal - discount, [subtotal, discount]);
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const applyVoucher = useCallback((code: string): ApplyVoucherResult => {
    const voucher = findVoucherByCode(code);
    if (!voucher) {
      return { success: false, message: 'Voucher không hợp lệ.' };
    }

    if (voucher.minimumOrderAmount && subtotal < voucher.minimumOrderAmount) {
      return { 
        success: false, 
        message: `Đơn hàng phải đạt tối thiểu ${formatCurrency(voucher.minimumOrderAmount)} để sử dụng voucher này.` 
      };
    }

    setAppliedVoucher(voucher);
    return { success: true, message: 'Áp dụng voucher thành công!' };
  }, [subtotal]);
  
  const applyVoucherByGuid = useCallback((guid: string): ApplyVoucherResult => {
    const voucher = findVoucherByGuid(guid);
    if (!voucher) {
      return { success: false, message: 'Mã QR không phải voucher hợp lệ.' };
    }
    
    if (voucher.minimumOrderAmount && subtotal < voucher.minimumOrderAmount) {
      return { 
        success: false, 
        message: `Đơn hàng phải đạt tối thiểu ${formatCurrency(voucher.minimumOrderAmount)} để sử dụng voucher này.` 
      };
    }

    setAppliedVoucher(voucher);
    return { success: true, message: 'Quét và áp dụng voucher thành công!' };
  }, [subtotal]);

  const removeVoucher = useCallback(() => {
    setAppliedVoucher(null);
  }, []);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount,
    appliedVoucher,
    applyVoucher,
    applyVoucherByGuid,
    removeVoucher,
    discount,
    total,
    customerId,
    setCustomerId,
  };
};