import { useEffect, useState } from "react";
import {
  createCleaningTaskList,
  getCleaningTaskTemplateLists,
  getCleaningTaskTemplatesFromCleaningTaskTemplateList,
  getStaffMembers,
} from "../../api/api";
import {
  CleaningTaskTemplate,
  CleaningTaskTemplateList,
  Error_,
  StaffMember,
} from "../../api/types";
import { AxiosError } from "axios";
import SelectBox from "./SelectBox";
import { Fragment } from "react";
import Error from "./Error";
import "../styles/styles.css";
import Dialog from "./Dialog";

type CreateNewCleaningTaskListProps = {
  closeDialog: () => void;
  fetchCleaningTaskLists: () => Promise<void>;
};

const CreateNewCleaningTaskList: React.FC<CreateNewCleaningTaskListProps> = ({
  closeDialog,
  fetchCleaningTaskLists,
}) => {
  const [cleaningTaskTemplateLists, setCleaningTaskTemplateLists] = useState<
    Array<CleaningTaskTemplateList>
  >([]);

  const [
    selectedCleaningTaskTemplateListId,
    setSelectedCleaningTaskTemplateListId,
  ] = useState<number>();

  const [cleaningTaskTemplatesContainer, setCleaningTaskTemplatesContainer] =
    useState<number>();

  const [isExpandButtonHovered, setIsExpandButtonHovered] = useState(false);

  const [
    fetchCleaningTaskTemplateListsError,
    setFetchCleaningTaskTemplateListsError,
  ] = useState<Error_>();

  const [cleaningTaskTemplates, setCleaningTaskTemplates] = useState<
    Array<CleaningTaskTemplate>
  >([]);

  const [selectedDate, setSelectedDate] = useState(getDateToday());

  const [isDateInPast, setIsDateInPast] = useState(false);

  const [staffMembers, setStaffMembers] = useState<Array<StaffMember>>([]);

  const [isAssignStaffMemberNow, setIsAssignStaffMemberNow] =
    useState<boolean>();

  const [
    selectedStaffMemberPayrollNumber,
    setSelectedStaffMemberPayrollNumber,
  ] = useState<number>();

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

  const [fetchCleaningTaskTemplatesError, setFetchCleaningTaskTemplatesError] =
    useState<Error_>();

  const [fetchStaffMembersError, setFetchStaffMembersError] =
    useState<Error_>();

  const [generateCleaningTaskListError, setGenerateCleaningTaskListError] =
    useState<Error_>();

  useEffect(() => {
    fetchCleaningTaskTemplateLists();
  }, []);

  useEffect(() => {
    const selectedDateAsDate = new Date(selectedDate);

    if (selectedDateAsDate < getMidnightToday()) {
      setIsDateInPast(true);
    } else {
      setIsDateInPast(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedCleaningTaskTemplateListId && selectedDate && !isDateInPast) {
      setIsSubmitButtonDisabled(false);
    } else {
      setIsSubmitButtonDisabled(true);
    }
  }, [selectedCleaningTaskTemplateListId, selectedDate, isDateInPast]);

  const fetchCleaningTaskTemplateLists = async () => {
    setFetchCleaningTaskTemplateListsError(undefined);
    setCleaningTaskTemplateLists([]);

    try {
      const _cleaningTaskTemplateLists = await getCleaningTaskTemplateLists();

      setCleaningTaskTemplateLists(_cleaningTaskTemplateLists);
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(
            error.response.data.statusCode,
            error.response.data.message,
          )
        : console.error(error);

      if (
        error instanceof AxiosError &&
        error.response?.data.statusCode === 404
      ) {
        setFetchCleaningTaskTemplateListsError({
          message:
            "There are no cleaning task template lists stored in the system. Please create a cleaning task template list.",
          statusCode: 404,
        });
      } else if (
        error instanceof AxiosError &&
        error.message === "Network Error"
      ) {
        setFetchCleaningTaskTemplateListsError({
          message:
            "Network Error. Please check your device is connected to the internet.",
          statusCode: undefined,
        });
      } else {
        setFetchCleaningTaskTemplateListsError({
          message: "An unexpected error occurred. Please try again.",
          statusCode: (error as AxiosError).response?.status || undefined,
        });
      }
    }
  };

  const fetchCleaningTaskTemplatesFromCleaningTaskTemplateList = async (
    cleaningTaskTemplateListId: number,
  ) => {
    setFetchCleaningTaskTemplatesError(undefined);
    setCleaningTaskTemplates([]);

    try {
      const _cleaningTaskTemplates =
        await getCleaningTaskTemplatesFromCleaningTaskTemplateList(
          cleaningTaskTemplateListId,
        );

      setCleaningTaskTemplates(_cleaningTaskTemplates);
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(
            error.response.data.statusCode,
            error.response.data.message,
          )
        : console.error(error);

      if (
        error instanceof AxiosError &&
        error.response?.data.statusCode === 404
      ) {
        setCleaningTaskTemplates([]);
      } else if (
        error instanceof AxiosError &&
        error.message === "Network Error"
      ) {
        setFetchCleaningTaskTemplatesError({
          message:
            "Network Error. Please check your device is connected to the internet.",
          statusCode: undefined,
        });
      } else {
        setFetchCleaningTaskTemplatesError({
          message: "An unexpected error occurred. Please try again.",
          statusCode: (error as AxiosError).response?.status || undefined,
        });
      }
    }
  };

  const fetchStaffMembers = async () => {
    setStaffMembers([]);

    try {
      const _staffMembers = await getStaffMembers();

      setStaffMembers(_staffMembers);
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(
            error.response.data.statusCode,
            error.response.data.message,
          )
        : console.error(error);

      if (
        error instanceof AxiosError &&
        error.response?.data.statusCode === 404
      ) {
        setStaffMembers([]);
      } else if (
        error instanceof AxiosError &&
        error.message === "Network Error"
      ) {
        setFetchStaffMembersError({
          message:
            "Network Error. Please check your device is connected to the internet.",
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

  const generateCleaningTaskList = async (
    cleaningTaskTemplateListId: number,
    date: string,
    staffMemberId?: number,
  ) => {
    try {
      await createCleaningTaskList(
        cleaningTaskTemplateListId,
        date,
        staffMemberId,
      );

      await fetchCleaningTaskLists();

      handleClose();
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(
            error.response.data.statusCode,
            error.response.data.message,
          )
        : console.error(error);

      if (error instanceof AxiosError && error.message === "Network Error") {
        setGenerateCleaningTaskListError({
          message:
            "Network Error. Please check your device is connected to the internet.",
        });
      } else {
        setGenerateCleaningTaskListError({
          message: "An unexpected error occurred. Please try again.",
          statusCode: (error as AxiosError).response?.status || undefined,
        });
      }
    }
  };

  const handleExpandButtonClick = async (
    cleaningTaskTemplateList: CleaningTaskTemplateList,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    setIsExpandButtonHovered(false);

    if (
      cleaningTaskTemplatesContainer ===
      cleaningTaskTemplateList.cleaningtasktemplatelistid
    ) {
      setCleaningTaskTemplatesContainer(undefined);
    } else {
      setCleaningTaskTemplatesContainer(
        cleaningTaskTemplateList.cleaningtasktemplatelistid,
      );

      await fetchCleaningTaskTemplatesFromCleaningTaskTemplateList(
        cleaningTaskTemplateList.cleaningtasktemplatelistid,
      );
    }
  };

  function handleClose() {
    setSelectedCleaningTaskTemplateListId(undefined);
    setCleaningTaskTemplatesContainer(undefined);
    setFetchCleaningTaskTemplateListsError(undefined);
    setSelectedDate(getDateToday());
    setSelectedStaffMemberPayrollNumber(undefined);
    setGenerateCleaningTaskListError(undefined);
    closeDialog();
  }

  function getDateToday(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function getMidnightToday(): Date {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    return new Date(year, month, day, 0, 0, 0, 0);
  }

  return (
    <div className="flex flex-col gap-y-5 bg-slate-800 p-4 text-white">
      {generateCleaningTaskListError && (
        <Dialog
          submit={undefined}
          submitParams={undefined}
          close={() => setGenerateCleaningTaskListError(undefined)}
          closeParams={undefined}
          closeText="Close"
        >
          <Error
            message={generateCleaningTaskListError.message}
            statusCode={generateCleaningTaskListError.statusCode}
          />
        </Dialog>
      )}

      <h2 className="text-3xl">Create New Cleaning Task List</h2>

      <button
        type="button"
        onClick={handleClose}
        className="absolute right-0 top-0 rounded-bl rounded-tr border-b border-l border-white bg-black hover:bg-slate-800"
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

      {fetchCleaningTaskTemplateListsError ? (
        <Error
          message={fetchCleaningTaskTemplateListsError.message}
          statusCode={fetchCleaningTaskTemplateListsError.statusCode}
        />
      ) : (
        <>
          <form className="flex flex-col gap-y-5">
            <div className="flex flex-col gap-y-5 overflow-x-scroll rounded border border-black bg-slate-900 p-2">
              <p>Select a cleaning task template list:</p>

              <table className="w-full max-w-full border-collapse text-left">
                <thead className="hidden border-b border-slate-400 md:table-header-group">
                  <tr>
                    <th className="px-4 py-2 font-semibold">ID</th>
                    <th className="py-2 pr-4 font-semibold">Title</th>
                    <th className="py-2 pr-4 font-semibold">View Tasks</th>
                    <th className="py-2 pr-4 font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="text-gray-200">
                  {cleaningTaskTemplateLists.map((cleaningTaskTemplateList) => (
                    <Fragment
                      key={cleaningTaskTemplateList.cleaningtasktemplatelistid}
                    >
                      <tr
                        className={`cursor-pointer border-b border-slate-600 ${
                          selectedCleaningTaskTemplateListId ===
                            cleaningTaskTemplateList.cleaningtasktemplatelistid &&
                          "cursor-default bg-blue-700"
                        } ${isExpandButtonHovered || "hover:bg-blue-700"}`}
                        onClick={() =>
                          setSelectedCleaningTaskTemplateListId(
                            cleaningTaskTemplateList.cleaningtasktemplatelistid,
                          )
                        }
                      >
                        <td className="block px-4 py-2 before:mr-5 before:font-bold before:content-['ID:'] md:table-cell md:before:mr-0 md:before:content-none">
                          {cleaningTaskTemplateList.cleaningtasktemplatelistid}
                        </td>

                        <td className="ml-4 block py-2 pr-4 before:mr-5 before:font-bold before:content-['Title:'] md:ml-0 md:table-cell md:before:mr-0 md:before:content-none">
                          {cleaningTaskTemplateList.title}
                        </td>

                        <td className="ml-4 block py-2 pr-4 before:mr-5 before:font-bold before:content-['View_Tasks:'] md:ml-0 md:table-cell md:before:mr-0 md:before:content-none">
                          <button
                            type="button"
                            className="rounded bg-slate-700 p-1 hover:bg-slate-500"
                            onClick={(event) =>
                              handleExpandButtonClick(
                                cleaningTaskTemplateList,
                                event,
                              )
                            }
                            onMouseOver={() => setIsExpandButtonHovered(true)}
                            onMouseOut={() => setIsExpandButtonHovered(false)}
                          >
                            {cleaningTaskTemplateList.cleaningtasktemplatelistid ===
                              cleaningTaskTemplatesContainer && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="20px"
                                viewBox="0 -960 960 960"
                                width="20px"
                                fill="#FFFFFF"
                              >
                                <path d="m480-355 162-162-51-51-111 111-111-111-51 51 162 162Zm0 259q-79 0-149-30t-122.5-82.5Q156-261 126-331T96-480q0-80 30-149.5t82.5-122Q261-804 331-834t149-30q80 0 149.5 30t122 82.5Q804-699 834-629.5T864-480q0 79-30 149t-82.5 122.5Q699-156 629.5-126T480-96Zm0-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z" />
                              </svg>
                            )}

                            {cleaningTaskTemplateList.cleaningtasktemplatelistid !==
                              cleaningTaskTemplatesContainer && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="20px"
                                viewBox="0 -960 960 960"
                                width="20px"
                                fill="#FFFFFF"
                              >
                                <path d="M503-480 392-369l51 51 162-162-162-162-51 51 111 111ZM480-96q-79 0-149-30t-122.5-82.5Q156-261 126-331T96-480q0-80 30-149.5t82.5-122Q261-804 331-834t149-30q80 0 149.5 30t122 82.5Q804-699 834-629.5T864-480q0 79-30 149t-82.5 122.5Q699-156 629.5-126T480-96Zm0-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z" />
                              </svg>
                            )}
                          </button>
                        </td>

                        <td className="py-2 pr-4">
                          {selectedCleaningTaskTemplateListId ===
                            cleaningTaskTemplateList.cleaningtasktemplatelistid && (
                            <SelectBox />
                          )}
                        </td>
                      </tr>

                      {cleaningTaskTemplateList.cleaningtasktemplatelistid ===
                        cleaningTaskTemplatesContainer &&
                        fetchCleaningTaskTemplatesError && (
                          <tr>
                            <td colSpan={4}>
                              <div className="ml-5 mt-2 max-w-full">
                                <Error
                                  message={
                                    fetchCleaningTaskTemplatesError.message
                                  }
                                  statusCode={
                                    fetchCleaningTaskTemplatesError.statusCode
                                  }
                                />
                              </div>
                            </td>
                          </tr>
                        )}

                      {cleaningTaskTemplateList.cleaningtasktemplatelistid ===
                        cleaningTaskTemplatesContainer &&
                        !fetchCleaningTaskTemplatesError && (
                          <>
                            <tr>
                              <th
                                colSpan={4}
                                className="bg-gradient-to-b from-slate-900 to-slate-800 p-2 text-center text-xl font-normal"
                              >
                                Cleaning Tasks
                              </th>
                            </tr>

                            {cleaningTaskTemplates.length === 0 && (
                              <tr
                                className={`content current cursor-pointer border-b border-slate-600 ${
                                  cleaningTaskTemplatesContainer ===
                                    cleaningTaskTemplateList.cleaningtasktemplatelistid &&
                                  "mx-4 my-2 cursor-default"
                                } `}
                                onClick={() =>
                                  setSelectedCleaningTaskTemplateListId(
                                    cleaningTaskTemplateList.cleaningtasktemplatelistid,
                                  )
                                }
                              >
                                <td
                                  colSpan={4}
                                  className="border-b border-slate-600 bg-slate-800 p-2"
                                >
                                  <p className="w-full max-w-full rounded border border-white bg-gray-800 px-2 py-0.5">
                                    The cleaning task template list is empty
                                  </p>
                                </td>
                              </tr>
                            )}

                            {cleaningTaskTemplates.length !== 0 && (
                              <tr
                                className={`content current cursor-pointer border-b border-slate-600 ${
                                  cleaningTaskTemplatesContainer ===
                                    cleaningTaskTemplateList.cleaningtasktemplatelistid &&
                                  "mx-4 my-2 cursor-default"
                                } `}
                                onClick={() =>
                                  setSelectedCleaningTaskTemplateListId(
                                    cleaningTaskTemplateList.cleaningtasktemplatelistid,
                                  )
                                }
                              >
                                <td
                                  colSpan={4}
                                  className="border-b border-slate-600 bg-slate-900 p-0"
                                >
                                  <table className="w-full max-w-full border-collapse bg-slate-800 text-left">
                                    <thead className="hidden border-b border-slate-400 lg:table-header-group">
                                      <tr>
                                        <th className="px-4 py-2 font-semibold">
                                          ID
                                        </th>
                                        <th className="px-4 py-2 font-semibold">
                                          Cleaning Task Description
                                        </th>
                                        <th className="px-4 py-2 font-semibold">
                                          Area Description
                                        </th>
                                      </tr>
                                    </thead>

                                    <tbody className="text-gray-200">
                                      {cleaningTaskTemplates.map(
                                        (cleaningTaskTemplate) => (
                                          <tr
                                            key={
                                              cleaningTaskTemplate.cleaningtasktemplateid
                                            }
                                            className="border-b border-slate-600"
                                          >
                                            <td className="block px-4 py-2 before:mr-5 before:font-bold before:content-['ID:'] lg:table-cell lg:before:mr-0 lg:before:content-none">
                                              {
                                                cleaningTaskTemplate.cleaningtasktemplateid
                                              }
                                            </td>
                                            <td className="block px-4 py-2 before:mr-5 before:font-bold before:content-['Description:'] lg:table-cell lg:before:mr-0 lg:before:content-none">
                                              {
                                                cleaningTaskTemplate.cleaningtasktemplatedescription
                                              }
                                            </td>
                                            <td className="block px-4 py-2 before:mr-5 before:font-bold before:content-['Area:'] lg:table-cell lg:before:mr-0 lg:before:content-none">
                                              {
                                                cleaningTaskTemplate.areadescription
                                              }
                                            </td>
                                          </tr>
                                        ),
                                      )}
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            )}
                          </>
                        )}
                    </Fragment>
                  ))}
                </tbody>
              </table>

              {!selectedCleaningTaskTemplateListId && (
                <p className="text-red-500">
                  A cleaning task template list must be selected.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-y-2 rounded border border-black bg-slate-900 p-2">
              <label htmlFor="cleaningTaskListDate">Date:</label>

              <input
                type="date"
                name="cleaningTaskListDate"
                id="cleaningTaskListDate"
                className="max-w-52 rounded border border-white bg-slate-800 px-4 py-2"
                min={getDateToday()}
                onChange={(e) => setSelectedDate(e.target.value)}
                defaultValue={getDateToday()}
              />

              {selectedDate === "" && (
                <p className="text-red-500">A date must be provided</p>
              )}

              {isDateInPast && (
                <p className="text-red-500">Date cannot be in the past.</p>
              )}
            </div>

            <div className="flex flex-col gap-y-5 rounded border border-black bg-slate-900 p-2">
              <div className="flex gap-2">
                {!isAssignStaffMemberNow && (
                  <button
                    type="button"
                    className="rounded bg-blue-700 px-3 py-1 hover:bg-blue-800"
                    onClick={async () => {
                      setIsAssignStaffMemberNow(true);
                      await fetchStaffMembers();
                    }}
                  >
                    Assign staff member now
                  </button>
                )}
                {(isAssignStaffMemberNow === undefined ||
                  isAssignStaffMemberNow) && (
                  <button
                    type="button"
                    className="rounded bg-blue-700 px-3 py-1 hover:bg-blue-800"
                    onClick={() => {
                      setSelectedStaffMemberPayrollNumber(undefined);
                      setIsAssignStaffMemberNow(false);
                    }}
                  >
                    Assign staff member later
                  </button>
                )}
              </div>

              {fetchStaffMembersError && (
                <Error
                  message={fetchStaffMembersError.message}
                  statusCode={fetchStaffMembersError.statusCode}
                />
              )}

              {isAssignStaffMemberNow &&
                staffMembers.length === 0 &&
                !fetchStaffMembersError && (
                  <p className="w-max max-w-full rounded border border-white bg-gray-800 px-2 py-0.5">
                    There are no staff members stored in the system
                  </p>
                )}

              {isAssignStaffMemberNow &&
                staffMembers.length !== 0 &&
                !fetchStaffMembersError && (
                  <>
                    <p className="mt-2">Select a staff member:</p>

                    <table className="w-full max-w-full border-collapse overflow-auto text-left">
                      <thead className="hidden border-b border-slate-400 lg:table-header-group">
                        <tr>
                          <th className="px-4 py-2 font-semibold">
                            Payroll Number
                          </th>
                          <th className="py-2 pr-4 font-semibold">
                            First Name
                          </th>
                          <th className="py-2 pr-4 font-semibold">Last Name</th>
                          <th className="py-2 pr-4 font-semibold"></th>
                        </tr>
                      </thead>

                      <tbody className="text-gray-200">
                        {staffMembers.map((staffMember) => (
                          <tr
                            key={staffMember.payrollNumber}
                            className={`cursor-pointer border-b border-slate-600 hover:bg-blue-700 ${staffMember.payrollNumber === selectedStaffMemberPayrollNumber && "cursor-default bg-blue-700"}`}
                            onClick={() =>
                              setSelectedStaffMemberPayrollNumber(
                                staffMember.payrollNumber,
                              )
                            }
                          >
                            <td className="block px-4 py-2 before:mr-5 before:font-bold before:content-['Payroll_Number:'] lg:table-cell lg:before:mr-0 lg:before:content-none">
                              {staffMember.payrollNumber}
                            </td>
                            <td className="block px-4 py-2 pr-4 before:mr-5 before:font-bold before:content-['First_Name:'] lg:table-cell lg:pl-0 lg:before:mr-0 lg:before:content-none">
                              {staffMember.firstName}
                            </td>
                            <td className="block px-4 py-2 pr-4 before:mr-5 before:font-bold before:content-['Last_Name:'] lg:table-cell lg:pl-0 lg:before:mr-0 lg:before:content-none">
                              {staffMember.lastName}
                            </td>
                            <td className="py-1 pr-4">
                              {selectedStaffMemberPayrollNumber ===
                                staffMember.payrollNumber && <SelectBox />}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
            </div>
          </form>

          <div className="mt-2 flex justify-end gap-1">
            <button
              type="button"
              className="flex gap-1 rounded bg-red-700 px-3 py-1 hover:bg-red-800"
              onClick={handleClose}
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
              onClick={async () => {
                if (selectedCleaningTaskTemplateListId) {
                  await generateCleaningTaskList(
                    selectedCleaningTaskTemplateListId,
                    selectedDate,
                    selectedStaffMemberPayrollNumber,
                  );
                }
              }}
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
        </>
      )}
    </div>
  );
};

export default CreateNewCleaningTaskList;
