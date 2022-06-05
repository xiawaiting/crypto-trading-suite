import React, { useRef } from 'react'
import { Modal, Button, Form, Input, FormInstance, message } from 'antd'
import { AssetType } from '@services/spot.type'
import { spotApi } from '@services/spot'
import { SUCCESS } from '@common/constants'

interface Props {
  isModalOpen: boolean
  addAssetCallBack: (isModalOpen: boolean, isSucceed?: boolean) => void
}

export