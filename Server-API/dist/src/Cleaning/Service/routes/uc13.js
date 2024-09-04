"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LCMS_Cleaning_1 = __importDefault(require("../../API/LCMS_Cleaning"));
const authenticate_1 = require("../authenticate");
const uc13Router = express_1.default.Router();
uc13Router.patch("/", authenticate_1.authenticateManagerToken, async (req, res) => {
    const { cleaningTaskListId, staffMemberId } = req.body;
    try {
        const successMessage = await LCMS_Cleaning_1.default.assignStaffMemberToCleaningTaskList(cleaningTaskListId, staffMemberId);
        res.json({ successMessage });
    }
    catch (error) {
        const { message, statusCode } = error;
        console.error(statusCode, message);
        res.status(statusCode).json({ message, statusCode });
    }
});
exports.default = uc13Router;
