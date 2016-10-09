import unittest

from vodem.api import set_account_type


class TestSetAccountType(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'result': 'success',
        }

    def test_call(self):
        resp = set_account_type({'AccountType': 'Prepaid'})
        self.assertEqual(self.valid_response, resp)
