import unittest

from vodem.api import delete_sms


class TestDeleteSms(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'result': 'success',
        }

    def test_call(self):
        resp = delete_sms()
        self.assertEqual(self.valid_response, resp)
