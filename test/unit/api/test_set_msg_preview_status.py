import unittest

from vodem.api import set_msg_preview_status


class TestSetMessagePreviewStatus(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'result': 'success',
        }

    @unittest.skip('skip')
    def test_call(self):
        resp = set_msg_preview_status()
        self.assertEqual(self.valid_response, resp)
