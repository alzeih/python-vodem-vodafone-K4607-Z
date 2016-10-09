import unittest

from vodem.api import custom_account_type


class TestCustomAccountType(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'custom_account_type': '',
        }

    def test_call(self):
        resp = custom_account_type()
        self.assertEqual(self.valid_response, resp)
