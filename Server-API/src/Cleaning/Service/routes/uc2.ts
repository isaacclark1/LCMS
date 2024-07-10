import express, { Request, Response } from "express";
import LCMS_Cleaning from "../../API/LCMS_Cleaning";
import ServerError from "../../../../ServerError";

const uc2Router = express.Router();

uc2Router.get("/:cleaningTaskTemplateListId", async (req: Request, res: Response) => {
  const cleaningTaskTemplateListId = parseInt(req.params.cleaningTaskTemplateListId);

  if (isNaN(cleaningTaskTemplateListId))
    return res
      .status(400)
      .json({ message: "cleaningTaskTemplateListId must be an integer", statusCode: 400 });

  try {
    const cleaningTaskTemplateList = await LCMS_Cleaning.viewCleaningTaskTemplateList(
      cleaningTaskTemplateListId
    );

    res.json(cleaningTaskTemplateList);
  } catch (err) {
    console.error((err as ServerError).statusCode, (err as ServerError).message);
    const { message, statusCode } = err as ServerError;
    res.status(statusCode).json({ message, statusCode });
  }
});

export default uc2Router;
