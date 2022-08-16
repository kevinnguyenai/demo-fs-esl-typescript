/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-misused-promises */
import {Response} from '@loopback/rest';
import {expect, sinon} from '@loopback/testlab';
import {PbxCallController} from '../../controllers';
import {
  Click2CallInput, FworkProfile,
  FWorkService,
  ResponseFworkTranslator
} from '../../models';
import {Click2CallInterface, FworkTranslatorInterfaces} from '../../services';

describe('PbxCallController', async () => {
  // define var will used for test and stub object of service
  let Click2CallService: Click2CallInterface;
  let FworkTranslatorService: FworkTranslatorInterfaces;
  let c2cExtension: sinon.SinonStub;
  let getUserInfo: sinon.SinonStub;
  let validateAction: sinon.SinonStub;
  let FService: FWorkService;
  let FProfile: FworkProfile;
  let FProfileNull: FworkProfile;
  let FResponseTranslator: ResponseFworkTranslator;
  let FResponseTranslatorNull: ResponseFworkTranslator;
  let controller: PbxCallController;
  let token: string;
  let inputOK: Click2CallInput;
  let inputERR: Click2CallInput;
  let response: Response;
  // update state of var and stub used in test
  beforeEach(prepare);

  it('test click2call command ok with +OK', async () => {
    getUserInfo.resolves(FResponseTranslator);
    validateAction.resolves(true);
    c2cExtension.resolves('73f77d84-c287-488d-9e37-08e410227da4');
    const OK = controller.click2callInternal(token, inputOK, response);
    expect(OK).is.a.Promise();
  });
  it('test click2call command ok with -ERR', async () => {
    getUserInfo.resolves(FResponseTranslator);
    validateAction.resolves(true);
    c2cExtension.resolves('73f77d84-c287-488d-9e37-08e410227da4');
    const OK = controller.click2callInternal(token, inputOK, response);
    expect(OK).is.a.Promise();
  });
  it('test click2call command not ok with connection err', async () => {
    getUserInfo.resolves(FResponseTranslator);
    validateAction.resolves(true);
    c2cExtension.rejects(new Error('connection closed'));
    const OK = controller.click2callInternal(token, inputERR, response);
    expect(OK).is.a.Promise();
  });
  it('test click2call command not ok with UnAuthorized Token', async () => {
    getUserInfo.rejects(FResponseTranslatorNull);
    const OK = controller.click2callInternal(token, inputOK, response);
    expect(OK).is.a.Promise();
  });
  it('test click2call command not ok with UnAuthorized Action', async () => {
    getUserInfo.resolves(FResponseTranslator);
    validateAction.rejects(false);
    const OK = controller.click2callInternal(token, inputOK, response);
    expect(OK).is.a.Promise();
  });

  function prepare() {
    FService = {
      activate: 'active',
      _id: '617a1e7f58e8ab0009d71064',
      code: 'oncx-104517c9',
      status: true,
    };
    FProfile = {
      _id: '61a7419df7505b00067913ef',
      microsoftAuthentication: null,
      microsoftMail: '',
      privileges: [],
      status: 'enabled',
      verifyEmailStatus: 'verified',
      code: 'USPF-18',
      username: 'kevin.nguyen.eng',
      firstName: 'nguyen',
      lastName: 'kenvin',
      company: '6163a2e8ee1ced0007a824b4',
      organization: '6163a2e8494c2f00087ed78d',
      user: '61a7419df7505b00067913ec',
      role: 'super-admin',
      createdDate: '2021-12-01T09:34:21.353Z',
      updatedDate: '2021-12-01T09:34:21.353Z',
      lastLogin: '2021-12-15T04:16:20.495Z',
      timeVerify: '2021-12-01T09:37:04.327Z',
      organizationInfo: {
        ancestors: ['6163a2e8494c2f00087ed78d'],
        inheritParentPer: false,
        children: [],
        permission: [],
        status: true,
        _id: '6163a2e8494c2f00087ed78d',
        type: '6163a2e8494c2f00087ed788',
        company: '6163a2e8ee1ced0007a824b4',
        parent: '',
        name: 'TM',
        code: 'IAMS-1',
        manager: '615d4ca1ee1ced0007a7f922',
        createdDate: '2021-10-11T02:35:20.875Z',
        updatedDate: '2021-10-11T02:35:20.875Z',
        __v: 0,
      },
    };
    FProfileNull = {
      _id: '',
      microsoftAuthentication: null,
      microsoftMail: '',
      privileges: [],
      status: '',
      verifyEmailStatus: '',
      code: '',
      username: '',
      firstName: '',
      lastName: '',
      company: '',
      organization: '',
      user: '',
      role: '',
      createdDate: '',
      updatedDate: '',
      lastLogin: '',
      timeVerify: '',
      organizationInfo: {
        ancestors: [''],
        inheritParentPer: false,
        children: [],
        permission: [],
        status: true,
        _id: '',
        type: '',
        company: '',
        parent: '',
        name: '',
        code: '',
        manager: '',
        createdDate: '',
        updatedDate: '',
        __v: 0,
      },
    };
    FResponseTranslator = {
      success: true,
      companyId: '',
      serviceCode: [FService],
      profile: FProfile,
    };
    FResponseTranslatorNull = {
      success: false,
      companyId: '',
      serviceCode: [],
      profile: FProfileNull,
    };

    Click2CallService = {c2cExtension: sinon.stub(), c2cGateway: sinon.stub()};
    FworkTranslatorService = {
      validateAction: sinon.stub(),
      getUserInfo: sinon.stub(),
      validateLogin: sinon.stub(),
    };

    c2cExtension = Click2CallService.c2cExtension as sinon.SinonStub;
    getUserInfo = FworkTranslatorService.getUserInfo as sinon.SinonStub;
    validateAction = FworkTranslatorService.validateAction as sinon.SinonStub;

    controller = new PbxCallController(
      Click2CallService,
      FworkTranslatorService,
    );
    token = process.env.TOKEN ?? '123';
    inputOK = {
      from: '100',
      to: '101',
      domain: '42.116.254.248',
    };
    inputERR = {
      from: '100',
      to: '101',
      domain: 'localhost',
    };
  }
});
