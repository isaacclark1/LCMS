import CleaningTask from "../src/Cleaning/API/CleaningTask";
import ServerError from "../ServerError";
import { query } from "../src/Cleaning/db/dbconnection";

// Mock the query function so that it's return values can be controlled.
jest.mock("../src/Cleaning/db/dbconnection", () => ({ query: jest.fn() }));

describe("CleaningTaskList", () => {
  // clear mock calls and instances after each test.
  afterEach(() => jest.clearAllMocks());

  describe("setCompleted()", () => {
    test("Throws a server error when cleaningTaskId is not a number", async () => {
      await expect(CleaningTask.setCompleted("test" as any, false)).rejects.toThrow(ServerError);
      await expect(CleaningTask.setCompleted("test" as any, false)).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskId must be a number",
          statusCode: 400,
        })
      );
    });

    test("Throws a server error when flag is not a boolean", async () => {
      await expect(CleaningTask.setCompleted(4, "test" as any)).rejects.toThrow(ServerError);
      await expect(CleaningTask.setCompleted(4, "test" as any)).rejects.toEqual(
        expect.objectContaining({
          message: "flag must be a boolean",
          statusCode: 400,
        })
      );
    });

    test("Returns a success message when the update query runs successfully", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [],
        command: "",
        oid: 0,
        fields: [],
      });

      const result = await CleaningTask.setCompleted(1, true);

      expect(result).toBe("update successful");
    });

    test("Throws a server error when the query fails", async () => {
      (query as jest.Mock).mockRejectedValue(Error);

      await expect(CleaningTask.setCompleted(10, false)).rejects.toThrow(ServerError);
      await expect(CleaningTask.setCompleted(10, false)).rejects.toEqual(
        expect.objectContaining({
          message:
            "An error occurred. Check that cleaningTaskId is a valid cleaning task identifier",
          statusCode: 500,
        })
      );
    });
  });

  describe("delete()", () => {
    test("Throws a server error when cleaningTaskId is not an integer", async () => {
      await expect(CleaningTask.delete("test" as any)).rejects.toThrow(ServerError);
      await expect(CleaningTask.delete("test" as any)).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskId must be an integer",
          statusCode: 400,
        })
      );

      await expect(CleaningTask.delete(5.5)).rejects.toThrow(ServerError);
      await expect(CleaningTask.delete(5.5)).rejects.toEqual(
        expect.objectContaining({
          message: "cleaningTaskId must be an integer",
          statusCode: 400,
        })
      );
    });

    test("Returns a success message when the cleaning task deletion query runs successfully", async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
      });

      await expect(CleaningTask.delete(5)).resolves.toEqual("deletion successful");
    });

    test("Throws a server error when the cleaning task deletion query fails", async () => {
      (query as jest.Mock).mockRejectedValue(new Error());

      await expect(CleaningTask.delete(5)).rejects.toThrow(ServerError);
      await expect(CleaningTask.delete(5)).rejects.toEqual(
        expect.objectContaining({
          message: "An error occurred while deleting the cleaning task",
          statusCode: 500,
        })
      );
    });

    test("Throws a server error when the cleaning task does not exist", async () => {
      (query as jest.Mock).mockResolvedValue({ rowCount: 0 });

      await expect(CleaningTask.delete(1)).rejects.toThrow(
        new ServerError("The cleaning task does not exist", 404)
      );
    });
  });
});
