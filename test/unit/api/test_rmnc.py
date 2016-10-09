import unittest

from vodem.api import rmnc


class TestRmnc(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'rmnc': '',
        }

    def test_call(self):
        resp = rmnc()
        self.assertEqual(self.valid_response, resp)
