import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {Connection, Event} from 'modesl';
import path from 'path';
import {
  FworkServiceBindings
} from './keys';
import {MySequence} from './sequence';
import {
  Click2CallService,
  FworkIamServiceProvider,
  PbxCliService
} from './services';
import {ESL} from './services/pbx';

export {ApplicationConfig};

export class DemoFsEslTsApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
// Configure the fwork iam service
this.bind(FworkServiceBindings.FWORK_IAM).toProvider(
  FworkIamServiceProvider,
);
// Configure the binding for service PBX
this.service(ESL);
this.service(PbxCliService);
this.service(Click2CallService);
const cnn = new ESL();
cnn
  .connect()
  .then((conn: Connection) => {
    conn.subscribe(
      [
        'CHANNEL_CREATE',
        'CHANNEL_CALLSTATE',
        'CHANNEL_STATE',
        'CHANNEL_EXECUTE',
        'CHANNEL_EXECUTE_COMPLETE',
        'CHANNEL_DESTROY',
        'CHANNEL_HANGUP',
        'CHANNEL_HANGUP_COMPLETE',
      ],() => {
        console.log("subscribe established");
      },
    );
    conn.on('esl::event::*::*', (evt: Event) => {
      console.log(
        evt.getHeader('Unique-ID'),
        ' : ',
        evt.getHeader('Event-Name'),
        '\r\n',
        evt.serialize('json')
      );
    });
  })
  .catch(err => {
    console.log(err);
  });
  }
}
