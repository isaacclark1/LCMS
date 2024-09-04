import { useEffect, useState } from "react";

type TickBoxProps = {
  cleaningTaskId: number;
  completed: boolean;
  toggleComplete: (cleaningTaskListId: number, cleaningTaskId: number) => Promise<void>;
  cleaningTaskListId: number | undefined;
  isError: boolean;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
  toggleIncomplete: (cleaningTaskListId: number, cleaningTaskId: number) => Promise<void>;
};

const TickBox: React.FC<TickBoxProps> = ({
  cleaningTaskId,
  completed,
  toggleComplete,
  cleaningTaskListId,
  isError,
  setIsError,
  toggleIncomplete,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [buttonStyle, setButtonStyle] = useState("");
  const [icon, setIcon] = useState<JSX.Element>();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => renderIcon(completed), [completed, isHovered, isError]);

  useEffect(() => {
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
    } else {
      setIsTouchDevice(false);
    }
  }, []);

  const CompleteIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="#FFFFFF"
    >
      <path d="m429-336 238-237-51-51-187 186-85-84-51 51 136 135ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm0-72h528v-528H216v528Zm0-528v528-528Z" />
    </svg>
  );

  const IncompleteIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="#FFFFFF"
    >
      <path d="M216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm0-72h528v-528H216v528Z" />
    </svg>
  );

  const IncompleteHoverIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="#FFFFFF"
    >
      <path d="M216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528.25q7.54 0 14.15 2 6.6 2 12.6 4l-66 66H216v528h528v-233l72-72v305q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm265-144L265-505l51-51 165 166 333-332 51 51-384 383Z" />
    </svg>
  );

  const CompleteHoverIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="#FFFFFF"
    >
      <path d="m350-299 130.19-130.19L610.37-299 661-349.63 530.81-479.81 661-610l-51-51-130.19 130.19L349.63-661 299-610.37l130.19 130.18L299-350l51 51ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm0-72h528v-528H216v528Zm0-528v528-528Z" />
    </svg>
  );

  const ErrorIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="#FFFFFF"
    >
      <path d="m48-144 432-720 432 720H48Zm127-72h610L480-724 175-216Zm304.79-48q15.21 0 25.71-10.29t10.5-25.5q0-15.21-10.29-25.71t-25.5-10.5q-15.21 0-25.71 10.29t-10.5 25.5q0 15.21 10.29 25.71t25.5 10.5ZM444-384h72v-192h-72v192Zm36-86Z" />
    </svg>
  );

  const renderIcon = (completed: boolean): void => {
    if (isError) {
      setIcon(<ErrorIcon />);
      setButtonStyle("bg-orange-600 p-1.5 rounded");
      setTimeout(() => setIsError(false), 5000);
      return;
    }
    if (completed && isHovered && !isTouchDevice) {
      setIcon(<CompleteHoverIcon />);
      setButtonStyle("bg-red-700 p-1.5 rounded");
      return;
    }
    if (!completed && isHovered && !isTouchDevice) {
      setIcon(<IncompleteHoverIcon />);
      setButtonStyle("bg-green-600 p-1.5 rounded");
      return;
    }
    if (completed) {
      setIcon(<CompleteIcon />);
      setButtonStyle("bg-green-600 p-1.5 rounded");
      return;
    }
    if (!completed) {
      setIcon(<IncompleteIcon />);
      setButtonStyle("bg-black p-1.5 rounded");
      return;
    }
  };

  const handleClick = async () => {
    if (!completed) {
      if (cleaningTaskListId) {
        await toggleComplete(cleaningTaskListId, cleaningTaskId);
      }
    }

    if (completed) {
      if (cleaningTaskListId) {
        await toggleIncomplete(cleaningTaskListId, cleaningTaskId);
      }
    }
  };

  return (
    <button
      type="button"
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      className={buttonStyle}
      onClick={handleClick}
    >
      {icon}
    </button>
  );
};

export default TickBox;
