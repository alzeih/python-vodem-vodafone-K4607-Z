import unittest

from vodem.api import lan_ipaddr_for_current


class TestLanIpaddrForCurrent(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'lan_ipaddr_for_current': '192.168.9.1',
        }

    def test_call(self):
        resp = lan_ipaddr_for_current()
        self.assertEqual(self.valid_response, resp)
