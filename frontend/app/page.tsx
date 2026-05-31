"use client";

import { useState } from "react";
import NDAForm from "@/components/NDAForm";
import NDAPreview from "@/components/NDAPreview";
import { NDAFormData, defaultFormData } from "@/lib/types";

export default function Home() {
  const [formData, setFormData] = useState<NDAFormData>(defaultFormData);
  const [view, setView] = useState<"form" | "preview">("form");

  const handleSubmit = (data: NDAFormData) => {
    setFormData(data);
    setView("preview");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setView("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      {view === "form" ? (
        <NDAForm initialData={formData} onSubmit={handleSubmit} />
      ) : (
        <NDAPreview data={formData} onBack={handleBack} />
      )}
    </main>
  );
}
