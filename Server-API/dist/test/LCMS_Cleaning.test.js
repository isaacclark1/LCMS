"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LCMS_Cleaning_1 = __importDefault(require("../src/Cleaning/API/LCMS_Cleaning"));
const ServerError_1 = __importDefault(require("../ServerError"));
const dbconnection_1 = require("../src/Cleaning/db/dbconnection");
const CleaningTaskList_1 = __importDefault(require("../src/Cleaning/API/CleaningTaskList"));
const CleaningTask_1 = __importDefault(require("../src/Cleaning/API/CleaningTask"));
const CleaningTaskTemplateList_1 = __importDefault(require("../src/Cleaning/API/CleaningTaskTemplateList"));
// Mock the query function so outputs can be controlled.
jest.mock("../src/Cleaning/db/dbconnection", () => ({
    query: jest.fn(),
}));
describe("LCMS_Cleaning", () => {
    // clear mock calls and instances after each test.
    afterEach(() => jest.clearAllMocks());
    describe("getCleaningTaskTemplateLists()", () => {
        test("Throws a server error indicating that no cleaning task template lists are stored in the database when there are no cleaning task template lists stored in the database", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 0,
                rows: [],
                command: "",
                oid: 0,
                fields: [],
            });
            await expect(LCMS_Cleaning_1.default.getCleaningTaskTemplateLists()).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.getCleaningTaskTemplateLists()).rejects.toEqual(expect.objectContaining({
                message: "There are no cleaning task template lists stored in the system",
                statusCode: 404,
            }));
        });
        test("Should return all cleaning task template lists stored in the database", async () => {
            const mockData = [
                { cleaningtasktemplatelistid: 1, title: "Mondays AM" },
                { cleaningtasktemplatelistid: 2, title: "Tuesdays AM" },
            ];
            dbconnection_1.query.mockResolvedValue({
                rowCount: 2,
                rows: [
                    { cleaningtasktemplatelistid: 1, title: "Mondays AM" },
                    { cleaningtasktemplatelistid: 2, title: "Tuesdays AM" },
                ],
                command: "",
                oid: 0,
                fields: [],
            });
            const result = await LCMS_Cleaning_1.default.getCleaningTaskTemplateLists();
            expect(result).toBeInstanceOf((Array));
            expect(result).toEqual(mockData);
        });
        test("Throws a server error when the query fails", async () => {
            dbconnection_1.query.mockRejectedValue(Error);
            await expect(LCMS_Cleaning_1.default.getCleaningTaskTemplateLists()).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.getCleaningTaskTemplateLists()).rejects.toEqual(expect.objectContaining({
                message: "An error occurred while retrieving cleaning task template lists",
                statusCode: 500,
            }));
        });
    });
    describe("getCleaningTaskTemplates()", () => {
        test("Throws a server error indicating that no cleaning task templates are stored in the system when there are no cleaning task templates stored in the database", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 0,
                rows: [],
                command: "",
                oid: 0,
                fields: [],
            });
            await expect(LCMS_Cleaning_1.default.getCleaningTaskTemplates()).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.getCleaningTaskTemplates()).rejects.toEqual(expect.objectContaining({
                message: "There are no cleaning task templates stored in the system",
                statusCode: 404,
            }));
        });
        test("Should return all cleaning task templates stored in the system's database", async () => {
            const mockData = [
                { cleaningtasktemplateid: 1, _description: "Hoover floor", areaid: 1 },
                { cleaningtasktemplateid: 2, _description: "Clean skirting boards", areaid: 1 },
                { cleaningtasktemplateid: 3, _description: "Hoover floor", areaid: 2 },
            ];
            dbconnection_1.query.mockResolvedValue({
                rowCount: 3,
                rows: mockData,
                command: "",
                oid: 0,
                fields: [],
            });
            const result = await LCMS_Cleaning_1.default.getCleaningTaskTemplates();
            expect(result).toEqual(mockData);
            expect(result).toBeInstanceOf((Array));
        });
        test("Throws a server error when the query fails", async () => {
            dbconnection_1.query.mockRejectedValue(Error);
            await expect(LCMS_Cleaning_1.default.getCleaningTaskTemplates()).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.getCleaningTaskTemplates()).rejects.toEqual(expect.objectContaining({
                message: "An error occurred while retrieving cleaning task templates",
                statusCode: 500,
            }));
        });
    });
    describe("getAreas()", () => {
        test("Throws a server error indicating that no areas are found in the system when there are no areas stored in the database", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 0,
                rows: [],
                command: "",
                oid: 0,
                fields: [],
            });
            await expect(LCMS_Cleaning_1.default.getAreas()).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.getAreas()).rejects.toEqual(expect.objectContaining({
                message: "There are no areas stored in the system",
                statusCode: 404,
            }));
        });
        test("Should return all areas in the system database", async () => {
            const mockData = [
                { areaid: 1, _description: "Lobby" },
                { areaid: 2, _description: "Conference Room" },
            ];
            dbconnection_1.query.mockResolvedValue({
                rowCount: 2,
                rows: mockData,
                command: "",
                oid: 0,
                fields: [],
            });
            const result = await LCMS_Cleaning_1.default.getAreas();
            expect(result).toEqual(mockData);
            expect(result).toBeInstanceOf((Array));
        });
        test("Throws a sever error when the query fails", async () => {
            dbconnection_1.query.mockRejectedValue(Error);
            await expect(LCMS_Cleaning_1.default.getAreas()).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.getAreas()).rejects.toEqual(expect.objectContaining({
                message: "An error occurred while retrieving areas",
                statusCode: 500,
            }));
        });
    });
    describe("getCleaningTaskLists()", () => {
        test("Throws a server error indicating that there are no cleaning tasks lists stored in the database when there are no cleaning task lists stored in the database", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 0,
                rows: [],
                command: "",
                oid: 0,
                fields: [],
            });
            await expect(LCMS_Cleaning_1.default.getCleaningTaskLists()).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.getCleaningTaskLists()).rejects.toEqual(expect.objectContaining({
                message: "There are no cleaning task lists stored in the system",
                statusCode: 404,
            }));
        });
        test("Should return all cleaning task lists stored in the database", async () => {
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
                rowCount: 2,
                rows: mockData,
                command: "",
                oid: 0,
                fields: [],
            });
            const result = await LCMS_Cleaning_1.default.getCleaningTaskLists();
            expect(result).toBeInstanceOf((Array));
            expect(result).toEqual(mockData);
        });
        test("Throws a server error when the query fails", async () => {
            dbconnection_1.query.mockRejectedValue(Error);
            await expect(LCMS_Cleaning_1.default.getCleaningTaskLists()).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.getCleaningTaskLists()).rejects.toEqual(expect.objectContaining({
                message: "An error occurred while retrieving cleaning task lists",
                statusCode: 500,
            }));
        });
    });
    describe("viewCleaningTaskList()", () => {
        test("Throws a server error when the cleaningTaskListId is not a number", async () => {
            await expect(LCMS_Cleaning_1.default.viewCleaningTaskList("test")).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.viewCleaningTaskList("test")).rejects.toEqual(expect.objectContaining({
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
            const result = await LCMS_Cleaning_1.default.viewCleaningTaskList(1);
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
            await expect(LCMS_Cleaning_1.default.viewCleaningTaskList(1)).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.viewCleaningTaskList(1)).rejects.toEqual(expect.objectContaining({
                message: "There are no cleaning task lists stored in the system",
                statusCode: 404,
            }));
        });
        test("Returns a server error when the query fails or another error occurs", async () => {
            dbconnection_1.query.mockRejectedValue(Error);
            await expect(LCMS_Cleaning_1.default.viewCleaningTaskList(1)).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.viewCleaningTaskList(1)).rejects.toEqual(expect.objectContaining({
                message: "An error occurred while retrieving the cleaning task list",
                statusCode: 500,
            }));
        });
    });
    describe("viewCleaningTaskTemplateList()", () => {
        test("Throws a server error when the cleaningTaskTemplateListId is not a number", async () => {
            await expect(LCMS_Cleaning_1.default.viewCleaningTaskTemplateList("test")).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.viewCleaningTaskTemplateList("test")).rejects.toEqual(expect.objectContaining({
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
            const result = await LCMS_Cleaning_1.default.viewCleaningTaskTemplateList(2);
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
            await expect(LCMS_Cleaning_1.default.viewCleaningTaskTemplateList(4)).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.viewCleaningTaskTemplateList(4)).rejects.toEqual(expect.objectContaining({
                message: "There are no cleaning task template lists with the id of 4",
                statusCode: 404,
            }));
        });
        test("Returns a server error if the query fails", async () => {
            dbconnection_1.query.mockRejectedValue(Error);
            await expect(LCMS_Cleaning_1.default.viewCleaningTaskTemplateList(3)).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.viewCleaningTaskTemplateList(3)).rejects.toEqual(expect.objectContaining({
                message: "An error occurred while retrieving the cleaning task template list",
                statusCode: 500,
            }));
        });
    });
    describe("markCleaningTaskAsComplete()", () => {
        test("Throws a server error when cleaningTaskListId is not a number", async () => {
            await expect(LCMS_Cleaning_1.default.markCleaningTaskAsComplete("test", 1)).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.markCleaningTaskAsComplete("test", 1)).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskListId must be an integer",
                statusCode: 400,
            }));
        });
        test("Throws an error when cleaningTaskId is not a number", async () => {
            await expect(LCMS_Cleaning_1.default.markCleaningTaskAsComplete(1, "test")).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.markCleaningTaskAsComplete(1, "test")).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskId must be an integer",
                statusCode: 400,
            }));
        });
        test("Throws a server error when the query fails", async () => {
            dbconnection_1.query.mockRejectedValue(Error);
            await expect(LCMS_Cleaning_1.default.markCleaningTaskAsComplete(1, 1)).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.markCleaningTaskAsComplete(1, 1)).rejects.toEqual(expect.objectContaining({
                message: "An unexpected error occurred",
                statusCode: 500,
            }));
        });
        test("Throws a server error when the cleaning task list specified does not contain the cleaning task specified", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 0,
                rows: [],
                command: "",
                oid: 0,
                fields: [],
            });
            await expect(LCMS_Cleaning_1.default.markCleaningTaskAsComplete(1, 1)).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.markCleaningTaskAsComplete(1, 1)).rejects.toEqual(expect.objectContaining({
                message: "The cleaning task specified is not part of the cleaning task list specified",
                statusCode: 404,
            }));
        });
        test("Returns a string indicating that the update was successful when valid parameters are supplied", async () => {
            const mockData = [
                {
                    cleaningtaskid: 5,
                    _description: "Mop corridor",
                    completed: false,
                    cleaningtasklistid: 6,
                    areaid: 7,
                },
            ];
            dbconnection_1.query.mockResolvedValue({
                rowCount: 1,
                rows: mockData,
                command: "",
                oid: 0,
                fields: [],
            });
            await expect(LCMS_Cleaning_1.default.markCleaningTaskAsComplete(5, 6)).resolves.toEqual("update successful");
        });
    });
    describe("markCleaningTaskAsIncomplete()", () => {
        test("Throws a server error when cleaningTaskListId is not a number", async () => {
            await expect(LCMS_Cleaning_1.default.markCleaningTaskAsIncomplete("test", 1)).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.markCleaningTaskAsIncomplete("test", 1)).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskListId must be an integer",
                statusCode: 400,
            }));
        });
        test("Throws an error when cleaningTaskId is not a number", async () => {
            await expect(LCMS_Cleaning_1.default.markCleaningTaskAsIncomplete(1, "test")).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.markCleaningTaskAsIncomplete(1, "test")).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskId must be an integer",
                statusCode: 400,
            }));
        });
        test("Throws a server error when the query fails", async () => {
            dbconnection_1.query.mockRejectedValue(Error);
            await expect(LCMS_Cleaning_1.default.markCleaningTaskAsIncomplete(1, 1)).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.markCleaningTaskAsIncomplete(1, 1)).rejects.toEqual(expect.objectContaining({
                message: "An unexpected error occurred",
                statusCode: 500,
            }));
        });
        test("Throws a server error when the cleaning task list specified does not contain the cleaning task specified", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 0,
                rows: [],
                command: "",
                oid: 0,
                fields: [],
            });
            await expect(LCMS_Cleaning_1.default.markCleaningTaskAsIncomplete(1, 1)).rejects.toThrow(ServerError_1.default);
            await expect(LCMS_Cleaning_1.default.markCleaningTaskAsIncomplete(1, 1)).rejects.toEqual(expect.objectContaining({
                message: "The cleaning task specified is not part of the cleaning task list specified",
                statusCode: 404,
            }));
        });
        test("Returns a string indicating that the update was successful when valid parameters are supplied", async () => {
            const mockData = [
                {
                    cleaningtaskid: 5,
                    _description: "Mop corridor",
                    completed: true,
                    cleaningtasklistid: 6,
                    areaid: 7,
                },
            ];
            dbconnection_1.query.mockResolvedValue({
                rowCount: 1,
                rows: mockData,
                command: "",
                oid: 0,
                fields: [],
            });
            await expect(LCMS_Cleaning_1.default.markCleaningTaskAsIncomplete(5, 6)).resolves.toEqual("update successful");
        });
    });
    describe("signOffCleaningTaskListManager()", () => {
        test("Returns the result of calling CleaningTaskList.setManagerSignature", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 1,
                rows: [],
                command: "",
                oid: 0,
                fields: [],
            });
            jest.spyOn(CleaningTaskList_1.default, "setManagerSignature").mockResolvedValue("update successful");
            await expect(LCMS_Cleaning_1.default.signOffCleaningTaskListManager(1, "test")).resolves.toEqual("update successful");
        });
    });
    describe("signOffCleaningTaskListStaffMember()", () => {
        test("Returns the result of calling CleaningTaskList.setStaffMemberSignature", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 1,
                rows: [],
                command: "",
                oid: 0,
                fields: [],
            });
            jest
                .spyOn(CleaningTaskList_1.default, "setStaffMemberSignature")
                .mockResolvedValue("update successful");
            await expect(LCMS_Cleaning_1.default.signOffCleaningTaskListStaffMember(1, "test")).resolves.toEqual("update successful");
        });
    });
    describe("addCleaningTaskToCleaningTaskList()", () => {
        test("Returns the result of calling CleaningTaskList.createCleaningTask", async () => {
            jest.spyOn(CleaningTaskList_1.default, "createCleaningTask").mockResolvedValue(33);
            await expect(LCMS_Cleaning_1.default.addCleaningTaskToCleaningTaskList(3, 5, undefined, undefined, undefined)).resolves.toEqual(33);
        });
    });
    describe("removeCleaningTaskFromCleaningTasks()", () => {
        test("Returns the result of calling CleaningTask.delete", async () => {
            jest.spyOn(CleaningTask_1.default, "delete").mockResolvedValue("deletion successful");
            await expect(LCMS_Cleaning_1.default.removeCleaningTaskFromCleaningTaskList(5)).resolves.toEqual("deletion successful");
        });
    });
    describe("removeCleaningTaskTemplateFromCleaningTaskTemplateList()", () => {
        test("Returns the result of calling CleaningTaskTemplateList.removeCleaningTaskTemplate", async () => {
            jest
                .spyOn(CleaningTaskTemplateList_1.default, "removeCleaningTaskTemplate")
                .mockResolvedValue("removal successful");
            await expect(LCMS_Cleaning_1.default.removeCleaningTaskTemplateFromCleaningTaskTemplateList(5, 5)).resolves.toEqual("removal successful");
        });
    });
    describe("addCleaningTaskTemplateToCleaningTaskTemplateList()", () => {
        test("Returns the result of calling CleaningTaskTemplateList.addCleaningTaskTemplate", async () => {
            jest
                .spyOn(CleaningTaskTemplateList_1.default, "addCleaningTaskTemplate")
                .mockResolvedValue("cleaning task template added successfully");
            await expect(LCMS_Cleaning_1.default.addCleaningTaskTemplateToCleaningTaskTemplateList(1, 2, undefined, undefined, undefined)).resolves.toBe("cleaning task template added successfully");
        });
        test("Returns the result of calling CleaningTaskTemplateList.createCleaningTaskTemplate", async () => {
            jest.spyOn(CleaningTaskTemplateList_1.default, "createCleaningTaskTemplate").mockResolvedValue(10);
            await expect(LCMS_Cleaning_1.default.addCleaningTaskTemplateToCleaningTaskTemplateList(4, undefined, "test", 5, undefined)).resolves.toBe(10);
        });
    });
    describe("createCleaningTaskList()", () => {
        test("Returns the result of calling CleaningTaskList.new", async () => {
            jest.spyOn(CleaningTaskList_1.default, "new").mockResolvedValue(3);
            await expect(LCMS_Cleaning_1.default.createCleaningTaskList(1, new Date("2025-01-01"), undefined)).resolves.toBe(3);
        });
    });
    describe("deleteCleaningTaskList()", () => {
        test("Deletes a cleaning task list from the database", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 1,
            });
            await expect(LCMS_Cleaning_1.default.deleteCleaningTaskList(5)).resolves.toBe("deletion successful");
        });
    });
    describe("createCleaningTaskTemplateList()", () => {
        test("Returns the result of calling CleaningTaskTemplateList.new", async () => {
            jest.spyOn(CleaningTaskTemplateList_1.default, "new").mockResolvedValue(4);
            await expect(LCMS_Cleaning_1.default.createCleaningTaskTemplateList("test")).resolves.toBe(4);
        });
    });
    describe("deleteCleaningTaskTemplateList()", () => {
        test("Returns the result of calling CleaningTaskTemplateList.delete", async () => {
            jest.spyOn(CleaningTaskTemplateList_1.default, "delete").mockResolvedValue("deletion successful");
            await expect(LCMS_Cleaning_1.default.deleteCleaningTaskTemplateList(5)).resolves.toBe("deletion successful");
        });
    });
});
