"use client";

import { useRouter } from "next/navigation";
import SurveyForm from "@/components/survey/survey-form";

export default function SurveyPage() {
  const router = useRouter();

  return (
    <SurveyForm
      mode="SESSION"
      onCompleteAction={() => router.replace("/home")}
    />
  );
}
