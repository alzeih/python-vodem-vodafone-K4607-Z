import unittest

from vodem.api import sim_active_result


class TestSimActiveResult(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'sim_active_result': '',
        }

    def test_call(self):
        resp = sim_active_result()
        self.assertEqual(self.valid_response, resp)
