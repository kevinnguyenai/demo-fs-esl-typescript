/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {BindingScope, injectable, service} from '@loopback/core';
import faker from 'faker';
import {Click2CallInput} from '../models/interfaces/pbx';
import {ESL, ESLInterface} from './pbx';

/**
 * @author Kevin Nguyen <kevin.nguyen.eng@gmail.com>
 */
export interface Click2CallInterface {
  /**
   * Interface for Click2CallService
   */
  c2cGateway(args: Click2CallInput): Promise<any>;
  c2cExtension(args: Click2CallInput): Promise<any>;
}

@injectable({scope: BindingScope.TRANSIENT})
export class Click2CallService {
  constructor(
    @service(ESL)
    protected fsesl: ESLInterface,
  ) {}
  private Event = {
    Connection: {
      READY: 'esl::ready',
      CLOSED: 'esl::end',
      ERROR: 'error',
    },
    RECEIVED: 'esl::event::*::*',
  };

  /**
   * @dev implement click2call between two extension'
   * @param args
   * @return Command UUID
   */
  async c2cExtension(args: Click2CallInput): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.fsesl
        .connect()
        .then(conn => {
          this.fsesl
            .execute(
              faker.datatype.uuid(),
              `originate {origination_caller_id_number=${args.from}}user/${args.from}@${args.domain} &bridge({origination_caller_id_number=${args.to}}user/${args.to}@${args.domain})`,
            )
            .then(result => {
              if (result.includes('-ERR')) {
                conn.disconnect();
                resolve(result);
              } else if (result.includes('+OK')) {
                const resCallId = result.split(' ')[1].trim();
                console.log(resCallId);
                conn.disconnect();
                resolve(resCallId);
              }
              conn.disconnect();
              resolve(result);
            })
            .catch(err => reject(err));

          conn.on(this.Event.RECEIVED, (rawEvent: any) => {
            console.log(rawEvent);
            if (rawEvent.Type === 'BACKGROUND_JOB') {
              const jobUUID = rawEvent.headers.filter(
                (item: any) => item.name === 'Job-UUID',
              );
              console.log(`{"name": "BACKGOUND_JOB","Job-UUID": ${jobUUID}`);
            }
          });
        })
        .catch(err => {
          reject(new Error(`there error in connection ${err}`));
        });
    });
  }
}
