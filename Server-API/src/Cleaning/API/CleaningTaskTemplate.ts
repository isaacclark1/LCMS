import ServerError from "../../../ServerError";
import { query } from "../db/dbconnection";

/**
 * Represents a cleaning task template.
 *
 * @author Isaac Clark
 * @version 1
 */
class CleaningTaskTemplate {
  private constructor() {}

  /**
   * Returns a description of a cleaning task.
   *
   * @param cleaningTaskTemplateId The cleaning task identifier
   * @returns the description of the cleaning task
   * @throws a ServerError if cleaningTaskId is invalid or the query fails.
   */
  public static async getDescription(cleaningTaskTemplateId: number): Promise<string> {
    if (typeof cleaningTaskTemplateId !== "number" || !Number.isInteger(cleaningTaskTemplateId))
      throw new ServerError("cleaningTaskTemplateId must be an integer", 400);

    try {
      const queryResult = await query(
        `
        SELECT _description FROM CleaningTaskTemplate
        WHERE cleaningTaskTemplateId = $1;
        `,
        [cleaningTaskTemplateId]
      );

      return queryResult.rows[0]._description;
    } catch (err) {
      throw new ServerError(
        "An error occurred when retrieving the cleaning task template description. Check that cleaningTaskTemplateId is valid",
        500
      );
    }
  }

  /**
   * Returns the Area linked to a cleaning task template.
   *
   * @param cleaningTaskTemplateId The ID of the cleaning task template.
   * @returns the id of the Area linked to the cleaning task template.
   * @throws a ServerError if cleaningTaskTemplateId is not valid or the database query fails.
   */
  public static async getArea(cleaningTaskTemplateId: number): Promise<number> {
    if (typeof cleaningTaskTemplateId !== "number" || !Number.isInteger(cleaningTaskTemplateId))
      throw new ServerError("cleaningTaskTemplateId must be an integer", 400);

    try {
      const queryResult = await query(
        `
        SELECT areaId FROM CleaningTaskTemplate
        WHERE cleaningTaskTemplateId = $1;
        `,
        [cleaningTaskTemplateId]
      );

      return queryResult.rows[0].areaid;
    } catch (err) {
      throw new ServerError(
        "An error occurred while retrieving the areaId from the cleaning task template. Check that cleaningTaskTemplateId is valid",
        500
      );
    }
  }
}

export default CleaningTaskTemplate;
