/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Printer, 
  Upload, 
  Trash2, 
  Plus, 
  FileText, 
  Building2, 
  Truck, 
  MapPin, 
  Calculator, 
  User,
  Image as ImageIcon
} from "lucide-react";

interface ShiftData {
  time: string;
  truckCount: number;
}

interface TransportData {
  companyName: string;
  companyAddress: string;
  logo: string | null;
  itemName: string;
  quantity: string;
  materialPrice: number;
  truckCapacity: number; // ton/trip
  capacityPerShift: number; // ton/shift/truck
  dailyCapacity: number; // ton/cu.m.
  total30Days: number;
  costPerShift: number;
  sourceLocation: string;
  distance: string;
  signerName: string;
  signerPosition: string;
  signature: string | null;
  shifts: [ShiftData, ShiftData, ShiftData];
}

const initialData: TransportData = {
  companyName: "บริษัท ขนส่ง จำกัด",
  companyAddress: "123/456 ถนนสายหลัก แขวง/ตำบล เขต/อำเภอ จังหวัด 10xxx",
  logo: null,
  itemName: "ทรายถมปนเปื้อนไม่เกิน 25 % และ ลูกรัง",
  quantity: "ตามหน้างาน",
  materialPrice: 93.46, // Example: 100 - 7% VAT
  truckCapacity: 30,
  capacityPerShift: 150,
  dailyCapacity: 450,
  total30Days: 13500,
  costPerShift: 200000,
  sourceLocation: "บ่อลูกรัง ต.หนองรี",
  distance: "45 กม.",
  signerName: "นายสมชาย ใจดี",
  signerPosition: "ผู้จัดการและผู้รับมอบอำนาจจากบริษัท",
  signature: null,
  shifts: [
    { time: "08:00 - 16:00", truckCount: 5 },
    { time: "16:00 - 00:00", truckCount: 5 },
    { time: "00:00 - 08:00", truckCount: 5 },
  ],
};

export default function App() {
  const [data, setData] = useState<TransportData>(initialData);
  const [isPreview, setIsPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, field: "logo" | "signature") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const totalTrucks = data.shifts.reduce((acc, shift) => acc + shift.truckCount, 0);
  const dailyTotalCost = data.costPerShift * 3;
  const threeDayTotalCost = dailyTotalCost * 3;
  const vatAmount = threeDayTotalCost * 0.07;
  const netTotal = threeDayTotalCost + vatAmount;

  return (
    <div className="min-h-screen bg-neutral-100 font-sans text-neutral-900 pb-10">
      {/* Navigation / Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-600 rounded-lg text-white">
              <Truck size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">TransportDoc</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="px-4 py-2 text-sm font-medium border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              {isPreview ? "แก้ไขข้อมูล" : "ดูตัวอย่างเอกสาร"}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Printer size={18} />
              พิมพ์เอกสาร
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 print:p-0 print:max-w-none">
        <AnimatePresence mode="wait">
          {!isPreview ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Form Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Company Info */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
                  <div className="flex items-center gap-2 mb-4 text-orange-600">
                    <Building2 size={20} />
                    <h2 className="font-semibold uppercase tracking-wider text-sm">ข้อมูลบริษัท</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-500 uppercase">ชื่อบริษัท</label>
                      <input
                        type="text"
                        value={data.companyName}
                        onChange={(e) => setData({ ...data, companyName: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-500 uppercase">ที่อยู่บริษัท</label>
                      <textarea
                        value={data.companyAddress}
                        onChange={(e) => setData({ ...data, companyAddress: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all h-20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-500 uppercase">โลโก้บริษัท (แนวนอน)</label>
                      <div className="flex items-center gap-4">
                        <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-neutral-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all w-full">
                          <Upload size={18} className="text-neutral-400" />
                          <span className="text-sm text-neutral-600">อัปโหลดรูปภาพ</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "logo")} />
                        </label>
                        {data.logo && (
                          <button onClick={() => setData({ ...data, logo: null })} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Item & Transport Details */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
                  <div className="flex items-center gap-2 mb-4 text-orange-600">
                    <FileText size={20} />
                    <h2 className="font-semibold uppercase tracking-wider text-sm">รายละเอียดสินค้าและการขนส่ง</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-semibold text-neutral-500 uppercase">รายการสินค้า</label>
                      <input
                        type="text"
                        value={data.itemName}
                        onChange={(e) => setData({ ...data, itemName: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-500 uppercase">จำนวน</label>
                      <input
                        type="text"
                        value={data.quantity}
                        onChange={(e) => setData({ ...data, quantity: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-500 uppercase">ราคาวัสดุ (ไม่รวม VAT)</label>
                      <input
                        type="number"
                        value={data.materialPrice}
                        onChange={(e) => setData({ ...data, materialPrice: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-500 uppercase">รถ 1 พ่วง บรรทุกได้ (ตัน/เที่ยว)</label>
                      <input
                        type="number"
                        value={data.truckCapacity}
                        onChange={(e) => setData({ ...data, truckCapacity: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-500 uppercase">บรรทุกได้ (ตัน/กะ/คัน)</label>
                      <input
                        type="number"
                        value={data.capacityPerShift}
                        onChange={(e) => setData({ ...data, capacityPerShift: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-500 uppercase">ปริมาณที่ขนได้ต่อ 1 วัน (ตัน/คิว)</label>
                      <input
                        type="number"
                        value={data.dailyCapacity}
                        onChange={(e) => setData({ ...data, dailyCapacity: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-500 uppercase">รวมปริมาณขนส่งตลอด 30 วัน</label>
                      <input
                        type="number"
                        value={data.total30Days}
                        onChange={(e) => setData({ ...data, total30Days: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-500 uppercase">ค่าวัสดุต่อ 1 กะ (บาท)</label>
                      <input
                        type="number"
                        value={data.costPerShift}
                        onChange={(e) => setData({ ...data, costPerShift: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-500 uppercase">สถานที่ตั้งบ่อ</label>
                      <input
                        type="text"
                        value={data.sourceLocation}
                        onChange={(e) => setData({ ...data, sourceLocation: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-500 uppercase">ระยะทาง (กม.)</label>
                      <input
                        type="text"
                        value={data.distance}
                        onChange={(e) => setData({ ...data, distance: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </section>

                {/* Shift Details */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
                  <div className="flex items-center gap-2 mb-4 text-orange-600">
                    <Truck size={20} />
                    <h2 className="font-semibold uppercase tracking-wider text-sm">ข้อมูลกะการทำงาน</h2>
                  </div>
                  <div className="space-y-4">
                    {data.shifts.map((shift, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-neutral-500 uppercase">กะที่ {index + 1} (เวลา)</label>
                          <input
                            type="text"
                            value={shift.time}
                            onChange={(e) => {
                              const newShifts = [...data.shifts] as [ShiftData, ShiftData, ShiftData];
                              newShifts[index].time = e.target.value;
                              setData({ ...data, shifts: newShifts });
                            }}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-neutral-500 uppercase">จำนวนรถพ่วง (คัน)</label>
                          <input
                            type="number"
                            value={shift.truckCount}
                            onChange={(e) => {
                              const newShifts = [...data.shifts] as [ShiftData, ShiftData, ShiftData];
                              newShifts[index].truckCount = parseInt(e.target.value) || 0;
                              setData({ ...data, shifts: newShifts });
                            }}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar / Signer Info */}
              <div className="space-y-6">
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 sticky top-24">
                  <div className="flex items-center gap-2 mb-4 text-orange-600">
                    <User size={20} />
                    <h2 className="font-semibold uppercase tracking-wider text-sm">ข้อมูลผู้ลงนาม</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-500 uppercase">ชื่อผู้ลงนาม</label>
                      <input
                        type="text"
                        value={data.signerName}
                        onChange={(e) => setData({ ...data, signerName: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-500 uppercase">ตำแหน่ง</label>
                      <textarea
                        value={data.signerPosition}
                        onChange={(e) => setData({ ...data, signerPosition: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all h-24"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-500 uppercase">ลายเซ็น</label>
                      <div className="flex flex-col gap-2">
                        <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-neutral-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all w-full">
                          <Upload size={18} className="text-neutral-400" />
                          <span className="text-sm text-neutral-600">อัปโหลดลายเซ็น</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "signature")} />
                        </label>
                        {data.signature && (
                          <div className="relative group">
                            <img src={data.signature} alt="Signature" className="max-h-20 mx-auto border border-neutral-100 rounded-lg" />
                            <button 
                              onClick={() => setData({ ...data, signature: null })} 
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-neutral-100">
                    <div className="flex items-center gap-2 mb-4 text-orange-600">
                      <Calculator size={20} />
                      <h2 className="font-semibold uppercase tracking-wider text-sm">สรุปค่าใช้จ่าย</h2>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">รวม 3 วัน (ก่อน VAT):</span>
                        <span className="font-semibold">{threeDayTotalCost.toLocaleString()} บาท</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">VAT 7%:</span>
                        <span className="font-semibold">{vatAmount.toLocaleString()} บาท</span>
                      </div>
                      <div className="flex justify-between text-lg pt-2 border-t border-neutral-100">
                        <span className="font-bold">สุทธิ:</span>
                        <span className="font-bold text-orange-600">{netTotal.toLocaleString()} บาท</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex justify-center"
            >
              {/* A4 Landscape Preview */}
              <div 
                ref={printRef}
                id="printable-area"
                className="bg-white shadow-2xl w-[297mm] min-h-[210mm] p-[15mm] flex flex-col print:shadow-none print:p-0 print:w-full print:h-full"
              >
                {/* Header */}
                <div className="flex flex-col mb-6 border-b-2 border-neutral-800 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {data.logo ? (
                        <img src={data.logo} alt="Company Logo" className="max-h-24 object-contain" />
                      ) : (
                        <div className="h-24 w-64 bg-neutral-100 flex items-center justify-center border border-dashed border-neutral-300 rounded text-neutral-400">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </div>
                    <div className="text-right max-w-md">
                      <h3 className="text-xl font-bold text-neutral-900 mb-1">{data.companyName}</h3>
                      <p className="text-sm text-neutral-600 whitespace-pre-line leading-relaxed">
                        {data.companyAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body Table */}
                <div className="flex-grow overflow-x-auto">
                  <table className="w-full border-collapse border-2 border-neutral-800 text-sm">
                    <thead>
                      <tr className="bg-neutral-50">
                        <th className="border-2 border-neutral-800 p-2 text-left font-bold w-1/4">รายการ</th>
                        <th className="border-2 border-neutral-800 p-2 text-center font-bold">งานทราย/ลูกรังพร้อมขนส่ง</th>
                        <th className="border-2 border-neutral-800 p-2 text-center font-bold">วิ่งงาน กะที่ 1<br/><span className="font-normal text-xs">{data.shifts[0].time}</span></th>
                        <th className="border-2 border-neutral-800 p-2 text-center font-bold">วิ่งงาน กะที่ 2<br/><span className="font-normal text-xs">{data.shifts[1].time}</span></th>
                        <th className="border-2 border-neutral-800 p-2 text-center font-bold">วิ่งงาน กะที่ 3<br/><span className="font-normal text-xs">{data.shifts[2].time}</span></th>
                        <th className="border-2 border-neutral-800 p-2 text-center font-bold">รวมใช้รถพ่วงทั้งหมด</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-2 border-neutral-800 p-2 font-bold">รายการ</td>
                        <td className="border-2 border-neutral-800 p-2 text-center" colSpan={4}>{data.itemName}</td>
                        <td className="border-2 border-neutral-800 p-2 text-center font-bold" rowSpan={11}>{totalTrucks} คัน</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-neutral-800 p-2 font-bold">จำนวน</td>
                        <td className="border-2 border-neutral-800 p-2 text-center" colSpan={4}>{data.quantity}</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-neutral-800 p-2 font-bold">ราคาวัสดุ</td>
                        <td className="border-2 border-neutral-800 p-2 text-center" colSpan={4}>{data.materialPrice.toLocaleString()} บาท</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-neutral-800 p-2 font-bold">รถ 1 พ่วง บรรทุกได้...ตัน/เที่ยว</td>
                        <td className="border-2 border-neutral-800 p-2 text-center" colSpan={4}>{data.truckCapacity} ตัน/เที่ยว</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-neutral-800 p-2 font-bold">บรรทุก...ตัน วิ่งได้/กะ/คัน</td>
                        <td className="border-2 border-neutral-800 p-2 text-center" colSpan={4}>{data.capacityPerShift} ตัน</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-neutral-800 p-2 font-bold">ปริมาณที่ขนได้ต่อ 1 วัน (ตัน/คิว)</td>
                        <td className="border-2 border-neutral-800 p-2 text-center" colSpan={4}>{data.dailyCapacity.toLocaleString()} ตัน/คิว</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-neutral-800 p-2 font-bold">รวมปริมาณขนส่งตลอด 30 วัน</td>
                        <td className="border-2 border-neutral-800 p-2 text-center" colSpan={4}>{data.total30Days.toLocaleString()} ตัน</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-neutral-800 p-2 font-bold">ค่าทราย/ค่าลูกรัง(บาท) ต่อ วัน 3 กะ</td>
                        <td className="border-2 border-neutral-800 p-2 text-center" colSpan={4}>
                          กะละ {data.costPerShift.toLocaleString()} บาท × 3 กะ = {dailyTotalCost.toLocaleString()} บาท/วัน
                        </td>
                      </tr>
                      <tr>
                        <td className="border-2 border-neutral-800 p-2 font-bold">สถานที่ตั้งบ่อลูกรัง</td>
                        <td className="border-2 border-neutral-800 p-2 text-center" colSpan={4}>{data.sourceLocation}</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-neutral-800 p-2 font-bold">ระยะทางจากบ่อจนถึงหน้างานก่อสร้าง</td>
                        <td className="border-2 border-neutral-800 p-2 text-center" colSpan={4}>{data.distance}</td>
                      </tr>
                      <tr className="bg-neutral-50">
                        <td className="border-2 border-neutral-800 p-2 font-bold">ค่าใช้จ่ายสุทธิ 3 วัน (บาท) พร้อม VAT 7%</td>
                        <td className="border-2 border-neutral-800 p-2 text-center font-bold text-lg" colSpan={4}>
                          {netTotal.toLocaleString()} บาท 
                          <span className="text-xs font-normal ml-2">
                            (ราคาวัสดุ {threeDayTotalCost.toLocaleString()} + VAT {vatAmount.toLocaleString()})
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-2 border-neutral-800 p-2 font-bold">จำนวนรถพ่วงที่ใช้</td>
                        <td className="border-2 border-neutral-800 p-2 text-center">-</td>
                        <td className="border-2 border-neutral-800 p-2 text-center">{data.shifts[0].truckCount} คัน</td>
                        <td className="border-2 border-neutral-800 p-2 text-center">{data.shifts[1].truckCount} คัน</td>
                        <td className="border-2 border-neutral-800 p-2 text-center">{data.shifts[2].truckCount} คัน</td>
                        <td className="border-2 border-neutral-800 p-2 text-center font-bold">{totalTrucks} คัน</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="mt-12 flex justify-end">
                  <div className="w-80 text-center space-y-4">
                    <p className="font-bold">ขอแสดงความนับถือ</p>
                    <div className="h-24 flex items-center justify-center border-b border-neutral-300 relative">
                      {data.signature ? (
                        <img src={data.signature} alt="Signature" className="max-h-20 object-contain" />
                      ) : (
                        <span className="text-neutral-300 italic">ลายเซ็น</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold">( {data.signerName} )</p>
                      <p className="text-xs text-neutral-600 whitespace-pre-line leading-tight">
                        {data.signerPosition}
                      </p>
                      <p className="text-xs font-bold mt-2">{data.companyName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            background: white;
            margin: 0;
            padding: 0;
          }
          header, button, nav {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          #printable-area {
            width: 100% !important;
            height: 100% !important;
            padding: 15mm !important;
            box-shadow: none !important;
            border: none !important;
          }
          .print-hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
