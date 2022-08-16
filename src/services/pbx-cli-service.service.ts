/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {BindingScope, injectable, service} from '@loopback/core';
import faker from 'faker';
import {ESL, ESLInterface} from './pbx';

/**
 * @author Kevin Nguyen <kevin.nguyen.eng@gmail.com>
 */
export interface PbxCliInterface {
  /**
   * @dev interface for Service PbxCliService
   */
  sofiaStatus(): Promise<any>;
  reloadXml(): Promise<any>;
}

@injectable({scope: BindingScope.TRANSIENT})
export class PbxCliService {
  constructor(
    @service(ESL)
    protected fsesl: ESLInterface,
  ) {}

  /**
   * @dev implement fs_cli -x 'sofia status'
   */
  async sofiaStatus(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.fsesl
        .connect()
        .then(conn => {
          this.fsesl
            .execute(faker.datatype.uuid(), 'sofia status')
            .then(result => {
              const totalresult = result.split('\n', 100);
              const lastresult = totalresult
                .map((str: string) => str.split('\t'))
                .filter((item: string) => item.length === 4)
                .map((item: string[]) => item.map(its => its.trim()))
                .filter((item: string, index: number) => index > 0);
              const ras: Array<object> = [];
              lastresult.forEach((item: string[]) => {
                ras.push({
                  Name: item[0],
                  Type: item[1],
                  Data: item[2],
                  State: item[3],
                });
              });
              // l.info(ras);
              conn.disconnect();
              resolve(ras);
            })
            .catch(err => reject(err));
        })
        .catch(err => {
          reject(new Error(`there error in connection ${err}`));
        });
    });
  }

  /**
   * @dev implement fs_cli -x 'reloadxml'
   */
  async reloadXml(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.fsesl
        .connect()
        .then(conn => {
          this.fsesl
            .execute(faker.datatype.uuid(), 'reloadxml')
            .then((result: any) => {
              conn.disconnect();
              resolve(result);
            })
            .catch((err: any) => {
              conn.disconnect();
              reject(err);
            });
        })
        .catch(error => {
          reject(new Error(`there error in connection ${error}`));
        });
    });
  }
}
