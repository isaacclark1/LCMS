import express, { Request, Response } from "express";
import LCMS_Cleaning from "../../API/LCMS_Cleaning";
import ServerError from "../../../../ServerError";
import { authenticateAllUsersToken } from "../authenticate";

const uc1Router = express.Router();

uc1Router.get(
  "/:cleaningTaskListId",
  authenticateAllUsersToken,
  async (req: Request, res: Response) => {
    const cleaningTaskListId: number = parseInt(req.params.cleaningTaskListId);

    if (isNaN(cleaningTaskListId)) {
      return res
        .status(400)
        .json({ message: "cleaningTaskListId must be an integer", statusCode: 400 });
    }

    try {
      const cleaningTaskList = await LCMS_Cleaning.viewCleaningTaskList(cleaningTaskListId);

      res.json({ cleaningTaskList });
    } catch (err) {
      console.error((err as ServerError).statusCode, (err as ServerError).message);
      const { message, statusCode } = err as ServerError;
      res.status(statusCode).json({ message, statusCode });
    }
  }
);

export default uc1Router;
