import { useEffect } from "react";
import { CleaningTaskTemplate } from "../../api/types";
import Error from "./Error";
import SelectCleaningTaskTemplate_Multiple from "./SelectCleaningTaskTemplate_Multiple";
import { Error_ } from "../../api/types";

type SelectCleaningTaskTemplatesProps = {
  isCreateNewCleaningTaskTemplateListDialogOpen: boolean;
  selectedCleaningTaskTemplates: Set<number>;
  setSelectedCleaningTaskTemplates: React.Dispatch<
    React.SetStateAction<Set<number>>
  >;
  displayCreateCleaningTaskTemplateComponent: () => void;
  fetchCleaningTaskTemplates: () => Promise<void>;
  fetchCleaningTaskTemplatesError: Error_ | undefined;
  cleaningTaskTemplates: Array<CleaningTaskTemplate>;
  setCleaningTaskTemplates: React.Dispatch<
    React.SetStateAction<Array<CleaningTaskTemplate>>
  >;
  addSelectedCleaningTaskTemplate: (cleaningTaskTemplateId: number) => void;
};

const SelectCleaningTaskTemplates: React.FC<
  SelectCleaningTaskTemplatesProps
> = ({
  isCreateNewCleaningTaskTemplateListDialogOpen,
  selectedCleaningTaskTemplates,
  setSelectedCleaningTaskTemplates,
  displayCreateCleaningTaskTemplateComponent,
  fetchCleaningTaskTemplates,
  fetchCleaningTaskTemplatesError,
  cleaningTaskTemplates,
  setCleaningTaskTemplates,
  addSelectedCleaningTaskTemplate,
}) => {
  // Get cleaning task templates when the dialog is open
  useEffect(() => {
    if (isCreateNewCleaningTaskTemplateListDialogOpen) {
      setSelectedCleaningTaskTemplates(new Set());
      fetchCleaningTaskTemplates();
    }

    // On unmount - reset.
    return () => {
      setCleaningTaskTemplates([]);
      setSelectedCleaningTaskTemplates(new Set());
    };
  }, [isCreateNewCleaningTaskTemplateListDialogOpen]);

  // Removes a cleaning taks template from the list of selected cleaning task templates.
  const removeSelectedCleaningTaskTemplate = (
    cleaningTaskTemplateId: number,
  ) => {
    setSelectedCleaningTaskTemplates((prevValue) => {
      const newSet = new Set(prevValue);
      newSet.delete(cleaningTaskTemplateId);
      return newSet;
    });
  };

  return (
    <>
      <div className="sticky top-0 w-full max-w-full rounded-t border-b border-slate-400 bg-slate-900 p-2">
        <p>Choose cleaning tasks:</p>

        <div className="mt-1 flex justify-end">
          <button
            type="button"
            className="flex gap-1 rounded bg-blue-700 px-3 py-1 text-white hover:bg-blue-800"
            onClick={displayCreateCleaningTaskTemplateComponent}
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
      </div>

      {fetchCleaningTaskTemplatesError ? (
        <div className="max-w-full px-4 py-2">
          <Error
            message={fetchCleaningTaskTemplatesError.message}
            statusCode={fetchCleaningTaskTemplatesError.statusCode}
          />
        </div>
      ) : (
        <div className="w-full max-w-full">
          {cleaningTaskTemplates.length === 0 ? (
            <p className="m-2 max-w-full self-start rounded border border-white bg-gray-800 px-2 py-0.5">
              There are no cleaning task templates stored in the system.
            </p>
          ) : (
            <table className="w-full max-w-full border-collapse text-left">
              <thead className="hidden border-b border-slate-400 xl:table-header-group">
                <tr>
                  <th className="px-4 py-2 font-semibold">ID</th>
                  <th className="py-2 pr-4 font-semibold">Description</th>
                  <th className="py-2 pr-4 font-semibold">Area</th>
                  <th className="py-2 pr-4 font-semibold"></th>
                </tr>
              </thead>

              <tbody className="max-w-full text-gray-200">
                {cleaningTaskTemplates.map((template) => (
                  <SelectCleaningTaskTemplate_Multiple
                    key={template.cleaningtasktemplateid}
                    details={template}
                    selectedCleaningTaskTemplates={
                      selectedCleaningTaskTemplates
                    }
                    addSelectedCleaningTaskTemplate={
                      addSelectedCleaningTaskTemplate
                    }
                    removeSelectedCleaningTaskTemplate={
                      removeSelectedCleaningTaskTemplate
                    }
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
};

export default SelectCleaningTaskTemplates;
