"use client";

import { useEffect, useMemo, useState } from "react";
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
import { cn } from "@/lib/utils";

import { adminUserApi, adminDiariyApi } from "@/lib/api/client";

import {
  AdminDiaryDto,
  UserScaleItem,
  UserScaleItemScaleCategoryEnum,
} from "@/generated-api";

import { ChevronDown, ChevronUp } from "lucide-react";
import { formatCreated } from "@/utils/date";

function toYMD(year: number, month: number, day: number) {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

type UserDetailData = {
  userId: string;
  name: string;
  birthDate: Date | string;
  primaryDiagnosis?: string;
  diaryDates: Array<Date | string>;
  monthlyDiaryCount: number;
  yearlyDiaryCount: number;
  emotionCounts: Record<string, number>;
  riskReason?: string;
};

interface UserDetailProps {
  userId: string;
}

export function UserDetail({ userId }: UserDetailProps) {
  const router = useRouter();

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const [detail, setDetail] = useState<UserDetailData | null>(null);
  const [selectedDiaries, setSelectedDiaries] = useState<AdminDiaryDto[]>([]);

  const [scales, setScales] = useState<
    Array<{
      session: number;
      anxietyDepression: number | null;
      anger: number | null;
      createdAt?: Date | string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  const [showAllDiaries, setShowAllDiaries] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);
      try {
        const [userRes, scaleRes] = await Promise.all([
          adminUserApi.findUserById({ userId }),
          adminUserApi.findUserScales({ userId }),
        ]);

        const userData = userRes?.data as UserDetailData | undefined;
        if (mounted) setDetail(userData ?? null);

        const items = (scaleRes?.data?.items ?? {}) as Record<
          string,
          Array<UserScaleItem & { createdAt?: Date | string }>
        >;

        const sessions = Object.entries(items)
          .map(([k, arr]) => {
            const session = Number(k);
            const anxietyDepression =
              arr.find(
                (x) =>
                  x.scaleCategory ===
                  UserScaleItemScaleCategoryEnum.AnxietyDepression,
              )?.score ?? null;

            const anger =
              arr.find(
                (x) => x.scaleCategory === UserScaleItemScaleCategoryEnum.Anger,
              )?.score ?? null;

            const createdAt = arr?.[0]?.createdAt;

            return { session, anxietyDepression, anger, createdAt };
          })
          .filter((x) => !Number.isNaN(x.session))
          .sort((a, b) => a.session - b.session);

        if (mounted) setScales(sessions);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const diaryDaysInMonth = useMemo(() => {
    const src = detail?.diaryDates ?? [];
    const y = currentYear;
    const m = currentMonth;

    const days = new Set<number>();
    for (const v of src) {
      const d =
        typeof v === "string" ? new Date(`${v}T00:00:00+09:00`) : new Date(v);
      if (Number.isNaN(d.getTime())) continue;
      if (d.getFullYear() === y && d.getMonth() + 1 === m) {
        days.add(d.getDate());
      }
    }
    return Array.from(days).sort((a, b) => a - b);
  }, [detail?.diaryDates, currentYear, currentMonth]);

  const emotionCounts = useMemo(() => {
    const raw = detail?.emotionCounts ?? {};
    return {
      [Emotion.HAPPY]: raw[Emotion.HAPPY] ?? raw["HAPPY"] ?? 0,
      [Emotion.LOVE]: raw[Emotion.LOVE] ?? raw["LOVE"] ?? 0,
      [Emotion.SAD]: raw[Emotion.SAD] ?? raw["SAD"] ?? 0,
    };
  }, [detail?.emotionCounts]);

  const handleDateSelect = async (date: number | null) => {
    if (selectedDate === date) {
      setSelectedDate(null);
      setSelectedDiaries([]);
      setShowAllDiaries(false);
      return;
    }

    setSelectedDate(date);
    setSelectedDiaries([]);
    setShowAllDiaries(false);

    if (!date) return;

    const ymd = toYMD(currentYear, currentMonth, date);
    const res = await adminDiariyApi.findAllByUserIdAndDate({
      userId,
      date: new Date(ymd),
    });

    const diaries = (res?.data?.diaries ?? []) as AdminDiaryDto[];
    setSelectedDiaries(diaries);
  };

  const handleOpenSdohResults = (diaryId: string) => {
    router.push(`/admin/sdoh/${diaryId}`);
  };

  const risk = detail?.riskReason
    ? { isRisk: true, reason: detail.riskReason }
    : { isRisk: false, reason: "" };

  if (loading && !detail) {
    return <div className="px-10 py-6 pb-10">로딩 중...</div>;
  }

  if (!detail) {
    return (
      <div className="px-10 py-6 pb-10">유저 정보를 불러오지 못했습니다.</div>
    );
  }

  return (
    <div className="px-10 py-6 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{detail.name}의 일기</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatCreated(detail.birthDate, "date")}
          {" · "}
          {detail.primaryDiagnosis ?? "주진단명 없음"}
        </p>
      </div>

      {risk.isRisk && (
        <Card className="mb-6 border-destructive/50 bg-destructive/5 rounded-sm">
          <CardHeader>
            <CardTitle className="text-base text-destructive flex items-center">
              ⚠️ 리스크 감지 사유
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive leading-relaxed -mt-4">
              : {risk.reason}
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
                setSelectedDate(null);
                setSelectedDiaries([]);
                setShowAllDiaries(false);
              }}
              diaryDates={diaryDaysInMonth}
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
                {detail.monthlyDiaryCount}건
              </p>
            </div>
          </Card>

          <Card className="rounded-sm h-full">
            <div className="flex items-center justify-between px-6 py-4 h-full">
              <CardTitle className="text-base">
                {UI_TEXT.HOME.THIS_YEAR}
              </CardTitle>
              <p className="text-2xl font-bold text-primary">
                {detail.yearlyDiaryCount}건
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
                      <span className="text-sm">{EMOTION_LABELS[emotion]}</span>
                      <span className="text-sm font-bold">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {selectedDiaries.length > 0 && selectedDate && (
        <div className="mb-6 space-y-4">
          {(showAllDiaries ? selectedDiaries : selectedDiaries.slice(0, 2)).map(
            (selectedDiary) => (
              <Card key={selectedDiary.diaryId} className="rounded-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {currentYear}년 {currentMonth}월 {selectedDate}일 일기
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        작성 일시:
                        {formatCreated(selectedDiary.createdAt, "datetime")}
                      </span>

                      <Button
                        variant="outline"
                        className="rounded-sm"
                        onClick={() =>
                          handleOpenSdohResults(selectedDiary.diaryId)
                        }
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
                    <h3 className="mb-2 text-sm font-medium">일기 내용</h3>
                    <div className="rounded-sm border bg-muted/30 p-4 text-sm">
                      <p className="leading-relaxed">{selectedDiary.content}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-medium">생각 정리 요약</h3>

                    <div className="overflow-hidden rounded-sm border bg-muted/30">
                      {REFLECTION_QUESTIONS.map((question, index) => {
                        const score =
                          selectedDiary.questionScores?.[index]?.score;
                        return (
                          <div
                            key={index}
                            className={cn(
                              "flex items-center justify-between px-4 py-3 text-sm",
                              index !== REFLECTION_QUESTIONS.length - 1 &&
                                "border-b border-border",
                            )}
                          >
                            <p className="flex-1 text-muted-foreground">
                              {question}
                            </p>
                            <span className="ml-4 text-lg font-semibold text-primary">
                              {typeof score === "number" ? score : "-"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ),
          )}

          {selectedDiaries.length > 2 && (
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-sm py-4 text-sm font-medium
                   flex items-center justify-center gap-2"
              onClick={() => setShowAllDiaries((v) => !v)}
            >
              {showAllDiaries ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  접기
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  전체보기 ({selectedDiaries.length - 2}개)
                </>
              )}
            </Button>
          )}
        </div>
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
              onClick={() =>
                router.push(
                  `/analysis/graphs/${detail.userId}/${encodeURIComponent(detail.name)}`,
                )
              }
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
                    우울·불안 점수
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
                {scales.map((row) => (
                  <tr key={row.session} className="hover:bg-muted/50">
                    <td className="border-b border-border p-3 text-sm text-center">
                      {row.session + 1}
                    </td>

                    <td className="border-b border-border p-3 text-sm font-medium text-center">
                      {row.anxietyDepression ?? "-"}점
                    </td>

                    <td className="border-b border-border p-3 text-sm font-medium text-center">
                      {row.anger ?? "-"}점
                    </td>

                    <td className="border-b border-border p-3 text-sm text-muted-foreground text-center">
                      {formatCreated(row.createdAt, "date")}
                    </td>

                    <td className="border-b border-border p-3 text-sm text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:underline hover:text-primary rounded-sm"
                        onClick={() =>
                          router.push(`/admin/survey/${userId}/${row.session}`)
                        }
                      >
                        설문 결과 확인
                      </Button>
                    </td>
                  </tr>
                ))}

                {scales.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="border-b border-border p-6 text-sm text-muted-foreground text-center"
                    >
                      설문 데이터가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
