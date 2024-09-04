import express, { Request, Response } from "express";
import LCMS_Cleaning from "../../API/LCMS_Cleaning";
import ServerError from "../../../../ServerError";
import { authenticateManagerToken } from "../authenticate";

const uc6Router = express.Router();

uc6Router.delete("/:cleaningTaskId", authenticateManagerToken, async (req, res) => {
  const cleaningTaskId = parseInt(req.params.cleaningTaskId);

  try {
    const successMessage = await LCMS_Cleaning.removeCleaningTaskFromCleaningTaskList(
      cleaningTaskId
    );

    res.json({ successMessage });
  } catch (err) {
    const { message, statusCode } = err as ServerError;
    console.error(statusCode, message);
    res.status(statusCode).json({ message, statusCode });
  }
});

export default uc6Router;
