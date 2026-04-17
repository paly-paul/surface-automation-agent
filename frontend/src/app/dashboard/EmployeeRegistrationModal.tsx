'use client';

import { useState, useEffect } from 'react';

interface EmployeeRegistrationModalProps {
  employerCode: string;
  mobileNo: string;
  idType: string;
  otherDocType?: string;
  otherDocNo?: string;
  aadhaarNo?: string;
  onClose: () => void;
}

interface FamilyRow {
  name: string;
  dateOfBirth: string;
  relationship: string;
  residing: string;
  placeOfResidence: string;
  photoFile?: File;
}

interface BankRow {
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  micr: string;
  accountType: string;
  docFile?: File;
}

function NomineeModal({ onClose, onSave }: { onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    name: '',
    relationship: '',
    addressLine: '',
    state: '',
    district: '',
    pincode: '',
    phone: '',
    mobile: '',
    isFamilyMember: 'No',
  });

  const handleSubmit = () => {
    if (!form.name.trim() || !form.relationship) {
      alert('Name and Relationship are required.');
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <div className="submodal-backdrop">
      <div className="submodal-box">
        <div style={{ padding: '16px', borderBottom: '1px solid #ccc' }}>
          <h3 style={{ margin: 0, color: '#742902', fontSize: '14px', fontWeight: 'bold' }}>
            Details of Nominee u/s 71 of ESI Act 1948/Rule 56(2)
          </h3>
          <p className="submodal-req-note">* Required Fields</p>
        </div>
        <div className="submodal-body">
          <table className="erform-table" style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td className="erform-label-cell">Name :</td>
                <td className="erform-field-cell">
                  <input
                    type="text"
                    className="erform-input-full"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Name"
                  />
                </td>
                <td className="erform-label-cell">Relationship with I.P :</td>
                <td className="erform-field-cell">
                  <select
                    className="erform-input-full"
                    value={form.relationship}
                    onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                  >
                    <option>--Please Select--</option>
                    <option>Spouse</option>
                    <option>Child</option>
                    <option>Parent</option>
                    <option>Sibling</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="erform-label-cell">Address :</td>
                <td colSpan={3} className="erform-field-cell">
                  <input
                    type="text"
                    className="erform-input-full"
                    value={form.addressLine}
                    onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
                    placeholder="Address"
                  />
                </td>
              </tr>
              <tr>
                <td className="erform-label-cell">State :</td>
                <td className="erform-field-cell">
                  <select
                    className="erform-input-full"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                  >
                    <option>--Please Select--</option>
                    <option>Kerala</option>
                    <option>Tamil Nadu</option>
                  </select>
                </td>
                <td className="erform-label-cell">District :</td>
                <td className="erform-field-cell">
                  <select
                    className="erform-input-full"
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                  >
                    <option>--Please Select--</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="erform-label-cell">Pincode :</td>
                <td className="erform-field-cell">
                  <input
                    type="text"
                    className="erform-input-std"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  />
                </td>
                <td className="erform-label-cell">Phone No. :</td>
                <td className="erform-field-cell">
                  <input
                    type="text"
                    className="erform-input-std"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </td>
              </tr>
              <tr>
                <td className="erform-label-cell">Mobile No. :</td>
                <td className="erform-field-cell">
                  <div className="erform-phone-row">
                    <span>91</span>
                    <input
                      type="text"
                      className="erform-input-std"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    />
                  </div>
                </td>
                <td className="erform-label-cell">Is Nominee a Family Member :</td>
                <td className="erform-field-cell">
                  <label style={{ marginRight: '12px' }}>
                    <input
                      type="radio"
                      value="Yes"
                      checked={form.isFamilyMember === 'Yes'}
                      onChange={(e) => setForm({ ...form, isFamilyMember: e.target.value })}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="No"
                      checked={form.isFamilyMember === 'No'}
                      onChange={(e) => setForm({ ...form, isFamilyMember: e.target.value })}
                    />
                    No
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px', borderTop: '1px solid #ccc', textAlign: 'center' }}>
          <button className="erform-link-btn" onClick={handleSubmit} style={{ marginRight: '8px' }}>
            Save
          </button>
          <button className="erform-link-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function FamilyModal({ onClose, onSave }: { onClose: () => void; onSave: (data: FamilyRow[]) => void }) {
  const [rows, setRows] = useState<FamilyRow[]>([]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        name: '',
        dateOfBirth: '',
        relationship: '',
        residing: 'No',
        placeOfResidence: '',
      },
    ]);
  };

  const handleRemoveRow = (idx: number) => {
    setRows(rows.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (rows.length === 0) {
      alert('Please add at least one family member.');
      return;
    }
    for (const row of rows) {
      if (!row.name.trim() || !row.dateOfBirth || !row.relationship) {
        alert('All fields are required for each family member.');
        return;
      }
    }
    onSave(rows);
    onClose();
  };

  return (
    <div className="submodal-backdrop">
      <div className="submodal-box--wide">
        <div style={{ padding: '16px', borderBottom: '1px solid #ccc' }}>
          <h3 style={{ margin: 0, color: '#742902', fontSize: '14px', fontWeight: 'bold' }}>
            Add Family Particulars Of Insured Person - Form 1A
          </h3>
          <p className="submodal-req-note">* Required Fields</p>
        </div>
        <div className="submodal-body">
          {rows.length > 0 && (
            <table className="erform-family-table">
              <thead>
                <tr>
                  <th className="erform-th">Name</th>
                  <th className="erform-th">Date of Birth</th>
                  <th className="erform-th">Relationship</th>
                  <th className="erform-th">Residing?</th>
                  <th className="erform-th">Place of Residence</th>
                  <th className="erform-th">Photo</th>
                  <th className="erform-th">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => {
                          const updated = [...rows];
                          updated[idx].name = e.target.value;
                          setRows(updated);
                        }}
                        style={{ width: '100%', padding: '4px' }}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={row.dateOfBirth}
                        onChange={(e) => {
                          const updated = [...rows];
                          updated[idx].dateOfBirth = e.target.value;
                          setRows(updated);
                        }}
                        style={{ width: '100%', padding: '4px' }}
                      />
                    </td>
                    <td>
                      <select
                        value={row.relationship}
                        onChange={(e) => {
                          const updated = [...rows];
                          updated[idx].relationship = e.target.value;
                          setRows(updated);
                        }}
                        style={{ width: '100%', padding: '4px' }}
                      >
                        <option>--Please Select--</option>
                        <option>Spouse</option>
                        <option>Child</option>
                        <option>Parent</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <label>
                        <input
                          type="radio"
                          value="Yes"
                          checked={row.residing === 'Yes'}
                          onChange={(e) => {
                            const updated = [...rows];
                            updated[idx].residing = e.target.value;
                            setRows(updated);
                          }}
                        />
                        Yes
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="No"
                          checked={row.residing === 'No'}
                          onChange={(e) => {
                            const updated = [...rows];
                            updated[idx].residing = e.target.value;
                            setRows(updated);
                          }}
                        />
                        No
                      </label>
                    </td>
                    <td>
                      <select
                        value={row.placeOfResidence}
                        onChange={(e) => {
                          const updated = [...rows];
                          updated[idx].placeOfResidence = e.target.value;
                          setRows(updated);
                        }}
                        style={{ width: '100%', padding: '4px' }}
                      >
                        <option>--Please Select--</option>
                        <option>Place A</option>
                        <option>Place B</option>
                      </select>
                    </td>
                    <td>
                      <input type="file" accept="image/*" style={{ fontSize: '11px' }} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleRemoveRow(idx)}
                        style={{
                          background: '#d32f2f',
                          color: '#fff',
                          padding: '4px 8px',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button
              className="erform-link-btn"
              onClick={handleAddRow}
              style={{ background: '#c9a961', marginBottom: '12px' }}
            >
              Add
            </button>
          </div>
        </div>
        <div style={{ padding: '12px', borderTop: '1px solid #ccc', textAlign: 'center' }}>
          <button className="erform-link-btn" onClick={handleSubmit} style={{ marginRight: '8px' }}>
            Submit
          </button>
          <button className="erform-link-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function BankModal({ onClose, onSave }: { onClose: () => void; onSave: (data: BankRow) => void }) {
  const [form, setForm] = useState({
    ifscCode: '',
    bankName: '',
    branchName: '',
    accountNumber: '',
    micr: '',
    accountType: '',
    docFile: null as File | null,
  });

  const handleIfscSearch = () => {
    const code = form.ifscCode.toUpperCase();
    if (code.startsWith('ICIC')) {
      setForm({ ...form, bankName: 'ICICI BANK LIMITED' });
    } else if (code.startsWith('SBIN')) {
      setForm({ ...form, bankName: 'SBI' });
    } else if (code.startsWith('HDFC')) {
      setForm({ ...form, bankName: 'HDFC BANK LIMITED' });
    } else {
      alert('IFSC Code not found. Please enter valid code.');
    }
  };

  const handleSubmit = () => {
    if (!form.ifscCode || !form.bankName || !form.accountNumber || !form.accountType) {
      alert('Please fill all required fields.');
      return;
    }
    if (!form.docFile) {
      alert('Please upload bank document.');
      return;
    }
    onSave({
      ifscCode: form.ifscCode,
      bankName: form.bankName,
      branchName: form.branchName,
      accountNumber: form.accountNumber,
      micr: form.micr,
      accountType: form.accountType,
    });
    onClose();
  };

  return (
    <div className="submodal-backdrop">
      <div className="submodal-box">
        <div style={{ padding: '16px', borderBottom: '1px solid #ccc' }}>
          <h3 style={{ margin: 0, color: '#742902', fontSize: '14px', fontWeight: 'bold' }}>
            Bank Details of Insured Person
          </h3>
          <p className="submodal-req-note">* Required Fields</p>
        </div>
        <div className="submodal-body">
          <div className="erform-ifsc-row" style={{ marginBottom: '16px' }}>
            <label className="erform-ifsc-label">IFSC Code :</label>
            <input
              type="text"
              value={form.ifscCode}
              onChange={(e) => setForm({ ...form, ifscCode: e.target.value })}
              placeholder="ICIC0006237"
              style={{ padding: '6px', width: '180px' }}
            />
            <button onClick={handleIfscSearch} style={{ padding: '6px 12px', marginLeft: '8px' }}>
              Search
            </button>
          </div>

          <table className="erform-table" style={{ width: '100%' }}>
            <tbody>
              <tr style={{ background: '#e8e8e8' }}>
                <td colSpan={2} style={{ textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>
                  Bank Details of Insured Person
                </td>
              </tr>
              <tr>
                <td className="erform-label-cell">Bank Name :</td>
                <td className="erform-field-cell">
                  <input
                    type="text"
                    className="erform-readonly"
                    value={form.bankName}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td className="erform-label-cell">Account Number :</td>
                <td className="erform-field-cell">
                  <input
                    type="text"
                    className="erform-input-full"
                    value={form.accountNumber}
                    onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  />
                </td>
              </tr>
              <tr>
                <td className="erform-label-cell">IFSC :</td>
                <td className="erform-field-cell">
                  <input
                    type="text"
                    className="erform-readonly"
                    value={form.ifscCode}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td className="erform-label-cell">MICR Code :</td>
                <td className="erform-field-cell">
                  <input
                    type="text"
                    className="erform-input-full"
                    value={form.micr}
                    onChange={(e) => setForm({ ...form, micr: e.target.value })}
                  />
                </td>
              </tr>
              <tr>
                <td className="erform-label-cell">Branch Name :</td>
                <td className="erform-field-cell">
                  <input
                    type="text"
                    className="erform-input-full"
                    value={form.branchName}
                    onChange={(e) => setForm({ ...form, branchName: e.target.value })}
                  />
                </td>
              </tr>
              <tr>
                <td className="erform-label-cell">Account Type :</td>
                <td className="erform-field-cell">
                  <select
                    className="erform-input-full"
                    value={form.accountType}
                    onChange={(e) => setForm({ ...form, accountType: e.target.value })}
                  >
                    <option>--Select Account Type--</option>
                    <option>Savings</option>
                    <option>Current</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="erform-label-cell">Document :</td>
                <td className="erform-field-cell">
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="file"
                      onChange={(e) => setForm({ ...form, docFile: e.target.files?.[0] || null })}
                      accept=".pdf,.jpg,.jpeg"
                    />
                    <span style={{ fontSize: '12px', color: '#d32f2f' }}>
                      Max 200 KB (pdf, jpg, jpeg)
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px', borderTop: '1px solid #ccc', textAlign: 'center' }}>
          <button className="erform-link-btn" onClick={handleSubmit} style={{ marginRight: '8px' }}>
            Submit
          </button>
          <button className="erform-link-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EmployeeRegistrationModal({
  employerCode,
  mobileNo,
  idType,
  otherDocType,
  otherDocNo,
  aadhaarNo,
  onClose,
}: EmployeeRegistrationModalProps) {
  const [showNomineeModal, setShowNomineeModal] = useState(false);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [declarationChecked, setDeclarationChecked] = useState(false);

  const [formData, setFormData] = useState({
    isDisabled: 'No',
    disabilityType: '',
    disabilityCert: null as File | null,
    name: '',
    nameOf: '',
    dateOfBirth: '',
    selfPhoto: null as File | null,
    maritalStatus: 'Unmarried',
    gender: 'M',
    presentAddress: '',
    presentPinCode: '',
    presentPhone: '',
    presentMobile: '',
    presentState: '',
    presentDistrict: '',
    presentEmail: '',
    copyAddress: false,
    permanentAddress: '',
    permanentPinCode: '',
    permanentPhone: '',
    permanentMobile: '',
    permanentState: '',
    permanentDistrict: '',
    permanentEmail: '',
    dispensary14a: '',
    dispensary14aType: 'Dispensary',
    dispensary14aDistrict: '',
    dispensary14aAddress: '',
    dispensary14b: '',
    dispensary14bType: 'Dispensary',
    dispensary14bDistrict: '',
    dispensary14bAddress: '',
    employerCode,
    employerDateOfAppt: '',
    employerName: '',
    employerAddress1: '',
    employerState: '',
    employerDistrict: '',
    employerSubDistrict: '',
    employerVillage: '',
    employerPinCode: '',
    employerEmail: '',
    employerPhone: '',
    employerMobile: '',
    hasPreviousEmployer: 'No',
    prevEmployerCode: '',
    prevInsuranceNo: '',
    prevEmployerName: '',
    prevEmployerAddress1: '',
    prevEmployerState: '',
    prevEmployerDistrict: '',
    prevEmployerSubDistrict: '',
    prevEmployerVillage: '',
    prevEmployerPinCode: '',
    prevEmployerEmail: '',
    prevEmployerPhone: '',
    prevEmployerMobile: '',
    smsLanguage: '',
  });

  useEffect(() => {
    if (formData.copyAddress) {
      setFormData((prev) => ({
        ...prev,
        permanentAddress: prev.presentAddress,
        permanentPinCode: prev.presentPinCode,
        permanentPhone: prev.presentPhone,
        permanentMobile: prev.presentMobile,
        permanentState: prev.presentState,
        permanentDistrict: prev.presentDistrict,
        permanentEmail: prev.presentEmail,
      }));
    }
  }, [
    formData.copyAddress,
    formData.presentAddress,
    formData.presentPinCode,
    formData.presentPhone,
    formData.presentMobile,
    formData.presentState,
    formData.presentDistrict,
    formData.presentEmail,
  ]);

  const handleReset = () => {
    setFormData({
      isDisabled: 'No',
      disabilityType: '',
      disabilityCert: null,
      name: '',
      nameOf: '',
      dateOfBirth: '',
      selfPhoto: null,
      maritalStatus: 'Unmarried',
      gender: 'M',
      presentAddress: '',
      presentPinCode: '',
      presentPhone: '',
      presentMobile: '',
      presentState: '',
      presentDistrict: '',
      presentEmail: '',
      copyAddress: false,
      permanentAddress: '',
      permanentPinCode: '',
      permanentPhone: '',
      permanentMobile: '',
      permanentState: '',
      permanentDistrict: '',
      permanentEmail: '',
      dispensary14a: '',
      dispensary14aType: 'Dispensary',
      dispensary14aDistrict: '',
      dispensary14aAddress: '',
      dispensary14b: '',
      dispensary14bType: 'Dispensary',
      dispensary14bDistrict: '',
      dispensary14bAddress: '',
      employerCode,
      employerDateOfAppt: '',
      employerName: '',
      employerAddress1: '',
      employerState: '',
      employerDistrict: '',
      employerSubDistrict: '',
      employerVillage: '',
      employerPinCode: '',
      employerEmail: '',
      employerPhone: '',
      employerMobile: '',
      hasPreviousEmployer: 'No',
      prevEmployerCode: '',
      prevInsuranceNo: '',
      prevEmployerName: '',
      prevEmployerAddress1: '',
      prevEmployerState: '',
      prevEmployerDistrict: '',
      prevEmployerSubDistrict: '',
      prevEmployerVillage: '',
      prevEmployerPinCode: '',
      prevEmployerEmail: '',
      prevEmployerPhone: '',
      prevEmployerMobile: '',
      smsLanguage: '',
    });
    setDeclarationChecked(false);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('Name is required.');
      return;
    }
    if (!formData.dateOfBirth) {
      alert('Date of Birth is required.');
      return;
    }
    if (!formData.selfPhoto) {
      alert('Self Photo is required.');
      return;
    }
    if (!declarationChecked) {
      alert('Please accept the declaration to proceed.');
      return;
    }
    try {
      const response = await fetch('/api/employee/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employerCode: formData.employerCode,
          mobileNo,
          idType,
          otherDocType,
          otherDocNo,
          aadhaarNo,
          insuredPersonName: formData.name,
          ...formData,
        }),
      });
      if (response.ok) {
        alert('Employee registration submitted successfully!');
        onClose();
      } else {
        alert('Failed to submit registration.');
      }
    } catch (error) {
      alert('Error submitting registration.');
      console.error(error);
    }
  };

  return (
    <div className="erform-modal-box">
      {/* Breadcrumb */}
      <div className="erform-breadcrumb">
        Employer &gt; Employee Registration
      </div>

      {/* Title */}
      <div className="erform-section-title">
        Employees Registration Form-1
      </div>
      <p className="erform-required-note">* Required Fields</p>

      {/* Form Body */}
      <div className="erform-body">
        {/* ══ Insured Person's Particulars ══ */}
        <div className="erform-subsection-header">Insured Person's Particulars</div>

        <table className="erform-table">
          <tbody>
            {/* 1.a: IP Disabled */}
            <tr>
              <td className="erform-label-cell">1.(a) Is IP Disabled:</td>
              <td className="erform-field-cell">
                <label style={{ marginRight: '12px' }}>
                  <input
                    type="radio"
                    value="Yes"
                    checked={formData.isDisabled === 'Yes'}
                    onChange={(e) => setFormData({ ...formData, isDisabled: e.target.value })}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    value="No"
                    checked={formData.isDisabled === 'No'}
                    onChange={(e) => setFormData({ ...formData, isDisabled: e.target.value })}
                  />
                  No
                </label>
              </td>
              <td className="erform-label-cell">1.(b) Type of Disability:</td>
              <td className="erform-field-cell">
                {formData.isDisabled === 'Yes' ? (
                  <select
                    className="erform-input-full"
                    value={formData.disabilityType}
                    onChange={(e) => setFormData({ ...formData, disabilityType: e.target.value })}
                  >
                    <option>--Please Select--</option>
                    <option>Permanent</option>
                    <option>Temporary</option>
                  </select>
                ) : (
                  <span style={{ color: '#999' }}>N/A</span>
                )}
              </td>
            </tr>

            {/* 1.c: Disability Certificate */}
            {formData.isDisabled === 'Yes' && (
              <tr>
                <td className="erform-label-cell">1.(c) Select Certificate:</td>
                <td colSpan={3} className="erform-field-cell">
                  <div className="reg-er-file-row">
                    <input type="file" accept=".pdf,.jpg,.jpeg" />
                    <button className="reg-er-upload-btn">Upload</button>
                  </div>
                </td>
              </tr>
            )}

            {/* 2: Name */}
            <tr>
              <td className="erform-label-cell">2. Name:</td>
              <td className="erform-field-cell">
                <input
                  type="text"
                  className="erform-input-full"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </td>
              <td className="erform-label-cell">3. Name of (F/H):</td>
              <td className="erform-field-cell">
                <input
                  type="text"
                  className="erform-input-full"
                  value={formData.nameOf}
                  onChange={(e) => setFormData({ ...formData, nameOf: e.target.value })}
                />
              </td>
            </tr>

            {/* 4: Date of Birth */}
            <tr>
              <td className="erform-label-cell">4. Date of Birth:</td>
              <td className="erform-field-cell">
                <input
                  type="date"
                  className="erform-input-full"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </td>
              <td className="erform-label-cell">5. Upload Self Photo:</td>
              <td className="erform-field-cell">
                <div className="reg-er-file-row">
                  <input
                    type="file"
                    accept=".jpg,.jpeg"
                    onChange={(e) =>
                      setFormData({ ...formData, selfPhoto: e.target.files?.[0] || null })
                    }
                  />
                  <button className="reg-er-upload-btn">Upload Photo</button>
                </div>
              </td>
            </tr>

            {/* 6: Marital Status */}
            <tr>
              <td className="erform-label-cell">6. Marital Status:</td>
              <td className="erform-field-cell">
                <select
                  className="erform-input-full"
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                >
                  <option>Unmarried</option>
                  <option>Married</option>
                  <option>Widowed</option>
                  <option>Divorced</option>
                </select>
              </td>
              <td className="erform-label-cell">7. Gender:</td>
              <td className="erform-field-cell">
                <label style={{ marginRight: '12px' }}>
                  <input
                    type="radio"
                    value="M"
                    checked={formData.gender === 'M'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  />
                  M
                </label>
                <label style={{ marginRight: '12px' }}>
                  <input
                    type="radio"
                    value="F"
                    checked={formData.gender === 'F'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  />
                  F
                </label>
                <label>
                  <input
                    type="radio"
                    value="TG"
                    checked={formData.gender === 'TG'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  />
                  TG
                </label>
              </td>
            </tr>

            {/* 8-11: ID details */}
            <tr>
              <td className="erform-label-cell">8. ID Type for Identification:</td>
              <td className="erform-field-cell">
                <input
                  type="text"
                  className="erform-readonly"
                  value={idType === 'aadhaar' ? 'Aadhaar' : otherDocType || ''}
                  readOnly
                />
              </td>
              <td className="erform-label-cell">9. View Document of Identification:</td>
              <td className="erform-field-cell">
                <a href="#" style={{ color: '#0066cc', textDecoration: 'underline' }}>
                  View Document
                </a>
              </td>
            </tr>

            <tr>
              <td className="erform-label-cell">10. ID Number:</td>
              <td className="erform-field-cell">
                <input
                  type="text"
                  className="erform-readonly"
                  value={idType === 'aadhaar' ? aadhaarNo || '' : otherDocNo || ''}
                  readOnly
                />
              </td>
              <td className="erform-label-cell">11. Aadhaar Status:</td>
              <td className="erform-field-cell">
                <span style={{ color: '#d32f2f' }}>Not Verified</span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ══ Present Address ══ */}
        <div className="erform-subsection-header">12. Present Address</div>

        <table className="erform-table">
          <tbody>
            <tr>
              <td className="erform-label-cell">Address :</td>
              <td colSpan={3} className="erform-field-cell">
                <textarea
                  className="erform-input-full"
                  value={formData.presentAddress}
                  onChange={(e) => setFormData({ ...formData, presentAddress: e.target.value })}
                  rows={3}
                />
              </td>
            </tr>
            <tr>
              <td className="erform-label-cell">Pin Code:</td>
              <td className="erform-field-cell">
                <input
                  type="text"
                  className="erform-input-std"
                  value={formData.presentPinCode}
                  onChange={(e) => setFormData({ ...formData, presentPinCode: e.target.value })}
                />
              </td>
              <td className="erform-label-cell">Phone No.:</td>
              <td className="erform-field-cell">
                <input
                  type="text"
                  className="erform-input-std"
                  value={formData.presentPhone}
                  onChange={(e) => setFormData({ ...formData, presentPhone: e.target.value })}
                />
              </td>
            </tr>
            <tr>
              <td className="erform-label-cell">State:</td>
              <td className="erform-field-cell">
                <select
                  className="erform-input-full"
                  value={formData.presentState}
                  onChange={(e) => setFormData({ ...formData, presentState: e.target.value })}
                >
                  <option>--Please Select--</option>
                  <option>Kerala</option>
                  <option>Tamil Nadu</option>
                </select>
              </td>
              <td className="erform-label-cell">District:</td>
              <td className="erform-field-cell">
                <select
                  className="erform-input-full"
                  value={formData.presentDistrict}
                  onChange={(e) => setFormData({ ...formData, presentDistrict: e.target.value })}
                >
                  <option>--Please Select--</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="erform-label-cell">Mobile No.:</td>
              <td className="erform-field-cell">
                <div className="erform-phone-row">
                  <span>91</span>
                  <input
                    type="text"
                    className="erform-input-std"
                    value={formData.presentMobile}
                    onChange={(e) => setFormData({ ...formData, presentMobile: e.target.value })}
                  />
                </div>
              </td>
              <td className="erform-label-cell">Email:</td>
              <td className="erform-field-cell">
                <input
                  type="email"
                  className="erform-input-full"
                  value={formData.presentEmail}
                  onChange={(e) => setFormData({ ...formData, presentEmail: e.target.value })}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="erform-field-cell">
                <label className="erform-copy-check">
                  <input
                    type="checkbox"
                    checked={formData.copyAddress}
                    onChange={(e) => setFormData({ ...formData, copyAddress: e.target.checked })}
                  />
                  Copy Present Address to Permanent Address
                </label>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ══ Permanent Address ══ */}
        <div className="erform-subsection-header">13. Permanent Address</div>

        <table className="erform-table">
          <tbody>
            <tr>
              <td className="erform-label-cell">Address :</td>
              <td colSpan={3} className="erform-field-cell">
                <textarea
                  className="erform-input-full"
                  value={formData.permanentAddress}
                  onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                  rows={3}
                  disabled={formData.copyAddress}
                />
              </td>
            </tr>
            <tr>
              <td className="erform-label-cell">Pin Code:</td>
              <td className="erform-field-cell">
                <input
                  type="text"
                  className="erform-input-std"
                  value={formData.permanentPinCode}
                  onChange={(e) => setFormData({ ...formData, permanentPinCode: e.target.value })}
                  disabled={formData.copyAddress}
                />
              </td>
              <td className="erform-label-cell">Phone No.:</td>
              <td className="erform-field-cell">
                <input
                  type="text"
                  className="erform-input-std"
                  value={formData.permanentPhone}
                  onChange={(e) => setFormData({ ...formData, permanentPhone: e.target.value })}
                  disabled={formData.copyAddress}
                />
              </td>
            </tr>
            <tr>
              <td className="erform-label-cell">State:</td>
              <td className="erform-field-cell">
                <select
                  className="erform-input-full"
                  value={formData.permanentState}
                  onChange={(e) => setFormData({ ...formData, permanentState: e.target.value })}
                  disabled={formData.copyAddress}
                >
                  <option>--Please Select--</option>
                  <option>Kerala</option>
                  <option>Tamil Nadu</option>
                </select>
              </td>
              <td className="erform-label-cell">District:</td>
              <td className="erform-field-cell">
                <select
                  className="erform-input-full"
                  value={formData.permanentDistrict}
                  onChange={(e) => setFormData({ ...formData, permanentDistrict: e.target.value })}
                  disabled={formData.copyAddress}
                >
                  <option>--Please Select--</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="erform-label-cell">Mobile No.:</td>
              <td className="erform-field-cell">
                <div className="erform-phone-row">
                  <span>91</span>
                  <input
                    type="text"
                    className="erform-input-std"
                    value={formData.permanentMobile}
                    onChange={(e) => setFormData({ ...formData, permanentMobile: e.target.value })}
                    disabled={formData.copyAddress}
                  />
                </div>
              </td>
              <td className="erform-label-cell">Email:</td>
              <td className="erform-field-cell">
                <input
                  type="email"
                  className="erform-input-full"
                  value={formData.permanentEmail}
                  onChange={(e) => setFormData({ ...formData, permanentEmail: e.target.value })}
                  disabled={formData.copyAddress}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* ══ Dispensary Sections ══ */}
        <div className="erform-subsection-header">14a. Dispensary Or IMP or mEUD For IP</div>

        <table className="erform-table">
          <tbody>
            <tr>
              <td className="erform-label-cell">State:</td>
              <td className="erform-field-cell">
                <select
                  className="erform-input-full"
                  value={formData.dispensary14a}
                  onChange={(e) => setFormData({ ...formData, dispensary14a: e.target.value })}
                >
                  <option>--Please Select--</option>
                  <option>Kerala</option>
                </select>
              </td>
              <td className="erform-label-cell">District:</td>
              <td className="erform-field-cell">
                <select
                  className="erform-input-full"
                  value={formData.dispensary14aDistrict}
                  onChange={(e) =>
                    setFormData({ ...formData, dispensary14aDistrict: e.target.value })
                  }
                >
                  <option>--Please Select--</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="erform-label-cell">Type:</td>
              <td className="erform-field-cell">
                <label style={{ marginRight: '12px' }}>
                  <input
                    type="radio"
                    value="Dispensary"
                    checked={formData.dispensary14aType === 'Dispensary'}
                    onChange={(e) =>
                      setFormData({ ...formData, dispensary14aType: e.target.value })
                    }
                  />
                  Dispensary
                </label>
                <label style={{ marginRight: '12px' }}>
                  <input
                    type="radio"
                    value="IMP"
                    checked={formData.dispensary14aType === 'IMP'}
                    onChange={(e) =>
                      setFormData({ ...formData, dispensary14aType: e.target.value })
                    }
                  />
                  IMP
                </label>
                <label>
                  <input
                    type="radio"
                    value="mEUD"
                    checked={formData.dispensary14aType === 'mEUD'}
                    onChange={(e) =>
                      setFormData({ ...formData, dispensary14aType: e.target.value })
                    }
                  />
                  mEUD
                </label>
              </td>
              <td className="erform-label-cell">Address:</td>
              <td className="erform-field-cell">
                <textarea
                  className="erform-input-full"
                  value={formData.dispensary14aAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, dispensary14aAddress: e.target.value })
                  }
                  rows={2}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="erform-subsection-header">14b. Dispensary Or IMP or mEUD for Family Members</div>

        <table className="erform-table">
          <tbody>
            <tr>
              <td className="erform-label-cell">State:</td>
              <td className="erform-field-cell">
                <select
                  className="erform-input-full"
                  value={formData.dispensary14b}
                  onChange={(e) => setFormData({ ...formData, dispensary14b: e.target.value })}
                >
                  <option>--Please Select--</option>
                  <option>Kerala</option>
                </select>
              </td>
              <td className="erform-label-cell">District:</td>
              <td className="erform-field-cell">
                <select
                  className="erform-input-full"
                  value={formData.dispensary14bDistrict}
                  onChange={(e) =>
                    setFormData({ ...formData, dispensary14bDistrict: e.target.value })
                  }
                >
                  <option>--Please Select--</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="erform-label-cell">Type:</td>
              <td className="erform-field-cell">
                <label style={{ marginRight: '12px' }}>
                  <input
                    type="radio"
                    value="Dispensary"
                    checked={formData.dispensary14bType === 'Dispensary'}
                    onChange={(e) =>
                      setFormData({ ...formData, dispensary14bType: e.target.value })
                    }
                  />
                  Dispensary
                </label>
                <label style={{ marginRight: '12px' }}>
                  <input
                    type="radio"
                    value="IMP"
                    checked={formData.dispensary14bType === 'IMP'}
                    onChange={(e) =>
                      setFormData({ ...formData, dispensary14bType: e.target.value })
                    }
                  />
                  IMP
                </label>
                <label>
                  <input
                    type="radio"
                    value="mEUD"
                    checked={formData.dispensary14bType === 'mEUD'}
                    onChange={(e) =>
                      setFormData({ ...formData, dispensary14bType: e.target.value })
                    }
                  />
                  mEUD
                </label>
              </td>
              <td className="erform-label-cell">Address:</td>
              <td className="erform-field-cell">
                <textarea
                  className="erform-input-full"
                  value={formData.dispensary14bAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, dispensary14bAddress: e.target.value })
                  }
                  rows={2}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* ══ Current Employer ══ */}
        <div className="erform-subsection-header">15. Current Employer's Particulars</div>

        <table className="erform-table">
          <tbody>
            <tr>
              <td className="erform-label-cell">Employer's Code No.:</td>
              <td className="erform-field-cell">
                <input
                  type="text"
                  className="erform-readonly"
                  value={formData.employerCode}
                  readOnly
                />
              </td>
              <td className="erform-label-cell">Date of Appointment:</td>
              <td className="erform-field-cell">
                <input
                  type="date"
                  className="erform-input-full"
                  value={formData.employerDateOfAppt}
                  onChange={(e) =>
                    setFormData({ ...formData, employerDateOfAppt: e.target.value })
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="erform-label-cell">Name of the Employer:</td>
              <td colSpan={3} className="erform-field-cell">
                <input
                  type="text"
                  className="erform-input-full"
                  value={formData.employerName}
                  onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
                />
              </td>
            </tr>
            <tr>
              <td className="erform-label-cell">Address of the Employer Address :</td>
              <td colSpan={3} className="erform-field-cell">
                <textarea
                  className="erform-input-full"
                  value={formData.employerAddress1}
                  onChange={(e) => setFormData({ ...formData, employerAddress1: e.target.value })}
                  rows={2}
                />
              </td>
            </tr>
            <tr>
              <td className="erform-label-cell">State:</td>
              <td className="erform-field-cell">
                <select
                  className="erform-input-full"
                  value={formData.employerState}
                  onChange={(e) => setFormData({ ...formData, employerState: e.target.value })}
                >
                  <option>--Please Select--</option>
                  <option>Kerala</option>
                </select>
              </td>
              <td className="erform-label-cell">District:</td>
              <td className="erform-field-cell">
                <select
                  className="erform-input-full"
                  value={formData.employerDistrict}
                  onChange={(e) => setFormData({ ...formData, employerDistrict: e.target.value })}
                >
                  <option>--Please Select--</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="erform-label-cell">Sub District:</td>
              <td className="erform-field-cell">
                <input
                  type="text"
                  className="erform-input-full"
                  value={formData.employerSubDistrict}
                  onChange={(e) =>
                    setFormData({ ...formData, employerSubDistrict: e.target.value })
                  }
                />
              </td>
              <td className="erform-label-cell">Village:</td>
              <td className="erform-field-cell">
                <input
                  type="text"
                  className="erform-input-full"
                  value={formData.employerVillage}
                  onChange={(e) => setFormData({ ...formData, employerVillage: e.target.value })}
                />
              </td>
            </tr>
            <tr>
              <td className="erform-label-cell">Pin Code:</td>
              <td className="erform-field-cell">
                <input
                  type="text"
                  className="erform-input-std"
                  value={formData.employerPinCode}
                  onChange={(e) => setFormData({ ...formData, employerPinCode: e.target.value })}
                />
              </td>
              <td className="erform-label-cell">Email:</td>
              <td className="erform-field-cell">
                <input
                  type="email"
                  className="erform-input-full"
                  value={formData.employerEmail}
                  onChange={(e) => setFormData({ ...formData, employerEmail: e.target.value })}
                />
              </td>
            </tr>
            <tr>
              <td className="erform-label-cell">Phone No.:</td>
              <td className="erform-field-cell">
                <input
                  type="text"
                  className="erform-input-std"
                  value={formData.employerPhone}
                  onChange={(e) => setFormData({ ...formData, employerPhone: e.target.value })}
                />
              </td>
              <td className="erform-label-cell">Mobile No.:</td>
              <td className="erform-field-cell">
                <div className="erform-phone-row">
                  <span>91</span>
                  <input
                    type="text"
                    className="erform-input-std"
                    value={formData.employerMobile}
                    onChange={(e) =>
                      setFormData({ ...formData, employerMobile: e.target.value })
                    }
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ══ Previous Employer ══ */}
        <div style={{ marginTop: '16px' }}>
          <label className="erform-copy-check">
            <input
              type="radio"
              value="Yes"
              checked={formData.hasPreviousEmployer === 'Yes'}
              onChange={(e) => setFormData({ ...formData, hasPreviousEmployer: e.target.value })}
            />
            15.(a) Have Previous Employer
          </label>
          <label style={{ marginLeft: '24px' }}>
            <input
              type="radio"
              value="No"
              checked={formData.hasPreviousEmployer === 'No'}
              onChange={(e) => setFormData({ ...formData, hasPreviousEmployer: e.target.value })}
            />
            No
          </label>
        </div>

        {formData.hasPreviousEmployer === 'Yes' && (
          <>
            <div className="erform-subsection-header">15.(b) In case of any Previous employment please fill up the details below</div>

            <table className="erform-table">
              <tbody>
                <tr>
                  <td className="erform-label-cell">Employer's Code No.:</td>
                  <td className="erform-field-cell">
                    <input
                      type="text"
                      className="erform-input-full"
                      value={formData.prevEmployerCode}
                      onChange={(e) =>
                        setFormData({ ...formData, prevEmployerCode: e.target.value })
                      }
                    />
                  </td>
                  <td className="erform-label-cell">Previous Insurance No.:</td>
                  <td className="erform-field-cell">
                    <input
                      type="text"
                      className="erform-input-full"
                      value={formData.prevInsuranceNo}
                      onChange={(e) =>
                        setFormData({ ...formData, prevInsuranceNo: e.target.value })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td className="erform-label-cell">Name of the Employer:</td>
                  <td colSpan={3} className="erform-field-cell">
                    <input
                      type="text"
                      className="erform-input-full"
                      value={formData.prevEmployerName}
                      onChange={(e) =>
                        setFormData({ ...formData, prevEmployerName: e.target.value })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td className="erform-label-cell">Address of the Employer:</td>
                  <td colSpan={3} className="erform-field-cell">
                    <textarea
                      className="erform-input-full"
                      value={formData.prevEmployerAddress1}
                      onChange={(e) =>
                        setFormData({ ...formData, prevEmployerAddress1: e.target.value })
                      }
                      rows={2}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="erform-label-cell">State:</td>
                  <td className="erform-field-cell">
                    <select
                      className="erform-input-full"
                      value={formData.prevEmployerState}
                      onChange={(e) =>
                        setFormData({ ...formData, prevEmployerState: e.target.value })
                      }
                    >
                      <option>--Please Select--</option>
                      <option>Kerala</option>
                    </select>
                  </td>
                  <td className="erform-label-cell">District:</td>
                  <td className="erform-field-cell">
                    <select
                      className="erform-input-full"
                      value={formData.prevEmployerDistrict}
                      onChange={(e) =>
                        setFormData({ ...formData, prevEmployerDistrict: e.target.value })
                      }
                    >
                      <option>--Please Select--</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="erform-label-cell">Sub District:</td>
                  <td className="erform-field-cell">
                    <input
                      type="text"
                      className="erform-input-full"
                      value={formData.prevEmployerSubDistrict}
                      onChange={(e) =>
                        setFormData({ ...formData, prevEmployerSubDistrict: e.target.value })
                      }
                    />
                  </td>
                  <td className="erform-label-cell">Village:</td>
                  <td className="erform-field-cell">
                    <input
                      type="text"
                      className="erform-input-full"
                      value={formData.prevEmployerVillage}
                      onChange={(e) =>
                        setFormData({ ...formData, prevEmployerVillage: e.target.value })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td className="erform-label-cell">Pin Code:</td>
                  <td className="erform-field-cell">
                    <input
                      type="text"
                      className="erform-input-std"
                      value={formData.prevEmployerPinCode}
                      onChange={(e) =>
                        setFormData({ ...formData, prevEmployerPinCode: e.target.value })
                      }
                    />
                  </td>
                  <td className="erform-label-cell">Email:</td>
                  <td className="erform-field-cell">
                    <input
                      type="email"
                      className="erform-input-full"
                      value={formData.prevEmployerEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, prevEmployerEmail: e.target.value })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td className="erform-label-cell">Phone No.:</td>
                  <td className="erform-field-cell">
                    <input
                      type="text"
                      className="erform-input-std"
                      value={formData.prevEmployerPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, prevEmployerPhone: e.target.value })
                      }
                    />
                  </td>
                  <td className="erform-label-cell">Mobile No.:</td>
                  <td className="erform-field-cell">
                    <div className="erform-phone-row">
                      <span>91</span>
                      <input
                        type="text"
                        className="erform-input-std"
                        value={formData.prevEmployerMobile}
                        onChange={(e) =>
                          setFormData({ ...formData, prevEmployerMobile: e.target.value })
                        }
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}

        {/* ══ Details Links ══ */}
        <div style={{ marginTop: '16px', background: '#fffde7', padding: '12px' }}>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td className="erform-label-cell">16. Details of Nominee :</td>
                <td className="erform-field-cell">
                  <button
                    className="erform-link-btn"
                    onClick={() => setShowNomineeModal(true)}
                  >
                    Enter Details Here
                  </button>
                </td>
              </tr>
              <tr>
                <td className="erform-label-cell">17. Family Particulars of Insured Person:</td>
                <td className="erform-field-cell">
                  <button
                    className="erform-link-btn"
                    onClick={() => setShowFamilyModal(true)}
                  >
                    Enter Details Here
                  </button>
                </td>
              </tr>
              <tr>
                <td className="erform-label-cell">18. Details of Bank Accounts of Insured Person:</td>
                <td className="erform-field-cell">
                  <button
                    className="erform-link-btn"
                    onClick={() => setShowBankModal(true)}
                  >
                    Enter Details Here
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ══ SMS Language ══ */}
        <div style={{ marginTop: '16px' }}>
          <table className="erform-table">
            <tbody>
              <tr>
                <td className="erform-label-cell">19. Select SMS Preferred Language:</td>
                <td className="erform-field-cell">
                  <select
                    className="erform-input-full"
                    value={formData.smsLanguage}
                    onChange={(e) => setFormData({ ...formData, smsLanguage: e.target.value })}
                  >
                    <option>--Please Select--</option>
                    <option>English</option>
                    <option>Hindi</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ══ Declaration ══ */}
        <div className="erform-declaration" style={{ marginTop: '16px' }}>
          <label className="erform-decl-label">
            <input
              type="checkbox"
              checked={declarationChecked}
              onChange={(e) => setDeclarationChecked(e.target.checked)}
            />
            I hereby declare that the statement provided/documented above is correct to the best of
            my knowledge and belief. I certify that all the information collected and published
            here is with the permission and consent obtained from the beneficiaries for
            collecting, storing and using their personal data. I also undertake to intimate any
            changes in the demographic profiles of the beneficiaries from time to time.
          </label>
          <p className="erform-reminder">
            Employees' registration permitted online within 10 days of date of appointment.
            Register in time to avail benefits and avoid penal provisions.
          </p>
        </div>

        {/* ══ Buttons ══ */}
        <div className="erform-btn-row" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <button className="reg-btn-primary" onClick={handleSubmit}>
            Submit
          </button>
          <button className="reg-btn-secondary" onClick={handleReset} style={{ marginLeft: '8px' }}>
            Reset
          </button>
          <button className="reg-btn-secondary" onClick={onClose} style={{ marginLeft: '8px' }}>
            Cancel
          </button>
        </div>
      </div>

      {/* Sub-modals */}
      {showNomineeModal && (
        <NomineeModal onClose={() => setShowNomineeModal(false)} onSave={() => {}} />
      )}
      {showFamilyModal && (
        <FamilyModal onClose={() => setShowFamilyModal(false)} onSave={() => {}} />
      )}
      {showBankModal && (
        <BankModal onClose={() => setShowBankModal(false)} onSave={() => {}} />
      )}
    </div>
  );
}
