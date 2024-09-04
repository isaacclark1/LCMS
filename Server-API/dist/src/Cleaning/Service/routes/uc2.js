"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LCMS_Cleaning_1 = __importDefault(require("../../API/LCMS_Cleaning"));
const authenticate_1 = require("../authenticate");
const uc2Router = express_1.default.Router();
uc2Router.get("/:cleaningTaskTemplateListId", authenticate_1.authenticateManagerToken, async (req, res) => {
    const cleaningTaskTemplateListId = parseInt(req.params.cleaningTaskTemplateListId);
    if (isNaN(cleaningTaskTemplateListId))
        return res
            .status(400)
            .json({ message: "cleaningTaskTemplateListId must be an integer", statusCode: 400 });
    try {
        const cleaningTaskTemplateList = await LCMS_Cleaning_1.default.viewCleaningTaskTemplateList(cleaningTaskTemplateListId);
        res.json({ cleaningTaskTemplateList });
    }
    catch (err) {
        console.error(err.statusCode, err.message);
        const { message, statusCode } = err;
        res.status(statusCode).json({ message, statusCode });
    }
});
exports.default = uc2Router;
