import { useEffect, useState } from "react";
import { CleaningTaskTemplate } from "../../api/types";
import SelectBox from "./SelectBox";

type SelectCleaningTaskTemplate_MultipleProps = {
  details: CleaningTaskTemplate;
  selectedCleaningTaskTemplates: Set<number>;
  addSelectedCleaningTaskTemplate: (cleaningTaskTemplateId: number) => void;
  removeSelectedCleaningTaskTemplate: (cleaningTaskTemplateId: number) => void;
};

const SelectCleaningTaskTemplate_Multiple: React.FC<
  SelectCleaningTaskTemplate_MultipleProps
> = ({
  details,
  selectedCleaningTaskTemplates,
  addSelectedCleaningTaskTemplate,
  removeSelectedCleaningTaskTemplate,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  // Check if the cleaning task template is selected each time selectedCleaningTaskTemplates changes.
  useEffect(() => {
    selectedCleaningTaskTemplates.has(details.cleaningtasktemplateid)
      ? setIsSelected(true)
      : setIsSelected(false);
  }, [selectedCleaningTaskTemplates]);

  const selectedStyle =
    "bg-blue-700 cursor-pointer border-b border-slate-600 hover:bg-red-700";

  const notSelectedStyle =
    "bg-gray-800 cursor-pointer border-b border-slate-600 hover:bg-green-700";

  const handleClick = () => {
    isSelected
      ? removeSelectedCleaningTaskTemplate(details.cleaningtasktemplateid)
      : addSelectedCleaningTaskTemplate(details.cleaningtasktemplateid);
  };

  return (
    <tr
      className={isSelected ? selectedStyle : notSelectedStyle}
      onClick={handleClick}
    >
      <td className="block px-4 py-2 before:mr-5 before:font-bold before:content-['ID:'] xl:table-cell xl:before:mr-0 xl:before:content-none">
        {details.cleaningtasktemplateid}
      </td>
      <td className="block py-2 pl-4 pr-4 before:mr-5 before:font-bold before:content-['Description:'] xl:table-cell xl:pl-0 xl:before:mr-0 xl:before:content-none">
        {details.cleaningtasktemplatedescription}
      </td>
      <td className="block py-2 pl-4 pr-4 before:mr-5 before:font-bold before:content-['Area:'] xl:table-cell xl:pl-0 xl:before:mr-0 xl:before:content-none">
        {details.areadescription}
      </td>
      <td className="py-2 pr-4">{isSelected && <SelectBox />}</td>
    </tr>
  );
};

export default SelectCleaningTaskTemplate_Multiple;
