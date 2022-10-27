import {
  getPackageData,
  PluginCommonMethodOptions,
  PluginStorage,
  PluginStorageCreateFolderMethodOptions,
  PluginStorageDeleteFolderMethodOptions,
  PluginStorageDeleteMethodOptions,
  PluginStorageDuplicateMethodOptions,
  PluginStorageGetMethodOptions,
  PluginStorageMoveMethodOptions,
  PluginStorageRenameMethodOptions,
  PluginStorageUploadMethodOptions,
  PluginValidateCredentialsMethodOptions,
} from '@fleekhq/plugin-helpers';
// @ts-ignore
import createIpfsClient, { globSource } from 'ipfs-http-client';

import packageJSON from '../../package.json';
import { METHOD_NOT_IMPLEMENTED } from '../errors';

type AuthenticationCredential = 'apiKey';
type InstanceField = 'folderName' | 'folderHash';

export class PluginStorageIPFS extends PluginStorage<AuthenticationCredential, InstanceField> {
  constructor() {
    const { name, author, packageName, version, description } = getPackageData(packageJSON);

    super({
      id: packageName,
      name,
      label: 'IPFS',
      description,
      author,
      version,
      iconURL:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Ipfs-logo-1024-ice-text.png/600px-Ipfs-logo-1024-ice-text.png',
      settings: {
        authentications: {
          BASIC: [
            {
              name: 'apiKey',
              label: 'API Key',
              placeholder: 'Your SDK API Key.',
              type: 'password',
              isRequired: true,
            },
          ],
        },
        instanceFields: [
          {
            name: 'folderName',
            label: 'Destination Folder Name',
            placeholder: './dist',
            isRequired: true,
            isChangeable: false,
          },
          {
            name: 'folderHash',
            label: 'Folder Hash',
            isRequired: false,
            isChangeable: false,
          },
        ],
      },
    });
  }

  private initClient(_: PluginCommonMethodOptions<AuthenticationCredential>) {
    const ipfsInstance = createIpfsClient({ url: 'https://my-cool-ipfs-app.com/api/v1' });

    return ipfsInstance;
  }

  // Hosting method
  public async upload(options: PluginStorageUploadMethodOptions<AuthenticationCredential>) {
    const ipfs = this.initClient(options);

    const folderHash = await ipfs.add(
      globSource(options.instanceFields?.folderName, {
        recursive: true,
      })
    );

    return {
      instanceFields: { folderHash },
    };
  }

  // Validate credentials
  public async validateCredentials(
    _: PluginValidateCredentialsMethodOptions<AuthenticationCredential>
  ): Promise<boolean> {
    return true;
  }

  // Storage methods
  public async get(_: PluginStorageGetMethodOptions<AuthenticationCredential>): Promise<never> {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }
  public async delete(_: PluginStorageDeleteMethodOptions<AuthenticationCredential>): Promise<never> {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }
  public async duplicate(_: PluginStorageDuplicateMethodOptions<AuthenticationCredential>): Promise<never> {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }
  public async move(_: PluginStorageMoveMethodOptions<AuthenticationCredential>): Promise<never> {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }
  public async rename(_: PluginStorageRenameMethodOptions<AuthenticationCredential>): Promise<never> {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }
  public async createFolder(_: PluginStorageCreateFolderMethodOptions<AuthenticationCredential>): Promise<never> {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }
  public async deleteFolder(_: PluginStorageDeleteFolderMethodOptions<AuthenticationCredential>): Promise<never> {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }
}
