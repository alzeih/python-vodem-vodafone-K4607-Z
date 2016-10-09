import unittest

from vodem.api import set_network


class TestSetNetwork(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
        }

    @unittest.skip('skip')
    def test_call(self):
        resp = set_network()
        self.assertEqual(self.valid_response, resp)
