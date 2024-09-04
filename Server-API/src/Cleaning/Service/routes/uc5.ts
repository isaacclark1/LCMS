import express, { Request, Response } from "express";
import LCMS_Cleaning from "../../API/LCMS_Cleaning";
import ServerError from "../../../../ServerError";
import { authenticateManagerToken } from "../authenticate";

const uc5Router = express.Router();

uc5Router.post("/", authenticateManagerToken, async (req, res) => {
  const {
    cleaningTaskListId,
    cleaningTaskTemplateId,
    cleaningTaskDescription,
    areaDescription,
    areaId,
  } = req.body;

  try {
    const cleaningTaskId = await LCMS_Cleaning.addCleaningTaskToCleaningTaskList(
      cleaningTaskListId,
      cleaningTaskTemplateId || undefined,
      cleaningTaskDescription || undefined,
      areaDescription || undefined,
      areaId || undefined
    );

    res.json({ cleaningTaskId });
  } catch (err) {
    const { message, statusCode } = err as ServerError;
    console.error(statusCode, message);
    res.status(statusCode).json({ message, statusCode });
  }
});

export default uc5Router;
