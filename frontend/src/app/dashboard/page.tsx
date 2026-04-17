'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import EmployeeRegistrationModal from './EmployeeRegistrationModal';

// ── Types ─────────────────────────────────────────────────────────────────────

interface MenuItem {
  id: string;
  text: string;
  isNew?: boolean;
  isStar?: boolean;
  isCyan?: boolean;
}

type EsicAnswer = 'yes' | 'no' | '';
type IdType     = 'aadhaar' | 'other' | '';

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

function MenuLink({ item, onClick }: { item: MenuItem; onClick?: () => void }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
  };
  return (
    <li>
      <span className="innerText">
        <a
          href="#"
          style={{ color: 'blue', backgroundColor: item.isCyan ? 'cyan' : 'transparent' }}
          onClick={handleClick}
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

  // ── Register/Enroll New Employee flow ────────────────────────────────────
  const [showRegister,   setShowRegister]   = useState(false);
  const [regStep,        setRegStep]        = useState(1);
  const [esicAnswer,     setEsicAnswer]     = useState<EsicAnswer>('');
  const [insuranceNo,    setInsuranceNo]    = useState('');
  const [dateOfAppt,     setDateOfAppt]     = useState('');
  const [confirmDecl,    setConfirmDecl]    = useState(false);
  const [mobileNo,       setMobileNo]       = useState('');
  const [mobileValid,    setMobileValid]    = useState(false);
  const [mobileLoading,  setMobileLoading]  = useState(false);
  const [useGenerated,   setUseGenerated]   = useState<boolean | null>(null);
  const [idType,         setIdType]         = useState<IdType>('');
  const [aadhaarNo,      setAadhaarNo]      = useState('');
  const [otherDocType,   setOtherDocType]   = useState('');
  const [otherDocNo,     setOtherDocNo]     = useState('');
  const [docFile,        setDocFile]        = useState<File | null>(null);
  const [docUploaded,    setDocUploaded]    = useState(false);
  const [docUploadError, setDocUploadError] = useState('');
  const [regError,       setRegError]       = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // ── Register Employee handlers ───────────────────────────────────────────
  const openRegisterModal = () => {
    setRegStep(1);
    setEsicAnswer('');
    setInsuranceNo('');
    setDateOfAppt('');
    setConfirmDecl(false);
    setMobileNo('');
    setMobileValid(false);
    setUseGenerated(null);
    setIdType('');
    setAadhaarNo('');
    setOtherDocType('');
    setOtherDocNo('');
    setDocFile(null);
    setDocUploaded(false);
    setDocUploadError('');
    setRegError('');
    setShowRegister(true);
  };

  const closeRegisterModal = () => setShowRegister(false);

  const handleStep1Continue = () => {
    setRegError('');
    if (!esicAnswer) { setRegError('Please select an option.'); return; }
    setRegStep(2);
  };

  const handleStep2Continue = () => {
    setRegError('');
    if (esicAnswer === 'yes') {
      if (!insuranceNo.trim()) { setRegError('Please enter Employee Insurance Number.'); return; }
      if (!dateOfAppt)         { setRegError('Please enter Date of Appointment.'); return; }
    } else {
      if (!confirmDecl) { setRegError('Please confirm the declaration to proceed.'); return; }
    }
    setRegStep(3);
  };

  const handleValidateMobile = async () => {
    setRegError('');
    if (!/^\d{10}$/.test(mobileNo)) {
      setRegError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setMobileLoading(true);
    try {
      const res = await fetch('/api/employee/validate-mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: mobileNo }),
      });
      if (res.ok) {
        setMobileValid(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setRegError(data.detail || 'Mobile validation failed.');
      }
    } catch {
      // Network error – accept locally for demo
      setMobileValid(true);
    } finally {
      setMobileLoading(false);
    }
  };

  const handleStep3Continue = () => {
    setRegError('');
    if (!mobileValid) { setRegError('Please validate the mobile number first.'); return; }
    setRegStep(4);
  };

  const handleStep4Continue = () => {
    setRegError('');
    if (useGenerated === null) { setRegError('Please select an option.'); return; }
    setRegStep(5);
  };

  // Step 5 Continue: Aadhaar → submit; Other Documents → go to step 6 (file upload form)
  const handleStep5Continue = () => {
    setRegError('');
    if (!idType) { setRegError('Please select an ID type.'); return; }
    if (idType === 'aadhaar') {
      if (!/^\d{12}$/.test(aadhaarNo)) {
        setRegError('Please enter a valid 12-digit Aadhaar number.');
        return;
      }
      // Aadhaar path: submit directly and close
      fetch('/api/employee/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          esic_answer: esicAnswer,
          insurance_no: insuranceNo || null,
          date_of_appointment: dateOfAppt || null,
          mobile: mobileNo,
          id_type: 'aadhaar',
          aadhaar_no: aadhaarNo,
          other_doc_type: null,
          other_doc_no: null,
        }),
      }).catch(() => {/* stub */});
      closeRegisterModal();
      return;
    }
    // Other Documents → go to upload form
    setDocFile(null);
    setDocUploaded(false);
    setDocUploadError('');
    setRegStep(6);
  };

  // File selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setDocFile(file);
    setDocUploaded(false);
    setDocUploadError('');
  };

  // Upload button: validate type and size (50 KB – 100 KB)
  const handleFileUpload = () => {
    setDocUploadError('');
    if (!docFile) { setDocUploadError('Please choose a file first.'); return; }
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg'];
    const ext = docFile.name.split('.').pop()?.toLowerCase() ?? '';
    if (!allowed.includes(docFile.type) && !['pdf','jpg','jpeg'].includes(ext)) {
      setDocUploadError('Only PDF, JPG and JPEG files are allowed.');
      return;
    }
    const kb = docFile.size / 1024;
    if (kb < 50 || kb > 100) {
      setDocUploadError(`File size must be between 50 KB and 100 KB. Current size: ${kb.toFixed(1)} KB.`);
      return;
    }
    setDocUploaded(true);
  };

  // Step 6 Continue: validate and submit
  const handleStep6Submit = async () => {
    setRegError('');
    if (!otherDocType) { setRegError('Please select a document type.'); return; }
    if (!otherDocNo.trim()) { setRegError('Please enter the document number.'); return; }
    if (!docUploaded) { setRegError('Please upload the ID document before continuing.'); return; }
    try {
      await fetch('/api/employee/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          esic_answer: esicAnswer,
          insurance_no: insuranceNo || null,
          date_of_appointment: dateOfAppt || null,
          mobile: mobileNo,
          id_type: 'other',
          aadhaar_no: null,
          other_doc_type: otherDocType,
          other_doc_no: otherDocNo,
        }),
      });
    } catch { /* stub */ }
    setRegStep(7);
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
                                  <MenuLink
                                    key={item.id}
                                    item={item}
                                    onClick={item.id === 'lnkRegisterNewIP' ? openRegisterModal : undefined}
                                  />
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

      {/* ══ REGISTER / ENROLL NEW EMPLOYEE MODAL ══════════════════════════════ */}
      {showRegister && regStep <= 6 && (
        <ModalBackdrop>
          <div className={`reg-modal-box${regStep === 6 ? ' reg-modal-box--wide' : ''}`}>

            {/* Header */}
            <div className="reg-modal-header">
              <span>Register New IP (Insured Person)</span>
              <button className="reg-modal-close" onClick={closeRegisterModal} title="Close">✕</button>
            </div>

            <div className="reg-modal-body">

              {/* ── Step indicator (steps 1–5 only; step 6 has its own full-form header) ── */}
              {regStep <= 5 && (
                <div className="reg-step-indicator">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={`reg-step-dot${regStep === s ? ' active' : regStep > s ? ' done' : ''}`}>
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* ─────────── STEP 1 : Was ESIC number ever allotted? ─────────── */}
              {regStep === 1 && (
                <div className="reg-step-content">
                  <p className="reg-question">
                    Was the employee ever allotted an <strong>Insurance (ESIC) Number</strong> before?
                  </p>
                  <div className="reg-radio-group">
                    <label className="reg-radio-label">
                      <input type="radio" name="esic_allotted" value="yes"
                             checked={esicAnswer === 'yes'}
                             onChange={() => { setEsicAnswer('yes'); setRegError(''); }} />
                      &nbsp;Yes
                    </label>
                    <label className="reg-radio-label">
                      <input type="radio" name="esic_allotted" value="no"
                             checked={esicAnswer === 'no'}
                             onChange={() => { setEsicAnswer('no'); setRegError(''); }} />
                      &nbsp;No
                    </label>
                  </div>
                  {regError && <div className="reg-error">{regError}</div>}
                  <div className="reg-btn-row">
                    <button className="reg-btn-primary" onClick={handleStep1Continue}>Continue</button>
                  </div>
                </div>
              )}

              {/* ─────────── STEP 2 (Yes) : Enter Insurance No + Date ─────────── */}
              {regStep === 2 && esicAnswer === 'yes' && (
                <div className="reg-step-content">
                  <p className="reg-note">
                    Please verify that the employee was previously allotted an Insurance Number by
                    filling in the details below.
                  </p>
                  <div className="reg-form-group">
                    <label className="reg-label">Employee Insurance No. <span className="reg-req">*</span></label>
                    <input className="reg-input" type="text" maxLength={17}
                           placeholder="e.g. 1234567890123"
                           value={insuranceNo}
                           onChange={e => { setInsuranceNo(e.target.value); setRegError(''); }} />
                  </div>
                  <div className="reg-form-group">
                    <label className="reg-label">Date of Appointment <span className="reg-req">*</span></label>
                    <input className="reg-input" type="date"
                           value={dateOfAppt}
                           onChange={e => { setDateOfAppt(e.target.value); setRegError(''); }} />
                  </div>
                  {regError && <div className="reg-error">{regError}</div>}
                  <div className="reg-btn-row">
                    <button className="reg-btn-secondary" onClick={() => { setRegStep(1); setRegError(''); }}>Back</button>
                    <button className="reg-btn-primary" onClick={handleStep2Continue}>Continue</button>
                  </div>
                </div>
              )}

              {/* ─────────── STEP 2 (No) : Declaration ─────────── */}
              {regStep === 2 && esicAnswer === 'no' && (
                <div className="reg-step-content">
                  <div className="reg-info-box">
                    <strong>Important Notice:</strong>
                    <p>
                      Insurance Number is unique and is valid for the lifetime of the employee.
                      Registering again for a New Insurance Number is illegal and the employee may
                      be debarred from benefits.
                    </p>
                  </div>
                  <label className="reg-checkbox-label">
                    <input type="checkbox"
                           checked={confirmDecl}
                           onChange={e => { setConfirmDecl(e.target.checked); setRegError(''); }} />
                    &nbsp;I declare and confirm that this employee was <strong>never</strong> allotted
                    an Insurance Number earlier and I take full responsibility for this declaration.
                  </label>
                  {regError && <div className="reg-error">{regError}</div>}
                  <div className="reg-btn-row">
                    <button className="reg-btn-secondary" onClick={() => { setRegStep(1); setRegError(''); }}>Back</button>
                    <button className="reg-btn-primary" onClick={handleStep2Continue}>Continue</button>
                  </div>
                </div>
              )}

              {/* ─────────── STEP 3 : Mobile number ─────────── */}
              {regStep === 3 && (
                <div className="reg-step-content">
                  <p className="reg-note">
                    Enter the employee&apos;s mobile number. It is mandatory to validate the mobile number.
                  </p>
                  <div className="reg-form-group">
                    <label className="reg-label">Mobile Number <span className="reg-req">*</span></label>
                    <div className="reg-input-row">
                      <input className="reg-input" type="text" maxLength={10}
                             placeholder="10-digit mobile number"
                             value={mobileNo}
                             disabled={mobileValid}
                             onChange={e => { setMobileNo(e.target.value.replace(/\D/g, '')); setRegError(''); setMobileValid(false); }} />
                      <button className="reg-btn-validate"
                              disabled={mobileValid || mobileLoading}
                              onClick={handleValidateMobile}>
                        {mobileLoading ? 'Validating…' : mobileValid ? '✓ Validated' : 'Validate'}
                      </button>
                    </div>
                  </div>
                  {mobileValid && (
                    <div className="reg-success-msg">
                      Mobile number validated successfully.
                    </div>
                  )}
                  {regError && <div className="reg-error">{regError}</div>}
                  <div className="reg-btn-row">
                    <button className="reg-btn-secondary" onClick={() => { setRegStep(2); setRegError(''); }}>Back</button>
                    <button className="reg-btn-primary" onClick={handleStep3Continue}>Continue</button>
                  </div>
                </div>
              )}

              {/* ─────────── STEP 4 : Use earlier generated number? ─────────── */}
              {regStep === 4 && (
                <div className="reg-step-content">
                  <div className="reg-info-box">
                    <p>
                      An Insurance Number may have been generated earlier for this employee but
                      not yet activated. Do you want to use the earlier generated Insurance Number?
                    </p>
                  </div>
                  <div className="reg-radio-group">
                    <label className="reg-radio-label">
                      <input type="radio" name="use_generated" value="yes"
                             checked={useGenerated === true}
                             onChange={() => { setUseGenerated(true); setRegError(''); }} />
                      &nbsp;Yes, use the earlier generated number
                    </label>
                    <label className="reg-radio-label">
                      <input type="radio" name="use_generated" value="no"
                             checked={useGenerated === false}
                             onChange={() => { setUseGenerated(false); setRegError(''); }} />
                      &nbsp;No, generate a new number
                    </label>
                  </div>
                  {regError && <div className="reg-error">{regError}</div>}
                  <div className="reg-btn-row">
                    <button className="reg-btn-secondary" onClick={() => { setRegStep(3); setRegError(''); }}>Back</button>
                    <button className="reg-btn-primary" onClick={handleStep4Continue}>Continue</button>
                  </div>
                </div>
              )}

              {/* ─────────── STEP 5 : Select ID type for identification ─────────── */}
              {regStep === 5 && (
                <div className="reg-step-content">
                  <p className="reg-note">
                    Please select the type of identity document you will provide for the employee.
                    If you select <strong>Other Documents</strong>, you will be asked to upload a
                    scanned copy on the next screen.
                  </p>
                  <div className="reg-form-group">
                    <label className="reg-label">Select ID Type for Identification <span className="reg-req">*</span></label>
                    <div className="reg-radio-group">
                      <label className="reg-radio-label">
                        <input type="radio" name="id_type" value="aadhaar"
                               checked={idType === 'aadhaar'}
                               onChange={() => { setIdType('aadhaar'); setAadhaarNo(''); setRegError(''); }} />
                        &nbsp;Aadhaar
                      </label>
                      <label className="reg-radio-label">
                        <input type="radio" name="id_type" value="other"
                               checked={idType === 'other'}
                               onChange={() => { setIdType('other'); setAadhaarNo(''); setRegError(''); }} />
                        &nbsp;Other Documents
                      </label>
                    </div>
                  </div>

                  {idType === 'aadhaar' && (
                    <div className="reg-form-group">
                      <label className="reg-label">Aadhaar Number <span className="reg-req">*</span></label>
                      <input className="reg-input" type="text" maxLength={12}
                             placeholder="12-digit Aadhaar number"
                             value={aadhaarNo}
                             onChange={e => { setAadhaarNo(e.target.value.replace(/\D/g, '')); setRegError(''); }} />
                    </div>
                  )}

                  {regError && <div className="reg-error">{regError}</div>}
                  <div className="reg-btn-row">
                    <button className="reg-btn-secondary" onClick={() => { setRegStep(4); setRegError(''); }}>Back</button>
                    <button className="reg-btn-primary" onClick={handleStep5Continue}>
                      {idType === 'other' ? 'Continue' : 'Submit'}
                    </button>
                  </div>
                </div>
              )}

              {/* ─────────── STEP 6 : Employee Registration – document upload form ─────────── */}
              {regStep === 6 && (
                <div className="reg-step-content">
                  {/* Section header bar */}
                  <div className="reg-er-section-header">Employee Registration</div>

                  <table className="reg-er-table">
                    <tbody>
                      {/* Employer code */}
                      <tr>
                        <td className="reg-er-label-cell">Employer/Subunit Code No.:<span className="reg-req">*</span></td>
                        <td className="reg-er-field-cell">
                          <input className="reg-input" type="text"
                                 value={employerCode} readOnly
                                 style={{ backgroundColor: '#f5f5f5', width: '220px' }} />
                        </td>
                      </tr>

                      {/* ID type radio (pre-selected as Other Documents) */}
                      <tr>
                        <td className="reg-er-label-cell">Select ID Type for Identification:<span className="reg-req">*</span></td>
                        <td className="reg-er-field-cell">
                          <label style={{ marginRight: '16px', fontSize: '13px' }}>
                            <input type="radio" name="er_id_type" value="aadhaar"
                                   checked={idType === 'aadhaar'}
                                   onChange={() => { setIdType('aadhaar'); setRegError(''); }} />
                            &nbsp;Aadhaar
                          </label>
                          <label style={{ fontSize: '13px' }}>
                            <input type="radio" name="er_id_type" value="other"
                                   checked={idType === 'other'}
                                   onChange={() => { setIdType('other'); setRegError(''); }} />
                            &nbsp;Other Documents
                          </label>
                        </td>
                      </tr>

                      {/* Select ID Type dropdown */}
                      <tr>
                        <td className="reg-er-label-cell">Select ID Type:<span className="reg-req">*</span></td>
                        <td className="reg-er-field-cell">
                          <select className="reg-input" style={{ width: '220px' }}
                                  value={otherDocType}
                                  onChange={e => { setOtherDocType(e.target.value); setRegError(''); }}>
                            <option value="">-- Select Type --</option>
                            <option value="passport">Passport</option>
                            <option value="voter_id">Voter ID Card</option>
                            <option value="driving_licence">Driving Licence</option>
                            <option value="pan">PAN Card</option>
                            <option value="ration_card">Ration Card</option>
                            <option value="bank_passbook">Bank Passbook</option>
                          </select>
                        </td>
                      </tr>

                      {/* ID Number */}
                      <tr>
                        <td className="reg-er-label-cell">ID Number:<span className="reg-req">*</span></td>
                        <td className="reg-er-field-cell">
                          <input className="reg-input" type="text" style={{ width: '220px' }}
                                 placeholder="Enter document number"
                                 value={otherDocNo}
                                 onChange={e => { setOtherDocNo(e.target.value); setRegError(''); }} />
                        </td>
                      </tr>

                      {/* ID Document upload */}
                      <tr>
                        <td className="reg-er-label-cell" style={{ verticalAlign: 'top', paddingTop: '10px' }}>
                          ID Document:<span className="reg-req">*</span>
                        </td>
                        <td className="reg-er-field-cell">
                          {/* Hidden real file input */}
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept=".pdf,.jpg,.jpeg"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                          />
                          <div className="reg-er-file-row">
                            <button className="reg-er-choose-btn"
                                    onClick={() => fileInputRef.current?.click()}>
                              Choose File
                            </button>
                            <span className="reg-er-filename">
                              {docFile ? docFile.name : 'No file chosen'}
                            </span>
                            <button className="reg-er-upload-btn"
                                    onClick={handleFileUpload}
                                    disabled={!docFile || docUploaded}>
                              Upload
                            </button>
                          </div>
                          {docUploaded && (
                            <div className="reg-success-msg" style={{ marginTop: '6px' }}>
                              File uploaded successfully.
                            </div>
                          )}
                          {docUploadError && (
                            <div className="reg-error" style={{ marginTop: '6px' }}>
                              {docUploadError}
                            </div>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Notes */}
                  <div className="reg-er-notes">
                    <strong>Note**</strong><br />
                    1. Document type allowed pdf, jpg &amp; jpeg.<br />
                    2. Maximum size of the Document should be 50–100 KB.<br />
                    3. User must upload any one ID for Identification.
                  </div>

                  {regError && <div className="reg-error" style={{ margin: '8px 0' }}>{regError}</div>}

                  <div className="reg-btn-row" style={{ justifyContent: 'center' }}>
                    <button className="reg-btn-primary" onClick={handleStep6Submit}>Continue</button>
                    <button className="reg-btn-secondary" onClick={closeRegisterModal}>Cancel</button>
                  </div>
                </div>
              )}

            </div>{/* reg-modal-body */}
          </div>{/* reg-modal-box */}
        </ModalBackdrop>
      )}

      {/* ══ EMPLOYEE REGISTRATION FORM MODAL (Step 7) ═══════════════════════════ */}
      {showRegister && regStep === 7 && (
        <ModalBackdrop>
          <EmployeeRegistrationModal
            employerCode={employerCode}
            mobileNo={mobileNo}
            idType={idType}
            otherDocType={otherDocType}
            otherDocNo={otherDocNo}
            aadhaarNo={aadhaarNo}
            onClose={closeRegisterModal}
          />
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
