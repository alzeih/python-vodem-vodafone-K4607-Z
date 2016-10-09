import unittest

from vodem.api import total_time


class TestTotalTime(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'total_time': '0',
        }

    def test_call(self):
        resp = total_time()
        self.assertEqual(self.valid_response, resp)
