
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('spot_order')
export class SpotOrder {
  @PrimaryGeneratedColumn({ comment: 'ID' }) id?: number
  @Column({ comment: 'userId' }) userId: number
  @Column({ comment: 'strategyId' }) strategyId?: string
  @Column({ comment: 'orderId' }) orderId: number
  @Column({ comment: 'symbol' }) symbol: string
  @Column({ comment: 'price' }) price: string
  @Column({ comment: 'qty' }) qty: string
  @Column({ comment: 'quoteQty' }) quoteQty: string
  @Column({ comment: 'commission' }) commission: string
  @Column({ comment: 'commissionAsset' }) commissionAsset: string
  @Column({ comment: 'isBuyer' }) isBuyer: number
  @Column({ comment: 'strategyStatus' }) strategyStatus?: number
  @Column({ comment: 'isMaker' }) isMaker: number
  @Column({ comment: 'isBestMatch' }) isBestMatch: number
  @Column({ comment: 'time' }) time: number
  @Column('bigint', { comment: 'updatedAt' }) updatedAt?: number
  @Column('bigint', { comment: 'createdAt' }) createdAt?: number
}