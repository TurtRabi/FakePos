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
  {
    code: 'MERRYXMAS10',
    guidId: '79ecaeb9-477c-431a-acf1-aafa0bb1d5c1',
    type: 'fixed',
    value: 10000,
    minimumOrderAmount: 50000,
  },
  {
    code: 'XMASCOMMING15',
    guidId: '7429337a-c109-47f0-a661-54c2d56fd204',
    type: 'percentage',
    value: 15,
    minimumOrderAmount: 80000,
  },

];

export const findVoucherByCode = (code: string): Voucher | undefined => {
  return vouchers.find(v => v.code.toUpperCase() === code.toUpperCase());
};

export const findVoucherByGuid = (guid: string): Voucher | undefined => {
  return vouchers.find(v => v.guidId === guid);
};
