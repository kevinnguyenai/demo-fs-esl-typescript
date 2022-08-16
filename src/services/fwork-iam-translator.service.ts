import {BindingScope, inject, injectable} from '@loopback/core';
import {FworkIamService} from '.';
import {FworkServiceBindings} from '../keys';
import {
  FworkProfile, FWorkService
} from '../models/interfaces/fwork/fwork.interfaces';
import {ResponseFworkTranslator} from '../models/interfaces/local/service.interface';

/**
 * @dev Interface define function for FworkIamTranslatorService
 */
export interface FworkTranslatorInterfaces {
  validateLogin(token: string): Promise<boolean>;
  validateAction(
    token: string,
    cpid: string,
    rscode: string,
    rsact: string,
  ): Promise<boolean>;
  getUserInfo(token: string): Promise<ResponseFworkTranslator>;
}

/**
 * @dev Implementation Function of FworkTranslatorInterfaces
 */
@injectable({scope: BindingScope.TRANSIENT})
export class FworkIamTranslatorService {
  constructor(
    @inject(FworkServiceBindings.FWORK_IAM)
    protected fiams: FworkIamService,
  ) {}

  /**
   * @dev validate user is login successful
   */
  async validateLogin(token: string): Promise<boolean> {
    const isLogin = await this.fiams.authenticationCheck(token);
    return isLogin.errors
      ? false
      : isLogin.success && isLogin.data?.success
      ? true
      : false;
  }

  /**
   * @dev validate user have action with correct rscode & rsaction & token
   */
  async validateAction(
    token: string,
    pjid: string,
    rscode: string,
    rsact: string,
  ): Promise<boolean> {
    const isPermit = await this.fiams.iamAuthOrganizations(
      token,
      pjid,
      rscode,
      rsact,
    );
    return isPermit.errors
      ? false
      : isPermit.success && isPermit.data?.status
      ? true
      : false;
  }

  /**
   * @dev get User Login Info
   */
  async getUserInfo(token: string): Promise<ResponseFworkTranslator> {
    const isUser = await this.fiams.portalUserInfo(token);
    return new Promise<ResponseFworkTranslator>((resolve, reject) => {
      if (!isUser.success) {
        const responseFalse = {
          success: false,
          companyId: '',
          serviceCode: [],
          profile: [],
        };
        reject(responseFalse);
      }
      const serviceArr: Array<FWorkService> = isUser.data?.company?.service;
      const accProfile: FworkProfile = isUser.data?.profile;
      const responseSuccess = {
        success: true,
        companyId: isUser.data?.company?._id,
        serviceCode: serviceArr,
        profile: accProfile,
      };
      resolve(responseSuccess);
    });
  }
}
