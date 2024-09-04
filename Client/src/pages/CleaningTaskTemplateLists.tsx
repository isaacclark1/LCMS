import { useEffect, useRef, useState } from "react";
import { CleaningTaskTemplateList as CleaningTaskTemplateList_TYPE, Error_ } from "../../api/types";
import { getCleaningTaskTemplateLists } from "../../api/api";
import { AxiosError } from "axios";
import Error from "../components/Error";
import "../styles/styles.css";
import CleaningTaskTemplateListDialog from "../components/CleaningTaskTemplateListDialog";
import CleaningTaskTemplateList from "../components/CleaningTaskTemplateList";
import Dialog from "../components/Dialog";
import { deleteCleaningTaskTemplateList as _deleteCleaningTaskTemplateList } from "../../api/api";
import CreateNewCleaningTaskTemplateListDialog from "../components/CreateNewCleaningTaskTemplateListDialog";
import NetworkStatus from "../components/NetworkStatus";

const CleaningTaskTemplateLists: React.FC = () => {
  const [cleaningTaskTemplateLists, setCleaningTaskTemplateLists] = useState<
    Array<CleaningTaskTemplateList_TYPE>
  >([]);

  const [fetchCleaningTaskTemplateListsError, setFetchCleaningTaskTemplateListsError] =
    useState<Error_>();

  // Current cleaning task template list open.
  const [cleaningTaskTemplateListId, setCleaningTaskTemplateListId] = useState<number>();

  // View cleaning task template list dialog reference.
  const cleaningTaskTemplateListDialogRef = useRef<HTMLDialogElement>(null);

  // View cleaning task template list dialog open?
  const [isViewCleaningTaskTemplateListDialogOpen, setIsViewCleaningTaskTemplateListDialogOpen] =
    useState(false);

  // Delete cleaning task template list dialog open?
  const [isDeleteCleaningTaskTemplateListOpen, setIsDeleteCleaningTaskTemplateListOpen] =
    useState(false);

  // Id of the cleaning task template list to delete
  const [idOfcleaningTaskTemplateListToDelete, setIdOfCleaningTaskTemplateListToDelete] =
    useState<number>();

  const [deleteCleaningTaskTemplateListError, setDeleteCleaningTaskTemplateListError] =
    useState<Error_>();

  // Add cleaning task template list dialog reference
  const createNewCleaningTaskTemplateListDialogRef = useRef<HTMLDialogElement>(null);

  // Create new cleaning task template list dialog open?
  const [
    isCreateNewCleaningTaskTemplateListDialogOpen,
    setIsCreateNewCleaningTaskTemplateListDialogOpen,
  ] = useState(false);

  // Get cleaning task template lists when the component renders.
  useEffect(() => {
    fetchCleaningTaskTemplateLists();

    // Reset cleaning task template lists when the component unmounts.
    return () => setCleaningTaskTemplateLists([]);
  }, []);

  /*
   Handle whether view cleaning task template list dialog is open based on the value of
   isViewCleaningTaskTemplateListDialogOpen
  */
  useEffect(() => {
    if (cleaningTaskTemplateListDialogRef.current) {
      if (isViewCleaningTaskTemplateListDialogOpen) {
        cleaningTaskTemplateListDialogRef.current.showModal();
        document.body.classList.add("blur-background");
      } else {
        cleaningTaskTemplateListDialogRef.current.close();
        document.body.classList.remove("blur-background");
      }
    }
  }, [isViewCleaningTaskTemplateListDialogOpen]);

  /*
    Handle whether create new cleaning task template list dialog is open based on the value
    of isCreateNewCleaningTaskTemplateListDialogOpen
  */
  useEffect(() => {
    if (createNewCleaningTaskTemplateListDialogRef.current) {
      if (isCreateNewCleaningTaskTemplateListDialogOpen) {
        createNewCleaningTaskTemplateListDialogRef.current.showModal();
        document.body.classList.add("blur-background");
      } else {
        createNewCleaningTaskTemplateListDialogRef.current.close();
        document.body.classList.remove("blur-background");
      }
    }
  }, [isCreateNewCleaningTaskTemplateListDialogOpen]);

  const fetchCleaningTaskTemplateLists = async () => {
    setFetchCleaningTaskTemplateListsError(undefined);

    try {
      const cleaningTaskTemplateLists: Array<CleaningTaskTemplateList_TYPE> =
        await getCleaningTaskTemplateLists();

      setCleaningTaskTemplateLists(cleaningTaskTemplateLists);
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(error.response.data.statusCode, error.response.data.message)
        : console.error(error);

      if (error instanceof AxiosError && error.response?.data.statusCode === 404) {
        setCleaningTaskTemplateLists([]);
      } else if (error instanceof AxiosError && error.message === "Network Error") {
        setFetchCleaningTaskTemplateListsError({
          message: "Network Error. Please check that your device is connected to the internet.",
        });
      } else {
        setFetchCleaningTaskTemplateListsError({
          message: "An error occurred while retrieving the cleaning task template lists.",
          statusCode: (error as AxiosError).response?.status || undefined,
        });
      }
    }
  };

  const deleteCleaningTaskTemplateList = async (cleaningTaskTemplateListId: number) => {
    try {
      await _deleteCleaningTaskTemplateList(cleaningTaskTemplateListId);
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(error.response.data.statusCode, error.response.data.message)
        : console.error(error);

      if (error instanceof AxiosError && error.message === "Network Error") {
        setDeleteCleaningTaskTemplateListError({
          message: "Network Error. Please check that your device is connected to the internet.",
        });
      } else {
        setDeleteCleaningTaskTemplateListError({
          message: "An error occurred while deleting the cleaning task template list.",
          statusCode: (error as AxiosError).response?.status || undefined,
        });
      }
    } finally {
      await fetchCleaningTaskTemplateLists();
    }
  };

  const openViewCleaningTaskTemplateListDialog = () => {
    setIsViewCleaningTaskTemplateListDialogOpen(true);
  };

  const closeViewCleaningTaskTemplateListDialog = () => {
    setIsViewCleaningTaskTemplateListDialogOpen(false);
  };

  const openDeleteCleaningTaskTemplateListDialog = () => {
    setIsDeleteCleaningTaskTemplateListOpen(true);
  };

  const closeDeleteCleaningTaskTemplateListDialog = () => {
    setIsDeleteCleaningTaskTemplateListOpen(false);
  };

  const openCreateNewCleaningTaskTemplateListDialog = () => {
    setIsCreateNewCleaningTaskTemplateListDialogOpen(true);
  };

  const closeCreateNewCleaningTaskTemplateListDialog = () => {
    setIsCreateNewCleaningTaskTemplateListDialogOpen(false);
  };

  return (
    <div className="flex flex-col items-center text-white">
      <dialog
        ref={cleaningTaskTemplateListDialogRef}
        className="w-11/12 rounded border border-white shadow shadow-white"
      >
        <CleaningTaskTemplateListDialog
          cleaningTaskTemplateListId={cleaningTaskTemplateListId}
          closeDialog={closeViewCleaningTaskTemplateListDialog}
          deleteCleaningTaskTemplateList={deleteCleaningTaskTemplateList}
          deleteCleaningTaskTemplateListError={deleteCleaningTaskTemplateListError}
          setDeleteCleaningTaskTemplateListError={setDeleteCleaningTaskTemplateListError}
        />
        <NetworkStatus />
      </dialog>

      <dialog
        ref={createNewCleaningTaskTemplateListDialogRef}
        className="w-11/12 overflow-y-scroll rounded border border-white bg-slate-800 shadow shadow-white"
      >
        <CreateNewCleaningTaskTemplateListDialog
          closeDialog={closeCreateNewCleaningTaskTemplateListDialog}
          fetchCleaningTaskTemplateLists={fetchCleaningTaskTemplateLists}
          isCreateNewCleaningTaskTemplateListDialogOpen={
            isCreateNewCleaningTaskTemplateListDialogOpen
          }
        />
        <NetworkStatus />
      </dialog>

      {isDeleteCleaningTaskTemplateListOpen && (
        <Dialog
          closeText="Cancel"
          close={closeDeleteCleaningTaskTemplateListDialog}
          submit={deleteCleaningTaskTemplateList}
          submitParams={[idOfcleaningTaskTemplateListToDelete]}
        >
          <p>Are you sure you want to delete the cleaning task list?</p>
        </Dialog>
      )}

      {deleteCleaningTaskTemplateListError && (
        <Dialog
          closeText="Close"
          close={setDeleteCleaningTaskTemplateListError}
          closeParams={[undefined]}
        >
          <Error
            message={deleteCleaningTaskTemplateListError.message}
            statusCode={deleteCleaningTaskTemplateListError.statusCode}
          />
        </Dialog>
      )}

      <h1 className="mb-4 self-start text-3xl">Cleaning Task Template Lists</h1>

      <div className="flex w-11/12 justify-end mb-2">
        <button
          type="button"
          className="flex gap-1 rounded bg-blue-700 px-3 py-1 text-white hover:bg-blue-800"
          onClick={openCreateNewCleaningTaskTemplateListDialog}
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

      {fetchCleaningTaskTemplateListsError ? (
        <Error
          message={fetchCleaningTaskTemplateListsError.message}
          statusCode={fetchCleaningTaskTemplateListsError.statusCode}
        />
      ) : (
        <>
          {cleaningTaskTemplateLists.length === 0 && (
            <p className="w-max self-start rounded border border-white bg-slate-900 px-2 py-0.5">
              There are no cleaning task template lists stored in the system.
            </p>
          )}

          {cleaningTaskTemplateLists.length !== 0 && (
            <table className="w-11/12 min-w-max border-collapse text-left">
              <thead className="hidden border-b border-slate-400 md:table-header-group">
                <tr>
                  <th className="py-2 pr-4 font-semibold">ID</th>
                  <th className="py-2 pr-4 font-semibold">Title</th>
                  <th className="py-2 pr-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="text-gray-200">
                {cleaningTaskTemplateLists.map((list) => (
                  <CleaningTaskTemplateList
                    key={list.cleaningtasktemplatelistid}
                    details={list}
                    setCleaningTaskTemplateListId={setCleaningTaskTemplateListId}
                    openViewCleaningTaskTemplateListDialog={openViewCleaningTaskTemplateListDialog}
                    setIdOfCleaningTaskTemplateListToDelete={
                      setIdOfCleaningTaskTemplateListToDelete
                    }
                    openDeleteCleaningTaskTemplateListDialog={
                      openDeleteCleaningTaskTemplateListDialog
                    }
                  />
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default CleaningTaskTemplateLists;
