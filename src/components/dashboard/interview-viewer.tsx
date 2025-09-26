"use client";

import { Card, CardContent } from "@/components/ui/card";
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

interface InterviewViewerProps {
  interviewData: InterviewSegment[];
  sdohLabels: SdohLabel[];
  onHighlightSelect: (highlightId: string) => void;
  selectedHighlight: string | null;
}

export function InterviewViewer({
  interviewData,
  sdohLabels,
  onHighlightSelect,
  selectedHighlight,
}: InterviewViewerProps) {
  const renderHighlightedText = (segment: InterviewSegment) => {
    if (segment.highlights.length === 0) {
      return <span>{segment.content}</span>;
    }

    const parts = [];
    let lastIndex = 0;

    const sortedHighlights = [...segment.highlights].sort(
      (a, b) => a.startIndex - b.startIndex,
    );

    sortedHighlights.forEach((highlight) => {
      if (highlight.startIndex > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {segment.content.slice(lastIndex, highlight.startIndex)}
          </span>,
        );
      }

      const sdohLabel = sdohLabels.find(
        (label) => label.id === highlight.sdohId,
      );
      const isSelected = selectedHighlight === highlight.id;

      parts.push(
        <span
          key={highlight.id}
          className={cn(
            "bg-primary/10 border-b-2 border-primary cursor-pointer hover:bg-primary/20 transition-colors px-1",
            isSelected && "bg-primary/30 border-primary",
          )}
          onClick={() => onHighlightSelect(highlight.id)}
          title={sdohLabel?.category}
        >
          {segment.content.slice(highlight.startIndex, highlight.endIndex)}
        </span>,
      );

      lastIndex = highlight.endIndex;
    });

    if (lastIndex < segment.content.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {segment.content.slice(lastIndex)}
        </span>,
      );
    }

    return <>{parts}</>;
  };

  return (
    <Card className="h-full rounded-sm">
      <CardContent className="p-6 h-full overflow-y-auto">
        <div className="space-y-6">
          {interviewData.map((segment, index) => (
            <div key={index} className="space-y-2">
              {segment.timestamp && (
                <div className="text-sm font-medium text-primary">
                  {segment.timestamp}
                </div>
              )}
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {renderHighlightedText(segment)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
