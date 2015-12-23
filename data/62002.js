function opcoObject() {
	this.account_type = getDefaultAccountType();
	this.apn = getApn();

	if (this.account_type === "Contract" && this.apn === "internet") {
		this.country = "Ghana";
		this.currency = "GH&#162;";
		this.data_notification = "";
		this.dns1 = "";
		this.dns2 = "";
		this.help_url = "http://www.vodafone.com.gh/Help---Support/FAQs/Categories/Vodafone-Mobile-Broadband.aspx";
		this.homepageUrl = "http://www.vodafone.com.gh";
		this.message_centre_number = "+233200000007";
		this.method = "USSD";
		this.my_account_url = "http://www.vodafone.com.gh/my-vodafone.aspx";
		this.my_account_registration = "http://www.vodafone.com.gh/My-Vodafone/Register.aspx";
		this.operator = "Vodafone Ghana";
		this.partner_branding = "No";
		this.partnerLogo = "";
		this.password = "";
		this.check_balance_method = "USSD";
		this.prepay = { check : "*122#", topup : "*123*%code%#" , online : ""};
		this.check_balance_SMS_MSG = "";
		this.top_up_by_voucher = "USSD";
		this.balance_check_replace = "";
		this.balance_check_with = "";
		this.top_up_name = "TopUp";
		this.topup_successful_pattern = "Your credit is";
		this.topup_sms_message = "";
		this.security = "PAP";
		this.send = "*127#";
		this.msisdn_send_message = "";
		this.receive = "Your mobile number is:%MSISDN%";
		this.msisdn_receive_message = "";
		this.supportUrl = "http://www.vodafone.com.gh/Help---Support/FAQs/Categories/Vodafone-Mobile-Broadband.aspx";
		this.ThreeG = "3G";
		this.GSM = "GSM";
		this.TwoG = "GPRS/EDGE";
		this.edge = "EDGE";
		this.HSDPA = "HSDPA";
		this.HSUPA = "HSUPA";
		this.HSPAPLUSDC = "HSDPA";
		this.HSPAPLUS = "HSDPA";
		this.LTE = "4G";
		this.username = "";
		this.welcome_message = "";
		this.dataBundleIntro = "Please select the data bundle you wish to purchase.";
		this.dataBundleImportantTitle = "";
		this.dataBundleImportantPara = "";
		this.dataBundleInfoText = "";
		this.dataBundleInfoLink = [];
		this.dataBundlePurchaseTerms = [];
		this.dataBundles = [
    {
        "dataBundle": "Bun1.5",
        "price": "GHc20",
        "size": "1.5GB",
  "validity": "30 days",
        "ussdNum": "*125*12#"
    },
    {
        "dataBundle": "Bun3",
        "price": "GHc40",
        "size": "3GB",
  "validity": "30 days",
        "ussdNum": "*125*13#"
    },
    {
        "dataBundle": "Bun4.5",
        "price": "GHc60",
        "size": "4.5GB",
  "validity": "30 days",
        "ussdNum": "*125*14#"
    },
    {
        "dataBundle": "Bun10.5",
        "price": "GHc120",
        "size": "10.5GB",
  "validity": "60 days",
        "ussdNum": "*125*15#"
    },
    {
        "dataBundle": "Bun20",
        "price": "GHc200",
        "size": "20GB",
  "validity": "60 days",
        "ussdNum": "*125*16#"
    },
    {
        "dataBundle": "Bun33",
        "price": "GHc350",
        "size": "33GB",
  "validity": "60 days",
        "ussdNum": "*125*17#"
    },
    {
        "dataBundle": "Bun52",
        "price": "GHc500",
        "size": "52GB",
  "validity": "60 days",
        "ussdNum": "*125*18#"
    }
];
	} else {
		this.country = "Ghana";
		this.currency = "GH&#162;";
		this.data_notification = "";
		this.dns1 = "";
		this.dns2 = "";
		this.help_url = "http://www.vodafone.com.gh/Help---Support/FAQs/Categories/Vodafone-Mobile-Broadband.aspx";
		this.homepageUrl = "http://www.vodafone.com.gh";
		this.message_centre_number = "+233200000007";
		this.method = "USSD";
		this.my_account_url = "http://www.vodafone.com.gh/my-vodafone.aspx";
		this.my_account_registration = "http://www.vodafone.com.gh/My-Vodafone/Register.aspx";
		this.operator = "Vodafone Ghana";
		this.partner_branding = "No";
		this.partnerLogo = "";
		this.password = "";
		this.check_balance_method = "USSD";
		this.prepay = { check : "*122#", topup : "*123*%code%#" , online : ""};
		this.check_balance_SMS_MSG = "";
		this.top_up_by_voucher = "USSD";
		this.balance_check_replace = "";
		this.balance_check_with = "";
		this.top_up_name = "TopUp";
		this.topup_successful_pattern = "Your credit is";
		this.topup_sms_message = "";
		this.security = "MSCHAPv2";
		this.send = "*127#";
		this.msisdn_send_message = "";
		this.receive = "Your mobile number is:%MSISDN%";
		this.msisdn_receive_message = "";
		this.supportUrl = "http://www.vodafone.com.gh/Help---Support/FAQs/Categories/Vodafone-Mobile-Broadband.aspx";
		this.ThreeG = "3G";
		this.GSM = "GSM";
		this.TwoG = "GPRS/EDGE";
		this.edge = "EDGE";
		this.HSDPA = "HSDPA";
		this.HSUPA = "HSUPA";
		this.HSPAPLUSDC = "HSDPA";
		this.HSPAPLUS = "HSDPA";
		this.LTE = "4G";
		this.username = "";
		this.welcome_message = "";
		this.dataBundleIntro = "Please select the data bundle you wish to purchase.";
		this.dataBundleImportantTitle = "IMPORTANT";
		this.dataBundleImportantPara = "This service is available to Prepaid and TopUp accounts only. Postpaid customers please call your service provider.";
		this.dataBundleInfoText = "View Data Bundle information online";
		this.dataBundleInfoLink = [{"InfoLink" : "http://www.vodafone.com.gh/Internet-Cafes/Mobile-broadband.aspx"}];
		this.dataBundlePurchaseTerms = [{"name"  :"Bundles" , "ussdNum" : "*700*1#"}];
		this.dataBundles = [];
	}
}
 
