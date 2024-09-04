"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ServerError_1 = __importDefault(require("../../../ServerError"));
const dbconnection_1 = require("../db/dbconnection");
/**
 * Represents a cleaning task template.
 *
 * @author Isaac Clark
 * @version 1
 */
class CleaningTaskTemplate {
    constructor() { }
    /**
     * Returns a description of a cleaning task.
     *
     * @param cleaningTaskTemplateId The cleaning task identifier
     * @returns the description of the cleaning task
     * @throws a ServerError if cleaningTaskId is invalid or the query fails.
     */
    static async getDescription(cleaningTaskTemplateId) {
        if (typeof cleaningTaskTemplateId !== "number" || !Number.isInteger(cleaningTaskTemplateId))
            throw new ServerError_1.default("cleaningTaskTemplateId must be an integer", 400);
        try {
            const queryResult = await (0, dbconnection_1.query)(`
        SELECT _description FROM CleaningTaskTemplate
        WHERE cleaningTaskTemplateId = $1;
        `, [cleaningTaskTemplateId]);
            return queryResult.rows[0]._description;
        }
        catch (err) {
            throw new ServerError_1.default("An error occurred when retrieving the cleaning task template description. Check that cleaningTaskTemplateId is valid", 500);
        }
    }
    /**
     * Returns the Area linked to a cleaning task template.
     *
     * @param cleaningTaskTemplateId The ID of the cleaning task template.
     * @returns the id of the Area linked to the cleaning task template.
     * @throws a ServerError if cleaningTaskTemplateId is not valid or the database query fails.
     */
    static async getArea(cleaningTaskTemplateId) {
        if (typeof cleaningTaskTemplateId !== "number" || !Number.isInteger(cleaningTaskTemplateId))
            throw new ServerError_1.default("cleaningTaskTemplateId must be an integer", 400);
        try {
            const queryResult = await (0, dbconnection_1.query)(`
        SELECT areaId FROM CleaningTaskTemplate
        WHERE cleaningTaskTemplateId = $1;
        `, [cleaningTaskTemplateId]);
            return queryResult.rows[0].areaid;
        }
        catch (err) {
            throw new ServerError_1.default("An error occurred while retrieving the areaId from the cleaning task template. Check that cleaningTaskTemplateId is valid", 500);
        }
    }
}
exports.default = CleaningTaskTemplate;
