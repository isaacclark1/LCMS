import { useEffect } from "react";
import CleaningTaskTemplate from "./CleaningTaskTemplate";
import Error from "./Error";
import {
  CleaningTaskTemplate as CleaningTaskTemplate_TYPE,
  Error_,
} from "../../api/types";

type CleaningTaskTemplatesProps = {
  cleaningTaskTemplateListId: number | undefined;
  fetchCleaningTaskTemplates: (
    cleaningTaskTemplateListId: number,
  ) => Promise<void>;
  cleaningTaskTemplates: Array<CleaningTaskTemplate_TYPE>;
  setCleaningTaskTemplates: React.Dispatch<
    React.SetStateAction<Array<CleaningTaskTemplate_TYPE>>
  >;
  fetchCleaningTaskTemplatesError: Error_ | undefined;
  openDeleteCleaningTaskTemplateDialog: (
    cleaningTaskTemplateId: number,
  ) => void;
};

const CleaningTaskTemplates: React.FC<CleaningTaskTemplatesProps> = ({
  cleaningTaskTemplateListId,
  fetchCleaningTaskTemplates,
  cleaningTaskTemplates,
  setCleaningTaskTemplates,
  fetchCleaningTaskTemplatesError,
  openDeleteCleaningTaskTemplateDialog,
}) => {
  // Fetch the cleaning task templates when the cleaning task template list id changes.
  useEffect(() => {
    if (cleaningTaskTemplateListId) {
      fetchCleaningTaskTemplates(cleaningTaskTemplateListId);
    }

    return () => setCleaningTaskTemplates([]);
  }, [cleaningTaskTemplateListId]);

  return (
    <>
      <h2 className="text-2xl">Cleaning Tasks</h2>

      {fetchCleaningTaskTemplatesError && (
        <Error
          message={fetchCleaningTaskTemplatesError.message}
          statusCode={fetchCleaningTaskTemplatesError.statusCode}
        />
      )}

      {!fetchCleaningTaskTemplatesError && (
        <>
          {cleaningTaskTemplates.length === 0 && (
            <p className="w-full max-w-full self-start rounded border border-black bg-gray-900 px-2 py-0.5">
              The cleaning task template list is empty.
            </p>
          )}

          {cleaningTaskTemplates.length !== 0 && (
            <table className="w-full max-w-full border-collapse text-left">
              <thead className="hidden border-b border-slate-400 text-left lg:table-header-group">
                <tr>
                  <th className="py-2 pr-4 font-semibold">ID</th>
                  <th className="py-2 pr-4 font-semibold">Description</th>
                  <th className="py-2 pr-4 font-semibold">Area</th>
                  <th className="py-2 pr-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="text-gray-200">
                {cleaningTaskTemplates.map((task) => (
                  <CleaningTaskTemplate
                    details={task}
                    key={task.cleaningtasktemplateid}
                    openDeleteCleaningTaskTemplateDialog={
                      openDeleteCleaningTaskTemplateDialog
                    }
                  />
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </>
  );
};

export default CleaningTaskTemplates;
