import unittest

from vodem.api import is_show_ssid_key_oled


class TestIsShowSsidKeyOled(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'is_show_ssid_key_oled': '',
        }

    def test_call(self):
        resp = is_show_ssid_key_oled()
        self.assertEqual(self.valid_response, resp)
