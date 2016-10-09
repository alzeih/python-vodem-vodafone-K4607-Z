import unittest

from vodem.api import set_message_center


class TestSetMessageCenter(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
        }

    @unittest.skip('skip')
    def test_call(self):
        resp = set_message_center()
        self.assertEqual(self.valid_response, resp)
