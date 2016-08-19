"use strict";

var selectedWallet = null;

function onWalletChange (wallet) {
  selectedWallet = wallet;
}

function showPaymentUI (order) {
  Airbitz.core.createSpendRequest(selectedWallet, order.payment.address, order.satoshiPrice, {
    label: "BitRefill",
    notes: order.itemDesc,
    success: function(response) {
      if (response.back) {
        console.log("User pressed back button. Funds not sent")
      } else {
        console.log("Bitcoin sent")
      }
    },
    error: function() {
      Airbitz.ui.showAlert("Payment Error", "Error sending funds");
    }
  });
}

function initWidget (refundAddress) {
  /* global BitRefillWidget */

  BitRefillWidget('#widget', {
    key: Airbitz.config.get('API_KEY'),
    refundAddress: refundAddress,
    showBTCAddress: false,
    sendBitrefillEmails: true,
    paymentButtons: [{
      title: 'Pay With Wallet',
      callback: showPaymentUI
    }]
  });
}

function main () {
  Airbitz.ui.title('Bitrefill');

  // If the user changes the wallet, we want to know about it
  Airbitz.core.setupWalletChangeListener(onWalletChange);

  // After loading, lets fetch the currently selected wallet
  Airbitz.core.getSelectedWallet({
      success: function (wallet) {
        onWalletChange(wallet);

        Airbitz.core.createReceiveRequest(selectedWallet, {
          label: 'BitRefill',
          notes: 'Automatic refund. There was an error processing your order.',
          success: function (resp) {
            initWidget(resp.address);
            Airbitz.core.finalizeReceiveRequest(selectedWallet, resp.address);
          },
          error: function() { console.log("Error getting address") }
        });
      },
      error: function() {
        Airbitz.ui.showAlert("Wallet Error", "Unable to load wallet!");
      }
  });
}

main();
