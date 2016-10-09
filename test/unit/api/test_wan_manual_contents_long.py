import unittest

from vodem.api import wan_manual_contents_long


class TestWanManualContentsLong(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            "wan_manual_contents_long": ''
        }

    def test_call(self):
        resp = wan_manual_contents_long()
        self.assertEqual(self.valid_response, resp)
