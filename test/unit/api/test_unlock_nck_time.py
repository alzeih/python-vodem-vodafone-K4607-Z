import unittest

from vodem.api import unlock_nck_time


class TestUnlockNckTime(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'unlock_nck_time': '',
        }

    def test_call(self):
        resp = unlock_nck_time()
        self.assertEqual(self.valid_response, resp)
