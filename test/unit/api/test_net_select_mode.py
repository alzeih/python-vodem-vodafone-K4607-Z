import unittest

from vodem.api import net_select_mode


class TestNetSelectMode(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'net_select_mode': 'auto_select',
        }

    def test_call(self):
        resp = net_select_mode()
        self.assertEqual(self.valid_response, resp)
