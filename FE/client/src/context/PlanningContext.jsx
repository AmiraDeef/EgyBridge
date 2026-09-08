import React, { createContext, useContext, useState, useEffect } from "react";

const PlanningContext = createContext();

export function PlanningProvider({ children }) {
  // قراءة البيانات من localStorage لو الصفحة حصلها Refresh
  const [draft, setDraft] = useState(() => {
    const savedData = localStorage.getItem("trip_planning_draft");
    return savedData ? JSON.parse(savedData) : {
      travelerType: "",
      dates: { start: "", end: "" },
      budget: 500,
      destinations: [],
      interests: [],
      pace: "moderate"
    };
  });

  // حفظ البيانات تلقائياً مع أي تغيير
  useEffect(() => {
    localStorage.setItem("trip_planning_draft", JSON.stringify(draft));
  }, [draft]);

  // دالة لتحديث جزء معيين من البيانات بدون مسح باقي الخطوات
  const updateDraft = (key, value) => {
    setDraft((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // دالة لتفريغ البيانات بعد الحفظ أو البدء من جديد
  const resetDraft = () => {
    localStorage.removeItem("trip_planning_draft");
    setDraft({
      travelerType: "",
      dates: { start: "", end: "" },
      budget: 500,
      destinations: [],
      interests: [],
      pace: "moderate"
    });
  };

  return (
    <PlanningContext.Provider value={{ draft, updateDraft, resetDraft }}>
      {children}
    </PlanningContext.Provider>
  );
}

export const usePlanningDraft = () => useContext(PlanningContext);