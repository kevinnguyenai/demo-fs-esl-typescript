import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const FWORK_URL_PATH = process.env.FWORK_HOST;
const FWORK_URL_PATH_API = FWORK_URL_PATH + '/api/v1';

const config = {
  name: 'FworkServiceDataSource',
  connector: 'rest',
  baseURL: FWORK_URL_PATH_API,
  operations: {
    template: {
      method: 'POST',
      url: '/storage/multiple-upload/files',
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'multipart/form-data',
        Authorization: '{token}',
      },
      formData: {
        files: '{pathFile}',
        uuid: '{uuid}',
        cpnId: '{cpnId}',
        orgId: '{orgId}',
      },
      json: false,
      functions: {
        uploadFile: ['token', 'pathFile', 'uuid', 'cpnId', 'orgId'],
      },
    },
  },
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class FworkServiceDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'fworkservice';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.fworkservice', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
