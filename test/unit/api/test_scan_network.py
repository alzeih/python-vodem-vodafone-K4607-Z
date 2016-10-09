import unittest

from vodem.api import scan_network


class TestScanNetwork(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'result': 'success',
        }

    def test_call(self):
        resp = scan_network()
        self.assertEqual(self.valid_response, resp)
