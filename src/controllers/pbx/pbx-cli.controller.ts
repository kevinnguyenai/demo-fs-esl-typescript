/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-async-promise-executor */
import {inject, service} from '@loopback/core';
import {api, get, param, Response, RestBindings} from '@loopback/rest';
import {FworkServiceBindings} from '../../keys';
import {PbxCommandResponse} from '../../models/interfaces/pbx';
import {
  FworkTranslatorInterfaces,
  PbxCliInterface,
  PbxCliService
} from '../../services';

/**
 * @author Kevin Nguyen <kevin.nguyen.eng@gmail.com>
 */
@api({
  basePath: process.env.URL_ROOT,
})
export class PbxCliController {
  constructor(
    @service(PbxCliService)
    protected fsesl: PbxCliInterface,
    @inject(FworkServiceBindings.FWORK_IAM_SERVICE)
    protected fiams: FworkTranslatorInterfaces,
  ) {}

  /**
   * @dev implement controller type GET will call SofiaStatus() to service ESL under ESLInterface
   * @return json object of profile list
   */
  @get('/cli/sofiastatus', {
    description: 'sofiastatus - get list of all sofia profile status',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {type: 'boolean'},
                msg: {type: 'string'},
                data: {type: 'string'},
              },
            },
          },
        },
        description: 'command executed successful',
      },
      404: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {type: 'boolean'},
                msg: {type: 'string'},
                data: {type: 'string'},
              },
            },
          },
        },
        description: 'Not Found, cannot establish command',
      },
      503: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {type: 'boolean'},
                msg: {type: 'string'},
                data: {type: 'string'},
              },
            },
          },
        },
        description: 'Exception Error',
      },
    },
  })
  async cliSofiaStatus(
    @param.header.string('Authorization', {
      description: 'Token',
      required: true,
    })
    token: string,
    @inject(RestBindings.Http.RESPONSE)
    response: Response,
  ): Promise<any | PbxCommandResponse> {
    return new Promise<any | PbxCommandResponse>(async (resolves, reject) => {
      // get UserInfo
      await this.fiams
        .getUserInfo(token)
        .then(async access => {
          // check is authorized action
          const serviceCodeOncx = access.serviceCode.filter(
            (item: any) => item.code.search('oncx') !== -1,
          );
          const isPermit = await this.fiams.validateAction(
            token,
            serviceCodeOncx.pop()?.code ?? '',
            'Call_data_management',
            'create',
          );
          if (isPermit) {
            try {
              this.fsesl
                .sofiaStatus()
                .then((result: any) =>
                  resolves(
                    response.status(200).send({
                      success: true,
                      msg: 'pbx command successful',
                      data: result,
                    }),
                  ),
                )
                .catch((err: any) => {
                  resolves(
                    response.status(500).send({
                      success: false,
                      msg: err,
                      data: [{}],
                    }),
                  );
                });
            } catch (err: any) {
              resolves(
                response.status(500).send({
                  success: false,
                  msg: err,
                  data: [{}],
                }),
              );
            }
          } else {
            resolves(
              response.status(400).send({
                success: false,
                msg: 'UnAuthorized Action',
                data: [{}],
              }),
            );
          }
        })
        .catch(err => {
          resolves(
            response.status(400).send({
              success: false,
              msg: 'Unknown Token',
              data: [err],
            }),
          );
        });
    });
  }

  /**
   * @dev implement controller type GET will call ReloadXml() to service ESL under ESLInterface
   * @return json object of profile list
   */
  @get('/cli/reloadxml', {
    description: 'sofiastatus - reload xml configuration of pbx',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {type: 'boolean'},
                msg: {type: 'string'},
                data: {type: 'string'},
              },
            },
          },
        },
        description: 'command executed successful',
      },
      404: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {type: 'boolean'},
                msg: {type: 'string'},
                data: {type: 'string'},
              },
            },
          },
        },
        description: 'Not Found, cannot establish command',
      },
      503: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {type: 'boolean'},
                msg: {type: 'string'},
                data: {type: 'string'},
              },
            },
          },
        },
        description: 'Exception Error',
      },
    },
  })
  async cliReloadXml(
    @param.header.string('Authorization', {
      description: 'Token',
      required: true,
    })
    token: string,
    @inject(RestBindings.Http.RESPONSE)
    response: Response,
  ): Promise<any | PbxCommandResponse> {
    return new Promise<any | PbxCommandResponse>(async (resolves, reject) => {
      // get UserInfo
      await this.fiams
        .getUserInfo(token)
        .then(async access => {
          // check is authorized action
          const serviceCodeOncx = access.serviceCode.filter(
            (item: any) => item.code.search('oncx') !== -1,
          );
          const isPermit = await this.fiams.validateAction(
            token,
            serviceCodeOncx.pop()?.code ?? '',
            'Call_data_management',
            'create',
          );
          if (isPermit) {
            try {
              this.fsesl
                .reloadXml()
                .then((result: any) =>
                  resolves(
                    response.status(200).send({
                      success: true,
                      msg: 'pbx command successful',
                      data: result,
                    }),
                  ),
                )
                .catch((err: any) => {
                  resolves(
                    response.status(500).send({
                      success: false,
                      msg: err,
                      data: [{}],
                    }),
                  );
                });
            } catch (err: any) {
              resolves(
                response.status(500).send({
                  success: false,
                  msg: err,
                  data: [{}],
                }),
              );
            }
          } else {
            resolves(
              response.status(400).send({
                success: false,
                msg: 'UnAuthorized Action',
                data: [{}],
              }),
            );
          }
        })
        .catch(err => {
          resolves(
            response.status(400).send({
              success: false,
              msg: 'Unknown Token',
              data: [err],
            }),
          );
        });
    });
  }
}
