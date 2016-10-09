import unittest

from vodem.api import disable_pin


class TestDisablePin(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
        }

    @unittest.skip('skip')
    def test_call(self):
        resp = disable_pin({'OldPinNumber': ''})
        self.assertEqual(self.valid_response, resp)
