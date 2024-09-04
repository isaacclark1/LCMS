import { ChangeEvent, useEffect, useState } from "react";
import { CleaningTaskTemplate, Error_ } from "../../api/types";
import {
  createCleaningTaskTemplateList as _createCleaningTaskTemplateList,
  getCleaningTaskTemplates,
} from "../../api/api";
import { AxiosError } from "axios";
import Dialog from "./Dialog";
import Error from "./Error";
import SelectCleaningTaskTemplates from "./SelectCleaningTaskTemplates";
import CreateCleaningTaskTemplate from "./CreateCleaningTaskTemplate";

type CreateNewCleaningTaskTemplateListDialogProps = {
  closeDialog: () => void;
  fetchCleaningTaskTemplateLists: () => Promise<void>;
  isCreateNewCleaningTaskTemplateListDialogOpen: boolean;
};

const CreateNewCleaningTaskTemplateListDialog: React.FC<
  CreateNewCleaningTaskTemplateListDialogProps
> = ({
  closeDialog,
  fetchCleaningTaskTemplateLists,
  isCreateNewCleaningTaskTemplateListDialogOpen,
}) => {
  const [cleaningTaskTemplates, setCleaningTaskTemplates] = useState<
    Array<CleaningTaskTemplate>
  >([]);

  const [fetchCleaningTaskTemplatesError, setFetchCleaningTaskTemplatesError] =
    useState<Error_>();

  const [
    createCleaningTaskTemplateListError,
    setCreateCleaningTaskTemplateListError,
  ] = useState<Error_>();

  const [title, setTitle] = useState("");

  const [titleLength, setTitleLength] = useState(0);

  const [isMaxTitleLength, setIsMaxTitleLength] = useState(false);

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

  // The selected cleaning task templates.
  const [selectedCleaningTaskTemplates, setSelectedCleaningTaskTemplates] =
    useState(new Set<number>());

  // Is the create a new cleaning task component displayed.
  const [
    isCreateCleaningTaskTemplateDisplayed,
    setIsCreateCleaningTaskTemplateDisplayed,
  ] = useState(false);

  // Reset title when the dialog is opened.
  useEffect(() => {
    if (isCreateNewCleaningTaskTemplateListDialogOpen) {
      setTitle("");
      setIsCreateCleaningTaskTemplateDisplayed(false);
    }
  }, [isCreateNewCleaningTaskTemplateListDialogOpen]);

  // Set title length when the title changes
  useEffect(() => {
    title ? setTitleLength(title.length) : setTitleLength(0);
  }, [title]);

  // Check if the title has reached the maximum length when title length changes
  useEffect(() => {
    titleLength === 50 ? setIsMaxTitleLength(true) : setIsMaxTitleLength(false);
  }, [titleLength]);

  // Enable button if a title is provided
  useEffect(() => {
    titleLength > 0
      ? setIsSubmitButtonDisabled(false)
      : setIsSubmitButtonDisabled(true);
  }, [titleLength]);

  const createCleaningTaskTemplateList = async (
    title: string,
    cleaningTaskTemplates: Array<number>,
  ) => {
    try {
      await _createCleaningTaskTemplateList(title, cleaningTaskTemplates);

      await fetchCleaningTaskTemplateLists();

      closeDialog();
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(
            error.response.data.statusCode,
            error.response.data.message,
          )
        : console.error(error);

      if (error instanceof AxiosError && error.message === "Network Error") {
        setCreateCleaningTaskTemplateListError({
          message:
            "Network Error. Please check your device is connected to the internet.",
        });
      } else {
        setCreateCleaningTaskTemplateListError({
          message: "An unexpected error occurred. Please try again.",
          statusCode: (error as AxiosError).response?.status || undefined,
        });
      }
    }
  };

  const fetchCleaningTaskTemplates = async (): Promise<void> => {
    setFetchCleaningTaskTemplatesError(undefined);

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
        setFetchCleaningTaskTemplatesError({
          message:
            "Network Error. Please check that your device is connected to the internet.",
        });
      } else {
        setFetchCleaningTaskTemplatesError({
          message: "An error occurred while getting the cleaning task lists.",
          statusCode: (error as AxiosError).response?.status || undefined,
        });
      }
    }
  };

  // Adds a cleaning task template to the list of selected cleaning task templates.
  const addSelectedCleaningTaskTemplate = (cleaningTaskTemplateId: number) => {
    setSelectedCleaningTaskTemplates((prevValue) => {
      const newSet = new Set(prevValue);
      newSet.add(cleaningTaskTemplateId);
      return newSet;
    });
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const displayCreateCleaningTaskTemplateComponent = () => {
    setIsCreateCleaningTaskTemplateDisplayed(true);
  };

  const hideCreateCleaningTaskTemplateComponent = () => {
    setIsCreateCleaningTaskTemplateDisplayed(false);
  };

  return (
    <div className="flex flex-col gap-y-5 p-4 text-white">
      <button
        type="button"
        onClick={closeDialog}
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

      {createCleaningTaskTemplateListError && (
        <Dialog
          closeText="Close"
          close={setCreateCleaningTaskTemplateListError}
          closeParams={[undefined]}
        >
          <Error
            message={createCleaningTaskTemplateListError.message}
            statusCode={createCleaningTaskTemplateListError.statusCode}
          />
        </Dialog>
      )}

      <h2 className="block text-3xl">Create New Cleaning Task Template List</h2>

      <form className="flex flex-col gap-y-2">
        <label htmlFor="title">Title:</label>

        <input
          type="text"
          name="title"
          id="title"
          value={title}
          className="relative rounded border border-blue-800 bg-slate-700 px-2 py-1 hover:shadow hover:shadow-blue-800"
          maxLength={50}
          onChange={(event) => handleTitleChange(event)}
        />

        <p
          className={
            isMaxTitleLength
              ? "self-end text-red-500"
              : "self-end text-gray-200"
          }
        >
          {titleLength} / 50
        </p>

        {titleLength === 0 ? (
          <p className="text-red-500">A title must be provided</p>
        ) : (
          <br />
        )}
      </form>

      <div className="flex flex-col rounded border border-slate-400">
        <SelectCleaningTaskTemplates
          isCreateNewCleaningTaskTemplateListDialogOpen={
            isCreateNewCleaningTaskTemplateListDialogOpen
          }
          selectedCleaningTaskTemplates={selectedCleaningTaskTemplates}
          setSelectedCleaningTaskTemplates={setSelectedCleaningTaskTemplates}
          displayCreateCleaningTaskTemplateComponent={
            displayCreateCleaningTaskTemplateComponent
          }
          fetchCleaningTaskTemplates={fetchCleaningTaskTemplates}
          fetchCleaningTaskTemplatesError={fetchCleaningTaskTemplatesError}
          cleaningTaskTemplates={cleaningTaskTemplates}
          setCleaningTaskTemplates={setCleaningTaskTemplates}
          addSelectedCleaningTaskTemplate={addSelectedCleaningTaskTemplate}
        />
      </div>

      {isCreateCleaningTaskTemplateDisplayed && (
        <Dialog>
          <div className="flex h-full w-full flex-col gap-y-5 overflow-y-scroll rounded bg-slate-800 p-4">
            <h2 className="mb-2 text-3xl">Create New Cleaning Task</h2>
            <CreateCleaningTaskTemplate
              handleClose={hideCreateCleaningTaskTemplateComponent}
              fetchCleaningTaskTemplates={fetchCleaningTaskTemplates}
              addSelectedCleaningTaskTemplate={addSelectedCleaningTaskTemplate}
              addToTemplateList={false}
            />
          </div>
        </Dialog>
      )}

      <div className="mt-2 flex justify-end gap-1">
        <button
          type="button"
          className="flex gap-1 rounded bg-red-700 px-3 py-1 hover:bg-red-800"
          onClick={closeDialog}
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
          onClick={() =>
            createCleaningTaskTemplateList(title!, [
              ...selectedCleaningTaskTemplates,
            ])
          }
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

export default CreateNewCleaningTaskTemplateListDialog;
