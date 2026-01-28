'use client';

import { useState } from 'react';
import { RepairItem } from '@/app/types';
import { Phone, CheckCircle, MessageCircle, Wrench, User, Calendar, IndianRupee, PhoneOutgoing, AlertTriangle, X } from 'lucide-react';

interface RepairCardProps {
  item: RepairItem;
  onCall: (id: string) => void;
  onRepair: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<RepairItem>) => void;
}

export default function RepairCard({ item, onCall, onRepair, onUpdateItem }: RepairCardProps) {
  const [showFinalAmountPrompt, setShowFinalAmountPrompt] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [finalAmount, setFinalAmount] = useState('');
  const [newDate, setNewDate] = useState('');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let borderColor = 'border-gray-800';
  let isLate = false;
  let badgeLabel = '';
  let badgeColor = 'bg-gray-800/50 text-gray-500';

  if (item.promisedDate) {
    const promisedDate = new Date(item.promisedDate);
    if (promisedDate < today) {
      isLate = true;
      borderColor = 'border-red-600 border-l-[12px]';
      badgeLabel = 'LATE';
      badgeColor = 'bg-red-600 text-white animate-pulse';
    } else if (promisedDate.getTime() === today.getTime()) {
      borderColor = 'border-yellow-500 border-l-[12px]';
      badgeLabel = 'DUE TODAY';
      badgeColor = 'bg-yellow-500 text-black font-black';
    } else {
      badgeLabel = promisedDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
      badgeColor = 'bg-blue-600/20 text-blue-400';
    }
  }

  const handleConfirmRepair = () => {
    if (!finalAmount) {
      alert('Please enter the final amount.');
      return;
    }
    const message = `Namaskaram ${item.customerName}, your ${item.itemName} is repaired and ready for pickup. Total amount: ₹${finalAmount}. If you have any doubts, please call us back.`;
    const whatsappUrl = `https://wa.me/${item.phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onRepair(item.id);
  };

  const handleSetDate = () => {
    if (newDate) {
      onUpdateItem(item.id, { promisedDate: newDate });
      setShowDatePicker(false);
    }
  };
  
  const cardInfo = "flex items-center gap-4 text-gray-400 py-1.5";
  const cardIcon = "h-5 w-5 text-yellow-500/80 flex-shrink-0";

  return (
    <div className={`group relative bg-[#161B22] rounded-[2.5rem] shadow-2xl border-2 ${borderColor} p-8 space-y-6 transition-all duration-300 hover:bg-[#1C2128] hover:shadow-yellow-500/5`}>
      {/* Status Badge */}
      <div className="flex justify-between items-center mb-2">
        {badgeLabel ? (
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${badgeColor}`}>
            {isLate && <AlertTriangle size={12} />}
            {badgeLabel}
          </div>
        ) : (
          <button 
            onClick={() => setShowDatePicker(true)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500 hover:text-black transition-all"
          >
            <Calendar size={12} />
            Set Date
          </button>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-3xl font-black text-white leading-none uppercase tracking-tighter italic group-hover:text-yellow-400 transition-colors">
            {item.itemName}
        </h3>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{item.fault}</p>
      </div>

      <div className="space-y-2 bg-gray-900/50 p-6 rounded-[2rem] border border-gray-800/50">
        <p className={cardInfo}>
          <User className={cardIcon} strokeWidth={2.5} /> 
          <span className="text-lg font-bold text-gray-200">{item.customerName}</span>
        </p>
        <div className="flex items-center justify-between">
            <p className={cardInfo}>
              <Phone className={cardIcon} strokeWidth={2.5} /> 
              <span className="text-lg font-bold tracking-tight text-gray-200">{item.phoneNumber}</span>
            </p>
            <button
              onClick={() => onCall(item.id)}
              className="relative p-3 text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-90"
              title="Customer Called"
            >
              <PhoneOutgoing size={20} strokeWidth={3} />
              {item.callCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-blue-600 shadow-xl">
                  {item.callCount}
                </span>
              )}
            </button>
        </div>
      </div>
      
      <button
        onClick={() => setShowFinalAmountPrompt(true)}
        className="w-full flex items-center justify-center gap-3 px-6 py-5 text-lg font-black text-black bg-green-500 rounded-[1.8rem] hover:bg-green-400 transition-all shadow-xl shadow-green-900/20 active:scale-[0.97] uppercase tracking-tighter"
      >
        <CheckCircle size={22} strokeWidth={3} />
        Complete Repair
      </button>

      {/* MODAL: Final Amount */}
      {showFinalAmountPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowFinalAmountPrompt(false)}></div>
          <div className="relative w-full max-w-sm bg-[#161B22] border-2 border-green-500 rounded-[3rem] p-8 shadow-[0_0_50px_rgba(34,197,94,0.2)] space-y-6 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Billing Info</h4>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Enter the final repair cost</p>
            </div>
            
            <div className="relative">
              <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 text-green-500" size={24} strokeWidth={3} />
              <input
                autoFocus
                type="number"
                placeholder="0"
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
                className="w-full pl-16 pr-8 py-6 bg-gray-900 border-2 border-gray-800 rounded-3xl text-white text-4xl font-black focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-800"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFinalAmountPrompt(false)}
                className="flex-1 px-4 py-4 font-black text-gray-500 uppercase tracking-widest text-xs hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRepair}
                className="flex-[2] px-6 py-4 font-black text-black bg-green-500 rounded-2xl hover:bg-green-400 transition-all shadow-lg active:scale-95 uppercase tracking-tighter italic"
              >
                Send & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Set Date */}
      {showDatePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowDatePicker(false)}></div>
          <div className="relative w-full max-w-sm bg-[#161B22] border-2 border-yellow-500 rounded-[3rem] p-8 shadow-[0_0_50px_rgba(234,179,8,0.2)] space-y-6 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Schedule</h4>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Set promised delivery date</p>
            </div>
            
            <input
              autoFocus
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-6 py-5 bg-gray-900 border-2 border-gray-800 rounded-3xl text-yellow-500 text-2xl font-black focus:outline-none focus:border-yellow-500 transition-all"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowDatePicker(false)}
                className="flex-1 px-4 py-4 font-black text-gray-500 uppercase tracking-widest text-xs hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSetDate}
                className="flex-[2] px-6 py-4 font-black text-black bg-yellow-500 rounded-2xl hover:bg-yellow-400 transition-all shadow-lg active:scale-95 uppercase tracking-tighter italic"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
