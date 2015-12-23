import datetime
import logging
import time

from . import api, util

logging.basicConfig()

def sms_get_flag():
    response = api.sms_received_flag()
    logging.getLogger(__name__).debug(response)
    return util.decode_number(response['sms_received_flag'])

def sms_set_flag():
    response = api.sms_received_flag_flag()
    logging.getLogger(__name__).debug(response)
    return util.decode_number(response['sms_received_flag']) == 0

def sms_unread_count():
    response = api.sms_unread_num()
    logging.getLogger(__name__).debug(response)
    return util.decode_number(response['sms_dev_unread_count'])

def sms_inbox_count():
    response = api.sms_capacity_info()
    logging.getLogger(__name__).debug(response)
    return util.decode_number(response['sms_nv_rev_total'])

def sms_outbox_count():
    response = api.sms_capacity_info()
    logging.getLogger(__name__).debug(response)
    return util.decode_number(response['sms_nv_send_total'])

def sms_draftbox_count():
    response = api.sms_capacity_info()
    logging.getLogger(__name__).debug(response)
    return util.decode_number(response['sms_nv_draftbox_total'])

def sms_set_read(index):
    encoded_index = '{0};'.format(index)

    params = {
        'msg_id' : encoded_index,
        }

    logging.getLogger(__name__).debug(params)
    response = api.set_msg_read(params)
    logging.getLogger(__name__).debug(response)

    return util.decode_result(response['result'])

def sms_save(number, message, async=False):
    encoded_number = '{0};'.format(number)
    encoded_message = util.encode_sms_message(message)
    encoded_time = util.encode_time(datetime.datetime.now())

    params = {
        'SMSNumber' : encoded_number,
        'SMSMessage' : encoded_message,
        'sms_time' : encoded_time,
        }
    logging.getLogger(__name__).debug(params)
    response = api.save_sms(params)
    logging.getLogger(__name__).debug(response)

    if not async:
        return _wait_for_status('5')

def sms_inbox_unread(per_page=10):
    current_page = 1
    while True:
        current_page_data = sms_inbox_page(page=current_page, count=per_page)
        if len(current_page_data) != 0:
            for message in current_page_data:
                if message['tag'] == 1:
                    yield message
            current_page += 1
        else:
            return

def sms_inbox_read(per_page=10):
    current_page = 1
    while True:
        current_page_data = sms_inbox_page(page=current_page, count=per_page)
        if len(current_page_data) != 0:
            for message in current_page_data:
                if message['tag'] == 0:
                    yield message
            current_page += 1
        else:
            return

def sms_inbox(per_page=10):
    current_page = 1
    while True:
        current_page_data = sms_inbox_page(page=current_page, count=per_page)
        if len(current_page_data) != 0:
            for message in current_page_data:
                yield message
            current_page += 1
        else:
            return

def sms_inbox_page(page=1, count=10):
    encoded_page = '{0}'.format(page - 1)
    encoded_data_per_page = '{0}'.format(count)
    params = {
        'tags' : '12',
        'data_per_page' : encoded_data_per_page,
        'page' : encoded_page,
        }
    response = api.sms_page_data(params)
    response = [_decode_message(m) for m in response['messages']]
    return response

def sms_outbox(per_page=10):
    current_page = 1
    while True:
        current_page_data = sms_outbox_page(page=current_page, count=per_page)
        if len(current_page_data) != 0:
            for message in current_page_data:
                yield message
            current_page += 1
        else:
            return

def sms_outbox_page(page=1, count=10):
    encoded_page = '{0}'.format(page - 1)
    encoded_data_per_page = '{0}'.format(count)
    params = {
        'tags' : '2',
        'data_per_page' : encoded_data_per_page,
        'page' : encoded_page,
        }
    response = api.sms_page_data(params)
    response = [_decode_message(m) for m in response['messages']]
    return response

def sms_draftbox(per_page=10):
    current_page = 1
    while True:
        current_page_data = sms_draftbox_page(page=current_page, count=per_page)
        if len(current_page_data) != 0:
            for message in current_page_data:
                yield message
            current_page += 1
        else:
            return

def sms_draftbox_page(page=1, count=10):
    encoded_page = '{0}'.format(page - 1)
    encoded_data_per_page = '{0}'.format(count)
    params = {
        'tags' : '11',
        'data_per_page' : encoded_data_per_page,
        'page' : encoded_page,
        }
    response = api.sms_page_data(params)
    response = [_decode_message(m) for m in response['messages']]
    return response

def sms_send(number, message, index=-1, async=False):
    encoded_number = '{0};'.format(number)
    encoded_message = util.encode_sms_message(message)
    encoded_time = util.encode_time(datetime.datetime.now())
    encoded_index = '{0};'.format(index)

    params = {
        'Number' : encoded_number,
        'MessageBody' : encoded_message,
        'sms_time' : encoded_time,
        'ID' : encoded_index,
        }
    logging.getLogger(__name__).debug(params)
    response = api.send_sms(params)
    logging.getLogger(__name__).debug(response)

    if not async:
        return _wait_for_status('4')

def sms_delete(index, async=False):
    encoded_index = '{0};'.format(index)

    params = {
        'msg_id' : encoded_index,
        }
    logging.getLogger(__name__).debug(params)
    response = api.delete_sms(params)
    logging.getLogger(__name__).debug(response)

    if not async:
        return _wait_for_status('6')

def _decode_message(message):
    logging.getLogger(__name__).debug(message)
    message['content'] = util.decode_sms_message(message['content'])
    message['date'] = util.decode_time(message['date'])
    message['tag'] = util.decode_sms_tag(message['tag'])
    message['id'] = util.decode_sms_id(message['id'])
    logging.getLogger(__name__).debug(message)
    return message

def _wait_for_status(sms_cmd, wait_max_times=10, wait_interval=2.0):
    wait_count = 0

    params = {
        'sms_cmd' : sms_cmd,
        }
    logging.getLogger(__name__).debug(params)
    while True:
        # wait first to allow device time to process request
        if wait_count == wait_max_times:
            return
        # a float asks for more accurate intervals from time.sleep
        time.sleep(wait_interval)
        wait_count += 1

        status_response = api.sms_cmd_status_info(params)
        logging.getLogger(__name__).debug(status_response)
        # if device has not processed anything for given sms_cmd since reset
        # response value is garbage, so ignore it and wait again
        if 'sms_cmd_status_result' in status_response.keys():
            status = util.decode_sms_cmd_status_info(status_response['sms_cmd_status_result'])
            if status is not None:
                return status