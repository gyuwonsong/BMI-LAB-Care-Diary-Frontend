"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmotionSelector } from "@/components/common/emotion-selector";
import { SliderGroup } from "@/components/common/slider-group";
import { type Emotion, REFLECTION_QUESTIONS, UI_TEXT } from "@/lib/constants";
import { formatKoreanDate } from "@/utils/date";

export default function DiaryWritePage() {
  const router = useRouter();
  const [step, setStep] = useState<"write" | "reflect">("write");
  const [emotion, setEmotion] = useState<Emotion | null>(null);
  const [content, setContent] = useState("");
  const [reflection1, setReflection1] = useState(5);
  const [reflection2, setReflection2] = useState(5);

  const handleNext = () => {
    if (step === "write") {
      setStep("reflect");
    } else {
      console.log({ emotion, content, reflection1, reflection2 });
      router.push("/diary/summary");
    }
  };

  const canProceed =
    step === "write" ? emotion && content.trim().length > 0 : true;

  const today = formatKoreanDate(new Date());

  return (
    <div className="min-h-screen bg-secondary">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className=" flex h-16 max-w-3xl items-center gap-4 px-6">
          <Link href="/home">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">
            {step === "write"
              ? `오늘의 일기 (${today})`
              : `생각 정리하기 (${today})`}
          </h1>
        </div>
      </header>

      <main className="container max-w-5xl py-8 mx-auto">
        <div className="rounded-sm border bg-card p-8">
          {step === "write" ? (
            <div className="space-y-8">
              <div>
                <h2 className="mb-6 text-lg font-semibold">
                  {UI_TEXT.DIARY.SELECT_EMOTION}
                </h2>
                <EmotionSelector selected={emotion} onSelect={setEmotion} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="content" className="text-base font-medium">
                    {UI_TEXT.DIARY.WRITE_CONTENT}
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    className="rounded-sm bg-transparent"
                  >
                    추천 질문 보기
                  </Button>
                </div>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="오늘 하루를 자유롭게 기록해보세요 💭"
                  rows={12}
                  className="resize-none rounded-sm text-base leading-relaxed"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">생각 정리하기</h2>
              <SliderGroup
                sliders={[
                  {
                    question: REFLECTION_QUESTIONS[0],
                    value: reflection1,
                    onChange: setReflection1,
                  },
                  {
                    question: REFLECTION_QUESTIONS[1],
                    value: reflection2,
                    onChange: setReflection2,
                  },
                ]}
              />
            </div>
          )}

          <div className="mt-8">
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="w-full rounded-sm"
              size="lg"
            >
              {step === "write" ? "다음" : "완료"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
