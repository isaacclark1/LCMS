import express, { Request, Response } from "express";
import ServerError from "../../../../ServerError";

import LCMS_Cleaning from "../../API/LCMS_Cleaning";
import { authenticateAllUsersToken, authenticateManagerToken } from "../authenticate";

const uiRouter = express.Router();

uiRouter.get(
  "/cleaningTaskTemplateLists",
  authenticateManagerToken,
  async (req: Request, res: Response) => {
    try {
      const cleaningTaskTemplateLists = await LCMS_Cleaning.getCleaningTaskTemplateLists();

      res.json({ cleaningTaskTemplateLists });
    } catch (err) {
      const { message, statusCode } = err as ServerError;
      console.error(statusCode, message);
      res.status(statusCode).json({ message, statusCode });
    }
  }
);

uiRouter.get(
  "/cleaningTaskTemplates/:cleaningTaskTemplateListId",
  authenticateManagerToken,
  async (req, res) => {
    const cleaningTaskTemplateListId = parseInt(req.params.cleaningTaskTemplateListId);

    try {
      const cleaningTaskTemplates =
        await LCMS_Cleaning.getCleaningTaskTemplatesFromCleaningTaskTemplateList(
          cleaningTaskTemplateListId
        );

      res.json({ cleaningTaskTemplates });
    } catch (error) {
      const { message, statusCode } = error as ServerError;
      console.error(statusCode, message);
      res.status(statusCode).json({ message, statusCode });
    }
  }
);

uiRouter.get("/cleaningTaskTemplates", authenticateManagerToken, async (req, res) => {
  try {
    const cleaningTaskTemplates = await LCMS_Cleaning.getCleaningTaskTemplates();

    res.json({ cleaningTaskTemplates });
  } catch (err) {
    const { message, statusCode } = err as ServerError;
    console.error(statusCode, message);
    res.status(statusCode).json({ message, statusCode });
  }
});

uiRouter.get("/areas", authenticateManagerToken, async (req, res) => {
  try {
    const areas = await LCMS_Cleaning.getAreas();

    res.json({ areas });
  } catch (err) {
    const { message, statusCode } = err as ServerError;
    console.error(statusCode, message);
    res.status(statusCode).json({ message, statusCode });
  }
});

uiRouter.get("/cleaningTaskLists", authenticateAllUsersToken, async (req, res) => {
  try {
    const cleaningTaskLists = await LCMS_Cleaning.getCleaningTaskLists();

    res.json({ cleaningTaskLists });
  } catch (err) {
    const { message, statusCode } = err as ServerError;
    console.error(statusCode, message);
    res.status(statusCode).json({ message, statusCode });
  }
});

uiRouter.get("/cleaningTasks/:cleaningTaskListId", authenticateAllUsersToken, async (req, res) => {
  const cleaningTaskListId = parseInt(req.params.cleaningTaskListId);

  try {
    const cleaningTasks = await LCMS_Cleaning.getCleaningTasks(cleaningTaskListId);

    res.json({ cleaningTasks });
  } catch (error) {
    const { message, statusCode } = error as ServerError;
    console.error(statusCode, message);
    res.status(statusCode).json({ message, statusCode });
  }
});

uiRouter.get("/staffMembers", authenticateAllUsersToken, async (req, res) => {
  try {
    const staffMembers = await LCMS_Cleaning.getStaffMembers();

    res.json({ staffMembers });
  } catch (error) {
    const { message, statusCode } = error as ServerError;
    console.error(statusCode, message);
    res.status(statusCode).json({ message, statusCode });
  }
});

export default uiRouter;
