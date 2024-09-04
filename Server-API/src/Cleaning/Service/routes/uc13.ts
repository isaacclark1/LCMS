import express, { Request, Response } from "express";
import LCMS_Cleaning from "../../API/LCMS_Cleaning";
import ServerError from "../../../../ServerError";
import { authenticateManagerToken } from "../authenticate";

const uc13Router = express.Router();

uc13Router.patch("/", authenticateManagerToken, async (req, res) => {
  const { cleaningTaskListId, staffMemberId } = req.body;

  try {
    const successMessage = await LCMS_Cleaning.assignStaffMemberToCleaningTaskList(
      cleaningTaskListId,
      staffMemberId
    );

    res.json({ successMessage });
  } catch (error) {
    const { message, statusCode } = error as ServerError;
    console.error(statusCode, message);
    res.status(statusCode).json({ message, statusCode });
  }
});

export default uc13Router;
