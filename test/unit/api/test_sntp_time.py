import unittest

from vodem.api import sntp_time


class TestSntpTime(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'sntp_time': '',
        }

    def test_call(self):
        resp = sntp_time()
        self.assertEqual(self.valid_response, resp)
