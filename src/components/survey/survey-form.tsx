"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { scaleQuestionApi } from "@/lib/api/client";

import type {
  CommonResponseScaleQuestionFindAllResponse,
  ScaleQuestionDto,
  ScaleQuestionDtoScaleCategoryEnum,
  ScaleQuestionUserAnswerItem,
  ScaleQuestionUserAnswerRegisterRequest,
} from "@/generated-api";

type SurveyStep = ScaleQuestionDtoScaleCategoryEnum;
export type SurveyMode = "REGISTER" | "SESSION";

const STEP_ORDER: SurveyStep[] = ["ANGER", "ANXIETY_DEPRESSION"];

const STEP_LABEL: Record<SurveyStep, string> = {
  ANGER: "분노 설문",
  ANXIETY_DEPRESSION: "우울·불안 설문",
};

const STEP_GUIDE: Record<SurveyStep, string> = {
  ANGER:
    "지난 일주일 동안의 경험을 떠올리며, 각 문항의 감정을 얼마나 느꼈는지 선택해 주세요.",
  ANXIETY_DEPRESSION:
    "지난 일주일 동안의 상태를 기준으로, 각 문항을 읽고 가장 가까운 선택지를 골라 주세요.",
};

const MODE_BADGE: Record<SurveyMode, { label: string; sub: string }> = {
  REGISTER: { label: "회원가입 설문", sub: "초기 상태 확인" },
  SESSION: { label: "정기 설문 (8회기 당 1번)", sub: "정기 척도 평가" },
};

function sortByQuestionNumber(a: ScaleQuestionDto, b: ScaleQuestionDto) {
  return a.questionNumber - b.questionNumber;
}

function buildRegisterPayload(
  allQuestions: ScaleQuestionDto[],
  answersById: Record<number, number>,
): ScaleQuestionUserAnswerRegisterRequest {
  const items: ScaleQuestionUserAnswerItem[] = allQuestions
    .slice()
    .sort(sortByQuestionNumber)
    .map((q) => ({
      scaleQuestionId: q.scaleQuestionId,
      answer: answersById[q.scaleQuestionId] ?? 0,
    }));

  const invalid = items.find((x) => x.answer < 1 || x.answer > 5);
  if (invalid) {
    throw new Error(
      `Invalid answer (1~5) for scaleQuestionId=${invalid.scaleQuestionId}: ${invalid.answer}`,
    );
  }

  return { items };
}

export default function SurveyForm({
  mode,
  onCompleteAction,
}: {
  mode: SurveyMode;
  onCompleteAction?: (mode: SurveyMode) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [step, setStep] = useState<SurveyStep>("ANGER");
  const [questions, setQuestions] = useState<ScaleQuestionDto[]>([]);
  const [answersById, setAnswersById] = useState<Record<number, number>>({});

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);

        const res: CommonResponseScaleQuestionFindAllResponse =
          await scaleQuestionApi.findAllScaleQuestions();

        setQuestions(res.data?.scaleQuestions ?? []);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const stepQuestions = useMemo(() => {
    return questions
      .filter((q) => q.scaleCategory === step)
      .slice()
      .sort(sortByQuestionNumber);
  }, [questions, step]);

  const stepIndex = STEP_ORDER.indexOf(step);
  const progress = Math.round(((stepIndex + 1) / STEP_ORDER.length) * 100);

  const isStepComplete = useMemo(() => {
    if (stepQuestions.length === 0) return false;
    return stepQuestions.every((q) => {
      const v = answersById[q.scaleQuestionId] ?? 0;
      return v >= 1 && v <= 5;
    });
  }, [stepQuestions, answersById]);

  const canGoBack = stepIndex > 0;

  const handleBack = () => {
    if (!canGoBack) return;
    setStep(STEP_ORDER[stepIndex - 1]);
  };

  const handleNextOrSubmit = async () => {
    if (stepIndex < STEP_ORDER.length - 1) {
      setStep(STEP_ORDER[stepIndex + 1]);
      return;
    }

    try {
      setSubmitting(true);

      const payload = buildRegisterPayload(questions, answersById);

      await scaleQuestionApi.registerUserScaleQuestionResult({
        scaleQuestionUserAnswerRegisterRequest: payload,
      });

      onCompleteAction?.(mode);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted py-8 pb-10">
      <div className="w-full max-w-5xl space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <span className="rounded-sm bg-primary/10 px-2 py-1 text-base font-semibold text-primary">
              {MODE_BADGE[mode].label}
            </span>
            <span className="text-base text-muted-foreground">
              {MODE_BADGE[mode].sub}
            </span>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader className="space-y-4">
            <Progress value={progress} className="h-2" />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">
                  {STEP_LABEL[step]}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {stepIndex + 1} / {STEP_ORDER.length}
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>

            <CardDescription className="whitespace-pre-line leading-relaxed">
              {STEP_GUIDE[step]}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-8">
              {stepQuestions.map((q) => {
                const current = answersById[q.scaleQuestionId] ?? 0;

                return (
                  <div
                    key={q.scaleQuestionId}
                    className="space-y-3 rounded-sm border p-4"
                  >
                    <Label className="text-base font-medium">
                      {q.questionNumber}. {q.content}
                    </Label>

                    <RadioGroup
                      value={current ? String(current) : ""}
                      onValueChange={(v) => {
                        const n = Number.parseInt(v, 10);
                        setAnswersById((prev) => ({
                          ...prev,
                          [q.scaleQuestionId]: n,
                        }));
                      }}
                      className="flex flex-col gap-2"
                    >
                      {q.options.map((opt, idx) => {
                        const value = String(idx + 1);
                        const id = `q${q.scaleQuestionId}-${idx + 1}`;

                        return (
                          <div key={id} className="flex items-center gap-2">
                            <RadioGroupItem value={value} id={id} />
                            <Label
                              htmlFor={id}
                              className="cursor-pointer font-normal"
                            >
                              {opt}
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-between">
              {canGoBack ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBack}
                  disabled={submitting}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  이전
                </Button>
              ) : (
                <div />
              )}

              <Button
                size="lg"
                onClick={handleNextOrSubmit}
                disabled={!isStepComplete || submitting}
              >
                {stepIndex === STEP_ORDER.length - 1 ? "완료" : "다음"}
                {stepIndex !== STEP_ORDER.length - 1 && (
                  <ChevronRight className="ml-2 h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
