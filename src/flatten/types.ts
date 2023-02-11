import { TerminalType } from '../object-inspector'

export interface FlattenableObject {
  [attributeName: string]:
    | TerminalType
    | Array<TerminalType | FlattenableObject>
    | FlattenableObject
}

export interface FlattenedObject {
  [attributeName: string]: TerminalType
}
