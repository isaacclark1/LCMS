"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LCMS_Cleaning_1 = __importDefault(require("../../API/LCMS_Cleaning"));
const authenticate_1 = require("../authenticate");
const uc4Router = express_1.default.Router();
uc4Router.patch("/manager", authenticate_1.authenticateManagerToken, async (req, res) => {
    const { cleaningTaskListId, signature } = req.body;
    if (!cleaningTaskListId || !signature)
        res
            .status(400)
            .json({ message: "cleaningTaskListId and signature must be provided", statusCode: 400 });
    try {
        const successMessage = await LCMS_Cleaning_1.default.signOffCleaningTaskListManager(cleaningTaskListId, signature);
        res.json({ successMessage });
    }
    catch (err) {
        console.error(err);
        const { message, statusCode } = err;
        res.status(statusCode).json({ message, statusCode });
    }
});
uc4Router.patch("/staffMember", authenticate_1.authenticateAllUsersToken, async (req, res) => {
    const { cleaningTaskListId, signature } = req.body;
    if (!cleaningTaskListId || !signature)
        res
            .status(400)
            .json({ message: "cleaningTaskListId and signature must be provided", statusCode: 400 });
    try {
        const successMessage = await LCMS_Cleaning_1.default.signOffCleaningTaskListStaffMember(cleaningTaskListId, signature);
        res.json({ successMessage });
    }
    catch (err) {
        console.error(err.statusCode, err.message);
        const { message, statusCode } = err;
        res.status(statusCode).json({ message, statusCode });
    }
});
exports.default = uc4Router;
