/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {BindingScope, injectable} from '@loopback/core';
import {EventEmitter2} from 'eventemitter2';
import {Connection} from 'modesl';
const MODESL = require('modesl');

/**
 * @author Kevin Nguyen <kevin.nguyen.eng@gmail.com>
 */
export interface OptionProps {
  listenChannel: 'esl::event::*::*';
}

/**
 * @author Kevin Nguyen <kevin.nguyen.eng@gmail.com>
 */
export interface ESLInterface {
  /**
   * @dev interface for use with ESL
   */
  connect(): Promise<any>;
  execute(callerIdNumber: string, command: string): Promise<any>;
  executeWithOkResult(callerIdNumber: string, command: string): Promise<any>;
  subscribe(connection: EventEmitter2, option?: OptionProps): Promise<any>;
}

/**
 * @author Kevin Nguyen <kevin.nguyen.eng@gmail.com>
 */
@injectable({scope: BindingScope.TRANSIENT})
export class ESL {
  constructor() {}
  private FreeswitchConfig = {
    ip: process.env.PBX_HOST ?? '127.0.0.1',
    port: process.env.PBX_PORT ?? '8021',
    password: process.env.PBX_PASS ?? 'ClueCon',
  };
  private Event = {
    Connection: {
      READY: 'esl::ready',
      CLOSED: 'esl::end',
      ERROR: 'error',
    },
    RECEIVED: 'esl::event::*::*',
  };
  private ALL_EVENTS = 'all';
  private RESPONSE_SUCCESS = '+OK';
  private DTMF_EVENTS = 'DTMF';
  private connection: Connection;
  private isSuccessfulResponse = (response: any) =>
    response.indexOf(this.RESPONSE_SUCCESS) === 0;

  async connect(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.connection !== undefined && this.connection?.connected()) {
        console.log('connection was established');
        resolve(this.connection);
      } else {
        // Opening new FreeSWITCH event socket connection...
        this.connection = new MODESL.Connection(
          this.FreeswitchConfig.ip,
          this.FreeswitchConfig.port,
          this.FreeswitchConfig.password,
        );
        this.connection.on(this.Event.Connection.ERROR, () => {
          // Error connecting to FreeSWITCH!
          reject(new Error('Connection error'));
        });
        this.connection.on(this.Event.Connection.CLOSED, () => {
          // Connection to FreeSWITCH closed!
          reject(new Error('Connection closed'));
        });
        this.connection.on(this.Event.Connection.READY, () => {
          // Connection to FreeSWITCH established!
          console.log('new connection established');
          resolve(this.connection);
        });
      }
    });
  }

  /**
   * @author Kevin Nguyen <kevin.nguyen.eng@gmail.com>
   * Execute a FreeSWITCH command through Event Socket.
   * NOTE: The returned Promise is resolved no matter the response.
   *       Use executeWithOkResult if you are interested only in successful responses.
   *
   * @return The body of the response, or an error.
   */

  async execute(callerIdNumber: string, command: string): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(`[${callerIdNumber}] Executing command: ${command}`);
      this.connect()
        .then(conn => {
          conn.bgapi(command, (response: any) => {
            const responseBody = response.getBody();
            resolve(responseBody);
          });
        })
        .catch(error => {
          console.log(
            `[${callerIdNumber}] Error executing command '${command}': ${error}`,
          );
          reject(error);
        });
    });
  }

  /**
   * @author Kevin Nguyen <kevin.nguyen.eng@gmail.com>
   * Execute a FreeSWITCH command through Event Socket.
   * NOTE: The returned Promise is resolved only if the response is successful.
   *
   * @return The body of the response, or an error.
   */
  async executeWithOkResult(callerIdNumber: any, command: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.execute(callerIdNumber, command)
        .then((response: any) => {
          if (this.isSuccessfulResponse(response)) {
            console.log(
              `[${callerIdNumber}] Command '${command}' executed successfully: ${response.trim()}`,
            );
            resolve(response);
          } else {
            console.log(
              `[${callerIdNumber}] Error executing command '${command}': ${response.trim()}`,
            );
            reject(response);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  /**
   * @author Kevin Nguyen <kevin.nguyen.eng@gmail.com>
   */
  subscribe(connection: EventEmitter2, option?: OptionProps): Promise<any> {
    return new Promise((resolve, reject) => {});
  }
}
