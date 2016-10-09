import unittest

from vodem.api import total_rx_bytes


class TestTotalRxBytes(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'total_rx_bytes': '0',
        }

    def test_call(self):
        resp = total_rx_bytes()
        self.assertEqual(self.valid_response, resp)
