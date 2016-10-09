import unittest

from vodem.api import wan_ipaddr


class TestWanIpaddr(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'wan_ipaddr': '',
        }

    def test_call(self):
        resp = wan_ipaddr()
        self.assertEqual(self.valid_response, resp)
