/*
 * vendorWifi.js: Dummy implementation of VendorWifi API
 * (c) Penrillian ltd 2012
 *
 * */

/* There are several special things for testing:
*
* In the password field for Login: 'secret' is the correct initial password (can be changed by ChangePassword).
* 'duplicate' causes the duplicateUser error.
* 'changed' logs in succesfully, then generates the changedLoginStatus automatic log out event.
* 'cellularNetworkError', 'deviceError', 'wifiConnectionError' log in successfully, then generate a
*     receivedNonSpecificError event with that error type.
* Anything else gives the badPassword error.
*
* For convenience, Login accepts just the first 4 chars (any case) of the special items (e.g. 'DUPL').
*
* In the Security Settings page, valid encryption keys (for testing radio buttons changing validation) are:
* For WEP: 10 digit number, or:
*   the current encryption type string (e.g. WPA-PSK).
**/

function say(what) {
    document.writeln(what);
}
/***
 * Using for development tracking log.
 * Please delete it when delivery<br/>
 * @param what
 * @date 2011-12-16
 */
var isIE = $.browser.msie;
function log(what, param) {
    if(isIE) return;
    if(window.console){
        if(param && typeof what === 'object' && typeof param === 'object'){
            var clone = what;
            $.extend(clone, param);
        }
        if(what.cmd && what.cmd.indexOf("RadioOff") != -1){
            window.console.debug(what);
        } else {
            window.console.info(what);
        }
    }

}


function vendorWifi() {
//    Some dummy values for the test implementation.
    var deviceErrorObject = { errorType: 'deviceError', errorId: '123', errorText: 'Some Text' };
    var unknownErrorObject = deviceErrorObject;//{ errorType: 'UNKNOWN', errorId: '123', errorText: 'Some Text' };
    var wifiCallbackDestination = window;
    var currentLoginStatus;
    var currentIpAddr = "";

    //var CurrentPassword = 'secret';
    //var DelayOnEachCallMillis = Util.inUnitTest() ? 0 : 250;
    var doSdMemoryError = false;  // True if GetSdMemorySizes is to generate the noSdCardPresent error.
    //var fileExistsOnSdCard = false; // True simulates the scenario where a file already exists in folder, used in CheckFileExist

    //setTimeout(function (){
    //    WiFiShared.updateSdMemorySizes($.noop);
    //},3000000);  // Set this to a lower value in order to test SD card failure (after said amount of time)

    function sleep(milliseconds) {
        var start = new Date().getTime();
        var i = 0;
        for (; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }

    function syncRequest(params, isPost) {
        return ajaxRequest(params, null, null, false, isPost);
    }

    function asyncRequest(params, successCallback, errorCallback, isPost) {
        ajaxRequest(params, successCallback, errorCallback, true, isPost);
    }

    function ajaxRequest(params, successCallback, errorCallback, async, isPost) {
        clearIdleTimer();
        var result = null;
        $.ajax({
            type : !!isPost ? "POST" : "GET",
            url : isPost ? "/goform/goform_set_cmd_process" : params.cmd ? "/goform/goform_get_cmd_process"
                    : "/goform/goform_set_cmd_process",
            data : params,
            dataType : "json",
            async : !!async,
            cache : false,
            error : function(data) {
                //log("ajax error callback");
                if (async) {
                    errorCallback;
                } else if(data.status == 200) {
                    result = jQuery.parseJSON('(' + data.responseText + ')');
                }
            },
            success : function(data) {
                //log($.extend(params, data));
                if (async) {
                    successCallback(data);
                } else {
                    result = data;
                }
            }
        });
        if (!async) {
            return result;
        }
    }

// Helper function for the test implementation.
// Implements the sync/async protocol (i.e. that all methods may be blocking or with callbacks),
//    and error handling behaviour and normal results.
//
// args: the arguments list passed in to the public method.
// result: the result to return or pass back normally
//
// If result has attribute errorType, it is taken to signal an error, is extended to a full error object
//    and passed back through the error callback.
//
/**
 * args: original arguments
 * result: has been defined result object
 * prepare: prepare function for ajax parameters
 * dealMethod: deal with ajax response for result object
 * errorObject: if being error, return this object as result object
 * isPost: judge the ajax request type
 */
    function doStuff(args, result, prepare, dealMethod, errorObject, isPost) {
        var params = args[0], callback = args[1], errorCallback = args[2];
        var objectToReturn;

        if (result && typeof result.errorType === 'string') {
            objectToReturn = $.extend(unknownErrorObject, result);

            if (!callback) {
                //sleep(DelayOnEachCallMillis);
                return objectToReturn;
            }
            doCallback(objectToReturn, callback, errorCallback);
        } else {
            objectToReturn = $.extend({}, result); // Duplicate it.

            var requestParams;
            if(prepare){
                requestParams = prepare(params, isPost);
            }else{
                requestParams = params;
            }
            if(!callback){
                if(requestParams && (requestParams.cmd || requestParams.goformId)){
                    var resultStr = syncRequest(requestParams, isPost);
                    if(dealMethod){
                        objectToReturn = $.extend({}, dealMethod(resultStr));
                    }else{
                        objectToReturn = resultStr;
                    }
                }
                //sleep(DelayOnEachCallMillis);
                return objectToReturn;
            } else {
                if(requestParams && (requestParams.cmd || requestParams.goformId)){
                    asyncRequest(requestParams, function(data) {
                        if(dealMethod){
                            objectToReturn = $.extend({}, dealMethod(data));
                        }else{
                            objectToReturn = $.extend({}, data);
                        }
                        doCallback(objectToReturn, callback, errorCallback);
                    }, function() {
                        if(errorObject){
                            objectToReturn = $.extend(unknownErrorObject, errorObject);
                        }else{
                            objectToReturn = $.extend(unknownErrorObject, { errorType: 'Unknown' });
                        }
                        doCallback(objectToReturn, callback, errorCallback);
                    }, isPost);
                }else{
                     doCallback(objectToReturn, callback, errorCallback);
                }
            }
        }
        function doCallback(resultToReturn, callback, errorCallback){
            errorCallback = errorCallback ? errorCallback : callback;
            if (Util.isErrorObject(resultToReturn)) {
                switch (resultToReturn.errorType) {
                case 'cellularNetworkError':
                case 'deviceError':
                case 'wifiConnectionError':
                case 'getFileListError':
                    wifiCallbackDestination.receivedNonSpecificError(resultToReturn);
                    break;
                default:
                    errorCallback(resultToReturn);
                }
            } else {
                callback(resultToReturn);
            }
        }
    }

    function SetWifiCallbackDestination(destination) {
        wifiCallbackDestination = destination;
    }

    function GetWifiCallbackDestination() {
        return wifiCallbackDestination;
    }

    function Login(params, callback, errorCallback) {

        if (typeof params !== 'object' || typeof params.password !== 'string' || params.password == '') {
            if(wifiCallbackDestination.parameterError){
                return wifiCallbackDestination.parameterError();
            }else{
                return doStuff( arguments, {errorType: 'badPassword'} );
            }
        }

//        For testing, want to simply enter the first few chars - so use abbreviations:
        function abbreviate(str) {
            return str.slice(0, 4).toLowerCase();
        }
        var fullVersions =
            ['change','cellularNetworkError','deviceError','wifiConnectionError','noSdCardPresent','duplicateUser'];
        var userIntention = $.grep(fullVersions, function (elem) {
            return abbreviate(elem) === abbreviate(params.password);
        });
        var enteredPassword = userIntention.length !== 0 ? userIntention[0] : params.password;
        /*
        CurrentPassword = syncRequest({
            cmd : "msisdn"
        });
        */
       /*  if (enteredPassword !== CurrentPassword) {//这部分应该是不需要的，暂时注释掉
            switch (enteredPassword) {
                case 'change':
                    setTimeout(function () {
                        wifiCallbackDestination.changedLoginStatus({loginStatus:'loggedOut'});
                    }, DelayOnEachCallMillis);
                    break;
                case 'cellularNetworkError':
                case 'deviceError':
                case 'wifiConnectionError':
                    setTimeout(function () {
                        wifiCallbackDestination.receivedNonSpecificError(
                            { errorType: enteredPassword, errorId: '123', errorText: 'Some Text' }
                        );
                    }, DelayOnEachCallMillis);
                    break;

                case 'noSdCardPresent':
                    doSdMemoryError = true;
                    return doStuff(arguments, { errorType: 'noSdCardPresent' });

                default:  // Immediate error
                    return doStuff(arguments, {
                        errorType: (enteredPassword === 'duplicateUser') ? 'duplicateUser' : 'badPassword'
                    });
            }
        } else{
            // Either correct password, or one of the 'magic' passwords above:
            return doStuff(arguments, {}, prepareLogin, dealLogin, {errorType: 'badPassword'}, true);
        } */
        return doStuff(arguments, {}, prepareLogin, dealLogin, {errorType: 'badPassword'}, true);

        function prepareLogin(params, isPost){
            var obj = $.extend({}, params);
            obj.goformId = "LOGIN_EXCLUSIVE";
            obj.password = SupportedFeatures().PASSWORDENCODE ? Base64.encode(params.password) : params.password;
            return obj;
        }

        function dealLogin(data){
            //in doc, notes:If the user is 'already logged in' at the device, it calls back as success.
            if(data && (data.result == "0" || data.result == "4")){
                currentLoginStatus = 'loggedIn';
                return {};
            }else{
                var loginError = {};
                switch(data.result){
                    case "1":
                        loginError = {errorType : "Login Fail"};
                        break;
                    case "2":
                        loginError = {errorType : "duplicateUser"};
                        break;
                    case "3":
                        loginError = {errorType : "badPassword"};
                        break;
                    /* case "4":
                        loginError = {errorType : "already logged in"};
                        break; */
                    default :
                        loginError = {errorType : "Login Fail"};
                        break;
                }
                currentLoginStatus = 'loggedOut';
                return $.extend(unknownErrorObject, loginError);
            }
        }
    }

    function Logout(/*params, callback, errorCallback*/) {

        return doStuff(arguments, {}, prepareLogout, dealLogout, null, true);

        function prepareLogout(params, isPost){
            var obj = $.extend({}, params);
            obj.goformId = "LOGOUT";
            return obj;
        }

        function dealLogout(data){
            if(data && data.result == "success"){
                currentLoginStatus = 'loggedOut';
                return {};
            }else{
                return $.extend(unknownErrorObject, {errorType: "loggedOutError"});
            }
        }
    }

    function ChangePassword(params) {

        return doStuff(arguments, {}, prepareChangePassword, dealChangePassword, null, true);

        function prepareChangePassword(params, isPost) {
            var obj = $.extend({}, params);
            obj.goformId = "CHANGE_PASSWORD";
            obj.newPassword = SupportedFeatures().PASSWORDENCODE ? Base64.encode(params.newPassword) : params.newPassword;
            obj.oldPassword = SupportedFeatures().PASSWORDENCODE ? Base64.encode(params.oldPassword) : params.oldPassword;
            return obj;
        }

        function dealChangePassword(data) {
            if (data && data.result === "success") {
                return {};
            } else {
                return $.extend(unknownErrorObject, {errorType : "badPassword"});
            }
        }
    }

    function LoginStatus() {
        if(!!currentLoginStatus){
            return doStuff(arguments, {
                status : currentLoginStatus
            });
        }else{
            return doStuff(arguments, {}, prepareLoginStatus, dealLoginStatus, null, false);
        }

        function prepareLoginStatus(params, isPost){
            var requestParams  = {};
            requestParams.cmd = "curr_user_login_status";
            requestParams.multi_data = 1;
            return requestParams;
        }

        function dealLoginStatus(data){
            if(data && data.curr_user_login_status){
                var loginStatus = {};
                //it should be an enum rather than Boolean
                switch(data.curr_user_login_status){
                    case "0":
                        loginStatus.status = "loggedIn";
                        break;
                    case "1":
                        loginStatus.status = "loggedOut";
                        break;
                    default:
                        loginStatus.status = "loggedOut";
                        break;
                }
                currentLoginStatus = loginStatus.status;
                return loginStatus;
            }else{
                currentLoginStatus = undefined;
                return $.extend(unknownErrorObject, {errorType : "LoginStatusError"});
            }
        }
    }

    var vendorFileUploadConfig = { //只需要修改此处的配置
        vendorUploadAction: '/cgi-bin/',
        hiddenInputHtml:    '<input type="hidden" name="randomNum" id="randomNum" value="' + Math.round(Math.random() * 10000) + '"/>'
                            + '<input type="hidden" name="unixTimestamp" id="unixTimestamp" value="' + Math.round(new Date().getTime()/1000) + '"/>'
    };

    var vendorRestoreFileUploadConfig = {
        vendorUploadAction: '/api/nvramul.cgi',
        hiddenInputHtml:    '<input type="hidden" name="randomNum" id="randomNum" value="' + Math.round(Math.random() * 10000) + '"/>'
    };

    var validUrlForFileDownload =
        'http://sourceforge.net/projects/symbianosunit/files/symbianosunit/Release%20V1.04/SymbianOsUnit1_04.zip/download';
    // Note: Device returns size of zero for folders (at present).
    var rootDirectoryList = [
                 { name: 'andover1.txt', lastUpdated: '2012-01-31 17:57:08', size: '5000', type: 'file', fileUrlOrFolderPath: validUrlForFileDownload },
                 { name: 'humeli', lastUpdated: '2012-01-12 16:54:02', size: '0', type: 'folder', fileUrlOrFolderPath: 'folder444' },
                 { name: 'andover2.txt', lastUpdated: '2012-01-06 13:17:28', size: '5000', type: 'file', fileUrlOrFolderPath: validUrlForFileDownload },
                 { name: 'jumeli', lastUpdated: '2012-02-01 17:57:08', size: '0', type: 'folder', fileUrlOrFolderPath: 'folder555' },
                 { name: 'andover3.txt', lastUpdated: '2012-01-13 12:57:08', size: '5000', type: 'file', fileUrlOrFolderPath: validUrlForFileDownload },
                 { name: 'Zfile', lastUpdated: '2012-01-31 17:57:08', size: '2000000', type: 'file', fileUrlOrFolderPath: validUrlForFileDownload },
                 { name: 'My Documents', lastUpdated: '2012-01-31 17:57:08', size: '0', type: 'folder', fileUrlOrFolderPath: 'folder666' },
                 { name: 'Videos', lastUpdated: '2012-01-31 17:57:08', size: '0', type: 'folder', fileUrlOrFolderPath: 'folder777'},
                 { name: 'Pictures', lastUpdated: '2012-01-31 17:57:08', size: '0', type: 'folder', fileUrlOrFolderPath: 'folder888'},
                 { name: 'my stuff', lastUpdated: '2012-01-31 17:57:08', size: '0', type: 'folder', fileUrlOrFolderPath: 'folder999'}
                 ];

     var subDirectoryList = [
                 { name: 'abc', lastUpdated: '2012-01-31 17:57:08', size: '0', type: 'folder', fileUrlOrFolderPath: 'folderzzz' },
                 { name: 'defg', lastUpdated: '2012-01-31 17:57:08', size: '0', type: 'folder', fileUrlOrFolderPath: 'folderaaa' },
                 { name: 'hij', lastUpdated: '2012-01-31 17:57:08', size: '0', type: 'folder', fileUrlOrFolderPath: 'folderbbb' }
                 ];
//var zoneOffsetSeconds = new Date().getTimezoneOffset() * 60;
    function GetFileList(filePathParams) {
        var fileList = {};
        if(doSdMemoryError){
            return doStuff( arguments, {errorType: 'noSdCardPresent'} );
        }
        return doStuff(arguments,{}, prepare, deal, null, true);

        function prepare(params,isPost){
            var requestParams = {};
            requestParams.goformId = "HTTPSHARE_ENTERFOLD";
            requestParams.path_SD_CARD = getFolderPath(params.folderPath);
            requestParams.timeZone = (new Date().getTimezoneOffset())/60;
            return requestParams;
            //requestParams.indexPage = "1";
        }
        function deal(data) {
            if (data) {
                if (data.result == 'failure') {
                    return $.extend(unknownErrorObject, {errorType : "getFileListError"});
                } else if (data.result == "no_sdcad") {
                    return $.extend(unknownErrorObject, {errorType : "noSdCardPresent"});
                } else {
                    var pathParams = filePathParams;
                    fileList.files = parseFileList(data.result,pathParams);
                    return fileList;

                }
            } else {
                return unknownErrorObject;
            }
        }
        function parseFileList(fileResult,params){
            var fileList = [];
            var details = fileResult.fileInfo;
            for ( var i = 0; i < details.length; i++) {
                var fileInfo = {};
                fileInfo.type = details[i].attribute == "document" ? "folder" : "file";
                fileInfo.name = details[i].fileName;
                fileInfo.size = details[i].size;
                fileInfo.lastUpdated = transUnixTime(parseInt(details[i].lastUpdateTime,10)*1000);
                fileInfo.fileUrlOrFolderPath = getFolderPath(params.folderPath) + '/' + details[i].fileName;
                if(fileInfo.type == "folder")  {
                    fileInfo.fileUrlOrFolderPath += "/";
                }
                fileList.push(fileInfo);
            }
            return fileList;
            }
    }
    function transUnixTime(millisecond) {
            var time = new Date(parseInt(millisecond, 10));
            var year = time.getFullYear();
            var month = leftPad(time.getMonth() + 1, 2, "0");
            var date = leftPad(time.getDate(), 2, "0");
            var hour = leftPad(time.getHours(), 2, "0");
            var minute = leftPad(time.getMinutes(), 2, "0");
            var second = leftPad(time.getSeconds(), 2, "0");

            //2012-08-08 08:08:08
            return  year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
        }
    function leftPad(value, length, placeholder) {
        var len = value.toString().length;
        for (; len < length; len++) {
            value = placeholder + value;
        }
        return value;
    }
    function getFolderPath(folderPath){
        if(folderPath.lastIndexOf("/") == folderPath.length-1){
            folderPath = folderPath.substring(0,folderPath.length-1);
        }

        var path = "";
        if(folderPath == ''){
            path = "/mmc2";
        }else{
            if(folderPath.indexOf("/mmc2") == 0){
                path = folderPath;
            }else if(folderPath.indexOf("/") == 0){
                path = "/mmc2" + folderPath;
            }else{
                path = "/mmc2/" + folderPath;
            }
        }
        return path;
    }

    function CreateFolder(params) {
        if(doSdMemoryError){
            return doStuff( arguments, {errorType: 'noSdCardPresent'} );
        }
        return doStuff(arguments, {}, prepareCreateFolder, dealCreateFolder, null, true);

        function prepareCreateFolder(params, isPost) {
            var requestParams = {};
            var currentTime = new Date().getTime();
            requestParams.goformId = "HTTPSHARE_NEW";
            params.folderPath = getFolderPath(params.folderPath);
            requestParams.path_SD_CARD = params.folderPath + '/' + params.folderName;
            requestParams.unixTimestamp = transUnixTime(currentTime);
            requestParams.path_SD_CARD_time_unix = Math.round(currentTime / 1e3);
            return requestParams;
        }

        function dealCreateFolder(data){
            if(data.result && data.result == "success"){
                currentIpAddr = data.IPAddress;
                doSdMemoryError = false;
                return {result: true};
            }else if(data.result && data.result == "no_sdcad"){
                doSdMemoryError = true;
                return {errorType: 'noSdCardPresent'};
            }else if(data.result && (data.result == "failure" || data.result == "exist")){
                return $.extend(unknownErrorObject, {errorType: 'CreateFolderFailure'});
            }else{
                return $.extend(unknownErrorObject, {errorType: 'deviceError'});
            }
        }
       // Support only creating in root folder.
       //rootDirectoryList.push({ name: params.folderName, size: '', type: 'folder', fileUrlOrFolderPath: '/' + params.folderName });
       //return doStuff(arguments, { errorType: 'noSdCardPresent'});
   }

    function DeleteFilesAndFolders(params) {
        if(doSdMemoryError){
            return doStuff( arguments, {errorType: 'noSdCardPresent'} );
        }

        return doStuff(arguments, {}, prepareDeleteFilesAndFolders, dealDeleteFilesAndFolders, null, true);

        function prepareDeleteFilesAndFolders(params){
            var requestParams = {};
            var names = "";
            for(var i = 0; i < params.files.length; i++){
                names += params.files[i].name + "*";
            }
            requestParams.goformId = "HTTPSHARE_DEL";
            requestParams.name_SD_CARD = names;
            params.folderPath = getFolderPath(params.folderPath);
            requestParams.path_SD_CARD = params.folderPath;
            return requestParams;
        }

        function dealDeleteFilesAndFolders(data){
            if(data.result && data.result == "success"){
                currentIpAddr = data.IPAddress;
                doSdMemoryError = false;
                return {};
            }else if(data.result && data.result == "no_sdcad"){
                doSdMemoryError = true;
                return {errorType: 'noSdCardPresent'};
            }else if(data.result && data.result == "failure"){
                return $.extend(unknownErrorObject, {errorType: 'DeleteFilesAndFoldersFailure'});
            }else{
                return $.extend(unknownErrorObject, {errorType: 'deviceError'});
            }
        }
   }

    function CheckFileExists() {
        if (doSdMemoryError) {
            return doStuff(arguments, {
                errorType : 'noSdCardPresent'
            });
        }

        var params = arguments[0];
        var fileName = params.sourcePathOnLocalMachine.split('\\').pop();
        // rootDirectoryList.push({ name: fileName, size: '10245', type: 'file',
        // fileUrlOrFolderPath: validUrlForFileDownload });
        var fileList = GetFileList({
            folderPath : params.destinationFolderOnDevice
        });
        if(fileList.errorType){
            if(arguments[1]){
                arguments[1](fileList);
                return;
            }else{
                return fileList;
            }
        }
        var fileExistsOnSdCard = false;
        for ( var i = 0; fileList.files && i < fileList.files.length; i++) {
            if (fileList.files[i].name == fileName) {
                fileExistsOnSdCard = true;
            }
        }

        var fileExistsResult = fileExistsOnSdCard ? {errorType : 'fileExists'} : {};
        if(arguments[1]){
            arguments[1](fileExistsResult);
        }else{
            return fileExistsResult;
        }
    }

    function CheckUploadFileStatus(params) { // 函数功能需要确认。是否应该循环访问确认上传状态
        if (params.isErrorTest) {
            doSdMemoryError = true; // force test case
        }
        if(doSdMemoryError){
            return doStuff(arguments, {errorType: 'noSdCardPresent'});
        }

        return doStuff(arguments, {}, prepareCheckUploadFileStatus, dealCheckUploadFileStatus);

        function prepareCheckUploadFileStatus(params){
            var requestParams = {};
            requestParams.cmd = "CheckUploadFileStatus";
            return requestParams;
        }

        function dealCheckUploadFileStatus(status){ // 此处状态需要和Server端确认。
            var statusResult = {};
            if(status.result == "5"){
                statusResult.result = "false";
            }else if(status.result == "6"){
                statusResult.result = "true";
            }else if(status.result == "7"){
                statusResult.result = "false, try again";
            }
            return statusResult;
        }
    }

// *********************************************************************************************************
//  Periodic update callbacks:
// *********************************************************************************************************
    var updateNumber = 0;

    function doPeriodicUpdates() {
        updateNumber++;
        doOnePeriodicUpdate(updateNumber);
    }

    function GetCurrentIpAddr(){
        if(currentIpAddr == ""){
            var data = syncRequest({goformId: "HTTPSHARE_INIT"}, false);
            if(data.result && data.result == "no_sdcad"){
                currentIpAddr = "";
                doSdMemoryError = true;
            }else{
                currentIpAddr = data.IPAddress;
                doSdMemoryError = false;
            }
        }
        return currentIpAddr;
    }

    function doOnePeriodicUpdate(updateNum) {
        if (typeof wifiCallbackDestination.setBatteryStatus !== 'function') {
            return;
        }
        asyncRequest({
            cmd: "RadioOff,SSID1,EncrypType,wifi_encrypt_auto_flag,battery_charging,battery_pers,battery_value,curr_connected_devices",
            multi_data: 1
        }, function(data){
            updateBatteryStatus(data);
            updateWifiSettings(data);
            updateConnectedDevices(data);
        }, function(){
            wifiCallbackDestination.setBatteryStatus({
                batteryStatus: 'use',
                batteryLevel: "0",
                batteryTime: "0"
            });
            wifiCallbackDestination.setConnectedDevices({attachedDevices: [] });
        }, false);
    }

    function updateBatteryStatus(data){
        var theBatteryStatus = {};
        var needMinutes = 3 * 60 * 60;
        var batteryValuePercent = "";
        if(data.battery_percent){
            batteryValuePercent = data.battery_percent;
        } else {
            batteryValuePercent = data.battery_value;
        }
        var batteryLevel = batteryValuePercent.length > 0 ? Number(batteryValuePercent) : 0;
        var remainMinutes = Math.round(needMinutes * batteryLevel/100);
        theBatteryStatus.batteryStatus = data.battery_charging == "0" ? 'use' : 'charging';
        theBatteryStatus.batteryLevel = batteryLevel;
        theBatteryStatus.batteryTime = remainMinutes.toString();
        wifiCallbackDestination.setBatteryStatus(theBatteryStatus);
    }

    function updateWifiSettings(data){
        var theWifiSettings = {};
        theWifiSettings.wifiStatus = data.RadioOff == "1" ? "enabled" : "disabled";
        theWifiSettings.ssid = data.SSID1;
        var encryType;
        switch(data.EncrypType.toUpperCase()){
                case "CCMP":
                case "AES":
                    encryType = "AES";
                    break;
                case "TKIPCCMP":
                case "AUTO":
                case "MIX":
                    encryType = data.wifi_encrypt_auto_flag == "1" ? "AUTO" :"MIX";
                    break;
                default:
                    encryType = data.EncrypType;
                    break;
        }
        theWifiSettings.security = encryType;
        wifiCallbackDestination.setWifiStatus(theWifiSettings);
    }

    function updateConnectedDevices(data){
        var devices = [];
        var attachedDevices = data.attachedDevices;
        for(var i = 0; attachedDevices && i < attachedDevices.length; i++ ){
            var obj = {};
            obj.macAddress = attachedDevices[i].macAddress;
            obj.ipAddress = attachedDevices[i].ipAddress;
            obj.hostName = attachedDevices[i].hostName;
            var timeconnected = attachedDevices[i].timeConnected;
            obj.timeConnected = timeconnected == "" ? "0" : timeconnected;
            devices.push(obj);
        }
        wifiCallbackDestination.setConnectedDevices({attachedDevices: devices });
    }

    //setInterval(doPeriodicUpdates, 1000);

    function ForceCallbacks() {
        doOnePeriodicUpdate();
    }

// ******************************************************************************************************
// Support for Parameter Validation
//    Note: these are not as rigorous as they need to be.  Especially validateEncryptionKey
// ******************************************************************************************************

    function checkRange(str, min, max){
        var strInt = parseInt(str,10);
        return !(strInt < min || strInt > max);
    }
    function GetParameterValidation() {
        return {
            maxPassword: 32,
            maxSsid: 32,
            maxWifiChannel: 13,
            maxPortMappingApplicationName: 30,
            maxMacSettingsDescription: 50,//none
            validatePassword: function ( password ) { return (/^[0-9A-Za-z\!#@\(\)\+\-\/\.\=\?\^_\|~`]{1,32}$/).test(password); },//none
            validateSsid: function ( ssid ) {return (/^[0-9A-Za-z\!#@\(\)\+\-\/\.\=\?\^_\|~`]{1,32}$/).test(ssid); },
            validateFolderName: function ( folderName ) {
                if(folderName.indexOf(".") == 0 && /^(\d*)|([.]*)$/.test(folderName.substring(1, folderName.length))){
                    return false;
                }
                return (/^[^\/\\:*?#'"<>|&~`]{1,25}$/).test(folderName);
            },
            validateEncryptionKey: function (key, authenticationMode) {
                var result;
                switch(authenticationMode.toUpperCase()){
                    case "NONE":
                        result = true;
                        break;
                    case "OPEN":
                    case "SHARE":
                        result = (/^([0-9A-Fa-f]{10}|[0-9A-Fa-f]{26})$/).test(key) || (/^([\x00-\x21\x23-\x26\x28-\x7f]{5}$|^[\x00-\x21\x23-\x26\x28-\x7f]{13})$/).test(key);
                        break;
                    case "AUTO":
                    case "WPA-PSK":
                    case "WPA2-PSK":
                    case "WPA/WPA2-PSK":
                        result = (/^[0-9A-Fa-f]{8,63}$/).test(key) || (/^[\x00-\x21\x23-\x26\x28-\x7f]{8,63}$/).test(key);
                        break;
                    default:
                        result = (/^[0-9A-Fa-f]{10}$/).test(key);
                        break;
                }
                return result;
            },  // Testing: key can be encry type.
            validateIpAddress: function (ipAddress) {
                var isValidateIp = (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i).test(ipAddress);
                var result = false;
                if(isValidateIp) {
                    var iparr = ipAddress.split(".");
                    result = checkRange(iparr[0], 1, 223) && !checkRange(iparr[0], 127, 127) && checkRange(iparr[1], 0, 255) && checkRange(iparr[2], 0, 255) && checkRange(iparr[3], 1, 254);
                }
                return result;
            },
            validateIPAddressWithIPVersion: function(ipAddress, IPVersionSupport) {
                var result = false;
                if(IPVersionSupport == "IPv4") {
                    var ipv4Valid = (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i).test(ipAddress);
                    if(ipv4Valid) {
                        var iparr = ipAddress.split(".");
                        result = checkRange(iparr[0], 1, 223) && !checkRange(iparr[0], 127, 127) && checkRange(iparr[1], 0, 255) && checkRange(iparr[2], 0, 255) && checkRange(iparr[3], 1, 254);
                    }
                    return result;
                }
                if(IPVersionSupport == "IPv6") {
                    var ipv6Valid = (/^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i).test(ipAddress);
                    result = ipv6Valid;
                }
                if(IPVersionSupport == "IPv4And6") {
                    var ipv4Valid = (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i).test(ipAddress);
                    var ipv4ValidResult = false;
                    if(ipv4Valid) {
                        var iparr = ipAddress.split(".");
                        ipv4ValidResult = checkRange(iparr[0], 1, 223) && !checkRange(iparr[0], 127, 127) && checkRange(iparr[1], 0, 255) && checkRange(iparr[2], 0, 255) && checkRange(iparr[3], 1, 254);
                    }
                    var ipv6Valid = (/^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i).test(ipAddress);
                    result = (ipv4ValidResult || ipv6Valid);
                }
                return result;
            },
            validateLanDomainName: function(lanDomainName) {
                return /^[a-zA-Z0-9](-?[a-zA-Z0-9]){0,62}(\.[a-zA-Z0-9](-?[a-zA-Z0-9]){0,62})+$/.test(lanDomainName);
            },
            validateSubnetMask: function (subnetMask) {
                return (/^(((255\.){3}(254|252|248|240|224|192|128|0+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255)(\.0+){3}))$/).test(subnetMask);
            },
            validatePort: function (port) {return ( (/^\d+$/).test(port) && parseInt(port,10)<65536 && 0<parseInt(port,10) );},
            validateMacAddress: function (macAddress) {
                return (/^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/).test(macAddress);
            },
            validateWpsPin: function(pinValue){
                return true;
            }
        };
    }

// ******************************************************************************************************
// Support for Get/Set combinations
// ******************************************************************************************************

    // Answers a function that answers aSettingsObject
    function makeGetterFunction( aSettingsObject ) {
        //clearIdleTimer();
        return function () {
            return doStuff(arguments, aSettingsObject);
        };
    }

    // Answers a function that sets aSettingsObject from the parameter passed in.
    function makeSetterFunction( aSettingsObject ) {
        //clearIdleTimer();
        return function () {
                $.extend( aSettingsObject, arguments[0] ); // Copy all the parameters over.
                return doStuff( arguments, {} );
            };
    }

    function GetIdleTime() {
        return doStuff(arguments, {}, prepareGetIdleTime, dealGetIdleTime);

        function prepareGetIdleTime(params,isPost){
            var requestParams = {};
            requestParams.cmd = "max_idle_time";
            requestParams.multi_data = 1;
            return requestParams;
        }

        function dealGetIdleTime(time){
            var idle = {};
            idle.value = time.max_idle_time;
            return idle;
        }
    }

    function SetIdleTime(idleTime){
        return doStuff(arguments, {}, prepareSetIdleTime, dealSetIdleTime, null, true);

        function prepareSetIdleTime(params,isPost){
            var requestParams = $.extend({}, params);
            requestParams.goformId = "SET_IDLE_TIME";
            requestParams.idleTime = params.value;
            return requestParams;
        }

        function dealSetIdleTime(data){
            if(data && data.result === "success"){
                return {};
            }else{
                return $.extend(unknownErrorObject, {errorType: "SetIdleTimeError"});
            }
        }
    }
    //var idleTime = {value: '600'} ;

    /*
    var GuestUserControl = {
        allowedToConnect: true,
        allowedToAccessSettings: false
    };
    */
    function GetGuestUserControl()
    {
        return doStuff(arguments, {}, prepareGetGuestUserControl, dealGetGuestUserControl);

        function prepareGetGuestUserControl(params){
            var requestParams = {};
            requestParams.cmd = "mgmt_guest_user_settings";
            requestParams.multi_data = "1";
            return requestParams;
        }

        function dealGetGuestUserControl(data){
            //when syncRequest,returned data may be null
           if(data && data.mgmt_guest_user_settings != ""){
                var guestUserSettingsOrig = $.parseJSON(data.mgmt_guest_user_settings);
                var guestUserSettings = {};
                $.each(guestUserSettingsOrig, function(key, value){
                    if (value === "true"){
                        value = true;
                    } else if(value ==="false"){
                        value = false;
                    }
                    guestUserSettings[key] = value;
                });
                return guestUserSettings;
            }else{
                return {};
            }
        }
    }

    function SetGuestUserControl(GuestUserControl) {
        return doStuff(arguments, {}, prepareSetGuestUserControl, dealSetGuestUserControl, null, true);

        function prepareSetGuestUserControl(params){
            var requestParams = {};
            requestParams.goformId = "SET_GUEST_USER_SETTINGS";
            var guestuserControlOrig = params;
            var guestuserControl = "{";
            $.each(guestuserControlOrig, function(key, value){
                var temp = encodeURIComponent(value);
                if(temp.length > 256){
                    return;
                }
                guestuserControl += ( "\\\"" + key + "\\\":\\\"" + temp +"\\\",");
                if(guestuserControl.length > 1024){
                    return;
                }
            });
            if(guestuserControl.length != 0){
                guestuserControl = guestuserControl.substring(0,guestuserControl.length-1);
            }
            guestuserControl += "}";
            requestParams.goformId = "SET_GUEST_USER_SETTINGS";
            requestParams.mgmt_guest_user_settings = guestuserControl;
            return requestParams;
        }

        function dealSetGuestUserControl(data){
            if(data && data.result == "success"){
                return {};
            }else{
                return $.extend(unknownErrorObject, {errorType: "SetGuestUserControlError"});
            }
        }
    }

    function GetWifiSettings() {
        return doStuff(arguments, {}, prepareGetWifiSettings, dealGetWifiSettings);

        function prepareGetWifiSettings(params,isPost){
            var requestParams = {};
            //requestParams.cmd = "wifi_settings";
            requestParams.cmd = "HideSSID,RadioOff,Channel,WirelessMode,SSID1,is_show_ssid_key_oled,wifi_band";
            requestParams.multi_data = 1;
            return requestParams;
        }

        function dealGetWifiSettings(settings){
            var WirelessMode;
            switch(settings.WirelessMode){
                case "0":
                    WirelessMode = "b";
                    break;
                case "1":
                    WirelessMode = "g";
                    break;
                /*case "2":
                    WirelessMode = "n";
                    break;*/
                case "3":
                    WirelessMode = "b/g";
                    break;
                case "4":
                    if(settings.wifi_band == "b"){
                        WirelessMode = "b/g/n";
                        break;
                    }else{
                        WirelessMode = "a/n";
                        break;
                    }
                case "5":
                    WirelessMode = "a";
                    break;
                default:
                    WirelessMode = "b";
                    break;
            }
            var wifiBand;
            switch (settings.wifi_band) {
                case "b":
                    wifiBand = "1";
                    break;
                case "a":
                    wifiBand = "2";
                    break;
                case "auto":
                    wifiBand = "0";
                    break;
                default:
                    break;
            }
            WifiSettings.wifiEnabled = settings.RadioOff == "1" ? true : false;
            WifiSettings.broadcastSsidEnabled = settings.HideSSID == "1" ? false : true;
            WifiSettings.selectedChannel = settings.Channel;
            WifiSettings.supportedModes = ['b','g','b/g','b/g/n'];
            WifiSettings.wifiMode = WirelessMode;
            if(SupportedFeatures().WIFIBAND5GHZ){
                WifiSettings.supportedBand = wifiBand;
            }
            WifiSettings.showSsidOnDeviceEnabled = settings.is_show_ssid_key_oled == "1" ? true : false;
            WifiSettings.ssid = settings.SSID1;
            return WifiSettings;
        }
    }

    var timerFlag = true;
    function changeTimerFlag() {
        timerFlag = true;
    }
    function checkWifiEnable(){
        var result = syncRequest({cmd : "RadioOff"}, false);
        if(result.RadioOff == "1") {
            return true;
        } else {
            return false;
        }
    }
    /*when wps is opening,the wifi(security) params and wps mode can not be changed by user*/
    function checkWifiStatus(){
            var result = syncRequest({cmd : "WscModeOption"}, false);
            if (result.WscModeOption == "1"){
                return false;
            }else {
                return true;
            }
    }
    /*
     以下情况下不允许用户修改wifi参数：
     1.修改wifi参数的时间间隔不少于30s
     2.wps正在开启时，不允许用户修改wifi参数
     3.wifi关闭情况下，不允许用户修改wifi参数
    */
    function SetWifiSettings(WiFiSettings) {

        if (!timerFlag ||!checkWifiStatus()){
            return doStuff(arguments, {errorType: "SetWifiSettingsError"}, prepareSetWifiSettings, dealSetWifiSettings, null, true);
        } else if(!checkWifiEnable()){
            if (!WiFiSettings.wifiEnabled){
                return doStuff(arguments, {errorType: "SetWifiSettingsError"}, prepareSetWifiSettings, dealSetWifiSettings, null, true);
            } else {
                return doStuff(arguments, {}, prepareSetWifiSettings, dealSetWifiSettings, null, true);
            }
        } else {
            return doStuff(arguments, {}, prepareSetWifiSettings, dealSetWifiSettings, null, true);
        }


        function prepareSetWifiSettings(params,isPost){
            var requestParams = {};
            var wifiMode;
            switch(params.wifiMode){
                case "b":
                    wifiMode = "0";
                    break;
                case "g":
                    wifiMode = "1";
                    break;
                case "b/g":
                    wifiMode = "3";
                    break;
                case "b/g/n":
                    wifiMode = "4";
                    break;
                case "a/n":
                    wifiMode = "4";
                    break;
                case "a":
                    wifiMode = "5";
                    break;
                default:
                    wifiMode = "0";
                    break;
            }
            var wifiBand;
            switch (params.supportedBand){
                case "0":
                    wifiBand = "auto";
                    break;
                case "1":
                    wifiBand = "b";
                    break;
                case "2":
                    wifiBand = "a";
                    break;
            }
            requestParams.goformId = "SET_WIFI_SSID1_PARAM";
            requestParams.wifiEnabled = params.wifiEnabled ? "1" : "0";
            requestParams.broadcastSsidEnabled = params.broadcastSsidEnabled ? "0" : "1"; // 0 stand for enable and 1 for disable whithin MF93D
            requestParams.selectedChannel = params.selectedChannel;
            requestParams.wifi_band = wifiBand;
            requestParams.wifiMode = wifiMode;
            requestParams.ssid = params.ssid;
            requestParams.doubleTapEnabled = params.showSsidOnDeviceEnabled ? "1" : "0";
            return requestParams;
        }

        function dealSetWifiSettings(data){
            if(data && data.result === "success"){
                timerFlag = false;
                setTimeout(changeTimerFlag, 30000);                            //wifi settings should be prevent within 30 seconds
                return {};
            }else{
                return $.extend(unknownErrorObject, {errorType: "SetWifiSettingsError"});
            }
        }
    }
    var WifiSettings = {
        wifiEnabled: false,
        broadcastSsidEnabled: true,
        selectedChannel: '0',
        supportedModes: ['b', 'g','b/g', 'b/g/n'],
        wifiMode: 'b/g',
        ssid:  'VodafoneMobileWiFi-123456'
    };

    function GetMacSettings(){
        return doStuff(arguments, {}, prepareGetMacSettings, dealGetMacSettings);

        function prepareGetMacSettings(params, isPost){
            var obj = $.extend({}, params);
            obj.cmd = "ACL_mode,mac_filter_white_list,mac_filter_black_list,client_mac_address";
            obj.multi_data = "1";
            return obj;
        }

        function dealGetMacSettings(mac){
            var macSettings = {};
            macSettings.macFilteringEnabled = mac.ACL_mode != "0" ? true : false;
            macSettings.macFilteringMode = mac.ACL_mode == "2" ? "blacklist" : "whitelist";
            var white = dealDevicesList(mac.mac_filter_white_list,true);
            macSettings.authorizedDevices = white;
            var black = dealDevicesList(mac.mac_filter_black_list,false);
            macSettings.authorizedDevices = white.concat(black);
            macSettings.clientMacAddress = mac.clientMacAddress;
            return macSettings;
        }

        function dealDevicesList(deviceList,isWhite){
            var result = [];
            var deviceListStr = "";
            if(deviceList){
                if(deviceList.lastIndexOf(";") == deviceList.length -1){
                    deviceListStr = deviceList.substring(0,deviceList.length -1);
                }
                var devices = deviceListStr.split(";");
                for(var i = 0; i < devices.length; i++){
                    var deviceAttrs = devices[i].split(",");
                    var device = {};
                    device.macAddress = deviceAttrs[0];
                    device.name = decodeMessage(deviceAttrs[1]).replace(/\\/g,"\\\\").replace(/"/g, "\\\"");
                    device.description = decodeMessage(deviceAttrs[2]).replace(/\\/g,"\\\\").replace(/"/g, "\\\"");
                    if(isWhite){
                        device.connectionType ="allowed";
                    }else {
                        device.connectionType ="disallowed";
                    }
                    result.push(device);
                }
            }
            return result;
        }
    }


    function SetMacSettings(aSettingsObject){
        return doStuff(arguments, {}, prepareSetMacSettings, dealSetMacSettings, null, true);

        function prepareSetMacSettings(params, isPost){
            var obj = {};
            obj.goformId = "WIFI_MAC_FILTER_VDF";
            //obj.macFilteringEnabled = params.macFilteringEnabled ? "1" : "0";
            obj.macFilteringMode = !params.macFilteringEnabled ? "0": params.macFilteringMode == "blacklist" ? "2" : "1";
            var black_list = "";
            var white_list = "";

            var devices = params.authorizedDevices;
            for(var i = 0; devices && i < devices.length; i++){
                var device = devices[i].macAddress + ",";
                device +=  encodeMessage(devices[i].name) + ",";
                device +=  encodeMessage(devices[i].description);
                if(devices[i].connectionType == "allowed"){
                    device += ";";
                    white_list += device;
                }else{
                    device += ";";
                    black_list += device;
                }
            }

            if (black_list != "" && black_list.lastIndexOf(";") != black_list.length - 1) {
                black_list += ";";
            }
            if (white_list != "" && white_list.lastIndexOf(";") != white_list.length - 1) {
                white_list += ";";
            }
            obj.black_list = black_list;
            obj.white_list = white_list;
            return obj;
        }

        function dealSetMacSettings(data){
            if(data && data.result === "success"){
                return {};
            }else{
                return $.extend(unknownErrorObject, {errorType: "setMacSettingsError"});
            }
        }
    }

    function GetShowBanner(callback) {
        clearIdleTimer();
        $.ajax({
            url : "/goform/goform_get_cmd_process",
            data : {
                cmd : "client_mac_address,banner_settings",
                multi_data: "1"
            },
            dataType : "json",
            cache : false,
            error : function() {
                if (typeof callback == "function") {
                    callback(false);
                }
            },
            success : function(data) {
                if (typeof callback == "function") {
                    var macAddress = data.clientMacAddress;
                    var bannersArr = data.banner_settings.split(";");    //banner_setting = 36:4b:50:b7:ef:da,1;
                    var bannerSet;
                    for(var i = 0; i < (bannersArr.length-1); i++) {
                        bannerSet = bannersArr[i].split(",");
                        if(macAddress == bannerSet[0]) {
                            if(bannerSet[1] == "1") {
                                callback(true);
                            } else{
                                callback(false);
                            }
                            return;
                        }
                    }

                    callback(true);
                }
            }
        });
    }

    function SetShowBanner(isShowBanner, callback) {
        clearIdleTimer();
        $.post("/goform/goform_set_cmd_process", {
            goformId : "SET_BANNER_BY_MAC",
            banner_set: isShowBanner? "1" : "0"
        }, function(data) {
            if (data.result == "success") {
                callback(true);
            } else {
                callback(false);
            }
        }, "json").error(function() {
            callback(false);
        });
    }

    /*
    var MacSettings = {
        macFilteringEnabled: false,
        macFilteringMode: 'whitelist',
        authorizedDevices: [
            { macAddress: '01:01:01:01:01:01', name: "Fred", description: "Fred's PC", connectionType: 'disallowed' },
            { macAddress: '02:01:01:01:01:01', name: "Jim", description: "Jim's PC", connectionType: 'allowed' },
            { macAddress: '03:01:01:01:01:01', name: "Sheila", description: "Sheila's PC", connectionType: 'allowed' }
            ]
        };
    */
    var LIST_WIFIAUTHENTICATIONMODES = [];
    LIST_WIFIAUTHENTICATIONMODES[0] = {authenticationMode: 'NONE', validEncryptionTypes: []};
    LIST_WIFIAUTHENTICATIONMODES[1] = {authenticationMode: 'OPEN', validEncryptionTypes: ['WEP']};
    LIST_WIFIAUTHENTICATIONMODES[2] = {authenticationMode: 'SHARE', validEncryptionTypes: ['WEP']};
    LIST_WIFIAUTHENTICATIONMODES[3] = {authenticationMode: 'AUTO', validEncryptionTypes: ['MIX']};
    LIST_WIFIAUTHENTICATIONMODES[4] = {authenticationMode: 'WPA-PSK', validEncryptionTypes: ['AES', 'TKIP', 'MIX' ]};
    LIST_WIFIAUTHENTICATIONMODES[5] = {authenticationMode: 'WPA2-PSK', validEncryptionTypes: ['AES', 'TKIP', 'MIX' ]};
    LIST_WIFIAUTHENTICATIONMODES[6] = {authenticationMode: 'WPA/WPA2-PSK', validEncryptionTypes: ['AES', 'TKIP', 'MIX' ]};

    var WifiSecuritySettings = {
        encryptionKey: '',
        authenticationMode:'WPA2-PSK',
        validAuthenticationModes: LIST_WIFIAUTHENTICATIONMODES,
        encryptionType: 'MIX'
    };
    /*
    function GetWifiSecuritySettings() { // Handle special - encryption key is always null string on Get.
        return doStuff( arguments, $.extend( {}, WifiSecuritySettings, {encryptionKey: ''} ) );
    }
    */
    function GetWifiSecuritySettings(){
        return doStuff(arguments, {}, prepareGetWifiSecuritySettings, dealGetWifiSecuritySettings);

        function prepareGetWifiSecuritySettings(params, isPost){
            var obj = $.extend({}, params);
            obj.cmd = "AuthMode,EncrypType,DefaultKeyID,Key1Str1,Key1Type,WPAPSK1,WPAPSK1_encode,wifi_encrypt_auto_flag";
            obj.multi_data = "1";
            return obj;
        }

        function dealGetWifiSecuritySettings(data){
            WifiSecuritySettings = parseWifiSecuritySettings(data);
            return WifiSecuritySettings;
        }

        function parseWifiSecuritySettings(settings){
            var isAuto = settings.wifi_encrypt_auto_flag == "1" ? true : false;
            var authMode;
            switch(settings.AuthMode.toUpperCase()){
                case "OPEN":
                    authMode = settings.EncrypType.toUpperCase() == "NONE" ? "NONE" : "OPEN";
                    break;
                case "SHARED":
                    authMode = "SHARE";
                    break;
                case "WPAPSK":
                    authMode = "WPA-PSK";
                    break;
                case "WPA2PSK":
                    authMode = "WPA2-PSK";
                    break;
                case "WPAPSKWPA2PSK":
                    authMode = isAuto ? "AUTO": "WPA/WPA2-PSK";
                    break;
                default:
                    authMode = settings.AuthMode;
                    break;
            }
            var encryType;
            switch(settings.EncrypType.toUpperCase()){
                case "NONE":
                    encryType = "";
                    break;
                case "CCMP":
                case "AES":
                    encryType = "AES";
                    break;
                case "TKIPCCMP":
                case "AUTO":
                case "MIX":
                    encryType = "MIX";
                    break;
                default:
                    encryType = settings.EncrypType;
                    break;
            }
            WifiSecuritySettings.authenticationMode = authMode;
            WifiSecuritySettings.encryptionType = encryType;
            WifiSecuritySettings.validAuthenticationModes = LIST_WIFIAUTHENTICATIONMODES;
            if(encryType == "WEP") {
                WifiSecuritySettings.encryptionKey = SupportedFeatures().PASSWORDENCODE ? Base64.decode(settings.WPAPSK1_encode) : settings.Key1Str1;
            }else {
                WifiSecuritySettings.encryptionKey = SupportedFeatures().PASSWORDENCODE ? Base64.decode(settings.WPAPSK1_encode) : settings.WPAPSK1;
            }

            return WifiSecuritySettings;
        }
    }

    function SetWifiSecuritySettings(aSettingsObject){
        /*
         以下情况下不允许用户修改wifi安全参数：
         1.修改wifi安全参数的时间间隔不少于30s
         2.wps正在开启时，不允许用户修改wifi安全参数
         3.wifi关闭情况下，不允许用户修改wifi安全参数
         */

        if (!checkWifiStatus()||!timerFlag) {
            return doStuff(arguments, {errorType: "setWifiSecuritySettingsError"}, prepareSetWifiSecuritySettings, dealSetWifiSecuritySettings, null, true);
        } else if(!checkWifiEnable()){
            return doStuff(arguments, {errorType: "setWifiSecuritySettingsError"}, prepareSetWifiSecuritySettings, dealSetWifiSecuritySettings, null, true);
        } else{
            return doStuff(arguments, {}, prepareSetWifiSecuritySettings, dealSetWifiSecuritySettings, null, true);
        }
        function prepareSetWifiSecuritySettings(params, isPost) {
            var obj = {};
            obj.WEP1Select = "0";//default
            var authMode;
            var wifi_encrypt_auto_flag = "0";
                switch(params.authenticationMode.toUpperCase()){
                    case "NONE":
                        authMode = "OPEN";
                        obj.security_shared_mode = "NONE";
                        params.encryptionType = "";
                        break;
                    case "OPEN":
                        authMode = "OPEN";
                        break;
                    case "SHARE":
                        authMode = "SHARED";
                        break;
                    case "AUTO":
                        authMode = "WPAPSKWPA2PSK";
                        wifi_encrypt_auto_flag = "1";
                        break;
                    case "WPA-PSK":
                        authMode = "WPAPSK";
                        break;
                    case "WPA2-PSK":
                        authMode = "WPA2PSK";
                        break;
                    case "WPA/WPA2-PSK":
                        authMode = "WPAPSKWPA2PSK";
                        break;
                    default:
                        authMode = "WPA2PSK";//default "WPA2-PSK"
                        break;
                }
            switch(params.encryptionType.toUpperCase()) {
                case "WEP":
                    obj.security_shared_mode = params.encryptionType;
                    if((/^([0-9A-Fa-f]{10}|[0-9A-Fa-f]{26})$/).test(params.encryptionKey)){
                        obj.WEP1Select = "0";//hex
                    }else if((/^([\x00-\x21\x23-\x26\x28-\x7f]{5}$|^[\x00-\x21\x23-\x26\x28-\x7f]{13})$/).test(params.encryptionKey)){
                        obj.WEP1Select = "1";//ascii
                    }
                    break;
                case "TKIP":
                    obj.cipher = "0";
                    break;
                case "AES":
                case "CCMP":
                    obj.cipher = "1";
                    break;
                case "AUTO":
                case "MIX":
                    obj.cipher = "2";
                    break;
                default:
                    //obj.cipher = "1";default "AES"
                    break;
            }
            if(!obj.security_shared_mode){
                obj.security_shared_mode = "";
            }
            obj.goformId = "SET_WIFI_SECURITY_PARAM";
            obj.security_mode = authMode;
            obj.wep_default_key = "0";
            obj.passphrase = SupportedFeatures().PASSWORDENCODE ? Base64.encode(params.encryptionKey) : params.encryptionKey;
            obj.wep_key_1 = SupportedFeatures().PASSWORDENCODE ? Base64.encode(params.encryptionKey) : params.encryptionKey;
            obj.wifi_encrypt_auto_flag = wifi_encrypt_auto_flag;
            return obj;
        }

        function dealSetWifiSecuritySettings(data) {
            if(data && data.result === "success") {
                WifiSecuritySettings = aSettingsObject;
                return {};
            } else {
                return $.extend(unknownErrorObject, {errorType: "setWifiSecuritySettingsError"});
            }
        }
    }
    /**    var WPSSettings = {
            wpsEnabled: false,
            wpsPin: '12345678',
            setByWps: false
        };
    **/
    function GetWpsSettings() {
        return doStuff(arguments, {}, prepareGetWPSSettings, dealGetWPSSettings);
        function prepareGetWPSSettings(params,isPost){
            var obj = $.extend({},params);
            obj.cmd = "wifi_wps_enabled,wifi_wps_reset_flag,wifi_ap_pin";
            obj.multi_data = "1";
            return obj;
        }
        function dealGetWPSSettings(data){
            var obj = {};
            if(data){
                obj.wpsEnabled = data.wifi_wps_enabled == "1"? true : false;
                obj.wpsPin = data.wifi_ap_pin;
                obj.setByWps = data.wifi_wps_reset_flag == "1"? true : false;
            }
            return obj;
        }
    }
    function GetWifiStatus() {
        var params = {};
        params.cmd = "HideSSID,EncrypType";
        params.multi_data = "1";
        var result = syncRequest(params, false);
        return result;
    }

    function SetWpsSettings() {

        /*
         以下情况下不允许用户设置wps：
         1.wifi关闭时（判断依据是RadioOff不等于1），不允许用户设置wps
         2.wps正在开启时，不允许用户设置wps
         3.对于支持WPS2的设备(R212)，ssid隐藏，或wifi加密方式为WEP或TKIP时，不允许用户开启WPS
         4.对于支持WPS1的设备(R206)，ssid隐藏，或OPEN NONE、OPEN WEP、SHARED WEP时，不允许用户开启WPS
         */
        var wpsParam = arguments[0];
        var WifiStatus = GetWifiStatus();
		if(!checkWifiEnable()){
			return doStuff(arguments, {errorType: "setWpsSettingsError"}, prepareSetWpsSettings, dealSetWpsSettings,null,true);
		}else if(!checkWifiStatus()){
            return doStuff(arguments, {errorType: "setWpsSettingsError"}, prepareSetWpsSettings, dealSetWpsSettings,null,true);
        }else if(SupportedFeatures().WPS2){
            if ((WifiStatus.HideSSID == "1" || WifiStatus.EncrypType.toUpperCase() == "WEP" || WifiStatus.EncrypType.toUpperCase() == "TKIP")
                    && wpsParam.wpsEnabled == true) {
                return doStuff(arguments, {errorType: "setWpsSettingsError"}, prepareSetWpsSettings, dealSetWpsSettings,null,true);
            }
        } else {
            if ((WifiStatus.HideSSID == "1" || WifiStatus.EncrypType.toUpperCase() == "NONE" || WifiStatus.EncrypType.toUpperCase() == "WEP") && wpsParam.wpsEnabled == true) {
                return doStuff(arguments, {errorType: "setWpsSettingsError"}, prepareSetWpsSettings, dealSetWpsSettings,null,true);
            }
        }

        return doStuff(arguments, {}, prepareSetWpsSettings, dealSetWpsSettings,null,true);


        function prepareSetWpsSettings(params,isPost) {
            var obj = {};
            obj.goformId = "SET_WPS_SETTINGS";
            obj.wifi_wps_enabled = params.wpsEnabled == true ? "1":"0";
            obj.wps_pin = params.wpsPin;
            obj.wifi_wps_reset_flag = params.setByWps == true ? "1":"0";
            return obj;
        }
        function dealSetWpsSettings(data) {
            if(data && data.result == "success"){
                return {};
            } else {
                return $.extend(unknownErrorObject, {errorType: "setWpsSettingsError"});
            }
        }
    }
    function GetMobileWifiDiagnostics() {
        return doStuff(arguments, {}, prepareGetMobileWifiDiagnostics, dealGetMobileWifiDiagnostics);

        function prepareGetMobileWifiDiagnostics(params, isPost){
            var obj = $.extend({}, params);
            obj.cmd = "modem_model,hardware_version,wa_inner_version,sim_iccid,modem_msn,msisdn,imei,imei_sv,sim_imsi,MAX_Access_num,system_uptime";
            obj.multi_data = "1";
            return obj;
        }

        function dealGetMobileWifiDiagnostics(data) {
            return parseMobileWifiDiagnostics(data);
        }

        function parseMobileWifiDiagnostics(diag) {
            var SIMStatus;
            //"index", "sim-error", "pin-required", "puk-lock", "puk-required"
            switch(diag.simStatus)
            {
                case "modem_init_complete":
                case "modem_imsi_waitnck":
                    SIMStatus = "index";
                    break;
                case "modem_waitpin":
                    SIMStatus = "pin-required";
                    break;
                case "modem_waitpuk":
                    SIMStatus = "puk-required";
                    break;
                case "modem_sim_undetected":
                    SIMStatus = "sim-error";
                    break;
                case "modem_puk_lock":
                case "modem_sim_destroy":
                    SIMStatus = "puk-lock";
                    break;
                default:
                    SIMStatus = "index";
                    break;
            }
            var sdCardMemory = getSdMemorySizes();
            function getSdMemorySizes(){
                var sdCardFlag = true;
                return doStuff(arguments, {}, prepareGetSdMemorySizes, dealGetSdMemorySizes, null, false);

                function prepareGetSdMemorySizes(params, isPost){
                    var obj = $.extend({}, params);
                    obj.cmd = "HTTPSHARE_GETCARD_VALUE";
                    return obj;
                }

                function dealGetSdMemorySizes(sdSize){
                    var sdMemorySizes = {};
                    if(sdSize.result && sdSize.result == "no_sdcad"){
                        sdMemorySizes.sdCardFlag = false;
                        sdMemorySizes.totalMemorySize = "";
                        sdMemorySizes.availableMemorySize = "";
                        return sdCardFlag;
                    }else{
                        sdMemorySizes.sdCardFlag = true;
                        sdMemorySizes.totalMemorySize = sdSize.sd_card_total_size*32*1024 + "";
                        sdMemorySizes.availableMemorySize = sdSize.sd_card_avi_space*32*1024 + "";
                        return sdMemorySizes;
                    }
                }
            }

            function getCurrentlyAttachedDevices(){
                var data = syncRequest({cmd :"curr_connected_devices",multi_data : 1}, false);
                return data.attachedDevices;
            }
            var AttachedDevicesNumber = getCurrentlyAttachedDevices().length + "";
            var mobileWifi = {
                productName: diag.modem_model,
                softwareVersion: diag.wa_inner_version,
                modemVersion: diag.wa_inner_version,
                routerVersion: diag.wa_inner_version,
                hardwareVersion: diag.hardware_version,
                serialNumber: diag.modem_msn,
                simSerialNumber: diag.sim_iccid,
                simMsisdn: diag.msisdn,
                deviceImei: diag.imei,
                deviceImeiSv : diag.imei_sv,
                simImsi: diag.sim_imsi,
                simStatus: SIMStatus,
                sdCardAvailable: sdCardMemory.sdCardFlag,
                sdCardTotalMemory: sdCardMemory.totalMemorySize,
                sdCardAvailableMemory:sdCardMemory.availableMemorySize,
                currentConnectedUsers: AttachedDevicesNumber,
                maxConnectedUsers: diag.MAX_Access_num,
                timeSinceStartup: diag.system_uptime
            };
            return mobileWifi;
        }
    }

    function GenerateNewWpsPin() {
        var wpsPin = syncRequest({goformId:"GENERATE_WPS_AP_PIN"},true);
        if(wpsPin && typeof(wpsPin.result)!= "undefined"){
            return wpsPin.result;
        } else {
            return "";
        }
    }
    /*
    var MobileWifiDiagnostics = {
        productName: 'Vodafone R205',
        softwareVersion: '1.0 software',
        modemVersion: '1.0 modem',
        routerVersion: '1.0 router',
        //webUiVersion: '1.0 webUI',
        hardwareVersion: '1.0 hardware',
        serialNumber: '12345serialNumber',
        simSerialNumber: '12345678901234',
        simMsisdn: '12345678901234567890',
        deviceImei: '12345678901234567890',
        simImsi: '098765432109876543231',
        simStatus: "index",
        sdCardAvailable: true,
        sdCardTotalMemory: '1000000000',
        sdCardAvailableMemory: '500000000',
        currentConnectedUsers: '3',
        maxConnectedUsers: '5',
        timeSinceStartup: updateNumber.toString()
    };
    */
    function GetRouterDiagnostics(){
        return doStuff(arguments, {}, prepareGetRouterDiagnostics, dealGetRouterDiagnostics);

        function prepareGetRouterDiagnostics(params, isPost){
            var obj = $.extend({}, params);
            obj.cmd = "router_diagnostics";
            return obj;
        }

        function dealGetRouterDiagnostics(data){
            var routerDiagnostics = {};
            routerDiagnostics.dhcpEnabled = data.dhcpEnabled == "1" ? true : false;
            routerDiagnostics.dmzEnabled = data.DMZEnabled == "1" ? true: false;
            return routerDiagnostics;
        }
    }
    /*
    var RouterDiagnostics = {
        dhcpEnabled: true,
        dmzEnabled: false
    };
    */

    function GetCurrentlyAttachedDevices() {
        return doStuff(arguments, {}, prepareGetCurrentlyAttachedDevices, dealGetCurrentlyAttachedDevices);

        function prepareGetCurrentlyAttachedDevices(params, isPost){
            var obj = $.extend({}, params);
            obj.cmd = "curr_connected_devices";
            obj.multi_data = "1";
            return obj;
        }

        function dealGetCurrentlyAttachedDevices(data){
            return parseCurrentlyAttachedDevices(data.attachedDevices);
        }

        function parseCurrentlyAttachedDevices(attachedDevices){
            var deviceArr = [];
            for(var i = 0; attachedDevices && i < attachedDevices.length; i++ ){
                var obj = {};
                obj.macAddress = attachedDevices[i].macAddress;
                obj.ipAddress = attachedDevices[i].ipAddress;
                var hostname = attachedDevices[i].hostName == "" ? attachedDevices[i].macAddress : attachedDevices[i].hostName;
                obj.hostName = hostname == "" ? attachedDevices[i].macAddress : hostname;
                var timeconnected = attachedDevices[i].timeConnected;
                obj.timeConnected = timeconnected == "" ? "0" : timeconnected;
                deviceArr.push(obj);
            }
            return {attachedDevices: deviceArr};
        }
    }
    /*
    var CurrentlyAttachedDevices = {
        attachedDevices: [
            { ipAddress: '127.78.01.05', hostName: 'fred', macAddress: "02:01:01:01:01:01", timeConnected: '6789' },
            { ipAddress: '127.78.01.08', hostName: 'john', macAddress: "02:01:01:0A:01:01", timeConnected: '9789' },
            { ipAddress: '127.74.01.01', hostName: 'fred', macAddress: "02:01:01:01:0F:01", timeConnected: '689' }
            ]
    };
    */

    function GetSdMemorySizes() {
        if(doSdMemoryError){
            return doStuff(arguments,{errorType: 'noSdCardPresent'});
        }
        return doStuff(arguments, {}, prepareGetSdMemorySizes, dealGetSdMemorySizes, null, false);

        function prepareGetSdMemorySizes(params, isPost){
            var obj = $.extend({}, params);
            obj.cmd = "HTTPSHARE_GETCARD_VALUE";
            return obj;
        }

        function dealGetSdMemorySizes(sdSize){
            if(sdSize.result && sdSize.result == "no_sdcad"){
                doSdMemoryError = true;
                return {errorType: 'noSdCardPresent'};
            }else{
                var sdMemorySizes = {};
                sdMemorySizes.totalMemorySize = sdSize.sd_card_total_size * 32 * 1024 + "";
                sdMemorySizes.availableMemorySize = sdSize.sd_card_avi_space * 32 * 1024 + "";
                return sdMemorySizes;
            }
        }
    }

    function GetSdCardSharing(){
        return doStuff(arguments, {}, prepareGetSdCardSharing, dealGetSdCardSharing, null, false);

        function prepareGetSdCardSharing(params, isPost){
            var obj = $.extend({}, params);
            obj.cmd = "HTTPSHARE_AUTH_GET";
            return obj;
        }

        function dealGetSdCardSharing(sdShare){
            if(sdShare && sdShare.result == "no_sdcad"){
                doSdMemoryError = true;
                return {access: 'none', sharedFolder: '', sdCardStatus: false };
            }
            var sdCardSharing = {};
            var access;
            if(sdShare.HTTP_SHARE_WR_AUTH == "readOnly"){
                access = "readOnly";
            }else if(sdShare.HTTP_SHARE_WR_AUTH == "readWrite"){
                access = "readWrite";
            }else{
                access = "none";
            }
            doSdMemoryError = false;
            sdCardSharing.access = access;
            var sharePath = sdShare.HTTP_SHARE_FILE;
            if(sharePath.lastIndexOf("/") !== sharePath.length-1){
                sharePath = sharePath + "/";
            }
            sdCardSharing.sharedFolder = sharePath;
            sdCardSharing.sdCardStatus = true;
            return sdCardSharing;
        }
    }

    function SetSdCardSharing(aSettingsObject) {
        return doStuff(arguments, {}, prepareSetSdCardSharing, dealSetSdCardSharing, null, true);

        function prepareSetSdCardSharing(params, isPost){
            var obj = {};
            obj.goformId = "HTTPSHARE_AUTH_SET";
            obj.HTTP_SHARE_WR_AUTH = params.access ? params.access : "readOnly";
            var folderPath = params.sharedFolder;
            if(folderPath.lastIndexOf("/") == folderPath.length-1){
                folderPath = folderPath.substring(0,folderPath.length-1);
            }
            obj.HTTP_SHARE_FILE = folderPath;
            return obj;
        }

        function dealSetSdCardSharing(data){
            if(data && data.result == "no_sdcad"){
                doSdMemoryError = true;
                return {errorType: 'noSdCardPresent'};
            }else if(data && data.result == "success"){
                return {};
            }else{
                return $.extend(unknownErrorObject, {errorType: "setSdCardSharingError"});
            }
        }
    }
    /*
    var SdCardSharing = {
        access: 'none',
        sharedFolder: 'folder555',
        sdCardStatus: true
    };
    */
    function GetRouterIpConfiguration() {
        return doStuff(arguments, {}, prepareGetRouterIpConfiguration, dealGetRouterIpConfiguration);

        function prepareGetRouterIpConfiguration(params, isPost) {
            var obj = $.extend({}, params);
            obj.cmd = "ROUTER_GET_IP_CONFIG";
            return obj;
        }

        function dealGetRouterIpConfiguration(ipConfig) {
            var RouterIpConfig = {};
            RouterIpConfig.lanIpAddress = ipConfig.ipAddress;
            RouterIpConfig.subnetMask = ipConfig.subnetMask;
            RouterIpConfig.lanDomainName = ipConfig.lanDomain;
            RouterIpConfig.switchBatteryOffWhenIdle = ipConfig.switchBatteryOffWhenIdle == "true" ? true : false;

            var dhcpEnabled = ipConfig.dhcpEnabled == "true" ? true : false;
            RouterIpConfig.dhcpEnabled = dhcpEnabled;
            RouterIpConfig.dhcpRangeStart = ipConfig.dhcpRangeStart;
            RouterIpConfig.dhcpRangeEnd = ipConfig.dhcpRangeEnd;
            RouterIpConfig.dhcpLeaseTime = ipConfig.dhcpLeaseTime;
            return RouterIpConfig;
        }
    }

    function SetRouterIpConfiguration(aSettingsObject) {
        return doStuff(arguments, {}, prepareSetRouterIpConfiguration, dealSetRouterIpConfiguration, null, true);

        function prepareSetRouterIpConfiguration(params, isPost){
            var obj = {};
            obj.goformId = "ROUTER_SET_IP_CONFIG";
            obj.lanIp = params.lanIpAddress;
            obj.lanNetmask = params.subnetMask;
            obj.lanDomain = params.lanDomainName;
            obj.switchOffWhenIdle = params.switchBatteryOffWhenIdle;

            var dhcpEnabled = "";
            if(params.dhcpEnabled){
                dhcpEnabled = "SERVER";
            }else{
                dhcpEnabled = "DISABLE";
            }
            obj.lanDhcpType = dhcpEnabled;
            obj.dhcpStart = params.dhcpRangeStart;
            obj.dhcpEnd = params.dhcpRangeEnd;
            obj.dhcpLease = params.dhcpLeaseTime;
            return obj;
        }

        function dealSetRouterIpConfiguration(data) {
            if(data && data.result === "success"){
                return {};
            }else{
                return $.extend(unknownErrorObject, {errorType: "setRouterIpConfigurationError"});
            }
        }
    }
    /*
    var RouterIpConfiguration={
        ipAddress:"192.168.0.2",
        subnetMask:"255.255.127.0",
        lanDomain: 'VodafoneMobile.wifi',
        switchBatteryOffWhenIdle: true
    };
    */

    function GetRouterDhcpConfiguration() {
        return doStuff(arguments, {}, prepareGetRouterDhcpConfiguration, dealGetRouterDhcpConfiguration);

        function prepareGetRouterDhcpConfiguration(params, isPost){
            var obj = $.extend({}, params);
            obj.cmd = "GET_DHCP_CONFIG";
            return obj;
        }

        function dealGetRouterDhcpConfiguration(data) {
            return parseRouterDhcpConfiguration(data);
        }

        function parseRouterDhcpConfiguration(dhcp) {
            var RouterDhcpConfig = {};
            var dhcpEnabled = dhcp.dhcpEnabled === "1" ? true : false;
            RouterDhcpConfig.dhcpEnabled = dhcpEnabled;
            RouterDhcpConfig.dhcpRangeStart = dhcp.dhcpRangeStart;
            RouterDhcpConfig.dhcpRangeEnd = dhcp.dhcpRangeEnd;
            RouterDhcpConfig.dhcpLeaseTime = dhcp.dhcpLeaseTime;
            return RouterDhcpConfig;
        }
    }

    function SetRouterDhcpConfiguration(aSettingsObject) {
        return doStuff(arguments, {}, prepareSetRouterDhcpConfiguration, dealSetRouterDhcpConfiguration, null, true);

        function prepareSetRouterDhcpConfiguration(params, isPost){
            var obj = {};
            obj.goformId = "SET_DHCP_CONFIG";
            var dhcpEnabled = "";
            if(params.dhcpEnabled) {
                dhcpEnabled = "SERVER";
            } else {
                dhcpEnabled = "DISABLE";
            }
            obj.lanDhcpType = dhcpEnabled;
            obj.dhcpStart = params.dhcpRangeStart;
            obj.dhcpEnd = params.dhcpRangeEnd;
            obj.dhcpLease = params.dhcpLeaseTime;
            return obj;
        }

        function dealSetRouterDhcpConfiguration(data) {
            if(data && data.result === "success"){
                return {};
            }else{
                return $.extend(unknownErrorObject, {errorType: "setRouterDhcpConfigurationError"});
            }
        }
    }
    /*
    var RouterDhcpConfiguration = {
        dhcpEnabled: false,
        dhcpRangeStart:"192.168.0.2",
        dhcpRangeEnd: '192.168.0.100',
        dhcpLeaseTime: '604800'
    };
    */
    function GetNatSettings() {
        return doStuff(arguments, {}, prepareGetNatSettings, dealGetNatSettings);

        function prepareGetNatSettings(params, isPost){
            var obj = $.extend({}, params);
            obj.cmd = "ROUTER_GET_NAT_SETS";
            //obj.multi_data = "1";
            return obj;
        }

        function dealGetNatSettings(nat) {
            var natSets = {};
            natSets.natEnabled = nat.natEnabled == "true" ? true: false;
            natSets.natType = nat.natType;

            var rules = [];
            if(nat.portMapRules != ""){
                var PortMapRulesList = nat.portMapRules.split(";");
                for (i = 0;i < PortMapRulesList.length;i ++){
                    //PortMapRulesName = "PortMapRules_" + i;
                    var aRule = {};
                    var elements = PortMapRulesList[i].split(",");
                    var protocal = elements[3] == "3"? "tcp+udp": elements[3] == "1"? "tcp" : "udp";
                    aRule.applicationProtocol = protocal.toUpperCase();
                    aRule.destinationIp = elements[0];
                    aRule.sourcePort = elements[1];
                    aRule.destinationPort = elements[2];
                    aRule.applicationName = decodeMessage(elements[4]).replace(/"/g, "\\\"");
                    rules.push(aRule);
                }
                natSets.portMappings = rules;
                return natSets;
            } else {
            //natSets.enabled = nat.portMapEnabled == "1" ? true : false;
                natSets.portMappings = [];
            }
            return natSets;
        }
    }

    function SetNatSettings(aSettingsObject){
        if(aSettingsObject == undefined){
            return doStuff(arguments, {errorType: "parameterError"});
        }
        return doStuff(arguments, {}, prepareSetNatSettings, dealSetNatSettings, null, true);

        function prepareSetNatSettings(params, isPost){
            var obj = {};
            obj.goformId = "ROUTER_SET_NAT_SETS";
            obj.natEnabled = params.natEnabled;
            obj.natType = params.natType;
            obj.portMapEnabled = params.natEnabled == true ? 1 : 0;

            var portMapRules = [];
            var portMappings = params.portMappings;
            for(var i = 0; i < portMappings.length; i++){
                var item = portMappings[i];
                portMapRules[i] = item.destinationIp + ",";
                portMapRules[i] += item.sourcePort + ",";
                portMapRules[i] += item.destinationPort + ",";
                portMapRules[i] += item.applicationProtocol.toLowerCase() + ",";
                portMapRules[i] += encodeMessage(item.applicationName);
            }
            obj.portMapRules = portMapRules.join(";");
            return obj;
        }

        function dealSetNatSettings(data){
            if(data && data.result == "success"){
                return {};
            }else{
                return $.extend(unknownErrorObject, {errorType: "setNatSettingsError"});
            }
        }
    }
    /*
    var natSettings={
        natEnabled: false,
        // Note - this not supported by R205 so not used at present
        natType: "symmetric"
    };
    */
    function GetApplicationPortMappings(){
        return doStuff(arguments, {}, prepareGetApplicationPortMappings, dealGetApplicationPortMappings);

        function prepareGetApplicationPortMappings(params, isPost){
            var obj = $.extend({}, params);
            obj.cmd = "GET_APP_PORT_MAPS";
            return obj;
        }

        function dealGetApplicationPortMappings(data){
            return parseApplicationPortMappings(data);
        }

        function parseApplicationPortMappings(portMapping){
            var appPortMappings = {};
            var rules = [];
            var roles = portMapping.portMapRules;
            if(roles && roles.length > 0){
                var roleArr = roles.split(";");
                for(var i = 0; i < roleArr.length; i++){
                    var aRule = {};
                    var elements = roleArr[i].split(",");
                    /*var protocol;
                    if (elements[8] == "1") {
                        protocol = "tcp";
                    } else {
                        protocol = "udp";
                    }*/
                    aRule.applicationProtocol = elements[3];
                    aRule.destinationIp = elements[0];
                    aRule.sourcePort = elements[1];
                    aRule.destinationPort = elements[2];
                    aRule.applicationName = decodeMessage(elements[4]).replace(/"/g, "\\\"");
                    rules.push(aRule);
                }
            }
            appPortMappings.enabled = portMapping.portMapEnabled == "1" ? true : false;
            appPortMappings.portMappings = rules;
            return appPortMappings;
        }
    }

    function SetApplicationPortMappings(aSettingsObject){
        if (!aSettingsObject){
            return doStuff(arguments, {
                errorType : "parameterError"
            });
        }

        return doStuff(arguments, {}, prepareSetApplicationPortMappings, dealSetApplicationPortMappings, null, true);

        /**
         * {
         *   portMapEnabled:0 ,
         *   portMapRules : "ip_address1,from_port1,to_port1,protocal1,comment1;ip_address2,from_port2,to_port2,protocal2,comment2"
         * }
         */
        function prepareSetApplicationPortMappings(params, isPost){
            var obj = {};
            obj.goformId = "SET_APP_PORT_MAPS";
            obj.portMapEnabled = params.enabled == true ? 1 : 0;
            var portMapRules = "";
            var portMappings = params.portMappings;
            for(var i = 0; i < portMappings.length; i++){
                var item = portMappings[i];
                if(i != 0){
                    portMapRules += ";";
                }
                portMapRules += item.destinationIp + ",";
                portMapRules += item.sourcePort + ",";
                portMapRules += item.destinationPort + ",";
                portMapRules += item.applicationProtocol.toLowerCase() + ",";
                portMapRules += encodeMessage(item.applicationName);
            }
            obj.portMapRules = portMapRules;
            return obj;
        }

        function dealSetApplicationPortMappings(data){
            if(data && data.result === "success"){
                return {};
            }else{
                return $.extend(unknownErrorObject, {errorType: "setApplicationPortMappingsError"});
            }
        }
    }
    /*
    var applicationPortMappings={
         enabled: false,
         portMappings: [
            { applicationName: 'app1', applicationProtocol: 'udp', sourcePort: "80", destinationIp: '192.127.127.0',destinationPort:'13'},
            { applicationName: 'app2', applicationProtocol: 'tcp', sourcePort: "8080", destinationIp: '192.127.127.8',destinationPort:'56'},
            { applicationName: 'app3', applicationProtocol: 'tcp', sourcePort: "978", destinationIp: '192.127.127.4',destinationPort:'678'}
            ]
    };
    */

    function GetDmzSettings(){
        return doStuff(arguments, {}, prepareGetDmzSettings, dealGetDmzSettings);

        function prepareGetDmzSettings(params, isPost){
            var obj = $.extend({}, params);
            obj.cmd = "ROUTER_GET_DMZ_SETS";
            //obj.multi_data = "1";
            return obj;
        }

        function dealGetDmzSettings(dmz){
            var dmzSettings = {};
            dmzSettings.dmzEnabled = dmz.dmzEnabled == "true" ? true: false;
            dmzSettings.dmzIpAddress = dmz.dmzIpAddress;
            return dmzSettings;
        }
    }

    function SetDmzSettings(aSettingsObject){
        return doStuff(arguments, {}, prepareSetDmzSettings, dealSetDmzSettings, null, true);

        function prepareSetDmzSettings(params, isPost){
            var obj = {};
            obj.goformId = "ROUTER_SET_DMZ_SETS";
            obj.DMZEnabled = params.dmzEnabled ? "1" : "0";
            obj.DMZIPAddress = params.dmzIpAddress;
            return obj;
        }

        function dealSetDmzSettings(data){
            if(data && data.result === "success"){
                return {};
            }else{
                return $.extend(unknownErrorObject, {errorType: "setDmzSettingsError"});
            }
        }
    }
    /*
    var dmzSettings={
        dmzEnabled: true,
        dmzIpAddress: "192.168.34.74"
    };
    */
    var routerBackupUrl={
        backupUrl:"/client/backup"
    };
    function SetStoredPin(pinObject) {
        return doStuff(arguments, {}, prepareSetStoredPin, dealSetStoredPin, null, true);

        function prepareSetStoredPin(params, isPost){
            var requestParams = {};
            requestParams.goformId = "SAVE_SIM_PIN";
            requestParams.pin_code = params.pin;
            return requestParams;
        }

        function dealSetStoredPin(){
            return {};
        }
        /*var pin = strPin == "string"? strPin : strPin.pin;
        syncRequest({
            goformId : "SAVE_SIM_PIN",
            pin_code : pin
        }, true);*/
    }

    function IsPinStored() {
        var result = false;
        var data = syncRequest({
                        cmd: "pin_save_flag",
                        multi_data: 1
                    }, false);
        if (data.pin_save_flag == "1"){
            result = true;
        }
        return result;
    }

    function GetWebUiData(){
        return doStuff(arguments, {}, prepareGetWebUiData, dealGetWebUiData);

        function prepareGetWebUiData(params, isPost){
            var requestParams = {};
            requestParams.cmd = "web_data";
            requestParams.multi_data = "1";
            return requestParams;
        }

        function dealGetWebUiData(data){
            if(data && data.web_data != ""){
                var webData = $.parseJSON(data.web_data);
                $.each(webData,function(key,value){
                    webData[key] = decodeURIComponent(value);
                });
                return webData;
            }else{
                return {};
            }
        }
    }

    function SetWebUiData(){
        return doStuff(arguments, {}, prepareSetWebUiData, dealSetWebUiData, null, true);

        function prepareSetWebUiData(params, isPost){
            var webDataOrig = params;//GetWebUiData();
            /*
            if(!webDataOrig.errorType){
                $.extend(webDataOrig, params);
            }
            */
            var requestParams = {};
            var webData = "{";
            $.each(webDataOrig, function(key, value){
                var temp = encodeURIComponent(value);
                if(temp.length > 256){
                    return;
                }
                webData += ( "\\\"" + key + "\\\":\\\"" + temp +"\\\",");
                if(webData.length > 1024){
                    return;
                }
            });
            if(webData.length != 0){
                webData = webData.substring(0,webData.length-1);
            }
            webData += "}";
            requestParams.goformId = "SET_WEB_DATA";
            requestParams.web_data = webData;
            return requestParams;
        }

        function dealSetWebUiData(data){
            if(data && data.result == "success"){
                return {};
            }else{
                return $.extend(unknownErrorObject, {errorType: "SetWebUiDataError"});
            }
        }
    }
    /*
    var webUiData = {
    };
    */

    function GetVodafoneConfiguration() {
        return doStuff(arguments, {}, prepareGetVodafoneConfiguration, dealGetVodafoneConfiguration);

        function prepareGetVodafoneConfiguration(params, isPost){
            var obj = $.extend({}, params);
            obj.cmd = "sku,MAX_Access_num";
            obj.multi_data = "1";
            return obj;
        }

        function dealGetVodafoneConfiguration(config){
            var vdfConfiguration = {};
            vdfConfiguration.sku = config.sku;
            vdfConfiguration.maxConnectedDevices = config.MAX_Access_num;
            return vdfConfiguration;
        }
    }
    /*
    var vodafoneConfiguration = {
        //Enterprise None P&P
        //Vodafone Mobile Wi-Fi
        //Vodafone Pocket WiFi

        sku: 'Vodafone Mobile Wi-Fi',
        maxConnectedDevices: '5'
    };
    */

    var SDCardName;// = {sdCardName : 'MicroSD Card'};

    function GetSdCardName() {
        if(doSdMemoryError){
            return doStuff(arguments, {errorType : 'noSdCardPresent'});
        }
        if(SDCardName === undefined || SDCardName.sdCardName === undefined ){
            return doStuff(arguments, {}, prepareGetSdCardName, dealGetSdCardName, null, false);
        } else {
            return doStuff(arguments, SDCardName);
        }

        function prepareGetSdCardName(params, isPost){
            var obj = $.extend({}, params);
            obj.cmd = "HTTPSHARE_GETCARD_NAME";
            return obj;
        }

        function dealGetSdCardName(data){
            if(data.result && data.result == "no_sdcad"){
                doSdMemoryError = true;
                SDCardName = undefined;
                return doStuff(arguments, {errorType : 'noSdCardPresent'});
            }
            SDCardName = {sdCardName: data.sd_card_name};
            return SDCardName;
        }
    }
    function getcurrentLoginStatus(){
        return currentLoginStatus;
    }

    function updateLoginStatus(data, timer){
        if(data.curr_user_login_status == "1"){

            /* In case two or more browsers opened in one PC,when one logged out,
             * then all the others should logout accordingly
             */
            wifiCallbackDestination.changedLoginStatus({loginStatus: "loggedOut"});
        }

        var IdleTimer = 10*60*1000;
        var currentIdlePeriod = new Date().getTime()- timer;

        if (currentIdlePeriod > IdleTimer && data.curr_user_login_status == "0"){
            Logout();
            wifiCallbackDestination.changedLoginStatus({loginStatus: "loggedOut"});
        }
    }

    function GetWifiInformation(){
        var wifiInfo = {
            /*0 : [
                {"a"   : [36,40,44,48]},
                {"b"   : [1,2,3,4,5,6,7,8,9,10,11,12,13]},
                {"g"   : [1,2,3,4,5,6,7,8,9,10,11,12,13]},
                {"b/g" : [1,2,3,4,5,6,7,8,9,10,11,12,13]},
                {"n"   : [1,2,3,4,5,6,7,8,9,10,11,12,13,36,40,44,48]}
            ],*/
            1 : [
                {"b"     : [1,2,3,4,5,6,7,8,9,10,11,12,13]},
                {"g"     : [1,2,3,4,5,6,7,8,9,10,11,12,13]},
                {"b/g"   : [1,2,3,4,5,6,7,8,9,10,11,12,13]},
                {"b/g/n" : [1,2,3,4,5,6,7,8,9,10,11,12,13]}
            ]/*,
            2 : [
                {"a"   : [36,40,44,48]},
                {"n"   : [1,2,3,4,5,6,7,8,9,10,11,12,13,36,40,44,48]},
                {"a/n" : [36,40,44,48]}
            ]*/
        };
        return wifiInfo;
    }

    return {
        Login : Login,
        LoginStatus : LoginStatus,
        Logout : Logout,
        ChangePassword : ChangePassword,
        GetGuestUserControl : GetGuestUserControl,
        SetGuestUserControl : SetGuestUserControl,
        GetWifiSettings : GetWifiSettings,
        SetWifiSettings : SetWifiSettings,
        GetWpsSettings: GetWpsSettings,
        SetWpsSettings: SetWpsSettings,
        GetMacSettings : GetMacSettings,
        SetMacSettings : SetMacSettings,
        GetWifiSecuritySettings : GetWifiSecuritySettings,
        SetWifiSecuritySettings : SetWifiSecuritySettings,
        GetMobileWifiDiagnostics : GetMobileWifiDiagnostics,
        GetRouterDiagnostics : GetRouterDiagnostics,
        GetCurrentlyAttachedDevices : GetCurrentlyAttachedDevices,
        GetVendorFileUploadConfig : makeGetterFunction(vendorFileUploadConfig),
        GetVendorRestoreFileUploadConfig : makeGetterFunction(vendorRestoreFileUploadConfig),
        GetSdMemorySizes : GetSdMemorySizes,
        GetFileList : GetFileList,
        DeleteFilesAndFolders : DeleteFilesAndFolders,
        CreateFolder : CreateFolder,
        CheckFileExists : CheckFileExists,
        CheckUploadFileStatus : CheckUploadFileStatus,
        GetSdCardSharing : GetSdCardSharing,
        SetSdCardSharing : SetSdCardSharing,
        GetRouterIpConfiguration : GetRouterIpConfiguration,
        SetRouterIpConfiguration : SetRouterIpConfiguration,
        GetRouterDhcpConfiguration : GetRouterDhcpConfiguration,
        SetRouterDhcpConfiguration : SetRouterDhcpConfiguration,
        GetNatSettings : GetNatSettings,
        SetNatSettings : SetNatSettings,
        GetApplicationPortMappings : GetApplicationPortMappings,
        SetApplicationPortMappings : SetApplicationPortMappings,
        GetDmzSettings : GetDmzSettings,
        SetDmzSettings : SetDmzSettings,
        GetRouterBackupUrl : makeGetterFunction(routerBackupUrl),
        SetStoredPin: SetStoredPin,
        IsPinStored: IsPinStored,
        GetWebUiData : GetWebUiData,
        SetWebUiData : SetWebUiData,
        GetVodafoneConfiguration : GetVodafoneConfiguration,
        GetIdleTime : GetIdleTime,
        SetIdleTime : SetIdleTime,
        SetWifiCallbackDestination : SetWifiCallbackDestination,
        GetWifiCallbackDestination : GetWifiCallbackDestination,
        GetParameterValidation : GetParameterValidation,
        GetSdCardName : GetSdCardName,
        GenerateNewWpsPin: GenerateNewWpsPin,
        ForceCallbacks : ForceCallbacks,
        GetShowBanner: GetShowBanner,
        SetShowBanner: SetShowBanner,
        updateBatteryStatus: updateBatteryStatus,
        updateWifiSettings: updateWifiSettings,
        updateConnectedDevices: updateConnectedDevices,
        getcurrentLoginStatus: getcurrentLoginStatus,
        updateLoginStatus: updateLoginStatus,
        testDemo : { doOnePeriodicUpdate : doOnePeriodicUpdate },
        GetWifiInformation : GetWifiInformation
    };
}

var VendorWifi = vendorWifi();

 //say('vendorWifi.js loaded');