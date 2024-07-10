import CleaningTaskList from "../src/Cleaning/API/CleaningTaskList";
import ServerError from "../ServerError";
import { executeTransaction, query } from "../src/Cleaning/db/dbconnection";
import { CleaningTaskList_TYPE } from "../types";
import CleaningTask from "../src/Cleaning/API/CleaningTask";
import CleaningTaskTemplate from "../src/Cleaning/API/CleaningTaskTemplate";
import CleaningTaskTemplateList from "../src/Cleaning/API/CleaningTaskTemplateList";

// Mock the query function so that it's return values can be controlled.
jest.mock("../src/Cleaning/db/dbconnection", () => ({
  query: jest.fn(),
  executeTransaction: jest.fn(),
}));

describe("CleaningTaskList", () => {
  // clear mock calls and instances after each test.
  afterEach(() => jest.restoreAllMocks());

  describe("getView()", () => {
    test("Throws a server error when the cleaningTaskListId is not a number", async () => {
      await expect(CleaningTaskList.getView("hello" as any)).rejects.toThrow(ServerError);

      await expect(CleaningTaskList.getView("hello" as any)).rejects.toEqual(
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

      const result = await CleaningTaskList.getView(1);

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

      await expect(CleaningTaskList.getView(1)).rejects.toThrow(ServerError);
      await expect(CleaningTaskList.getView(1)).rejects.toEqual(
        expect.objectContaining({
          message: "There are no cleaning task lists stored in the system",
          statusCode: 404,
        })
      );
    });

    test("Throws a server error when the query fails or another error occurs", async () => {
      (query as jest.Mock).mockRejectedValue(Error);

      await expect(CleaningTaskList.getView(1)).rejects.toThrow(ServerError);
      await expect(CleaningTaskList.getView(1)).rejects.toEqual(
        expect.objectContaining({
          message: "An error occurred while retrieving the cleaning task list",
          statusCode: 500,
        })
      );
    });
  });

  describe("markCleaningTaskAsComplete()", () => {
    test("Throws a server error if cleaningTaskId is not a number", async () => {
      await expect(CleaningTaskList.markCleaningTaskAsComplete("test" as any)).rejects.toThrow(
        ServerError
      );
      await expect(CleaningTaskList.markCleaningTaskAsComplete("test" as any)).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskId must be a number",
          statusCode: 400,
        })
      );
    });

    test("Throws a server error when the cleaning task does not exist", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: [],
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(CleaningTaskList.markCleaningTaskAsComplete(3)).rejects.toThrow(ServerError);
      await expect(CleaningTaskList.markCleaningTaskAsComplete(3)).rejects.toEqual(
        expect.objectContaining({
          message: "The cleaning task with id 3 does not exist",
          statusCode: 404,
        })
      );
    });

    test("Returns a success message when the operation completes successfully", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [
          {
            cleaningtaskid: 1,
            _description: "A cleaning task",
            completed: false,
            cleaningtasklistid: 1,
            areaid: 1,
          },
        ],
        command: "",
        oid: 0,
        fields: [],
      });

      // Mock the CleaningTask.setCompleted function
      const mockSetCompleted = jest.fn(CleaningTask.setCompleted);
      mockSetCompleted.mockResolvedValue("update successful");

      const result = await CleaningTaskList.markCleaningTaskAsComplete(1);

      expect(result).toBe("update successful");
    });

    test("Throws a server error when the cleaning task is already marked as completed", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [
          {
            cleaningtaskid: 1,
            _description: "A cleaning task",
            completed: true,
            cleaningtasklistid: 1,
            areaid: 1,
          },
        ],
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(CleaningTaskList.markCleaningTaskAsComplete(1)).rejects.toThrow(ServerError);
      await expect(CleaningTaskList.markCleaningTaskAsComplete(1)).rejects.toEqual(
        expect.objectContaining({
          message: "The cleaning task is already completed",
          statusCode: 400,
        })
      );
    });

    test("Throws a server error when a query fails or other unexpected error occurs", async () => {
      (query as jest.Mock).mockRejectedValue(new Error("db error"));

      await expect(CleaningTaskList.markCleaningTaskAsComplete(1)).rejects.toThrow(ServerError);
      await expect(CleaningTaskList.markCleaningTaskAsComplete(1)).rejects.toEqual(
        expect.objectContaining({
          message: "An unexpected error occurred",
          statusCode: 500,
        })
      );
    });

    test("Throws an error thrown in the CleaningTask.setCompleted method", async () => {
      // mock the setCompleted function
      jest
        .spyOn(CleaningTask, "setCompleted")
        .mockRejectedValue(
          new ServerError(
            "An error occurred. Check that cleaningTaskId is a valid cleaning task identifier",
            500
          )
        );

      // mock the query function
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [
          {
            cleaningtaskid: 3,
            _description: "A cleaning task",
            completed: false,
            cleaningtasklistid: 1,
            areaid: 1,
          },
        ],
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(CleaningTaskList.markCleaningTaskAsComplete(3)).rejects.toThrow(ServerError);
      await expect(CleaningTaskList.markCleaningTaskAsComplete(3)).rejects.toEqual(
        expect.objectContaining({
          message:
            "An error occurred. Check that cleaningTaskId is a valid cleaning task identifier",
          statusCode: 500,
        })
      );
    });
  });

  describe("markCleaningTaskAsIncomplete()", () => {
    test("Throws a sever error if the type of cleaningTaskId is not a number", async () => {
      await expect(CleaningTaskList.markCleaningTaskAsIncomplete("test" as any)).rejects.toThrow(
        ServerError
      );
      await expect(CleaningTaskList.markCleaningTaskAsIncomplete("test" as any)).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskId must be a number",
          statusCode: 400,
        })
      );
    });

    test("Throws a server error if the query fails", async () => {
      (query as jest.Mock).mockRejectedValue(Error());

      await expect(CleaningTaskList.markCleaningTaskAsIncomplete(1)).rejects.toThrow(ServerError);
      await expect(CleaningTaskList.markCleaningTaskAsIncomplete(1)).rejects.toEqual(
        expect.objectContaining({
          message: "An unexpected error occurred",
          statusCode: 500,
        })
      );
    });

    test("Throws a server error when the cleaning task does not exist", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: [],
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(CleaningTaskList.markCleaningTaskAsIncomplete(1)).rejects.toThrow(ServerError);
      await expect(CleaningTaskList.markCleaningTaskAsIncomplete(1)).rejects.toEqual(
        expect.objectContaining({
          message: "The cleaning task with id 1 does not exist",
          statusCode: 404,
        })
      );
    });

    test("Throws a server error when the cleaning task is already incomplete", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [
          {
            cleaningtaskid: 3,
            _description: "A cleaning task",
            completed: false,
            cleaningtasklistid: 1,
            areaid: 1,
          },
        ],
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(CleaningTaskList.markCleaningTaskAsIncomplete(3)).rejects.toThrow(ServerError);
      await expect(CleaningTaskList.markCleaningTaskAsIncomplete(3)).rejects.toEqual(
        expect.objectContaining({
          message: "The cleaning task is already marked as incomplete",
          statusCode: 400,
        })
      );
    });

    test("Returns a string indicating success when completed is false and cleaningTaskId is valid", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [
          {
            cleaningtaskid: 15,
            _description: "A cleaning task",
            completed: true,
            cleaningtasklistid: 1,
            areaid: 1,
          },
        ],
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(CleaningTaskList.markCleaningTaskAsIncomplete(15)).resolves.toBe(
        "update successful"
      );
    });
  });

  describe("setManagerSignature(); also tests setSignatureCheckParams()", () => {
    test("Throws a server error when signature is not a string", async () => {
      await expect(CleaningTaskList.setManagerSignature(1, 1 as any)).rejects.toThrow(ServerError);
      await expect(CleaningTaskList.setManagerSignature(1, 1 as any)).rejects.toEqual(
        expect.objectContaining({
          message: "signature must be a string",
          statusCode: 400,
        })
      );
    });

    test("Throws a server error when signature is an empty string", async () => {
      await expect(CleaningTaskList.setManagerSignature(1, "")).rejects.toThrow(ServerError);
      await expect(CleaningTaskList.setManagerSignature(1, "")).rejects.toEqual(
        expect.objectContaining({
          message: "signature must not be empty",
          statusCode: 400,
        })
      );
    });

    test("Throws a server error when cleaningTaskListId is not a number", async () => {
      await expect(CleaningTaskList.setManagerSignature("test" as any, "test")).rejects.toThrow(
        ServerError
      );
      await expect(CleaningTaskList.setManagerSignature("test" as any, "test")).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskListId must be an integer",
          statusCode: 400,
        })
      );
    });

    test("Throws a server error when cleaningTaskListId is not an integer", async () => {
      await expect(CleaningTaskList.setManagerSignature(1.33, "test")).rejects.toThrow(ServerError);
      await expect(CleaningTaskList.setManagerSignature(1.33, "test")).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskListId must be an integer",
          statusCode: 400,
        })
      );
    });

    test("Returns update successful when the query completes successfully", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [],
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(CleaningTaskList.setManagerSignature(1, "test")).resolves.toEqual(
        "update successful"
      );
    });

    test("Throws a server error when the query fails", async () => {
      (query as jest.Mock).mockRejectedValue(new Error("db error"));

      await expect(CleaningTaskList.setManagerSignature(1, "test")).rejects.toThrow(ServerError);
      await expect(CleaningTaskList.setManagerSignature(1, "test")).rejects.toEqual(
        expect.objectContaining({
          message:
            "An error occurred while updating the cleaning task list. Check that the cleaning task list exists",
          statusCode: 500,
        })
      );
    });

    test("Throws a server error when the cleaning task list does not exist", async () => {
      (query as jest.Mock).mockResolvedValue({ rowCount: 0 });

      await expect(CleaningTaskList.setManagerSignature(1, "test")).rejects.toThrow(
        new ServerError("The cleaning task list does not exist", 404)
      );
    });
  });

  describe("setStaffMemberSignature(); also tests setSignatureCheckParams()", () => {
    test("Throws a server error when signature is not a string", async () => {
      await expect(CleaningTaskList.setStaffMemberSignature(1, 1 as any)).rejects.toThrow(
        ServerError
      );
      await expect(CleaningTaskList.setStaffMemberSignature(1, 1 as any)).rejects.toEqual(
        expect.objectContaining({
          message: "signature must be a string",
          statusCode: 400,
        })
      );
    });

    test("Throws a server error when signature is an empty string", async () => {
      await expect(CleaningTaskList.setStaffMemberSignature(1, "")).rejects.toThrow(ServerError);
      await expect(CleaningTaskList.setStaffMemberSignature(1, "")).rejects.toEqual(
        expect.objectContaining({
          message: "signature must not be empty",
          statusCode: 400,
        })
      );
    });

    test("Throws a server error when cleaningTaskListId is not a number", async () => {
      await expect(CleaningTaskList.setStaffMemberSignature("test" as any, "test")).rejects.toThrow(
        ServerError
      );
      await expect(CleaningTaskList.setStaffMemberSignature("test" as any, "test")).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskListId must be an integer",
          statusCode: 400,
        })
      );
    });

    test("Throws a server error when cleaningTaskListId is not an integer", async () => {
      await expect(CleaningTaskList.setStaffMemberSignature(1.33, "test")).rejects.toThrow(
        ServerError
      );
      await expect(CleaningTaskList.setStaffMemberSignature(1.33, "test")).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskListId must be an integer",
          statusCode: 400,
        })
      );
    });

    test("Returns update successful when the query completes successfully", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [],
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(CleaningTaskList.setStaffMemberSignature(1, "test")).resolves.toEqual(
        "update successful"
      );
    });

    test("Throws a server error when the query fails", async () => {
      (query as jest.Mock).mockRejectedValue(new Error("db error"));

      await expect(CleaningTaskList.setStaffMemberSignature(1, "test")).rejects.toThrow(
        ServerError
      );
      await expect(CleaningTaskList.setStaffMemberSignature(1, "test")).rejects.toEqual(
        expect.objectContaining({
          message:
            "An error occurred while updating the cleaning task list. Check that the cleaning task list exists",
          statusCode: 500,
        })
      );
    });

    test("Throws a server error when the cleaning task list does not exist", async () => {
      (query as jest.Mock).mockResolvedValue({ rowCount: 0 });

      await expect(CleaningTaskList.setStaffMemberSignature(1, "test")).rejects.toThrow(
        new ServerError("The cleaning task list does not exist", 404)
      );
    });
  });

  describe("createCleaningTask()", () => {
    test("Throws a server error when cleaningTaskListId is not an integer", async () => {
      await expect(
        CleaningTaskList.createCleaningTask(
          "test" as any,
          undefined,
          undefined,
          undefined,
          undefined
        )
      ).rejects.toThrow(ServerError);
      await expect(
        CleaningTaskList.createCleaningTask(
          "test" as any,
          undefined,
          undefined,
          undefined,
          undefined
        )
      ).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskListId must be an integer",
          statusCode: 400,
        })
      );

      await expect(
        CleaningTaskList.createCleaningTask(1.22, undefined, undefined, undefined, undefined)
      ).rejects.toThrow(ServerError);
      await expect(
        CleaningTaskList.createCleaningTask(1.22, undefined, undefined, undefined, undefined)
      ).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskListId must be an integer",
          statusCode: 400,
        })
      );
    });

    describe("Cleaning task template and area exist", () => {
      test("Throws a server error when cleaningTaskTemplateId is not an integer", async () => {
        await expect(
          CleaningTaskList.createCleaningTask(1, "test" as any, undefined, undefined, undefined)
        ).rejects.toThrow(ServerError);
        await expect(
          CleaningTaskList.createCleaningTask(1, "test" as any, undefined, undefined, undefined)
        ).rejects.toEqual(
          expect.objectContaining({
            message: "cleaningTaskTemplateId must be an integer",
            statusCode: 400,
          })
        );

        await expect(
          CleaningTaskList.createCleaningTask(1, 1.22, undefined, undefined, undefined)
        ).rejects.toThrow(ServerError);
        await expect(
          CleaningTaskList.createCleaningTask(1, 1.22, undefined, undefined, undefined)
        ).rejects.toEqual(
          expect.objectContaining({
            message: "cleaningTaskTemplateId must be an integer",
            statusCode: 400,
          })
        );
      });

      test("Returns the id of the new cleaning task when it is created successfully in the try block", async () => {
        // Create mocks
        jest.spyOn(CleaningTaskTemplate, "getDescription").mockResolvedValue("test description");
        jest.spyOn(CleaningTaskTemplate, "getArea").mockResolvedValue(1);
        (query as jest.Mock).mockResolvedValue({
          rowCount: 1,
          rows: [{ cleaningtaskid: 5 }],
          command: "",
          oid: 0,
          fields: [],
        });

        await expect(
          CleaningTaskList.createCleaningTask(1, 1, undefined, undefined, undefined)
        ).resolves.toEqual(5);
      });

      test("Throws a server error thrown in the getDescription or getArea methods of CleaningTaskTemplate", async () => {
        // mock getDescription method
        jest
          .spyOn(CleaningTaskTemplate, "getDescription")
          .mockRejectedValue(
            new ServerError(
              "An error occurred when retrieving the cleaning task template description. Check that cleaningTaskTemplateId is valid",
              500
            )
          );

        await expect(
          CleaningTaskList.createCleaningTask(1, 1, undefined, undefined, undefined)
        ).rejects.toThrow(ServerError);
        await expect(
          CleaningTaskList.createCleaningTask(1, 1, undefined, undefined, undefined)
        ).rejects.toEqual(
          expect.objectContaining({
            message:
              "An error occurred when retrieving the cleaning task template description. Check that cleaningTaskTemplateId is valid",
            statusCode: 500,
          })
        );

        jest.restoreAllMocks();

        // mock the getDescription method with resolved value
        jest.spyOn(CleaningTaskTemplate, "getDescription").mockResolvedValue("test description");

        // mock getArea method
        jest
          .spyOn(CleaningTaskTemplate, "getArea")
          .mockRejectedValue(
            new ServerError(
              "An error occurred while retrieving the areaId from the cleaning task template. Check that cleaningTaskTemplateId is valid",
              500
            )
          );

        await expect(
          CleaningTaskList.createCleaningTask(1, 1, undefined, undefined, undefined)
        ).rejects.toThrow(ServerError);
        await expect(
          CleaningTaskList.createCleaningTask(1, 1, undefined, undefined, undefined)
        ).rejects.toEqual(
          expect.objectContaining({
            message:
              "An error occurred while retrieving the areaId from the cleaning task template. Check that cleaningTaskTemplateId is valid",
            statusCode: 500,
          })
        );
      });

      test("Throws a server error when the create cleaning task query fails", async () => {
        // Create mocks with resolve values
        jest.spyOn(CleaningTaskTemplate, "getDescription").mockResolvedValue("test description");
        jest.spyOn(CleaningTaskTemplate, "getArea").mockResolvedValue(1);

        // Mock the query function to throw an error
        (query as jest.Mock).mockRejectedValue(new Error());

        await expect(
          CleaningTaskList.createCleaningTask(1, 1, undefined, undefined, undefined)
        ).rejects.toThrow(ServerError);
        await expect(
          CleaningTaskList.createCleaningTask(1, 1, undefined, undefined, undefined)
        ).rejects.toEqual(
          expect.objectContaining({
            message: "An error occurred while creating the new cleaning task",
            statusCode: 500,
          })
        );
      });
    });

    describe("Cleaning task template doesn't exist; area does", () => {
      test("Throws a server error if cleaningTaskDescription is not a string or is an empty string", async () => {
        await expect(
          CleaningTaskList.createCleaningTask(1, undefined, 1 as any, undefined, 4)
        ).rejects.toThrow(ServerError);
        await expect(
          CleaningTaskList.createCleaningTask(1, undefined, 1 as any, undefined, 4)
        ).rejects.toEqual(
          expect.objectContaining({
            message: "cleaningTaskDescription must be a non-empty string",
            statusCode: 400,
          })
        );

        await expect(
          CleaningTaskList.createCleaningTask(1, undefined, "", undefined, 4)
        ).rejects.toThrow(ServerError);
        await expect(
          CleaningTaskList.createCleaningTask(1, undefined, "", undefined, 4)
        ).rejects.toEqual(
          expect.objectContaining({
            message: "cleaningTaskDescription must be a non-empty string",
            statusCode: 400,
          })
        );
      });

      test("Throws a server error if areaId is not an integer", async () => {
        await expect(
          CleaningTaskList.createCleaningTask(1, undefined, "test", undefined, "test" as any)
        ).rejects.toThrow(ServerError);
        await expect(
          CleaningTaskList.createCleaningTask(1, undefined, "test", undefined, "test" as any)
        ).rejects.toEqual(
          expect.objectContaining({
            message: "areaId must be an integer",
            statusCode: 400,
          })
        );

        await expect(
          CleaningTaskList.createCleaningTask(1, undefined, "test", undefined, 19.99)
        ).rejects.toThrow(ServerError);
        await expect(
          CleaningTaskList.createCleaningTask(1, undefined, "test", undefined, 19.99)
        ).rejects.toEqual(
          expect.objectContaining({
            message: "areaId must be an integer",
            statusCode: 400,
          })
        );
      });

      test("Returns the cleaning task id of the cleaning task when it is successfully created", async () => {
        (query as jest.Mock).mockResolvedValue({
          rowCount: 1,
          rows: [{ cleaningtaskid: 99 }],
          command: "",
          oid: 0,
          fields: [],
        });

        await expect(
          CleaningTaskList.createCleaningTask(7, undefined, "test", undefined, 5)
        ).resolves.toEqual(99);
      });

      test("Throws a server error when the cleaning task creation query fails", async () => {
        (query as jest.Mock).mockRejectedValue(new Error());

        await expect(
          CleaningTaskList.createCleaningTask(4, undefined, "test", undefined, 3)
        ).rejects.toThrow(ServerError);
        await expect(
          CleaningTaskList.createCleaningTask(4, undefined, "test", undefined, 3)
        ).rejects.toEqual(
          expect.objectContaining({
            message: "An error occurred while creating the new cleaning task",
            statusCode: 500,
          })
        );
      });
    });

    describe("Both the cleaning task template and area don't exist", () => {
      test("Throws a server error when cleaningTaskDescription is an empty string or not a string", async () => {
        await expect(
          CleaningTaskList.createCleaningTask(1, undefined, 1 as any, "test", undefined)
        ).rejects.toThrow(ServerError);
        await expect(
          CleaningTaskList.createCleaningTask(1, undefined, 1 as any, "test", undefined)
        ).rejects.toEqual(
          expect.objectContaining({
            message: "cleaningTaskDescription must be a non-empty string",
            statusCode: 400,
          })
        );

        await expect(
          CleaningTaskList.createCleaningTask(1, undefined, 1 as any, "test", undefined)
        ).rejects.toThrow(ServerError);
        await expect(
          CleaningTaskList.createCleaningTask(1, undefined, 1 as any, "test", undefined)
        ).rejects.toEqual(
          expect.objectContaining({
            message: "cleaningTaskDescription must be a non-empty string",
            statusCode: 400,
          })
        );
      });

      test("Throws a server error if areaDescription isn't a string or or an empty string", async () => {
        await expect(
          CleaningTaskList.createCleaningTask(1, undefined, "test", 1 as any, undefined)
        ).rejects.toThrow(ServerError);
        await expect(
          CleaningTaskList.createCleaningTask(1, undefined, "test", 1 as any, undefined)
        ).rejects.toEqual(
          expect.objectContaining({
            message: "areaDescription must be a non-empty string",
            statusCode: 400,
          })
        );

        await expect(
          CleaningTaskList.createCleaningTask(1, undefined, "test", 1 as any, undefined)
        ).rejects.toThrow(ServerError);
        await expect(
          CleaningTaskList.createCleaningTask(1, undefined, "test", 1 as any, undefined)
        ).rejects.toEqual(
          expect.objectContaining({
            message: "areaDescription must be a non-empty string",
            statusCode: 400,
          })
        );
      });

      test("Returns the cleaning task id of the new cleaning task", async () => {
        (executeTransaction as jest.Mock).mockImplementation(
          async (transactionQueries: (client: any) => Promise<any>) => {
            // Mock each call to query
            const mockClient = {
              query: jest
                .fn()
                .mockResolvedValueOnce({ rows: [{ areaid: 1 }] }) // First query - create Area
                .mockResolvedValueOnce({ rows: [{ cleaningtaskid: 99 }] }), // Second query - create CleaningTask
            };

            return transactionQueries(mockClient);
          }
        );

        await expect(
          CleaningTaskList.createCleaningTask(
            4,
            undefined,
            "test cleaning task",
            "test area",
            undefined
          )
        ).resolves.toEqual(99);
      });

      test("Throws a server error if either of the queries in the transaction fail", async () => {
        (executeTransaction as jest.Mock).mockImplementation(
          async (transactionQueries: (client: any) => Promise<any>) => {
            // Mock each call to query
            const mockClient = {
              query: jest.fn().mockRejectedValue(new Error()), // Failure creating Area
            };

            return transactionQueries(mockClient);
          }
        );

        await expect(
          CleaningTaskList.createCleaningTask(
            4,
            undefined,
            "test cleaning task",
            "test area",
            undefined
          )
        ).rejects.toThrow(ServerError);

        await expect(
          CleaningTaskList.createCleaningTask(
            4,
            undefined,
            "test cleaning task",
            "test area",
            undefined
          )
        ).rejects.toEqual(
          expect.objectContaining({
            message: "an error occurred while creating the new cleaning task",
            statusCode: 500,
          })
        );

        jest.restoreAllMocks();

        (executeTransaction as jest.Mock).mockImplementation(
          async (transactionQueries: (client: any) => Promise<any>) => {
            // Mock each call to query
            const mockClient = {
              query: jest
                .fn()
                .mockResolvedValueOnce({ rows: [{ areaid: 1 }] }) // success creating Area
                .mockRejectedValueOnce(new Error()), // Failure creating CleaningTask
            };

            return transactionQueries(mockClient);
          }
        );

        await expect(
          CleaningTaskList.createCleaningTask(
            4,
            undefined,
            "test cleaning task",
            "test area",
            undefined
          )
        ).rejects.toThrow(ServerError);

        await expect(
          CleaningTaskList.createCleaningTask(
            4,
            undefined,
            "test cleaning task",
            "test area",
            undefined
          )
        ).rejects.toEqual(
          expect.objectContaining({
            message: "an error occurred while creating the new cleaning task",
            statusCode: 500,
          })
        );
      });
    });

    test("Throws a server error when invalid arguments are supplied", async () => {
      await expect(
        CleaningTaskList.createCleaningTask(5, undefined, undefined, undefined, 4)
      ).rejects.toThrow(ServerError);
      await expect(
        CleaningTaskList.createCleaningTask(5, undefined, undefined, undefined, 4)
      ).rejects.toEqual(
        expect.objectContaining({
          message: "invalid parameters supplied for creating a cleaning task",
          statusCode: 400,
        })
      );
    });
  });

  describe("new()", () => {
    test("Throws a server error if cleaningTaskTemplateListId is not an integer", async () => {
      await expect(CleaningTaskList.new(1.22, new Date(), undefined)).rejects.toThrow(
        new ServerError("cleaningTaskTemplateListId must be an integer", 400)
      );
    });

    test("Throws a server error if date is not a valid date", async () => {
      await expect(CleaningTaskList.new(1, "invalid" as any, undefined)).rejects.toThrow(
        new ServerError("date must be a valid Date", 400)
      );
    });

    test("Throws a server error if date is in the past", async () => {
      await expect(CleaningTaskList.new(1, new Date("2022-04-21"), undefined)).rejects.toThrow(
        new ServerError("date cannot be in the past", 400)
      );
    });

    test("Throws a server error if staffMemberId is not an integer or undefined", async () => {
      await expect(CleaningTaskList.new(1, new Date("2025-12-04"), 1.22)).rejects.toThrow(
        new ServerError("staffMemberId must be an integer or undefined", 400)
      );
    });

    test("Returns the cleaning task list id of the new cleaning task list when the operation runs successfully", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
      });

      (executeTransaction as jest.Mock).mockImplementation(
        async (transactionQueries: (client: any) => Promise<any>) => {
          const mockClient = {
            query: jest
              .fn()
              .mockResolvedValueOnce({ rows: [{ cleaningtasklistid: 5 }], rowCount: 1 })
              .mockResolvedValueOnce({ rowCount: 1 }),
          };

          return transactionQueries(mockClient);
        }
      );

      jest.spyOn(CleaningTaskTemplateList, "getCleaningTaskTemplates").mockResolvedValue([4, 6]);
      jest
        .spyOn(CleaningTaskTemplate, "getDescription")
        .mockResolvedValueOnce("test description 1")
        .mockResolvedValueOnce("test description 2");
      jest.spyOn(CleaningTaskTemplate, "getArea").mockResolvedValueOnce(3).mockResolvedValueOnce(4);

      await expect(CleaningTaskList.new(1, new Date("2025-01-01"), undefined)).resolves.toBe(5);
    });

    test("Catches the server error thrown from CleaningTaskTemplateList.getCleaningTaskTemplates when no clenaing task templates are linked to the cleaning task template list", async () => {
      (executeTransaction as jest.Mock).mockImplementation(
        async (transactionQueries: (client: any) => Promise<any>) => {
          const mockClient = {
            query: jest.fn().mockResolvedValueOnce({ rows: [{ cleaningtasklistid: 5 }] }),
          };

          return transactionQueries(mockClient);
        }
      );

      jest
        .spyOn(CleaningTaskTemplateList, "getCleaningTaskTemplates")
        .mockRejectedValue(
          new ServerError(
            "There are no cleaning task templates linked to the cleaning task template list",
            404
          )
        );

      await expect(CleaningTaskList.new(1, new Date("2025-01-01"), undefined)).resolves.toBe(5);
    });

    test("Throws a server error thrown in CleaningTaskTemplateList.getCleaningTaskTemplates", async () => {
      (executeTransaction as jest.Mock).mockImplementation(
        async (transactionQueries: (client: any) => Promise<any>) => {
          const mockClient = {
            query: jest.fn().mockResolvedValueOnce({ rows: [{ cleaningtasklistid: 5 }] }),
          };

          return transactionQueries(mockClient);
        }
      );

      jest
        .spyOn(CleaningTaskTemplateList, "getCleaningTaskTemplates")
        .mockRejectedValue(
          new ServerError("An error occurred while retrieving cleaning task template ids", 500)
        );

      await expect(CleaningTaskList.new(1, new Date("2025-01-01"), undefined)).rejects.toThrow(
        new ServerError("An error occurred while retrieving cleaning task template ids", 500)
      );
    });

    test("Throws a server error if a query fails", async () => {
      (executeTransaction as jest.Mock).mockImplementation(
        async (transactionQueries: (client: any) => Promise<any>) => {
          const mockClient = {
            query: jest.fn().mockRejectedValueOnce(new Error()),
          };

          return transactionQueries(mockClient);
        }
      );

      await expect(CleaningTaskList.new(1, new Date("2025-01-01"), undefined)).rejects.toThrow(
        new ServerError("An error occurred while creating the new cleaning task list", 500)
      );
    });

    test("Throws a server error when the cleaning task template list does not exist", async () => {
      (query as jest.Mock).mockResolvedValue({ rowCount: 0 });

      await expect(CleaningTaskList.new(1, new Date("2025-01-01"), undefined)).rejects.toThrow(
        new ServerError("The cleaning task template list doesn't exist", 404)
      );
    });
  });

  describe("delete()", () => {
    test("Throws a server error when cleaningTaskListId is not an integer", async () => {
      await expect(CleaningTaskList.delete(1.22)).rejects.toThrow(
        new ServerError("cleaningTaskListId must be an integer", 400)
      );
    });

    test("Returns a success message when the query runs successfully", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
      });

      await expect(CleaningTaskList.delete(5)).resolves.toBe("deletion successful");
    });

    test("Throws a server error when the query fails", async () => {
      (query as jest.Mock).mockRejectedValue(new Error());

      await expect(CleaningTaskList.delete(5)).rejects.toThrow(
        new ServerError("An error occurred while deleting the cleaning task list", 500)
      );
    });

    test("Throws a server error when the cleaning task list does not exist", async () => {
      (query as jest.Mock).mockResolvedValue({ rowCount: 0 });

      await expect(CleaningTaskList.delete(1)).rejects.toThrow(
        new ServerError("The cleaning task list does not exist", 404)
      );
    });
  });
});
