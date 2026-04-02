import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CertificationsList } from './pages/CertificationsList';
import { CertificationForm } from './pages/CertificationForm';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: 'certifications',
        Component: CertificationsList,
      },
      {
        path: 'certifications/new',
        Component: CertificationForm,
      },
      {
        path: 'certifications/edit/:id',
        Component: CertificationForm,
      },
    ],
  },
]);
