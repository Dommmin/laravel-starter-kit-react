import { useEffect, useState } from 'react';
import axios from '../lib/axios.js';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
   const navigate = useNavigate();
   const params = useParams();
   const [isLoading, setIsLoading] = useState(false);

   const fetchUser = async () => {
      try {
         const res = await axios.get('/api/user');
         return res.data;
      } catch (error) {
         if (error.response && error.response.status !== 409) {
            throw error;
         }
         navigate('/verify-email');
      }
   };

   const {
      data: user,
      error,
      isPending,
      isFetching,
      refetch,
   } = useQuery({
      queryKey: ['user'],
      queryFn: fetchUser,
      retry: false,
   });

   const csrf = () => axios.get('/sanctum/csrf-cookie');

   const register = async ({ setErrors, ...props }) => {
      setIsLoading(true);
      await csrf();

      setErrors([]);

      axios
         .post('/register', props)
         .then(() => refetch())
         .catch((error) => {
            if (error.response.status !== 422) throw error;

            setErrors(error.response.data.errors);
         })
         .finally(() => setIsLoading(false));
   };

   const login = async ({ setErrors, setStatus, ...props }) => {
      setIsLoading(true);
      await csrf();

      setErrors([]);
      setStatus(null);

      axios
         .post('/login', props)
         .then((response) => {
            if (response.data?.two_factor) {
               return navigate('/two-factor-challenge');
            }
            refetch();
         })
         .catch((error) => {
            if (error.response.status !== 422) throw error;

            setErrors(error.response.data.errors);
         })
         .finally(() => setIsLoading(false));
   };

   const forgotPassword = async ({ setErrors, setStatus, email }) => {
      await csrf();

      setErrors([]);
      setStatus(null);

      axios
         .post('/forgot-password', { email })
         .then((response) => setStatus(response.data.status))
         .catch((error) => {
            if (error.response.status !== 422) throw error;

            setErrors(error.response.data.errors);
         });
   };

   const resetPassword = async ({ setErrors, setStatus, ...props }) => {
      await csrf();

      setErrors([]);
      setStatus(null);

      axios
         .post('/reset-password', { token: params.token, ...props })
         .then((response) => navigate('/login?reset=' + btoa(response.data.status)))
         .catch((error) => {
            if (error.response.status !== 422) throw error;

            setErrors(error.response.data.errors);
         });
   };

   const resendEmailVerification = ({ setStatus }) => {
      axios.post('/email/verification-notification').then((response) => setStatus(response.data.status));
   };

   const logout = async () => {
      if (!error) {
         await axios.post('/logout').then(() => refetch());
      }

      window.location.pathname = '/login';
   };

   useEffect(() => {
      if (middleware === 'guest' && redirectIfAuthenticated && user) navigate(redirectIfAuthenticated);
      if (window.location.pathname === '/verify-email' && user?.email_verified_at) navigate(redirectIfAuthenticated);
      if (middleware === 'auth' && error) logout();
   }, [user, error]);

   return {
      user,
      register,
      login,
      forgotPassword,
      resetPassword,
      resendEmailVerification,
      logout,
      isLoading,
      isPending,
      isFetching,
      refetch,
   };
};
