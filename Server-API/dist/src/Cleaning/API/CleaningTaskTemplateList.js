"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbconnection_1 = require("../db/dbconnection");
const ServerError_1 = __importDefault(require("../../../ServerError"));
/**
 * Implements CleaningTaskTemplateList operations.
 *
 * Previously called CleaningTasksTemplate in project documentation.
 *
 * @author Isaac Clark
 * @version 1
 */
class CleaningTaskTemplateList {
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
    static async new(title, cleaningTaskTemplates) {
        if (typeof title !== "string" || title === "")
            throw new ServerError_1.default("title must be a non-empty string", 400);
        if (!Array.isArray(cleaningTaskTemplates) ||
            !cleaningTaskTemplates.every((item) => typeof item === "number")) {
            throw new ServerError_1.default("cleaningTaskTemplates must be an array containing only numbers", 400);
        }
        try {
            return await (0, dbconnection_1.executeTransaction)(async (client) => {
                const createCleaningTaskTemplateListQueryResult = await client.query(`
          INSERT INTO CleaningTaskTemplateList (title)
          VALUES ($1)
          RETURNING cleaningTaskTemplateListId;
          `, [title]);
                const cleaningTaskTemplateListId = createCleaningTaskTemplateListQueryResult.rows[0].cleaningtasktemplatelistid;
                for (const id of cleaningTaskTemplates) {
                    await client.query(`
            INSERT INTO
              CleaningTaskTemplateListToCleaningTaskTemplate
                (cleaningTaskTemplateListId, cleaningTaskTemplateId)
            VALUES
              ($1, $2);
            `, [cleaningTaskTemplateListId, id]);
                }
                return cleaningTaskTemplateListId;
            });
        }
        catch (err) {
            throw new ServerError_1.default("An error occurred while creating the new cleaning task template list", 500);
        }
    }
    /**
     * Returns the cleaning task template list with the id of cleaningTaskTemplateListId.
     *
     * @param cleaningTaskTemplateListId The id of the cleaning task template to retrieve from the database.
     * @returns
     * - If the cleaning task template list with the id cleaningTaskTemplateListId exists:
     *  - Return the cleaning task template list with the id cleaningTaskTemplateListId.
     * - Otherwise:
     *  - Return an error.
     */
    static async getView(cleaningTaskTemplateListId) {
        if (!Number.isInteger(cleaningTaskTemplateListId)) {
            throw new ServerError_1.default("cleaningTaskTemplateListId must be a integer", 400);
        }
        try {
            const cleaningTaskTemplateList = await (0, dbconnection_1.query)("SELECT * FROM CleaningTaskTemplateList WHERE CleaningTaskTemplateListId = $1", [cleaningTaskTemplateListId]);
            if (cleaningTaskTemplateList.rowCount === 0)
                throw new ServerError_1.default(`There are no cleaning task template lists with the id of ${cleaningTaskTemplateListId}`, 404);
            else
                return cleaningTaskTemplateList.rows[0];
        }
        catch (err) {
            if (err instanceof ServerError_1.default)
                throw err;
            throw new ServerError_1.default("An error occurred while retrieving the cleaning task template list", 500);
        }
    }
    /**
     * Adds a cleaning task template to a cleaning task template list.
     *
     * @param cleaningTaskTemplateListId The id of the cleaning task template list.
     * @param cleaningTaskTemplateId The id of the cleaning task template to add to the cleaning task template list.
     * @returns A string indicating success if the operation is successful.
     * @throws A server error if the arguments supplied are not integers or the query fails.
     */
    static async addCleaningTaskTemplate(cleaningTaskTemplateListId, cleaningTaskTemplateId) {
        if (!Number.isInteger(cleaningTaskTemplateListId))
            throw new ServerError_1.default("cleaningTaskTemplateListId must be an integer", 400);
        if (!Number.isInteger(cleaningTaskTemplateId))
            throw new ServerError_1.default("cleaningTaskTemplateId must be an integer", 400);
        try {
            await (0, dbconnection_1.query)(`
        INSERT INTO CleaningTaskTemplateListToCleaningTaskTemplate (cleaningTaskTemplateListId, cleaningTaskTemplateId)
        VALUES ($1, $2);
        `, [cleaningTaskTemplateListId, cleaningTaskTemplateId]);
            return "cleaning task template added successfully";
        }
        catch (err) {
            throw new ServerError_1.default("An error occurred while adding the cleaning task template to the cleaning task template list", 500);
        }
    }
    /**
     * Creates a new cleaning task template.
     *
     * @param cleaningTaskTemplateListId The id of the cleaning task template list.
     * @param cleaningTaskTemplateDescription The description of the new cleaning task template.
     * @param areaId The id of the area to link to the new cleaning task template.
     * @param areaDescription The description of the new area.
     * @returns The id of the new cleaning task template.
     * @throws A ServerError if invalid arguments are supplied or a database query or transaction fails.
     */
    static async createCleaningTaskTemplate(cleaningTaskTemplateDescription, cleaningTaskTemplateListId, areaId, areaDescription) {
        if (typeof cleaningTaskTemplateDescription !== "string" ||
            cleaningTaskTemplateDescription === "")
            throw new ServerError_1.default("cleaningTaskTemplateDescription must be a non-empty string", 400);
        // Just create the cleaning task template; don't link to cleaning task template list; area exists
        if (cleaningTaskTemplateListId === undefined &&
            cleaningTaskTemplateDescription !== undefined &&
            areaId !== undefined &&
            areaDescription === undefined) {
            if (!Number.isInteger(areaId))
                throw new ServerError_1.default("areaId must be an integer", 400);
            try {
                const queryResult = await (0, dbconnection_1.query)(`
          INSERT INTO
            CleaningTaskTemplate (_description, areaId)
          VALUES
            ($1, $2)
          RETURNING
            cleaningTaskTemplateId;
          `, [cleaningTaskTemplateDescription, areaId]);
                return queryResult.rows[0].cleaningtasktemplateid;
            }
            catch (error) {
                throw new ServerError_1.default("An error occurred while creating the new cleaning task template", 500);
            }
        }
        // Just create cleaning task template; don't link to cleaning task template list; area doesn't exist
        if (cleaningTaskTemplateListId === undefined &&
            cleaningTaskTemplateDescription !== undefined &&
            areaId === undefined &&
            areaDescription !== undefined) {
            if (typeof areaDescription !== "string" || areaDescription === "")
                throw new ServerError_1.default("areaDescription must be a non-empty string", 400);
            try {
                return await (0, dbconnection_1.executeTransaction)(async (client) => {
                    // create area
                    const areaQueryResult = await client.query(`
            INSERT INTO
              Area (_description)
            VALUES ($1)
            RETURNING
              areaId;
            `, [areaDescription]);
                    const area_id = areaQueryResult.rows[0].areaid;
                    const cleaningTaskTemplateQueryResult = await client.query(`
            INSERT INTO
              CleaningTaskTemplate (_description, areaId)
            VALUES
              ($1, $2)
            RETURNING
              cleaningTaskTemplateId;
            `, [cleaningTaskTemplateDescription, area_id]);
                    return cleaningTaskTemplateQueryResult.rows[0].cleaningtasktemplateid;
                });
            }
            catch (error) {
                throw new ServerError_1.default("An error occurred while creating the new cleaning task template", 500);
            }
        }
        // cleaning task doesn't exist; area does; link to cleaning task template
        if (cleaningTaskTemplateListId !== undefined &&
            cleaningTaskTemplateDescription !== undefined &&
            areaId !== undefined &&
            areaDescription === undefined) {
            if (!Number.isInteger(cleaningTaskTemplateListId))
                throw new ServerError_1.default("cleaningTaskTemplateListId must be an integer", 400);
            if (!Number.isInteger(areaId))
                throw new ServerError_1.default("areaId must be an integer", 400);
            try {
                return await (0, dbconnection_1.executeTransaction)(async (client) => {
                    // first query - create the cleaning task template
                    const cleaningTaskTemplateResult = await client.query(`
            INSERT INTO CleaningTaskTemplate (_description, areaId)
            VALUES ($1, $2)
            RETURNING cleaningTaskTemplateId;
            `, [cleaningTaskTemplateDescription, areaId]);
                    const cleaningTaskTemplateId = cleaningTaskTemplateResult.rows[0].cleaningtasktemplateid;
                    // second query - link the new cleaning task template to the cleaning task template list
                    await client.query(`
            INSERT INTO CleaningTaskTemplateListToCleaningTaskTemplate
              (cleaningTaskTemplateListId, cleaningTaskTemplateId)
            VALUES ($1, $2);
            `, [cleaningTaskTemplateListId, cleaningTaskTemplateId]);
                    return cleaningTaskTemplateId;
                });
            }
            catch (err) {
                throw new ServerError_1.default("An error occurred while creating the new cleaning task template", 500);
            }
        }
        // both cleaning task template and area don't exist; link to cleaning task template list
        if (cleaningTaskTemplateListId !== undefined &&
            cleaningTaskTemplateDescription !== undefined &&
            areaId === undefined &&
            areaDescription !== undefined) {
            if (!Number.isInteger(cleaningTaskTemplateListId))
                throw new ServerError_1.default("cleaningTaskTemplateListId must be an integer", 400);
            if (typeof areaDescription !== "string" || areaDescription === "")
                throw new ServerError_1.default("areaDescription must be a non-empty string", 400);
            try {
                return await (0, dbconnection_1.executeTransaction)(async (client) => {
                    // first query - create the area
                    const areaResult = await client.query(`
            INSERT INTO Area (_description)
            VALUES ($1)
            RETURNING areaId;
            `, [areaDescription]);
                    const area_id = areaResult.rows[0].areaid;
                    // second query - create cleaning task template
                    const cleaningTaskTemplateResult = await client.query(`
            INSERT INTO CleaningTaskTemplate (_description, areaId)
            VALUES ($1, $2)
            RETURNING cleaningTaskTemplateId;
            `, [cleaningTaskTemplateDescription, area_id]);
                    const cleaningTaskTemplateId = cleaningTaskTemplateResult.rows[0].cleaningtasktemplateid;
                    // third query - link the cleaning task template to the cleaning task template list
                    await client.query(`
            INSERT INTO CleaningTaskTemplateListToCleaningTaskTemplate
              (cleaningTaskTemplateListId, cleaningTaskTemplateId)
            VALUES ($1, $2);
            `, [cleaningTaskTemplateListId, cleaningTaskTemplateId]);
                    return cleaningTaskTemplateId;
                });
            }
            catch (err) {
                throw new ServerError_1.default("An error occurred during the operation", 500);
            }
        }
        throw new ServerError_1.default("Invalid arguments supplied", 400);
    }
    /**
     * Removes a cleaning task template from a cleaning task template list.
     *
     * @param cleaningTaskTemplateListId The id of the cleaning task template list.
     * @param cleaningTaskTemplateId The id of the cleaning task template to remove from the list.
     * @returns a success message if the operation is successful
     * @throws a ServerError if the operation fails or invalid arguments are supplied.
     */
    static async removeCleaningTaskTemplate(cleaningTaskTemplateListId, cleaningTaskTemplateId) {
        if (!Number.isInteger(cleaningTaskTemplateListId))
            throw new ServerError_1.default("cleaningTaskTemplateListId must be an integer", 400);
        if (!Number.isInteger(cleaningTaskTemplateId))
            throw new ServerError_1.default("cleaningTaskTemplateId must be an integer", 400);
        try {
            const queryResult = await (0, dbconnection_1.query)(`
        DELETE FROM CleaningTaskTemplateListToCleaningTaskTemplate
        WHERE cleaningTaskTemplateListId = $1 AND cleaningTaskTemplateId = $2;
        `, [cleaningTaskTemplateListId, cleaningTaskTemplateId]);
            if (queryResult.rowCount === 0)
                throw new ServerError_1.default("The cleaning task template list does not contain the cleaning task template", 404);
            return "removal successful";
        }
        catch (err) {
            if (err instanceof ServerError_1.default)
                throw err;
            throw new ServerError_1.default("An error occurred while removing the cleaning task template from the cleaning task template list", 500);
        }
    }
    /**
     * Deletes a cleaning task template list from the system.
     *
     * @param cleaningTaskTemplateListId The id of the cleaning task template list to delete.
     * @returns A string indicating succuss if the operation runs successfully.
     * @throws A server error if the operation fails or cleaningTaskTemplateId is not an integer.
     */
    static async delete(cleaningTaskTemplateListId) {
        if (!Number.isInteger(cleaningTaskTemplateListId))
            throw new ServerError_1.default("cleaningTaskTemplateListId must be an integer", 400);
        try {
            const queryResult = await (0, dbconnection_1.query)(`
        DELETE FROM CleaningTaskTemplateList
        WHERE cleaningTaskTemplateListId = $1;
        `, [cleaningTaskTemplateListId]);
            if (queryResult.rowCount === 0)
                throw new ServerError_1.default("The cleaning task template list does not exist", 404);
            return "deletion successful";
        }
        catch (err) {
            if (err instanceof ServerError_1.default)
                throw err;
            throw new ServerError_1.default("An error occurred while deleting the cleaning task template", 500);
        }
    }
    /**
     * Returns all cleaning task templates linked to the cleaning task template list.
     *
     * @param cleaningTaskTemplateListId The id of the cleaning task template list.
     * @returns The id of all cleaning task templates linked to the cleaning task template list.
     * @throws A ServerError if:
     * - cleaningTaskTemplateListId is not an integer
     * - no cleaning task templates are linked to the cleaning task template list.
     * - The operation fails
     */
    static async getCleaningTaskTemplates(cleaningTaskTemplateListId) {
        if (!Number.isInteger(cleaningTaskTemplateListId))
            throw new ServerError_1.default("cleaningTaskTemplateListId must be an integer", 400);
        try {
            const cleaningTaskTemplateIds = await (0, dbconnection_1.query)(`
        SELECT cleaningTaskTemplateId FROM CleaningTaskTemplateListToCleaningTaskTemplate
        WHERE cleaningTaskTemplateListId = $1;
        `, [cleaningTaskTemplateListId]);
            if (cleaningTaskTemplateIds.rowCount === 0)
                throw new ServerError_1.default("There are no cleaning task templates linked to the cleaning task template list", 404);
            const cleaningTaskTemplateIdList = [];
            // add each id to the array of ids
            cleaningTaskTemplateIds.rows.forEach((row) => cleaningTaskTemplateIdList.push(row.cleaningtasktemplateid));
            return cleaningTaskTemplateIdList;
        }
        catch (err) {
            if (err instanceof ServerError_1.default)
                throw err;
            throw new ServerError_1.default("An error occurred while retrieving cleaning task template ids", 500);
        }
    }
    /**
     * Returns the cleaning task templates linked to the cleaning task template list specified.
     *
     * @param cleaningTaskTemplateListId The id of the cleaning task list template.
     * @returns The cleaning task templates linked to the cleaning task template list.
     * @throws A ServerError if the query fails or cleaningTaskTemplateListId id is not a number.
     */
    static async getCleaningTaskTemplatesFromCleaningTaskTemplateList(cleaningTaskTemplateListId) {
        if (!Number.isInteger(cleaningTaskTemplateListId)) {
            throw new ServerError_1.default("cleaningTaskTemplateListId must be an integer", 400);
        }
        try {
            const cleaningTaskTemplateIds = await this.getCleaningTaskTemplates(cleaningTaskTemplateListId);
            const cleaningTaskTemplates = [];
            for (const cleaningTaskTemplateId of cleaningTaskTemplateIds) {
                const cleaningTaskTemplate = await (0, dbconnection_1.query)(`
          SELECT
            CleaningTaskTemplate.cleaningTaskTemplateId,
            CleaningTaskTemplate._description AS cleaningTaskTemplateDescription,
            CleaningTaskTemplate.areaId,
            Area._description AS areaDescription
          FROM
            CleaningTaskTemplate
          INNER JOIN
            Area
          ON
            CleaningTaskTemplate.areaId = Area.areaId
          WHERE
            CleaningTaskTemplate.cleaningTaskTemplateId = $1
          ORDER BY
            CleaningTaskTemplate.cleaningTaskTemplateId ASC;
          `, [cleaningTaskTemplateId]);
                cleaningTaskTemplates.push(cleaningTaskTemplate.rows[0]);
            }
            return cleaningTaskTemplates;
        }
        catch (error) {
            if (error instanceof ServerError_1.default)
                throw error;
            throw new ServerError_1.default("An error occurred while retrieving the cleaning task templates", 500);
        }
    }
}
exports.default = CleaningTaskTemplateList;
