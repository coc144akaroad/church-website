// Donation configuration - update values as needed
window.DonateConfig = {
    // provider: 'paystack' | 'bank'
    provider: 'bank',

    // Paystack public key (no secret keys here)
    paystack: {
        publicKey: ''
    },

    currency: 'NGN',
    defaultAmounts: [1000, 5000, 10000, 20000],
    accountName: 'CHURCH OF CHRIST 144 AKA ROAD',
    bankName: 'Zenith Bank PLC',
    swift: 'ZENITHBNK',
    accountNumber: '1228088119',
    accounts: {
        firstDay: {
            label: 'First Day Offering',
            accountName: 'CHURCH OF CHRIST 144 AKA ROAD',
            bankName: 'Zenith Bank PLC',
            accountNumber: '1228088119',
            swift: 'ZENITHBNK'
        },
        benevolence: {
            label: 'Benevolence',
            accountName: 'CHURCH OF CHRIST 144 AKA ROAD',
            bankName: 'Zenith Bank PLC',
            accountNumber: '1228598269',
            swift: 'ZENITHBNK'
        },
        project: {
            label: 'Project / Building Fund',
            accountName: 'CHURCH OF CHRIST 144 AKA ROAD',
            bankName: 'Zenith Bank PLC',
            accountNumber: '1013838701',
            swift: 'ZENITHBNK'
        },
        scholarship: {
            label: 'Scholarship / Education',
            accountName: 'CHURCH OF CHRIST 144 AKA ROAD',
            bankName: 'Zenith Bank PLC',
            accountNumber: '1012254173',
            swift: 'ZENITHBNK'
        }
    }
};
