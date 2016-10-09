import unittest

from vodem.api import save_phone_number


class TestSavePhoneNumber(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
        }

    @unittest.skip('skip')
    def test_call(self):
        resp = save_phone_number({'Phone_Num': ' '})
        self.assertEqual(self.valid_response, resp)
