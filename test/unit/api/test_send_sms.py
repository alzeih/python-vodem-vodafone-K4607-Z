import unittest

from vodem.api import send_sms


class TestSendSms(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
        }

    @unittest.skip('skip')
    def test_call(self):
        resp = send_sms()
        self.assertEqual(self.valid_response, resp)
