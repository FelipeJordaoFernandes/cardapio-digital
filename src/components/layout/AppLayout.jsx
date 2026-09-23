import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { RouteFocus } from './RouteFocus';

export function AppLayout() {
  return (
    <>
      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
      <AppHeader />
      <RouteFocus />
      <Outlet />
    </>
  );
}
