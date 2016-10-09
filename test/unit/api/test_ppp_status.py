import unittest

from vodem.api import ppp_status


class TestPppStatus(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'ppp_status': 'ppp_disconnected',
        }

    def test_call(self):
        resp = ppp_status()
        self.assertEqual(self.valid_response, resp)
