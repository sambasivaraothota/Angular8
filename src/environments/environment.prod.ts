// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export const environment = {
  production: true,

  getUserInfo_URL : 'https://web.com/api/CurrentUser/Menu',
  consolidationTable_URL : 'https://web.amazonaws.com/prod/api/inventoryConsolidation',
  facility_URL : 'https://web.amazonaws.com/prod/api/facilityData',
  customer_URL : 'https://web.amazonaws.com/prod/api/customerData',
  transactionTable_URL : 'https://web.amazonaws.com/prod/api/inventoryTransaction',
  savedSearch_URL : 'https://web.com/prod/api/savedSearch',
  savedSearchView_URL : 'https://web.com/prod/api/savedSearchView',
  applySearchCriteria_URL : 'https://web.com/prod/api/savedSearchApply',
  deleteSearchCriteria_URL : 'https://web.com/prod/api/deleteSavedSearch',
  get_savedSearchCriteria_URL : 'https://web.com/Prod/api/UserSavedSearchCriteriaSch',
  schedule_savedSearchCriteria_URL : 'https://web.com/Prod/api/UserSavedSearchCriteriaSch',
  update_savedSearchCriteria_URL : 'https://web.com/Prod/api/UserSavedSearchCriteriaSch',
  getID_savedSearchCriteria_URL : 'https://web.com/Prod/api/UserSavedSearchCriteriaSch/GetSchedularBySearchItemId',
  run_savedSearchCriteriaJob_URL : 'https://web.com/Prod/api/UserSavedSearchCriteriaSch/RunUserSavedSearchCriteriaJob',
  getUserEmails_URL: 'https://web.com/api/UserSavedSearchCriteriaSch/GetUserEmails',
  i3pl_loginpage: 'https://web.com',
  i3pl_Cookie: '.i3plAuthent',
  i3pl_UserInfo: 'https://web.com/api/userinfo',
  i3pl_UserMenu: 'https://web.com/prod/api/usermenu',
  fileExport_URL : 'https://web.com/Prod/api/FileExport',
  americold_page : 'https://www.web.com/',
  company_info : 'https://www.web.com/about-us/',
  EDI_URL : 'https://www.web.com/NewEDIAccountSetup.aspx',
  user_Agreement : 'https://www.web.com/PublicDocuments/UserAgreement.aspx',
  rates_URL : 'https://www.web.com/billing/#/rates',
  transaction_URL : 'https://www.web.com/billing/#/transaction',
  deferralApp_URL : 'https://www.web.com/billing/#/deferralApplication',
  review_URL : 'https://www.web.com/billing/#/review',
  leasedBilling_URL : 'https://www.web.com/billing/#/leased',
  rules_URL : 'https://www.web.com/RuleEngine/#/Rules?Category=BILLING&Return=Billing%2F'
};
