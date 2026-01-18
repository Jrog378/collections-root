import { createBrowserRouter } from "react-router-dom";
import App from "./App";
// import User from "./pages/archive/User";
// import Role from "./pages/archive/Role";
// import Admin from "./pages/archive/Admin";
// import Artist from "./pages/archive/Artist";
// import Donor from "./pages/archive/Donor";
// import Catalog from "./pages/archive/Catalog";
// import Artwork from "./pages/archive/Artwork";
import Index from "./pages";

export const routes = createBrowserRouter([
    {
        id: 'app-start',
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Index />
            }
            // {
            //     path: 'user',
            //     element: <Admin />,
            //     children: [
            //         {
            //             index: true,
            //             path: ':noteId?/*',
            //             element: <User />,
            //         },
            //         {
            //             path: 'role/:noteId?/*',
            //             element: <Role />
            //         }
            //     ]
            // },
            // {
            //     path: 'catalog',
            //     element: <Admin />,
            //     children: [
            //         {
            //             index: true,
            //             element: <Catalog />,
            //         },
            //         {
            //             path: 'artwork/:noteId?/*',
            //             element: <Artwork />,
            //         },
            //         {
            //             path: 'artist/:noteId?/*',
            //             element: <Artist />,
            //         },
            //         {
            //             path: 'donor/:noteId?/*',
            //             element: <Donor />,
            //         },
            //     ]
            // },
        ]
    },

])