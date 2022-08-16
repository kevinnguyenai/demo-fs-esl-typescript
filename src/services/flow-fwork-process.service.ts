/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {BindingScope, inject, injectable} from '@loopback/core';
import {FworkHandleUserService} from '.';
import {PortalUser} from '../models/interfaces/fwork';
@injectable({scope: BindingScope.TRANSIENT})
export class FlowFworkProcessService {
  constructor(
    @inject('services.FworkHandleUserService')
    protected fworkHandleUserService: FworkHandleUserService,
  ) {}

  /**
   * Check token user is valid and roles owner or admin
   * @param headerAuthorization
   * @returns
   */
  async isOwnerAdmin(
    headerAuthorization: string,
    action: any,
    resource: any,
  ): Promise<PortalUser.RootObject> {
    try {
      const resultProfile: any = await this.isProfile(headerAuthorization);

      if (resultProfile && resultProfile.success) {
        if (
          resultProfile.data &&
          resultProfile.data.profile &&
          resultProfile.data.profile.role
        ) {
          if (
            resultProfile.data.profile.role === 'owner' ||
            resultProfile.data.profile.role === 'super-admin'
          ) {
            return {
              success: true,
              data: resultProfile.data,
            };
          }
        } else {
          console.log(
            'ddddddddddddddddddddddddd',
            headerAuthorization,
            resource,
            action,
          );

          const permissionUser: any =
            await this.fworkHandleUserService.checkResourceAction(
              headerAuthorization,
              resource,
              action,
            );
          const result: any = permissionUser.success;
          switch (result) {
            case true: {
              return {
                success: true,
                data: resultProfile.data,
              };
            }
            case false: {
              break;
            }
          }
        }
        // else{
        //   const permissionUser: any = await this.fworkHandleUserService.getpermissionUser(headerAuthorization)

        //   for (const iterator of permissionUser.result.permissions) {
        //     console.log(';;;;;;;;;;;;;;;;;;;',iterator.resourceCode);
        //     const nameCode= `${iterator.resourceCode}`
        //       switch(nameCode){
        //         case 'extensions':{
        //           console.log(1);
        //           for (const element of iterator.action) {
        //             if(element.code === action)
        //             {
        //               console.log(true);
        //               return {
        //                 success: true,
        //                 data: resultProfile.data,
        //               };
        //             }
        //           }
        //           break;
        //         }
        //         case 'gateways':{
        //           for (const element of iterator.action) {
        //             if(element.code === action)
        //             {
        //               console.log(true);
        //               return {
        //                 success: true,
        //                 data: resultProfile.data,
        //               };
        //             }
        //           }
        //           break;
        //           // for (const element of iterator.action) {
        //           //   console.log(2);
        //           // }
        //         }
        //         case 'applications':{
        //           for (const element of iterator.action) {
        //             if(element.code === action)
        //             {
        //               console.log(true);
        //               return {
        //                 success: true,
        //                 data: resultProfile.data,
        //               };
        //             }
        //           }
        //           break;
        //           // for (const element of iterator.action) {
        //           //   console.log(3);
        //           // }
        //         }
        //         case 'status':{
        //           for (const element of iterator.action) {
        //             if(element.code === action)
        //             {
        //               console.log(true);
        //               return {
        //                 success: true,
        //                 data: resultProfile.data,
        //               };
        //             }
        //           }
        //           break;
        //           // for (const element of iterator.action) {
        //           //   console.log(4);
        //           // }
        //         }
        //       }

        //   }
        // }
      }
      throw resultProfile;
    } catch (error) {
      console.log('Error checkPermissionResource', error);
      let message = '',
        result: any = {};
      if (typeof error === 'string') {
        message = error;
      } else if (error instanceof Error) {
        if (typeof error.message === 'string') {
          message = error.message;
        } else {
          const objectMsg = JSON.parse(error.message);
          result = {
            message: '',
            ...objectMsg,
          };
        }
      }
      return {
        success: false,
        data: result,
        message,
        errors: message,
      };
    }
  }

  /**
   * Check token user is valid and roles owner or admin
   * @param headerAuthorization
   * @returns
   */
  async isProfile(headerAuthorization: string): Promise<PortalUser.RootObject> {
    try {
      //   const parts: string[] = headerAuthorization.split(' ');
      //   if (!headerAuthorization.startsWith('Bearer')) {
      //     throw new Error('Token not found');
      //   }
      //   if (parts.length !== 2) {
      //     throw new Error('Token not found');
      //   }
      //   const fworkUserToken = parts[1];
      const resultProfile: any = await this.fworkHandleUserService.getUserId(
        headerAuthorization,
      );

      if (resultProfile && resultProfile.success) {
        if (resultProfile.data) {
          return {
            success: true,
            data: resultProfile.data,
          };
        }
      }
      throw resultProfile;
    } catch (error) {
      console.log('Error checkPermissionResource', error);
      let message = '',
        result: any = {};
      if (typeof error === 'string') {
        message = error;
      } else if (error instanceof Error) {
        if (typeof error.message === 'string') {
          message = error.message;
        } else {
          const objectMsg = JSON.parse(error.message);
          result = {
            message: '',
            ...objectMsg,
          };
        }
      }
      return {
        success: false,
        data: result,
        message,
        errors: message,
      };
    }
  }
}
