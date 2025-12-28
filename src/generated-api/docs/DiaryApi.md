# DiaryApi

All URIs are relative to *https://diary-api.snuh-bmilab.ai.kr*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createDiary**](DiaryApi.md#creatediary) | **POST** /v1/diaries | 일기 생성 |
| [**findAllDiariesByMe**](DiaryApi.md#findalldiariesbyme) | **GET** /v1/diaries/me | 내 일기 목록 조회 |
| [**findDates**](DiaryApi.md#finddates) | **GET** /v1/diaries/dates | 월별 일기 작성 날짜 조회 |
| [**findDiaryById**](DiaryApi.md#finddiarybyid) | **GET** /v1/diaries/{diaryId} | 일기 상세 조회 |



## createDiary

> CommonResponseDiaryCreateResponse createDiary(diaryCreateRequest)

일기 생성

새로운 일기를 작성합니다. 날짜, 내용, 감정, 질문 점수를 포함해야 합니다.

### Example

```ts
import {
  Configuration,
  DiaryApi,
} from '';
import type { CreateDiaryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DiaryApi(config);

  const body = {
    // DiaryCreateRequest
    diaryCreateRequest: ...,
  } satisfies CreateDiaryRequest;

  try {
    const data = await api.createDiary(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **diaryCreateRequest** | [DiaryCreateRequest](DiaryCreateRequest.md) |  | |

### Return type

[**CommonResponseDiaryCreateResponse**](CommonResponseDiaryCreateResponse.md)

### Authorization

[JWT](../README.md#JWT)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 일기 생성 성공 |  -  |
| **400** | 잘못된 요청 (유효성 검사 실패) |  -  |
| **401** | 인증 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## findAllDiariesByMe

> CommonResponseDiaryFindAllResponse findAllDiariesByMe(startDate, endDate)

내 일기 목록 조회

현재 사용자의 일기 목록을 조회합니다. 선택적으로 시작/종료 날짜로 필터링할 수 있습니다.

### Example

```ts
import {
  Configuration,
  DiaryApi,
} from '';
import type { FindAllDiariesByMeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DiaryApi(config);

  const body = {
    // Date | 조회 시작 날짜 (선택) (optional)
    startDate: 2024-01-01,
    // Date | 조회 종료 날짜 (선택) (optional)
    endDate: 2024-12-31,
  } satisfies FindAllDiariesByMeRequest;

  try {
    const data = await api.findAllDiariesByMe(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **startDate** | `Date` | 조회 시작 날짜 (선택) | [Optional] [Defaults to `undefined`] |
| **endDate** | `Date` | 조회 종료 날짜 (선택) | [Optional] [Defaults to `undefined`] |

### Return type

[**CommonResponseDiaryFindAllResponse**](CommonResponseDiaryFindAllResponse.md)

### Authorization

[JWT](../README.md#JWT)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 일기 목록 조회 성공 |  -  |
| **401** | 인증 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## findDates

> CommonResponseDiaryDatesResponse findDates(month)

월별 일기 작성 날짜 조회

특정 월에 일기가 작성된 날짜 목록을 조회합니다.

### Example

```ts
import {
  Configuration,
  DiaryApi,
} from '';
import type { FindDatesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DiaryApi(config);

  const body = {
    // string | 조회할 월 (yyyy-MM 형식)
    month: 2024-01,
  } satisfies FindDatesRequest;

  try {
    const data = await api.findDates(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **month** | `string` | 조회할 월 (yyyy-MM 형식) | [Defaults to `undefined`] |

### Return type

[**CommonResponseDiaryDatesResponse**](CommonResponseDiaryDatesResponse.md)

### Authorization

[JWT](../README.md#JWT)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 날짜 목록 조회 성공 |  -  |
| **401** | 인증 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## findDiaryById

> CommonResponseDiaryDetailResponse findDiaryById(diaryId)

일기 상세 조회

특정 일기의 상세 정보를 조회합니다.

### Example

```ts
import {
  Configuration,
  DiaryApi,
} from '';
import type { FindDiaryByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DiaryApi(config);

  const body = {
    // string | 일기 ID
    diaryId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies FindDiaryByIdRequest;

  try {
    const data = await api.findDiaryById(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **diaryId** | `string` | 일기 ID | [Defaults to `undefined`] |

### Return type

[**CommonResponseDiaryDetailResponse**](CommonResponseDiaryDetailResponse.md)

### Authorization

[JWT](../README.md#JWT)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 일기 상세 조회 성공 |  -  |
| **401** | 인증 실패 |  -  |
| **404** | 일기를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

