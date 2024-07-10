"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LCMS_Cleaning_1 = __importDefault(require("../../API/LCMS_Cleaning"));
const uc7Router = express_1.default.Router();
uc7Router.delete("/", async (req, res) => {
    const { cleaningTaskTemplateListId, cleaningTaskTemplateId } = req.body;
    try {
        const successMessage = await LCMS_Cleaning_1.default.removeCleaningTaskTemplateFromCleaningTaskTemplateList(cleaningTaskTemplateListId, cleaningTaskTemplateId);
        res.json({ successMessage });
    }
    catch (err) {
        const { message, statusCode } = err;
        console.error(statusCode, message);
        res.status(statusCode).json({ message, statusCode });
    }
});
exports.default = uc7Router;
