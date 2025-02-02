
import { Body, Controller, Post } from '@nestjs/common'
import { Result } from 'src/types'
import { StrategyOrderService } from './strategy.order.service'
import {
  StgOrderParams,
  ResetStg,
  SyncStgPriceType,
  StgOperation,
} from './strategy.order.type'
import { SpotOrder } from '../entity/spot-order.entity'
import { FutureOrder } from '../entity/future-order.entity'

@Controller('stg')
export class StrategyOrderController {
  constructor(private readonly strategyOrderService: StrategyOrderService) {}

  @Post('order')
  async getStgOrder(@Body() stgOrderParams: StgOrderParams): Promise<Result> {
    return await this.strategyOrderService.getStgOrder(stgOrderParams)
  }

  @Post('createSpotStg')
  async createSpotStra(@Body() opntions: SpotOrder[]): Promise<Result> {
    return await this.strategyOrderService.combineCreateSteg(opntions, 'spot')
  }

  @Post('createFutureStg')
  async createFutureStg(@Body() opntions: FutureOrder[]): Promise<Result> {
    return await this.strategyOrderService.combineCreateSteg(opntions, 'future')
  }

  @Post('reset')
  async resetStg(@Body() resetStg: ResetStg): Promise<Result> {
    return await this.strategyOrderService.resetStg(resetStg)
  }

  @Post('close')
  async closeStg(@Body() options: StgOperation): Promise<Result> {
    return await this.strategyOrderService.closeStg(options)
  }

  @Post('mergeOrder')
  async mergeOrder(@Body() options: StgOperation): Promise<Result> {
    return await this.strategyOrderService.mergeOrder(options)
  }

  @Post('syncPrice')
  async syncStgPrice(@Body() stgOrders: SyncStgPriceType[]): Promise<Result> {
    return await this.strategyOrderService.syncStgPrice(stgOrders)
  }
}