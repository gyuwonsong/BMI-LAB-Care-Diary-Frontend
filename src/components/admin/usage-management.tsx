"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { adminUsageApi } from "@/lib/api/client";

import type {
  CommonResponseAdminUsageResponse,
  CommonResponseAdminUserUsageResponse,
  UsageDetail,
  UserUsageDto,
} from "@/generated-api";

function formatWon(n: number) {
  return n.toLocaleString();
}

function formatCount(n: number) {
  return n.toLocaleString();
}

export function UsageManagement() {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [loadingUsage, setLoadingUsage] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [cumulative, setCumulative] = useState<UsageDetail | null>(null);
  const [monthly, setMonthly] = useState<UsageDetail | null>(null);

  const [users, setUsers] = useState<UserUsageDto[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoadingUsage(true);

        const res: CommonResponseAdminUsageResponse =
          await adminUsageApi.getUsage();
        setCumulative(res.data?.cumulative ?? null);
        setMonthly(res.data?.monthly ?? null);
      } finally {
        setLoadingUsage(false);
      }
    };

    run();
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        setLoadingUsers(true);

        const res: CommonResponseAdminUserUsageResponse =
          await adminUsageApi.getUserUsages(
            searchQuery.length > 0 ? { search: searchQuery } : {},
          );

        setUsers(res.data?.users ?? []);
      } finally {
        setLoadingUsers(false);
      }
    };

    run();
  }, [searchQuery]);

  const displayedUsers = useMemo(() => users, [users]);

  return (
    <div className="space-y-6 px-40 py-8 pb-10 bg-muted">
      <section>
        <h2 className="mb-4 text-xl font-bold">누적 사용량</h2>
        <Card className="overflow-hidden rounded-sm">
          <div className="bg-primary/5">
            <div className="grid grid-cols-3 gap-px bg-border">
              <div className="bg-white p-6">
                <div className="text-sm text-muted-foreground">사용자 수</div>
                <div className="mt-2 text-2xl font-bold">
                  {loadingUsage || !cumulative
                    ? "—"
                    : `${formatCount(cumulative.userCount)} 명`}
                </div>
              </div>
              <div className="bg-white p-6">
                <div className="text-sm text-muted-foreground">분석 건 수</div>
                <div className="mt-2 text-2xl font-bold">
                  {loadingUsage || !cumulative
                    ? "—"
                    : `${formatCount(cumulative.analysisCount)} 건`}
                </div>
              </div>
              <div className="bg-white p-6">
                <div className="text-sm text-muted-foreground">사용료</div>
                <div className="mt-2 text-2xl font-bold">
                  {loadingUsage || !cumulative
                    ? "—"
                    : `${formatWon(cumulative.usageFee)} 원`}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">월간 사용량</h2>
        <Card className="overflow-hidden rounded-sm">
          <div className="bg-primary/5">
            <div className="grid grid-cols-3 gap-px bg-border">
              <div className="bg-white p-6">
                <div className="text-sm text-muted-foreground">사용자 수</div>
                <div className="mt-2 text-2xl font-bold">
                  {loadingUsage || !monthly
                    ? "—"
                    : `${formatCount(monthly.userCount)} 명`}
                </div>
              </div>
              <div className="bg-white p-6">
                <div className="text-sm text-muted-foreground">분석 건 수</div>
                <div className="mt-2 text-2xl font-bold">
                  {loadingUsage || !monthly
                    ? "—"
                    : `${formatCount(monthly.analysisCount)} 건`}
                </div>
              </div>
              <div className="bg-white p-6">
                <div className="text-sm text-muted-foreground">사용료</div>
                <div className="mt-2 text-2xl font-bold">
                  {loadingUsage || !monthly
                    ? "—"
                    : `${formatWon(monthly.usageFee)} 원`}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">사용자별 사용량</h2>
        <Card className="rounded-sm">
          <div className="p-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="사용자명 검색"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchQuery(inputValue.trim());
                  }
                }}
                className="pl-10 rounded-sm"
              />
            </div>

            <div className="overflow-hidden rounded-sm border border-border">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border-b border-border p-3 text-sm font-medium text-center">
                      번호
                    </th>
                    <th className="border-b border-border p-3 text-sm font-medium text-center">
                      사용자
                    </th>
                    <th className="border-b border-border p-3 text-sm font-medium text-center">
                      일기 작성 건수
                    </th>
                    <th className="border-b border-border p-3 text-sm font-medium text-center">
                      분석 건수
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loadingUsers ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-6 text-sm text-muted-foreground text-center"
                      >
                        불러오는 중…
                      </td>
                    </tr>
                  ) : displayedUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-6 text-sm text-muted-foreground text-center"
                      >
                        조회 결과가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    displayedUsers.map((u, idx) => {
                      const number = displayedUsers.length - idx;

                      return (
                        <tr key={u.userId} className="hover:bg-muted/50">
                          {/* 번호 */}
                          <td className="border-b border-border p-3 text-sm text-center text-muted-foreground">
                            {number}
                          </td>

                          {/* 이름 (userId) */}
                          <td className="border-b border-border p-3 text-sm text-center">
                            <div className="font-medium">
                              {u.userName ?? "-"}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              ({u.userId})
                            </div>
                          </td>

                          <td className="border-b border-border p-3 text-sm font-medium text-center">
                            {formatCount(u.diaryCount)} 건
                          </td>

                          <td className="border-b border-border p-3 text-sm font-medium text-center">
                            {formatCount(u.analysisCount)} 건
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
