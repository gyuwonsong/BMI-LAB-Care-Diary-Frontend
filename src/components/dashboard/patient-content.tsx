"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Eye, ChevronLeft, FileText, Save, Edit } from "lucide-react";
import { InterviewViewer } from "@/components/dashboard/interview-viewer";
import { SdohAnalysisPanel } from "@/components/dashboard/sdoh-analysis-panel";
import { CareDiaryModal } from "@/components/dashboard/care-diary-modal";
import { cn } from "@/lib/utils";

interface Patient {
  id: string;
  patientId: string;
  name: string;
  diagnosis: string;
  age: number;
  gender: "M" | "F";
  recordDate: string;
  lastUpdated: string;
  lastDiaryDate?: string;
}

interface PatientContentProps {
  patient: Patient;
}

const mockInterviews = [
  {
    id: "interview-1",
    date: "2024-01-15",
    title: "초기 상담",
    criticalCount: 2,
  },
  {
    id: "interview-2",
    date: "2024-01-22",
    title: "추적 관찰",
    criticalCount: 1,
  },
  { id: "interview-3", date: "2024-01-29", title: "재평가", criticalCount: 3 },
];

const mockInterviewData = {
  summary: {
    healthServices: [
      {
        category: "적절한 건강서비스 부재",
        code: "8101",
        severity: 5,
        duration: 2,
        intervention: "문제없음",
        notes: "",
      },
      {
        category: "건강서비스에 대한 규정의 장애",
        code: "8102",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
      {
        category: "건강서비스에 대한 접근성 부족",
        code: "8103",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
      {
        category: "건강서비스(학업, 통역) 이용에 필요한 지원서비스 부재",
        code: "8104",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
      {
        category: "적절한 정신건강 서비스 부재",
        code: "8105",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
      {
        category: "정신건강 서비스에 대한 규정과 장애",
        code: "8106",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
      {
        category: "정신건강 서비스에 대한 접근성 부족",
        code: "8107",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
      {
        category: "정신건강 서비스 이용에 필요한 지원서비스 부재",
        code: "8108",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
      {
        category: "기(구체적으로)",
        code: "8109",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
    ],
    safety: [
      {
        category: "이웃에서 폭력이나 범죄",
        code: "8201",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
      {
        category: "안전하지 못한 직업환경",
        code: "8202",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
      {
        category: "안전하지 못한 주택상황",
        code: "8203",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
      {
        category: "적절한 안전서비스 부재",
        code: "8204",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
      {
        category: "자연재해",
        code: "8205",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
      {
        category: "안전에 위한 재해",
        code: "8206",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
      {
        category: "기타(구체적으로)",
        code: "8207",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
    ],
    socialServices: [
      {
        category: "적절한 사회서비스 부재",
        code: "8301",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
      {
        category: "사회서비스에 대한 규정의 장애",
        code: "8302",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
      {
        category: "사회서비스에 대한 접근성 부족",
        code: "8303",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
      {
        category: "사회서비스(학업, 통역) 이용에 필요한 자원서비스 부재",
        code: "8304",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
      {
        category: "기타(구체적으로)",
        code: "8305",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
    ],
    discrimination: [
      {
        category:
          "해당된다면, 아래의 목록에서 차별유형을 선택하여 오른쪽 칸에 부호를 쓰시오",
        code: "84_",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
    ],
    other: [
      {
        category: "사업/법적 체계에서 문제 없음",
        code: "0000",
        severity: "",
        duration: "",
        intervention: "",
        notes: "",
      },
    ],
  },
  fullInterview: [
    {
      timestamp: "13:30",
      content:
        "어떻게 병원에서 어떻게 진단받으셨는지 건강에 대해서 주실 수 있으시겠습니까?",
      highlights: [],
    },
    {
      timestamp: "13:36",
      content:
        "처음에 처음에 잘 다니고 있었어요. 그런데 병원에 입원 받던 기분이 없어지지 시작했어요.\n그래 것 같 자기 집에 올려서 하려면서, 근데 이제 생각보드병원에서 진단을 했거든요.\n근데 처음에는 그 휴게텔이라는 걸 모르고 자기 하이 하러 디스크라고 수술을 해버렸어요.\n그랬는데 그때부터 더 나빠지지 시작하더라고요.\n그랬고 이제 생각보드에서 수술을 했는 데 걱정 그래서 다시 검사하지 그 병원에 이제 이 디가 잘 교체고 이러니 네 이러지 검사하지 해보고 다시 검사하니까 휴게 텔 판정이 나왔어요.\n그래서 학원에 병원 갔는데 이제 가기 가서 또 진단을 '투게'으로 받았어요.",
      highlights: [
        {
          id: "highlight-1",
          text: "그런데 병원에 입원 받던 기분이 없어지지 시작했어요",
          sdohId: "sdoh-1",
          startIndex: 25,
          endIndex: 50,
        },
        {
          id: "highlight-2",
          text: "그래서 다시 검사하지 그 병원에 이제 이 디가 잘 교체고 이러니 네 이러지 검사하지 해보고 다시 검사하니까",
          sdohId: "sdoh-2",
          startIndex: 180,
          endIndex: 230,
        },
      ],
    },
    {
      timestamp: "",
      content:
        "그래 2014년 10월이지 그래서지고 이제 약물을 그래 병원에 이제 약물을 디가 잘 교체니 하고 잘 일어날 것 같보면서 약물보드병원에서 가기서 이제 계속 인터뷰으로 찾아보니까 한약이 병원이 좋지않았어요 지기 그래고 건이 좋래고 그래서 이제이 한약이 또 한약이 병원을 좋았어요.\n그래서 한약이 병원 갔는데 이제 가기 가서 또 진단을 '투게'으로 받았어요...",
      highlights: [
        {
          id: "highlight-3",
          text: "그래 2014년 10월이지 그래서지고 이제 약물을 그래 병원에 이제 약물을",
          sdohId: "sdoh-3",
          startIndex: 0,
          endIndex: 35,
        },
      ],
    },
  ],
};

const mockSdohLabels = [
  {
    id: "sdoh-1",
    category: "건강 서비스",
    code: "8101",
    severity: 3,
    duration: 2,
    description: "적절한 건강서비스 부재",
    details:
      "환자가 병원 입원 과정에서 정신적 어려움을 겪고 있으며, 적절한 정신건강 서비스가 필요함",
  },
  {
    id: "sdoh-2",
    category: "건강 서비스",
    code: "8102",
    severity: 4,
    duration: 3,
    description: "건강서비스에 대한 접근성 부족",
    details:
      "반복적인 검사와 진단 과정에서 의료 서비스 접근에 어려움을 겪고 있음",
  },
  {
    id: "sdoh-3",
    category: "건강 서비스",
    code: "8105",
    severity: 2,
    duration: 1,
    description: "적절한 정신건강 서비스 부재",
    details: "약물 치료 과정에서 지속적인 모니터링과 정신건강 지원이 필요함",
  },
];

type SummaryItem = {
  category: string;
  code: string;
  severity?: string;
  duration?: string;
  intervention?: string;
  notes?: string;
};

function normalizeSummaryItems(
  items: Array<Record<string, unknown>>,
): SummaryItem[] {
  return items.map((it) => ({
    category: String(it.category ?? ""),
    code: String(it.code ?? ""),
    severity:
      it?.severity === "" || it?.severity == null
        ? undefined
        : String(it.severity),
    duration:
      it?.duration === "" || it?.duration == null
        ? undefined
        : String(it.duration),
    intervention: it?.intervention ? String(it.intervention) : undefined,
    notes: it?.notes ? String(it.notes) : undefined,
  }));
}

const toText = (v: string | number | undefined | null) =>
  v == null || v === "" ? "" : String(v);

const getCriticalSdohSummary = () => {
  const allHighlights = mockInterviewData.fullInterview.flatMap(
    (segment) => segment.highlights,
  );
  const criticalHighlights = allHighlights
    .map((highlight) => ({
      highlight,
      sdohLabel: mockSdohLabels.find((label) => label.id === highlight.sdohId),
    }))
    .filter((item) => item.sdohLabel && item.sdohLabel.severity >= 4);

  return criticalHighlights;
};

type SummaryTableProps = {
  title: string;
  items: SummaryItem[];
  bgColor?: string;
};

const SummaryTable = ({
  title,
  items,
  bgColor = "bg-white",
}: SummaryTableProps) => (
  <div className="mb-6 last:mb-0 overflow-hidden">
    <div className="py-3">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
    </div>
    <div className="overflow-x-auto w-full max-w-full">
      <table
        className="w-full table-fixed border-collapse border border-border"
        aria-label={title}
      >
        <caption className="sr-only">{title}</caption>
        <thead className="sticky top-0 z-10">
          <tr className="bg-muted divide-x divide-border">
            <th className="w-[38%] p-2.5 sm:p-3 text-[11px] sm:text-xs text-center font-medium">
              건강/정신건강
            </th>
            <th className="w-[15%] p-2.5 sm:p-3 text-[11px] sm:text-xs text-center font-medium">
              부호
            </th>
            <th className="w-[15%] p-2.5 sm:p-3 text-[11px] sm:text-xs text-center font-medium">
              심각성
            </th>
            <th className="w-[15%] p-2.5 sm:p-3 text-[11px] sm:text-xs text-center font-medium">
              지속기간
            </th>
            <th className="w-[15%] p-2.5 sm:p-3 text-[11px] sm:text-xs text-center font-medium">
              권고되는 개입
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => (
            <tr
              key={`${item.code}-${item.category}`}
              className={cn(bgColor, "hover:bg-muted/30 transition-colors")}
            >
              <td className="border border-border p-2.5 sm:p-3 text-[11px] sm:text-xs">
                <span>{item.category}</span>
              </td>
              <td className="border border-border p-2.5 sm:p-3 text-[11px] sm:text-xs text-center font-mono">
                {item.code}
              </td>
              <td className="border border-border p-2.5 sm:p-3 text-[11px] sm:text-xs text-center">
                {item.severity ? (
                  <span className="text-[10px] sm:text-xs font-mono">
                    {toText(item.severity)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="border border-border p-2.5 sm:p-3 text-[11px] sm:text-xs text-center">
                {item.duration ? (
                  <span className="text-[10px] sm:text-xs font-mono">
                    {toText(item.duration)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="border border-border p-2.5 sm:p-3 text-[11px] sm:text-xs text-center">
                {item.intervention || (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const CriticalSummaryCard = ({
  onShowDetail,
}: {
  onShowDetail: () => void;
}) => {
  const criticalItems = useMemo(() => getCriticalSdohSummary(), []);

  return (
    <Card className="w-full shadow-sm border border-border rounded-sm overflow-hidden bg-muted">
      <CardHeader className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              중요 SDoH 요약 (심각성 4이상)
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              총 {criticalItems.length}개의 중요 SDoH 요소가 감지되었습니다
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4">
        {criticalItems.length > 0 ? (
          <div className="space-y-4">
            {criticalItems.map((item, index) => (
              <Card
                key={item.highlight.id}
                className="border border-border/40 rounded-sm bg-white"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs w-6 h-6 rounded-full p-0 flex items-center justify-center font-semibold"
                      >
                        {index + 1}
                      </Badge>
                      <div className="text-sm font-medium">
                        {item.sdohLabel?.category}
                      </div>
                    </div>
                    {item.sdohLabel && (
                      <Badge variant="outline" className="text-xs font-mono">
                        {item.sdohLabel.code}
                      </Badge>
                    )}
                  </div>

                  {item.sdohLabel && (
                    <div className="flex gap-2">
                      <Badge variant="destructive" className="text-xs">
                        심각성 {item.sdohLabel.severity}
                      </Badge>
                      <Badge variant="default" className="text-xs">
                        지속기간 {item.sdohLabel.duration}
                      </Badge>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground leading-relaxed">
                    {item.sdohLabel?.description}
                  </div>

                  <div className="text-xs p-3 rounded-sm border bg-primary/10 border-primary/20 italic leading-relaxed">
                    <div className="text-slate-700 mb-1 font-medium">
                      하이라이트된 텍스트:
                    </div>
                    <div className="text-foreground">
                      &quot;{item.highlight.text}&quot;
                    </div>
                  </div>

                  {item.sdohLabel?.details && (
                    <div className="text-xs bg-background/70 p-3 rounded-sm border leading-relaxed">
                      <div className="font-medium text-muted-foreground mb-1">
                        상세 분석:
                      </div>
                      <div>{item.sdohLabel.details}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-600">
            <div className="text-sm mb-2">
              심각성 4이상의 SDoH 요소가 없습니다
            </div>
            <div className="text-xs">
              중요한 SDoH 요소가 감지되면 여기에 표시됩니다
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

type TabKey = "interview" | "summary";

const DetailedView = ({
  patient,
  interviewId,
  activeTab,
  setActiveTab,
  selectedHighlight,
  setSelectedHighlight,
  onBack,
}: {
  patient: Patient;
  interviewId: string;
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  selectedHighlight: string | null;
  setSelectedHighlight: (id: string | null) => void;
  onBack: () => void;
}) => {
  const interview = mockInterviews.find((i) => i.id === interviewId);

  const handleHighlightSelect = (highlightId: string) => {
    setSelectedHighlight(highlightId);
    requestAnimationFrame(() => {
      const element = document.getElementById(`sdoh-label-${highlightId}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 pt-6 pb-7 border-b border-border bg-white flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="hover:cursor-pointer -mt-1"
                  aria-label="뒤로가기"
                >
                  <ChevronLeft />
                </Button>
                <div className="flex flex-col gap-1">
                  <h1 className="text-xl font-bold text-foreground truncate">
                    {interview?.title} - {patient.name} 상세보기 (
                    {interview?.date})
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">
                    ID: {patient.patientId} | {patient.diagnosis}
                  </p>
                  <p className="text-xs text-gray-400">
                    나이: {patient.age}, 성별: {patient.gender}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 bg-muted/20 min-h-0 min-w-0">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TabKey)}
            className="h-full w-full flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 flex-shrink-0 rounded-sm">
              <TabsTrigger value="interview" className="w-full">
                전체 인터뷰
              </TabsTrigger>
              <TabsTrigger value="summary" className="w-full">
                전체 요약
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 min-h-0">
              <TabsContent
                value="summary"
                className="h-full w-full m-0 data-[state=active]:flex flex-1 flex-col overflow-hidden"
              >
                <Card className="flex flex-col w-full flex-1 shadow-sm border border-border rounded-sm overflow-hidden">
                  <CardHeader className="px-6 py-1 border-b border-border flex-shrink-0">
                    <CardTitle className="text-lg">SDoH 레이블 요약</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto px-6 py-1">
                    <div className="space-y-10">
                      <SummaryTable
                        title="건강 안전 사회 서비스 체계"
                        items={normalizeSummaryItems(
                          mockInterviewData.summary.healthServices,
                        )}
                      />
                      <SummaryTable
                        title="안전"
                        items={normalizeSummaryItems(
                          mockInterviewData.summary.safety,
                        )}
                      />
                      <SummaryTable
                        title="사회서비스"
                        items={normalizeSummaryItems(
                          mockInterviewData.summary.socialServices,
                        )}
                      />
                      <SummaryTable
                        title="차별"
                        items={normalizeSummaryItems(
                          mockInterviewData.summary.discrimination,
                        )}
                      />
                      <SummaryTable
                        title="사업/법적 체계에서 문제 없음"
                        items={normalizeSummaryItems(
                          mockInterviewData.summary.other,
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="interview"
                className="h-full m-0 data-[state=active]:block"
              >
                <div className="flex h-full gap-6">
                  <div className="flex-[2] min-w-0">
                    <InterviewViewer
                      interviewData={mockInterviewData.fullInterview}
                      sdohLabels={mockSdohLabels}
                      onHighlightSelect={handleHighlightSelect}
                      selectedHighlight={selectedHighlight}
                    />
                  </div>
                  <div className="flex-[1] flex-shrink-0">
                    <SdohAnalysisPanel
                      sdohLabels={mockSdohLabels}
                      selectedHighlight={selectedHighlight}
                      interviewData={mockInterviewData.fullInterview}
                    />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

const PatientOverview = ({
  patient,
  userNotes,
  setUserNotes,
  isEditingNotes,
  setIsEditingNotes,
  onInterviewSelect,
  onShowCareDiary,
}: {
  patient: Patient;
  userNotes: string;
  setUserNotes: (notes: string) => void;
  isEditingNotes: boolean;
  setIsEditingNotes: (editing: boolean) => void;
  onInterviewSelect: (interviewId: string) => void;
  onShowCareDiary: () => void;
}) => {
  const [newInterviewTitle, setNewInterviewTitle] = useState("");

  const handleSaveNotes = () => {
    console.log("[v0] Saving user notes:", userNotes);
    setIsEditingNotes(false);
  };

  const handleAddInterview = () => {
    if (newInterviewTitle.trim()) {
      console.log("[v0] Adding new interview:", newInterviewTitle);
      setNewInterviewTitle("");
      onShowCareDiary();
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <div className="pt-6 pb-8 px-6 border-b border-border bg-white shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold text-foreground truncate">
                {patient.name}
              </h1>
              <p className="text-xs text-gray-400 mt-2">
                생성일: {patient.recordDate}
              </p>
              <p className="text-xs text-gray-400">
                수정일: {patient.lastUpdated}
              </p>
            </div>
            <Button variant="default" onClick={onShowCareDiary}>
              <Plus className="h-4 w-4 mr-1" />
              돌봄일기 등록
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-6 bg-muted/20 w-full space-y-6">
          <Card className="w-full shadow-sm border border-border rounded-sm bg-muted">
            <CardHeader className="px-6 pt-1 border-b border-border">
              <CardTitle className="text-lg">환자 기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-900">환자 ID:</span>{" "}
                  {patient.patientId}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">환자명:</span>{" "}
                  {patient.name}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">진단명:</span>{" "}
                  {patient.diagnosis}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">나이:</span>{" "}
                  {patient.age}세
                </div>
                <div>
                  <span className="font-semibold text-gray-900">성별:</span>{" "}
                  {patient.gender === "M" ? "남성" : "여성"}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">
                    마지막 일기 작성일:
                  </span>{" "}
                  {patient.lastDiaryDate || "없음"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full shadow-sm border border-border rounded-sm bg-muted">
            <CardHeader className="px-6 pt-1 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">담당자 메모</CardTitle>
                <div className="flex gap-2">
                  {isEditingNotes ? (
                    <>
                      <Button
                        variant="outline"
                        className="min-w-[80px]"
                        onClick={() => setIsEditingNotes(false)}
                      >
                        취소
                      </Button>
                      <Button
                        className="min-w-[80px]"
                        onClick={handleSaveNotes}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        저장
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingNotes(true)}
                      className="min-w-[80px]"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      수정
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-4">
              {isEditingNotes ? (
                <Textarea
                  placeholder="이 환자에 대한 메모를 입력하세요..."
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="min-h-[100px] resize-none p-3 border border-border rounded-sm bg-white text-sm"
                />
              ) : (
                <div className="min-h-[100px] p-3 border border-border rounded-sm bg-white opacity-50 text-sm">
                  {userNotes ||
                    "메모가 없습니다. 수정 버튼을 클릭하여 메모를 추가하세요."}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="w-full shadow-sm border border-border rounded-sm bg-muted">
            <CardHeader className="px-6 pt-1 border-b border-border">
              <CardTitle className="text-lg">인터뷰 목록</CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-4">
              <div className="space-y-3">
                {mockInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-center justify-between p-4 border border-border rounded-sm bg-white hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => onInterviewSelect(interview.id)}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm">
                          {interview.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {interview.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {interview.criticalCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="text-xs min-w-[65px]"
                        >
                          중요 {interview.criticalCount}개
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const InterviewSummary = ({
  patient,
  interviewId,
  onShowDetail,
  onBack,
}: {
  patient: Patient;
  interviewId: string;
  onShowDetail: () => void;
  onBack: () => void;
}) => {
  const interview = mockInterviews.find((i) => i.id === interviewId);

  if (!interview) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        해당 인터뷰를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <div className="px-6 pt-6 pb-7 border-b border-border bg-white shrink-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="hover:cursor-pointer -mt-1"
                  aria-label="뒤로가기"
                >
                  <ChevronLeft />
                </Button>
                <div className="flex flex-col gap-1">
                  <h1 className="text-xl font-bold text-foreground truncate">
                    {interview.title} - {patient.name} ({interview.date})
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">
                    ID: {patient.patientId} | {patient.diagnosis}
                  </p>
                  <p className="text-xs text-gray-400">
                    나이: {patient.age}, 성별: {patient.gender}
                  </p>
                </div>
              </div>
            </div>
            <div className="shrink-0 ml-4">
              <Button variant="outline" onClick={onShowDetail}>
                <Eye className="h-4 w-4 mr-1" />
                상세보기
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-6 bg-muted/20 w-full">
          <CriticalSummaryCard onShowDetail={onShowDetail} />
        </div>
      </div>
    </div>
  );
};

export function PatientContent({ patient }: PatientContentProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("interview");
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(
    null,
  );
  const [showCareDiaryModal, setShowCareDiaryModal] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [currentView, setCurrentView] = useState<
    "overview" | "interview" | "detailed"
  >("overview");
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(
    null,
  );
  const [userNotes, setUserNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const handleShowDetailedView = () => {
    if (!selectedInterviewId) return;
    setCurrentView("detailed");
    setShowDetailedView(true);
  };

  const handleShowCareDiaryModal = () => setShowCareDiaryModal(true);

  const handleInterviewSelect = (interviewId: string) => {
    setSelectedInterviewId(interviewId);
    setCurrentView("interview");
  };

  const handleBackToOverview = () => {
    setCurrentView("overview");
    setSelectedInterviewId(null);
  };

  const handleBackToInterview = () => {
    setCurrentView("interview");
    setShowDetailedView(false);
  };

  if (currentView === "detailed") {
    if (!selectedInterviewId) return null;

    return (
      <>
        <DetailedView
          patient={patient}
          interviewId={selectedInterviewId}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedHighlight={selectedHighlight}
          setSelectedHighlight={setSelectedHighlight}
          onBack={handleBackToInterview}
        />
        <CareDiaryModal
          open={showCareDiaryModal}
          onOpenChange={setShowCareDiaryModal}
        />
      </>
    );
  }

  if (currentView === "interview") {
    if (!selectedInterviewId) return null;

    return (
      <>
        <InterviewSummary
          patient={patient}
          interviewId={selectedInterviewId}
          onShowDetail={handleShowDetailedView}
          onBack={handleBackToOverview}
        />
        <CareDiaryModal
          open={showCareDiaryModal}
          onOpenChange={setShowCareDiaryModal}
        />
      </>
    );
  }

  return (
    <>
      <PatientOverview
        patient={patient}
        userNotes={userNotes}
        setUserNotes={setUserNotes}
        isEditingNotes={isEditingNotes}
        setIsEditingNotes={setIsEditingNotes}
        onInterviewSelect={handleInterviewSelect}
        onShowCareDiary={handleShowCareDiaryModal}
      />
      <CareDiaryModal
        open={showCareDiaryModal}
        onOpenChange={setShowCareDiaryModal}
      />
    </>
  );
}
