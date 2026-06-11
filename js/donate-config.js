// Donation configuration - update values as needed
window.DonateConfig = {
    // provider: 'hosted' | 'paystack' | 'flutterwave' | 'bank'
    provider: 'hosted',
    // If using hosted provider, paste your hosted payment page URL here
    hostedUrl: '',

    // Paystack public key (no secret keys here)
    paystack: {
        publicKey: ''
    },

    // Flutterwave public key (no secret keys here)
    flutterwave: {
        publicKey: ''
    },

    currency: 'NGN',
    defaultAmounts: [1000, 5000, 10000, 20000],
    accountNumber: '1228088119'
};
