import unittest

from vodem.api import sim_iccid


class TestSimIccid(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'sim_iccid': '',
        }

    def test_call(self):
        resp = sim_iccid()
        self.assertEqual(self.valid_response, resp)
