import { CleaningTaskTemplateList as CleaningTaskTemplateList_TYPE } from "../../api/types";

type CleaningTaskTemplateListProps = {
  details: CleaningTaskTemplateList_TYPE;
  setCleaningTaskTemplateListId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  openViewCleaningTaskTemplateListDialog: () => void;
  setIdOfCleaningTaskTemplateListToDelete: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  openDeleteCleaningTaskTemplateListDialog: () => void;
};

const CleaningTaskTemplateList: React.FC<CleaningTaskTemplateListProps> = ({
  details,
  setCleaningTaskTemplateListId,
  openViewCleaningTaskTemplateListDialog,
  setIdOfCleaningTaskTemplateListToDelete,
  openDeleteCleaningTaskTemplateListDialog,
}) => {
  const handleViewCleaningTaskTemplateListClick = (
    cleaningTaskTemplateListId: number,
  ) => {
    setCleaningTaskTemplateListId(cleaningTaskTemplateListId);
    openViewCleaningTaskTemplateListDialog();
  };

  const handleDeleteCleaningTaskTemplateListClick = async (
    _cleaningTaskTemplateListId: number,
  ) => {
    setIdOfCleaningTaskTemplateListToDelete(_cleaningTaskTemplateListId);
    openDeleteCleaningTaskTemplateListDialog();
  };

  return (
    <tr className="border-b border-slate-600">
      <td className="block py-2 pr-4 before:mr-5 before:font-bold before:content-['ID:'] md:table-cell md:before:mr-0 md:before:content-['']">
        {details.cleaningtasktemplatelistid}
      </td>
      <td className="block py-2 pr-4 before:mr-5 before:font-bold before:content-['Title:'] md:table-cell md:before:mr-0 md:before:content-['']">
        {details.title}
      </td>
      <td className="flex gap-1 py-2 pr-4 before:mr-5 before:font-bold before:content-['Actions:'] md:before:mr-0 md:before:content-['']">
        <button
          type="button"
          className="rounded bg-indigo-600 p-1.5 hover:bg-indigo-700"
          onClick={() =>
            handleViewCleaningTaskTemplateListClick(
              details.cleaningtasktemplatelistid,
            )
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#FFFFFF"
          >
            <path d="M336-264h456v-96H336v96ZM168-600h96v-96h-96v96Zm0 168h96v-96h-96v96Zm0 168h96v-96h-96v96Zm168-168h456v-96H336v96Zm0-168h456v-96H336v96ZM168-192q-29.7 0-50.85-21.16Q96-234.32 96-264.04v-432.24Q96-726 117.15-747T168-768h624q29.7 0 50.85 21.16Q864-725.68 864-695.96v432.24Q864-234 842.85-213T792-192H168Z" />
          </svg>
        </button>

        <button
          type="button"
          className="rounded bg-red-700 p-1.5 hover:bg-red-800"
          onClick={() =>
            handleDeleteCleaningTaskTemplateListClick(
              details.cleaningtasktemplatelistid,
            )
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#FFFFFF"
          >
            <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default CleaningTaskTemplateList;
