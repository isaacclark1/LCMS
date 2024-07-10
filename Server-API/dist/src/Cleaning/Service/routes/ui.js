"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LCMS_Cleaning_1 = __importDefault(require("../../API/LCMS_Cleaning"));
const uiRouter = express_1.default.Router();
uiRouter.get("/cleaningTaskTemplateLists", async (req, res) => {
    try {
        const cleaningTaskTemplateLists = await LCMS_Cleaning_1.default.getCleaningTaskTemplateLists();
        res.json({ cleaningTaskTemplateLists });
    }
    catch (err) {
        const { message, statusCode } = err;
        console.error(statusCode, message);
        res.status(statusCode).json({ message, statusCode });
    }
});
uiRouter.get("/cleaningTaskTemplates", async (req, res) => {
    try {
        const cleaningTaskTemplates = await LCMS_Cleaning_1.default.getCleaningTaskTemplates();
        res.json({ cleaningTaskTemplates });
    }
    catch (err) {
        const { message, statusCode } = err;
        console.error(statusCode, message);
        res.status(statusCode).json({ message, statusCode });
    }
});
uiRouter.get("/areas", async (req, res) => {
    try {
        const areas = await LCMS_Cleaning_1.default.getAreas();
        res.json({ areas });
    }
    catch (err) {
        const { message, statusCode } = err;
        console.error(statusCode, message);
        res.status(statusCode).json({ message, statusCode });
    }
});
uiRouter.get("/cleaningTaskLists", async (req, res) => {
    try {
        const cleaningTaskLists = await LCMS_Cleaning_1.default.getCleaningTaskLists();
        res.json({ cleaningTaskLists });
    }
    catch (err) {
        const { message, statusCode } = err;
        console.error(statusCode, message);
        res.status(statusCode).json({ message, statusCode });
    }
});
exports.default = uiRouter;
