import express, { Request, Response } from "express";
import LCMS_Cleaning from "../../API/LCMS_Cleaning";
import ServerError from "../../../../ServerError";
import { authenticateAllUsersToken } from "../authenticate";

const uc3Router = express.Router();

uc3Router.patch("/complete", authenticateAllUsersToken, async (req: Request, res: Response) => {
  const { cleaningTaskListId, cleaningTaskId } = req.body;

  if (!cleaningTaskListId || !cleaningTaskId)
    return res
      .status(400)
      .send({ message: "cleaningTaskListId and cleaningTaskId must be provided", statusCode: 400 });

  try {
    const successMessage = await LCMS_Cleaning.markCleaningTaskAsComplete(
      cleaningTaskListId,
      cleaningTaskId
    );

    res.json({ successMessage });
  } catch (err) {
    console.error((err as ServerError).statusCode, (err as ServerError).message);
    const { message, statusCode } = err as ServerError;
    res.status(statusCode).send({ message, statusCode });
  }
});

uc3Router.patch("/incomplete", authenticateAllUsersToken, async (req: Request, res: Response) => {
  const { cleaningTaskListId, cleaningTaskId } = req.body;

  if (!cleaningTaskListId || !cleaningTaskId)
    return res
      .status(400)
      .send({ message: "cleaningTaskListId and cleaningTaskId must be provided", statusCode: 400 });

  try {
    const successMessage = await LCMS_Cleaning.markCleaningTaskAsIncomplete(
      cleaningTaskListId,
      cleaningTaskId
    );

    res.json({ successMessage });
  } catch (err) {
    console.error((err as ServerError).statusCode, (err as ServerError).message);
    const { message, statusCode } = err as ServerError;
    res.status(statusCode).send({ message, statusCode });
  }
});

export default uc3Router;
