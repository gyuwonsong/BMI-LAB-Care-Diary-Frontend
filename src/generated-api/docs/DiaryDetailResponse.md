
# DiaryDetailResponse

일기 상세 조회 응답

## Properties

Name | Type
------------ | -------------
`diaryId` | string
`date` | Date
`content` | string
`emotion` | string
`questionScores` | [Array&lt;RecommendedQuestionUserScoreDto&gt;](RecommendedQuestionUserScoreDto.md)

## Example

```typescript
import type { DiaryDetailResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "diaryId": 550e8400-e29b-41d4-a716-446655440000,
  "date": 2024-12-25,
  "content": 오늘은 날씨가 좋아서 산책을 했다.,
  "emotion": HAPPY,
  "questionScores": null,
} satisfies DiaryDetailResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DiaryDetailResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


