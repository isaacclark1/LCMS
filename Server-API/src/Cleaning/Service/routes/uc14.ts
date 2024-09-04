import express from "express";
import LCMS_Cleaning from "../../API/LCMS_Cleaning";
import ServerError from "../../../../ServerError";
import { authenticateManagerToken } from "../authenticate";

const uc14Router = express.Router();

uc14Router.post("/", authenticateManagerToken, async (req, res) => {
  const { cleaningTaskTemplateDescription, areaId, areaDescription } = req.body;

  try {
    const cleaningTaskTemplateId = await LCMS_Cleaning.createCleaningTaskTemplate(
      cleaningTaskTemplateDescription,
      areaId || undefined,
      areaDescription || undefined
    );

    res.json({ cleaningTaskTemplateId });
  } catch (error) {
    const { message, statusCode } = error as ServerError;
    console.error(statusCode, message);
    res.status(statusCode).json({ message, statusCode });
  }
});

export default uc14Router;
