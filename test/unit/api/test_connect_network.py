import unittest

from vodem.api import connect_network


class TestConnectNetwork(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'result': 'success',
        }

    @unittest.skip('skip')
    def test_call(self):
        resp = connect_network()
        self.assertEqual(self.valid_response, resp)
