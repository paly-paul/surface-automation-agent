'use client';

import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface CaptchaData {
  session_id: string;
  captcha_image: string;
}

export default function LoginPage() {
  const [username, setUsername]       = useState('');
  const [password, setPassword]       = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaData, setCaptchaData] = useState<CaptchaData | null>(null);
  const [errorMessage, setErrorMessage]   = useState('');
  const [captchaError, setCaptchaError]   = useState('');
  const [isLoading, setIsLoading]         = useState(false);

  const fetchCaptcha = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/captcha`);
      if (!res.ok) throw new Error('captcha fetch failed');
      const data: CaptchaData = await res.json();
      setCaptchaData(data);
    } catch {
      console.error('Failed to load captcha – is the backend running?');
    }
  }, []);

  useEffect(() => { fetchCaptcha(); }, [fetchCaptcha]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setCaptchaError('');

    if (!username.trim()) { setErrorMessage('Username is required'); return; }
    if (!password)         { setErrorMessage('Password is required'); return; }
    if (!captchaInput.trim()) { setCaptchaError('Captcha is required'); return; }
    if (!captchaData)      { setCaptchaError('Please wait for captcha to load'); return; }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
          captcha_text: captchaInput.trim(),
          captcha_session_id: captchaData.session_id,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('access_token',  data.access_token);
        localStorage.setItem('username',       data.username);
        localStorage.setItem('employer_code',  data.employer_code ?? '');
        window.location.href = '/dashboard';
      } else {
        const detail: string = data.detail ?? 'Login failed. Please try again.';
        detail.toLowerCase().includes('captcha')
          ? setCaptchaError(detail)
          : setErrorMessage(detail);
        await fetchCaptcha();
        setCaptchaInput('');
      }
    } catch {
      setErrorMessage('Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshCaptcha = (e: React.MouseEvent) => {
    e.preventDefault();
    fetchCaptcha();
    setCaptchaInput('');
    setCaptchaError('');
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <form
        method="post"
        onSubmit={handleLogin}
        id="form1"
        style={{ background: '#fff' }}
      >
        {/* ── Header ── */}
        <div className="container" id="header" style={{ background: '#fff' }}>
          <div className="row" style={{ background: '#fff' }}>
            <div className="col-lg-6">
              <a href="/">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo.png"
                  alt="MainLogo"
                  className="esic-logo"
                  title="Home"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </a>
            </div>
            <div className="col-lg-6">
              <div className="search-container" style={{ float: 'right', marginTop: '5px' }}>
                <a href="https://labour.gov.in/" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/india_gov_symbol.png"
                    alt="Ministry of Labour &amp; Employment"
                    className="govt-logo"
                    title="Minister of Labour &amp; Employment"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main area ── */}
        <div className="loginpageadd">

          {/* Notices */}
          <div className="hedaparaddada">
            <div className="col-md-12" style={{ marginLeft: '50px' }}>
              <p style={{ marginTop: '10px', color: 'red', fontSize: '13px', fontWeight: 600 }}>
                No physical processing of paper is undertaken by ESIC for registration of Employer.
                If there is any complaint to the contrary, the same may be made on{' '}
                <a href="mailto:help-shramsuvidha@gov.in">help-shramsuvidha@gov.in</a>
              </p>
              <br />
              <p style={{ color: '#ab3734', fontSize: '13px', fontWeight: 600 }}>
                We Are Migrating To One Unit One Identifier<br />
                Government of India plans to do away with all employer codes being issued by separate
                labour enforcement agencies such as ESIC, EPFO, O/O ClC(C) and DGMS etc by replacing
                them with new Labour Identification Number (LIN). Your unit has already been allotted
                a LIN and the same can be obtained online using{' '}
                <a href="http://tinyurl.com/whatismylin" target="_blank" rel="noopener noreferrer">
                  http://tinyurl.com/whatismylin
                </a>{' '}
                Please verify the information associated with your LIN before the current employer
                codes are rendered useless. The procedure to verify the information is given in{' '}
                <a href="http://tinyurl.com/shramsuvidhahowto" target="_blank" rel="noopener noreferrer">
                  http://tinyurl.com/shramsuvidhahowto
                </a>{' '}
                For any support please contact{' '}
                <a href="mailto:help-shramsuvidha@gov.in">help-shramsuvidha@gov.in</a>
              </p>
            </div>
          </div>

          <div id="preloader"></div>

          <div className="limiter">
            {/* Hindi toggle */}
            <a id="lnkhindi" className="back-to-top" href="#">
              <i className="fa fa-play">
                <u><span>Hindi</span></u>
              </i>
            </a>

            {/* Login form card */}
            <div className="container-login100" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="wrap-login100 p-l-55 p-r-55 p-t-25 p-b-25">

                <span className="login100-form-title p-b-25">
                  Employer Login
                </span>

                {/* Username */}
                <div className="wrap-input100 validate-input m-b-1">
                  <span className="label-input100">Username/LIN</span>
                  <input
                    name="txtUserName"
                    type="text"
                    id="txtUserName"
                    placeholder="Type your username"
                    className="input100"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <span className="focus-input100" data-symbol=""></span>
                </div>

                {/* Password */}
                <div className="wrap-input100 validate-input m-b-1">
                  <span className="label-input100">Password</span>
                  <input
                    name="txtPassword"
                    type="password"
                    id="txtPassword"
                    placeholder="Type your password"
                    className="input100"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="focus-input100" data-symbol=""></span>
                  {errorMessage && (
                    <span id="lblMessage" style={{ color: 'Red', fontWeight: 'bold' }}>
                      {errorMessage}
                    </span>
                  )}
                </div>

                {/* Captcha */}
                <div className="wrap-input100 validate-input">
                  <span className="label-input100">
                    Captcha
                    {' '}*
                    <span id="rightcaptch">
                      {captchaData ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={captchaData.captcha_image}
                          id="img1"
                          alt="Captcha"
                          style={{ width: '190px', height: '45px' }}
                        />
                      ) : (
                        <span
                          style={{
                            display: 'inline-block',
                            width: 190,
                            height: 45,
                            backgroundColor: '#f0f0f0',
                            verticalAlign: 'middle',
                          }}
                        />
                      )}
                      <a href="#" onClick={handleRefreshCaptcha}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/images/refresh.png"
                          alt="Refresh"
                          style={{ width: '20px', borderRadius: '2px', background: '#fff', padding: '3px' }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).outerHTML =
                              '<span style="cursor:pointer;font-size:20px;vertical-align:middle;">&#x21BA;</span>';
                          }}
                        />
                      </a>
                    </span>
                  </span>
                  <input
                    name="txtChallanCaptcha"
                    type="text"
                    autoComplete="off"
                    id="txtChallanCaptcha"
                    className="input100"
                    placeholder="Type your Captcha"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                  />
                  <span className="focus-input100" data-symbol=""></span>
                  {captchaError && (
                    <span id="lblChallanMessage" style={{ color: 'Red' }}>
                      {captchaError}
                    </span>
                  )}
                </div>

                {/* Sign Up | Forgot password */}
                <div className="text-right p-t-8 p-b-15">
                  <a href="/signup" style={{ width: '50%', float: 'left', textAlign: 'left' }}>
                    Sign Up
                  </a>
                  <a href="/forgot-password">Forgot password?</a>
                </div>

                {/* Login button */}
                <div className="container-login100-form-btn">
                  <div className="wrap-login100-form-btn">
                    <div className="login100-form-bgbtn"></div>
                    <input
                      type="submit"
                      name="btnLogin"
                      value={isLoading ? 'Logging in...' : 'Login'}
                      id="btnLogin"
                      className="login100-form-btn-gou"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Username lookup | Check Password Policy */}
                <div className="text-right p-t-8 p-b-1">
                  <a href="/username-lookup" style={{ width: '50%', float: 'left', textAlign: 'left' }}>
                    Username
                  </a>
                  <a href="/password-policy">Check Password Policy</a>
                </div>

                {/* Common registration */}
                <div className="text-right p-t-1 p-b-15">
                  <a
                    href="https://registration.shramsuvidha.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: '100%', float: 'left', textAlign: 'left', color: 'green', fontWeight: 600 }}
                  >
                    Common Registration Link For ESIC / EPFO
                  </a>
                </div>

                {/* Unified ECR & Manual */}
                <div className="text-right p-t-1 p-b-15">
                  <a
                    href="https://return.shramsuvidha.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: '100%', float: 'left', textAlign: 'left', color: 'green', fontWeight: 600 }}
                  >
                    Unified ECR link for ESIC/EPFO
                  </a>
                  <a
                    href="/manual-employer-registration.pdf"
                    style={{ width: '100%', float: 'left', textAlign: 'left' }}
                  >
                    Manual for Employer and Employee Registration through Portal
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </form>

      {/* ── Footer ── */}
      <footer>
        <div className="footer-area-bottom">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="copyright1" style={{ textAlign: 'right' }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span id="lbllastupdate">Last Updated : 28/10/2020</span>
                </div>
              </div>
            </div>
            <br />
            <div className="row" style={{ padding: '0px 40px' }}>
              <div className="col-lg-4">
                <div className="copyright">
                  © <span>Copyright</span>{' '}
                  <strong><span>ESIC 2026</span></strong>.{' '}
                  <span>All Rights Reserved</span>
                </div>
              </div>
              <div className="col-lg-8" style={{ textAlign: 'right' }}>
                <div className="copyright4">
                  Site maintained by : ESIC. | Visitors Count: 353547376
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
