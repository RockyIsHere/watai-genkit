import express, { Request, Response } from "express";
import generateOutput from "../webhook/wp.message";
import { grammerCheckFlow } from "../actions/grammer.check";
import { paraphraserFlow } from "../actions/paraphraser";
import { synonymsFlow } from "../actions/synonyms";
import { antonymsFlow } from "../actions/antonyms";
import { englishPoemFlow } from "../actions/english.poem";
import { quotesFlow } from "../actions/quotes";
const router = express.Router();


//?? Grammer Checker
router.post("/grammer-checker", async (req: Request, res: Response) => {
  const { input } = req.body;
  try {
    const result = (await generateOutput(grammerCheckFlow, input)).message;
    res.status(201).json({ message: result });
  } catch (error) {
    res.status(400);
  }
});

router.post("/paraphraser", async (req: Request, res: Response) => {
  const { input } = req.body;
  try {
    const result = (await generateOutput(paraphraserFlow, input)).message;
    res.status(201).json({ message: result });
  } catch (error) {
    res.status(400);
  }
});

router.post("/synonyms", async (req: Request, res: Response) => {
  const { input } = req.body;
  try {
    const result = (await generateOutput(synonymsFlow, input)).message;
    res.status(201).json({ message: result });
  } catch (error) {
    res.status(400);
  }
});

router.post("/antonyms", async (req: Request, res: Response) => {
  const { input } = req.body;
  try {
    const result = (await generateOutput(antonymsFlow, input)).message;
    res.status(201).json({ message: result });
  } catch (error) {
    res.status(400);
  }
});

router.post("/english-poem", async (req: Request, res: Response) => {
  const { input } = req.body;
  try {
    const result = (await generateOutput(englishPoemFlow, input)).message;
    res.status(201).json({ message: result });
  } catch (error) {
    res.status(400);
  }
});

router.post("/quotes", async (req: Request, res: Response) => {
  const { input } = req.body;
  try {
    const result = (await generateOutput(quotesFlow, input)).message;
    res.status(201).json({ message: result });
  } catch (error) {
    res.status(400);
  }
});

export default router