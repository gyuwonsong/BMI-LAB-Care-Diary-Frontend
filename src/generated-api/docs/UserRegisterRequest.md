
# UserRegisterRequest

회원가입 요청

## Properties

Name | Type
------------ | -------------
`name` | string
`role` | string
`gender` | string
`birthDate` | Date
`address` | string
`primaryDiagnosis` | string
`educationBeforeOnset` | string
`previousDiagnosis` | string
`diagnosisYearMonth` | string
`diagnosisHospital` | string
`chiefComplaint` | string
`currentHospital` | string
`currentResidence` | string
`medicalCoverage` | string
`specialCaseRegistered` | boolean
`specialCaseRegisteredDate` | Date
`disabilityRegistered` | boolean
`disabilityStatus` | string
`disabilityType` | string
`disabilitySeverity` | string
`socialWelfareServiceLabels` | Array&lt;string&gt;

## Example

```typescript
import type { UserRegisterRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "name": 홍길동,
  "role": USER,
  "gender": MALE,
  "birthDate": 1990-01-15,
  "address": 서울특별시 강남구 테헤란로 123,
  "primaryDiagnosis": 조현병,
  "educationBeforeOnset": 대학교 졸업,
  "previousDiagnosis": 우울증,
  "diagnosisYearMonth": 2020-06,
  "diagnosisHospital": 서울대학교병원,
  "chiefComplaint": 환청, 망상,
  "currentHospital": 서울대학교병원 정신건강의학과,
  "currentResidence": 자택,
  "medicalCoverage": HEALTH_INSURANCE,
  "specialCaseRegistered": true,
  "specialCaseRegisteredDate": 2021-03-01,
  "disabilityRegistered": true,
  "disabilityStatus": REGISTERED,
  "disabilityType": 정신장애,
  "disabilitySeverity": NOT_SEVERE,
  "socialWelfareServiceLabels": [CAREGIVER_COST, SPECIAL_DIET_PURCHASE],
} satisfies UserRegisterRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UserRegisterRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


