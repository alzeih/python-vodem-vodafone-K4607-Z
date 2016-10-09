import unittest

from vodem.api import set_connection_mode


class TestSetConnectionMode(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
        }

    @unittest.skip('skip')
    def test_call(self):
        resp = set_connection_mode()
        self.assertEqual(self.valid_response, resp)
