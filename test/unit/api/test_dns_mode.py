import unittest

from vodem.api import dns_mode


class TestDnsMode(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'dns_mode': 'auto',
        }

    def test_call(self):
        resp = dns_mode()
        self.assertEqual(self.valid_response, resp)
