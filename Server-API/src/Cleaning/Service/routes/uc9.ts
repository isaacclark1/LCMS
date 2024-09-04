import express, { Request, Response } from "express";
import LCMS_Cleaning from "../../API/LCMS_Cleaning";
import ServerError from "../../../../ServerError";
import { authenticateManagerToken } from "../authenticate";

const uc9Router = express.Router();

uc9Router.post("/", authenticateManagerToken, async (req, res) => {
  const { cleaningTaskTemplateListId, date, staffMemberId } = req.body;

  try {
    const cleaningTaskListId = await LCMS_Cleaning.createCleaningTaskList(
      cleaningTaskTemplateListId,
      new Date(date),
      staffMemberId || undefined
    );

    res.json({ cleaningTaskListId });
  } catch (err) {
    const { message, statusCode } = err as ServerError;
    console.error(statusCode, message);
    res.status(statusCode).json({ message, statusCode });
  }
});

export default uc9Router;
