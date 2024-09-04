import { useEffect, useState } from "react";
import {
  CleaningTaskTemplate,
  CleaningTaskTemplateList as CleaningTaskTemplateList_TYPE,
  Error_,
} from "../../api/types";
import {
  getCleaningTaskTemplateList,
  getCleaningTaskTemplatesFromCleaningTaskTemplateList,
  removeCleaningTaskTemplateFromCleaningTaskTemplateList,
} from "../../api/api";
import { AxiosError } from "axios";
import Error from "./Error";
import CleaningTaskTemplates from "./CleaningTaskTemplates";
import Dialog from "./Dialog";
import AddCleaningTaskTemplate from "./AddCleaningTaskTemplate";

type CleaningTaskTemplateListDialogProps = {
  cleaningTaskTemplateListId: number | undefined;
  closeDialog: () => void;
  deleteCleaningTaskTemplateList: (
    cleaningTaskTemplateListId: number,
  ) => Promise<void>;
  deleteCleaningTaskTemplateListError: Error_ | undefined;
  setDeleteCleaningTaskTemplateListError: React.Dispatch<
    React.SetStateAction<Error_ | undefined>
  >;
};

const CleaningTaskTemplateListDialog: React.FC<
  CleaningTaskTemplateListDialogProps
> = ({
  cleaningTaskTemplateListId,
  closeDialog,
  deleteCleaningTaskTemplateList,
  deleteCleaningTaskTemplateListError,
  setDeleteCleaningTaskTemplateListError,
}) => {
  const [cleaningTaskTemplateList, setCleaningTaskTemplateList] =
    useState<CleaningTaskTemplateList_TYPE>();

  const [
    fetchCleaningTaskTemplateListError,
    setFetchCleaningTaskTemplateListError,
  ] = useState<Error_>();

  const [
    isDeleteCleaningTaskTemplateListOpen,
    setIsDeleteCleaningTaskTemplateListOpen,
  ] = useState(false);

  const [
    isAddCleaningTaskTemplateDialogOpen,
    setIsAddCleaningTaskTemplateDialogOpen,
  ] = useState(false);

  // Cleaning task templates linked to the cleaning task template list
  const [cleaningTaskTemplates, setCleaningTaskTemplates] = useState<
    Array<CleaningTaskTemplate>
  >([]);

  const [fetchCleaningTaskTemplatesError, setFetchCleaningTaskTemplatesError] =
    useState<Error_>();

  const [deleteCleaningTaskTemplateError, setDeleteCleaningTaskTemplateError] =
    useState<Error_>();

  const [
    isDeleteCleaningTaskTemplateDialogOpen,
    setIsDeleteCleaningTaskTemplateDialogOpen,
  ] = useState(false);

  const [cleaningTaskTemplateIdToDelete, setCleaningTaskTemplateIdToDelete] =
    useState<number>();

  // Fetch the cleaning task template list when the id changes.
  useEffect(() => {
    if (cleaningTaskTemplateListId) {
      fetchCleaningTaskTemplateList(cleaningTaskTemplateListId);
    }

    // Set the cleaning task template list as undefined when the component unmounts.
    return () => setCleaningTaskTemplateList(undefined);
  }, [cleaningTaskTemplateListId]);

  const fetchCleaningTaskTemplateList = async (
    _cleaningTaskTemplateListId: number,
  ) => {
    setCleaningTaskTemplateList(undefined);
    setFetchCleaningTaskTemplateListError(undefined);

    try {
      const _cleaningTaskTemplateList = await getCleaningTaskTemplateList(
        _cleaningTaskTemplateListId,
      );

      setCleaningTaskTemplateList(_cleaningTaskTemplateList);
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(
            error.response.data.statusCode,
            error.response.data.message,
          )
        : console.error(error);

      if (error instanceof AxiosError && error.message === "Network Error") {
        setFetchCleaningTaskTemplateListError({
          message:
            "Network Error. Please check that your device is connected to the internet.",
        });
      } else {
        setFetchCleaningTaskTemplateListError({
          message:
            "An error occurred while retrieving the cleaning task template list.",
          statusCode: (error as AxiosError).response?.status || undefined,
        });
      }
    }
  };

  const fetchCleaningTaskTemplates = async (
    cleaningTaskTemplateListId: number,
  ) => {
    setFetchCleaningTaskTemplatesError(undefined);
    setCleaningTaskTemplates([]);

    try {
      const _cleaningTaskTemplates: Array<CleaningTaskTemplate> =
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
        });
      } else {
        setFetchCleaningTaskTemplatesError({
          message: "An error occurred while retrieving the cleaning tasks.",
          statusCode: (error as AxiosError).response?.status || undefined,
        });
      }
    }
  };

  const deleteCleaningTaskTemplate = async (
    cleaningTaskTemplateListId: number,
    cleaningTaskTemplateId: number,
  ) => {
    setDeleteCleaningTaskTemplateError(undefined);

    try {
      await removeCleaningTaskTemplateFromCleaningTaskTemplateList(
        cleaningTaskTemplateListId,
        cleaningTaskTemplateId,
      );
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(
            error.response.data.statusCode,
            error.response.data.message,
          )
        : console.error(error);

      if (error instanceof AxiosError && error.message === "Network Error") {
        setDeleteCleaningTaskTemplateError({
          message:
            "Network Error. Please check your device is connected to the internet.",
        });
      } else {
        setDeleteCleaningTaskTemplateError({
          message: "An error occurred while deleting the cleaning task.",
          statusCode: (error as AxiosError).response?.status || undefined,
        });
      }
    } finally {
      await fetchCleaningTaskTemplates(cleaningTaskTemplateListId);
    }
  };

  const openDeleteCleaningTaskTemplateListDialog = () => {
    setIsDeleteCleaningTaskTemplateListOpen(true);
  };

  const closeDeleteCleaningTaskTemplateListDialog = () => {
    setIsDeleteCleaningTaskTemplateListOpen(false);
  };

  /*
  Closes the delete cleaning task template list dialog and the cleaning task list dialog
  when the cleaning task template list is deleted.
  */
  const handleDeleteCleaningTaskTemplateListDialogClose = () => {
    closeDeleteCleaningTaskTemplateListDialog();

    deleteCleaningTaskTemplateList(cleaningTaskTemplateListId!).then(() =>
      closeDialog(),
    );
  };

  const openAddCleaningTaskTemplateDialog = () => {
    setIsAddCleaningTaskTemplateDialogOpen(true);
  };

  const closeAddCleaningTaskTemplateDialog = () => {
    setIsAddCleaningTaskTemplateDialogOpen(false);
  };

  const openDeleteCleaningTaskTemplateDialog = (
    cleaningTaskTemplateId: number,
  ) => {
    setCleaningTaskTemplateIdToDelete(cleaningTaskTemplateId);
    setIsDeleteCleaningTaskTemplateDialogOpen(true);
  };

  const closeDeleteCleaningTaskTemplateDialog = () => {
    setIsDeleteCleaningTaskTemplateDialogOpen(false);
  };

  const closeDeleteCleaningTaskTemplateErrorDialog = () => {
    setDeleteCleaningTaskTemplateError(undefined);
  };

  return (
    <div className="flex flex-col gap-y-5 overflow-scroll bg-slate-800 p-4 text-white">
      {isDeleteCleaningTaskTemplateListOpen && (
        <Dialog
          closeText="Cancel"
          close={closeDeleteCleaningTaskTemplateListDialog}
          submit={handleDeleteCleaningTaskTemplateListDialogClose}
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

      <h2 className="block text-3xl">Cleaning Task Template List</h2>

      {fetchCleaningTaskTemplateListError ? (
        <Error
          message={fetchCleaningTaskTemplateListError.message}
          statusCode={fetchCleaningTaskTemplateListError.statusCode}
        />
      ) : (
        <>
          {!cleaningTaskTemplateList && (
            <p>Loading cleaning task template list...</p>
          )}

          {cleaningTaskTemplateList && (
            <table className="w-full max-w-full border-collapse text-left">
              <thead className="hidden border-b border-slate-400 sm:table-header-group">
                <tr>
                  <th className="py-2 font-semibold">ID</th>
                  <th className="py-2 font-semibold">Title</th>
                </tr>
              </thead>

              <tbody className="text-gray-200">
                <tr className="border-b border-slate-600">
                  <td className="block py-2 before:mr-5 before:font-bold before:content-['ID:'] sm:table-cell sm:before:mr-0 sm:before:content-none">
                    {cleaningTaskTemplateList.cleaningtasktemplatelistid}
                  </td>
                  <td className="block py-2 before:mr-5 before:font-bold before:content-['Title:'] sm:table-cell sm:before:mr-0 sm:before:content-none">
                    {cleaningTaskTemplateList.title}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </>
      )}

      <div className="flex flex-wrap justify-start gap-2">
        <button
          type="button"
          className="flex gap-1 rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
          onClick={openAddCleaningTaskTemplateDialog}
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

        {isAddCleaningTaskTemplateDialogOpen && (
          <Dialog>
            <AddCleaningTaskTemplate
              closeAddCleaningTaskTemplateDialog={
                closeAddCleaningTaskTemplateDialog
              }
              cleaningTaskTemplateListId={cleaningTaskTemplateListId}
              fetchCleaningTaskTemplates={fetchCleaningTaskTemplates}
            />
          </Dialog>
        )}

        <button
          type="button"
          className="flex gap-1 rounded bg-red-700 px-3 py-1 text-white hover:bg-red-800"
          onClick={openDeleteCleaningTaskTemplateListDialog}
        >
          Delete Cleaning Task Template List
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
      </div>

      <CleaningTaskTemplates
        cleaningTaskTemplateListId={cleaningTaskTemplateListId}
        fetchCleaningTaskTemplates={fetchCleaningTaskTemplates}
        cleaningTaskTemplates={cleaningTaskTemplates}
        setCleaningTaskTemplates={setCleaningTaskTemplates}
        fetchCleaningTaskTemplatesError={fetchCleaningTaskTemplatesError}
        openDeleteCleaningTaskTemplateDialog={
          openDeleteCleaningTaskTemplateDialog
        }
      />

      {isDeleteCleaningTaskTemplateDialogOpen && (
        <Dialog
          closeText="Cancel"
          close={closeDeleteCleaningTaskTemplateDialog}
          submit={deleteCleaningTaskTemplate}
          submitParams={[
            cleaningTaskTemplateListId,
            cleaningTaskTemplateIdToDelete,
          ]}
        >
          <p>Are you sure you want to delete the cleaning task?</p>
        </Dialog>
      )}

      {deleteCleaningTaskTemplateError && (
        <Dialog
          closeText="Close"
          close={closeDeleteCleaningTaskTemplateErrorDialog}
        >
          <Error
            message={deleteCleaningTaskTemplateError.message}
            statusCode={deleteCleaningTaskTemplateError.statusCode}
          />
        </Dialog>
      )}
    </div>
  );
};

export default CleaningTaskTemplateListDialog;
