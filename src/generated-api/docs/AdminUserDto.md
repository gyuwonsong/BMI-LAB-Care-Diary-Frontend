
# AdminUserDto

관리자 사용자 정보

## Properties

Name | Type
------------ | -------------
`userId` | string
`name` | string
`birthDate` | Date
`primaryDiagnosis` | string
`atRisk` | boolean

## Example

```typescript
import type { AdminUserDto } from ''

// TODO: Update the object below with actual values
const example = {
  "userId": 550e8400-e29b-41d4-a716-446655440000,
  "name": 홍길동,
  "birthDate": 1990-01-15,
  "primaryDiagnosis": 조현병,
  "atRisk": false,
} satisfies AdminUserDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminUserDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


