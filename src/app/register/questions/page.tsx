"use client";

import { useRouter } from "next/navigation";
import SurveyForm from "@/components/survey/survey-form";

export default function RegisterQuestionsPage() {
  const router = useRouter();

  return (
    <SurveyForm
      mode="REGISTER"
      onCompleteAction={() => router.replace("/home")}
    />
  );
}
