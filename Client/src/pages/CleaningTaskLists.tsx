import { useContext, useEffect, useRef, useState } from "react";
import {
  getCleaningTaskLists,
  getCleaningTasks,
  deleteCleaningTaskList as _deleteCleaningTaskList,
  getStaffMembers,
  signOffCleaningTaskListManager,
  signOffCleaningTaskListStaffMember,
  getCleaningTaskList,
} from "../../api/api";
import {
  CleaningTask,
  CleaningTaskList as CleaningTaskList_TYPE,
  CleaningTaskListWithStaffMember,
  Error_,
} from "../../api/types";
import { AxiosError } from "axios";
import Error from "../components/Error";
import CleaningTaskList from "../components/CleaningTaskList";
import "../styles/styles.css";
import Dialog from "../components/Dialog";
import CreateNewCleaningTaskList from "../components/CreateNewCleaningTaskList";
import AssignStaffMember from "../components/AssignStaffMember";
import NetworkStatus from "../components/NetworkStatus";
import { UserContext } from "../App";

const CleaningTaskLists: React.FC = () => {
  const [cleaningTaskLists, setCleaningTaskLists] = useState<
    Array<CleaningTaskListWithStaffMember>
  >([]);
  const [isError, setIsError] = useState(false);
  const [errorComponent, setErrorComponent] = useState<JSX.Element>();
  const [cleaningTasks, setCleaningTasks] = useState<Array<CleaningTask>>([]);
  const [isCleaningTaskListDialogOpen, setIsCleaningTaskListDialogOpen] = useState(false);
  const [cleaningTaskListId, setCleaningTaskListId] = useState<number>();
  const [cleaningTaskListDate, setCleaningTaskListDate] = useState<string>();

  const [cleaningTaskListStaffMemberId, setCleaningTaskListStaffMemberId] = useState<
    number | null
  >();

  const [cleaningTaskListAssignedStaffMemberName, setCleaningTaskListAssignedStaffMemberName] =
    useState<number | string | null>();

  const [cleaningTaskListManagerSignature, setCleaningTaskListManagerSignature] = useState<
    string | null
  >();

  const [cleaningTaskListStaffMemberSignature, setCleaningTaskListStaffMemberSignature] = useState<
    string | null
  >();

  const cleaningTaskListDialogRef = useRef<HTMLDialogElement>(null);

  const [isDeleteCleaningTaskListDialogOpen, setIsDeleteCleaningTaskListDialogOpen] =
    useState(false);

  const [cleaningTaskListIdToDelete, setCleaningTaskListIdToDelete] = useState<number>();

  const newCleaningTaskListDialogRef = useRef<HTMLDialogElement>(null);

  const [isNewCleaningTaskListDialogOpen, setIsNewCleaningTaskListDialogOpen] = useState(false);

  const [
    isSignOffCleaningTaskListManagerDialogOpen,
    setIsSignOffCleaningTaskListManagerDialogOpen,
  ] = useState(false);

  const [managerSignatureInput, setManagerSignatureInput] = useState<string>();

  const [signOffManagerCleaningTaskListId, setSignOffManagerCleaningTaskListId] =
    useState<number>();

  const [
    isSignOffCleaningTaskListStaffMemberDialogOpen,
    setIsSignOffCleaningTaskListStaffMemberDialogOpen,
  ] = useState(false);

  const [staffMemberSignatureInput, setStaffMemberSignatureInput] = useState<string>();

  const [signOffStaffMemberCleaningTaskListId, setSignOffStaffMemberCleaningTaskListId] =
    useState<number>();

  const assignStaffMemberDialog = useRef<HTMLDialogElement>(null);

  const [isAssignStaffMemberDialogOpen, setIsAssignStaffMemberDialogOpen] = useState(false);

  const [assignStaffMemberCleaningTaskListId, setAssignStaffMemberCleaningTaskListId] =
    useState<number>();

  const [managerSignatureError, setManagerSignatureError] = useState<Error_>();

  const [staffMemberSignatureError, setStaffMemberSignatureError] = useState<Error_>();

  const [getCleaningTasksError, setGetCleaningTasksError] = useState<Error_>();

  const [deleteCleaningTaskListError, setDeleteCleaningTaskListError] = useState<Error_>();

  const { userType } = useContext(UserContext);

  useEffect(() => {
    fetchCleaningTaskLists();

    () => setCleaningTaskLists([]);
  }, []);

  useEffect(() => {
    if (cleaningTaskListDialogRef.current) {
      if (isCleaningTaskListDialogOpen) {
        cleaningTaskListDialogRef.current.showModal();
        document.body.classList.add("blur-background");
      } else {
        cleaningTaskListDialogRef.current.close();
        document.body.classList.remove("blur-background");
      }
    }
  }, [isCleaningTaskListDialogOpen]);

  useEffect(() => {
    if (newCleaningTaskListDialogRef.current) {
      if (isNewCleaningTaskListDialogOpen) {
        newCleaningTaskListDialogRef.current.showModal();
        document.body.classList.add("blur-background");
      } else {
        newCleaningTaskListDialogRef.current.close();
        document.body.classList.remove("blur-background");
      }
    }
  }, [isNewCleaningTaskListDialogOpen]);

  useEffect(() => {
    if (assignStaffMemberDialog.current) {
      if (isAssignStaffMemberDialogOpen) {
        assignStaffMemberDialog.current.showModal();
        document.body.classList.add("blur-background");
      } else {
        assignStaffMemberDialog.current.close();
        document.body.classList.remove("blur-background");
      }
    }
  }, [isAssignStaffMemberDialogOpen]);

  useEffect(() => {
    if (isSignOffCleaningTaskListManagerDialogOpen === false) {
      setManagerSignatureInput(undefined);
    }
  }, [isSignOffCleaningTaskListManagerDialogOpen]);

  useEffect(() => {
    if (isSignOffCleaningTaskListStaffMemberDialogOpen === false) {
      setStaffMemberSignatureInput(undefined);
    }
  }, [isSignOffCleaningTaskListStaffMemberDialogOpen]);

  const setNetworkError = () => {
    setErrorComponent(
      <Error
        statusCode={undefined}
        message="Network Error. Please check that your device is connected to the internet."
      />
    );
  };

  const fetchCleaningTaskLists = async () => {
    setIsError(false);

    try {
      const cleaningTaskLists: Array<CleaningTaskList_TYPE> = await getCleaningTaskLists();

      // Order cleaning task lists by the date - most recent to oldest
      // if the dates are the same then sort by id
      cleaningTaskLists.sort((a, b) => {
        const dateA = new Date(a._date).getTime();
        const dateB = new Date(b._date).getTime();

        if (dateA === dateB) return a.cleaningtasklistid - b.cleaningtasklistid;

        return dateB - dateA;
      });

      // Get staff members
      const staffMembers = await getStaffMembers();

      // Join staff members data with the cleaning task list data
      const cleaningTaskListsWithStaffMembers: Array<CleaningTaskListWithStaffMember> =
        cleaningTaskLists.map((cleaningTaskList) => {
          const staffMember = staffMembers.find(
            (staffM) => cleaningTaskList.staffmemberid === staffM.payrollNumber
          );

          if (staffMember) {
            return {
              ...cleaningTaskList,
              staffMemberFirstName: staffMember.firstName,
              staffMemberLastName: staffMember.lastName,
            };
          } else {
            return cleaningTaskList;
          }
        });

      setCleaningTaskLists(cleaningTaskListsWithStaffMembers);
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(error.response.data.statusCode, error.response.data.message)
        : console.error(error);

      setIsError(true);
      if (error instanceof AxiosError && error.response?.data.statusCode === 404) {
        setErrorComponent(
          <p className="self-start rounded border border-white bg-slate-900 px-2 py-0.5">
            There are no cleaning task lists stored in the system.
          </p>
        );
      } else if (error instanceof AxiosError && error.message === "Network Error") {
        setNetworkError();
      } else {
        setErrorComponent(
          <Error
            statusCode={(error as AxiosError).response?.status || undefined}
            message="An error occurred while getting the cleaning task lists."
          />
        );
      }
    }
  };

  const viewCleaningTasks = async (_cleaningTaskListId: number): Promise<void> => {
    setGetCleaningTasksError(undefined);

    try {
      const cleaningTsks: Array<CleaningTask> = await getCleaningTasks(_cleaningTaskListId);

      // Group cleaning tasks by area.
      cleaningTsks.sort((a, b) => a.areadescription.localeCompare(b.areadescription));

      setCleaningTasks(cleaningTsks);
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(error.response.data.statusCode, error.response.data.message)
        : console.error(error);

      if (error instanceof AxiosError && error.response?.data.statusCode === 404) {
        setCleaningTasks([]);
      } else if (error instanceof AxiosError && error.message === "Network Error") {
        setGetCleaningTasksError({
          message: "Network Error. Please check that your device is connected to the internet.",
        });
      } else {
        setGetCleaningTasksError({
          message: "An error occurred while fetching the cleaning tasks",
          statusCode: 500,
        });
      }
    }
  };

  const deleteCleaningTaskList = async (cleaningTaskListId: number): Promise<boolean> => {
    setDeleteCleaningTaskListError(undefined);

    try {
      await _deleteCleaningTaskList(cleaningTaskListId);

      await fetchCleaningTaskLists();

      return true;
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(error.response.data.statusCode, error.response.data.message)
        : console.error(error);

      if (error instanceof AxiosError && error.message === "Network Error") {
        setDeleteCleaningTaskListError({
          message: "Network Error. Please check that your device is connected to the internet.",
        });
      } else {
        setDeleteCleaningTaskListError({
          message: "An error occurred while deleting the cleaning task list.",
          statusCode: (error as AxiosError).response?.status || undefined,
        });
      }

      return false;
    }
  };

  const setManagerSignature = async (
    cleaningTaskListId: number,
    signature: string,
    handleError: (
      error: unknown,
      setError: React.Dispatch<React.SetStateAction<Error_ | undefined>>
    ) => void,
    setError: React.Dispatch<React.SetStateAction<Error_ | undefined>>
  ) => {
    setError(undefined);

    if (signature === undefined || signature === "") {
      setError({
        message: "A signature must be provided",
        statusCode: undefined,
      });
      return;
    }

    try {
      await signOffCleaningTaskListManager(cleaningTaskListId, signature);
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(error.response.data.statusCode, error.response.data.message)
        : console.error(error);

      handleError(error, setError);
    } finally {
      await updateCleaningTaskList(cleaningTaskListId);
    }
  };

  const handleSetSignatureError = (
    error: unknown,
    setError: React.Dispatch<React.SetStateAction<Error_ | undefined>>
  ) => {
    if (error instanceof AxiosError && error.message === "Network Error") {
      setError({
        message: "Network Error. Please check that your device is connected to the internet.",
        statusCode: undefined,
      });
    } else {
      setError({
        message: "An unexpected error occurred while retrieving the cleaning task list",
        statusCode: (error as AxiosError).response?.status || undefined,
      });
    }
  };

  const setStaffMemberSignature = async (
    cleaningTaskListId: number,
    signature: string,
    handleError: (
      error: unknown,
      setError: React.Dispatch<React.SetStateAction<Error_ | undefined>>
    ) => void,
    setError: React.Dispatch<React.SetStateAction<Error_ | undefined>>
  ) => {
    setError(undefined);

    if (signature === undefined || signature === "") {
      setError({
        message: "A signature must be provided",
        statusCode: undefined,
      });
      return;
    }

    try {
      await signOffCleaningTaskListStaffMember(cleaningTaskListId, signature);
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(error.response.data.statusCode, error.response.data.message)
        : console.error(error);

      handleError(error, setError);
    } finally {
      await updateCleaningTaskList(cleaningTaskListId);
    }
  };

  const updateCleaningTaskList = async (cleaningTaskListId: number): Promise<void> => {
    try {
      const cleaningTaskList = await getCleaningTaskList(cleaningTaskListId);

      const staffMembers = await getStaffMembers();

      const staffMember = staffMembers.find(
        (staffMember_) => staffMember_.payrollNumber === cleaningTaskList.staffmemberid
      );

      let cleaningTaskListWithStaffMember: CleaningTaskListWithStaffMember;

      if (staffMember) {
        cleaningTaskListWithStaffMember = {
          ...cleaningTaskList,
          staffMemberFirstName: staffMember.firstName,
          staffMemberLastName: staffMember.lastName,
        };
      } else {
        cleaningTaskListWithStaffMember = cleaningTaskList;
      }

      const id = cleaningTaskList.cleaningtasklistid;

      const cleaningTaskListIndex = cleaningTaskLists.findIndex(
        (list) => list.cleaningtasklistid === id
      );

      const cleaningTaskListsCopy = [...cleaningTaskLists];

      cleaningTaskListsCopy[cleaningTaskListIndex] = cleaningTaskListWithStaffMember;

      setCleaningTaskLists(cleaningTaskListsCopy);

      setCleaningTaskListId(cleaningTaskListWithStaffMember.cleaningtasklistid);
      setCleaningTaskListDate(new Date(cleaningTaskListWithStaffMember._date).toLocaleDateString());
      setCleaningTaskListStaffMemberId(cleaningTaskListWithStaffMember.staffmemberid);

      if (
        cleaningTaskListWithStaffMember.staffMemberFirstName &&
        cleaningTaskListWithStaffMember.staffMemberLastName
      ) {
        setCleaningTaskListAssignedStaffMemberName(
          `${cleaningTaskListWithStaffMember.staffMemberFirstName} ${cleaningTaskListWithStaffMember.staffMemberLastName}`
        );
      } else {
        setCleaningTaskListAssignedStaffMemberName(cleaningTaskListWithStaffMember.staffmemberid);
      }

      setCleaningTaskListManagerSignature(cleaningTaskListWithStaffMember.managersignature);
      setCleaningTaskListStaffMemberSignature(cleaningTaskListWithStaffMember.staffmembersignature);
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(error.response.data.statusCode, error.response.data.message)
        : console.error(error);
    }
  };

  const closeCleaningTaskListDialog = (): void => {
    setIsCleaningTaskListDialogOpen(false);
  };

  const closeNewCleaningTaskListDialog = () => {
    setIsNewCleaningTaskListDialogOpen(false);
  };

  async function handleOpenCleaningTaskList(taskList: CleaningTaskListWithStaffMember) {
    setCleaningTaskListId(taskList.cleaningtasklistid);
    setCleaningTaskListDate(new Date(taskList._date).toLocaleDateString());
    setCleaningTaskListStaffMemberId(taskList.staffmemberid);

    if (taskList.staffMemberFirstName && taskList.staffMemberLastName) {
      setCleaningTaskListAssignedStaffMemberName(
        `${taskList.staffMemberFirstName} ${taskList.staffMemberLastName}`
      );
    } else {
      setCleaningTaskListAssignedStaffMemberName(taskList.staffmemberid);
    }
    setCleaningTaskListManagerSignature(taskList.managersignature);
    setCleaningTaskListStaffMemberSignature(taskList.staffmembersignature);

    setIsCleaningTaskListDialogOpen(true);

    await viewCleaningTasks(taskList.cleaningtasklistid);
  }

  return (
    <div className="flex flex-col items-center text-white">
      <dialog
        ref={cleaningTaskListDialogRef}
        className={`w-11/12 rounded border border-white shadow shadow-white`}
        id="cleaningTaskListDialog"
      >
        <CleaningTaskList
          tasks={cleaningTasks}
          closeDialog={closeCleaningTaskListDialog}
          cleaningTaskListId={cleaningTaskListId}
          cleaningTaskListDate={cleaningTaskListDate}
          cleaningTaskListStaffMemberId={cleaningTaskListStaffMemberId}
          cleaningTaskListAssignedStaffMemberName={cleaningTaskListAssignedStaffMemberName}
          cleaningTaskListManagerSignature={cleaningTaskListManagerSignature}
          cleaningTaskListStaffMemberSignature={cleaningTaskListStaffMemberSignature}
          refreshCleaningTasks={viewCleaningTasks}
          isCleaningTaskListDialogOpen={isCleaningTaskListDialogOpen}
          deleteCleaningTaskList={deleteCleaningTaskList}
          updateCleaningTaskList={updateCleaningTaskList}
          setManagerSignature={setManagerSignature}
          managerSignatureInput={managerSignatureInput}
          setManagerSignatureInput={setManagerSignatureInput}
          handleSetSignatureError={handleSetSignatureError}
          setStaffMemberSignature={setStaffMemberSignature}
          staffMemberSignatureInput={staffMemberSignatureInput}
          setStaffMemberSignatureInput={setStaffMemberSignatureInput}
          getCleaningTasksError={getCleaningTasksError}
          deleteCleaningTaskListError={deleteCleaningTaskListError}
          setDeleteCleaningTaskListError={setDeleteCleaningTaskListError}
        />
        <NetworkStatus />
      </dialog>

      {userType === "Manager" && (
        <dialog
          ref={newCleaningTaskListDialogRef}
          className={`w-11/12 rounded border border-white shadow shadow-white`}
        >
          <CreateNewCleaningTaskList
            closeDialog={closeNewCleaningTaskListDialog}
            fetchCleaningTaskLists={fetchCleaningTaskLists}
          />
          <NetworkStatus />
        </dialog>
      )}

      {isDeleteCleaningTaskListDialogOpen && (
        <Dialog
          close={setIsDeleteCleaningTaskListDialogOpen}
          closeParams={[false]}
          closeText="Cancel"
          submit={deleteCleaningTaskList}
          submitParams={[cleaningTaskListIdToDelete]}
        >
          <p>Are you sure you want to delete the cleaning task list?</p>
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

      {isSignOffCleaningTaskListManagerDialogOpen && (
        <Dialog
          closeText="Cancel"
          submit={setManagerSignature}
          submitParams={[
            signOffManagerCleaningTaskListId,
            managerSignatureInput,
            handleSetSignatureError,
            setManagerSignatureError,
          ]}
          close={setIsSignOffCleaningTaskListManagerDialogOpen}
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

      {isSignOffCleaningTaskListStaffMemberDialogOpen && (
        <Dialog
          closeText="Cancel"
          submit={setStaffMemberSignature}
          submitParams={[
            signOffStaffMemberCleaningTaskListId,
            staffMemberSignatureInput,
            handleSetSignatureError,
            setStaffMemberSignatureError,
          ]}
          close={setIsSignOffCleaningTaskListStaffMemberDialogOpen}
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

      {managerSignatureError && (
        <Dialog closeText="Close" close={setManagerSignatureError} closeParams={[false]}>
          <Error
            message={managerSignatureError.message}
            statusCode={managerSignatureError.statusCode}
          />
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

      {userType === "Manager" && (
        <dialog
          ref={assignStaffMemberDialog}
          className="w-11/12 rounded border border-white text-white shadow shadow-white"
        >
          <AssignStaffMember
            isAssignStaffMemberDialogOpen={isAssignStaffMemberDialogOpen}
            setIsAssignStaffMemberDialogOpen={setIsAssignStaffMemberDialogOpen}
            assignStaffMemberCleaningTaskListId={assignStaffMemberCleaningTaskListId}
            updateCleaningTaskList={updateCleaningTaskList}
          />
          <NetworkStatus />
        </dialog>
      )}

      <h1 className="mb-4 self-start text-3xl">Cleaning Task Lists</h1>

      {userType === "Manager" && (
        <div className="flex w-11/12 justify-end mb-2">
          <button
            type="button"
            className="flex gap-1 rounded bg-blue-700 px-3 py-1 text-white hover:bg-blue-800"
            onClick={() => setIsNewCleaningTaskListDialogOpen(true)}
          >
            New
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
        </div>
      )}

      {isError ? (
        errorComponent
      ) : (
        <div className="w-11/12 overflow-x-auto">
          <table className="w-full max-w-full border-collapse text-left">
            <thead className="hidden border-b border-slate-400 2xl:table-header-group">
              <tr>
                <th className="py-2 pr-4 font-semibold">ID</th>
                <th className="py-2 pr-4 font-semibold">Date</th>
                <th className="py-2 pr-4 font-semibold">Assigned Staff Member</th>
                <th className="py-2 pr-4 font-semibold">Manager Signature</th>
                <th className="py-2 pr-4 font-semibold">Staff Member Signature</th>
                <th className="py-2 pr-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-200">
              {cleaningTaskLists.map((taskList) => {
                let staffMemberDetails: number | string | null = taskList.staffmemberid;

                if (taskList.staffMemberFirstName && taskList.staffMemberLastName) {
                  staffMemberDetails = `${taskList.staffMemberFirstName} ${taskList.staffMemberLastName}`;
                }

                return (
                  <tr key={taskList.cleaningtasklistid} className="border-b border-slate-600">
                    <td className="block py-2 pr-4 before:mr-5 before:font-bold before:content-['ID:'] 2xl:table-cell 2xl:before:mr-0 2xl:before:content-['']">
                      {taskList.cleaningtasklistid}
                    </td>
                    <td className="block py-2 pr-4 before:mr-5 before:font-bold before:content-['Date:'] 2xl:table-cell 2xl:before:mr-0 2xl:before:content-['']">
                      {new Date(taskList._date).toLocaleDateString()}
                    </td>
                    <td className="block py-2 pr-4 before:mr-5 before:font-bold before:content-['Staff_Member:'] 2xl:table-cell 2xl:before:mr-0 2xl:before:content-['']">
                      {staffMemberDetails}
                    </td>
                    <td className="block py-2 pr-4 before:mr-5 before:font-bold before:content-['Manager_Signature:'] 2xl:table-cell 2xl:before:mr-0 2xl:before:content-['']">
                      {taskList.managersignature}
                    </td>
                    <td className="block py-2 pr-4 before:mr-5 before:font-bold before:content-['Staff_Member_Signature:'] 2xl:table-cell 2xl:before:mr-0 2xl:before:content-['']">
                      {taskList.staffmembersignature}
                    </td>
                    <td className="flex flex-wrap gap-x-1 py-2 pr-4 before:mr-5 before:font-bold before:content-['Actions:'] 2xl:before:mr-0 2xl:before:content-['']">
                      <button
                        type="button"
                        className="rounded bg-indigo-600 p-1.5 text-white hover:bg-indigo-700"
                        onClick={() => handleOpenCleaningTaskList(taskList)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="20px"
                          viewBox="0 -960 960 960"
                          width="20px"
                          fill="#FFFFFF"
                        >
                          <path d="M336-264h456v-96H336v96ZM168-600h96v-96h-96v96Zm0 168h96v-96h-96v96Zm0 168h96v-96h-96v96Zm168-168h456v-96H336v96Zm0-168h456v-96H336v96ZM168-192q-29.7 0-50.85-21.16Q96-234.32 96-264.04v-432.24Q96-726 117.15-747T168-768h624q29.7 0 50.85 21.16Q864-725.68 864-695.96v432.24Q864-234 842.85-213T792-192H168Z" />
                        </svg>
                      </button>

                      {userType === "Manager" && (
                        <button
                          type="button"
                          className="rounded bg-sky-600 p-1.5 text-white hover:bg-sky-700"
                          onClick={() => {
                            setIsAssignStaffMemberDialogOpen(true);
                            setAssignStaffMemberCleaningTaskListId(taskList.cleaningtasklistid);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#FFFFFF"
                          >
                            <path d="M708-432v-84h-84v-72h84v-84h72v84h84v72h-84v84h-72Zm-324-48q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42ZM96-192v-92q0-25.78 12.5-47.39T143-366q55-32 116-49t125-17q64 0 125 17t116 49q22 13 34.5 34.61T672-284v92H96Zm72-72h432v-20q0-6.47-3.03-11.76-3.02-5.3-7.97-8.24-47-27-99-41.5T384-360q-54 0-106 14.5T179-304q-4.95 2.94-7.98 8.24Q168-290.47 168-284v20Zm216.21-288Q414-552 435-573.21t21-51Q456-654 434.79-675t-51-21Q354-696 333-674.79t-21 51Q312-594 333.21-573t51 21Zm-.21-73Zm0 361Z" />
                          </svg>
                        </button>
                      )}

                      <button
                        type="button"
                        className="rounded bg-purple-600 p-1.5 text-white hover:bg-purple-700"
                        onClick={() => {
                          setIsSignOffCleaningTaskListStaffMemberDialogOpen(true);
                          setSignOffStaffMemberCleaningTaskListId(taskList.cleaningtasklistid);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="20px"
                          viewBox="0 -960 960 960"
                          width="20px"
                          fill="#FFFFFF"
                        >
                          <path d="M480-480q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42ZM192-192v-96q0-23 12.5-43.5T239-366q55-32 116.29-49 61.29-17 124.5-17t124.71 17Q666-398 721-366q22 13 34.5 34t12.5 44v96H192Zm72-72h432v-24q0-5.18-3.03-9.41-3.02-4.24-7.97-6.59-46-28-98-42t-107-14q-55 0-107 14t-98 42q-5 4-8 7.72-3 3.73-3 8.28v24Zm216.21-288Q510-552 531-573.21t21-51Q552-654 530.79-675t-51-21Q450-696 429-674.79t-21 51Q408-594 429.21-573t51 21Zm-.21-72Zm0 360Z" />
                        </svg>
                      </button>

                      {userType === "Manager" && (
                        <button
                          type="button"
                          className="rounded bg-emerald-600 p-1.5 text-white hover:bg-emerald-700"
                          onClick={() => {
                            setManagerSignatureInput(undefined);
                            setIsSignOffCleaningTaskListManagerDialogOpen(true);
                            setSignOffManagerCleaningTaskListId(taskList.cleaningtasklistid);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#FFFFFF"
                          >
                            <path d="M696.23-384Q656-384 628-411.77q-28-27.78-28-68Q600-520 627.77-548q27.78-28 68-28Q736-576 764-548.23q28 27.78 28 68Q792-440 764.23-412q-27.78 28-68 28ZM528-192v-53q0-11.08 4-20.54 4-9.46 12-16.46 32-27 71-40.5t81-13.5q42 0 81 13.5t71 40.5q8 7 12 16.46t4 20.54v53H528ZM384-480q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42Zm0-144ZM96-192v-92q0-25.78 12.5-47.39T143-366q55-32 116.21-49 61.21-17 124.79-17 52 0 102.5 11.5T585-387q-23 7-43 19t-39 26q-29-8-59-13t-60-5q-54.22 0-106.11 14T179-304q-5 3-8 8.28-3 5.27-3 11.72v20h288v72H96Zm288-72Zm.21-288Q414-552 435-573.21t21-51Q456-654 434.79-675t-51-21Q354-696 333-674.79t-21 51Q312-594 333.21-573t51 21Z" />
                          </svg>
                        </button>
                      )}

                      {userType === "Manager" && (
                        <button
                          type="button"
                          className="rounded bg-red-700 p-1.5 text-white hover:bg-red-800"
                          onClick={async () => {
                            setCleaningTaskListIdToDelete(taskList.cleaningtasklistid);
                            setIsDeleteCleaningTaskListDialogOpen(true);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#FFFFFF"
                          >
                            <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CleaningTaskLists;
