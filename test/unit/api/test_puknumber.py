import unittest

from vodem.api import puknumber


class TestPuknumber(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'puknumber': '',
        }

    def test_call(self):
        resp = puknumber()
        self.assertEqual(self.valid_response, resp)
