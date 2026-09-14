import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Wallet,
  ShieldCheck,
  ArrowRight,
  Hotel,
  Plane,
  Shield,
} from "lucide-react";
import ServiceHeader from "../components/layout/ServiceHeader";
import characterImg from "../assets/serCharacter.png";

export default function Checkout() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  const handlePayment = (e) => {
    e.preventDefault();
    alert("Payment submitted successfully!");
    navigate("/my-trip");
  };

  return (
    <div className="min-h-dvh bg-[#F7F4EB] font-body text-[#3B2F11] flex flex-col justify-between overflow-x-hidden">
      {/* 1. Header الموحد */}
      <ServiceHeader title="CHECKOUT" backPath="/services" />

      {/* 2. Main Content Area */}
      <main className="relative mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 flex-1 flex items-center justify-center bg-[#FAF6ED]">
        <div className="relative flex w-full flex-col lg:flex-row items-center lg:items-center justify-center">
          {/* Character Image */}
          <div className="z-20 w-64 flex-shrink-0 lg:w-64 lg:-mr-13 pointer-events-none mb-6 lg:mb-0">
            <img
              src={characterImg}
              alt="EGI RISE Guide"
              className="h-auto w-full object-contain drop-shadow-xl"
            />
          </div>

          {/* Main Card */}
          <div className="relative z-10 w-full max-w-3xl rounded-3xl border-2 border-[#D9C89E] bg-[#EAE2CA] p-6 sm:p-8 shadow-2xl flex flex-col justify-between min-h-[420px]">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left Column: Summary */}
              <div className="lg:col-span-5 flex flex-col justify-between pr-0 lg:pr-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-[#524016] uppercase">
                    CHECKOUT
                  </h2>
                  <p className="text-[11px] font-semibold text-[#8A7A55] mt-0.5">
                    Review your journey details
                  </p>

                  <div className="mt-6 border-b border-[#D4C49E] pb-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#524016]">
                      YOUR BOOKING
                    </p>
                  </div>

                  <div className="mt-4 space-y-3 text-xs font-semibold text-[#3B2F11]">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 opacity-90">
                        <Hotel className="h-4 w-4 text-[#8A7A55]" />
                        <span>Cairo Hotel</span>
                      </span>
                      <span className="font-bold">$120</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 opacity-90">
                        <Plane className="h-4 w-4 text-[#8A7A55]" />
                        <span>Cairo → Luxor</span>
                      </span>
                      <span className="font-bold">$250</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 opacity-90">
                        <Shield className="h-4 w-4 text-[#8A7A55]" />
                        <span>Insurance</span>
                      </span>
                      <span className="font-bold">$20</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-[#D4C49E] pt-4 flex items-center justify-between">
                  <span className="text-xl font-black text-[#524016]">
                    Total
                  </span>
                  <span className="text-2xl font-black text-[#B5871D]">
                    $390
                  </span>
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="lg:col-span-7 pl-0 lg:pl-4 border-t lg:border-t-0 lg:border-l border-[#D4C49E] pt-6 lg:pt-0">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#8A7A55] mb-3">
                  PAYMENT METHOD
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-bold transition-all border ${
                      paymentMethod === "card"
                        ? "bg-[#C89B2B] text-white border-[#B5871D] shadow-sm"
                        : "bg-[#F4EEDC] text-[#524016] border-[#D4C49E] hover:border-[#B5871D]"
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("wallet")}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-bold transition-all border ${
                      paymentMethod === "wallet"
                        ? "bg-[#C89B2B] text-white border-[#B5871D] shadow-sm"
                        : "bg-[#F4EEDC] text-[#524016] border-[#D4C49E] hover:border-[#B5871D]"
                    }`}
                  >
                    <Wallet className="h-4 w-4" />
                    <span>Wallet</span>
                  </button>
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                  {paymentMethod === "card" ? (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-[#8A7A55] uppercase mb-1">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="XXXX XXXX XXXX XXXX"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full rounded-xl border border-[#D4C49E] bg-[#F4EEDC] px-3.5 py-2 text-xs font-semibold text-[#3B2F11] placeholder-[#A39678] outline-none focus:border-[#B5871D]"
                          />
                          <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A7A55]" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-[#8A7A55] uppercase mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            className="w-full rounded-xl border border-[#D4C49E] bg-[#F4EEDC] px-3.5 py-2 text-xs font-semibold text-[#3B2F11] placeholder-[#A39678] outline-none focus:border-[#B5871D]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#8A7A55] uppercase mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            placeholder="XXX"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            className="w-full rounded-xl border border-[#D4C49E] bg-[#F4EEDC] px-3.5 py-2 text-xs font-semibold text-[#3B2F11] placeholder-[#A39678] outline-none focus:border-[#B5871D]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#8A7A55] uppercase mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          placeholder="Name on card"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="w-full rounded-xl border border-[#D4C49E] bg-[#F4EEDC] px-3.5 py-2 text-xs font-semibold text-[#3B2F11] placeholder-[#A39678] outline-none focus:border-[#B5871D]"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="py-4">
                      <label className="block text-[10px] font-bold text-[#8A7A55] uppercase mb-1">
                        Mobile Wallet Number
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 010XXXXXXX"
                        className="w-full rounded-xl border border-[#D4C49E] bg-[#F4EEDC] px-3.5 py-2 text-xs font-semibold text-[#3B2F11] placeholder-[#A39678] outline-none focus:border-[#B5871D]"
                      />
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="mt-6 border-t border-[#D4C49E] pt-4">
              <button
                type="button"
                onClick={handlePayment}
                className="w-full rounded-xl bg-[#C89B2B] py-3 text-sm font-bold text-white shadow-md hover:bg-[#b08722] transition-all flex items-center justify-center gap-2 group"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Pay Securely</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
