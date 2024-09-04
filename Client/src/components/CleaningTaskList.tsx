import { useContext, useEffect, useState } from "react";
import { CleaningTask as CleaningTask_TYPE, Error_ } from "../../api/types";
import AddCleaningTask from "./AddCleaningTask";
import CleaningTask from "./CleaningTask";
import Dialog from "./Dialog";
import { removeCleaningTaskFromCleaningTaskList } from "../../api/api";
import { AxiosError } from "axios";
import Error from "./Error";
import AssignStaffMember from "./AssignStaffMember";
import { UserContext } from "../App";

type CleaningTaskListProps = {
  tasks: Array<CleaningTask_TYPE>;
  closeDialog: () => void;
  cleaningTaskListId: number | undefined;
  cleaningTaskListDate: string | undefined;
  cleaningTaskListStaffMemberId: number | undefined | null;
  cleaningTaskListAssignedStaffMemberName: number | string | null | undefined;
  cleaningTaskListManagerSignature: string | undefined | null;
  cleaningTaskListStaffMemberSignature: string | undefined | null;
  refreshCleaningTasks: (
    _cleaningTaskListId: number,
    _cleaningTaskListDate: string,
    _cleaningTaskListStaffMember: number | null,
    _cleaningTaskListManagerSignature: string | null,
    _cleaningTaskListStaffMemberSignature: string | null
  ) => Promise<void>;
  isCleaningTaskListDialogOpen: boolean;
  deleteCleaningTaskList: (cleaningTaskListId: number) => Promise<boolean>;
  updateCleaningTaskList: (cleaningTaskListId: number) => Promise<void>;
  setManagerSignature: (
    cleaningTaskListId: number,
    signature: string,
    handleError: (
      error: unknown,
      setError: React.Dispatch<React.SetStateAction<Error_ | undefined>>
    ) => void,
    setError: React.Dispatch<React.SetStateAction<Error_ | undefined>>
  ) => Promise<void>;
  managerSignatureInput: string | undefined;
  setManagerSignatureInput: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleSetSignatureError: (
    error: unknown,
    setError: React.Dispatch<React.SetStateAction<Error_ | undefined>>
  ) => void;
  setStaffMemberSignature: (
    cleaningTaskListId: number,
    signature: string,
    handleError: (
      error: unknown,
      setError: React.Dispatch<React.SetStateAction<Error_ | undefined>>
    ) => void,
    setError: React.Dispatch<React.SetStateAction<Error_ | undefined>>
  ) => Promise<void>;
  staffMemberSignatureInput: string | undefined;
  setStaffMemberSignatureInput: React.Dispatch<React.SetStateAction<string | undefined>>;
  getCleaningTasksError: Error_ | undefined;
  deleteCleaningTaskListError: Error_ | undefined;
  setDeleteCleaningTaskListError: React.Dispatch<React.SetStateAction<Error_ | undefined>>;
};

const CleaningTaskList: React.FC<CleaningTaskListProps> = ({
  tasks,
  closeDialog,
  cleaningTaskListId,
  cleaningTaskListDate,
  cleaningTaskListStaffMemberId,
  cleaningTaskListAssignedStaffMemberName,
  cleaningTaskListManagerSignature,
  cleaningTaskListStaffMemberSignature,
  refreshCleaningTasks,
  isCleaningTaskListDialogOpen,
  deleteCleaningTaskList,
  updateCleaningTaskList,
  setManagerSignature,
  managerSignatureInput,
  setManagerSignatureInput,
  handleSetSignatureError,
  setStaffMemberSignature,
  staffMemberSignatureInput,
  setStaffMemberSignatureInput,
  getCleaningTasksError,
  deleteCleaningTaskListError,
  setDeleteCleaningTaskListError,
}) => {
  const [isAddCleaningTaskDisplayed, setIsAddCleaningTaskDisplayed] = useState(false);

  const [isDeleteCleaningTaskDialogOpen, setIsDeleteCleaningTaskDialogOpen] = useState(false);

  const [cleaningTaskIdToDelete, setCleaningTaskIdToDelete] = useState<number>();

  const [isDeleteCleaningTaskErrorDialogOpen, setIsDeleteCleaningTaskErrorDialogOpen] =
    useState(false);

  const [deleteCleaningTaskErrorMessage, setDeleteCleaningTaskErrorMessage] = useState("");

  const [deleteCleaningTaskStatusCode, setDeleteCleaningTaskStatusCode] = useState<number>();

  const [isDeleteCleaningTaskListDialogOpen, setIsDeleteCleaningTaskListDialogOpen] =
    useState(false);

  const [isAssignStaffMemberDialogOpen, setIsAssignStaffMemberDialogOpen] = useState(false);

  const [isStaffMemberSignDialogOpen, setIsStaffMemberSignDialogOpen] = useState(false);

  const [isManagerSignDialogOpen, setIsManagerSignDialogOpen] = useState(false);

  const [managerSignatureError, setManagerSignatureError] = useState<Error_>();

  const [staffMemberSignatureError, setStaffMemberSignatureError] = useState<Error_>();

  const { userType } = useContext(UserContext);

  useEffect(() => {
    if (!isCleaningTaskListDialogOpen) setIsAddCleaningTaskDisplayed(false);
  }, [isCleaningTaskListDialogOpen]);

  useEffect(() => {
    if (isManagerSignDialogOpen === false) {
      setManagerSignatureInput(undefined);
    }
  }, [isManagerSignDialogOpen]);

  useEffect(() => {
    if (isStaffMemberSignDialogOpen === false) {
      setStaffMemberSignatureInput(undefined);
    }
  }, [isStaffMemberSignDialogOpen]);

  const deleteCleaningTask = async (cleaningTaskId: number): Promise<void> => {
    setIsDeleteCleaningTaskErrorDialogOpen(false);
    setDeleteCleaningTaskErrorMessage("");
    setDeleteCleaningTaskStatusCode(undefined);

    try {
      await removeCleaningTaskFromCleaningTaskList(cleaningTaskId);
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(error.response.data.statusCode, error.response.data.message)
        : console.error(error);

      setIsDeleteCleaningTaskErrorDialogOpen(true);

      if (error instanceof AxiosError && error.message === "Network Error") {
        setDeleteCleaningTaskErrorMessage(
          "Network Error. Please check that your device is connected to the internet."
        );
      } else {
        setDeleteCleaningTaskErrorMessage("An unexpected error occurred");
        setDeleteCleaningTaskStatusCode((error as AxiosError).response?.status || undefined);
      }
    } finally {
      if (cleaningTaskListId && cleaningTaskListDate) {
        await refreshCleaningTasks(
          cleaningTaskListId,
          cleaningTaskListDate,
          cleaningTaskListStaffMemberId || null,
          cleaningTaskListManagerSignature || null,
          cleaningTaskListStaffMemberSignature || null
        );
      }
    }
  };

  const deleteCleaningTaskListThenCloseCleaningTaskListDialog = (_cleaningTaskListId: number) => {
    deleteCleaningTaskList(_cleaningTaskListId).then((wasSuccessful) => {
      if (wasSuccessful) closeDialog();
    });
  };

  return (
    <>
      {isDeleteCleaningTaskErrorDialogOpen && (
        <Dialog
          submit={undefined}
          submitParams={undefined}
          close={setIsDeleteCleaningTaskErrorDialogOpen}
          closeParams={[false]}
          closeText="Close"
        >
          <Error
            message={deleteCleaningTaskErrorMessage}
            statusCode={deleteCleaningTaskStatusCode}
          />
        </Dialog>
      )}

      {isDeleteCleaningTaskDialogOpen && (
        <Dialog
          submit={deleteCleaningTask}
          submitParams={[cleaningTaskIdToDelete]}
          close={setIsDeleteCleaningTaskDialogOpen}
          closeParams={[false]}
          closeText="Cancel"
        >
          <p>Are you sure you want to delete the cleaning task?</p>
        </Dialog>
      )}

      {isDeleteCleaningTaskListDialogOpen && (
        <Dialog
          close={setIsDeleteCleaningTaskListDialogOpen}
          closeParams={[false]}
          closeText="Cancel"
          submit={deleteCleaningTaskListThenCloseCleaningTaskListDialog}
          submitParams={[cleaningTaskListId]}
        >
          <p>Are you sure you want to delete the cleaning task list?</p>
        </Dialog>
      )}

      {isManagerSignDialogOpen && (
        <Dialog
          closeText="Cancel"
          submit={setManagerSignature}
          submitParams={[
            cleaningTaskListId,
            managerSignatureInput,
            handleSetSignatureError,
            setManagerSignatureError,
          ]}
          close={setIsManagerSignDialogOpen}
          closeParams={[false]}
          submitText="Submit"
        >
          <form className="flex flex-col gap-2">
            <h2 className="text-2xl">Manager Signature</h2>
            <label htmlFor="managerSignature">Enter your signature:</label>
            <input
              type="text"
              name="managerSignature"
              id="managerSignature"
              onChange={(e) => setManagerSignatureInput(e.target.value)}
              className="relative mb-2 rounded border border-blue-800 bg-gray-700 px-2 py-1 hover:shadow hover:shadow-blue-800"
            />
          </form>
        </Dialog>
      )}

      {managerSignatureError && (
        <Dialog closeText="Close" close={setManagerSignatureError} closeParams={[false]}>
          <Error
            message={managerSignatureError.message}
            statusCode={managerSignatureError.statusCode}
          />
        </Dialog>
      )}

      {isStaffMemberSignDialogOpen && (
        <Dialog
          closeText="Cancel"
          submit={setStaffMemberSignature}
          submitParams={[
            cleaningTaskListId,
            staffMemberSignatureInput,
            handleSetSignatureError,
            setStaffMemberSignatureError,
          ]}
          close={setIsStaffMemberSignDialogOpen}
          closeParams={[false]}
          submitText="Submit"
        >
          <form className="flex flex-col gap-2">
            <h2 className="text-2xl">Staff Member Signature</h2>
            <label htmlFor="staffMemberSignature">Enter your signature:</label>
            <input
              type="text"
              name="staffMemberSignature"
              id="staffMemberSignature"
              onChange={(e) => setStaffMemberSignatureInput(e.target.value)}
              className="relative mb-2 rounded border border-blue-800 bg-gray-700 px-2 py-1 hover:shadow hover:shadow-blue-800"
            />
          </form>
        </Dialog>
      )}

      {staffMemberSignatureError && (
        <Dialog closeText="Close" close={setStaffMemberSignatureError} closeParams={[false]}>
          <Error
            message={staffMemberSignatureError.message}
            statusCode={staffMemberSignatureError.statusCode}
          />
        </Dialog>
      )}

      {deleteCleaningTaskListError && (
        <Dialog closeText="Close" close={setDeleteCleaningTaskListError} closeParams={[undefined]}>
          <Error
            message={deleteCleaningTaskListError.message}
            statusCode={deleteCleaningTaskListError.statusCode}
          />
        </Dialog>
      )}

      <div className="flex w-full max-w-full flex-col gap-y-5 overflow-scroll bg-slate-800 p-4 text-white">
        <h2 className="block text-3xl">Cleaning Task List</h2>
        <button
          type="button"
          onClick={closeDialog}
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

        <table className="w-full max-w-full border-collapse text-left">
          <thead className="hidden border-b border-slate-400 lg:table-header-group">
            <tr>
              <th className="py-2 pr-4 font-semibold">ID</th>
              <th className="py-2 pr-4 font-semibold">Date</th>
              <th className="py-2 pr-4 font-semibold">Assigned Staff Member</th>
              <th className="py-2 pr-4 font-semibold">Manager Signature</th>
              <th className="py-2 pr-4 font-semibold">Staff Member Signature</th>
            </tr>
          </thead>
          <tbody className="text-gray-200">
            <tr className="border-b border-slate-600">
              <td className="block py-2 pr-4 before:mr-5 before:font-bold before:content-['ID:'] lg:table-cell lg:before:mr-0 lg:before:content-['']">
                {cleaningTaskListId}
              </td>
              <td className="block py-2 pr-4 before:mr-5 before:font-bold before:content-['Date:'] lg:table-cell lg:before:mr-0 lg:before:content-['']">
                {cleaningTaskListDate}
              </td>
              <td className="block py-2 pr-4 before:mr-5 before:font-bold before:content-['Staff_Member:'] lg:table-cell lg:before:mr-0 lg:before:content-['']">
                {cleaningTaskListAssignedStaffMemberName}
              </td>
              <td className="block py-2 pr-4 before:mr-5 before:font-bold before:content-['Manager_Signature:'] lg:table-cell lg:before:mr-0 lg:before:content-['']">
                {cleaningTaskListManagerSignature}
              </td>
              <td className="block py-2 pr-4 before:mr-5 before:font-bold before:content-['Staff_Member_Signature:'] lg:table-cell lg:before:mr-0 lg:before:content-['']">
                {cleaningTaskListStaffMemberSignature}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex flex-wrap justify-start gap-x-2 gap-y-1">
          {userType === "Manager" && (
            <button
              type="button"
              className="flex gap-1 rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
              onClick={() => {
                setIsAddCleaningTaskDisplayed(true);
                setIsAssignStaffMemberDialogOpen(false);
              }}
            >
              Add Cleaning Task
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#FFFFFF"
                className="mt-0.5"
              >
                <path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z" />
              </svg>
            </button>
          )}

          {userType === "Manager" && (
            <button
              type="button"
              className="flex gap-1 rounded bg-sky-600 px-3 py-1 text-white hover:bg-sky-700"
              onClick={() => {
                setIsAssignStaffMemberDialogOpen(true);
                setIsAddCleaningTaskDisplayed(false);
              }}
            >
              Assign Staff Member
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#FFFFFF"
                className="mt-0.5"
              >
                <path d="M708-432v-84h-84v-72h84v-84h72v84h84v72h-84v84h-72Zm-324-48q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42ZM96-192v-92q0-25.78 12.5-47.39T143-366q55-32 116-49t125-17q64 0 125 17t116 49q22 13 34.5 34.61T672-284v92H96Zm72-72h432v-20q0-6.47-3.03-11.76-3.02-5.3-7.97-8.24-47-27-99-41.5T384-360q-54 0-106 14.5T179-304q-4.95 2.94-7.98 8.24Q168-290.47 168-284v20Zm216.21-288Q414-552 435-573.21t21-51Q456-654 434.79-675t-51-21Q354-696 333-674.79t-21 51Q312-594 333.21-573t51 21Zm-.21-73Zm0 361Z" />
              </svg>
            </button>
          )}

          <button
            type="button"
            className="flex gap-1 rounded bg-purple-600 px-3 py-1 text-white hover:bg-purple-700"
            onClick={() => {
              setIsStaffMemberSignDialogOpen(true);
              setIsAddCleaningTaskDisplayed(false);
              setIsAssignStaffMemberDialogOpen(false);
            }}
          >
            Sign - Staff Member
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#FFFFFF"
              className="mt-0.5"
            >
              <path d="M480-480q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42ZM192-192v-96q0-23 12.5-43.5T239-366q55-32 116.29-49 61.29-17 124.5-17t124.71 17Q666-398 721-366q22 13 34.5 34t12.5 44v96H192Zm72-72h432v-24q0-5.18-3.03-9.41-3.02-4.24-7.97-6.59-46-28-98-42t-107-14q-55 0-107 14t-98 42q-5 4-8 7.72-3 3.73-3 8.28v24Zm216.21-288Q510-552 531-573.21t21-51Q552-654 530.79-675t-51-21Q450-696 429-674.79t-21 51Q408-594 429.21-573t51 21Zm-.21-72Zm0 360Z" />
            </svg>
          </button>

          {userType === "Manager" && (
            <button
              type="button"
              className="flex gap-1 rounded bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-700"
              onClick={() => {
                setIsManagerSignDialogOpen(true);
                setIsAddCleaningTaskDisplayed(false);
                setIsAssignStaffMemberDialogOpen(false);
              }}
            >
              Sign - Manager
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#FFFFFF"
                className="mt-0.5"
              >
                <path d="M696.23-384Q656-384 628-411.77q-28-27.78-28-68Q600-520 627.77-548q27.78-28 68-28Q736-576 764-548.23q28 27.78 28 68Q792-440 764.23-412q-27.78 28-68 28ZM528-192v-53q0-11.08 4-20.54 4-9.46 12-16.46 32-27 71-40.5t81-13.5q42 0 81 13.5t71 40.5q8 7 12 16.46t4 20.54v53H528ZM384-480q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42Zm0-144ZM96-192v-92q0-25.78 12.5-47.39T143-366q55-32 116.21-49 61.21-17 124.79-17 52 0 102.5 11.5T585-387q-23 7-43 19t-39 26q-29-8-59-13t-60-5q-54.22 0-106.11 14T179-304q-5 3-8 8.28-3 5.27-3 11.72v20h288v72H96Zm288-72Zm.21-288Q414-552 435-573.21t21-51Q456-654 434.79-675t-51-21Q354-696 333-674.79t-21 51Q312-594 333.21-573t51 21Z" />
              </svg>
            </button>
          )}

          {userType === "Manager" && (
            <button
              type="button"
              className="flex gap-1 rounded bg-red-700 px-3 py-1 text-white hover:bg-red-800"
              onClick={() => {
                setIsDeleteCleaningTaskListDialogOpen(true);
                setIsAddCleaningTaskDisplayed(false);
                setIsAssignStaffMemberDialogOpen(false);
              }}
            >
              Delete Cleaning Task List
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#FFFFFF"
                className="mt-0.5"
              >
                <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
              </svg>
            </button>
          )}
        </div>

        {isAddCleaningTaskDisplayed && (
          <Dialog>
            <AddCleaningTask
              cleaningTaskListDetails={{
                cleaningTaskListId,
                cleaningTaskListDate,
                cleaningTaskListStaffMemberId,
                cleaningTaskListManagerSignature,
                cleaningTaskListStaffMemberSignature,
              }}
              refreshCleaningTasks={refreshCleaningTasks}
              setIsAddCleaningTaskDisplayed={setIsAddCleaningTaskDisplayed}
            />
          </Dialog>
        )}

        {isAssignStaffMemberDialogOpen && (
          <Dialog>
            <AssignStaffMember
              assignStaffMemberCleaningTaskListId={cleaningTaskListId}
              setIsAssignStaffMemberDialogOpen={setIsAssignStaffMemberDialogOpen}
              updateCleaningTaskList={updateCleaningTaskList}
            />
          </Dialog>
        )}

        <h2 className="text-2xl">Cleaning Tasks</h2>

        {getCleaningTasksError && (
          <Error
            message={getCleaningTasksError.message}
            statusCode={getCleaningTasksError.statusCode}
          />
        )}

        {tasks.length === 0 && !getCleaningTasksError && (
          <p className="w-max max-w-full rounded border border-black bg-gray-900 px-2 py-0.5">
            The cleaning task list is empty
          </p>
        )}

        {tasks.length !== 0 && !getCleaningTasksError && (
          <table className="w-full max-w-full border-collapse text-left">
            <thead className="hidden border-b border-slate-400 lg:table-header-group">
              <tr>
                <th className="py-2 pr-4 font-semibold">ID</th>
                <th className="py-2 pr-4 font-semibold">Description</th>
                <th className="py-2 pr-4 font-semibold">Area</th>
                <th className="py-2 pr-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-200">
              {tasks.map((task) => (
                <CleaningTask
                  key={task.cleaningtaskid}
                  task={task}
                  refreshCleaningTasks={refreshCleaningTasks}
                  cleaningTaskListId={cleaningTaskListId}
                  cleaningTaskListDate={cleaningTaskListDate}
                  cleaningTaskListStaffMemberId={cleaningTaskListStaffMemberId}
                  cleaningTaskListManagerSignature={cleaningTaskListManagerSignature}
                  cleaningTaskListStaffMemberSignature={cleaningTaskListStaffMemberSignature}
                  setCleaningTaskIdToDelete={setCleaningTaskIdToDelete}
                  setIsDeleteCleaningTaskDialogOpen={setIsDeleteCleaningTaskDialogOpen}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default CleaningTaskList;
