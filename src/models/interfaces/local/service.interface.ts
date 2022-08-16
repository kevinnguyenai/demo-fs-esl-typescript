import {FworkProfile, FWorkService} from '../fwork/fwork.interfaces';

export interface ResponseFworkTranslator {
  success: boolean;
  companyId: string;
  serviceCode: FWorkService[];
  profile: FworkProfile;
}
