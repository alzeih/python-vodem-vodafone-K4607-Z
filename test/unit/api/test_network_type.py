import unittest

from vodem.api import network_type


class TestNetworkType(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'network_type': '',
        }

    def test_call(self):
        resp = network_type()
        self.assertEqual(self.valid_response, resp)
