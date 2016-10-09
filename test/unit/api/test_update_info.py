import unittest

from vodem.api import update_info


class TestUpgradeResult(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'filesname': '',
            'size': '0',
            'description': '',
            'version': '',
        }

    def test_call(self):
        resp = update_info()
        self.assertEqual(self.valid_response, resp)
