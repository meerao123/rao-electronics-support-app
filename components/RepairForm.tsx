'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { RepairItem } from '@/app/types';

interface RepairFormProps {
  onAddItem: (item: Omit<RepairItem, 'id' | 'status' | 'callCount'>) => void;
}

export default function RepairForm({ onAddItem }: RepairFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [itemName, setItemName] = useState('');
  const [fault, setFault] = useState('');
  const [promisedDate, setPromisedDate] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phoneNumber || !itemName || !fault) {
        alert('Please fill at least Name, Phone, Item and Fault.');
        return;
    }
    onAddItem({
      customerName,
      phoneNumber,
      itemName,
      fault,
      promisedDate: promisedDate || undefined,
    });
    // Reset form
    setCustomerName('');
    setPhoneNumber('');
    setItemName('');
    setFault('');
    setPromisedDate('');
    setShowForm(false);
  };
  
  const inputStyle = "w-full p-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-lg";

  if (!showForm) {
    return (
      <div className="flex justify-center my-8">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-3 px-8 py-4 font-bold text-white bg-green-600 rounded-2xl hover:bg-green-700 transition-all shadow-lg hover:shadow-green-500/20 active:scale-95 text-lg"
        >
          <PlusCircle size={28} />
          Add New Repair
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 mb-10 bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl">
      <h2 className="text-3xl font-black text-center text-yellow-400 mb-8 tracking-tight">New Repair Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className={inputStyle}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number (e.g., 919876543210)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="Item Name (e.g., iPhone 13)"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className={inputStyle}
            required
          />
          <textarea
            placeholder="Describe the fault"
            value={fault}
            onChange={(e) => setFault(e.target.value)}
            className={`${inputStyle} h-32 resize-none`}
            required
          />
          
          <div className="space-y-2 pt-2">
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
              Promised Delivery Date
            </label>
            <input
              type="date"
              value={promisedDate}
              onChange={(e) => setPromisedDate(e.target.value)}
              className={`${inputStyle} text-yellow-400 font-bold text-2xl py-5`}
              required
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
            type="button"
            onClick={() => setShowForm(false)}
            className="w-full px-6 py-4 font-bold text-gray-400 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all active:scale-95"
            >
            Cancel
            </button>
            <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 font-bold text-black bg-yellow-400 rounded-xl hover:bg-yellow-500 transition-all shadow-lg hover:shadow-yellow-500/20 active:scale-95 text-lg"
            >
            <PlusCircle size={24} />
            Add Item
            </button>
        </div>
      </form>
    </div>
  );
}
