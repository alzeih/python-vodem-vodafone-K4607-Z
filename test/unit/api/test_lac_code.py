import unittest

from vodem.api import lac_code


class TestLacCode(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'lac_code': '0',
        }

    def test_call(self):
        resp = lac_code()
        self.assertEqual(self.valid_response, resp)
