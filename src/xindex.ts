import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from 'cors';
import { FunctionCalling } from "./lib/getLLMResponse";
import type { ObjectSchema, QuestionSchema, OptionsSchema, AnswerSchema,  } from "./lib/model.d";

import { validate } from './middleware'; // Adjust this import to match your file structure.

const app = express();
dotenv.config();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());


// const upload = multer({ dest: 'uploads/', limits: { fileSize: 1000000 * 1024 } }); // Set a file size limit to 1GB.
app.post("/questions", validate, async (req: Request, res: Response) => {
  const { session, category } = req.body;

  try {
    const question: QuestionSchema = {
        type: "string",
        description: "Question",
      };
    const options: OptionsSchema[] = [
      {
        type: "string",
        description: "Option A",
      },
      {
        type: "string",
        description: "Option B",
      },
      {
        type: "string",
        description: "Option C",
      },
      {
        type: "string",
        description: "Option D",
      },
    ];
    const answer: AnswerSchema = {
      type: "string",
      description: "Answer",
    };

    const schema: ObjectSchema = {question, options, answer};
    console.log(schema);
    const instance = new FunctionCalling(schema);
    const result = await instance.Request(
      "Question: What financial concept is best described as the spread of investments across a variety of assets to reduce risks?\n\nOptions:\nA. Leverage\nB. Liquidity\nC. Diversification\nD. Amortization\n\nANS: C. Diversification"
    );
    console.log(result);

    res.status(200).send(result);
  } catch (error) {
    console.error(error); // Log the error to console (for your debugging)
    res.status(500).send(error.message); // Send the error message to the client
  }
});

app.listen(port, () => {
  console.log(`Server is running on PORT :${port}`);
});
