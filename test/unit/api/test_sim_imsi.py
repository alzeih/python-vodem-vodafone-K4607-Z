import unittest

from vodem.api import sim_imsi


class TestSimImsi(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'sim_imsi': '',
        }

    def test_call(self):
        resp = sim_imsi()
        self.assertEqual(self.valid_response, resp)
