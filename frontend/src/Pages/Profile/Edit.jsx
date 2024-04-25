import DeleteUserForm from './Partials/DeleteUserForm.jsx';
import UpdatePasswordForm from './Partials/UpdatePasswordForm.jsx';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm.jsx';
import {Navigate} from 'react-router-dom';
import {useAuth} from '../../hooks/auth.js';
import TwoFactorAuthenticationForm from './Partials/TwoFactorAuthenticationForm.jsx';
import {useEffect} from 'react';
import {useTwoFactor} from '../../hooks/twoFactor.js';

export default function Edit() {
  const {disableTwoFactorAuthentication} = useTwoFactor();
  const {user, resendEmailVerification, refetch} = useAuth({middleware: 'auth'});

  if (!user) {
    return <Navigate to="/login"/>;
  }

  useEffect(() => {
    if (!user.two_factor_confirmed_at && user.two_factor_enabled) {
      disableTwoFactorAuthentication();
    }
  }, []);

  return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <UpdateProfileInformationForm
                className="max-w-xl"
                user={user}
                refetchUser={refetch}
                resendEmailVerification={resendEmailVerification}
            />
          </div>

          <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <UpdatePasswordForm className="max-w-xl"/>
          </div>

          <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <TwoFactorAuthenticationForm className="max-w-xl" user={user} refetchUser={refetch}/>
          </div>

          <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <DeleteUserForm className="max-w-xl"/>
          </div>
        </div>
      </div>
  );
}
