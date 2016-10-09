import unittest

from vodem.api import is_msg_preview


class TestIsMsgPreview(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'is_msg_preview': '1',
        }

    def test_call(self):
        resp = is_msg_preview()
        self.assertEqual(self.valid_response, resp)
