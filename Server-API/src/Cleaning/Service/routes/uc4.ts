import express, { Request, Response } from "express";
import LCMS_Cleaning from "../../API/LCMS_Cleaning";
import ServerError from "../../../../ServerError";
import { authenticateAllUsersToken, authenticateManagerToken } from "../authenticate";

const uc4Router = express.Router();

uc4Router.patch("/manager", authenticateManagerToken, async (req: Request, res: Response) => {
  const { cleaningTaskListId, signature } = req.body;

  if (!cleaningTaskListId || !signature)
    res
      .status(400)
      .json({ message: "cleaningTaskListId and signature must be provided", statusCode: 400 });

  try {
    const successMessage = await LCMS_Cleaning.signOffCleaningTaskListManager(
      cleaningTaskListId,
      signature
    );

    res.json({ successMessage });
  } catch (err) {
    console.error(err);
    const { message, statusCode } = err as ServerError;
    res.status(statusCode).json({ message, statusCode });
  }
});

uc4Router.patch("/staffMember", authenticateAllUsersToken, async (req: Request, res: Response) => {
  const { cleaningTaskListId, signature } = req.body;

  if (!cleaningTaskListId || !signature)
    res
      .status(400)
      .json({ message: "cleaningTaskListId and signature must be provided", statusCode: 400 });

  try {
    const successMessage = await LCMS_Cleaning.signOffCleaningTaskListStaffMember(
      cleaningTaskListId,
      signature
    );

    res.json({ successMessage });
  } catch (err) {
    console.error((err as ServerError).statusCode, (err as ServerError).message);
    const { message, statusCode } = err as ServerError;
    res.status(statusCode).json({ message, statusCode });
  }
});

export default uc4Router;
