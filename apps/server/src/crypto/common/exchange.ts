import { Binance, FuturesOrder, StopNewFuturesOrder } from 'binance-api-node'
// import { nanoid } from 'nanoid'

export class Exchange {
  binance: Binance

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // private async futuresOrder(opt: any, side: 'BUY' | 'SELL'):Promise<FuturesOrder> {
  private async futuresOrder(
    options: StopNewFuturesOrder,
  ): Promise<FuturesOrder> {
    /*
    const { price, clientOrderId } = opt
    const symbol = opt.symbol
    const isLimit = !!price // 有价格就认为是 limit 单
    const params: any = {
      symbol,
      side,
      type: isLimit ? 'LIMIT' : 'MARKET',
      recvWindow: 1000 * 100,
    }
    params.newClientOrderId = clientOrderId || 'fjeofo'
    */

    // params.newClientOrderId = clientOrderId || `Bot${this.ctx.botId}__${nanoid()}`
    // TODO:fix key
    // params.newClientOrderId = clientOrderId || `${nanoid()}`

    /*
    if (quantity) {
      params.quantity = this.makeFuturesQuantityPrecise(symbol, quantity).toString()
    }

    if (isLimit) {
      params.timeInForce = 'GTC'
      params.price = this.makeFuturesPricePrecise(symbol, price!)
    }
    */

    return await this.binance.futuresOrder(options)
  }

  /*
  async long(opt: any): Promise<any> {
    try {
      return await this.futuresOrder(opt, 'BUY')
    } catch (error) {
      throw new Error(`[order long fail]: ${JSON.st