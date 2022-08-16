/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {BindingScope, injectable} from '@loopback/core';
import axios from 'axios';
import https from 'https';
import jwt_decode from 'jwt-decode';
import xml2js from 'xml2js';

// import * as dotenv from 'dotenv';
// dotenv.config();
@injectable({scope: BindingScope.TRANSIENT})
export class FworkHandleUserService {
  constructor() {}
  /**
   * Decode Token user fwork
   * @param userToken token fwork jwt
   */
  async decodeToken(userToken: string): Promise<{
    key: string;
    expiresIn: number;
    userId: string;
    companyId: string;
    iat: number;
  } | null> {
    try {
      const token: any = jwt_decode(userToken);
      if (token) {
        if (
          token.key &&
          token.expiresIn &&
          token.userId &&
          token.companyId &&
          token.iat
        ) {
          return {
            key: token.key,
            expiresIn: token.expiresIn,
            userId: token.userId,
            companyId: token.companyId,
            iat: token.iat,
          };
        }
      }
      throw new Error('Token invalid');
    } catch (error) {
      return null;
    }
  }

  async axiosFwork(
    baseUrl: any,
    url: string,
    method: string,
    data: string,
    headers: string,
  ): Promise<{}> {
    const contentType = 'application/json';
    const accept = 'application/json';
    const xRequestedWith = 'XMLHttpRequest';
    const config = {
      // `method` is the request method to be used when making the request
      url,
      data,
      method: method ? method : undefined,
    };
    const instance = axios.create({
      baseURL: baseUrl,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      headers: {
        Authorization: `${headers}`,
        contentType,
        accept,
        xRequestedWith,
      },
      // `timeout` specifies the number of milliseconds before the request times out.
      // If the request takes longer than `timeout`, the request will be aborted.
      timeout: 18000,
      // `maxContentLength` defines the max size of the http response content in bytes allowed in node.js
      maxContentLength: 2097152,
      // `maxBodyLength` (Node only option) defines the max size of the http request content in bytes allowed
      maxBodyLength: 2097152,
    });
    try {
      //@ts-ignore
      const d = await instance(config);
      // console.log(d.data);
      return d.data;
    } catch (error) {
      console.log('decodeToken', error);
      throw error;
    }
  }

  async axiosFusion(
    baseUrl: any,
    url: string,
    method: string,
    data: string,
    headers: string,
  ): Promise<{}> {
    const contentType = 'application/json';
    const accept = 'application/json';
    const xRequestedWith = 'XMLHttpRequest';
    const config = {
      // `method` is the request method to be used when making the request
      url,
      data,
      method: method ? method : undefined,
    };
    const instance = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `${headers}`,
        contentType,
        accept,
        xRequestedWith,
      },
      // `timeout` specifies the number of milliseconds before the request times out.
      // If the request takes longer than `timeout`, the request will be aborted.
      timeout: 18000,
      // `maxContentLength` defines the max size of the http response content in bytes allowed in node.js
      maxContentLength: 2097152,
      // `maxBodyLength` (Node only option) defines the max size of the http request content in bytes allowed
      maxBodyLength: 2097152,
    });
    try {
      //@ts-ignore
      const d = await instance(config);
      // console.log(d.data);
      return d.data;
    } catch (error) {
      console.log('decodeToken', error);
      return error;
      // throw error;
    }
  }

  async getUserId(token: string): Promise<{}> {
    const result = await axios.get(
      `${process.env.FWORK_URL}/api/v1/portal/user`,
      {
        headers: {
          Authorization: `${token}`,
        },
      },
    );
    // const baseUrl = process.env.FWORK_URL;
    // const url = '/api/v1/portal/user';
    // const headers = `${token}`;
    // const method = 'get';
    // const data = '';
    // const result = await this.axiosFusion(baseUrl, url, method, data, headers);
    return result.data;
  }

  async getpermissionUser(token: string): Promise<{}> {
    const result = await axios.get(
      `${process.env.FWORK_URL}/api/v1/iam/authorization/ONCX`,
      {
        headers: {
          Authorization: `${token}`,
        },
      },
    );
    return result.data;
  }
  async checkResourceAction(
    token: string,
    resource: any,
    action: any,
  ): Promise<{}> {
    const result = await axios.get(
      `${process.env.FWORK_URL}/api/v2/iam/auth/organizations?projectId=ONCX&resourceCode=${resource}&actionCode=${action}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      },
    );
    return result.data;
  }

  async startStatusGateway(gateway_uuid: string): Promise<{}> {
    const ArrayBaseUrl = [
      process.env.FUSIONPBX1,
      process.env.FUSIONPBX2,
      process.env.FUSIONPBX3,
    ];
    const data = `profile external start ${gateway_uuid}`;
    const url = `/xmlapi/sofia?profile external start ${gateway_uuid}`;
    const headers = `${process.env.FUSIONPBX_AUTHENTICATION}`;
    const method = 'get';
    try {
      for (const iterator of ArrayBaseUrl) {
        const a = await this.axiosFusion(iterator, url, method, data, headers);
        console.log(a);
      }
    } catch (error) {
      console.log(error);
    }
    return 1;
  }

  async stopStatusGateway(gateway_uuid: string): Promise<{}> {
    const ArrayBaseUrl = [
      process.env.FUSIONPBX1,
      process.env.FUSIONPBX2,
      process.env.FUSIONPBX3,
    ];
    const data = `profile external killgw ${gateway_uuid}`;
    const url = `/xmlapi/sofia?profile external killgw ${gateway_uuid}`;
    const headers = `${process.env.FUSIONPBX_AUTHENTICATION}`;
    const method = 'get';
    try {
      for (const iterator of ArrayBaseUrl) {
        await this.axiosFusion(iterator, url, method, data, headers);
      }
    } catch (error) {
      console.log(error);
    }
    return 1;
  }

  async getStatusGateway(): Promise<{}> {
    const ArrayBaseUrl = [process.env.FUSIONPBX2, process.env.FUSIONPBX1];
    const arr: any = [];
    const arrr: any = [];
    const data = ``;
    const url = '/xmlapi/sofia?xmlstatus gateway';
    const headers = `${process.env.FUSIONPBX_AUTHENTICATION}`;
    const method = 'get';
    for (const iterator of ArrayBaseUrl) {
      try {
        const t: any = await this.axiosFusion(
          iterator,
          url,
          method,
          data,
          headers,
        );
        const parser = new xml2js.Parser();
        parser.parseString(t, (err: any, result: any) => {
          if (result) {
            arrr.push(result);
          }
        });
        console.log(arrr);
        if (arrr[0].gateways.gateway !== null) {
          arr.push(t);
          break;
        }
      } catch (error) {
        // console.log(error);
      }
    }
    return arr[0];
  }

  async getReloadCallCenter(callCenter_uuid: string): Promise<{}> {
    const ArrayBaseUrl = [
      process.env.FUSIONPBX1,
      process.env.FUSIONPBX2,
      process.env.FUSIONPBX3,
    ];
    const data = `queue reload ${callCenter_uuid}`;
    const url = `/webapi/callcenter_config?queue reload ${callCenter_uuid}`;
    const headers = `${process.env.FUSIONPBX_AUTHENTICATION}`;
    const method = 'get';
    try {
      for (const iterator of ArrayBaseUrl) {
        await this.axiosFusion(iterator, url, method, data, headers);
      }
    } catch (error) {
      console.log(error);
    }
    return 1;
  }

  async getReloadFusion(): Promise<{}> {
    const ArrayBaseUrl = [
      process.env.FUSIONPBX1,
      process.env.FUSIONPBX2,
      process.env.FUSIONPBX3,
    ];
    const data = `clear_cache_fusionpbx.lua`;
    const url = '/webapi/luarun?clear_cache_fusionpbx.lua';
    const headers = `${process.env.FUSIONPBX_AUTHENTICATION}`;
    const method = 'get';
    for (const iterator of ArrayBaseUrl) {
      await this.axiosFusion(iterator, url, method, data, headers);
    }
    return 1;
  }

  async getReloadStatusAgent(
    agent_uuid: string,
    agent_status: string,
  ): Promise<{}> {
    const ArrayBaseUrl = [
      process.env.FUSIONPBX1,
      process.env.FUSIONPBX2,
      process.env.FUSIONPBX3,
    ];
    const data = `agent set status ${agent_uuid} ${agent_status}`;
    const url = `/webapi/callcenter_config?agent set status ${agent_uuid} '${agent_status}'`;
    const headers = `${process.env.FUSIONPBX_AUTHENTICATION}`;
    const method = 'get';
    try {
      for (const iterator of ArrayBaseUrl) {
        await this.axiosFusion(iterator, url, method, data, headers);
      }
    } catch (error) {
      console.log(error);
    }
    return 1;
  }

  async deleteAgentCallCenter(
    agent_uuid: string,
    callCenter_uuid: string,
  ): Promise<{}> {
    const ArrayBaseUrl = [
      process.env.FUSIONPBX1,
      process.env.FUSIONPBX2,
      process.env.FUSIONPBX3,
    ];
    const data = `agent del ${agent_uuid} ${callCenter_uuid}`;
    const url = `/webapi/callcenter_config?agent del ${agent_uuid} ${callCenter_uuid}`;
    const headers = `${process.env.FUSIONPBX_AUTHENTICATION}`;
    const method = 'get';
    try {
      for (const iterator of ArrayBaseUrl) {
        await this.axiosFusion(iterator, url, method, data, headers);
      }
    } catch (error) {
      console.log(error);
    }
    return 1;
  }

  async loadCallCenter(callCenter_uuid: string): Promise<{}> {
    const ArrayBaseUrl = [
      process.env.FUSIONPBX1,
      process.env.FUSIONPBX2,
      process.env.FUSIONPBX3,
    ];
    const data = `queue load ${callCenter_uuid}`;
    const url = `/webapi/callcenter_config?queue load ${callCenter_uuid}`;
    const headers = `${process.env.FUSIONPBX_AUTHENTICATION}`;
    const method = 'get';
    try {
      for (const iterator of ArrayBaseUrl) {
        await this.axiosFusion(iterator, url, method, data, headers);
      }
    } catch (error) {
      console.log(error);
    }
    return 1;
  }

  async postcheckcampain(gateway_uuid: string): Promise<{}> {
    const result: any = [];
    const data = JSON.stringify({
      gateway_uuid: `${gateway_uuid}`,
    });

    const config: any = {
      method: 'post',
      url: `${process.env.FWORK_URL}/oncx-campaign/webhook/check-gateway`,
      headers: {
        'Content-Type': 'application/json',
        Cookie: 'i18next=vi',
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        result.push(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });

    return result[0];
  }
  async getShowAllSessionCall(): Promise<{}> {
    const baseUrl = `${process.env.FUSIONPBX1}`;
    const data = ``;
    const url = '/webapi/show?calls%20as%20json';
    const headers = `${process.env.FUSIONPBX_AUTHENTICATION}`;
    const method = 'get';
    const result = await this.axiosFusion(baseUrl, url, method, data, headers);
    return result;
  }
  async getMenberFromQueueById(queuesId: string): Promise<{}> {
    const baseUrl = `${process.env.FUSIONPBX1}`;
    const data = ``;
    const url = `/webapi/callcenter_config?queue%20list%20members%20${queuesId}`;
    const headers = `${process.env.FUSIONPBX_AUTHENTICATION}`;
    const method = 'get';
    const result = await this.axiosFusion(baseUrl, url, method, data, headers);
    return result;
  }
}
