import express, { Request, Response } from "express";
import ServerError from "../../../../ServerError";

import LCMS_Cleaning from "../../API/LCMS_Cleaning";

const uiRouter = express.Router();

uiRouter.get("/cleaningTaskTemplateLists", async (req: Request, res: Response) => {
  try {
    const cleaningTaskTemplateLists = await LCMS_Cleaning.getCleaningTaskTemplateLists();

    res.json({ cleaningTaskTemplateLists });
  } catch (err) {
    const { message, statusCode } = err as ServerError;
    console.error(statusCode, message);
    res.status(statusCode).json({ message, statusCode });
  }
});

uiRouter.get("/cleaningTaskTemplates", async (req, res) => {
  try {
    const cleaningTaskTemplates = await LCMS_Cleaning.getCleaningTaskTemplates();

    res.json({ cleaningTaskTemplates });
  } catch (err) {
    const { message, statusCode } = err as ServerError;
    console.error(statusCode, message);
    res.status(statusCode).json({ message, statusCode });
  }
});

uiRouter.get("/areas", async (req, res) => {
  try {
    const areas = await LCMS_Cleaning.getAreas();

    res.json({ areas });
  } catch (err) {
    const { message, statusCode } = err as ServerError;
    console.error(statusCode, message);
    res.status(statusCode).json({ message, statusCode });
  }
});

uiRouter.get("/cleaningTaskLists", async (req, res) => {
  try {
    const cleaningTaskLists = await LCMS_Cleaning.getCleaningTaskLists();

    res.json({ cleaningTaskLists });
  } catch (err) {
    const { message, statusCode } = err as ServerError;
    console.error(statusCode, message);
    res.status(statusCode).json({ message, statusCode });
  }
});

export default uiRouter;
