import unittest

from vodem.api import set_show_ssid_key_oled


class TestSetShowSsidKeyOled(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'result': 'success',
        }

    @unittest.skip('skip')
    def test_call(self):
        resp = set_show_ssid_key_oled()
        self.assertEqual(self.valid_response, resp)
