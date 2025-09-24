"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Check, X, Mail, FileText, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

type UserType = "user" | "admin";
type ReviewState = "pending" | "approved" | "rejected";

interface BaseUser {
  id: string;
  name: string;
  email: string;
  organization: string;
  userType: UserType;
}

interface PendingUser extends BaseUser {
  status: "pending";
  submittedAt: string;
  documentUrl?: string;
}
interface ApprovedUser extends BaseUser {
  status: "approved";
  approvedAt: string;
  lastLogin?: string;
}
interface RejectedUser extends BaseUser {
  status: "rejected";
  rejectedAt: string;
  rejectionReason: string;
}
type AnyUser = PendingUser | ApprovedUser | RejectedUser;

const mockPendingUsers: PendingUser[] = [
  {
    id: "1",
    name: "박의사",
    email: "park@hospital.com",
    organization: "서울대학교병원",
    userType: "user",
    submittedAt: "2024-05-23",
    documentUrl: "/documents/park-license.pdf",
    status: "pending",
  },
  {
    id: "2",
    name: "김간호사",
    email: "kim@clinic.com",
    organization: "강남클리닉",
    userType: "user",
    submittedAt: "2024-05-22",
    documentUrl: "/documents/kim-certificate.pdf",
    status: "pending",
  },
];
const mockApprovedUsers: ApprovedUser[] = [
  {
    id: "10",
    name: "김의사",
    email: "kim@hospital.com",
    organization: "서울대학교병원",
    userType: "admin",
    status: "approved",
    approvedAt: "2024-05-20",
    lastLogin: "2024-05-23",
  },
  {
    id: "11",
    name: "이간호사",
    email: "lee@clinic.com",
    organization: "강남클리닉",
    userType: "user",
    status: "approved",
    approvedAt: "2024-05-18",
    lastLogin: "2024-05-22",
  },
];
const mockRejectedUsers: RejectedUser[] = [
  {
    id: "3",
    name: "최의사",
    email: "choi@clinic.com",
    organization: "부산의료원",
    userType: "user",
    status: "rejected",
    rejectedAt: "2024-05-21",
    rejectionReason: "증빙서류 불충분",
  },
];

const RoleBadge = ({ type }: { type: UserType }) => (
  <Badge
    variant="outline"
    className="rounded-sm text-xs px-2 py-0.5 font-medium"
  >
    {type === "admin" ? "관리자" : "사용자"}
  </Badge>
);

const LineMeta = ({ items }: { items: (string | undefined | false)[] }) => (
  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-900">
    {items.filter(Boolean).map((text, i) => (
      <span key={i} className="flex items-center gap-2">
        {i > 0 && <span className="text-gray-300">|</span>}
        <span className="truncate max-w-[200px] sm:max-w-none">
          {text as string}
        </span>
      </span>
    ))}
  </div>
);

function UserCard({
  user,
  type,
  onApprove,
  onReject,
  isProcessing,
}: {
  user: AnyUser;
  type: ReviewState;
  onApprove?: (id: string) => Promise<void> | void;
  onReject?: (id: string, reason: string) => Promise<void> | void;
  isProcessing?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <Card className="rounded-sm shadow-sm bg-white border-0 ring-1 ring-gray-100 hover:ring-gray-200 transition-all duration-200 mb-4">
      <CardContent className="p-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-3 sm:px-4">
          <div className="flex items-start sm:items-center gap-3">
            <Avatar className="h-11 w-11 sm:h-10 sm:w-10 ring-1 ring-primary/50">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3
                    className="font-semibold text-gray-900 text-sm sm:text-[15px] truncate"
                    title={user.name}
                  >
                    {user.name}
                  </h3>
                  <RoleBadge type={user.userType} />
                </div>

                <LineMeta
                  items={[
                    user.email,
                    user.organization,
                    type === "pending" &&
                      `신청: ${(user as PendingUser).submittedAt} 09:30`,
                    type === "approved" &&
                      `승인: ${(user as ApprovedUser).approvedAt} 14:20`,
                    type === "rejected" &&
                      `거부: ${(user as RejectedUser).rejectedAt} 11:15`,
                  ]}
                />
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
                {type === "pending" && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Button
                      onClick={async () => {
                        try {
                          await onApprove?.(user.id);
                          toast.success(`'${user.name}' 승인 완료`, {
                            description:
                              "사용자 승인이 성공적으로 처리되었습니다.",
                          });
                        } catch {
                          toast.error("승인 실패", {
                            description: "잠시 후 다시 시도해 주세요.",
                          });
                        }
                      }}
                      disabled={isProcessing}
                      size="icon"
                      variant="default"
                      aria-label="승인"
                    >
                      <Check className="h-4 w-4" />
                    </Button>

                    <Dialog
                      open={open}
                      onOpenChange={(v) => {
                        setOpen(v);
                        if (!v) setReason("");
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          aria-label="거부"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-sm border-0 shadow-xl">
                        <DialogHeader>
                          <DialogTitle className="text-lg font-semibold">
                            사용자 승인 거부
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="거부 사유를 입력하세요."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            className="bg-gray-50 border-gray-200 rounded-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <Button
                            onClick={async () => {
                              if (!reason.trim()) {
                                toast.message("거부 사유를 입력해 주세요.");
                                return;
                              }
                              try {
                                await onReject?.(user.id, reason.trim());
                                toast.error(`'${user.name}' 승인 거부`, {
                                  description: reason.trim(),
                                  duration: 4500,
                                });
                                setOpen(false);
                                setReason("");
                              } catch {
                                toast.error("거부 처리 실패", {
                                  description: "잠시 후 다시 시도해 주세요.",
                                });
                              }
                            }}
                            disabled={!reason.trim() || isProcessing}
                            variant="destructive"
                            className="w-full"
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            거부 및 이메일 전송
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="더보기"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        {"documentUrl" in user &&
                          (user as PendingUser).documentUrl && (
                            <DropdownMenuItem asChild>
                              <a
                                href={(user as PendingUser).documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                              >
                                <FileText className="h-4 w-4 mr-1 text-black" />
                                증빙서류 보기
                              </a>
                            </DropdownMenuItem>
                          )}
                        {/*<DropdownMenuItem asChild>*/}
                        {/*  <Link*/}
                        {/*    href={`/admin/user-management/${user.id}`}*/}
                        {/*    className="flex items-center"*/}
                        {/*  >*/}
                        {/*    <Eye className="h-4 w-4 mr-1 text-black" />*/}
                        {/*    상세보기*/}
                        {/*  </Link>*/}
                        {/*</DropdownMenuItem>*/}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

                {type === "approved" && (
                  <Link href={`/admin/user-management/${user.id}`}>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      상세보기
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {type === "rejected" && (user as RejectedUser).rejectionReason && (
              <p className="mt-2 text-[12px] leading-5 text-destructive line-clamp-2 sm:line-clamp-none">
                사유: {(user as RejectedUser).rejectionReason}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UserManagementPage() {
  const [pendingUsers, setPendingUsers] =
    useState<PendingUser[]>(mockPendingUsers);
  const [approvedUsers, setApprovedUsers] =
    useState<ApprovedUser[]>(mockApprovedUsers);
  const [rejectedUsers, setRejectedUsers] =
    useState<RejectedUser[]>(mockRejectedUsers);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<ReviewState>("approved");

  const handleApprove = async (userId: string) => {
    setIsProcessing(true);
    try {
      const target = pendingUsers.find((u) => u.id === userId);
      if (!target) throw new Error("대상 없음");
      const approved: ApprovedUser = {
        id: target.id,
        name: target.name,
        email: target.email,
        organization: target.organization,
        userType: target.userType,
        status: "approved",
        approvedAt: new Date().toISOString().slice(0, 10),
      };
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
      setApprovedUsers((prev) => [approved, ...prev]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (userId: string, reason: string) => {
    if (!reason.trim()) return;
    setIsProcessing(true);
    try {
      const target = pendingUsers.find((u) => u.id === userId);
      if (!target) throw new Error("대상 없음");
      const rejected: RejectedUser = {
        id: target.id,
        name: target.name,
        email: target.email,
        organization: target.organization,
        userType: target.userType,
        status: "rejected",
        rejectedAt: new Date().toISOString().slice(0, 10),
        rejectionReason: reason.trim(),
      };
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
      setRejectedUsers((prev) => [rejected, ...prev]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background w-full overflow-auto">
      <div className="container mx-auto p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">사용자 관리</h1>
            <p className="text-gray-600">사용자 승인 및 관리</p>
          </div>

          <Tabs
            defaultValue="approved"
            className="space-y-6"
            onValueChange={(v) => setActiveTab(v as ReviewState)}
          >
            <TabsList className="w-full bg-gray-100 rounded-sm p-1 h-10">
              <TabsTrigger
                value="approved"
                className="flex-1 rounded-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm h-8"
              >
                승인 ({approvedUsers.length})
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="flex-1 rounded-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm h-8"
              >
                대기 ({pendingUsers.length})
              </TabsTrigger>
              <TabsTrigger
                value="rejected"
                className="flex-1 rounded-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm h-8"
              >
                거부 ({rejectedUsers.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {pendingUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  type="pending"
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isProcessing={isProcessing}
                />
              ))}
            </TabsContent>

            <TabsContent value="approved">
              {approvedUsers.map((user) => (
                <UserCard key={user.id} user={user} type="approved" />
              ))}
            </TabsContent>

            <TabsContent value="rejected">
              {rejectedUsers.map((user) => (
                <UserCard key={user.id} user={user} type="rejected" />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
