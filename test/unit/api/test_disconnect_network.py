import unittest

from vodem.api import disconnect_network


class TestDisconnectNetwork(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'result': 'success',
        }

    def test_call(self):
        resp = disconnect_network()
        self.assertEqual(self.valid_response, resp)
