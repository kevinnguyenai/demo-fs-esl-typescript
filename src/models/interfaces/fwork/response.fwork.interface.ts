/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
export declare namespace PortalUser {
  export interface Service {
    activate: string;
    _id: string;
    code: string;
    status: boolean;
  }

  export interface Company {
    _id: string;
    status: string;
    name: string;
    code: string;
    phone: string;
    size: string;
    represent: string;
    service: Service[];
    createdDate: Date;
    updatedDate: Date;
    __v: number;
    isPlan: string;
  }

  export interface Company3 {
    _id: string;
    name: string;
    code: string;
    phone: string;
    size: string;
    represent: string;
  }

  export interface Company2 {
    status: string;
    verifyEmailStatus: string;
    _id: string;
    username: string;
    company: Company3;
    organization: string;
  }

  export interface OrganizationInfo {
    ancestors: string[];
    inheritParentPer: boolean;
    children: any[];
    permission: any[];
    status: boolean;
    _id: string;
    type: string;
    company: string;
    parent?: any;
    name: string;
    code: string;
    manager: string;
    createdDate: Date;
    updatedDate: Date;
    __v: number;
  }

  export interface Profile {
    _id: string;
    microsoftAuthentication?: any;
    microsoftMail: string;
    privileges: any[];
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
    createdDate: Date;
    updatedDate: Date;
    timeVerify: Date;
    lastLogin: Date;
    organizationInfo: OrganizationInfo;
  }

  export interface Setting {
    lng: string;
    timeFormat: string;
    dateFormat: string;
    timeZone: string;
    firstDayOfWeek: string;
    notification: boolean;
    darkMode: boolean;
    is2FAEnabled: boolean;
    _id: string;
    owner: string;
    companyId: string;
    __v: number;
  }

  export interface Data {
    _id: string;
    is2FAEnabled: boolean;
    email: string;
    company: Company;
    companies: Company2[];
    profile: Profile;
    setting: Setting;
  }

  export interface RootObject {
    success: boolean;
    data?: Data;
    message?: string;
    errors?: string;
  }
}
