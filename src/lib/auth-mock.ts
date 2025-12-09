/**
 * 역할 테스트 방법:
 *
 * 이 파일의 MOCK_USER_ROLE 값을 'USER' 또는 'ADMIN'으로 변경하면
 * 전체 앱에서 현재 로그인한 유저의 Role이 변경된 것처럼 동작합니다.
 *
 * 예시:
 * - export const MOCK_USER_ROLE = UserRole.USER  → 일반 사용자로 테스트
 * - export const MOCK_USER_ROLE = UserRole.ADMIN → 관리자로 테스트
 *
 * 실제 배포 시에는 이 파일을 API 호출로 대체하면 됩니다.
 */

import { UserRole } from "./constants";

export const MOCK_USER_ROLE = UserRole.USER; // UserRole.USER 또는 UserRole.ADMIN

export const MOCK_USER_DATA = {
  id: "mock-user-001",
  name: "홍길동",
  email: "hong@example.com",
  avatarUrl: "/abstract-geometric-shapes.png",
  role: MOCK_USER_ROLE, // 위에서 설정한 Role 값이 자동으로 반영됨
};

export function getMockCurrentUser() {
  return MOCK_USER_DATA;
}
