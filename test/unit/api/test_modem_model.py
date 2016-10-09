import unittest

from vodem.api import modem_model


class TestModemModel(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'modem_model': 'K4607-Z',
        }

    def test_call(self):
        resp = modem_model()
        self.assertEqual(self.valid_response, resp)
