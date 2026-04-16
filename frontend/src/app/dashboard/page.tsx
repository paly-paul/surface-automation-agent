'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// ── Types ─────────────────────────────────────────────────────────────────────

interface MenuItem {
  id: string;
  text: string;
  isNew?: boolean;
  isStar?: boolean;
  isCyan?: boolean;
}

// ── Menu data ─────────────────────────────────────────────────────────────────

const EMPLOYER_MENU: MenuItem[] = [
  { id: 'lnkUpdateEmployer',        text: 'Update Employer Details' },
  { id: 'lnkcreateSubunit',         text: 'Create Subunit Registration' },
  { id: 'lnkAccidentReport',        text: 'Accident Report (Form 12)' },
  { id: 'lnkAccidentPdf',           text: 'Accident Report Print / PDF Form' },
  { id: 'lblEmprDeatailsValidation', text: "Employer's Details Validation" },
  { id: 'lnkWageContributoryRecord', text: 'Wage Contributory Record' },
  { id: 'lnkAbstnVerification',     text: 'Reply For Abstention Verification' },
  { id: 'hlviesubunit',             text: 'View Subunit Details',  isNew: true },
  { id: 'hlniccode',                text: 'Update NIC Code',        isNew: true },
  { id: 'hlChangepassword',         text: 'Change Password' },
  { id: 'lnkHelpFiles',             text: 'Employer Help files',   isStar: true },
];

const EMPLOYEE_MENU: MenuItem[] = [
  { id: 'lnkInsertIPDetails',            text: 'Enroll Employee with previously allotted ESI Number' },
  { id: 'lnkRegisterNewIP',              text: 'Register/Enroll New Employee',                         isCyan: true },
  { id: 'lnkUpdateIP',                   text: 'Update Particulars of Insured Person',                 isCyan: true },
  { id: 'lnkmobileseedingEmployees',     text: 'Update Mobile Number of Insured Person',               isCyan: true },
  { id: 'lnkbulkmobileseedingEmployees', text: 'Bulk Upload of Mobile Number',                         isCyan: true },
  { id: 'lnkbulkBankAccountEmployees',   text: 'Bulk Upload of Account Number',                        isCyan: true },
  { id: 'lnkbulkAadhaarEmployees',       text: 'Bulk Aadhaar Seeding',          isNew: true,            isCyan: true },
  { id: 'lnkUploadAccountDoc',           text: 'Upload Bank Account related Document of Insured Person' },
  { id: 'lnkCounterFoil',               text: 'e-Pehchan Card' },
  { id: 'lnkListofEmployees',            text: 'List of Employees' },
  { id: 'lnkhealthpassbook',             text: 'Health Passbook' },
  { id: 'lnkmed11Certificate',           text: 'View Med11 Certificate',        isNew: true },
  { id: 'lnknotification',              text: 'Notification',                   isNew: true },
  { id: 'lnkUAN',                        text: 'Employee UAN Seeding',           isNew: true },
  { id: 'lnkeditip',                     text: 'Edit Employee Workflow',         isNew: true },
  { id: 'lnlAadhaarSeeding',             text: 'Aadhaar Seeding for IP and Dependents' },
  { id: 'lnkdepip',                      text: 'New Born Baby Details for Approval', isNew: true },
  { id: 'lnkviewip',                     text: 'Search IP by Account /Mobile/UAN Number', isNew: true },
];

const CONTRIBUTION_MENU: MenuItem[] = [
  { id: 'lnkMonthlyContribution',  text: 'File Monthly Contributions',                           isCyan: true },
  { id: 'lnkGenerateChallan',      text: 'Generate Challan',                                      isCyan: true },
  { id: 'lnkModifyChallan',        text: 'Modify Challan' },
  { id: 'LnkViewContributionHistory', text: 'ViewContributionHistory' },
  { id: 'lnkInServiceList',        text: 'Omitted Wages Challan' },
  { id: 'lnlledgercontractmaster', text: 'Contractor/Principal Employer Master' },
  { id: 'lnlledgeripmapping',      text: 'IP Mapping with Contractor/Principal Employer' },
  { id: 'lnlledgerbulkipmapping',  text: 'Bulk IP Mapping with Contractor/Principal Employer' },
  { id: 'LnkViewContractorHistory', text: 'View Contribution History(Contractor/Principal Employer Wise)' },
  { id: 'lnkSelfCertification',    text: 'Self Certification' },
  { id: 'lnkForm5',                text: 'View RC' },
  { id: 'lnkRecDef',               text: 'Recovery/Defaulter Challan' },
  { id: 'lnkUrcd',                 text: 'Updation of Unrealized Challan Details',                isCyan: true },
  { id: 'lnkCD',                   text: 'OnlineChallan Doubleverification',                      isCyan: true },
  { id: 'lnkInterestPayment',      text: 'Interest For Delay Payment' },
  { id: 'lnkCosoleMC',             text: 'File Consolidated Monthly Contributions',               isCyan: true },
  { id: 'lnkCosoleChallan',        text: 'Consolidated Monthly Contribution Challan',             isCyan: true },
  { id: 'LnkConsolHistory',        text: 'Consolidated View Contribution History' },
];

// ── Sub-components (defined outside to avoid re-mounting on re-render) ────────

function NewBadge() {
  return (
    <span style={{
      display: 'inline-block',
      background: '#FF4500',
      color: '#fff',
      fontSize: '8px',
      fontWeight: 'bold',
      padding: '1px 4px',
      borderRadius: '2px',
      marginLeft: '3px',
      verticalAlign: 'middle',
      letterSpacing: '0.5px',
    }}>
      NEW
    </span>
  );
}

function StarBadge() {
  return (
    <span style={{ color: '#FFD700', fontSize: '16px', marginLeft: '3px', verticalAlign: 'middle' }}>
      ★
    </span>
  );
}

function MenuLink({ item }: { item: MenuItem }) {
  return (
    <li>
      <span className="innerText">
        <a
          href="#"
          style={{ color: 'blue', backgroundColor: item.isCyan ? 'cyan' : 'transparent' }}
          onClick={(e) => e.preventDefault()}
        >
          {item.text}
        </a>
        {item.isNew  && <NewBadge />}
        {item.isStar && <StarBadge />}
      </span>
      <br /><br />
    </li>
  );
}

function ModalBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const SESSION_TIMEOUT = 1200; // 20 minutes

export default function DashboardPage() {
  const router = useRouter();
  const [username,     setUsername]     = useState('');
  const [employerCode, setEmployerCode] = useState('');
  const [clockTime,    setClockTime]    = useState('');
  const [lastLoginStr, setLastLoginStr] = useState('');
  const [timeLeft,     setTimeLeft]     = useState(SESSION_TIMEOUT);
  const [showAttention, setShowAttention] = useState(false);
  const [showPassword,  setShowPassword]  = useState(false);
  const activityRef = useRef(0);

  // ── Auth guard ───────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { router.replace('/'); return; }

    setUsername(localStorage.getItem('username') || '');
    setEmployerCode(localStorage.getItem('employer_code') || '');

    const now = new Date();
    setLastLoginStr(
      now.toLocaleString('en-IN', {
        weekday: 'long', month: 'long', day: 'numeric',
        year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
      })
    );

    const t = setTimeout(() => setShowAttention(true), 700);
    return () => clearTimeout(t);
  }, [router]);

  // ── Live clock ───────────────────────────────────────────────────────────
  useEffect(() => {
    const tick = () =>
      setClockTime(new Date().toLocaleTimeString('en-IN', { hour12: true }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Session timeout ──────────────────────────────────────────────────────
  useEffect(() => {
    const reset = () => { activityRef.current = 0; };
    document.addEventListener('click',    reset);
    document.addEventListener('keypress', reset);

    const id = setInterval(() => {
      activityRef.current++;
      const rem = SESSION_TIMEOUT - activityRef.current;
      setTimeLeft(rem);
      if (rem <= 0) {
        clearInterval(id);
        localStorage.clear();
        router.replace('/');
      }
    }, 1000);

    return () => {
      clearInterval(id);
      document.removeEventListener('click',    reset);
      document.removeEventListener('keypress', reset);
    };
  }, [router]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    ['access_token', 'username', 'employer_code'].forEach(k => localStorage.removeItem(k));
    router.replace('/');
  };

  const handleAttentionAgree = () => {
    setShowAttention(false);
    setTimeout(() => setShowPassword(true), 200);
  };

  const displayName = employerCode
    ? `${employerCode} (LIN: ${username})`
    : username;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div id="outer">

      {/* ══ HEADER TABLE ══════════════════════════════════════════════════════ */}
      <table id="Table2" cellSpacing={0} cellPadding={0}
             style={{ borderWidth: 0, width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td className="tHeadImage" align="left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo.svg" alt="ESIC"
                   style={{ border: 0, height: '65px' }}
                   onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </td>
            <td className="tHeadImage" align="center" />
            <td className="tHeadImage" align="right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/india_gov_symbol.svg" alt="India Govt Symbol"
                   style={{ border: 0, height: '65px' }}
                   onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </td>
          </tr>
          <tr>
            <td colSpan={3} style={{ height: '28px', width: '100%' }}>
              <table id="Table3" cellSpacing={0} cellPadding={0}
                     style={{ height: '100%', width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td className="dataBlock" align="left" style={{ width: '8%' }}>
                      Employer Login:
                    </td>
                    <td className="dataBlock" align="left" style={{ width: '58%' }}>
                      <span style={{ backgroundColor: 'Transparent', fontSize: '8pt', fontWeight: 'bold' }}>
                        {displayName}
                      </span>
                    </td>
                    <td className="dataBlock" style={{ width: '23%' }}>
                      <div id="raw" style={{ fontFamily: 'Arial', fontSize: '11px' }}>
                        {clockTime}
                      </div>
                    </td>
                    <td className="homelink" align="right" style={{ width: '11%' }}>
                      <button onClick={handleLogout} title="LogOut" className="logout-btn">
                        ⎋ Logout
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ══ LAST LOGIN ════════════════════════════════════════════════════════ */}
      <div className="style4">
        <span id="lastlog"><b>Last Logged In {lastLoginStr}</b></span>
        <span className="session-timer">
          Session expires in: <span id="spanTimeLeft">{timeLeft}</span>s
        </span>
      </div>

      {/* ══ MAIN CONTENT TABLE ════════════════════════════════════════════════ */}
      <table id="Table5" cellSpacing={0} cellPadding={0}
             style={{ borderWidth: 0, width: '100%', borderCollapse: 'collapse' }}>
        <tbody>

          {/* ── Marquee notices ── */}
          <tr>
            <td colSpan={5} style={{ backgroundColor: 'white', width: '100%' }}>
              <div className="marquee-wrapper">
                <div className="marquee-content" style={{ color: 'green', fontWeight: 'bold', fontSize: '15px' }}>
                  Validation of e-mail ID and Mobile number is mandatory in April and October month
                  from 01-04-2025 &nbsp;|&nbsp; The provision for updation/validation of employer
                  mobile number has been updated. For user manual{' '}
                  <a href="#" onClick={e => e.preventDefault()} tabIndex={-1}>Click here</a>
                </div>
              </div>
              <div className="marquee-wrapper" style={{ marginTop: '2px' }}>
                <div className="marquee-content marquee-slow" style={{ color: 'green', fontSize: '15px' }}>
                  The OTP based Two Factor Authentication for employer&apos;s login has been
                  temporarily suspended. A consultation note is being circulated for seeking comments.
                </div>
              </div>
            </td>
          </tr>

          {/* ── Navigation ── */}
          <tr>
            <td colSpan={5} style={{ backgroundColor: 'white', width: '100%' }}>
              <table width="100%" border={0} cellPadding={0} cellSpacing={0}
                     id="tblUser" className="tabBackStyle">
                <tbody>
                  <tr className="navlastData_Section">
                    <td className="navcontentTabletd" align="left" valign="top">
                      <table id="Table1121" width="100%" border={1} cellSpacing={30}>
                        <tbody>
                          <tr style={{ verticalAlign: 'top' }} className="leftTopFormLabel">

                            {/* ── Employer column ── */}
                            <td className="navLinkText" width="34%">
                              <br />
                              <span className="navheaderStyle">Employer</span>
                              <ul className="listStyle">
                                {EMPLOYER_MENU.map(item => (
                                  <MenuLink key={item.id} item={item} />
                                ))}
                              </ul>
                            </td>

                            {/* ── Employee column ── */}
                            <td className="navLinkText" width="33%">
                              <br />
                              <span className="navheaderStyle">Employee (Insured Person)</span>
                              <ul className="listStyle">
                                {EMPLOYEE_MENU.map(item => (
                                  <MenuLink key={item.id} item={item} />
                                ))}
                              </ul>
                            </td>

                            {/* ── Monthly Contribution column ── */}
                            <td className="navLinkText" width="33%">
                              <br />
                              <span className="navheaderStyle">Monthly Contribution</span>
                              <ul className="listStyle">
                                {CONTRIBUTION_MENU.map(item => (
                                  <MenuLink key={item.id} item={item} />
                                ))}
                              </ul>
                            </td>

                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ══ FOOTER ════════════════════════════════════════════════════════════ */}
      <div id="footersection">
        <table id="Table111" cellSpacing={0} cellPadding={0}
               style={{ borderWidth: 0, height: '60px', width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr className="dBlockFooter">
              <td className="dBlockFooter" colSpan={5}>
                DISCLAIMER: © Copyright 2021, ESIC, India. All Rights Reserved.
                Best viewed in 1024 x 768 pixels, Site maintained by : ESIC.
                <br />
                Release Version No.: V2.5.423
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ══ ATTENTION MODAL (Panelbank2) ══════════════════════════════════════ */}
      {showAttention && (
        <ModalBackdrop>
          <div className="esic-modal-box">
            <div className="esic-modal-body" style={{ color: '#742902' }}>
              <br />
              <u><strong>Attention Dear Employers!!</strong></u>
              <br />
              <ol style={{ textAlign: 'justify' }}>
                <li>
                  Insurance Number is unique and is valid for the lifetime of the employee.
                  The employee should not be issued a new Insurance Number for change in employment
                  or location. It shall be your responsibility to ensure that the employee is not
                  already having an Insurance number. Registering again for a New Insurance number
                  is illegal. The employee may be debarred from benefits for the contributions made
                  in the previous Insurance Number.
                </li>
                <br />
                <li>
                  Submission of valid &amp; correct Mobile Number as well as Bank Account details
                  of the employees has been made mandatory.
                </li>
                <br />
                <li>
                  It shall be responsibility of Employer to provide correct information to prevent
                  any fraudulent activity and avoid any legal or administrative consequences thereof.
                </li>
              </ol>
              <u>ध्यान दें प्रिय नियोक्ता !!</u>
              <ol style={{ textAlign: 'justify' }}>
                <li>
                  बीमा संख्या अद्वितीय है और कर्मचारी के जीवनकाल के लिए मान्य है। कर्मचारी को रोजगार
                  या स्थान में परिवर्तन के लिए एक नया बीमा नंबर जारी नहीं किया जाना चाहिए।
                  यह सुनिश्चित करना आपकी ज़िम्मेदारी होगी कि कर्मचारी के पास पहले से बीमा संख्या नहीं है।
                </li>
                <br />
                <li>
                  कर्मचारियों के वैध और सही मोबाइल नंबर के साथ-साथ बैंक खाता विवरण प्रस्तुत करना
                  अनिवार्य कर दिया गया है।
                </li>
                <br />
                <li>
                  किसी भी धोखाधड़ी की गतिविधि को रोकने और उसके किसी भी कानूनी या प्रशासनिक
                  परिणामों से बचने के लिए सही जानकारी प्रदान करना नियोक्ता की जिम्मेदारी होगी।
                </li>
              </ol>
              <br />
            </div>
            <div style={{ textAlign: 'center', paddingTop: '8px' }}>
              <button id="btnpnlcolse" onClick={handleAttentionAgree} className="agree-btn">
                I Agree
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* ══ PASSWORD POLICY MODAL (pnlPwdPolicy) ══════════════════════════════ */}
      {showPassword && (
        <ModalBackdrop>
          <div className="esic-modal-box">
            <div className="esic-modal-body" style={{ color: '#742902', fontWeight: 'bold' }}>
              <br />
              <u>Attention Dear Employers!!</u>
              <br />
              <ol style={{ textAlign: 'justify' }}>
                <li>
                  Register Employees online within 10 days from the date of appointment.
                  <br /><br />
                </li>
                <li>
                  Contribution must be deposited within the due date. Contribution cannot be made
                  online after 42 days from the end date of the contribution period.
                  <br /><br />
                </li>
                <li>
                  ESIC is about to implement a Password Policy so as to facilitate employers login
                  to{' '}
                  <a href="https://www.esic.gov.in/" style={{ color: '#742902' }}>
                    www.esic.gov.in
                  </a>
                  , more securely. Auto-resetting of the Password in a fixed time interval shall
                  be one of the rules. The employer shall be required to reset / renew password,
                  mandatorily, through a mobile OTP based authentication process. OTP shall be sent
                  to the valid, unique, registered mobile number. Hence, you are requested to update
                  your correct &amp; valid mobile number in ESIC database to prevent any login
                  related issues.
                  <br />
                </li>
              </ol>
              <u>ध्यान दें प्रिय नियोक्ता !!</u>
              <ol style={{ textAlign: 'justify' }}>
                <li>
                  नियुक्ति की तारीख से 10 दिनों के भीतर कर्मचारियों को ऑनलाइन पंजीकृत करें।
                  <br /><br />
                </li>
                <li>
                  अंशदान नियत तिथि के भीतर जमा करना होगा। अंशदान अवधि की अंतिम तिथि से 42 दिनों
                  के बाद अंशदान ऑनलाइन नहीं किया जा सकता है।
                  <br /><br />
                </li>
                <li>
                  ESIC अधिक सुरक्षित रूप से www.esic.gov.in पर नियोक्ताओं के लॉगिन की सुविधा
                  प्रदान करने के लिए एक पासवर्ड नीति लागू करने वाला है।
                  <br />
                </li>
              </ol>
              <br />
            </div>
            <div style={{ textAlign: 'center', paddingTop: '8px' }}>
              <button id="btnpnlPwdcolse"
                      onClick={() => setShowPassword(false)}
                      className="agree-btn">
                I Agree
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}

    </div>
  );
}
