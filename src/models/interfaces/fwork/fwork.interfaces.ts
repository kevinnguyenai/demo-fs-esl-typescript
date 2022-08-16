/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
export interface PortalLoginRequestBody {
  email: string;
  password: string;
  remember?: boolean;
}

export interface FworkResponse {
  errors?: string;
  message?: string;
  data?: any;
  result?: any;
  success: boolean;
}

export interface FWorkCompany {
  _id: string;
  status: string;
  name: string;
  code: string;
  phone: string;
  size: string;
  represent: string;
  service: FWorkService[];
  createdDate: string;
  updatedDate: string;
  isPlan: string;
}

export interface FWorkService {
  activate: string;
  _id: string;
  code: string;
  status: boolean;
}

export interface FworkProfile {
  _id: string;
  microsoftAuthentication: string | null;
  microsoftMail: string;
  privileges: string[];
  status: string;
  verifyEmailStatus: string;
  code: string;
  username: string;
  firstName: string;
  lastName: string;
  company: string;
  organization: string;
  user: string;
  role: string;
  createdDate: string;
  updatedDate: string;
  lastLogin: string;
  timeVerify: string;
  organizationInfo: {
    ancestors: string[];
    inheritParentPer: false;
    children: string[];
    permission: string[];
    status: true;
    _id: string;
    type: string;
    company: string;
    parent: string;
    name: string;
    code: string;
    manager: string;
    createdDate: string;
    updatedDate: string;
    __v: Number;
  };
}
