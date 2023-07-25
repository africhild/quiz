import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from 'cors';
import { FunctionCalling } from "./lib/langchain-2";

import { validate } from './middleware'; // Adjust this import to match your file structure.

const app = express();
dotenv.config();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.post("/question", validate, async (req: Request, res: Response) => {
  try {
    let { category } = req.body;
    console.log(category);
    const instance = new FunctionCalling();
    category = category || "Mathematics";
    const result = await instance.Request(
      `Generate a random question in ${category} with Five options in a alphabetical list format and indicate the  correct answer`
    );
    res.status(200).json(result);
  } catch (error) {
    console.error(error); // Log the error to console (for your debugging)
    res.status(500).send(error.message); // Send the error message to the client
  }
});

app.listen(port, () => {
  console.log(`Server is running on PORT :${port}`);
});
