import { User, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User as UserType } from "@/lib/types";

interface UserListProps {
  users: (UserType & {
    birthDate: string;
    disease: string;
    risk?: { isRisk: boolean; reason: string };
  })[];
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
        const isRisk = user.risk?.isRisk === true;
        const isSelected = selectedUserId === user.id;

        return (
          <button
            key={user.id}
            onClick={() => onSelectUser(user.id)}
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
                <p className="font-semibold text-foreground">{user.name}</p>

                <p className="mt-0.5 text-sm text-muted-foreground">
                  {user.birthDate}
                </p>

                <p className="mt-0.5 text-sm text-muted-foreground">
                  {user.disease}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
