"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CleaningTaskTemplateList_1 = __importDefault(require("../src/Cleaning/API/CleaningTaskTemplateList"));
const ServerError_1 = __importDefault(require("../ServerError"));
const dbconnection_1 = require("../src/Cleaning/db/dbconnection");
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
            await expect(CleaningTaskTemplateList_1.default.getView("test")).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplateList_1.default.getView("test")).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskTemplateListId must be a number",
                statusCode: 400,
            }));
        });
        test("Returns the cleaning task list template list with the id of cleaningTaskTemplateListId", async () => {
            const mockData = [
                { cleaningtasktemplatelistid: 1, title: "Mondays AM" },
                { cleaningtasktemplatelistid: 2, title: "Tuesdays AM" },
            ];
            dbconnection_1.query.mockResolvedValue({
                rowCount: 1,
                rows: [mockData[1]],
                command: "",
                oid: 0,
                fields: [],
            });
            const result = await CleaningTaskTemplateList_1.default.getView(2);
            expect(result).toEqual({
                cleaningtasktemplatelistid: 2,
                title: "Tuesdays AM",
            });
        });
        test("Throws a server error when there is no cleaning task template list with the id provided", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 0,
                rows: [],
                command: "",
                oid: 0,
                fields: [],
            });
            await expect(CleaningTaskTemplateList_1.default.getView(4)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplateList_1.default.getView(4)).rejects.toEqual(expect.objectContaining({
                message: "There are no cleaning task template lists with the id of 4",
                statusCode: 404,
            }));
        });
        test("Throws a server error if the query fails", async () => {
            dbconnection_1.query.mockRejectedValue(Error);
            await expect(CleaningTaskTemplateList_1.default.getView(3)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplateList_1.default.getView(3)).rejects.toEqual(expect.objectContaining({
                message: "An error occurred while retrieving the cleaning task template list",
                statusCode: 500,
            }));
        });
    });
    describe("removeCleaningTaskTemplate()", () => {
        test("Throws a server error when cleaningTaskTemplateListId is not an integer", async () => {
            await expect(CleaningTaskTemplateList_1.default.removeCleaningTaskTemplate("test", 5)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplateList_1.default.removeCleaningTaskTemplate(5.45, 5)).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskTemplateListId must be an integer",
                statusCode: 400,
            }));
        });
        test("Throws a server error when cleaningTaskTemplateId is not an integer", async () => {
            await expect(CleaningTaskTemplateList_1.default.removeCleaningTaskTemplate(5, 6.3)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplateList_1.default.removeCleaningTaskTemplate(5, false)).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskTemplateId must be an integer",
                statusCode: 400,
            }));
        });
        test("Returns a success message when a cleaning task template is removed successfully", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 1,
            });
            await expect(CleaningTaskTemplateList_1.default.removeCleaningTaskTemplate(5, 5)).resolves.toBe("removal successful");
        });
        test("Throws a server error when the query to remove a cleaning task template fails", async () => {
            dbconnection_1.query.mockRejectedValue(new Error());
            await expect(CleaningTaskTemplateList_1.default.removeCleaningTaskTemplate(5, 5)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplateList_1.default.removeCleaningTaskTemplate(5, 5)).rejects.toEqual(expect.objectContaining({
                message: "An error occurred while removing the cleaning task template from the cleaning task template list",
                statusCode: 500,
            }));
        });
        test("Throws a server error when the cleaning task template list does not contain the cleaning task template", async () => {
            dbconnection_1.query.mockResolvedValue({ rowCount: 0 });
            await expect(CleaningTaskTemplateList_1.default.removeCleaningTaskTemplate(5, 5)).rejects.toThrow(new ServerError_1.default("The cleaning task template list does not contain the cleaning task template", 404));
        });
    });
    describe("addCleaningTaskTemplate()", () => {
        test("Throws a server error when cleaningTaskTemplateListId is not an integer", async () => {
            await expect(CleaningTaskTemplateList_1.default.addCleaningTaskTemplate(true, 2)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplateList_1.default.addCleaningTaskTemplate(4.9, 2)).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskTemplateListId must be an integer",
                statusCode: 400,
            }));
        });
        test("Throws a server error when cleaningTaskTemplateId is not an integer", async () => {
            await expect(CleaningTaskTemplateList_1.default.addCleaningTaskTemplate(1, 2.44)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplateList_1.default.addCleaningTaskTemplate(1, true)).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskTemplateId must be an integer",
                statusCode: 400,
            }));
        });
        test("Returns a success message when the query runs successfully", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 1,
            });
            await expect(CleaningTaskTemplateList_1.default.addCleaningTaskTemplate(5, 5)).resolves.toBe("cleaning task template added successfully");
        });
        test("Throws a server error when the query fails", async () => {
            dbconnection_1.query.mockRejectedValue(new Error());
            await expect(CleaningTaskTemplateList_1.default.addCleaningTaskTemplate(5, 5)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplateList_1.default.addCleaningTaskTemplate(5, 5)).rejects.toEqual(expect.objectContaining({
                message: "An error occurred while adding the cleaning task template to the cleaning task template list",
                statusCode: 500,
            }));
        });
    });
    describe("createCleaningTaskTemplate()", () => {
        test("Throws a server error when cleaningTaskTemplateListId is not an integer", async () => {
            await expect(CleaningTaskTemplateList_1.default.createCleaningTaskTemplate("test", undefined, undefined, undefined)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplateList_1.default.createCleaningTaskTemplate(5.77, undefined, undefined, undefined)).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskTemplateListId must be an integer",
                statusCode: 400,
            }));
        });
        test("Throws a server error when cleaningTaskTemplateDescription is not a non-empty string", async () => {
            await expect(CleaningTaskTemplateList_1.default.createCleaningTaskTemplate(1, undefined, undefined, undefined)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplateList_1.default.createCleaningTaskTemplate(1, "", undefined, undefined)).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskTemplateDescription must be a non-empty string",
                statusCode: 400,
            }));
        });
        describe("cleaning task doesn't exists; area does", () => {
            test("Throws a server error when areaId is not an integer", async () => {
                await expect(CleaningTaskTemplateList_1.default.createCleaningTaskTemplate(1, "test", false, undefined)).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskTemplateList_1.default.createCleaningTaskTemplate(1, "test", 1.55, undefined)).rejects.toEqual(expect.objectContaining({
                    message: "areaId must be an integer",
                    statusCode: 400,
                }));
            });
            test("Returns the id of the new cleaning task template when the transaction executes successfully", async () => {
                dbconnection_1.executeTransaction.mockImplementation(async (transactionQueries) => {
                    // mock each callo to query
                    const mockClient = {
                        query: jest
                            .fn()
                            .mockResolvedValueOnce({ rows: [{ cleaningtasktemplateid: 1 }] })
                            .mockResolvedValueOnce({ rowCount: 1 }),
                    };
                    return transactionQueries(mockClient);
                });
                await expect(CleaningTaskTemplateList_1.default.createCleaningTaskTemplate(1, "test", 4, undefined)).resolves.toBe(1);
            });
            test("Throws a server error if one of the queries in the transaction fail", async () => {
                dbconnection_1.executeTransaction.mockImplementation(async (transactionQueries) => {
                    // Mock each call to query
                    const mockClient = {
                        query: jest.fn().mockRejectedValueOnce(new Error()), // Failure creating cleaning task
                    };
                    return transactionQueries(mockClient);
                });
                await expect(CleaningTaskTemplateList_1.default.createCleaningTaskTemplate(4, "test", 5, undefined)).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskTemplateList_1.default.createCleaningTaskTemplate(4, "test", 5, undefined)).rejects.toEqual(expect.objectContaining({
                    message: "An error occurred while creating the new cleaning task template",
                    statusCode: 500,
                }));
            });
        });
        describe("both cleaning task template and area don't exist", () => {
            test("Throws a server error when areaDescription is not a non-empty string", async () => {
                await expect(CleaningTaskTemplateList_1.default.createCleaningTaskTemplate(1, "test", undefined, 1)).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskTemplateList_1.default.createCleaningTaskTemplate(1, "test", undefined, "")).rejects.toEqual(expect.objectContaining({
                    message: "areaDescription must be a non-empty string",
                    statusCode: 400,
                }));
            });
            test("Returns the id of the new cleaning task template when the transaction executes successfully", async () => {
                dbconnection_1.executeTransaction.mockImplementation(async (transactionQueries) => {
                    // mock each callo to query
                    const mockClient = {
                        query: jest
                            .fn()
                            .mockResolvedValueOnce({ rows: [{ areaid: 55 }] })
                            .mockResolvedValueOnce({ rows: [{ cleaningtasktemplateid: 44 }] })
                            .mockResolvedValueOnce({ rowCount: 1 }),
                    };
                    return transactionQueries(mockClient);
                });
                await expect(CleaningTaskTemplateList_1.default.createCleaningTaskTemplate(22, "test", undefined, "test area")).resolves.toBe(44);
            });
            test("Throws a server error when the transaction fails", async () => {
                dbconnection_1.executeTransaction.mockImplementation(async (transactionQueries) => {
                    // mock each callo to query
                    const mockClient = {
                        query: jest
                            .fn()
                            .mockResolvedValueOnce({ rows: [{ areaid: 55 }] })
                            .mockRejectedValueOnce(new Error()),
                    };
                    return transactionQueries(mockClient);
                });
                await expect(CleaningTaskTemplateList_1.default.createCleaningTaskTemplate(22, "test", undefined, "test area")).rejects.toThrow(ServerError_1.default);
                await expect(CleaningTaskTemplateList_1.default.createCleaningTaskTemplate(22, "test", undefined, "test area")).rejects.toEqual(expect.objectContaining({
                    message: "An error occurred during the operation",
                    statusCode: 500,
                }));
            });
        });
        test("Throws a server error when invalid arguments are supplied", async () => {
            await expect(CleaningTaskTemplateList_1.default.createCleaningTaskTemplate(undefined, undefined, undefined, undefined)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplateList_1.default.createCleaningTaskTemplate(1, "test", undefined, undefined)).rejects.toEqual(expect.objectContaining({
                message: "Invalid arguments supplied",
                statusCode: 400,
            }));
        });
    });
    describe("getCleaningTaskTemplates", () => {
        test("Throws an error when cleaningTaskTemplateListId is not an integer", async () => {
            await expect(CleaningTaskTemplateList_1.default.getCleaningTaskTemplates("test")).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplateList_1.default.getCleaningTaskTemplates("test")).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskTemplateListId must be an integer",
                statusCode: 400,
            }));
        });
        test("Returns a list of cleaning task templates", async () => {
            dbconnection_1.query.mockResolvedValue({
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
            await expect(CleaningTaskTemplateList_1.default.getCleaningTaskTemplates(2)).resolves.toEqual([4, 9]);
        });
        test("Throws a server error when no cleaning task templates are found", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 0,
            });
            await expect(CleaningTaskTemplateList_1.default.getCleaningTaskTemplates(5)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplateList_1.default.getCleaningTaskTemplates(5)).rejects.toEqual(expect.objectContaining({
                message: "There are no cleaning task templates linked to the cleaning task template list",
                statusCode: 404,
            }));
        });
        test("Throws an error when the query fails", async () => {
            dbconnection_1.query.mockRejectedValue(new Error());
            await expect(CleaningTaskTemplateList_1.default.getCleaningTaskTemplates(5)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplateList_1.default.getCleaningTaskTemplates(5)).rejects.toEqual(expect.objectContaining({
                message: "An error occurred while retrieving cleaning task template ids",
                statusCode: 500,
            }));
        });
    });
    describe("new()", () => {
        test("Throws a server error when title is not a non-empty string", async () => {
            await expect(CleaningTaskTemplateList_1.default.new(4)).rejects.toThrow(new ServerError_1.default("title must be a non-empty string", 400));
            await expect(CleaningTaskTemplateList_1.default.new("")).rejects.toThrow(new ServerError_1.default("title must be a non-empty string", 400));
        });
        test("Returns the id of the new cleaning task template list", async () => {
            dbconnection_1.query.mockResolvedValue({
                rows: [{ cleaningtasktemplatelistid: 77 }],
            });
            await expect(CleaningTaskTemplateList_1.default.new("test")).resolves.toBe(77);
        });
        test("Throws a server error when the query fails", async () => {
            dbconnection_1.query.mockRejectedValue(new Error());
            await expect(CleaningTaskTemplateList_1.default.new("test")).rejects.toThrow(new ServerError_1.default("An error occurred while creating the new cleaning task template list", 500));
        });
    });
    describe("delete()", () => {
        test("Throws a server error when cleaningTaskTemplateListId is not an integer", async () => {
            await expect(CleaningTaskTemplateList_1.default.delete(101.1)).rejects.toThrow(new ServerError_1.default("cleaningTaskTemplateListId must be an integer", 400));
            await expect(CleaningTaskTemplateList_1.default.delete(false)).rejects.toThrow(new ServerError_1.default("cleaningTaskTemplateListId must be an integer", 400));
        });
        test("Returns a success message when the cleaning task template list is deleted successfully", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 1,
            });
            await expect(CleaningTaskTemplateList_1.default.delete(5)).resolves.toBe("deletion successful");
        });
        test("Throws a server error when the query fails", async () => {
            dbconnection_1.query.mockRejectedValue(new Error());
            await expect(CleaningTaskTemplateList_1.default.delete(5)).rejects.toThrow(new ServerError_1.default("An error occurred while deleting the cleaning task template", 500));
        });
        test("Throws a server error when the cleaning task template list does not exist", async () => {
            dbconnection_1.query.mockResolvedValue({ rowCount: 0 });
            await expect(CleaningTaskTemplateList_1.default.delete(1)).rejects.toThrow(new ServerError_1.default("The cleaning task template list does not exist", 404));
        });
    });
});
