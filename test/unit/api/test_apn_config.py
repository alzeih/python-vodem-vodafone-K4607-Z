import unittest

from vodem.api import apn_config


class TestApnConfig(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'APN_config0': 'Default($)Default($)manual($)*99#($)none($)($)($)IP($)auto($)($)auto($)($)',
            'APN_config1': '',
            'APN_config2': '',
            'APN_config3': '',
            'APN_config4': '',
            'APN_config5': '',
            'APN_config6': '',
            'APN_config7': '',
            'APN_config8': '',
            'APN_config9': '',
        }

    def test_call(self):
        resp = apn_config({'multi-data': '1'})
        self.assertEqual(self.valid_response, resp)
