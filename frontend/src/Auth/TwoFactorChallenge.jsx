import {useEffect, useState} from 'react';
import InputError from '../Components/InputError';
import PrimaryButton from '../Components/PrimaryButton';
import Wrapper from '../Components/Wrapper.jsx';
import axios from '../lib/axios.js';
import LoadingSpinner from '../Components/LoadingSpinner.jsx';
import {useAuth} from '../hooks/auth.js';
import {Navigate} from 'react-router-dom';

export default function TwoFactorChallenge() {
  const [recovery, setRecovery] = useState(false);
  const [code, setCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {user, refetch, isPending} = useAuth();

  const toggleRecovery = () => {
    setRecovery(!recovery);

    if (recovery) {
      setRecoveryCode('');
    } else {
      setCode('');
    }
  };

  const challenge = () => {
    axios.get('/two-factor-authentication-challenge').then((response) => {
      console.log(response);
    }).catch((error) => {
      if (error.response.status) {
        return (window.location.href = '/login');
      }
    }).finally(() => setIsLoading(false));
  };

  useEffect(() => {
    challenge();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setErrors({});
    setProcessing(true);

    const data = recovery ? {recovery_code: recoveryCode} : {code: code};

    axios.post('/two-factor-challenge', data).then(() => refetch()).catch((error) => {
      setErrors(error.response.data.errors);
    }).finally(() => setProcessing(false));
  };

  if (user) {
    return <Navigate to="/" replace={true}/>;
  }

  if (isLoading || isPending) {
    return <LoadingSpinner className="h-screen"/>;
  }

  return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <section className="max-w-xl w-full">
          <Wrapper>
            <div className="mb-4 text-gray-600 dark:text-gray-400">
              {recovery
                  ? 'Please confirm access to your account by entering one of your emergency recovery codes.'
                  : 'Please confirm access to your account by entering the authentication code provided by your authenticator application.'}
            </div>

            <form onSubmit={submit}>
              {recovery ? (
                  <>
                    <label className="form-control w-full max-w-lg">
                      <div className="label">
                        <span className="label-text">Recovery code</span>
                      </div>
                      <input
                          id="recovery_code"
                          value={recoveryCode}
                          onChange={(e) => setRecoveryCode(e.target.value)}
                          type="text"
                          className="input input-bordered input-primary w-full max-w-lg"
                          autoComplete="one-time-code"
                      />
                    </label>
                    <InputError messages={errors.recovery_code}/>
                  </>
              ) : (
                  <>
                    <label className="form-control w-full max-w-lg">
                      <div className="label">
                        <span className="label-text">Code</span>
                      </div>
                      <input
                          id="code"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          type="text"
                          inputMode="numeric"
                          className="input input-bordered input-primary w-full max-w-lg"
                          autoFocus
                          autoComplete="one-time-code"
                      />
                    </label>
                    <InputError messages={errors.code}/>
                  </>
              )}

              <div className="flex items-center justify-end mt-4">
                <button
                    type="button"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 underline cursor-pointer"
                    onClick={toggleRecovery}
                >
                  {recovery ? 'Use an authentication code' : 'Use a recovery code'}
                </button>

                <PrimaryButton className={`ms-4 ${processing ? 'opacity-25' : ''}`} disabled={processing}>
                  Log in
                </PrimaryButton>
              </div>
            </form>
          </Wrapper>
        </section>
      </div>
  );
}
