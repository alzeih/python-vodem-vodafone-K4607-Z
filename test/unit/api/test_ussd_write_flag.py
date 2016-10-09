import unittest

from vodem.api import ussd_write_flag


class TestUssdWriteFlag(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'ussd_write_flag': '15',
        }

    def test_call(self):
        resp = ussd_write_flag()
        self.assertEqual(self.valid_response, resp)
