import unittest

from vodem.api import msisdn


class TestMsisdn(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'msisdn': '',
        }

    def test_call(self):
        resp = msisdn()
        self.assertEqual(self.valid_response, resp)
