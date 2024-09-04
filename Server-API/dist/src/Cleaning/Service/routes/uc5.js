"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LCMS_Cleaning_1 = __importDefault(require("../../API/LCMS_Cleaning"));
const authenticate_1 = require("../authenticate");
const uc5Router = express_1.default.Router();
uc5Router.post("/", authenticate_1.authenticateManagerToken, async (req, res) => {
    const { cleaningTaskListId, cleaningTaskTemplateId, cleaningTaskDescription, areaDescription, areaId, } = req.body;
    try {
        const cleaningTaskId = await LCMS_Cleaning_1.default.addCleaningTaskToCleaningTaskList(cleaningTaskListId, cleaningTaskTemplateId || undefined, cleaningTaskDescription || undefined, areaDescription || undefined, areaId || undefined);
        res.json({ cleaningTaskId });
    }
    catch (err) {
        const { message, statusCode } = err;
        console.error(statusCode, message);
        res.status(statusCode).json({ message, statusCode });
    }
});
exports.default = uc5Router;
