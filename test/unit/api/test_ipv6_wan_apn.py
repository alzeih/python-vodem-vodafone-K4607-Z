import unittest

from vodem.api import ipv6_wan_apn


class TestIpv6WanApn(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'ipv6_wan_apn': '',
        }

    def test_call(self):
        resp = ipv6_wan_apn()
        self.assertEqual(self.valid_response, resp)
