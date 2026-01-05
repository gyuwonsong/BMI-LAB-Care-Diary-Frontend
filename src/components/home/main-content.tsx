"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, List, ExternalLink, CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { UI_TEXT } from "@/lib/constants";
import { WelfareServiceItem } from "@/generated-api";

type DiaryEntry = {
  id: string;
  emotion: string;
  content: string;
  date: string;
};

type TodayQuestion = {
  title: string;
  description: string;
};

interface MainContentProps {
  selectedDate: number | null;
  year: number;
  month: number;
  diaryEntries?: DiaryEntry[];

  shouldTakeSessionSurvey?: boolean;
  todayQuestion?: TodayQuestion | null;
  recommendedWelfareServices?: WelfareServiceItem[];
}

function getCurrentWeekText(): string {
  const now = new Date();
  const month = now.getMonth() + 1;
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const dayOfMonth = now.getDate();

  const firstDayOfWeek = firstDay.getDay();
  const weekOfMonth = Math.ceil((dayOfMonth + firstDayOfWeek) / 7);

  const weekLabels = ["첫째", "둘째", "셋째", "넷째", "다섯째"];
  const weekLabel = weekLabels[weekOfMonth - 1] || `${weekOfMonth}`;

  return `${month}월 ${weekLabel}주`;
}

function getLocalTodayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function emotionToKorean(emotion: string): string {
  switch (emotion) {
    case "HAPPY":
      return "행복";
    case "LOVE":
      return "사랑";
    case "SAD":
      return "슬픔";
    default:
      return emotion;
  }
}

export function MainContent({
  selectedDate,
  year,
  month,
  diaryEntries = [],

  shouldTakeSessionSurvey = false,
  todayQuestion = null,
  recommendedWelfareServices = [],
}: MainContentProps) {
  const currentWeekText = getCurrentWeekText();

  const todayISO = getLocalTodayISO();

  const selectedISO = selectedDate
    ? `${year}-${String(month).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
    : null;

  const isFutureSelected = !!selectedISO && selectedISO > todayISO;
  const hasDiaryOnSelectedDate = selectedDate ? diaryEntries.length > 0 : false;

  const renderTopActions = () => (
    <div className="flex items-center justify-between">
      <div className="flex gap-3">
        <Button variant="outline" className="gap-2 rounded-sm" asChild>
          <Link href={`/diary/write?date=${todayISO}`}>
            <Plus className="h-4 w-4" />
            {currentWeekText} 일기 작성
          </Link>
        </Button>

        <Button variant="outline" className="gap-2 rounded-sm" asChild>
          <Link href="/diary/list">
            <List className="h-4 w-4" />
            일기 목록 보기
          </Link>
        </Button>
      </div>

      {shouldTakeSessionSurvey && (
        <Button className="gap-2 rounded-sm" asChild>
          <Link href="/survey">
            <CircleCheckBig className="h-4 w-4" />
            정기 설문 참여
          </Link>
        </Button>
      )}
    </div>
  );

  const renderRecommended = () => {
    if (
      !recommendedWelfareServices ||
      recommendedWelfareServices.length === 0
    ) {
      return (
        <div className="rounded-sm border border-border bg-card p-8">
          <h2 className="text-lg font-semibold">{UI_TEXT.HOME.RECOMMENDED}</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            돌봄 과정에서 도움이 될 수 있는 서비스가 준비 중입니다. 필요할 때
            언제든 안내해드릴게요 ✨
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4 rounded-sm border border-border bg-card p-8">
        <h2 className="text-lg font-semibold">{UI_TEXT.HOME.RECOMMENDED}</h2>

        <div className="space-y-2">
          {recommendedWelfareServices.map((item, idx) => (
            <Card
              key={`${item.serviceName}-${idx}`}
              className="border-border rounded-sm hover:bg-accent/50 transition-colors"
            >
              <CardContent className="flex items-center justify-between px-6">
                <div>
                  <div className="font-medium">{item.serviceName}</div>
                  {item.serviceDigest && (
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {item.serviceDigest}
                    </p>
                  )}
                </div>

                {item.serviceDetailLink && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-sm bg-primary/10 hover:bg-primary/20"
                    asChild
                  >
                    <a
                      href={item.serviceDetailLink}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${item.serviceName} 열기`}
                    >
                      <ExternalLink className="h-4 w-4 text-primary" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderTopActions()}

      {selectedDate && hasDiaryOnSelectedDate ? (
        <>
          <div>
            <h1 className="text-2xl font-bold">
              {year}년 {month}월 {selectedDate}일의 일기
            </h1>
          </div>

          <div className="space-y-4">
            {diaryEntries.map((entry) => (
              <Card key={entry.id} className="border-border rounded-sm bg-card">
                <CardContent className="space-y-5 p-8">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      감정
                    </p>
                    <p className="font-medium">
                      {emotionToKorean(entry.emotion)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      내용
                    </p>
                    <p className="leading-relaxed">{entry.content}</p>
                  </div>

                  <Link href={`/diary/${entry.id}`} className="block">
                    <Button className="w-full rounded-sm" size="lg">
                      전체 내용 보기
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : selectedDate && !hasDiaryOnSelectedDate ? (
        <div className="flex items-center justify-center rounded-sm border border-border bg-card p-8">
          <div className="text-center w-full">
            <p className="mb-6 text-muted-foreground">
              {year}년 {month}월 {selectedDate}일에 작성한 일기가 없습니다.
            </p>

            {isFutureSelected ? (
              <Button className="gap-2 rounded-sm w-full" size="lg" disabled>
                <Plus className="h-5 w-5" />
                일기 작성하기
              </Button>
            ) : (
              <Link
                href={
                  selectedISO
                    ? `/diary/write?date=${selectedISO}`
                    : "/diary/write"
                }
                className="block"
              >
                <Button className="gap-2 rounded-sm w-full" size="lg">
                  <Plus className="h-5 w-5" />
                  일기 작성하기
                </Button>
              </Link>
            )}

            {isFutureSelected && (
              <p className="mt-3 text-xs text-muted-foreground">
                미래 날짜에는 일기를 작성할 수 없어요.
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4 rounded-sm border border-border bg-card p-8">
            <h2 className="text-lg font-semibold">
              오늘의 질문 — {todayQuestion?.title}
            </h2>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {todayQuestion?.description}
            </p>

            <Link href="/diary/write">
              <Button className="w-full gap-2 rounded-sm" size="lg">
                <Plus className="h-5 w-5" />
                일기 작성하기
              </Button>
            </Link>
          </div>

          {renderRecommended()}
        </>
      )}
    </div>
  );
}
