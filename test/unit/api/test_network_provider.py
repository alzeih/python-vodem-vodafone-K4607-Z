import unittest

from vodem.api import network_provider


class TestNetworkProvider(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'network_provider': '',
        }

    def test_call(self):
        resp = network_provider()
        self.assertEqual(self.valid_response, resp)
