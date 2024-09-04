import { query } from "../db/dbconnection";
import ServerError from "../../../ServerError";
import {
  CleaningTaskTemplateLists_TYPE,
  CleaningTaskTemplates_TYPE,
  Areas_TYPE,
  CleaningTaskList_TYPE,
  CleaningTaskLists_TYPE,
  CleaningTaskTemplateList_TYPE,
  CleaningTask_TYPE,
  CleaningTaskWithArea,
} from "../../../types";
import CleaningTaskList from "./CleaningTaskList";
import CleaningTaskTemplateList from "./CleaningTaskTemplateList";
import CleaningTask from "./CleaningTask";
import StaffMember from "./StaffMember";

/**
 * The Leisure Centre Management System system class which implements the system operations for the Cleaning use case.
 *
 * @author Isaac Clark
 * @version 1
 */
class LCMS_Cleaning {
  private constructor() {}

  /**
   * Creates a new cleaning task template list.
   *
   * @param title The title of the new cleaning task template list
   * @param cleaningTaskTemplates The id's of the cleaning task templates to add to the cleaning task template list.
   * @returns The id of the new cleaning task template list.
   * @throws A server error if the query fails or title is not a non-empty string.
   * @throws A server error if cleaningTaskTemplates is not of type Array<number>.
   */
  public static async createCleaningTaskTemplateList(
    title: string,
    cleaningTaskTemplates: Array<number>
  ) {
    return await CleaningTaskTemplateList.new(title, cleaningTaskTemplates);
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
  public static async viewCleaningTaskTemplateList(
    cleaningTaskTemplateListId: number
  ): Promise<CleaningTaskTemplateList_TYPE | ServerError> {
    return await CleaningTaskTemplateList.getView(cleaningTaskTemplateListId);
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
  public static async addCleaningTaskTemplateToCleaningTaskTemplateList(
    cleaningTaskTemplateListId: number,
    cleaningTaskTemplateId?: number,
    cleaningTaskTemplateDescription?: string,
    areaId?: number,
    areaDescription?: string
  ): Promise<string | number> {
    if (
      cleaningTaskTemplateListId !== undefined &&
      cleaningTaskTemplateId !== undefined &&
      cleaningTaskTemplateDescription === undefined &&
      areaId === undefined &&
      areaDescription === undefined
    )
      return await CleaningTaskTemplateList.addCleaningTaskTemplate(
        cleaningTaskTemplateListId,
        cleaningTaskTemplateId
      );
    else
      return await CleaningTaskTemplateList.createCleaningTaskTemplate(
        cleaningTaskTemplateDescription!,
        cleaningTaskTemplateListId,
        areaId,
        areaDescription
      );
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
  public static async getCleaningTaskTemplateLists(): Promise<
    CleaningTaskTemplateLists_TYPE | ServerError
  > {
    try {
      const cleaningTaskTemplateLists = await query(
        `
        SELECT *
        FROM CleaningTaskTemplateList
        ORDER BY cleaningTaskTemplateListId ASC;
        `
      );

      if (cleaningTaskTemplateLists.rowCount === 0)
        throw new ServerError(
          "There are no cleaning task template lists stored in the system",
          404
        );
      else return cleaningTaskTemplateLists.rows;
    } catch (err) {
      if (err instanceof ServerError) throw err;
      throw new ServerError("An error occurred while retrieving cleaning task template lists", 500);
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
  public static async getCleaningTaskTemplates(): Promise<
    CleaningTaskTemplates_TYPE | ServerError
  > {
    try {
      const cleaningTaskTemplates = await query(
        `SELECT
          CleaningTaskTemplate.cleaningTaskTemplateId,
          CleaningTaskTemplate._description AS cleaningTaskTemplateDescription,
          CleaningTaskTemplate.areaId,
          Area._description AS areaDescription
        FROM
          CleaningTaskTemplate
        INNER JOIN
          Area ON CleaningTaskTemplate.areaId = Area.areaId
        ORDER BY CleaningTaskTemplate.cleaningTaskTemplateId ASC;
        `
      );

      if (cleaningTaskTemplates.rowCount === 0)
        throw new ServerError("There are no cleaning task templates stored in the system", 404);
      else return cleaningTaskTemplates.rows;
    } catch (err) {
      if (err instanceof ServerError) throw err;
      throw new ServerError("An error occurred while retrieving cleaning task templates", 500);
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
  public static async getAreas(): Promise<Areas_TYPE | ServerError> {
    try {
      const areas = await query(
        `
        SELECT *
        FROM Area
        ORDER BY areaId ASC;
        `
      );

      if (areas.rowCount === 0)
        throw new ServerError("There are no areas stored in the system", 404);
      else return areas.rows;
    } catch (err) {
      if (err instanceof ServerError) throw err;
      throw new ServerError("An error occurred while retrieving areas", 500);
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
  public static async removeCleaningTaskTemplateFromCleaningTaskTemplateList(
    cleaningTaskTemplateListId: number,
    cleaningTaskTemplateId: number
  ) {
    return await CleaningTaskTemplateList.removeCleaningTaskTemplate(
      cleaningTaskTemplateListId,
      cleaningTaskTemplateId
    );
  }

  /**
   * Deletes a cleaning task template list from the system.
   *
   * @param cleaningTaskTemplateListId The id of the cleaning task template list to delete.
   * @returns A string indicating succuss if the operation runs successfully.
   * @throws A server error if the operation fails or cleaningTaskTemplateId is not an integer.
   */
  public static async deleteCleaningTaskTemplateList(cleaningTaskTemplateListId: number) {
    return await CleaningTaskTemplateList.delete(cleaningTaskTemplateListId);
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
  public static async createCleaningTaskList(
    cleaningTaskTemplateListId: number,
    date: Date,
    staffMemberId?: number
  ) {
    return await CleaningTaskList.new(cleaningTaskTemplateListId, date, staffMemberId);
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
  public static async getCleaningTaskLists(): Promise<CleaningTaskLists_TYPE | ServerError> {
    try {
      const cleaningTaskLists = await query(
        `
        SELECT *
        FROM CleaningTaskList
        ORDER BY cleaningTaskListId ASC;
        `
      );

      if (cleaningTaskLists.rowCount === 0)
        throw new ServerError("There are no cleaning task lists stored in the system", 404);
      else return cleaningTaskLists.rows;
    } catch (err) {
      if (err instanceof ServerError) throw err;
      throw new ServerError("An error occurred while retrieving cleaning task lists", 500);
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
  public static async viewCleaningTaskList(
    cleaningTaskListId: number
  ): Promise<CleaningTaskList_TYPE | ServerError> {
    return await CleaningTaskList.getView(cleaningTaskListId);
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
  public static async addCleaningTaskToCleaningTaskList(
    cleaningTaskListId: number,
    cleaningTaskTemplateId?: number,
    cleaningTaskDescription?: string,
    areaDescription?: string,
    areaId?: number
  ): Promise<number> {
    return await CleaningTaskList.createCleaningTask(
      cleaningTaskListId,
      cleaningTaskTemplateId,
      cleaningTaskDescription,
      areaDescription,
      areaId
    );
  }

  /**
   * Deletes a cleaning task from the database.
   *
   * @param cleaningTaskId The id of the cleaning task to delete.
   * @returns a success message if the operation is successful.
   * @throws a ServerError if the operation fails or cleaningTaskId is not an integer.
   */
  public static async removeCleaningTaskFromCleaningTaskList(cleaningTaskId: number) {
    return await CleaningTask.delete(cleaningTaskId);
  }

  /**
   * Sets a cleaning tasks completed attribute to true.
   *
   * @param cleaningTaskListId
   * @param cleaningTaskId
   * @returns a string indicating success; otherwise a server error.
   */
  public static async markCleaningTaskAsComplete(
    cleaningTaskListId: number,
    cleaningTaskId: number
  ): Promise<string | ServerError> {
    if (typeof cleaningTaskListId !== "number")
      throw new ServerError("cleaningTaskListId must be an integer", 400);

    if (typeof cleaningTaskId !== "number")
      throw new ServerError("cleaningTaskId must be an integer", 400);

    try {
      const queryResult = await query(
        "SELECT cleaningTaskId, cleaningTaskListId FROM CleaningTask WHERE cleaningTaskId = $1 AND cleaningTaskListId = $2;",
        [cleaningTaskId, cleaningTaskListId]
      );

      if (queryResult.rowCount === 0)
        throw new ServerError(
          "The cleaning task specified is not part of the cleaning task list specified",
          404
        );

      return await CleaningTaskList.markCleaningTaskAsComplete(cleaningTaskId);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      throw new ServerError("An unexpected error occurred", 500);
    }
  }

  /**
   * Sets a cleaning tasks completed attribute to false.
   *
   * @param cleaningTaskListId
   * @param cleaningTaskId
   * @returns a string indicating success; otherwise a server error.
   */
  public static async markCleaningTaskAsIncomplete(
    cleaningTaskListId: number,
    cleaningTaskId: number
  ): Promise<string | ServerError> {
    if (typeof cleaningTaskListId !== "number")
      throw new ServerError("cleaningTaskListId must be an integer", 400);

    if (typeof cleaningTaskId !== "number")
      throw new ServerError("cleaningTaskId must be an integer", 400);

    try {
      const queryResult = await query(
        "SELECT cleaningTaskId, cleaningTaskListId FROM CleaningTask WHERE cleaningTaskId = $1 AND cleaningTaskListId = $2;",
        [cleaningTaskId, cleaningTaskListId]
      );

      if (queryResult.rowCount === 0)
        throw new ServerError(
          "The cleaning task specified is not part of the cleaning task list specified",
          404
        );

      return await CleaningTaskList.markCleaningTaskAsIncomplete(cleaningTaskId);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      throw new ServerError("An unexpected error occurred", 500);
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
  public static async signOffCleaningTaskListManager(
    cleaningTaskListId: number,
    signature: string
  ): Promise<string> {
    return await CleaningTaskList.setManagerSignature(cleaningTaskListId, signature);
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
  public static async signOffCleaningTaskListStaffMember(
    cleaningTaskListId: number,
    signature: string
  ): Promise<string> {
    return await CleaningTaskList.setStaffMemberSignature(cleaningTaskListId, signature);
  }

  /**
   * Deletes a cleaning task list from the database.
   *
   * @param cleaningTaskListId The id of the cleaning task list to delete.
   * @returns A success message if the operation is successful.
   * @throws A server error if the operation fails or cleaningTaskListId is not an integer.
   */
  public static async deleteCleaningTaskList(cleaningTaskListId: number) {
    return await CleaningTaskList.delete(cleaningTaskListId);
  }

  /**
   * Returns the cleaning tasks linked to the cleaning task list specified.
   *
   * @param cleaningTaskListId The id of the cleaning task list.
   * @returns The cleaning tasks linked to the cleaning task list.
   * @throws A ServerError if the query fails or cleaningTaskListId is not a number.
   */
  public static async getCleaningTasks(
    cleaningTaskListId: number
  ): Promise<Array<CleaningTaskWithArea>> {
    return await CleaningTaskList.getCleaningTasks(cleaningTaskListId);
  }

  /**
   * Returns the cleaning task templates linked to the cleaning task template list specified.
   *
   * @param cleaningTaskTemplateListId The id of the cleaning task list template.
   * @returns The cleaning task templates linked to the cleaning task template list.
   * @throws A ServerError if the query fails or cleaningTaskTemplateListId id is not a number.
   */
  public static async getCleaningTaskTemplatesFromCleaningTaskTemplateList(
    cleaningTaskTemplateListId: number
  ) {
    return await CleaningTaskTemplateList.getCleaningTaskTemplatesFromCleaningTaskTemplateList(
      cleaningTaskTemplateListId
    );
  }

  /**
   * Gets the payroll number, first name and surname of each staff member from AWS Cognito.
   *
   * @returns The payroll number, first name and surname of each staff member.
   * @throws A ServerError if the operation fails.
   */
  public static async getStaffMembers() {
    return await StaffMember.getStaffMembers();
  }

  /**
   * Assigns a staff member to a cleaning task list.
   *
   * @param cleaningTaskListId The id of the cleaning task list.
   * @param staffMemberId The id of the staff member.
   * @returns A string indicating success if the query runs successfully.
   * @throws A ServerError if the query fails or invalid parameters are supplied.
   */
  public static async assignStaffMemberToCleaningTaskList(
    cleaningTaskListId: number,
    staffMemberId: number
  ): Promise<string> {
    return await CleaningTaskList.assignStaffMember(cleaningTaskListId, staffMemberId);
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
  public static async createCleaningTaskTemplate(
    cleaningTaskTemplateDescription: string,
    areaId?: number,
    areaDescription?: string
  ) {
    return await CleaningTaskTemplateList.createCleaningTaskTemplate(
      cleaningTaskTemplateDescription,
      undefined,
      areaId,
      areaDescription
    );
  }
}

export default LCMS_Cleaning;
