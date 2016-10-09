import unittest

from vodem.api import sms_unread_num


class TestSmsUnreadNum(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'sms_sim_unread_count': '0',
            'sms_dev_unread_count': '0',
        }

    def test_call(self):
        resp = sms_unread_num()
        self.assertEqual(self.valid_response, resp)
