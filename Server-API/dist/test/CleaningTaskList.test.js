"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CleaningTaskList_1 = __importDefault(require("../src/Cleaning/API/CleaningTaskList"));
const ServerError_1 = __importDefault(require("../ServerError"));
const dbconnection_1 = require("../src/Cleaning/db/dbconnection");
const CleaningTask_1 = __importDefault(require("../src/Cleaning/API/CleaningTask"));
const CleaningTaskTemplate_1 = __importDefault(require("../src/Cleaning/API/CleaningTaskTemplate"));
const CleaningTaskTemplateList_1 = __importDefault(require("../src/Cleaning/API/CleaningTaskTemplateList"));
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
            await expect(CleaningTaskList_1.default.getView("hello")).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.getView("hello")).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskListId must be a number",
                statusCode: 400,
            }));
        });
        test("Returns the cleaning task list with the id provided", async () => {
            const mockData = [
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
            dbconnection_1.query.mockResolvedValue({
                rowCount: 1,
                rows: mockData,
                command: "",
                oid: 0,
                fields: [],
            });
            const result = await CleaningTaskList_1.default.getView(1);
            expect(result).toEqual(mockData[0]);
        });
        test("Throws a server error when no cleaning task list with the provided id exists", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 0,
                rows: [],
                command: "",
                oid: 0,
                fields: [],
            });
            await expect(CleaningTaskList_1.default.getView(1)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.getView(1)).rejects.toEqual(expect.objectContaining({
                message: "There are no cleaning task lists stored in the system",
                statusCode: 404,
            }));
        });
        test("Throws a server error when the query fails or another error occurs", async () => {
            dbconnection_1.query.mockRejectedValue(Error);
            await expect(CleaningTaskList_1.default.getView(1)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.getView(1)).rejects.toEqual(expect.objectContaining({
                message: "An error occurred while retrieving the cleaning task list",
                statusCode: 500,
            }));
        });
    });
    describe("markCleaningTaskAsComplete()", () => {
        test("Throws a server error if cleaningTaskId is not a number", async () => {
            await expect(CleaningTaskList_1.default.markCleaningTaskAsComplete("test")).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.markCleaningTaskAsComplete("test")).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskId must be a number",
                statusCode: 400,
            }));
        });
        test("Throws a server error when the cleaning task does not exist", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 0,
                rows: [],
                command: "",
                oid: 0,
                fields: [],
            });
            await expect(CleaningTaskList_1.default.markCleaningTaskAsComplete(3)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.markCleaningTaskAsComplete(3)).rejects.toEqual(expect.objectContaining({
                message: "The cleaning task with id 3 does not exist",
                statusCode: 404,
            }));
        });
        test("Returns a success message when the operation completes successfully", async () => {
            dbconnection_1.query.mockResolvedValue({
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
            const mockSetCompleted = jest.fn(CleaningTask_1.default.setCompleted);
            mockSetCompleted.mockResolvedValue("update successful");
            const result = await CleaningTaskList_1.default.markCleaningTaskAsComplete(1);
            expect(result).toBe("update successful");
        });
        test("Throws a server error when the cleaning task is already marked as completed", async () => {
            dbconnection_1.query.mockResolvedValue({
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
            await expect(CleaningTaskList_1.default.markCleaningTaskAsComplete(1)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.markCleaningTaskAsComplete(1)).rejects.toEqual(expect.objectContaining({
                message: "The cleaning task is already completed",
                statusCode: 400,
            }));
        });
        test("Throws a server error when a query fails or other unexpected error occurs", async () => {
            dbconnection_1.query.mockRejectedValue(new Error("db error"));
            await expect(CleaningTaskList_1.default.markCleaningTaskAsComplete(1)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.markCleaningTaskAsComplete(1)).rejects.toEqual(expect.objectContaining({
                message: "An unexpected error occurred",
                statusCode: 500,
            }));
        });
        test("Throws an error thrown in the CleaningTask.setCompleted method", async () => {
            // mock the setCompleted function
            jest
                .spyOn(CleaningTask_1.default, "setCompleted")
                .mockRejectedValue(new ServerError_1.default("An error occurred. Check that cleaningTaskId is a valid cleaning task identifier", 500));
            // mock the query function
            dbconnection_1.query.mockResolvedValue({
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
            await expect(CleaningTaskList_1.default.markCleaningTaskAsComplete(3)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.markCleaningTaskAsComplete(3)).rejects.toEqual(expect.objectContaining({
                message: "An error occurred. Check that cleaningTaskId is a valid cleaning task identifier",
                statusCode: 500,
            }));
        });
    });
    describe("markCleaningTaskAsIncomplete()", () => {
        test("Throws a sever error if the type of cleaningTaskId is not a number", async () => {
            await expect(CleaningTaskList_1.default.markCleaningTaskAsIncomplete("test")).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.markCleaningTaskAsIncomplete("test")).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskId must be a number",
                statusCode: 400,
            }));
        });
        test("Throws a server error if the query fails", async () => {
            dbconnection_1.query.mockRejectedValue(Error());
            await expect(CleaningTaskList_1.default.markCleaningTaskAsIncomplete(1)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.markCleaningTaskAsIncomplete(1)).rejects.toEqual(expect.objectContaining({
                message: "An unexpected error occurred",
                statusCode: 500,
            }));
        });
        test("Throws a server error when the cleaning task does not exist", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 0,
                rows: [],
                command: "",
                oid: 0,
                fields: [],
            });
            await expect(CleaningTaskList_1.default.markCleaningTaskAsIncomplete(1)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.markCleaningTaskAsIncomplete(1)).rejects.toEqual(expect.objectContaining({
                message: "The cleaning task with id 1 does not exist",
                statusCode: 404,
            }));
        });
        test("Throws a server error when the cleaning task is already incomplete", async () => {
            dbconnection_1.query.mockResolvedValue({
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
            await expect(CleaningTaskList_1.default.markCleaningTaskAsIncomplete(3)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.markCleaningTaskAsIncomplete(3)).rejects.toEqual(expect.objectContaining({
                message: "The cleaning task is already marked as incomplete",
                statusCode: 400,
            }));
        });
        test("Returns a string indicating success when completed is false and cleaningTaskId is valid", async () => {
            dbconnection_1.query.mockResolvedValue({
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
            await expect(CleaningTaskList_1.default.markCleaningTaskAsIncomplete(15)).resolves.toBe("update successful");
        });
    });
    describe("setManagerSignature(); also tests setSignatureCheckParams()", () => {
        test("Throws a server error when signature is not a string", async () => {
            await expect(CleaningTaskList_1.default.setManagerSignature(1, 1)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.setManagerSignature(1, 1)).rejects.toEqual(expect.objectContaining({
                message: "signature must be a string",
                statusCode: 400,
            }));
        });
        test("Throws a server error when signature is an empty string", async () => {
            await expect(CleaningTaskList_1.default.setManagerSignature(1, "")).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.setManagerSignature(1, "")).rejects.toEqual(expect.objectContaining({
                message: "signature must not be empty",
                statusCode: 400,
            }));
        });
        test("Throws a server error when cleaningTaskListId is not a number", async () => {
            await expect(CleaningTaskList_1.default.setManagerSignature("test", "test")).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.setManagerSignature("test", "test")).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskListId must be an integer",
                statusCode: 400,
            }));
        });
        test("Throws a server error when cleaningTaskListId is not an integer", async () => {
            await expect(CleaningTaskList_1.default.setManagerSignature(1.33, "test")).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.setManagerSignature(1.33, "test")).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskListId must be an integer",
                statusCode: 400,
            }));
        });
        test("Returns update successful when the query completes successfully", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 1,
                rows: [],
                command: "",
                oid: 0,
                fields: [],
            });
            await expect(CleaningTaskList_1.default.setManagerSignature(1, "test")).resolves.toEqual("update successful");
        });
        test("Throws a server error when the query fails", async () => {
            dbconnection_1.query.mockRejectedValue(new Error("db error"));
            await expect(CleaningTaskList_1.default.setManagerSignature(1, "test")).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.setManagerSignature(1, "test")).rejects.toEqual(expect.objectContaining({
                message: "An error occurred while updating the cleaning task list. Check that the cleaning task list exists",
                statusCode: 500,
            }));
        });
        test("Throws a server error when the cleaning task list does not exist", async () => {
            dbconnection_1.query.mockResolvedValue({ rowCount: 0 });
            await expect(CleaningTaskList_1.default.setManagerSignature(1, "test")).rejects.toThrow(new ServerError_1.default("The cleaning task list does not exist", 404));
        });
    });
    describe("setStaffMemberSignature(); also tests setSignatureCheckParams()", () => {
        test("Throws a server error when signature is not a string", async () => {
            await expect(CleaningTaskList_1.default.setStaffMemberSignature(1, 1)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.setStaffMemberSignature(1, 1)).rejects.toEqual(expect.objectContaining({
                message: "signature must be a string",
                statusCode: 400,
            }));
        });
        test("Throws a server error when signature is an empty string", async () => {
            await expect(CleaningTaskList_1.default.setStaffMemberSignature(1, "")).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.setStaffMemberSignature(1, "")).rejects.toEqual(expect.objectContaining({
                message: "signature must not be empty",
                statusCode: 400,
            }));
        });
        test("Throws a server error when cleaningTaskListId is not a number", async () => {
            await expect(CleaningTaskList_1.default.setStaffMemberSignature("test", "test")).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.setStaffMemberSignature("test", "test")).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskListId must be an integer",
                statusCode: 400,
            }));
        });
        test("Throws a server error when cleaningTaskListId is not an integer", async () => {
            await expect(CleaningTaskList_1.default.setStaffMemberSignature(1.33, "test")).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.setStaffMemberSignature(1.33, "test")).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskListId must be an integer",
                statusCode: 400,
            }));
        });
        test("Returns update successful when the query completes successfully", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 1,
                rows: [],
                command: "",
                oid: 0,
                fields: [],
            });
            await expect(CleaningTaskList_1.default.setStaffMemberSignature(1, "test")).resolves.toEqual("update successful");
        });
        test("Throws a server error when the query fails", async () => {
            dbconnection_1.query.mockRejectedValue(new Error("db error"));
            await expect(CleaningTaskList_1.default.setStaffMemberSignature(1, "test")).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.setStaffMemberSignature(1, "test")).rejects.toEqual(expect.objectContaining({
                message: "An error occurred while updating the cleaning task list. Check that the cleaning task list exists",
                statusCode: 500,
            }));
        });
        test("Throws a server error when the cleaning task list does not exist", async () => {
            dbconnection_1.query.mockResolvedValue({ rowCount: 0 });
            await expect(CleaningTaskList_1.default.setStaffMemberSignature(1, "test")).rejects.toThrow(new ServerError_1.default("The cleaning task list does not exist", 404));
        });
    });
    describe("createCleaningTask()", () => {
        test("Throws a server error when cleaningTaskListId is not an integer", async () => {
            await expect(CleaningTaskList_1.default.createCleaningTask("test", undefined, undefined, undefined, undefined)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.createCleaningTask("test", undefined, undefined, undefined, undefined)).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskListId must be an integer",
                statusCode: 400,
            }));
            await expect(CleaningTaskList_1.default.createCleaningTask(1.22, undefined, undefined, undefined, undefined)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.createCleaningTask(1.22, undefined, undefined, undefined, undefined)).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskListId must be an integer",
                statusCode: 400,
            }));
        });
        describe("Cleaning task template and area exist", () => {
            test("Throws a server error when cleaningTaskTemplateId is not an integer", async () => {
                await expect(CleaningTaskList_1.default.createCleaningTask(1, "test", undefined, undefined, undefined)).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskList_1.default.createCleaningTask(1, "test", undefined, undefined, undefined)).rejects.toEqual(expect.objectContaining({
                    message: "cleaningTaskTemplateId must be an integer",
                    statusCode: 400,
                }));
                await expect(CleaningTaskList_1.default.createCleaningTask(1, 1.22, undefined, undefined, undefined)).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskList_1.default.createCleaningTask(1, 1.22, undefined, undefined, undefined)).rejects.toEqual(expect.objectContaining({
                    message: "cleaningTaskTemplateId must be an integer",
                    statusCode: 400,
                }));
            });
            test("Returns the id of the new cleaning task when it is created successfully in the try block", async () => {
                // Create mocks
                jest.spyOn(CleaningTaskTemplate_1.default, "getDescription").mockResolvedValue("test description");
                jest.spyOn(CleaningTaskTemplate_1.default, "getArea").mockResolvedValue(1);
                dbconnection_1.query.mockResolvedValue({
                    rowCount: 1,
                    rows: [{ cleaningtaskid: 5 }],
                    command: "",
                    oid: 0,
                    fields: [],
                });
                await expect(CleaningTaskList_1.default.createCleaningTask(1, 1, undefined, undefined, undefined)).resolves.toEqual(5);
            });
            test("Throws a server error thrown in the getDescription or getArea methods of CleaningTaskTemplate", async () => {
                // mock getDescription method
                jest
                    .spyOn(CleaningTaskTemplate_1.default, "getDescription")
                    .mockRejectedValue(new ServerError_1.default("An error occurred when retrieving the cleaning task template description. Check that cleaningTaskTemplateId is valid", 500));
                await expect(CleaningTaskList_1.default.createCleaningTask(1, 1, undefined, undefined, undefined)).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskList_1.default.createCleaningTask(1, 1, undefined, undefined, undefined)).rejects.toEqual(expect.objectContaining({
                    message: "An error occurred when retrieving the cleaning task template description. Check that cleaningTaskTemplateId is valid",
                    statusCode: 500,
                }));
                jest.restoreAllMocks();
                // mock the getDescription method with resolved value
                jest.spyOn(CleaningTaskTemplate_1.default, "getDescription").mockResolvedValue("test description");
                // mock getArea method
                jest
                    .spyOn(CleaningTaskTemplate_1.default, "getArea")
                    .mockRejectedValue(new ServerError_1.default("An error occurred while retrieving the areaId from the cleaning task template. Check that cleaningTaskTemplateId is valid", 500));
                await expect(CleaningTaskList_1.default.createCleaningTask(1, 1, undefined, undefined, undefined)).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskList_1.default.createCleaningTask(1, 1, undefined, undefined, undefined)).rejects.toEqual(expect.objectContaining({
                    message: "An error occurred while retrieving the areaId from the cleaning task template. Check that cleaningTaskTemplateId is valid",
                    statusCode: 500,
                }));
            });
            test("Throws a server error when the create cleaning task query fails", async () => {
                // Create mocks with resolve values
                jest.spyOn(CleaningTaskTemplate_1.default, "getDescription").mockResolvedValue("test description");
                jest.spyOn(CleaningTaskTemplate_1.default, "getArea").mockResolvedValue(1);
                // Mock the query function to throw an error
                dbconnection_1.query.mockRejectedValue(new Error());
                await expect(CleaningTaskList_1.default.createCleaningTask(1, 1, undefined, undefined, undefined)).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskList_1.default.createCleaningTask(1, 1, undefined, undefined, undefined)).rejects.toEqual(expect.objectContaining({
                    message: "An error occurred while creating the new cleaning task",
                    statusCode: 500,
                }));
            });
        });
        describe("Cleaning task template doesn't exist; area does", () => {
            test("Throws a server error if cleaningTaskDescription is not a string or is an empty string", async () => {
                await expect(CleaningTaskList_1.default.createCleaningTask(1, undefined, 1, undefined, 4)).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskList_1.default.createCleaningTask(1, undefined, 1, undefined, 4)).rejects.toEqual(expect.objectContaining({
                    message: "cleaningTaskDescription must be a non-empty string",
                    statusCode: 400,
                }));
                await expect(CleaningTaskList_1.default.createCleaningTask(1, undefined, "", undefined, 4)).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskList_1.default.createCleaningTask(1, undefined, "", undefined, 4)).rejects.toEqual(expect.objectContaining({
                    message: "cleaningTaskDescription must be a non-empty string",
                    statusCode: 400,
                }));
            });
            test("Throws a server error if areaId is not an integer", async () => {
                await expect(CleaningTaskList_1.default.createCleaningTask(1, undefined, "test", undefined, "test")).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskList_1.default.createCleaningTask(1, undefined, "test", undefined, "test")).rejects.toEqual(expect.objectContaining({
                    message: "areaId must be an integer",
                    statusCode: 400,
                }));
                await expect(CleaningTaskList_1.default.createCleaningTask(1, undefined, "test", undefined, 19.99)).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskList_1.default.createCleaningTask(1, undefined, "test", undefined, 19.99)).rejects.toEqual(expect.objectContaining({
                    message: "areaId must be an integer",
                    statusCode: 400,
                }));
            });
            test("Returns the cleaning task id of the cleaning task when it is successfully created", async () => {
                dbconnection_1.query.mockResolvedValue({
                    rowCount: 1,
                    rows: [{ cleaningtaskid: 99 }],
                    command: "",
                    oid: 0,
                    fields: [],
                });
                await expect(CleaningTaskList_1.default.createCleaningTask(7, undefined, "test", undefined, 5)).resolves.toEqual(99);
            });
            test("Throws a server error when the cleaning task creation query fails", async () => {
                dbconnection_1.query.mockRejectedValue(new Error());
                await expect(CleaningTaskList_1.default.createCleaningTask(4, undefined, "test", undefined, 3)).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskList_1.default.createCleaningTask(4, undefined, "test", undefined, 3)).rejects.toEqual(expect.objectContaining({
                    message: "An error occurred while creating the new cleaning task",
                    statusCode: 500,
                }));
            });
        });
        describe("Both the cleaning task template and area don't exist", () => {
            test("Throws a server error when cleaningTaskDescription is an empty string or not a string", async () => {
                await expect(CleaningTaskList_1.default.createCleaningTask(1, undefined, 1, "test", undefined)).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskList_1.default.createCleaningTask(1, undefined, 1, "test", undefined)).rejects.toEqual(expect.objectContaining({
                    message: "cleaningTaskDescription must be a non-empty string",
                    statusCode: 400,
                }));
                await expect(CleaningTaskList_1.default.createCleaningTask(1, undefined, 1, "test", undefined)).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskList_1.default.createCleaningTask(1, undefined, 1, "test", undefined)).rejects.toEqual(expect.objectContaining({
                    message: "cleaningTaskDescription must be a non-empty string",
                    statusCode: 400,
                }));
            });
            test("Throws a server error if areaDescription isn't a string or or an empty string", async () => {
                await expect(CleaningTaskList_1.default.createCleaningTask(1, undefined, "test", 1, undefined)).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskList_1.default.createCleaningTask(1, undefined, "test", 1, undefined)).rejects.toEqual(expect.objectContaining({
                    message: "areaDescription must be a non-empty string",
                    statusCode: 400,
                }));
                await expect(CleaningTaskList_1.default.createCleaningTask(1, undefined, "test", 1, undefined)).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskList_1.default.createCleaningTask(1, undefined, "test", 1, undefined)).rejects.toEqual(expect.objectContaining({
                    message: "areaDescription must be a non-empty string",
                    statusCode: 400,
                }));
            });
            test("Returns the cleaning task id of the new cleaning task", async () => {
                dbconnection_1.executeTransaction.mockImplementation(async (transactionQueries) => {
                    // Mock each call to query
                    const mockClient = {
                        query: jest
                            .fn()
                            .mockResolvedValueOnce({ rows: [{ areaid: 1 }] }) // First query - create Area
                            .mockResolvedValueOnce({ rows: [{ cleaningtaskid: 99 }] }), // Second query - create CleaningTask
                    };
                    return transactionQueries(mockClient);
                });
                await expect(CleaningTaskList_1.default.createCleaningTask(4, undefined, "test cleaning task", "test area", undefined)).resolves.toEqual(99);
            });
            test("Throws a server error if either of the queries in the transaction fail", async () => {
                dbconnection_1.executeTransaction.mockImplementation(async (transactionQueries) => {
                    // Mock each call to query
                    const mockClient = {
                        query: jest.fn().mockRejectedValue(new Error()), // Failure creating Area
                    };
                    return transactionQueries(mockClient);
                });
                await expect(CleaningTaskList_1.default.createCleaningTask(4, undefined, "test cleaning task", "test area", undefined)).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskList_1.default.createCleaningTask(4, undefined, "test cleaning task", "test area", undefined)).rejects.toEqual(expect.objectContaining({
                    message: "an error occurred while creating the new cleaning task",
                    statusCode: 500,
                }));
                jest.restoreAllMocks();
                dbconnection_1.executeTransaction.mockImplementation(async (transactionQueries) => {
                    // Mock each call to query
                    const mockClient = {
                        query: jest
                            .fn()
                            .mockResolvedValueOnce({ rows: [{ areaid: 1 }] }) // success creating Area
                            .mockRejectedValueOnce(new Error()), // Failure creating CleaningTask
                    };
                    return transactionQueries(mockClient);
                });
                await expect(CleaningTaskList_1.default.createCleaningTask(4, undefined, "test cleaning task", "test area", undefined)).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskList_1.default.createCleaningTask(4, undefined, "test cleaning task", "test area", undefined)).rejects.toEqual(expect.objectContaining({
                    message: "an error occurred while creating the new cleaning task",
                    statusCode: 500,
                }));
            });
        });
        test("Throws a server error when invalid arguments are supplied", async () => {
            await expect(CleaningTaskList_1.default.createCleaningTask(5, undefined, undefined, undefined, 4)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskList_1.default.createCleaningTask(5, undefined, undefined, undefined, 4)).rejects.toEqual(expect.objectContaining({
                message: "invalid parameters supplied for creating a cleaning task",
                statusCode: 400,
            }));
        });
    });
    describe("new()", () => {
        test("Throws a server error if cleaningTaskTemplateListId is not an integer", async () => {
            await expect(CleaningTaskList_1.default.new(1.22, new Date(), undefined)).rejects.toThrow(new ServerError_1.default("cleaningTaskTemplateListId must be an integer", 400));
        });
        test("Throws a server error if date is not a valid date", async () => {
            await expect(CleaningTaskList_1.default.new(1, "invalid", undefined)).rejects.toThrow(new ServerError_1.default("date must be a valid Date", 400));
        });
        test("Throws a server error if date is in the past", async () => {
            await expect(CleaningTaskList_1.default.new(1, new Date("2022-04-21"), undefined)).rejects.toThrow(new ServerError_1.default("date cannot be in the past", 400));
        });
        test("Throws a server error if staffMemberId is not an integer or undefined", async () => {
            await expect(CleaningTaskList_1.default.new(1, new Date("2025-12-04"), 1.22)).rejects.toThrow(new ServerError_1.default("staffMemberId must be an integer or undefined", 400));
        });
        test("Returns the cleaning task list id of the new cleaning task list when the operation runs successfully", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 1,
            });
            dbconnection_1.executeTransaction.mockImplementation(async (transactionQueries) => {
                const mockClient = {
                    query: jest
                        .fn()
                        .mockResolvedValueOnce({ rows: [{ cleaningtasklistid: 5 }], rowCount: 1 })
                        .mockResolvedValueOnce({ rowCount: 1 }),
                };
                return transactionQueries(mockClient);
            });
            jest.spyOn(CleaningTaskTemplateList_1.default, "getCleaningTaskTemplates").mockResolvedValue([4, 6]);
            jest
                .spyOn(CleaningTaskTemplate_1.default, "getDescription")
                .mockResolvedValueOnce("test description 1")
                .mockResolvedValueOnce("test description 2");
            jest.spyOn(CleaningTaskTemplate_1.default, "getArea").mockResolvedValueOnce(3).mockResolvedValueOnce(4);
            await expect(CleaningTaskList_1.default.new(1, new Date("2025-01-01"), undefined)).resolves.toBe(5);
        });
        test("Catches the server error thrown from CleaningTaskTemplateList.getCleaningTaskTemplates when no clenaing task templates are linked to the cleaning task template list", async () => {
            dbconnection_1.executeTransaction.mockImplementation(async (transactionQueries) => {
                const mockClient = {
                    query: jest.fn().mockResolvedValueOnce({ rows: [{ cleaningtasklistid: 5 }] }),
                };
                return transactionQueries(mockClient);
            });
            jest
                .spyOn(CleaningTaskTemplateList_1.default, "getCleaningTaskTemplates")
                .mockRejectedValue(new ServerError_1.default("There are no cleaning task templates linked to the cleaning task template list", 404));
            await expect(CleaningTaskList_1.default.new(1, new Date("2025-01-01"), undefined)).resolves.toBe(5);
        });
        test("Throws a server error thrown in CleaningTaskTemplateList.getCleaningTaskTemplates", async () => {
            dbconnection_1.executeTransaction.mockImplementation(async (transactionQueries) => {
                const mockClient = {
                    query: jest.fn().mockResolvedValueOnce({ rows: [{ cleaningtasklistid: 5 }] }),
                };
                return transactionQueries(mockClient);
            });
            jest
                .spyOn(CleaningTaskTemplateList_1.default, "getCleaningTaskTemplates")
                .mockRejectedValue(new ServerError_1.default("An error occurred while retrieving cleaning task template ids", 500));
            await expect(CleaningTaskList_1.default.new(1, new Date("2025-01-01"), undefined)).rejects.toThrow(new ServerError_1.default("An error occurred while retrieving cleaning task template ids", 500));
        });
        test("Throws a server error if a query fails", async () => {
            dbconnection_1.executeTransaction.mockImplementation(async (transactionQueries) => {
                const mockClient = {
                    query: jest.fn().mockRejectedValueOnce(new Error()),
                };
                return transactionQueries(mockClient);
            });
            await expect(CleaningTaskList_1.default.new(1, new Date("2025-01-01"), undefined)).rejects.toThrow(new ServerError_1.default("An error occurred while creating the new cleaning task list", 500));
        });
        test("Throws a server error when the cleaning task template list does not exist", async () => {
            dbconnection_1.query.mockResolvedValue({ rowCount: 0 });
            await expect(CleaningTaskList_1.default.new(1, new Date("2025-01-01"), undefined)).rejects.toThrow(new ServerError_1.default("The cleaning task template list doesn't exist", 404));
        });
    });
    describe("delete()", () => {
        test("Throws a server error when cleaningTaskListId is not an integer", async () => {
            await expect(CleaningTaskList_1.default.delete(1.22)).rejects.toThrow(new ServerError_1.default("cleaningTaskListId must be an integer", 400));
        });
        test("Returns a success message when the query runs successfully", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 1,
            });
            await expect(CleaningTaskList_1.default.delete(5)).resolves.toBe("deletion successful");
        });
        test("Throws a server error when the query fails", async () => {
            dbconnection_1.query.mockRejectedValue(new Error());
            await expect(CleaningTaskList_1.default.delete(5)).rejects.toThrow(new ServerError_1.default("An error occurred while deleting the cleaning task list", 500));
        });
        test("Throws a server error when the cleaning task list does not exist", async () => {
            dbconnection_1.query.mockResolvedValue({ rowCount: 0 });
            await expect(CleaningTaskList_1.default.delete(1)).rejects.toThrow(new ServerError_1.default("The cleaning task list does not exist", 404));
        });
    });
});
