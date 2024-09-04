import express, { Request, Response } from "express";
import LCMS_Cleaning from "../../API/LCMS_Cleaning";
import ServerError from "../../../../ServerError";
import { authenticateManagerToken } from "../authenticate";

const uc7Router = express.Router();

uc7Router.delete(
  "/:cleaningTaskTemplateListId/:cleaningTaskTemplateId",
  authenticateManagerToken,
  async (req, res) => {
    const { cleaningTaskTemplateListId, cleaningTaskTemplateId } = req.params;

    try {
      const successMessage =
        await LCMS_Cleaning.removeCleaningTaskTemplateFromCleaningTaskTemplateList(
          parseInt(cleaningTaskTemplateListId),
          parseInt(cleaningTaskTemplateId)
        );

      res.json({ successMessage });
    } catch (err) {
      const { message, statusCode } = err as ServerError;
      console.error(statusCode, message);
      res.status(statusCode).json({ message, statusCode });
    }
  }
);

export default uc7Router;
