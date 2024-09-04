import { ChangeEvent, useEffect, useState } from "react";
import SelectArea from "./SelectArea";
import { createCleaningTaskTemplate as _createCleaningTaskTemplate } from "../../api/api";
import { Error_ } from "../../api/types";
import { AxiosError } from "axios";
import Dialog from "./Dialog";
import Error from "./Error";

type CreateCleaningTaskTemplateProps = {
  handleClose: () => void;
  fetchCleaningTaskTemplates?: () => Promise<void>;
  addSelectedCleaningTaskTemplate?: (cleaningTaskTemplateId: number) => void;
  addToTemplateList: boolean;
  cleaningTaskTemplateListId?: number;
  addCleaningTaskTemplate?: (
    _cleaningTaskTemplateListId: number,
    _cleaningTaskTemplateId?: number,
    _cleaningTaskTemplateDescription?: string,
    _areaId?: number,
    _areaDescription?: string,
  ) => Promise<void>;
};

const CreateCleaningTaskTemplate: React.FC<CreateCleaningTaskTemplateProps> = ({
  handleClose,
  fetchCleaningTaskTemplates,
  addSelectedCleaningTaskTemplate,
  addToTemplateList,
  cleaningTaskTemplateListId,
  addCleaningTaskTemplate,
}) => {
  const [cleaningTaskTemplateDescription, setCleaningTaskTemplateDescription] =
    useState("");
  const [
    cleaningTaskTemplateDescriptionLength,
    setCleaningTaskTemplateDescriptionLength,
  ] = useState(0);
  const [
    isMaxCleaningTaskTemplateDescriptionLength,
    setIsMaxCleaningTaskTemplateDescriptionLength,
  ] = useState(false);

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

  const [selectedAreaId, setSelectedAreaId] = useState<number>();

  const [areaDescription, setAreaDescription] = useState<string>();

  const [doesAreaExist, setDoesAreaExist] = useState(false);

  const [createCleaningTaskTemplateError, setCreateCleaningTaskTemplateError] =
    useState<Error_>();

  // Reset cleaning task description when component mounts
  useEffect(() => {
    setCleaningTaskTemplateDescription("");
  }, []);

  // Set title length when the cleaning task template description changes
  useEffect(() => {
    cleaningTaskTemplateDescription
      ? setCleaningTaskTemplateDescriptionLength(
          cleaningTaskTemplateDescription.length,
        )
      : setCleaningTaskTemplateDescriptionLength(0);
  }, [cleaningTaskTemplateDescription]);

  // Check if the cleaning task template description has reached the maximum length when the cleaning task
  // template description changes.
  useEffect(() => {
    cleaningTaskTemplateDescriptionLength === 200
      ? setIsMaxCleaningTaskTemplateDescriptionLength(true)
      : setIsMaxCleaningTaskTemplateDescriptionLength(false);
  }, [cleaningTaskTemplateDescriptionLength]);

  // Control whether the submit button is disabled.
  useEffect(() => {
    if (
      (cleaningTaskTemplateDescription && selectedAreaId) ||
      (cleaningTaskTemplateDescription && areaDescription && !doesAreaExist)
    ) {
      setIsSubmitButtonDisabled(false);
    } else {
      setIsSubmitButtonDisabled(true);
    }
  }, [
    cleaningTaskTemplateDescription,
    selectedAreaId,
    areaDescription,
    doesAreaExist,
  ]);

  const createCleaningTaskTemplate = async (
    _cleaningTaskTemplateDescription: string,
    _areaId?: number,
    _areaDescription?: string,
  ) => {
    let cleaningTaskTemplateId: number | null = null;

    try {
      cleaningTaskTemplateId = await _createCleaningTaskTemplate(
        _cleaningTaskTemplateDescription,
        _areaId,
        _areaDescription,
      );

      handleClose();
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(
            error.response.data.statusCode,
            error.response.data.message,
          )
        : console.error(error);

      if (error instanceof AxiosError && error.message === "Network Error") {
        setCreateCleaningTaskTemplateError({
          message:
            "Network Error. Please check your device is connected to the internet.",
        });
      } else {
        setCreateCleaningTaskTemplateError({
          message:
            "An unexpected error occurred while creating the new cleaning task. Please try again.",
          statusCode: (error as AxiosError).response?.status || undefined,
        });
      }
    } finally {
      if (!addToTemplateList) {
        fetchCleaningTaskTemplates && (await fetchCleaningTaskTemplates());
        cleaningTaskTemplateId &&
          addSelectedCleaningTaskTemplate &&
          addSelectedCleaningTaskTemplate(cleaningTaskTemplateId);
      }
    }
  };

  const handleCleaningTaskDescriptionChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setCleaningTaskTemplateDescription(event.target.value);
  };

  const handleSubmit = async () => {
    !addToTemplateList &&
      (await createCleaningTaskTemplate(
        cleaningTaskTemplateDescription,
        selectedAreaId,
        areaDescription,
      ));

    if (
      addToTemplateList &&
      addCleaningTaskTemplate &&
      cleaningTaskTemplateListId
    ) {
      addCleaningTaskTemplate(
        cleaningTaskTemplateListId,
        undefined,
        cleaningTaskTemplateDescription,
        selectedAreaId,
        areaDescription,
      );
    }
  };

  const closeCreateCleaningTaskTemplateErrorDialog = () => {
    setCreateCleaningTaskTemplateError(undefined);
  };

  return (
    <>
      {!addToTemplateList && (
        <button
          type="button"
          onClick={handleClose}
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
      )}

      {createCleaningTaskTemplateError && (
        <Dialog
          close={closeCreateCleaningTaskTemplateErrorDialog}
          closeText="Close"
        >
          <Error
            message={createCleaningTaskTemplateError.message}
            statusCode={createCleaningTaskTemplateError.statusCode}
          />
        </Dialog>
      )}

      <form className="flex flex-col gap-y-2">
        <label htmlFor="template-description">Cleaning Task Description:</label>

        <textarea
          name="template-description"
          id="template-description"
          rows={2}
          className="relative rounded border border-blue-800 bg-slate-700 px-2 py-1 hover:shadow hover:shadow-blue-800"
          value={cleaningTaskTemplateDescription}
          onChange={(event) => handleCleaningTaskDescriptionChange(event)}
          maxLength={200}
        />

        <p
          className={
            isMaxCleaningTaskTemplateDescriptionLength
              ? "self-end text-red-500"
              : "self-end text-gray-200"
          }
        >
          {cleaningTaskTemplateDescriptionLength} / 200
        </p>

        {cleaningTaskTemplateDescriptionLength === 0 ? (
          <p className="text-red-500">
            A cleaning task description must be provided
          </p>
        ) : (
          <br />
        )}

        <div className="flex flex-col">
          <SelectArea
            selectedAreaId={selectedAreaId}
            setSelectedAreaId={setSelectedAreaId}
            setAreaDescription={setAreaDescription}
            areaDescription={areaDescription}
            doesAreaExist={doesAreaExist}
            setDoesAreaExist={setDoesAreaExist}
          />
        </div>
      </form>

      <div className="flex justify-end gap-1">
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
    </>
  );
};

export default CreateCleaningTaskTemplate;
