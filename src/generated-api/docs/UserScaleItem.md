
# UserScaleItem

사용자 척도 점수 항목

## Properties

Name | Type
------------ | -------------
`scaleCategory` | string
`score` | number

## Example

```typescript
import type { UserScaleItem } from ''

// TODO: Update the object below with actual values
const example = {
  "scaleCategory": ANXIETY,
  "score": 12,
} satisfies UserScaleItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UserScaleItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


