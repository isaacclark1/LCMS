import express, { Request, Response } from "express";
import LCMS_Cleaning from "../../API/LCMS_Cleaning";
import ServerError from "../../../../ServerError";

const uc8Router = express.Router();

uc8Router.post("/", async (req, res) => {
  const {
    cleaningTaskTemplateListId,
    cleaningTaskTemplateId,
    cleaningTaskTemplateDescription,
    areaId,
    areaDescription,
  } = req.body;

  try {
    const response = await LCMS_Cleaning.addCleaningTaskTemplateToCleaningTaskTemplateList(
      cleaningTaskTemplateListId,
      cleaningTaskTemplateId || undefined,
      cleaningTaskTemplateDescription || undefined,
      areaId || undefined,
      areaDescription || undefined
    );

    res.json({ response });
  } catch (err) {
    const { message, statusCode } = err as ServerError;
    console.error(statusCode, message);
    res.status(statusCode).json({ message, statusCode });
  }
});

export default uc8Router;
