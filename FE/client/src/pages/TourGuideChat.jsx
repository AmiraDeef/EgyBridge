import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Camera,
  Sun,
  Clock,
  Compass,
  Building2,
  ShieldCheck,
  User,
} from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";

const QUICK_SUGGESTIONS = [
  "How much are Valley of the Kings tickets?",
  "Best authentic Upper Egyptian restaurants",
  "Book Hot Air Balloon tour",
];

const QUICK_TAGS = [
  "Geographical Regions:",
  "Greater Cairo & Giza",
  "Delta & Alexandria",
  "Upper Egypt & Nubia",
];

export default function TourGuideChat() {
  const { user } = useAuth();

  const userName =
    user?.name ||
    user?.firstName ||
    user?.username ||
    user?.fullName ||
    user?.data?.name ||
    user?.data?.firstName ||
    "Traveler";

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: `Welcome ${userName}! I am your AI Tourist Guide for Egypt. How can I assist you with your itinerary today?`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://egy-backend.vercel.app/api/user/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, userName }),
      });

      const data = await res.json();

      const botReply = {
        id: Date.now() + 1,
        sender: "bot",
        text: data.reply || "Sorry, I couldn't process that. Please try again.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error("Chat API Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "I am having trouble connecting to the server right now.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#FAF6ED] font-body flex flex-col justify-between">
      <div className="sticky top-0 z-50 w-full bg-[#FAF6ED]/95 backdrop-blur-md border-b border-[#EDE0C9]">
        <SiteNavbar />
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 flex-1 space-y-6">
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-white/60 p-3 shadow-sm border border-[#E2D0A7]">
          {QUICK_TAGS.map((tag, idx) => (
            <button
              key={tag}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                idx === 0
                  ? "bg-transparent text-[#736348]"
                  : "bg-[#EFE9DC] text-[#5C4000] hover:bg-[#BD8C1A] hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 ">
          <div className="flex h-[600px] flex-col rounded-2xl border border-[#DCD3C1] bg-white shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-[#EFE9DC] bg-[#FAF6ED] p-4 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#BD8C1A] text-white shadow-sm">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-[#3B2F1E]">
                    {userName}
                    <span className="flex items-center gap-1 rounded bg-[#BD8C1A]/10 px-2 py-0.5 text-[10px] text-[#BD8C1A]">
                      <ShieldCheck className="h-3 w-3" /> Active User
                    </span>
                  </h3>
                  <p className="text-xs text-[#736348]">
                    EGI RISE Traveler Member
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      msg.sender === "user"
                        ? "bg-[#5C4000] text-white rounded-br-none"
                        : "bg-[#EFE9DC] text-[#3B2F1E] rounded-bl-none border border-[#DCD3C1]"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </p>
                    <span
                      className={`mt-1 block text-[10px] text-right ${
                        msg.sender === "user"
                          ? "text-white/70"
                          : "text-[#736348]"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-xs text-[#736348] italic">
                  AI Assistant is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex flex-wrap gap-2 px-4 py-2 bg-[#FAF6ED]/50 border-t border-[#EFE9DC]">
              {QUICK_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  onClick={() => handleSend(sug)}
                  className="rounded-full border border-[#BD8C1A]/30 bg-white px-3 py-1 text-xs text-[#5C4000] transition-colors hover:bg-[#BD8C1A] hover:text-white"
                >
                  {sug}
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-[#EFE9DC] bg-white rounded-b-2xl">
              <div className="flex items-center gap-2 rounded-xl border border-[#DCD3C1] bg-[#FAF6ED] px-3 py-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about governorates, landmarks, ticket prices..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#736348]/60"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading}
                  className="flex items-center gap-1 rounded-lg bg-[#BD8C1A] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#A87B16] disabled:opacity-50"
                >
                  Send <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#DCD3C1] bg-[#EFE9DC] p-5 shadow-sm space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#BD8C1A]">
                  Capital of Civilizations
                </span>
                <h2 className="text-xl font-bold text-[#3B2F1E]">
                  Luxor Governorate
                </h2>
                <p className="mt-1 text-xs text-[#736348]">
                  Ancient Thebes - The world's largest open-air museum.
                </p>
              </div>

              <div className="rounded-xl bg-[#5C4000] p-4 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-[#BD8C1A]" />
                    <span className="text-sm font-semibold">29°C Sunny</span>
                  </div>
                  <span className="text-xs text-[#E2D8C3]">Pleasant</span>
                </div>
                <p className="text-[11px] text-[#E2D8C3]">
                  85 Registered Historical Sites & Monuments
                </p>
              </div>

              <div className="space-y-2 border-t border-[#DCD3C1] pt-3 text-xs">
                <div className="flex items-center justify-between text-[#3B2F1E]">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Clock className="h-3.5 w-3.5 text-[#BD8C1A]" /> Karnak
                    Temple
                  </span>
                  <span>06:00 AM - 08:00 PM</span>
                </div>
                <div className="flex items-center justify-between text-[#3B2F1E]">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Building2 className="h-3.5 w-3.5 text-[#BD8C1A]" /> Valley
                    of Kings
                  </span>
                  <span>06:00 AM - 05:00 PM</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-[#5C4000] to-[#3B2F1E] p-5 text-white shadow-md space-y-3">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-[#BD8C1A]" />
                <h4 className="font-bold text-sm">Smart Monument Scanner</h4>
              </div>
              <p className="text-xs text-[#E2D8C3]">
                Archaeological AI & instant hieroglyphics translation.
              </p>

              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#BD8C1A] py-2.5 text-xs font-bold transition-all hover:bg-[#A87B16]">
                <Sparkles className="h-4 w-4" /> Launch Smart Camera
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
