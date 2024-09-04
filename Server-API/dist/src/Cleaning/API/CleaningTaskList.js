"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ServerError_1 = __importDefault(require("../../../ServerError"));
const dbconnection_1 = require("../db/dbconnection");
const CleaningTask_1 = __importDefault(require("./CleaningTask"));
const CleaningTaskTemplate_1 = __importDefault(require("./CleaningTaskTemplate"));
const CleaningTaskTemplateList_1 = __importDefault(require("./CleaningTaskTemplateList"));
/**
 * Represents a list of cleaning tasks.
 *
 * In project documentation this class was called CleaningTasks.
 *
 * @author Isaac Clark
 * @version 1
 */
class CleaningTaskList {
    constructor() { }
    /**
     * Creates a new cleaning task list, using a cleaning task template list as a template.
     *
     * @param cleaningTaskTemplateListId The id of the cleaning task template list to use as a template.
     * @param date The date to assign to the new cleaning task list.
     * @param staffMemberId The staff member to assign to the new cleaning task list.
     * @returns The id of the new cleaning task list.
     * @throws A ServerError if arguments supplied are not valid or a query/transaction fails.
     */
    static async new(cleaningTaskTemplateListId, date, staffMemberId) {
        if (!Number.isInteger(cleaningTaskTemplateListId))
            throw new ServerError_1.default("cleaningTaskTemplateListId must be an integer", 400);
        if (!(date instanceof Date) || isNaN(date.getTime()))
            throw new ServerError_1.default("date must be a valid Date", 400);
        const createMidnightDate = (year, month, day) => new Date(year, month, day, 0, 0, 0, 0);
        const today = new Date();
        const midnightToday = createMidnightDate(today.getFullYear(), today.getMonth(), today.getDate());
        if (date < midnightToday)
            throw new ServerError_1.default("date cannot be in the past", 400);
        if (!Number.isInteger(staffMemberId) && typeof staffMemberId !== "undefined")
            throw new ServerError_1.default("staffMemberId must be an integer or undefined", 400);
        const queryResult = await (0, dbconnection_1.query)(`
      SELECT * FROM CleaningTaskTemplateList
      WHERE cleaningtasktemplatelistid = $1;
      `, [cleaningTaskTemplateListId]);
        if (queryResult.rowCount === 0)
            throw new ServerError_1.default("The cleaning task template list doesn't exist", 404);
        try {
            return await (0, dbconnection_1.executeTransaction)(async (client) => {
                // create new cleaning task list
                const cleaningTaskListResult = await client.query(`
          INSERT INTO CleaningTaskList (_date, managerSignature, staffMemberSignature, staffMemberId)
          VALUES ($1, NULL, NULL, $2)
          RETURNING cleaningTaskListId;
          `, [date, staffMemberId]);
                const cleaningTaskListId = cleaningTaskListResult.rows[0].cleaningtasklistid;
                let cleaningTaskTemplates = [];
                try {
                    cleaningTaskTemplates = await CleaningTaskTemplateList_1.default.getCleaningTaskTemplates(cleaningTaskTemplateListId);
                }
                catch (err) {
                    if (err instanceof ServerError_1.default && err.statusCode === 404)
                        cleaningTaskTemplates = [];
                    else
                        throw err;
                }
                // Create new cleaning tasks and link them to the cleaning task list.
                for (const cleaningTaskTemplateId of cleaningTaskTemplates) {
                    // get description and areaid from the cleaning task template.
                    const description = await CleaningTaskTemplate_1.default.getDescription(cleaningTaskTemplateId);
                    const areaId = await CleaningTaskTemplate_1.default.getArea(cleaningTaskTemplateId);
                    await client.query(`
            INSERT INTO CleaningTask (_description, completed, cleaningTaskListId, areaId)
            VALUES ($1, FALSE, $2, $3)
            `, [description, cleaningTaskListId, areaId]);
                }
                return cleaningTaskListId;
            });
        }
        catch (err) {
            if (err instanceof ServerError_1.default)
                throw err;
            throw new ServerError_1.default("An error occurred while creating the new cleaning task list", 500);
        }
    }
    /**
     * Returns the cleaning task list with the specified ID.
     *
     * @param cleaningTaskListId The ID of the cleaning task list to retrieve from the database.
     *
     * @returns
     * - If the cleaning task list with the id cleaningTaskListId exists:
     *  - Return the cleaning task list with the id cleaningTaskListId.
     * - Otherwise:
     *  - Return an error.
     */
    static async getView(cleaningTaskListId) {
        if (typeof cleaningTaskListId !== "number")
            throw new ServerError_1.default("cleaningTaskListId must be a number", 400);
        try {
            const cleaningTaskList = await (0, dbconnection_1.query)("SELECT * FROM CleaningTaskList WHERE cleaningTaskListId = $1;", [cleaningTaskListId]);
            if (cleaningTaskList.rowCount === 0)
                throw new ServerError_1.default("The cleaning task list was not found", 404);
            else
                return cleaningTaskList.rows[0];
        }
        catch (err) {
            if (err instanceof ServerError_1.default)
                throw err;
            throw new ServerError_1.default("An error occurred while retrieving the cleaning task list", 500);
        }
    }
    /**
     * Creates a new cleaning task and links it to a cleaning task list.
     *
     * @param cleaningTaskListId The id of the cleaning task list to add the new cleaning task to.
     * @param cleaningTaskTemplateId The id of the cleaning task template to use as a template for the new cleaning task
     * @param cleaningTaskDescription The description of the new cleaning task.
     * @param areaDescription The description of the new area.
     * @param areaId The id of the area to link to the new cleaning task.
     * @returns  The id of the new cleaning task.
     * @throws A ServerError if invalid arguments are supplied or the database queries fail.
     */
    static async createCleaningTask(cleaningTaskListId, cleaningTaskTemplateId, cleaningTaskDescription, areaDescription, areaId) {
        if (typeof cleaningTaskListId !== "number" || !Number.isInteger(cleaningTaskListId))
            throw new ServerError_1.default("cleaningTaskListId must be an integer", 400);
        // cleaning task template and area exist
        if (cleaningTaskListId !== undefined &&
            cleaningTaskTemplateId !== undefined &&
            cleaningTaskDescription === undefined &&
            areaDescription === undefined &&
            areaId === undefined) {
            if (typeof cleaningTaskTemplateId !== "number" || !Number.isInteger(cleaningTaskTemplateId))
                throw new ServerError_1.default("cleaningTaskTemplateId must be an integer", 400);
            try {
                // get the area and description from the cleaning task template.
                const description = await CleaningTaskTemplate_1.default.getDescription(cleaningTaskTemplateId);
                const area_id = await CleaningTaskTemplate_1.default.getArea(cleaningTaskTemplateId);
                // create the new cleaning task
                const queryResult = await (0, dbconnection_1.query)(`
          INSERT INTO CleaningTask (_description, completed, cleaningTaskListId, areaId)
          VALUES ($1, FALSE, $2, $3)
          RETURNING cleaningTaskId;
          `, [description, cleaningTaskListId, area_id]);
                return queryResult.rows[0].cleaningtaskid;
            }
            catch (err) {
                if (err instanceof ServerError_1.default)
                    throw err;
                throw new ServerError_1.default("An error occurred while creating the new cleaning task", 500);
            }
        }
        // cleaning task template doesn't exist; area does
        if (cleaningTaskListId !== undefined &&
            cleaningTaskTemplateId === undefined &&
            cleaningTaskDescription !== undefined &&
            areaDescription === undefined &&
            areaId !== undefined) {
            if (typeof cleaningTaskDescription !== "string" || cleaningTaskDescription.length === 0)
                throw new ServerError_1.default("cleaningTaskDescription must be a non-empty string", 400);
            if (typeof areaId !== "number" || !Number.isInteger(areaId))
                throw new ServerError_1.default("areaId must be an integer", 400);
            try {
                const queryResult = await (0, dbconnection_1.query)(`
          INSERT INTO CleaningTask (_description, completed, cleaningTaskListId, areaId)
          VALUES ($1, FALSE, $2, $3)
          RETURNING cleaningTaskId;
          `, [cleaningTaskDescription, cleaningTaskListId, areaId]);
                return queryResult.rows[0].cleaningtaskid;
            }
            catch (err) {
                throw new ServerError_1.default("An error occurred while creating the new cleaning task", 500);
            }
        }
        // cleaning task template and area don't exist
        if (cleaningTaskListId !== undefined &&
            cleaningTaskTemplateId === undefined &&
            cleaningTaskDescription !== undefined &&
            areaDescription !== undefined &&
            areaId === undefined) {
            if (typeof cleaningTaskDescription !== "string" || cleaningTaskDescription.length === 0)
                throw new ServerError_1.default("cleaningTaskDescription must be a non-empty string", 400);
            if (typeof areaDescription !== "string" || areaDescription.length === 0)
                throw new ServerError_1.default("areaDescription must be a non-empty string", 400);
            try {
                return await (0, dbconnection_1.executeTransaction)(async (client) => {
                    // first query - create the Area.
                    const areaResult = await client.query(`
            INSERT INTO Area (_description)
            VALUES ($1)
            RETURNING areaId;
            `, [areaDescription]);
                    // get the areaId
                    const area_id = areaResult.rows[0].areaid;
                    // second query - create the CleaningTask
                    const cleaningTaskResult = await client.query(`
            INSERT INTO CleaningTask (_description, completed, cleaningTaskListId, areaId)
            VALUES ($1, FALSE, $2, $3)
            RETURNING CleaningTaskId;
            `, [cleaningTaskDescription, cleaningTaskListId, area_id]);
                    // get the cleaning task id.
                    const cleaningTaskId = cleaningTaskResult.rows[0].cleaningtaskid;
                    return cleaningTaskId;
                });
            }
            catch (err) {
                throw new ServerError_1.default("an error occurred while creating the new cleaning task", 500);
            }
        }
        throw new ServerError_1.default("invalid parameters supplied for creating a cleaning task", 400);
    }
    /**
     * Sets a cleaning task's completed attribute to true.
     *
     * @param cleaningTaskId The id of the cleaning task attribute to mark as complete
     * @returns A string indicating success if the update is successfull; otherwise, a server error.
     */
    static async markCleaningTaskAsComplete(cleaningTaskId) {
        if (typeof cleaningTaskId !== "number")
            throw new ServerError_1.default("cleaningTaskId must be a number", 400);
        try {
            // get the cleaning task
            const queryResult = await (0, dbconnection_1.query)("SELECT completed FROM CleaningTask WHERE cleaningTaskId = $1;", [cleaningTaskId]);
            // if the cleaning task does not exist
            if (queryResult.rowCount === 0)
                throw new ServerError_1.default(`The cleaning task with id ${cleaningTaskId} does not exist`, 404);
            const cleaningTask = queryResult.rows[0];
            if (!cleaningTask.completed) {
                // mark the cleaning task as complete
                return await CleaningTask_1.default.setCompleted(cleaningTaskId, true);
            }
            else
                throw new ServerError_1.default("The cleaning task is already completed", 400);
        }
        catch (err) {
            if (err instanceof ServerError_1.default)
                throw err;
            throw new ServerError_1.default("An unexpected error occurred", 500);
        }
    }
    /**
     * Sets a cleaning task's completed attribute to false.
     *
     * @param cleaningTaskId The id of the cleaning task attribute to mark as incomplete
     * @returns A string indicating success if the update is successfull; otherwise, throws a server error.
     */
    static async markCleaningTaskAsIncomplete(cleaningTaskId) {
        if (typeof cleaningTaskId !== "number")
            throw new ServerError_1.default("cleaningTaskId must be a number", 400);
        try {
            // get the cleaning task
            const queryResult = await (0, dbconnection_1.query)("SELECT completed from CleaningTask WHERE cleaningTaskId = $1", [cleaningTaskId]);
            // if the cleaning task does not exist
            if (queryResult.rowCount === 0)
                throw new ServerError_1.default(`The cleaning task with id ${cleaningTaskId} does not exist`, 404);
            const cleaningTask = queryResult.rows[0];
            if (cleaningTask.completed)
                // mark the cleaning task as complete
                return await CleaningTask_1.default.setCompleted(cleaningTaskId, false);
            else
                throw new ServerError_1.default("The cleaning task is already marked as incomplete", 400);
        }
        catch (err) {
            if (err instanceof ServerError_1.default)
                throw err;
            throw new ServerError_1.default("An unexpected error occurred", 500);
        }
    }
    /**
     * Adds a manager's signature to a cleaning task list.
     *
     * @param cleaningTaskListId The id of the cleaning task list.
     * @param signature The signature to add to the cleaning task list.
     * @returns A string indicating success.
     * @throws A ServerError if the query fails, invalid arguments are supplied or the cleaning task list doesn't exist.
     */
    static async setManagerSignature(cleaningTaskListId, signature) {
        this.setSignatureCheckParams(cleaningTaskListId, signature);
        try {
            const queryResult = await (0, dbconnection_1.query)("UPDATE CleaningTaskList SET managerSignature = $1 WHERE CleaningTaskListId = $2", [signature, cleaningTaskListId]);
            if (queryResult.rowCount === 0)
                throw new ServerError_1.default("The cleaning task list does not exist", 404);
            return "update successful";
        }
        catch (err) {
            if (err instanceof ServerError_1.default)
                throw err;
            throw new ServerError_1.default("An error occurred while updating the cleaning task list. Check that the cleaning task list exists", 500);
        }
    }
    /**
     * Adds a staff member's signature to a cleaning task list.
     *
     * @param cleaningTaskListId The id of the cleanig task list.
     * @param signature The signature to add to the cleaning task list.
     * @returns A string indicating success.
     * @throws A ServerError if the query fails of invalid arguments are supplied.
     */
    static async setStaffMemberSignature(cleaningTaskListId, signature) {
        this.setSignatureCheckParams(cleaningTaskListId, signature);
        try {
            const queryResult = await (0, dbconnection_1.query)("UPDATE CleaningTaskList SET staffMemberSignature = $1 WHERE CleaningTaskListId = $2", [signature, cleaningTaskListId]);
            if (queryResult.rowCount === 0)
                throw new ServerError_1.default("The cleaning task list does not exist", 404);
            return "update successful";
        }
        catch (err) {
            if (err instanceof ServerError_1.default)
                throw err;
            throw new ServerError_1.default("An error occurred while updating the cleaning task list. Check that the cleaning task list exists", 500);
        }
    }
    /**
     * Deletes a cleaning task list from the database.
     *
     * @param cleaningTaskListId The id of the cleaning task list to delete.
     * @returns A success message if the operation is successful.
     * @throws A server error if the operation fails or cleaningTaskListId is not an integer.
     */
    static async delete(cleaningTaskListId) {
        if (!Number.isInteger(cleaningTaskListId))
            throw new ServerError_1.default("cleaningTaskListId must be an integer", 400);
        try {
            const queryResult = await (0, dbconnection_1.query)(`
        DELETE FROM CleaningTaskList
        WHERE cleaningTaskListId = $1;
        `, [cleaningTaskListId]);
            if (queryResult.rowCount === 0)
                throw new ServerError_1.default("The cleaning task list does not exist", 404);
            return "deletion successful";
        }
        catch (err) {
            if (err instanceof ServerError_1.default)
                throw err;
            throw new ServerError_1.default("An error occurred while deleting the cleaning task list", 500);
        }
    }
    /**
     * Returns the cleaning tasks linked to the cleaning task list specified.
     *
     * @param cleaningTaskListId The id of the cleaning task list.
     * @returns The cleaning tasks linked to the cleaning task list.
     * @throws A ServerError if the query fails or cleaningTaskListId is not a number.
     */
    static async getCleaningTasks(cleaningTaskListId) {
        if (!Number.isInteger(cleaningTaskListId))
            throw new ServerError_1.default("cleaningTaskListId must be an integer", 400);
        try {
            const queryResult = await (0, dbconnection_1.query)(`
        SELECT
          CleaningTask.cleaningTaskId,
          CleaningTask._description AS cleaningTaskDescription,
          CleaningTask.completed,
          CleaningTask.cleaningTaskListId,
          CleaningTask.areaId,
          Area._description AS areaDescription
        FROM
          CleaningTask
        INNER JOIN
          Area ON CleaningTask.areaId = Area.areaId
        WHERE
          CleaningTask.CleaningTaskListId = $1
        ORDER BY CleaningTask.cleaningTaskId ASC;
        `, [cleaningTaskListId]);
            if (queryResult.rowCount === 0)
                throw new ServerError_1.default("There are no cleaning tasks linked to the cleaning task list specified", 404);
            return queryResult.rows;
        }
        catch (error) {
            if (error instanceof ServerError_1.default)
                throw error;
            throw new ServerError_1.default("An error occurred while retrieving the cleaning tasks", 500);
        }
    }
    /**
     * Assigns a staff member to a cleaning task list.
     *
     * @param cleaningTaskListId The id of the cleaning task list.
     * @param staffMemberId The id of the staff member.
     * @returns A string indicating success if the query runs successfully.
     * @throws A ServerError if the query fails or invalid parameters are supplied.
     */
    static async assignStaffMember(cleaningTaskListId, staffMemberId) {
        if (!Number.isInteger(cleaningTaskListId)) {
            throw new ServerError_1.default("cleaningTaskListId must be an integer", 400);
        }
        if (!Number.isInteger(staffMemberId)) {
            throw new ServerError_1.default("staffMemberId must be an integer", 400);
        }
        try {
            const queryResult = await (0, dbconnection_1.query)(`
          UPDATE CleaningTaskList
          SET staffMemberId = $1
          WHERE cleaningTaskListId = $2;
        `, [staffMemberId, cleaningTaskListId]);
            if (queryResult.rowCount === 0) {
                throw new ServerError_1.default("There are no cleaning task lists with the specified id", 404);
            }
            return "update successful";
        }
        catch (error) {
            if (error instanceof ServerError_1.default)
                throw error;
            throw new ServerError_1.default("An unexpected error occurred while updating the cleaning task list", 500);
        }
    }
    /**
     * Helper function which checks the parameters of the setManagerSignature and setStaffMemberSignature functions.
     *
     * @param cleaningTaskListId The id of the cleaning task list to check
     * @param signature The signature to check
     * @throws a ServerError if either parameter is not valid; otherwise undefined.
     */
    static setSignatureCheckParams(cleaningTaskListId, signature) {
        if (typeof signature !== "string")
            throw new ServerError_1.default("signature must be a string", 400);
        if (signature.length === 0)
            throw new ServerError_1.default("signature must not be empty", 400);
        if (typeof cleaningTaskListId !== "number" || !Number.isInteger(cleaningTaskListId))
            throw new ServerError_1.default("cleaningTaskListId must be an integer", 400);
    }
}
exports.default = CleaningTaskList;
