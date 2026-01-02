"use client";

import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  label: string;
  value: string;
  onChangeAction: (next: string) => void;
  yearCount?: number;
  fromYear?: number;
  disabled?: boolean;
  helperText?: string;
};

function getYear(v: string) {
  return v?.split("-")[0] ?? "";
}

function getMonth(v: string) {
  return v?.split("-")[1] ?? "";
}

export default function YearMonthSelect({
  label,
  value,
  onChangeAction,
  yearCount = 60,
  fromYear,
  disabled = false,
  helperText = "정확한 날짜가 기억나지 않아도 괜찮습니다. 월 단위로만 입력해 주세요.",
}: Props) {
  const nowYear = new Date().getFullYear();

  const years = useMemo(() => {
    const start = fromYear ?? nowYear;
    return Array.from({ length: yearCount }, (_, i) => String(start - i));
  }, [fromYear, nowYear, yearCount]);

  const months = useMemo(
    () => Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")),
    [],
  );

  const y = getYear(value);
  const m = getMonth(value);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <Select
          value={y}
          onValueChange={(year) => {
            const nextMonth = m || "01";
            onChangeAction(`${year}-${nextMonth}`);
          }}
          disabled={disabled}
        >
          <SelectTrigger className="w-full h-9 px-3">
            <SelectValue placeholder="연도 선택" />
          </SelectTrigger>
          <SelectContent
            side="bottom"
            align="start"
            sideOffset={4}
            avoidCollisions={false}
          >
            {years.map((yy) => (
              <SelectItem key={yy} value={yy}>
                {yy}년
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={m}
          onValueChange={(month) => {
            const nextYear = y || years[0];
            onChangeAction(`${nextYear}-${month}`);
          }}
          disabled={disabled || !y}
        >
          <SelectTrigger className="w-full h-9 px-3">
            <SelectValue placeholder={y ? "월 선택" : "연도를 먼저 선택"} />
          </SelectTrigger>
          <SelectContent
            side="bottom"
            align="start"
            sideOffset={4}
            avoidCollisions={false}
          >
            {months.map((mm) => (
              <SelectItem key={mm} value={mm}>
                {mm}월
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
