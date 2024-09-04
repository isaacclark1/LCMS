import { createBrowserRouter } from "react-router-dom";
import CleaningTaskLists from "./pages/CleaningTaskLists";
import CleaningTaskTemplateLists from "./pages/CleaningTaskTemplateLists";
import Authenticate from "./Authenticate";

export const router = createBrowserRouter([
  {
    element: <Authenticate />,
    children: [
      { path: "/", element: <CleaningTaskLists /> },
      {
        path: "/cleaningTaskTemplateLists",
        element: <CleaningTaskTemplateLists />,
      },
    ],
  },
]);
