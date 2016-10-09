import unittest

from vodem.api import connection_mode


class TestConnetionMode(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'connection_mode': '0,1'
        }

    def test_call(self):
        resp = connection_mode()
        self.assertEqual(self.valid_response, resp)
