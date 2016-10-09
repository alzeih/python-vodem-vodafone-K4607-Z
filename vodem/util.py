import datetime
import logging
import re

from .exceptions import DecodeError

logging.basicConfig()


def decode_number(message):
    logging.getLogger(__name__).debug(message)
    try:
        if message == '':
            return 0
        return int(message, 10)
    except Exception as ex:
        raise DecodeError(ex)


def decode_result(message):
    logging.getLogger(__name__).debug(message)
    try:
        if message == 'success':
            return True
        if message == 'failure':
            return False
        raise ValueError("unable to decode")
    except Exception as ex:
        raise DecodeError(ex)


def decode_sms_tag(message):
    logging.getLogger(__name__).debug(message)
    try:
        return int(message)
    except Exception as ex:
        raise DecodeError(ex)


def decode_sms_id(message):
    logging.getLogger(__name__).debug(message)
    try:
        return int(message)
    except Exception as ex:
        raise DecodeError(ex)


def decode_sms_cmd_status_info(message):
    logging.getLogger(__name__).debug(message)
    try:
        return int(message)
    except Exception as ex:
        raise DecodeError(ex)


def decode_sms_message(message):
    logging.getLogger(__name__).debug(message)
    try:
        return bytes.fromhex(message).decode('utf-16-be')
    except Exception as ex:
        raise DecodeError(ex)


def encode_sms_message(message):
    logging.getLogger(__name__).debug(message)
    try:
        return bytes.hex(message.encode('utf-16-be'))
    except Exception as ex:
        raise DecodeError(ex)


def encoding_of(message):
    logging.getLogger(__name__).debug(message)
    try:
        are_utf16 = [len(encode_sms_message(m)) == 8 for m in message]
        if any(are_utf16):
            return 'UNICODE'
        else:
            return 'GSM7_default'
    except UnicodeDecodeError as ex:
        raise DecodeError(ex)


def decode_time(message):
    logging.getLogger(__name__).debug(message)
    try:
        message, _ = _decode_utcoffset(message)
        return datetime.datetime.strptime(message, '%y,%m,%d,%H,%M,%S,')
    except Exception as ex:
        raise DecodeError(ex)


def encode_time(message):
    logging.getLogger(__name__).debug(message)
    try:
        return '{0}{1}'.format(message.strftime('%y;%m;%d;%H;%M;%S;'), '+0')
    except Exception as ex:
        raise DecodeError(ex)


def decode_wan_manual_contents_long(message):
    logging.getLogger(__name__).debug(message)

    def strip_chars(bad):
        """ This should't need to exist """
        return (
            bad[0],
            re.sub(r'\"', '', bad[1]),
            re.sub(r'\"', '', bad[2]),
            re.sub(r'\D', '', bad[3]),
            bad[4]
        )
    # I have nothing nice to say here about vendor.js:1323
    try:
        expr = re.compile(r'\(([^,]*),([^,]*),([^,]*),([^,]*),([^,]*)\),')
        matches = expr.findall(message)
        matches = [strip_chars(match) for match in matches]
        return matches
    except Exception as ex:
        raise DecodeError(ex)


def try_decode(decoder, key, safe=False, default=None):
    try:
        return decoder(key)
    except DecodeError:
        if safe:
            return default
        else:
            raise


def _decode_utcoffset(message):
    logging.getLogger(__name__).debug(message)
    try:
        expr = re.compile(r'^((?:[0-9]{2}\,){6})([+-]?[0-9]{1,2}$)')
        tstr, tzstr = expr.match(message).groups()
        return (tstr, tzstr)
    except Exception as ex:
        raise DecodeError(ex)
