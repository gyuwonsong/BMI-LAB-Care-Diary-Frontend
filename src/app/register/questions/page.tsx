"use client";

import { useRouter } from "next/navigation";
import { SurveyForm } from "@/components/survey/survey-form";

export default function RegisterQuestionsPage() {
  const router = useRouter();

  return (
    <SurveyForm
      mode="register"
      onComplete={(payload) => {
        // TODO: 회원가입 설문 저장 API 호출
        console.log("REGISTER survey payload:", payload);

        router.push("/home");
      }}
    />
  );
}
