import InputError from '../Components/InputError';
import {useAuth} from '../hooks/auth';
import {useState} from 'react';
import AuthSessionStatus from '../Auth/AuthSessionStatus.jsx';

export default function ForgotPassword() {
  const {forgotPassword} = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/',
  });

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);

  const submitForm = (event) => {
    event.preventDefault();

    forgotPassword({email, setErrors, setStatus});
  };

  return (
      <div className="flex items-center justify-center min-h-screen max-w-lg mx-auto">
        <form
            onSubmit={submitForm}
            className="flex flex-col items-center justify-center w-full space-y-4 card bg-white glass dark:bg-gray-800 shadow-xl py-12"
        >
          <h1 className="font-bold text-3xl text-gray-200">Forgot your password? </h1>
          <div className="text-center px-8 text-sm text-gray-300">
            No problem. Just let us know your email address and we will email you a password reset link that will
            allow you to choose a new one.
          </div>

          {/* Session Status */}
          <AuthSessionStatus className="mb-4" status={status}/>

          <label className="form-control w-full max-w-md">
            <div className="label">
              <span className="label-text text-gray-200">Email</span>
            </div>
            <input
                className="input input-bordered input-primary w-full max-w-md"
                type="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
            />
            <InputError messages={errors.email} className="mt-2"/>
          </label>

          <button type="submit" className="btn btn-primary w-full max-w-md dark:text-gray-200 tracking-wide">
            Reset Password
          </button>
        </form>
      </div>
  );
}
