import unittest

from vodem.api import pdp_type


class TestPdpType(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'pdp_type': 'IP',
        }

    def test_call(self):
        resp = pdp_type()
        self.assertEqual(self.valid_response, resp)
