import { createBrowserRouter } from 'react-router';
import { Root } from './layouts/Root';
import { Home } from './pages/Home';
import { OfficialAppeal } from './pages/OfficialAppeal';
import { Services } from './pages/Services';
import { MemorialWall } from './pages/MemorialWall';
import { AdditionalServices } from './pages/AdditionalServices';
import { Donate } from './pages/Donate';
import { AboutUs } from './pages/AboutUs';
import { Documents } from './pages/Documents';
import { Admin } from './pages/Admin';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    errorElement: <NotFound />,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: AboutUs },
      { path: 'appeal', Component: OfficialAppeal },
      { path: 'services', Component: Services },
      { path: 'memorial', Component: MemorialWall },
      { path: 'extra', Component: AdditionalServices },
      { path: 'donate', Component: Donate },
      { path: 'documents', Component: Documents },
      { path: '*', Component: NotFound },
    ],
  },
  {
    path: '/admin',
    Component: Admin,
    errorElement: <NotFound />,
  },
]);
