import unittest

from vodem.api import activate_flag


class TestActivateFlag(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'activate_flag': '',
        }

    def test_call(self):
        resp = activate_flag()
        self.assertEqual(self.valid_response, resp)
