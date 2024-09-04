import { useEffect, useState } from "react";

type CancelSubmitButtonsProps = {
  setIsDisplayed: React.Dispatch<React.SetStateAction<boolean>>;
  addCleaningTask: (
    cleaningTaskListId: number,
    cleaningTaskTemplateId?: number,
    cleaningTaskDescription?: string,
    areaDescription?: string,
    areaId?: number
  ) => Promise<boolean>;
  selectedCleaningTaskTemplateId: number | undefined;
  cleaningTaskListId: number | undefined;
  cleaningTaskDescription: string | undefined;
  areaDescription: string | undefined;
  areaId: number | undefined;
  doesAreaExist: boolean;
};

const CancelSubmitButtons: React.FC<CancelSubmitButtonsProps> = ({
  setIsDisplayed,
  addCleaningTask,
  selectedCleaningTaskTemplateId,
  cleaningTaskListId,
  cleaningTaskDescription,
  areaDescription,
  areaId,
  doesAreaExist,
}) => {
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

  useEffect(() => {
    if (doesAreaExist) {
      setIsSubmitButtonDisabled(true);
      return;
    }

    if (
      (cleaningTaskListId && selectedCleaningTaskTemplateId) ||
      (cleaningTaskListId && cleaningTaskDescription && areaId) ||
      (cleaningTaskListId && cleaningTaskDescription && areaDescription)
    ) {
      setIsSubmitButtonDisabled(false);
    } else {
      setIsSubmitButtonDisabled(true);
    }
  }, [
    cleaningTaskListId,
    selectedCleaningTaskTemplateId,
    cleaningTaskDescription,
    areaDescription,
    areaId,
    doesAreaExist,
  ]);

  return (
    <div className="mt-2 flex justify-end gap-1">
      <button
        type="button"
        onClick={() => setIsDisplayed(false)}
        className="flex gap-1 rounded bg-red-700 px-3 py-1 hover:bg-red-800"
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
        onClick={() => {
          addCleaningTask(
            cleaningTaskListId as any,
            selectedCleaningTaskTemplateId,
            cleaningTaskDescription,
            areaDescription,
            areaId
          ).then((wasSuccessful) => {
            if (wasSuccessful) setIsDisplayed(false);
          });
        }}
        disabled={isSubmitButtonDisabled}
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
  );
};

export default CancelSubmitButtons;
