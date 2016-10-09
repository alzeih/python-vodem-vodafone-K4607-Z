import unittest

from vodem.api import ipv6_prefer_dns_auto


class TestIpv6PreferDnsAuto(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'ipv6_prefer_dns_auto': '',
        }

    def test_call(self):
        resp = ipv6_prefer_dns_auto()
        self.assertEqual(self.valid_response, resp)
