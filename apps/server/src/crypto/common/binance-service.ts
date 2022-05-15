import Binance, {
  Account,
  AssetBalance,
  CandleChartResult,
  CandlesOptions,
  FuturesAccountInfoResult,
  FuturesCancelAllOpenOrdersResult,
  FuturesOrder,
  GetFuturesOrder,
  MyTrade,
  NewFuturesOrder,
  NewOrderSpot,
  Order,
  QueryFuturesOrderResult,
  QueryOrderResult,
} from 'binance-api-node'
import { Injectable } from '@nestjs/common'
import { get } from 'lodash'
import { Exchange } from './exchange'
import { ResultWithData } from 'src/types'
import { success } from 'src/common/constant'
import { SyncSpotOrderParams } from '../spot/spot.type'
import { SyncFutureOrderParams } from '../future/future.type'

@Injectable()
export class BinanceService {
  private static instance: BinanceService
  public client = Binance()
  exchange: Exchange

  constructor() {
    this.exchange = new Exchange()
  }

  public static getInstance(): BinanceService {
    if (!BinanceService.instance) {
      BinanceService.instance = new BinanceService()
    }

    return BinanceService.instance
  }

  public connect(apiKey: string, secretKey: string): void {
    try {
      this.client = Binance({ apiKey: apiKey, apiSecret: secretKey })
      console.log('Binance connection is successful...')
    } catch (error) {
      console.log('connect:', error)
    }
  }

  async getAccountInfo(): Promise<ResultWithData<Account>> {
    try {
      const account = await this.client.accountInfo()
      return {
        code: success,
        msg: 'Ok',
        data: account,
      }
    } catch (error) {
      console.log('getAccountInfo:', error)
      return {
        code: 0,
        msg: error.code,
        data: null,
      }
    }
  }

  async tradeSpot(options: NewOrderSpot): Promise<Order> {
    try {
      return await this.client.order(options)
    } catch (error) {
      console.log('tradeSpot:', error)
    }
  }

  async tradeSpotTest(options: NewOrderSpot): Promise<Order> {
    try {
      return await this.client.orderTest(options)
    } catch (error) {
      console.log('tradeSpotTest:', error)
    }
  }

  /*
  Get all open orders on a symbol.
  */
  async openOrders(options: {
    symbol?: string
    recvWindow?: number
    useServerTime?: boolean
  }): Promise<QueryOrderResult[]> {
    try {
      return await this.client.openOrders(options)
    } catch (error) {
      console.log('openOrders:', error)
    }
  }

  /*
  Get all account orders on a symbol; active, canceled, or filled.
  */
  async allOrders(options: {
    symbol?: string
    orderId?: number
    startTime?: number
   