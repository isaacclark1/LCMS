import axios from "axios";
import {
  CleaningTaskLists,
  CleaningTaskList,
  CleaningTasks,
  CleaningTask,
  AddCleaningTaskResponse,
  CleaningTaskTemplate,
  CleaningTaskTemplates,
  Areas,
  Area,
  CleaningTaskTemplateList,
  CleaningTaskTemplateLists,
  StaffMember,
  StaffMembers,
  CleaningTaskListId,
  GetCleaningTaskList,
  GetCleaningTaskTemplateList,
  CreateCleaningTaskTemplateListResponse,
  CreateCleaningTaskTemplateResponse,
} from "./types";
import ServerError from "./ServerError";
import { fetchAuthSession } from "aws-amplify/auth";

const base = "";

/**
 * Retrieves the cognito issued access token.
 */
const getAccessToken = async (): Promise<string> => {
  try {
    const session = await fetchAuthSession();

    const token = session.tokens?.accessToken.toString();

    if (!token) {
      throw new ServerError("Access token not found. User is not authenticated", 401);
    }

    return token;
  } catch (error) {
    throw error;
  }
};

/**
 * Gets the type of user from amazon cognito.
 * @returns A promise resolving to "Manager" if the user is a manager or "StaffMember" if the user is a staff member.
 */
export const getUserGroup = async (): Promise<"Manager" | "StaffMember"> => {
  try {
    const session = await fetchAuthSession();

    const payload = session.tokens?.accessToken.payload;

    if (payload && typeof payload === "object") {
      const groups = payload["cognito:groups"] as Array<string>;

      if (Array.isArray(groups) && groups.length > 0) {
        const group = groups[0];

        if (group === "Manager") return "Manager";
        else if (group === "StaffMember") return "StaffMember";
      }
    }

    throw new Error("User is not part of a valid group");
  } catch (error) {
    console.error(error);
    return "StaffMember";
  }
};

/**
 * Gets the cleaning task lists from the server.
 * @returns The cleaning task lists.
 * @throws An AxiosError if the request fails.
 */
export const getCleaningTaskLists = async (): Promise<Array<CleaningTaskList>> => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get<CleaningTaskLists>(`${base}/ui/cleaningTaskLists`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.cleaningTaskLists;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Gets the cleaning tasks that are linked to the cleaning task list specified.
 * @param cleaningTaskListId The id of the cleaning task list.
 * @returns An array containing the cleaning tasks.
 * @throws An AxiosError if the request fails.
 */
export const getCleaningTasks = async (
  cleaningTaskListId: number
): Promise<Array<CleaningTask>> => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get<CleaningTasks>(
      `${base}/ui/cleaningTasks/${cleaningTaskListId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.cleaningTasks;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Marks a cleaning task as complete.
 * @param cleaningTaskListId The id of the cleaning task list which contains the cleaning task.
 * @param cleaningTaskId The id of the cleaning task to mark as complete.
 * @returns A string indicating success if the update is successful
 */
export const markCleaningTaskAsComplete = async (
  cleaningTaskListId: number,
  cleaningTaskId: number
): Promise<string> => {
  try {
    const accessToken = await getAccessToken();

    const updateData = { cleaningTaskListId, cleaningTaskId };

    const response = await axios.patch<string>(`${base}/uc3/complete`, updateData, {
      headers: {
        Authorization: `Bearer: ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Marks a cleaning task as incomplete.
 * @param cleaningTaskListId The id of the cleaning task list which contains the cleaning task.
 * @param cleaningTaskId The id of the cleaning task to mark as incomplete.
 * @returns A string indicating success if the update is successful
 */
export const markCleaningTaskAsIncomplete = async (
  cleaningTaskListId: number,
  cleaningTaskId: number
): Promise<string> => {
  try {
    const accessToken = await getAccessToken();

    const updateData = { cleaningTaskListId, cleaningTaskId };

    const response = await axios.patch<string>(`${base}/uc3/incomplete`, updateData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Adds a cleaning task to a cleaning task list.
 *
 * Valid combinations: cleaningTaskListId & cleaningTaskTemplateId.
 *                     cleaningTaskListId & cleaningTaskDescription & areaId.
 *                     cleaningTaskListId & cleaningTaskDescription & areaDescription.
 *
 * @param cleaningTaskListId The id of the cleaning task list to add the cleaning task to.
 * @param cleaningTaskTemplateId The id of the cleaning task template to use as a template for the new cleaning task OPTIONAL.
 * @param cleaningTaskDescription The description of the new cleaning task OPTIONAL.
 * @param areaDescription The description of the new area to link to the new cleaning task OPTIONAL.
 * @param areaId The id of the area to link to the new cleaning task.
 * @returns The id of the new cleaning task.
 * @throws An error if the service throws an error.
 */
export const addCleaningTaskToCleaningTaskList = async (
  cleaningTaskListId: number,
  cleaningTaskTemplateId?: number,
  cleaningTaskDescription?: string,
  areaDescription?: string,
  areaId?: number
): Promise<number> => {
  try {
    const accessToken = await getAccessToken();

    const postData = {
      cleaningTaskListId,
      cleaningTaskTemplateId,
      cleaningTaskDescription,
      areaDescription,
      areaId,
    };

    const response = await axios.post<AddCleaningTaskResponse>(`${base}/uc5`, postData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.cleaningTaskId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Gets the cleaning task templates from the service.
 *
 * @returns The cleaning task templates from the service.
 */
export const getCleaningTaskTemplates = async (): Promise<Array<CleaningTaskTemplate>> => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get<CleaningTaskTemplates>(`${base}/ui/cleaningTaskTemplates`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.cleaningTaskTemplates;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Gets the leisure centre areas from the service.
 *
 * @returns The areas from the service.
 */
export const getAreas = async (): Promise<Array<Area>> => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get<Areas>(`${base}/ui/areas`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.areas;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Deletes a cleaning task from the system.
 *
 * @param cleaningTaskId The id of the cleaning task to delete.
 */
export const removeCleaningTaskFromCleaningTaskList = async (
  cleaningTaskId: number
): Promise<void> => {
  try {
    const accessToken = await getAccessToken();

    await axios.delete(`${base}/uc6/${cleaningTaskId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteCleaningTaskList = async (cleaningTaskListId: number): Promise<void> => {
  try {
    const accessToken = await getAccessToken();

    await axios.delete(`${base}/uc10/${cleaningTaskListId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCleaningTaskTemplateLists = async (): Promise<Array<CleaningTaskTemplateList>> => {
  try {
    const accessToken = await getAccessToken();

    const cleaningTaskTemplateLists = await axios.get<CleaningTaskTemplateLists>(
      `${base}/ui/cleaningTaskTemplateLists`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return cleaningTaskTemplateLists.data.cleaningTaskTemplateLists;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCleaningTaskTemplatesFromCleaningTaskTemplateList = async (
  cleaningTaskTemplateListId: number
): Promise<Array<CleaningTaskTemplate>> => {
  try {
    const accessToken = await getAccessToken();

    const cleaningTaskTemplates = await axios.get<CleaningTaskTemplates>(
      `${base}/ui/cleaningTaskTemplates/${cleaningTaskTemplateListId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return cleaningTaskTemplates.data.cleaningTaskTemplates;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getStaffMembers = async (): Promise<Array<StaffMember>> => {
  try {
    const accessToken = await getAccessToken();

    const staffMembers = await axios.get<StaffMembers>(`${base}/ui/staffMembers`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return staffMembers.data.staffMembers;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createCleaningTaskList = async (
  cleaningTaskTemplateListId: number,
  date: string,
  staffMemberId?: number
): Promise<number> => {
  const postData = {
    cleaningTaskTemplateListId,
    date,
    staffMemberId,
  };

  try {
    const accessToken = await getAccessToken();

    const cleaningTaskListId = await axios.post<CleaningTaskListId>(`${base}/uc9`, postData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return cleaningTaskListId.data.cleaningTaskListId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signOffCleaningTaskListManager = async (
  cleaningTaskListId: number,
  signature: string
): Promise<string> => {
  const patchData = {
    cleaningTaskListId,
    signature,
  };

  try {
    const accessToken = await getAccessToken();

    const returnData = await axios.patch<string>(`${base}/uc4/manager`, patchData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return returnData.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signOffCleaningTaskListStaffMember = async (
  cleaningTaskListId: number,
  signature: string
): Promise<string> => {
  const patchData = {
    cleaningTaskListId,
    signature,
  };

  try {
    const accessToken = await getAccessToken();

    const returnData = await axios.patch<string>(`${base}/uc4/staffMember`, patchData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return returnData.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const assignStaffMemberToCleaningTaskList = async (
  cleaningTaskListId: number,
  staffMemberId: number
): Promise<string> => {
  const patchData = {
    cleaningTaskListId,
    staffMemberId,
  };

  try {
    const accessToken = await getAccessToken();

    const returnData = await axios.patch<string>(`${base}/uc13`, patchData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return returnData.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCleaningTaskList = async (
  cleaningTaskListId: number
): Promise<CleaningTaskList> => {
  try {
    const accessToken = await getAccessToken();

    const cleaningTaskList = await axios.get<GetCleaningTaskList>(
      `${base}/uc1/${cleaningTaskListId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return cleaningTaskList.data.cleaningTaskList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCleaningTaskTemplateList = async (
  cleaningTaskTemplateListId: number
): Promise<CleaningTaskTemplateList> => {
  try {
    const accessToken = await getAccessToken();

    const cleaningTaskTemplateList = await axios.get<GetCleaningTaskTemplateList>(
      `${base}/uc2/${cleaningTaskTemplateListId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return cleaningTaskTemplateList.data.cleaningTaskTemplateList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteCleaningTaskTemplateList = async (
  cleaningTaskTemplateListId: number
): Promise<string> => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.delete<string>(`${base}/uc12/${cleaningTaskTemplateListId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createCleaningTaskTemplateList = async (
  title: string,
  cleaningTaskTemplates: Array<number>
): Promise<number> => {
  try {
    const accessToken = await getAccessToken();

    const postData = { title, cleaningTaskTemplates };

    const response = await axios.post<CreateCleaningTaskTemplateListResponse>(
      `${base}/uc11`,
      postData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.cleaningTaskTemplateListId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createCleaningTaskTemplate = async (
  cleaningTaskTemplateDescription: string,
  areaId?: number,
  areaDescription?: string
): Promise<number> => {
  try {
    const accessToken = await getAccessToken();

    const postData = {
      cleaningTaskTemplateDescription,
      areaId,
      areaDescription,
    };

    const response = await axios.post<CreateCleaningTaskTemplateResponse>(
      `${base}/uc14`,
      postData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.cleaningTaskTemplateId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addCleaningTaskTemplateToCleaningTaskTemplateList = async (
  cleaningTaskTemplateListId: number,
  cleaningTaskTemplateId?: number,
  cleaningTaskTemplateDescription?: string,
  areaId?: number,
  areaDescription?: string
): Promise<string | number> => {
  const postData = {
    cleaningTaskTemplateListId,
    cleaningTaskTemplateId,
    cleaningTaskTemplateDescription,
    areaId,
    areaDescription,
  };

  try {
    const accessToken = await getAccessToken();

    const response = await axios.post<{ response: string | number }>(`${base}/uc8`, postData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const removeCleaningTaskTemplateFromCleaningTaskTemplateList = async (
  cleaningTaskTemplateListId: number,
  cleaningTaskTemplateId: number
): Promise<string> => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.delete<{ successMessage: string }>(
      `${base}/uc7/${cleaningTaskTemplateListId}/${cleaningTaskTemplateId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.successMessage;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createArea = async (description: string): Promise<number> => {
  const postData = { description };

  try {
    const accessToken = await getAccessToken();

    const response = await axios.post<{ areaId: number }>(`${base}/uc15`, postData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.areaId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteArea = async (id: number): Promise<string> => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.delete<{ successMessage: string }>(`${base}/uc16/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.successMessage;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
