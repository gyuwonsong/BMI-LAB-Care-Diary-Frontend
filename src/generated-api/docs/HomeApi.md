# HomeApi

All URIs are relative to *https://diary-api.snuh-bmilab.ai.kr*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getHome**](HomeApi.md#gethome) | **GET** /v1/home | 홈 화면 정보 조회 |



## getHome

> CommonResponseHomeResponse getHome()

홈 화면 정보 조회

사용자의 홈 화면에 표시될 정보를 조회합니다. 월별/연간 일기 수, 감정 통계, 추천 복지 서비스, 척도 질문 필요 여부 등을 포함합니다.

### Example

```ts
import {
  Configuration,
  HomeApi,
} from '';
import type { GetHomeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new HomeApi(config);

  try {
    const data = await api.getHome();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**CommonResponseHomeResponse**](CommonResponseHomeResponse.md)

### Authorization

[JWT](../README.md#JWT)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 홈 화면 정보 조회 성공 |  -  |
| **401** | 인증 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

