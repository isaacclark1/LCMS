import { CleaningTaskTemplate as CleaningTaskTemplate_TYPE } from "../../api/types";
import SelectBox from "./SelectBox";

type SelectCleaningTaskTemplateProps = {
  cleaningTaskTemplates: Array<CleaningTaskTemplate_TYPE>;
  setSelectedCleaningTaskTemplateId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  selectedCleaningTaskTemplateId: number | undefined;
};

const SelectCleaningTaskTemplate: React.FC<SelectCleaningTaskTemplateProps> = ({
  cleaningTaskTemplates,
  setSelectedCleaningTaskTemplateId,
  selectedCleaningTaskTemplateId,
}) => {
  return (
    <table className="w-full max-w-full border-collapse text-left">
      <thead className="hidden border-b border-slate-400 lg:table-header-group">
        <tr>
          <th className="px-4 py-2 font-semibold">ID</th>
          <th className="py-2 pr-4 font-semibold">Description</th>
          <th className="py-2 pr-4 font-semibold">Area</th>
          <th className="py-2 pr-4 font-semibold"></th>
        </tr>
      </thead>
      <tbody className="text-gray-200">
        {cleaningTaskTemplates.map((cleaningTaskTemplate) => (
          <tr
            className={`cursor-pointer border-b border-slate-600 hover:bg-blue-700 ${
              selectedCleaningTaskTemplateId ===
                cleaningTaskTemplate.cleaningtasktemplateid &&
              "cursor-default bg-blue-700"
            } `}
            key={cleaningTaskTemplate.cleaningtasktemplateid}
            onClick={() => {
              setSelectedCleaningTaskTemplateId(
                cleaningTaskTemplate.cleaningtasktemplateid,
              );
            }}
          >
            <td className="block px-4 py-2 before:mr-5 before:font-bold before:content-['ID:'] lg:table-cell lg:before:mr-0 lg:before:content-none">
              {cleaningTaskTemplate.cleaningtasktemplateid}
            </td>
            <td className="block py-2 pl-4 pr-4 before:mr-5 before:font-bold before:content-['Description:'] lg:table-cell lg:pl-0 lg:before:mr-0 lg:before:content-none">
              {cleaningTaskTemplate.cleaningtasktemplatedescription}
            </td>
            <td className="block py-2 pl-4 pr-4 before:mr-5 before:font-bold before:content-['Area:'] lg:table-cell lg:pl-0 lg:before:mr-0 lg:before:content-none">
              {cleaningTaskTemplate.areadescription}
            </td>
            <td className="py-2 pr-4">
              {selectedCleaningTaskTemplateId ===
                cleaningTaskTemplate.cleaningtasktemplateid && <SelectBox />}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SelectCleaningTaskTemplate;
