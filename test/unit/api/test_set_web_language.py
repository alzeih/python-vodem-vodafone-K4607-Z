import unittest

from vodem.api import set_web_language


class TestSetWebLanguage(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
        }

    @unittest.skip('skip')
    def test_call(self):
        resp = set_web_language()
        self.assertEqual(self.valid_response, resp)
