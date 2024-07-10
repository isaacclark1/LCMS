"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LCMS_Cleaning_1 = __importDefault(require("../../API/LCMS_Cleaning"));
const uc11Router = express_1.default.Router();
uc11Router.post("/", async (req, res) => {
    const { title } = req.body;
    try {
        const cleaningTaskTemplateListId = await LCMS_Cleaning_1.default.createCleaningTaskTemplateList(title);
        res.json({ cleaningTaskTemplateListId });
    }
    catch (err) {
        const { message, statusCode } = err;
        console.error(statusCode, message);
        res.status(statusCode).json({ message, statusCode });
    }
});
exports.default = uc11Router;
