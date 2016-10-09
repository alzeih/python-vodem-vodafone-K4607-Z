import unittest

from vodem.api import ipv6_wan_ipaddr


class TestIpv6WanIpaddr(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'ipv6_wan_ipaddr': '',
        }

    def test_call(self):
        resp = ipv6_wan_ipaddr()
        self.assertEqual(self.valid_response, resp)
