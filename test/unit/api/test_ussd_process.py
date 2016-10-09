import unittest

from vodem.api import ussd_process


class TestUssdProcess(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'result': 'success',
        }

    def test_call(self):
        resp = ussd_process({'USSD_send_number': '*'})
        self.assertEqual(self.valid_response, resp)
