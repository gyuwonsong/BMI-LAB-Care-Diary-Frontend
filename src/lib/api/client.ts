import { Configuration } from "@/generated-api/runtime";
import {
  UserApi,
  ScaleQuestionApi,
  DiaryApi,
  AdminUserApi,
  AdminUsageApi,
  AdminDiaryApi,
} from "@/generated-api";
import { fetchWithSonner } from "@/lib/api/fetch-with-sonner";
import { getOAuthSession } from "@/lib/auth-storage";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function createConfig() {
  return new Configuration({
    basePath: API_BASE,
    fetchApi: fetchWithSonner,
    accessToken: async () => {
      const { token } = getOAuthSession();
      return token ?? "";
    },
  });
}

export const userApi = new UserApi(createConfig());
export const scaleQuestionApi = new ScaleQuestionApi(createConfig());
export const diaryApi = new DiaryApi(createConfig());
export const adminUserApi = new AdminUserApi(createConfig());
export const adminDiariyApi = new AdminDiaryApi(createConfig());
export const adminUsageApi = new AdminUsageApi(createConfig());
