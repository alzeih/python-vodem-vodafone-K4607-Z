import unittest

from vodem.api import modem_msn


class TestModemMsn(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'modem_msn': '',
        }

    def test_call(self):
        resp = modem_msn()
        resp['modem_msn'] = ''
        self.assertEqual(self.valid_response, resp)
