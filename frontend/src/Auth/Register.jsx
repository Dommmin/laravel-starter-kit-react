import {Link, Navigate} from 'react-router-dom';
import {useState} from 'react';
import {useAuth} from '../hooks/auth';
import InputError from '../Components/InputError.jsx';
import LoadingSpinner from '../Components/LoadingSpinner.jsx';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState([]);

  const {register, isLoading, isFetching, user} = useAuth();

  const submitForm = async (event) => {
    event.preventDefault();

    await register({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
      setErrors,
    });
  };

  if (isFetching) {
    return <LoadingSpinner className="h-screen"/>;
  }

  if (user) {
    return <Navigate to="/"/>;
  }

  return (
      <div className="flex items-center justify-center min-h-screen max-w-lg mx-auto">
        <form
            onSubmit={submitForm}
            className="flex flex-col items-center justify-center w-full space-y-4 card bg-white dark:bg-gray-800 glass shadow-xl py-12"
        >
          <h1 className="font-bold text-3xl text-gray-200">Register new account</h1>
          <label className="form-control w-full max-w-md">
            <div className="label">
              <span className="label-text text-gray-200">Name</span>
            </div>
            <input
                className="input input-bordered input-primary w-full max-w-md"
                type="text"
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
            />
            <InputError messages={errors.name} className="mt-2"/>
          </label>
          <label className="form-control w-full max-w-md">
            <div className="label">
              <span className="label-text text-gray-200">E-mail</span>
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
          <label className="form-control w-full max-w-md">
            <div className="label">
              <span className="label-text text-gray-200">Password</span>
            </div>
            <input
                className="input input-bordered input-primary w-full max-w-md"
                id="password"
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                autoComplete="new-password"
            />
            <InputError messages={errors.password} className="mt-2"/>
          </label>
          <label className="form-control w-full max-w-md">
            <div className="label">
              <span className="label-text text-gray-200">Confirm password</span>
            </div>
            <input
                className="input input-bordered input-primary w-full max-w-md"
                id="passwordConfirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(event) => setPasswordConfirmation(event.target.value)}
                required
                autoComplete="new-password"
            />
            <InputError messages={errors.password_confirmation} className="mt-2"/>
          </label>
          <div>
            <span className="text-gray-200">Already have an account? </span>
            <Link className="link link-hover text-success font-bold tracking-wide" to="/login">
              Login
            </Link>
          </div>
          <button
              className="btn btn-primary text-gray-200 w-full max-w-md uppercase tracking-widest font-bold"
              type="submit"
              disabled={isLoading}
          >
            {isLoading ? <span className="loading loading-spinner"></span> : 'sign up'}
          </button>
        </form>
      </div>
  );
}
