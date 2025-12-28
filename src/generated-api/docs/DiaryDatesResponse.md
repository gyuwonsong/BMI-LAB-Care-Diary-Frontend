
# DiaryDatesResponse

월별 일기 작성 날짜 목록 응답

## Properties

Name | Type
------------ | -------------
`dates` | Array&lt;Date&gt;

## Example

```typescript
import type { DiaryDatesResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "dates": [2024-12-01, 2024-12-05, 2024-12-10],
} satisfies DiaryDatesResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DiaryDatesResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


