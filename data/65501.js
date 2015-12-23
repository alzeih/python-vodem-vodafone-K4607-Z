function opcoObject() {
	this.account_type = getDefaultAccountType();
	this.apn = getApn();

	this.country = "South Africa";
	this.currency = "";
	this.data_notification = "27820099892, 27820096071";
	this.dns1 = "";
	this.dns2 = "";
	this.help_url = "http://www.vodacom.co.za/help";
	this.homepageUrl = "http://www.vodacom.co.za";
	this.message_centre_number = "+27829129";
	this.method = "USSD";
	this.my_account_url = "https://www.vodacom.co.za/personal/main/login";
	this.my_account_registration = "https://www.vodacom.co.za/personal/main/login";
	this.operator = "Vodacom";
	this.partner_branding = "Vodacom";
	this.partnerLogo = "Banner65501.png";
	this.password = "";
	this.check_balance_method = "USSD";
	this.prepay = { check : "*111*502#", topup : "*100*01*%code%#" , online : ""};
	this.check_balance_SMS_MSG = "";
	this.top_up_by_voucher = "USSD";
	this.balance_check_replace = "";
	this.balance_check_with = "";
	this.top_up_name = "Recharge";
	this.topup_successful_pattern = "Recharge:";
	this.topup_sms_message = "";
	this.security = "None";
	this.send = "*111*501#";
	this.msisdn_send_message = "";
	this.receive = "%MSISDN%";
	this.msisdn_receive_message = "";
	this.supportUrl = "http://www.vodacom.co.za/help";
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
	this.dataBundleIntro = "Please select the data bundle you wish to purchase.";
	this.dataBundleImportantTitle = "Important";
	this.dataBundleImportantPara = "This service is only available to Prepaid and TopUp accounts. Postpaid customers please call your service provider.";
	this.dataBundleInfoText = "View Data Bundle information online";
	this.dataBundleInfoLink = [{"InfoLink" : "http://www.vodacom.co.za/portal/site/vodacom/menuitem.c6ff878cc70b64f3128ca6a52de217a0/?vgnextoid=eebe581006ee8210VgnVCM10000017b2710aRCRD&vgnextchannel=d2ac8875baf25210VgnVCM100000d02e710aRCRD&vgnextfmt=format6&selected=2_a3&ciFormat=format6&ht=t"}];
	this.dataBundlePurchaseTerms = [{"name"  :"Broadband Standard" , "ussdNum" : "*111*4451#"}, {"name" : "Broadband Advanced", "ussdNum" : "*111*4452#"}];
	this.dataBundles = [];
}
 
