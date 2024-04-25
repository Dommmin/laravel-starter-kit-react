import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import PageNotFound from './Components/PageNotFound.jsx';
import Login from './Auth/Login.jsx';
import Register from './Auth/Register.jsx';
import ForgotPassword from './Auth/ForgotPassword.jsx';
import VerifyEmail from './Auth/VerifyEmail.jsx';
import PasswordReset from './Auth/PasswordReset.jsx';
import AppLayout from './Layouts/AppLayout.jsx';
import ProfileEdit from './Pages/Profile/Edit.jsx';
import TwoFactorChallenge from './Auth/TwoFactorChallenge.jsx';
import Home from './Pages/Home.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import Images from './Pages/Images.jsx';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'reverb',
  key: '4dztztzkqwoytwdzig3g',
  cluster: 'mt1',
  wsHost: 'localhost',
  wsPort: '8080',
  wssPort: '8080',
  forceTLS: false,
  enabledTransports: ['ws', 'wss'],
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout/>,
    children: [
      {
        path: '/',
        element: <Home/>,
      },
      {
        path: '/profile',
        element: <ProfileEdit/>,
      },
      {
        path: '/dashboard',
        element: <Dashboard/>,
      },
      {
        path: '/images',
        element: <Images/>,
      },
    ],
  },
  {
    path: '/login',
    element: <Login/>,
  },
  {
    path: '/register',
    element: <Register/>,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword/>,
  },
  {
    path: '/verify-email',
    element: <VerifyEmail/>,
  },
  {
    path: '/password-reset/:token',
    element: <PasswordReset/>,
  },
  {
    path: '/two-factor-challenge',
    element: <TwoFactorChallenge/>,
  },
  {
    path: '*',
    element: <PageNotFound/>,
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    staleTime: 5000,
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
      </QueryClientProvider>
    </React.StrictMode>,
);
