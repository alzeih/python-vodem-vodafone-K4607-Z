function opcoObject() {
	this.account_type = getDefaultAccountType();
	this.apn = getApn();

	if (this.account_type === "Contract" && this.apn === "sunsurf") {
		this.country = "Singapore";
		this.currency = "";
		this.data_notification = "";
		this.dns1 = "";
		this.dns2 = "";
		this.help_url = "http://www.m1.com.sg/mobileconnect/";
		this.homepageUrl = "http://www.m1.com.sg";
		this.message_centre_number = "+6596845999";
		this.method = "";
		this.my_account_url = "http://www.m1.com.sg";
		this.my_account_registration = "http://www.m1.com.sg";
		this.operator = "MobileOne";
		this.partner_branding = "Partner";
		this.partnerLogo = "Banner52503.png";
		this.password = "";
		this.check_balance_method = "";
		this.prepay = { check : "", topup : "" , online : ""};
		this.check_balance_SMS_MSG = "";
		this.top_up_by_voucher = "disabled";
		this.balance_check_replace = "";
		this.balance_check_with = "";
		this.top_up_name = "Top up";
		this.topup_successful_pattern = "";
		this.topup_sms_message = "";
		this.security = "PAP";
		this.send = "";
		this.msisdn_send_message = "";
		this.receive = "";
		this.msisdn_receive_message = "";
		this.supportUrl = "http://www.m1.com.sg/mobileconnect/";
		this.ThreeG = "3G";
		this.GSM = "GSM";
		this.TwoG = "GPRS";
		this.edge = "EDGE";
		this.HSDPA = "HSDPA";
		this.HSUPA = "HSUPA";
		this.HSPAPLUSDC = "HSDPA";
		this.HSPAPLUS = "HSDPA";
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
		this.country = "Singapore";
		this.currency = "";
		this.data_notification = "";
		this.dns1 = "";
		this.dns2 = "";
		this.help_url = "http://www.m1.com.sg/mobileconnect/";
		this.homepageUrl = "http://www.m1.com.sg";
		this.message_centre_number = "+6596845999";
		this.method = "";
		this.my_account_url = "http://www.m1.com.sg";
		this.my_account_registration = "http://www.m1.com.sg";
		this.operator = "MobileOne";
		this.partner_branding = "Partner";
		this.partnerLogo = "Banner52503.png";
		this.password = "";
		this.check_balance_method = "";
		this.prepay = { check : "", topup : "" , online : ""};
		this.check_balance_SMS_MSG = "";
		this.top_up_by_voucher = "disabled";
		this.balance_check_replace = "";
		this.balance_check_with = "";
		this.top_up_name = "Top up";
		this.topup_successful_pattern = "";
		this.topup_sms_message = "";
		this.security = "PAP";
		this.send = "";
		this.msisdn_send_message = "";
		this.receive = "";
		this.msisdn_receive_message = "";
		this.supportUrl = "http://www.m1.com.sg/mobileconnect/";
		this.ThreeG = "3G";
		this.GSM = "GSM";
		this.TwoG = "GPRS";
		this.edge = "EDGE";
		this.HSDPA = "HSDPA";
		this.HSUPA = "HSUPA";
		this.HSPAPLUSDC = "HSDPA";
		this.HSPAPLUS = "HSDPA";
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
 
