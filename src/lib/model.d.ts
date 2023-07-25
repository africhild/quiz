export type KeyType = "string" | "number" | "boolean";

export interface QuestionSchema {
  type: KeyType;
  description: string;
  output?: string | number | boolean;
}
export interface OptionsSchema {
    type: KeyType;
    description: string;
    output?: string | number | boolean;
}
export interface AnswerSchema {
    type: KeyType;
    description: string;
    output?: string | number | boolean;
}
export interface ObjectSchema {
    question: QuestionSchema;
    options: OptionsSchema[];
    answer: AnswerSchema;
}

export interface OutputSchema {
    question: QuestionSchema;
    options: OptionsSchema[];
    answer: AnswerSchema;
}
