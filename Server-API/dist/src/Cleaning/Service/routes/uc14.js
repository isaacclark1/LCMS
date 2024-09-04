"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LCMS_Cleaning_1 = __importDefault(require("../../API/LCMS_Cleaning"));
const authenticate_1 = require("../authenticate");
const uc14Router = express_1.default.Router();
uc14Router.post("/", authenticate_1.authenticateManagerToken, async (req, res) => {
    const { cleaningTaskTemplateDescription, areaId, areaDescription } = req.body;
    try {
        const cleaningTaskTemplateId = await LCMS_Cleaning_1.default.createCleaningTaskTemplate(cleaningTaskTemplateDescription, areaId || undefined, areaDescription || undefined);
        res.json({ cleaningTaskTemplateId });
    }
    catch (error) {
        const { message, statusCode } = error;
        console.error(statusCode, message);
        res.status(statusCode).json({ message, statusCode });
    }
});
exports.default = uc14Router;
