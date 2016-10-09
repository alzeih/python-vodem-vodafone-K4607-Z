import unittest

from vodem.api import realtime_time


class TestRealtimeTime(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'realtime_time': '',
        }

    def test_call(self):
        resp = realtime_time()
        self.assertEqual(self.valid_response, resp)
