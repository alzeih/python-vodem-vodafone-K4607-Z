import unittest

from vodem.api import total_tx_bytes


class TestTotalTxBytes(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'total_tx_bytes': '0',
        }

    def test_call(self):
        resp = total_tx_bytes()
        self.assertEqual(self.valid_response, resp)
