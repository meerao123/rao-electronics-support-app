'use client';

import { RepairItem } from '@/app/types';
import RepairCard from './RepairCard';

interface RepairListProps {
  items: RepairItem[];
  onCall: (id: string) => void;
  onRepair: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<RepairItem>) => void;
}

export default function RepairList({ items, onCall, onRepair, onUpdateItem }: RepairListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-32 border-2 border-dashed border-gray-800 rounded-[3rem] mx-4 bg-gray-900/20">
        <p className="text-4xl font-black text-gray-800 uppercase tracking-tighter mb-4 italic">Queue Empty</p>
        <p className="text-lg font-medium text-gray-600">No active repair orders found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-4">
      {items.map(item => (
        <RepairCard 
            key={item.id} 
            item={item} 
            onCall={onCall} 
            onRepair={onRepair} 
            onUpdateItem={onUpdateItem}
        />
      ))}
    </div>
  );
}
