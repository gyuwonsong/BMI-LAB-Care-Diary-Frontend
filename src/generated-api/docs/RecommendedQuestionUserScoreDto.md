
# RecommendedQuestionUserScoreDto

추천 질문 점수

## Properties

Name | Type
------------ | -------------
`questionText` | string
`score` | number

## Example

```typescript
import type { RecommendedQuestionUserScoreDto } from ''

// TODO: Update the object below with actual values
const example = {
  "questionText": 오늘 하루 얼마나 활동적이었나요?,
  "score": 7,
} satisfies RecommendedQuestionUserScoreDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RecommendedQuestionUserScoreDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


