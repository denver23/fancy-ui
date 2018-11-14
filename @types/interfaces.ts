export interface IFancyAlert {
  message?: string
  confirm?: string
  ismask?: boolean
  onConfirm?: () => {}
}

/**
 * @param status error | success | question | info | alert
 * @param content
 * @param url: back | url
 * @param time {-1} millisecond < 0: no jump
 */
export interface IFancyMessage {
  status?: string
  content?: string
  url?: string
  time?: number
}

/**
 * IFancyCodeMessage
 * @param show wegewg
 * @param text 123123
 * @param repeat 123123
 * @param duration 123123
 * @param history 123123
 * @param auto 123123
 * @param onConfirm 123123
 */
export interface IFancyCodeMessage {
  show?: boolean
  text?: string
  repeat?: string
  duration?: number
  history?: number
  auto?: boolean
  onConfirm?: () => {}
}
