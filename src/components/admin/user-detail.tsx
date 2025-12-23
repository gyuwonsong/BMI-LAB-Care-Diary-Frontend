"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/home/calendar";
import {
  EMOTION_LABELS,
  Emotion,
  UI_TEXT,
  EMOTION_CONFIG,
  REFLECTION_QUESTIONS,
} from "@/lib/constants";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

interface UserDetailProps {
  user: User & {
    birthDate: string;
    disease: string;
    diaryCount: number;
    risk?: { isRisk: boolean; reason: string };
  };
}

export function UserDetail({ user }: UserDetailProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const monthDiaryCount = 12;
  const yearDiaryCount = user.diaryCount;
  const emotionCounts = {
    [Emotion.HAPPY]: 8,
    [Emotion.LOVE]: 3,
    [Emotion.SAD]: 1,
  };

  const diaryDates = [2, 4, 5, 6, 8, 9, 12, 25, 27];

  const selectedDiary =
    selectedDate && diaryDates.includes(selectedDate)
      ? {
          id: `id-${selectedDate}`,
          date: `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`,
          time: "22:49",
          emotion: Emotion.HAPPY,
          content:
            "오늘은 가족들과 함께 공원에 다녀왔습니다. 날씨도 좋고 기분이 좋았어요.",
          reflectionScores: [8, 5, 3, 7, 6, 9],
        }
      : null;

  const surveySessions = [
    { session: 1, anger: 12, anxiety: 15, depression: 18, date: "2025.11.01" },
    { session: 2, anger: 10, anxiety: 13, depression: 16, date: "2025.11.08" },
    { session: 3, anger: 8, anxiety: 11, depression: 14, date: "2025.11.15" },
    { session: 4, anger: 6, anxiety: 9, depression: 12, date: "2025.11.22" },
    { session: 5, anger: 5, anxiety: 7, depression: 10, date: "2025.11.29" },
  ];

  const handleDateSelect = (date: number | null) => {
    if (selectedDate === date) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  const handleOpenSdohResults = (diaryId: string) => {
    router.push(`/admin/sdoh/${diaryId}`);
  };

  const router = useRouter();

  return (
    <div className="px-10 py-6 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{user.name}의 일기</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {user.birthDate} · {user.disease}
        </p>
      </div>

      {user.risk?.isRisk && (
        <Card className="mb-6 border-destructive/50 bg-destructive/5 rounded-sm">
          <CardHeader>
            <CardTitle className="text-base text-destructive flex items-center">
              ⚠️ 리스크 감지 사유
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive leading-relaxed -mt-4">
              : {user.risk.reason}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mb-6 grid grid-cols-4 gap-4 items-stretch">
        <Card className="rounded-sm h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-base">캘린더</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <Calendar
              year={currentYear}
              month={currentMonth}
              onMonthChange={(year, month) => {
                setCurrentYear(year);
                setCurrentMonth(month);
              }}
              diaryDates={diaryDates}
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
          </CardContent>
        </Card>

        <div className="col-span-3 h-full grid grid-rows-3 gap-4">
          <Card className="rounded-sm h-full">
            <div className="flex items-center justify-between px-6 py-4 h-full">
              <CardTitle className="text-base">
                {UI_TEXT.HOME.THIS_MONTH}
              </CardTitle>

              <p className="text-2xl font-bold text-primary">
                {monthDiaryCount}건
              </p>
            </div>
          </Card>

          <Card className="rounded-sm h-full">
            <div className="flex items-center justify-between px-6 py-4 h-full">
              <CardTitle className="text-base">
                {UI_TEXT.HOME.THIS_YEAR}
              </CardTitle>

              <p className="text-2xl font-bold text-primary">
                {yearDiaryCount}건
              </p>
            </div>
          </Card>

          <Card className="border-border bg-card rounded-sm h-full">
            <div className="flex items-center justify-between px-6 py-4 h-full">
              <CardTitle className="text-base">
                {UI_TEXT.HOME.EMOTION_DISTRIBUTION}
              </CardTitle>

              <div className="flex items-center gap-2">
                {Object.values(Emotion).map((emotion) => {
                  const config = EMOTION_CONFIG[emotion];
                  const Icon = config.icon;
                  const count = emotionCounts[emotion] || 0;

                  return (
                    <div
                      key={emotion}
                      className={`flex items-center gap-2 rounded-sm px-3 py-1.5 ${config.bgColor}`}
                    >
                      <Icon className={`h-4 w-4 ${config.color}`} />

                      <span className="text-sm ">
                        {EMOTION_LABELS[emotion]}
                      </span>

                      <span className="text-sm font-bold ">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {selectedDiary && (
        <Card className="mb-6 rounded-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>
                {currentYear}년 {currentMonth}월 {selectedDate}일 일기
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  작성 일시: {selectedDiary.date} {selectedDiary.time}
                </span>
                <Button
                  variant="outline"
                  className="rounded-sm"
                  onClick={() => handleOpenSdohResults(selectedDiary.id)}
                >
                  SDoH 결과 확인
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">내 기분은?</span>
              {(() => {
                const emotion = selectedDiary.emotion;
                const config = EMOTION_CONFIG[emotion];
                const Icon = config.icon;

                return (
                  <div
                    className={`flex items-center gap-2 rounded-sm px-3 py-1 ${config.bgColor}`}
                  >
                    <Icon className={`h-4 w-4 ${config.color}`} />
                    <span className="font-medium text-sm">
                      {EMOTION_LABELS[emotion]}
                    </span>
                  </div>
                );
              })()}
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">일기 내용 필드</h3>
              <div className="rounded-sm border bg-muted/30 p-4 text-sm">
                <p className="leading-relaxed">{selectedDiary.content}</p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium">생각 정리 요약</h3>

              <div className="overflow-hidden rounded-sm border bg-muted/30">
                {REFLECTION_QUESTIONS.map((question, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 text-sm",
                      index !== REFLECTION_QUESTIONS.length - 1 &&
                        "border-b border-border",
                    )}
                  >
                    <p className="flex-1 text-muted-foreground">{question}</p>
                    <span className="ml-4 text-lg font-semibold text-primary">
                      {selectedDiary.reflectionScores[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>
              설문 리스트
              <p className="text-sm text-muted-foreground mt-2 font-normal">
                1회기는 일주일을 기준으로 하며, 8회기가 지날 때마다 설문에
                참여하게 됩니다.
              </p>
            </CardTitle>
            <Button
              variant="outline"
              className="rounded-sm"
              onClick={() => router.push("/analysis/graphs")}
            >
              설문 통계 확인
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-sm border border-border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border-b border-border p-3 text-sm font-medium text-center">
                    설문 차수
                  </th>
                  <th className="border-b border-border p-3 text-sm font-medium text-center">
                    불안 점수
                  </th>
                  <th className="border-b border-border p-3 text-sm font-medium text-center">
                    우울 점수
                  </th>
                  <th className="border-b border-border p-3 text-sm font-medium text-center">
                    분노 점수
                  </th>
                  <th className="border-b border-border p-3 text-sm font-medium text-center">
                    작성일
                  </th>
                  <th className="border-b border-border p-3 text-sm font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {surveySessions.map((result) => (
                  <tr key={result.session} className="hover:bg-muted/50">
                    <td className="border-b border-border p-3 text-sm text-center">
                      {result.session}
                    </td>
                    <td className="border-b border-border p-3 text-sm font-medium text-center">
                      {result.anxiety}점
                    </td>
                    <td className="border-b border-border p-3 text-sm font-medium text-center">
                      {result.depression}점
                    </td>
                    <td className="border-b border-border p-3 text-sm font-medium text-center">
                      {result.anger}점
                    </td>
                    <td className="border-b border-border p-3 text-sm text-muted-foreground text-center">
                      {result.date}
                    </td>
                    <td className="border-b border-border p-3 text-sm text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:underline hover:text-primary rounded-sm"
                        onClick={() =>
                          router.push(
                            `/admin/survey/${user.id}/${result.session}`,
                          )
                        }
                      >
                        설문 결과 확인
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
