import unittest

from vodem.api import sms_received_flag


class TestSmsReceivedFlag(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'sms_received_flag': '',
        }

    def test_call(self):
        resp = sms_received_flag()
        self.assertEqual(self.valid_response, resp)
