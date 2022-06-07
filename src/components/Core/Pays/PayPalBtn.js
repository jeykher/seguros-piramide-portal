import React from "react"
import { PayPalButton } from "react-paypal-button-v2"

export default function PayPalBtn(props) {
  const { amount, onSuccess, currency } = props;
  return (
    <PayPalButton
      amount={amount}
      currency={currency}
      onSuccess={(details, data) => onSuccess(details, data)}
      options={{
        clientId: "AQETffZbP4fG31dAm3b32DNiMBqOl2f2Jnd63SYR49lc173lxrJhusd825KUee7nC2uK1y04v_c2mcyA"
      }}
      style={{
        label: 'paypal',
        size: 'responsive',    // small | medium | large | responsive
        shape: 'pill',     // pill | rect
        color: 'gold',     // gold | blue | silver | black
        tagline: false,
        layout: 'vertical',
        fundingicons: 'true'
      }}
    />
  )
}