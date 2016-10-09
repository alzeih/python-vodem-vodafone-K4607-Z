import unittest

from vodem.api import set_bearer_preference


class TestSetBearerPreference(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
        }

    @unittest.skip('skip')
    def test_call(self):
        resp = set_bearer_preference()
        self.assertEqual(self.valid_response, resp)
