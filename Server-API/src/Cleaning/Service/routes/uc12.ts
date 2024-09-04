import express, { Request, Response } from "express";
import LCMS_Cleaning from "../../API/LCMS_Cleaning";
import ServerError from "../../../../ServerError";
import { authenticateManagerToken } from "../authenticate";

const uc12Router = express.Router();

uc12Router.delete("/:cleaningTaskTemplateListId", authenticateManagerToken, async (req, res) => {
  const cleaningTaskTemplateListId = parseInt(req.params.cleaningTaskTemplateListId);

  try {
    const successMessage = await LCMS_Cleaning.deleteCleaningTaskTemplateList(
      cleaningTaskTemplateListId
    );

    res.json({ successMessage });
  } catch (err) {
    const { message, statusCode } = err as ServerError;
    console.error(statusCode, message);
    res.status(statusCode).json({ message, statusCode });
  }
});

export default uc12Router;
