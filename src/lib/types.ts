import type { UserRole, Gender } from "./constants";

export interface User {
  id: string;
  name: string;
  email: string;
  gender: Gender;
  age: number;
  role: UserRole;
  adminKey?: string;
  createdAt: Date;
}

export interface RiskInfo {
  isRisk: boolean;
  reason: string;
}

export interface AnxietyResponse {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  q10: number;
  q11: number;
  q12: number;
  q13: number;
  q14: number;
}

export interface DepressionResponse {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  q10: number;
  q11: number;
  q12: number;
  q13: number;
  q14: number;
  q15: number;
  q16: number;
  q17: number;
  q18: number;
  q19: number;
  q20: number;
}

export interface AngerResponse {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  q10: number;
  q11: number;
  q12: number;
  q13: number;
  q14: number;
  q15: number;
  q16: number;
  q17: number;
  q18: number;
  q19: number;
  q20: number;
  q21: number;
  q22: number;
  q23: number;
  q24: number;
}
