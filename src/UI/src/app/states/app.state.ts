import { IAssetManagementState } from '../pages/asset-management/states/asset-management.feature';

export interface IAppState {
  error?: any;
  assetManagementState: IAssetManagementState;
}
