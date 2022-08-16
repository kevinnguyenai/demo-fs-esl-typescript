/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-misused-promises */
import {Response} from '@loopback/rest';
import {expect, sinon} from '@loopback/testlab';
import {PbxCliController} from '../../controllers';
import {
  FworkProfile,
  FWorkService,
  ResponseFworkTranslator
} from '../../models';
import {FworkTranslatorInterfaces, PbxCliInterface} from '../../services';

describe('PbxCliController', async () => {
  // define var will used for test and stub object of service
  let PbxCliService: PbxCliInterface;
  let FworkTranslatorService: FworkTranslatorInterfaces;
  let reloadXml: sinon.SinonStub;
  let sofiaStatus: sinon.SinonStub;
  let getUserInfo: sinon.SinonStub;
  let validateAction: sinon.SinonStub;
  let FService: FWorkService;
  let FProfile: FworkProfile;
  let FProfileNull: FworkProfile;
  let FResponseTranslator: ResponseFworkTranslator;
  let FResponseTranslatorNull: ResponseFworkTranslator;
  let controller: PbxCliController;
  let token: string;
  let response: Response;
  let ResponseSofiaStatus: Array<object>;
  let ResponseReloadXml: String;
  // update state of var and stub used in test
  beforeEach(prepare);

  it('test pbx cli sofiastatus command ok with +OK', async () => {
    getUserInfo.resolves(FResponseTranslator);
    validateAction.resolves(true);
    sofiaStatus.resolves(ResponseSofiaStatus);
    const OK = controller.cliSofiaStatus(token, response);
    expect(OK).is.a.Promise();
  });
  it('test pbx cli sofiastatus err with connection', async () => {
    getUserInfo.resolves(FResponseTranslator);
    validateAction.resolves(true);
    sofiaStatus.rejects(new Error('connection closed'));
    const OK = controller.cliSofiaStatus(token, response);
    expect(OK).is.a.Promise();
  });
  it('test pbx cli sofiastatus error with UnAuthorized Token', async () => {
    getUserInfo.rejects(FResponseTranslatorNull);
    const OK = controller.cliSofiaStatus(token, response);
    expect(OK).is.a.Promise();
  });
  it('test pbx cli sofiastatus error with UnAuthorized Action', async () => {
    getUserInfo.resolves(FResponseTranslator);
    validateAction.rejects(false);
    const OK = controller.cliSofiaStatus(token, response);
    expect(OK).is.a.Promise();
  });
  it('test pbx cli reloadxml command ok with +OK', async () => {
    getUserInfo.resolves(FResponseTranslator);
    validateAction.resolves(true);
    reloadXml.resolves(ResponseReloadXml);
    const OK = controller.cliReloadXml(token, response);
    expect(OK).is.a.Promise();
  });
  it('test pbx cli reloadxml command err with connection', async () => {
    getUserInfo.resolves(FResponseTranslator);
    validateAction.resolves(true);
    reloadXml.rejects(new Error('connection closed'));
    const OK = controller.cliReloadXml(token, response);
    expect(OK).is.a.Promise();
  });
  it('test pbx cli reloadxml command not ok with Unauthorized Token', async () => {
    getUserInfo.rejects(FResponseTranslatorNull);
    const OK = controller.cliReloadXml(token, response);
    expect(OK).is.a.Promise();
  });
  it('test pbx cli reloadxml command not ok with Unauthorized Action', async () => {
    getUserInfo.resolves(FResponseTranslator);
    validateAction.rejects(true);
    const OK = controller.cliReloadXml(token, response);
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

    PbxCliService = {sofiaStatus: sinon.stub(), reloadXml: sinon.stub()};
    FworkTranslatorService = {
      validateAction: sinon.stub(),
      getUserInfo: sinon.stub(),
      validateLogin: sinon.stub(),
    };

    sofiaStatus = PbxCliService.sofiaStatus as sinon.SinonStub;
    reloadXml = PbxCliService.sofiaStatus as sinon.SinonStub;
    getUserInfo = FworkTranslatorService.getUserInfo as sinon.SinonStub;
    validateAction = FworkTranslatorService.validateAction as sinon.SinonStub;

    controller = new PbxCliController(PbxCliService, FworkTranslatorService);
    token = process.env.TOKEN ?? '123';

    ResponseReloadXml = '+OK [Message]';
    ResponseSofiaStatus = [
      {
        Name: 'external',
        Type: 'profile',
        Data: 'sip:mod_sofia@42.116.254.248:5080',
        State: 'RUNNING (0)',
      },
      {
        Name: 'external',
        Type: 'profile',
        Data: 'sip:mod_sofia@42.116.254.248:5081',
        State: 'RUNNING (0) (TLS)',
      },
    ];
  }
});
