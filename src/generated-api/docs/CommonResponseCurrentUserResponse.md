
# CommonResponseCurrentUserResponse


## Properties

Name | Type
------------ | -------------
`status` | number
`code` | string
`message` | string
`data` | [CurrentUserResponse](CurrentUserResponse.md)

## Example

```typescript
import type { CommonResponseCurrentUserResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "status": null,
  "code": null,
  "message": null,
  "data": null,
} satisfies CommonResponseCurrentUserResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CommonResponseCurrentUserResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


