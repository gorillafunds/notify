import { _ } from "svelte-i18n"
import BigNumber from "bignumber.js"
import { notifications } from "./stores"
import { eventToType, typeToDismissTimeout } from "./defaults"

import { CustomNotificationObject, TransactionData } from "./interfaces"

// subscribe to the formatter store
let formatter: any
_.subscribe((store: any) => (formatter = store))

export function createNotification(
  details: TransactionData,
  customization: CustomNotificationObject | boolean | undefined = {}
): void {
  const {
    id,
    hash,
    startTime,
    eventCode,
    direction,
    counterparty,
    value,
    asset
  } = details

  const type: string = eventToType(eventCode)
  const key: string = `${id}-${(typeof customization === "object" &&
    customization.eventCode) ||
    eventCode}`
  const counterpartyShortened: string | undefined =
    counterparty &&
    counterparty.substring(0, 4) +
      "..." +
      counterparty.substring(counterparty.length - 4)

  const formatterOptions =
    counterparty && value
      ? [
          `watched.${eventCode}`,
          {
            verb:
              eventCode === "txConfirmed"
                ? direction === "incoming"
                  ? "received"
                  : "sent"
                : direction === "incoming"
                ? "receiving"
                : "sending",
            formattedValue: new BigNumber(value)
              .div(new BigNumber("1000000000000000000"))
              .toString(10),
            preposition: direction === "incoming" ? "from" : "to",
            counterpartyShortened,
            asset
          }
        ]
      : [`transaction.${eventCode}`]

  let notificationObject = {
    id: id || hash,
    type,
    key,
    startTime,
    eventCode,
    message: formatter(...formatterOptions),
    autoDismiss: typeToDismissTimeout(
      (typeof customization === "object" && customization.type) || type
    )
  }

  if (typeof customization === "object") {
    notificationObject = { ...notificationObject, ...customization }
  }

  notifications.add(notificationObject)
}