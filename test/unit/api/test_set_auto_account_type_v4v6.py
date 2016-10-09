import unittest

from vodem.api import set_auto_account_type_v4v6


class TestSetAutoAccountTypeV4V6(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
        }

    @unittest.skip('skip')
    def test_call(self):
        resp = set_auto_account_type_v4v6()
        self.assertEqual(self.valid_response, resp)
