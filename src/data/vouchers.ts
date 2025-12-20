import { Voucher } from '@/types/pos';

export const vouchers: Voucher[] = [
  {
    code: 'GIAM25K',
    guidId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    type: 'fixed',
    value: 25000,
  },
  {
    code: 'GIAM50K',
    guidId: 'd2f9b8a0-2e5a-4a69-9c2f-4a6f7e9a0b1c',
    type: 'fixed',
    value: 50000,
  },
  {
    code: 'GIAM10',
    guidId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    type: 'percentage',
    value: 10,
  },
];

export const findVoucherByCode = (code: string): Voucher | undefined => {
  return vouchers.find(v => v.code.toUpperCase() === code.toUpperCase());
};

export const findVoucherByGuid = (guid: string): Voucher | undefined => {
  return vouchers.find(v => v.guidId === guid);
};
