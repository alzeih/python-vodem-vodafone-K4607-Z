import unittest

from vodem.api import net_select


class TestNetSelect(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'net_select': 'WCDMA_preferred',
        }

    def test_call(self):
        resp = net_select()
        self.assertEqual(self.valid_response, resp)
