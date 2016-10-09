import unittest

from vodem.api import unlock_network


class TestUnlockNetwork(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {

        }

    @unittest.skip('skip')
    def test_call(self):
        resp = unlock_network()
        self.assertEqual(self.valid_response, resp)
