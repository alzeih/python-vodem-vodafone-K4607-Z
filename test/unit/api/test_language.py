import unittest

from vodem.api import language


class TestLanguage(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'Language': 'en-gb',
        }

    def test_call(self):
        resp = language()
        self.assertEqual(self.valid_response, resp)
