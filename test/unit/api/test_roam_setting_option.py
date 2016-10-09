import unittest

from vodem.api import roam_setting_option


class TestRoamSettingOption(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'roam_setting_option': 'on',
        }

    def test_call(self):
        resp = roam_setting_option()
        self.assertEqual(self.valid_response, resp)
