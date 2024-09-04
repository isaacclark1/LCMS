"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LCMS_Cleaning_1 = __importDefault(require("../../API/LCMS_Cleaning"));
const authenticate_1 = require("../authenticate");
const uiRouter = express_1.default.Router();
uiRouter.get("/cleaningTaskTemplateLists", authenticate_1.authenticateManagerToken, async (req, res) => {
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
uiRouter.get("/cleaningTaskTemplates/:cleaningTaskTemplateListId", authenticate_1.authenticateManagerToken, async (req, res) => {
    const cleaningTaskTemplateListId = parseInt(req.params.cleaningTaskTemplateListId);
    try {
        const cleaningTaskTemplates = await LCMS_Cleaning_1.default.getCleaningTaskTemplatesFromCleaningTaskTemplateList(cleaningTaskTemplateListId);
        res.json({ cleaningTaskTemplates });
    }
    catch (error) {
        const { message, statusCode } = error;
        console.error(statusCode, message);
        res.status(statusCode).json({ message, statusCode });
    }
});
uiRouter.get("/cleaningTaskTemplates", authenticate_1.authenticateManagerToken, async (req, res) => {
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
uiRouter.get("/areas", authenticate_1.authenticateManagerToken, async (req, res) => {
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
uiRouter.get("/cleaningTaskLists", authenticate_1.authenticateAllUsersToken, async (req, res) => {
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
uiRouter.get("/cleaningTasks/:cleaningTaskListId", authenticate_1.authenticateAllUsersToken, async (req, res) => {
    const cleaningTaskListId = parseInt(req.params.cleaningTaskListId);
    try {
        const cleaningTasks = await LCMS_Cleaning_1.default.getCleaningTasks(cleaningTaskListId);
        res.json({ cleaningTasks });
    }
    catch (error) {
        const { message, statusCode } = error;
        console.error(statusCode, message);
        res.status(statusCode).json({ message, statusCode });
    }
});
uiRouter.get("/staffMembers", authenticate_1.authenticateAllUsersToken, async (req, res) => {
    try {
        const staffMembers = await LCMS_Cleaning_1.default.getStaffMembers();
        res.json({ staffMembers });
    }
    catch (error) {
        const { message, statusCode } = error;
        console.error(statusCode, message);
        res.status(statusCode).json({ message, statusCode });
    }
});
exports.default = uiRouter;
