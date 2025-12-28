
# DiaryCreateRequest

일기 생성 요청

## Properties

Name | Type
------------ | -------------
`date` | Date
`content` | string
`emotion` | string
`questionScores` | [Array&lt;QuestionScoreItem&gt;](QuestionScoreItem.md)

## Example

```typescript
import type { DiaryCreateRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "date": 2024-12-25,
  "content": 오늘은 날씨가 좋아서 산책을 했다. 기분이 많이 좋아졌다.,
  "emotion": HAPPY,
  "questionScores": null,
} satisfies DiaryCreateRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DiaryCreateRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


