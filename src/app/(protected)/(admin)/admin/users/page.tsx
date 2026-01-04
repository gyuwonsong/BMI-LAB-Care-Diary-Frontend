"use client";

import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { UserList } from "@/components/admin/user-list";
import { UserDetail } from "@/components/admin/user-detail";
import { UsageManagement } from "@/components/admin/usage-management";

import { adminUserApi } from "@/lib/api/client";
import type { AdminUserDto } from "@/generated-api";

export default function AdminUsersPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);

        const res = await adminUserApi.findAllUsers();
        setUsers(res.data?.users ?? []);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const selectedUser = useMemo(
    () => users.find((u) => u.userId === selectedUserId),
    [users, selectedUserId],
  );

  return (
    <div className="flex h-screen flex-col bg-white">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-1 overflow-hidden">
        {activeTab === "users" ? (
          <>
            <div className="w-80 border-r border-border bg-white">
              <div className="border-b border-border px-6 py-4">
                <h1 className="text-xl font-bold">사용자 관리</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  전체 사용자 목록
                </p>
              </div>

              {loading ? (
                <div className="p-6 text-sm text-muted-foreground">
                  불러오는 중…
                </div>
              ) : (
                <UserList
                  users={users}
                  selectedUserId={selectedUserId}
                  onSelectUser={setSelectedUserId}
                />
              )}
            </div>

            <div className="flex-1 overflow-auto bg-white">
              {selectedUser ? (
                <UserDetail userId={selectedUser.userId} />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  좌측에서 사용자를 선택해주세요
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-auto bg-muted">
            <UsageManagement />
          </div>
        )}
      </div>
    </div>
  );
}
