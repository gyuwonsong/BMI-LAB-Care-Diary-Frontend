# ScaleQuestionApi

All URIs are relative to *https://diary-api.snuh-bmilab.ai.kr*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**findAllScaleQuestions**](ScaleQuestionApi.md#findallscalequestions) | **GET** /v1/scale-questions | 전체 척도 질문 목록 조회 |
| [**findAllUserScales**](ScaleQuestionApi.md#findalluserscales) | **GET** /v1/users/scales | 사용자 척도 결과 조회 |
| [**registerUserScaleQuestionResult**](ScaleQuestionApi.md#registeruserscalequestionresult) | **POST** /v1/users/scale-questions | 척도 질문 응답 등록 |



## findAllScaleQuestions

> CommonResponseScaleQuestionFindAllResponse findAllScaleQuestions()

전체 척도 질문 목록 조회

시스템에 등록된 모든 척도 질문을 조회합니다. 불안, 우울, 분노 카테고리별 질문을 포함합니다.

### Example

```ts
import {
  Configuration,
  ScaleQuestionApi,
} from '';
import type { FindAllScaleQuestionsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ScaleQuestionApi(config);

  try {
    const data = await api.findAllScaleQuestions();
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

[**CommonResponseScaleQuestionFindAllResponse**](CommonResponseScaleQuestionFindAllResponse.md)

### Authorization

[JWT](../README.md#JWT)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 척도 질문 목록 조회 성공 |  -  |
| **401** | 인증 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## findAllUserScales

> CommonResponseUserScaleFindAllResponse findAllUserScales()

사용자 척도 결과 조회

현재 사용자의 모든 척도 측정 결과를 조회합니다. 회차별로 그룹화된 결과를 반환합니다.

### Example

```ts
import {
  Configuration,
  ScaleQuestionApi,
} from '';
import type { FindAllUserScalesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ScaleQuestionApi(config);

  try {
    const data = await api.findAllUserScales();
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

[**CommonResponseUserScaleFindAllResponse**](CommonResponseUserScaleFindAllResponse.md)

### Authorization

[JWT](../README.md#JWT)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 척도 결과 조회 성공 |  -  |
| **401** | 인증 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## registerUserScaleQuestionResult

> CommonResponseUnit registerUserScaleQuestionResult(scaleQuestionUserAnswerRegisterRequest)

척도 질문 응답 등록

사용자의 척도 질문에 대한 응답을 등록합니다. 불안, 우울, 분노 척도에 대한 응답을 포함합니다.

### Example

```ts
import {
  Configuration,
  ScaleQuestionApi,
} from '';
import type { RegisterUserScaleQuestionResultRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ScaleQuestionApi(config);

  const body = {
    // ScaleQuestionUserAnswerRegisterRequest
    scaleQuestionUserAnswerRegisterRequest: ...,
  } satisfies RegisterUserScaleQuestionResultRequest;

  try {
    const data = await api.registerUserScaleQuestionResult(body);
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
| **scaleQuestionUserAnswerRegisterRequest** | [ScaleQuestionUserAnswerRegisterRequest](ScaleQuestionUserAnswerRegisterRequest.md) |  | |

### Return type

[**CommonResponseUnit**](CommonResponseUnit.md)

### Authorization

[JWT](../README.md#JWT)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 응답 등록 성공 |  -  |
| **400** | 잘못된 요청 (유효성 검사 실패) |  -  |
| **401** | 인증 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

