import unittest

from vodem.api import get_sim_status


class TestGetSimStatus(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'modem_main_state': 'modem_sim_undetected',
        }

    def test_call(self):
        resp = get_sim_status()
        self.assertEqual(self.valid_response, resp)
