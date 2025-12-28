
# ScaleQuestionDto

척도 질문 상세 정보

## Properties

Name | Type
------------ | -------------
`scaleQuestionId` | number
`questionNumber` | number
`content` | string
`scaleCategory` | string
`optionCount` | number
`options` | Array&lt;string&gt;

## Example

```typescript
import type { ScaleQuestionDto } from ''

// TODO: Update the object below with actual values
const example = {
  "scaleQuestionId": 1,
  "questionNumber": 1,
  "content": 지난 일주일 동안 긴장되거나 불안했다,
  "scaleCategory": ANXIETY,
  "optionCount": 5,
  "options": [전혀 아니다, 약간 그렇다, 보통이다, 많이 그렇다, 매우 그렇다],
} satisfies ScaleQuestionDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ScaleQuestionDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


