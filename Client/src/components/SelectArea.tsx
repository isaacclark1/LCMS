import { useEffect, useState } from "react";
import { getAreas } from "../../api/api";
import { Area, Error_ } from "../../api/types";
import { AxiosError } from "axios";
import SelectBox from "./SelectBox";
import Error from "./Error";

type SelectAreaProps = {
  selectedAreaId: number | undefined;
  setSelectedAreaId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setAreaDescription: React.Dispatch<React.SetStateAction<string | undefined>>;
  areaDescription: string | undefined;
  doesAreaExist: boolean;
  setDoesAreaExist: React.Dispatch<React.SetStateAction<boolean>>;
};

const SelectArea: React.FC<SelectAreaProps> = ({
  selectedAreaId,
  setSelectedAreaId,
  setAreaDescription,
  areaDescription,
  doesAreaExist,
  setDoesAreaExist,
}) => {
  const [areas, setAreas] = useState<Array<Area>>([]);
  const [isCreateNewArea, setIsCreateNewArea] = useState(false);
  const [areaDescriptionLength, setAreaDescriptionLength] = useState(0);
  const [isMaxAreaDescriptionLength, setIsMaxAreaDescriptionLength] =
    useState(false);
  const [fetchAreasError, setFetchAreasError] = useState<Error_>();
  const [doesAreaExistError, setDoesAreaExistError] = useState<string>();

  useEffect(() => {
    fetchAreas();
  }, []);

  useEffect(() => {
    setSelectedAreaId(undefined);
  }, [isCreateNewArea]);

  useEffect(() => {
    if (areaDescriptionLength === 200) setIsMaxAreaDescriptionLength(true);
    else setIsMaxAreaDescriptionLength(false);
  }, [areaDescriptionLength]);

  useEffect(() => {
    checkIfAreaExists();
  }, [areaDescription]);

  const fetchAreas = async (): Promise<void> => {
    setAreas([]);
    setFetchAreasError(undefined);

    try {
      const _areas: Array<Area> = await getAreas();

      setAreas(_areas);
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
        setAreas([]);
      } else if (
        error instanceof AxiosError &&
        error.message === "Network Error"
      ) {
        setFetchAreasError({
          message:
            "Network Error. Please check that your device is connected to the internet.",
        });
      } else {
        setFetchAreasError({
          statusCode: (error as AxiosError).response?.status || undefined,
          message: "An error occurred while getting the areas from the system.",
        });
      }
    }
  };

  const checkIfAreaExists = () => {
    for (const area of areas) {
      if (area._description === areaDescription) {
        setDoesAreaExist(true);
        setDoesAreaExistError(
          "The area already exists. Please choose the existing area.",
        );
        return;
      } else {
        setDoesAreaExist(false);
        setDoesAreaExistError(undefined);
      }
    }
  };

  return (
    <>
      {!isCreateNewArea && fetchAreasError && (
        <>
          <button
            type="button"
            className="self-end rounded bg-blue-700 px-3 py-1 hover:bg-blue-800"
            onClick={() => {
              setIsCreateNewArea(true);
              setSelectedAreaId(undefined);
            }}
          >
            Create new area
          </button>

          <p>Areas:</p>

          <Error
            message={fetchAreasError.message}
            statusCode={fetchAreasError.statusCode}
          />
        </>
      )}

      {areas.length > 0 && !fetchAreasError && !isCreateNewArea && (
        <>
          <button
            type="button"
            className="self-end rounded bg-blue-700 px-3 py-1 hover:bg-blue-800"
            onClick={() => {
              setIsCreateNewArea(true);
              setSelectedAreaId(undefined);
            }}
          >
            Create new area
          </button>

          <p className="mb-1">Area:</p>

          <table className="w-full max-w-full border-collapse text-left">
            <thead className="hidden border-b border-slate-400 md:table-header-group">
              <tr>
                <th className="px-4 py-2 font-semibold">ID</th>
                <th className="py-2 pr-4 font-semibold">Description</th>
                <th className="py-2 pr-4 font-semibold"></th>
              </tr>
            </thead>

            <tbody className="text-gray-200">
              {areas.map(({ areaid, _description }) => (
                <tr
                  key={areaid}
                  className={`cursor-pointer border-b border-slate-600 hover:bg-blue-700 ${
                    areaid === selectedAreaId && "cursor-default bg-blue-700"
                  } `}
                  onClick={() => setSelectedAreaId(areaid)}
                >
                  <td className="block px-4 py-2 before:mr-5 before:font-bold before:content-['ID:'] md:table-cell md:before:mr-0 md:before:content-none">
                    {areaid}
                  </td>
                  <td className="block py-2 pl-4 pr-4 before:mr-5 before:font-bold before:content-['Description:'] md:table-cell md:pl-0 md:before:mr-0 md:before:content-none">
                    {_description}
                  </td>
                  <td className="py-2 pr-4">
                    {areaid === selectedAreaId && <SelectBox />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {areas.length === 0 && !isCreateNewArea && !fetchAreasError && (
        <>
          <button
            type="button"
            className="self-end rounded bg-blue-700 px-3 py-1 hover:bg-blue-800"
            onClick={() => {
              setIsCreateNewArea(true);
              setSelectedAreaId(undefined);
            }}
          >
            Create new area
          </button>
          <p className="mt-2 w-max max-w-full rounded border border-white bg-slate-700 px-2 py-0.5">
            There are no areas stored in the system.
          </p>
        </>
      )}

      {isCreateNewArea && (
        <>
          <button
            type="button"
            className="self-end rounded bg-blue-700 px-3 py-1 hover:bg-blue-800"
            onClick={() => {
              setIsCreateNewArea(false);
              setAreaDescription(undefined);
              setAreaDescriptionLength(0);
            }}
          >
            Choose an existing area
          </button>

          <label htmlFor="areaDescription">Area Description:</label>

          <textarea
            name="areaDescription"
            id="areaDescription"
            className="relative rounded border border-blue-800 bg-slate-700 px-2 py-1 hover:shadow hover:shadow-blue-800"
            rows={2}
            maxLength={200}
            onChange={(e) => {
              setAreaDescriptionLength(e.target.value.length);
              setAreaDescription(e.target.value);
              checkIfAreaExists();
            }}
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

          {areaDescriptionLength === 0 || doesAreaExist ? (
            <>
              {doesAreaExist && (
                <p className="text-red-500">{doesAreaExistError}</p>
              )}
              {areaDescriptionLength === 0 && (
                <p className="text-red-500">
                  An area description must be provided
                </p>
              )}
            </>
          ) : (
            <br />
          )}
        </>
      )}
    </>
  );
};

export default SelectArea;
