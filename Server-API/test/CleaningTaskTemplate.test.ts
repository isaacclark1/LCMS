import CleaningTaskTemplate from "../src/Cleaning/API/CleaningTaskTemplate";
import ServerError from "../ServerError";
import { query } from "../src/Cleaning/db/dbconnection";

// Mock the query function so outputs can be controlled.
jest.mock("../src/Cleaning/db/dbconnection", () => ({
  query: jest.fn(),
}));

describe("CleaningTaskTemplate", () => {
  afterEach(() => jest.restoreAllMocks());

  describe("getDescription()", () => {
    test("Throws a server error when cleaningTaskTemplate id is not an integer", async () => {
      await expect(CleaningTaskTemplate.getDescription("test" as any)).rejects.toThrow(ServerError);
      await expect(CleaningTaskTemplate.getDescription("test" as any)).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskTemplateId must be an integer",
          statusCode: 400,
        })
      );

      await expect(CleaningTaskTemplate.getDescription(1.2)).rejects.toThrow(ServerError);
      await expect(CleaningTaskTemplate.getDescription(1.2)).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskTemplateId must be an integer",
          statusCode: 400,
        })
      );
    });

    test("Returns the cleaning task template description when cleaningTaskTemplateId is valid", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [{ _description: "test description" }],
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(CleaningTaskTemplate.getDescription(3)).resolves.toEqual("test description");
    });

    test("Throws a server error when the query fails", async () => {
      (query as jest.Mock).mockRejectedValue(new Error());

      await expect(CleaningTaskTemplate.getDescription(4)).rejects.toThrow(ServerError);
      await expect(CleaningTaskTemplate.getDescription(4)).rejects.toEqual(
        expect.objectContaining({
          message:
            "An error occurred when retrieving the cleaning task template description. Check that cleaningTaskTemplateId is valid",
          statusCode: 500,
        })
      );
    });
  });

  describe("getArea()", () => {
    test("Throws a server error when cleaningTaskTemplateId is not an integer", async () => {
      await expect(CleaningTaskTemplate.getArea("test" as any)).rejects.toThrow(ServerError);
      await expect(CleaningTaskTemplate.getArea("test" as any)).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskTemplateId must be an integer",
          statusCode: 400,
        })
      );

      await expect(CleaningTaskTemplate.getArea(1.2)).rejects.toThrow(ServerError);
      await expect(CleaningTaskTemplate.getArea(1.2)).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskTemplateId must be an integer",
          statusCode: 400,
        })
      );
    });

    test("Returns the areaId of the cleaning task template when cleaningTaskTemplateId is valid", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [{ areaid: 23 }],
        command: "",
        oid: 0,
        fields: [],
      });

      await expect(CleaningTaskTemplate.getArea(45)).resolves.toEqual(23);
    });

    test("Throws a server error when the query fails", async () => {
      (query as jest.Mock).mockRejectedValue(new Error());

      await expect(CleaningTaskTemplate.getArea(456)).rejects.toThrow(ServerError);
      await expect(CleaningTaskTemplate.getArea(456)).rejects.toEqual(
        expect.objectContaining({
          message:
            "An error occurred while retrieving the areaId from the cleaning task template. Check that cleaningTaskTemplateId is valid",
          statusCode: 500,
        })
      );
    });
  });
});
