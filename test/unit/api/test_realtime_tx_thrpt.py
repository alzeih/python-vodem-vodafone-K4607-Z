import unittest

from vodem.api import realtime_tx_thrpt


class TestRealtimeTxThrpt(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'realtime_tx_thrpt': '',
        }

    def test_call(self):
        resp = realtime_tx_thrpt()
        self.assertEqual(self.valid_response, resp)
