import React, { useState } from "react";
import { RefreshCw, ArrowRightLeft } from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import Footer from "../components/layout/Footer";

export default function Currency() {
  const [amount, setAmount] = useState(100);
  const RATE = 48.5; // سعر تقريبي للدولار مقابل الجنيه المصري

  return (
    <div className="min-h-dvh bg-white font-body bg-[#FAF6ED]">
      <SiteNavbar />
      <main className="mx-auto max-w-xl px-6 py-10  bg-[#FAF6ED]">
        <h1 className="text-3xl font-bold text-black text-center">
          Currency Converter
        </h1>
        <p className="mt-2 text-center text-[#4C4546]">
          Convert USD / EUR to Egyptian Pound (EGP).
        </p>

        <div className="mt-8 rounded-2xl bg-[#EDE0C9] p-8 text-center">
          <label className="text-xs font-bold text-[#846B20]">
            Amount in USD ($)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-2 w-full rounded-xl bg-white p-3 text-center text-xl font-bold outline-none border border-gray-200"
          />

          <div className="my-4 flex justify-center">
            <div className="rounded-full bg-[#BD8C1A] p-2 text-white">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
          </div>

          <label className="text-xs font-bold text-[#846B20]">
            Equivalent in Egyptian Pound (EGP)
          </label>
          <div className="mt-2 text-3xl font-bold text-[#4F3B00]">
            {(amount * RATE).toFixed(2)} EGP
          </div>
          <p className="mt-2 text-xs text-gray-500">
            1 USD = {RATE} EGP (Approximate market rate)
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
