import unittest

from vodem.api import reset_data_counter_ex


class TestResetDataCounterEx(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'result': 'success',
        }

    def test_call(self):
        resp = reset_data_counter_ex()
        self.assertEqual(self.valid_response, resp)
