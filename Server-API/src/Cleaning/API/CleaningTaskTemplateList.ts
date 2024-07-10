import { executeTransaction, query } from "../db/dbconnection";
import ServerError from "../../../ServerError";
import { CleaningTaskTemplateList_TYPE, CleaningTaskTemplates_TYPE } from "../../../types";

/**
 * Implements CleaningTaskTemplateList operations.
 *
 * Previously called CleaningTasksTemplate in project documentation.
 *
 * @author Isaac Clark
 * @version 1
 */
class CleaningTaskTemplateList {
  private constructor() {}

  /**
   * Creates a new cleaning task template list.
   *
   * @param title The title of the new cleaning task template list
   * @returns The id of the new cleaning task template list.
   * @throws A server error if the query fails or title is not a non-empty string.
   */
  public static async new(title: string): Promise<number> {
    if (typeof title !== "string" || title === "")
      throw new ServerError("title must be a non-empty string", 400);

    try {
      const createCleaningTaskTemplateListResponse = await query(
        `
        INSERT INTO CleaningTaskTemplateList (title)
        VALUES ($1)
        RETURNING cleaningTaskTemplateListId;
        `,
        [title]
      );

      return createCleaningTaskTemplateListResponse.rows[0].cleaningtasktemplatelistid;
    } catch (err) {
      throw new ServerError(
        "An error occurred while creating the new cleaning task template list",
        500
      );
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
  public static async getView(
    cleaningTaskTemplateListId: number
  ): Promise<CleaningTaskTemplateList_TYPE | ServerError> {
    if (typeof cleaningTaskTemplateListId !== "number") {
      throw new ServerError("cleaningTaskTemplateListId must be a number", 400);
    }

    try {
      const cleaningTaskTemplateList = await query(
        "SELECT * FROM CleaningTaskTemplateList WHERE CleaningTaskTemplateListId = $1",
        [cleaningTaskTemplateListId]
      );

      if (cleaningTaskTemplateList.rowCount === 0)
        throw new ServerError(
          `There are no cleaning task template lists with the id of ${cleaningTaskTemplateListId}`,
          404
        );
      else return cleaningTaskTemplateList.rows[0];
    } catch (err) {
      if (err instanceof ServerError) throw err;
      throw new ServerError(
        "An error occurred while retrieving the cleaning task template list",
        500
      );
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
  public static async addCleaningTaskTemplate(
    cleaningTaskTemplateListId: number,
    cleaningTaskTemplateId: number
  ): Promise<string> {
    if (!Number.isInteger(cleaningTaskTemplateListId))
      throw new ServerError("cleaningTaskTemplateListId must be an integer", 400);

    if (!Number.isInteger(cleaningTaskTemplateId))
      throw new ServerError("cleaningTaskTemplateId must be an integer", 400);

    try {
      await query(
        `
        INSERT INTO CleaningTaskTemplateListToCleaningTaskTemplate (cleaningTaskTemplateListId, cleaningTaskTemplateId)
        VALUES ($1, $2);
        `,
        [cleaningTaskTemplateListId, cleaningTaskTemplateId]
      );

      return "cleaning task template added successfully";
    } catch (err) {
      throw new ServerError(
        "An error occurred while adding the cleaning task template to the cleaning task template list",
        500
      );
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
  public static async createCleaningTaskTemplate(
    cleaningTaskTemplateListId: number,
    cleaningTaskTemplateDescription: string,
    areaId?: number,
    areaDescription?: string
  ): Promise<number> {
    if (!Number.isInteger(cleaningTaskTemplateListId))
      throw new ServerError("cleaningTaskTemplateListId must be an integer", 400);

    if (
      typeof cleaningTaskTemplateDescription !== "string" ||
      cleaningTaskTemplateDescription === ""
    )
      throw new ServerError("cleaningTaskTemplateDescription must be a non-empty string", 400);

    // cleaning task doesn't exist; area does
    if (
      cleaningTaskTemplateListId !== undefined &&
      cleaningTaskTemplateDescription !== undefined &&
      areaId !== undefined &&
      areaDescription === undefined
    ) {
      if (!Number.isInteger(areaId)) throw new ServerError("areaId must be an integer", 400);

      try {
        return await executeTransaction(async (client) => {
          // first query - create the cleaning task template
          const cleaningTaskTemplateResult = await client.query(
            `
            INSERT INTO CleaningTaskTemplate (_description, areaId)
            VALUES ($1, $2)
            RETURNING cleaningTaskTemplateId;
            `,
            [cleaningTaskTemplateDescription, areaId]
          );

          const cleaningTaskTemplateId = cleaningTaskTemplateResult.rows[0].cleaningtasktemplateid;

          // second query - link the new cleaning task template to the cleaning task template list
          await client.query(
            `
            INSERT INTO CleaningTaskTemplateListToCleaningTaskTemplate
              (cleaningTaskTemplateListId, cleaningTaskTemplateId)
            VALUES ($1, $2);
            `,
            [cleaningTaskTemplateListId, cleaningTaskTemplateId]
          );

          return cleaningTaskTemplateId;
        });
      } catch (err) {
        throw new ServerError(
          "An error occurred while creating the new cleaning task template",
          500
        );
      }
    }

    // both cleaning task template and area don't exist
    if (
      cleaningTaskTemplateListId !== undefined &&
      cleaningTaskTemplateDescription !== undefined &&
      areaId === undefined &&
      areaDescription !== undefined
    ) {
      if (typeof areaDescription !== "string" || areaDescription === "")
        throw new ServerError("areaDescription must be a non-empty string", 400);

      try {
        return await executeTransaction(async (client) => {
          // first query - create the area
          const areaResult = await client.query(
            `
            INSERT INTO Area (_description)
            VALUES ($1)
            RETURNING areaId;
            `,
            [areaDescription]
          );

          const area_id = areaResult.rows[0].areaid;

          // second query - create cleaning task template
          const cleaningTaskTemplateResult = await client.query(
            `
            INSERT INTO CleaningTaskTemplate (_description, areaId)
            VALUES ($1, $2)
            RETURNING cleaningTaskTemplateId;
            `,
            [cleaningTaskTemplateDescription, area_id]
          );

          const cleaningTaskTemplateId = cleaningTaskTemplateResult.rows[0].cleaningtasktemplateid;

          // third query - link the cleaning task template to the cleaning task template list
          await client.query(
            `
            INSERT INTO CleaningTaskTemplateListToCleaningTaskTemplate
              (cleaningTaskTemplateListId, cleaningTaskTemplateId)
            VALUES ($1, $2);
            `,
            [cleaningTaskTemplateListId, cleaningTaskTemplateId]
          );

          return cleaningTaskTemplateId;
        });
      } catch (err) {
        throw new ServerError("An error occurred during the operation", 500);
      }
    }

    throw new ServerError("Invalid arguments supplied", 400);
  }

  /**
   * Removes a cleaning task template from a cleaning task template list.
   *
   * @param cleaningTaskTemplateListId The id of the cleaning task template list.
   * @param cleaningTaskTemplateId The id of the cleaning task template to remove from the list.
   * @returns a success message if the operation is successful
   * @throws a ServerError if the operation fails or invalid arguments are supplied.
   */
  public static async removeCleaningTaskTemplate(
    cleaningTaskTemplateListId: number,
    cleaningTaskTemplateId: number
  ): Promise<string> {
    if (!Number.isInteger(cleaningTaskTemplateListId))
      throw new ServerError("cleaningTaskTemplateListId must be an integer", 400);

    if (!Number.isInteger(cleaningTaskTemplateId))
      throw new ServerError("cleaningTaskTemplateId must be an integer", 400);

    try {
      const queryResult = await query(
        `
        DELETE FROM CleaningTaskTemplateListToCleaningTaskTemplate
        WHERE cleaningTaskTemplateListId = $1 AND cleaningTaskTemplateId = $2;
        `,
        [cleaningTaskTemplateListId, cleaningTaskTemplateId]
      );

      if (queryResult.rowCount === 0)
        throw new ServerError(
          "The cleaning task template list does not contain the cleaning task template",
          404
        );

      return "removal successful";
    } catch (err) {
      if (err instanceof ServerError) throw err;
      throw new ServerError(
        "An error occurred while removing the cleaning task template from the cleaning task template list",
        500
      );
    }
  }

  /**
   * Deletes a cleaning task template list from the system.
   *
   * @param cleaningTaskTemplateListId The id of the cleaning task template list to delete.
   * @returns A string indicating succuss if the operation runs successfully.
   * @throws A server error if the operation fails or cleaningTaskTemplateId is not an integer.
   */
  public static async delete(cleaningTaskTemplateListId: number): Promise<string> {
    if (!Number.isInteger(cleaningTaskTemplateListId))
      throw new ServerError("cleaningTaskTemplateListId must be an integer", 400);

    try {
      const queryResult = await query(
        `
        DELETE FROM CleaningTaskTemplateList
        WHERE cleaningTaskTemplateListId = $1;
        `,
        [cleaningTaskTemplateListId]
      );

      if (queryResult.rowCount === 0)
        throw new ServerError("The cleaning task template list does not exist", 404);

      return "deletion successful";
    } catch (err) {
      if (err instanceof ServerError) throw err;
      throw new ServerError("An error occurred while deleting the cleaning task template", 500);
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
  public static async getCleaningTaskTemplates(
    cleaningTaskTemplateListId: number
  ): Promise<Array<number>> {
    if (!Number.isInteger(cleaningTaskTemplateListId))
      throw new ServerError("cleaningTaskTemplateListId must be an integer", 400);

    try {
      const cleaningTaskTemplateIds = await query(
        `
        SELECT cleaningTaskTemplateId FROM CleaningTaskTemplateListToCleaningTaskTemplate
        WHERE cleaningTaskTemplateListId = $1;
        `,
        [cleaningTaskTemplateListId]
      );

      if (cleaningTaskTemplateIds.rowCount === 0)
        throw new ServerError(
          "There are no cleaning task templates linked to the cleaning task template list",
          404
        );

      const cleaningTaskTemplateIdList: Array<number> = [];

      // add each id to the array of ids
      cleaningTaskTemplateIds.rows.forEach((row) =>
        cleaningTaskTemplateIdList.push(row.cleaningtasktemplateid)
      );

      return cleaningTaskTemplateIdList;
    } catch (err) {
      if (err instanceof ServerError) throw err;
      throw new ServerError("An error occurred while retrieving cleaning task template ids", 500);
    }
  }
}

export default CleaningTaskTemplateList;
