
# WelfareServiceItem

복지 서비스 항목

## Properties

Name | Type
------------ | -------------
`serviceName` | string
`serviceDetailLink` | string
`serviceDigest` | string

## Example

```typescript
import type { WelfareServiceItem } from ''

// TODO: Update the object below with actual values
const example = {
  "serviceName": 정신건강복지센터 상담 서비스,
  "serviceDetailLink": https://www.bokjiro.go.kr/service/12345,
  "serviceDigest": 정신건강 상담 및 사례관리 서비스를 제공합니다.,
} satisfies WelfareServiceItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as WelfareServiceItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


