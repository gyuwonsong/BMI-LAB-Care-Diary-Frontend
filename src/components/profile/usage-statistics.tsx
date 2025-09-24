"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, BarChart3, Users, TrendingUp } from "lucide-react";
import { TablePaginationBar } from "@/components/common/table-pagination-bar";

export type RiskLevel = "높음" | "보통" | "낮음";

export interface PatientRow {
  id: string;
  name: string;
  diagnosis: string;
  recentAnalysis: string;
  totalAnalyses: number;
  riskLevel: RiskLevel;
}

const mockPatientData: PatientRow[] = [
  {
    id: "P001",
    name: "김XX 환자",
    diagnosis: "우울증",
    recentAnalysis: "2024-05-23",
    totalAnalyses: 5,
    riskLevel: "높음",
  },
  {
    id: "P002",
    name: "이XX 환자",
    diagnosis: "불안장애",
    recentAnalysis: "2024-05-22",
    totalAnalyses: 3,
    riskLevel: "보통",
  },
  {
    id: "P003",
    name: "박XX 환자",
    diagnosis: "ADHD",
    recentAnalysis: "2024-05-21",
    totalAnalyses: 7,
    riskLevel: "높음",
  },
  {
    id: "P004",
    name: "신XX 환자",
    diagnosis: "자폐스펙트럼",
    recentAnalysis: "2024-05-20",
    totalAnalyses: 2,
    riskLevel: "낮음",
  },
  {
    id: "P005",
    name: "최XX 환자",
    diagnosis: "학습장애",
    recentAnalysis: "2024-05-19",
    totalAnalyses: 4,
    riskLevel: "보통",
  },
];

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="rounded-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-primary">{value}</div>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const cls =
    level === "높음"
      ? "bg-red-100/80 text-red-600"
      : level === "보통"
        ? "bg-blue-100/80 text-blue-600"
        : "bg-green-100/80 text-green-600";
  return <Badge className={`rounded-sm ${cls}`}>{level}</Badge>;
}

export function UsageStatistics() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<"all" | RiskLevel>("all");
  const [sortKey, setSortKey] = useState<"recent" | "analyses" | "id">(
    "recent",
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const stats = useMemo(() => {
    const totalAnalyses = mockPatientData.reduce(
      (s, r) => s + r.totalAnalyses,
      0,
    );
    const uniquePatients = mockPatientData.length;
    const thisMonth = mockPatientData.filter(() => true).slice(0, 23).length;
    return { totalAnalyses, uniquePatients, thisMonth };
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return mockPatientData.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.diagnosis.toLowerCase().includes(q);
      const matchesRisk = filterRisk === "all" || p.riskLevel === filterRisk;
      return matchesSearch && matchesRisk;
    });
  }, [searchQuery, filterRisk]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "recent") {
        cmp = a.recentAnalysis.localeCompare(b.recentAnalysis);
      } else if (sortKey === "analyses") {
        cmp = a.totalAnalyses - b.totalAnalyses;
      } else if (sortKey === "id") {
        cmp = a.id.localeCompare(b.id);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return sorted.slice(start, start + perPage);
  }, [sorted, page, perPage]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const startIdx = sorted.length ? (page - 1) * perPage + 1 : 0;
  const endIdx = Math.min(page * perPage, sorted.length);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="누적 분석 건수"
          value={stats.totalAnalyses}
          icon={BarChart3}
        />
        <StatCard
          label="누적 대상 환자"
          value={stats.uniquePatients}
          icon={Users}
        />
        <StatCard
          label="이번 달 분석"
          value={stats.thisMonth}
          icon={TrendingUp}
        />
      </div>

      <Card className="rounded-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <CardTitle>환자별 분석 현황</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="환자 ID, 이름, 진단명으로 검색..."
                  value={searchQuery}
                  onChange={(e) => {
                    setPage(1);
                    setSearchQuery(e.target.value);
                  }}
                  className="pl-10 rounded-sm"
                  aria-label="검색"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-4">
              <Select
                value={filterRisk}
                onValueChange={(v: "all" | RiskLevel) => {
                  setPage(1);
                  setFilterRisk(v);
                }}
              >
                <SelectTrigger className="w-full md:min-w-36 rounded-sm">
                  <SelectValue placeholder="전체 위험도" />
                </SelectTrigger>
                <SelectContent className="rounded-sm">
                  <SelectItem value="all">전체 위험도</SelectItem>
                  <SelectItem value="높음">높음</SelectItem>
                  <SelectItem value="보통">보통</SelectItem>
                  <SelectItem value="낮음">낮음</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortKey}
                onValueChange={(v: "recent" | "analyses" | "id") =>
                  setSortKey(v)
                }
              >
                <SelectTrigger className="w-full md:min-w-36 rounded-sm">
                  <SelectValue placeholder="정렬 기준" />
                </SelectTrigger>
                <SelectContent className="rounded-sm">
                  <SelectItem value="recent">최근 분석일</SelectItem>
                  <SelectItem value="analyses">누적 분석 수</SelectItem>
                  <SelectItem value="id">대상자 ID</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortDir}
                onValueChange={(v: "asc" | "desc") => setSortDir(v)}
              >
                <SelectTrigger className="w-full md:min-w-28 rounded-sm">
                  <SelectValue placeholder="정렬" />
                </SelectTrigger>
                <SelectContent className="rounded-sm">
                  <SelectItem value="desc">내림차순</SelectItem>
                  <SelectItem value="asc">오름차순</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={String(perPage)}
                onValueChange={(v) => {
                  setPage(1);
                  setPerPage(Number(v));
                }}
              >
                <SelectTrigger className="w-full md:min-w-28 rounded-sm">
                  <SelectValue placeholder="행 수" />
                </SelectTrigger>
                <SelectContent className="rounded-sm">
                  <SelectItem value="10">10행</SelectItem>
                  <SelectItem value="20">20행</SelectItem>
                  <SelectItem value="50">50행</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="border rounded-sm overflow-hidden">
              <div className="w-full overflow-x-auto">
                <Table className="min-w-[900px]">
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-center whitespace-nowrap sticky top-0 bg-gray-50 z-10">
                        대상자 ID
                      </TableHead>
                      <TableHead className="text-center whitespace-nowrap sticky top-0 bg-gray-50 z-10">
                        환자명
                      </TableHead>
                      <TableHead className="text-center whitespace-nowrap sticky top-0 bg-gray-50 z-10">
                        진단명
                      </TableHead>
                      <TableHead className="text-center whitespace-nowrap sticky top-0 bg-gray-50 z-10">
                        최근 분석일
                      </TableHead>
                      <TableHead className="text-center whitespace-nowrap sticky top-0 bg-gray-50 z-10">
                        누적 분석 수
                      </TableHead>
                      <TableHead className="text-center whitespace-nowrap sticky top-0 bg-gray-50 z-10">
                        위험도
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((patient) => (
                      <TableRow key={patient.id} className="bg-white">
                        <TableCell className="font-mono text-center">
                          {patient.id}
                        </TableCell>
                        <TableCell className="text-center max-w-[160px] truncate">
                          {patient.name}
                        </TableCell>
                        <TableCell className="text-center max-w-[220px] truncate">
                          {patient.diagnosis}
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap">
                          {patient.recentAnalysis}
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap">
                          {patient.totalAnalyses}건
                        </TableCell>
                        <TableCell className="text-center">
                          <RiskBadge level={patient.riskLevel} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div className="md:hidden space-y-3">
            {paginated.map((p) => (
              <div key={p.id} className="border rounded-sm bg-white p-3">
                <div className="flex items-center justify-between gap-2 border-b pb-3 px-1">
                  <div className="font-mono text-sm">{p.id}</div>
                  <RiskBadge level={p.riskLevel} />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                  <div className="text-muted-foreground">환자명</div>
                  <div className="truncate">{p.name}</div>

                  <div className="text-muted-foreground">진단명</div>
                  <div className="truncate">{p.diagnosis}</div>

                  <div className="text-muted-foreground">최근 분석일</div>
                  <div>{p.recentAnalysis}</div>

                  <div className="text-muted-foreground">누적 분석 수</div>
                  <div>{p.totalAnalyses}건</div>
                </div>
              </div>
            ))}

            {sorted.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                검색 조건에 맞는 환자가 없습니다.
              </div>
            )}
          </div>

          {sorted.length > 0 && (
            <TablePaginationBar
              total={sorted.length}
              page={page}
              totalPages={totalPages}
              startIdx={startIdx}
              endIdx={endIdx}
              onPageChangeAction={setPage}
              className="mt-4"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
