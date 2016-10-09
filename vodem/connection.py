import datetime
import logging
import requests

from .exceptions import RequestsError, InputError

logging.basicConfig()


class Connection(object):
    BASE_URL = 'http://192.168.9.1'

    def __init__(self):
        self._session = requests.Session()
        self._set_headers()

    def get(self, params):
        logging.getLogger(__name__).debug('calling post')
        logging.getLogger(__name__).debug(params)
        self._validate_dict(params)

        params.update(self._extra_params())

        request = requests.Request('GET', self._get_url(), params=params)
        return self._handle_request(request)

    def post(self, data):
        logging.getLogger(__name__).debug('calling get')
        logging.getLogger(__name__).debug(data)
        self._validate_dict(data)

        data.update(self._extra_params())

        request = requests.Request('POST', self._post_url(), data=data)
        return self._handle_request(request)

    def _get_url(self):
        logging.getLogger(__name__).debug('calling _get_url')
        return self.BASE_URL + '/goform/goform_get_cmd_process'

    def _post_url(self):
        logging.getLogger(__name__).debug('calling _post_url')
        return self.BASE_URL + '/goform/goform_set_cmd_process'

    def _handle_request(self, request):
        logging.getLogger(__name__).debug('calling handle_request')
        try:
            prepared_request = self._session.prepare_request(request)
            logging.getLogger(__name__).debug(
                'Request %s', prepared_request.url)
            logging.getLogger(__name__).debug(
                'Request Method: %s', prepared_request.method)
            logging.getLogger(__name__).debug(
                'Request Headers: %s', prepared_request.headers)
            logging.getLogger(__name__).debug(
                'Request Body: %s', prepared_request.body)

            response = self._session.send(
                prepared_request, stream=True, timeout=(3.05, 120))
            response.raise_for_status()

            logging.getLogger(__name__).debug('Response %s', response.text)
            logging.getLogger(__name__).debug(
                'Response Status %s', response.status_code)
            logging.getLogger(__name__).debug(
                'Response Headers %s', response.headers)
            logging.getLogger(__name__).debug(
                'Response Cookies %s', response.cookies.items())

            return self._decode_json(response)
        except requests.RequestException as ex:
            logging.getLogger(__name__).error(ex)
            raise RequestsError(ex)

    def _set_headers(self):
        logging.getLogger(__name__).debug('calling _set_headers')
        self._session.headers.update({
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': self.BASE_URL + '/home.htm',
            'Accept-Encoding': 'gzip, deflate, sdch',
            'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6',
        })

    @staticmethod
    def _decode_json(response):
        logging.getLogger(__name__).debug('calling _decode_json')
        try:
            return response.json()
        except ValueError as ex:
            # Incorrectly escaped json is returned in some instances,
            # so it must be handled gracefully
            logging.getLogger(__name__).debug(ex)
            return response.text

    @staticmethod
    def _extra_params():
        logging.getLogger(__name__).debug('calling _extra_params')
        delta = datetime.datetime.now() - datetime.datetime(1970, 1, 1)
        milliseconds = delta.total_seconds() * 1000
        params = {
            '_': '{0:13.0f}'.format(milliseconds),
        }
        return params

    @staticmethod
    def _validate_dict(params_or_data):
        logging.getLogger(__name__).debug('calling _validate_dict')
        logging.getLogger(__name__).debug(params_or_data)
        if params_or_data is None or isinstance(params_or_data, dict) is False:
            raise InputError('Invalid parameters',
                             params_or_data, type(params_or_data))
        for key, val in params_or_data.items():
            if key is None or isinstance(key, str) is False or len(key) == 0:
                raise InputError('Invalid parameter key', key, val)
            if val is None or isinstance(val, str) is False:
                raise InputError('Invalid parameter value', key, val)

DEFAULT_CONNECTION = Connection()


def get(params):
    return DEFAULT_CONNECTION.get(params)


def post(params):
    return DEFAULT_CONNECTION.post(params)
