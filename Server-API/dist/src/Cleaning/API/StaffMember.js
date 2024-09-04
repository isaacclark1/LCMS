"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const config_1 = require("../Cognito/config");
const dotenv_1 = __importDefault(require("dotenv"));
const ServerError_1 = __importDefault(require("../../../ServerError"));
dotenv_1.default.config();
/**
 * Represents a staff member from the leisure centre.
 *
 * @author Isaac Clark
 * @version 1
 */
class StaffMember {
    constructor() { }
    /**
     * Gets the payroll number, first name and surname of each staff member from AWS Cognito.
     *
     * @returns The payroll number, first name and surname of each staff member.
     * @throws A ServerError if the operation fails.
     */
    static async getStaffMembers() {
        try {
            const listUsersRequest = {
                UserPoolId: process.env.AWS_USER_POOL_ID,
                AttributesToGet: ["given_name", "family_name", "custom:payrollNumber"],
            };
            const command = new client_cognito_identity_provider_1.ListUsersCommand(listUsersRequest);
            const response = await config_1.cognitoReadOnlyClient.send(command);
            const staffMembers = [];
            if (response.Users) {
                for (const user of response.Users) {
                    const attributesObject = (user.Attributes || []).reduce((accumulator, current) => {
                        if (current.Name && current.Value) {
                            accumulator[current.Name] = current.Value;
                        }
                        return accumulator;
                    }, {});
                    const staffMember = {
                        firstName: attributesObject.given_name,
                        lastName: attributesObject.family_name,
                        payrollNumber: parseInt(attributesObject["custom:payrollNumber"]),
                    };
                    staffMembers.push(staffMember);
                }
            }
            else {
                throw new ServerError_1.default("There are no staff members stored in the system", 404);
            }
            staffMembers.sort((a, b) => a.payrollNumber - b.payrollNumber);
            return staffMembers;
        }
        catch (error) {
            if (error instanceof ServerError_1.default)
                throw error;
            throw new ServerError_1.default("An unexpected error occurred", 500);
        }
    }
}
exports.default = StaffMember;
