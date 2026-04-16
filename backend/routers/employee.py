"""
routers/employee.py – Employee registration endpoints for the ESIC portal clone.
"""

import re
from typing import Literal, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


# ── Pydantic models ───────────────────────────────────────────────────────────

class ValidateMobileRequest(BaseModel):
    mobile: str


class ValidateMobileResponse(BaseModel):
    success: bool
    message: str


class RegisterEmployeeRequest(BaseModel):
    esic_answer:        Literal['yes', 'no']
    insurance_no:       Optional[str] = None
    date_of_appointment: Optional[str] = None
    mobile:             str
    id_type:            Literal['aadhaar', 'other']
    aadhaar_no:         Optional[str] = None
    other_doc_type:     Optional[str] = None
    other_doc_no:       Optional[str] = None


class RegisterEmployeeResponse(BaseModel):
    success:        bool
    message:        str
    insurance_no:   Optional[str] = None


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.post(
    "/employee/validate-mobile",
    response_model=ValidateMobileResponse,
    tags=["Employee"],
)
async def validate_mobile(body: ValidateMobileRequest):
    """Validate that the given mobile number is a well-formed 10-digit Indian number."""
    if not re.fullmatch(r"[6-9]\d{9}", body.mobile):
        raise HTTPException(
            status_code=400,
            detail="Mobile number must be a valid 10-digit Indian mobile number (starting with 6–9).",
        )
    return ValidateMobileResponse(success=True, message="Mobile number is valid.")


@router.post(
    "/employee/register",
    response_model=RegisterEmployeeResponse,
    status_code=201,
    tags=["Employee"],
)
async def register_employee(body: RegisterEmployeeRequest):
    """
    Register / enrol a new employee (Insured Person).

    This is a stub implementation:
    - If esic_answer is 'yes', the provided insurance_no is echoed back.
    - If esic_answer is 'no', a placeholder insurance number is generated.
    """
    # Basic validation
    if not re.fullmatch(r"[6-9]\d{9}", body.mobile):
        raise HTTPException(status_code=400, detail="Invalid mobile number.")

    if body.id_type == "aadhaar":
        if not body.aadhaar_no or not re.fullmatch(r"\d{12}", body.aadhaar_no):
            raise HTTPException(status_code=400, detail="Invalid Aadhaar number.")
    else:
        if not body.other_doc_type or not body.other_doc_no:
            raise HTTPException(status_code=400, detail="Document type and number are required.")

    if body.esic_answer == "yes":
        if not body.insurance_no:
            raise HTTPException(status_code=400, detail="Insurance number is required.")
        insurance_no = body.insurance_no.strip()
    else:
        # Generate a stub insurance number (in production this would come from ESIC system)
        import uuid, hashlib
        seed = f"{body.mobile}{body.aadhaar_no or body.other_doc_no}"
        insurance_no = str(int(hashlib.md5(seed.encode()).hexdigest(), 16))[:17]

    return RegisterEmployeeResponse(
        success=True,
        message="Employee registration submitted successfully. Insurance Number has been allocated.",
        insurance_no=insurance_no,
    )
