import unittest

from vodem.api import imei


class TestImei(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'imei': '',
        }

    def test_call(self):
        resp = imei()
        resp['imei'] = ''
        self.assertEqual(self.valid_response, resp)
