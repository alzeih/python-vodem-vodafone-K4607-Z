import unittest

from vodem.api import set_dial_ip_type


class TestSetDialIpType(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
        }

    @unittest.skip('skip')
    def test_call(self):
        resp = set_dial_ip_type()
        self.assertEqual(self.valid_response, resp)
