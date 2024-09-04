import express, { Request, Response } from "express";
import LCMS_Cleaning from "../../API/LCMS_Cleaning";
import ServerError from "../../../../ServerError";
import { authenticateManagerToken } from "../authenticate";

const uc10Router = express.Router();

uc10Router.delete("/:cleaningTaskListId", authenticateManagerToken, async (req, res) => {
  const cleaningTaskListId = parseInt(req.params.cleaningTaskListId);

  try {
    const successMessage = await LCMS_Cleaning.deleteCleaningTaskList(cleaningTaskListId);

    res.json({ successMessage });
  } catch (err) {
    const { message, statusCode } = err as ServerError;
    console.error(statusCode, message);
    res.status(statusCode).json({ message, statusCode });
  }
});

export default uc10Router;
