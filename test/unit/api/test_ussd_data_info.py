import unittest

from vodem.api import ussd_data_info


class TestUssdDataInfo(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'ussd_action': '0',
            'ussd_data': '',
            'ussd_dcs': '72',
        }

    def test_call(self):
        resp = ussd_data_info()
        self.assertEqual(self.valid_response, resp)
