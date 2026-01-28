export interface RepairItem {
  id: string;
  customerName: string;
  phoneNumber: string;
  itemName: string;
  fault: string;
  estimatedCost?: number;
  promisedDate?: string; // ISO string format for dates
  status: 'Pending' | 'Repaired';
  callCount: number;
}
