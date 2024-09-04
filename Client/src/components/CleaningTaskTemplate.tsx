import { CleaningTaskTemplate as CleaningTaskTemplate_TYPE } from "../../api/types";

type CleaningTaskTemplateProps = {
  details: CleaningTaskTemplate_TYPE;
  openDeleteCleaningTaskTemplateDialog: (
    cleaningTaskTemplateId: number,
  ) => void;
};

const CleaningTaskTemplate: React.FC<CleaningTaskTemplateProps> = ({
  details,
  openDeleteCleaningTaskTemplateDialog,
}) => {
  return (
    <tr className="border-b border-slate-600">
      <td className="block py-2 pr-4 before:mr-5 before:font-bold before:content-['ID:'] lg:table-cell lg:before:mr-0 lg:before:content-none">
        {details.cleaningtasktemplateid}
      </td>
      <td className="block py-2 pr-4 before:mr-5 before:font-bold before:content-['Description:'] lg:table-cell lg:before:mr-0 lg:before:content-none">
        {details.cleaningtasktemplatedescription}
      </td>
      <td className="block py-2 pr-4 before:mr-5 before:font-bold before:content-['Area:'] lg:table-cell lg:before:mr-0 lg:before:content-none">
        {details.areadescription}
      </td>
      <td className="block py-2 pr-4 before:mr-5 before:font-bold before:content-['Actions:'] lg:table-cell lg:before:mr-0 lg:before:content-none">
        <button
          type="button"
          className="rounded bg-red-700 p-1.5 hover:bg-red-800"
          onClick={() =>
            openDeleteCleaningTaskTemplateDialog(details.cleaningtasktemplateid)
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

export default CleaningTaskTemplate;
