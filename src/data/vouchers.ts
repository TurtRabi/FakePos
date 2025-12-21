import { Voucher } from '@/types/pos';

export const vouchers: Voucher[] = [
  {
    code: 'ICECOFFEE10K',
    guidId: '35d82aad-ea83-4db2-81c2-1e4708062e30',
    type: 'fixed',
    value: 10000,
    minimumOrderAmount: 100000,
  },
  {
    code: 'ICXMAS25',
    guidId: 'ba078989-d8cb-463b-835f-5ecb77acf30e',
    type: 'fixed',
    value: 20000,
    minimumOrderAmount: 150000,
  },

];

export const findVoucherByCode = (code: string): Voucher | undefined => {
  return vouchers.find(v => v.code.toUpperCase() === code.toUpperCase());
};

export const findVoucherByGuid = (guid: string): Voucher | undefined => {
  return vouchers.find(v => v.guidId === guid);
};
