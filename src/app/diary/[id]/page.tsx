"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Emotion, EMOTION_LABELS, EMOTION_CONFIG } from "@/lib/constants";
import { formatKoreanDate } from "@/utils/date";

export default function DiaryDetailPage() {
  const diary = {
    emotion: Emotion.HAPPY,
    content:
      "오늘은 병원에 다녀왔다. 검사 결과가 좋아서 안심이 되었다. 가족들과 함께 저녁 식사를 하며 즐거운 시간을 보냈다. 건강이 조금씩 나아지고 있다는 것을 느낄 수 있어서 감사하다. 내일도 좋은 일이 있기를 기대해본다.",
    reflection1: 8,
    reflection2: 7,
    date: "2025-10-27",
    time: "22:49",
  };

  const today = formatKoreanDate(new Date(diary.date));
  const emotionConfig = EMOTION_CONFIG[diary.emotion];
  const EmotionIcon = emotionConfig.icon;

  return (
    <div className="min-h-screen bg-secondary">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className=" flex h-16 max-w-3xl items-center gap-4 px-6">
          <Link href="/diary/list">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">일기 상세 ({today})</h1>
        </div>
      </header>

      <main className="container max-w-5xl py-8 mx-auto">
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`
        flex h-10 w-10 shrink-0 items-center justify-center rounded-full
        ${emotionConfig.bgColor}
      `}
                >
                  <EmotionIcon className={`h-5 w-5 ${emotionConfig.color}`} />
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {EMOTION_LABELS[diary.emotion]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {today} {diary.time}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                일기 내용
              </p>
              <p className="leading-relaxed text-foreground">{diary.content}</p>
            </div>

            <div className="space-y-4 rounded-lg bg-muted p-6">
              <p className="font-medium">생각 정리 점수</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    깊은 내면의 감정 표현
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 rounded-full bg-background">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(diary.reflection1 / 10) * 100}%` }}
                      />
                    </div>
                    <p className="w-8 text-right font-semibold text-primary">
                      {diary.reflection1}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">경험의 의미</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 rounded-full bg-background">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(diary.reflection2 / 10) * 100}%` }}
                      />
                    </div>
                    <p className="w-8 text-right font-semibold text-primary">
                      {diary.reflection2}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="/diary/list" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  size="lg"
                >
                  목록으로
                </Button>
              </Link>
              <Link href="/home" className="flex-1">
                <Button className="w-full" size="lg">
                  홈으로
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
