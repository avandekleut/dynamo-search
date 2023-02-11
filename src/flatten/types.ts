import { TerminalType } from '../obj'

export interface FlattenableObject {
  [attributeName: string]:
    | TerminalType
    | Array<TerminalType | FlattenableObject>
    | FlattenableObject
}

export interface FlattenedObject {
  [attributeName: string]: TerminalType
}
