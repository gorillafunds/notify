import ow from "ow"

export function validateConfig(config) {
  ow(
    config,
    "Config",
    ow.object.exactShape({
      dappId: ow.string,
      networkId: ow.number
    })
  )
}

export function validateTransactionOptions(options) {
  ow(
    options,
    "Transaction Options",
    ow.object.exactShape({
      sendTransaction: ow.optional.function,
      estimateGas: ow.optional.function,
      gasPrice: ow.optional.function,
      balance: ow.optional.string,
      contract: ow.optional.object.exactShape({
        methodName: ow.string,
        params: ow.optional.array.nonEmpty
      }),
      txDetails: ow.optional.object.exactShape({
        to: ow.string,
        value: ow.any
      }),
      listeners: ow.optional.object.exactShape({
        txRequest: ow.optional.function,
        nsfFail: ow.optional.function,
        txRepeat: ow.optional.function,
        txAwaitingApproval: ow.optional.function,
        txConfirmReminder: ow.optional.function,
        txSendFail: ow.optional.function,
        txError: ow.optional.function,
        txUnderPriced: ow.optional.function
      })
    })
  )
}

export function validateNotificationObject(notification) {
  ow(
    notification,
    "notification",
    ow.object.exactShape({
      type: ow.optional.string.is(validNotificationType),
      message: ow.string,
      autoDismiss: ow.optional.number
    })
  )
}

export function validateStyles(styles) {
  ow(
    styles,
    "styles",
    ow.object.exactShape({
      mobilePosition: ow.optional.string.is(validMobilePosition),
      desktopPosition: ow.optional.string.is(validDesktopPosition),
      darkMode: ow.optional.boolean
    })
  )
}

function stringOrNumber(val) {
  return (
    typeof val === "string" ||
    typeof val === "number" ||
    `${val} is not a valid string or number`
  )
}

function validNotificationType(type) {
  switch (type) {
    case "hint":
    case "pending":
    case "error":
    case "success":
      return true
    default:
      return `${type} is not a valid notification type`
  }
}

function validMobilePosition(position) {
  return (
    position === "top" ||
    position === "bottom" ||
    `${position} is not a valid mobile notification position`
  )
}

function validDesktopPosition(position) {
  switch (position) {
    case "bottomLeft":
    case "bottomRight":
    case "topLeft":
    case "topRight":
      return true
    default:
      return `${position} is not a valid desktop notification position`
  }
}