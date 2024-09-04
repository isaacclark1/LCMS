"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ServerError_1 = __importDefault(require("../../../ServerError"));
const dbconnection_1 = require("../db/dbconnection");
/**
 * Represents a cleaning task.
 *
 * @author Isaac Clark
 * @version 1
 */
class CleaningTask {
    constructor() { }
    /**
     * Sets the completed attribute of a cleaning task to the value of flag.
     *
     * @param cleaningTaskId The id of the cleaning task to modify
     * @param flag The boolean value to assign to the cleaning task's completed attribute
     * @returns
     * - A string indicating success if the query runs successfully; otherwise, a server error.
     */
    static async setCompleted(cleaningTaskId, flag) {
        if (typeof cleaningTaskId !== "number")
            throw new ServerError_1.default("cleaningTaskId must be a number", 400);
        if (typeof flag !== "boolean")
            throw new ServerError_1.default("flag must be a boolean", 400);
        try {
            await (0, dbconnection_1.query)("UPDATE CleaningTask SET completed = $1 WHERE cleaningtaskid = $2;", [
                flag,
                cleaningTaskId,
            ]);
            return "update successful";
        }
        catch (err) {
            throw new ServerError_1.default("An error occurred. Check that cleaningTaskId is a valid cleaning task identifier", 500);
        }
    }
    /**
     * Deletes a cleaning task from the database.
     *
     * @param cleaningTaskId The id of the cleaning task to delete.
     * @returns a success message if the operation is successful.
     * @throws a ServerError if the operation fails or cleaningTaskId is not an integer.
     */
    static async delete(cleaningTaskId) {
        if (!Number.isInteger(cleaningTaskId))
            throw new ServerError_1.default("cleaningTaskId must be an integer", 400);
        try {
            const queryResult = await (0, dbconnection_1.query)(`
        DELETE FROM CleaningTask
        WHERE cleaningTaskId = $1;
        `, [cleaningTaskId]);
            if (queryResult.rowCount === 0)
                throw new ServerError_1.default("The cleaning task does not exist", 404);
            return "deletion successful";
        }
        catch (err) {
            if (err instanceof ServerError_1.default)
                throw err;
            throw new ServerError_1.default("An error occurred while deleting the cleaning task", 500);
        }
    }
}
exports.default = CleaningTask;
