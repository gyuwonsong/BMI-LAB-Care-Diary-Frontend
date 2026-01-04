import { User, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminUserDto } from "@/generated-api";
import { formatCreated } from "@/utils/date";

interface UserListProps {
  users: AdminUserDto[];
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

export function UserList({
  users,
  selectedUserId,
  onSelectUser,
}: UserListProps) {
  return (
    <div className="divide-y divide-border">
      {users.map((user) => {
        const isRisk = user.atRisk;
        const isSelected = selectedUserId === user.userId;

        return (
          <button
            key={user.userId}
            onClick={() => onSelectUser(user.userId)}
            className={cn(
              "w-full px-6 py-4 text-left transition-colors hover:bg-muted/50",
              isSelected &&
                (isRisk
                  ? "border-l-4 border-l-red-500"
                  : "border-l-4 border-l-primary"),
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                  isRisk
                    ? "bg-red-50 border-red-200"
                    : "bg-primary/10 border-primary/30",
                )}
              >
                {isRisk ? (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                ) : (
                  <User className="h-5 w-5 text-primary" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-foreground">
                  {user.name}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatCreated(user.birthDate, "date")}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {user.primaryDiagnosis ?? "주진단명 없음"}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
