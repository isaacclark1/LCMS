import express, { Request, Response } from "express";
import LCMS_Cleaning from "../../API/LCMS_Cleaning";
import ServerError from "../../../../ServerError";
import { authenticateManagerToken } from "../authenticate";

const uc11Router = express.Router();

uc11Router.post("/", authenticateManagerToken, async (req, res) => {
  const { title, cleaningTaskTemplates } = req.body;

  try {
    const cleaningTaskTemplateListId = await LCMS_Cleaning.createCleaningTaskTemplateList(
      title,
      cleaningTaskTemplates
    );

    res.json({ cleaningTaskTemplateListId });
  } catch (err) {
    const { message, statusCode } = err as ServerError;
    console.error(statusCode, message);
    res.status(statusCode).json({ message, statusCode });
  }
});

export default uc11Router;
