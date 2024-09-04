"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LCMS_Cleaning_1 = __importDefault(require("../../API/LCMS_Cleaning"));
const authenticate_1 = require("../authenticate");
const uc11Router = express_1.default.Router();
uc11Router.post("/", authenticate_1.authenticateManagerToken, async (req, res) => {
    const { title, cleaningTaskTemplates } = req.body;
    try {
        const cleaningTaskTemplateListId = await LCMS_Cleaning_1.default.createCleaningTaskTemplateList(title, cleaningTaskTemplates);
        res.json({ cleaningTaskTemplateListId });
    }
    catch (err) {
        const { message, statusCode } = err;
        console.error(statusCode, message);
        res.status(statusCode).json({ message, statusCode });
    }
});
exports.default = uc11Router;
