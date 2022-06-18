import { SUCCESS } from '@common/constants'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { strategyApi } from '@services/strategy'
import { RootState } from './rootReducer'
import { FetchStgOrdersParams } from '@services/strategy.type'
import { spotApi } from '@services/spot'
import { futureApi } from '@services/future'
import { FutureOrdersParams } from '@services/future.type'
import { SpotOrdersParams } from '@services/spot.type'

export const fetchStgOrders = createAsyncThunk(
  'fetchStgOrders',
  async (stgOrdersParams: FetchStgOrdersParams, thunkAPI) => {
    const state: RootState = thunkAPI.getState() as RootState
    const {
      stgFilter: { asset, status },
      stgOrders: { currentPage, pageSize },
    } = state.appStore
    const res = await strategyApi.getStgOrders({
      currentPage: stgOrdersPar