/**
 * @author Vendor 
 */

function syncRequest(params) {
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
            result = data;
        }
    });
    return result;
}
function postData(params,callback) {
    params._ = new Date().getTime();
    $.post("/goform/goform_set_cmd_process",params,function(data){
        if(typeof(callback) == "function"){
            if(data.result == "success"){
                callback(true);
            } else{
                callback(false);
            }
        }
    },"json")
    .error(function(){
        if(typeof callback == "function") {
            callback(false);
        }
    });
}

$(document).ready(function(){
    checkLaunchStatus();
});

var resetURL = "";
function checkLaunchStatus() {
    var simStatus = GetSIMStatusForLaunch();
    if (simStatus == 5) {
        setTimeout(checkLaunchStatus, 1000);
    } else {
        resetRedirectFlag();
        var url = resetURL + strPageToInvoke(simStatus);
        window.location.replace(url);
    }
}

/********************************************************
return: one of below
home.htm
home.htm?startPage=sim-error
home.htm?startPage=pin-required
home.htm?startPage=puk-required
home.htm?startPage=puk-lock not support now
*******************************************************/
function strPageToInvoke(simStatus) {
    switch (simStatus) {
        case 1:
            return "home.htm";
        case 2:
            return "home.htm?startPage=pin-required";
        case 3:
            return "home.htm?startPage=puk-required";
        case 4:
            return "home.htm?startPage=network-unlock";
        case 6:
            return "home.htm?startPage=puk-lock";
        default:
            return "home.htm?startPage=sim-error";
    }
}

/**************************************************************************
 Function : GetSIMStatusForLaunch
 Description : get sim status
 Parameters : void
 return : number : nSimStatus : get SIM card Status, the value list below:
 1 = 'Ready',
 2 = 'PIN Required',
 3 = 'PUK Required',
 4 = 'no sim card or invalid card',
 if get sim status failed the return value will be 0(0 = failed).
 **************************************************************************/
function GetSIMStatusForLaunch() {
    var simStatus = 0;
    var result = syncRequest({cmd : "modem_main_state"});
    if (!result) {
        return simStatus;
    }
    
    switch (result.modem_main_state) {
        case "modem_init_complete":
            simStatus = 1;
            break;
        case "modem_waitpin":
            simStatus = 2;
            break;
        case "modem_waitpuk":
            var pukresult = syncRequest({cmd:"puknumber"});
            if (pukresult.puknumber != 0) {
                simStatus = 3;
            } else {
                simStatus = 6;
            }
            break;
        case "modem_imsi_waitnck":
            simStatus = 4;
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
            simStatus = 5;
            break;
        case "modem_puk_lock":
        case "modem_sim_destroy":
            simStatus = 6;
            break;
        case "modem_sim_undetected":
            simStatus = 7;
            break;
        default:
            simStatus = 0;
            break;
    }
    return simStatus;
}
function resetRedirectFlag ()
{    
    var result = syncRequest({
        cmd :"sms_remind,redirect_flag",
        multi_data : 1
    });
    if (result.redirect_flag == "1" || result.sms_remind == "1"){
        var ipAddress = syncRequest({cmd:"lan_ipaddr_for_current"});
        if(ipAddress && ipAddress.lan_ipaddr_for_current !=""){
            resetURL = "http://" + ipAddress.lan_ipaddr_for_current+"\/";
        }
        ResetRedirectFlag();        
    }
    function ResetRedirectFlag() {
        postData({
            goformId : "SET_REMIND_FLAG",
            sms_remind : 0,
            redirect_flag : ""
        });
    }
}
