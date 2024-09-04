import { ChangeEvent, useEffect, useState } from "react";
import { Area, Error_ } from "../../api/types";
import { createArea as _createArea } from "../../api/api";
import { AxiosError } from "axios";
import Dialog from "./Dialog";
import Error from "./Error";

type CreateAreaProps = {
  close: () => void;
  areas: Array<Area>;
  isCreateAreaDialogOpen: boolean;
  fetchAreas: () => Promise<void>;
};

const CreateArea: React.FC<CreateAreaProps> = ({
  close,
  areas,
  isCreateAreaDialogOpen,
  fetchAreas,
}) => {
  const [areaDescription, setAreaDescription] = useState("");
  const [areaDescriptionLength, setAreaDescriptionLength] = useState(0);
  const [isMaxAreaDescriptionLength, setIsMaxAreaDescriptionLength] =
    useState(false);
  const [doesAreaExist, setDoesAreaExist] = useState(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
  const [createAreaError, setCreateAreaError] = useState<Error_>();

  // Reset description when the dialog is closed.
  useEffect(() => {
    if (!isCreateAreaDialogOpen) {
      setAreaDescription("");
    }
  }, [isCreateAreaDialogOpen]);

  // Change area description length when area description changes.
  useEffect(() => {
    setAreaDescriptionLength(areaDescription.length);

    return () => setAreaDescriptionLength(0);
  }, [areaDescription]);

  // Check if max description length is reached each time area description length changes
  useEffect(() => {
    areaDescriptionLength === 200
      ? setIsMaxAreaDescriptionLength(true)
      : setIsMaxAreaDescriptionLength(false);
  }, [areaDescriptionLength]);

  // Check if the area exists when the areaDescription changes.
  useEffect(() => {
    areas.find((area) => area._description === areaDescription)
      ? setDoesAreaExist(true)
      : setDoesAreaExist(false);
  }, [areaDescription]);

  // Disable submit button if the area exists or area description is empty
  useEffect(() => {
    if (areaDescriptionLength > 0 && !doesAreaExist) {
      setIsSubmitButtonDisabled(false);
    } else {
      setIsSubmitButtonDisabled(true);
    }
  }, [areaDescriptionLength, doesAreaExist]);

  const createArea = async (description: string) => {
    setCreateAreaError(undefined);

    try {
      await _createArea(description);

      close();

      await fetchAreas();
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(
            error.response.data.statusCode,
            error.response.data.message,
          )
        : console.error(error);

      if (error instanceof AxiosError && error.message === "Network Error") {
        setCreateAreaError({
          message:
            "Network Error. Please check that your device is connected to the internet.",
        });
      } else {
        setCreateAreaError({
          message: "An error occurred while creating the area.",
          statusCode: (error as AxiosError).response?.status || undefined,
        });
      }
    }
  };

  const handleAreaDescriptionChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setAreaDescription(event.target.value);
  };

  const handleSubmit = async () => {
    await createArea(areaDescription);
  };

  const closeCreateAreaErrorDialog = () => {
    setCreateAreaError(undefined);
  };

  return (
    <div className="flex flex-col overflow-scroll bg-slate-800 p-4 text-white">
      {createAreaError && (
        <Dialog closeText="Close" close={closeCreateAreaErrorDialog}>
          <Error
            message={createAreaError.message}
            statusCode={createAreaError.statusCode}
          />
        </Dialog>
      )}

      <button
        type="button"
        onClick={close}
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

      <h2 className="block text-3xl">Create Area</h2>

      <form className="mt-2 flex flex-col gap-0.5">
        <label htmlFor="areaDescription">Area Description:</label>

        <textarea
          name="areaDescription"
          id="areaDescription"
          className="relative rounded border border-blue-800 bg-slate-700 px-2 py-1 hover:shadow hover:shadow-blue-800"
          rows={2}
          maxLength={200}
          value={areaDescription}
          onChange={(e) => handleAreaDescriptionChange(e)}
        />

        <p
          className={
            isMaxAreaDescriptionLength
              ? "self-end text-red-500"
              : "self-end text-gray-200"
          }
        >
          {areaDescriptionLength} / 200
        </p>

        {doesAreaExist ? (
          <p className="text-red-500">The area already exists.</p>
        ) : (
          <br />
        )}
      </form>

      <div className="mt-2 flex justify-end gap-1">
        <button
          type="button"
          onClick={close}
          className="flex gap-1 rounded border border-white bg-red-700 px-2 py-0.5 hover:bg-red-800"
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
              ? "flex gap-1 rounded border border-white bg-green-700 px-2 py-0.5 opacity-75 hover:cursor-not-allowed"
              : "flex gap-1 rounded border border-white bg-green-700 px-2 py-0.5 hover:bg-green-800"
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
    </div>
  );
};

export default CreateArea;
