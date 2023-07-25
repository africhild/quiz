import { z } from "zod";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

// We can use zod to define a schema for the output using the `fromZodSchema` method of `StructuredOutputParser`.
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    question: z.string().describe("the user's question"),
    options: z
      .array(z.string())
      .describe("options to the generated question"),
    answer: z.string().describe("the answer to the generated question"),
  })
);

const formatInstructions = parser.getFormatInstructions();

const prompt = new PromptTemplate({
  template:
    "Answer the users question as best as possible.\n{format_instructions}\n{question}",
  inputVariables: ["question"],
  partialVariables: { format_instructions: formatInstructions },
});
const model = new OpenAI({ temperature: 0 });

export class FunctionCalling {
async Request(question: string) {
    try {
        const input = await prompt.format({
          question
        });
        const response = await model.call(input);
        
        /*
        Answer the users question as best as possible.
        The output should be formatted as a JSON instance that conforms to the JSON schema below.
        
        As an example, for the schema {{"properties": {{"foo": {{"title": "Foo", "description": "a list of strings", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}}}
        the object {{"foo": ["bar", "baz"]}} is a well-formatted instance of the schema. The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted.
        
        Here is the output schema:
        ```
        {"type":"object","properties":{"answer":{"type":"string","description":"answer to the user's question"},"sources":{"type":"array","items":{"type":"string"},"description":"sources used to answer the question, should be websites."}},"required":["answer","sources"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"}
        ```
        
        What is the capital of France?
        */
        
        console.log(response);
        /*
        {"answer": "Paris", "sources": ["https://en.wikipedia.org/wiki/Paris"]}
        */
        
       return parser.parse(response);
        /*
        { answer: 'Paris', sources: [ 'https://en.wikipedia.org/wiki/Paris' ] }
        */
    } catch (error) {
        console.error(error);
        throw error;
    }
}
}