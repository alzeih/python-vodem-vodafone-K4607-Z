import unittest

from vodem.api import network_provider_fullname


class TestNetworkProviderFullname(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'network_provider_fullname': '',
        }

    def test_call(self):
        resp = network_provider_fullname()
        self.assertEqual(self.valid_response, resp)
