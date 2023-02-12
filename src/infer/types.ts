import * as fc from 'fast-check'

export type InferConfig = Partial<InferConfigInternal>

export type InferConfigInternal = {
  stringSharedConstraints: fc.StringSharedConstraints
  jsonSharedConstraints: fc.JsonSharedConstraints
  bigIntConstraints: fc.BigIntConstraints
  dateConstraints: fc.DateConstraints
  emailAddressConstraints: fc.EmailAddressConstraints
  domainConstraints: fc.DomainConstraints
  natConstraints: fc.NatConstraints
  integerConstraints: fc.IntegerConstraints
  doubleConstraints: fc.DoubleConstraints
}
