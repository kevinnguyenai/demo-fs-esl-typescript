/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @dev interface for Click2Call params
 */
 export interface Click2CallInput {
  from: string;
  to: string;
  domain: string;
}

/**
 * @dev interface for response of pbx controller
 */
export interface PbxCommandResponse {
  success: boolean;
  msg: string;
  data: Array<any>;
}
