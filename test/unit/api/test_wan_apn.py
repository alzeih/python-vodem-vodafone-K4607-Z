import unittest

from vodem.api import wan_apn


class TestWanApn(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'wan_apn': 'Default',
        }

    def test_call(self):
        resp = wan_apn()
        self.assertEqual(self.valid_response, resp)
