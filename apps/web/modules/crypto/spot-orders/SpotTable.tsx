import React, { useEffect, useState } from 'react'
import { spotOrdersState } from '@stores/appSlice'
import { useAppSelector } from '@stores/hooks'
import { Button, Pagination, Table, message } from 'antd'
import {
  FetchSpotOrdersAction,
  SpotOrder,
  SpotOrdersParams,
} from '@services/spot.type'
import { formatUnixTime } from '@common/utils'
import { SUCCESS, strategyStatusMap } from '@common/constants'
import { isEmpty } from 'lodash'
import store from '@stores/index'
import { strategyApi } from '@services/strategy'
import NiceModal from '@common/nice-modal'
import { fetchSpotOrders } from '@stores/thunkAction'
import { MergeOrderModal } from '../component/MergeOrderModal'
import { StgCloseModal } from '../component/StgCloseModal'

export default function SpotTable() {
  const { total, data } = useAppSelector(spotOrdersState)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [selectRowData, setSelectRowData] = useState<SpotOrder[]>([])
  const [, setPageSize] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const oncreateStrategy = async () => {
    if (!selectedRowKeys.length) {
      message.warning('select empty')

      return
    }

    selectRowData.sort((a: SpotOrder, b: SpotOrder) => {
      return Number(a.time) - Number(b.time)
    })

    const isStrategyRelatedOrder = isStrategyRelatedOrderUtil(selectRowData)
    if (isStrategyRelatedOrder) {
      message.warning('Can not select closed order to create')

      return
    }

    createStrategyUtil(selectRowData)
  }

  const createStrategyUtil = async (order: SpotOrder[]) => {
    const res = await strategyApi.createSpotStg(order)
    if (res.code === SUCCESS) {
      getSpotOrdersUtil({})
      setSelectRowData([])
      setSelectedRowKeys([])
      message.success('create strategy succeeded')
    } else {
      message.error('Failed to create Strategy')
    }
  }

  const isStrategyRelatedOrderUtil = (selectRowData: SpotOrder[]): boolean => {
    let isStrategyRelatedOrder = false
    selectRowData.forEach((item) => {
      const { strategyId } = item
      if (strategyId) {
        isStrategyRelatedOrder = true
      }
    })

    return isStrategyRelatedOrder
  }

  const onResetOrderStatus = (item: SpotOrder) => {
    console.log('item', item)
    message.warning('Currently not supported')
  }

  const onRebuildOrderStatus = async (item: SpotOrder) => {
    const { strategyStatus, strategyId } = item
    if (strategyStatus === 2) {
      message.warning('Can not reset ended order')
      return
    }

    const res = await strategyApi.resetStg({
      strategyId,
      orderType: 'spot',
    })
    if (res.code === SUCCESS) {
      getSpotOrdersUtil({})
      setSelectRowData([])
      setSelectedRowKeys([])
      message.success('Reset order succeeded')
    } else {
      message.error('Failed to reset order')
    }
  }

  const onMergeStrategy = () => {
    if (!selectedRowKeys.length) {
      message.warning('select empty')

      return
    }

    const isStrategyRelatedOrder = isStrategyRelatedOrderUtil(selectRowData)
    if (isStrategyRelatedOrder) {
      message.warning('Can not select closed order to merge')
      return
    }

    selectRowData.sort((a: SpotOrder, b: SpotOrder) => {
      r