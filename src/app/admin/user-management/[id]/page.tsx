"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, FileDown } from "lucide-react";
import { toast } from "sonner";
import { TablePaginationBar } from "@/components/common/table-pagination-bar";

const mockUserDetail = {
  id: "1",
  name: "김의사",
  email: "kim@hospital.com",
  phone: "010-1234-5678",
  organization: "서울대학교병원",
  userType: "admin" as const,
  status: "active" as const,
  approvedAt: "2024-05-20",
  lastLogin: "2024-05-23",
  documentUrl: "/documents/kim-license.pdf",
};

const mockPatients = [
  {
    id: "P001",
    diagnosis: "고혈압",
    lastDiaryDate: "2024-05-23",
    analysisCount: 15,
  },
  {
    id: "P002",
    diagnosis: "당뇨병",
    lastDiaryDate: "2024-05-22",
    analysisCount: 8,
  },
  {
    id: "P003",
    diagnosis: "심부전",
    lastDiaryDate: "2024-05-21",
    analysisCount: 12,
  },
];

const usageStats = { totalAnalysis: 35, totalPatients: 3 };

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-sm shadow-sm bg-muted">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <CardTitle className="text-lg">{title}</CardTitle>
          {subtitle ? (
            <div className="text-sm text-foreground/70">{subtitle}</div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function RoleBadge({ userType }: { userType: "admin" | "user" }) {
  const isAdmin = userType === "admin";
  return (
    <Badge
      variant="outline"
      className="rounded-sm text-xs px-2 py-0.5 font-medium bg-white"
    >
      {isAdmin ? "관리자" : "사용자"}
    </Badge>
  );
}

function LabeledValue({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-foreground/70 mb-1">
        {label}
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function DocumentLink({ filename, href }: { filename: string; href: string }) {
  const onClick = useCallback(() => {
    toast.info("증빙서류 다운로드를 시작합니다.");
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="inline-flex items-center gap-1 hover:underline"
    >
      <FileDown className="h-4 w-4" />
      <span className="text-sm">{filename}</span>
    </a>
  );
}

type PatientRow = {
  id: string;
  diagnosis: string;
  lastDiaryDate: string;
  analysisCount: number;
};

function PatientsTable({
  rows,
  pageSize = 10,
}: {
  rows: PatientRow[];
  pageSize?: number;
}) {
  const data = useMemo(() => rows ?? [], [rows]);
  const [page, setPage] = useState(1);

  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIdx0 = (page - 1) * pageSize;
  const endIdx0 = Math.min(startIdx0 + pageSize, total);
  const pageRows = useMemo(
    () => data.slice(startIdx0, endIdx0),
    [data, startIdx0, endIdx0],
  );

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full border rounded-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-center py-3 px-4 border-b border-border text-sm font-medium">
                대상자 ID
              </th>
              <th className="text-center py-3 px-4 border-b border-border text-sm font-medium">
                진단명
              </th>
              <th className="text-center py-3 px-4 border-b border-border text-sm font-medium">
                최근 돌봄일기 작성일
              </th>
              <th className="text-center py-3 px-4 border-b border-border text-sm font-medium">
                누적 분석수
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((p) => (
              <tr key={p.id} className="bg-white">
                <td className="text-center py-3 px-4 border-b border-border text-sm">
                  {p.id}
                </td>
                <td className="text-center py-3 px-4 border-b border-border text-sm">
                  {p.diagnosis}
                </td>
                <td className="text-center py-3 px-4 border-b border-border text-sm">
                  {p.lastDiaryDate}
                </td>
                <td className="text-center py-3 px-4 border-b border-border text-sm">
                  {p.analysisCount}건
                </td>
              </tr>
            ))}

            {pageRows.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-8 text-sm text-muted-foreground"
                >
                  표시할 데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TablePaginationBar
        total={total}
        page={page}
        totalPages={totalPages}
        startIdx={total ? startIdx0 + 1 : 0}
        endIdx={endIdx0}
        onPageChangeAction={setPage}
      />
    </div>
  );
}

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [user] = useState(mockUserDetail);
  const [patients] = useState(mockPatients);

  return (
    <div className="min-h-screen bg-background w-full overflow-auto">
      <div className="container mx-auto lg:p-8 md:p-8 sm:p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-10">
            <Link href="/admin/user-management">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">
              {user.name}님의 상세 정보
            </h1>
          </div>

          <SectionCard title="기본 정보">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20 ring-1 ring-primary/50">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-2xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4 text-sm mb-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <LabeledValue label="이름">{user.name}</LabeledValue>
                  <LabeledValue label="구분">
                    <RoleBadge userType={user.userType} />
                  </LabeledValue>

                  <LabeledValue label="이메일">{user.email}</LabeledValue>
                  <LabeledValue label="전화번호">{user.phone}</LabeledValue>

                  <LabeledValue label="소속기관">
                    {user.organization}
                  </LabeledValue>
                  <LabeledValue label="증빙서류">
                    <DocumentLink
                      filename="김의사_재직증명서.pdf"
                      href={user.documentUrl}
                    />
                  </LabeledValue>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="사용량 통계"
            subtitle={
              <>
                사용량: 누적분석 {usageStats.totalAnalysis}건 / 누적대상{" "}
                {usageStats.totalPatients}명
              </>
            }
          >
            <PatientsTable rows={patients} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
