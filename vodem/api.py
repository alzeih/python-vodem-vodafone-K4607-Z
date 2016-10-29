import logging

from vodem.connection import get, post

logging.basicConfig()


def account_type(overrides=None):
    defaults = {
        'cmd': 'account_type',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def activate_flag(overrides=None):
    defaults = {
        'cmd': 'activate_flag',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def apn_config(overrides=None):
    cmd = ','.join(['APN_config' + str(i) for i in range(0, 10)])
    defaults = {
        'cmd': cmd,
        'multi_data': '1',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def cell_id(overrides=None):
    defaults = {
        'cmd': 'cell_id',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def connection_mode(overrides=None):
    defaults = {
        'cmd': 'connection_mode',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def connect_network(overrides=None):
    defaults = {
        'goformId': 'CONNECT_NETWORK',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def current_upgrade_state(overrides=None):
    defaults = {
        'cmd': 'current_upgrade_state',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def custom_account_type(overrides=None):
    defaults = {
        'cmd': 'custom_account_type',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def delete_sms(overrides=None):
    """
    Delete Sms

    Args
      overrides (dict):
        msg_id: ';' (empty), 'X;' (one) 'X;Y;Z;' (many)
    """
    defaults = {
        'goformId': 'DELETE_SMS',
        'msg_id': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def dial_mode(overrides=None):
    defaults = {
        'cmd': 'dial_mode',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def disable_pin(overrides=None):
    defaults = {
        'goformId': 'DISABLE_PIN',
        'OldPinNumber': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def disconnect_network(overrides=None):
    defaults = {
        'goformId': 'DISCONNECT_NETWORK',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def dns_mode(overrides=None):
    defaults = {
        'cmd': 'dns_mode',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def enable_pin(overrides=None):
    defaults = {
        'goformId': 'ENABLE_PIN',
        'OldPinNumber': '',
        'NewPinNumber': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def enter_pin(overrides=None):
    defaults = {
        'goformId': 'ENTER_PIN',
        'PinNumber': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def enter_puk(overrides=None):
    defaults = {
        'goformId': 'ENTER_PUK',
        'PUKNumber': '',
        'PinNumber': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def get_sim_status(overrides=None):
    defaults = {
        'cmd': 'modem_main_state',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def hardware_version(overrides=None):
    defaults = {
        'cmd': 'hardware_version',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def if_upgrade(overrides=None):
    """
    select_op : "check", "1" (download), "2" (cancel)
    """
    defaults = {
        'goformId': 'IF_UPGRADE',
        'select_op': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def imei(overrides=None):
    defaults = {
        'cmd': 'imei',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def ipv4_apn_list(overrides=None):
    cmd = ','.join(['ipv4_apn_list' + str(i) for i in range(0, 10)])
    defaults = {
        'cmd': cmd,
        'multi_data': '1',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def ipv6_apn_config(overrides=None):
    cmd = ','.join(['ipv6_APN_config' + str(i) for i in range(0, 10)])
    defaults = {
        'cmd': cmd,
        'multi_data': '1',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def ipv6_apn_list(overrides=None):
    cmd = ','.join(['ipv6_apn_list' + str(i) for i in range(0, 10)])
    defaults = {
        'cmd': cmd,
        'multi_data': '1',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def ipv6_dns_mode(overrides=None):
    defaults = {
        'cmd': 'ipv6_dns_mode',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def ipv6_prefer_dns_auto(overrides=None):
    defaults = {
        'cmd': 'ipv6_prefer_dns_auto',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def ipv6_prefer_dns_manual(overrides=None):
    defaults = {
        'cmd': 'ipv6_prefer_dns_manual',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def ipv6_standby_dns_auto(overrides=None):
    defaults = {
        'cmd': 'ipv6_standby_dns_auto',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def ipv6_standby_dns_manual(overrides=None):
    defaults = {
        'cmd': 'ipv6_standby_dns_manual',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def ipv6_wan_apn(overrides=None):
    defaults = {
        'cmd': 'ipv6_wan_apn',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def ipv6_wan_ipaddr(overrides=None):
    defaults = {
        'cmd': 'ipv6_wan_ipaddr',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def is_msg_preview(overrides=None):
    defaults = {
        'cmd': 'is_msg_preview',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def is_show_ssid_key_oled(overrides=None):
    defaults = {
        'cmd': 'is_show_ssid_key_oled',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def lac_code(overrides=None):
    defaults = {
        'cmd': 'lac_code',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def language(overrides=None):
    defaults = {
        'cmd': 'Language',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def lan_ipaddr_for_current(overrides=None):
    defaults = {
        'cmd': 'lan_ipaddr_for_current',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def localdomain_for_current(overrides=None):
    defaults = {
        'cmd': 'LocalDomain_for_current',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def locked_hplmns(overrides=None):
    defaults = {
        'cmd': 'locked_hplmns',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def lock_status(overrides=None):
    defaults = {
        'cmd': 'lock_status',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def m_netselect_status(overrides=None):
    """
    Manual netselect status
    """
    defaults = {
        'cmd': 'm_netselect_status',
        'multi_data': '1',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def modem_main_state(overrides=None):
    defaults = {
        'cmd': 'modem_main_state',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def modem_model(overrides=None):
    defaults = {
        'cmd': 'modem_model',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def modem_msn(overrides=None):
    defaults = {
        'cmd': 'modem_msn',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def msisdn(overrides=None):
    defaults = {
        'cmd': 'msisdn',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def net_select(overrides=None):
    defaults = {
        'cmd': 'net_select',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def net_select_mode(overrides=None):
    defaults = {
        'cmd': 'net_select_mode',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def network_provider_fullname(overrides=None):
    defaults = {
        'cmd': 'network_provider_fullname',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def network_provider(overrides=None):
    defaults = {
        'cmd': 'network_provider',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def network_type(overrides=None):
    defaults = {
        'cmd': 'network_type',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def new_version_state(overrides=None):
    defaults = {
        'cmd': 'new_version_state',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def pdp_type(overrides=None):
    defaults = {
        'cmd': 'pdp_type',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def pinnumber(overrides=None):
    defaults = {
        'cmd': 'pinnumber',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def pin_status(overrides=None):
    defaults = {
        'cmd': 'pin_status',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def ppp_status(overrides=None):
    defaults = {
        'cmd': 'ppp_status',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def prefer_dns_auto(overrides=None):
    defaults = {
        'cmd': 'prefer_dns_auto',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def prefer_dns_manual(overrides=None):
    defaults = {
        'cmd': 'prefer_dns_manual',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def puknumber(overrides=None):
    defaults = {
        'cmd': 'puknumber',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def realtime_rx_thrpt(overrides=None):
    defaults = {
        'cmd': 'realtime_rx_thrpt',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def realtime_time(overrides=None):
    defaults = {
        'cmd': 'realtime_time',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def realtime_tx_thrpt(overrides=None):
    defaults = {
        'cmd': 'realtime_tx_thrpt',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def reboot_device(overrides=None):
    defaults = {
        'goformId': 'REBOOT_DEVICE',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def reset_data_counter_ex(overrides=None):
    defaults = {
        'goformId': 'RESET_DATA_COUNTER_EX',
        'reset_wan_statistics_option': 'total',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def restore_factory_settings(overrides=None):
    defaults = {
        'goformId': 'RESTORE_FACTORY_SETTINGS',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def rmcc(overrides=None):
    defaults = {
        'cmd': 'rmcc',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def rmnc(overrides=None):
    defaults = {
        'cmd': 'rmnc',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def roam_setting_option(overrides=None):
    defaults = {
        'cmd': 'roam_setting_option',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def save_phone_number(overrides=None):
    defaults = {
        'goformId': 'SAVE_PHONE_NUMBER',
        'Phone_Num': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def save_sms(overrides=None):
    """
    Save sms

    Args
      overrides (dict):
        SMSNumber: ';' (empty) 'X;' (singular) 'X;Y;Z;' (multiple)
        sms_time:
        SMSMessage: '' (empty)
        Index: -1 (new), n (replace n)
        encode_type: GSM7_default, GSM7_turkey, UNICODE
    """
    defaults = {
        'goformId': 'SAVE_SMS',
        'location': '1',
        'tags': '4',
        'SMSNumber': '',
        'SMSMessage': '',
        'Index': '-1',
        'encode_type': 'GSM7_default',
        'sms_time': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def scan_network(overrides=None):
    defaults = {
        'goformId': 'SCAN_NETWORK',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def send_sms(overrides=None):
    """
    Send sms

    Args
      overrides (dict):
        Number: ';' (empty) 'X;' (singular) 'X;Y;Z;' (multiple)
        sms_time:
        MessageBody: '' (empty)
        ID: -1 (new), n (replace n)
        encode_type: GSM7_default, GSM7_turkey, UNICODE
    """
    defaults = {
        'goformId': 'SEND_SMS',
        'Number': '',
        'sms_time': '',
        'MessageBody': '',
        'ID': '-1',
        'encode_type': 'GSM7_default',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def set_account_type(overrides=None):
    """
    Set acount type

    Args
      overrides (dict):
        AccountType: 'Contract', 'Prepaid', 'Custom'
    """
    defaults = {
        'goformId': 'SET_ACCOUNT_TYPE',
        'AccountType': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def set_auto_account_type_v4v6(overrides=None):
    defaults = {
        'goformId': 'SET_AUTO_ACCOUNT_TYPE_V4V6',
        'APN': '',
        'Number': '',
        'DNS': '',
        'DNS2': '',
        'Security': '',
        'Username': '',
        'Password': '',
        'dns_mode': '',
        'pdp_select': '',
        'pdp_addr': '',
        'account_type': '',
        'reporting_account_type': '',
        'ipv6_wan_apn': '',
        'wan_dial': '',
        'ipv6_ppp_auth_mode': '',
        'ipv6_ppp_username': '',
        'ipv6_ppp_passwd': '',
        'ipv6_dns_mode': '',
        'ipv6_prefer_dns_manual': '',
        'ipv6_standby_dns_manual': '',
        'ipv6_pdp_select': '',
        'ipv6_pdp_addr': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def set_bearer_preference(overrides=None):
    """
    BearerPreference: "Only_GSM", "Only_WCDMA"
            "WCDMA_preferred", "Only_LTE", "NETWORK_auto",
    """
    defaults = {
        'goformId': 'SET_BEARER_PREFERENCE',
        'BearerPreference': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def set_connection_mode(overrides=None):
    """
    ConnectionMode: "auto_dial", "manual_dial", "demand_dial"
    roam_setting_option: "on", "off"
    """
    defaults = {
        'goformId': 'SET_CONNECTION_MODE',
        'ConnectionMode': '',
        'roam_setting_option': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def set_dial_ip_type(overrides=None):
    """
    ip_type: "IP", "IPV6", "IPV4V6"
    """
    defaults = {
        'goformId': 'SET_DIAL_IP_TYPE',
        'ip_type': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def set_message_center(overrides=None):
    defaults = {
        'goformId': 'SET_MESSAGE_CENTER',
        'save_time': 'largest',
        'status_save': '0',
        'save_location': 'native',
        'MessageCenter': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def set_msg_preview_status(overrides=None):
    """
    isMessagePreview : "0", "1"
    """
    defaults = {
        'goformId': 'SET_MSG_PREVIEW_STATUS',
        'isMessagePreview': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def set_msg_read(overrides=None):
    defaults = {
        'goformId': 'SET_MSG_READ',
        'msg_id': '',
        'tag': '0',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def set_network(overrides=None):
    """
        NetworkNumber: a valid mccmnc
        Rat: "0" (2G), "2" (3G), "7" (4G)
    """
    defaults = {
        'goformId': 'SET_NETWORK',
        'NetworkNumber': '',
        'Rat': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def set_remind_flag(overrides=None):
    defaults = {
        'goformId': 'SET_REMIND_FLAG',
        'sms_remind': '0',
        'redirect_flag': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def set_show_ssid_key_oled(overrides=None):
    """
    doubleTapEnabled : "0", "1"
    """
    defaults = {
        'goformId': 'SET_SHOW_SSID_KEY_OLED',
        'doubleTapEnabled': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def set_web_language(overrides=None):
    """
    Language: ISO-3166. ie: "en-gb"
    """
    defaults = {
        'goformId': 'SET_WEB_LANGUAGE',
        'Language': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def signalbar(overrides=None):
    defaults = {
        'cmd': 'signalbar',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def simcard_roam(overrides=None):
    defaults = {
        'cmd': 'simcard_roam',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def sim_active_result(overrides=None):
    defaults = {
        'cmd': 'sim_active_result',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def sim_iccid(overrides=None):
    defaults = {
        'cmd': 'sim_iccid',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def sim_imsi(overrides=None):
    defaults = {
        'cmd': 'sim_imsi',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def sms_capacity_info(overrides=None):
    """
    Sms Capacity Info

    """
    defaults = {
        'cmd': 'sms_capacity_info',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def sms_cmd_status_info(overrides=None):
    """
    Sms Cmd Status Info

    Args
      overrides (dict):
        sms_cmd: 3 (set message center), 4 (send), 5 (save), 6 (delete)
    """
    defaults = {
        'cmd': 'sms_cmd_status_info',
        'sms_cmd': '',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def sms_page_data(overrides=None):
    """
    Sms Page Data

    Args
      overrides (dict):
        tags: 2 (outbox), 10 (dustbin), 11 (draftbox), 12 (inbox)
    """
    defaults = {
        'cmd': 'sms_page_data',
        'page': '0',
        'data_per_page': '10',
        'mem_store': '1',
        'tags': '',
        'order_by': 'order by id desc',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def sms_parameter_info(overrides=None):
    defaults = {
        'cmd': 'sms_parameter_info',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def sms_received_flag(overrides=None):
    """
    Sms Recieved Flag

    """
    defaults = {
        'cmd': 'sms_received_flag',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def sms_received_flag_flag(overrides=None):
    """
    Clear Sms Recieved Flag
    (this get request changes device state)

    """
    defaults = {
        'cmd': 'sms_received_flag',
        'sms_received_flag_flag': '0',
        'multi_data': '1',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def sms_remind(overrides=None):
    defaults = {
        'cmd': 'sms_remind',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def sms_unread_num(overrides=None):
    defaults = {
        'cmd': 'sms_unread_num',
        'multi_data': '1',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def sntp_time(overrides=None):
    defaults = {
        'cmd': 'sntp_time',
        'multi_data': '1',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def standby_dns_auto(overrides=None):
    defaults = {
        'cmd': 'standby_dns_auto',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def standby_dns_manual(overrides=None):
    defaults = {
        'cmd': 'standby_dns_manual',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def sv_of_imeisv(overrides=None):
    defaults = {
        'cmd': 'sv_of_imeisv',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def system_uptime(overrides=None):
    defaults = {
        'cmd': 'system_uptime',
        'multi_data': '1',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def total_rx_bytes(overrides=None):
    defaults = {
        'cmd': 'total_rx_bytes',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def total_time(overrides=None):
    defaults = {
        'cmd': 'total_time',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def total_tx_bytes(overrides=None):
    defaults = {
        'cmd': 'total_tx_bytes',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def unlock_nck_time(overrides=None):
    defaults = {
        'cmd': 'unlock_nck_time',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def unlock_network(overrides=None):
    defaults = {
        'goformId': 'UNLOCK_NETWORK',
        'unlock_network_code': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def update_info(overrides=None):
    defaults = {
        'cmd': 'update_info',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def upgrade_result(overrides=None):
    defaults = {
        'cmd': 'upgrade_result',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def ussd_data_info(overrides=None):
    defaults = {
        'cmd': 'ussd_data_info',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def ussd_process(overrides=None):
    defaults = {
        'goformId': 'USSD_PROCESS',
        'USSD_operator': 'ussd_send',
        'USSD_send_number': '',
    }
    data = _update_params(defaults, overrides)
    return post(data)


def ussd_write_flag(overrides=None):
    defaults = {
        'cmd': 'ussd_write_flag',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def wa_inner_version(overrides=None):
    defaults = {
        'cmd': 'wa_inner_version',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def wan_apn(overrides=None):
    defaults = {
        'cmd': 'wan_apn',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def wan_ipaddr(overrides=None):
    defaults = {
        'cmd': 'wan_ipaddr',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def wan_manual_contents_long(overrides=None):
    defaults = {
        'cmd': 'wan_manual_contents_long',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def webui_product_name(overrides=None):
    defaults = {
        'cmd': 'webui_product_name',
    }
    params = _update_params(defaults, overrides)
    return get(params)


def _update_params(defaults, overrides):
    def is_str(value):
        return isinstance(value, str)
    logging.getLogger(__name__).debug('Defaults: %s', defaults)
    logging.getLogger(__name__).debug('Overrides: %s', overrides)

    params = defaults

    if overrides and isinstance(overrides, dict):

        # remove any non string key/values from the supplied inputs
        overrides = {k: v for k, v in overrides.items() if is_str(k)
                     and is_str(v)}

        # take any new values iff the key exists in the defaults
        updates = {k: overrides[k]
                   for k in defaults.keys() if k in overrides.keys()}

        # take a copy of the defaults and update with the valid overrides
        params = defaults.copy()
        params.update(updates)

    logging.getLogger(__name__).debug('Params: %s', params)
    return params
