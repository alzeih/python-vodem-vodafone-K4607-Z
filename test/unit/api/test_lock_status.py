import unittest

from vodem.api import lock_status


class TestLockStatus(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'lock_status': '',
        }

    def test_call(self):
        resp = lock_status()
        self.assertEqual(self.valid_response, resp)
