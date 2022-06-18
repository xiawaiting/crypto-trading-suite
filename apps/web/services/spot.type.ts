import { PaginationType, ResType } from './base'

export interface Api {
  addAsset: (assetType: AssetType) => Promise<ResType<null>>
  getAssets: (pagination: PaginationType) => Promise<ResType<AssetType[]>>
  syncSpotOrder: (
    syncSpotOrderParams: SyncSpotOrderParams,
  ) => Promise<ResType<null>>
  getSpotOrders: (
    getSpotOrderParams: GetS