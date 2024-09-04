import { AxiosError } from "axios";
import { markCleaningTaskAsComplete, markCleaningTaskAsIncomplete } from "../../api/api";
import { CleaningTask as CleaningTask_TYPE } from "../../api/types";
import TickBox from "./TickBox";
import { useContext, useState } from "react";
import DeleteBox from "./DeleteBox";
import { UserContext } from "../App";

type CleaningTaskProps = {
  task: CleaningTask_TYPE;
  refreshCleaningTasks: (
    _cleaningTaskListId: number,
    _cleaningTaskListDate: string,
    _cleaningTaskListStaffMemberId: number | null,
    _cleaningTaskListManagerSignature: string | null,
    _cleaningTaskListStaffMemberSignature: string | null
  ) => Promise<void>;
  cleaningTaskListId: number | undefined;
  cleaningTaskListDate: string | undefined;
  cleaningTaskListStaffMemberId: number | undefined | null;
  cleaningTaskListManagerSignature: string | undefined | null;
  cleaningTaskListStaffMemberSignature: string | undefined | null;
  setCleaningTaskIdToDelete: React.Dispatch<React.SetStateAction<number | undefined>>;
  setIsDeleteCleaningTaskDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CleaningTask: React.FC<CleaningTaskProps> = ({
  task,
  refreshCleaningTasks,
  cleaningTaskListId,
  cleaningTaskListDate,
  cleaningTaskListStaffMemberId,
  cleaningTaskListManagerSignature,
  cleaningTaskListStaffMemberSignature,
  setCleaningTaskIdToDelete,
  setIsDeleteCleaningTaskDialogOpen,
}) => {
  const [isToggleError, setIsToggleError] = useState(false);

  const { userType } = useContext(UserContext);

  const toggleComplete = async (cleaningTaskListId: number, cleaningTaskId: number) => {
    try {
      await markCleaningTaskAsComplete(cleaningTaskListId, cleaningTaskId);
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(error.response.data.statusCode, error.response.data.message)
        : console.error(error);

      setIsToggleError(true);
    } finally {
      if (cleaningTaskListId && cleaningTaskListDate) {
        await refreshCleaningTasks(
          cleaningTaskListId,
          cleaningTaskListDate,
          cleaningTaskListStaffMemberId || null,
          cleaningTaskListManagerSignature || null,
          cleaningTaskListStaffMemberSignature || null
        );
      }
    }
  };

  const toggleIncomplete = async (cleaningTaskListId: number, cleaningTaskId: number) => {
    try {
      await markCleaningTaskAsIncomplete(cleaningTaskListId, cleaningTaskId);
    } catch (error) {
      error instanceof AxiosError && error.response
        ? console.error(error.response.data.statusCode, error.response.data.message)
        : console.error(error);

      setIsToggleError(true);
    } finally {
      if (cleaningTaskListId && cleaningTaskListDate) {
        await refreshCleaningTasks(
          cleaningTaskListId,
          cleaningTaskListDate,
          cleaningTaskListStaffMemberId || null,
          cleaningTaskListManagerSignature || null,
          cleaningTaskListStaffMemberSignature || null
        );
      }
    }
  };

  return (
    <tr className="border-b border-slate-600">
      <td className="block py-2 pr-4 before:mr-5 before:font-bold before:content-['ID:'] lg:table-cell lg:before:mr-0 lg:before:content-['']">
        {task.cleaningtaskid}
      </td>
      <td className="block py-2 pr-4 before:mr-5 before:font-bold before:content-['Description:'] lg:table-cell lg:before:mr-0 lg:before:content-['']">
        {task.cleaningtaskdescription}
      </td>
      <td className="block py-2 pr-4 before:mr-5 before:font-bold before:content-['Area:'] lg:table-cell lg:before:mr-0 lg:before:content-['']">
        {task.areadescription}
      </td>
      <td className="flex gap-x-1 py-2 pr-4 before:mr-5 before:font-bold before:content-['Actions:'] lg:before:mr-0 lg:before:content-['']">
        <TickBox
          cleaningTaskId={task.cleaningtaskid}
          completed={task.completed}
          toggleComplete={toggleComplete}
          cleaningTaskListId={cleaningTaskListId}
          isError={isToggleError}
          setIsError={setIsToggleError}
          toggleIncomplete={toggleIncomplete}
        />
        {userType === "Manager" && (
          <DeleteBox
            cleaningTaskId={task.cleaningtaskid}
            setCleaningTaskIdToDelete={setCleaningTaskIdToDelete}
            setIsDeleteCleaningTaskDialogOpen={setIsDeleteCleaningTaskDialogOpen}
          />
        )}
      </td>
    </tr>
  );
};

export default CleaningTask;
