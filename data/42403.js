function opcoObject() {
	this.account_type = getDefaultAccountType();
	this.apn = getApn();

	if (this.account_type === "Contract" && this.apn === "du") {
		this.country = "Dubai";
		this.currency = "";
		this.data_notification = "";
		this.dns1 = "";
		this.dns2 = "";
		this.help_url = "http://www.du.ae/en/ducontactus/mobile";
		this.homepageUrl = "http://www.du.ae";
		this.message_centre_number = "+971555515515";
		this.method = "SMS";
		this.my_account_url = "http://www.du.ae";
		this.my_account_registration = "http://www.du.ae";
		this.operator = "du";
		this.partner_branding = "Partner";
		this.partnerLogo = "Banner42403.png";
		this.password = "";
		this.check_balance_method = "";
		this.prepay = { check : "", topup : "" , online : ""};
		this.check_balance_SMS_MSG = "";
		this.top_up_by_voucher = "disabled";
		this.balance_check_replace = "";
		this.balance_check_with = "";
		this.top_up_name = "TopUp";
		this.topup_successful_pattern = "";
		this.topup_sms_message = "";
		this.security = "CHAP";
		this.send = "*#100#";
		this.msisdn_send_message = "";
		this.receive = "%MSISDN%";
		this.msisdn_receive_message = "";
		this.supportUrl = "http://www.du.ae/en/ducontactus/mobile";
		this.ThreeG = "3G";
		this.GSM = "GSM";
		this.TwoG = "GPRS";
		this.edge = "EDGE";
		this.HSDPA = "HSDPA";
		this.HSUPA = "HSUPA";
		this.HSPAPLUSDC = "HSPA+";
		this.HSPAPLUS = "HSPA+";
		this.LTE = "4G";
		this.username = "";
		this.welcome_message = "";
		this.dataBundleIntro = "";
		this.dataBundleImportantTitle = "";
		this.dataBundleImportantPara = "";
		this.dataBundleInfoText = "";
		this.dataBundleInfoLink = [];
		this.dataBundlePurchaseTerms = [];
		this.dataBundles = [];
	} else {
		this.country = "Dubai";
		this.currency = "";
		this.data_notification = "";
		this.dns1 = "";
		this.dns2 = "";
		this.help_url = "http://www.du.ae/en/ducontactus/mobile";
		this.homepageUrl = "http://www.du.ae";
		this.message_centre_number = "+971555515515";
		this.method = "SMS";
		this.my_account_url = "https://selfcare.du.ae/duWeb/Selfcare.portal?language=en";
		this.my_account_registration = "https://selfcare.du.ae/duWeb/Selfcare.portal?language=en";
		this.operator = "du";
		this.partner_branding = "Partner";
		this.partnerLogo = "Banner42403.png";
		this.password = "";
		this.check_balance_method = "USSD";
		this.prepay = { check : "*135#", topup : "*135*%code%#" , online : ""};
		this.check_balance_SMS_MSG = "";
		this.top_up_by_voucher = "USSD";
		this.balance_check_replace = "";
		this.balance_check_with = "";
		this.top_up_name = "Recharge";
		this.topup_successful_pattern = "Thank you for using ";
		this.topup_sms_message = "";
		this.security = "CHAP";
		this.send = "9296";
		this.msisdn_send_message = "getmyMSISDN";
		this.receive = "9296";
		this.msisdn_receive_message = "Dear du Mobile Broadband user, your number is %MSISDN%";
		this.supportUrl = "http://www.du.ae/en/ducontactus/mobile";
		this.ThreeG = "3G";
		this.GSM = "GSM";
		this.TwoG = "GPRS";
		this.edge = "EDGE";
		this.HSDPA = "HSDPA";
		this.HSUPA = "HSUPA";
		this.HSPAPLUSDC = "HSPA+";
		this.HSPAPLUS = "HSPA+";
		this.LTE = "4G";
		this.username = "";
		this.welcome_message = "";
		this.dataBundleIntro = "";
		this.dataBundleImportantTitle = "";
		this.dataBundleImportantPara = "";
		this.dataBundleInfoText = "";
		this.dataBundleInfoLink = [];
		this.dataBundlePurchaseTerms = [];
		this.dataBundles = [];
	}
}
 
