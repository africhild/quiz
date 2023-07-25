import { PromptTemplate } from "langchain";

const template =
  "With context as: {input} . Find the result of the following question in {type} format, without extra bs: {description}";
const FunctionPrompt = new PromptTemplate({
  template,
  inputVariables: ["input", "type", "description"],
});

export default FunctionPrompt;