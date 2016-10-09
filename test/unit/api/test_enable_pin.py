import unittest

from vodem.api import enable_pin


class TestEnablePin(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
        }

    @unittest.skip('skip')
    def test_call(self):
        resp = enable_pin()
        self.assertEqual(self.valid_response, resp)
