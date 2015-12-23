/**
 * @author Vendor 
 */

var Vendor = (function() { // Encapsulates all local variables and functions.

    //Please supply all SMS content in the following JSON format
    //var oneMessage = "{\"messages\":[ {\"id\": \"1\", \"date\": \"13/05/10\", \"time\": \"14:00\", \"from\": \"+447864629574\", \"body\": \"Hi James I just wanted to remind you about the meeting with our client\", \"isNew\": true}] }";

var apiCallbackObject = window;
//var pinRequired = false;
//var language = 'en-GB';
//var strPhoneNumber = 'test phone';

//var nAttemptsMax = 100;
//var nAttempts = nAttemptsMax;
//var nDraftSMSCount = 500;
//var bearerPreference = '2G Only';
//var strWebUIProductName = 'quickstart';
//var doubleTapEnabled = true;
//var timer;

//$.ajaxSetup({ cache: false }); 
var cacheData = {};

/*Vendor.js reports an error either via an empty string or, 
when there's a callback, via the first callback function parameter (typically called bResult).
(See descriptions in sections 2.4 and 3.1.)
*/

var orignalNetwork = null;
var orignalNetworkConnectionStatus = null;

/*web UI will logout after idled for 10 minutes*/
var idleTimer = new Date().getTime();


//for synchronous call, will modify error situation later
function syncRequest(params, processData) {
    if (SupportedFeatures().VENDORWIFI){
        clearIdleTimer();
    }
    var result;
    $.ajax({
        url : "/goform/goform_get_cmd_process",
        data : params,
        dataType : "json",
        async : false,
        cache : false,
        error : function() {
            result = null;
        },
        success : function(data) {
            if(typeof processData == "function"){
                result = processData(data);
            } else {
                result = data;
            }
        }
    });
    return result;
}
    /*

function syncRequestForMulti(params, processData) {
    if (SupportedFeatures().VENDORWIFI){
        clearIdleTimer();
    }
    var result = {};
    $.ajax({
        url : "/goform/goform_get_cmd_process",
        data : {
            cmd : params,
            multi_data: 1
        },
        dataType : "json",
        async : false,
        cache : false,
        error : function() {
            result = null;
        },
        success : function(data) {
            if(typeof processData == "function") {
                result = processData(data);
            } else{
                result = data;
            }
        }
    });
    return result;
}
*/

//for asynchronous call, will modify processData return value later
//when reverse is true, will use callback(result,status)  
//otherwise callback(status, result)  
function asyncRequest(params, callback, processData, reverse) {
    if (SupportedFeatures().VENDORWIFI){
        clearIdleTimer();
    }
    $.ajax({
        url : "/goform/goform_get_cmd_process",
        data : params,
        dataType : "json",
        cache : false,
        error : function() {
            if (typeof callback == "function") {
                if (reverse) {
                    callback("", false);
                } else {
                    callback(false, "");
                }
            }
        },
        success : function(data) {
            if (typeof callback == "function") {
                var processResult = processData(data);
                callback(processResult[0], processResult[1]);
            }
        }
    });
}

/*function asyncRequestForMulti(params, callback, processData, reverse) {
    if (SupportedFeatures().VENDORWIFI){
        clearIdleTimer();
    }
    $.ajax({
        url : "/goform/goform_get_cmd_process",
        data : {
            cmd : params,
            multi_data: "1"
        },
        dataType : "json",
        cache : false,
        error : function() {
            if (typeof callback == "function") {
                if (reverse) {
                    callback("", false);
                } else {
                    callback(false, "");
                }
            }
        },
        success : function(data) {
            if (typeof callback == "function") {
                var processResult = processData(data);
                callback(processResult[0], processResult[1]);
            }
        }
    });
}*/


//not support function like connect because the webserver doesn't return status/
function postData(params, callback) {
    if (SupportedFeatures().VENDORWIFI){
        clearIdleTimer();
    }
    params._= new Date().getTime();
    $.post("/goform/goform_set_cmd_process", params, function(data){
        if(typeof callback == "function") {
            if(data.result == "success") {
                callback(true);
            } else {
                callback(false);
            }
        }
    }, "json")
    .error(function(){
        if(typeof callback == "function") {
            callback(false);
        }
    });
}

/**************************************************************************
     Function: GetSimLockInfo()
     Description: Get device locked information
     Parameters:
     Return:
     Object: deviceLocked: Javascript object, the attributes list below:
     --string: locked: can be 'locked','unlocked','NA'. NA is used if device is never locked to a network.
     --Array: mccmnc: example ['50503', '23415'] if device is locked and an empty array [] if attribute locked is 'NA'.
     --integer: maxAttempts : an integer equal to or greater than zero
     --integer: remainingAttempts : an integer equal to or greater than zero
     **************************************************************************/
function GetSimLockInfo() {
    var deviceLocked = {};
    var params = {
        cmd : 'lock_status,locked_hplmns,unlock_nck_time,modem_main_state',
        multi_data : 1
    };
    return syncRequest(params, function (data){
        if (data.lock_status == 'NA'){
            deviceLocked.mccmnc = [];
        } else {
            deviceLocked.mccmnc = processMCCMNC(data.locked_hplmns);
        }
        if(data.lock_status == "locked" && data.modem_main_state == "modem_init_complete"){
            deviceLocked.locked = "unlocked";
        } else {
            deviceLocked.locked = data.lock_status;
        }
        if(data.unlock_nck_time !== ""){
            deviceLocked.remainingAttempts = parseInt(data.unlock_nck_time, 10);
        } else {
            deviceLocked.remainingAttempts = 0;
        }
        deviceLocked.maxAttempts = 5;//default times
        return deviceLocked;
    });
    function processMCCMNC(hplmns) {
        var mccmncArray = divideMCCMNC(hplmns);
        var mccmnc = [];
        mccmnc.push([mccmncArray[0], ';', mccmncArray[0]]);
        for(i = 0; i < mccmncArray.length; i++){
            for(j = 0; j < mccmnc.length; j++){
                if(mccmncArray[i].substring(0,3) == mccmnc[j][0].substring(0,3)){
                    mccmnc[j][0] = parseInt(mccmncArray[i], 10) < parseInt(mccmnc[j][0], 10) ? mccmncArray[i] : mccmnc[j][0];
                    mccmnc[j][1] = ';';
                    mccmnc[j][2] = parseInt(mccmncArray[i], 10) > parseInt(mccmnc[j][2], 10) ? mccmncArray[i] : mccmnc[j][2];
                    break;
                }
            }
            if(j == mccmnc.length){
                mccmnc.push([mccmncArray[i], ';', mccmncArray[i]]);
            }
        }
        var mccmncString = [];
        for(i = 0; i < mccmnc.length; i++){
                mccmncString[i] = mccmnc[i][0] + mccmnc[i][1] + mccmnc[i][2];
        }
        return mccmncString;
    }
    function divideMCCMNC(hplmns) {
        var result = [];
        for(startPos = 0, ArrayNum = 1; startPos <= hplmns.length;){
            endPos = hplmns.indexOf("($)", startPos);
            if(endPos != -1){
                result[ArrayNum-1] = hplmns.substring(startPos, endPos);
                startPos = endPos + "($)".length;
                ArrayNum = ArrayNum + 1;
            }else{
                result[ArrayNum-1] = hplmns.substring(startPos, hplmns.length);
                return result;
            }
        }
    }
}

/**************************************************************************
Function : GetRemainingUnlockNetworkAttempts
     Description : Get the remaining number of unlock network attempts before lockdown
     Parameters :void
     return : object unlockAttempts:
     Attributes: maxAttempts : Integer : an integer equal to or greater than zero
               : remainingAttempts : Integer : an integer equal to or greater than zero
**************************************************************************/
function GetRemainingUnlockNetworkAttempts() {
    var result = syncRequest({cmd :'unlock_nck_time'});
    if(!result) {
        return -1;
    }
    
    var attemptsResult = {
        maxAttempts: 5,
        remainingAttempts: parseInt(result.unlock_nck_time, 10)
    };
    return attemptsResult;
}

/**************************************************************************
Function : UnlockNetwork
Description : Attempt to unlock network
Parameters : String : strUnlockNetworkCode : code used to attempt to unlock network
return : void
**************************************************************************/
function UnlockNetwork(strUnlockNetworkCode, callback) {
    postData({
        goformId : "UNLOCK_NETWORK",
        unlock_network_code : strUnlockNetworkCode
    }, callback);
}

/**************************************************************************
Function : IsDoubleTapEnabled
Description : Get the user's double tap enabled setting. (Double tapping the power key will toggle to display of SSID and Wi-Fi key on the device OLED.)
Parameters : void
return : bDoubleTapEnabled : Boolean : true = double tap is enabled, false = double tap is disabled
**************************************************************************/
function IsDoubleTapEnabled() {
    var result = syncRequest({cmd :'is_show_ssid_key_oled'});
    if(!result) {
        return false;
    }
    return result.is_show_ssid_key_oled == "1" ? true : false;
}

/**************************************************************************
Function : SetDoubleTapEnabled
Description : Set the user's double tap enabled setting. (Double tapping the power key will toggle to display of SSID and Wi-Fi key on the device OLED.)
Parameters : void
return : bDoubleTapEnabled : Boolean : true to enable the feature, false to disable it.
**************************************************************************/
function SetDoubleTapEnabled(bDoubleTapEnabled, callback) {
    //Please map doubleTapEnabled to one of true or false and modify the device accordingly
    var enabled = bDoubleTapEnabled ? "1" : "0";
    postData({
        goformId : "SET_SHOW_SSID_KEY_OLED",
        doubleTapEnabled : enabled
    }, callback);
}

/**************************************************************************
Function : GetWebUIProductName
Description : Get WebUI product name; this is device specific and will be either 'quickstart' or 'mobilewifi'.
Parameters : void
return : string : strWebUIProductName : WebUI product name ['quickstart'|'mobilewifi']
**************************************************************************/
function GetWebUIProductName() {
    if(cacheData.webui_product_name){
        return cacheData.webui_product_name;
    }
    var params = {
        cmd: 'webui_product_name',
        multi_data : 1
    };
    var result = syncRequest(params);
    if(!result) {
        return "";
    } else if(result && result.webui_product_name.length > 0){
        cacheData.webui_product_name = result.webui_product_name;
    }
    return result.webui_product_name;
}

/**************************************************************************
Function : GetPhoneNumber
Description : get phone number from (1) any value passed in via SavePhoneNumber or (2) SIM Card phone number(Msisdn)
Parameters : void
return : string : strMsisdn : phone number, max-length = 31 Bytes.
**************************************************************************/
function GetPhoneNumber() {
    if (SupportedFeatures().VENDORWIFI){
        clearIdleTimer();
    }
    if(cacheData.msisdn){
        return cacheData.msisdn;
    }
    var result = syncRequest({cmd :'msisdn'});
    if(!result) {
        return "";
    } else if(result.msisdn && result.msisdn.length > 0){
        cacheData.msisdn = result.msisdn;
    }
    return result.msisdn;
}

/**************************************************************************
Function : SavePhoneNumber
Description : Override the default SIM Card phone number
Parameters :
    [IN] string : strPhone : the phone number.
return: void
**************************************************************************/
function SavePhoneNumber(strPhone) {
    postData({
        goformId: "SAVE_PHONE_NUMBER",
        Phone_Num: strPhone
    }, function(result){
        if(result){
            cacheData.msisdn = strPhone;
        }
    });
}

/**************************************************************************
 Function : GetCurrentNetwork
 Description : get current network information
 Parameters :
 [IN] : function :callback(bResult, vNetwork) : call back function, and the parameters list below:
 [IN] : bool   : bResult     : true = succeed, false = failed.
 [IN] : object : vNetwork : network information object, the object attribute list below:
 type   :   name       : description
 string : strFullName  : operator full name(the value is maybe ""),
 such as 'china mobile'
 string : strShortName : operator short name(the value is maybe ""),
 such as 'china mobile'
 string : strNumeric   : the digital number, such as '460'
 number : nRat         : the network connect technology, 0 = '2G', 2 = '3G', 7 = '4G'.
 string : strBearer   : the current bearer, maybe one of:
    <empty>
    GSM
    GPRS
    EDGE
    WCDMA
    HSDPA
    HSUPA
    HSPA
    TD_SCDMA
    HSPA+
    EVDO Rev.0
    EVDO Rev.A
    EVDO Rev.B
  if get current network information failed, the return value will be null.
 return : void
 **************************************************************************/
//var indx = 0;
function GetCurrentNetwork(callback) {
    var params = {
        cmd : 'network_provider_fullname,network_provider,rmcc,rmnc,network_type',
        multi_data :1
    };
    asyncRequest(params, callback, function(data){
         // the object of network information
        if(data && data.network_type){
            var vNetwork = {};
            vNetwork.strFullName = data.network_provider_fullname;
            vNetwork.strShortName = data.network_provider;
            /*Roam or Home icons does not display*/
            if(data.rmcc == "0" && data.rmnc == "0"){
                vNetwork.strNumeric = "";
            }else{
                var mnc = data.rmnc;
                if(mnc.length == 1){
                    mnc = "0" + mnc;
                }
                vNetwork.strNumeric = data.rmcc + mnc;
            }                        
            if(data.network_type == "UMTS"){
                vNetwork.strBearer = "WCDMA";
            }else if(data.network_type == "DC-HSPA+"){
                vNetwork.strBearer = "HSPA+";
            }else {
                var networkType = data.network_type.toLowerCase();
                if (networkType == "limited_service_gsm" || networkType == "limited_service_lte" || networkType == "limited_service_wcdma") {
                    vNetwork.strBearer = "Limited Service";
                }else {
                    vNetwork.strBearer = data.network_type;
                }
            }
            if (data.network_type == "GSM" || data.network_type == "GPRS"|| data.network_type == "EDGE") {
                vNetwork.nRat = 0;
            } else if (data.network_type == "HSDPA" || data.network_type == "HSUPA" || data.network_type == "UMTS" || data.network_type == "HSPA"
                        || data.network_type == "HSPA+" || data.network_type == "DC-HSPA+") {
                vNetwork.nRat = 2;
            } else if(data.network_type == "LTE") {
                vNetwork.nRat = 7;
            } else {
                vNetwork.nRat = -1;
            }        
            return [true,vNetwork];
        } else {
            return [false,""];
        }
    });
}

/*function GetCurrentNetworkName() //New
 {
 var curNetwork = "test network";
 //Vendor to call own API and populate curNetwork with the current network.
 return curNetwork;
 }

 function GetMonitoringStatus()//New
 {
 var mStatus = "test mStatus";
 //Vendor to call own API and populate mStatus with the monitoring status.
 return mStatus;
 }*/

function GetIMSIFromDevice() {
    if (SupportedFeatures().VENDORWIFI){
        clearIdleTimer();
    }
    if(cacheData.sim_imsi != undefined){
        return cacheData.sim_imsi;
    }
    var result = syncRequest({cmd : 'sim_imsi'});
    if(!result) {
        return 0;
    }else if(result && result.sim_imsi.length > 0) {
        cacheData.sim_imsi = result.sim_imsi;
    }
    return result.sim_imsi;
}

function GetPinTimes() {
    var result = syncRequest({cmd : 'pinnumber'});
    if(!result) {
        return 0;
    }
    return parseInt(result.pinnumber, 10);
}

function GetPUKTimes() {
    var result = syncRequest({cmd :'puknumber'});
    if(!result) {
        return 0;
    }
    return parseInt(result.puknumber, 10);
}

function GetProductName() {
    if(cacheData.product_name){
        return cacheData.product_name;
    }
    var params = {
        cmd : 'modem_model',
        multi_data : 1
    };

    var result = syncRequest(params);
    if(!result){
        return "";
    } else if(result.modem_model && result.modem_model.length > 0){
        cacheData.product_name = result.modem_model;
    }
    return result.modem_model;
}

function GetSoftwareVersion() {
    if (SupportedFeatures().VENDORWIFI){
        clearIdleTimer();
    }
    if(cacheData.wa_inner_version){
        return cacheData.wa_inner_version;
    }
    var result = syncRequest({cmd :'wa_inner_version'});
    if(!result) {
        return "";
    } else if(result.wa_inner_version && result.wa_inner_version.length > 0){
        cacheData.wa_inner_version = result.wa_inner_version;
    }
    return result.wa_inner_version;
}


function GetHWVersion() {
    if (SupportedFeatures().VENDORWIFI){
        clearIdleTimer();
    }
    if(cacheData.hardware_version){
        return cacheData.hardware_version;
    }
    var result = syncRequest({cmd : 'hardware_version'});
    if(!result) {
        return "";
    } else if(result.hardware_version && result.hardware_version.length > 0) {
        cacheData.hardware_version = result.hardware_version;
    }
    return result.hardware_version;
}

function GetSerialNumber() {
    if (SupportedFeatures().VENDORWIFI){
        clearIdleTimer();
    }
    if(cacheData.modem_msn){
        return cacheData.modem_msn;
    }
    var result = syncRequest({cmd : 'modem_msn'});
    if(!result){
        return "";
    } else if(result.modem_msn && result.modem_msn.length > 0){
        cacheData.modem_msn = result.modem_msn;
    }
    return result.modem_msn;
}

function GetSimSerialNumber(){ //Serial number of sim (ICCID)
    if (SupportedFeatures().VENDORWIFI){
        clearIdleTimer();
    }
    if(cacheData.sim_iccid){
        return cacheData.sim_iccid;
    }
    var result = syncRequest({cmd : 'sim_iccid'});
    if(!result){
        return "";
    }else if(result.sim_iccid && result.sim_iccid.length > 0){
        cacheData.sim_iccid = result.sim_iccid;
    }
    return result.sim_iccid;
}

/**************************************************************************
Function : GetDataCounter
Description : get flux information
Parameters :
    [IN] : function : callback(bResult, vResponse) : call back function, and the parameters list below:
        [IN] : bool : bResult : true = succeed, false = failed.
        [IN] : object : vResponse : it is an object variable containing the flux information, the attributes list below.
               if failed, we will return null.
                 type : name : description
                number : nCurrentConnectTime : current connection time(unit : second).
                number : nCurrentUploadRate : current uplink speed(unit : byte/second).
                number : nCurrentDownloadRate: current downlink speed(unit : byte/second).
                number : nTotalUpload : total upload flux(unit : byte).
                number : nTotalDownload : total download flux(unit : byte).
                number : nTotalConnectTime : total connection time(unit : second).
                number : nTotalLifeTime : total time device has been powered up(unit : second).
return : void
**************************************************************************/
function GetDataCounter(callback) {
    var params = {
        cmd : 'realtime_tx_thrpt,realtime_rx_thrpt,total_tx_bytes,total_rx_bytes,realtime_time,total_time,system_uptime',
        multi_data : 1
    };
    asyncRequest(params, callback, function(data){
        if(!data ) {
            return[false, ""];
        } else {
            var vDataCounter = {};
            vDataCounter.nCurrentUploadRate = Number(data.realtime_tx_thrpt);
            vDataCounter.nCurrentDownloadRate = Number(data.realtime_rx_thrpt);
            vDataCounter.nTotalUpload = Number(data.total_tx_bytes);
            vDataCounter.nTotalDownload = Number(data.total_rx_bytes);
            vDataCounter.nCurrentConnectTime = Number(data.realtime_time);
            vDataCounter.nTotalConnectTime = Number(data.total_time);
            vDataCounter.nTotalLifeTime = Number(data.system_uptime);
            return [true,vDataCounter];
        }
    });
}

var ajaxErrorTimes = 0;

var dataCounterCmd = ",realtime_tx_thrpt,realtime_rx_thrpt,total_tx_bytes,total_rx_bytes,realtime_time,total_time,system_uptime";
var currentNetworkCmd = ",network_provider_fullname,network_provider,rmcc,rmnc,network_type";


var timerCmd = "sms_received_flag,sms_remind,ppp_status,msisdn,signalbar,modem_main_state,simcard_roam,pinnumber,puknumber,pin_status,upgrade_result,activate_flag,sim_active_result,sim_imsi,sim_iccid" + dataCounterCmd + currentNetworkCmd;

if(SupportedFeatures().VENDORWIFI) {
    var wifiCmd = ",RadioOff,SSID1,EncrypType,wifi_encrypt_auto_flag,battery_charging,battery_value,battery_percent,curr_connected_devices,curr_user_login_status";
    timerCmd += wifiCmd;
}

function TimerCallbackFunction() {
    $.ajax({
        type: "GET",
        url: "/goform/goform_get_cmd_process",
        data: {
            cmd : timerCmd,
            multi_data: 1,
            sms_received_flag_flag: 0
            //sts_received_flag_flag: 0
        },
        timeout: 2500,
        dataType : "json",
        cache : false,
        error : function(data) {
            ajaxErrorTimes++;
            if (ajaxErrorTimes >= 4) {
                orignalNetwork = null;
                orignalNetworkConnectionStatus = null;
                ajaxErrorTimes = 0;
                apiCallbackObject.setNetworkConnectionStatus("nodevice", true);
            }
            setTimeout(TimerCallbackFunction, 1000);
        },
        success : function(data) {
            ajaxErrorTimes = 0;
            if (data.sms_received_flag == "1" || data.sms_remind == "1") {
                g_fnNewSMSCallback(1);
                if(data.sms_remind == "1"){
                    resetRemindFlag();
                }
            }
            if(apiCallbackObject.getDataCounterCallback){
                updateDataCounter(data);
            }
            
            if(apiCallbackObject.setNetworkConnectionStatus){
                updateNetworkConnectionStatus(data);
                updateNetworkType(data);
            }
            
            if(apiCallbackObject.setPhoneNumber){
                apiCallbackObject.setPhoneNumber(data.msisdn);
            }
            
            if(apiCallbackObject.setSignalStrength){
                updateSignalStrength(data);
            }
            
            if(apiCallbackObject.getNetworkCallback){
                updateCurrentNetwork(data);
            }
            
            if(apiCallbackObject.setSimCardStatus){
                updateSimCardStatus(data);
            }
            if(simActivationComplete){
                updateSimActiveStatus(data);
            }
            if(SupportedFeatures().ONLINEUPDATE && apiCallbackObject.setFirmwareUpdateStatus){
                updateUpgrdStatus(data);
            }
            
            if(SupportedFeatures().VENDORWIFI && VendorWifi) {
                processTimerSuccessForWifi(data);
            }
            
            setTimeout(TimerCallbackFunction, 1000);
        }
    });
}
function resetRemindFlag() {
    postData({
            goformId : "SET_REMIND_FLAG",
            sms_remind : 0,
            redirect_flag : ""
        });
}
function processTimerSuccessForWifi(data) {
    if (typeof VendorWifi.GetWifiCallbackDestination().setBatteryStatus !== 'function') {
        return;
    }

    //mantis 0034286: If the user is idle for 10 or more mins,the device doesn't logout the user automatically
    VendorWifi.updateLoginStatus(data, idleTimer);

    if(SupportedFeatures().BATTERY){
        VendorWifi.updateBatteryStatus(data);
    }
    VendorWifi.updateWifiSettings(data);
    VendorWifi.updateConnectedDevices(data);
}

function updateSignalStrength(data) {
    if (data && data.signalbar != "" && data.modem_main_state == "modem_init_complete") {
        apiCallbackObject.setSignalStrength(data.signalbar, true);
    }else{
        apiCallbackObject.setSignalStrength("0", false);
    }
}

function updateCurrentNetwork(data) {
    if(data && data.modem_main_state == "modem_init_complete"){
        var vNetwork = {};
        vNetwork.strFullName = data.network_provider_fullname;
        vNetwork.strShortName = data.network_provider;
        if(data.rmcc == "0" && data.rmnc == "0"){
            vNetwork.strNumeric = "";
        }else{
            var mnc = data.rmnc;
            if(mnc.length == 1){
                mnc = "0" + mnc;
            }
            vNetwork.strNumeric = data.rmcc + mnc;
        }
        if(data.network_type == "UMTS"){
            vNetwork.strBearer = "WCDMA";
        }else if(data.network_type == "DC-HSPA+"){
            vNetwork.strBearer = "HSPA+";
        }else if (data.network_type == "LTE"){
            vNetwork.strBearer = "LTE(CAT3)";        //For VDF 's R212 & K5008, it's cat3
        }else {
            var networkType = data.network_type.toLowerCase();
            if (networkType == "limited_service_gsm" || networkType == "limited_service_lte" || networkType == "limited_service_wcdma") {
                vNetwork.strBearer = "Limited Service";
            }else {
                vNetwork.strBearer = data.network_type;
            }
        }
        if (data.network_type == "GSM" || data.network_type == "GPRS"|| data.network_type == "EDGE") {
            vNetwork.nRat = 0;
        } else if (data.network_type == "HSDPA" || data.network_type == "HSUPA" || data.network_type == "UMTS" || data.network_type == "HSPA"
                    || data.network_type == "HSPA+" || data.network_type == "DC-HSPA+") {
            vNetwork.nRat = 2;
        } else if(data.network_type == "LTE") {
            vNetwork.nRat = 7;
        } else {
            vNetwork.nRat = -1;
        }
        vNetwork.isRoaming =(data.simcard_roam).toLowerCase() == "home" ? false : true;
        apiCallbackObject.getNetworkCallback(true, vNetwork);
    }
}
function updateDataCounter(data) {
    if (data !=""){
        var vDataCounter = {};
        vDataCounter.nCurrentUploadRate = Number(data.realtime_tx_thrpt);
        vDataCounter.nCurrentDownloadRate = Number(data.realtime_rx_thrpt);
        vDataCounter.nTotalUpload = Number(data.total_tx_bytes);
        vDataCounter.nTotalDownload = Number(data.total_rx_bytes);
        vDataCounter.nCurrentConnectTime = Number(data.realtime_time);
        vDataCounter.nTotalConnectTime = Number(data.total_time);
        vDataCounter.nTotalLifeTime = Number(data.system_uptime);
        apiCallbackObject.getDataCounterCallback(true, vDataCounter);
    }
}

function updateNetworkType(data) {
    if(data && data.modem_main_state == "modem_init_complete") {
        var networkType = data.network_type.toLowerCase();
        if (networkType == "limited_service_gsm" || networkType == "limited_service_lte" || networkType == "limited_service_wcdma") {
            networkType = "Limited Service";
        }
        if(orignalNetwork == networkType && (networkType == "searching" || networkType == "limited_service" || networkType == "limited service" || networkType == "no_service" || networkType == "no service")) {
            return;
        }
        else {
            orignalNetwork = networkType;
        }
        
        if(networkType == "searching" || networkType == "no_service" || networkType == "no service") {
            apiCallbackObject.setNetworkConnectionStatus("searchingForNetwork", true);
        }
        else if(networkType == "limited_service" || networkType == "limited service") {
            apiCallbackObject.setNetworkConnectionStatus("limitedService", true);
        }
    }
}


function updateNetworkConnectionStatus(data){
    if(orignalNetworkConnectionStatus == data.ppp_status){
        return;
    }else{
        orignalNetworkConnectionStatus = data.ppp_status;
    }
    if (data && data.ppp_status != "" && data.modem_main_state == "modem_init_complete"){
        var connStatus;
        switch(data.ppp_status){
            case "ppp_connected":
            case "ipv6_connected":
            case "ipv4_ipv6_connected":
                connStatus = "connected";
                break;
            case "ppp_disconnected":
                connStatus = "disconnected";
                break;
            case "ppp_connecting":
                connStatus = "connecting";
                break;
            default:
                connStatus = "disconnected";
                break;
        }
        apiCallbackObject.setNetworkConnectionStatus(connStatus, true);
    }else{
        apiCallbackObject.setNetworkConnectionStatus("disconnected", false);
    }
}


function updateSimCardStatus(data) {
    var vSimCardStatus = {};
    if(data && data.modem_main_state !=""){
        switch (data.modem_main_state) {
            case 'modem_init_complete':
            //when the sim card was locked,the modem state returns ready. EC:617001937543
            case 'modem_imsi_waitnck':
                vSimCardStatus.nSimState = 1;
                break;
            case 'modem_sim_undetected':
                vSimCardStatus.nSimState = 2;
                break;
            case 'modem_waitpin':
                vSimCardStatus.nSimState = 3;
                break;
            case 'modem_waitpuk':
            case 'modem_puk_lock':
            case 'modem_sim_destroy':
                vSimCardStatus.nSimState = 4;
                break;
            default:
                setTimeout(updateSimCardStatus, 1000);
                break;
        }    
        vSimCardStatus.bPinState = data.pin_status == 1? true : false;
        vSimCardStatus.nSimPinTimes = parseInt(data.pinnumber, 10);
        vSimCardStatus.nSimPukTimes = parseInt(data.puknumber, 10);
        vSimCardStatus.nMaxPinTimes = 3;
        vSimCardStatus.nMaxPukTimes = 10;
        apiCallbackObject.setSimCardStatus(vSimCardStatus);
    }
}
function updateUpgrdStatus(data){
    if (data.upgrade_result == "success"){
        updateObject = {state: "updateSuccessful", progress: null};
        apiCallbackObject.setFirmwareUpdateStatus(true, updateObject);
    } else if (data.upgrade_result == "fail"){
        updateObject = {state: "updateFailed", progress: null};
        apiCallbackObject.setFirmwareUpdateStatus(true, updateObject);
    }
}
function updateSimActiveStatus(data){
	var result = data;
    var activationState = {};
    if(result && result.activate_flag == "1" && result.sim_active_result == "0"){        //activate_flag =1 表示首次激活，sim_active_result = 0表示激活成功
		$.ajax({
			url : "/goform/goform_get_cmd_process",
			data : {activate_flag_flag : 0,
					cmd: "activate_flag",
					multi_data:1
					},
			dataType : "json",
			cache : false,
			async: false,
			error : function() {				
			},
			success : function(data) {
				activationState.returnCode = 0;
				activationState.IMSI = result.sim_imsi;
				activationState.ICCID = result.sim_iccid;
				simActivationComplete(activationState);
			}
		});
    }else if (result.sim_active_result !== "" && result.sim_active_result != "0"){
        activationState.returnCode = Number(result.sim_active_result);
		simActivationComplete(activationState);
    }
}


function GetIMEI() {
    if (SupportedFeatures().VENDORWIFI){
        clearIdleTimer();
    }
    if(cacheData.imei){
        return cacheData.imei;
    }
    var result = syncRequest({cmd :'imei'});
    if(!result) {
        //imei will be writen in product environment
        return "developenvironment";
    }
    if(result.imei && result.imei.length > 0){
        cacheData.imei = result.imei;
    }
    return result.imei;
}

/*************************************************************************
*GetIMEIsv()
Description:
    Get IMEI software version
Return:
    IMEI software version

*
*************************************************************************/

function GetIMEIsv() {
    if (SupportedFeatures().VENDORWIFI){
        clearIdleTimer();
    }
    if(cacheData.imeiSv){
        return cacheData.imeiSv;
    }
    var params = {
        cmd : 'sv_of_imeisv'
    };
    var result = syncRequest(params);
    if(result.sv_of_imeisv !== ""){
        cacheData.imeiSv = result.sv_of_imeisv;
    }
    return result.sv_of_imeisv;
    
}

/**************************************************************************
Function : IsPINRequired
Description : get the status of the PIN code
Parameters : void
return : nIsPINRequired
nIinIsRequired == true means that a PIN is required in order to use the device.

This function is fast and synchronous.
**************************************************************************/
function IsPINRequired() {
    // TODO: Deal with the situation: result.pin_status is blank
    //Vendor code must retrieve setting and return it as defined above.
    var result = syncRequest({cmd : 'pin_status'});
    //need deal with fail ???

    return result.pin_status == '0' ? false : true;
}

/**************************************************************************
 Function : GetSIMStatus
 Description : get sim status
 Parameters : void
 return : number : nSimStatus : get SIM card Status, the value list below:
 1 = 'Ready',
 2 = 'PIN Required',
 3 = 'PUK Required',
 4 = 'no sim card or invalid card',
 if get sim status failed the return value will be 0(0 = failed).
 **************************************************************************/
function GetSIMStatus() {
    var SIMStatus = 0;
    var result = syncRequest({cmd :'modem_main_state'});
    if(!result) {
        return SIMStatus;
    }    
    switch(result.modem_main_state)
    {
        case "modem_init_complete":
        case "modem_imsi_waitnck":
            SIMStatus = 1;
            break;
        case "modem_waitpin":
            SIMStatus = 2;
            break;
        case "modem_waitpuk":
            SIMStatus = 3;
            break;
        case "modem_sim_undetected":
        case "modem_sim_destroy":
        case "modem_puk_lock":
            SIMStatus = 4;
            break;
        case "modem_imsi_lock":
        case "modem_sim_ready":
        case "modem_sim_spn":
        case "modem_detected":
        case "modem_undetected":
        case "modem_handover":
        case "modem_online":
        case "modem_ready":
        case "modem_offline":
        case "modem_initial":
            setTimeout(GetSIMStatus,1000);
            break;
        default:
            SIMStatus = 0;
            break;
    }
    //Vendor API call to retrieve SIM Status and return int as defined above
    return SIMStatus;
}
/**************************************************************************
Function : GetIPAddress(callback)
Description: Get IP address
Parameters:
callback(bResult, Object) call back function with the following parameters:
A boolean:true success, false failure
An object with the following attributes:
IPv4: a string describing the IPv4 address assigned to the client by the device in dotted-decimal notation, e.g. "192.168.0.1".
IPv6: a string describing the IPv6 address assigned to the client by the device in 8 ‘hextets’ separated by colons, e.g., “ 2001:0db8:85a3:0042:1000:8a2e:0370:7334”. Where possible the IPv6 address should be abbreviated by according with the following rules:
1、Remove leading zeros from any ‘hextet’, e.g., “2001:0db8:0000:0000:0000:ff00:0042:8329” becomes “2001:db8:0:0:0:ff00:42:8329”
2、Remove any consecutive sections consisting entirely of zeros and replace with double colon “::”, e.g., “2001:0db8:0000:0000:0000:ff00:0042:8329” becomes “2001:0db8::ff00:0042:8329”
3、With both rules applied “2001:0db8:0000:0000:0000:ff00:0042:8329” becomes “2001:db8::ff00:42:8329”
 **************************************************************************/
function GetIPAddress(callback) {
    // Vendor API call to retrieve device IPAddress and put result in var IPAddress as string
    //Callback requires a boolean value to indicate success or failure
    var ipAddress = {IPv4:"",IPv6:""};

    var params = {
        cmd : 'wan_ipaddr,ipv6_wan_ipaddr',
        multi_data : 1
    };

    asyncRequest(params, callback, function(data) {
        if(data && (data.wan_ipaddr !=="" || data.ipv6_wan_ipaddr !== "")) {
            ipAddress.IPv4 = data.wan_ipaddr;
            ipAddress.IPv6 = data.ipv6_wan_ipaddr;
            return [true, ipAddress];
        } else {
            return [false, {}];
        }
    });
}

/**************************************************************************
 Description:Set selected IP type
 Parameters : ipType and callback
 return:
 boolean result: true (success) false (failure)
 string IPType: one of "IPv4", "IPv6", "IPv4 + IPv6"
 **************************************************************************/
function SetIPType(ipType, callback){
    var selectIpType = "";
    switch(ipType) {
        case "IPv4":
            selectIpType = "IP";
            break;
        case "IPv6":
            selectIpType = "IPv6";
            break;
        case "IPv4 + IPv6":
            selectIpType = "IPv4v6";
            break;
        default :
            selectIpType = ipType;
    }
    postData({
        goformId : "SET_DIAL_IP_TYPE",
        ip_type : selectIpType        
    }, callback);
}

/**************************************************************************
function GetIPType(callback)
Description:Get selected IP type
Parameters : callback
return:
    boolean result: true (success) false (failure)
string IPType: one of "IPv4", "IPv6", "IPv4 + IPv6"
 **************************************************************************/
function GetIPType(callback){
    var ipType = syncRequest({cmd : 'pdp_type'});
    var selectIpType = "";
    if (ipType && ipType.pdp_type) {
        switch(ipType.pdp_type) {
        case "IP":
            selectIpType = "IPv4";
            break;
        case "IPv6":
            selectIpType = "IPv6";
            break;
        case "IPv4v6":
            selectIpType = "IPv4 + IPv6";
            break;
        default:
            selectIpType = "IPv4";
        }
        callback(true, selectIpType);  
    } else {
        callback(false, "");
    }  
}

/**************************************************************************
function GetSupportedIPTypes(callback)
Description: Get selected IP type
 Parameters : callback
 return:
    boolean result: true (success) false (failure)
array supportedIPTypes: ["IPv4", "IPv6", "IPv4 + IPv6"]

Note: When the result is false then supportedIPTypes should be null.
 **************************************************************************/
function GetSupportedIPTypes(callback){
    var ipSupported = ["IPv4", "IPv6", "IPv4 + IPv6"];
    callback(true,ipSupported);
}

/****************************************************************************
function GetLanIPAddressAndDomainName (callback)
Description: This function returns the LAN IP address and LAN Domain name of the device.
Parameters:
Return:
lanIPAndDomainNameObject : {
    lanIpAddress: string,
    lanDomainName: string
}
********************************************************************************/
function GetLanIPAddressAndDomainName(callback) {
    //use this to store the success/failure of the API request and return in the callback
    // Vendor API call to retrieve device IPAddress and put result in var IPAddress as string
    //Callback requires a boolean value to indicate success or failure

    var params = {
        cmd : 'lan_ipaddr_for_current,LocalDomain_for_current',
        multi_data : 1
    };

    asyncRequest(params, callback, function(data){
        if(!data) {
            return [false, {}];
        }
        return [true, {lanIpAddress: data.lan_ipaddr_for_current, lanDomainName: data.LocalDomain_for_current}];
    });    
    //callback(result, {lanIpAddress:'192.168.2.9', lanDomainName:'vodafonemobile.wifi'});
}
/*******************************************************************************
function GetDNS(callback)
Description:
Get DNS
Parameters:
callback(result,dns) : call back function, with two parameters:
result : Boolean indicating success or failure.
object: dns: an object containing the IPv4 and IPv6 addresses of the primary and secondary Domain Name Servers in dotted-decimal notation and IPv6 ‘hextet’ notation, e.g.:
{
dns1: “192.168.0.1”,
dns2: “192.168.0.2”,
dnsIPv61: “0:0:0:0:0:ffff:c0a8:1”,
dnsIPv62: “0:0:0:0:0:ffff:c0a8:1”
}
Note: dnsIPv61 and dnsIPv62 should be abbreviated by the device according to the rules set out in GetIPAddress().
***********************************************************************************/
function GetDNS(callback) {
    var DNS = {};

    var params = {
        cmd : 'ppp_status,dns_mode,ipv6_dns_mode,prefer_dns_auto,standby_dns_auto,prefer_dns_manual,standby_dns_manual,ipv6_prefer_dns_auto,' +
            'ipv6_standby_dns_auto,ipv6_prefer_dns_manual,ipv6_standby_dns_manual',
        multi_data : 1
    };

    asyncRequest(params, callback, function(data){
       if (data && (data.ppp_status == "ppp_connected" || data.ppp_status == "ipv6_connected" || data.ppp_status == "ipv4_ipv6_connected")){
           return fetchDNS(data);
       } else {
           return [false, {}];
       }
    });
    
    function fetchDNS(data) {
        if (!data) {
           return [false, {}];
        } else {
            if (data.dns_mode == "auto"){
                DNS.dns1 = data.prefer_dns_auto;
                DNS.dns2 = data.standby_dns_auto;
            } else if (data.dns_mode == "manual") {
                DNS.dns1 = data.prefer_dns_manual;
                DNS.dns2 = data.standby_dns_manual;
            }
            if (data.ipv6_dns_mode == "auto") {
                DNS.dnsIPv61 = data.ipv6_prefer_dns_auto;
                DNS.dnsIPv62 = data.ipv6_standby_dns_auto;
            } else if (data.ipv6_dns_mode == "manual") {
                DNS.dnsIPv61 = data.ipv6_prefer_dns_manual;
                DNS.dnsIPv62 = data.ipv6_standby_dns_manual;
            }
            return [true, DNS];
        }
    }
}
// Function to set the ISO-3166 language string.
// Parameters :
//   [IN] : function : callback : callback function.
//   [IN] : String : strLanguageString : The ISO-3166 String to set as the langauge.
function SetLanguage(callback, strLanguageString) {
    postData({
        goformId : "SET_WEB_LANGUAGE",
        Language : strLanguageString.toLowerCase()
    }, callback);
}

// Function to return the user's preferred message preview setting.
function IsMessagePreview() {
    var result = syncRequest({ cmd : 'is_msg_preview'});
    return result && result.is_msg_preview == "1" ? true : false;
}

// Function to save the user's preferred message preview setting.
// Parameters :
//   [IN] : boolean : isMessagePreview : true - user wishes to see the messages previewed.  False - they do not.
function SetMessagePreview(isMessagePreview) {
    // Vendor API call to save boolean in persistent storage indicating whether to preview messages on first page.
    postData({
        goformId : "SET_MSG_PREVIEW_STATUS",
        isMessagePreview : isMessagePreview == true ? "1" : "0"
    });
}

// Function to get the ISO-3166-language string.
// Parameters :
//   [OUT] : String : The ISO-3166 langauge string if any.  If none then "".
function GetLanguage() {
    var result = syncRequest({cmd : 'Language'});
    return (result && result.Language) ? result.Language : null;
}

/**************************************************************************
 Function : ScanForNetwork
 Description : scan the network
 Parameters :
 [IN] : function :callback(bResult, listNetwork) : call back function, and the parameters list below:
 [IN] : bool   : bResult     : true = succeed, false = failed.
 [IN] : object : listNetwork : network information array, the object attribute in the array below:
 type   :   name                   : description
 string : strFullName              : operator full name(the value is maybe ""),
 such as 'china mobile'
 string : strShortName             : operator short name(the value is maybe ""),
 such as 'china mobile'
 string : strNumeric               : the digital number, such as '460'
 number : nRat                     : the network connect technology, 0 = '2G', 2 = '3G', 7='4G'
 number : nState : operator availability as int at+cops=? <stat> (This is as per 3GPP TS 27.007)
 if get net work list failed, the return value will be an null array.
 return : void
 **************************************************************************/
function ScanForNetwork(callback) {
    //when callback(false, []), the test will have error....
    if (SupportedFeatures().VENDORWIFI){
        clearIdleTimer();
    }
    $.post("/goform/goform_set_cmd_process", {
        goformId : "SCAN_NETWORK"
    }, function(data) {
        if (data.result == "success") {
            checkScanStatus();
        } else {
            callback(false, []);
        }
    }, "json").error(function() {
        callback(false, []);
    });

    function checkScanStatus() {
        $.getJSON("/goform/goform_get_cmd_process", {
            cmd : "m_netselect_status",
            "_" : new Date().getTime()
        }, function(data) {
            if (data.m_netselect_status == "manual_selecting") {
                setTimeout(checkScanStatus, 1000);
            } else {
                $.get("/goform/goform_get_cmd_process", {
                    cmd : "wan_manual_contents_long",
                    "_" : new Date().getTime()
                }, function(data2) {
                    parseScanResult(data2);
                }).error(function() {
                    callback(false, []);
                });
            }
        }).error(function() {
            callback(false, []);
        });
    }

    function parseScanResult(result) {
        if(result == "" || result.indexOf("(") == -1 || result.indexOf(")") == -1) {
            callback(false, []);
            return;
        }
        
        // 1,China Mobile Communication Corp.,China Mobile,46000,0
        //'(1,"China Unicom","China Unicom","46001",0),'
        var pattern = /\(([^,]*),([^,]*),([^,]*),([^,]*),([^,]*)\),/g;
        var listNetwork = [];
        var mts;
        while (mts = pattern.exec(result)) {
            if (mts != null) {
                listNetwork.push({
                    strFullName: mts[2].replace(/\"/g,''), 
                    strShortName: mts[3].replace(/\"/g,''), 
                    strNumeric: mts[4].replace(/\D/g,''), 
                    nRat: parseInt(mts[5],10), 
                    nState: parseInt(mts[1],10)
                });
            }
        }
        callback(true, listNetwork);
    }
}
//********************************************ome undefined here...***********************************//


/**************************************************************************
 Function : SetNetwork
 Description : set current network
 Parameters :
 [IN] : string   : strNetworkNumber : the network digital number MCCMNC.
 [IN] : number   : nRat : the network connect technology: 0 = "2G", 2 = "3G", 7= "4G"
 [IN] : function : callback(bResult) : call back function, and the parameters list below:
 [IN] : bool : bResult : true = succeed, false = failed.
 return : bool : if the parameters is invalid, the function will return false, otherwise will return true.
 comment: we need another parameter nRat, the value may be: 0 = '2G' or 2 = '3G'.
 **************************************************************************/
function SetNetwork(strNetworkNumber, nRat, callback) {
    if((typeof(strNetworkNumber) !== "string") || (strNetworkNumber === "") ||
            (typeof(nRat) !== "number") || (isNaN(nRat))) {
        if(typeof(callback) === "function") {
            callback(false);//VDF null
            return;
        }
    }
    var nRat1 = -1;
    if(nRat === 0 || nRat === 2 || nRat === 7) {
        nRat1 = nRat;
    }
    if(-1 === nRat1) {
        if(typeof(callback) === "function") {
            callback(false);//VDF null
            return;
        }
    }
    var vNetwork = {};
    postData({
        goformId: "SET_NETWORK",
        NetworkNumber: strNetworkNumber,
        Rat: nRat1
    },function(result){
        if(result){
            var counter = 0;
            Timer = setInterval(function(){
                var selectResult = syncRequest({cmd : 'm_netselect_result', multi_data : 1},function(data){
                    if(!data) {
                        return "";
                    } else {
                        return data.m_netselect_result;
                    }
                });
                if(selectResult == "manual_success" || selectResult == "manual_fail") {
                    clearInterval(Timer);
                    setSelectNetwork(selectResult);
                } else if(counter < 60) {
                    counter++;
                } else {                        
                    selectResult == "manual_fail";
                    clearInterval(Timer);
                    setSelectNetwork(selectResult);                        
                }                        
            },1000);
        }else{
            clearInterval(timer);
            callback(false);
        }
    });
    
    function setSelectNetwork(selectResult){
        if(selectResult == "manual_success"){
            GetCurrentNetwork(function(result,currentNetwork){
                if(result){
                    vNetwork.strNumeric = currentNetwork.strNumeric;
                    vNetwork.nRat = currentNetwork.nRat;
                    vNetwork.strFullName = currentNetwork.strFullName;
                    vNetwork.strShortName = currentNetwork.strShortName;
                    vNetwork.nState = 2;//currentNetwork.strBearer;
                    callback(vNetwork);
                }else{
                    callback(false);
                }
            });    
        }else{
            callback(false);
        }
    }
}

/**************************************************************************
 Function : SetNetworkAcquisitionToAutomatic
 Description : sets the network acquisition to automatic.  Note this must persist through power down and restart of the device
 Parameters :
 [IN] : function :callback(vNetwork) : call back function

 type   :   name       : description
 string : strFullName  : operator full name(the value is maybe ""),
 such as 'china mobile'
 string : strShortName : operator short name(the value is maybe ""),
 such as 'china mobile'
 string : strNumeric   : the digital number, such as '23415' (MCCMNC)
 number : nRat         : the network connect technology, 0 = '2G', 2 = '3G'.
 number : nMode        : the network mode defines whether the network acquisition is done automatically or it is forced by this command to operator as part of at+cops? (3GPP TS 27.007), 0 is automatic, 1 is manual
 if SetNetworkAcquisitionToAutomatic failed, the network in the callback value will be null.
 return : void
 **************************************************************************/

function SetNetworkAcquisitionToAutomatic(callback) {
    // do the work to set the acquisition to be automatic
    postData({
        goformId : "SET_BEARER_PREFERENCE",
        BearerPreference : "WCDMA_preferred"        
    }, callback);
}

/**************************************************************************
Function : GetNetworkAcquisitionMode
Description : get search network mode
Parameters : void
return : number : nMode : 0 = 'automatic', 1 = 'manual'
**************************************************************************/
function GetNetworkAcquisitionMode() {
    var result = syncRequest({cmd : "net_select_mode"});
    if (result.net_select_mode == "auto_select") {
        return 0;
    } else if(result.net_select_mode == "manual_select"){
        return 1;
    }else{
        return -1;
    }
}

function SendSMSAndGetResponse(strNumber, strMessageBody, strIdentifier, callback) {

    /* //Please supply all SMS content in the following JSON format
    //var oneMessage = "{\"messages\":[ {\"id\": \"1\", \"date\": \"13/05/10\", \"time\": \"14:00\", \"from\": \"+447864629574\", \"body\": \"Hi James I just wanted to remind you about the meeting with our client\", \"isNew\": true}] }";

    var result = true; //use this to store the success/failure of the API request and return in the callback
    var response;
    //Vendor API call to send SMS and wait for reply SMS

    //strIdentifier is an array of SMS senders. eg. shortcode or operator string
    //Only callback once an SMS has been recieved from one of the senders in the identifiers array.
    //Callback with the SMS content identified above.

    //This will be used to send data to the network, and we expect an SMS to be sent back to confirm.
    //This function needs to wait until we get an SMS response from a sender which is in the strIdentifiers

    //Callback requires a boolean value to indicate success or failure along with the SMS message response
    callback(result, response); */
    if (SupportedFeatures().VENDORWIFI){
        clearIdleTimer();
    }
    if(!strIdentifier || strIdentifier.length <= 0){
        callback(false, "");
        return ;
    }
    
    SendSMS(strNumber, strMessageBody, function(sendResult){
        if(!sendResult){
            callback(false, "");
        } else{
            var timer = setInterval(function(){
                $.ajax({
                url : "/goform/goform_get_cmd_process",
                data:{
                    cmd : "sms_page_data",
                    page : 0,
                    data_per_page : 500,
                    mem_store : 1,
                    tags : 1,
                    order_by : "order by id desc"
                },
                dataType : "json",
                async : false,
                cache : false,
                error : function() {
                    clearInterval(timer);
                    callback(false, "");
                },
                success : function(data) {
                    var messageArray = data.messages;
                    for(var i = 0;i < messageArray.length; i++) {
                        for (var j = 0; j < strIdentifier.length; j++) {
                            var number = strIdentifier[j];
                            if(messageArray[i].number == num) {
                                var msgs = parseMessage(messageArray[i]);
                                msgs.id = messageArray[i].id;
                                msgs.from = messageArray[i].number;
                                msgStr = messageArray2String(msgs);
                                var response = "{\"messages\": "+ msgStr +"}";
                                clearInterval(timer);
                                callback(true, response);
                                return;
                            }
                        }
                    }
                }
                });
            },3000);
        }}, -1);
}
/**************************************************************************
 Function: GetSMSMessages
 Description: get sms messages information
 Parameters:
 [IN] : number : nMessageStoreType, you can select following value:
 type : meaning

 NOTE: THESE NUMBERS ARE DIFFERENT FROM GetSMSCount.  SORRY!

 1 : 'local inbox'
 2 : 'local outbox'
 3 : 'local draftbox'
 4 : 'local dustbin' //ignore this type for current version.
 5 : 'SIM inbox'
 6 : 'SIM outbox'
 7 : 'SIM draftbox'
 [IN] : number : nPageNum : SMS UI page index.
 [IN] : number : nNumberMessagesPerPage : an page read count, the value can between [1, 50].
 [IN] : function : callback(listMessagesJSON, bResult) : callback function
 [IN] : object : listMessagesJSON : message JSON object list. Each message JSON object contains all messages information as below.
 if failed, we will return null.
 an message JSON object such as vMessagesJSON, this vMessagesJSON.messages[0]. its attributes lists below :

 type : atrributes : Description : such as
 string : id : sms Index : '1'
 string : date : Year/month/day : '13/05/10'
 string : time : hours : '14:00'
 string : from : ministry people phone : '+447864629574'
 string : body : sms content : 'Hi James!'
 bool : isNew : if isNew=true the sms is New, otherwise the sms is Old

 [IN] : bool : bResult : true = succeed , false = failed
 return: bool : true = function execute succeed, false = parameters is invalid
 **************************************************************************/
//var messageArr1 = "{\"messages\":[ {\"id\": \"11\", \"date\": \"13/05/10\", \"time\": \"14:00\", \"from\": \"+447864629574\", \"body\": \"Test Save\", \"isNew\": false}, {\"id\": \"11\", \"date\": \"13/05/10\", \"time\": \"14:00\", \"from\": \"+447864629574\", \"body\": \"<\\\"/''\\\"\\\\>\", \"isNew\": true},{\"id\": \"2\", \"date\": \"11/04/10\", \"time\": \"09:07\", \"from\": \"Vodafone\", \"body\": \"\", \"isNew\": true},{\"id\": \"3\", \"date\": \"09/04/10\", \"time\": \"07:37\", \"from\": \"+447864629574\", \"body\": \"Hi there. Are you going to make the meeting at 2pm? This is a test of the 160 character limit and breaking over two lines for a message\", \"isNew\": true},{\"id\": \"4\", \"date\": \"03/03/10\", \"time\": \"17:54\", \"from\": \"Vodafone Roaming\", \"body\": \"Welcome to Ireland. You are connected to Vodafone IRL.  (Test QUNIT Send)\", \"isNew\": true},{\"id\": \"5\", \"date\": \"09/02/10\", \"time\": \"21:46\", \"from\": \"Vodafone\", \"body\": \"Your monthly limit is 3Gb. We will text you when you reach this\", \"isNew\": true},{\"id\": \"6\", \"date\": \"09/02/10\", \"time\": \"21:46\", \"from\": \"+447864629574\", \"body\": \"Did you manage to get those wire frames over to the build team?\", \"isNew\": true},{\"id\": \"7\", \"date\": \"09/02/10\", \"time\": \"21:46\", \"from\": \"+447864629574\", \"body\": \"Hey Carl this is another test of the 140 and 160 character limit and how it should be dealt with in the inbox breaking over two lines seems to work\", \"isNew\": true}] }";
function GetSMSMessages(nMessageStoreType, nPageNum, nNumberMessagesPerPage, callback) {
    if (SupportedFeatures().VENDORWIFI){
        clearIdleTimer();
    }
    var tag;
    var memStore;
    function  getMsgTime(Msg){
        var MsgTimeArray = Msg.date.split(",");

              /* consider the time zone*/
//            if (Msg.date.indexOf("+") >-1){
//                MsgTimeArray[3] -= (MsgTimeArray[6].replace("/+/",""))/4;
//            }else if(MsgTimeArray.indexOf("-") >-1){
//                MsgTimeArray[3] += (MsgTimeArray[6].replace("/-/",""))/4;
//            }

        /*板侧返回两位数年份，如1999返回99，2012返回12*/
        if(MsgTimeArray[0] < "70"){
            MsgTimeArray[0] = "20" + MsgTimeArray[0];
        }
        var msgTime = new Date(MsgTimeArray[0], MsgTimeArray[1]-1, MsgTimeArray[2], MsgTimeArray[3], MsgTimeArray[4], MsgTimeArray[5]).getTime();
        return  msgTime;
    }
    switch(nMessageStoreType){
        case 1:
        case 5:
            tag = 12;
            break;
        case 2:
        case 6:
            tag = 2;
            break;
        case 3:
        case 7:
            tag = 11;
            break;
        default:
            tag = 10;
            break;
    }
    $.ajax({
        url: "/goform/goform_get_cmd_process",
        data: {
            cmd : "sms_page_data",
            page: nPageNum - 1,
            data_per_page : nNumberMessagesPerPage,
            mem_store : 1,
            tags: tag,
            order_by : "order by id desc"
        },
        dataType: "json",
        async: false,
        cache: false,
        error: function(data) {
            callback({messages:[]}, false);
        },        
        success: function(data) {
            if(!data){
            callback({messages:[]}, false);
            }else {
                var msgArray = [];
                var messageArray = data.messages;
                
                if(!SupportedFeatures().SMS_DATABASE){
                    if(tag === 2 || tag === 11){
                        messageArray = messageArray.reverse();
                    }
                }
                /* 
                 * mantis  0035215:K5008-Z SMS draft messages not sorted by date/time;
                 * here only the draft messages was sorted,because inbox and sent-box messages in datebase was
                 * sorted by id ,which was align to the time when they were created or edited.
                 */ 
                 if(tag === 11){
                    messageArray.sort(function(prevMessage, latterMessage){
                        var preMsgTime = getMsgTime(prevMessage);
                        var latterMsgTime = getMsgTime(latterMessage);
                        if (preMsgTime > latterMsgTime){
                            return -1;
                        } else if (preMsgTime < latterMsgTime){
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                }
                for(var i = 0;i < messageArray.length; i++) {
                    var msgs = parseMessages(messageArray[i]);
                    msgs.id = messageArray[i].id;
                    msgs.from = messageArray[i].number;
                    msgArray.push(msgs);
                }
                
                var response = JSON.stringify(msgArray);                
                var response = "{\"messages\": " + response +"}";                
                callback(response,true);
            }
        }
    });
}
function messageArray2String(messages){
    var msgs = "[ ";
    for(var i = 0; i < messages.length; i++){
        var message = messages[i];
        var msg = " {\"id\": \""+message.id+"\", ";
        msg += "\"date\": \""+message.date+"\", ";
        msg += "\"time\": \""+message.time+"\", ";
        msg += "\"from\": \""+message.from+"\", ";
        msg += "\"body\": \""+message.body+"\", ";
        msg += "\"isNew\": "+message.isNew+" }";
        msgs += msg;
        if(i+1 != messages.length){
            msgs += ", ";
        }
    }
    msgs += "] ";
    return msgs;
}
/**********
 Function: parseMessages
 Description: parse the jQuery object of the message xml document
 Parameters:
 [IN] : jQuery Object: doc: the jQuery object of the message xml document
 return: Array : messages array
 **********/
function parseMessages(data) {
    var message = {};
    message.body = decodeMessage(escapeMessage(data.content));
    var smsTime = data.date.split(",");
    message.date = smsTime[0] + "/" + smsTime[1] + "/" + smsTime[2];
    message.time = smsTime[3] + ":" + smsTime[4] ;
    message.isNew = data.tag == "1"? true : false;
    return message;
};
    

/**********
 Function: parseOneMessage
 Description: parse the jQuery object of the message xml document
 Parameters:
 [IN] : jQuery Object: doc: the jQuery object of the message xml document
 return: JSON : a message object
 **********/
function escapeMessage(msg) {
    var returnMsg = "";
    for(var i=0; i < msg.length; i+=4){
        var temp = msg.substring(i, i+4);
        if(temp == "000D" || temp == "0009" || temp == "0000"||temp == "0003"||temp == "001B"){
            returnMsg += "";
        }else{
            returnMsg += temp;
        }
    }
    return returnMsg;
}

/**********
 Function: getNodeValue
 Description: get the attribute value of special node in the xml document
 Parameters:
 [IN] : XML node: node: the node in the xml document.
 [IN] : String: attr: the attribute of the node.
 return: String : attribute value
 **********/
function getNodeValue(node, attr){
    return $(node).find(attr).attr("value");
}

/**********
 Function: pagingMessages
 Description: paging the message array
 Parameters:
 [IN] : array: msgs: the jQuery object of the message xml document
 [IN] : number: nPageNum: current page number
 [IN] : number: nNumberPerPage: the number of per page
 return: Array : messages array
 **********/
function pagingMessages(msgs, nPageNum, nNumberPerPage){
    if(msgs.length <= nNumberPerPage){
        return msgs;
    }
    var head = 0, tail = 0;
    head = (nPageNum - 1) * nNumberPerPage;
    if(msgs.length <= nPageNum * nNumberPerPage){
        tail = msgs.length;
    }else {
        tail = nPageNum * nNumberPerPage;
    }
    var pagedMsgs = [];
    for(var i = 0; head < tail; i++, head++){
        pagedMsgs[i] = msgs[head];
    }
    return pagedMsgs;
}
/*
* [IN] : number : nIndex, message index, there are two situations list below:
* if nIndex=-1, it means that webUI wants to save a new message to local draftbox;
* if nIndex>-1, it means that webUI wants to modify a message which has already saved in local draftbox.
* string : strSMSMessage, message to be saved
* [IN] : string : strSMSNumber, number to which the message may be sent
* [IN] : function : saveSMSMessageCallback(bResult) : callback function
* [IN] : bool   : bResult     : true = succeed , false = failed
*/
var GSM7_Table = new Array( "0040","00A3","0024","00A5","00E8","00E9","00F9","00EC","00F2","00C7","000A","00D8",     
                            "00F8","000D","00C5","00E5","0394","005F","03A6","0393","039B","03A9","03A0","03A8",
                            "03A3","0398","039E","00A0","00C6","00E6","00DF","00C9","0020","0021","0022","0023",   
                            "00A4","0025","0026","0027","0028","0029","002A","002B","002C","002D","002E","002F",
                            "0030","0031","0032","0033","0034","0035","0036","0037","0038","0039","003A","003A",     
                            "003B","003C","003D","003E","003F","00A1","0041","0042","0043","0044","0045","0046",
                            "0047","0048","0049","004A","004B","004C","004D","004E","004F","0050","0051","0052",       
                            "0053","0054","0055","0056","0057","0058","0059","005A","00C4","00D6","00D1","00DC",
                            "00A7","00BF","0061","0062","0063","0064","0065","0066","0067","0068","0069","006A",    
                            "006B","006C","006D","006E","006F","0070","0071","0072","0073","0074","0075","0076",
                            "0077","0078","0079","007A","00E4","00F6","00F1","00FC","00E0","000C","005E","007B",
                            "007D","005C","005B","007E","005D","007C","20AC");
var GSM7_Table_Extend = new Array("007B","007D","005B","005D","007E","005C","20AC","007C");
var GSM7_Table_Turkey = new Array("005E","007B","007D","005C","005B","007E","005D","007C","011E","0130","015E",
                            "00E7","20AC","011F","0131","015F");
function SaveSMSMessage(strSMSMessage, strSMSNumber, nIndex, saveSMSMessageCallback) {
    var time = getCurrentTimeString();
    if(strSMSNumber.length > 5){
        saveSMSMessageCallback(false);
    } else {
    //if one of the number length bigger than 20, then callback false
        for(var i = 0; i < strSMSNumber.length; i++) {
            if(strSMSNumber[i].length > 20) {
                saveSMSMessageCallback(false);
                return;
            }
        }
        var strNumber = "";
        if(strSMSNumber.length > 1){
            strNumber = strSMSNumber.join(";") + ";";
        } else {
            strNumber = strSMSNumber[0] + ";";
        }
        postData({
            goformId: "SAVE_SMS",
            location: 1,
            tags : 4,
            SMSNumber: strNumber,
            sms_time: time,
            SMSMessage: escapeMessage(encodeMessage(strSMSMessage)),
            Index: nIndex,
            encode_type: getEncodeType(strSMSMessage)//"UNICODE"
        }, function(result){
            if(!result){
                saveSMSMessageCallback(false);
                return;
            }
            
            var timer = setInterval(function(){
                $.ajax({
                    url:"/goform/goform_get_cmd_process",
                    data: {
                        cmd : "sms_cmd_status_info",
                        sms_cmd : 5
                    },
                    dataType : "json",
                    async : false,
                    cache : false,
                    error : function (data) {
                            clearInterval(timer);
                            saveSMSMessageCallback(false);
                    },
                    success : function(data) {
                            var status = data.sms_cmd_status_result;
                            if(status == "2"){
                                clearInterval(timer);
                                saveSMSMessageCallback(false);
                            } else if(status == "3") {
                                clearInterval(timer);
                                saveSMSMessageCallback(true);
                            }                    
                    }
                });
            }, 2000);
        });
    }
}
function getEncodeType(strMessage) {
    var encodeType = "GSM7_default";
    for(var i = 0;i < strMessage.length; i++){
        var charCode = strMessage.charCodeAt(i).toString(16);
        while(charCode.length != 4){
            charCode = "0" + charCode;
        }
        if ($.inArray(charCode.toUpperCase(), GSM7_Table) == -1 && $.inArray(charCode.toUpperCase(), GSM7_Table_Turkey) != -1) {
            encodeType = "GSM7_turkey";
        } else if ($.inArray(charCode.toUpperCase(), GSM7_Table) == -1 && $.inArray(charCode.toUpperCase(), GSM7_Table_Turkey) == -1){
            encodeType = "UNICODE";
            break;
        }
    }
    return encodeType;
}
function getCurrentTimeString() {
    var time = "";
    var d = new Date();
    time += (d.getFullYear() + "").substring(2) + ";";
    time += getTwoDigit((d.getMonth() + 1)) + ";" + getTwoDigit(d.getDate()) + ";" +
            getTwoDigit(d.getHours()) + ";" + getTwoDigit(d.getMinutes()) + ";" + 
            getTwoDigit(d.getSeconds()) + ";";

    if(d.getTimezoneOffset() < 0){
        time += "+" + (0 - d.getTimezoneOffset() / 60);
    }else{
        time += (0 - d.getTimezoneOffset() / 60);
    }
    return time;
}
function getTwoDigit(num) {
    num += "";
    while(num.length < 2) {
        num = "0" + num;
    }
    return num;
}
/*
Function: SetNewSMSCallbackFunction
Description: set new sms callback function(vodafone must be transfer the function when page load)
Parameters:
[IN] : function : callback(g_nNewSMSNumber) : callback function, the parameters list below:
[IN] : number : g_nNewSMSNumber : new sms count.
return: void */
function SetNewSMSCallbackFunction(callbackReceiveNewSMS) {
    if ("function" === typeof(callbackReceiveNewSMS))
    {
        g_fnNewSMSCallback = callbackReceiveNewSMS;
    }
} 

/**************************************************************************
 Function: GetSMSCount
 Description: get message count
 Parameters:
 [IN] : number : nSMSType, you can select following value:
 type : meaning
 1  : 'local unread'
 2  : 'local inbox'
 3  : 'local outbox'
 4  : 'local draft'
 5  : 'local dustbin'//ignore this type in current version.
 6  : 'SIM unread'
 7  : 'SIM inbox'
 8  : 'SIM outbox'
 9  : 'SIM draftbox'
 10 : 'local max storage'
 11 : 'SIM max storage'

 return: number : nSMSCount : Messages Count.
 if this function failed, the return value is -1.
 **************************************************************************/
function GetSMSCount(nSMSType) {
    //var oneXMLFlag = (GetProductName().indexOf("R203") == -1 && GetProductName().indexOf("K4201") == -1) ? true : false;
    function GetSMSNum() {
        var num = syncRequest({cmd :'sms_capacity_info'});
        return num;
    }
    var count = 0;    
    switch(nSMSType) {
        case 1:
            count = syncRequest({cmd :"sms_unread_num", multi_data : 1},function(data) {
            if (data.sms_dev_unread_count){
                return Number(data.sms_dev_unread_count);
            } else {
                return -1;
            }
            });
            break;
        case 2:
            var countResult = GetSMSNum();
            count = Number(countResult.sms_nv_rev_total);
            break;
        case 3:
            var countResult = GetSMSNum();
            count = Number(countResult.sms_nv_send_total);
            break;
        case 4:
            var countResult = GetSMSNum();
            count = Number(countResult.sms_nv_draftbox_total);
            break;
        case 5:
            count = -1;
            break;
        case 6:
            count = syncRequest({cmd :'sms_unread_num', multi_data: 1},function(data) {
            if (data.sms_sim_unread_count){
                return Number(data.sms_sim_unread_count);
            } else {
                return -1;
            }
            });            
            break;
        case 7:
            var countResult = GetSMSNum();
            count = Number(countResult.sms_sim_rev_total);
            break;
        case 8:
            var countResult = GetSMSNum();
            count = Number(countResult.sms_sim_send_total);
            break;
        case 9:
            var countResult = GetSMSNum();
            count = Number(countResult.sms_sim_draftbox_total);
            break;
        case 10:
            var countResult = GetSMSNum();
            count = Number(countResult.sms_nv_total);
            break;
        case 11:
            var countResult = GetSMSNum();
            count = Number(countResult.sms_sim_total);
            break;
        default:
            count = -1;
            break;
    }
    return count;
}
/*function parseSmsCountForQuickStart(doc, isUnread, tag) {
    var counter = 0;
    if(!doc.find("sms_node")){
        return counter;
    }
    if(tag.length == 0){
        return doc.find("sms_node").length;
    }else if(isUnread != undefined && isUnread){
        doc.find("sms_node").each(function(){
            if($(this).find("tag").attr("value")==3){
                counter++;
            }
        });
    }else{
        doc.find("sms_node").each(function(){
            if($.inArray($(this).find("tag").attr("value"), tag) != -1){
                counter++;
            }
        });
    }
    return counter;
}*/
/**
 Function: convertSmsCountType
 Description: convert the sms type to special object.
 Parameters:
 [IN] : number : nSMSType, you can select according to GetSMSCount function.
 return: Object : {"storeType": storeType, "isUnread": isUnread} : isUnread could be undefined
 */
function convertSmsCountType(nSMSType, oneXmlFlag){
    var storeType;
    var isUnread = false;
    var isAll = false;
    var tag = [];
    if(oneXmlFlag){
        switch(nSMSType){
            case 1:
                storeType = ["sms_nv_chatbox"];
                tag = ["3"];
                isUnread = true;
                break;
            case 2:
                storeType = ["sms_nv_chatbox"];
                tag = ["1", "3"];
                break;
            case 3:
                storeType = ["sms_nv_chatbox"];
                tag = ["5"];
                break;
            case 4:
                storeType = ["sms_nv_chatbox"];
                tag = ["7", "9"];
                break;    
            case 6:
                storeType = ["sms_sim_chatbox"];
                tag = ["3"];
                break;
            case 7:
                storeType = ["sms_sim_chatbox"];
                tag = ["1", "3"];
                break;
            case 8:
                storeType = ["sms_sim_chatbox"];
                tag = ["5"];
                break;
            case 9:
                storeType = ["sms_sim_chatbox"];
                tag = ["7", "9"];
                break;
            case 10:
                storeType = ["sms_nv_chatbox"];
                isAll = true;
                break;
            case 11:
                storeType = ["sms_sim_chatbox"];
                isAll = true;
                break;
            default:
                storeType = ["sms_nv_chatbox"];
                tag = ["1", "3"];
                break;
        }
    }else{
        switch(nSMSType){
            case 1:
                storeType = ["nv_inbox"];
                isUnread = true;
                break;
            case 2:
                storeType = ["nv_inbox"];
                break;
            case 3:
                storeType = ["nv_outbox"];
                break;
            case 4:
                storeType = ["nv_draft"];
                break;
            case 6:
                storeType = ["sim_inbox"];
                isUnread = true;
                break;
            case 7:
                storeType = ["sim_inbox"];
                break;
            case 8:
                storeType = ["sim_outbox"];
                break;
            case 9:
                storeType = ["sim_draft"];
                break;
            case 10:
                storeType = ["nv_inbox", "nv_outbox", "nv_draft"];
                break;
            case 11:
                storeType = ["sim_inbox", "sim_outbox", "sim_draft"];
                break;
            default:
                storeType = ["nv_inbox"];
                break;
        }
    }
    return {"storeType": storeType, "isUnread": isUnread, "tag": tag};
}

/**
 Function: parseSmsCount
 Description: parsing the xml document for counting SMS
 Parameters:
 [IN] : XML Document : doc, the document need be counted
 [IN] : boolean : isUnread, check unread SMS
 return: number : SMSCount : SMS count in the XML document
 */
function parseSmsCount(doc, isUnread){
    var counter = 0;
    if(!doc.find("sms_node")){
        return counter;
    }
    if(isUnread != undefined && isUnread){
        doc.find("sms_node").each(function(){
            if($(this).find("tag").attr("value")==3){
                counter++;
            }
        });
        return counter;
    }else{
        return doc.find("sms_node").length;
    }
}

function GetSMSStorageCapacityState(callback) {
    var vCapacity = {};
    // the total count of SMS storage in device
    // cmd=sms_nv_capability_used,sms_nv_capability&multi_data=1
    asyncRequest({cmd :'sms_capacity_info'}, callback, function(data){
        if (!data) {
            return [false, {}]
        } else {
            vCapacity.nTotal = Number(data.sms_nv_total);
            vCapacity.nUsed = Number(data.sms_nv_rev_total) +
                Number(data.sms_nv_send_total)+
                Number(data.sms_nv_draftbox_total);
            return [true,  vCapacity];
        }
    });
    // the count of SMS stores in device
    //var used = syncRequest("sms_nv_capability_used");
}

function SendSMS(strNumber, strMessageBody, callback, strID) {
    var time = getCurrentTimeString();
    postData({
        goformId: "SEND_SMS",
        Number: strNumber,
        sms_time: time,
        MessageBody: escapeMessage(encodeMessage(strMessageBody)),
        ID: strID,
        encode_type: getEncodeType(strMessageBody)
    }, function(result){
        if(!result){
            callback(false);
            return;
        }
        
        var timer = setInterval(function(){
            $.ajax({
                url:"/goform/goform_get_cmd_process",
                data: {
                    cmd : "sms_cmd_status_info",
                    sms_cmd : 4
                },
                dataType : "json",
                async : false,
                cache : false,
                error : function (data) {
                        clearInterval(timer);
                        callback(false);
                },
                success : function(data) {                        
                    var status = data.sms_cmd_status_result;
                    if(status == "2"){
                        clearInterval(timer);
                        callback(false);
                    } else if(status == "3") {
                        clearInterval(timer);
                        callback(true);
                    }
                }
            });
        }, 2000);
    });
}

function SendSmsToRecipients(strNumbers, strMessageBody, callback, strID) {
    //only support sending to max 5 phonenumber
    if($.isArray(strNumbers) && strNumbers.length > 0 && strNumbers.length < 6){
        //if one of the number length bigger than 20, then callback false
        for(var i = 0; i < strNumbers.length; i++) {
            if(strNumbers[i].length > 20) {
                callback(false);
                return;
            }
        }
        
        var strNumber = strNumbers.join(";");
        SendSMS(strNumber, strMessageBody, callback, strID);
    } else {
        callback(false);
    }
}

function DeleteSMS(ID, callback) {
    if (ID.length == 0) {
        callback(false);
        return;
    }
    postData({
        goformId : "DELETE_SMS",
        msg_id : ID + ";"
    }, function(result) {
        if (!result) {
            callback(false);
            return;
        }
        var timer = setInterval(function() {
            $.ajax({
                url:"/goform/goform_get_cmd_process",
                data: {
                    cmd : "sms_cmd_status_info",
                    sms_cmd : 6
                },
                dataType : "json",
                async : false,
                cache : false,
                error : function (data) {
                    clearInterval(timer);
                    callback(false);
                },
                success : function(data) {
                    var status = data.sms_cmd_status_result;
                    if(status == "2"){
                        clearInterval(timer);
                        callback(false);
                    } else if(status == "3") {
                        clearInterval(timer);
                        callback(true);
                    }
                }
            });
        }, 2000);
    });
}

function DeleteMultipleSMS(IDs, callback) { //new
    if (IDs.length == 0) {
        callback(false);
        return;
    }
    var message_num = IDs.join(";");    
    message_num += ";";
    postData({
        goformId : "DELETE_SMS",// DELETE_MESSAGE in asp file
        msg_id : message_num
    }, function(result) {
        if (!result) {
            callback(false);
            return;
        }

        var timer = setInterval(function() {
            $.ajax({
                url:"/goform/goform_get_cmd_process",
                data: {
                    cmd : "sms_cmd_status_info",
                    sms_cmd : 6
                },
                dataType : "json",
                async : false,
                cache : false,
                error : function (data) {
                    clearInterval(timer);
                    callback(false);
                },
                success : function(data) {
                    var status = data.sms_cmd_status_result;
                    if(status == "2"){
                        clearInterval(timer);
                        callback(false);
                    } else if(status == "3") {
                        clearInterval(timer);
                        callback(true);
                    }
                }
            });
        }, 2000);
    });
}

function SendUSSDAndGetResponse(strUSSDCommand, callback) {
    if (SupportedFeatures().VENDORWIFI){
        clearIdleTimer();
    }
    if (('string' !== typeof (strUSSDCommand)) || ('' === strUSSDCommand)) {
        if (!$.isFunction(callback)) {
            return "";
        }else{
            callback(false, "");
            return;
        }
    }
    var isAsync = true;
    var resultContent = "";
    if (typeof callback == undefined || !$.isFunction(callback)) {
        isAsync = false;
        return "";
    }
    
    checkRequestMode();
    if(!isAsync){
        return resultContent;
    }
    
    function checkRequestMode(){
        $.ajax({
            url : "/goform/goform_set_cmd_process",
            data: {
                goformId : "USSD_PROCESS",
                USSD_operator : "ussd_send",
                USSD_send_number : strUSSDCommand
            },
            cache: false,
            async: isAsync,
            dataType: "json",
            type: "POST",
            success : function(data) {
                if (data.result == "success") {
                    if(isAsync){
                        getResponse();
                    }else{
                        resultContent = getResponse();
                    }
                } else {
                    if(isAsync){
                        callback(false, "");
                    }else{
                        resultContent = "";
                    }
                }
            }
        });
    }

    function getResponse() {
        var resp = "";
        $.ajax({
            url : "/goform/goform_get_cmd_process",
            data: {cmd : "ussd_write_flag"},
            cache: false,
            async: isAsync,
            dataType: "json",
            success: function(result){
                if (result.ussd_write_flag == "15") {
                    setTimeout(getResponse, 1000);
                } else if (result.ussd_write_flag == "16") {
                    var result = syncRequest({cmd :'ussd_data_info'});
                        if(!result) {
                            if(isAsync){
                                callback(false, "");
                            }else{
                                resp = "";
                            }
                        } else {
                            var response = result.ussd_data;
                            response = decodeMessage(response).replace(/"/g, "\\\"");
                            if(isAsync) {
                                callback(true, response);
                            }else{
                                resp = response;
                            }
                        }
                }else {
                    // ussd_write_flag="1"(no signal)/"4"(unknown)
                    if(isAsync) {
                        callback(false, "");
                    }else{
                        resp = "";
                    }
                }
            }
        });
        if(!isAsync) {
            return resp;
        }
    }
}

    function Connect(callback) {
        if (SupportedFeatures().VENDORWIFI){
            clearIdleTimer();
        }
        $.post("/goform/goform_set_cmd_process", {
            goformId : "CONNECT_NETWORK"
        }, function(data) {
            if (data.result == "success") {
                checkConnectStatus();
            } else {
                callback(false);
            }
        }, "json").error(function() {
            callback(false);
        });

        function checkConnectStatus() {
            result = syncRequest({cmd :'ppp_status', multi_data : 1});
            if(result.ppp_status  == "ppp_connecting") {
                setTimeout(checkConnectStatus,1000);
        } else if (result.ppp_status == "ppp_connected" || result.ppp_status == "ipv6_connected" || result.ppp_status == "ipv4_ipv6_connected") {
                //setNetworkConnectionStatus("connected");
                callback(true);
            } else {
                callback(false);
            }
        }
    }

    function Disconnect(callback) {
        if (SupportedFeatures().VENDORWIFI){
            clearIdleTimer();
        }
        $.post("/goform/goform_set_cmd_process", {
            goformId : "DISCONNECT_NETWORK"
        }, function(data) {
            if (data.result == "success") {
                checkDisConnectStatus();
            } else {
                callback(false);
            }
        }, "json").error(function() {
            callback(false);
        });

        function checkDisConnectStatus() {
            result = syncRequest({cmd :"ppp_status", multi_data :1});
            if(result.ppp_status == "ppp_disconnecting" || result.ppp_status == "ppp_connected"|| result.ppp_status == "ipv6_connected" || result.ppp_status == "ipv4_ipv6_connected") {
                setTimeout(checkDisConnectStatus, 1000);
            } else if (result.ppp_status == "ppp_disconnected") {
                callback(true);
            } else {
                callback(false);
            }
        }
    }
    
    function EnterPin(strPinNumber, callback) {
        postData({
            goformId : "ENTER_PIN",
            PinNumber : strPinNumber
        }, callback);
    }

    function EnablePin(strOldPinNumber, strNewPinNumber, callback) {
        postData({
            goformId : "ENABLE_PIN",
            OldPinNumber : strOldPinNumber,
            NewPinNumber : strNewPinNumber
        }, callback);
    }

    function DisablePin(strOldPinNumber, callback) {
        postData({
            goformId : "DISABLE_PIN",
            OldPinNumber : strOldPinNumber
        }, callback);
    }

    function EnterPUK(strPUKNumber, strPinNumber, callback) {
        postData({
            goformId : "ENTER_PUK",
            PUKNumber : strPUKNumber,
            PinNumber : strPinNumber
        }, callback);
    }
    
/**************************************************************************
Function: GetSupportedConnectionModes
Description: Get supported connection modes
Parameters:
[IN] : function : callback(vSupportedConnectionModes, bResult) : callback function with the parameters listed below:
  [IN] :bool : bAutomatic  : true if automatic mode is supported
  [IN] :bool : bManual  : true if manual mode is supported
  [IN] :bool : bOnDemand  : true if on-demand mode is supported
[IN] : bool : bResult : true = succeed, false = failed.
return: void
**************************************************************************/

function GetSupportedConnectionModes(callback) {
    var vSupportedConnectionModes = {
        bAutomatic : false,
        bManual : false,
        bOnDemand : false
    };
    asyncRequest({cmd :'connection_mode'}, callback, function(data){
        if(data.connection_mode == ""){
            return [false,""];
        }
        var modesArr = data.connection_mode.split(',');
        for(var i = 0; i < modesArr.length; i++){
            if($.inArray(i.toString(), modesArr) != -1){
                switch(i.toString()){
                    case "0":
                        vSupportedConnectionModes.bAutomatic = true;
                        break;
                    case "1":
                        vSupportedConnectionModes.bManual = true;
                        break;
                    case "2":
                        vSupportedConnectionModes.bOnDemand = true;
                        break;
                    default:
                        break;
                }
            }
        }
        return [true,vSupportedConnectionModes];
    });
}

/*Function: GetSupportedAuthenticationTypes
Description: Get supported auth types
Parameters:
[IN] : function : callback(vSupportedAuthenticationTypes, bResult) : callback function with the parameters listed below:
[IN] :bool : PAP  : true PAP is supported
[IN] :bool : CHAP  : true if CHAP is supported
[IN] :bool : PAP_CHAP  : true if PAP_CHAP is supported
[IN] : bool : bResult : true = succeed, false = failed.
return: void*/

    function GetSupportedAuthenticationTypes(callback) {
        var bResult = true;
        var vSupportedAuthenticationTypes = ['PAP', 'CHAP'];
        callback(bResult, vSupportedAuthenticationTypes);
    }


/**************************************************************************
 Function: GetConnectionMode
 Description: get connection mode
 Parameters:
 [IN] : function : callback(strConnectionMode, bAutoConnectWhenRoaming, bResult) : call back function, and the parameters list below:
 [IN] : string : strConnectionMode : connection mode, '0' indicates automatic, '1' indicates manual.
 if get connection mode failed, we will return "".
 [IN] : bool : bAutoConnectWhenRoaming : whether the device should auto connect when roaming
 false = forbidden, true = open.
 [IN] : bool : bResult : true = succeed, false = failed.
 return: void
 **************************************************************************/
    function GetConnectionMode(callback) {
        //if (SupportedFeatures().VENDORWIFI){                //this API was called periodically,EC:617002250033
        //   clearIdleTimer();
        //}
        $.ajax({
            url:"/goform/goform_get_cmd_process",
            data: {
                cmd : "dial_mode,roam_setting_option",
                multi_data : 1
            },
            dataType : "json",
            cache : false,
            error : function() {
                if (typeof callback == "function") {
                        callback("",false,false);
                }
            },
            success : function(data) {
                var connMode = data.dial_mode == "auto_dial" ? "0"
                    : data.dial_mode == "manual_dial" ? "1" : "2";
                var roamingFlag = data.roam_setting_option == "on" ? true : false;
                if (typeof callback == "function") {
                    callback(connMode,roamingFlag,true);
                }
            }
        });
    }

/**************************************************************************
 Function : SetConnectionMode
 Description : set connection mode
 Parameters :
 [IN] : string : strConnectionMode : connection mode, such as:
 '0' indicates automatic, '1' indicates manual, '2' indicates on-demand.
 [IN] : bool : bAutoConnectWhenRoaming : whether the device should auto connect when roaming.
 false = forbidden, true = open.
 [IN] : function : callback(bResult) : call back function, and the parameters list below:
 [IN] : bool : bResult : true = succeed, false = failed.
 return : void
 **************************************************************************/
    function SetConnectionMode(strConnectionMode, bAutoConnectWhenRoaming, callback) {
        var connMode = strConnectionMode == '0'? "auto_dial" : strConnectionMode == '1' ? "manual_dial" : "demand_dial";
        var autoConnectRoam = bAutoConnectWhenRoaming == true ? "on" : "off";
        postData({
            goformId:"SET_CONNECTION_MODE",
            ConnectionMode:connMode,
            roam_setting_option:autoConnectRoam
        }, callback);
    }
/**************************************************************************
 Function : SetCustomAccountType
 Description : set custom account type
 Parameters :
 [IN] : string : strAPN                  : APN content
 [IN] : string : strNumber               : dial-up number
 [IN] : string : strDNS                  : main DNS address
 [IN] : string : strDNS2                 : second DNS address
 [IN] : string : strSecurity             : auth type,
 '0' = 'none';
 '1' = 'PAP';
 '2' = 'CHAP';
 '3' = 'PAP;CHAP', it means that 'PAP' is prefered, and 'CHAP' is in the next place.
 if set strSecurity='PAP;CHAP'; it means that 'PAP' is prefered, and 'CHAP' is in the next place
 [IN] : string : strUsername             : Username for this connection
 [IN] : string : strPassword             : Password for this connection
 [IN] : bool : bResult : true = succeed; false = failed
 return : void
 **************************************************************************/
    function SetCustomAccountType(strAPN, strNumber, strDNS, strDNS2, strSecurity, strUsername, strPassword, callback) {

        //GetSupportedAuthenticationTypes change the value of strSecurity
        var security;
        switch(strSecurity){
        case "0":
            security = "none";
            break;
        case "1":
            security = "pap";
            break;
        case "2":
            security = "chap";
            break;
        //case "3":
        //    security = "PAP;CHAP";
        //    break;
        default:
            return callback(false);
        }
        var regExp = /(^\s*)(\s*$)/g;
        var dnsMode = "manual";
        if(strDNS.replace(regExp,'') == "" && strDNS2.replace(regExp,'') == "" ){
            dnsMode = "auto";
        }
        postData({
        goformId: "SET_CUSTOM_TYPE_V4V6",
        APN: strAPN,
        Number: strNumber,
        DNS: strDNS,
        DNS2: strDNS2,
        Security: security,
        Username: strUsername,
        Password: strPassword,
        dns_mode: dnsMode,
        ipv6_wan_apn: strAPN,
        wan_dial: strNumber,
        ipv6_ppp_auth_mode: security,
        ipv6_ppp_username: strUsername,
        ipv6_ppp_passwd: strPassword,
        ipv6_dns_mode: dnsMode,
        ipv6_prefer_dns_manual: strDNS,
        ipv6_standby_dns_manual: strDNS2
        }, callback);
    }

/**************************************************************************
Function : GetCustomAccountType
Description : get custom account type
return CustomAccountType with these attributes:
[OUT] : string : strAPN                  : APN content
[OUT] : string : strNumber               : dial-up number
[OUT] : string : strDNS                  : main DNS address
[OUT] : string : strDNS2                 : second DNS address
[OUT] : string : strSecurity             : auth type,
'0' = 'none';
'1' = 'PAP';
'2' = 'CHAP';
'3' = 'PAP;CHAP', it means that 'PAP' is preferred, and 'CHAP' is in the next place.
if set strSecurity='PAP;CHAP'; it means that 'PAP' is preferred, and 'CHAP' is in the next place
[OUT] : string : strUsername             : Username for this connection
[OUT] : string : strPassword             : Password for this connection

This is a fast synchronous function.
**************************************************************************/
function GetCustomAccountType() {
    var nCustomAccountType = {};
    var result = syncRequest({cmd :'custom_account_type', multi_data :1});
    if (!result) {
        return null;
    }
    nCustomAccountType.strAPN = result.strAPN;
    nCustomAccountType.strNumber = result.strNumber;
    nCustomAccountType.strDNS = result.strDNS;
    nCustomAccountType.strDNS2 = result.strDNS2;
    
    
    //GetSupportedAuthenticationTypes change the value of strSecurity
    switch(result.strSecurity){
    case "none":
        nCustomAccountType.strSecurity = "0";
        break;
    case "":
        nCustomAccountType.strSecurity = "1";
        break;
    case "pap":
        nCustomAccountType.strSecurity = "1";
        break;
    case "chap":
        nCustomAccountType.strSecurity = "2";
        break;
    default:
        nCustomAccountType.strSecurity = "3";
        break;
    }
    
    //nCustomAccountType.strSecurity = result.strSecurity;
    nCustomAccountType.strUsername = result.strUsername;
    nCustomAccountType.strPassword = result.strPassword;
    return nCustomAccountType;
}

    function SetAccountType(strAccountType, callback) {
        if(strAccountType.toLowerCase() == "custom") {
            postData({
                goformId: "SET_ACCOUNT_TYPE",
                AccountType: strAccountType
            }, callback);
        } else {
        if (strAccountType == "Συμβόλαιο" || strAccountType == "Faturalı") {
            strAccountType = "Contract";
        }
        if (strAccountType == "Faturasız") {
            strAccountType = "Prepaid";
        }
            result = GetAccountDetail(strAccountType);
            setAccountDetail(result);
        }

        function GetAccountDetail(accountType){
            var accountDetails = {};        
            for ( i = 0; i < 10; i++){
                var apnList = "ipv4_apn_list" + i;
                var params = {
                    cmd :apnList,
                    multi_data : 1
                };
                var dataIpv4 = {};
                dataIpv4 = syncRequest(params, function(data){
                if(data[apnList] == "") {
                    return "";
                }
                //ProfileName($)APN($)APNSetting($)DialNo($)Authentication($)UserName($)Password($)PDPType
                //($)PDPSetting($)PDPAddress($)DNS($)PriDNS($)SecDNS($)AccountType($)reporintAccountType($)TimeZone
                var result = {};
                var detail = data[apnList].split("($)");
                result.strAPN = detail[1];
                //result.apn_select = detail[2];
                result.strNumber = detail[3];
                result.strSecurity = detail[4];
                result.strUsername = detail[5];
                result.strPassword = detail[6];
                result.pdp_type = detail[7];
                result.pdp_select = detail[8] == "1"? "auto" : "manual";
                result.pdp_addr = detail[9];
                result.dns_mode = detail[10];
                result.strDNS = detail[11];
                result.strDNS2 = detail[12];
                result.strAccountType = detail[13];
                result.reportAccountType =detail[14];
                return result;
            });
                if(dataIpv4 == "") {
                    break;
                } else if (dataIpv4.strAccountType == accountType) {
                    $.extend(accountDetails,dataIpv4);
            }
        }
        for ( i = 0; i < 10; i++){
                var apnList = "ipv6_apn_list" + i;
                var params = {
                    cmd : apnList,
                    multi_data : 1
                };
                var dataIpv6 = {};
                dataIpv6 = syncRequest(params, function(data){
                    if(data[apnList] == "") {
                        return "";
                    }
                    //ProfileName($)APN($)APNSetting($)DialNo($)Authentication($)UserName($)Password($)PDPType
                    //($)PDPSetting($)PDPAddress($)DNS($)PriDNS($)SecDNS($)AccountType($)reporintAccountType($)TimeZone
                    var result = {};
                    var detail = data[apnList].split("($)");
                result.ipv6_wan_apn = detail[1];
                //result.apn_select = detail[2];
                result.wan_dial = detail[3];
                result.ipv6_ppp_auth_mode = detail[4];
                result.ipv6_ppp_username = detail[5];
                result.ipv6_ppp_passwd = detail[6];
                //result.pdp_type = detail[7];
                result.ipv6_pdp_select = detail[8] == "1"? "auto" : "manual";
                result.ipv6_pdp_addr = detail[9];
                result.ipv6_dns_mode = detail[10];
                result.ipv6_prefer_dns_manual = detail[11];
                result.ipv6_standby_dns_manual = detail[12];
                result.strAccountType = detail[13];
                result.reportAccountType =detail[14];
                return result;
            });
            if(dataIpv6 == "") {
                break;
            } else if (dataIpv6.strAccountType == accountType) {
                $.extend(accountDetails,dataIpv6);
            }
        }
        if(typeof(accountDetails.strAccountType) != "undefined") {
            if (typeof(accountDetails.strAPN) == "undefined" && typeof(accountDetails.ipv6_wan_apn) != "undefined"){
                accountDetails.strAPN = accountDetails.ipv6_wan_apn;
                accountDetails.strNumber = accountDetails.wan_dial;
                accountDetails.strSecurity = accountDetails.ipv6_ppp_auth_mode;
                accountDetails.strUsername = accountDetails.ipv6_ppp_username;
                accountDetails.strPassword = accountDetails.ipv6_ppp_passwd;
                accountDetails.pdp_select = accountDetails.ipv6_pdp_select;
                accountDetails.pdp_addr = accountDetails.ipv6_pdp_addr;
                accountDetails.dns_mode = accountDetails.ipv6_dns_mode;
                accountDetails.strDNS = accountDetails.ipv6_prefer_dns_manual;
                accountDetails.strDNS2 = accountDetails.ipv6_standby_dns_manual;
            } else if (typeof(accountDetails.ipv6_wan_apn) == "undefined" && typeof(accountDetails.strAPN) != "undefined") {
                accountDetails.ipv6_wan_apn = accountDetails.strAPN;
                accountDetails.wan_dial = accountDetails.strNumber;
                accountDetails.ipv6_ppp_auth_mode = accountDetails.strSecurity;
                accountDetails.ipv6_ppp_username = accountDetails.strUsername;
                accountDetails.ipv6_ppp_passwd = accountDetails.strPassword;
                accountDetails.ipv6_pdp_select = accountDetails.pdp_select;
                accountDetails.ipv6_pdp_addr = accountDetails.pdp_addr;
                accountDetails.ipv6_dns_mode = accountDetails.dns_mode;
                accountDetails.ipv6_prefer_dns_manual = accountDetails.strDNS;
                accountDetails.ipv6_standby_dns_manual = accountDetails.strDNS2;
            }
            return accountDetails;
        } else {
            return "";
        }
    }    
    function setAccountDetail(data) {
        if(!data) {
            callback(false);
            return;
        }    
        var regExp = /(^\s*)(\s*$)/g;
        var dnsMode = "manual";
        if(data.strDNS.replace(regExp,'') == "" && data.strDNS2.replace(regExp,'') == "") {
            dnsMode = "auto";
        }
        postData({
            goformId: "SET_AUTO_ACCOUNT_TYPE_V4V6",
            APN: data.strAPN,
            Number: data.strNumber,
            //apn_select: data.apn_select,
            DNS: data.strDNS,
            DNS2: data.strDNS2,
            Security: data.strSecurity,
            Username: data.strUsername,
            Password: data.strPassword,
            dns_mode: dnsMode,
            //pdp_type: data.pdp_type,
            pdp_select: data.pdp_select,
            pdp_addr: data.pdp_addr,
            account_type: data.strAccountType,
            reporting_account_type: data.reportAccountType,
            ipv6_wan_apn : data.strAPN,
            wan_dial: data.strNumber,
            ipv6_ppp_auth_mode: data.strSecurity,
            ipv6_ppp_username: data.strUsername,
            ipv6_ppp_passwd: data.strPassword,
            ipv6_dns_mode: dnsMode,
            ipv6_prefer_dns_manual: data.strDNS,
            ipv6_standby_dns_manual: data.strDNS2,
            ipv6_pdp_select: data.pdp_select,
            ipv6_pdp_addr: data.pdp_addr
        }, callback);
    }
}

// Invokes callback with a semi-colon separated list of valid account types.
function GetAccountType(callback) {
    var account = [];
    for(var i = 0; i < 10; i++){
        var apnList = "ipv4_apn_list" + i;
        var params = {
            cmd : apnList,
            multi_data : 1
        };
        account[i] = syncRequest(params, function(data) {
            if(data[apnList] == "") {
                return "";
            }
            var list = data[apnList].split("($)");
            var accountType = list[13];
            if (networkMccmnc == 20205 && accountType == "Contract") {
                accountType = "Συμβόλαιο";
            }else if (networkMccmnc == "28602" || networkMccmnc == "2860251"){
                if (accountType == "Contract") {
                    accountType = "Faturalı";
                } else if (accountType == "Prepaid"){
                    accountType = "Faturasız";
                }
                }
                return accountType;
            });
            if (!account[i]) {
                break;
            }
        }
        var accountType = account.join(";");
        if(accountType.lastIndexOf(";") == accountType.length - 1) {
            accountType = accountType.substring(0, accountType.length - 1);
        }
    asyncRequest({cmd :"APN_config1,ipv6_APN_config1", multi_data : 1},callback, function(data){
        if(data && (data.APN_config1 !== "" || data.ipv6_APN_config1 !== "")){
            accountType = accountType + ";Custom";
        }
        if(accountType !="") {
            return [accountType, true];
        }else {
            return ["", false];
        }
    });
}
    //strAccountType is a string value, which indicates the account type. All the values list below:
    //   'Contract', 'Prepaid', 'Business', 'Consumer', 'WebSession'.
function GetDefaultAccountType() {
        /*if(cacheData.account_type) {
            return cacheData.account_type;
        }*/

    var result = syncRequest({cmd :'account_type',multi_data :1});
    //Translated The Account type Contract to Συμβόλαιο in Greek
    if(networkMccmnc == 20205 && result.account_type == "Contract") {
        result.account_type = "Συμβόλαιο";
    } else if (networkMccmnc == 28602 || networkMccmnc == 2860251) {
        if (result.account_type == "Contract") {
            result.account_type = "Faturalı";
        } else if (result.account_type == "Prepaid") {
            result.account_type = "Faturasız";
        }
    }
        /*if(result.account_type) {
            cacheData.account_type = result.account_type;
        }*/
        return result.account_type;
    }

    // return a string value, which indicates the apn
function GetApn() {
    var params = {
        cmd : 'pdp_type,wan_apn,ipv6_wan_apn',
        multi_data :1
    };
    var result = syncRequest(params,function(data){
        if(!data){
            return "";
        } else if(data.pdp_type == "IP" || data.pdp_type == "IPv4v6"){
            return data.wan_apn;
        } else if(data.pdp_type == "IPv6"){
            return data.ipv6_wan_apn;
            }
        });
        return result;
    }

    function SetBearerPreference(strBearerPreference, callback) {
        switch (strBearerPreference) {
        case "2G Only":
            strBearerPreference = "Only_GSM";
            break;
        case "3G Only":
            strBearerPreference = "Only_WCDMA";
            break;
        case "3G Preferred":
            strBearerPreference = "WCDMA_preferred";
            break;
        case "4G Only":
            strBearerPreference = "Only_LTE";
            break;
        case "4G Preferred":
            strBearerPreference = "NETWORK_auto";
            break;
        default:
            strBearerPreference = "WCDMA_preferred";
            break;
        }
        postData({
            goformId : "SET_BEARER_PREFERENCE",
            BearerPreference : strBearerPreference
        }, callback);
    }

function GetBearerPreference(callback) {
    var strBearerPreference; // TEST PURPOSES ONLY. THIS NEEDS TO BE ACTUAL VALUE FROM DEVICE.
    asyncRequest({cmd :'net_select', multi_data :1}, callback, function(data) {
        switch (data.net_select) {
        case "Only_GSM":
            strBearerPreference = "2G Only";
            break;
        case "Only_WCDMA":
            strBearerPreference = "3G Only";
            break;
        case "WCDMA_preferred":
            strBearerPreference = "3G Preferred";
            break;
        case "Only_LTE":
            strBearerPreference = "4G Only";
            break;
        case "NETWORK_auto":
            strBearerPreference = "4G Preferred";
            break;
        default:
            strBearerPreference = "";
            break;
        }
        if (strBearerPreference == "")
            return [ "", false ];
        return [ strBearerPreference, true ];
    }, "1");
}

    /*
    var readID = Id of the message read by user;
    */
    function SetMessageRead(readID, callback) {
        /*var paramsID = readID.split(";");
        var unreadSMSID = new array;


        $.each(paramsID,function(key,value){
            var tag = GetSMSTag(value);
            if(tag == '1'){
                unreadSMSID.push(value);
            }
        })
        var IDs = unreadSMSID.join(";");*/
        if(readID[readID.length-1] != ";") {
            readID += ";"
        }
        postData({
            goformId : "SET_MSG_READ",
            msg_id : readID,
            tag : 0
        }, callback);
    }


    function SetMessageCenter(strMessageCenter, callback) {
        postData({
            goformId : "SET_MESSAGE_CENTER",
            save_time : "largest",
            status_save : 0,
            save_location : "native",
            MessageCenter : strMessageCenter
        }, function(result) {
            if(!result) {
                callback(false);
            } else {
                var counter = 0;
                var timer = setInterval(function () {$.ajax({
                    url:"/goform/goform_get_cmd_process",
                    data:{
                        cmd : "sms_cmd_status_info",
                        sms_cmd : 3
                    },
                    async : false,
                    dataType : "json",
                    success : function (data) {
                        if(data.sms_cmd_status_result == "3") {
                            clearInterval(timer);
                            callback( true );
                        } else if(data.sms_cmd_status_result == "2") {
                            clearInterval(timer);
                            callback( false );
                        } else {
                            counter ++;
                            if(counter > 60) {
                            clearInterval(timer);
                            callback( false );
                            }
                        }
                    },
                    error : function (data) {
                        clearInterval(timer);
                        callback( false );
                    }
                });
                },2000);
            }
        });
    }

function GetMessageCenter(callback) {
    asyncRequest({cmd :'sms_parameter_info'}, callback, function(data){
        if(!data) {
            return["", false];
        } else {
            return [data.sms_para_sca, true];
        }
    });
}
function ResetDataCounter(callback) {
    postData({
        goformId : "RESET_DATA_COUNTER_EX",
        reset_wan_statistics_option : "total"
    }, callback);
}

    function RestoreFactorySettings(callback) {
        //Vendor API call to restore factory settings of the device.

        //the  device will reboot when RestoreFactorySettings, so no callback
        postData({
            goformId: "RESTORE_FACTORY_SETTINGS"
        }, callback);

        /**
        setTimeout(checkRestoreResult, 5000);

        function checkRestoreResult() {
            var result = syncRequest("restore_flag");
            if (!result) {
                setTimeout(checkRestoreResult, 5000);
            } else if (result.restore_flag == "1") {
                callback(true);
            } else {
                callback(false);
            }
        }
        **/
    }

    function RebootDevice() {
        //Vendor API call to reboot the device.
        postData({
            goformId: "REBOOT_DEVICE"
        });
    }

/**************************************************************************
Function : GetRoamingStatus
Description : get Roaming status
Parameters :  
    [IN] : function : callback(bResult, bRoamingStatus) : call back function, and the parameters list below:
        [IN] : bool : bResult         : true = succeed; false = failed.
        [IN] : bool : bRoamingStatus  : roaming status, true = 'Roaming', false = 'no Roaming'.
        if get roaming status failed the bRoamingStatus value will be null. 
return : void
**************************************************************************/
function GetRoamingStatus(callback) {
    asyncRequest({cmd :'simcard_roam'}, callback, function(data) {
        if (data.simcard_roam == "") {
            return [false, false];
        }
        var bRoamingStatus = data.simcard_roam.toLowerCase() == "home" ? false: true;
        return [true, bRoamingStatus];
    });
}


/**************************************************************************
Function : GetDateTime
     Description: Get UTC date and time in a specified format. This is typically done by querying an NTP server.
     Parameters :
      [IN] : function : callback(bResult, vDateTime) : call back function with the argument list:
      [IN] : bool : bResult : true = succeed, false = failed
      [IN] : object : vDateTime : JavaScript object, with the attribute list:
     string : dateTime : the UTC date/time returned by an NTP server, formatted as per RFC3339, 5.6. Internet Date/Time Format
      (http://tools.ietf.org/html/rfc3339#section-5.6), for example: 1990-12-31T23:59:60Z
      Return : void

**************************************************************************/
    function GetDateTime(callback) {
    asyncRequest({cmd :'sntp_time', multi_data : 1},callback,function (data) {
            //var dateStr = timeStr = "";
            if (!!data.sntp_time && data.sntp_time != '0-0-0T0:0:0Z') {
                /*var datetime = data.sntp_time.toUpperCase();
                if (datetime.indexOf("Z") != -1) {
                    datetime = datetime.substring(0, datetime.length - 1);
                }
                var dt = datetime.split("T");
                var dateBits = dt[0].split('-');
                var timeBits = dt[1].split(':');
                dateStr = getTwoDigit(dateBits[0]) + "-" + getTwoDigit(dateBits[1]) + "-" + getTwoDigit(dateBits[2]);
                timeStr = getTwoDigit(timeBits[0]) + ":" + getTwoDigit(timeBits[1]) + ":" + getTwoDigit(timeBits[2]);
                var dateTimeStr = dateStr + "T" + timeStr + "Z";*/
                return [true, {dateTime : data.sntp_time}];
            } else {
                return [false, {dateTime : ""}];
            }
        });
    }

/**************************************************************************
Function : GetNetworkLocation
 Description: Get network location information from the device, typically by issuing a command from the AT+CREG family.
 Parameters :
  [IN] : function : callback(bResult, vNetworkLocation) : call back function with the argument list:
  [IN] : bool : bResult : true = succeed, false = failed
  [IN] : object : vNetworkLocation: JavaScript object, with the attribute list:
   integer : cellId : Cell Id
   integer : rncId : Radio Network Controller (RNC) Id, (only for 3G networks)
   integer : lac : Location Area Code
   [for example, vNetworkLocation = { cellId: 1, rncId: 2, lac: 3}]
 Return : void

**************************************************************************/
    function GetNetworkLocation(callback) {
    asyncRequest({cmd :'cell_id,lac_code', multi_data : 1}, callback, function (data) {
            var vNetworkLocation = {};
            if (data.cell_id == "" || data.lac_code == "") {
                return [ false, vNetworkLocation ];
            } else {
                var temp = data.cell_id;
                for ( var i = temp.length; i < 8; i++) {
                    temp = "0" + temp;
                }
                vNetworkLocation.rncId = parseInt("0x" + temp.substring(0, 4));
                vNetworkLocation.cellId = parseInt("0x" + temp.substring(4));
                vNetworkLocation.lac = parseInt("0x" + data.lac_code);
                return [true, vNetworkLocation];
            }
        });
    }

/**************************************************************************
Function : GetSimCardStatus
Description : get sim card status
Parameters : void
return: object : vSimCardStatus : the object containing the sim card status info, it's attributes list below,
        if failed, we will return null.
       type : name     : description
    number : nSimState : the sim card state, maybe one of following value:
             1 = sim card ready;
             2 = no sim card or invalid sim card;
             3 = pin required;
             4 = puk required;
    boolean : bPinState : the pin state, maybe one of following value:
             true  = pin enable;
             false = pin disable;
    number : nSimPinTimes : attempt times to enter pin code, it is between 0 and 3,
             if sim card state is not pin-required, the value will be 0.
    number : nSimPukTimes : attempt times to enter puk code, it is between 0 and 10,
             if sim card state is not puk-required, the value will be 0.
comment: when the sim card is ready, it will be one of following situation:
         first: the pin state is enable, but the user has already enter the correct pin code in the beginning.
         second: the pin state is disable.
         so the webUI needs to check the detail situation as above.
**************************************************************************/
    function GetSimCardStatus() {
        var vSimCardStatus = {};
        var params = {
            cmd : 'modem_main_state,pinnumber,puknumber,pin_status',
            multi_data : 1
        };

    var result = syncRequest(params);
        //var result = $.parseJSON(resultStr);
    switch(result.modem_main_state) {
        case 'modem_init_complete':
        //when the sim card was locked,the modem state returns ready. EC:617001937543
        case 'modem_imsi_waitnck':
            vSimCardStatus.nSimState = 1;
            break;
        case 'modem_sim_undetected':
            vSimCardStatus.nSimState = 2;
            break;
        case 'modem_waitpin':
            vSimCardStatus.nSimState = 3;
            break;
        case 'modem_waitpuk':
        case 'modem_sim_destroy':
        case 'modem_puk_lock':
            vSimCardStatus.nSimState = 4;
            break;
        default:
            setTimeout(GetSimCardStatus, 1000);
            break;
    }    
    vSimCardStatus.bPinState = result.pin_status == 1? true : false;
    vSimCardStatus.nSimPinTimes = parseInt(result.pinnumber, 10);
    vSimCardStatus.nSimPukTimes = parseInt(result.puknumber, 10);
    vSimCardStatus.nMaxPinTimes = 3;
    vSimCardStatus.nMaxPukTimes = 10;
    
    return vSimCardStatus;
}

/**************************************************************************
 Function : CheckUpdateAvailable
 Description:
 Checks for new FW updates
 Parameters:
 callback(bresult,versionInfo) –  callback function, the parameters list below:

 bool: bResult: true = succeed, false = fail

 Object: versionInfo: Has the following attributes:
 string: newVersion: the version number of the new firmware
 number: size: the new firmware size in bytes
 string: updateBenefits: description/changelog of the new firmware

 **************************************************************************/

function CheckUpdateAvailable(callback) {
    if (SupportedFeatures().VENDORWIFI){
        clearIdleTimer();
    }
    var versionInfo = {};

    checkHasNewVersion();

    function checkHasNewVersion(){
        var result = syncRequest({cmd : "new_version_state",multi_data : 1});
        if(result.new_version_state == "1" || result.new_version_state == "version_has_new_critical_software" || result.new_version_state == "version_has_new_optional_software"){
            var data = syncRequest({cmd : "update_info",multi_data : 1});
            versionInfo.newVersion = data.version;
            versionInfo.size = data.size;
            versionInfo.updateBenefits = data.description;
            callback(true, versionInfo);
        }else  if(result.new_version_state == "version_checking" || result.new_version_state == "version_start" || result.new_version_state == "version_processing"){
            setTimeout(checkNewVersion, 1000);
        }else {
            manualCheck();
        }
    }

    function manualCheck(){
        postData({
            goformId : "IF_UPGRADE",
            select_op : "check"
        }, function(data){
            if(data){
                setTimeout(checkNewVersion, 2000);
            }else {
                callback(false, null);
            }
        });
    }
    
    function checkNewVersion(){
        var result = syncRequest({cmd : "new_version_state",multi_data : 1});
        if(result.new_version_state == "1" || result.new_version_state == "version_has_new_critical_software" || result.new_version_state == "version_has_new_optional_software"){
            var data = syncRequest({cmd : "update_info",multi_data : 1});
            versionInfo.newVersion = data.version;
            versionInfo.size = data.size;
            versionInfo.updateBenefits = data.description;
            callback(true, versionInfo);
        }else if (result.new_version_state == "0" || result.new_version_state == "version_no_new_software"){
            callback(true, {});
        }else if(result.new_version_state == "version_checking" || result.new_version_state == "version_start" || result.new_version_state == "version_processing" ){
            setTimeout(checkNewVersion, 1000);
        }else if (result.new_version_state == "version_checking_failed"
        || result.new_version_state == "version_roaming" || result.new_version_state == "version_idle"){
            callback(false, null);
        }
    }
}

/**************************************************************************
 Function : SetUpdateStatus
 Description:
 Sets the user choice of ‘download’ or ‘cancel’ of a firmware update, and used to callback
 on the progress of firmware installation.
 Parameters:
 string: downloadOption: can be one of ‘download’ or ‘cancel’.
 (Note: the ‘cancel’ option will only be called while downloading).

 callback(result) : callback function, the parameters list below:
 result: boolean indicating success (the firmware can be downloaded) or failure
 (there is no firmware or the firmware cannot be downloaded)

 string: state: This can be one of the following:
 progressing    The firmware download is in progress
 failed    The firmware download has failed
 updating    The installation of the firmware is in progress
 updateSuccessful    The installation of the firmware has succeeded and the device is restarting
 updateFailed    The installation of the firmware has failed

 number: progress: This is the current percentage of download.
 Should be null if ‘state’ not equal to ‘progressing’.

 **************************************************************************/
var downloadInterval;
function SetUpdateStatus(downloadOption, callback){
    if (SupportedFeatures().VENDORWIFI){
        clearIdleTimer();
    }
    var updateObject = {};
    if(downloadOption == "download"){
        doDownLoad();
    }else if (downloadOption == "cancel"){
        cancelDownLoad();
    }
    
    function doDownLoad(){
        postData({
            goformId : "IF_UPGRADE",
            select_op : 1
        }, function(data){
            if(data){
                setUpgradeStatus();
            }else {
                return callback(false);
            }
        });
    }
    function cancelDownLoad(){
        postData({
            goformId : "IF_UPGRADE",
            select_op : 2
        },function(data){
            if(data){
                updateObject = {state:"cancelled", progress : null};
                apiCallbackObject.setFirmwareUpdateStatus(true, updateObject);
            }
        });
    }
    function setUpgradeStatus(){
        var data = syncRequest({cmd :"current_upgrade_state"});
        var canntUpdate = ['connect_server_failed','download_failed','upgrade_pack_error','server_unavailable','network_unavailable','pkg_exceed',"download_failed", "verify_failed"];

        if($.inArray(data.current_upgrade_state, canntUpdate) !== -1){
            apiCallbackObject.setFirmwareUpdateStatus({state:"failed", progress: null});
            callback(false);
        } else {
            callback(true);
            updateUpgradeStatus();
        }
    }
    function updateUpgradeStatus(){
        downloadInterval = setInterval(function(){
            var data = syncRequest({cmd :"current_upgrade_state,upgrade_result", multi_data :1});
            if(data.current_upgrade_state == "connecting_server" || data.current_upgrade_state == "connect_server_success") {
                updateObject = {state:"progressing", progress: 0};
                apiCallbackObject.setFirmwareUpdateStatus(true, updateObject);
            } else if(data.current_upgrade_state == "upgrading" || data.current_upgrade_state == "downloading" ){
                var progress = 0;
                var data2 = syncRequest({cmd : "pack_size_info",multi_data : 1});
                if(data2.download_size != "error" && data2.pack_total_size != "error"){
                    progress = Math.round(100*(Number(data2.download_size)/Number(data2.pack_total_size)));
                }
                updateObject = {state:"progressing", progress: progress};
                apiCallbackObject.setFirmwareUpdateStatus(true, updateObject);
            } else if (data.current_upgrade_state == "upgrade_pack_check_ok" || data.current_upgrade_state == "upgrade_prepare_install"){
                clearInterval(downloadInterval);
                updateObject = {state:"updating", progress: 100};
                apiCallbackObject.setFirmwareUpdateStatus(true, updateObject);
            }
        },500);
    }
}


/**************************************************************************
 Function    : SKU
 Description : reports SKU from the device
 Parameters  : void
 Return      : string   : reports SKU from the device to identify the market
 Comment     : This function is intended to inform WebUI so that it can do branding of the UI specific to the market.
 The supported values are:
 - Vodafone Mobile Wi-Fi
 - Vodafone Pocket WiFi
 - VHA Crazy Johns
 - QuickStart
 **************************************************************************/
function SKU(){
    if(cacheData.sku){
        return cacheData.sku;
    }
    var sku = "";
    var result = syncRequest({cmd :'sku'});
    if(result && result.sku.length > 0){
        sku = result.sku;
    }
    cacheData.sku = sku;
    return sku;
}

    function VendorStart()
    {
        timer = setTimeout(TimerCallbackFunction, 1000);
        //setTimeout(function(){currentNetworkConnectionStatus = "disconnected";},5000);
    }

/**************************************************************************
Function    : Supports
Description : reports if a specified feature is supported
Parameters  : string : feature   : one of VENDOR_1_7, VENDORWIFI_1_7, DLNA_1_14, WPS_1_14
Return      : bool   : supported : true if the specified feature is supported, otherwise false
Comment     : This function is intended to future-proof WebUI against future changes to the Vendor and VendorWiFi APIs.
              There is an understanding that all vendors will fully implement these two APIs to at least version 1.7.
              Future additions to the APIs will be added to list of allowed values.
              If a vendor implements the feature, this function will return true.
              In all other cases, this function will return false.
**************************************************************************/
    function Supports(feature)
    {
        var supported = false;
        switch(feature)
        {
            case 'VENDOR_1_7':
            case 'VENDORWIFI_1_7':
            case 'DLNA_1_14':
            case 'WPS_1_14':
                supported = true;
                break;
        }
        return supported;
    }

/**************************************************************************
 Function    : SupportedFeatures
 Description : reports supported features of the device
 Parameters  : void
     Return      : object   : {
     VENDOR : boolean,
     VENDORWIFI : boolean,
     DLNA : boolean,
     WPS : boolean,
     LTE : boolean,
     USB : boolean,
     SDCARD : boolean
     }
 WIFIBAND5GHZ : bool
    true if device supports 5Ghz Wi-Fi Band.
 IPVersionSupport : String
    Possible values are IPv4, IPv6 or IPv4And6.
 WIFIMODESWITCHING : Possible values are 0, 1, 2.
    '0' means device supports Automatic switching between 2.4Ghz and 5Ghz concurrently.
    '1' means Device Supports Automatic switching between 2.4Ghz and 5 Ghz but not concurrently.
    '2' means Device does not support Automatic switching between 2.4Ghz and 5 Ghz and not concurrently.
    
 Comment : This function is intended to future-proof WebUI against future changes to the Vendor and VendorWiFi APIs.
 There is an understanding that all vendors will fully implement these two APIs to at least version 1.7.
 Future additions to the APIs will be added to list of allowed values.
 If a vendor implements the feature, this function will return true.
 In all other cases, this function will return false.
 **************************************************************************/
    function SupportedFeatures(){
        var features = {
                VENDOR : true,
                VENDORWIFI : false,
                DLNA : false,
                WPSPIN : false,
                WPSPUSH : false,
                WPS2 : false,                //false means it is WPS1.0 other than WPS2.0 is supported
                SMS_DATABASE : true,
                LTE : false,
                USB : true,
                BATTERY: false,
                SDCARD : false,
                IPVersionSupport : 'IPv4',
                WIFIBAND5GHZ : false,
                WIFIMODESWITCHING : '2',
                DISPLAY : false,
                PINSTORE : false,
                ONLINEUPDATE : false,
                NATTYPES : 'both',
                PASSWORDENCODE: true,
                VendorAPISupport: 1.48
        };
        return features;
    }

    function SetAPICallbackObject(callbackDestination) {
        apiCallbackObject = callbackDestination;
    }

    function ForceCallbacks() {
        TimerCallbackFunction();
    }

    function StopCallBacks(){
        clearInterval(timer);
    }
    function clearIdleTimer(){
        idleTimer = new Date().getTime();
    }

    $(document).ready(function () {
        // Everything inside this will load as soon as the DOM is loaded and before the page contents are loaded.
        VendorStart();
    });

var vendorUtil = (function(){
    var Base64 = {
        // private property
        _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode : function (input, isBinaryData) {
            if(!input) return "";
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            if (!isBinaryData) {
                input = Base64._utf8_encode(input);
            }

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },

        // public method for decoding
        decode : function (input, isBinaryData) {
            if(!input) return "";
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            if (!isBinaryData) {
                output = Base64._utf8_decode(output);
            }

            return output;

        },

        // private method for UTF-8 encoding
        _utf8_encode : function (string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        // private method for UTF-8 decoding
        _utf8_decode : function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while ( i < utftext.length ) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i+1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i+1);
                    c3 = utftext.charCodeAt(i+2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }

};

    function encodeMessage(textString) {
        var haut = 0;
        var result = '';
        for ( var i = 0; i < textString.length; i++) {
            var b = textString.charCodeAt(i);
            if (haut != 0) {
                if (0xDC00 <= b && b <= 0xDFFF) {
                    result += dec2hex(0x10000 + ((haut - 0xD800) << 10) +
                            (b - 0xDC00));
                    haut = 0;
                    continue;
                } else {
                    haut = 0;
                }
            }
            if (0xD800 <= b && b <= 0xDBFF) {
                haut = b;
            } else {
                cp = dec2hex(b);
                while (cp.length < 4) {
                    cp = '0' + cp;
                }
                result += cp;
            }
        }
        return result;
    }
    function decodeMessage(str) {
        return str.replace(/([A-Fa-f0-9]{1,4})/g, function(matchstr, parens) {
            return hex2char(parens);
        });
    }
    function dec2hex(textString) {
        return (textString + 0).toString(16).toUpperCase();
    }
    function hex2char(hex) {
        var result = '';
        var n = parseInt(hex, 16);
        if (n <= 0xFFFF) {
            result += String.fromCharCode(n);
        } else if (n <= 0x10FFFF) {
            n -= 0x10000;
            result += String.fromCharCode(0xD800 | (n >> 10)) +
                String.fromCharCode(0xDC00 | (n & 0x3FF));
        }
        return result;
    }
    
    return {
        Base64 : Base64,
        encodeMessage : encodeMessage,
        decodeMessage : decodeMessage,
        dec2hex : dec2hex,
        hex2char: hex2char
    }
}());
$.extend( window, vendorUtil);



    return {
        IsDoubleTapEnabled: IsDoubleTapEnabled,
        SetDoubleTapEnabled: SetDoubleTapEnabled,
        GetWebUIProductName: GetWebUIProductName,
        GetPhoneNumber: GetPhoneNumber,
        SavePhoneNumber: SavePhoneNumber,
        GetCurrentNetwork: GetCurrentNetwork,
        GetIMSIFromDevice: GetIMSIFromDevice,
        GetPinTimes: GetPinTimes,
        GetPUKTimes: GetPUKTimes,
        GetProductName: GetProductName,
        GetSoftwareVersion: GetSoftwareVersion,
        GetHWVersion: GetHWVersion,
        GetSerialNumber: GetSerialNumber,
        GetSimSerialNumber: GetSimSerialNumber,
        GetDataCounter: GetDataCounter,
        TimerCallbackFunction: TimerCallbackFunction,
        GetIMEI: GetIMEI,
        GetIMEIsv: GetIMEIsv,
        IsPINRequired: IsPINRequired,
        GetSIMStatus: GetSIMStatus,
        GetIPAddress: GetIPAddress,
        GetIPType : GetIPType,
        GetSupportedIPTypes: GetSupportedIPTypes,
        GetLanIPAddressAndDomainName: GetLanIPAddressAndDomainName,
        GetDNS: GetDNS,
        SetLanguage: SetLanguage,
        IsMessagePreview: IsMessagePreview,
        SetMessagePreview: SetMessagePreview,
        GetLanguage: GetLanguage,
        ScanForNetwork: ScanForNetwork,
        SetNetwork: SetNetwork,
        SetNetworkAcquisitionToAutomatic: SetNetworkAcquisitionToAutomatic,
        GetNetworkAcquisitionMode: GetNetworkAcquisitionMode,
        SendSMSAndGetResponse: SendSMSAndGetResponse,
        GetSMSMessages: GetSMSMessages,
        SaveSMSMessage: SaveSMSMessage,
        SetNewSMSCallbackFunction: SetNewSMSCallbackFunction,
        GetSMSCount: GetSMSCount,
        GetSMSStorageCapacityState: GetSMSStorageCapacityState,
        SendSMS: SendSMS,
        SendSmsToRecipients: SendSmsToRecipients,
        DeleteSMS: DeleteSMS,
        DeleteMultipleSMS: DeleteMultipleSMS,
        SendUSSDAndGetResponse: SendUSSDAndGetResponse,
        Connect: Connect,
        Disconnect: Disconnect,
        EnterPin: EnterPin,
        EnablePin: EnablePin,
        DisablePin: DisablePin,
        EnterPUK: EnterPUK,
        GetConnectionMode: GetConnectionMode,
        SetConnectionMode: SetConnectionMode,
        SetCustomAccountType: SetCustomAccountType,
        GetCustomAccountType: GetCustomAccountType,
        SetAccountType: SetAccountType,
        GetAccountType: GetAccountType,
        GetDefaultAccountType: GetDefaultAccountType,
        GetApn: GetApn,
        SetBearerPreference: SetBearerPreference,
        GetBearerPreference: GetBearerPreference,
        SetMessageRead: SetMessageRead,
        SetMessageCenter: SetMessageCenter,
        GetMessageCenter: GetMessageCenter,
        ResetDataCounter: ResetDataCounter,
        RestoreFactorySettings: RestoreFactorySettings,
        RebootDevice: RebootDevice,
        GetRoamingStatus: GetRoamingStatus,
        GetSimCardStatus: GetSimCardStatus,
        GetDateTime: GetDateTime,
        GetNetworkLocation: GetNetworkLocation,
        VendorStart: VendorStart,
        Supports: Supports,
        SupportedFeatures: SupportedFeatures,
        SetAPICallbackObject: SetAPICallbackObject,
        ForceCallbacks: ForceCallbacks,
        StopCallBacks : StopCallBacks,
        GetSupportedConnectionModes: GetSupportedConnectionModes,
        GetSupportedAuthenticationTypes : GetSupportedAuthenticationTypes,
        GetSimLockInfo: GetSimLockInfo,
        UnlockNetwork: UnlockNetwork,
        SKU: SKU,
        CheckUpdateAvailable: CheckUpdateAvailable,
        SetUpdateStatus: SetUpdateStatus,
        SetIPType: SetIPType,
        clearIdleTimer: clearIdleTimer
    };
}());

$.extend( window, Vendor );