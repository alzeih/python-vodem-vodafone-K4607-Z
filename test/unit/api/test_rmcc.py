import unittest

from vodem.api import rmcc


class TestRmcc(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'rmcc': '',
        }

    def test_call(self):
        resp = rmcc()
        self.assertEqual(self.valid_response, resp)
