import unittest

from vodem.api import locked_hplmns


class TestLockedHplmns(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'locked_hplmns': '',
        }

    def test_call(self):
        resp = locked_hplmns()
        self.assertEqual(self.valid_response, resp)
