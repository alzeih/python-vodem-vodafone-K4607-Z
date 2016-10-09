import unittest

from vodem.api import simcard_roam


class TestSimcardRoam(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'simcard_roam': '',
        }

    def test_call(self):
        resp = simcard_roam()
        self.assertEqual(self.valid_response, resp)
