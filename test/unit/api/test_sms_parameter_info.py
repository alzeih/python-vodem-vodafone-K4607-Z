import unittest

from vodem.api import sms_parameter_info


class TestSmsParameterInfo(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'sms_para_sca': '',
            'sms_para_mem_store': '0',
            'sms_para_validity_period': '0',
            'sms_para_status_report': '0',
        }

    def test_call(self):
        resp = sms_parameter_info()
        self.assertEqual(self.valid_response, resp)
