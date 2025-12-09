"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { UserRole } from "@/lib/constants";
import { useCurrentUser } from "@/hooks/use-current-user";

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const {
    name: userName,
    avatarUrl: userAvatar,
    role: userRole,
  } = useCurrentUser();

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-white">
      <div className="flex h-16 items-center justify-between px-8">
        <div className="flex items-center gap-8 ">
          <Link href="/home" className="flex items-center">
            <h1 className="text-xl font-bold cursor-pointer hover:opacity-80">
              돌봄일기
            </h1>
          </Link>

          {userRole === UserRole.ADMIN && onTabChange && (
            <div className="flex gap-1">
              <Button
                variant={activeTab === "users" ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange("users")}
                className="rounded-sm"
              >
                사용자 관리
              </Button>
              <Button
                variant={activeTab === "usage" ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange("usage")}
                className="rounded-sm"
              >
                사용량 관리
              </Button>
            </div>
          )}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="gap-3 h-auto py-2 px-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={userAvatar || "/placeholder.svg"}
                  alt={userName}
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{userName}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={20}
            className="w-48 rounded-sm p-2"
          >
            <div className="flex flex-col gap-1">
              {userRole === UserRole.USER && (
                <Link href="/mypage">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 rounded-sm"
                    size="sm"
                  >
                    <User className="h-4 w-4" />
                    마이페이지
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 rounded-sm text-destructive hover:text-destructive"
                size="sm"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
