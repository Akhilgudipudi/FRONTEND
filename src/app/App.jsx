import { RouterProvider } from 'react-router';
import { CertificationProvider } from './context/CertificationContext';
import { Toaster } from './components/ui/sonner';
import { router } from './routes';

export default function App() {
  return (
    <CertificationProvider>
      <RouterProvider router={router} />
      <Toaster />
    </CertificationProvider>
  );
}
