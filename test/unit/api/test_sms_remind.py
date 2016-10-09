import unittest

from vodem.api import sms_remind


class TestSmsRemind(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'sms_remind': '0',
        }

    def test_call(self):
        resp = sms_remind()
        self.assertEqual(self.valid_response, resp)
