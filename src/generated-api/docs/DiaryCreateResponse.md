
# DiaryCreateResponse

일기 생성 응답

## Properties

Name | Type
------------ | -------------
`summary` | string

## Example

```typescript
import type { DiaryCreateResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "summary": 오늘 산책을 하며 좋은 기분을 느꼈군요! 활동적인 하루를 보내셨네요.,
} satisfies DiaryCreateResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DiaryCreateResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


