
import * as dotenv from "dotenv";
import { OpenAI } from "langchain/llms/openai";
// import { HuggingFaceInference } from "langchain/llms";
import type { ObjectSchema, QuestionSchema, OptionsSchema, AnswerSchema, OutputSchema } from "@/lib/model.d";

import FunctionPromptTemplate from "./prompts";

dotenv.config();

const model = new OpenAI({
  modelName: "gpt-3.5-turbo-0613",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// accepts schema as an object
// later describes a function, which accepts a string as input and returns object in the schema format

export class FunctionCalling {
  schema: ObjectSchema;

  question: ObjectSchema["question"];

  options: ObjectSchema["options"];

  answer: ObjectSchema["answer"];

  constructor(schemainput: ObjectSchema) {
    this.schema = schemainput;
    this.question = this.schema.question;
    this.options = this.schema.options;
    this.answer = this.schema.answer;
  }

  async Request(input: string) {
    try {
      let result: OutputSchema = {};
        const question: QuestionSchema = await FunctionPromptTemplate.format({
          input,
          type: this.question.type,
          description: this.question.description,
        });
        const answer: AnswerSchema = await FunctionPromptTemplate.format({
          input,
          type: this.answer.type,
          description: this.answer.description,
        });
        console.log('q', question);
        console.log('a', answer);
        const _question = await model.call(question);
        const _options = await this.getOptions(input);
        const _answer = await model.call(answer);
        result =  {
          question: _question,
          answer: _answer,
          options: _options,
        };
        return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getOptions(input: string) {
    try {
      // const question: QuestionSchema = {}
      const options: OptionsSchema[] = [];

      for (const prompt of this.options) {
        const formattedPrompt = await FunctionPromptTemplate.format({
          input,
          type: prompt.type,
          description: prompt.description,
        });
        console.log('formattedPrompt', formattedPrompt);
        const res = await model.call(formattedPrompt);
        options.push({
          type: prompt.type,
          description: prompt.description,
          output: res,
        });
        console.log(options);
      }
      return options;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
