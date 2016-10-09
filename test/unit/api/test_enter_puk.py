import unittest

from vodem.api import enter_puk


class TestEnterPuk(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
        }

    @unittest.skip('skip')
    def test_call(self):
        resp = enter_puk()
        self.assertEqual(self.valid_response, resp)
