import { useEffect, useState } from "react";
import { Error_, StaffMember } from "../../api/types";
import { assignStaffMemberToCleaningTaskList, getStaffMembers } from "../../api/api";
import { AxiosError } from "axios";
import SelectBox from "./SelectBox";
import Error from "./Error";
import Dialog from "./Dialog";

type AssignStaffMemberProps = {
  isAssignStaffMemberDialogOpen?: boolean;
  setIsAssignStaffMemberDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  assignStaffMemberCleaningTaskListId: number | undefined;
  updateCleaningTaskList: (cleaningTaskListId: number) => Promise<void>;
};

const AssignStaffMember: React.FC<AssignStaffMemberProps> = ({
  isAssignStaffMemberDialogOpen,
  setIsAssignStaffMemberDialogOpen,
  assignStaffMemberCleaningTaskListId,
  updateCleaningTaskList,
}) => {
  const [staffMembers, setStaffMembers] = useState<Array<StaffMember>>([]);
  const [fetchStaffMembersError, setFetchStaffMembersError] = useState<Error_>();
  const [selectedStaffMemberPayrollNumber, setSelectedStaffMemberPayrollNumber] =
    useState<number>();

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

  const [assignStaffMemberError, setAssignStaffMemberError] = useState<Error_>();

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  useEffect(() => {
    setSelectedStaffMemberPayrollNumber(undefined);
  }, [isAssignStaffMemberDialogOpen]);

  useEffect(() => {
    if (selectedStaffMemberPayrollNumber) {
      setIsSubmitButtonDisabled(false);
    } else {
      setIsSubmitButtonDisabled(true);
    }
  });

  const fetchStaffMembers = async () => {
    setStaffMembers([]);
    setFetchStaffMembersError(undefined);

    try {
      const _staffMembers = await getStaffMembers();

      setStaffMembers(_staffMembers);
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(error.response.data.statusCode, error.response.data.message)
        : console.error(error);

      if (error instanceof AxiosError && error.response?.data.statusCode === 404) {
        setStaffMembers([]);
      } else if (error instanceof AxiosError && error.message === "Network Error") {
        setFetchStaffMembersError({
          message: "Network Error. Please check your device is connected to the internet.",
          statusCode: undefined,
        });
      } else {
        setFetchStaffMembersError({
          message: "An unexpected error occurred. Please try again.",
          statusCode: (error as AxiosError).response?.status || undefined,
        });
      }
    }
  };

  const assignStaffMember = async (cleaningTaskListId: number, staffMemberId: number) => {
    setAssignStaffMemberError(undefined);

    try {
      await assignStaffMemberToCleaningTaskList(cleaningTaskListId, staffMemberId);

      if (setIsAssignStaffMemberDialogOpen) {
        setIsAssignStaffMemberDialogOpen(false);
      }

      await updateCleaningTaskList(assignStaffMemberCleaningTaskListId!);
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(error.response.data.statusCode, error.response.data.message)
        : console.error(error);

      if (error instanceof AxiosError && error.message === "Network Error") {
        setAssignStaffMemberError({
          message: "Network Error. Please check your device is connected to the internet.",
        });
      } else {
        setAssignStaffMemberError({
          message: "An error occurred while assigning the staff member",
          statusCode: (error as AxiosError).response?.status || undefined,
        });
      }
    }
  };

  function handleSubmit() {
    if (assignStaffMemberCleaningTaskListId && selectedStaffMemberPayrollNumber) {
      assignStaffMember(assignStaffMemberCleaningTaskListId, selectedStaffMemberPayrollNumber);
    }
  }

  return (
    <div className="flex flex-col gap-y-5 bg-slate-800 p-4">
      {assignStaffMemberError && (
        <Dialog closeText="Close" close={setAssignStaffMemberError} closeParams={[undefined]}>
          <Error
            message={assignStaffMemberError.message}
            statusCode={assignStaffMemberError.statusCode}
          />
        </Dialog>
      )}

      <button
        type="button"
        onClick={() => {
          if (setIsAssignStaffMemberDialogOpen) {
            setIsAssignStaffMemberDialogOpen(false);
          }
        }}
        className="absolute right-0 top-0 rounded-bl rounded-tr border-b border-l border-white bg-black hover:bg-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="36px"
          viewBox="0 -960 960 960"
          width="36px"
          fill="#b91c1c"
        >
          <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
        </svg>
      </button>

      <h2 className="block text-3xl">Assign Staff Member</h2>
      <p>Choose a staff member:</p>

      {fetchStaffMembersError && (
        <Error
          message={fetchStaffMembersError.message}
          statusCode={fetchStaffMembersError.statusCode}
        />
      )}

      {!fetchStaffMembersError && staffMembers.length === 0 && (
        <p className="w-max rounded border border-white bg-gray-800 px-2 py-0.5">
          There are no staff members stored in the system
        </p>
      )}

      {!fetchStaffMembersError && staffMembers.length !== 0 && (
        <table className="w-full min-w-max border-collapse text-left">
          <thead className="hidden border-b border-slate-400 md:table-header-group">
            <tr>
              <th className="px-4 py-2 font-semibold">Payroll Number</th>
              <th className="py-2 pr-4 font-semibold">First Name</th>
              <th className="py-2 pr-4 font-semibold">Last Name</th>
              <th className="py-2 pr-4 font-semibold"></th>
            </tr>
          </thead>

          <tbody className="text-gray-200">
            {staffMembers.map((staffMember) => (
              <tr
                key={staffMember.payrollNumber}
                className={`cursor-pointer border-b border-slate-600 hover:bg-blue-700 ${staffMember.payrollNumber === selectedStaffMemberPayrollNumber && "bg-blue-700 hover:cursor-default"}`}
                onClick={() => setSelectedStaffMemberPayrollNumber(staffMember.payrollNumber)}
              >
                <td className="block px-4 py-2 before:mr-5 before:font-bold before:content-['Payroll_Number:'] md:table-cell md:before:mr-0 md:before:content-none">
                  {staffMember.payrollNumber}
                </td>
                <td className="block py-2 pl-4 pr-4 before:mr-5 before:font-bold before:content-['First_Name:'] md:table-cell md:pl-0 md:before:mr-0 md:before:content-none">
                  {staffMember.firstName}
                </td>
                <td className="block py-2 pl-4 pr-4 before:mr-5 before:font-bold before:content-['Last_Name:'] md:table-cell md:pl-0 md:before:mr-0 md:before:content-none">
                  {staffMember.lastName}
                </td>
                <td className="py-2 pr-4">
                  {selectedStaffMemberPayrollNumber === staffMember.payrollNumber && <SelectBox />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-end gap-1">
        <button
          type="button"
          className="flex gap-1 rounded bg-red-700 px-3 py-1 hover:bg-red-800"
          onClick={() => {
            if (setIsAssignStaffMemberDialogOpen) {
              setIsAssignStaffMemberDialogOpen(false);
            }
          }}
        >
          Cancel
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#FFFFFF"
            className="mt-0.5"
          >
            <path d="m339-288 141-141 141 141 51-51-141-141 141-141-51-51-141 141-141-141-51 51 141 141-141 141 51 51ZM480-96q-79 0-149-30t-122.5-82.5Q156-261 126-331T96-480q0-80 30-149.5t82.5-122Q261-804 331-834t149-30q80 0 149.5 30t122 82.5Q804-699 834-629.5T864-480q0 79-30 149t-82.5 122.5Q699-156 629.5-126T480-96Zm0-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z" />
          </svg>
        </button>

        <button
          type="button"
          className={
            isSubmitButtonDisabled
              ? "flex gap-1 rounded bg-green-700 px-3 py-1 opacity-75 hover:cursor-not-allowed"
              : "flex gap-1 rounded bg-green-700 px-3 py-1 hover:bg-green-800"
          }
          disabled={isSubmitButtonDisabled}
          onClick={handleSubmit}
        >
          Submit
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#FFFFFF"
            className="mt-0.5"
          >
            <path d="M630-444H192v-72h438L429-717l51-51 288 288-288 288-51-51 201-201Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AssignStaffMember;
