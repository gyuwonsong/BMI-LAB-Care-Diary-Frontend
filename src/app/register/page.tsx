"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Gender, GENDER_LABELS, UserRole } from "@/lib/constants";

type FormData = {
  // 필수 입력
  name: string;
  email: string;
  gender: Gender;
  birth: string;
  address: string;
  role: UserRole;

  // 선택 입력
  mainDiagnosis: string;
  education: string;
  historyDiagnosis: string;
  historyDate: string;
  historyHospital: string;
  mainSymptoms: string;
  currentHospital: string;
  currentResidence: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const socialProvider = "google";

  const [formData, setFormData] = useState<FormData>({
    name: "홍길동",
    email: "hong@example.com",
    gender: Gender.MALE,
    birth: "",
    address: "",
    role: UserRole.USER,

    mainDiagnosis: "",
    education: "",
    historyDiagnosis: "",
    historyDate: "",
    historyHospital: "",
    mainSymptoms: "",
    currentHospital: "",
    currentResidence: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    document.cookie = `userRole=${formData.role}; path=/; max-age=${
      60 * 60 * 24 * 7
    }`;

    if (formData.role === UserRole.ADMIN) {
      router.push("/admin/users");
    } else {
      router.push("/register/questions");
    }
  };

  const providerLabels: Record<string, string> = {
    google: "구글",
    kakao: "카카오",
    naver: "네이버",
  };

  const isAdmin = formData.role === UserRole.ADMIN;

  return (
    <div className="min-h-screen bg-secondary px-4 py-10 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">회원가입</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            돌봄일기를 시작하기 위해 정보를 입력해주세요 😊
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
            <div>
              <p className="text-sm font-medium">기본 정보 및 부가 정보 입력</p>
              <p className="mt-1 text-xs text-destructive font-medium">
                * 표시는 필수 입력 항목입니다.
              </p>
            </div>
            <Badge variant="secondary" className="rounded-sm">
              {providerLabels[socialProvider]} 계정
            </Badge>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 관리자 선택 */}
              <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
                <p className="text-xs text-muted-foreground">
                  일반 사용자 또는 관리자 중 가입 유형을 선택할 수 있습니다.
                </p>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isAdmin"
                    className="bg-white"
                    checked={isAdmin}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        role: checked ? UserRole.ADMIN : UserRole.USER,
                      })
                    }
                  />
                  <Label
                    htmlFor="isAdmin"
                    className="cursor-pointer font-normal text-xs"
                  >
                    관리자로 가입
                  </Label>
                </div>
              </div>

              {/* 필수 입력 : 기본 정보 (유저, 어드민 둘 다) */}
              <section className="space-y-5">
                <h2 className="text-lg font-bold">기본 정보</h2>

                {/* 이름 */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    이름 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    readOnly
                    className="bg-muted"
                  />
                </div>

                {/* 이메일 */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    이메일 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    value={formData.email}
                    readOnly
                    className="bg-muted"
                  />
                </div>

                {/* 성별 */}
                <div className="space-y-2">
                  <Label>
                    성별 <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value: Gender) =>
                      setFormData({ ...formData, gender: value })
                    }
                    className="flex flex-row space-x-6"
                  >
                    {Object.entries(GENDER_LABELS).map(([value, label]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={value} />
                        <Label htmlFor={value}>{label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* 생년월일 */}
                <div className="space-y-2">
                  <Label htmlFor="birth">
                    생년월일 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="birth"
                    type="date"
                    value={formData.birth}
                    onChange={(e) =>
                      setFormData({ ...formData, birth: e.target.value })
                    }
                    required
                  />
                </div>

                {/* 주소 */}
                <div className="space-y-2">
                  <Label htmlFor="address">
                    주소 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                    placeholder="주소를 입력하세요"
                  />
                </div>
              </section>

              {/* 선택 입력 : 부가 정보 (유저만)  */}
              {!isAdmin && (
                <section className="space-y-5 pt-4 border-t">
                  <div className="flex flex-row items-center space-x-2">
                    <h2 className="text-lg font-bold">부가 정보</h2>
                    <span className="text-xs text-muted-foreground">
                      (선택)
                    </span>
                  </div>

                  {/* 주 진단명 (선택) */}
                  <div className="space-y-2">
                    <Label htmlFor="mainDiagnosis">주 진단명</Label>
                    <Input
                      id="mainDiagnosis"
                      value={formData.mainDiagnosis}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mainDiagnosis: e.target.value,
                        })
                      }
                      placeholder="주 진단명을 입력하세요"
                    />
                  </div>

                  {/* 학력 (선택) */}
                  <div className="space-y-2">
                    <Label htmlFor="education">학력 (발병 전)</Label>
                    <Input
                      id="education"
                      value={formData.education}
                      onChange={(e) =>
                        setFormData({ ...formData, education: e.target.value })
                      }
                      placeholder="예: 대학교 4학년 재학, 고졸 등"
                    />
                  </div>

                  {/* 병력 - 진단명 */}
                  <div className="space-y-2">
                    <Label htmlFor="historyDiagnosis">병력 - 진단명</Label>
                    <Input
                      id="historyDiagnosis"
                      value={formData.historyDiagnosis}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          historyDiagnosis: e.target.value,
                        })
                      }
                      placeholder="과거 진단명을 입력하세요"
                    />
                  </div>

                  {/* 병력 - 진단받은 시기 */}
                  <div className="space-y-2">
                    <Label htmlFor="historyDate">병력 - 진단받은 시기</Label>
                    <Input
                      id="historyDate"
                      type="month"
                      value={formData.historyDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          historyDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* 병력 - 진단받은 병원 */}
                  <div className="space-y-2">
                    <Label htmlFor="historyHospital">
                      병력 - 진단받은 병원
                    </Label>
                    <Input
                      id="historyHospital"
                      value={formData.historyHospital}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          historyHospital: e.target.value,
                        })
                      }
                      placeholder="병원명을 입력하세요"
                    />
                  </div>

                  {/* 주증상 */}
                  <div className="space-y-2">
                    <Label htmlFor="mainSymptoms">주증상</Label>
                    <Input
                      id="mainSymptoms"
                      value={formData.mainSymptoms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mainSymptoms: e.target.value,
                        })
                      }
                      placeholder="주요 증상을 입력하세요"
                    />
                  </div>

                  {/* 현재 주로 이용하는 병원 */}
                  <div className="space-y-2">
                    <Label htmlFor="currentHospital">
                      현재 주로 이용하는 병원
                    </Label>
                    <Input
                      id="currentHospital"
                      value={formData.currentHospital}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentHospital: e.target.value,
                        })
                      }
                      placeholder="현재 다니는 병원을 입력하세요"
                    />
                  </div>

                  {/* 현재 거주하는 장소 */}
                  <div className="space-y-2">
                    <Label htmlFor="currentResidence">현재 거주하는 장소</Label>
                    <Input
                      id="currentResidence"
                      value={formData.currentResidence}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentResidence: e.target.value,
                        })
                      }
                      placeholder="예: 본가, 그룹홈, 자립주택 등"
                    />
                  </div>
                </section>
              )}

              <div className="space-y-3 pt-2">
                <Button type="submit" className="w-full" size="lg">
                  다음
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  이미 계정이 있으신가요?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                  >
                    로그인
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
