import CleaningTaskTemplateList from "../src/Cleaning/API/CleaningTaskTemplateList";
import ServerError from "../ServerError";
import { executeTransaction, query } from "../src/Cleaning/db/dbconnection";
import { CleaningTaskTemplateList_TYPE } from "../types";

// Mock the query function so that it's return values can be controlled.
jest.mock("../src/Cleaning/db/dbconnection", () => ({
  query: jest.fn(),
  executeTransaction: jest.fn(),
}));

describe("CleaningTaskTemplateList", () => {
  // clear mock calls and instances after each test.
  afterEach(() => jest.clearAllMocks());

  describe("getView()", () => {
    test("Throws a server error when the cleaningTaskTemplateListId is not a number", async () => {
      await expect(CleaningTaskTemplateList.getView("test" as any)).rejects.toThrow(ServerError);
      await expect(CleaningTaskTemplateList.getView("test" as any)).rejects.toEqual(
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

      const result = await CleaningTaskTemplateList.getView(2);

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

      await expect(CleaningTaskTemplateList.getView(4)).rejects.toThrow(ServerError);
      await expect(CleaningTaskTemplateList.getView(4)).rejects.toEqual(
        expect.objectContaining({
          message: "There are no cleaning task template lists with the id of 4",
          statusCode: 404,
        })
      );
    });

    test("Throws a server error if the query fails", async () => {
      (query as jest.Mock).mockRejectedValue(Error);

      await expect(CleaningTaskTemplateList.getView(3)).rejects.toThrow(ServerError);
      await expect(CleaningTaskTemplateList.getView(3)).rejects.toEqual(
        expect.objectContaining({
          message: "An error occurred while retrieving the cleaning task template list",
          statusCode: 500,
        })
      );
    });
  });

  describe("removeCleaningTaskTemplate()", () => {
    test("Throws a server error when cleaningTaskTemplateListId is not an integer", async () => {
      await expect(
        CleaningTaskTemplateList.removeCleaningTaskTemplate("test" as any, 5)
      ).rejects.toThrow(ServerError);
      await expect(CleaningTaskTemplateList.removeCleaningTaskTemplate(5.45, 5)).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskTemplateListId must be an integer",
          statusCode: 400,
        })
      );
    });

    test("Throws a server error when cleaningTaskTemplateId is not an integer", async () => {
      await expect(CleaningTaskTemplateList.removeCleaningTaskTemplate(5, 6.3)).rejects.toThrow(
        ServerError
      );
      await expect(
        CleaningTaskTemplateList.removeCleaningTaskTemplate(5, false as any)
      ).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskTemplateId must be an integer",
          statusCode: 400,
        })
      );
    });

    test("Returns a success message when a cleaning task template is removed successfully", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
      });

      await expect(CleaningTaskTemplateList.removeCleaningTaskTemplate(5, 5)).resolves.toBe(
        "removal successful"
      );
    });

    test("Throws a server error when the query to remove a cleaning task template fails", async () => {
      (query as jest.Mock).mockRejectedValue(new Error());

      await expect(CleaningTaskTemplateList.removeCleaningTaskTemplate(5, 5)).rejects.toThrow(
        ServerError
      );
      await expect(CleaningTaskTemplateList.removeCleaningTaskTemplate(5, 5)).rejects.toEqual(
        expect.objectContaining({
          message:
            "An error occurred while removing the cleaning task template from the cleaning task template list",
          statusCode: 500,
        })
      );
    });

    test("Throws a server error when the cleaning task template list does not contain the cleaning task template", async () => {
      (query as jest.Mock).mockResolvedValue({ rowCount: 0 });

      await expect(CleaningTaskTemplateList.removeCleaningTaskTemplate(5, 5)).rejects.toThrow(
        new ServerError(
          "The cleaning task template list does not contain the cleaning task template",
          404
        )
      );
    });
  });

  describe("addCleaningTaskTemplate()", () => {
    test("Throws a server error when cleaningTaskTemplateListId is not an integer", async () => {
      await expect(
        CleaningTaskTemplateList.addCleaningTaskTemplate(true as any, 2)
      ).rejects.toThrow(ServerError);
      await expect(CleaningTaskTemplateList.addCleaningTaskTemplate(4.9, 2)).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskTemplateListId must be an integer",
          statusCode: 400,
        })
      );
    });

    test("Throws a server error when cleaningTaskTemplateId is not an integer", async () => {
      await expect(CleaningTaskTemplateList.addCleaningTaskTemplate(1, 2.44)).rejects.toThrow(
        ServerError
      );
      await expect(
        CleaningTaskTemplateList.addCleaningTaskTemplate(1, true as any)
      ).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskTemplateId must be an integer",
          statusCode: 400,
        })
      );
    });

    test("Returns a success message when the query runs successfully", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
      });

      await expect(CleaningTaskTemplateList.addCleaningTaskTemplate(5, 5)).resolves.toBe(
        "cleaning task template added successfully"
      );
    });

    test("Throws a server error when the query fails", async () => {
      (query as jest.Mock).mockRejectedValue(new Error());

      await expect(CleaningTaskTemplateList.addCleaningTaskTemplate(5, 5)).rejects.toThrow(
        ServerError
      );
      await expect(CleaningTaskTemplateList.addCleaningTaskTemplate(5, 5)).rejects.toEqual(
        expect.objectContaining({
          message:
            "An error occurred while adding the cleaning task template to the cleaning task template list",
          statusCode: 500,
        })
      );
    });
  });

  describe("createCleaningTaskTemplate()", () => {
    test("Throws a server error when cleaningTaskTemplateListId is not an integer", async () => {
      await expect(
        CleaningTaskTemplateList.createCleaningTaskTemplate(
          "test" as any,
          undefined as any,
          undefined,
          undefined
        )
      ).rejects.toThrow(ServerError);

      await expect(
        CleaningTaskTemplateList.createCleaningTaskTemplate(
          5.77,
          undefined as any,
          undefined,
          undefined
        )
      ).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskTemplateListId must be an integer",
          statusCode: 400,
        })
      );
    });

    test("Throws a server error when cleaningTaskTemplateDescription is not a non-empty string", async () => {
      await expect(
        CleaningTaskTemplateList.createCleaningTaskTemplate(
          1,
          undefined as any,
          undefined,
          undefined
        )
      ).rejects.toThrow(ServerError);

      await expect(
        CleaningTaskTemplateList.createCleaningTaskTemplate(1, "", undefined, undefined)
      ).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskTemplateDescription must be a non-empty string",
          statusCode: 400,
        })
      );
    });
    describe("cleaning task doesn't exists; area does", () => {
      test("Throws a server error when areaId is not an integer", async () => {
        await expect(
          CleaningTaskTemplateList.createCleaningTaskTemplate(1, "test", false as any, undefined)
        ).rejects.toThrow(ServerError);

        await expect(
          CleaningTaskTemplateList.createCleaningTaskTemplate(1, "test", 1.55, undefined)
        ).rejects.toEqual(
          expect.objectContaining({
            message: "areaId must be an integer",
            statusCode: 400,
          })
        );
      });

      test("Returns the id of the new cleaning task template when the transaction executes successfully", async () => {
        (executeTransaction as jest.Mock).mockImplementation(
          async (transactionQueries: (client: any) => Promise<any>) => {
            // mock each callo to query
            const mockClient = {
              query: jest
                .fn()
                .mockResolvedValueOnce({ rows: [{ cleaningtasktemplateid: 1 }] })
                .mockResolvedValueOnce({ rowCount: 1 }),
            };

            return transactionQueries(mockClient);
          }
        );

        await expect(
          CleaningTaskTemplateList.createCleaningTaskTemplate(1, "test", 4, undefined)
        ).resolves.toBe(1);
      });

      test("Throws a server error if one of the queries in the transaction fail", async () => {
        (executeTransaction as jest.Mock).mockImplementation(
          async (transactionQueries: (client: any) => Promise<any>) => {
            // Mock each call to query
            const mockClient = {
              query: jest.fn().mockRejectedValueOnce(new Error()), // Failure creating cleaning task
            };

            return transactionQueries(mockClient);
          }
        );

        await expect(
          CleaningTaskTemplateList.createCleaningTaskTemplate(4, "test", 5, undefined)
        ).rejects.toThrow(ServerError);

        await expect(
          CleaningTaskTemplateList.createCleaningTaskTemplate(4, "test", 5, undefined)
        ).rejects.toEqual(
          expect.objectContaining({
            message: "An error occurred while creating the new cleaning task template",
            statusCode: 500,
          })
        );
      });
    });

    describe("both cleaning task template and area don't exist", () => {
      test("Throws a server error when areaDescription is not a non-empty string", async () => {
        await expect(
          CleaningTaskTemplateList.createCleaningTaskTemplate(1, "test", undefined, 1 as any)
        ).rejects.toThrow(ServerError);

        await expect(
          CleaningTaskTemplateList.createCleaningTaskTemplate(1, "test", undefined, "")
        ).rejects.toEqual(
          expect.objectContaining({
            message: "areaDescription must be a non-empty string",
            statusCode: 400,
          })
        );
      });

      test("Returns the id of the new cleaning task template when the transaction executes successfully", async () => {
        (executeTransaction as jest.Mock).mockImplementation(
          async (transactionQueries: (client: any) => Promise<any>) => {
            // mock each callo to query
            const mockClient = {
              query: jest
                .fn()
                .mockResolvedValueOnce({ rows: [{ areaid: 55 }] })
                .mockResolvedValueOnce({ rows: [{ cleaningtasktemplateid: 44 }] })
                .mockResolvedValueOnce({ rowCount: 1 }),
            };

            return transactionQueries(mockClient);
          }
        );

        await expect(
          CleaningTaskTemplateList.createCleaningTaskTemplate(22, "test", undefined, "test area")
        ).resolves.toBe(44);
      });

      test("Throws a server error when the transaction fails", async () => {
        (executeTransaction as jest.Mock).mockImplementation(
          async (transactionQueries: (client: any) => Promise<any>) => {
            // mock each callo to query
            const mockClient = {
              query: jest
                .fn()
                .mockResolvedValueOnce({ rows: [{ areaid: 55 }] })
                .mockRejectedValueOnce(new Error()),
            };

            return transactionQueries(mockClient);
          }
        );

        await expect(
          CleaningTaskTemplateList.createCleaningTaskTemplate(22, "test", undefined, "test area")
        ).rejects.toThrow(ServerError);
        await expect(
          CleaningTaskTemplateList.createCleaningTaskTemplate(22, "test", undefined, "test area")
        ).rejects.toEqual(
          expect.objectContaining({
            message: "An error occurred during the operation",
            statusCode: 500,
          })
        );
      });
    });

    test("Throws a server error when invalid arguments are supplied", async () => {
      await expect(
        CleaningTaskTemplateList.createCleaningTaskTemplate(
          undefined as any,
          undefined as any,
          undefined,
          undefined
        )
      ).rejects.toThrow(ServerError);

      await expect(
        CleaningTaskTemplateList.createCleaningTaskTemplate(1, "test", undefined, undefined)
      ).rejects.toEqual(
        expect.objectContaining({
          message: "Invalid arguments supplied",
          statusCode: 400,
        })
      );
    });
  });

  describe("getCleaningTaskTemplates", () => {
    test("Throws an error when cleaningTaskTemplateListId is not an integer", async () => {
      await expect(
        CleaningTaskTemplateList.getCleaningTaskTemplates("test" as any)
      ).rejects.toThrow(ServerError);
      await expect(
        CleaningTaskTemplateList.getCleaningTaskTemplates("test" as any)
      ).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskTemplateListId must be an integer",
          statusCode: 400,
        })
      );
    });

    test("Returns a list of cleaning task templates", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 2,
        rows: [
          {
            cleaningtasktemplateid: 4,
          },
          {
            cleaningtasktemplateid: 9,
          },
        ],
      });

      await expect(CleaningTaskTemplateList.getCleaningTaskTemplates(2)).resolves.toEqual([4, 9]);
    });

    test("Throws a server error when no cleaning task templates are found", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 0,
      });

      await expect(CleaningTaskTemplateList.getCleaningTaskTemplates(5)).rejects.toThrow(
        ServerError
      );
      await expect(CleaningTaskTemplateList.getCleaningTaskTemplates(5)).rejects.toEqual(
        expect.objectContaining({
          message: "There are no cleaning task templates linked to the cleaning task template list",
          statusCode: 404,
        })
      );
    });

    test("Throws an error when the query fails", async () => {
      (query as jest.Mock).mockRejectedValue(new Error());

      await expect(CleaningTaskTemplateList.getCleaningTaskTemplates(5)).rejects.toThrow(
        ServerError
      );
      await expect(CleaningTaskTemplateList.getCleaningTaskTemplates(5)).rejects.toEqual(
        expect.objectContaining({
          message: "An error occurred while retrieving cleaning task template ids",
          statusCode: 500,
        })
      );
    });
  });

  describe("new()", () => {
    test("Throws a server error when title is not a non-empty string", async () => {
      await expect(CleaningTaskTemplateList.new(4 as any)).rejects.toThrow(
        new ServerError("title must be a non-empty string", 400)
      );
      await expect(CleaningTaskTemplateList.new("")).rejects.toThrow(
        new ServerError("title must be a non-empty string", 400)
      );
    });

    test("Returns the id of the new cleaning task template list", async () => {
      (query as jest.Mock).mockResolvedValue({
        rows: [{ cleaningtasktemplatelistid: 77 }],
      });

      await expect(CleaningTaskTemplateList.new("test")).resolves.toBe(77);
    });

    test("Throws a server error when the query fails", async () => {
      (query as jest.Mock).mockRejectedValue(new Error());

      await expect(CleaningTaskTemplateList.new("test")).rejects.toThrow(
        new ServerError("An error occurred while creating the new cleaning task template list", 500)
      );
    });
  });

  describe("delete()", () => {
    test("Throws a server error when cleaningTaskTemplateListId is not an integer", async () => {
      await expect(CleaningTaskTemplateList.delete(101.1)).rejects.toThrow(
        new ServerError("cleaningTaskTemplateListId must be an integer", 400)
      );
      await expect(CleaningTaskTemplateList.delete(false as any)).rejects.toThrow(
        new ServerError("cleaningTaskTemplateListId must be an integer", 400)
      );
    });

    test("Returns a success message when the cleaning task template list is deleted successfully", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
      });

      await expect(CleaningTaskTemplateList.delete(5)).resolves.toBe("deletion successful");
    });

    test("Throws a server error when the query fails", async () => {
      (query as jest.Mock).mockRejectedValue(new Error());

      await expect(CleaningTaskTemplateList.delete(5)).rejects.toThrow(
        new ServerError("An error occurred while deleting the cleaning task template", 500)
      );
    });

    test("Throws a server error when the cleaning task template list does not exist", async () => {
      (query as jest.Mock).mockResolvedValue({ rowCount: 0 });

      await expect(CleaningTaskTemplateList.delete(1)).rejects.toThrow(
        new ServerError("The cleaning task template list does not exist", 404)
      );
    });
  });
});
