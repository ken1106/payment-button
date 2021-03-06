import React, { Component } from 'react'

const getUrl = (production) => production
  ? 'https://pay.datatrans.com/upp/payment/js/payment-button-1.0.0.min.js'
  : 'https://pay.sandbox.datatrans.com/upp/payment/js/payment-button-1.0.0.js'

const DEFAULT_OPTIONS = {
  useGooglePay: false,
  useApplePay: false,
  auto: true,
  autoSettle: false,
  tokenOnly:false,
  allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'],
  googlePayConfiguration: {
    buttonType: 'long',
    buttonStyle: 'black',
    merchantId: '01234567890123456789'
  },
  applePayConfiguration: {
    buttonType: 'plain',
    buttonStyle: 'black'
  }
}

class PaymentButton extends Component {
  componentDidMount() {
    const scriptSource = getUrl(this.props.production)

    if (document.querySelector('script[src="' + scriptSource + '"]')) {
      this.initPaymentButton()
      return
    }

    const script = document.createElement('script')
    script.src = scriptSource
    script.onload = () => {
      this.initPaymentButton()
    }
    document.body.appendChild(script)
  }

  componentWillUnmount() {
    this.paymentButton.destroy()
  }

  render() {
    return <div ref={element => this.payButton = element} style={{ maxWidth: '400px' }}></div>
  }

  initPaymentButton = () => {
    const { merchantId, merchantName, options} = this.props
    this.paymentButton = window.PaymentButton
    this.paymentButton.init({ ...DEFAULT_OPTIONS, ...options, ...{ merchantId, merchantName } })

    this.bindPaymentButtonEvents()
  }

  bindPaymentButtonEvents = () => {
    const { payment } = this.props

    this.paymentButton.on('init', () => {
      this.paymentButton.create(this.payButton, payment)
    })
    // bind other events:
    // this.paymentButton.on('authorization', () => {})
    // this.paymentButton.on('abort', () => {})
    // this.paymentButton.on('error', () => {})
    // this.paymentButton.on('token', () => {})
    // this.paymentButton.on('unsupported', () => {})
  }
}

export default PaymentButton
