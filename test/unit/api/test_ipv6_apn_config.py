import unittest

from vodem.api import ipv6_apn_config


class TestIpv6ApnConfig(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'ipv6_APN_config0': 'Default($)($)($)($)($)($)($)($)($)($)($)($)',
            'ipv6_APN_config1': '',
            'ipv6_APN_config2': '',
            'ipv6_APN_config3': '',
            'ipv6_APN_config4': '',
            'ipv6_APN_config5': '',
            'ipv6_APN_config6': '',
            'ipv6_APN_config7': '',
            'ipv6_APN_config8': '',
            'ipv6_APN_config9': '',
        }

    def test_call(self):
        resp = ipv6_apn_config()
        self.assertEqual(self.valid_response, resp)
