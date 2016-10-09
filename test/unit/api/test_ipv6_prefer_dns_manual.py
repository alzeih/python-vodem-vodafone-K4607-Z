import unittest

from vodem.api import ipv6_prefer_dns_manual


class TestIpv6PreferDnsManual(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'ipv6_prefer_dns_manual': '',
        }

    def test_call(self):
        resp = ipv6_prefer_dns_manual()
        self.assertEqual(self.valid_response, resp)
