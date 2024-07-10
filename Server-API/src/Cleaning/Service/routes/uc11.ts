import express, { Request, Response } from "express";
import LCMS_Cleaning from "../../API/LCMS_Cleaning";
import ServerError from "../../../../ServerError";

const uc11Router = express.Router();

uc11Router.post("/", async (req, res) => {
  const { title } = req.body;

  try {
    const cleaningTaskTemplateListId = await LCMS_Cleaning.createCleaningTaskTemplateList(title);

    res.json({ cleaningTaskTemplateListId });
  } catch (err) {
    const { message, statusCode } = err as ServerError;
    console.error(statusCode, message);
    res.status(statusCode).json({ message, statusCode });
  }
});

export default uc11Router;
