import unittest

from vodem.api import ipv6_dns_mode


class TestIpv6DnsMode(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'ipv6_dns_mode': '',
        }

    def test_call(self):
        resp = ipv6_dns_mode()
        self.assertEqual(self.valid_response, resp)
