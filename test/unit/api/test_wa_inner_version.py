import unittest

from vodem.api import wa_inner_version


class TestWaInnerVersion(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'wa_inner_version': 'BD_K4607V3.2',
        }

    def test_call(self):
        resp = wa_inner_version()
        self.assertEqual(self.valid_response, resp)
