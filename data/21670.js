function opcoObject() {
	this.account_type = getDefaultAccountType();
	this.apn = getApn();

	if (this.account_type === "Contract" && this.apn === "internet.vodafone.net") {
		this.country = "Hungary";
		this.currency = "";
		this.data_notification = "171";
		this.dns1 = "";
		this.dns2 = "";
		this.help_url = "https://www.vodafone.hu/lakossagi/segithetunk";
		this.homepageUrl = "http://www.vodafone.hu";
		this.message_centre_number = "+36709996500";
		this.method = "";
		this.my_account_url = "http://www.vodafone.hu/netjegy";
		this.my_account_registration = "http://www.vodafone.hu/netjegy";
		this.operator = "Vodafone Hungary";
		this.partner_branding = "No";
		this.partnerLogo = "";
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
		this.security = "None";
		this.send = "";
		this.msisdn_send_message = "";
		this.receive = "";
		this.msisdn_receive_message = "";
		this.supportUrl = "https://www.vodafone.hu/lakossagi/segithetunk";
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
		this.welcome_message = "1702";
		this.dataBundleIntro = "";
		this.dataBundleImportantTitle = "";
		this.dataBundleImportantPara = "";
		this.dataBundleInfoText = "";
		this.dataBundleInfoLink = [];
		this.dataBundlePurchaseTerms = [];
		this.dataBundles = [];
	} else {
		this.country = "Hungary";
		this.currency = "";
		this.data_notification = "171";
		this.dns1 = "";
		this.dns2 = "";
		this.help_url = "https://www.vodafone.hu/lakossagi/segithetunk";
		this.homepageUrl = "http://www.vodafone.hu";
		this.message_centre_number = "+36709996500";
		this.method = "";
		this.my_account_url = "http://www.vodafone.hu/netjegy";
		this.my_account_registration = "http://www.vodafone.hu/netjegy";
		this.operator = "Vodafone Hungary";
		this.partner_branding = "No";
		this.partnerLogo = "";
		this.password = "";
		this.check_balance_method = "SMS";
		this.prepay = { check : "1751", topup : "" , online : "http://www.vodafone.hu/netjegy"};
		this.check_balance_SMS_MSG = "NET";
		this.top_up_by_voucher = "disabled";
		this.balance_check_replace = "";
		this.balance_check_with = "";
		this.top_up_name = "TopUp";
		this.topup_successful_pattern = "";
		this.topup_sms_message = "";
		this.security = "None";
		this.send = "";
		this.msisdn_send_message = "";
		this.receive = "";
		this.msisdn_receive_message = "";
		this.supportUrl = "https://www.vodafone.hu/lakossagi/segithetunk";
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
		this.welcome_message = "1702";
		this.dataBundleIntro = "";
		this.dataBundleImportantTitle = "";
		this.dataBundleImportantPara = "";
		this.dataBundleInfoText = "";
		this.dataBundleInfoLink = [];
		this.dataBundlePurchaseTerms = [];
		this.dataBundles = [];
	}
}
 
