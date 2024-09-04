"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbconnection_1 = require("../db/dbconnection");
const ServerError_1 = __importDefault(require("../../../ServerError"));
const CleaningTaskList_1 = __importDefault(require("./CleaningTaskList"));
const CleaningTaskTemplateList_1 = __importDefault(require("./CleaningTaskTemplateList"));
const CleaningTask_1 = __importDefault(require("./CleaningTask"));
const StaffMember_1 = __importDefault(require("./StaffMember"));
/**
 * The Leisure Centre Management System system class which implements the system operations for the Cleaning use case.
 *
 * @author Isaac Clark
 * @version 1
 */
class LCMS_Cleaning {
    constructor() { }
    /**
     * Creates a new cleaning task template list.
     *
     * @param title The title of the new cleaning task template list
     * @param cleaningTaskTemplates The id's of the cleaning task templates to add to the cleaning task template list.
     * @returns The id of the new cleaning task template list.
     * @throws A server error if the query fails or title is not a non-empty string.
     * @throws A server error if cleaningTaskTemplates is not of type Array<number>.
     */
    static async createCleaningTaskTemplateList(title, cleaningTaskTemplates) {
        return await CleaningTaskTemplateList_1.default.new(title, cleaningTaskTemplates);
    }
    /**
     * Returns the cleaning task template list with the id of cleaningTaskTemplateListId.
     *
     * Previously called viewCleaningTasksTemplate in project documentation.
     *
     * @param cleaningTasksTemplateId The id of the cleaning task template list to return.
     * @returns
     * - If the cleaning task template list with the id cleaningTaskTemplateListId exists:
     *  - Return the cleaning task template list with the id cleaningTaskTemplateListId.
     * - Otherwise:
     *  - Throw a server error.
     */
    static async viewCleaningTaskTemplateList(cleaningTaskTemplateListId) {
        return await CleaningTaskTemplateList_1.default.getView(cleaningTaskTemplateListId);
    }
    /**
     * Adds a cleaning task template to a cleaning task template list.
     * If the cleaning task template does not exist a new one is created.
     * If an Area doesn't exist one is created.
     *
     * @param cleaningTaskTemplateListId The id of the cleaning task template list to add the cleaning task template to.
     * @param cleaningTaskTemplateDescription The description of the new cleaning task template
     * @param cleaningTaskTemplateId The id of the cleaning task template to add to the cleaning task template list.
     * @param areaId The id of the area to link to the new cleaning task template.
     * @param areaDescription The description of the new area to link to the cleaning task template.
     * @returns If the cleaning task template already exists a string indicating success is returned.
     * If the cleaning task template is created, the id of the new cleaning task template is returned.
     * @throws A server error if invalid arguments are supplied or the operation fails.
     */
    static async addCleaningTaskTemplateToCleaningTaskTemplateList(cleaningTaskTemplateListId, cleaningTaskTemplateId, cleaningTaskTemplateDescription, areaId, areaDescription) {
        if (cleaningTaskTemplateListId !== undefined &&
            cleaningTaskTemplateId !== undefined &&
            cleaningTaskTemplateDescription === undefined &&
            areaId === undefined &&
            areaDescription === undefined)
            return await CleaningTaskTemplateList_1.default.addCleaningTaskTemplate(cleaningTaskTemplateListId, cleaningTaskTemplateId);
        else
            return await CleaningTaskTemplateList_1.default.createCleaningTaskTemplate(cleaningTaskTemplateDescription, cleaningTaskTemplateListId, areaId, areaDescription);
    }
    /**
     * Returns all cleaning task template lists from the database.
     *
     * This method was called getCleaningTasksTemplates in project documentatation.
     *
     * @returns
     * - If there are no cleaning task template lists stored in the system:
     *   - Return a string indicating that there are no cleaning task template lists stored in the system.
     * - Otherwise:
     *  - Return all cleaning task template lists stored in the system.
     */
    static async getCleaningTaskTemplateLists() {
        try {
            const cleaningTaskTemplateLists = await (0, dbconnection_1.query)(`
        SELECT *
        FROM CleaningTaskTemplateList
        ORDER BY cleaningTaskTemplateListId ASC;
        `);
            if (cleaningTaskTemplateLists.rowCount === 0)
                throw new ServerError_1.default("There are no cleaning task template lists stored in the system", 404);
            else
                return cleaningTaskTemplateLists.rows;
        }
        catch (err) {
            if (err instanceof ServerError_1.default)
                throw err;
            throw new ServerError_1.default("An error occurred while retrieving cleaning task template lists", 500);
        }
    }
    /**
     * Returns all cleaning task templates from the database.
     *
     * @returns
     * - If there are no cleanign task templates stored in the system:
     *  - Return a string indicating that there are no cleaning task templates stored in the system.
     * - Otherwise:
     *  - Return all cleaning task templates stored in the system.
     */
    static async getCleaningTaskTemplates() {
        try {
            const cleaningTaskTemplates = await (0, dbconnection_1.query)(`SELECT
          CleaningTaskTemplate.cleaningTaskTemplateId,
          CleaningTaskTemplate._description AS cleaningTaskTemplateDescription,
          CleaningTaskTemplate.areaId,
          Area._description AS areaDescription
        FROM
          CleaningTaskTemplate
        INNER JOIN
          Area ON CleaningTaskTemplate.areaId = Area.areaId
        ORDER BY CleaningTaskTemplate.cleaningTaskTemplateId ASC;
        `);
            if (cleaningTaskTemplates.rowCount === 0)
                throw new ServerError_1.default("There are no cleaning task templates stored in the system", 404);
            else
                return cleaningTaskTemplates.rows;
        }
        catch (err) {
            if (err instanceof ServerError_1.default)
                throw err;
            throw new ServerError_1.default("An error occurred while retrieving cleaning task templates", 500);
        }
    }
    /**
     * Returns all areas from the database.
     *
     * @returns
     * - If there are no areas stored in the system:
     *  - Return a string indicating that there a no areas stored in the system database.
     * - Otherwise:
     *  - Return all areas stored in the system database.
     */
    static async getAreas() {
        try {
            const areas = await (0, dbconnection_1.query)(`
        SELECT *
        FROM Area
        ORDER BY areaId ASC;
        `);
            if (areas.rowCount === 0)
                throw new ServerError_1.default("There are no areas stored in the system", 404);
            else
                return areas.rows;
        }
        catch (err) {
            if (err instanceof ServerError_1.default)
                throw err;
            throw new ServerError_1.default("An error occurred while retrieving areas", 500);
        }
    }
    /**
     * Removes a cleaning task template from a cleaning task template list.
     *
     * @param cleaningTaskTemplateListId The id of the cleaning task template list.
     * @param cleaningTaskTemplateId The id of the cleaning task template to remove from the list.
     * @returns a success message if the operation is successful
     * @throws a ServerError if the operation fails or invalid arguments are supplied.
     */
    static async removeCleaningTaskTemplateFromCleaningTaskTemplateList(cleaningTaskTemplateListId, cleaningTaskTemplateId) {
        return await CleaningTaskTemplateList_1.default.removeCleaningTaskTemplate(cleaningTaskTemplateListId, cleaningTaskTemplateId);
    }
    /**
     * Deletes a cleaning task template list from the system.
     *
     * @param cleaningTaskTemplateListId The id of the cleaning task template list to delete.
     * @returns A string indicating succuss if the operation runs successfully.
     * @throws A server error if the operation fails or cleaningTaskTemplateId is not an integer.
     */
    static async deleteCleaningTaskTemplateList(cleaningTaskTemplateListId) {
        return await CleaningTaskTemplateList_1.default.delete(cleaningTaskTemplateListId);
    }
    /**
     * Creates a new cleaning task list, using a cleaning task template list as a template.
     *
     * @param cleaningTaskTemplateListId The id of the cleaning task template list to use as a template.
     * @param date The date to assign to the new cleaning task list.
     * @param staffMemberId The staff member to assign to the new cleaning task list.
     * @returns The id of the new cleaning task list.
     * @throws A ServerError if arguments supplied are not valid or a query/transaction fails.
     */
    static async createCleaningTaskList(cleaningTaskTemplateListId, date, staffMemberId) {
        return await CleaningTaskList_1.default.new(cleaningTaskTemplateListId, date, staffMemberId);
    }
    /**
     * Returns all cleaning tasks from the database.
     *
     * This method was called getCleaningTasks in project documentation.
     *
     * @returns
     * - If there are no cleaning task lists stored in the system:
     *  - Returns a string indicating that there are no cleaning task lists stored in the system.
     * - Otherwise:
     *  - Returns all cleaning task lists stored in the system.
     */
    static async getCleaningTaskLists() {
        try {
            const cleaningTaskLists = await (0, dbconnection_1.query)(`
        SELECT *
        FROM CleaningTaskList
        ORDER BY cleaningTaskListId ASC;
        `);
            if (cleaningTaskLists.rowCount === 0)
                throw new ServerError_1.default("There are no cleaning task lists stored in the system", 404);
            else
                return cleaningTaskLists.rows;
        }
        catch (err) {
            if (err instanceof ServerError_1.default)
                throw err;
            throw new ServerError_1.default("An error occurred while retrieving cleaning task lists", 500);
        }
    }
    /**
     * Returns the cleaning task list with the id of cleaningTaskListId.
     *
     * This method was previously called viewCleaningTasks in project documentation.
     *
     * @param cleaningTaskListId The id of the cleaning task list to return.
     * @returns
     * - If the cleaning task list with the id cleaningTaskListId exists:
     *  - Return the cleaning task list with the id cleaningTaskListId.
     * - Otherwise:
     *  - Throws a server error.
     */
    static async viewCleaningTaskList(cleaningTaskListId) {
        return await CleaningTaskList_1.default.getView(cleaningTaskListId);
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
    static async addCleaningTaskToCleaningTaskList(cleaningTaskListId, cleaningTaskTemplateId, cleaningTaskDescription, areaDescription, areaId) {
        return await CleaningTaskList_1.default.createCleaningTask(cleaningTaskListId, cleaningTaskTemplateId, cleaningTaskDescription, areaDescription, areaId);
    }
    /**
     * Deletes a cleaning task from the database.
     *
     * @param cleaningTaskId The id of the cleaning task to delete.
     * @returns a success message if the operation is successful.
     * @throws a ServerError if the operation fails or cleaningTaskId is not an integer.
     */
    static async removeCleaningTaskFromCleaningTaskList(cleaningTaskId) {
        return await CleaningTask_1.default.delete(cleaningTaskId);
    }
    /**
     * Sets a cleaning tasks completed attribute to true.
     *
     * @param cleaningTaskListId
     * @param cleaningTaskId
     * @returns a string indicating success; otherwise a server error.
     */
    static async markCleaningTaskAsComplete(cleaningTaskListId, cleaningTaskId) {
        if (typeof cleaningTaskListId !== "number")
            throw new ServerError_1.default("cleaningTaskListId must be an integer", 400);
        if (typeof cleaningTaskId !== "number")
            throw new ServerError_1.default("cleaningTaskId must be an integer", 400);
        try {
            const queryResult = await (0, dbconnection_1.query)("SELECT cleaningTaskId, cleaningTaskListId FROM CleaningTask WHERE cleaningTaskId = $1 AND cleaningTaskListId = $2;", [cleaningTaskId, cleaningTaskListId]);
            if (queryResult.rowCount === 0)
                throw new ServerError_1.default("The cleaning task specified is not part of the cleaning task list specified", 404);
            return await CleaningTaskList_1.default.markCleaningTaskAsComplete(cleaningTaskId);
        }
        catch (err) {
            if (err instanceof ServerError_1.default)
                throw err;
            throw new ServerError_1.default("An unexpected error occurred", 500);
        }
    }
    /**
     * Sets a cleaning tasks completed attribute to false.
     *
     * @param cleaningTaskListId
     * @param cleaningTaskId
     * @returns a string indicating success; otherwise a server error.
     */
    static async markCleaningTaskAsIncomplete(cleaningTaskListId, cleaningTaskId) {
        if (typeof cleaningTaskListId !== "number")
            throw new ServerError_1.default("cleaningTaskListId must be an integer", 400);
        if (typeof cleaningTaskId !== "number")
            throw new ServerError_1.default("cleaningTaskId must be an integer", 400);
        try {
            const queryResult = await (0, dbconnection_1.query)("SELECT cleaningTaskId, cleaningTaskListId FROM CleaningTask WHERE cleaningTaskId = $1 AND cleaningTaskListId = $2;", [cleaningTaskId, cleaningTaskListId]);
            if (queryResult.rowCount === 0)
                throw new ServerError_1.default("The cleaning task specified is not part of the cleaning task list specified", 404);
            return await CleaningTaskList_1.default.markCleaningTaskAsIncomplete(cleaningTaskId);
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
     * Previously called signOffCleaningTasksManager in project documentation.
     *
     * @param cleaningTaskListId The id of the cleaning task list.
     * @param signature The signature to add to the cleaning task list.
     * @returns A string indicating success.
     * @throws A ServerError if the query fails or invalid arguments are supplied.
     */
    static async signOffCleaningTaskListManager(cleaningTaskListId, signature) {
        return await CleaningTaskList_1.default.setManagerSignature(cleaningTaskListId, signature);
    }
    /**
     * Adds a staff member's signature to a cleaning task list.
     *
     * Previously called signOffCleaningTasksStaffMember in project documentation.
     *
     * @param cleaningTaskListId The id of the cleaning task list.
     * @param signature The signature to add to the cleaning task list.
     * @returns A string indicating success.
     * @throws A ServerError if the query fails or invalid arguments are supplied.
     */
    static async signOffCleaningTaskListStaffMember(cleaningTaskListId, signature) {
        return await CleaningTaskList_1.default.setStaffMemberSignature(cleaningTaskListId, signature);
    }
    /**
     * Deletes a cleaning task list from the database.
     *
     * @param cleaningTaskListId The id of the cleaning task list to delete.
     * @returns A success message if the operation is successful.
     * @throws A server error if the operation fails or cleaningTaskListId is not an integer.
     */
    static async deleteCleaningTaskList(cleaningTaskListId) {
        return await CleaningTaskList_1.default.delete(cleaningTaskListId);
    }
    /**
     * Returns the cleaning tasks linked to the cleaning task list specified.
     *
     * @param cleaningTaskListId The id of the cleaning task list.
     * @returns The cleaning tasks linked to the cleaning task list.
     * @throws A ServerError if the query fails or cleaningTaskListId is not a number.
     */
    static async getCleaningTasks(cleaningTaskListId) {
        return await CleaningTaskList_1.default.getCleaningTasks(cleaningTaskListId);
    }
    /**
     * Returns the cleaning task templates linked to the cleaning task template list specified.
     *
     * @param cleaningTaskTemplateListId The id of the cleaning task list template.
     * @returns The cleaning task templates linked to the cleaning task template list.
     * @throws A ServerError if the query fails or cleaningTaskTemplateListId id is not a number.
     */
    static async getCleaningTaskTemplatesFromCleaningTaskTemplateList(cleaningTaskTemplateListId) {
        return await CleaningTaskTemplateList_1.default.getCleaningTaskTemplatesFromCleaningTaskTemplateList(cleaningTaskTemplateListId);
    }
    /**
     * Gets the payroll number, first name and surname of each staff member from AWS Cognito.
     *
     * @returns The payroll number, first name and surname of each staff member.
     * @throws A ServerError if the operation fails.
     */
    static async getStaffMembers() {
        return await StaffMember_1.default.getStaffMembers();
    }
    /**
     * Assigns a staff member to a cleaning task list.
     *
     * @param cleaningTaskListId The id of the cleaning task list.
     * @param staffMemberId The id of the staff member.
     * @returns A string indicating success if the query runs successfully.
     * @throws A ServerError if the query fails or invalid parameters are supplied.
     */
    static async assignStaffMemberToCleaningTaskList(cleaningTaskListId, staffMemberId) {
        return await CleaningTaskList_1.default.assignStaffMember(cleaningTaskListId, staffMemberId);
    }
    /**
     * Creates a new cleaning task template.
     *
     * @param cleaningTaskTemplateDescription The description of the new cleaning task template.
     * @param areaId The id of the area to link to the new cleaning task template.
     * @param areaDescription The description of the new area.
     * @returns The id of the new cleaning task template.
     * @throws A ServerError if invalid arguments are supplied or a database query or transaction fails.
     */
    static async createCleaningTaskTemplate(cleaningTaskTemplateDescription, areaId, areaDescription) {
        return await CleaningTaskTemplateList_1.default.createCleaningTaskTemplate(cleaningTaskTemplateDescription, undefined, areaId, areaDescription);
    }
}
exports.default = LCMS_Cleaning;
