import Cash from '../../../../../../assets/application-status/Cash (1).svg';
import DD from '../../../../../../assets/application-status/DD (1).svg';
import Debit from '../../../../../../assets/application-status/Debit Card.svg';
import Cheque from '../../../../../../assets/application-status/Cheque (1).svg';

// Payment modes configuration
export const paymentModes = [
  { label: "Cash", value: "Cash", icon: Cash },
  { label: "DD", value: "DD", icon: DD },
  { label: "Cheque", value: "Cheque", icon: Cheque },
  { label: "Credit/Debit Card", value: "Credit/Debit Card", icon: Debit },
];

// Initial form values
export const initialValues = {
  // Payment mode
  payMode: 1,
  appFeeReceived: true,
  
  // Cash fields
  paymentDate: '',
  amount: '',
  mainDdSaleDate: '',
  receiptNumber: '',
  
  // DD fields
  mainDdPayDate: '',
  mainDdAmount: '',
  mainDdReceiptNumber: '',
  mainDdOrganisationName: '',
  mainDdOrganisationId: '',
  mainDdNumber: '',
  mainDdCityName: '',
  mainDdBankName: '',
  mainDdBankId: '',
  mainDdBranchName: '',
  mainDdBranchId: '',
  mainDdIfscCode: '',
  mainDdDate: '',
  
  // Cheque fields
  mainChequePayDate: '',
  mainChequeAmount: '',
  mainChequeSaleDate: '',
  mainChequeReceiptNumber: '',
  mainChequeOrganisationName: '',
  mainChequeOrganisationId: '',
  mainChequeNumber: '',
  mainChequeCityName: '',
  mainChequeBankName: '',
  mainChequeBankId: '',
  mainChequeBranchName: '',
  mainChequeBranchId: '',
  mainChequeIfscCode: '',
  mainChequeDate: '',
  
  // Credit/Debit Card fields
  cardPayDate: '',
  cardAmount: '',
  cardReceiptNumber: '',
  
  // Additional fields
  appFeePayMode: 1,
  proCreditCard: false
};
