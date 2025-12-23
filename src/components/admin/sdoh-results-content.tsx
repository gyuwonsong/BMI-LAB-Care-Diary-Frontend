"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";

const SdohTable = ({
  title,
  items,
}: {
  title: string;
  items: {
    label: string;
    code: string;
    severity?: string;
    duration?: string;
    intervention?: string;
    evidence?: string;
  }[];
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{
    label: string;
    code: string;
    evidence: string;
  } | null>(null);

  const handleOpenEvidence = (item: {
    label: string;
    code: string;
    evidence?: string;
  }) => {
    if (!item.evidence) return;
    setSelected({
      label: item.label,
      code: item.code,
      evidence: item.evidence,
    });
    setOpen(true);
  };

  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold mb-3">{title}</h3>

      <div className="overflow-hidden rounded-sm border border-border bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border-b border-r border-border p-2 text-sm font-medium text-left w-[36%]">
                건강/정신건강
              </th>
              <th className="border-b border-r border-border p-2 text-sm font-medium text-center w-[8%]">
                부호
              </th>
              <th className="border-b border-r border-border p-2 text-sm font-medium text-center w-[8%]">
                심각성
              </th>
              <th className="border-b border-r border-border p-2 text-sm font-medium text-center w-[8%]">
                지속기간
              </th>
              <th className="border-b border-r border-border p-2 text-sm font-medium text-center w-[20%]">
                권고되는 개입
              </th>
              <th className="border-b border-border p-2 text-sm font-medium text-center w-[15%]">
                근거
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, idx) => {
              return (
                <tr key={idx} className="h-[52px] hover:bg-muted/50">
                  <td className="border-b border-r border-border p-2 text-sm align-middle">
                    {item.label}
                  </td>
                  <td className="border-b border-r border-border p-2 text-sm text-center font-mono align-middle">
                    {item.code}
                  </td>
                  <td className="border-b border-r border-border p-2 text-sm text-center align-middle">
                    {item.severity || ""}
                  </td>
                  <td className="border-b border-r border-border p-2 text-sm text-center align-middle">
                    {item.duration || ""}
                  </td>
                  <td className="border-b border-r border-border p-2 text-sm text-center align-middle">
                    {item.intervention || ""}
                  </td>
                  <td className="border-b border-border p-2 text-sm text-center align-middle">
                    {item.evidence?.trim() ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:underline hover:text-primary rounded-sm"
                        onClick={() => handleOpenEvidence(item)}
                      >
                        자세히 보기
                      </Button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-base">근거 상세</DialogTitle>
            <DialogDescription className="text-sm">
              {selected && `${selected.label} (${selected.code})`}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-sm border bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {selected?.evidence}
          </div>

          <DialogFooter>
            <Button className="rounded-sm" onClick={() => setOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ReferenceTable = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => (
  <div className="border border-border rounded-sm p-4">
    <h4 className="font-semibold text-sm mb-4">{title}</h4>
    <ul className="space-y-1 text-sm">
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  </div>
);

export default function SdohResultsContent({ diaryId }: { diaryId: string }) {
  const mockUser = {
    id: diaryId,
    name: "김철수",
    birthDate: "1965-03-15",
    disease: "파킨슨병",
  };

  const healthServicesData = [
    {
      label: "적절한 건강서비스 부재",
      code: "8101",
      severity: "5",
      duration: "3",
      intervention: "지역 보건소 연계",
      evidence:
        "최근 2주 일기에서 ‘예약이 안 잡힘’, ‘진료를 미룸’ 표현 반복.\n진료/약 수령 관련 미이행 언급 3회.",
    },
    {
      label: "건강서비스에 대한 규정의 장애",
      code: "8102",
      severity: "3",
      duration: "2",
      intervention: "행정 서류 안내",
      // evidence 없음 -> 빈 칼럼
    },
    {
      label: "건강서비스에 대한 접근성 부족",
      code: "8103",
      severity: "4",
      duration: "2",
      intervention: "교통비/이동지원 연계",
      evidence:
        "‘병원까지 가는 길이 멀다’, ‘대중교통이 어렵다’ 등 이동 관련 언급.\n보호자 동행 필요성 진술 2회.",
    },
    {
      label: "건강서비스 이용에 필요한 지원서비스 부재(학업/통역 등)",
      code: "8104",
      // evidence 없음
    },
    {
      label: "적절한 정신건강 서비스 부재",
      code: "8105",
      severity: "6",
      duration: "4",
      intervention: "정신건강복지센터 상담 연계",
      evidence:
        "일기에서 무기력/불면 언급 증가.\n최근 설문 우울 점수 상승 추세(3회 연속).",
    },
    {
      label: "정신건강 서비스에 대한 규정과 장애",
      code: "8106",
      // evidence 없음
    },
    {
      label: "정신건강 서비스 접근성 부족",
      code: "8107",
      severity: "3",
      duration: "2",
      intervention: "온라인 상담/비대면 진료 안내",
      // evidence 없음
    },
    {
      label: "정신건강 서비스 이용에 필요한 지원서비스 부재",
      code: "8108",
      // evidence 없음
    },
    {
      label: "기타(구체적으로)",
      code: "8109",
      // evidence 없음
    },
  ];

  const safetyData = [
    {
      label: "이웃에서 폭력이나 범죄",
      code: "8201",
      severity: "4",
      duration: "5",
      intervention: "지역 안전망/상담기관 연계",
      evidence: "외출 회피 및 불안 호소.\n‘밤에 소리가 나서 무섭다’ 표현 2회.",
    },
    {
      label: "안전하지 못한 직업환경",
      code: "8202",
      // evidence 없음
    },
    {
      label: "안전하지 못한 주택상황",
      code: "8203",
      severity: "5",
      duration: "3",
      intervention: "주거환경 개선/안전점검",
      evidence:
        "낙상 위험 언급.\n실내 이동 시 손잡이 부족, 미끄러움 등 환경 관련 표현.",
    },
    {
      label: "적절한 안전서비스 부재",
      code: "8204",
      // evidence 없음
    },
    {
      label: "자연재해",
      code: "8205",
      // evidence 없음
    },
    {
      label: "안전에 위한 재해",
      code: "8206",
      // evidence 없음
    },
    {
      label: "기타(구체적으로)",
      code: "8207",
      // evidence 없음
    },
  ];

  const socialServicesData = [
    {
      label: "적절한 사회서비스 부재",
      code: "8301",
      severity: "4",
      duration: "2",
      intervention: "복지서비스 안내/연계",
      evidence:
        "돌봄/지원 필요 언급.\n‘도와줄 사람이 없다’ 표현 1회, 보호자 부담감 표현.",
    },
    {
      label: "사회서비스에 대한 규정의 장애",
      code: "8302",
      // evidence 없음
    },
    {
      label: "사회서비스 접근성 부족",
      code: "8303",
      severity: "3",
      duration: "2",
      intervention: "사례관리 연계",
      // evidence 없음
    },
    {
      label: "사회서비스 이용에 필요한 지원서비스 부재(학업/통역 등)",
      code: "8304",
      severity: "5",
      duration: "12",
      intervention: "통역/동행 서비스 연계",
      evidence: "의사소통 어려움 언급.\n기관 안내/서류 이해에 어려움 표현 2회.",
    },
    {
      label: "기타(구체적으로)",
      code: "8305",
      // evidence 없음
    },
  ];

  const discriminationData = [
    {
      label: "나이",
      code: "8401",
      severity: "3",
      duration: "2",
      intervention: "차별 대응 안내/상담 연계",
      // evidence 없음
    },
    {
      label: "인종 혹은 언어",
      code: "8402",
      severity: "4",
      duration: "4",
      intervention: "다문화 지원 서비스 연계",
      evidence:
        "‘말이 잘 통하지 않는다’ 언급.\n서비스 이용 과정에서 의사소통 문제 보고.",
    },
    {
      label: "종교",
      code: "8403",
      // evidence 없음
    },
    {
      label: "성별",
      code: "8404",
      severity: "2",
      duration: "3",
      intervention: "상담/지원 안내",
      // evidence 없음
    },
    {
      label: "성적 오리엔테이션(배우자 여부)",
      code: "8405",
      // evidence 없음
    },
    {
      label: "생활양식",
      code: "8406",
      // evidence 없음
    },
    {
      label: "시민권 없음",
      code: "8407",
      severity: "5",
      duration: "12",
      intervention: "법률/행정 지원 안내",
      evidence:
        "공공서비스 신청 과정에서 자격/서류 문제 발생.\n‘신청이 거절됐다’ 진술.",
    },
    {
      label: "퇴역군인 지위",
      code: "8408",
      // evidence 없음
    },
    {
      label: "의존적 지위",
      code: "8409",
      // evidence 없음
    },
    {
      label: "장애인 지위",
      code: "8410",
      severity: "4",
      duration: "6",
      intervention: "장애인 복지 서비스 연계",
      // evidence 없음
    },
    {
      label: "기혼/미혼 지위",
      code: "8411",
      // evidence 없음
    },
    {
      label: "기타(구체적으로)",
      code: "8412",
      // evidence 없음
    },
  ];

  const severityIndicators = [
    "1 문제없음",
    "2 가벼움",
    "3 중간",
    "4 심함",
    "5 아주 심함",
    "6 파국",
  ];

  const durationIndicators = [
    "1 5년 이상",
    "2 1-5년",
    "3 6개월-1년",
    "4 1-6개월",
    "5 2주-1개월",
    "6 2주 미만",
  ];

  return (
    <div className="min-h-screen bg-muted">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className=" flex h-16 max-w-3xl items-center gap-4 px-6">
          <Link href="/admin/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">SDoH 결과 확인</h1>
        </div>
      </header>

      <main className="container max-w-5xl py-8 pb-10 mx-auto">
        <div className="mb-6 p-4 rounded-sm border border-border bg-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">사용자 ID:</span>
              <span className="ml-2 font-medium">{mockUser.id}</span>
            </div>
            <div>
              <span className="text-muted-foreground">이름:</span>
              <span className="ml-2 font-medium">{mockUser.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">생년월일:</span>
              <span className="ml-2 font-medium">{mockUser.birthDate}</span>
            </div>
            <div>
              <span className="text-muted-foreground">질병:</span>
              <span className="ml-2 font-medium">{mockUser.disease}</span>
            </div>
          </div>
        </div>

        <Card className="shadow-sm border border-border rounded-sm">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg">SDoH 레이블 전체 요약</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <SdohTable title="건강/정신건강" items={healthServicesData} />
            <SdohTable title="안전" items={safetyData} />
            <SdohTable title="사회서비스" items={socialServicesData} />
            <SdohTable title="차별" items={discriminationData} />

            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-base font-semibold mb-4">참고 지표</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReferenceTable
                  title="심각성 지표"
                  items={severityIndicators}
                />
                <ReferenceTable
                  title="지속기간 지표"
                  items={durationIndicators}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
