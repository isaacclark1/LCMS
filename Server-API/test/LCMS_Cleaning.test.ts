import LCMS_Cleaning from "../src/Cleaning/API/LCMS_Cleaning";
import ServerError from "../ServerError";
import { query } from "../src/Cleaning/db/dbconnection";
import {
  CleaningTaskTemplateList_TYPE,
  CleaningTaskTemplateLists_TYPE,
  CleaningTaskTemplates_TYPE,
  CleaningTaskTemplate_TYPE,
  Area_TYPE,
  CleaningTaskList_TYPE,
  CleaningTasks_TYPE,
} from "../types";
import CleaningTaskList from "../src/Cleaning/API/CleaningTaskList";
import CleaningTask from "../src/Cleaning/API/CleaningTask";
import CleaningTaskTemplateList from "../src/Cleaning/API/CleaningTaskTemplateList";

// Mock the query function so outputs can be controlled.
jest.mock("../src/Cleaning/db/dbconnection", () => ({
  query: jest.fn(),
}));

describe("LCMS_Cleaning", () => {
  // clear mock calls and instances after each test.
  afterEach(() => jest.clearAllMocks());

  describe("getCleaningTaskTemplateLists()", () => {
    test("Throws a server error indicating that no cleaning task template lists are stored in the database when there are no cleaning task template lists stored in the database", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: [],
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(LCMS_Cleaning.getCleaningTaskTemplateLists()).rejects.toThrow(ServerError);
      await expect(LCMS_Cleaning.getCleaningTaskTemplateLists()).rejects.toEqual(
        expect.objectContaining({
          message: "There are no cleaning task template lists stored in the system",
          statusCode: 404,
        })
      );
    });

    test("Should return all cleaning task template lists stored in the database", async () => {
      const mockData = [
        { cleaningtasktemplatelistid: 1, title: "Mondays AM" },
        { cleaningtasktemplatelistid: 2, title: "Tuesdays AM" },
      ];

      (query as jest.Mock).mockResolvedValue({
        rowCount: 2,
        rows: [
          { cleaningtasktemplatelistid: 1, title: "Mondays AM" },
          { cleaningtasktemplatelistid: 2, title: "Tuesdays AM" },
        ],
        command: "",
        oid: 0,
        fields: [],
      });

      const result = await LCMS_Cleaning.getCleaningTaskTemplateLists();

      expect(result).toBeInstanceOf(Array<CleaningTaskTemplateList_TYPE>);
      expect(result).toEqual(mockData);
    });

    test("Throws a server error when the query fails", async () => {
      (query as jest.Mock).mockRejectedValue(Error);

      await expect(LCMS_Cleaning.getCleaningTaskTemplateLists()).rejects.toThrow(ServerError);
      await expect(LCMS_Cleaning.getCleaningTaskTemplateLists()).rejects.toEqual(
        expect.objectContaining({
          message: "An error occurred while retrieving cleaning task template lists",
          statusCode: 500,
        })
      );
    });
  });

  describe("getCleaningTaskTemplates()", () => {
    test("Throws a server error indicating that no cleaning task templates are stored in the system when there are no cleaning task templates stored in the database", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: [],
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(LCMS_Cleaning.getCleaningTaskTemplates()).rejects.toThrow(ServerError);
      await expect(LCMS_Cleaning.getCleaningTaskTemplates()).rejects.toEqual(
        expect.objectContaining({
          message: "There are no cleaning task templates stored in the system",
          statusCode: 404,
        })
      );
    });

    test("Should return all cleaning task templates stored in the system's database", async () => {
      const mockData = [
        { cleaningtasktemplateid: 1, _description: "Hoover floor", areaid: 1 },
        { cleaningtasktemplateid: 2, _description: "Clean skirting boards", areaid: 1 },
        { cleaningtasktemplateid: 3, _description: "Hoover floor", areaid: 2 },
      ];

      (query as jest.Mock).mockResolvedValue({
        rowCount: 3,
        rows: mockData,
        command: "",
        oid: 0,
        fields: [],
      });

      const result = await LCMS_Cleaning.getCleaningTaskTemplates();

      expect(result).toEqual(mockData);
      expect(result).toBeInstanceOf(Array<CleaningTaskTemplate_TYPE>);
    });

    test("Throws a server error when the query fails", async () => {
      (query as jest.Mock).mockRejectedValue(Error);

      await expect(LCMS_Cleaning.getCleaningTaskTemplates()).rejects.toThrow(ServerError);
      await expect(LCMS_Cleaning.getCleaningTaskTemplates()).rejects.toEqual(
        expect.objectContaining({
          message: "An error occurred while retrieving cleaning task templates",
          statusCode: 500,
        })
      );
    });
  });

  describe("getAreas()", () => {
    test("Throws a server error indicating that no areas are found in the system when there are no areas stored in the database", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: [],
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(LCMS_Cleaning.getAreas()).rejects.toThrow(ServerError);
      await expect(LCMS_Cleaning.getAreas()).rejects.toEqual(
        expect.objectContaining({
          message: "There are no areas stored in the system",
          statusCode: 404,
        })
      );
    });

    test("Should return all areas in the system database", async () => {
      const mockData = [
        { areaid: 1, _description: "Lobby" },
        { areaid: 2, _description: "Conference Room" },
      ];

      (query as jest.Mock).mockResolvedValue({
        rowCount: 2,
        rows: mockData,
        command: "",
        oid: 0,
        fields: [],
      });

      const result = await LCMS_Cleaning.getAreas();

      expect(result).toEqual(mockData);
      expect(result).toBeInstanceOf(Array<Area_TYPE>);
    });

    test("Throws a sever error when the query fails", async () => {
      (query as jest.Mock).mockRejectedValue(Error);

      await expect(LCMS_Cleaning.getAreas()).rejects.toThrow(ServerError);
      await expect(LCMS_Cleaning.getAreas()).rejects.toEqual(
        expect.objectContaining({
          message: "An error occurred while retrieving areas",
          statusCode: 500,
        })
      );
    });
  });

  describe("getCleaningTaskLists()", () => {
    test("Throws a server error indicating that there are no cleaning tasks lists stored in the database when there are no cleaning task lists stored in the database", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: [],
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(LCMS_Cleaning.getCleaningTaskLists()).rejects.toThrow(ServerError);
      await expect(LCMS_Cleaning.getCleaningTaskLists()).rejects.toEqual(
        expect.objectContaining({
          message: "There are no cleaning task lists stored in the system",
          statusCode: 404,
        })
      );
    });

    test("Should return all cleaning task lists stored in the database", async () => {
      const mockData: Array<CleaningTaskList_TYPE> = [
        {
          cleaningtasklistid: 1,
          _date: new Date("2023-06-16T23:00:00.000Z"),
          managersignature: null,
          staffmembersignature: null,
          staffmemberid: 1,
        },
        {
          cleaningtasklistid: 2,
          _date: new Date("2023-06-17T23:00:00.000Z"),
          managersignature: "Manager A",
          staffmembersignature: "Staff B",
          staffmemberid: 2,
        },
      ];

      (query as jest.Mock).mockResolvedValue({
        rowCount: 2,
        rows: mockData,
        command: "",
        oid: 0,
        fields: [],
      });

      const result = await LCMS_Cleaning.getCleaningTaskLists();

      expect(result).toBeInstanceOf(Array<CleaningTaskList_TYPE>);
      expect(result as Array<CleaningTaskList_TYPE>).toEqual(mockData);
    });

    test("Throws a server error when the query fails", async () => {
      (query as jest.Mock).mockRejectedValue(Error);

      await expect(LCMS_Cleaning.getCleaningTaskLists()).rejects.toThrow(ServerError);
      await expect(LCMS_Cleaning.getCleaningTaskLists()).rejects.toEqual(
        expect.objectContaining({
          message: "An error occurred while retrieving cleaning task lists",
          statusCode: 500,
        })
      );
    });
  });

  describe("viewCleaningTaskList()", () => {
    test("Throws a server error when the cleaningTaskListId is not a number", async () => {
      await expect(LCMS_Cleaning.viewCleaningTaskList("test" as any)).rejects.toThrow(ServerError);
      await expect(LCMS_Cleaning.viewCleaningTaskList("test" as any)).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskListId must be a number",
          statusCode: 400,
        })
      );
    });

    test("Returns the cleaning task list with the id provided", async () => {
      const mockData: Array<CleaningTaskList_TYPE> = [
        {
          cleaningtasklistid: 1,
          _date: new Date("2023-06-16T23:00:00.000Z"),
          managersignature: null,
          staffmembersignature: null,
          staffmemberid: 1,
        },
        {
          cleaningtasklistid: 2,
          _date: new Date("2023-06-17T23:00:00.000Z"),
          managersignature: "Manager A",
          staffmembersignature: "Staff B",
          staffmemberid: 2,
        },
      ];

      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: mockData,
        command: "",
        oid: 0,
        fields: [],
      });

      const result = await LCMS_Cleaning.viewCleaningTaskList(1);

      expect(result).toEqual(mockData[0]);
    });

    test("Throws a server error when no cleaning task list with the provided id exists", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: [],
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(LCMS_Cleaning.viewCleaningTaskList(1)).rejects.toThrow(ServerError);
      await expect(LCMS_Cleaning.viewCleaningTaskList(1)).rejects.toEqual(
        expect.objectContaining({
          message: "There are no cleaning task lists stored in the system",
          statusCode: 404,
        })
      );
    });

    test("Returns a server error when the query fails or another error occurs", async () => {
      (query as jest.Mock).mockRejectedValue(Error);

      await expect(LCMS_Cleaning.viewCleaningTaskList(1)).rejects.toThrow(ServerError);
      await expect(LCMS_Cleaning.viewCleaningTaskList(1)).rejects.toEqual(
        expect.objectContaining({
          message: "An error occurred while retrieving the cleaning task list",
          statusCode: 500,
        })
      );
    });
  });

  describe("viewCleaningTaskTemplateList()", () => {
    test("Throws a server error when the cleaningTaskTemplateListId is not a number", async () => {
      await expect(LCMS_Cleaning.viewCleaningTaskTemplateList("test" as any)).rejects.toThrow(
        ServerError
      );
      await expect(LCMS_Cleaning.viewCleaningTaskTemplateList("test" as any)).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskTemplateListId must be a number",
          statusCode: 400,
        })
      );
    });

    test("Returns the cleaning task list template list with the id of cleaningTaskTemplateListId", async () => {
      const mockData = [
        { cleaningtasktemplatelistid: 1, title: "Mondays AM" },
        { cleaningtasktemplatelistid: 2, title: "Tuesdays AM" },
      ];

      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [mockData[1]],
        command: "",
        oid: 0,
        fields: [],
      });

      const result = await LCMS_Cleaning.viewCleaningTaskTemplateList(2);

      expect(result as CleaningTaskTemplateList_TYPE).toEqual({
        cleaningtasktemplatelistid: 2,
        title: "Tuesdays AM",
      });
    });

    test("Throws a server error when there is no cleaning task template list with the id provided", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: [],
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(LCMS_Cleaning.viewCleaningTaskTemplateList(4)).rejects.toThrow(ServerError);
      await expect(LCMS_Cleaning.viewCleaningTaskTemplateList(4)).rejects.toEqual(
        expect.objectContaining({
          message: "There are no cleaning task template lists with the id of 4",
          statusCode: 404,
        })
      );
    });

    test("Returns a server error if the query fails", async () => {
      (query as jest.Mock).mockRejectedValue(Error);

      await expect(LCMS_Cleaning.viewCleaningTaskTemplateList(3)).rejects.toThrow(ServerError);
      await expect(LCMS_Cleaning.viewCleaningTaskTemplateList(3)).rejects.toEqual(
        expect.objectContaining({
          message: "An error occurred while retrieving the cleaning task template list",
          statusCode: 500,
        })
      );
    });
  });

  describe("markCleaningTaskAsComplete()", () => {
    test("Throws a server error when cleaningTaskListId is not a number", async () => {
      await expect(LCMS_Cleaning.markCleaningTaskAsComplete("test" as any, 1)).rejects.toThrow(
        ServerError
      );
      await expect(LCMS_Cleaning.markCleaningTaskAsComplete("test" as any, 1)).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskListId must be an integer",
          statusCode: 400,
        })
      );
    });

    test("Throws an error when cleaningTaskId is not a number", async () => {
      await expect(LCMS_Cleaning.markCleaningTaskAsComplete(1, "test" as any)).rejects.toThrow(
        ServerError
      );
      await expect(LCMS_Cleaning.markCleaningTaskAsComplete(1, "test" as any)).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskId must be an integer",
          statusCode: 400,
        })
      );
    });

    test("Throws a server error when the query fails", async () => {
      (query as jest.Mock).mockRejectedValue(Error);

      await expect(LCMS_Cleaning.markCleaningTaskAsComplete(1, 1)).rejects.toThrow(ServerError);
      await expect(LCMS_Cleaning.markCleaningTaskAsComplete(1, 1)).rejects.toEqual(
        expect.objectContaining({
          message: "An unexpected error occurred",
          statusCode: 500,
        })
      );
    });

    test("Throws a server error when the cleaning task list specified does not contain the cleaning task specified", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: [],
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(LCMS_Cleaning.markCleaningTaskAsComplete(1, 1)).rejects.toThrow(ServerError);
      await expect(LCMS_Cleaning.markCleaningTaskAsComplete(1, 1)).rejects.toEqual(
        expect.objectContaining({
          message: "The cleaning task specified is not part of the cleaning task list specified",
          statusCode: 404,
        })
      );
    });

    test("Returns a string indicating that the update was successful when valid parameters are supplied", async () => {
      const mockData: CleaningTasks_TYPE = [
        {
          cleaningtaskid: 5,
          _description: "Mop corridor",
          completed: false,
          cleaningtasklistid: 6,
          areaid: 7,
        },
      ];

      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: mockData,
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(LCMS_Cleaning.markCleaningTaskAsComplete(5, 6)).resolves.toEqual(
        "update successful"
      );
    });
  });

  describe("markCleaningTaskAsIncomplete()", () => {
    test("Throws a server error when cleaningTaskListId is not a number", async () => {
      await expect(LCMS_Cleaning.markCleaningTaskAsIncomplete("test" as any, 1)).rejects.toThrow(
        ServerError
      );
      await expect(LCMS_Cleaning.markCleaningTaskAsIncomplete("test" as any, 1)).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskListId must be an integer",
          statusCode: 400,
        })
      );
    });

    test("Throws an error when cleaningTaskId is not a number", async () => {
      await expect(LCMS_Cleaning.markCleaningTaskAsIncomplete(1, "test" as any)).rejects.toThrow(
        ServerError
      );
      await expect(LCMS_Cleaning.markCleaningTaskAsIncomplete(1, "test" as any)).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskId must be an integer",
          statusCode: 400,
        })
      );
    });

    test("Throws a server error when the query fails", async () => {
      (query as jest.Mock).mockRejectedValue(Error);

      await expect(LCMS_Cleaning.markCleaningTaskAsIncomplete(1, 1)).rejects.toThrow(ServerError);
      await expect(LCMS_Cleaning.markCleaningTaskAsIncomplete(1, 1)).rejects.toEqual(
        expect.objectContaining({
          message: "An unexpected error occurred",
          statusCode: 500,
        })
      );
    });

    test("Throws a server error when the cleaning task list specified does not contain the cleaning task specified", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: [],
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(LCMS_Cleaning.markCleaningTaskAsIncomplete(1, 1)).rejects.toThrow(ServerError);
      await expect(LCMS_Cleaning.markCleaningTaskAsIncomplete(1, 1)).rejects.toEqual(
        expect.objectContaining({
          message: "The cleaning task specified is not part of the cleaning task list specified",
          statusCode: 404,
        })
      );
    });

    test("Returns a string indicating that the update was successful when valid parameters are supplied", async () => {
      const mockData: CleaningTasks_TYPE = [
        {
          cleaningtaskid: 5,
          _description: "Mop corridor",
          completed: true,
          cleaningtasklistid: 6,
          areaid: 7,
        },
      ];

      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: mockData,
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(LCMS_Cleaning.markCleaningTaskAsIncomplete(5, 6)).resolves.toEqual(
        "update successful"
      );
    });
  });

  describe("signOffCleaningTaskListManager()", () => {
    test("Returns the result of calling CleaningTaskList.setManagerSignature", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [],
        command: "",
        oid: 0,
        fields: [],
      });

      jest.spyOn(CleaningTaskList, "setManagerSignature").mockResolvedValue("update successful");

      await expect(LCMS_Cleaning.signOffCleaningTaskListManager(1, "test")).resolves.toEqual(
        "update successful"
      );
    });
  });

  describe("signOffCleaningTaskListStaffMember()", () => {
    test("Returns the result of calling CleaningTaskList.setStaffMemberSignature", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [],
        command: "",
        oid: 0,
        fields: [],
      });

      jest
        .spyOn(CleaningTaskList, "setStaffMemberSignature")
        .mockResolvedValue("update successful");

      await expect(LCMS_Cleaning.signOffCleaningTaskListStaffMember(1, "test")).resolves.toEqual(
        "update successful"
      );
    });
  });

  describe("addCleaningTaskToCleaningTaskList()", () => {
    test("Returns the result of calling CleaningTaskList.createCleaningTask", async () => {
      jest.spyOn(CleaningTaskList, "createCleaningTask").mockResolvedValue(33);

      await expect(
        LCMS_Cleaning.addCleaningTaskToCleaningTaskList(3, 5, undefined, undefined, undefined)
      ).resolves.toEqual(33);
    });
  });

  describe("removeCleaningTaskFromCleaningTasks()", () => {
    test("Returns the result of calling CleaningTask.delete", async () => {
      jest.spyOn(CleaningTask, "delete").mockResolvedValue("deletion successful");

      await expect(LCMS_Cleaning.removeCleaningTaskFromCleaningTaskList(5)).resolves.toEqual(
        "deletion successful"
      );
    });
  });

  describe("removeCleaningTaskTemplateFromCleaningTaskTemplateList()", () => {
    test("Returns the result of calling CleaningTaskTemplateList.removeCleaningTaskTemplate", async () => {
      jest
        .spyOn(CleaningTaskTemplateList, "removeCleaningTaskTemplate")
        .mockResolvedValue("removal successful");

      await expect(
        LCMS_Cleaning.removeCleaningTaskTemplateFromCleaningTaskTemplateList(5, 5)
      ).resolves.toEqual("removal successful");
    });
  });

  describe("addCleaningTaskTemplateToCleaningTaskTemplateList()", () => {
    test("Returns the result of calling CleaningTaskTemplateList.addCleaningTaskTemplate", async () => {
      jest
        .spyOn(CleaningTaskTemplateList, "addCleaningTaskTemplate")
        .mockResolvedValue("cleaning task template added successfully");

      await expect(
        LCMS_Cleaning.addCleaningTaskTemplateToCleaningTaskTemplateList(
          1,
          2,
          undefined,
          undefined,
          undefined
        )
      ).resolves.toBe("cleaning task template added successfully");
    });

    test("Returns the result of calling CleaningTaskTemplateList.createCleaningTaskTemplate", async () => {
      jest.spyOn(CleaningTaskTemplateList, "createCleaningTaskTemplate").mockResolvedValue(10);

      await expect(
        LCMS_Cleaning.addCleaningTaskTemplateToCleaningTaskTemplateList(
          4,
          undefined,
          "test",
          5,
          undefined
        )
      ).resolves.toBe(10);
    });
  });

  describe("createCleaningTaskList()", () => {
    test("Returns the result of calling CleaningTaskList.new", async () => {
      jest.spyOn(CleaningTaskList, "new").mockResolvedValue(3);

      await expect(
        LCMS_Cleaning.createCleaningTaskList(1, new Date("2025-01-01"), undefined)
      ).resolves.toBe(3);
    });
  });

  describe("deleteCleaningTaskList()", () => {
    test("Deletes a cleaning task list from the database", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
      });

      await expect(LCMS_Cleaning.deleteCleaningTaskList(5)).resolves.toBe("deletion successful");
    });
  });

  describe("createCleaningTaskTemplateList()", () => {
    test("Returns the result of calling CleaningTaskTemplateList.new", async () => {
      jest.spyOn(CleaningTaskTemplateList, "new").mockResolvedValue(4);

      await expect(LCMS_Cleaning.createCleaningTaskTemplateList("test")).resolves.toBe(4);
    });
  });

  describe("deleteCleaningTaskTemplateList()", () => {
    test("Returns the result of calling CleaningTaskTemplateList.delete", async () => {
      jest.spyOn(CleaningTaskTemplateList, "delete").mockResolvedValue("deletion successful");

      await expect(LCMS_Cleaning.deleteCleaningTaskTemplateList(5)).resolves.toBe(
        "deletion successful"
      );
    });
  });
});
