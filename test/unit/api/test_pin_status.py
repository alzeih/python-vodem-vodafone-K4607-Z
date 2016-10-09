import unittest

from vodem.api import pin_status


class TestPinStatus(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'pin_status': '',
        }

    def test_call(self):
        resp = pin_status()
        self.assertEqual(self.valid_response, resp)
