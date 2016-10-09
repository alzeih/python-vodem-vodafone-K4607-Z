import unittest

from vodem.api import pinnumber


class TestPinNumber(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'pinnumber': '',
        }

    def test_call(self):
        resp = pinnumber()
        self.assertEqual(self.valid_response, resp)
