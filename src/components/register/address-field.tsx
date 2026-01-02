"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DaumPostcode, { Address as DaumAddress } from "react-daum-postcode";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  composeAddress,
  parseAddress,
  pickSidoSigunguFromRoadAddress,
  stripLeadingAdminFromRoadAddress,
  type AddressParts,
} from "@/utils/address";
import { buildDetail } from "@/utils/address";

type Props = {
  value: string; // formData.address (최종 저장 문자열)
  onChangeAction: (next: string) => void;
  required?: boolean;
  disabled?: boolean;
};

export default function AddressField({
  value,
  onChangeAction,
  required = false,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);

  // UI 표시용 (Daum에서 선택한 "도로명 주소"를 그대로 보여줌)
  const [roadAddress, setRoadAddress] = useState("");

  // 사용자 입력 상세
  const [extraDetail, setExtraDetail] = useState("");

  // 저장 포맷용 (시·도 / 시·군·구)
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");

  const emitIfChanged = useCallback(
    (next: string) => {
      if (next !== value) onChangeAction(next);
    },
    [onChangeAction, value],
  );

  const buildStorageDetail = useCallback(
    (road: string, s: string, g: string, extra: string) => {
      const strippedRoad = stripLeadingAdminFromRoadAddress(road, s, g);
      return buildDetail(strippedRoad, extra);
    },
    [],
  );

  // 최종 저장 문자열
  const composed = useMemo(() => {
    const detail = buildStorageDetail(roadAddress, sido, sigungu, extraDetail);
    const parts: AddressParts = { sido, sigungu, detail };
    return composeAddress(parts);
  }, [roadAddress, sido, sigungu, extraDetail, buildStorageDetail]);

  useEffect(() => {
    if (!value) return;
    if (value === composed) return;

    const parsed = parseAddress(value);
    setSido(parsed.sido);
    setSigungu(parsed.sigungu);

    setRoadAddress(parsed.detail);
    setExtraDetail("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleComplete = (data: DaumAddress) => {
    const road = (data.roadAddress || data.address || "").trim();
    const { sido: nextSido, sigungu: nextSigungu } =
      pickSidoSigunguFromRoadAddress(road);

    setRoadAddress(road);
    setSido(nextSido);
    setSigungu(nextSigungu);
    setOpen(false);

    const nextDetail = buildStorageDetail(
      road,
      nextSido,
      nextSigungu,
      extraDetail,
    );
    const nextComposed = composeAddress({
      sido: nextSido,
      sigungu: nextSigungu,
      detail: nextDetail,
    });

    emitIfChanged(nextComposed);
  };

  const handleExtraDetailChange = (v: string) => {
    setExtraDetail(v);

    const nextDetail = buildStorageDetail(roadAddress, sido, sigungu, v);
    const nextComposed = composeAddress({
      sido,
      sigungu,
      detail: nextDetail,
    });

    emitIfChanged(nextComposed);
  };

  return (
    <div className="space-y-3">
      <Label>
        주소 {required && <span className="text-destructive">*</span>}
      </Label>

      <div className="flex gap-2">
        <Input
          value={roadAddress}
          readOnly
          disabled={disabled}
          className="bg-muted"
          placeholder="주소 찾기로 도로명 주소를 선택해주세요"
        />
        <Button type="button" disabled={disabled} onClick={() => setOpen(true)}>
          주소 찾기
        </Button>
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">상세주소</Label>
        <Input
          value={extraDetail}
          disabled={disabled}
          onChange={(e) => handleExtraDetailChange(e.target.value)}
          placeholder="예: ○○로 12, ○○아파트 101동 1001호"
        />
      </div>

      {/* 저장 미리보기 */}
      {/*<p className="text-xs text-muted-foreground">*/}
      {/*  저장 형식:{" "}*/}
      {/*  <span className="font-medium">*/}
      {/*    {composed || "시·도 // 시·군·구 // 도로명주소 상세주소"}*/}
      {/*  </span>*/}
      {/*</p>*/}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>주소 검색</DialogTitle>
          </DialogHeader>
          <div className="p-4 pt-2">
            <DaumPostcode onComplete={handleComplete} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
