type DeleteBoxProps = {
  cleaningTaskId: number;
  setCleaningTaskIdToDelete: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  setIsDeleteCleaningTaskDialogOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

const DeleteBox: React.FC<DeleteBoxProps> = ({
  cleaningTaskId,
  setCleaningTaskIdToDelete,
  setIsDeleteCleaningTaskDialogOpen,
}) => (
  <button
    type="button"
    className="rounded bg-red-700 p-1.5 hover:bg-red-800"
    onClick={() => {
      setCleaningTaskIdToDelete(cleaningTaskId);
      setIsDeleteCleaningTaskDialogOpen(true);
    }}
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
);

export default DeleteBox;
