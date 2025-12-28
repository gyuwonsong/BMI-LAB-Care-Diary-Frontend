
# HomeResponse

홈 화면 정보 응답

## Properties

Name | Type
------------ | -------------
`monthlyDiaryCount` | number
`yearlyDiaryCount` | number
`emotionCounts` | { [key: string]: number; }
`recommendedWelfareServices` | [Array&lt;WelfareServiceItem&gt;](WelfareServiceItem.md)
`isScaleQuestionRequired` | boolean
`termCount` | number

## Example

```typescript
import type { HomeResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "monthlyDiaryCount": 12,
  "yearlyDiaryCount": 85,
  "emotionCounts": {HAPPY=30, LOVE=25, SAD=30},
  "recommendedWelfareServices": null,
  "isScaleQuestionRequired": true,
  "termCount": 3,
} satisfies HomeResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as HomeResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


