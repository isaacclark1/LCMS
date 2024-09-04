"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LCMS_Cleaning_1 = __importDefault(require("../../API/LCMS_Cleaning"));
const authenticate_1 = require("../authenticate");
const uc1Router = express_1.default.Router();
uc1Router.get("/:cleaningTaskListId", authenticate_1.authenticateAllUsersToken, async (req, res) => {
    const cleaningTaskListId = parseInt(req.params.cleaningTaskListId);
    if (isNaN(cleaningTaskListId)) {
        return res
            .status(400)
            .json({ message: "cleaningTaskListId must be an integer", statusCode: 400 });
    }
    try {
        const cleaningTaskList = await LCMS_Cleaning_1.default.viewCleaningTaskList(cleaningTaskListId);
        res.json({ cleaningTaskList });
    }
    catch (err) {
        console.error(err.statusCode, err.message);
        const { message, statusCode } = err;
        res.status(statusCode).json({ message, statusCode });
    }
});
exports.default = uc1Router;
