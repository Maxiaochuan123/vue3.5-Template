declare module 'async-validator' {
  export interface Rules {
    [key: string]: Rule | Rule[]
  }

  export interface Rule {
    type?: string
    required?: boolean
    message?: string
    trigger?: string | string[]
    min?: number
    max?: number
    len?: number
    enum?: Array<string | number | boolean | null | undefined>
    whitespace?: boolean
    pattern?: RegExp
    validator?: (rule: Rule, value: any) => boolean | Error | Promise<void>
  }

  export default class Schema {
    constructor(descriptor: Rules)
    validate(source: object, callback?: (errors: any, fields: any) => void): Promise<void>
    validate(source: object, options: any, callback?: (errors: any, fields: any) => void): Promise<void>
  }
} 