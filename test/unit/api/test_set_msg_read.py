import unittest

from vodem.api import set_msg_read


class TestSetMsgRead(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
        }

    @unittest.skip('skip')
    def test_call(self):
        resp = set_msg_read()
        self.assertEqual(self.valid_response, resp)
