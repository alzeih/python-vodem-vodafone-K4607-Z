import unittest

from vodem.api import realtime_rx_thrpt


class TestRealtimeRxThrpt(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'realtime_rx_thrpt': '',
        }

    def test_call(self):
        resp = realtime_rx_thrpt()
        self.assertEqual(self.valid_response, resp)
