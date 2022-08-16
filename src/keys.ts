// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingKey} from '@loopback/core';
import {
  Click2CallService,
  FworkIamService,
  FworkIamTranslatorService,
  PbxCliService
} from './services';
import {ESL} from './services/pbx';
import {FileUploadHandler} from './types';

/**
 * Binding key for the file upload service
 */
export const FILE_UPLOAD_SERVICE = BindingKey.create<FileUploadHandler>(
  'services.FileUpload',
);

/**
 * @dev Binding keys binding to fwork service
 */
export namespace FworkServiceBindings {
  export const FWORK_IAM = BindingKey.create<FworkIamService>(
    'services.FworkIamService',
  );
  export const FWORK_IAM_SERVICE = BindingKey.create<FworkIamTranslatorService>(
    'services.FworkIamTranslatorService',
  );
}

/**
 * @dev Binding keys for PBX service
 */
export namespace PbxServiceBinding {
  export const PBX_ESL = BindingKey.create<ESL>('services.ESL');
  export const PBX_CLI = BindingKey.create<PbxCliService>(
    'services.PbxCliService',
  );
  export const PBX_CALL = BindingKey.create<Click2CallService>(
    'services.Click2CallService',
  );
}

/**
 * Binding key for the storage directory
 */
export const STORAGE_DIRECTORY = BindingKey.create<string>('storage.directory');
