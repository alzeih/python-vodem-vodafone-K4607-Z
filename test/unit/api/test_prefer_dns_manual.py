import unittest

from vodem.api import prefer_dns_manual


class TestPreferDnsManual(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'prefer_dns_manual': '',
        }

    def test_call(self):
        resp = prefer_dns_manual()
        self.assertEqual(self.valid_response, resp)
