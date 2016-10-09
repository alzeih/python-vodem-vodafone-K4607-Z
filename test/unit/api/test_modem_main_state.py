import unittest

from vodem.api import modem_main_state


class TestModemMainState(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'modem_main_state': 'modem_sim_undetected',
        }

    def test_call(self):
        resp = modem_main_state()
        self.assertEqual(self.valid_response, resp)
