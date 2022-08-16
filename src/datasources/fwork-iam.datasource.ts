import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const FWORK_URL_PATH = process.env.FWORK_HOST;
const FWORK_URL_PATH_API = FWORK_URL_PATH + '/api/v1';

const config = {
  name: 'fworkiam',
  connector: 'rest',
  baseURL: '',
  crud: false,
  operations: [
    {
      //login and get token
      template: {
        method: 'POST',
        url: FWORK_URL_PATH_API + '/portal/login',
        body: '{dataMessage}',
      },
      functions: {
        portalLogin: ['dataMessage'],
      },
    },
    {
      // check authentication status of login user
      template: {
        method: 'GET',
        url: FWORK_URL_PATH_API + '/authentication/check-auth',
        headers: {
          Authorization: '{token}',
        },
      },
      functions: {
        authenticationCheck: ['token'],
      },
    },
    {
      // list detail information of login user by token
      template: {
        method: 'GET',
        url: FWORK_URL_PATH_API + '/portal/user',
        headers: {
          Authorization: '{token}',
        },
      },
      functions: {
        portalUserInfo: ['token'],
      },
    },
    {
      // Lấy danh sách tất cả permission (resource and action) của user token
      template: {
        method: 'GET',
        url: FWORK_URL_PATH_API + '/iam/authorization/{FWORK_SERVICE_CODE}',
        headers: {
          Authorization: '{token}',
        },
      },
      functions: {
        iamAuthorization: ['token', 'FWORK_SERVICE_CODE'],
      },
    },
    {
      // Validate action & resource  of Authorization token with projectId
      template: {
        method: 'GET',
        url:
          FWORK_URL_PATH +
          '/api/v2' +
          '/iam/auth/organizations?projectId={projectId}&resourceCode={resourceCode}&actionCode={actionCode}',
        headers: {
          Authorization: '{token}',
        },
      },
      functions: {
        iamAuthOrganizations: [
          'token',
          'projectId',
          'resourceCode',
          'actionCode',
        ],
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class FworkIamDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'fworkiam';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.fworkiam', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
