
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
/**
 * https://github.com/eBay/nice-modal-react/blob/main/src/index.tsx
 */
import React, {
  useEffect,
  useCallback,
  useContext,
  useReducer,
  ReactNode,
} from 'react'

export interface NiceModalState {
  id: string
  args?: Record<string, unknown>
  visible?: boolean
  delayVisible?: boolean
  keepMounted?: boolean
}

export interface NiceModalStore {
  [key: string]: NiceModalState
}

export interface NiceModalAction {
  type: string
  payload: {
    modalId: string
    args?: Record<string, unknown>
    flags?: Record<string, unknown>
  }
}
interface NiceModalCallbacks {
  [modalId: string]: {
    resolve: (args: unknown) => void
    reject: (args: unknown) => void
    promise: Promise<unknown>
  }
}

/**
 * The handler to manage a modal returned by {@link useModal | useModal} hook.
 */
export interface NiceModalHandler<Props = Record<string, unknown>>
  extends NiceModalState {
  // /**
  //  * Whether a modal is visible, it's controlled by {@link NiceModalHandler.show | show}/{@link NiceModalHandler.hide | hide} method.
  //  */
  visible: boolean
  /**
   * If you don't want to remove the modal from the tree after hide when using helpers, set it to true.
   */
  keepMounted: boolean
  /**
   * Show the modal, it will change {@link NiceModalHandler.visible | visible} state to true.
   * @param args - an object passed to modal component as props.
   */
  show: (args?: Props) => Promise<unknown>
  /**
   * Hide the modal, it will change {@link NiceModalHandler.visible | visible} state to false.
   */
  hide: () => Promise<unknown>
  /**
   * Resolve the promise returned by {@link NiceModalHandler.show | show} method.
   */
  resolve: (args?: unknown) => void
  /**
   * Reject the promise returned by {@link NiceModalHandler.show | show} method.
   */
  reject: (args?: unknown) => void
  /**
   * Remove the modal component from React component tree. It improves performance compared to just making a modal invisible.
   */
  remove: () => void

  /**
   * Resolve the promise returned by {@link NiceModalHandler.hide | hide} method.
   */
  resolveHide: (args?: unknown) => void
}

// Omit will not work if extends Record<string, unknown>, which is not needed here
export interface NiceModalHocProps {
  id: string
  defaultVisible?: boolean
  keepMounted?: boolean
}
const symModalId = Symbol('NiceModalId')
const initialState: NiceModalStore = {}
const NiceModalContext = React.createContext<NiceModalStore>(initialState)
const NiceModalIdContext = React.createContext<string | null>(null)
const MODAL_REGISTRY: {
  [id: string]: {
    comp: React.FC<any>
    props?: Record<string, unknown>
  }
} = {}
const ALREADY_MOUNTED = {}

let uidSeed = 0
let dispatch: React.Dispatch<NiceModalAction> = () => {
  throw new Error(
    'No dispatch method detected, did you embed your app with NiceModal.Provider?',
  )
}
const getUid = () => `_nice_modal_${uidSeed++}`

// Modal reducer used in useReducer hook.
export const reducer = (
  state: NiceModalStore = initialState,
  action: NiceModalAction,
): NiceModalStore => {
  switch (action.type) {
    case 'nice-modal/show': {
      const { modalId, args } = action.payload
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          id: modalId,
          args,
          // If modal is not mounted, mount it first then make it visible.
          // There is logic inside HOC wrapper to make it visible after its first mount.
          // This mechanism ensures the entering transition.
          visible: !!ALREADY_MOUNTED[modalId],
          delayVisible: !ALREADY_MOUNTED[modalId],
        },
      }
    }
    case 'nice-modal/hide': {
      const { modalId } = action.payload
      if (!state[modalId]) return state
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          visible: false,
        },
      }
    }
    case 'nice-modal/remove': {
      const { modalId } = action.payload
      const newState = { ...state }
      delete newState[modalId]
      return newState
    }
    case 'nice-modal/set-flags': {
      const { modalId, flags } = action.payload
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          ...flags,
        },
      }
    }
    default:
      return state
  }
}

// action creator to show a modal
function showModal(
  modalId: string,
  args?: Record<string, unknown>,
): NiceModalAction {
  return {
    type: 'nice-modal/show',
    payload: {
      modalId,
      args,
    },
  }
}

// action creator to set flags of a modal
function setModalFlags(
  modalId: string,
  flags: Record<string, unknown>,
): NiceModalAction {
  return {
    type: 'nice-modal/set-flags',
    payload: {
      modalId,
      flags,
    },
  }
}
// action creator to hide a modal
function hideModal(modalId: string): NiceModalAction {
  return {
    type: 'nice-modal/hide',
    payload: {
      modalId,
    },
  }
}

// action creator to remove a modal
function removeModal(modalId: string): NiceModalAction {
  return {
    type: 'nice-modal/remove',
    payload: {
      modalId,
    },
  }
}

const modalCallbacks: NiceModalCallbacks = {}
const hideModalCallbacks: NiceModalCallbacks = {}
const getModalId = (modal: string | React.FC<any>): string => {
  if (typeof modal === 'string') return modal as string
  if (!modal[symModalId]) {
    modal[symModalId] = getUid()
  }
  return modal[symModalId]
}

/** omit id and partial all required props */
type NiceModalArgs<T> = T extends
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>
  ? Omit<React.ComponentProps<T>, 'id'>
  : Record<string, unknown>
export function show<T extends any>(
  modal: React.FC<any>,
  args?: NiceModalArgs<React.FC<any>>,
): Promise<T>
// export function show<T extends any, C extends React.FC>(modal: C, args?: Omit<React.ComponentProps<C>, 'id'>): Promise<T>;
export function show<T extends any>(
  modal: string,
  args?: Record<string, unknown>,
): Promise<T>
export function show<T extends any, P extends any>(
  modal: string,
  args: P,
): Promise<T>
export function show(
  modal: React.FC<any> | string,
  args?: NiceModalArgs<React.FC<any>> | Record<string, unknown>,
) {
  const modalId = getModalId(modal)
  if (typeof modal !== 'string' && !MODAL_REGISTRY[modalId]) {
    register(modalId, modal as React.FC)
  }

  dispatch(showModal(modalId, args))
  if (!modalCallbacks[modalId]) {
    // `!` tell ts that theResolve will be written before it is used
    let theResolve!: (args?: unknown) => void
    // `!` tell ts that theResolve will be written before it is used
    let theReject!: (args?: unknown) => void
    const promise = new Promise((resolve, reject) => {
      theResolve = resolve
      theReject = reject
    })
    modalCallbacks[modalId] = {
      resolve: theResolve,
      reject: theReject,
      promise,
    }
  }
  return modalCallbacks[modalId].promise
}

export function hide<T>(modal: string | React.FC<any>): Promise<T>
export function hide(modal: string | React.FC<any>) {
  const modalId = getModalId(modal)
  dispatch(hideModal(modalId))
  // Should also delete the callback for modal.resolve #35
  delete modalCallbacks[modalId]
  if (!hideModalCallbacks[modalId]) {
    // `!` tell ts that theResolve will be written before it is used
    let theResolve!: (args?: unknown) => void
    // `!` tell ts that theResolve will be written before it is used
    let theReject!: (args?: unknown) => void
    const promise = new Promise((resolve, reject) => {
      theResolve = resolve
      theReject = reject
    })
    hideModalCallbacks[modalId] = {
      resolve: theResolve,
      reject: theReject,
      promise,
    }
  }
  return hideModalCallbacks[modalId].promise
}

export const remove = (modalId: string): void => {
  dispatch(removeModal(modalId))
  delete modalCallbacks[modalId]
  delete hideModalCallbacks[modalId]
}

const setFlags = (modalId: string, flags: Record<string, unknown>): void => {
  dispatch(setModalFlags(modalId, flags))
}

export function useModal(): NiceModalHandler
