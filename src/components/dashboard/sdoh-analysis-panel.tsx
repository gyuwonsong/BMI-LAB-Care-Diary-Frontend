"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Highlight {
  id: string;
  text: string;
  sdohId: string;
  startIndex: number;
  endIndex: number;
}

interface InterviewSegment {
  timestamp: string;
  content: string;
  highlights: Highlight[];
}

interface SdohLabel {
  id: string;
  category: string;
  code: string;
  severity: number;
  duration: number;
  description: string;
  details: string;
}

interface SdohAnalysisPanelProps {
  sdohLabels: SdohLabel[];
  selectedHighlight: string | null;
  interviewData: InterviewSegment[];
}

export function SdohAnalysisPanel({
  sdohLabels,
  selectedHighlight,
  interviewData,
}: SdohAnalysisPanelProps) {
  const allHighlights = interviewData.flatMap((segment) => segment.highlights);
  const highlightedSdohLabels = allHighlights
    .map((highlight) => ({
      highlight,
      sdohLabel: sdohLabels.find((label) => label.id === highlight.sdohId),
    }))
    .filter((item) => item.sdohLabel);

  return (
    <div className="w-full bg-white rounded-sm border border-border shadow-sm flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-4 pt-6 px-6 flex-shrink-0 border-b border-border bg-white rounded-t-sm">
        <CardTitle className="text-base font-semibold">SDoH 레이블</CardTitle>
        <div className="text-xs text-muted-foreground mt-2">
          총 {highlightedSdohLabels.length}개 레이블
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden bg-muted rounded-b-sm">
        <ScrollArea className="h-full">
          <div className="px-6 py-4 space-y-4">
            {highlightedSdohLabels.length > 0 ? (
              <div className="space-y-3">
                {highlightedSdohLabels.map((item, index) => (
                  <Card
                    key={item.highlight.id}
                    id={`sdoh-label-${item.highlight.id}`}
                    className={cn(
                      "transition-all duration-200 bg-white border rounded-sm",
                      selectedHighlight === item.highlight.id
                        ? "border-primary/40 shadow-sm bg-blue-50/30 scale-[1.01]"
                        : "hover:bg-muted/20 border-border/40",
                    )}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              selectedHighlight === item.highlight.id
                                ? "default"
                                : "outline"
                            }
                            className={cn(
                              "text-xs w-6 h-6 rounded-full p-0 flex items-center justify-center font-semibold",
                              selectedHighlight === item.highlight.id &&
                                "bg-primary text-white",
                            )}
                          >
                            {index + 1}
                          </Badge>
                          <div className="text-xs font-medium leading-relaxed">
                            {item.sdohLabel!.category}
                          </div>
                        </div>
                        <Badge
                          variant={
                            selectedHighlight === item.highlight.id
                              ? "default"
                              : "outline"
                          }
                          className={cn(
                            "text-xs font-mono ml-2",
                            selectedHighlight === item.highlight.id &&
                              "bg-primary/10 text-primary border-primary",
                          )}
                        >
                          {item.sdohLabel!.code}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="destructive" className="text-xs">
                          심각성 {item.sdohLabel!.severity}
                        </Badge>
                        <Badge variant="default" className="text-xs">
                          지속기간 {item.sdohLabel!.duration}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        {item.sdohLabel!.description}
                      </div>
                      <div
                        className={cn(
                          "text-xs p-3 rounded-sm border italic leading-relaxed",
                          selectedHighlight === item.highlight.id
                            ? "bg-primary/5 border-primary/20"
                            : "bg-muted border",
                        )}
                      >
                        <div className="text-slate-700 mb-1 font-medium">
                          하이라이트된 텍스트:
                        </div>
                        <div className="text-foreground">
                          &quot;{item.highlight.text}&quot;
                        </div>
                      </div>
                      {item.sdohLabel!.details && (
                        <div className="text-xs bg-background/70 p-3 rounded-sm border leading-relaxed">
                          <div className="font-medium text-muted-foreground mb-1">
                            상세 분석:
                          </div>
                          <div>{item.sdohLabel!.details}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-600">
                <div className="text-xs mb-2">
                  하이라이트된 SDoH 레이블이 없습니다
                </div>
                <div className="text-xs">
                  인터뷰에서 SDoH 관련 내용이 감지되면 여기에 표시됩니다
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </div>
  );
}
