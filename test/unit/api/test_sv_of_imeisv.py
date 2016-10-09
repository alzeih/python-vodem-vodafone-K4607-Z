import unittest

from vodem.api import sv_of_imeisv


class TestSvOfImeisv(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'sv_of_imeisv': '32',
        }

    def test_call(self):
        resp = sv_of_imeisv()
        self.assertEqual(self.valid_response, resp)
