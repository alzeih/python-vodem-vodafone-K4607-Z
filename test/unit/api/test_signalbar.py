import unittest

from vodem.api import signalbar


class TestSignalbar(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'signalbar': '0',
        }

    def test_call(self):
        resp = signalbar()
        self.assertEqual(self.valid_response, resp)
