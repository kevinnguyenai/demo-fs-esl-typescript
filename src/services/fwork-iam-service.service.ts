import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {FworkIamDataSource} from '../datasources';
import {
  FworkResponse,
  PortalLoginRequestBody
} from '../models/interfaces/fwork';

export interface FworkIamService {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  portalLogin(dataMessage: PortalLoginRequestBody): Promise<FworkResponse>;
  portalUserInfo(token: string): Promise<FworkResponse>;
  authenticationCheck(token: string): Promise<FworkResponse>;
  iamAuthorization(
    token: string,
    FWORK_SERVICE_CODE: string,
  ): Promise<FworkResponse>;
  iamAuthOrganizations(
    token: string,
    projectId: string,
    resourceCode: string,
    actionCode: string,
  ): Promise<FworkResponse>;
}

export class FworkIamServiceProvider implements Provider<FworkIamService> {
  constructor(
    // fworkiam must match the name property in the datasource json file
    @inject('datasources.fworkiam')
    protected dataSource: FworkIamDataSource = new FworkIamDataSource(),
  ) {}

  value(): Promise<FworkIamService> {
    return getService(this.dataSource);
  }
}
