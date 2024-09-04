import { useEffect, useState } from "react";
import { addCleaningTaskToCleaningTaskList, getCleaningTaskTemplates } from "../../api/api";
import { AxiosError } from "axios";
import { CleaningTaskTemplate as CleaningTaskTemplate_TYPE, Error_ } from "../../api/types";
import "../styles/styles.css";
import CancelSubmitButtons from "./CancelSubmitButtons";
import SelectCleaningTaskTemplate from "./SelectCleaningTaskTemplate";
import Error from "./Error";
import SelectArea from "./SelectArea";
import Dialog from "./Dialog";
import "../styles/styles.css";

type AddCleaningTaskProps = {
  cleaningTaskListDetails: {
    cleaningTaskListId: number | undefined;
    cleaningTaskListDate: string | undefined;
    cleaningTaskListStaffMemberId: number | undefined | null;
    cleaningTaskListManagerSignature: string | undefined | null;
    cleaningTaskListStaffMemberSignature: string | undefined | null;
  };
  refreshCleaningTasks: (
    _cleaningTaskListId: number,
    _cleaningTaskListDate: string,
    _cleaningTaskListStaffMemberId: number | null,
    _cleaningTaskListManagerSignature: string | null,
    _cleaningTaskListStaffMemberSignature: string | null
  ) => Promise<void>;
  setIsAddCleaningTaskDisplayed: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddCleaningTask: React.FC<AddCleaningTaskProps> = ({
  cleaningTaskListDetails,
  refreshCleaningTasks,
  setIsAddCleaningTaskDisplayed,
}) => {
  const [cleaningTaskTemplates, setCleaningTaskTemplates] = useState<
    Array<CleaningTaskTemplate_TYPE>
  >([]);

  const [isSelectCleaningTaskTemplate, setIsSelectCleaningTaskTemplate] = useState(false);

  const [addCleaningTaskError, setAddCleaningTaskError] = useState<Error_>();

  const [isFetchCleaningTaskTemplatesError, setIsFetchCleaningTaskTemplatesError] = useState(false);

  const [fetchCleaningTaskTemplateErrorDetails, setCleaningTaskTemplateErrorDetails] = useState<{
    message: string;
    statusCode: number | undefined;
  }>();

  const [selectedCleaningTaskTemplateId, setSelectedCleaningTaskTemplateId] = useState<number>();

  const [isCreateNewCleaningTaskSelected, setIsCreateNewCleaningTaskSelected] = useState(false);

  const [isChooseAreaSelected, setIsChooseAreaSelected] = useState(false);

  const [cleaningTaskDescriptionLength, setCleaningTaskDescriptionLength] = useState(0);

  const [selectedAreaId, setSelectedAreaId] = useState<number>();

  const [cleaningTaskDescription, setCleaningTaskDescription] = useState<string>();

  const [areaDescription, setAreaDescription] = useState<string>();

  const [isMaxCleaningTaskDescriptionLength, setIsMaxCleaningTaskDescriptionLength] =
    useState(false);

  const [doesAreaExist, setDoesAreaExist] = useState(false);

  useEffect(() => {
    if (isSelectCleaningTaskTemplate) setIsCreateNewCleaningTaskSelected(false);
  }, [isSelectCleaningTaskTemplate]);

  useEffect(() => {
    if (isCreateNewCleaningTaskSelected) setIsSelectCleaningTaskTemplate(false);
  }, [isCreateNewCleaningTaskSelected]);

  useEffect(
    () => setCleaningTaskDescriptionLength(0),
    [isSelectCleaningTaskTemplate, isCreateNewCleaningTaskSelected]
  );

  useEffect(() => {
    if (cleaningTaskDescriptionLength === 200) setIsMaxCleaningTaskDescriptionLength(true);
    else setIsMaxCleaningTaskDescriptionLength(false);
  }, [cleaningTaskDescriptionLength]);

  const buttonStyle = "rounded bg-blue-700 px-3 py-1 hover:bg-blue-800";

  const addCleaningTask = async (
    cleaningTaskListId: number,
    cleaningTaskTemplateId?: number,
    cleaningTaskDescription?: string,
    areaDescription?: string,
    areaId?: number
  ): Promise<boolean> => {
    setAddCleaningTaskError(undefined);
    try {
      await addCleaningTaskToCleaningTaskList(
        cleaningTaskListId,
        cleaningTaskTemplateId,
        cleaningTaskDescription,
        areaDescription,
        areaId
      );

      if (
        cleaningTaskListDetails.cleaningTaskListId &&
        cleaningTaskListDetails.cleaningTaskListDate
      ) {
        await refreshCleaningTasks(
          cleaningTaskListDetails.cleaningTaskListId,
          cleaningTaskListDetails.cleaningTaskListDate,
          cleaningTaskListDetails.cleaningTaskListStaffMemberId || null,
          cleaningTaskListDetails.cleaningTaskListManagerSignature || null,
          cleaningTaskListDetails.cleaningTaskListStaffMemberSignature || null
        );
      }

      return true;
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(error.response.data.statusCode, error.response.data.message)
        : console.error(error);

      if (error instanceof AxiosError && error.message === "Network Error") {
        setAddCleaningTaskError({
          message: "Network Error. Please check that your device is connected to the internet.",
        });
      } else {
        setAddCleaningTaskError({
          message: "An error occurred while adding the cleaning task to the cleaning task list.",
          statusCode: (error as AxiosError).response?.status || undefined,
        });
      }

      return false;
    }
  };

  const fetchCleaningTaskTemplates = async (): Promise<void> => {
    setIsFetchCleaningTaskTemplatesError(false);

    try {
      const cleaningTskTemplates: Array<CleaningTaskTemplate_TYPE> =
        await getCleaningTaskTemplates();

      setCleaningTaskTemplates(cleaningTskTemplates);
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(error.response.data.statusCode, error.response.data.message)
        : console.error(error);

      if (error instanceof AxiosError && error.response?.data.statusCode === 404) {
        setIsFetchCleaningTaskTemplatesError(true);
        setCleaningTaskTemplateErrorDetails({
          message: "There are no cleaning task templates stored in the system.",
          statusCode: 404,
        });
      } else if (error instanceof AxiosError && error.message === "Network Error") {
        setIsFetchCleaningTaskTemplatesError(true);
        setCleaningTaskTemplateErrorDetails({
          message: "Network Error. Please check that your device is connected to the internet.",
          statusCode: undefined,
        });
      } else {
        setCleaningTaskTemplateErrorDetails({
          message: "An error occurred while getting the cleaning task lists.",
          statusCode: (error as AxiosError).response?.status,
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-y-5 bg-slate-800 p-4 overflow-auto ios-scroll">
      <button
        type="button"
        onClick={() => setIsAddCleaningTaskDisplayed(false)}
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

      <h2 className="text-3xl">Add Cleaning Task</h2>
      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          className={buttonStyle}
          onClick={async () => {
            setIsSelectCleaningTaskTemplate(true);
            setSelectedAreaId(undefined);
            setCleaningTaskDescription(undefined);
            setAreaDescription(undefined);
            await fetchCleaningTaskTemplates();
          }}
        >
          Create task from template
        </button>
        <button
          type="button"
          className={buttonStyle}
          onClick={() => {
            setIsCreateNewCleaningTaskSelected(true);
            setSelectedCleaningTaskTemplateId(undefined);
          }}
        >
          Create new task
        </button>
      </div>

      {addCleaningTaskError && (
        <Dialog closeText="Close" close={setAddCleaningTaskError} closeParams={[undefined]}>
          <Error
            message={addCleaningTaskError.message}
            statusCode={addCleaningTaskError.statusCode}
          />
        </Dialog>
      )}

      {isSelectCleaningTaskTemplate && !isFetchCleaningTaskTemplatesError && (
        <div className="flex flex-col gap-y-2">
          <h3 className="text-2xl">Select a Cleaning Task Template</h3>
          <SelectCleaningTaskTemplate
            cleaningTaskTemplates={cleaningTaskTemplates}
            setSelectedCleaningTaskTemplateId={setSelectedCleaningTaskTemplateId}
            selectedCleaningTaskTemplateId={selectedCleaningTaskTemplateId}
          />
        </div>
      )}

      {isSelectCleaningTaskTemplate && isFetchCleaningTaskTemplatesError && (
        <div>
          <Error
            message={fetchCleaningTaskTemplateErrorDetails?.message || ""}
            statusCode={fetchCleaningTaskTemplateErrorDetails?.statusCode}
          />
        </div>
      )}

      {isCreateNewCleaningTaskSelected && (
        <div className="flex flex-col gap-y-2">
          <h3 className="text-2xl">Add New Cleaning Task</h3>

          <form className="flex flex-col gap-y-2">
            <label htmlFor="cleaningTaskDescription" className="w-max">
              Cleaning Task Description:
            </label>
            <textarea
              name="cleaningTaskDescription"
              id="cleaningTaskDescription"
              className="relative rounded border border-blue-800 bg-slate-700 px-2 py-1 hover:shadow hover:shadow-blue-800"
              rows={2}
              maxLength={200}
              onChange={(e) => {
                setCleaningTaskDescriptionLength(e.target.value.length);
                setCleaningTaskDescription(e.target.value);
              }}
            />

            <p
              className={
                isMaxCleaningTaskDescriptionLength
                  ? "self-end text-red-500"
                  : "self-end text-gray-200"
              }
            >
              {cleaningTaskDescriptionLength} / 200
            </p>

            {cleaningTaskDescriptionLength === 0 ? (
              <p className="text-red-500">A cleaning task description must be provided</p>
            ) : (
              <br />
            )}

            {!isChooseAreaSelected && (
              <button
                type="button"
                className="w-max rounded bg-blue-700 px-3 py-1 hover:bg-blue-800"
                onClick={() => setIsChooseAreaSelected(true)}
              >
                Choose Area
              </button>
            )}

            {isChooseAreaSelected && (
              <SelectArea
                selectedAreaId={selectedAreaId}
                setSelectedAreaId={setSelectedAreaId}
                setAreaDescription={setAreaDescription}
                areaDescription={areaDescription}
                doesAreaExist={doesAreaExist}
                setDoesAreaExist={setDoesAreaExist}
              />
            )}
          </form>
        </div>
      )}

      <CancelSubmitButtons
        setIsDisplayed={setIsAddCleaningTaskDisplayed}
        addCleaningTask={addCleaningTask}
        selectedCleaningTaskTemplateId={selectedCleaningTaskTemplateId}
        cleaningTaskListId={cleaningTaskListDetails.cleaningTaskListId}
        cleaningTaskDescription={cleaningTaskDescription}
        areaDescription={areaDescription}
        areaId={selectedAreaId}
        doesAreaExist={doesAreaExist}
      />
    </div>
  );
};

export default AddCleaningTask;
