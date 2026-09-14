import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronDown,
  ArrowRightLeft,
  X,
  Mic,
  Copy,
  Volume2,
  Check,
} from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import Footer from "../components/layout/Footer";
import characterImg from "../assets/serCharacter.png";

export default function Translation() {
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("ar");
  const [inputText, setInputText] = useState("Hello");
  const [translatedText, setTranslatedText] = useState("مرحبا");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // دالة الترجمة الفعلية عبر API مجاني وحقيقي
  const handleTranslate = useCallback(
    async (text = inputText, src = sourceLang, tgt = targetLang) => {
      if (!text.trim()) {
        setTranslatedText("");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            text,
          )}&langpair=${src}|${tgt}`,
        );
        const data = await res.json();
        if (data?.responseData?.translatedText) {
          setTranslatedText(data.responseData.translatedText);
        }
      } catch (err) {
        console.error("Translation error:", err);
      } finally {
        setLoading(false);
      }
    },
    [inputText, sourceLang, targetLang],
  );

  // ترجمة تلقائية فور الكتابة مع تأخير بسيط
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputText.trim()) {
        handleTranslate(inputText, sourceLang, targetLang);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [inputText, sourceLang, targetLang, handleTranslate]);

  const handleSwap = () => {
    const prevSrc = sourceLang;
    const prevTgt = targetLang;
    const prevInput = inputText;
    const prevTrans = translatedText;

    setSourceLang(prevTgt);
    setTargetLang(prevSrc);
    setInputText(prevTrans);
    setTranslatedText(prevInput);
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeech = (text, lang) => {
    if (!text || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "ar" ? "ar-SA" : "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-dvh bg-[#FAF6ED] font-body flex flex-col justify-between">
      <SiteNavbar />

      <main className="mx-auto w-full max-w-4xl px-4 py-8 flex-1 flex flex-col items-center justify-center">
        {/* Header Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-widest text-[#3B2D0C] sm:text-4xl uppercase">
            TRANSLATION
          </h1>
          <p className="mt-1 text-xs font-semibold text-[#685B3E]">
            Translate while you travel
          </p>
        </div>

        {/* Translation Container */}
        <div className="relative flex w-full flex-col lg:flex-row items-center justify-center">
          {/* Character Image (تم تصغير الحجم وضبط الارتفاع) */}
          <div className="z-20 w-48 sm:w-56 lg:w-64 lg:-mr-6 pointer-events-none -mb-7 lg:mb-0">
            <img
              src={characterImg}
              alt="Character"
              className="w-full max-h-[360px] object-contain drop-shadow-xl"
            />
          </div>

          {/* Main Card */}
          <div className="relative z-10 w-full max-w-xl rounded-3xl border border-[#D8CBB5] bg-[#EFE8D8] p-6 shadow-sm">
            {/* Language Selector Bar */}
            <div className="mb-4 grid grid-cols-2 gap-4 px-2 text-sm font-bold text-[#3B2D0C]">
              <div className="relative flex items-center justify-between">
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="w-full appearance-none bg-transparent pr-6 font-bold outline-none cursor-pointer text-[#3B2D0C]"
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="es">Spanish</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-[#8C6D23]" />
              </div>

              <div className="relative flex items-center justify-between">
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full appearance-none bg-transparent pr-6 font-bold outline-none cursor-pointer text-[#3B2D0C]"
                >
                  <option value="ar">Arabic</option>
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="es">Spanish</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-[#8C6D23]" />
              </div>
            </div>

            {/* Input & Output Box */}
            <div className="relative grid grid-cols-1 gap-2 rounded-2xl bg-[#E2D6C1] p-3 sm:grid-cols-2">
              {/* Source Input */}
              <div className="relative flex flex-col justify-between rounded-xl bg-[#E2D6C1] p-2.5 min-h-[140px]">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full resize-none bg-transparent text-sm font-semibold text-[#3B2D0C] outline-none placeholder:text-[#8C7E64]"
                  placeholder="Type here..."
                />
                <div className="flex items-center gap-3 text-[#8C6D23] pt-2">
                  <button
                    onClick={() => setInputText("")}
                    title="Clear"
                    type="button"
                  >
                    <X className="h-4 w-4 hover:opacity-70 transition" />
                  </button>
                  <button
                    onClick={() => handleSpeech(inputText, sourceLang)}
                    title="Listen"
                    type="button"
                  >
                    <Mic className="h-4 w-4 hover:opacity-70 transition" />
                  </button>
                </div>
              </div>

              {/* Swap Button */}
              <button
                type="button"
                onClick={handleSwap}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#B88E28] text-white shadow-md transition hover:scale-105 active:scale-95"
                title="Swap Languages"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>

              {/* Target Output */}
              <div className="relative flex flex-col justify-between rounded-xl bg-[#E2D6C1] p-2.5 min-h-[140px] text-right">
                <div className="text-sm font-bold text-[#3B2D0C] dir-auto">
                  {loading ? (
                    <span className="text-xs text-[#8C7E64] animate-pulse">
                      Translating...
                    </span>
                  ) : (
                    translatedText || (
                      <span className="text-xs text-[#8C7E64]">
                        Translation...
                      </span>
                    )
                  )}
                </div>
                <div className="flex items-center justify-end gap-3 text-[#8C6D23] pt-2">
                  <button onClick={handleCopy} title="Copy" type="button">
                    {copied ? (
                      <Check className="h-4 w-4 text-green-700" />
                    ) : (
                      <Copy className="h-4 w-4 hover:opacity-70 transition" />
                    )}
                  </button>
                  <button
                    onClick={() => handleSpeech(translatedText, targetLang)}
                    title="Listen"
                    type="button"
                  >
                    <Volume2 className="h-4 w-4 hover:opacity-70 transition" />
                  </button>
                </div>
              </div>
            </div>

            {/* Translate Button */}
            <button
              type="button"
              onClick={() => handleTranslate()}
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#B88E28] py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#A07B20] active:scale-[0.99] disabled:opacity-80"
            >
              {loading ? "Translating..." : "Translate ➔≡"}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
