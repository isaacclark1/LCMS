import { useEffect, useState } from "react";
import CreateCleaningTaskTemplate from "./CreateCleaningTaskTemplate";
import { CleaningTaskTemplate, Error_ } from "../../api/types";
import { AxiosError } from "axios";
import {
  addCleaningTaskTemplateToCleaningTaskTemplateList,
  getCleaningTaskTemplates,
} from "../../api/api";
import Dialog from "./Dialog";
import Error from "./Error";
import SelectCleaningTaskTemplate from "./SelectCleaningTaskTemplate";

type AddCleaningTaskTemplateProps = {
  closeAddCleaningTaskTemplateDialog: () => void;
  cleaningTaskTemplateListId: number | undefined;
  fetchCleaningTaskTemplates: (
    cleaningTaskTemplateListId: number,
  ) => Promise<void>;
};

const AddCleaningTaskTemplate: React.FC<AddCleaningTaskTemplateProps> = ({
  closeAddCleaningTaskTemplateDialog,
  cleaningTaskTemplateListId,
  fetchCleaningTaskTemplates,
}) => {
  const [createCleaningTaskTemplateOpen, setCreateCleaningTaskTemplateOpen] =
    useState(false);
  const [addCleaningTaskTemplateOpen, setAddCleaningTaskTemplateOpen] =
    useState(false);

  const [addCleaningTaskTemplateError, setAddCleaningTaskTemplateError] =
    useState<Error_>();

  const [cleaningTaskTemplates, setCleaningTaskTemplates] = useState<
    Array<CleaningTaskTemplate>
  >([]);

  const [
    fetchAllCleaningTaskTemplatesError,
    setFetchAllCleaningTaskTemplatesError,
  ] = useState<Error_>();

  const [selectedCleaningTaskTemplateId, setSelectedCleaningTaskTemplateId] =
    useState<number>();

  const [
    isAddCleaningTaskTemplateSubmitButtonDisabled,
    setIsAddCleaningTaskTemplateSubmitButtonDisabled,
  ] = useState(true);

  useEffect(() => {
    selectedCleaningTaskTemplateId
      ? setIsAddCleaningTaskTemplateSubmitButtonDisabled(false)
      : setIsAddCleaningTaskTemplateSubmitButtonDisabled(true);
  }, [selectedCleaningTaskTemplateId]);

  useEffect(() => {
    !addCleaningTaskTemplateOpen &&
      setSelectedCleaningTaskTemplateId(undefined);
  }, [addCleaningTaskTemplateOpen]);

  const buttonStyle = "rounded bg-blue-700 px-3 py-1 hover:bg-blue-800";

  const addCleaningTaskTemplate = async (
    _cleaningTaskTemplateListId: number,
    _cleaningTaskTemplateId?: number,
    _cleaningTaskTemplateDescription?: string,
    _areaId?: number,
    _areaDescription?: string,
  ) => {
    setAddCleaningTaskTemplateError(undefined);

    try {
      await addCleaningTaskTemplateToCleaningTaskTemplateList(
        _cleaningTaskTemplateListId,
        _cleaningTaskTemplateId,
        _cleaningTaskTemplateDescription,
        _areaId,
        _areaDescription,
      );

      closeAddCleaningTaskTemplateDialog();
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(
            error.response.data.statusCode,
            error.response.data.message,
          )
        : console.error(error);

      if (error instanceof AxiosError && error.message === "Network Error") {
        setAddCleaningTaskTemplateError({
          message:
            "Network Error. Please check that your device is connected to the internet.",
        });
      } else {
        setAddCleaningTaskTemplateError({
          message:
            "An error occurred while creating the cleaning task template.",
          statusCode: (error as AxiosError).response?.status,
        });
      }
    } finally {
      cleaningTaskTemplateListId &&
        (await fetchCleaningTaskTemplates(cleaningTaskTemplateListId));
    }
  };

  const fetchAllCleaningTaskTemplates = async (): Promise<void> => {
    setFetchAllCleaningTaskTemplatesError(undefined);
    setCleaningTaskTemplates([]);

    try {
      const _cleaningTaskTemplates: Array<CleaningTaskTemplate> =
        await getCleaningTaskTemplates();

      // Group cleaning task templates by area.
      _cleaningTaskTemplates.sort((a, b) =>
        a.areadescription.localeCompare(b.areadescription),
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
        setFetchAllCleaningTaskTemplatesError({
          message:
            "Network Error. Please check that your device is connected to the internet.",
        });
      } else {
        setFetchAllCleaningTaskTemplatesError({
          message: "An error occurred while getting the cleaning task lists.",
          statusCode: (error as AxiosError).response?.status || undefined,
        });
      }
    }
  };

  const handleCreateCleaningTaskTemplateButtonClick = () => {
    setCreateCleaningTaskTemplateOpen(true);
    setAddCleaningTaskTemplateOpen(false);
  };

  const handleAddCleaningTaskTemplateButtonClick = async () => {
    setAddCleaningTaskTemplateOpen(true);
    setCreateCleaningTaskTemplateOpen(false);

    await fetchAllCleaningTaskTemplates();
  };

  const closeAddCleaningTaskTemplateErrorDialog = () => {
    setAddCleaningTaskTemplateError(undefined);
  };

  const handleSubmitCleaningTaskTemplate = async () => {
    if (cleaningTaskTemplateListId && selectedCleaningTaskTemplateId) {
      await addCleaningTaskTemplate(
        cleaningTaskTemplateListId,
        selectedCleaningTaskTemplateId,
      );
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-y-5 bg-slate-800 p-4">
      {addCleaningTaskTemplateError && (
        <Dialog
          closeText="Close"
          close={closeAddCleaningTaskTemplateErrorDialog}
        >
          <Error
            message={addCleaningTaskTemplateError.message}
            statusCode={addCleaningTaskTemplateError.statusCode}
          />
        </Dialog>
      )}

      <button
        type="button"
        onClick={closeAddCleaningTaskTemplateDialog}
        className="absolute right-0 top-0 rounded-bl border-b border-l border-white bg-black hover:bg-slate-800"
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

      <h2 className="text-3xl">Add Cleaning Task</h2>

      <div className="flex gap-2">
        {!addCleaningTaskTemplateOpen && (
          <button
            type="button"
            className={buttonStyle}
            onClick={handleAddCleaningTaskTemplateButtonClick}
          >
            Add existing task
          </button>
        )}

        {!createCleaningTaskTemplateOpen && (
          <button
            type="button"
            className={buttonStyle}
            onClick={handleCreateCleaningTaskTemplateButtonClick}
          >
            Create new task
          </button>
        )}
      </div>

      {createCleaningTaskTemplateOpen && (
        <CreateCleaningTaskTemplate
          handleClose={closeAddCleaningTaskTemplateDialog}
          addToTemplateList={true}
          cleaningTaskTemplateListId={cleaningTaskTemplateListId}
          addCleaningTaskTemplate={addCleaningTaskTemplate}
        />
      )}

      {addCleaningTaskTemplateOpen && fetchAllCleaningTaskTemplatesError && (
        <Error
          message={fetchAllCleaningTaskTemplatesError.message}
          statusCode={fetchAllCleaningTaskTemplatesError.statusCode}
        />
      )}

      {addCleaningTaskTemplateOpen && !fetchAllCleaningTaskTemplatesError && (
        <>
          <div className="flex flex-col gap-y-2">
            <h3 className="text-2xl">Choose a cleaning task:</h3>

            <SelectCleaningTaskTemplate
              cleaningTaskTemplates={cleaningTaskTemplates}
              setSelectedCleaningTaskTemplateId={
                setSelectedCleaningTaskTemplateId
              }
              selectedCleaningTaskTemplateId={selectedCleaningTaskTemplateId}
            />
          </div>
          <div className="flex justify-end gap-1">
            <button
              type="button"
              className="flex gap-1 rounded bg-red-700 px-3 py-1 hover:bg-red-800"
              onClick={closeAddCleaningTaskTemplateDialog}
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
                isAddCleaningTaskTemplateSubmitButtonDisabled
                  ? "flex gap-1 rounded bg-green-700 px-3 py-1 opacity-75 hover:cursor-not-allowed"
                  : "flex gap-1 rounded bg-green-700 px-3 py-1 hover:bg-green-800"
              }
              disabled={isAddCleaningTaskTemplateSubmitButtonDisabled}
              onClick={handleSubmitCleaningTaskTemplate}
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

export default AddCleaningTaskTemplate;
