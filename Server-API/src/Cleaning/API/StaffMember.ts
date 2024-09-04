import { ListUsersCommand, ListUsersCommandInput } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoReadOnlyClient } from "../Cognito/config";
import dotenv from "dotenv";
import ServerError from "../../../ServerError";
import { StaffMember as StaffMember_TYPE } from "../../../types";

dotenv.config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AWS_USER_POOL_ID: string;
    }
  }
}

/**
 * Represents a staff member from the leisure centre.
 *
 * @author Isaac Clark
 * @version 1
 */
class StaffMember {
  private constructor() {}

  /**
   * Gets the payroll number, first name and surname of each staff member from AWS Cognito.
   *
   * @returns The payroll number, first name and surname of each staff member.
   * @throws A ServerError if the operation fails.
   */
  public static async getStaffMembers() {
    try {
      const listUsersRequest: ListUsersCommandInput = {
        UserPoolId: process.env.AWS_USER_POOL_ID,
        AttributesToGet: ["given_name", "family_name", "custom:payrollNumber"],
      };

      const command = new ListUsersCommand(listUsersRequest);
      const response = await cognitoReadOnlyClient.send(command);

      const staffMembers: Array<StaffMember_TYPE> = [];

      if (response.Users) {
        for (const user of response.Users) {
          const attributesObject = (user.Attributes || []).reduce(
            (accumulator: { [key: string]: string }, current) => {
              if (current.Name && current.Value) {
                accumulator[current.Name] = current.Value;
              }
              return accumulator;
            },
            {}
          );

          const staffMember: StaffMember_TYPE = {
            firstName: attributesObject.given_name,
            lastName: attributesObject.family_name,
            payrollNumber: parseInt(attributesObject["custom:payrollNumber"]),
          };

          staffMembers.push(staffMember);
        }
      } else {
        throw new ServerError("There are no staff members stored in the system", 404);
      }

      staffMembers.sort((a, b) => a.payrollNumber - b.payrollNumber);

      return staffMembers;
    } catch (error) {
      if (error instanceof ServerError) throw error;
      throw new ServerError("An unexpected error occurred", 500);
    }
  }
}

export default StaffMember;
