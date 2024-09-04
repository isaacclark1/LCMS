"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LCMS_Cleaning_1 = __importDefault(require("../../API/LCMS_Cleaning"));
const authenticate_1 = require("../authenticate");
const uc8Router = express_1.default.Router();
uc8Router.post("/", authenticate_1.authenticateManagerToken, async (req, res) => {
    const { cleaningTaskTemplateListId, cleaningTaskTemplateId, cleaningTaskTemplateDescription, areaId, areaDescription, } = req.body;
    try {
        const response = await LCMS_Cleaning_1.default.addCleaningTaskTemplateToCleaningTaskTemplateList(cleaningTaskTemplateListId, cleaningTaskTemplateId || undefined, cleaningTaskTemplateDescription || undefined, areaId || undefined, areaDescription || undefined);
        res.json({ response });
    }
    catch (err) {
        const { message, statusCode } = err;
        console.error(statusCode, message);
        res.status(statusCode).json({ message, statusCode });
    }
});
exports.default = uc8Router;
