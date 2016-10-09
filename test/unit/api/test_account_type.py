import unittest
from vodem.api import account_type


class TestAccountType(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'account_type': ''
        }

    def test_call(self):
        resp = account_type()
        resp['account_type'] = ''
        self.assertEqual(self.valid_response, resp)
