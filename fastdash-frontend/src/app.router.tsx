import { createBrowserRouter } from "react-router";
import DashboardBuilder from "./pages/DashboardBuilder";


export const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <DashboardBuilder />,
        children: [
            {
                path: '/',
                element: <DashboardBuilder />,
            },
        ],
    },
])