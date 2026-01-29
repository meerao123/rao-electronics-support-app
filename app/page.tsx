'use client';

import { useState, useEffect } from 'react';
import { Phone, CheckCircle, PlusCircle, Calendar, Trash2, X, AlertCircle, Wrench, Printer } from 'lucide-react';
import { RepairItem } from './types';

const STORAGE_KEY = 'rao-electronics-v9';

export default function RepairDashboard() {
  const [items, setItems] = useState<RepairItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [printingItem, setPrintingItem] = useState<RepairItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    itemName: '',
    fault: '',
    promisedDate: '',
    advanceReceived: '',
    estimateGiven: ''
  });

  // Load and Save Logic
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load repairs", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isClient]);

  // Handlers
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phoneNumber || !formData.itemName || !formData.fault) {
      alert("Please fill in Name, Phone, Item, and Fault.");
      return;
    }

    const newItem: RepairItem = {
      id: crypto.randomUUID(),
      customerName: formData.customerName,
      phoneNumber: formData.phoneNumber,
      itemName: formData.itemName,
      fault: formData.fault,
      promisedDate: formData.promisedDate || undefined,
      advanceReceived: formData.advanceReceived ? parseFloat(formData.advanceReceived) : undefined,
      estimateGiven: formData.estimateGiven ? parseFloat(formData.estimateGiven) : undefined,
      status: 'Pending',
      callCount: 0
    };

    setItems([...items, newItem]);
    setFormData({ customerName: '', phoneNumber: '', itemName: '', fault: '', promisedDate: '', advanceReceived: '', estimateGiven: '' });
    setShowForm(false);
  };

  const incrementCall = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, callCount: item.callCount + 1 } : item));
  };

  const updateDate = (id: string, date: string) => {
    if (!date) return;
    setItems(items.map(item => item.id === id ? { ...item, promisedDate: date } : item));
  };

  const updateAdvance = (id: string) => {
    const val = window.prompt("Enter Advance Received (₹):");
    if (val === null) return;
    setItems(items.map(item => item.id === id ? { ...item, advanceReceived: parseFloat(val) || 0 } : item));
  };

  const updateEstimate = (id: string) => {
    const val = window.prompt("Enter Estimate Given (₹):");
    if (val === null) return;
    setItems(items.map(item => item.id === id ? { ...item, estimateGiven: parseFloat(val) || 0 } : item));
  };

  const deleteItem = (id: string) => {
    if (window.confirm("Permanently delete this repair record?")) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const completeRepair = (item: RepairItem) => {
    const amount = window.prompt(`Enter Final Amount for ${item.customerName} (₹):`);
    if (amount === null || amount.trim() === "") return;

    // Clean phone number
    const cleanPhone = item.phoneNumber.replace(/\D/g, '');
    
    const message = `RAO ELECTRONICS: Your ${item.itemName} is ready. Total Amount: ₹${amount}. Thank you!`;
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    setItems(items.filter(i => i.id !== item.id));
  };

  const handlePrint = (item: RepairItem) => {
    setPrintingItem(item);
    // Short delay to ensure the receipt template is populated before opening the print dialog
    setTimeout(() => {
      window.print();
      setPrintingItem(null);
    }, 100);
  };

  // Sorting Logic: Call Count First, then Date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sortedItems = [...items].sort((a, b) => {
    if (b.callCount !== a.callCount) {
      return b.callCount - a.callCount;
    }
    const timeA = a.promisedDate ? new Date(a.promisedDate).getTime() : Infinity;
    const timeB = b.promisedDate ? new Date(b.promisedDate).getTime() : Infinity;
    return timeA - timeB;
  });

  if (!isClient) return null;

  return (
    <>
      <div className="min-h-screen bg-black text-white p-4 font-sans flex flex-col gap-10 pb-40 print:hidden">
        {/* HEADER */}
        <header className="py-12 text-center flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-full">
              <Wrench className="text-black h-10 w-10" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic text-center">
              RAO ELECTRONICS
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.5em] text-xs text-center">Workforce Management</p>
        </header>

        <main className="max-w-[340px] mx-auto w-full flex flex-col gap-12 px-2">
          
          {/* ADD REPAIR SECTION */}
          <section className="w-full">
            {!showForm ? (
              <button 
                onClick={() => setShowForm(true)}
                className="w-full py-8 bg-white text-black font-black uppercase text-2xl rounded-2xl flex items-center justify-center gap-4 shadow-2xl hover:bg-gray-200 transition-all border-2 border-transparent"
              >
                <PlusCircle size={32} /> New Repair Entry
              </button>
            ) : (
              <div className="bg-white text-black p-8 rounded-2xl flex flex-col gap-8 shadow-2xl animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b pb-4">
                  <h2 className="text-2xl font-black uppercase tracking-tight italic text-black">Register Item</h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-300 hover:text-red-500 p-2"><X size={32} /></button>
                </div>

                <form onSubmit={handleAddItem} className="flex flex-col gap-8">
                  <div className="flex flex-col gap-3 text-black">
                    <label className="text-sm font-black uppercase text-gray-500 tracking-widest ml-1">Customer Name</label>
                    <input 
                      type="text" required value={formData.customerName}
                      onChange={e => setFormData({...formData, customerName: e.target.value})}
                      placeholder="e.g. SHAFIQ"
                      className="bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl outline-none focus:border-black text-xl font-bold transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-3 text-black">
                    <label className="text-sm font-black uppercase text-gray-500 tracking-widest ml-1">WhatsApp Phone Number</label>
                    <input 
                      type="tel" required value={formData.phoneNumber}
                      onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                      placeholder="919876543210"
                      className="bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl outline-none focus:border-black text-xl font-bold transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-3 text-black">
                    <label className="text-sm font-black uppercase text-gray-500 tracking-widest ml-1">Item Name</label>
                    <input 
                      type="text" required value={formData.itemName}
                      onChange={e => setFormData({...formData, itemName: e.target.value})}
                      placeholder="e.g. TRIMMER, TV, FRIDGE"
                      className="bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl outline-none focus:border-black text-xl font-bold transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-3 text-black">
                    <label className="text-sm font-black uppercase text-gray-500 tracking-widest ml-1">Fault Description</label>
                    <textarea 
                      required value={formData.fault}
                      onChange={e => setFormData({...formData, fault: e.target.value})}
                      placeholder="Explain the problem..."
                      className="bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl outline-none focus:border-black text-xl font-bold h-40 resize-none transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-3 text-black">
                    <label className="text-sm font-black uppercase text-gray-500 tracking-widest ml-1">Advance Received (Optional)</label>
                    <input 
                      type="number" value={formData.advanceReceived}
                      onChange={e => setFormData({...formData, advanceReceived: e.target.value})}
                      placeholder="e.g. 500"
                      className="bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl outline-none focus:border-black text-xl font-bold transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-3 text-black">
                    <label className="text-sm font-black uppercase text-gray-500 tracking-widest ml-1">Estimate Given (Optional)</label>
                    <input 
                      type="number" value={formData.estimateGiven}
                      onChange={e => setFormData({...formData, estimateGiven: e.target.value})}
                      placeholder="e.g. 1500"
                      className="bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl outline-none focus:border-black text-xl font-bold transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-3 text-black">
                    <label className="text-sm font-black uppercase text-gray-500 tracking-widest ml-1">Promised Delivery Date (Optional)</label>
                    <input 
                      type="date" value={formData.promisedDate}
                      onChange={e => setFormData({...formData, promisedDate: e.target.value})}
                      className="bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl outline-none focus:border-black text-xl font-bold transition-all"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-8 bg-black text-white font-black uppercase text-2xl rounded-2xl mt-4 active:scale-95 transition-all shadow-2xl"
                  >
                    SAVE TO QUEUE
                  </button>
                </form>
              </div>
            )}
          </section>

          {/* WORK QUEUE LIST */}
          <div className="flex flex-col gap-10 w-full">
            <div className="flex items-center gap-4 px-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] italic">Work Queue</h2>
              <div className="h-1 flex-1 bg-slate-800 rounded-full"></div>
            </div>
            
            <div className="flex flex-col gap-16">
              {sortedItems.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-900 rounded-3xl">
                  <p className="text-slate-800 font-bold uppercase tracking-widest text-xs">No active repairs</p>
                </div>
              ) : (
                sortedItems.map(item => {
                  const itemDate = item.promisedDate ? new Date(item.promisedDate) : null;
                  const isOverdue = itemDate && itemDate < today;

                  return (
                    <div 
                      key={item.id}
                      className={`bg-white text-black p-8 rounded-none flex flex-col gap-8 shadow-2xl w-full border-[10px] ${
                        isOverdue ? 'border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.3)]' : 'border-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.1)]'
                      }`}
                    >
                      {/* Header: Customer : Item */}
                      <div className="flex justify-between items-start border-b-2 border-gray-100 pb-6">
                          <div className="flex flex-col gap-2">
                              {isOverdue && (
                                  <span className="text-xl font-black text-red-600 uppercase tracking-widest animate-pulse">⚠️ LATE / OVERDUE</span>
                              )}
                              <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-tight text-black">
                                  {item.customerName} : {item.itemName}
                              </h3>
                          </div>
                          <div className="flex gap-2">
                              <button onClick={() => handlePrint(item)} className="text-blue-600 hover:text-blue-800 transition-colors p-2" title="Print Receipt">
                                  <Printer size={32} />
                              </button>
                              <button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                                  <Trash2 size={32} />
                              </button>
                          </div>
                      </div>

                      {/* Line 2: Blue Box (Number of Calls) */}
                      <div className="bg-blue-600 text-white p-4 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-xl font-black uppercase tracking-widest">
                              Number of Calls: {item.callCount}
                          </span>
                      </div>

                      {/* Information Section - Single Line per Detail */}
                      <div className="flex flex-col gap-6">
                          <div className="flex items-center gap-4 flex-wrap">
                              <span className="text-xs font-black text-gray-400 uppercase tracking-widest shrink-0">Issue:</span>
                              <span className="text-2xl font-bold text-gray-900 italic">"{item.fault}"</span>
                          </div>

                          <div className="flex items-center gap-4 flex-wrap">
                              <span className="text-xs font-black text-gray-400 uppercase tracking-widest shrink-0">Contact:</span>
                              <span className="text-2xl font-black tracking-[0.1em] font-mono text-black">{item.phoneNumber}</span>
                          </div>

                          <div className="flex items-center gap-4 flex-wrap">
                              <span className="text-xs font-black text-gray-400 uppercase tracking-widest shrink-0">Advance:</span>
                              {item.advanceReceived !== undefined ? (
                                <button onClick={() => updateAdvance(item.id)} className="text-2xl font-bold text-green-600">
                                  ₹{item.advanceReceived}
                                </button>
                              ) : (
                                <button onClick={() => updateAdvance(item.id)} className="bg-gray-100 text-gray-500 text-xs font-black px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-gray-200 border-2 border-dashed border-gray-300">
                                  Add Advance
                                </button>
                              )}
                          </div>

                          <div className="flex items-center gap-4 flex-wrap">
                              <span className="text-xs font-black text-gray-400 uppercase tracking-widest shrink-0">Estimate:</span>
                              {item.estimateGiven !== undefined ? (
                                <button onClick={() => updateEstimate(item.id)} className="text-2xl font-bold text-blue-600">
                                  ₹{item.estimateGiven}
                                </button>
                              ) : (
                                <button onClick={() => updateEstimate(item.id)} className="bg-gray-100 text-gray-500 text-xs font-black px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-gray-200 border-2 border-dashed border-gray-300">
                                  Add Estimate
                                </button>
                              )}
                          </div>

                          <div className="flex items-center gap-4 flex-wrap">
                              <span className="text-xs font-black text-gray-400 uppercase tracking-widest shrink-0">Promised:</span>
                              <div className="relative">
                                  <label className="flex items-center cursor-pointer">
                                    {item.promisedDate ? (
                                      <span className={`text-2xl font-black uppercase italic ${isOverdue ? 'text-red-600 underline decoration-4 underline-offset-8' : 'text-black'}`}>
                                        {new Date(item.promisedDate).toLocaleDateString(undefined, { 
                                            weekday: 'long',
                                            month: 'short', 
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                      </span>
                                    ) : (
                                      <div className="flex items-center px-6 py-3 bg-gray-100 text-gray-500 text-sm font-black rounded-xl uppercase tracking-widest hover:bg-gray-200 border-2 border-dashed border-gray-300">
                                        <Calendar size={18} className="mr-2" /> Set Date
                                      </div>
                                    )}
                                    <input 
                                        type="date" 
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        onChange={(e) => updateDate(item.id, e.target.value)}
                                        onClick={(e) => (e.target as any).showPicker?.()}
                                    />
                                  </label>
                              </div>
                          </div>
                      </div>

                      {/* Large Full-Width Buttons */}
                      <div className="flex flex-col gap-6 pt-4">
                        <button 
                          onClick={() => incrementCall(item.id)}
                          className="w-full py-6 bg-blue-50 text-blue-600 font-black text-xl rounded-xl border-4 border-blue-100 flex items-center justify-center gap-4 active:scale-95 transition-all shadow-sm"
                        >
                          <Phone size={28} strokeWidth={3} /> CALLED ({item.callCount})
                        </button>

                        <button 
                          onClick={() => completeRepair(item)}
                          className="w-full py-8 bg-black text-white font-black text-2xl rounded-xl flex items-center justify-center gap-4 active:scale-95 transition-all shadow-xl italic uppercase tracking-widest"
                        >
                          <CheckCircle size={32} strokeWidth={3} /> COMPLETE REPAIR
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>

      {/* PRINT RECEIPT TEMPLATE (OUTSIDE MAIN CONTAINER) */}
      {printingItem && (
        <div className="hidden print:block bg-white text-black p-4 font-sans">
          <div className="w-full max-w-[300px] mx-auto border-2 border-black p-4 space-y-4">
            {/* Header */}
            <div className="text-center border-b-2 border-black pb-2">
              <h1 className="text-xl font-black uppercase">RAO ELECTRONICS</h1>
              <p className="text-[10px] font-bold">T D West Road, ERNAKULAM-682035</p>
              <p className="text-[10px] font-black">Contact: 9446469976</p>
            </div>

            {/* Receipt Info */}
            <div className="flex justify-between text-[8px] font-bold border-b border-gray-200 pb-1">
              <span>No: {printingItem.id.slice(0, 8).toUpperCase()}</span>
              <span>{new Date().toLocaleString()}</span>
            </div>

            {/* Customer Details */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-500 uppercase">Customer:</span>
                <span className="text-sm font-bold uppercase">{printingItem.customerName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-500 uppercase">Phone:</span>
                <span className="text-sm font-bold">{printingItem.phoneNumber}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-500 uppercase">Item:</span>
                <span className="text-sm font-bold uppercase italic">{printingItem.itemName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-500 uppercase">Issue:</span>
                <span className="text-sm font-bold italic">"{printingItem.fault}"</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border-t-2 border-black pt-2 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase">Advance:</span>
                <span className="text-lg font-black">₹{printingItem.advanceReceived || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase">Estimate:</span>
                <span className="text-lg font-black">₹{printingItem.estimateGiven || 0}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-dashed border-gray-300 mt-4">
              <p className="text-[10px] font-black uppercase italic">Thank you!</p>
              <p className="text-[6px] mt-1 opacity-50 uppercase tracking-widest">Rao Engineering Systems</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}