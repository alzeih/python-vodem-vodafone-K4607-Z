function opcoObject() {
	this.account_type = getDefaultAccountType();
	this.apn = getApn();

	if (this.account_type === "Any" && this.apn === "websfr") {
		this.country = "Reunion";
		this.currency = "&#8364;";
		this.data_notification = "";
		this.dns1 = "";
		this.dns2 = "";
		this.help_url = "http://www.sfr.re/";
		this.homepageUrl = "http://www.sfr.re";
		this.message_centre_number = "+262850909";
		this.method = "SMS";
		this.my_account_url = "http://www.sfr.re";
		this.my_account_registration = "http://www.sfr.re";
		this.operator = "SRR";
		this.partner_branding = "Partner";
		this.partnerLogo = "Banner64710.png";
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
		this.security = "PAP";
		this.send = "+33621012555";
		this.msisdn_send_message = "ABCd84367";
		this.receive = "+33621012555";
		this.msisdn_receive_message = "ABCd904L %MSISDN%";
		this.supportUrl = "http://www.sfr.re/";
		this.ThreeG = "3G";
		this.GSM = "GSM";
		this.TwoG = "GPRS";
		this.edge = "EDGE";
		this.HSDPA = "3G+";
		this.HSUPA = "HSUPA";
		this.HSPAPLUSDC = "3G+";
		this.HSPAPLUS = "3G+";
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
	} else if (this.account_type === "Any" && this.apn === "slsfr") {
		this.country = "Reunion";
		this.currency = "&#8364;";
		this.data_notification = "";
		this.dns1 = "";
		this.dns2 = "";
		this.help_url = "http://www.sfr.re/";
		this.homepageUrl = "http://www.sfr.re";
		this.message_centre_number = "+262850909";
		this.method = "SMS";
		this.my_account_url = "http://www.sfr.re";
		this.my_account_registration = "http://www.sfr.re";
		this.operator = "SRR";
		this.partner_branding = "Partner";
		this.partnerLogo = "Banner64710.png";
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
		this.security = "PAP";
		this.send = "+33621012555";
		this.msisdn_send_message = "ABCd84367";
		this.receive = "+33621012555";
		this.msisdn_receive_message = "ABCd904L %MSISDN%";
		this.supportUrl = "http://www.sfr.re/";
		this.ThreeG = "3G";
		this.GSM = "GSM";
		this.TwoG = "GPRS";
		this.edge = "EDGE";
		this.HSDPA = "3G+";
		this.HSUPA = "HSUPA";
		this.HSPAPLUSDC = "3G+";
		this.HSPAPLUS = "3G+";
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
	} else if (this.account_type === "Any" && this.apn === "internetpro") {
		this.country = "Reunion";
		this.currency = "&#8364;";
		this.data_notification = "";
		this.dns1 = "";
		this.dns2 = "";
		this.help_url = "http://www.sfr.re/";
		this.homepageUrl = "http://www.sfr.re";
		this.message_centre_number = "+262850909";
		this.method = "SMS";
		this.my_account_url = "http://www.sfr.re";
		this.my_account_registration = "http://www.sfr.re";
		this.operator = "SRR";
		this.partner_branding = "Partner";
		this.partnerLogo = "Banner64710.png";
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
		this.send = "+33621012555";
		this.msisdn_send_message = "ABCd84367";
		this.receive = "+33621012555";
		this.msisdn_receive_message = "ABCd904L %MSISDN%";
		this.supportUrl = "http://www.sfr.re/";
		this.ThreeG = "3G";
		this.GSM = "GSM";
		this.TwoG = "GPRS";
		this.edge = "EDGE";
		this.HSDPA = "3G+";
		this.HSUPA = "HSUPA";
		this.HSPAPLUSDC = "3G+";
		this.HSPAPLUS = "3G+";
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
		this.country = "Reunion";
		this.currency = "&#8364;";
		this.data_notification = "";
		this.dns1 = "";
		this.dns2 = "";
		this.help_url = "http://www.sfr.re/";
		this.homepageUrl = "http://www.sfr.re";
		this.message_centre_number = "+262850909";
		this.method = "SMS";
		this.my_account_url = "http://www.sfr.re";
		this.my_account_registration = "http://www.sfr.re";
		this.operator = "SRR";
		this.partner_branding = "Partner";
		this.partnerLogo = "Banner64710.png";
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
		this.send = "+33621012555";
		this.msisdn_send_message = "ABCd84367";
		this.receive = "+33621012555";
		this.msisdn_receive_message = "ABCd904L %MSISDN%";
		this.supportUrl = "http://www.sfr.re/";
		this.ThreeG = "3G";
		this.GSM = "GSM";
		this.TwoG = "GPRS";
		this.edge = "EDGE";
		this.HSDPA = "3G+";
		this.HSUPA = "HSUPA";
		this.HSPAPLUSDC = "3G+";
		this.HSPAPLUS = "3G+";
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
 
