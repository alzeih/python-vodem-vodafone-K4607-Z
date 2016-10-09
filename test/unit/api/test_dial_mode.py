import unittest

from vodem.api import dial_mode


class TestDialMode(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'dial_mode': 'auto_dial',
        }

    def test_call(self):
        resp = dial_mode()
        self.assertEqual(self.valid_response, resp)
