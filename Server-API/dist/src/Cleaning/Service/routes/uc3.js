"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LCMS_Cleaning_1 = __importDefault(require("../../API/LCMS_Cleaning"));
const authenticate_1 = require("../authenticate");
const uc3Router = express_1.default.Router();
uc3Router.patch("/complete", authenticate_1.authenticateAllUsersToken, async (req, res) => {
    const { cleaningTaskListId, cleaningTaskId } = req.body;
    if (!cleaningTaskListId || !cleaningTaskId)
        return res
            .status(400)
            .send({ message: "cleaningTaskListId and cleaningTaskId must be provided", statusCode: 400 });
    try {
        const successMessage = await LCMS_Cleaning_1.default.markCleaningTaskAsComplete(cleaningTaskListId, cleaningTaskId);
        res.json({ successMessage });
    }
    catch (err) {
        console.error(err.statusCode, err.message);
        const { message, statusCode } = err;
        res.status(statusCode).send({ message, statusCode });
    }
});
uc3Router.patch("/incomplete", authenticate_1.authenticateAllUsersToken, async (req, res) => {
    const { cleaningTaskListId, cleaningTaskId } = req.body;
    if (!cleaningTaskListId || !cleaningTaskId)
        return res
            .status(400)
            .send({ message: "cleaningTaskListId and cleaningTaskId must be provided", statusCode: 400 });
    try {
        const successMessage = await LCMS_Cleaning_1.default.markCleaningTaskAsIncomplete(cleaningTaskListId, cleaningTaskId);
        res.json({ successMessage });
    }
    catch (err) {
        console.error(err.statusCode, err.message);
        const { message, statusCode } = err;
        res.status(statusCode).send({ message, statusCode });
    }
});
exports.default = uc3Router;
