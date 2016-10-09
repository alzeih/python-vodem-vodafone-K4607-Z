import unittest

from vodem.api import enter_pin


class TestEnterPin(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
        }

    @unittest.skip('skip')
    def test_call(self):
        resp = enter_pin()
        self.assertEqual(self.valid_response, resp)
