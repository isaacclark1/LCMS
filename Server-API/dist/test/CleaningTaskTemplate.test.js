"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CleaningTaskTemplate_1 = __importDefault(require("../src/Cleaning/API/CleaningTaskTemplate"));
const ServerError_1 = __importDefault(require("../ServerError"));
const dbconnection_1 = require("../src/Cleaning/db/dbconnection");
// Mock the query function so outputs can be controlled.
jest.mock("../src/Cleaning/db/dbconnection", () => ({
    query: jest.fn(),
}));
describe("CleaningTaskTemplate", () => {
    afterEach(() => jest.restoreAllMocks());
    describe("getDescription()", () => {
        test("Throws a server error when cleaningTaskTemplate id is not an integer", async () => {
            await expect(CleaningTaskTemplate_1.default.getDescription("test")).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplate_1.default.getDescription("test")).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskTemplateId must be an integer",
                statusCode: 400,
            }));
            await expect(CleaningTaskTemplate_1.default.getDescription(1.2)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplate_1.default.getDescription(1.2)).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskTemplateId must be an integer",
                statusCode: 400,
            }));
        });
        test("Returns the cleaning task template description when cleaningTaskTemplateId is valid", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 1,
                rows: [{ _description: "test description" }],
                command: "",
                oid: 0,
                fields: [],
            });
            await expect(CleaningTaskTemplate_1.default.getDescription(3)).resolves.toEqual("test description");
        });
        test("Throws a server error when the query fails", async () => {
            dbconnection_1.query.mockRejectedValue(new Error());
            await expect(CleaningTaskTemplate_1.default.getDescription(4)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplate_1.default.getDescription(4)).rejects.toEqual(expect.objectContaining({
                message: "An error occurred when retrieving the cleaning task template description. Check that cleaningTaskTemplateId is valid",
                statusCode: 500,
            }));
        });
    });
    describe("getArea()", () => {
        test("Throws a server error when cleaningTaskTemplateId is not an integer", async () => {
            await expect(CleaningTaskTemplate_1.default.getArea("test")).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplate_1.default.getArea("test")).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskTemplateId must be an integer",
                statusCode: 400,
            }));
            await expect(CleaningTaskTemplate_1.default.getArea(1.2)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplate_1.default.getArea(1.2)).rejects.toEqual(expect.objectContaining({
                message: "cleaningTaskTemplateId must be an integer",
                statusCode: 400,
            }));
        });
        test("Returns the areaId of the cleaning task template when cleaningTaskTemplateId is valid", async () => {
            dbconnection_1.query.mockResolvedValue({
                rowCount: 1,
                rows: [{ areaid: 23 }],
                command: "",
                oid: 0,
                fields: [],
            });
            await expect(CleaningTaskTemplate_1.default.getArea(45)).resolves.toEqual(23);
        });
        test("Throws a server error when the query fails", async () => {
            dbconnection_1.query.mockRejectedValue(new Error());
            await expect(CleaningTaskTemplate_1.default.getArea(456)).rejects.toThrow(ServerError_1.default);
            await expect(CleaningTaskTemplate_1.default.getArea(456)).rejects.toEqual(expect.objectContaining({
                message: "An error occurred while retrieving the areaId from the cleaning task template. Check that cleaningTaskTemplateId is valid",
                statusCode: 500,
            }));
        });
    });
});
