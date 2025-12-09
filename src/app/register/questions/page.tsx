"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { INITIAL_QUESTIONS } from "@/lib/constants";

export default function QuestionsPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Initial questions:", answers);
    router.push("/home");
  };

  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-2xl border-0 shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold">초기 문진</CardTitle>
          <CardDescription>
            현재 상황에 대해 자유롭게 작성해주세요. 이 정보는 더 나은 돌봄을
            위해 사용됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {INITIAL_QUESTIONS.map((question, index) => (
              <div key={index} className="space-y-2">
                <Label
                  htmlFor={`question-${index}`}
                  className="text-base font-medium"
                >
                  {index + 1}. {question}
                </Label>
                <Textarea
                  id={`question-${index}`}
                  value={answers[index]}
                  onChange={(e) => updateAnswer(index, e.target.value)}
                  placeholder="자유롭게 작성해주세요..."
                  rows={4}
                  required
                  className="resize-none"
                />
              </div>
            ))}

            <Button type="submit" className="w-full" size="lg">
              시작하기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
